const { promisify } = require('util');
const fs = require('fs');

const exists = promisify(fs.exists);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

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
  exists,
  flattenMap,
  promisify,
  readFile,
  writeFile,
};
