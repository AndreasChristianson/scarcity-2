from troposphere import Ref, Template, Output, Parameter, GetAtt, Join

from troposphere.apigatewayv2 import Deployment
import constants

import cloudfront
import tables
import web_sockets
import api
import ddb_events
import layer


t = Template()


t.set_transform('AWS::Serverless-2016-10-31')


api.addResources(t)
cloudfront.addResources(t)
tables.addTables(t)
web_sockets.addResources(t)
ddb_events.addResources(t)
layer.addResources(t)

t.add_output([
    Output(
        "WebSocketURI",
        Value="wss://" + constants.wssDomainName,
    )
])


print(t.to_json())