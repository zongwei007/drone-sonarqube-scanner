FROM mhart/alpine-node:8

COPY ./src /plugin
COPY ./package.json /plugin/package.json

WORKDIR /plugin

RUN npm install --production

ENTRYPOINT node /plugin/index.js
