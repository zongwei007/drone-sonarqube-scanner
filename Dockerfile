FROM node:11-alpine

WORKDIR /plugin
ARG SCANNER_VERSION

RUN apk add --no-cache --update curl git openjdk8-jre

ENV JAVA_HOME=/usr/lib/jvm/java-1.8-openjdk/jre
ENV PATH=$PATH:$JAVA_HOME/bin:/usr/lib/jvm/java-1.8-openjdk/bin

RUN curl --insecure -OL https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-$SCANNER_VERSION.zip && \
  unzip sonar-scanner-cli-$SCANNER_VERSION.zip && \
  rm sonar-scanner-cli-$SCANNER_VERSION.zip && \
  mv sonar-scanner-* /opt/sonar-scanner

ENV SONAR_RUNNER_HOME=/opt/sonar-scanner
ENV PATH=$PATH:${SONAR_RUNNER_HOME}/bin

COPY ./src /plugin
COPY ./package.json ./
COPY ./scripts/startup.sh /

RUN npm install --production

ENTRYPOINT ["sh","/startup.sh"]
