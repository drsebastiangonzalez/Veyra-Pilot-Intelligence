/* Local, conservative writing and evidence support. No remote AI or grading. */
globalThis.FTAssistant = (() => {
  const areas = [
    ['pilot','Competencias del piloto ejercidas por el instructor'],
    ['environment','Gestión del entorno de aprendizaje'],
    ['instruction','Instrucción'],
    ['interaction','Interacción con los participantes'],
    ['assessment','Evaluación y valoración del desempeño']
  ];
  const norm = s => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const corrections = {
    brifing:'briefing',brifin:'briefing',breafing:'briefing',briefin:'briefing',
    debrifing:'debriefing',debrifin:'debriefing',debriefin:'debriefing',
    evalucion:'evaluación',evaluacion:'evaluación',evalua:'evalúa',
    observo:'observó',observacion:'observación',observasiones:'observaciones',
    corrigio:'corrigió',correcion:'corrección',explico:'explicó',
    explicacion:'explicación',identifico:'identificó',intervino:'intervino',
    verifico:'verificó',retroalimentacion:'retroalimentación',
    instuctor:'instructor',intrutor:'instructor',intructor:'instructor',
    aproximacion:'aproximación',comunicacion:'comunicación',
    atencion:'atención',desicion:'decisión',decicion:'decisión',
    desiciones:'decisiones',desempeno:'desempeño'
  };
  function polish(raw) {
    // Small dictionary only; original always retained for review. No fact completion.
    let s=String(raw||'').trim().replace(/[\t ]+/g,' ').replace(/ *\n */g,'\n');
    if(s && s===s.toUpperCase()) s=s.toLowerCase();
    s=s.replace(/[\p{L}]+/gu,w=>corrections[w.toLowerCase()]||w);
    s=s.replace(/\s+([,;:.!?])/g,'$1').replace(/([,;:])(?=\S)/g,'$1 ');
    s=s.replace(/\b(gps|gnss|fma|tcas|crm|fms|atc|ebt|pf|pm|mtv|sbt)\b/gi,w=>w.toUpperCase());
    s=s.replace(/(^|[.!?]\s+|\n)([\p{L}])/gu,(_,a,b)=>a+b.toUpperCase());
    if(s&&!/[.!?]$/.test(s)) s+='.';
    return s;
  }
  const rules = [
    ['environment',/\b(preparo|configuro|ajusto|organizo|programo|verifico|explico|informo|intervino|intervencion|detuvo|repuso|reposiciono)\b/,/simulador|dispositivo|escenario|limitacion|seguridad|condicion|sesion|peligro|riesgo/,'Preparación del entorno o gestión de una intervención.'],
    ['instruction',/\b(explico|demostro|adapto|pregunto|enseno|retroalimento|corrigio|comprobo|permitio|facilito|guio|dio|dijo|preguntas|explica|demuestra)\b/,/briefing|objetivo|comprension|aprendizaje|explicacion|tecnica|respuesta|reflexion|error|procedimiento|ayuda|retroalimentacion|alumno|piloto|tripulacion/,'Técnica de instrucción, facilitación o retroalimentación.'],
    ['interaction',/\b(escucho|interrumpio|pregunto|permitio|invito|descalifico|ridiculizo|respeto|adapto|grito|hablo|escucha|interrumpe)\b/,/alumno|piloto|tripulacion|participante|pregunta|respuesta|dialogo|explicacion|comunicacion/,'Interacción y oportunidad de participación.'],
    ['assessment',/\b(registro|anoto|contrasto|comparo|justifico|califico|asigno|evaluo|valoro|confirmo|omitio|reviso|diferencio|vinculo|documento|bajo|subio|cambio|registra)\b/,/evidencia|conducta|criterio|estandar|nota|calificacion|resultado|desempeno|competencia|reputacion|historial|primera impresion/,'Relación entre la evidencia y el juicio de evaluación.'],
    ['pilot',/\b(demostro|ejecuto|tomo|mantuvo|corrigio|explico|identifico|aplico)\b/,/control de la aeronave|trayectoria|maniobra|procedimiento|limitaciones|control manual/,'Desempeño técnico del propio instructor; no del alumno.']
  ];
  function analyze(raw) {
    const corrected=polish(raw), candidates=[], warnings=[];
    const sentences=corrected.split(/(?<=[.!?])\s+|\n+/).filter(Boolean);
    let concrete=false;
    for(const sentence of sentences){
      let n=norm(sentence);
      if(/\b(creo|parece|tal vez|posiblemente|supongo)\b/.test(n)){
        warnings.push('Hay una interpretación: confirma qué hizo o dijo el instructor antes de asociar competencias.');continue;
      }
      // Only instructor conduct; the event name and pilot focus are never inputs.
      const subject=n.search(/\b(?:el instructor|la instructora|el evaluador|la evaluadora|docente)\b/);
      if(subject>=0){
        n=n.slice(subject);
        // A report about what a pupil did is not the instructor doing it.
        n=n.split(/\b(?:que )?(?:el alumno|la alumna|el piloto|la piloto|la tripulacion|el estudiante|cm1|cm2)\b/)[0];
      }
      else if(/\b(?:el alumno|la alumna|el piloto|la piloto|la tripulacion|el estudiante|cm1|cm2)\b/.test(n.slice(0,55)))continue;
      for(const [area,verb,topic,behavior] of rules){
        if(verb.test(n)&&topic.test(n)){
          concrete=true;
          if(!candidates.some(c=>c.area===area&&c.evidence===sentence))candidates.push({area,evidence:sentence,behavior,obCode:null,status:'Sugerencia pendiente'});
        }
      }
      if(/\b(califico|asigno|evaluo|valoro|bajo|subio|cambio|descalifico|ignoro|comparo|justifico)\b/.test(n)&&/reputacion|historial|primera impresion|por ser|amigo|simpatia|sin (?:revisar|contrastar|registrar)|solo (?:por|porque)/.test(n)){
        warnings.push('Revisar posible sesgo: contrasta el criterio utilizado con la evidencia de esta sesión. Esto no demuestra sesgo por sí solo.');
        if(!candidates.some(c=>c.area==='assessment'&&c.evidence===sentence))candidates.push({area:'assessment',evidence:sentence,behavior:'Objetividad del juicio de evaluación: aspecto por contrastar.',obCode:null,status:'Sugerencia pendiente'});
        concrete=true;
      }
      if(/\b(sesgado|sesgo|injusto)\b/.test(n)&&!concrete)warnings.push('La etiqueta no es evidencia. Describe una decisión concreta del evaluador y el criterio que utilizó.');
    }
    if(!candidates.length)warnings.push('No hay asociación automática suficientemente clara. Describe una acción concreta del instructor; puedes conservar la observación sin asignar competencia.');
    if(/\b(dio|dijo|anticipo|indico)\b/.test(norm(raw))&&/respuesta|solucion|que hacer/.test(norm(raw)))warnings.push('Si ocurrió en EVAL, documenta cómo influyó la ayuda en la independencia de la evidencia. Una intervención de seguridad no es un error por sí misma.');
    return {original:String(raw||''),corrected,candidates,warnings:[...new Set(warnings)],engine:'Reglas locales · revisión humana',score:null};
  }
  function events(guide,evaluation,scenario){
    return FTDomain.pagesForSession(guide,evaluation,scenario).flatMap(page=>FTDomain.eventsForPage(page,scenario).map(event=>({page,event})));
  }
  function validateRecord(record,guide){
    const valid=events(guide,record.evaluation,record.scenario).find(x=>x.event.id===record.eventId);
    if(!valid)throw Error('El evento no pertenece al recorrido.');
    if(record.target!=='instructor')throw Error('Esta revisión evalúa al instructor.');
    if(!record.original?.trim()||!record.corrected?.trim())throw Error('Escribe y revisa la observación.');
    if(record.original.length>4000||record.corrected.length>5000)throw Error('La observación supera el límite.');
    if(!['MTV','EVAL','SBT'].includes(record.phase))throw Error('Fase no válida.');
    if(!Array.isArray(record.confirmed)||record.confirmed.some(c=>!areas.some(a=>a[0]===c.area)||!c.evidence||c.obCode!==null))throw Error('La asociación requiere evidencia y revisión.');
    return {...record,score:null,official:false};
  }
  return {areas,polish,analyze,events,validateRecord};
})();
