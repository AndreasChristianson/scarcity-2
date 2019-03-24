#!/usr/bin/env sh

set -e -o xtrace

for D in functions/*/; 
do 
    npm --prefix $D install
    npm --prefix $D run test
    npm --prefix $D run build
done
