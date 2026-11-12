// TEMPORARY (PR #9 only, to be deleted): checks whether Netlify Blobs honours conditional
// writes (onlyIfNew / onlyIfMatch) from inside a deployed function.
// GET /api/zr-cw-test?k=<one-off key>&mode=default|strong
// Only a request whose k hashes to KEY_SHA256 runs it; anything else gets a 404.
// Writes only to the throwaway store "zr-cw-test".
import { getStore } from '@netlify/blobs';
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';

const KEY_SHA256 = 'c9d66b0548f627053033787655af35434b0a253091b54c7704f6aa8937c48b20';
const STORE = 'zr-cw-test';

export default async (req) => {
  const url = new URL(req.url);
  const got = createHash('sha256').update(url.searchParams.get('k') || '').digest();
  if (!timingSafeEqual(got, Buffer.from(KEY_SHA256, 'hex'))) return new Response('Not found', { status: 404 });

  const mode = url.searchParams.get('mode') === 'strong' ? 'strong' : 'default';
  const store = mode === 'strong' ? getStore({ name: STORE, consistency: 'strong' }) : getStore(STORE);
  const key = `cw/${mode}/${Date.now()}-${randomBytes(4).toString('hex')}`;
  const step = async (label, expect, fn) => {
    try { const result = await fn(); return { label, expect, result: result === undefined ? 'undefined' : result }; }
    catch (e) { return { label, expect, error: String(e && e.message || e) }; }
  };

  const results = [];
  results.push(await step('1. setJSON new key, onlyIfNew', 'modified:true', () => store.setJSON(key, { v: 1 }, { onlyIfNew: true })));
  results.push(await step('2. setJSON same key again, onlyIfNew', 'modified:false', () => store.setJSON(key, { v: 2 }, { onlyIfNew: true })));
  results.push(await step('3. setJSON same key, wrong onlyIfMatch ETag', 'modified:false', () => store.setJSON(key, { v: 3 }, { onlyIfMatch: '"0000000000000000000000000000dead"' })));
  const final = await store.getWithMetadata(key, { type: 'json' }).catch((e) => ({ error: String(e) }));

  return new Response(JSON.stringify({ mode, store: STORE, key, results, finalValue: final && final.data, finalEtag: final && final.etag }, null, 2), {
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
};
