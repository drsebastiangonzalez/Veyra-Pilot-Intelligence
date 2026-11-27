import test from 'node:test';
import assert from 'node:assert/strict';
import { fetchCoinbaseQuote, fetchCryptoSnapshot, normalizeCoinbaseTicker } from './coinbase-quotes.mjs';
import { evaluatePriceRule } from './price-alert-engine.mjs';
const time = '2026-10-26T09:28:40.218051639Z';
const now = Date.parse(time);
const body = { price: '100.001', time };
const ok = data => async () => new Response(JSON.stringify(data), { status: 200 });
test('real source timestamp precision is accepted and original timestamp retained', () => {
  const q = normalizeCoinbaseTicker('BTC', body, { nowMs: now });
  assert.equal(q.sourceTime, time); assert.equal(q.asOfMs, now);
  assert.equal(q.currency, 'USD'); assert.equal(q.instrumentId, 'BTC-USD');
});
test('URL is allowlisted and does not accept arbitrary asset paths', async () => {
  let calls = 0;
  const fetchImpl = async (url, options) => {
    calls++; assert.equal(url, 'https://api.exchange.coinbase.com/products/SOL-USD/ticker');
    assert.equal(options.redirect, 'error'); return new Response(JSON.stringify(body));
  };
  await fetchCoinbaseQuote('SOL', { fetchImpl, clock: () => now });
  await assert.rejects(fetchCoinbaseQuote('../accounts', { fetchImpl }), { code: 'unsupported_instrument' });
  assert.equal(calls, 1);
});
test('old and future quotes are refused; HTTP receipt does not renew them', async () => {
  for (const clock of [() => now + 60001, () => now - 5001]) {
    await assert.rejects(fetchCoinbaseQuote('ETH', { fetchImpl: ok(body), clock }), { code: 'stale_or_future_quote' });
  }
});
test('invalid prices and absent source time fail closed', () => {
  for (const price of [0, '0.000', '-1', '1,000', '1e2', 'NaN']) {
    assert.throws(() => normalizeCoinbaseTicker('BTC', { ...body, price }, { nowMs: now }), { code: 'invalid_price' });
  }
  assert.throws(() => normalizeCoinbaseTicker('BTC', { price: '100' }, { nowMs: now }), { code: 'invalid_timestamp' });
});
test('rate limits return retry metadata without retry storms', async () => {
  let calls = 0;
  await assert.rejects(fetchCoinbaseQuote('BTC', { fetchImpl: async () => {
    calls++; return new Response('{}', { status: 429, headers: { 'retry-after': '30' } });
  } }), { code: 'provider_http_429', retryAfterSeconds: 30 });
  assert.equal(calls, 1);
});
test('timeout aborts request and malformed JSON is an unavailable result', async () => {
  await assert.rejects(fetchCoinbaseQuote('BTC', { timeoutMs: 5,
    fetchImpl: (_, { signal }) => new Promise((resolve, reject) => {
      signal.addEventListener('abort', () => reject(new Error('aborted')));
    }) }), { code: 'provider_timeout' });
  await assert.rejects(fetchCoinbaseQuote('BTC', { fetchImpl: async () => new Response('<html>') }), { code: 'provider_unavailable' });
});
test('snapshot deduplicates symbols and isolates failure per instrument', async () => {
  let calls = 0;
  const result = await fetchCryptoSnapshot(['BTC', 'BTC', 'SOL'], { clock: () => now,
    fetchImpl: async url => { calls++; return url.includes('SOL') ? new Response('{}', { status: 503 }) : new Response(JSON.stringify(body)); }
  });
  assert.equal(calls, 2); assert.ok(result.BTC.quote); assert.equal(result.SOL.quote, null);
  assert.equal(result.SOL.error, 'provider_http_503');
});
test('normalized quotes feed crossing engine without converting decimal price', () => {
  const rule = { userId: 'test', id: 'btc', revision: 1, instrumentId: 'BTC-USD', currency: 'USD', direction: 'above', threshold: '100', repeat: false, cooldownMs: 0, enabled: true };
  const first = normalizeCoinbaseTicker('BTC', { price: '99', time }, { nowMs: now });
  const state = evaluatePriceRule(rule, null, first, { nowMs: now }).state;
  const later = new Date(now + 1000).toISOString();
  const second = normalizeCoinbaseTicker('BTC', { price: '100.001', time: later }, { nowMs: now + 1000 });
  assert.equal(evaluatePriceRule(rule, state, second, { nowMs: now + 1000 }).event.price, '100.001');
});
