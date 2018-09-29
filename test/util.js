const test = require('tape');
const { assignDeep, flattenMap } = require('../src/util');

test('test assign deep', function(t) {
  t.deepEqual(assignDeep({}, { a: 1 }), { a: 1 });
  t.deepEqual(assignDeep({ a: 1 }, { b: 2 }, { c: 3 }), { a: 1, b: 2, c: 3 });
  t.deepEqual(assignDeep({ a: { b: 1 } }, { a: { c: 2 } }), { a: { b: 1, c: 2 } });

  t.end();
});

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
