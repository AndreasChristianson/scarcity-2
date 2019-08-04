import argparse

_parser = argparse.ArgumentParser(description='Generate the cloudformation template')
_parser.add_argument('--env', choices=['dev','prod'], required=True, help="the environment to build the template for")
_parser.add_argument('--sha', required=True, help="the git sha for the build")
_parser.add_argument('--layer', required=True, help="the layer version for the build")
_args = _parser.parse_args()
sha = _args.sha
env = _args.env
layer = _args.layer
bucketName = "scarcity-artifacts"
tld = "pessimistic-it.com"
hostedZoneName = tld + "."
siteDomainName = "{0}.scarcity.{1}".format(env, tld)
wssDomainName = "wss." + siteDomainName

certs = {
    "us-east-1": "arn:aws:acm:us-east-1:470576235824:certificate/dd347eb4-7688-45a2-8dbf-f09226e2f57a",
    "us-west-2": "arn:aws:acm:us-west-2:470576235824:certificate/81cf3c30-327d-445b-993e-79006fd8b3de"
}

region = "us-west-2"

wssDomain = {
    "dev": "d-c41e15ymx5.execute-api.us-west-2.amazonaws.com" # configured manually
}

regionId = "Z2OJLYMUO9EFXC"