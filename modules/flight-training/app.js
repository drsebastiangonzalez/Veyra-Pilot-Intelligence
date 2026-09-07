globalThis.VeyraFlightTrainingStart = () => {
  'use strict';
  const G=FTGuide, A=FTAssistant, $=id=>document.getElementById(id);
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const state={evaluation:'eval1',scenario:'s1',index:0,screen:'home',drafts:{},records:{},positions:{},started:{},alias:''};
  const hints=G.instructorHints || {};
  function sessionKey(){return state.evaluation+':'+(state.evaluation==='eval2'?state.scenario:'common');}
  function sequence(){return A.events(G,state.evaluation,state.scenario);}
  function key(event){return sessionKey()+':'+event.id;}
  function current(){return sequence()[state.index];}
  function draft(event){return state.drafts[key(event)]??={original:'',corrected:'',analysis:null,checked:[],phase:event.mode};}
  function toast(message){$('toast').textContent=message;$('toast').classList.add('visible');clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('toast').classList.remove('visible'),5000);}
  function capture(){
    if(state.screen!=='event'||!current())return;
    const d=draft(current().event);
    if($('rawNote'))d.original=$('rawNote').value;
    if($('phase'))d.phase=$('phase').value;
    if($('correctedNote'))d.corrected=$('correctedNote').value;
    if($('candidateList'))d.checked=[...document.querySelectorAll('[data-candidate]:checked')].map(x=>Number(x.dataset.candidate));
  }
  function navigation(){
    document.querySelectorAll('[data-eval]').forEach(b=>{b.classList.toggle('active',b.dataset.eval===state.evaluation);b.setAttribute('aria-pressed',b.dataset.eval===state.evaluation);});
    $('scenarioBlock').hidden=state.evaluation!=='eval2';
    $('scenario').value=state.scenario;
    $('recordCount').textContent=Object.keys(state.records).length;
    $('eventNav').innerHTML=sequence().map(({event},i)=>'<button class="event-link '+(state.screen==='event'&&state.index===i?'current ':'')+(state.records[key(event)]?'done':'')+'" data-event="'+i+'" type="button"><span class="number">'+(i+1)+'</span><span>'+esc(event.title.replace(/^Escenario \d · /,''))+'</span></button>').join('');
    document.querySelectorAll('[data-event]').forEach(b=>b.onclick=()=>{capture();state.index=Number(b.dataset.event);state.screen='event';state.started[sessionKey()]=true;render();});
    $('viewTitle').textContent=state.screen==='summary'?'Revisión de observaciones':G.evals[state.evaluation].label;
    $('eyebrow').textContent=state.screen==='summary'?'EVALUACIÓN DEL INSTRUCTOR':'FLIGHT TRAINING · INSTRUCTOR';
  }
  function render(){
    navigation();
    if(state.screen==='home')home();
    else if(state.screen==='summary')summary();
    else eventView();
    $('workspace').focus({preventScroll:true});
    window.dispatchEvent(new Event('veyra:layout'));
    if(window.parent!==window)window.parent.postMessage({type:'veyra:flight-top'},window.location.origin);
  }
  function home(){
    const evaluation=G.evals[state.evaluation], count=sequence().length;
    $('view').innerHTML='<section class="card intro"><p class="step-label">Empieza aquí</p><h2>Observa al instructor.<br>El asistente te ayuda a documentarlo.</h2><p class="lead">'+count+' eventos guiados · '+esc(evaluation.route)+'</p><div class="flow"><span><strong>1</strong> Lee qué observar</span><span><strong>2</strong> Escribe la evidencia</span><span><strong>3</strong> Revisa y confirma</span></div><button type="button" id="startButton" class="primary">Comenzar '+esc(evaluation.label)+'</button><p class="notehelp">No necesitas llenar una ficha antes de empezar.</p><details><summary>Datos de la sesión</summary><label for="instructorAlias">Instructor evaluado (opcional)</label><input id="instructorAlias" maxlength="60" placeholder="Ej. Instructor A" value="'+esc(state.alias)+'"><p class="micro">Puedes comenzar sin completar este campo. Las asociaciones sugeridas requieren tu revisión.</p></details></section>';
    $('startButton').onclick=()=>{state.screen='event';state.started[sessionKey()]=true;state.index=state.positions[sessionKey()]||0;render();};
    $('instructorAlias').oninput=e=>state.alias=e.target.value;
  }
  function list(items){return '<ul>'+(items||[]).map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>';}
  function table(rows){return '<table>'+rows.map(([a,b])=>'<tr><td>'+esc(a)+'</td><td>'+esc(b)+'</td></tr>').join('')+'</table>';}
  function guideDetails(page,event){
    const setupPage=G.pages.find(p=>p.eval===state.evaluation&&p.setup);
    return '<details><summary>Ver guía del evento y configuración</summary><div class="reference"><p class="micro">Referencia del evento. Verifica los datos técnicos antes de una sesión real.</p><h3>Desarrollo del evento</h3>'+list(event.development)+'<details><summary>Foco del piloto en la guía original (solo contexto)</summary>'+list(event.focus)+'<p>Estos focos no asignan competencias al instructor.</p></details><h3>Training Elements</h3><div class="chips">'+(event.elements||[]).map(x=>'<span class="chip">'+esc(x)+'</span>').join('')+'</div>'+(page.cautions?'<h3>Precauciones de esta página</h3>'+list(page.cautions):'')+'<details><summary>Configuración general del EVAL</summary>'+table(setupPage.setup)+table(setupPage.comms)+list(setupPage.cautions)+'</details><details><summary>Catálogo completo de Training Elements</summary>'+table(G.elements)+'</details><p class="micro">Referencia: '+esc(page.source)+' · página '+page.number+'.</p></div></details>';
  }
  function eventView(){
    const items=sequence(),{page,event}=current(),d=draft(event),record=state.records[key(event)];
    state.positions[sessionKey()]=state.index;
    $('view').innerHTML='<div class="progress-head"><span>Evento '+(state.index+1)+' de '+items.length+'</span><span>'+esc(event.phase)+'</span></div><div class="progress"><span style="width:'+Math.round((state.index+1)/items.length*100)+'%"></span></div><section class="card event-card"><h2>'+esc(event.title.replace(/^Escenario \d · /,''))+'</h2><div class="observe"><strong>Qué observar del instructor</strong><p>'+esc(hints[event.id])+'</p></div>'+guideDetails(page,event)+'</section><section class="card"><div class="field-head"><label for="rawNote">¿Qué hizo o dijo el instructor?</label><button id="exampleButton" class="text-button" type="button">Ver un ejemplo</button></div><p id="example" class="micro" hidden>Ejemplo ficticio, no se incorpora al registro: “Durante el briefing, el instructor explicó los objetivos. Preguntó al alumno cómo resolvería la situación y escuchó su respuesta antes de dar retroalimentación”.</p><textarea id="rawNote" maxlength="4000" spellcheck="true" placeholder="Escribe libremente lo que observaste. El contexto del evento ya está seleccionado.">'+esc(d.original)+'</textarea><p class="notehelp">Describe una conducta. Evita quedarte solo en “bien”, “mal” o “tiene sesgo”.</p><details><summary>Ajustar fase de la observación</summary><label for="phase">Fase real</label><select id="phase">'+['MTV','EVAL','SBT'].map(x=>'<option'+(x===d.phase?' selected':'')+'>'+x+'</option>').join('')+'</select><p class="micro">Se precarga de la guía. Si hubo ayuda o intervención, describe su efecto en la misma observación.</p></details><div class="button-row"><button id="analyzeButton" class="primary" type="button">Mejorar texto y sugerir competencias</button></div><p class="notehelp">Corrección básica y reglas locales. No se envía tu nota a una IA externa.</p>'+(record?'<p class="saved">Ya tienes una observación confirmada aquí. Una nueva confirmación actualizará este evento.</p>':'')+'</section><div id="analysisPanel"></div><div class="button-row"><button id="previousButton" type="button"'+(state.index===0?' disabled':'')+'>Anterior</button><button id="pendingButton" class="text-button" type="button">Dejar pendiente y continuar</button></div>';
    $('exampleButton').onclick=()=>$('example').hidden=!$('example').hidden;
    $('rawNote').oninput=()=>{d.original=$('rawNote').value;d.analysis=null;d.checked=[];$('analysisPanel').replaceChildren();};
    $('phase').onchange=e=>d.phase=e.target.value;
    $('analyzeButton').onclick=()=>{
      capture();
      if(d.original.trim().length<8){toast('Escribe qué hizo o dijo el instructor para poder revisarlo.');$('rawNote').focus();return;}
      d.analysis=A.analyze(d.original);d.corrected=d.analysis.corrected;d.checked=[];d.needsReview=false;showAnalysis();$('analysisPanel').scrollIntoView({behavior:'smooth',block:'start'});
    };
    $('previousButton').onclick=()=>{capture();state.index--;render();};
    $('pendingButton').onclick=()=>{capture();advance();};
    if(d.analysis)showAnalysis();
  }
  function showAnalysis(){
    const {event}=current(),d=draft(event),a=d.analysis;
    if(!a)return;
    $('analysisPanel').innerHTML='<section class="card analysis"><p class="step-label">Revisa antes de confirmar</p><label for="correctedNote">Redacción propuesta</label><textarea id="correctedNote" maxlength="5000" spellcheck="true">'+esc(d.corrected)+'</textarea><p class="notehelp">Conservamos el original. Revisa tildes, tiempos verbales y significado; la corrección es básica.</p><button id="reanalyzeButton" class="text-button" type="button">Actualizar sugerencias con mi redacción</button><h3>Competencias del instructor sugeridas</h3><p class="micro">Marca solo las respaldadas por lo observado. Sin calificación automática.</p><div id="candidateList">'+a.candidates.map((c,i)=>'<label class="candidate"><span class="candidate-head"><input type="checkbox" data-candidate="'+i+'"'+(d.checked.includes(i)?' checked':'')+'><strong>'+esc(A.areas.find(x=>x[0]===c.area)[1])+'</strong></span><p class="micro">'+esc(c.behavior)+'</p><blockquote>'+esc(c.evidence)+'</blockquote></label>').join('')+'</div>'+a.warnings.map(w=>'<p class="warning">'+esc(w)+'</p>').join('')+'<details><summary>Sesgo y criterios de observación</summary><div class="reference"><p>Antes de concluir, contrasta qué evidencia recogió el instructor y qué criterio usó. Revisa si su juicio dependió de reputación, afinidad, una primera impresión o únicamente del último evento.</p><p>Una alerta invita a revisar; no demuestra sesgo. Tampoco la ausencia de alertas acredita objetividad. Las conductas sugeridas son orientaciones Veyra, no códigos OB oficiales.</p></div></details><div class="button-row"><button id="confirmButton" class="primary" type="button">Confirmar observación y continuar</button></div><p class="micro">Puedes conservar evidencia sin asociar una competencia.</p></section>';
    $('confirmButton').disabled=!!d.needsReview;
    $('correctedNote').oninput=()=>{d.corrected=$('correctedNote').value;d.checked=[];d.needsReview=true;document.querySelectorAll('[data-candidate]').forEach(x=>x.checked=false);$('confirmButton').disabled=true;$('reanalyzeButton').textContent='Actualizar sugerencias antes de confirmar';};
    $('reanalyzeButton').onclick=()=>{capture();if(!d.corrected.trim()){toast('La redacción no puede quedar vacía.');return;}const edited=d.corrected;d.analysis=A.analyze(edited);d.corrected=edited;d.checked=[];d.needsReview=false;showAnalysis();};
    $('confirmButton').onclick=()=>{
      capture();
      try{
        if(d.needsReview)throw Error('Actualiza las sugerencias después de editar la redacción.');
        const record=A.validateRecord({evaluation:state.evaluation,scenario:state.evaluation==='eval2'?state.scenario:'s1',eventId:event.id,target:'instructor',phase:d.phase,original:d.original,corrected:d.corrected,confirmed:d.checked.map(i=>d.analysis.candidates[i]),warnings:d.analysis.warnings,date:new Date().toISOString()},G);
        state.records[key(event)]=record;toast('Observación confirmada en esta sesión.');advance();
      }catch(error){toast(error.message);}
    };
  }
  function advance(){
    if(state.index<sequence().length-1){state.index++;state.screen='event';}
    else state.screen='summary';
    render();$('workspace').scrollIntoView({behavior:'smooth',block:'start'});
  }
  function summary(){
    const records=Object.values(state.records);
    $('view').innerHTML='<section class="card"><h2>Lo observado, sin convertirlo en una nota</h2><p class="statline">'+records.length+' observaciones confirmadas · EVAL 1: '+records.filter(r=>r.evaluation==='eval1').length+' · EVAL 2: '+records.filter(r=>r.evaluation==='eval2').length+'</p><p class="micro">Instructor evaluado: '+esc(state.alias||'Alias sin registrar')+'. Los eventos pendientes no equivalen a un resultado satisfactorio.</p><div class="button-row"><button id="continueButton" class="primary" type="button">Volver a '+esc(G.evals[state.evaluation].label)+'</button><button id="exportButton" type="button">Descargar borrador JSON</button><button id="textReportButton" type="button">Descargar informe de texto</button></div>'+(records.length?'':'<p class="empty">Todavía no has confirmado observaciones. Puedes volver al evento y revisar su propuesta.</p>')+records.map(r=>{
      const item=G.pages.flatMap(p=>p.events).find(e=>e.id===r.eventId);
      return '<article class="summary-record"><p class="step-label">'+esc(G.evals[r.evaluation].label)+(r.evaluation==='eval2'?' · Escenario '+esc(r.scenario.slice(1)):'')+' · '+esc(r.phase)+'</p><h3>'+esc(item.title)+'</h3><p class="record-text">'+esc(r.corrected)+'</p><div class="chips">'+(r.confirmed.length?r.confirmed.map(c=>'<span class="chip">'+esc(A.areas.find(a=>a[0]===c.area)[1])+'</span>').join(''):'<span class="micro">Sin asociación de competencia confirmada</span>')+'</div><details><summary>Original, evidencias y alertas</summary><p class="record-text">'+esc(r.original)+'</p>'+r.confirmed.map(c=>'<p class="micro">'+esc(c.behavior)+'<br>“'+esc(c.evidence)+'”</p>').join('')+r.warnings.map(w=>'<p class="warning">'+esc(w)+'</p>').join('')+'</details><button type="button" class="text-button" data-edit="'+esc(r.eventId)+'">Revisar este evento</button></article>';
    }).join('')+'<details><summary>Eventos pendientes del recorrido seleccionado</summary>'+list(sequence().filter(x=>!state.records[key(x.event)]).map(x=>x.event.title))+'</details><details><summary>Marco y límites</summary><div class="reference"><p>Estos cinco grupos sirven para organizar observaciones del instructor. Se mantienen separados de los focos de competencias del piloto en la guía.</p>'+list(A.areas.map(a=>a[1]))+'<p>Catálogo oficial de OB, escala y aprobación técnica: pendientes. No se calculan notas.</p><p>Referencia general: <a href="https://www.iata.org/en/training/courses/cbta-trainer-pilots/foc015veen02/en/" target="_blank" rel="noopener noreferrer">IATA · Formación de instructores y evaluadores</a>.</p></div></details></section>';
    $('continueButton').onclick=()=>{state.screen='event';render();};
    $('exportButton').onclick=exportJSON;$('textReportButton').onclick=exportText;
    document.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>{
      const r=records.find(x=>x.eventId===b.dataset.edit);state.evaluation=r.evaluation;state.scenario=r.scenario;state.index=sequence().findIndex(x=>x.event.id===r.eventId);state.screen='event';render();
    });
  }
  function download(text,name,type){
    const url=URL.createObjectURL(new Blob([text],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);
  }
  function exportJSON(){
    capture();download(JSON.stringify({version:'0.2',scope:'Evaluación del instructor · práctica',guideVersion:G.version,alias:state.alias,records:Object.values(state.records),drafts:state.drafts,official:false,exportedAt:new Date().toISOString()},null,2),'Veyra_Flight_Training_Borrador.json','application/json');toast('Descarga solicitada.');
  }
  function exportText(){
    const lines=['VEYRA · FLIGHT TRAINING','EVALUACIÓN DEL INSTRUCTOR · BORRADOR','Instructor: '+(state.alias||'Sin alias'),'Sin calificación oficial.',''];
    for(const r of Object.values(state.records)){
      lines.push(G.evals[r.evaluation].label+(r.evaluation==='eval2'?' · '+r.scenario:'')+' · '+r.phase,G.pages.flatMap(p=>p.events).find(e=>e.id===r.eventId).title,r.corrected,'Competencias confirmadas: '+(r.confirmed.map(c=>A.areas.find(a=>a[0]===c.area)[1]).join('; ')||'Ninguna'),...r.confirmed.map(c=>'Evidencia: '+c.evidence),'Original: '+r.original,...r.warnings.map(w=>'Por revisar: '+w),'');
    }
    download(lines.join('\n'),'Veyra_Flight_Training_Informe.txt','text/plain;charset=utf-8');
  }
  document.querySelectorAll('[data-eval]').forEach(b=>b.onclick=()=>{capture();state.evaluation=b.dataset.eval;state.index=state.positions[sessionKey()]||0;state.screen=state.started[sessionKey()]?'event':'home';render();});
  $('scenario').onchange=e=>{capture();state.scenario=e.target.value;state.index=state.positions[sessionKey()]||0;state.screen=state.started[sessionKey()]?'event':'home';render();};
  $('summaryButton').onclick=()=>{capture();state.screen='summary';render();};
  window.addEventListener('beforeunload',e=>{if(Object.values(state.drafts).some(d=>d.original.trim())){e.preventDefault();e.returnValue='';}});
  render();
};