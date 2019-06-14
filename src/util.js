const { promisify } = require('util');
const fs = require('fs');

const existsAsync = promisify(fs.exists);
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

function assignDeep(target, ...source) {
  source.forEach(item =>
    Object.keys(item).forEach(key => {
      if (!target[key] || Array.isArray(target[key])) {
        target[key] = item[key];
      } else if (typeof target[key] === 'object') {
        assignDeep(target[key], item[key]);
      }
    })
  );

  return target;
}

function flattenMap(data, parents = []) {
  const result = {};

  Object.keys(data).forEach(key => {
    if (typeof data[key] === 'object' && !Array.isArray(data[key])) {
      Object.assign(result, flattenMap(data[key], [key]));
    } else {
      result[[...parents, key].join('.')] = data[key];
    }
  });

  return result;
}

module.exports = {
  assignDeep,
  existsAsync,
  flattenMap,
  readFileAsync,
  writeFileAsync,
};
