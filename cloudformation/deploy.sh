#!/usr/bin/env sh

set -e

aws cloudformation validate-template \
    --template-body file://template.yaml \
    --region us-west-2

aws cloudformation deploy \
    --template-file template.yaml \
    --stack-name scarcity-dev \
    --region us-west-2 \
    --parameter-overrides \
    GitShaParameter=123 \
    --tags \
    env=dev \
    project=scarcity
