from troposphere import Ref, Template, Output, Parameter, GetAtt, Join

from troposphere.apigatewayv2 import Api

from troposphere.route53 import RecordSetType, AliasTarget

import constants


WssApi = Api(
    "WssApi",
    Name="scarcity-" + constants.env,
    ProtocolType="WEBSOCKET",
    RouteSelectionExpression="$request.body.action",
)

DnsRecord = RecordSetType(
    "DnsRecord",
    Type="A",
    Name=constants.wssDomainName,
    HostedZoneName=constants.hostedZoneName,
    AliasTarget=AliasTarget(
        DNSName=constants.wssDomain[constants.env],
        HostedZoneId=constants.regionId
    )
)

def addResources(t):
    t.add_resource(WssApi)
    t.add_resource(DnsRecord)

    t.add_output([
        Output(
            "WssApiId",
            Value=Ref(WssApi),
        ),
    ])
