const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const code = fs.readFileSync(path.join(__dirname, '../confirmar-cuenta.js'), 'utf8');
const hash = 'a'.repeat(64);
function page(fragment, replies = []) {
  const nodes = Object.fromEntries(['verify','open-app','title','message','help','symbol'].map(id => [id, {
    hidden: ['verify','open-app'].includes(id), disabled: false, textContent: '',
    listeners: {}, addEventListener(type, fn) { this.listeners[type] = fn; }
  }]));
  const calls = [];
  const events = {};
  let cleanURL;
  const window = { location: { hash: fragment, pathname: '/confirmar-cuenta.html' },
    history: { replaceState(_,__,url) { cleanURL = url; } },
    addEventListener(type, fn) { events[type] = fn; } };
  vm.runInNewContext(code, { document: { getElementById: id => nodes[id], body: {} },
    window, URLSearchParams, AbortController, setTimeout, clearTimeout,
    fetch: async (url, options) => {
      calls.push({ url, options });
      const r = replies.shift();
      if (r instanceof Error) throw r;
      if (!r) throw new Error('Unexpected request');
      return { ok: r.status >= 200 && r.status < 300, status: r.status,
        json: async () => r.body };
    }
  });
  return { nodes, calls, events, cleanURL, click: () => nodes.verify.listeners.click() };
}
(async () => {
  for (const fragment of ['', '#success=true', '#token_hash=bad', '#access_token=fake']) {
    const p = page(fragment);
    assert.equal(p.nodes['open-app'].hidden, true);
    assert.equal(p.nodes.verify.hidden, true);
    assert.equal(p.calls.length, 0);
    assert.equal(p.cleanURL, '/confirmar-cuenta.html');
  }
  const p = page('#token_hash=' + hash, [
    { status: 200, body: { user: { email_confirmed_at: '2026-10-25T11:00:00Z' }, access_token: 'mock-session', refresh_token: 'not-stored' } },
    { status: 204 }
  ]);
  assert.equal(p.calls.length, 0, 'Do not consume the token on page load');
  await p.click();
  assert.match(p.nodes.title.textContent, /ya está habilitada/);
  assert.equal(p.nodes['open-app'].hidden, false);
  assert.equal(p.nodes.verify.hidden, true);
  assert.deepEqual(JSON.parse(p.calls[0].options.body), { token_hash: hash, type: 'email' });
  assert.equal(p.calls[0].url, 'https://ogdncxrhdnnpphvuhvpf.supabase.co/auth/v1/verify');
  assert.match(p.calls[1].url, /logout\?scope=local$/);
  await p.click();
  assert.equal(p.calls.length, 2, 'A confirmed token must not be reused');
  for (const reply of [
    { status: 403, body: { error_code: 'otp_expired' } },
    { status: 200, body: { user: {} } }
  ]) {
    const e = page('#token_hash=' + hash, [reply]);
    await e.click();
    assert.equal(e.nodes['open-app'].hidden, true);
    assert.match(e.nodes.title.textContent, /enlace vigente/);
  }
  for (const reply of [new Error('offline'), { status: 429 }, { status: 503 }]) {
    const e = page('#token_hash=' + hash, [reply]);
    await e.click();
    assert.equal(e.nodes['open-app'].hidden, true);
    assert.equal(e.nodes.verify.hidden, false);
    assert.equal(e.nodes.verify.disabled, false);
    assert.match(e.nodes.title.textContent, /No pudimos/);
  }
  const back = page('#token_hash=' + hash);
  back.events.pagehide();
  back.events.pageshow({ persisted: true });
  await back.click();
  assert.equal(back.calls.length, 0);
  assert.equal(back.nodes['open-app'].hidden, true);
  assert.doesNotMatch(code, /localStorage|sessionStorage|console\./);
  console.log('PASS: no premature success, verification, expiry, retries, URL cleanup, local logout and back navigation');
})();
