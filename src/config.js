const merge = require('lodash.merge');
const isObject = require('lodash.isobject');
// noinspection SpellCheckingInspection
const slugify = require('slugify');

const NOT_MATCHED_KEYS = ['PLUGIN_WITH_BRANCH'];
const invalidCharacterRegex = /[?$*+~.()'"!@/]/g;

function buildDefaultConfig(env) {
  const repoFullName = env['DRONE_REPO'] || '';
  const branchName = env['DRONE_BRANCH'] || '';
  const withBranch = !!env['PLUGIN_WITH_BRANCH'];

  const pluginConfig = Object.keys(env)
    .filter(key => !NOT_MATCHED_KEYS.includes(key))
    .filter(key => key.startsWith('PLUGIN_'))
    .reduce((memo, key) => {
      const sonarKey = key.toLowerCase().replace('plugin_', '');

      let sonarVal = env[key];
      if (sonarVal.startsWith('[') || sonarVal.startsWith('{')) {
        sonarVal = JSON.parse(sonarVal);
      } else {
        const valArray = sonarVal.split(',');
        sonarVal = valArray.length > 1 ? valArray : valArray[0];
      }

      memo[sonarKey] = sonarVal;

      return memo;
    }, {});

  return merge(
    {
      projectKey: slugify((withBranch ? repoFullName : `${repoFullName}:${branchName}`).replace(/\//g, ':'), {
        remove: invalidCharacterRegex,
      }),
      projectName: `${repoFullName}${branchName === 'master' ? '' : `:${branchName}`}`,
    },
    withBranch ? { branch: { name: branchName } } : {},
    pluginConfig
  );
}

function serializeConfig(config) {
  if (Array.isArray(config)) {
    return config.join(',');
  }

  if (isObject(config)) {
    return Object.keys(config)
      .map(key => `sonar.${key}=${serializeConfig(config[key])}`)
      .join('\n');
  }

  return config;
}

module.exports = {
  buildDefaultConfig,
  serializeConfig,
};
