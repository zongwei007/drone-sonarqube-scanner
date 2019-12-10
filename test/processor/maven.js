const test = require('tape');
const mock = require('mock-require');

const utils = require('../../src/util');

test('build pom simple', async function(t) {
  mock('../../src/util', {
    ...utils,
    exists: () => true,
    readFile: () => utils.readFile('test/resource/pom-simple.xml'),
  });

  const { process } = mock.reRequire('../../src/processor/maven');

  t.plan(1);

  const cfg = await process({}, {});

  t.equal(cfg.projectVersion, '11.17.2-SNAPSHOT');
  t.end();

  mock.stopAll();
});

test('build pom with modules', async function(t) {
  mock('../../src/util', {
    ...utils,
    exists: () => true,
    readFile: () => utils.readFile('test/resource/pom-with-modules.xml'),
  });

  const { process } = mock.reRequire('../../src/processor/maven');

  t.plan(1);

  const cfg = await process({}, {});

  t.deepEqual(cfg.modules, [
    'docs',
    'dropwizard-bom',
    'dropwizard-core',
    'dropwizard-client',
    'dropwizard-db',
    'dropwizard-jdbi',
    'dropwizard-jdbi3',
    'dropwizard-migrations',
    'dropwizard-hibernate',
    'dropwizard-auth',
    'dropwizard-example',
    'dropwizard-forms',
    'dropwizard-views',
    'dropwizard-views-freemarker',
    'dropwizard-views-mustache',
    'dropwizard-testing',
    'dropwizard-util',
    'dropwizard-jackson',
    'dropwizard-validation',
    'dropwizard-configuration',
    'dropwizard-logging',
    'dropwizard-metrics',
    'dropwizard-metrics-graphite',
    'dropwizard-jersey',
    'dropwizard-jetty',
    'dropwizard-servlets',
    'dropwizard-lifecycle',
    'dropwizard-assets',
    'dropwizard-archetypes',
    'dropwizard-benchmarks',
    'dropwizard-http2',
    'dropwizard-request-logging',
    'dropwizard-e2e',
    'dropwizard-json-logging',
  ]);
  t.end();

  mock.stopAll();
});
