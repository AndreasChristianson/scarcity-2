#!/usr/bin/env bash

set -e -o xtrace

layer_version=$(npm --prefix nodejs --silent run get-version)
git_sha=$(git rev-parse --short HEAD)

if [ $(aws s3api head-object --bucket scarcity-artifacts --key layer/$layer_version.zip | wc -c) -eq 0 ]; then
    rm -rf nodejs/node_modules
    npm --prefix nodejs install --production
    zip -rqX nodejs/node_modules/layer.zip nodejs/node_modules
    aws s3 cp nodejs/node_modules/layer.zip s3://scarcity-artifacts/layer/$layer_version.zip
fi

for D in packages/{wss,rest}/*/; 
do 
    npm --prefix $D install
    npm --prefix $D run build
    cd ${D}dist;
    zip -rX app.zip .
    cd -
    rm -rf ${D}node_modules
    npm --prefix $D install --production
    if [ -d "${D}node_modules" ]; then
        cd $D
        zip -rqX dist/app.zip node_modules
        cd -
    fi 
    aws s3 cp ${D}dist/app.zip s3://scarcity-artifacts/${git_sha}/${D}app.zip
done
