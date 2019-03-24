#!/usr/bin/env sh

set -e -o xtrace

rm -rf nodejs/node_modules
npm --prefix nodejs install --production
zip -rqX nodejs/node_modules/layer.zip nodejs/node_modules
layer_version=$(npm --prefix nodejs --silent run get-version)
aws s3 cp nodejs/node_modules/layer.zip s3://scarcity-artifacts/layer/${layer_version}.zip

for D in functions/*/; 
do 
    npm --prefix echo run test; 
done

npm --prefix echo install
npm --prefix echo run build
rm -rf echo/node_modules
npm --prefix echo install --production
cd echo/dist
zip -r -X app.zip .
cd -
# cd echo
# zip -rqX dist/app.zip node_modules
# cd -
aws s3 cp echo/dist/app.zip s3://scarcity-artifacts/echo/$(git rev-parse --short HEAD).zip
