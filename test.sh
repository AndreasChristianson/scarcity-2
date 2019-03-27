#!/usr/bin/env bash

set -e -o xtrace

uuid=$(uuidgen)
url=$(aws cloudformation describe-stacks  --stack-name scarcity-$1 | jq --raw-output '.Stacks[0].Outputs[] | select(.OutputKey == "WebSocketURI") | .OutputValue')
response=$(wscat --execute "{\"action\":\"echo\",\"echo\":\"$uuid\"}" --connect $url -w 10)
if [[ ! $response =~ $uuid ]]; then 
    exit 1; 
fi