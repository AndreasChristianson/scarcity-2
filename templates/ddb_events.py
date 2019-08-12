from troposphere import Output, Parameter, Ref, Template, Join, GetAtt
from troposphere.serverless import Function, S3Location, DynamoDBEvent
from troposphere.apigatewayv2 import Integration, Route, Deployment, Stage
from troposphere.awslambda import LayerVersion, Permission, Content
from troposphere.apigateway import BasePathMapping
from awacs.aws import Allow, Statement, Principal, PolicyDocument
from awacs.execute_api import ManageConnections

import constants
import api
import tables
import layer

import sys

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
        Policies=[
            "AWSLambdaDynamoDBExecutionRole",
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
        ],
        Events={
            "ConnectionChange": DynamoDBEvent(
                "ConnectionChange",
                Stream=GetAtt(getattr(tables, functionInfo["table"]), "StreamArn"),
                StartingPosition="TRIM_HORIZON"
            )
        }
    )
    
    return {
        "name": functionInfo["name"],
        "lambda": l,
    }

lambdaDefinitions = [
    {
        "name": "ConnectionsChangeHandler",
        "table": "ConnectionsTable",
        "handler": "connectionsChangeHandler",
    },
    {
        "name": "FloorObjectsChangeHandler",
        "table": "FloorObjectsTable",
        "handler": "floorObjectsChangeHandler",
    },
]

lambdas = list(map(createLambda, lambdaDefinitions))

def addResources(t): 

    for lambdaInfo in lambdas:
        t.add_resource(lambdaInfo["lambda"])

        t.add_output(Output(
            "Lambda" + lambdaInfo["name"],
            Value=Ref(lambdaInfo["lambda"])
        ))
