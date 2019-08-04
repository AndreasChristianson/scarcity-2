from troposphere import Ref, Template, Output, Parameter, GetAtt, Join

from troposphere.apigatewayv2 import Deployment
import constants

import cloudfront
import tables
import lambdas
import api


t = Template()


t.set_transform('AWS::Serverless-2016-10-31')


api.addResources(t)

cloudfront.addResources(t)
tables.addTables(t)

lambdas.addResources(t)

t.add_output([
    Output(
        "WebSocketURI",
        Value="wss://" + constants.wssDomainName,
    )
])


print(t.to_json())