const PRODUCTS = Object.freeze({ BTC: 'BTC-USD', SOL: 'SOL-USD', ETH: 'ETH-USD' });
export class QuoteError extends Error {
  constructor(code, retryAfterSeconds = null) {
    super(code); this.name = 'QuoteError'; this.code = code;
    this.retryAfterSeconds = retryAfterSeconds;
  }
}
export function normalizeCoinbaseTicker(symbol, body, { nowMs = Date.now(), maxAgeMs = 60000 } = {}) {
  if (!Object.hasOwn(PRODUCTS, symbol)) throw new QuoteError('unsupported_instrument');
  if (!Number.isSafeInteger(nowMs) || !Number.isSafeInteger(maxAgeMs) || maxAgeMs <= 0) {
    throw new QuoteError('invalid_clock_policy');
  }
  if (!body || typeof body.price !== 'string' ||
      !/^(0|[1-9]\d{0,19})(\.\d{1,12})?$/.test(body.price) || !/[1-9]/.test(body.price)) {
    throw new QuoteError('invalid_price');
  }
  // Preserve source time; never replace it with the HTTP receipt time.
  if (typeof body.time !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,9})?Z$/.test(body.time)) {
    throw new QuoteError('invalid_timestamp');
  }
  const asOfMs = Date.parse(body.time);
  if (!Number.isSafeInteger(asOfMs) || asOfMs > nowMs + 5000 || nowMs - asOfMs > maxAgeMs) {
    throw new QuoteError('stale_or_future_quote');
  }
  return {
    instrumentId: PRODUCTS[symbol], currency: 'USD', price: body.price,
    asOfMs, source: 'Coinbase Exchange', sourceTime: body.time,
    quoteType: 'last_trade'
  };
}
export async function fetchCoinbaseQuote(symbol, {
  fetchImpl = globalThis.fetch, clock = Date.now, maxAgeMs = 60000, timeoutMs = 8000
} = {}) {
  if (!Object.hasOwn(PRODUCTS, symbol)) throw new QuoteError('unsupported_instrument');
  if (!Number.isSafeInteger(timeoutMs) || timeoutMs <= 0) throw new QuoteError('invalid_timeout');
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(
      'https://api.exchange.coinbase.com/products/' + PRODUCTS[symbol] + '/ticker',
      { headers: { Accept: 'application/json' }, redirect: 'error', signal: controller.signal }
    );
    if (!response.ok) {
      const retry = response.headers.get('retry-after');
      const seconds = retry && /^\d+$/.test(retry) ? Number(retry) : null;
      await response.body?.cancel();
      throw new QuoteError('provider_http_' + response.status,
        Number.isSafeInteger(seconds) ? seconds : null);
    }
    const body = await response.json();
    return normalizeCoinbaseTicker(symbol, body, { nowMs: clock(), maxAgeMs });
  } catch (error) {
    if (error instanceof QuoteError) throw error;
    throw new QuoteError(controller.signal.aborted ? 'provider_timeout' : 'provider_unavailable');
  } finally { clearTimeout(timer); }
}

/** One bounded fetch per distinct symbol; failures never become fabricated/stale prices. */
export async function fetchCryptoSnapshot(symbols, options = {}) {
  if (!Array.isArray(symbols) || symbols.some(s => !Object.hasOwn(PRODUCTS, s))) {
    throw new QuoteError('unsupported_instrument');
  }
  const entries = await Promise.all([...new Set(symbols)].map(async symbol => {
    try { return [symbol, { quote: await fetchCoinbaseQuote(symbol, options), error: null }]; }
    catch (error) { return [symbol, { quote: null, error: error.code ?? 'provider_unavailable',
      retryAfterSeconds: error.retryAfterSeconds ?? null }]; }
  }));
  return Object.fromEntries(entries);
}
