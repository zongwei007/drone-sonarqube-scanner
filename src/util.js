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

module.exports = {
  toPromise,
};
