const fs = require('fs');
const test = require('tape');
const mock = require('mock-require');
const isObject = require('lodash.isobject');

test('convert pom.xml to js', function(t) {
  mock('fs', {
    readFile: (fileName, cb) => fs.readFile('test/pom-simple.xml', cb),
  });

  const { readFile, parseXML } = mock.reRequire('../src/maven');

  t.plan(1);
  mock.stopAll();

  readFile('pom.xml')
    .then(data => parseXML(data))
    .then(data => {
      t.ok(isObject(data));
    });
});

test('build pom simple', function(t) {
  mock('fs', {
    readFile: (fileName, cb) => fs.readFile('test/pom-simple.xml', cb),
  });

  const { buildMavenConfig } = mock.reRequire('../src/maven');

  t.plan(1);
  mock.stopAll();

  buildMavenConfig({}).then(cfg => t.ok(cfg != null));
});

test('build pom with modules', function(t) {
  mock('fs', {
    readFile: (fileName, cb) => fs.readFile('test/pom-with-modules.xml', cb),
  });

  const { buildMavenConfig } = mock.reRequire('../src/maven');

  t.plan(1);
  mock.stopAll();

  buildMavenConfig({}).then(cfg => t.ok(Array.isArray(cfg['sonar.modules'])));
});
