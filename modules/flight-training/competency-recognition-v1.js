/* Evidence-based competency recognition complements competencies-v7 without auto-grading. */
(() => {
  'use strict';
  const A=globalThis.FTAssistant;
  if(!A?.analyze)return;

  const baseAnalyze=A.analyze;
  const evidenceSentence=(text,test)=>{
    const parts=String(text||'').split(/(?<=[.!?;])\s+|,\s+/).filter(Boolean);
    return parts.find(part=>test(A.norm(part)))||String(text||'').trim();
  };
  const hasCompetency=(result,code)=>Array.isArray(result.competencies)&&result.competencies.some(c=>c.code===code);
  const addCompetency=(result,code,evidence)=>{
    if(hasCompetency(result,code))return;
    result.competencies??=[];
    result.competencies.push({code,evidence,source:'competency'});
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
    const excluded=/\b(instructor|evaluador|assessor|debe|deben|debera|deberia|should|must|creo|parece|supongo|quiza|se espera|se recomienda|tendria|would|could)\b/.test(n)||/\b(no (?:se )?(?:observo|observa|evidencio|evidencia|evaluo|evalua)|sin evidencia|not observed|not assessed|no evidence)\b/.test(n);

    // A direct competency-level statement can be proposed for review, but it never confirms an OB.
    const sawPhrase=/\b(conciencia|consciencia)\s+situacional\b/;
    if(!excluded&&sawPhrase.test(n)){
      addCompetency(result,'SAW',evidenceSentence(text,s=>sawPhrase.test(s)));
      if(!/\b(reconoce|reconocio|detecta|detecto|identifica|identifico|monitorea|monitoreo|anticipa|anticipo)\b/.test(n)){
        addQuestion(result,'Conciencia situacional: precisa qué cambio, amenaza o parámetro detectó o anticipó el piloto para respaldar un OB específico.');
      }
    }

    // Natural descriptions such as “correcciones tardías de velocidad” are trajectory evidence.
    // The control mode must remain explicit so FPM and FPA are not inferred from mission context.
    const trajectoryAction=/\b(corrige|corrigio|correccion|correcciones|ajusta|ajusto|ajuste|ajustes|mantiene|mantuvo|controla|controlo|desviacion|desviaciones)\b/.test(n);
    const trajectoryParameter=/\b(velocidad|altitud|trayectoria|energia|actitud|potencia|speed|altitude|flight path|energy|pitch|thrust)\b/.test(n);
    const manual=/\b(vuelo manual|manual|manualmente|ap desconectado|sin piloto automatico|autopilot off|autopilot disconnected|manually)\b/.test(n);
    const automated=/\b(automatizacion|piloto automatico|autopilot|fma|flight director|modo automatico)\b/.test(n);
    if(!excluded&&trajectoryAction&&trajectoryParameter){
      const evidence=evidenceSentence(text,s=>/\b(velocidad|altitud|trayectoria|energia|actitud|potencia|speed|altitude|flight path|energy|pitch|thrust)\b/.test(s));
      if(manual&&!automated)addCompetency(result,'FPM',evidence);
      else if(automated&&!manual)addCompetency(result,'FPA',evidence);
      else if(!manual&&!automated)addQuestion(result,'Trayectoria: indica si el control era manual o mediante automatización para distinguir FPM de FPA.');
    }

    if(result.competencies.length){
      result.questions=result.questions.filter(q=>!q.startsWith('Añade una acción u omisión concreta'));
    }
    return result;
  };
})();
