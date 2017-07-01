#!/bin/sh

IMAGE_PATH=$1
CONTAINER_NAME="works-api"

docker container rm -f $CONTAINER_NAME
docker load -i $IMAGE_PATH
docker run --name $CONTAINER_NAME --detach --link=works-db -p 13001:8081 -it artane/$CONTAINER_NAME
