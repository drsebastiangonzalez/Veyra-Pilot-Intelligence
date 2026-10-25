(() => {
  'use strict';
  const auth = 'https://ogdncxrhdnnpphvuhvpf.supabase.co/auth/v1';
  // Public client key, identical to the mobile project's web recovery page.
  const apiKey = 'sb_publishable_sMiuK0h-FlN0LKyiEmgRWQ_oY9MTGvL';
  const el = id => document.getElementById(id);
  const button = el('verify');
  const appLink = el('open-app');
  let tokenHash = new URLSearchParams(window.location.hash.slice(1)).get('token_hash') || '';
  let busy = false;
  let active = true;
  // No tokens in server logs, referrers, storage, or the visible URL after load.
  window.history.replaceState(null, '', window.location.pathname);
  const setState = (state, title, message, help, symbol) => {
    document.body.className = state;
    el('title').textContent = title;
    el('message').textContent = message;
    el('help').textContent = help;
    el('symbol').textContent = symbol;
  };
  const invalid = () => {
    tokenHash = '';
    button.hidden = true;
    appLink.hidden = true;
    setState('error', 'Necesitas un enlace vigente',
      'Este enlace no está disponible, ya fue utilizado o ha caducado.',
      'Si ya confirmaste tu correo, abre Veyra e inicia sesión con tu contraseña. Si no puedes entrar, vuelve a la pantalla de verificación y pulsa «Reenviar enlace».', '!');
  };
  async function request(path, options) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      return await fetch(auth + path, {
        ...options, signal: controller.signal, credentials: 'omit',
        cache: 'no-store', referrerPolicy: 'no-referrer'
      });
    } finally { clearTimeout(timeout); }
  }
  button.addEventListener('click', async () => {
    if (busy || !tokenHash) return;
    busy = true;
    button.disabled = true;
    button.textContent = 'Verificando…';
    let result;
    try {
      const response = await request('/verify', {
        method: 'POST',
        headers: { apikey: apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({ token_hash: tokenHash, type: 'email' })
      });
      if (!active) return;
      if (response.status === 429 || response.status >= 500) throw new Error('retry');
      if (!response.ok) { invalid(); return; }
      result = await response.json();
      tokenHash = '';
      // Success must come from Auth's verification response, not a URL flag.
      if (!result.user || !result.user.email_confirmed_at) { invalid(); return; }
      button.hidden = true;
      appLink.hidden = false;
      setState('success', '¡Tu cuenta ya está habilitada!',
        'Correo verificado. Ya puedes iniciar sesión con el correo y la contraseña que elegiste al registrarte.',
        'Pulsa el botón para volver a la app. Si el navegador no la abre, abre Veyra desde la pantalla de inicio. No necesitas esperar otro correo.', '✓');
    } catch (_) {
      if (!active) return;
      setState('error', 'No pudimos comprobar tu correo',
        'Comprueba tu conexión e inténtalo de nuevo.',
        'Si la confirmación se completó antes de interrumpirse la conexión, podrás iniciar sesión en Veyra. De lo contrario, solicita un nuevo enlace desde la app.', '!');
      button.hidden = !tokenHash;
    } finally {
      // Revoke only this temporary browser session; never global app sessions.
      const accessToken = result && result.access_token;
      result = null;
      if (accessToken) {
        void request('/logout?scope=local', {
          method: 'POST', headers: { apikey: apiKey, Authorization: 'Bearer ' + accessToken }
        }).catch(() => {});
      }
      busy = false;
      button.disabled = false;
      button.textContent = 'Confirmar mi correo';
    }
  });
  window.addEventListener('pagehide', () => { active = false; tokenHash = ''; });
  window.addEventListener('pageshow', event => { if (event.persisted) { active = true; invalid(); } });
  if (!/^[a-f0-9]{32,128}$/i.test(tokenHash)) { invalid(); return; }
  button.hidden = false;
  setState('ready', 'Confirma tu correo',
    'Solo falta este paso para habilitar tu cuenta de Veyra.',
    'Pulsa «Confirmar mi correo». Después podrás entrar a la app con la contraseña que elegiste al registrarte.', '✉');
})();
