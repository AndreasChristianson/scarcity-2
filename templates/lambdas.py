from troposphere import Output, Parameter, Ref, Template, Join
from troposphere.serverless import Function, S3Location
from troposphere.apigatewayv2 import Integration, Route, Deployment, Stage
from troposphere.awslambda import LayerVersion, Permission, Content
from troposphere.apigateway import BasePathMapping

import constants
import api
import tables

import sys

layer = LayerVersion(
    "SharedLayer",
    Content=Content(
        S3Bucket=constants.bucketName,
        S3Key="layer/{0}.zip".format(constants.layer)
    )
)

def createLambda(functionInfo):
    l = Function(
        "Function" + functionInfo["name"],
        FunctionName=functionInfo["name"],
        Handler="index." + functionInfo["handler"],
        Runtime="nodejs8.10",
        AutoPublishAlias="live",
        CodeUri=S3Location(
            Bucket=constants.bucketName,
            Key=constants.sha + "/lambdas/app.zip"
        ),
        Layers=[
            Ref(layer)
        ],
        Policies=[
            "AmazonDynamoDBReadOnlyAccess"
        ]
        # todo allow manage connections
    )

    permission = Permission(
        "Permission" + functionInfo["name"],
        FunctionName=Ref(l),
        Action="lambda:InvokeFunction",
        Principal="apigateway.amazonaws.com"
    )

    integration = Integration(
        "Integration" + functionInfo["name"],
        ApiId=Ref(api.WssApi),
        IntegrationType="AWS_PROXY",
        IntegrationUri=Join("", [
            "arn", 
            Ref("AWS::Partition"), 
            ":apigateway:",
            Ref("AWS::Region"),
            ":lambda:path/2015-03-31/functions/",
            Ref(l),
            "/invocations"
        ])
    )
    route = Route(
        "Route" + functionInfo["name"],
        ApiId=Ref(api.WssApi),
        RouteKey=functionInfo["routeKey"],
        Target=Join("/",["integrations", Ref(integration)])
    )

    return {
        "name": functionInfo["name"],
        "route": route,
        "integration": integration,
        "lambda": l,
        "permission": permission
    }

lambdaDefinitions = [
    {
        "name": "Echo",
        "routeKey": "echo",
        "handler": "echo",
    },
    {
        "name": "Logger",
        "routeKey": "$default",
        "handler": "logger",
    },
    {
        "name": "Connect",
        "routeKey": "$connect",
        "handler": "connect",
    },
    {
        "name": "Disconnect",
        "routeKey": "$disconnect",
        "handler": "disconnect",
    },
]

lambdas = list(map(createLambda, lambdaDefinitions))
WssDeployment = Deployment(
    "WssDeployment",
    ApiId=Ref(api.WssApi),
    DependsOn=list(map(lambda x: x["lambda"].title, lambdas))
)

WssStage = Stage(
    "WssStage",
    StageName=constants.env,
    ApiId=Ref(api.WssApi),
    DeploymentId=Ref(WssDeployment),
)

DomainMapping = BasePathMapping(
    "DomainMapping",
    RestApiId=Ref(api.WssApi),
    Stage=Ref(WssStage),
    DomainName=constants.wssDomainName,
)

def addResources(t): 
    t.add_resource(WssDeployment)
    t.add_resource(WssStage)
    t.add_resource(DomainMapping)
    t.add_resource(layer)

    for lambdaInfo in lambdas:
        t.add_resource(lambdaInfo["lambda"])
        t.add_resource(lambdaInfo["integration"])
        t.add_resource(lambdaInfo["route"])
        t.add_resource(lambdaInfo["permission"])

        t.add_output(Output(
            "Lambda" + lambdaInfo["name"],
            Value=Ref(lambdaInfo["lambda"])
        ))
    t.add_output([
        Output(
            "WssStage",
            Value=Ref(WssStage)
        )
    ])
