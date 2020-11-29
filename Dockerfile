FROM hayd/alpine-deno:1.5.4

WORKDIR /plugin
ARG SCANNER_VERSION

RUN apk add --no-cache --update curl git openjdk8-jre nodejs

ENV JAVA_HOME=/usr/lib/jvm/java-1.8-openjdk/jre
ENV PATH=$JAVA_HOME/bin:/usr/lib/jvm/java-1.8-openjdk/bin:$PATH

RUN curl --insecure -OL "https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-$SCANNER_VERSION.zip" && \
  unzip sonar-scanner-cli-$SCANNER_VERSION.zip && \
  rm sonar-scanner-cli-$SCANNER_VERSION.zip && \
  mv sonar-scanner-* /opt/sonar-scanner && \
  deno install --allow-env --allow-read --allow-write --name=drone-sonarqube-setting "https://github.com/zongwei007/drone-sonarqube-scanner/raw/master/src/main.ts"

ENV SONAR_RUNNER_HOME=/opt/sonar-scanner
ENV PATH=${SONAR_RUNNER_HOME}/bin:$PATH

COPY ./scripts/startup.sh /

ENTRYPOINT ["sh","/startup.sh"]
