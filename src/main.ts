import merge from 'https://raw.githubusercontent.com/lodash/lodash/master/merge.js';

import { buildDefaultConfig, serializeConfig } from './config.ts';
import { flattenMap } from './util.ts';
import processors  from './processor/mod.ts';

const env = Deno.env.toObject();
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

  await Deno.writeTextFile('sonar-project.properties', properties);
})();
