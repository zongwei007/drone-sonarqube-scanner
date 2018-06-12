#!/bin/bash

echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
docker build . -t knives/drone-sonarqube-setting
docker push knives/drone-sonarqube-setting
