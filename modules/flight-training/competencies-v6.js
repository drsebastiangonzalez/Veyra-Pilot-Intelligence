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
  A.analyze=(raw,g,group)=>{
    const result=baseAnalyze(raw,g,group),byCode=new Map();
    for(const ob of result.candidates){const c=byCode.get(ob.competency)||{code:ob.competency,evidence:[],source:'ob'};if(!c.evidence.includes(ob.evidence))c.evidence.push(ob.evidence);byCode.set(c.code,c);}
    for(const sentence of result.corrected.split(/(?<=[.!?;])\s+|,\s+/)){
      const n=A.norm(sentence);
      if(/\b(instructor|evaluador|assessor|debe|deberia|should|must|creo|parece|supongo)\b/.test(n))continue;
      for(const [code,...tests] of probes)if(tests.every(re=>re.test(n))&&!byCode.has(code))byCode.set(code,{code,evidence:[sentence],source:'competency'});
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
