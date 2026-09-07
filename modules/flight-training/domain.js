globalThis.FTDomain = (() => {
  function pagesForSession(guide, evaluation, scenario) {
    if (!guide.evals[evaluation]) throw new Error('Evaluación no válida');
    if (evaluation === 'eval1') return guide.pages.filter(p => p.eval === evaluation);
    if (!guide.evals.eval2.scenarios.includes(scenario)) throw new Error('Escenario no válido');
    return guide.pages.filter(p => p.eval === evaluation && (!p.scenario || p.scenario === scenario));
  }
  function eventsForPage(page, scenario) {
    return page.events.filter(e => !e.scenario || e.scenario === scenario);
  }
  function validateEvidence(raw, guide) {
    const page = guide.pages.find(p => p.id === raw.pageId);
    const event = page?.events.find(e => e.id === raw.eventId);
    if (!page || !event) throw new Error('Selecciona un evento de la guía.');
    if (page.eval !== raw.evaluation) throw new Error('El evento no corresponde al EVAL.');
    if (page.eval === 'eval2' && (!guide.evals.eval2.scenarios.includes(raw.scenario) || (event.scenario && event.scenario !== raw.scenario))) throw new Error('El evento no corresponde al escenario activo.');
    if (!['piloto','instructor'].includes(raw.target)) throw new Error('Selecciona el sujeto observado.');
    if (!['CM1','CM2','Instructor'].includes(raw.person)) throw new Error('Selecciona el participante.');
    if ((raw.target === 'instructor') !== (raw.person === 'Instructor')) throw new Error('El participante y el sujeto observado no coinciden.');
    if (!['PF','PM','Instructor'].includes(raw.role)) throw new Error('Selecciona la función.');
    if ((raw.target === 'instructor') !== (raw.role === 'Instructor')) throw new Error('La función no corresponde al sujeto observado.');
    if (!['MTV','EVAL','SBT'].includes(raw.phase)) throw new Error('Selecciona la fase real.');
    if (!['Sin intervención','Intervención de seguridad','Aclaración de simulación','Instrucción / coaching'].includes(raw.intervention)) throw new Error('Selecciona el tipo de intervención.');
    if (raw.phase === 'EVAL' && raw.intervention === 'Instrucción / coaching' && !raw.contamination.trim()) throw new Error('Documenta cómo afectó la instrucción a la evidencia de EVAL.');
    if (raw.behavior.trim().length < 12 || raw.context.trim().length < 8 || raw.effect.trim().length < 8) throw new Error('Describe el contexto, la conducta observada y su efecto con suficiente detalle.');
    if ([raw.behavior,raw.context,raw.effect,raw.contamination].some(t => t.length > 4000)) throw new Error('Cada campo admite hasta 4000 caracteres.');
    return {...raw,context:raw.context.trim(),behavior:raw.behavior.trim(),effect:raw.effect.trim(),contamination:raw.contamination.trim(),status:'Evidencia sin calificar',obCode:null,score:null,frameworkVersion:null};
  }
  function canFinalize(guide) { return guide.scaleApproved === true && guide.obCatalogueApproved === true; }
  return {pagesForSession,eventsForPage,validateEvidence,canFinalize};
})();
