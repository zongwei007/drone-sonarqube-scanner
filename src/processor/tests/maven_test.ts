import { assertEquals, assertStrictEquals } from 'https://deno.land/std@0.79.0/testing/asserts.ts';
import parse from 'https://github.com/nekobato/deno-xml-parser/raw/master/index.ts';

import { mix } from '../maven.ts';

Deno.test('build pom simple', async () => {
  const document = await Deno.readTextFile('./tests/pom-simple.xml').then(parse);

  const cfg = mix(document, {}, {});

  assertStrictEquals(cfg.projectVersion, '11.17.2-SNAPSHOT');
});

Deno.test('build pom with modules', async () => {
  const document = await Deno.readTextFile('./tests/pom-with-modules.xml').then(parse);

  const cfg = mix(document, {}, {});

  assertEquals(cfg.modules, [
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
});
