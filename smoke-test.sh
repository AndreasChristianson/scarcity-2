#!/usr/bin/env bash

set -e

env=$1
getOutput () {
    aws cloudformation describe-stacks  --stack-name scarcity-$env | jq --raw-output ".Stacks[0].Outputs[] | select(.OutputKey == \"$1\") | .OutputValue"
}

uuid=$(uuidgen)
url=$(getOutput WebSocketURI)
response=$(wscat --execute "{\"action\":\"echo\",\"echo\":\"$uuid\"}" -w 10 --connect $url)
if [[ ! $response =~ $uuid ]]; then 
    exit 1; 
fi

# url=$(getOutput WebSocketDomain)
# response=$(wscat --execute "{\"action\":\"echo\",\"echo\":\"$uuid\"}" -w 10 --connect $url)
# if [[ ! $response =~ $uuid ]]; then 
#     exit 1; 
# fi

url=$(getOutput StaticSite)
response=$(curl -L $url)
if [[ ! $response =~ "<title>Scarcity</title>" ]]; then 
    exit 1; 
fi
