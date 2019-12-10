const test = require('tape');
const mock = require('mock-require');

const utils = require('../../src/util');

test('build npm config', async function(t) {
  mock('../../src/util', {
    ...utils,
    exists: () => Promise.resolve(true),
  });

  mock('read-pkg', async () => ({
    name: 'drone-sonarqube-scanner',
    version: '1.0.0',
    description: 'sonar-project.properties generator plugin for drone',
  }));

  const { process } = mock.reRequire('../../src/processor/npm');

  t.plan(1);

  const cfg = await process({}, {});

  t.deepEqual(cfg, {
    projectVersion: '1.0.0',
    projectDescription: 'sonar-project.properties generator plugin for drone',
    sources: '.',
    exclusions: [
      'node_modules/**',
      'bower_components/**',
      'jspm_packages/**',
      'typings/**',
      'lib-cov/**',
      'coverage/**',
    ],
    javascript: { lcov: { reportPaths: 'coverage/lcov.info' } },
  });
  t.end();

  mock.stopAll();
});
