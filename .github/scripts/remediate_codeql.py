from pathlib import Path


def replace_once(text, old, new, label):
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected exactly one match, found {count}")
    return text.replace(old, new, 1)


# IFR Hold 07: do not reinterpret DOM text as HTML.
hold_path = Path("modules/ifr-hold-07/index.html")
hold = hold_path.read_text(encoding="utf-8")
old_hold = "document.querySelectorAll('.brief-card').forEach(b=>b.onclick=()=>{document.querySelectorAll('.brief-card').forEach(x=>x.style.borderColor='');b.style.borderColor='var(--gold)';document.getElementById('briefFeedback').innerHTML=`<div class=\"status-big\">${b.querySelector('h3').textContent}</div>${brief[b.dataset.brief]}`});"
new_hold = """document.querySelectorAll('.brief-card').forEach(b=>b.onclick=()=>{
  document.querySelectorAll('.brief-card').forEach(x=>x.style.borderColor='');
  b.style.borderColor='var(--gold)';
  const feedback=document.getElementById('briefFeedback');
  const heading=document.createElement('div');
  heading.className='status-big';
  heading.textContent=b.querySelector('h3')?.textContent||'';
  const detail=document.createTextNode(brief[b.dataset.brief]||'');
  feedback.replaceChildren(heading,detail);
});"""
hold = replace_once(hold, old_hold, new_hold, "ifr-hold brief feedback")
hold_path.write_text(hold, encoding="utf-8")


# Root Assessment: render questions with DOM APIs only.
index_path = Path("index.html")
index = index_path.read_text(encoding="utf-8")
start = index.index("function renderQuestions(){")
end = index.index("function startTimer(sec){", start)
new_render = r'''function renderQuestions(){
  document.getElementById('progress').textContent=' · '+currentQuestions.length+' preguntas';
  const container=document.getElementById('questionsContainer');
  container.replaceChildren();
  currentQuestions.forEach((q,i)=>{
    const card=document.createElement('div');card.className='qcard';
    const meta=document.createElement('div');meta.className='qmeta';
    const addBadge=(text)=>{const badge=document.createElement('span');badge.className='badge';badge.textContent=String(text);meta.append(badge);};
    addBadge(i+1);addBadge(officialSubject(q.category,q.question));if(q.critical)addBadge('Crítica');
    const heading=document.createElement('h2');heading.textContent=String(q.question||'');
    card.append(meta,heading);
    (q.options||[]).forEach(o=>{
      const label=document.createElement('label');label.className='option';
      const input=document.createElement('input');input.type='radio';input.name='q'+String(q.id);input.value=String(o.key||'');
      label.append(input,document.createTextNode(String(o.key||'')+'. '+String(o.text||'')));
      card.append(label);
    });
    container.append(card);
  });
}
'''
index = index[:start] + new_render + index[end:]


# Do not use tag-stripping regexes as sanitizers.
old_clean_text = """function veyraCleanText(value){
  return String(value ?? '')
    .replace(/<[^>]*>/g,'')
    .replace(/\\s+/g,' ')
    .trim();
}"""
new_clean_text = """function veyraCleanText(value){
  return String(value ?? '').replace(/\\s+/g,' ').trim();
}"""
index = replace_once(index, old_clean_text, new_clean_text, "veyraCleanText")


