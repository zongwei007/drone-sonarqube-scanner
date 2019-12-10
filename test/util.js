const test = require('tape');
const { flattenMap } = require('../src/util');

test('test flatten map', function(t) {
  t.deepEqual(
    flattenMap({
      a: {
        b: 1,
      },
      c: [1, 2],
    }),
    {
      'a.b': 1,
      c: [1, 2],
    }
  );
  t.end();
});
