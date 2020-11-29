import merge from 'https://unpkg.com/lodash-es@4.17.15/merge.js';
import { exists } from 'https://deno.land/std@0.79.0/fs/exists.ts';
import { posix, resolve } from 'https://deno.land/std@0.79.0/path/mod.ts';

import { SETTINGS } from '../util.ts';

export async function mix(pkg: SETTINGS, config: SETTINGS) {
  const links: SETTINGS = {};

  if (pkg.homepage) {
    links.homepage = pkg.homepage;
  }

  if (pkg.bugs?.url) {
    links.issues = pkg.bugs.url;
  }

  if (pkg.repository?.url) {
    links.scm = pkg.repository.url;
  }

  const sonarConfig = {
    projectVersion: pkg.version,
    exclusions: ['node_modules/**', 'bower_components/**', 'jspm_packages/**', 'typings/**', 'lib-cov/**'],
    ...(pkg.description ? { projectDescription: pkg.description } : {}),
    ...(Object.keys(links).length ? { links } : {}),
  };

  const lcovReportInfo = await findLcovReportPath(pkg);

  const exclusions = [
    ...sonarConfig.exclusions,
    ...(Array.isArray(config.exclusions) ? config.exclusions : [config.exclusions]).filter(Boolean),
    ...(lcovReportInfo ? [lcovReportInfo[0]] : []),
  ];

  const javascript: SETTINGS = {};

  if (lcovReportInfo) {
    javascript.lcov = {
      reportPaths: lcovReportInfo[1],
    };
  }

  return merge(
    { sources: '.' },
    sonarConfig,
    {
      exclusions: [...new Set(exclusions)],
      ...(Object.keys(javascript).length ? { javascript } : {}),
    },
    config
  );
}

async function findLcovReportPath(pkg: SETTINGS) {
  const paths = [
    // jest coverage output directory
    // See: http://facebook.github.io/jest/docs/en/configuration.html#coveragedirectory-string
    pkg.jest?.coverageDirectory,
    // nyc coverage output directory
    // See: https://github.com/istanbuljs/nyc#configuring-nyc
    pkg.nyc?.['report-dir'],
  ]
    .filter(Boolean)
    .map(String)
    .concat(
      // default coverage output directory
      'coverage'
    );

  const lcovReportPaths = await Promise.all(
    paths.map((lcovReportDir) => {
      const lcovReportPath = posix.join(lcovReportDir, 'lcov.info');

      return exists(resolve(Deno.cwd(), lcovReportPath)).then(
        (flag: boolean) => flag && [posix.join(lcovReportDir, '**'), lcovReportPath]
      );
    })
  );

  return lcovReportPaths.find(Array.isArray);
}

async function process(config: SETTINGS) {
  const isExist = await exists('package.json');

  if (!isExist) {
    return config;
  }

  const pkg: SETTINGS = await Deno.readTextFile('package.json').then(JSON.parse);

  return mix(pkg, config);
}

export default { process };
