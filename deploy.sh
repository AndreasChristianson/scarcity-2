#!/usr/bin/env sh

set -e -o xtrace

aws cloudformation validate-template \
    --template-body file://template.yaml

aws cloudformation deploy \
    --template-file template.yaml \
    --stack-name scarcity-$1 \
    --capabilities CAPABILITY_IAM \
    --parameter-overrides \
    "GitShaParameter=$(git rev-parse --short HEAD)" \
    "LayerVersionParameter=${layer_version}" \
    "EnvParameter=$1" \
    --tags \
    env=$1 \
    project=scarcity

aws cloudformation describe-stacks \
    --stack-name scarcity-$1
