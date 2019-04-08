#!/usr/bin/env bash

set -e -x

env=$1

layer_version=$(npm --prefix nodejs --silent run get-version)
git_sha=$(git rev-parse --short HEAD)

aws cloudformation validate-template \
    --template-body file://template.yaml

aws cloudformation deploy \
    --template-file template.yaml \
    --stack-name scarcity-$env \
    --capabilities CAPABILITY_IAM CAPABILITY_AUTO_EXPAND \
    --parameter-overrides \
    "GitShaParameter=$git_sha" \
    "LayerVersionParameter=$layer_version" \
    "EnvParameter=$env" \
    --tags \
    env=$env \
    project=scarcity \
    --no-fail-on-empty-changeset &

pid=$!

sleep 5

set +x
spin='-\|/'
i=0
while kill -0 $pid 2>/dev/null
do
  i=$(( (i+1) %4 ))
  printf "\r${spin:$i:1}"
  sleep .1
done
set -x
wait "${pid}"

getOutput () {
    aws cloudformation describe-stacks  --stack-name scarcity-$env | jq --raw-output ".Stacks[0].Outputs[] | select(.OutputKey == \"$1\") | .OutputValue"
}

aws s3 sync s3://scarcity-artifacts/${git_sha}/site/ s3://scarcity-site-$env/ --delete

aws apigatewayv2 create-deployment \
    --api-id $(getOutput WssApiId) \
    --stage-name $env \
    --description ${git_sha}
