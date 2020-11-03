const path = require('path');
const readPkg = require('read-pkg');
const get = require('lodash.get');
const merge = require('lodash.merge');
const { exists } = require('../util');

async function builder(config) {
  const isExist = await exists('package.json');

  if (!isExist) {
    return config;
  }

  const pkg = await readPkg();

  const links = {};

  if (pkg.homepage) {
    links.homepage = pkg.homepage;
  }

  if (pkg.bugs && pkg.bugs.url) {
    links.issues = pkg.bugs.url;
  }

  if (pkg.repository && pkg.repository.url) {
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

  const javascript = {};

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

async function findLcovReportPath(pkg) {
  const paths = [
    // jest coverage output directory
    // See: http://facebook.github.io/jest/docs/en/configuration.html#coveragedirectory-string
    'jest.coverageDirectory',
    // nyc coverage output directory
    // See: https://github.com/istanbuljs/nyc#configuring-nyc
    'nyc.report-dir',
  ]
    .map(path => get(pkg, path))
    .filter(Boolean)
    .map(String)
    .concat(
      // default coverage output directory
      'coverage'
    );

  const lcovReportPaths = await Promise.all(
    paths.map(lcovReportDir => {
      const lcovReportPath = path.posix.join(lcovReportDir, 'lcov.info');

      return exists(path.resolve(process.cwd(), lcovReportPath)).then(
        flag => flag && [path.posix.join(lcovReportDir, '**'), lcovReportPath]
      );
    })
  );

  return lcovReportPaths.find(Array.isArray);
}

module.exports = { process: builder };
