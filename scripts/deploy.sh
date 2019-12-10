#!/bin/bash
curl -X POST https://cloud.docker.com/api/build/v1/source/$DOCKER_USER_TOKEN/trigger/$DOCKER_HOOK_TOKEN/call/
