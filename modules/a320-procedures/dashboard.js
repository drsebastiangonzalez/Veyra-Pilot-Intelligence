(()=>{'use strict';
const $=id=>document.getElementById(id),db=window.supabase?.createClient('https://japjyiccjwnhbfpwqtti.supabase.co','sb_publishable_d0I6KVZFmyxg4EiyRExVNw_HoeDHPOs');
let userId=null,authorized=false,opening=false,generation=0;
const files={flows:['flows/index.html'],cockpit:['cockpit/index.html','cockpit/app.js','cockpit/three.js','cockpit/loader.js','cockpit/model-v75.gz.bin','cockpit/model-1.bin','cockpit/model-2.bin']};
function closeViewer(){generation++;$('moduleFrame').srcdoc='';$('viewer').hidden=true;document.body.style.overflow='';}
function locked(message){authorized=false;closeViewer();$('dashboard').hidden=true;$('access').hidden=false;$('status').textContent=message;}
async function checkAccess(){
 if(!db){locked('No se pudo conectar. Recarga la página.');return false;}
 const {data:{user},error}=await db.auth.getUser();
 if(error||!user){userId=null;locked('Inicia sesión con tu cuenta Veyra.');$('loginForm').hidden=false;$('logout').hidden=true;return false;}
 userId=user.id;$('logout').hidden=false;
 const {data,error:accessError}=await db.from('a320_procedures_access').select('active,expires_at').eq('user_id',user.id).maybeSingle();
 if(accessError){locked('No pudimos verificar tu acceso. Vuelve a intentar.');return false;}
 authorized=!!data?.active&&(!data.expires_at||Date.parse(data.expires_at)>Date.now());
 if(!authorized){locked('Tu cuenta todavía no tiene acceso activo a A320 Procedures & Operations.');$('loginForm').hidden=true;$('requestAccess').hidden=false;return false;}
 $('access').hidden=true;$('dashboard').hidden=false;$('requestAccess').hidden=true;return true;
}
$('loginForm').onsubmit=async e=>{e.preventDefault();if(!db)return;$('loginButton').disabled=true;$('status').textContent='Verificando…';try{const {error}=await db.auth.signInWithPassword({email:$('email').value.trim(),password:$('password').value});$('password').value='';if(error){$('status').textContent='Revisa tu correo y contraseña.';return;}await checkAccess();}catch{$('status').textContent='No hay conexión. Vuelve a intentar.';}finally{$('loginButton').disabled=false;}};
$('logout').onclick=async()=>{locked('Sesión cerrada.');await db.auth.signOut({scope:'local'});location.reload();};
$('closeViewer').onclick=closeViewer;
async function openModule(name){
 if(opening||!files[name])return;opening=true;const turn=++generation;
 document.querySelectorAll('[data-module]').forEach(b=>b.disabled=true);$('moduleStatus').textContent='Preparando tu recurso…';
 try{
  if(!await checkAccess()||turn!==generation)return;
  const {data,error}=await db.storage.from('a320-premium').createSignedUrls(files[name],900);
  if(error||!data||data.some(d=>d.error||!d.signedUrl))throw Error('El recurso todavía no está disponible. Intenta de nuevo más tarde.');
  const urls=Object.fromEntries(data.map(d=>[d.path.split('/').pop(),d.signedUrl]));
  const response=await fetch(urls['index.html'],{cache:'no-store'});if(!response.ok)throw Error('No se pudo abrir el recurso.');
  let html=await response.text();if(turn!==generation)return;
  const doc=new DOMParser().parseFromString(html,'text/html');
  if(name==='cockpit'){
   doc.querySelectorAll('script[src]').forEach(el=>{const key=el.getAttribute('src').split('?')[0];if(!urls[key])throw Error('Falta un archivo de la cabina.');el.setAttribute('src',urls[key]);});
   const config=doc.createElement('script');config.textContent='window.VEYRA_ASSETS='+JSON.stringify(urls).replace(/</g,'\\u003c')+';';doc.head.prepend(config);
  }else{
   // Keep progress separate for each signed-in account on this device.
   doc.querySelectorAll('script:not([src])').forEach(el=>{el.textContent=el.textContent.replace('const KEY="veyra.a320.flows.v1";',`const KEY=${JSON.stringify('veyra.a320.flows.v1.'+userId)};`);});
  }
  $('moduleFrame').srcdoc='<!doctype html>'+doc.documentElement.outerHTML;$('viewerTitle').textContent=name==='cockpit'?'Cabina A320':'Flow Patterns';$('viewer').hidden=false;document.body.style.overflow='hidden';$('moduleStatus').textContent='';
 }catch(e){$('moduleStatus').textContent=e.message||'No se pudo abrir el recurso.';}
 finally{opening=false;document.querySelectorAll('[data-module]').forEach(b=>b.disabled=false);}
}
document.querySelectorAll('[data-module]').forEach(b=>b.onclick=()=>openModule(b.dataset.module));
db?.auth.onAuthStateChange((event,session)=>{if(userId&&(!session||session.user.id!==userId))locked('Tu sesión cambió. Vuelve a entrar.');});
setInterval(()=>{if(authorized&&!document.hidden)checkAccess().catch(()=>locked('No pudimos verificar tu acceso.'));},60000);
checkAccess().catch(()=>locked('No pudimos verificar tu acceso. Recarga la página.'));
})();