# Individual report: construct DOM and assign dynamic values through textContent.
report_start = index.index("window.printAttemptReport = function(i){")
report_end = index.index("/* === Veyra v2.7.3 helpers === */", report_start)
new_report = r'''window.printAttemptReport = function(i){
  const a=(lastDashboardRows||[])[i];
  if(!a){alert('No encontré este intento. Actualiza datos e intenta de nuevo.');return;}
  const details=(a.answer_detail&&a.answer_detail.length)?enrichAnswers(a.answer_detail):enrichAnswers(a.failed_questions||[]);
  const failed=details.filter(d=>!d.isCorrect);
  const stats=veyraSubjectStatsFromAttempt(a);
  const strong=stats.filter(w=>Number(w.score||0)>=75).sort((x,y)=>Number(y.score||0)-Number(x.score||0));
  const priority=stats.filter(w=>Number(w.score||0)<75).sort((x,y)=>Number(x.score||0)-Number(y.score||0));
  const fecha=a.date||new Date().toISOString();
  const interpretation=a.pass
    ? 'El estudiante alcanza el criterio mínimo definido para esta evaluación. El resultado puede ser utilizado como insumo para retroalimentación académica, seguimiento del desempeño y continuidad del proceso formativo según criterio del instructor.'
    : 'El estudiante no alcanza el criterio mínimo definido para esta evaluación. Se recomienda realizar retroalimentación dirigida en las materias con menor desempeño antes de avanzar a la siguiente fase del entrenamiento.';
  const finalRec=a.pass
    ? 'Mantener el seguimiento académico y reforzar los temas identificados como oportunidades de mejora para consolidar el desempeño previo a fases prácticas.'
    : 'Realizar retroalimentación individual enfocada en los ítems fallados y reforzar las materias de menor desempeño antes de repetir la evaluación, según criterio del instructor.';

  const node=(tag,className,text)=>{const n=document.createElement(tag);if(className)n.className=className;if(text!==undefined)n.textContent=String(text);return n;};
  const card=(title,text,className='reportCard')=>{const c=node('div',className);c.append(node('h3','',title));if(text!==undefined)c.append(node('p','',text));return c;};
  const listCard=(title,items,emptyText)=>{
    const c=node('div','reportCard');c.append(node('h3','',title));
    if(!items.length){c.append(node('p','muted',emptyText));return c;}
    const ul=node('ul');items.forEach(w=>{const relation=w.total==null?'':' ('+w.correct+'/'+w.total+')';ul.append(node('li','',String(w.category||'')+': '+Number(w.score||0)+'%'+relation));});c.append(ul);return c;
  };

  closeVeyraReportPreview();
  const root=node('div');root.id='veyraReportPreview';
  const actions=node('div','reportPreviewActions');
  const close=node('button','secondary','Cerrar reporte');close.type='button';close.onclick=closeVeyraReportPreview;
  const print=node('button','primary','Guardar / imprimir PDF');print.type='button';print.onclick=veyraPrintIndividualReport;
  actions.append(close,print);root.append(actions);

  const page=node('div','reportPage');root.append(page);
  const header=node('div','reportHeader');
  header.append(node('div','reportBrand','Veyra'),node('div','reportSubbrand','PILOT INTELLIGENCE'),node('div','reportTitle','Reporte individual de desempeño académico'),node('div','reportMeta','Plan piloto Pre-Solo · '+veyraFormatDate(fecha)));
  page.append(header);

  const summary=node('div','reportCard reportSoft');summary.append(node('h2','',a.name||'Estudiante'));
  const kpis=node('div','reportKpis');
  [['Curso',a.course||'-'],['Evaluador',a.instructor||'-'],['Nota',Number(a.score||0)+'%'],['Resultado',a.pass?'Cumple':'No cumple']].forEach(([label,value],idx)=>{
    const k=node('div','reportKpi');k.append(node('span','',label),node('b',idx===3?(a.pass?'ok':'bad'):'',value));kpis.append(k);
  });
  summary.append(kpis);page.append(summary);
  page.append(card('Interpretación del resultado',interpretation));

  const two=node('div','reportTwo');
  two.append(listCard('Fortalezas identificadas',strong,'No se identifican materias sobre el criterio mínimo en este intento.'),listCard('Áreas prioritarias de refuerzo',priority,'No se registran áreas críticas de refuerzo en este intento.'));
  page.append(two);

  const barsCard=node('div','reportCard');barsCard.append(node('h3','','Desempeño por materia'));
  if(!stats.length){barsCard.append(node('p','muted','Sin desglose por materia disponible.'));}
  else stats.forEach(w=>{
    const val=Math.max(0,Math.min(100,Number(w.score||0)));
    const row=node('div','reportBarrow');
    const relation=w.total==null?'':' ('+w.correct+'/'+w.total+')';
    row.append(node('div','reportBarlabel',String(w.category||'')+relation));
    const track=node('div','bartrack reportBartrack');const fill=node('span');fill.style.width=Math.max(4,val)+'%';fill.style.background=val>=75?'#047857':(val>=50?'#c8a45d':'#b42318');track.append(fill);
    row.append(track,node('div','reportBarvalue',val+'%'));barsCard.append(row);
  });
  page.append(barsCard);

  const detailCard=node('div','reportCard reportDetailTable');detailCard.append(node('h2','','Detalle de preguntas falladas'));
  const tableEl=node('table');const thead=node('thead');const hr=node('tr');['ID','Materia','Pregunta','Respuesta estudiante','Respuesta esperada','Estado'].forEach(h=>hr.append(node('th','',h)));thead.append(hr);tableEl.append(thead);
  const tbody=node('tbody');const rows=failed.length?failed:details;
  if(!rows.length){const tr=node('tr');const td=node('td','','No se registran preguntas falladas.');td.colSpan=6;tr.append(td);tbody.append(tr);}
  else rows.forEach(d=>{
    const tr=node('tr');
    const marked=formatAnswerPlain(d.selected,d.selectedText,d.questionId);
    const expected=formatAnswerPlain(d.correct,d.correctText,d.questionId);
    [d.questionId||'',d.category||'',d.question||'',marked,expected].forEach(v=>tr.append(node('td','',v)));
    const stateTd=node('td');stateTd.append(node('span',d.isCorrect?'ok':'bad',d.isCorrect?'Correcta':'Incorrecta'));tr.append(stateTd);tbody.append(tr);
  });
  tableEl.append(tbody);detailCard.append(tableEl);page.append(detailCard);
  page.append(card('Recomendación formativa',finalRec));
  const use=card('Uso formativo','Este reporte se utiliza para retroalimentación académica, seguimiento interno del entrenamiento y toma de decisiones formativas. No reemplaza el criterio del instructor responsable.');
  const signature=node('div','signature');signature.append(node('b','','Veyra Pilot Intelligence'),document.createElement('br'),document.createTextNode('Aviation assessment and training analytics platform'),document.createElement('br'),document.createTextNode('veyrapilot.com'));use.append(signature);page.append(use);
  page.append(node('div','reportFooter','Reporte generado automáticamente para uso académico y seguimiento interno.'));

  const detail=document.getElementById('attemptDetailCard')||document.body;
  if(detail.parentNode)detail.parentNode.insertBefore(root,detail.nextSibling);else document.body.append(root);
  root.scrollIntoView({behavior:'smooth',block:'start'});
};


'''
index = index[:report_start] + new_report + index[report_end:]


