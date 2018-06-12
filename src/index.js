const fs = require('fs');
const process = require('process');
const isObject = require('lodash.isobject');
const { buildNpmConfig } = require('./npm');
const { buildMavenConfig } = require('./maven');

function buildDefaultConfig() {
  const repoFullName = process.env['DRONE_REPO'];
  const ignoreBranch = !!process.env['PLUGIN_IGNORE_BRANCH'];

  return {
    'sonar.projectKey': ignoreBranch ? repoFullName : `${repoFullName}:${process.env['DRONE_BRANCH']}`,
    'sonar.projectName': repoFullName,
    'sonar.host.url': process.env['PLUGIN_HOST_URL'],
    'sonar.login': process.env['SONAR_TOKEN'],
    'sonar.exclusions': (process.env['PLUGIN_EXCLUSIONS'] || '').split(','),
  };
}

function serializeConfig(config) {
  if (Array.isArray(config)) {
    return config.join(',');
  } else if (isObject(config)) {
    return Object.keys(config)
      .map(key => `${key}=${serializeConfig(config[key])}`)
      .join('\n');
  } else {
    return config;
  }
}

module.exports = {
  buildDefaultConfig,
  serializeConfig,
};

const defaultConfig = buildDefaultConfig();

let config;
if (fs.existsSync('package.json')) {
  config = buildNpmConfig(defaultConfig);
} else if (fs.existsSync('pom.xml')) {
  config = buildMavenConfig(defaultConfig);
} else {
  throw new Error('Can not decide project type.');
}

fs.writeFileSync('sonar-project.properties', serializeConfig(config));
