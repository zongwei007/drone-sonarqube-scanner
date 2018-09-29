const test = require('tape');
const mock = require('mock-require');

const TEST_CONFIG = {
  'sonar.projectKey': 'org:repo:dev',
  'sonar.projectName': 'org/repo:dev',
  'sonar.branch.name': 'dev',
  'sonar.host.url': 'url',
  'sonar.login': 'foo',
  'sonar.exclusions': ['build/**', 'test/**'],
};

const TEST_ENV = {
  DRONE_REPO: 'org/repo',
  DRONE_BRANCH: 'dev',
  PLUGIN_HOST: '{"url":"url"}',
  PLUGIN_EXCLUSIONS: 'build/**,test/**',
  PLUGIN_LOGIN: 'foo',
};

test('build default config', function(t) {
  mock('process', {
    env: TEST_ENV,
  });

  const { buildDefaultConfig } = mock.reRequire('../src/main');

  mock.stopAll();
  t.deepEqual(buildDefaultConfig(), TEST_CONFIG);
  t.end();
});

test('build default config ignore branch', function(t) {
  mock('process', {
    env: Object.assign(TEST_ENV, {
      PLUGIN_IGNORE_BRANCH: 'true',
    }),
  });

  const { buildDefaultConfig } = mock.reRequire('../src/main');

  mock.stopAll();
  t.deepEqual(buildDefaultConfig(), {
    'sonar.projectKey': 'org:repo',
    'sonar.projectName': 'org/repo:dev',
    'sonar.branch.name': 'dev',
    'sonar.host.url': 'url',
    'sonar.login': 'foo',
    'sonar.exclusions': ['build/**', 'test/**'],
  });
  t.end();
});

test('serialize config', function(t) {
  const { serializeConfig } = require('../src/main');

  mock.stopAll();
  t.equal(
    serializeConfig(TEST_CONFIG),
    `sonar.projectKey=org:repo:dev
sonar.projectName=org/repo:dev
sonar.branch.name=dev
sonar.host.url=url
sonar.login=foo
sonar.exclusions=build/**,test/**`
  );
  t.end();
});

test('write config', function(t) {
  let fileContent;
  mock('fs-extra', {
    pathExists: () => Promise.resolve(true),
    outputFile: (fileName, content) => {
      fileContent = content;
      return Promise.resolve(true);
    },
  });
  mock('process', {
    env: TEST_ENV,
  });

  const { writeProjectPropertis } = mock.reRequire('../src/main');

  t.plan(1);
  mock.stopAll();

  writeProjectPropertis().then(() => {
    t.ok(fileContent.length > 0, 'has content.');
  });
});

test('unknow project type', function(t) {
  mock('fs-extra', {
    pathExists: () => Promise.resolve(false),
  });

  const { writeProjectPropertis } = mock.reRequire('../src/main');

  t.plan(1);
  mock.stopAll();

  writeProjectPropertis().catch(e => {
    console.log(e.message);
    t.ok(e.message.includes('decide project type'));
  });
});
