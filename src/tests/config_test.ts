import { assertEquals, assertStrictEquals } from 'https://deno.land/std@0.79.0/testing/asserts.ts';

import { buildDefaultConfig, serializeConfig } from '../config.ts';
import { flattenMap } from '../util.ts';

const TEST_CONFIG = {
  projectKey: 'org:repo:dev',
  projectName: 'org/repo:dev',
  host: {
    url: 'http://unknown.com',
  },
  login: 'nobody',
  exclusions: ['build/**', 'test/**'],
  javascript: {
    lcov: {
      reportPaths: 'coverage',
    },
  },
};

const TEST_ENV = {
  DRONE_REPO: 'org/repo',
  DRONE_BRANCH: 'dev',
  PLUGIN_HOST: '{"url":"http://unknown.com"}',
  PLUGIN_EXCLUSIONS: 'build/**,test/**',
  PLUGIN_LOGIN: 'nobody',
  PLUGIN_JAVASCRIPT: '{"lcov":{"reportPaths":"coverage"}}',
};

Deno.test('build default config', () => {
  assertEquals(
    buildDefaultConfig({
      ...TEST_ENV,
      DRONE_REPO: '@org/repo',
    }),
    {
      ...TEST_CONFIG,
      projectName: '@org/repo:dev',
    }
  );
});

Deno.test('build default config ignore branch', () => {
  assertEquals(
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
});

Deno.test('serialize config', () => {
  const expected = `sonar.projectKey=org:repo:dev
sonar.projectName=org/repo:dev
sonar.host.url=http://unknown.com
sonar.login=nobody
sonar.exclusions=build/**,test/**
sonar.javascript.lcov.reportPaths=coverage`;

  assertStrictEquals(serializeConfig(flattenMap(TEST_CONFIG)), expected);
});
