globalThis.VeyraFlightTrainingStart=()=>{
  'use strict';
  const G=FTGuide,A=FTAssistant,L=FTLocale,$=id=>document.getElementById(id),catalog=A.catalogue(G);
  L.setGuide(G);
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const copy=x=>JSON.parse(JSON.stringify(x));
  const emptyState=()=>({evaluation:'eval1',scenario:'s1',person:'CM1',index:0,screen:'event',drafts:{},records:[],positions:{},counter:0,deleted:null,guideOpen:false,setupOpen:false,pencil:false});
  const state=emptyState();
  const session=()=>state.evaluation+':'+(state.evaluation==='eval2'?state.scenario:'common');
  const sequence=()=>A.groups(G,state.evaluation,state.scenario);
  const current=()=>sequence()[state.index];
  const key=()=>session()+':'+current().id+':'+state.person;
  const blank=role=>({text:'',original:'',revision:null,analysis:null,role:role||((G.evals[state.evaluation].pf===state.person)?'PF':'PM'),meaning:'Por mejorar',intervention:'',competencies:[],obs:[],openCompetency:null,editingId:null});
  const draft=()=>state.drafts[key()]??=blank();
  const list=items=>'<ul>'+(items||[]).map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>';
  const table=rows=>'<table>'+(rows||[]).map(([a,b])=>'<tr><th>'+esc(a)+'</th><td>'+esc(b)+'</td></tr>').join('')+'</table>';
  function toast(message){$('toast').textContent=L.t(message);$('toast').classList.add('visible');clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('toast').classList.remove('visible'),4500);}
  function layout(){L.apply(document.body);window.dispatchEvent(new Event('veyra:layout'));window.FTSessionStore?.changed();}
  function savedSnapshot(){
    capture();const value=copy(state);value.schema=1;value.guideVersion=G.version;value.screen='event';value.deleted=null;
    for(const d of Object.values(value.drafts))d.analysis=null;
    return value;
  }
  function restoreSaved(value){
    const next=emptyState();
    if(value){
      if(value.schema!==1||value.guideVersion!==G.version||!['eval1','eval2'].includes(value.evaluation)||!['s1','s2','s3'].includes(value.scenario)||!['CM1','CM2'].includes(value.person)||!Array.isArray(value.records)||!value.drafts||typeof value.drafts!=='object')throw Error('La evaluación guardada requiere revisión de formato o versión. No se ha sobrescrito.');
      for(const r of value.records){if(!/^[a-zA-Z0-9_-]+$/.test(r.id)||!['eval1','eval2'].includes(r.evaluation)||!['s1','s2','s3'].includes(r.scenario)||!['CM1','CM2'].includes(r.person))throw Error('Registro guardado no válido.');A.validateRecord(r,G);}
      for(const [k,d] of Object.entries(value.drafts)){if(!d||typeof d.text!=='string'||!Array.isArray(d.competencies)||!Array.isArray(d.obs)||!d.competencies.every(c=>A.names[c]))throw Error('Borrador guardado no válido.');}
      Object.assign(next,copy(value),{screen:'event',deleted:null});
    }
    Object.assign(state,next);state.index=Math.max(0,Math.min(Number.isInteger(state.index)?state.index:0,sequence().length-1));render();
  }
  function capture(){
    if(state.screen!=='event')return;
    const d=draft();if($('rawNote'))d.text=$('rawNote').value;if($('intervention'))d.intervention=$('intervention').value;if($('revisionText'))d.revision=$('revisionText').value;
  }
  function render(){
    document.querySelectorAll('[data-eval]').forEach(b=>{b.classList.toggle('active',b.dataset.eval===state.evaluation);b.setAttribute('aria-pressed',String(b.dataset.eval===state.evaluation));});
    $('scenarioBlock').hidden=state.evaluation!=='eval2';$('scenario').value=state.scenario;$('recordCount').textContent=state.records.length;
    $('eyebrow').textContent='EVALUACIÓN DEL PILOTO';$('viewTitle').textContent=state.screen==='summary'?'Resumen de la evaluación':G.evals[state.evaluation].label+(state.evaluation==='eval2'?' · Escenario '+state.scenario.slice(1):'');
    if(state.screen==='summary')summary();else eventView();layout();
  }
  function move(index){capture();state.index=index;state.positions[session()]=index;state.screen='event';state.guideOpen=false;render();$('workspace').focus({preventScroll:true});}
  function reference(group){
    const column=field=>group.items.map(({event})=>'<div class="guide-event">'+(group.items.length>1?'<h4>'+esc(event.title)+'</h4>':'')+list(event[field])+'</div>').join('');
    const page=G.pages.find(p=>p.eval===state.evaluation&&p.setup);
    const frequencies=page?.comms||[];
    const comms=frequencies.length?'<aside class="comms-quick" aria-label="Frecuencias de comunicación"><h3>Comunicaciones</h3><div class="comms-list">'+frequencies.map(([station,frequency])=>'<div class="comms-row"><span>'+esc(station)+'</span><strong>'+esc(frequency)+'</strong></div>').join('')+'</div></aside>':'';
    return '<div class="reference-strip"><section class="phase-reference"><div class="compact-phase"><h2>'+esc(group.title)+'</h2><span class="phase-counter">'+(state.index+1)+' / '+sequence().length+'</span></div><details id="sessionSetup"'+(state.setupOpen?' open':'')+'><summary>Configuración de la sesión</summary><div class="reference">'+(page?table(page.setup)+list(page.cautions):'')+'</div></details><details id="sessionGuide"'+(state.guideOpen?' open':'')+'><summary>Session Development / Instructor Focus</summary><div class="guide-columns"><section class="development-column"><h3>Session Development</h3>'+column('development')+'</section><section class="focus-column"><h3>Instructor Focus</h3>'+column('focus')+'</section></div></details></section>'+comms+'</div>';
  }

  const noteTemplates=[["Fortaleza", "Procedimientos", "Aplica correctamente [procedimiento] durante [fase], evidenciado por [conducta y resultado].", "Correctly applies [procedure] during [phase], as evidenced by [behaviour and outcome]."], ["Fortaleza", "Comunicación", "Comunica [información] de forma clara y oportuna durante [situación], facilitando [resultado].", "Communicates [information] clearly and promptly during [situation], supporting [outcome]."], ["Fortaleza", "Trabajo en equipo", "Coordina [tarea] con el otro piloto durante [situación], logrando [resultado observado].", "Coordinates [task] with the other pilot during [situation], achieving [observed outcome]."], ["Por mejorar", "Procedimientos", "Necesita mejorar [aspecto del procedimiento]. Durante [situación], se observó [conducta y efecto].", "Needs to improve [aspect of the procedure]. During [situation], [behaviour and effect] were observed."], ["Por mejorar", "Conciencia situacional", "Necesita mejorar la identificación de [cambio o amenaza]. Durante [situación], se observó [conducta y efecto].", "Needs to improve recognition of [change or threat]. During [situation], [behaviour and effect] were observed."], ["Por mejorar", "Carga de trabajo", "Necesita mejorar la priorización de [tareas]. Durante [situación], se observó [conducta y efecto].", "Needs to improve prioritisation of [tasks]. During [situation], [behaviour and effect] were observed."]];
  function writingTools(){
    return '<div class="writing-modes" role="group" aria-label="Modo de escritura"><button id="keyboardMode" type="button" aria-pressed="'+!state.pencil+'">Teclado</button><button id="pencilMode" type="button" aria-pressed="'+state.pencil+'">Apple Pencil</button></div><p id="pencilHelp" class="pencil-help"'+(!state.pencil?' hidden':'')+'>Escribe con Apple Pencil dentro del cuadro. Activa Escribir a mano en Ajustes → Apple Pencil del iPad.</p><details class="note-presets"><summary>Frases de inicio</summary><p>Completa los corchetes con lo que observaste antes de confirmar.</p>'+['Fortaleza','Por mejorar'].map(kind=>'<div class="preset-group"><strong>'+kind+'</strong>'+noteTemplates.map((t,i)=>t[0]===kind?'<button type="button" data-preset="'+i+'">'+t[1]+'</button>':'').join('')+'</div>').join('')+'</details>';
  }

  function eventView(){
    const d=draft(),group=current(),items=sequence();
    const nav='<nav class="phase-nav" aria-label="Fases y escenarios">'+items.map((g,i)=>'<button type="button" data-step="'+i+'" aria-current="'+(i===state.index?'step':'false')+'" class="phase-button '+(i===state.index?'active':'')+'"><span>'+String(i+1).padStart(2,'0')+'</span>'+esc(g.title)+'</button>').join('')+'</nav>';
    $('view').innerHTML=nav+reference(group)+'<section class="card observation-workspace"><div class="subject-row"><div><label for="pilotPerson">Piloto estudiante</label><select id="pilotPerson"><option value="CM1"'+(state.person==='CM1'?' selected':'')+'>CM1</option><option value="CM2"'+(state.person==='CM2'?' selected':'')+'>CM2</option></select></div><div><label for="pilotRole">Función observada</label><select id="pilotRole"><option value="PF"'+(d.role==='PF'?' selected':'')+'>PF</option><option value="PM"'+(d.role==='PM'?' selected':'')+'>PM</option></select></div><div><label for="observationMeaning">Valoración</label><select id="observationMeaning"><option value="Fortaleza"'+(d.meaning==='Fortaleza'?' selected':'')+'>Fortaleza</option><option value="Por mejorar"'+(d.meaning==='Por mejorar'?' selected':'')+'>Por mejorar</option></select></div></div><div class="observation-split"><div class="note-column"><div class="field-head"><label for="rawNote">Observación del piloto</label>'+(d.editingId?'<span class="editing-label">Editando observación</span>':'')+'</div>'+writingTools()+'<textarea id="rawNote" class="'+(state.pencil?'pencil-note':'')+'" autocapitalize="sentences" maxlength="6000" spellcheck="true" placeholder="Describe qué hizo u omitió el piloto, en qué momento y con qué resultado.">'+esc(d.text)+'</textarea><div class="note-tools"><button id="analyzeButton" type="button" class="primary analyze-primary">Revisar observación</button><button id="clearButton" type="button" class="text-button">Limpiar</button></div><div id="revisionPanel"></div><details class="intervention-panel"><summary>Intervención del instructor (opcional)</summary><textarea id="intervention" maxlength="1500" aria-label="Intervención del instructor" placeholder="Describe la intervención, si la hubo.">'+esc(d.intervention)+'</textarea></details><div class="button-row confirm-row"><button id="confirmButton" class="primary" type="button"'+(!d.text.trim()?' disabled':'')+'>'+(d.editingId?'Guardar cambios':'Guardar observación')+'</button>'+(d.editingId?'<button id="cancelEditButton" class="text-button" type="button">Cancelar edición</button>':'')+'</div><div id="saveStatus" role="status"></div></div><aside id="competencyPanel" class="competency-side" aria-label="Competencias del piloto"></aside></div></section><section id="phaseRecords" class="phase-records"></section><div class="button-row step-actions"><button id="previousButton" type="button"'+(state.index===0?' disabled':'')+'>Anterior</button><button id="nextButton" type="button">'+(state.index===items.length-1?'Ver resumen':'Siguiente '+(state.evaluation==='eval1'?'fase':'evento'))+'</button></div>';
    document.querySelectorAll('[data-step]').forEach(b=>b.onclick=()=>move(Number(b.dataset.step)));
    $('sessionGuide').ontoggle=()=>state.guideOpen=$('sessionGuide').open;$('sessionSetup').ontoggle=()=>state.setupOpen=$('sessionSetup').open;
    $('pilotPerson').onchange=e=>{capture();state.person=e.target.value;render();};$('pilotRole').onchange=e=>d.role=e.target.value;$('observationMeaning').onchange=e=>d.meaning=e.target.value;
    $('rawNote').oninput=()=>{d.text=$('rawNote').value;d.original='';d.analysis=null;d.revision=null;$('revisionPanel').replaceChildren();$('confirmButton').disabled=!d.text.trim();renderCompetencies();};
    const setWritingMode=pencil=>{state.pencil=pencil;$('rawNote').classList.toggle('pencil-note',pencil);$('pencilHelp').hidden=!pencil;$('keyboardMode').setAttribute('aria-pressed',String(!pencil));$('pencilMode').setAttribute('aria-pressed',String(pencil));if(!pencil)$('rawNote').focus({preventScroll:true});layout();};
    $('keyboardMode').onclick=()=>setWritingMode(false);$('pencilMode').onclick=()=>setWritingMode(true);
    document.querySelectorAll('[data-preset]').forEach(b=>b.onclick=()=>{
      const t=noteTemplates[Number(b.dataset.preset)],el=$('rawNote'),phrase=t[L.language==='en'?3:2],addition=(el.value.trim()?'\n':'')+phrase;
      if(el.value.length+addition.length>6000){toast('No hay espacio para añadir la frase.');return;}
      el.value+=addition;el.oninput();d.meaning=t[0];$('observationMeaning').value=t[0];el.focus({preventScroll:true});layout();
    });
    $('analyzeButton').onclick=()=>{capture();if(!d.text.trim()){toast('Escribe una observación del piloto.');return;}d.original=d.text;d.analysis=A.analyze(d.text,G,current());d.revision=d.analysis.corrected;renderRevision();renderCompetencies();layout();$('revisionPanel').scrollIntoView({behavior:'smooth',block:'nearest'});};
    $('clearButton').onclick=()=>{capture();const previous=copy(d);state.drafts[key()]=blank(d.role);render();$('saveStatus').innerHTML='<span>Formulario limpio.</span> <button id="undoClear" class="text-button" type="button">Deshacer</button>';$('undoClear').onclick=()=>{state.drafts[key()]=previous;render();};layout();};
    $('confirmButton').onclick=confirmRecord;
    if($('cancelEditButton'))$('cancelEditButton').onclick=()=>{state.drafts[key()]=blank(d.role);render();};
    $('previousButton').onclick=()=>move(state.index-1);$('nextButton').onclick=()=>{if(state.index<items.length-1)move(state.index+1);else{capture();state.screen='summary';render();}};
    renderCompetencies();renderRevision();renderPhaseRecords();
  }
  function renderCompetencies(){
    if(!$('competencyPanel'))return;
    const d=draft(),focus=new Set(current().codes),suggested=new Set((d.analysis?.competencies||[]).map(c=>c.code));
    const reviewStatus=d.analysis?'<div class="suggestion-summary" role="status" aria-live="polite"><strong><span>'+suggested.size+'</span> <span>'+(suggested.size===1?'competencia propuesta':'competencias propuestas')+'</span></strong><span>'+(suggested.size?'Revisa las tarjetas azules y pulsa + para añadir.':'No se encontró una asociación clara. Describe una acción concreta del piloto.')+'</span></div>':'';
    $('competencyPanel').innerHTML=reviewStatus+'<div class="field-head"><h3>Competencias del piloto</h3><span class="selection-count">'+d.competencies.length+' / 9</span></div><p class="competency-legend"><span class="focus-dot"></span><span>Foco del instructor</span><span class="suggested-dot"></span><span>Propuesta</span></p><div class="competency-list">'+Object.entries(A.names).sort(([a],[b])=>Number(suggested.has(b))-Number(suggested.has(a))).map(([code,name])=>{
      const selected=d.competencies.includes(code),open=d.openCompetency===code,obs=catalog.filter(o=>o.competency===code),selectedCount=obs.filter(o=>d.obs.includes(o.code)).length;
      return '<div class="competency-item '+(focus.has(code)?'in-focus ':'')+(selected?'is-selected ':'')+(suggested.has(code)?'is-suggested':'')+'"><div class="competency-row"><button type="button" data-competency="'+code+'" aria-pressed="'+selected+'" class="competency-toggle"><span class="choice-mark" aria-hidden="true">'+(selected?'✓':'+')+'</span><strong>'+code+'</strong><span class="competency-label"><span class="competency-name">'+esc(name)+'</span>'+(selected?'<span class="suggestion-badge">Seleccionada</span>':suggested.has(code)?'<span class="suggestion-badge">PROPUESTA · Revisar</span>':'')+'<small class="competency-definition">'+esc(A.definitions[code])+'</small></span></button><button type="button" data-toggle-ob="'+code+'" aria-expanded="'+open+'" aria-controls="obs-'+code+'" class="ob-toggle">OB'+(selectedCount?' '+selectedCount:'')+' '+(open?'▴':'▾')+'</button></div>'+(suggested.has(code)?'<div class="suggestion-evidence"><strong>Basada en tu observación</strong><q data-user-text>'+esc(d.analysis.competencies.find(c=>c.code===code).evidence)+'</q></div>':'')+'<div class="ob-drawer" id="obs-'+code+'"'+(!open?' hidden':'')+'>'+obs.map(o=>{
        const suggestion=d.analysis?.candidates.find(c=>c.code===o.code);
        return '<label class="ob-option '+(suggestion?'ob-proposed':'')+'"><input type="checkbox" data-ob="'+o.code+'"'+(d.obs.includes(o.code)?' checked':'')+'><span><strong>OB '+o.code+(suggestion?' <small>Propuesto</small>':'')+'</strong><span>'+esc(o.text)+'</span></span></label>';
      }).join('')+'</div></div>';
    }).join('')+'</div>';
    document.querySelectorAll('[data-competency]').forEach(b=>b.onclick=()=>{
      capture();const code=b.dataset.competency;
      if(d.competencies.includes(code)){d.competencies=d.competencies.filter(c=>c!==code);d.obs=d.obs.filter(id=>catalog.find(o=>o.code===id)?.competency!==code);if(d.openCompetency===code)d.openCompetency=null;}
      else{d.competencies.push(code);d.openCompetency=code;}
      renderCompetencies();layout();
    });
    document.querySelectorAll('[data-toggle-ob]').forEach(b=>b.onclick=()=>{capture();d.openCompetency=d.openCompetency===b.dataset.toggleOb?null:b.dataset.toggleOb;renderCompetencies();layout();});
    document.querySelectorAll('[data-ob]').forEach(el=>el.onchange=()=>{
      const ob=catalog.find(o=>o.code===el.dataset.ob);d.obs=d.obs.filter(id=>id!==ob.code);
      if(el.checked){d.obs.push(ob.code);if(!d.competencies.includes(ob.competency))d.competencies.push(ob.competency);}
      renderCompetencies();layout();
    });
    L.apply($('competencyPanel'));
  }
  function renderRevision(){
    const d=draft();if(!$('revisionPanel')||!d.analysis||d.revision===null)return;
    const notes=[...d.analysis.questions,...d.analysis.warnings];
    $('revisionPanel').innerHTML='<div class="revision-box"><label for="revisionText">Redacción propuesta</label><textarea id="revisionText" maxlength="6000" spellcheck="true">'+esc(d.revision)+'</textarea><button id="applyRevision" class="text-button" type="button">Usar esta redacción</button><button id="dismissRevision" class="text-button" type="button">Conservar mi texto</button>'+(notes.length?'<details><summary>Precisiones para revisar</summary>'+list(notes)+'</details>':'')+'</div>';
    $('applyRevision').onclick=()=>{capture();if(!d.revision.trim())return;d.text=d.revision;$('rawNote').value=d.text;d.analysis=A.analyze(d.text,G,current());d.revision=null;$('revisionPanel').replaceChildren();$('confirmButton').disabled=false;renderCompetencies();layout();};
    $('dismissRevision').onclick=()=>{d.revision=null;$('revisionPanel').replaceChildren();layout();};L.apply($('revisionPanel'));
  }
  function sameObservation(a,b){const normalized=text=>A.norm(text).replace(/\s+/g,' ').trim().replace(/[.!?]+$/,'');return a.evaluation===b.evaluation&&a.scenario===b.scenario&&a.groupId===b.groupId&&a.person===b.person&&normalized(a.corrected)===normalized(b.corrected);}
  function confirmRecord(){
    capture();const d=draft();if(!d.text.trim()){toast('Escribe una observación del piloto.');return;}
    try{
      const analysis=d.analysis||A.analyze(d.text,G,current());
      const record=A.validateRecord({id:d.editingId||'observation-'+Date.now()+'-'+(++state.counter),evaluation:state.evaluation,scenario:state.evaluation==='eval2'?state.scenario:'s1',groupId:current().id,groupTitle:current().title,target:'pilot',person:state.person,role:d.role,mode:'EVAL',meaning:d.meaning,intervention:d.intervention,original:d.original||d.text,corrected:d.text,competencies:d.competencies.map(code=>({code,evidence:d.text,source:'main-observation',meaning:d.meaning})),confirmed:d.obs.map(code=>({...catalog.find(o=>o.code===code),evidence:d.text,meaning:d.meaning,manual:true})),questions:analysis.questions,warnings:analysis.warnings,date:new Date().toISOString()},G);
      const duplicate=state.records.find(r=>r.id!==d.editingId&&sameObservation(r,record));
      if(duplicate){toast('Esta observación ya está registrada. Puedes editarla en Observaciones.');return;}
      if(d.editingId){const i=state.records.findIndex(r=>r.id===d.editingId);if(i<0)throw Error('La observación ya no está disponible.');state.records[i]=copy(record);}else state.records.push(copy(record));
      state.drafts[key()]=blank(d.role);render();$('rawNote').focus({preventScroll:true});
      $('saveStatus').innerHTML='<span>Observación confirmada. Puedes escribir la siguiente.</span> <button class="text-button" type="button" id="editLast">Editar</button>';
      $('editLast').onclick=()=>editRecord(record.id);layout();toast('Observación confirmada.');
    }catch(error){toast(error.message);}
  }
  function editRecord(id){
    capture();const r=state.records.find(x=>x.id===id);if(!r)return;
    state.evaluation=r.evaluation;state.scenario=r.scenario;state.person=r.person;state.index=sequence().findIndex(g=>g.id===r.groupId);state.screen='event';
    state.drafts[key()]={...blank(r.role),text:r.corrected,original:r.original,meaning:r.meaning||'Por mejorar',intervention:r.intervention,competencies:(r.competencies||[]).map(c=>c.code),obs:r.confirmed.map(c=>c.code),editingId:r.id};render();$('rawNote').focus({preventScroll:true});
  }
  function deleteRecord(id){
    capture();const i=state.records.findIndex(r=>r.id===id);if(i<0)return;
    state.deleted={record:copy(state.records[i]),index:i};state.records.splice(i,1);
    for(const [k,d] of Object.entries(state.drafts))if(d.editingId===id)state.drafts[k]=blank(d.role);
    render();toast('Observación borrada.');
  }
  function undoDelete(){if(!state.deleted)return;const {record,index}=state.deleted;state.records.splice(Math.min(index,state.records.length),0,record);state.deleted=null;render();}
  function recordActions(r){return '<div class="record-actions"><button type="button" class="text-button" data-edit="'+r.id+'">Editar</button><button type="button" class="delete-button" data-delete="'+r.id+'">Borrar</button></div>';}
  function undoBar(){return state.deleted?'<div class="undo-bar"><span>Observación borrada.</span><button type="button" class="text-button" id="undoDelete">Deshacer</button></div>':'';}
  function bindRecords(){document.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>editRecord(b.dataset.edit));document.querySelectorAll('[data-delete]').forEach(b=>b.onclick=()=>deleteRecord(b.dataset.delete));if($('undoDelete'))$('undoDelete').onclick=undoDelete;}
  function renderPhaseRecords(){
    const records=state.records.filter(r=>r.evaluation===state.evaluation&&r.scenario===(state.evaluation==='eval2'?state.scenario:'s1')&&r.groupId===current().id);
    $('phaseRecords').innerHTML=undoBar()+(records.length?'<details><summary>Observaciones de esta fase <span>'+records.length+'</span></summary>'+records.map(r=>'<article class="mini-record"><div class="field-head"><strong>'+r.person+' / '+r.role+' · <span>'+esc(r.meaning)+'</span></strong>'+recordActions(r)+'</div><p class="record-text">'+esc(r.corrected)+'</p><div class="chips">'+r.competencies.map(c=>'<span class="chip">'+c.code+'</span>').join('')+'</div></article>').join('')+'</details>':'');bindRecords();
  }
  function summary(){
    const totals=['CM1','CM2'].map(person=>{const rs=state.records.filter(r=>r.person===person),codes=[...new Set(rs.flatMap(r=>r.competencies.map(c=>c.code)))];return '<div class="pilot-summary"><strong>'+person+'</strong><span>'+rs.length+' '+(rs.length===1?'observación':'observaciones')+'</span><div class="chips">'+codes.map(c=>'<span class="chip">'+c+'</span>').join('')+'</div></div>';}).join('');
    $('view').innerHTML='<section class="card summary-card"><div class="button-row"><button id="returnButton" type="button">Volver a la evaluación</button><button id="exportText" class="primary" type="button">Descargar informe</button><button id="exportJSON" type="button">Descargar datos</button></div><div class="pilot-summaries">'+totals+'</div>'+undoBar()+(state.records.length?'':'<p class="empty">Aún no hay observaciones confirmadas.</p>')+state.records.map(r=>'<article class="summary-record" data-record="'+r.id+'"><div class="field-head"><p class="step-label">'+esc(G.evals[r.evaluation].label)+(r.evaluation==='eval2'?' · Escenario '+r.scenario.slice(1):'')+' · '+r.person+' / '+r.role+'</p>'+recordActions(r)+'</div><h3>'+esc(r.groupTitle)+'</h3><span class="meaning-badge '+(r.meaning==='Fortaleza'?'strength':'improve')+'">'+esc(r.meaning)+'</span><p class="record-text">'+esc(r.corrected)+'</p><div class="chips report-competencies">'+r.competencies.map(c=>'<span class="chip">'+c.code+' · '+esc(A.names[c.code])+'</span>').join('')+'</div>'+(r.confirmed.length?'<details><summary>OB confirmados</summary>'+r.confirmed.map(c=>'<p class="report-ob"><strong>'+c.competency+' · OB '+c.code+'</strong><span>'+esc(c.text)+'</span></p>').join('')+'</details>':'')+(r.intervention?'<p class="micro"><b>Intervención del instructor:</b> <span data-user-text>'+esc(r.intervention)+'</span></p>':'')+(r.original!==r.corrected?'<details><summary>Texto original</summary><p class="record-text">'+esc(r.original)+'</p></details>':'')+'</article>').join('')+'</section>';
    $('returnButton').onclick=()=>{state.screen='event';render();};$('exportText').onclick=exportText;$('exportJSON').onclick=exportJSON;bindRecords();
  }
  function download(content,name,type){const url=URL.createObjectURL(new Blob([content],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);}
  function exportJSON(){download(JSON.stringify({version:'0.7',language:L.language,target:'pilot',guideVersion:G.version,records:state.records,drafts:state.drafts,exportedAt:new Date().toISOString()},null,2),'Veyra_Flight_Training_Evaluacion.json','application/json');}
  function exportText(){
    const lines=['VEYRA · FLIGHT TRAINING',L.t('EVALUACIÓN DEL PILOTO'),new Date().toLocaleString(L.language==='en'?'en-US':'es-CO'),''];
    for(const r of state.records){lines.push(G.evals[r.evaluation].label+(r.evaluation==='eval2'?' · '+L.t('Escenario')+' '+r.scenario.slice(1):''),L.t(r.groupTitle),r.person+' / '+r.role+' · '+L.t(r.meaning),r.corrected,'',L.t('Competencias del piloto')+': '+r.competencies.map(c=>c.code+' · '+L.t(A.names[c.code])).join('; '));for(const c of r.confirmed)lines.push(c.competency+' · OB '+c.code+': '+L.t(c.text));if(r.intervention)lines.push(L.t('Intervención del instructor:')+' '+r.intervention);if(r.original!==r.corrected)lines.push(L.t('Texto original')+': '+r.original);lines.push('');}
    download(lines.join('\n'),'Veyra_Flight_Training_Informe.txt','text/plain;charset=utf-8');
  }
  document.querySelectorAll('[data-eval]').forEach(b=>b.onclick=()=>{capture();state.evaluation=b.dataset.eval;state.person=G.evals[state.evaluation].pf;state.index=state.positions[session()]||0;state.screen='event';state.guideOpen=false;render();});
  $('scenario').onchange=e=>{capture();state.scenario=e.target.value;state.index=state.positions[session()]||0;state.screen='event';state.guideOpen=false;render();};
  $('summaryButton').onclick=()=>{capture();state.screen='summary';render();};
  window.addEventListener('veyra:language',()=>{capture();render();});
  window.addEventListener('beforeunload',e=>{if(window.FTSessionStore?window.FTSessionStore.pending:(state.records.length||Object.values(state.drafts).some(d=>d.text.trim()))){e.preventDefault();e.returnValue='';}});
  if(window.FTInitialSession)restoreSaved(window.FTInitialSession);else render();
  window.FTInitialSession=null;
  window.FTSessionStore?.bind(savedSnapshot,restoreSaved);
};
