import merge from 'https://unpkg.com/lodash-es@4.17.15/merge.js';
import isObject from 'https://unpkg.com/lodash-es@4.17.15/isObject.js';

import { ENV_OBJECT, SETTINGS } from './util.ts';

const NOT_MATCHED_KEYS = new Set(['PLUGIN_WITH_BRANCH']);

export function buildDefaultConfig(env: ENV_OBJECT): SETTINGS {
  const repoFullName = env.DRONE_REPO || '';
  const branchName = env.DRONE_BRANCH || '';
  const withBranch = env.PLUGIN_WITH_BRANCH === 'true';

  const pluginConfig = Object.keys(env)
    .filter((key) => !NOT_MATCHED_KEYS.has(key))
    .filter((key) => key.startsWith('PLUGIN_'))
    .reduce((memo, key) => {
      const sonarKey = key.toLowerCase().replace('plugin_', '');
      const sonarVal = env[key];

      if (sonarVal.startsWith('[') || sonarVal.startsWith('{')) {
        memo[sonarKey] = JSON.parse(sonarVal);
      } else {
        const arrVal = sonarVal.split(',');
        memo[sonarKey] = arrVal.length > 1 ? arrVal : arrVal[0];
      }

      return memo;
    }, {} as SETTINGS);

  return merge(
    {
      // 仅允许字母、数字、-、_、.、以及 :，不能为纯数字
      projectKey: (withBranch ? repoFullName : `${repoFullName}:${branchName}`)
        .replace(/\//g, ':')
        .replace(/[^\w-_:\.]/g, ''),
      projectName: `${repoFullName}${branchName === 'master' ? '' : `:${branchName}`}`,
    },
    withBranch ? { branch: { name: branchName } } : {},
    pluginConfig
  );
}

export function serializeConfig(config: any): any {
  if (Array.isArray(config)) {
    return config.join(',');
  }

  if (isObject(config)) {
    return Object.keys(config)
      .map((key) => `sonar.${key}=${serializeConfig(config[key])}`)
      .join('\n');
  }

  return config;
}
