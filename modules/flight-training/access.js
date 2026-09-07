(() => {
'use strict';
const $=id=>document.getElementById(id);
const db=window.supabase?.createClient("https://japjyiccjwnhbfpwqtti.supabase.co","sb_publishable_d0I6KVZFmyxg4EiyRExVNw_HoeDHPOs",{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}});
let started=false,activeUser=null,generation=0,opening=false;
function resize(){if(window.parent!==window)window.parent.postMessage({type:'veyra:flight-height',height:Math.ceil(document.body.getBoundingClientRect().height)},window.location.origin);}
new ResizeObserver(resize).observe(document.body);
window.addEventListener('veyra:layout',resize);
function login(message=''){
  $('accessView').hidden=false;$('trainingSurface').hidden=true;$('accessLoading').hidden=true;$('accessError').hidden=true;$('loginForm').hidden=false;$('loginStatus').textContent=message;resize();
}
function fail(message){
  $('accessView').hidden=false;$('trainingSurface').hidden=true;$('accessLoading').hidden=true;$('loginForm').hidden=true;$('accessError').hidden=false;$('accessMessage').textContent=message;resize();
}
async function open(){
  if(opening)return;
  if(!db){fail('No se pudo cargar la conexión. Comprueba internet y vuelve a intentar.');return;}
  opening=true;const turn=++generation;
  $('accessLoading').hidden=false;$('accessError').hidden=true;$('loginForm').hidden=true;
  try{
    const {data:sessionData,error:sessionError}=await db.auth.getSession();
    if(turn!==generation)return;
    if(sessionError||!sessionData.session){login('');return;}
    const {data:userData,error:userError}=await db.auth.getUser();
    if(turn!==generation)return;
    if(userError||!userData.user){login('Tu sesión terminó. Vuelve a entrar con tu cuenta de Control VOA.');return;}
    const {data,error}=await db.from('veyra_flight_training_guides').select('id,version,payload').eq('id','flight-training-evals').maybeSingle();
    if(turn!==generation)return;
    if(error)throw Error('No se pudo cargar el contenido. Comprueba la conexión y vuelve a intentar.');
    if(!data){fail('Esta cuenta no tiene acceso a Flight Training. Usa la cuenta administradora de Control VOA.');return;}
    if(!data.payload?.evals?.eval1||!data.payload?.evals?.eval2||!Array.isArray(data.payload.pages))throw Error('La guía no está disponible en un formato válido.');
    window.FTGuide=data.payload;activeUser=userData.user.id;
    $('accessView').hidden=true;$('trainingSurface').hidden=false;
    $('sessionStatus').textContent='Sesión de Veyra activa';
    if(!started){window.VeyraFlightTrainingStart();started=true;}
    resize();
  }catch(error){if(turn===generation)fail(error.message||'No fue posible abrir el módulo.');}
  finally{opening=false;$('loginButton').disabled=false;$('loginButton').textContent='Continuar';}
}
$('loginForm').onsubmit=async event=>{
  event.preventDefault();if(!db)return;
  const password=$('loginPassword').value,email=$('loginEmail').value.trim();
  $('loginButton').disabled=true;$('loginButton').textContent='Entrando…';$('loginStatus').textContent='';
  try{
    const {error}=await db.auth.signInWithPassword({email,password});
    $('loginPassword').value='';
    if(error){login('No pudimos iniciar sesión. Revisa tu correo y contraseña.');return;}
    await open();
  }catch{login('No hay conexión. Vuelve a intentar.');}
  finally{$('loginButton').disabled=false;$('loginButton').textContent='Continuar';}
};
$('retryButton').onclick=open;
$('changeAccountButton').onclick=()=>login('');
$('logoutButton').onclick=async()=>{
  if(!confirm('¿Cerrar sesión? Descarga antes las observaciones que quieras conservar.'))return;
  await db.auth.signOut({scope:'local'});window.location.reload();
};
db?.auth.onAuthStateChange((event,session)=>{
  // Do not await Supabase calls in its auth callback.
  if(started&&(!session||session.user.id!==activeUser)){
    generation++;window.FTGuide=null;
    $('trainingSurface').replaceChildren();window.location.reload();
  }
});
document.addEventListener('visibilitychange',()=>{
  if(document.visibilityState==='visible'&&started&&!opening)open();
});
open();
})();