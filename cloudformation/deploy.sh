#!/usr/bin/env sh

cd "${0%/*}"

set -e

aws cloudformation validate-template \
    --template-body file://template.yaml \
    --region us-west-2

aws cloudformation deploy \
    --template-file template.yaml \
    --stack-name scarcity-dev \
    --region us-west-2 \
    --parameter-overrides \
    GitShaParameter=$(git rev-parse --short HEAD) \
    --tags \
    env=$1 \
    project=scarcity
