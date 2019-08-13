from troposphere import Output, Parameter, Ref, Template, Join, GetAtt
from troposphere.serverless import Function, S3Location
from troposphere.apigatewayv2 import Integration, Route, Deployment, Stage
from troposphere.awslambda import LayerVersion, Permission, Content, Environment
from troposphere.apigateway import BasePathMapping
from awacs.aws import Allow, Statement, Principal, PolicyDocument
from awacs.execute_api import ManageConnections

import constants
import api
import tables
import layer

import sys

WssDeployment = Deployment(
    "WssDeployment",
    ApiId=Ref(api.WssApi),
)

WssStage = Stage(
    "WssStage",
    StageName=constants.env,
    ApiId=Ref(api.WssApi),
    DeploymentId=Ref(WssDeployment),
)

def createLambda(functionInfo):
    l = Function(
        "Function" + functionInfo["name"],
        FunctionName=functionInfo["name"],
        Handler="index." + functionInfo["handler"],
        Runtime="nodejs10.x",
        AutoPublishAlias="live",
        CodeUri=S3Location(
            Bucket=constants.bucketName,
            Key=constants.sha + "/lambdas/app.zip"
        ),
        Layers=[
            Ref(layer.layer)
        ],
        Environment=Environment(
            Variables={
                'API_ID': Ref(api.WssApi),
                'STAGE': Ref(WssStage)
            },
        ),
        Policies=[
            "AmazonDynamoDBFullAccess",
            PolicyDocument(
                Statement=[
                    Statement(
                        Effect=Allow,
                        Action=[ManageConnections],
                        Resource=[
                            Join("", [
                                "arn:", 
                                Ref("AWS::Partition"), 
                                ":execute-api:",
                                Ref("AWS::Region"),
                                ":",
                                Ref("AWS::AccountId"),
                                ":",
                                Ref(api.WssApi),
                                "/*"
                            ])
                        ]
                    )
                ]
            )
        ]
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
            "arn:", 
            Ref("AWS::Partition"), 
            ":apigateway:",
            Ref("AWS::Region"),
            ":lambda:path/2015-03-31/functions/",
            GetAtt(l, "Arn"),
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

WssDeployment.DependsOn=list(map(lambda x: x["lambda"].title, lambdas))

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
