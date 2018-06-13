const fs = require('fs');
const { parseString } = require('xml2js');
const { toPromise } = require('./util');
const has = require('lodash.has');
const get = require('lodash.get');

const readFile = toPromise(fs.readFile);
const parseXML = toPromise(parseString);
const whenTimeout = ms => new Promise((resolve, reject) => setTimeout(reject, ms));

async function buildMavenConfig(defaultConfig) {
  const content = await readFile('pom.xml');
  const xmlObj = await parseXML(content);

  const sonarConfig = {
    'sonar.sources': ['src/main/java', 'pom.xml'],
    'sonar.language': ['java', 'xml'],
    'sonar.java.binaries': 'target/classes',
  };

  if (has(xmlObj, 'project.modules')) {
    sonarConfig['sonar.modules'] = get(xmlObj, 'project.modules').map(ele => ele.module);
  }

  const manages = get(xmlObj, 'project.build.pluginManagement.plugins', []).map(ele => ele.plugin);
  const plugins = get(xmlObj, 'project.build.plugins', [])
    .map(ele => ele.plugin)
    .map(plugin =>
      Object.assign(
        {},
        manages.find(ele => ele.groupId === plugin.groupId && ele.artifactId === plugin.artifactId),
        plugin
      )
    )
    .forEach(plugin => {
      switch (plugin.artifactId) {
        case 'maven-compiler-plugin':
          sonarConfig['sonar.java.source'] = plugin.configuration.target;
          sonarConfig['sonar.sourceEncoding'] = plugin.configuration.encoding;
          break;
        default:
        //do nothing
      }
    });

  return Object.assign({}, sonarConfig, defaultConfig);
}

module.exports = {
  readFile,
  parseXML,
  buildMavenConfig,
};
