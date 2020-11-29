import { assertEquals } from 'https://deno.land/std@0.79.0/testing/asserts.ts';

import { flattenMap } from '../util.ts';

Deno.test('flatten map', () => {
  assertEquals(
    flattenMap({
      a: {
        d: 1,
        e: {
          f: 2,
          g: 3,
        },
      },
      b: [1, 2],
      c: '1',
    }),
    {
      'a.d': 1,
      'a.e.f': 2,
      'a.e.g': 3,
      b: [1, 2],
      c: '1',
    }
  );
});
