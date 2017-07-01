#!/bin/sh

# Shell script to generate a docker image

PROJECT_NAME="works-api"

docker build -t artane/$PROJECT_NAME .
TIMESTAMP=`date +%s`
FILE_NAME="$PROJECT_NAME-`echo "obase=16; $TIMESTAMP" | bc`"
rm -rf build
mkdir build
docker save artane/$PROJECT_NAME:latest > "build/$FILE_NAME"
