/* Pilot evidence support; descriptors are loaded from the authorized Veyra catalogue. */
globalThis.FTAssistant = (() => {
  'use strict';
  const names={KNO:'Aplicación de conocimientos',APK:'Aplicación de procedimientos y cumplimiento',COM:'Comunicación',FPA:'Gestión de la trayectoria mediante automatización',FPM:'Gestión de la trayectoria mediante vuelo manual',LTW:'Liderazgo y trabajo en equipo',PSD:'Resolución de problemas y toma de decisiones',SAW:'Conciencia de la situación',WLM:'Gestión de la carga de trabajo'};
  const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const words={pilot:'piloto',piltoo:'piloto',pilto:'piloto',brifing:'briefing',brifin:'briefing',breafing:'briefing',briefin:'briefing',debrifing:'debriefing',aproximacion:'aproximación',aproxiamcion:'aproximación',aproxiamción:'aproximación',aproximacoin:'aproximación',desestabilisado:'desestabilizado',inestabilisada:'inestabilizada',desicion:'decisión',decicion:'decisión',desiciones:'decisiones',comunicacion:'comunicación',mitigacion:'mitigación',evaluacion:'evaluación',observacion:'observación',observasiones:'observaciones',prosedimiento:'procedimiento',prosedimientos:'procedimientos',procedimineto:'procedimiento',procediminetos:'procedimientos',verificacion:'verificación',verifico:'verificó',identifico:'identificó',realizo:'realizó',efectuo:'efectuó',aplico:'aplicó',ejecuto:'ejecutó',explico:'explicó',corrigio:'corrigió',corrijio:'corrigió',corrije:'corrige',correcion:'corrección',configuracion:'configuración',configuro:'configuró',navegacion:'navegación',interferensia:'interferencia',interferensias:'interferencias',omision:'omisión',presion:'presión',reaccion:'reacción',gestion:'gestión',situacion:'situación',perdida:'pérdida',aterrisaje:'aterrizaje',aterriso:'aterrizó',atencion:'atención',anticipo:'anticipó',concluyo:'concluyó',reviso:'revisó',completo:'completó',parametros:'parámetros',parametro:'parámetro',energia:'energía',tecnica:'técnica',tecnicas:'técnicas',limitacion:'limitación',tripulacion:'tripulación',altitid:'altitud',velosidad:'velocidad',estubo:'estuvo',tambien:'también'};
  const known=new Set(('mal paso sobre piloto estudiante realiza realizó vuelo manual aproximación frustrada cabina briefing no sí bien mantiene alto baja velocidad desestabilizado desestabilizada '+Object.keys(words).join(' ')+' '+Object.values(words).join(' ')).split(' '));
  function polish(raw){
    let s=String(raw||'').trim().replace(/[\t ]+/g,' ').replace(/ *\n */g,'\n');
    if(s&&s===s.toUpperCase())s=s.toLowerCase();
    s=s.replace(/[\p{L}]+/gu,w=>{let k=w.toLowerCase();const shorter=k.replace(/([\p{L}])\1+/gu,'$1');if(known.has(shorter))k=shorter;const v=words[k]||k;return w[0]===w[0].toUpperCase()?v[0].toUpperCase()+v.slice(1):v;});
    s=s.replace(/\bsobre\s+paso\b|\bsobrepaso\b|\bgo[ -]?around\b/gi,'aproximación frustrada');
    s=s.replace(/\b(no\s+)?realiza\s+(?:la\s+|una\s+)?aproximación frustrada\b/gi,(_,no)=>(no||'')+'ejecuta una aproximación frustrada');
    s=s.replace(/no realiza adecuadamente el briefing inicial\s+mitigación de amenazas/gi,'no realiza adecuadamente el briefing inicial ni la mitigación de amenazas');
    s=s.replace(/,\s*mal manejo de\s+CRM\b/gi,'. Presenta dificultades en el manejo de CRM');
    s=s.replace(/,\s*no realiza adecuadamente la aproximación/gi,'. No realiza adecuadamente la aproximación');
    s=s.replace(/,\s*llega (desestabilizado|desestabilizada|inestable)/gi,'; llega $1');
    s=s.replace(/,\s*y\s+(?=no\b)/gi,' y ');
    s=s.replace(/\s+([,;:.!?])/g,'$1').replace(/([,;:])(?=\S)/g,'$1 ');
    s=s.replace(/\b(?:gps|gnss|fma|tcas|crm|fms|atc|ebt|pf|pm|mtv|sbt|sop|rnp|ils|vor|nd|pfd|ap|fd|fcu|ecam|qrh|tem|cm1|cm2)\b/gi,w=>w.toUpperCase());
    s=s.replace(/\bsk[a-z]{2}\b/gi,w=>w.toUpperCase());
    s=s.replace(/(^|[.!?]\s+|\n)([\p{L}])/gu,(_,a,b)=>a+b.toUpperCase());
    if(s&&!/[.!?]$/.test(s))s+='.';
    return s;
  }
  function catalogue(g){return g.pilotCatalogue?.items||[];}
  function events(g,evaluation,scenario){return FTDomain.pagesForSession(g,evaluation,scenario).flatMap(page=>FTDomain.eventsForPage(page,scenario).map(event=>({page,event})));}
  function groups(g,evaluation,scenario){
    const result=[];
    for(const item of events(g,evaluation,scenario)){
      const title=evaluation==='eval1'?item.event.phase:item.event.title.replace(/^Escenario \d · /,'');
      let group=result.find(x=>x.title===title);
      if(!group){group={id:item.event.id,title,items:[],codes:[],obPlan:[]};result.push(group);}
      group.items.push(item);group.codes=[...new Set([...group.codes,...item.event.codes])];group.obPlan=[...new Set([...group.obPlan,...(item.event.obPlan||[])])];
    }
    return result;
  }
  // Each rule needs an action and its object. A match is a review candidate, not a grade.
  const rules=[
    ['1.1',/\b(explica|explico|describe|describio|desconoce|confunde|identifica|identifico)\b/,/\b(sistema|sistemas|limitacion|limitaciones|tcas|fms|gnss)\b/],
    ['1.5',/\b(busca|busco|consulta|consulto|ubica|ubico|encuentra)\b/,/\b(manual|qrh|fcom|informacion|fuente)\b/],
    ['2.1',/\b(busca|busco|consulta|consulto|ubica|ubico|identifica|identifico)\b/,/\b(procedimiento|procedimientos|regulacion|sop)\b/],
    ['2.2',/\b(realiza|realizo|ejecuta|ejecuto|aplica|aplico|completa|completo|omite|omitio|cumple|sigue|inicio|inicia)\b/,/\b(checklist|lista|procedimiento|procedimientos|briefing|prueba|pruebas|frustrada|memory item|memoria)\b/],
    ['2.3',/\b(sigue|siguio|cumple|cumplio|incumple|incumplio|desvia|desvio)\b/,/\b(sop|procedimientos estandar)\b/],
    ['2.4',/\b(configura|configuro|selecciona|selecciono|opera|opero|completa|completo|carga|cargo)\b/,/\b(sistema|sistemas|fms|rad nav|tcas|flap|flaps|tren)\b/],
    ['2.5',/\b(monitorea|monitoreo|verifica|verifico|revisa|reviso|comprueba|comprobo)\b/,/\b(sistemas|sistema|ecam|fms|cb|c\/b)\b/],
    ['3.2',/\b(comunica|comunico|informa|informo|notifica|notifico|omite|omitio|realiza|realizo)\b/,/\b(briefing|atc|amenaza|amenazas|pm|pf|tripulacion)\b/],
    ['3.3',/\b(transmite|transmitio|comunica|comunico|expresa|expreso|mensaje|callout|briefing)\b/,/\b(claro|clara|preciso|precisa|ambiguo|confuso|incompleto|comprensible)\b/],
    ['3.4',/\b(confirma|confirmo|verifica|verifico|comprueba|comprobo)\b/,/\b(entendimiento|comprension|entendio|comprendio)\b/],
    ['3.5',/\b(escucha|escucho|interrumpe|interrumpio|ignora|ignoro)\b/,/\b(pm|pf|companero|tripulacion|respuesta|mensaje)\b/],
    ['3.9',/\b(usa|utiliza|utilizo|omite|omitio|aplica|aplico|incorrecta|incorrecto)\b/,/\b(fraseologia|colacion|colaciona|radiotelefonia)\b/],
    ['4.1',/\b(usa|utiliza|utilizo|gestiona|gestiono|configura|configuro|completa|completo|carga|cargo)\b/,/\b(fms|automatizacion|ap|piloto automatico|guiado)\b/],
    ['4.5',/\b(selecciona|selecciono|cambia|cambio|desconecta|desconecto|conecta|conecto|transiciona|transiciono)\b/,/\b(modo|modos|automatizacion|ap|piloto automatico|fd)\b/],
    ['4.6',/\b(monitorea|monitoreo|verifica|verifico|detecta|detecto|revisa|reviso|omite|omitio)\b/,/\b(fma|modos|modo|automatizacion)\b/],
    ['5.1',/\b(controla|controlo|mantiene|mantuvo|vuela|volo|corrige|corrigio)\b/,/\b(manual|manualmente|ap desconectado|sin piloto automatico)\b/],
    ['5.3',/\b(controla|controlo|ajusta|ajusto|gestiona|gestiono)\b/,/\b(actitud|empuje|pitch|potencia)\b/,/\b(manual|manualmente|ap desconectado)\b/],
    ['6.1',/\b(promueve|promovio|alienta|alento|impide|impidio|permite|permitio)\b/,/\b(participacion|comunicacion|intervencion|equipo)\b/],
    ['6.3',/\b(involucra|involucro|incluye|incluyo|excluye|excluyo|ignora|ignoro)\b/,/\b(pm|pf|companero|tripulacion)\b/,/\b(briefing|plan|planificacion|preparacion)\b/],
    ['6.4',/\b(considera|considero|ignora|ignoro|acepta|acepto|descarta|descarto)\b/,/\b(aporte|aportes|sugerencia|sugerencias|opinion|opiniones)\b/],
    ['7.1',/\b(identifica|identifico|gestiona|gestiono|mitiga|mitigo|omite|omitio|evalua|evaluo|mitigacion)\b/,/\b(amenaza|amenazas|error|errores)\b/],
    ['7.5',/\b(considera|considero|evalua|evaluo|descarta|descarto|compara|comparo|propone|propuso)\b/,/\b(opcion|opciones|alternativa|alternativas|alterno|frustrada|loc|vor)\b/],
    ['7.6',/\b(decide|decidio|decision|elige|eligio|opta|opto)\b/,/\b(continuar|alternar|frustrada|aproximacion|aterrizar|espera|navegacion)\b/],
    ['7.7',/\b(revisa|reviso|adapta|adapto|cambia|cambio|reconsidera|reconsidero)\b/,/\b(decision|plan|alternativa)\b/],
    ['8.1',/\b(identifica|identifico|reconoce|reconocio|detecta|detecto|evalua|evaluo)\b/,/\b(estado|falla|interferencia|degradacion|gps|gnss|sistema)\b/],
    ['8.2',/\b(monitorea|monitoreo|detecta|detecto|reconoce|reconocio|advierte|advirtio|evalua|evaluo)\b/,/\b(energia|velocidad|trayectoria|desestabilizada|desestabilizado|inestable|estabilizada)\b/],
    ['8.3',/\b(monitorea|monitoreo|identifica|identifico|reconoce|reconocio|evalua|evaluo)\b/,/\b(terreno|trafico|meteorologia|viento|entorno)\b/],
    ['8.4',/\b(verifica|verifico|contrasta|contrasto|valida|valido|compara|comparo|comprueba|comprobo)\b/,/\b(posicion|informacion|datos|calculos|fms|ruta|entrada|entradas)\b/],
    ['8.6',/\b(define|definio|prepara|preparo|planifica|planifico|omite|omitio)\b/,/\b(contingencia|contingencias|plan alternativo)\b/],
    ['9.2',/\b(prioriza|priorizo|planifica|planifico|organiza|organizo|distribuye|distribuyo)\b/,/\b(tarea|tareas|carga|tiempo|trabajo)\b/],
    ['9.5',/\b(delega|delego|asigna|asigno|reparte|repartio)\b/,/\b(tarea|tareas|funciones|trabajo)\b/],
    ['9.7',/\b(verifica|verifico|comprueba|comprobo|contrasta|contrasto|revisa|reviso)\b/,/\b(cruzada|cruzado|independiente|independientemente|calculo|calculos|acciones)\b/],
    ['9.9',/\b(recupera|recupero|retoma|retomo|gestiona|gestiono)\b/,/\b(interrupcion|distraccion|distracciones|interrupciones)\b/]
  ];
  function analyze(raw,g,group){
    const corrected=polish(raw),catalog=catalogue(g),candidates=[],warnings=[],questions=[];
    const parts=corrected.split(/(?<=[.!?;])\s+|,\s+|\s+y\s+(?=no\b|el (?:estudiante|piloto|instructor)|los estudiantes|CM[12]\b|PF\b|PM\b)/i).filter(Boolean);
    for(const evidence of parts){
      const n=norm(evidence);
      if(/\b(instructor|evaluador)\b/.test(n)&&!/(?:estudiante|piloto|cm1|cm2|pf|pm)\s+(?:no\s+)?(?:realiza|ejecuta|verifica|completa|omite|decide|mantiene)/.test(n)){warnings.push('La intervención del instructor se conserva como contexto; no se atribuye al desempeño autónomo del piloto.');continue;}
      if(/\b(creo|parece|quiza|supongo|deberia|debe|deben|se espera|tendria|tiene que|debera|ejemplo)\b/.test(n)){questions.push('Distingue lo que ocurrió de lo esperado o supuesto.');continue;}
      const meaning=/\b(no|sin|omite|omitio|incumple|incorrecto|incorrecta|tarde|ignora|ignoro|confunde|desconoce)\b/.test(n)?'Por mejorar':'Evidencia para revisar';
      for(const [code,...tests] of rules){
        const actionText=code==='4.5'?n.replace(/\b(?:el|un|del) cambio\b/g,'la transición'):n;
        if(!tests.every(re=>re.test(actionText)))continue;
        const ob=catalog.find(x=>x.code===code);if(!ob)continue;
        const requiresContext=code==='2.2'&&/no ejecuta una aproximacion frustrada/.test(n)&&!/\b(orden|ordeno|inestable|criterio)\b|desestabilizad/.test(norm(corrected));
        if(!candidates.some(c=>c.code===code&&c.evidence===evidence))candidates.push({...ob,evidence,meaning:requiresContext?'Evidencia para revisar':meaning,planned:!!group?.obPlan.includes(code),support:'Correspondencia parcial; confirmar',manual:false});
      }
      if(/\b(mal|bien)\b.*\bcrm\b|\bcrm\b.*\b(mal|bien)\b|dificultades.*crm/.test(n))questions.push('CRM: precisa qué ocurrió en la comunicación, la coordinación o el reparto de tareas para asociar COM, LTW o WLM.');
      if(/\b(aproximacion|maniobra)\b/.test(n)&&/\b(mal|bien|adecuadamente)\b/.test(n))questions.push('Aproximación: indica la desviación concreta y si el control era manual o automático; así se puede distinguir FPM de FPA.');
      if(/desestabilizad|inestable/.test(n)&&!/\b(reconoce|reconocio|detecta|detecto|advierte|advirtio|identifica|identifico)\b/.test(n))questions.push('Estabilización: añade el parámetro fuera de criterio, el momento y la respuesta del piloto. La condición de la aeronave no demuestra por sí sola SAW.');
      if(/no ejecuta una aproximacion frustrada/.test(n)&&!/\b(orden|ordeno|inestable|criterio)\b|desestabilizad/.test(norm(corrected)))questions.push('Frustrada: indica qué criterio o instrucción hacía necesaria la maniobra. La omisión se propone para revisar APK, sin concluir una desviación automáticamente.');
    }
    if(group&&/preparation|taxi/.test(norm(group.title))&&/aproximacion|aterrizaje|frustrada/.test(norm(corrected)))warnings.push('La observación menciona aproximación o aterrizaje y está registrada en '+group.title+'. Revisa la fase antes de confirmar.');
    if(/\b(sesgo|sesgado|reputacion|siempre falla|siempre lo hace mal|me cae)\b/.test(norm(raw)))warnings.push('Revisa el juicio del evaluador: conserva hechos observados y aplica el mismo criterio a ambos pilotos. Esta alerta no califica al estudiante.');
    if(!candidates.length)questions.push('Añade una acción u omisión concreta del piloto. También puedes consultar el catálogo y vincular un OB con su evidencia.');
    return {original:String(raw||''),corrected,changed:corrected!==String(raw||'').trim(),candidates,warnings:[...new Set(warnings)],questions:[...new Set(questions)],score:null};
  }
  function validateRecord(r,g){
    const group=groups(g,r.evaluation,r.scenario).find(x=>x.id===r.groupId);
    if(!group)throw Error('La fase o evento no pertenece al recorrido.');
    if(r.target!=='pilot'||!['CM1','CM2'].includes(r.person))throw Error('Selecciona el piloto evaluado.');
    if(!['PF','PM'].includes(r.role))throw Error('Selecciona la función del piloto.');
    if(!['MTV','EVAL','SBT'].includes(r.mode))throw Error('Selecciona el segmento de la sesión.');
    if(!r.original?.trim()||!r.corrected?.trim())throw Error('Escribe y revisa la observación.');
    if(r.original.length>6000||r.corrected.length>7000)throw Error('La observación supera el límite.');
    for(const c of r.confirmed){const ob=catalogue(g).find(x=>x.code===c.code);if(!ob||ob.competency!==c.competency||!c.evidence?.trim()||!r.corrected.includes(c.evidence))throw Error('Cada OB necesita una frase de la observación.');}
    return {...r,score:null,official:false,catalogueVersion:g.pilotCatalogue.version};
  }
  return {names,norm,polish,analyze,events,groups,catalogue,validateRecord};
})();
