(function(){
  'use strict';

  const SUPABASE_URL = 'https://japjyiccjwnhbfpwqtti.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_d0I6KVZFmyxg4EiyRExVNw_HoeDHPOs';
  const TOKEN_KEY = 'veyra_admin_access_token';

  function getAccessToken(){ return sessionStorage.getItem(TOKEN_KEY) || ''; }
  function hasSession(){ return !!getAccessToken(); }
  function clearSession(){ sessionStorage.removeItem(TOKEN_KEY); }

  async function isAuthorized(token){
    const response = await fetch(SUPABASE_URL + '/rest/v1/rpc/is_veyra_data_admin', {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: '{}'
    });
    if(!response.ok) return false;
    return (await response.json()) === true;
  }

  async function signIn(email, password){
    clearSession();
    const response = await fetch(SUPABASE_URL + '/auth/v1/token?grant_type=password', {
      method: 'POST',
      headers: {'apikey': SUPABASE_KEY, 'Content-Type': 'application/json'},
      body: JSON.stringify({email: String(email || '').trim(), password: String(password || '')})
    });
    const payload = await response.json().catch(() => ({}));
    if(!response.ok || !payload.access_token) throw new Error('Correo o contraseña incorrectos.');
    if(!(await isAuthorized(payload.access_token))) throw new Error('Esta cuenta no está autorizada para este panel.');
    sessionStorage.setItem(TOKEN_KEY, payload.access_token);
    return true;
  }

  async function ensureAdmin(){
    const token = getAccessToken();
    if(!token) return false;
    try{
      if(!(await isAuthorized(token))){ clearSession(); return false; }
      return true;
    }catch(_error){ return false; }
  }

  async function signOut(){
    const token = getAccessToken();
    clearSession();
    if(!token) return;
    try{
      await fetch(SUPABASE_URL + '/auth/v1/logout', {
        method: 'POST',
        headers: {'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + token}
      });
    }catch(_error){}
  }

  function loginUrl(next){
    const allowed = new Set(['training-dashboard.html','presolo-instructor-dashboard.html','internal-access.html']);
    const target = allowed.has(next) ? next : 'internal-access.html';
    return './internal-admin-login.html?next=' + encodeURIComponent(target);
  }

  window.VeyraAdminAuth = Object.freeze({getAccessToken,hasSession,clearSession,signIn,ensureAdmin,signOut,loginUrl});
})();
