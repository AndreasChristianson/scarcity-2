#!/usr/bin/env bash

set -e -o xtrace

test(){
    npm --prefix $1 install
    npm --prefix $1 run test
}

test site/
test lambdas/
