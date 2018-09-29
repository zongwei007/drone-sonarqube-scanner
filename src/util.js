function toPromise(f) {
  return (...args) =>
    new Promise((resolve, reject) =>
      f(...args, (err, data) => {
        if (err) {
          reject(err);
        }

        resolve(data);
      })
    );
}

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
  flattenMap,
  toPromise,
};
