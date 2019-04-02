#!/usr/bin/env bash

set -e -x

layer_version=$(npm --prefix nodejs --silent run get-version)
git_sha=$(git rev-parse --short HEAD)

aws cloudformation validate-template \
    --template-body file://template.yaml

aws cloudformation deploy \
    --template-file template.yaml \
    --stack-name scarcity-$1 \
    --capabilities CAPABILITY_IAM CAPABILITY_AUTO_EXPAND \
    --parameter-overrides \
    "GitShaParameter=$git_sha" \
    "LayerVersionParameter=$layer_version" \
    "EnvParameter=$1" \
    --tags \
    env=$1 \
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

aws s3 sync s3://scarcity-artifacts/${git_sha}/site/ s3://scarcity-site/ --delete
