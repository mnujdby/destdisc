import assert from 'node:assert/strict';
import test from 'node:test';

import {
  checkRateLimit,
  clearRateLimitBuckets,
  handleDiscoverRequest,
} from './route.js';

function jsonRequest(body, headers = {}) {
  return new Request('http://localhost/api/discover', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

test.beforeEach(() => {
  clearRateLimitBuckets();
  process.env.AURATRAVEL_SKIP_IMAGE_LOOKUP = '1';
  delete process.env.GROQ_API_KEY;
});

test('discover route rejects missing city input', async () => {
  const response = await handleDiscoverRequest(jsonRequest({ city: '' }));
  const body = await response.json();

  assert.equal(response.status, 400);
  assert.equal(body.error, 'City parameter is required.');
});

test('discover route returns keyless demo data when Groq is unavailable', async () => {
  const response = await handleDiscoverRequest(jsonRequest(
    { city: 'Indore', duration: '2 days', interests: ['Food trails'] },
    { 'x-forwarded-for': '203.0.113.5' }
  ));
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.city, 'Indore');
  assert.equal(body.source, 'demo');
  assert.equal(body.itinerary.days.length, 2);
  assert.equal(response.headers.get('X-RateLimit-Remaining'), '19');
});

test('checkRateLimit blocks requests after the configured window allowance', () => {
  const now = 1_700_000_000_000;
  const clientId = '198.51.100.10';

  for (let index = 0; index < 20; index += 1) {
    assert.equal(checkRateLimit(clientId, now).allowed, true);
  }

  const blocked = checkRateLimit(clientId, now);
  assert.equal(blocked.allowed, false);
  assert.equal(blocked.retryAfter, 60);
});
