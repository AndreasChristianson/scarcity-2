#!/usr/bin/env bash

set -e -o xtrace

layer_version=$(npm --prefix nodejs --silent run get-version)
git_sha=$(git rev-parse --short HEAD)

aws cloudformation validate-template \
    --template-body file://template.yaml

aws cloudformation deploy \
    --template-file template.yaml \
    --stack-name scarcity-$1 \
    --capabilities CAPABILITY_IAM \
    --parameter-overrides \
    "GitShaParameter=$git_sha" \
    "LayerVersionParameter=$layer_version" \
    "EnvParameter=$1" \
    --tags \
    env=$1 \
    project=scarcity \
    --no-fail-on-empty-changeset 
