#!/usr/bin/env bash

set -e -o xtrace

url=$(aws cloudformation describe-stacks  --stack-name scarcity-$1 | jq --raw-output '.Stacks[0].Outputs[] | select(.OutputKey == "WebSocketURI") | .OutputValue')
response=$(wscat --execute "{\"action\":\"echo\",\"echo\":\"$TRAVIS_JOB_NUMBER\"}" --connect $url -w 10)
if [[ ! $response =~ $TRAVIS_JOB_NUMBER ]]; then 
    exit 1; 
fi