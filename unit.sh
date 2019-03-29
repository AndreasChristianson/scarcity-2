#!/usr/bin/env bash

set -e -o xtrace

for D in packages/*/*/; 
do 
    npm --prefix $D install
    npm --prefix $D run test
done
