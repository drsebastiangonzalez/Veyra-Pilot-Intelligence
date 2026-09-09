/* Account-scoped cloud drafts. No guide, credentials or observations in browser storage. */
globalThis.FTCreateSessionStore=(db,userId)=>{
  const table='veyra_flight_training_sessions';
  let row=null,readState=null,restoreState=null,baseline='',timer=null,running=null,dirty=false,stopped=false,conflict=false;
  const $=id=>document.getElementById(id),copy=x=>JSON.parse(JSON.stringify(x));
  const t=s=>globalThis.FTLocale?.t(s)||s;
  function status(message){if($('cloudStatus'))$('cloudStatus').textContent=t(message);}
  function snapshot(){return readState?copy(readState()):null;}
  function hasWork(p){return p&&(p.records?.length||Object.values(p.drafts||{}).some(d=>d.text?.trim()||d.intervention?.trim()||d.competencies?.length));}
  function query(){return db.from(table);}
  function guard(){if(stopped)throw Error('La sesión cambió. Vuelve a entrar.');}
  function validate(p){
    if(!p||p.schema!==1||!Array.isArray(p.records)||!p.drafts||!['eval1','eval2'].includes(p.evaluation)||!['s1','s2','s3'].includes(p.scenario)||!['CM1','CM2'].includes(p.person))throw Error('No se puede recuperar esta evaluación. Descarga tus datos actuales antes de continuar.');
    return p;
  }
  function heading(resetTitle=true){if(resetTitle&&$('sessionTitle'))$('sessionTitle').value=row?.title||'';if($('archiveSession'))$('archiveSession').disabled=!row;}
  async function persist(){
    guard();const p=snapshot();if(!p)return true;
    const title=($('sessionTitle')?.value.trim()||row?.title||'Flight Training · '+new Date().toLocaleDateString()).slice(0,120);
    const encoded=JSON.stringify({payload:p,title});
    if(encoded===baseline){dirty=false;return true;}
    if(!row&&!hasWork(p)){dirty=false;return true;}
    if(conflict){status('Hay otra versión. Guarda una copia para no sobrescribirla.');return false;}
    dirty=true;status('Guardando…');
    const changes={title,payload:p,updated_at:new Date().toISOString()};
    const result=row?await query().update({...changes,revision:row.revision+1}).eq('id',row.id).eq('user_id',userId).eq('revision',row.revision).select('id,title,revision,status').maybeSingle():await query().insert({...changes,id:crypto.randomUUID(),user_id:userId,status:'draft',revision:1}).select('id,title,revision,status').single();
    guard();if(result.error)throw Error('No se pudo guardar. Conserva esta página abierta o descarga los datos.');
    if(!result.data){conflict=true;status('Hay otra versión. Guarda una copia para no sobrescribirla.');return false;}
    row=result.data;baseline=encoded;dirty=JSON.stringify({payload:snapshot(),title:($('sessionTitle')?.value.trim()||row.title).slice(0,120)})!==baseline;
    heading(false);status(dirty?'Cambios pendientes':'Guardado en tu cuenta');return !dirty;
  }
  async function flush(){
    clearTimeout(timer);if(stopped)return false;
    if(running){await running;return stopped?false:flush();}
    running=(async()=>{try{let ok=await persist();if(!ok&&!conflict)ok=await persist();return ok;}catch(e){dirty=true;status(e.message);return false;}})();
    try{return await running;}finally{running=null;}
  }
  function changed(){
    if(!readState||stopped)return;
    const p=snapshot(),title=($('sessionTitle')?.value.trim()||row?.title||'').slice(0,120);
    if(!row&&!hasWork(p))return;
    if(JSON.stringify({payload:p,title})===baseline)return;
    dirty=true;status('Cambios pendientes');clearTimeout(timer);timer=setTimeout(flush,900);
  }
  async function initialize(){
    const {data,error}=await query().select('id,title,payload,revision,status').eq('user_id',userId).eq('status','draft').order('updated_at',{ascending:false}).limit(1).maybeSingle();
    guard();if(error)throw Error('No se pudieron recuperar tus evaluaciones. Vuelve a intentar; no se ha creado un borrador vacío.');
    if(data){validate(data.payload);row=data;baseline=JSON.stringify({payload:data.payload,title:data.title});}
    return data?.payload||null;
  }
  function bind(getState,restore){readState=getState;restoreState=restore;heading();status(row?'Evaluación recuperada de tu cuenta':'Sin cambios pendientes');
    $('sessionTitle').oninput=changed;$('saveSession').onclick=flush;
    $('newSession').onclick=async()=>{if(!await flush())return;row=null;baseline='';conflict=false;restoreState(null);heading();status('Nueva evaluación');};
    $('copySession').onclick=async()=>{if(running)await running;if(stopped)return;row=null;baseline='';conflict=false;await flush();};
    $('archiveSession').onclick=async()=>{
      if(!await flush()||!row)return;
      const before=JSON.stringify(snapshot());
      const {data,error}=await query().update({status:'archived',revision:row.revision+1,updated_at:new Date().toISOString()}).eq('id',row.id).eq('user_id',userId).eq('revision',row.revision).select('id').maybeSingle();
      if(stopped)return;
      if(error||!data){status('No se pudo archivar. Recarga el historial antes de intentar otra vez.');return;}
      row=null;baseline='';if(JSON.stringify(snapshot())!==before){heading(false);changed();return;}restoreState(null);heading();status('Evaluación archivada');
    };
    $('mySessions').onclick=()=>showHistory(0);$('closeHistory').onclick=()=>$('sessionHistory').hidden=true;
    document.addEventListener('input',changed);document.addEventListener('change',changed);
    window.addEventListener('online',flush);
    document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')flush();});
  }
  async function showHistory(page){
    if(!await flush())return;
    const {data,error}=await query().select('id,title,status,updated_at').eq('user_id',userId).order('updated_at',{ascending:false}).range(page*10,page*10+10);
    if(stopped)return;if(error){status('No se pudo cargar el historial.');return;}
    const box=$('sessionList');box.replaceChildren();$('sessionHistory').hidden=false;
    for(const item of (data||[]).slice(0,10)){
      const button=document.createElement('button');button.type='button';button.className='saved-session';
      button.textContent=item.title+' · '+t(item.status==='draft'?'Borrador':'Archivada')+' · '+new Date(item.updated_at).toLocaleString();
      button.onclick=async()=>{
        if(!await flush())return;
        const before=JSON.stringify(snapshot());
        const {data:full,error}=await query().select('id,title,payload,revision,status').eq('id',item.id).eq('user_id',userId).single();
        if(stopped)return;
        if(JSON.stringify(snapshot())!==before){status('Hay cambios nuevos. Guarda antes de abrir otra evaluación.');return;}
        try{if(error||!full)throw Error('No se pudo recuperar la evaluación.');validate(full.payload);
          // Archived sessions reopen as a new draft; the original is retained.
          row=full.status==='archived'?null:full;baseline=row?JSON.stringify({payload:full.payload,title:full.title}):'';conflict=false;
          $('sessionTitle').value=full.title;restoreState(full.payload);$('sessionTitle').value=full.title;$('sessionHistory').hidden=true;heading();if(!row)$('sessionTitle').value=full.title;
          status(row?'Evaluación recuperada de tu cuenta':'Copia de evaluación archivada');
        }catch(e){status(e.message);}
      };box.append(button);
    }
    if(!data?.length)box.textContent=t('No hay evaluaciones guardadas.');
    $('previousSessions').disabled=page===0;$('nextSessions').disabled=data.length<=10;
    $('previousSessions').onclick=()=>showHistory(page-1);$('nextSessions').onclick=()=>showHistory(page+1);
  }
  return {initialize,bind,changed,flush,get pending(){return dirty||!!running;},stop(){stopped=true;clearTimeout(timer);readState=null;restoreState=null;row=null;baseline='';}};
};
