import { exists } from 'https://deno.land/std@0.79.0/fs/exists.ts';
import parse from 'https://github.com/nekobato/deno-xml-parser/raw/master/index.ts';
import merge from 'https://unpkg.com/lodash-es@4.17.15/merge.js';

import { ENV_OBJECT, SETTINGS } from '../util.ts';

export function mix(document: any, config: SETTINGS, env: ENV_OBJECT): SETTINGS {
  const sonarConfig = {
    projectVersion: document?.root?.children?.find((ele: any) => ele.name === 'version')?.content,
    projectDescription: document?.root?.children?.find((ele: any) => ele.name === 'description')?.content,
    sources: ['src/main/java', 'pom.xml'],
    java: {
      binaries: 'target/classes',
      source: env.PLUGIN_JAVA_SOURCE || '8',
    },
    modules: [],
  };

  if (document?.root?.children?.find((ele: any) => ele.name === 'modules')) {
    sonarConfig.modules = document?.root?.children
      ?.find((ele: any) => ele.name === 'modules')
      ?.children?.map((ele: any) => ele.content);
  }

  return merge({}, sonarConfig, config);
}

async function process(config: SETTINGS, env: ENV_OBJECT) {
  const isExist = await exists('pom.xml');

  if (!isExist) {
    return config;
  }

  const document = await Deno.readTextFile('pom.xml').then(parse);

  return mix(document, config, env);
}

export default { process };
