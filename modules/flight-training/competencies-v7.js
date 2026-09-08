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
  function expandBriefNotes(raw){
    const normalized=String(raw||'').replace(/\b(partisipacion|participasion|participacion)\b/gi,'participación').replace(/\bprosedimiento(s?)\b/gi,'procedimiento$1');
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
    const prepared=expandBriefNotes(raw),result=baseAnalyze(prepared,g,group),byCode=new Map();
    result.original=String(raw||'');result.changed=result.corrected!==result.original.trim();
    result.candidates=result.candidates.filter(c=>!nonEvidence(A.norm(c.evidence)));
    result.reasons={};
    for(const ob of result.candidates){const c=byCode.get(ob.competency)||{code:ob.competency,evidence:[],source:'ob'};if(!c.evidence.includes(ob.evidence))c.evidence.push(ob.evidence);byCode.set(c.code,c);}
    for(const sentence of result.corrected.split(/(?<=[.!?;])\s+|,\s+/)){
      const n=A.norm(sentence);
      if(nonEvidence(n)||/\?$/.test(sentence))continue;
      for(const [code,...tests] of [...probes,...additionalProbes])if(tests.every(re=>re.test(n))&&!byCode.has(code))byCode.set(code,{code,evidence:[sentence],source:'competency'});
    }
    if(byCode.size){
      result.questions=result.questions.filter(q=>!q.startsWith('Añade una acción u omisión concreta'));
    }
    if([...byCode.values()].some(c=>c.source==='competency')&&/participa|participacion/.test(A.norm(result.corrected))){
      result.questions.push('Participación: precisa la contribución del piloto; participar no demuestra por sí solo la aplicación correcta del procedimiento.');
    }
    result.competencies=Array.from(byCode.values()).map(c=>({...c,evidence:c.evidence.join(' ')}));
    return result;
  };
  A.validateRecord=(r,g)=>{
    const valid=baseValidate(r,g),selected=r.competencies||[];
    if(!Array.isArray(selected)||new Set(selected.map(c=>c.code)).size!==selected.length)throw Error('Revisa las competencias seleccionadas.');
    for(const c of selected){if(!A.names[c.code])throw Error('Competencia no válida.');if(!c.evidence?.trim())c.evidence=r.corrected;if(!c.evidence?.trim())throw Error('Escribe una observación del piloto.');}
    return JSON.parse(JSON.stringify({...valid,competencies:selected}));
  };
})();
