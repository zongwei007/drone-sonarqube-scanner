const test = require('tape');
const { buildDefaultConfig, serializeConfig } = require('../src/config');
const { flattenMap } = require('../src/util');

const TEST_CONFIG = {
  projectKey: 'org:repo:dev',
  projectName: 'org/repo:dev',
  host: {
    url: 'http://unknown.com',
  },
  login: 'nobody',
  exclusions: ['build/**', 'test/**'],
};

const TEST_ENV = {
  DRONE_REPO: 'org/repo',
  DRONE_BRANCH: 'dev',
  PLUGIN_HOST: '{"url":"http://unknown.com"}',
  PLUGIN_EXCLUSIONS: 'build/**,test/**',
  PLUGIN_LOGIN: 'nobody',
};

test('build default config', function(t) {
  t.deepEqual(buildDefaultConfig(TEST_ENV), TEST_CONFIG);
  t.end();
});

test('build default config ignore branch', function(t) {
  t.deepEqual(
    buildDefaultConfig({
      ...TEST_ENV,
      PLUGIN_WITH_BRANCH: 'true',
    }),
    {
      ...TEST_CONFIG,
      projectKey: 'org:repo',
      branch: { name: 'dev' },
    }
  );
  t.end();
});

test('serialize config', function(t) {
  const expected = `sonar.projectKey=org:repo:dev
sonar.projectName=org/repo:dev
sonar.host.url=http://unknown.com
sonar.login=nobody
sonar.exclusions=build/**,test/**`;

  t.equal(serializeConfig(flattenMap(TEST_CONFIG)), expected);
  t.end();
});
