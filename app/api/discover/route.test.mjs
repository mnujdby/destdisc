import assert from 'node:assert/strict';
import test from 'node:test';

import {
  checkRateLimit,
  clearRateLimitBuckets,
  getClientId,
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

test.afterEach(() => {
  delete process.env.GROQ_API_KEY;
  delete process.env.AURATRAVEL_SKIP_IMAGE_LOOKUP;
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

test('checkRateLimit resets allowance after the rate window expires', () => {
  const now = 1_700_000_000_000;
  const clientId = '198.51.100.20';

  for (let index = 0; index < 20; index += 1) {
    checkRateLimit(clientId, now);
  }

  assert.equal(checkRateLimit(clientId, now).allowed, false);
  assert.deepEqual(checkRateLimit(clientId, now + 60_000), {
    allowed: true,
    remaining: 19,
  });
});

test('discover route returns 429 with retry headers after too many requests', async () => {
  const clientHeaders = { 'x-forwarded-for': '203.0.113.55' };

  for (let index = 0; index < 20; index += 1) {
    await handleDiscoverRequest(jsonRequest({ city: 'Delhi' }, clientHeaders));
  }

  const response = await handleDiscoverRequest(jsonRequest({ city: 'Delhi' }, clientHeaders));
  const body = await response.json();

  assert.equal(response.status, 429);
  assert.equal(body.error, 'Too many requests. Please wait before generating another route.');
  assert.equal(response.headers.get('X-RateLimit-Remaining'), '0');
  assert.equal(response.headers.get('Retry-After'), '60');
});

test('getClientId prefers forwarded address and falls back to real IP', () => {
  assert.equal(
    getClientId(jsonRequest({ city: 'Delhi' }, { 'x-forwarded-for': '198.51.100.1, 198.51.100.2' })),
    '198.51.100.1'
  );
  assert.equal(
    getClientId(jsonRequest({ city: 'Delhi' }, { 'x-real-ip': '198.51.100.3' })),
    '198.51.100.3'
  );
});

test('discover route returns live Groq data when the model call succeeds', async () => {
  const originalFetch = globalThis.fetch;
  process.env.GROQ_API_KEY = 'test-key';
  globalThis.fetch = async (url) => {
    assert.equal(url, 'https://api.groq.com/openai/v1/chat/completions');
    return Response.json({
      choices: [
        {
          message: {
            content: JSON.stringify({
              city: 'Delhi',
              tagline: 'Layered capital',
              culturalOverview: 'A compact overview.',
              itinerary: { summary: 'A live plan.', days: [] },
              attractions: [],
              hiddenGems: [],
              localEvents: [],
              immersiveStory: { title: 'Story', storyText: 'Text' },
            }),
          },
        },
      ],
    });
  };

  try {
    const response = await handleDiscoverRequest(jsonRequest({ city: 'Delhi' }));
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.source, 'live');
    assert.equal(body.tagline, 'Layered capital');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('discover route falls back to demo data when Groq returns an error', async () => {
  const originalFetch = globalThis.fetch;
  const originalConsoleError = console.error;
  process.env.GROQ_API_KEY = 'expired-key';
  globalThis.fetch = async () => new Response('expired key', { status: 401 });
  console.error = () => {};

  try {
    const response = await handleDiscoverRequest(jsonRequest({ city: 'Mumbai', duration: '1 day' }));
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.source, 'demo');
    assert.equal(body.city, 'Mumbai');
    assert.equal(body.itinerary.days.length, 1);
  } finally {
    globalThis.fetch = originalFetch;
    console.error = originalConsoleError;
  }
});
