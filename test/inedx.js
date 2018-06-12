const test = require('tape');
const mock = require('mock-require');

const TEST_CONFIG = {
  'sonar.projectKey': 'org:repo:dev',
  'sonar.projectName': 'org/repo:dev',
  'sonar.host.url': 'url',
  'sonar.login': 'foo',
  'sonar.exclusions': ['build/**', 'test/**'],
};
const TEST_ENV = {
  DRONE_REPO: 'org/repo',
  DRONE_BRANCH: 'dev',
  PLUGIN_HOST_URL: 'url',
  PLUGIN_EXCLUSIONS: 'build/**,test/**',
  SONAR_TOKEN: 'foo',
};

test('build default config', function(t) {
  mock('process', {
    env: TEST_ENV,
  });

  const { buildDefaultConfig } = mock.reRequire('../src/index');

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

  const { buildDefaultConfig } = mock.reRequire('../src/index');

  mock.stopAll();
  t.deepEqual(buildDefaultConfig(), {
    'sonar.projectKey': 'org:repo',
    'sonar.projectName': 'org/repo:dev',
    'sonar.host.url': 'url',
    'sonar.login': 'foo',
    'sonar.exclusions': ['build/**', 'test/**'],
  });
  t.end();
});

test('serialize config', function(t) {
  const { serializeConfig } = require('../src/index');

  mock.stopAll();
  t.equal(
    serializeConfig(TEST_CONFIG),
    `sonar.projectKey=org:repo:dev
sonar.projectName=org/repo:dev
sonar.host.url=url
sonar.login=foo
sonar.exclusions=build/**,test/**`
  );
  t.end();
});

test('write config', function(t) {
  let fileContent;
  mock('fs', {
    existsSync: () => true,
    writeFileSync: (fileName, content) => {
      return (fileContent = content);
    },
  });
  mock('process', {
    env: TEST_ENV,
  });

  mock.reRequire('../src/index');

  mock.stopAll();
  t.ok(fileContent.length > 0, 'has content.');
  t.end();
});

test('unknow project type', function(t) {
  mock('fs', {
    existsSync: () => false,
  });

  try {
    mock.reRequire('../src/index');
  } catch (e) {
    console.log(e.message);
    mock.stopAll();
    t.ok(e.message.includes('decide project type'));
    t.end();
  }
});
