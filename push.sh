#!/usr/bin/env sh

set -e -o xtrace

npm --prefix echo install
npm --prefix echo run build
rm -rf echo/node_modules
npm --prefix echo install --production
cd echo/dist
zip -r -X app.zip .
cd -
cd echo
zip -rqX dist/app.zip node_modules
cd -
digest=$(openssl dgst -r echo/dist/app.zip)
aws s3 cp echo/dist/app.zip s3://scarcity-artifacts/echo-$(git rev-parse --short HEAD).zip

cloudformation/deploy.sh $1
