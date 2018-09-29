const fs = require('fs');
const test = require('tape');
const mock = require('mock-require');

test('build npm config', function(t) {
  try {
    fs.unlinkSync('sonar-project.properties');
  } catch (e) {
    //ignore if file not exist.
  }

  mock('read-pkg', {
    sync: () => ({
      name: 'drone-sonarqube-setting',
      version: '1.0.0',
      description: 'sonar-project.properties generator plugin for drone',
    }),
  });

  mock.reRequire('sonarqube-scanner/dist/sonarqube-scanner-params');
  const { buildNpmConfig } = mock.reRequire('../src/npm');

  t.plan(1);
  mock.stopAll();

  buildNpmConfig({}).then(config =>
    t.deepEqual(config, {
      'sonar.projectKey': 'drone-sonarqube-setting',
      'sonar.projectName': 'drone-sonarqube-setting',
      'sonar.projectVersion': '1.0.0',
      'sonar.projectDescription': 'sonar-project.properties generator plugin for drone',
      'sonar.sources': '.',
      'sonar.exclusions': ['node_modules/**', 'bower_components/**', 'jspm_packages/**', 'typings/**', 'lib-cov/**'],
    })
  );
});
