#!/usr/bin/env bash

set -e -o xtrace

test(){
    npm --prefix $1 install
    npm --prefix $1 run test
}

for D in packages/*/*/; 
do 
    test $D
done

test site/
