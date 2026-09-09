/* Competency-level review complements, but does not require, an OB selection. */
(() => {
  const A=globalThis.FTAssistant,baseAnalyze=A.analyze,baseValidate=A.validateRecord;
  const probes=[
    ['KNO',/\b(conoce|desconoce|explica|explico|conocimiento|knowledge|explains|knows)\b/,/\b(sistema|sistemas|limitacion|limitaciones|procedimiento|systems?|limitations?|procedure)\b/],
    ['APK',/\b(aplica|aplico|ejecuta|ejecuto|omite|omitio|realiza|realizo|performs?|applies|omits?|executes?)\b/,/\b(procedimiento|procedimientos|checklist|lista|briefing|frustrada|procedures?|go.around)\b/],
    ['COM',/\b(comunica|comunico|informa|informo|briefing|colacion|fraseologia|comunicacion|communicates?|communication|readback|phraseology)\b/],
    ['FPA',/\b(automatizacion|fma|fms|piloto automatico|automation|autopilot)\b/,/\b(utiliza|utilizo|monitorea|monitoreo|configura|configuro|revisa|reviso|selecciona|selecciono|gestiona|gestiono|monitors?|selects?|configures?|manages?|reviews?)\b/],
    ['FPM',/\b(manual|manualmente|manually|ap desconectado|autopilot off)\b/,/\b(controla|controlo|mantiene|mantuvo|vuela|volo|corrige|corrigio|flies|controls?|maintains?|corrects?)\b/],
    ['LTW',/\b(crm|equipo|coordinacion|coopera|coopero|teamwork|coordination|cooperates?)\b/],
    ['PSD',/\b(decide|decidio|decision|amenazas|mitigacion|errores|opciones|decides?|threats?|errors?|options?|mitigation)\b/],
    ['SAW',/\b(reconoce|reconocio|detecta|detecto|verifica|verifico|evalua|evaluo|monitorea|monitoreo|recognizes?|detects?|monitors?|checks?)\b/,/\b(estado|posicion|energia|entorno|terreno|trafico|state|position|energy|environment|terrain|traffic)\b/],
    ['WLM',/\b(tareas|carga de trabajo|distribuye|distribuyo|delega|delego|prioriza|priorizo|tasks?|workload|delegates?|prioritizes?)\b/]
  ];

  // Concise descriptions adapted from IATA's Pilot Competency Framework, Appendix A.
  A.definitions={
  "KNO": "Comprende y aplica los conocimientos necesarios para la operación.",
  "APK": "Aplica procedimientos y respeta la normativa durante la operación.",
  "COM": "Intercambia información de forma clara, precisa y oportuna.",
  "FPA": "Controla la trayectoria utilizando la automatización y supervisa sus modos.",
  "FPM": "Controla manualmente la aeronave con precisión y mantiene la trayectoria.",
  "LTW": "Colabora, coordina e influye para alcanzar los objetivos del equipo.",
  "PSD": "Identifica problemas, valora alternativas y toma decisiones oportunas.",
  "SAW": "Comprende la situación y anticipa sus efectos sobre la operación.",
  "WLM": "Prioriza y distribuye tareas, tiempo y recursos para gestionar la carga."
};
  const additionalProbes=[
    ['KNO',/\b(conocimientos?|desconocimiento|comprension|comprende|entiende|dominio|knowledge|understanding)\b/,/\b(sistemas?|limitaciones?|procedimientos?|aeronave|systems?|limitations?|procedures?|aircraft)\b/],
    ['APK',/\b(cumplimiento|incumplimiento|aplicacion|omision|seguimiento|participa|participacion|participates?|participation|compliance|noncompliance|application|omission)\b/,/\b(procedimientos?|checklists?|listas?|normativa|sop|briefing|procedures?)\b/],
    ['LTW',/\b(participacion|participa|participaba|participaron|colabora|colaboracion|colaboro|coopera|cooperacion|coordinacion|coordina|participation|participates?|collaborates?|collaboration|cooperation|coordinates?)\b/],
    ['FPA',/\b(uso|manejo|gestion|seleccion|supervision|verificacion|monitoreo|monitorizacion|monitoring|use|management|selection)\b/,/\b(automatizacion|fma|fms|piloto automatico|automation|autopilot)\b/],
    ['FPM',/\b(control|pilotaje|vuelo|manejo|flight|flying)\b/,/\b(manual|manualmente|manually)\b/],
    ['PSD',/\b(resolucion|solucion|identificacion|evaluacion|mitigacion|manejo|analisis|decision|resuelve|evalua|resolution|solving|assessment|decision)\b/,/\b(problemas?|amenazas?|errores?|alternativas?|opciones?|problems?|threats?|errors?|alternatives?|options?)\b/],
    ['SAW',/\b(conciencia|consciencia|conocimiento|comprension|perdida|identificacion|reconocimiento|awareness|understanding|recognition|loss)\b/,/\b(situacion|entorno|trafico|terreno|energia|posicion|situational|situation|environment|traffic|terrain|energy|position)\b/],
    ['WLM',/\b(priorizacion|distribucion|delegacion|organizacion|planificacion|sobrecarga|prioritisation|prioritization|distribution|delegation|planning)\b/,/\b(tareas?|trabajo|tiempo|carga|tasks?|workload|time|work)\b/]
  ];
  const nonEvidence=n=>/\b(instructor|evaluador|assessor|debe|deben|debera|deberia|deberian|should|must|creo|parece|supongo|quiza|se espera|se recomienda|tendria|would|could)\b/.test(n)||/\b(no (?:se )?(?:observo|observa|evidencio|evidencia|evaluo|evalua)|sin evidencia|not observed|not assessed|no evidence)\b/.test(n);
  // Repair typing repetitions against a bounded vocabulary, not arbitrary technical identifiers.
  const typingWords=('participa participación activamente procedimiento procedimientos comunica comunicación coordina coordinación colabora colaboración coopera cooperación aplica aplicación ejecuta ejecución omite omisión identifica identificación verifica verificación revisa revisión configura configuración mantiene monitorea supervisa prioriza priorización distribuye distribución tareas trabajo conocimiento conocimientos comprende explica limitación limitaciones sistema sistemas amenaza amenazas decisión decisiones resuelve problema problemas situación conciencia entorno energía velocidad altitud trayectoria automatización manual correctamente incorrectamente adecuada adecuado inadecuada inadecuado durante estudiante piloto briefing checklist terreno tráfico equipo información anticipa reconoce detecta participa participates participation actively procedure procedures communicates communication coordinates coordination collaborates collaboration applies executes omits identifies verifies reviews configures maintains monitors prioritises prioritizes tasks workload knowledge understands explains limitations systems threats decisions situation awareness energy speed altitude flight automation manually correctly incorrectly').split(' ');
  const repetitionKey=w=>A.norm(w).replace(/([a-z])\1+/g,'$1');
  typingWords.push(...'have has had does do did not knows know understand understanding explain demonstrate demonstrates demonstrated lack lacks lacked follow follows followed apply applied execute executed omit omitted communicate communicated coordinate coordinated maintain maintained monitor monitored identify identified detect detected recognise recognizes recognised recognize recognized prioritise prioritised prioritize prioritized distribute distributed delegate delegated manage manages managed select selected configure configured review reviewed system limitation threat decision task resource resources manual flight path control controls controlled altitude speed clearance approach landing takeoff checklist readback information situational awareness teamwork correctly incorrect sufficient insufficient poor good'.split(' '));
  const byRepetition=new Map();
  for(const word of new Set(typingWords)){const key=repetitionKey(word);const bucket=byRepetition.get(key)||[];bucket.push(word);byRepetition.set(key,bucket);}
  const typoWords={partisipa:'participa',particpa:'participa',particpacion:'participación',partisipacion:'participación',participasion:'participación',activamnete:'activamente',proceidmiento:'procedimiento',procedimeinto:'procedimiento',comunicaicon:'comunicación',cooridna:'coordina',identifca:'identifica',verifca:'verifica',conocimineto:'conocimiento',conociminetos:'conocimientos',priorisacion:'priorización'};
  function repairTyping(raw){
    return String(raw||'').replace(/\p{L}+/gu,(word,offset,source)=>{
      if(/[\d_-]/.test(source[offset-1]||'')||/[\d_-]/.test(source[offset+word.length]||''))return word;
      const n=A.norm(word),matches=byRepetition.get(repetitionKey(word));
      const replacement=typoWords[n]||(matches?.length===1?matches[0]:null);
      if(!replacement)return word;
      return word[0]===word[0].toUpperCase()?replacement[0].toUpperCase()+replacement.slice(1):replacement;
    });
  }
  Object.assign(typoWords,{knowledged:'knowledge',knowlege:'knowledge',knolwedge:'knowledge',knowlegde:'knowledge',knowladge:'knowledge',knwoledge:'knowledge',hav:'have',doesnt:"doesn't",dont:"don't",didnt:"didn't",isnt:"isn't",wasnt:"wasn't",arent:"aren't",understnad:'understand',understnads:'understands',understading:'understanding',proceduer:'procedure',proceduers:'procedures',proceedure:'procedure',proceedures:'procedures',comunication:'communication',communciation:'communication',comunicates:'communicates',comunicate:'communicate',comunicated:'communicated',mantains:'maintains',mantained:'maintained',maintian:'maintain',maintians:'maintains',maintianed:'maintained',moniter:'monitor',moniters:'monitors',monitered:'monitored',altiude:'altitude',altitute:'altitude',clearence:'clearance',awarness:'awareness',situatonal:'situational',worklod:'workload',recieved:'received',recieve:'receive',breifing:'briefing',cheklist:'checklist',checlist:'checklist',corrrectly:'correctly'});
  const englishProbes=[
    ['KNO',/\b(knowledge|understanding|knows?|understands?|explains?|explained|demonstrates?|demonstrated|lacks?|lacked)\b/,/\b(knowledge|understanding|systems?|limitations?|procedures?|aircraft)\b/],
    ['APK',/\b(follows?|followed|appl(?:y|ies|ied)|executes?|executed|omits?|omitted|complet(?:e|es|ed)|fails?|failed)\b/,/\b(procedures?|checklists?|sop|briefing|go.around)\b/],
    ['COM',/\b(communicat(?:e|es|ed|ion)|readback|phraseology|briefing)\b/],
    ['FPA',/\b(configur(?:e|es|ed)|select(?:s|ed)?|monitor(?:s|ed)?|review(?:s|ed)?|manag(?:e|es|ed))\b/,/\b(fms|fma|automation|autopilot|flight director)\b/],
    ['FPM',/\b(control(?:s|led)?|maintain(?:s|ed)?|fl(?:y|ies|ew))\b/,/\b(manual|manually|autopilot off|autopilot disconnected)\b/],
    ['LTW',/\b(coordinat(?:e|es|ed|ion)|collaborat(?:e|es|ed|ion)|cooperat(?:e|es|ed|ion)|teamwork|participat(?:e|es|ed|ion))\b/],
    ['PSD',/\b(decid(?:e|es|ed)|decisions?|solv(?:e|es|ed)|assess(?:es|ed)?|evaluat(?:e|es|ed))\b/,/\b(decisions?|problems?|alternatives?|options?|threats?|errors?)\b/],
    ['SAW',/\b(awareness|recogniz(?:e|es|ed)|recognis(?:e|es|ed)|detect(?:s|ed)?|monitor(?:s|ed)?|identif(?:y|ies|ied))\b/,/\b(situational|situation|terrain|traffic|energy|position|environment)\b/],
    ['WLM',/\b(prioriti[sz](?:e|es|ed)|distribut(?:e|es|ed)|delegat(?:e|es|ed)|manag(?:e|es|ed)|workload)\b/,/\b(tasks?|workload|time|resources?)\b/]
  ];
  const isEnglish=text=>/\b(the pilot|the student|does(?:n['’]t)?|did(?:n['’]t)?|don['’]t|have|has|knowledge|understands?|communicat(?:e|es|ed)|maintain(?:s|ed)?|follow(?:s|ed)?|participates?|procedure[s]?|workload|awareness)\b/i.test(text);
  function polishEnglish(raw){
    let s=repairTyping(raw).trim().replace(/[\t ]+/g,' ');
    s=s.replace(/\bdoesn[’']t\b/gi,'does not').replace(/\bdon[’']t\b/gi,'do not').replace(/\bdidn[’']t\b/gi,'did not');
    s=s.replace(/\b(CM[12]|PF|PM|the pilot|the student|he|she) do not\b/gi,'$1 does not');
    s=s.replace(/\bdoes not has\b/gi,'does not have');
    s=s.replace(/\b(does not|did not|do not) (knows|understands|follows|communicates|maintains|monitors|identifies|applies|has)\b/gi,(_,aux,verb)=>aux+' '+({knows:'know',understands:'understand',follows:'follow',communicates:'communicate',maintains:'maintain',monitors:'monitor',identifies:'identify',applies:'apply',has:'have'}[verb.toLowerCase()]));
    s=s.replace(/\s+([,;:.!?])/g,'$1').replace(/([,;:])(?=\S)/g,'$1 ');
    s=s.replace(/\b(cm[12]|pf|pm|fms|fma|atc|crm|gps|gnss|sop|qrh|ecam|ils|rnp|vor|ap|fd|fcu|pfd|nd)\b/gi,w=>w.toUpperCase());
    s=s.replace(/(^|[.!?]\s+|\n)(\p{L})/gu,(_,a,b)=>a+b.toUpperCase());
    if(s&&!/[.!?]$/.test(s))s+='.';
    return s;
  }
  function expandBriefNotes(raw){
    const normalized=repairTyping(raw).replace(/\b(partisipacion|participasion|participacion)\b/gi,'participación').replace(/\bprosedimiento(s?)\b/gi,'procedimiento$1');
    return A.polish(normalized).split(/(?<=[.!?])\s+|\n+/).map(sentence=>{
      if(nonEvidence(A.norm(sentence))||/\?$/.test(sentence))return sentence;
      const subject=sentence.match(/^(El piloto|El estudiante|CM1|CM2|PF|PM)\s*(?::|-)?\s+/i);
      const who=subject?subject[1]:'El piloto',body=(subject?sentence.slice(subject[0].length):sentence).replace(/[.!]$/,'');
      let m;
      if((m=body.match(/^participaci[oó]n activa(\s+(?:en|durante|con)\s+.+)?$/i)))return who+' participa activamente'+(m[1]||'')+'.';
      if((m=body.match(/^participaci[oó]n (limitada|escasa|insuficiente)(\s+(?:en|durante|con)\s+.+)?$/i)))return who+' participa de forma '+m[1].toLowerCase()+(m[2]||'')+'.';
      if((m=body.match(/^(?:sin participaci[oó]n|(?:falta|ausencia) de participaci[oó]n)(\s+(?:en|durante|con)\s+.+)?$/i)))return who+' no participa'+(m[1]||'')+'.';
      if((m=body.match(/^(cumplimiento|incumplimiento|omisi[oó]n)\s+(de(?:l)?\s+.+)$/i))){
        const action=/^incumpl/i.test(m[1])?'incumple':/^omisi/i.test(m[1])?'omite':'cumple';
        return who+' '+action+' '+m[2].replace(/^del\s+/i,'el ').replace(/^de\s+/i,'')+'.';
      }
      if((m=body.match(/^aplicaci[oó]n (adecuada|correcta|inadecuada|incorrecta)\s+(de(?:l)?\s+.+)$/i)))return who+' aplica de forma '+m[1].toLowerCase()+' '+m[2].replace(/^del\s+/i,'el ').replace(/^de\s+/i,'')+'.';
      return sentence;
    }).join(' ');
  }

  A.analyze=(raw,g,group)=>{
    const english=isEnglish(repairTyping(raw))&&!/\b(el piloto|el estudiante|conocimiento|procedimiento|participa|comunica|mantiene)\b/i.test(raw);
    const prepared=english?polishEnglish(raw):expandBriefNotes(raw),result=baseAnalyze(prepared,g,group),byCode=new Map();
    // The legacy Spanish polisher must never translate English evidence or technical terms.
    if(english){result.corrected=prepared;result.candidates=[];result.questions=[];result.warnings=[];}
    result.original=String(raw||'');result.changed=result.corrected!==result.original.trim();
    result.candidates=result.candidates.filter(c=>!nonEvidence(A.norm(c.evidence)));
    result.reasons={};
    for(const ob of result.candidates){const c=byCode.get(ob.competency)||{code:ob.competency,evidence:[],source:'ob'};if(!c.evidence.includes(ob.evidence))c.evidence.push(ob.evidence);byCode.set(c.code,c);}
    for(const sentence of result.corrected.split(/(?<=[.!?;])\s+|,\s+/)){
      const n=A.norm(sentence);
      if(nonEvidence(n)||/\?$/.test(sentence))continue;
      for(const [code,...tests] of [...probes,...additionalProbes,...englishProbes])if(tests.every(re=>re.test(n))&&!byCode.has(code))byCode.set(code,{code,evidence:[sentence],source:'competency'});
    }
    if(byCode.size){
      result.questions=result.questions.filter(q=>!q.startsWith('Añade una acción u omisión concreta'));
    }
    if([...byCode.values()].some(c=>c.source==='competency')&&/participa|participacion/.test(A.norm(result.corrected))){
      result.questions.push('Participación: precisa la contribución del piloto; participar no demuestra por sí solo la aplicación correcta del procedimiento.');
    }
    result.competencies=Array.from(byCode.values()).map(c=>({...c,evidence:c.evidence.join(' ')}));
    if(english&&byCode.has('KNO'))result.questions.push('Conocimientos: precisa el sistema, limitación o procedimiento y qué dijo o hizo el piloto. Una afirmación general no demuestra un OB específico.');
    if(english&&!byCode.size)result.questions.push('Describe una acción u omisión concreta del piloto y su contexto. No se ha confirmado ninguna competencia ni OB automáticamente.');
    return result;
  };
  A.validateRecord=(r,g)=>{
    const valid=baseValidate(r,g),selected=r.competencies||[];
    if(!Array.isArray(selected)||new Set(selected.map(c=>c.code)).size!==selected.length)throw Error('Revisa las competencias seleccionadas.');
    for(const c of selected){if(!A.names[c.code])throw Error('Competencia no válida.');if(!c.evidence?.trim())c.evidence=r.corrected;if(!c.evidence?.trim())throw Error('Escribe una observación del piloto.');}
    return JSON.parse(JSON.stringify({...valid,competencies:selected}));
  };
})();
