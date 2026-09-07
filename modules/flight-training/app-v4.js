globalThis.VeyraFlightTrainingStart = () => {
  'use strict';
  const G=FTGuide,A=FTAssistant,$=id=>document.getElementById(id),catalog=A.catalogue(G);
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const state={evaluation:'eval1',scenario:'s1',index:0,screen:'event',person:'CM1',drafts:{},records:{},positions:{},aliases:{CM1:'',CM2:''}};
  const list=items=>'<ul>'+(items||[]).map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>';
  const table=rows=>'<table>'+(rows||[]).map(([a,b])=>'<tr><th>'+esc(a)+'</th><td>'+esc(b)+'</td></tr>').join('')+'</table>';
  const session=()=>state.evaluation+':'+(state.evaluation==='eval2'?state.scenario:'common');
  const sequence=()=>A.groups(G,state.evaluation,state.scenario);
  const current=()=>sequence()[state.index];
  const key=(group=current())=>session()+':'+group.id+':'+state.person;
  const role=()=>G.evals[state.evaluation].pf===state.person?'PF':'PM';
  const draft=()=>state.drafts[key()]??={original:'',corrected:'',analysis:null,checked:[],mode:current().items[0].event.mode,role:role(),intervention:'',needsReview:false};
  function toast(message){$('toast').textContent=message;$('toast').classList.add('visible');clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('toast').classList.remove('visible'),5000);}
  function capture(){
    if(state.screen!=='event')return;const d=draft();
    if($('rawNote'))d.original=$('rawNote').value;
    if($('correctedNote'))d.corrected=$('correctedNote').value;
    if($('candidateList'))d.checked=[...document.querySelectorAll('[data-candidate]:checked')].map(b=>Number(b.dataset.candidate));
    if($('intervention'))d.intervention=$('intervention').value;
  }
  function render(){
    document.querySelectorAll('[data-eval]').forEach(b=>{b.classList.toggle('active',b.dataset.eval===state.evaluation);b.setAttribute('aria-pressed',String(b.dataset.eval===state.evaluation));});
    $('scenarioBlock').hidden=state.evaluation!=='eval2';$('scenario').value=state.scenario;
    $('recordCount').textContent=Object.keys(state.records).length;
    $('viewTitle').textContent=state.screen==='summary'?'Resumen de la evaluación':G.evals[state.evaluation].label+(state.evaluation==='eval2'?' · Escenario '+state.scenario.slice(1):'');
    $('eyebrow').textContent='EVALUACIÓN DEL PILOTO';
    if(state.screen==='summary')summary();else eventView();
    window.dispatchEvent(new Event('veyra:layout'));
  }
  function move(index){capture();state.index=index;state.screen='event';state.positions[session()]=index;render();$('workspace').focus({preventScroll:true});if(window.parent!==window)window.parent.postMessage({type:'veyra:flight-top'},location.origin);}
  function setup(){
    const page=G.pages.find(p=>p.eval===state.evaluation&&p.setup);
    return '<details class="setup-panel"><summary>Configuración de la sesión · '+esc(G.evals[state.evaluation].route)+' · '+esc(G.evals[state.evaluation].pf)+' PF</summary><div class="reference">'+table(page.setup)+table(page.comms)+list(page.cautions)+'</div></details>';
  }
  function obDescription(code){const ob=catalog.find(x=>x.code===code);return ob?'<div class="planned-ob"><strong>'+esc(ob.competency)+' · OB '+esc(ob.code)+'</strong><span>'+esc(ob.text)+'</span></div>':'';}
  function eventView(){
    const group=current(),d=draft(),items=sequence(),planned=group.obPlan.map(code=>catalog.find(x=>x.code===code)).filter(Boolean),planCodes=[...new Set(planned.map(x=>x.competency))];
    const phaseNav=items.map((g,i)=>'<button type="button" data-step="'+i+'" aria-current="'+(i===state.index?'step':'false')+'" class="phase-button '+(i===state.index?'active':'')+'"><span>'+String(i+1).padStart(2,'0')+'</span>'+esc(g.title)+'</button>').join('');
    const development=group.items.map(({event},i)=>i?'<details><summary>'+esc(event.title)+'</summary>'+list(event.development)+'</details>':list(event.development)).join('');
    const focus=group.items.map(({event},i)=>i?'<details><summary>'+esc(event.title)+'</summary>'+list(event.focus)+'</details>':list(event.focus)).join('');
    const codes=group.codes.length?'<p class="micro">Competencias indicadas en la guía</p><div class="chips">'+group.codes.map(code=>'<span class="chip"><b>'+esc(code)+'</b> · '+esc(A.names[code]||code)+'</span>').join('')+'</div>':'';
    $('view').innerHTML='<nav class="phase-nav" aria-label="'+(state.evaluation==='eval1'?'Fases de EVAL 1':'Eventos del escenario')+'">'+phaseNav+'</nav>'+setup()+'<section class="card phase-card"><div class="phase-heading"><div><p class="step-label">'+(state.evaluation==='eval1'?'FASE':'EVENTO')+' '+(state.index+1)+' / '+items.length+'</p><h2>'+esc(group.title)+'</h2></div></div><div class="guide-columns"><section class="development-column"><h3>Session Development</h3><p class="column-caption">Cómo se desarrolla la sesión</p>'+development+'</section><section class="focus-column"><h3>Instructor Focus</h3><p class="column-caption">Qué observar y evaluar en los pilotos</p>'+codes+focus+'</section></div><div class="ob-plan"><div class="field-head"><h3>Competencias y OB para observar</h3><span class="micro">Catálogo Veyra</span></div><div class="chips">'+planCodes.map(c=>'<span class="chip">'+esc(c)+' · '+esc(A.names[c])+'</span>').join('')+'</div>'+(planned.length?'<div class="planned-list">'+group.obPlan.map(obDescription).join('')+'</div>':'<p class="micro">La guía no añade un evento ni un foco específico aquí. Puedes documentar lo observado y consultar el catálogo.</p>')+'<p class="micro plan-note">Estos OB orientan la observación. Se incorporan al informe únicamente cuando los vinculas con evidencia y los confirmas.</p></div></section><section class="card observation-card"><div class="subject-row"><div><label for="pilotPerson">Piloto estudiante</label><select id="pilotPerson">'+['CM1','CM2'].map(p=>'<option value="'+p+'"'+(state.person===p?' selected':'')+'>'+p+(state.aliases[p]?' · '+esc(state.aliases[p]):'')+'</option>').join('')+'</select></div><div><label for="pilotRole">Función observada</label><select id="pilotRole"><option'+(d.role==='PF'?' selected':'')+'>PF</option><option'+(d.role==='PM'?' selected':'')+'>PM</option></select></div><div><label for="sessionMode">Segmento</label><select id="sessionMode">'+['MTV','EVAL','SBT'].map(m=>'<option'+(d.mode===m?' selected':'')+'>'+m+'</option>').join('')+'</select></div></div><label for="rawNote">Observación del piloto estudiante</label><textarea id="rawNote" maxlength="6000" spellcheck="true" placeholder="Describe qué hizo u omitió el piloto, en qué momento y con qué resultado.">'+esc(d.original)+'</textarea><details><summary>Nombre e intervención del instructor (opcional)</summary><label for="pilotAlias">Nombre o alias de '+state.person+'</label><input id="pilotAlias" maxlength="80" value="'+esc(state.aliases[state.person])+'"><label for="intervention">Ayuda, instrucción o intervención durante el evento</label><textarea id="intervention" maxlength="1500" placeholder="Si intervino el instructor, describe la ayuda y su efecto en el desempeño observado.">'+esc(d.intervention)+'</textarea></details><div class="button-row"><button id="analyzeButton" class="primary" type="button">Revisar redacción y proponer OB</button><button id="catalogueButton" class="text-button" type="button">Consultar los 73 OB</button></div>'+(state.records[key()]?'<p class="saved">Hay una observación confirmada de este piloto en esta fase. Puedes revisarla y actualizarla.</p>':'')+'</section><div id="analysisPanel"></div><details id="cataloguePanel" class="card catalogue-panel"><summary>Catálogo de competencias y OB del piloto</summary><p class="micro">'+esc(G.pilotCatalogue?.note||'')+'</p><label for="obSearch">Buscar competencia, código o conducta</label><input id="obSearch" type="search" placeholder="Ej. FPA, 4.6, comunicación"><div id="catalogueResults"></div></details><div class="button-row step-actions"><button id="previousButton" type="button"'+(state.index===0?' disabled':'')+'>Anterior</button><button id="nextButton" type="button">'+(state.index===items.length-1?'Ver resumen':'Siguiente '+(state.evaluation==='eval1'?'fase':'evento'))+'</button></div><p class="micro export-reminder">Las observaciones permanecen durante esta sesión. Descarga el informe antes de cerrar.</p>';
    document.querySelectorAll('[data-step]').forEach(b=>b.onclick=()=>move(Number(b.dataset.step)));
    $('pilotPerson').onchange=e=>{capture();state.person=e.target.value;render();};
    $('pilotRole').onchange=e=>d.role=e.target.value;$('sessionMode').onchange=e=>d.mode=e.target.value;
    $('pilotAlias').oninput=e=>state.aliases[state.person]=e.target.value;
    $('rawNote').oninput=()=>{d.original=$('rawNote').value;d.analysis=null;d.checked=[];d.needsReview=false;$('analysisPanel').replaceChildren();};
    $('analyzeButton').onclick=()=>{capture();if(d.original.trim().length<8){toast('Escribe una observación del piloto.');return;}d.analysis=A.analyze(d.original,G,group);d.corrected=d.analysis.corrected;d.checked=[];d.needsReview=false;showAnalysis();$('analysisPanel').scrollIntoView({behavior:'smooth',block:'start'});};
    $('previousButton').onclick=()=>move(state.index-1);
    $('nextButton').onclick=()=>{capture();if(state.index<items.length-1)move(state.index+1);else{state.screen='summary';render();}};
    $('catalogueButton').onclick=()=>{$('cataloguePanel').open=true;$('cataloguePanel').scrollIntoView({behavior:'smooth'});};
    $('obSearch').oninput=renderCatalogue;renderCatalogue();
    if(d.analysis)showAnalysis();
  }
  function renderCatalogue(){
    const query=A.norm($('obSearch').value),found=catalog.filter(ob=>A.norm(ob.code+' '+ob.competency+' '+A.names[ob.competency]+' '+ob.text).includes(query));
    $('catalogueResults').innerHTML=found.map(ob=>'<div class="catalogue-ob"><div><strong>'+esc(ob.competency)+' · OB '+ob.code+'</strong><p>'+esc(ob.text)+'</p></div><button class="text-button" type="button" data-manual="'+ob.code+'">Vincular evidencia</button></div>').join('')||'<p>No hay coincidencias.</p>';
    document.querySelectorAll('[data-manual]').forEach(b=>b.onclick=()=>{
      capture();const d=draft();if(!d.analysis||d.needsReview){toast('Primero revisa la redacción de tu observación.');return;}
      const ob=catalog.find(o=>o.code===b.dataset.manual);
      if(d.analysis.candidates.some(c=>c.code===ob.code)){toast('Ese OB ya está en las propuestas.');return;}
      d.analysis.candidates.push({...ob,evidence:'',meaning:'Evidencia para revisar',planned:current().obPlan.includes(ob.code),manual:true});showAnalysis();$('analysisPanel').scrollIntoView({behavior:'smooth'});
    });
  }
  function showAnalysis(){
    const d=draft(),a=d.analysis;if(!a)return;
    const sentences=d.corrected.split(/(?<=[.!?;])\s+|,\s+/).filter(Boolean);
    $('analysisPanel').innerHTML='<section class="card analysis"><p class="step-label">REVISA Y CONFIRMA</p><label for="correctedNote">Redacción propuesta</label><textarea id="correctedNote" maxlength="7000" spellcheck="true">'+esc(d.corrected)+'</textarea><p class="micro correction-status">'+(a.changed?'Se ajustó la redacción. Comprueba que conserva lo que observaste.':'No se detectaron cambios de redacción con las reglas disponibles. Puedes editarla aquí.')+'</p><details><summary>Comparar con el texto original</summary><p class="record-text">'+esc(d.original)+'</p></details><button id="reanalyzeButton" class="text-button" type="button">Actualizar OB después de editar</button><h3>OB propuestos a partir de tu observación</h3><p class="micro">Cada propuesta muestra el descriptor y la frase que la respalda. Selecciona las que correspondan; ninguna está confirmada de antemano.</p><div id="candidateList">'+a.candidates.map((c,i)=>'<div class="candidate"><label class="candidate-head"><input type="checkbox" data-candidate="'+i+'"'+(d.checked.includes(i)?' checked':'')+(c.manual&&!c.evidence?' disabled':'')+'><strong>'+esc(c.competency)+' · OB '+esc(c.code)+'<span>'+esc(A.names[c.competency])+'</span></strong></label><p class="ob-descriptor">'+esc(c.text)+'</p>'+(c.manual?'<label class="micro" for="evidence'+i+'">Frase de la observación que respalda este OB</label><select id="evidence'+i+'" data-evidence="'+i+'"><option value="">Selecciona la evidencia</option>'+sentences.map((s,j)=>'<option value="'+j+'"'+(c.evidence===s?' selected':'')+'>'+esc(s)+'</option>').join('')+'</select>':'<blockquote>'+esc(c.evidence)+'</blockquote>')+'<div class="candidate-meta"><span class="micro">'+(c.planned?'Dentro del foco de esta fase':'Evidencia adicional al foco de esta fase')+'</span><select aria-label="Interpretación del OB '+c.code+'" data-meaning="'+i+'">'+['Evidencia para revisar','Fortaleza','Por mejorar'].map(m=>'<option'+(c.meaning===m?' selected':'')+'>'+m+'</option>').join('')+'</select></div></div>').join('')+'</div>'+(a.candidates.length?'':'<p class="warning">La observación aún no respalda un OB específico. Revisa las preguntas siguientes o vincula evidencia desde el catálogo.</p>')+(a.questions.length?'<div class="evidence-questions"><h4>Precisiones que mejorarían el registro</h4>'+list(a.questions)+'</div>':'')+a.warnings.map(w=>'<p class="warning">'+esc(w)+'</p>').join('')+'<div class="button-row"><button id="confirmButton" class="primary" type="button">Confirmar observación</button><button id="confirmNextButton" type="button">Confirmar y continuar</button></div><p class="micro">El informe incluye únicamente los OB que confirmes. No se calcula una nota automática.</p></section>';
    $('confirmButton').disabled=$('confirmNextButton').disabled=!!d.needsReview;
    $('correctedNote').oninput=()=>{d.corrected=$('correctedNote').value;d.checked=[];d.needsReview=true;document.querySelectorAll('[data-candidate]').forEach(x=>{x.checked=false;x.disabled=true;});$('confirmButton').disabled=$('confirmNextButton').disabled=true;$('reanalyzeButton').textContent='Actualizar OB antes de confirmar';};
    $('reanalyzeButton').onclick=()=>{capture();if(!d.corrected.trim()){toast('La redacción no puede quedar vacía.');return;}d.analysis=A.analyze(d.corrected,G,current());d.corrected=d.analysis.corrected;d.checked=[];d.needsReview=false;showAnalysis();};
    document.querySelectorAll('[data-meaning]').forEach(s=>s.onchange=e=>d.analysis.candidates[Number(s.dataset.meaning)].meaning=e.target.value);
    document.querySelectorAll('[data-evidence]').forEach(s=>s.onchange=e=>{const i=Number(s.dataset.evidence);d.analysis.candidates[i].evidence=e.target.value===''?'':sentences[Number(e.target.value)];document.querySelector('[data-candidate="'+i+'"]').disabled=e.target.value==='';});
    $('confirmButton').onclick=()=>confirmRecord(false);$('confirmNextButton').onclick=()=>confirmRecord(true);
  }
  function confirmRecord(next){
    capture();const d=draft();
    try{
      if(d.needsReview)throw Error('Actualiza los OB después de editar.');
      state.records[key()]=A.validateRecord({evaluation:state.evaluation,scenario:state.evaluation==='eval2'?state.scenario:'s1',groupId:current().id,groupTitle:current().title,target:'pilot',person:state.person,alias:state.aliases[state.person],role:d.role,mode:d.mode,intervention:d.intervention,original:d.original,corrected:d.corrected,confirmed:d.checked.map(i=>d.analysis.candidates[i]),questions:d.analysis.questions,warnings:d.analysis.warnings,date:new Date().toISOString()},G);
      toast('Observación de '+state.person+' confirmada.');
      if(next&&state.index<sequence().length-1)move(state.index+1);else if(next){state.screen='summary';render();}else render();
    }catch(error){toast(error.message);}
  }
  function summary(){
    const entries=Object.entries(state.records),records=entries.map(x=>x[1]);
    const totals=['CM1','CM2'].map(person=>{const rs=records.filter(r=>r.person===person),codes=[...new Set(rs.flatMap(r=>r.confirmed.map(c=>c.competency)))];return '<div class="pilot-summary"><strong>'+person+(state.aliases[person]?' · '+esc(state.aliases[person]):'')+'</strong><span>'+rs.length+' observaciones</span><div class="chips">'+codes.map(c=>'<span class="chip">'+esc(c)+'</span>').join('')+'</div></div>';}).join('');
    $('view').innerHTML='<section class="card"><h2>Competencias y evidencia del piloto</h2><div class="pilot-summaries">'+totals+'</div><div class="button-row"><button id="returnButton" type="button">Volver a la evaluación</button><button id="exportText" class="primary" type="button">Descargar informe</button><button id="exportJSON" type="button">Descargar datos</button></div>'+(records.length?'':'<p class="empty">Aún no hay observaciones confirmadas.</p>')+entries.map(([k,r])=>'<article class="summary-record"><p class="step-label">'+esc(G.evals[r.evaluation].label)+(r.evaluation==='eval2'?' · Escenario '+r.scenario.slice(1):'')+' · '+r.person+' / '+r.role+' · '+r.mode+'</p><h3>'+esc(r.groupTitle)+'</h3><p class="record-text">'+esc(r.corrected)+'</p>'+r.confirmed.map(c=>'<div class="report-ob"><strong>'+esc(c.competency)+' · OB '+c.code+' · '+esc(c.meaning)+'</strong><p>'+esc(c.text)+'</p><blockquote>'+esc(c.evidence)+'</blockquote></div>').join('')+(r.confirmed.length?'':'<p class="micro">Sin OB confirmado para esta observación.</p>')+(r.intervention?'<p class="micro"><b>Intervención del instructor:</b> '+esc(r.intervention)+'</p>':'')+'<details><summary>Original y precisiones pendientes</summary><p class="record-text">'+esc(r.original)+'</p>'+list(r.questions)+list(r.warnings)+'</details><button type="button" class="text-button" data-edit="'+esc(k)+'">Editar observación</button></article>').join('')+'<p class="micro">'+esc(G.pilotCatalogue.note)+' La ausencia de observaciones no constituye un resultado satisfactorio.</p></section>';
    $('returnButton').onclick=()=>{state.screen='event';render();};$('exportText').onclick=exportText;$('exportJSON').onclick=exportJSON;
    document.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>{const r=state.records[b.dataset.edit];state.evaluation=r.evaluation;state.scenario=r.scenario;state.person=r.person;state.index=sequence().findIndex(g=>g.id===r.groupId);state.screen='event';render();});
  }
  function download(text,name,type){const url=URL.createObjectURL(new Blob([text],{type})),link=document.createElement('a');link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),10000);}
  function exportJSON(){download(JSON.stringify({version:'0.4',target:'pilot',guideVersion:G.version,aliases:state.aliases,records:Object.values(state.records),drafts:state.drafts,exportedAt:new Date().toISOString()},null,2),'Veyra_Flight_Training_Evaluacion.json','application/json');}
  function exportText(){
    const lines=['VEYRA · FLIGHT TRAINING','EVALUACIÓN DEL PILOTO',new Date().toLocaleString('es-CO'),''];
    for(const r of Object.values(state.records)){
      lines.push(G.evals[r.evaluation].label+(r.evaluation==='eval2'?' · Escenario '+r.scenario.slice(1):'')+' · '+r.groupTitle,r.person+' / '+r.role+' · '+(state.aliases[r.person]||'Sin alias')+' · '+r.mode,r.corrected,'');
      for(const c of r.confirmed)lines.push(c.competency+' · OB '+c.code+' · '+c.meaning,c.text,'Evidencia: '+c.evidence,'');
      if(!r.confirmed.length)lines.push('Sin OB confirmado.');
      if(r.intervention)lines.push('Intervención del instructor: '+r.intervention);
      lines.push('Original: '+r.original,...r.questions.map(q=>'Por precisar: '+q),...r.warnings.map(w=>'Revisión: '+w),'');
    }
    lines.push(G.pilotCatalogue.note,'Sin calificación automática.');download(lines.join('\n'),'Veyra_Flight_Training_Informe.txt','text/plain;charset=utf-8');
  }
  document.querySelectorAll('[data-eval]').forEach(b=>b.onclick=()=>{capture();state.evaluation=b.dataset.eval;state.person=G.evals[state.evaluation].pf;state.index=state.positions[session()]||0;state.screen='event';render();});
  $('scenario').onchange=e=>{capture();state.scenario=e.target.value;state.index=state.positions[session()]||0;state.screen='event';render();};
  $('summaryButton').onclick=()=>{capture();state.screen='summary';render();};
  window.addEventListener('beforeunload',e=>{if(Object.values(state.drafts).some(d=>d.original.trim())){e.preventDefault();e.returnValue='';}});
  render();
};
