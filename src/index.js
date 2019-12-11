const merge = require('lodash.merge');

const { buildDefaultConfig, serializeConfig } = require('./config');
const { flattenMap, writeFile } = require('./util');
const processors = require('./processor');

const { env } = process;

const defaultConfig = buildDefaultConfig(env);

(async () => {
  const config = { ...defaultConfig };

  for (let processor of processors) {
    const result = await processor.process(config, env);

    merge(config, result);
  }

  const properties = serializeConfig(flattenMap(config));

  console.log('sonar project config:', '\n');
  console.log(properties, '\n');

  await writeFile('sonar-project.properties', properties);
})();