# Subject helper normalizes whitespace only; it is not used as an HTML sanitizer.
old_subject_clean = """  function clean(v){
    return String(v == null ? '' : v).replace(/<[^>]*>/g,'').replace(/\\s+/g,' ').trim();
  }"""
new_subject_clean = """  function clean(v){
    return String(v == null ? '' : v).replace(/\\s+/g,' ').trim();
  }"""
index = replace_once(index, old_subject_clean, new_subject_clean, "subject clean helper")


# Legacy HTML-returning report helpers are not needed after DOM rendering.
helpers_start = index.index("function veyraSubjectBarsHTMLFromAttempt(a){")
helpers_end = index.index("/* === Veyra Training Center v2.8.0 JS === */", helpers_start)
index = index[:helpers_start] + index[helpers_end:]


if ".replace(/<[^>]*>/g,'')" in index:
    raise SystemExit("Known incomplete tag-stripping sanitizer remains in index.html")
if "insertAdjacentHTML('afterend', html)" in index:
    raise SystemExit("Unsafe report HTML sink remains in index.html")
if "container.replaceChildren" not in index:
    raise SystemExit("DOM question renderer was not installed")
if "feedback.replaceChildren" not in hold:
    raise SystemExit("DOM hold feedback renderer was not installed")

index_path.write_text(index, encoding="utf-8")
print("CodeQL remediation prepared successfully")
