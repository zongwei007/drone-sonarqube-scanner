const { parseString } = require('xml2js');
const get = require('lodash.get');
const has = require('lodash.has');
const merge = require('lodash.merge');
const { exists, promisify, readFile } = require('../util');

const parseXML = promisify(parseString);

async function builder(config, env) {
  const isExist = await exists('pom.xml');

  if (!isExist) {
    return config;
  }

  const content = await readFile('pom.xml');
  const xmlObj = await parseXML(content);

  const sonarConfig = {
    projectVersion: get(xmlObj, 'project.version').join(','),
    projectDescription: get(xmlObj, 'project.description').join(','),
    sources: ['src/main/java', 'pom.xml'],
    java: {
      binaries: 'target/classes',
      source: env['PLUGIN_JAVA_SOURCE'] || '8',
    },
  };

  if (has(xmlObj, 'project.modules')) {
    sonarConfig.modules = get(xmlObj, 'project.modules[0].module');
  }

  return merge({}, sonarConfig, config);
}

module.exports = { process: builder };
