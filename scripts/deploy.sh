#!/bin/bash

docker build --build-arg SCANNER_VERSION=$SCANNER_VERSION . -t knives/drone-sonarqube-scanner

curl -H "Content-Type: application/json" \
  --data '{"source_type": "Branch", "source_name":"master"}' \
  -X POST https://cloud.docker.com/api/build/v1/source/$DOCKER_USER_TOKEN/trigger/$DOCKER_HOOK_TOKEN/call/
