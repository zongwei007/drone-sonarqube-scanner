import { assertEquals } from 'https://deno.land/std@0.79.0/testing/asserts.ts';

import { mix } from '../npm.ts';

Deno.test('build npm config', async () => {
  const pkg = {
    name: 'drone-sonarqube-scanner',
    version: '1.0.0',
    description: 'sonar-project.properties generator plugin for drone',
  };

  const cfg = await mix(pkg, {});

  assertEquals(cfg, {
    projectVersion: '1.0.0',
    projectDescription: 'sonar-project.properties generator plugin for drone',
    sources: '.',
    exclusions: ['node_modules/**', 'bower_components/**', 'jspm_packages/**', 'typings/**', 'lib-cov/**'],
  });
});
