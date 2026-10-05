(() => {
  'use strict';
  // Same public project/key as the iOS app. No privileged credentials.
  const AUTH = 'https://ogdncxrhdnnpphvuhvpf.supabase.co/auth/v1';
  const KEY = 'sb_publishable_sMiuK0h-FlN0LKyiEmgRWQ_oY9MTGvL';
  const REDIRECT = 'https://veyrapilot.com/recuperar-app.html';
  const $ = id => document.getElementById(id);
  const requestForm = $('request-form');
  const passwordForm = $('password-form');
  const restart = $('restart');
  let accessToken = '';
  let busy = false;
  let cooldownUntil = 0;
  let cooldownTimer;

  // Capture only the required values and remove credentials before any request.
  const callback = (() => {
    const hash = new URLSearchParams(location.hash.slice(1));
    const query = new URLSearchParams(location.search);
    const result = {
      token: hash.get('access_token') || '',
      type: hash.get('type') || '',
      error: hash.has('error') || hash.has('error_code') || query.has('error') || query.has('error_code'),
      present: Boolean(location.hash || location.search)
    };
    history.replaceState(null, '', location.pathname);
    return result;
  })();

  function status(message, error = false) {
    $('status').textContent = message;
    $('status').dataset.error = String(error);
    $('status').hidden = !message;
  }
  function screen(title, intro, mode) {
    $('heading').textContent = title;
    $('intro').textContent = intro;
    requestForm.hidden = mode !== 'request';
    passwordForm.hidden = mode !== 'password';
    restart.hidden = mode !== 'invalid' && mode !== 'sent';
    $('heading').focus();
  }
  function invalid() {
    accessToken = '';
    passwordForm.reset();
    screen('Solicita un nuevo enlace', 'Este enlace no es válido, ya venció o la sesión de recuperación terminó. Solicita uno nuevo y abre el correo más reciente.', 'invalid');
    status('');
  }
  async function api(path, {method = 'GET', body, token = ''} = {}) {
    const headers = {apikey: KEY, 'Content-Type': 'application/json'};
    if (token) headers.Authorization = `Bearer ${token}`;
    const response = await fetch(AUTH + path, {
      method, headers, body: body ? JSON.stringify(body) : undefined,
      credentials: 'omit', cache: 'no-store', referrerPolicy: 'no-referrer',
      signal: AbortSignal.timeout(20000)
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error('Authentication request failed');
      error.status = response.status;
      error.code = data.error_code || data.code || '';
      throw error;
    }
    return data;
  }
  function tickCooldown() {
    const seconds = Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000));
    $('request-button').disabled = busy || seconds > 0;
    $('request-button').textContent = seconds > 0 ? `Podrás reenviar en ${seconds} s` : 'Enviar enlace de recuperación';
    if (!seconds) clearInterval(cooldownTimer);
  }
  function startCooldown() {
    cooldownUntil = Date.now() + 60000;
    clearInterval(cooldownTimer);
    tickCooldown();
    cooldownTimer = setInterval(tickCooldown, 1000);
  }
  restart.addEventListener('click', () => {
    if (busy) return;
    accessToken = '';
    passwordForm.reset();
    status('');
    screen('Recuperar contraseña', 'Ingresa el correo de tu cuenta en la app Veyra. Te enviaremos un enlace para elegir una nueva contraseña.', 'request');
    tickCooldown();
    $('email').focus();
  });
  requestForm.addEventListener('submit', async event => {
    event.preventDefault();
    if (busy || Date.now() < cooldownUntil || !requestForm.reportValidity()) return;
    busy = true;
    $('request-button').disabled = true;
    $('request-button').textContent = 'Enviando…';
    status('');
    try {
      await api('/recover?redirect_to=' + encodeURIComponent(REDIRECT), {
        method: 'POST', body: {email: $('email').value.trim()}
      });
      screen('Revisa tu correo', 'Si existe una cuenta asociada a ese correo, recibirás un enlace para cambiar la contraseña. Revisa también la carpeta de correo no deseado.', 'sent');
      status('Abre el correo más reciente y completa el cambio en este navegador.');
      startCooldown();
    } catch (error) {
      if (error.status === 429) {
        startCooldown();
        status('Has solicitado varios enlaces. Espera un minuto antes de volver a intentarlo.', true);
      } else {
        status('No pudimos solicitar el enlace. Comprueba tu conexión y vuelve a intentarlo.', true);
      }
    } finally {
      busy = false;
      tickCooldown();
    }
  });
  $('show-password').addEventListener('change', event => {
    for (const id of ['password', 'confirmation']) $(id).type = event.target.checked ? 'text' : 'password';
  });
  passwordForm.addEventListener('submit', async event => {
    event.preventDefault();
    if (busy || !passwordForm.reportValidity()) return;
    if (!accessToken) { invalid(); return; }
    if ($('password').value !== $('confirmation').value) {
      status('Las contraseñas no coinciden.', true);
      $('confirmation').focus();
      return;
    }
    busy = true;
    $('password-button').disabled = true;
    $('password-button').textContent = 'Guardando…';
    status('');
    try {
      const token = accessToken;
      await api('/user', {method: 'PUT', token, body: {password: $('password').value}});
      accessToken = '';
      passwordForm.reset();
      screen('Contraseña actualizada', 'Vuelve a la app Veyra e inicia sesión con tu nueva contraseña.', 'done');
      status('El cambio se guardó correctamente. Ya puedes cerrar esta pestaña.');
      $('help').hidden = true;
      // Best effort: close only the recovery session; do not sign out other devices.
      void api('/logout?scope=local', {method: 'POST', token}).catch(() => {});
    } catch (error) {
      if (error.status === 401 || error.status === 403) invalid();
      else if (error.code === 'same_password') status('Elige una contraseña diferente de la anterior.', true);
      else if (error.code === 'weak_password') status('Elige una contraseña más segura, con mayúsculas, minúsculas, números y símbolos.', true);
      else if (error.status === 429) status('Demasiados intentos. Espera un minuto y vuelve a guardar.', true);
      else status('No pudimos confirmar el cambio. Comprueba tu conexión y vuelve a intentarlo.', true);
    } finally {
      busy = false;
      $('password-button').disabled = false;
      $('password-button').textContent = 'Guardar nueva contraseña';
    }
  });
  async function initialize() {
    if (callback.error || (callback.present && (!callback.token || callback.type !== 'recovery'))) {
      callback.token = '';
      invalid();
      return;
    }
    if (!callback.token) return;
    accessToken = callback.token;
    callback.token = '';
    screen('Verificando enlace…', 'Estamos comprobando tu enlace de recuperación.', 'loading');
    try {
      const user = await api('/user', {token: accessToken});
      if (!user.id || !accessToken) { invalid(); return; }
      screen('Elige tu nueva contraseña', 'Guarda una contraseña nueva para tu cuenta de Veyra.', 'password');
      $('password').focus();
    } catch {
      invalid();
    }
  }
  window.addEventListener('pagehide', () => {
    accessToken = '';
    callback.token = '';
    passwordForm.reset();
  });
  window.addEventListener('pageshow', event => { if (event.persisted) location.reload(); });
  // No localStorage, sessionStorage, analytics or token logging.
  void initialize();
})();
