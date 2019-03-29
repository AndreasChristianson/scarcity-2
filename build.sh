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


packageFunction() {
    if [ ! -d "${1}" ]; then
        return
    fi
    npm --prefix $1 install
    npm --prefix $1 run build
    cd ${1}dist;
    zip -rX app.zip .
    cd -
    rm -rf ${1}node_modules
    npm --prefix $1 install --production
    if [ -d "${1}node_modules" ]; then
        cd $1
        zip -rqX dist/app.zip node_modules
        cd -
    fi 
    aws s3 cp ${1}dist/app.zip s3://scarcity-artifacts/${git_sha}/${1}app.zip
}

cd packages

for D in wss/*/; 
do 
    packageFunction $D
done

for D in rest/*/; 
do 
    packageFunction $D
done

cd ..


