/** Pure server-side price crossing evaluator; no fetching, scheduling or push delivery. */
const text = value => typeof value === 'string' && value.length > 0 && value.length <= 160;
function decimal(value) {
  if (typeof value !== 'string' || !/^(0|[1-9]\d{0,19})(\.\d{1,12})?$/.test(value)) {
    throw new TypeError('Prices must be positive decimal strings, without commas or exponents');
  }
  const [whole, fraction = ''] = value.split('.');
  const scaled = BigInt(whole) * 10n ** 12n + BigInt(fraction.padEnd(12, '0'));
  if (scaled <= 0n) throw new TypeError('Price must be greater than zero');
  return scaled;
}
function identity(rule) {
  return JSON.stringify([rule.userId, rule.id, rule.revision, rule.instrumentId,
    rule.currency, rule.direction, rule.threshold, rule.repeat, rule.cooldownMs]);
}
export function validateRule(rule) {
  if (!rule || ![rule.userId, rule.id, rule.instrumentId, rule.currency].every(text) ||
      !/^[A-Z]{3}$/.test(rule.currency) ||
      !Number.isSafeInteger(rule.revision) || rule.revision < 1 ||
      !['above', 'below'].includes(rule.direction) ||
      typeof rule.enabled !== 'boolean' || typeof rule.repeat !== 'boolean' ||
      !Number.isSafeInteger(rule.cooldownMs) || rule.cooldownMs < 0) {
    throw new TypeError('Invalid price rule');
  }
  decimal(rule.threshold);
}

/**
 * Caller must verify entitlement and ownership on the server before evaluating.
 * Atomically persist returned state and event with compare-and-swap and a unique event.key.
 * nowMs and maxAgeMs are worker configuration, never user supplied.
 */
export function evaluatePriceRule(rule, previous, quote, { nowMs, maxAgeMs = 60000 } = {}) {
  validateRule(rule);
  if (!Number.isSafeInteger(nowMs) || !Number.isSafeInteger(maxAgeMs) || maxAgeMs <= 0) {
    throw new TypeError('Invalid clock or freshness policy');
  }
  const unchanged = reason => ({ state: previous, event: null, reason });
  if (!rule.enabled) return unchanged('paused');
  if (!quote || quote.instrumentId !== rule.instrumentId || quote.currency !== rule.currency) {
    return unchanged('instrument_or_currency_mismatch');
  }
  if (!Number.isSafeInteger(quote.asOfMs) || quote.asOfMs > nowMs + 5000 ||
      nowMs - quote.asOfMs > maxAgeMs || !text(quote.source)) return unchanged('invalid_or_stale_quote');
  let price;
  try { price = decimal(quote.price); } catch { return unchanged('invalid_price'); }
  const scope = identity(rule);
  const old = previous?.scope === scope ? previous : null;
  if (old && quote.asOfMs <= old.lastQuoteAt) return unchanged('duplicate_or_out_of_order');
  const beyond = rule.direction === 'above' ? price >= decimal(rule.threshold) : price <= decimal(rule.threshold);
  const state = {
    scope, lastQuoteAt: quote.asOfMs, beyond,
    lastTriggeredAt: old?.lastTriggeredAt ?? null,
    completed: old?.completed ?? false
  };
  if (!old) return { state, event: null, reason: 'baseline' };
  if (state.completed) return { state, event: null, reason: 'completed' };
  if (old.beyond || !beyond) return { state, event: null, reason: 'no_crossing' };
  // A crossing during cooldown is suppressed, not queued for a later stale notification.
  if (state.lastTriggeredAt !== null && nowMs - state.lastTriggeredAt < rule.cooldownMs) {
    return { state, event: null, reason: 'cooldown' };
  }
  state.lastTriggeredAt = nowMs;
  state.completed = !rule.repeat;
  return {
    state, reason: 'crossed',
    event: {
      key: JSON.stringify([scope, quote.asOfMs]), userId: rule.userId,
      ruleId: rule.id, ruleRevision: rule.revision, instrumentId: rule.instrumentId,
      currency: rule.currency, direction: rule.direction, threshold: rule.threshold,
      price: quote.price, asOfMs: quote.asOfMs, source: quote.source
    }
  };
}
