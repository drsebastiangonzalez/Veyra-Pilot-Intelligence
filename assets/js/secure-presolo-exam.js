/* Veyra Pilot Intelligence · Secure Pre-Solo assessment adapter */
(function(){
  'use strict';
  const api='https://japjyiccjwnhbfpwqtti.supabase.co/functions/v1/veyra-presolo-exam';
  let sessionId='';
  let submitting=false;

  async function call(payload){
    const r=await fetch(api,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
    const data=await r.json().catch(()=>({}));
    if(!r.ok) throw new Error(data.error||'No se pudo procesar la evaluación.');
    return data;
  }

  async function secureStartExam(){
    const name=document.getElementById('studentName').value.trim();
    const program=document.getElementById('program').value.trim();
    const group=document.getElementById('group').value.trim();
    const course=(program&&group)?`${program} ${group}`:'';
    if(!name||!program||!group){ alert('Completa nombre, programa y grupo.'); return; }
    currentMeta={name,program,group,course,instructor:document.getElementById('instructor').value.trim(),date:new Date().toISOString()};
    try{
      const data=await call({action:'start'});
      sessionId=data.session_id;
      currentQuestions=Array.isArray(data.questions)?data.questions:[];
      if(!currentQuestions.length) throw new Error('No hay preguntas disponibles.');
      renderQuestions();
      showScreen('exam');
      startTimer(CONFIG.minutes*60);
    }catch(error){
      alert(error.message||'No se pudo iniciar la evaluación.');
    }
  }

  async function secureSubmitExam(auto){
    if(submitting||!sessionId||!currentQuestions.length) return;
    submitting=true;
    clearInterval(timerInterval);
    const answers={};
    currentQuestions.forEach(q=>{
      const el=document.querySelector(`input[name="q${q.id}"]:checked`);
      answers[String(q.id)]=el?el.value:'';
    });
    try{
      const data=await call({action:'submit',session_id:sessionId,answers,student_name:currentMeta.name,course:currentMeta.course,instructor:currentMeta.instructor});
      const returned=Array.isArray(data.details)?data.details:[];
      const details=returned.map(d=>{
        const shown=currentQuestions.find(q=>String(q.id)===String(d.questionId));
        return {...d,options:shown?.options||[]};
      });
      const attempt={
        ...currentMeta,
        score:Number(data.score||0),correct:Number(data.correct||0),total:Number(data.total||0),
        timeSeconds:Number(data.time_used_seconds||0),criticalOk:Boolean(data.critical_ok),pass:Boolean(data.pass),
        details,weak_topics:data.weak_topics||{},failed_questions:data.failed_questions||[]
      };
      renderResult(attempt);
      showScreen('result');
      sessionId='';
    }catch(error){
      alert((auto?'El tiempo terminó, pero ':'')+(error.message||'No se pudo finalizar la evaluación.'));
      showScreen('assessment');
    }finally{
      submitting=false;
    }
  }

  window.startExam=secureStartExam;
  window.submitExam=secureSubmitExam;
  window.showDashboard=function(){ location.href='internal-access.html'; };
  window.unlockDashboard=function(){ location.href='internal-access.html'; };
  window.openTrainingModule=function(type){
    if(type==='PPA'){ location.href='ppa-practice.html'; return; }
    if(type==='PCA'){ location.href='pca-practice.html'; return; }
    alert('Este módulo se cargará en una siguiente fase.');
  };
  window.startTrainingPractice=function(){ location.href='ppa-practice.html'; };

  if(!document.querySelector('script[data-veyra-operation]')){
    const showcase=document.createElement('script');
    showcase.src='assets/js/veyra-en-operacion.js?v=1';
    showcase.defer=true;
    showcase.dataset.veyraOperation='true';
    document.head.appendChild(showcase);
  }
})();
