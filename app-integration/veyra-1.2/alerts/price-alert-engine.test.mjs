import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluatePriceRule as evaluate, validateRule } from './price-alert-engine.mjs';
const base = { userId: 'owner-a', id: 'rule-1', revision: 1, instrumentId: 'BTC-USD', currency: 'USD', direction: 'above', threshold: '100', repeat: true, cooldownMs: 1000, enabled: true };
const quote = (price, time, extra = {}) => ({ instrumentId: 'BTC-USD', currency: 'USD', price, asOfMs: time, source: 'fixture', ...extra });
const run = (price, time, state = null, rule = base, extra = {}) => evaluate(rule, state, quote(price, time, extra), { nowMs: time });
test('baseline does not notify even when already above target', () => {
  assert.equal(run('110', 1000).reason, 'baseline');
  assert.equal(run('110', 1000).event, null);
});
test('crosses at equality, then suppresses repeated quotes beyond threshold', () => {
  const first = run('99', 1000);
  const crossed = run('100', 2000, first.state);
  assert.equal(crossed.reason, 'crossed');
  assert.equal(crossed.event.userId, 'owner-a');
  assert.equal(run('110', 3000, crossed.state).event, null);
  assert.equal(run('100', 2000, crossed.state).reason, 'duplicate_or_out_of_order');
});
test('downward and one-shot rules', () => {
  const rule = { ...base, direction: 'below', repeat: false };
  let state = run('101', 1000, null, rule).state;
  const fired = run('100', 2000, state, rule);
  assert.equal(fired.reason, 'crossed');
  state = run('110', 3000, fired.state, rule).state;
  assert.equal(run('90', 4000, state, rule).reason, 'completed');
});
test('repeat requires leaving threshold and respects cooldown', () => {
  let state = run('99', 1000).state;
  state = run('101', 2000, state).state;
  state = run('99', 2100, state).state;
  const suppressed = run('101', 2200, state);
  assert.equal(suppressed.reason, 'cooldown');
  state = run('99', 3000, suppressed.state).state;
  assert.equal(run('101', 3100, state).reason, 'crossed');
});
test('stale, future, out of order, mismatched and malformed quotes never fire', () => {
  const state = run('99', 1000).state;
  for (const q of [quote('101', 2000), quote('101', 200000)]) {
    assert.equal(evaluate(base, state, q, { nowMs: 100000 }).event, null);
  }
  assert.equal(run('101', 900, state).reason, 'duplicate_or_out_of_order');
  for (const extra of [{ currency: 'COP' }, { instrumentId: 'OTHER' }]) {
    assert.equal(run('101', 2000, state, base, extra).event, null);
  }
  for (const price of ['NaN', '1,000', '0', '-1', '1e3', 101]) {
    assert.equal(run(price, 2000, state).reason, 'invalid_price');
  }
});
test('edited rules and different accounts cannot inherit crossing state', () => {
  const state = run('99', 1000).state;
  for (const rule of [{ ...base, revision: 2 }, { ...base, userId: 'owner-b' }, { ...base, threshold: '90' }]) {
    assert.equal(run('101', 2000, state, rule).reason, 'baseline');
  }
});
test('independent topes and deterministic event identifiers', () => {
  const state = run('99', 1000).state;
  assert.deepEqual(run('101', 2000, state).event, run('101', 2000, state).event);
  const other = { ...base, id: 'rule-2', threshold: '120' };
  assert.equal(run('101', 2000, run('99', 1000, null, other).state, other).event, null);
});
test('decimal comparison does not round through binary floating point', () => {
  const rule = { ...base, threshold: '9007199254740993.000000000001' };
  const state = run('9007199254740993', 1000, null, rule).state;
  assert.equal(run(rule.threshold, 2000, state, rule).reason, 'crossed');
});
test('paused and invalid rules', () => {
  assert.equal(run('101', 1000, null, { ...base, enabled: false }).reason, 'paused');
  for (const change of [{ threshold: '0' }, { revision: 0 }, { currency: 'usd' }, { cooldownMs: -1 }]) {
    assert.throws(() => validateRule({ ...base, ...change }), TypeError);
  }
});
