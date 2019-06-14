const test = require('tape');
const mock = require('mock-require');
const isObject = require('lodash.isobject');

const utils = require('../src/util');

test('convert pom.xml to js', function(t) {
  const { parseXML } = mock.reRequire('../src/maven');

  t.plan(1);
  mock.stopAll();

  utils
    .readFileAsync('test/pom-simple.xml')
    .then(data => parseXML(data))
    .then(data => {
      t.ok(isObject(data));
    });
});

test('build pom simple', function(t) {
  mock('../src/util', {
    ...utils,
    readFileAsync: () => utils.readFileAsync('test/pom-simple.xml'),
  });

  const { buildMavenConfig } = mock.reRequire('../src/maven');

  t.plan(1);
  mock.stopAll();

  buildMavenConfig({}).then(cfg => t.ok(cfg['sonar.projectVersion'] === '11.17.2-SNAPSHOT'));
});

test('build pom with modules', function(t) {
  mock('../src/util', {
    ...utils,
    readFileAsync: () => utils.readFileAsync('test/pom-with-modules.xml'),
  });

  const { buildMavenConfig } = mock.reRequire('../src/maven');

  t.plan(1);
  mock.stopAll();

  buildMavenConfig({}).then(cfg => t.ok(Array.isArray(cfg['sonar.modules'])));
});
