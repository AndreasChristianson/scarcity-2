from troposphere import Output, Parameter, Ref, Template, Join, GetAtt
from troposphere.serverless import Function, S3Location
from troposphere.apigatewayv2 import Integration, Route, Deployment, Stage
from troposphere.awslambda import LayerVersion, Permission, Content
from troposphere.apigateway import BasePathMapping
from awacs.aws import Allow, Statement, Principal, PolicyDocument
from awacs.execute_api import ManageConnections

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

def addResources(t): 
    t.add_resource(layer)
