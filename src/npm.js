const uniq = require('lodash.uniq');
const generator = require('sonarqube-scanner/dist/sonarqube-scanner-params');

const EXCLUSIONS = 'sonar.exclusions';

async function buildNpmConfig(defaultConfig) {
  const sonarConfig = generator({}, process.cwd(), {});

  return Object.assign({}, sonarConfig, defaultConfig, {
    [EXCLUSIONS]: uniq((sonarConfig[EXCLUSIONS] || '').split(',').concat(defaultConfig[EXCLUSIONS] || [])),
  });
}

module.exports = {
  buildNpmConfig,
};
