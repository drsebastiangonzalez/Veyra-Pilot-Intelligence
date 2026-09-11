/* Evidence-based competency recognition complements competencies-v7 without auto-grading. */
(() => {
  'use strict';
  const A=globalThis.FTAssistant;
  if(!A?.analyze)return;

  const baseAnalyze=A.analyze;
  const splitEvidence=text=>String(text||'').split(/(?<=[.!?;])\s+|,\s+/).map(x=>x.trim()).filter(Boolean);
  const nonEvidence=n=>/\b(instructor|evaluador|assessor|debe|deben|debera|deberia|should|must|creo|parece|supongo|quiza|se espera|se recomienda|tendria|would|could)\b/.test(n)||/\b(no (?:se )?(?:observo|observa|evidencio|evidencia|evaluo|evalua)|sin evidencia|not observed|not assessed|no evidence)\b/.test(n);
  const evidenceClause=(text,test)=>splitEvidence(text).find(part=>{const n=A.norm(part);return !nonEvidence(n)&&test(n);})||'';
  const findCompetency=(result,code)=>Array.isArray(result.competencies)?result.competencies.find(c=>c.code===code):null;
  const addCompetency=(result,code,evidence)=>{
    result.competencies??=[];
    const existing=findCompetency(result,code);
    if(existing){
      const current=A.norm(existing.evidence||'');
      const stronger=A.norm(evidence||'');
      const modeOnly=/^(?:en )?(?:vuelo )?(?:manual|manualmente|automatizacion|automatico|autopilot|piloto automatico)$/;
      if(stronger&&(!current||modeOnly.test(current)||stronger.length>current.length+12))existing.evidence=evidence;
      return existing;
    }
    const item={code,evidence,source:'competency'};
    result.competencies.push(item);
    return item;
  };
  const addQuestion=(result,text)=>{
    result.questions??=[];
    if(!result.questions.includes(text))result.questions.push(text);
  };

  A.analyze=(raw,g,group)=>{
    const result=baseAnalyze(raw,g,group);
    result.competencies=Array.isArray(result.competencies)?result.competencies:[];
    result.questions=Array.isArray(result.questions)?result.questions:[];

    const text=result.corrected||String(raw||'');
    const n=A.norm(text);

    // Direct competency-level wording is review evidence, never an automatic OB confirmation.
    const sawPhrase=/\b(conciencia|consciencia)\s+situacional\b|\bsituational awareness\b/;
    const sawEvidence=evidenceClause(text,s=>sawPhrase.test(s));
    if(sawEvidence){
      addCompetency(result,'SAW',sawEvidence);
      if(!/\b(reconoce|reconocio|detecta|detecto|identifica|identifico|monitorea|monitoreo|anticipa|anticipo|recognizes?|detects?|identifies?|monitors?|anticipates?)\b/.test(A.norm(sawEvidence))){
        addQuestion(result,'Conciencia situacional: precisa qué cambio, amenaza o parámetro detectó o anticipó el piloto para respaldar un OB específico.');
      }
    }

    // Natural trajectory descriptions are stronger evidence than the control mode alone.
    const trajectoryAction=/\b(corrige|corrigio|correccion|correcciones|ajusta|ajusto|ajuste|ajustes|mantiene|mantuvo|controla|controlo|desviacion|desviaciones|corrects?|adjusts?|maintains?|controls?|deviations?)\b/;
    const trajectoryParameter=/\b(velocidad|altitud|trayectoria|energia|actitud|potencia|speed|altitude|flight path|energy|pitch|thrust)\b/;
    const trajectoryEvidence=evidenceClause(text,s=>trajectoryAction.test(s)&&trajectoryParameter.test(s));
    const manual=/\b(vuelo manual|manual|manualmente|ap desconectado|sin piloto automatico|autopilot off|autopilot disconnected|manually)\b/.test(n);
    const automated=/\b(automatizacion|piloto automatico|autopilot|fma|flight director|modo automatico|automation)\b/.test(n);

    if(trajectoryEvidence){
      if(manual&&!automated)addCompetency(result,'FPM',trajectoryEvidence);
      else if(automated&&!manual)addCompetency(result,'FPA',trajectoryEvidence);
      else if(!manual&&!automated)addQuestion(result,'Trayectoria: indica si el control era manual o mediante automatización para distinguir FPM de FPA.');
    }

    if(result.competencies.length){
      result.questions=result.questions.filter(q=>!q.startsWith('Añade una acción u omisión concreta'));
    }
    return result;
  };
})();
