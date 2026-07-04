import assert from 'node:assert/strict';
import test from 'node:test';

import {
  BUDGET_OPTIONS,
  CITIES,
  DURATION_OPTIONS,
  INTERESTS_OPTIONS,
  PACE_OPTIONS,
  TRAVELER_OPTIONS,
  cityFallbackImage,
  getCityBySlug,
} from './cities.js';

test('featured city catalogue has complete and unique entries', () => {
  const slugs = new Set();

  for (const city of CITIES) {
    assert.ok(city.name, 'city name is required');
    assert.match(city.slug, /^[a-z0-9-]+$/);
    assert.equal(slugs.has(city.slug), false, `${city.slug} should be unique`);
    assert.equal(city.country, 'India');
    assert.ok(city.tagline.length > 8);
    assert.ok(city.blurb.length > 30);
    assert.match(city.image, /^https:\/\//);
    assert.match(city.hero, /^https:\/\//);
    assert.ok(city.query.includes(city.name.split(' ')[0]));
    slugs.add(city.slug);
  }
});

test('getCityBySlug is case-insensitive and returns undefined for unknown cities', () => {
  assert.equal(getCityBySlug('DELHI').name, 'Delhi');
  assert.equal(getCityBySlug('mumbai').slug, 'mumbai');
  assert.equal(getCityBySlug('unknown-city'), undefined);
});

test('cityFallbackImage creates deterministic encoded fallback URLs', () => {
  const url = cityFallbackImage(getCityBySlug('indore'), 320, 180);

  assert.match(url, /^https:\/\/loremflickr\.com\/320\/180\//);
  assert.match(url, /Indore%2CRajwada%2Cpalace%2CIndia/);
  assert.match(url, /lock=7$/);
});

test('planner option groups have expected defaults and enough choice variety', () => {
  assert.deepEqual(DURATION_OPTIONS, ['1 day', '2 days', '3 days']);
  assert.ok(BUDGET_OPTIONS.includes('mid-range'));
  assert.ok(PACE_OPTIONS.includes('balanced'));
  assert.ok(TRAVELER_OPTIONS.includes('friends or family'));
  assert.ok(INTERESTS_OPTIONS.length >= 8);
  assert.equal(new Set(INTERESTS_OPTIONS).size, INTERESTS_OPTIONS.length);
});
