#!/usr/bin/env sh

cd "${0%/*}"

set -e -o xtrace

aws cloudformation validate-template \
    --template-body file://template.yaml \

aws cloudformation deploy \
    --template-file template.yaml \
    --stack-name scarcity-$1 \
    --capabilities CAPABILITY_IAM \
    --parameter-overrides \
    "GitShaParameter=$(git rev-parse --short HEAD)" \
    --tags \
    env=$1 \
    project=scarcity
