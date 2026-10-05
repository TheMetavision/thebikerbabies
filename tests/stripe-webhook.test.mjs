// Tests for netlify/functions/stripe-webhook.cjs: the brand guard and the
// Sanity token fallback.
//
// Stripe and fetch are stubbed, so nothing leaves the machine.
//
//   npm test
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
process.env.STRIPE_SECRET_KEY = 'sk_test_dummy';
process.env.STRIPE_WEBHOOK_SECRET = 'whsec_dummy';
delete process.env.PRINTFUL_API_KEY;
delete process.env.RESEND_API_KEY;

// The event the "verified" webhook delivers, and what the handler asked Stripe for.
let nextEvent = null;
let listLineItemsCalls = 0;
require.cache[require.resolve('stripe')] = {
  exports: () => ({
    webhooks: { constructEvent: () => nextEvent },
    checkout: { sessions: { listLineItems: async () => { listLineItemsCalls++; return { data: [] }; } } },
  }),
};
const { handler, isBikerBabiesSession, sanityToken } = require('../netlify/functions/stripe-webhook.cjs');

// Record outbound requests (only Sanity is reachable with no Printful/Resend keys).
let fetchCalls = [];
globalThis.fetch = async (url, opts = {}) => {
  fetchCalls.push({ url: String(url), auth: opts.headers && opts.headers.Authorization });
  return { ok: true, json: async () => ({ result: 0 }), text: async () => '' };
};

const completed = (metadata) => ({
  type: 'checkout.session.completed',
  data: { object: { id: 'cs_test_abc123', metadata, amount_total: 2500, currency: 'gbp' } },
});
const post = () => handler({ httpMethod: 'POST', body: '{}', headers: { 'stripe-signature': 't=1,v1=x' } });

beforeEach(() => {
  listLineItemsCalls = 0;
  fetchCalls = [];
  delete process.env.SANITY_API_TOKEN;
  delete process.env.SANITY_TOKEN;
});

/* ── isBikerBabiesSession ──────────────────────────────────────────────── */

test('brand guard: accepts sessions stamped by this site', () => {
  assert.equal(isBikerBabiesSession({ metadata: { brand: 'bikerbabies', source: 'bikerbabies-web' } }), true);
});

test('brand guard: accepts metadata.brand alone', () => {
  assert.equal(isBikerBabiesSession({ metadata: { brand: 'bikerbabies' } }), true);
});

test('brand guard: accepts the legacy metadata.source alone', () => {
  assert.equal(isBikerBabiesSession({ metadata: { source: 'bikerbabies-web' } }), true);
});

test("brand guard: rejects the other brands' sessions", () => {
  assert.equal(isBikerBabiesSession({ metadata: { source: 'catsoncrack-web', brand: 'catsoncrack' } }), false);
  assert.equal(isBikerBabiesSession({ metadata: { brand: 'labrats', source: 'labrats-web' } }), false);
  assert.equal(isBikerBabiesSession({ metadata: { source: 'thefuglys-web', brand: 'thefuglys' } }), false);
});

test('brand guard: rejects sessions with no or malformed metadata', () => {
  assert.equal(isBikerBabiesSession({ metadata: {} }), false);
  assert.equal(isBikerBabiesSession({}), false);
  assert.equal(isBikerBabiesSession(null), false);
  assert.equal(isBikerBabiesSession({ metadata: { source: 'Bikerbabies-web ' } }), false);
  assert.equal(isBikerBabiesSession({ metadata: { brand: 'BikerBabies' } }), false);
});

/* ── handler + guard ───────────────────────────────────────────────────── */

test('handler: another brand gets a 200 and nothing is done', async () => {
  process.env.SANITY_API_TOKEN = 'api-token';
  nextEvent = completed({ source: 'catsoncrack-web', brand: 'catsoncrack' });
  const res = await post();
  assert.equal(res.statusCode, 200);
  assert.equal(JSON.parse(res.body).ignored, 'foreign-brand');
  assert.equal(listLineItemsCalls, 0);
  assert.equal(fetchCalls.length, 0);
});

test('handler: a Biker Babies session is processed and logged to Sanity', async () => {
  process.env.SANITY_API_TOKEN = 'api-token';
  nextEvent = completed({ brand: 'bikerbabies', source: 'bikerbabies-web' });
  const res = await post();
  assert.equal(res.statusCode, 200);
  assert.equal(listLineItemsCalls, 1);
  assert.ok(fetchCalls.some((c) => c.url.includes('/data/mutate/')), 'order written to Sanity');
});

/* ── sanityToken ───────────────────────────────────────────────────────── */

test('token: prefers SANITY_API_TOKEN', () => {
  process.env.SANITY_API_TOKEN = 'api-token';
  process.env.SANITY_TOKEN = 'legacy-token';
  assert.equal(sanityToken(), 'api-token');
});

test('token: falls back to SANITY_TOKEN', () => {
  process.env.SANITY_TOKEN = 'legacy-token';
  assert.equal(sanityToken(), 'legacy-token');
});

test('token: empty when neither is set', () => {
  assert.equal(sanityToken(), '');
});

test('order log: uses SANITY_API_TOKEN for every Sanity request', async () => {
  process.env.SANITY_API_TOKEN = 'api-token';
  process.env.SANITY_TOKEN = 'legacy-token';
  nextEvent = completed({ source: 'bikerbabies-web' });
  await post();
  const sanity = fetchCalls.filter((c) => c.url.includes('.api.sanity.io'));
  assert.ok(sanity.length >= 2);
  assert.ok(sanity.every((c) => c.auth === 'Bearer api-token'));
});

test('order log: falls back to SANITY_TOKEN', async () => {
  process.env.SANITY_TOKEN = 'legacy-token';
  nextEvent = completed({ source: 'bikerbabies-web' });
  await post();
  const sanity = fetchCalls.filter((c) => c.url.includes('.api.sanity.io'));
  assert.ok(sanity.length >= 2);
  assert.ok(sanity.every((c) => c.auth === 'Bearer legacy-token'));
});

test('order log: skipped (still 200) when no token is set', async () => {
  nextEvent = completed({ source: 'bikerbabies-web' });
  const res = await post();
  assert.equal(res.statusCode, 200);
  assert.equal(fetchCalls.filter((c) => c.url.includes('.api.sanity.io')).length, 0);
});
