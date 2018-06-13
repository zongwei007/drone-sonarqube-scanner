const fs = require('fs-extra');
const { env } = require('process');
const { parseString } = require('xml2js');
const { toPromise } = require('./util');
const has = require('lodash.has');
const get = require('lodash.get');

const parseXML = toPromise(parseString);
const whenTimeout = ms => new Promise((resolve, reject) => setTimeout(reject, ms));

async function buildMavenConfig(defaultConfig) {
  const content = await fs.readFile('pom.xml');
  const xmlObj = await parseXML(content);

  const sonarConfig = {
    'sonar.projectVersion': get(xmlObj, 'project.version').join(','),
    'sonar.projectDescription': get(xmlObj, 'project.description').join(','),
    'sonar.sources': ['src/main/java', 'pom.xml'],
    'sonar.java.binaries': 'target/classes',
    'sonar.java.source': env['PLUGIN_JAVA_SOURCE'] || '8',
  };

  if (has(xmlObj, 'project.modules')) {
    sonarConfig['sonar.modules'] = get(xmlObj, 'project.modules').map(ele => ele.module);
  }

  return Object.assign({}, sonarConfig, defaultConfig);
}

module.exports = {
  parseXML,
  buildMavenConfig,
};
