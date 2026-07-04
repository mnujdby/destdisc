import assert from 'node:assert/strict';
import test from 'node:test';

import nextConfig from './next.config.mjs';

test('Next config applies browser security headers to all routes', async () => {
  const headerRules = await nextConfig.headers();
  const allHeaders = Object.fromEntries(
    headerRules.flatMap((rule) => rule.headers.map((header) => [header.key, header.value]))
  );

  assert.equal(headerRules[0].source, '/:path*');
  assert.equal(allHeaders['X-Content-Type-Options'], 'nosniff');
  assert.equal(allHeaders['Referrer-Policy'], 'strict-origin-when-cross-origin');
  assert.equal(allHeaders['X-Frame-Options'], 'DENY');
  assert.match(allHeaders['Content-Security-Policy'], /default-src 'self'/);
  assert.match(allHeaders['Content-Security-Policy'], /frame-ancestors 'none'/);
});
