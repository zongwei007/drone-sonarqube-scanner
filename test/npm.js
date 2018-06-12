const fs = require('fs');
const test = require('tape');
const mock = require('mock-require');

test('build npm config', function(t) {
  fs.unlinkSync('sonar-project.properties');

  mock('read-pkg', {
    sync: () => ({
      name: 'drone-sonarqube-setting',
      version: '1.0.0',
      description: 'sonar-project.properties generator plugin for drone',
    }),
  });

  mock.reRequire('sonarqube-scanner/dist/sonarqube-scanner-params');
  const { buildNpmConfig } = mock.reRequire('../src/npm');

  mock.stopAll();
  t.deepEqual(buildNpmConfig({}), {
    'sonar.projectKey': 'drone-sonarqube-setting',
    'sonar.projectName': 'drone-sonarqube-setting',
    'sonar.projectVersion': '1.0.0',
    'sonar.projectDescription': 'sonar-project.properties generator plugin for drone',
    'sonar.sources': '.',
    'sonar.exclusions': ['node_modules/**'],
  });
  t.end();
});
