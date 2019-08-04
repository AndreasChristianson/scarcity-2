from troposphere.cloudfront import Distribution, DistributionConfig, CustomOriginConfig, ViewerCertificate, Origin, DefaultCacheBehavior, ForwardedValues
from troposphere.route53 import RecordSetType, AliasTarget

from troposphere import GetAtt, Output

import constants

siteS3="scarcity-site-{0}.s3-website-{1}.amazonaws.com".format(constants.env, constants.region)

SiteCloudfront = Distribution(
    "SiteCloudfront",
    DistributionConfig=DistributionConfig(
        Origins=[Origin(
            Id="SiteOriginId", 
            DomainName=siteS3,
            CustomOriginConfig=CustomOriginConfig(
                OriginProtocolPolicy="http-only"
            )
        )],
        Enabled=True,
        Aliases=[
            constants.siteDomainName,
            "www." + constants.siteDomainName
        ],
        DefaultCacheBehavior=DefaultCacheBehavior(
            AllowedMethods=[
                "GET",
                "HEAD",
                "OPTIONS"
            ],
            TargetOriginId="SiteOriginId",
            Compress=True,
            ForwardedValues=ForwardedValues(
                QueryString=False
            ),
            ViewerProtocolPolicy="redirect-to-https"
        ),
        ViewerCertificate=ViewerCertificate(
            AcmCertificateArn=constants.certs["us-east-1"],
            SslSupportMethod="sni-only"
        #   MinimumProtocolVersion: TLSv1.1_2016
        ),
        HttpVersion='http2'
    )
)

SiteDns = RecordSetType(
    "SiteDns",
    Type="A",
    Name=constants.siteDomainName,
    HostedZoneName=constants.hostedZoneName,
    AliasTarget=AliasTarget(
        DNSName=GetAtt(SiteCloudfront, "DomainName"),
        HostedZoneId="Z2FDTNDATAQYW2"
    )
)

WwwSiteDns = RecordSetType(
    "WwwSiteDns",
    Type="A",
    Name="www." + constants.siteDomainName,
    HostedZoneName=constants.hostedZoneName,
    AliasTarget=AliasTarget(
        DNSName=GetAtt(SiteCloudfront, "DomainName"),
        HostedZoneId="Z2FDTNDATAQYW2"
    )
)

def addResources(t): 
    t.add_resource(SiteCloudfront)
    t.add_resource(SiteDns)
    t.add_resource(WwwSiteDns)
    t.add_output([
        Output(
            "StaticSite",
            Value=constants.siteDomainName,
        )
    ])
