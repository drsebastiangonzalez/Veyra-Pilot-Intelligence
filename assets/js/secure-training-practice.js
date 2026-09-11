/* Veyra Pilot Intelligence · Secure PPA/PCA practice adapter
   Questions arrive without correct answers. Grading and persistence happen server-side. */
(function(){
  'use strict';

  const apiUrl = 'https://japjyiccjwnhbfpwqtti.supabase.co/functions/v1/veyra-training-practice';
  let config = null;
  let sessionId = '';
  let finishing = false;

  async function callApi(payload){
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });
    const data = await response.json().catch(() => ({}));
    if(!response.ok) throw new Error(data.error || 'No se pudo procesar la práctica.');
    return data;
  }

  function esc(value){
    return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  function timerKey(){ return config.timerKey; }

  async function initSecurePractice(){
    const status = document.getElementById('loadStatus');
    try{
      const data = await callApi({action:'info', license:config.license});
      questionBank = new Array(Number(data.available_count || 0));
      document.getElementById('availableCount').textContent = String(data.available_count || 0);
      status.innerHTML = '<span class="ok">Banco seguro conectado: ' + Number(data.available_count || 0) + '</span>';
    }catch(error){
      questionBank = [];
      document.getElementById('availableCount').textContent = '0';
      status.innerHTML = '<span class="bad">No se pudo conectar con el banco seguro.</span><br><small>' + esc(error.message) + '</small>';
    }
  }

  async function secureStartPractice(){
    if(!questionBank.length){ alert('No hay preguntas disponibles.'); return; }
    const status = document.getElementById('loadStatus');
    try{
      status.textContent = 'Preparando intento seguro…';
      const data = await callApi({action:'start', license:config.license, count:50});
      sessionId = data.session_id;
      questions = Array.isArray(data.questions) ? data.questions : [];
      answers = {};
      currentIndex = 0;
      startTimeMs = Date.now();
      endTimeMs = startTimeMs + TIMER_SECONDS * 1000;
      localStorage.setItem(timerKey(), JSON.stringify({start:startTimeMs,end:endTimeMs,active:true}));
      document.getElementById('startPanel').classList.add('hidden');
      document.getElementById('resultPanel').classList.add('hidden');
      document.getElementById('examPanel').classList.remove('hidden');
      renderQuestion();
      updateTimer();
      clearInterval(timerInterval);
      timerInterval = setInterval(updateTimer, 1000);
    }catch(error){
      status.innerHTML = '<span class="bad">No se pudo iniciar el intento.</span><br><small>' + esc(error.message) + '</small>';
    }
  }

  async function secureFinishPractice(){
    if(finishing || !questions.length || !sessionId) return;
    finishing = true;
    clearInterval(timerInterval);
    localStorage.removeItem(timerKey());

    const examPanel = document.getElementById('examPanel');
    const resultPanel = document.getElementById('resultPanel');
    examPanel.classList.add('hidden');
    resultPanel.classList.remove('hidden');
    resultPanel.innerHTML = '<div class="eyebrow">Procesando resultado</div><h2>Calificando de forma segura…</h2><p>Las respuestas se validan en el servidor.</p>';

    try{
      const studentName = (document.getElementById('studentName')?.value || '').trim();
      const studentCourse = (document.getElementById('studentCourse')?.value || '').trim();
      const data = await callApi({
        action:'submit', license:config.license, session_id:sessionId, answers,
        student_name:studentName || null, course:studentCourse || null,
        user_agent:navigator.userAgent || null
      });

      const details = Array.isArray(data.details) ? data.details : [];
      const failedDetails = Array.isArray(data.failed_details) ? data.failed_details : [];
      const categorySummary = data.category_summary || {};
      const score = Number(data.score || 0);
      const correct = Number(data.correct || 0);
      const total = Number(data.total || details.length || 0);
      const lvl = data.level || trainingLevel(score);
      const status = data.status || approvalStatus(score);
      const recommendation = recommendationText(score, categorySummary);
      const critical = criticalSubjects(categorySummary);

      const catRows = Object.entries(categorySummary).map(([cat,v]) =>
        `<tr><td>${esc(cat)}</td><td>${Number(v.correct||0)}/${Number(v.total||0)}</td><td>${Number(v.score||0)}%</td></tr>`
      ).join('');
      const failed = failedDetails.map(d => `
        <div class="review">
          <div class="meta">${esc(d.id)} · ${esc(d.category)}</div>
          <h3>${esc(d.question)}</h3>
          <p>Marcaste: <span class="bad">${esc(d.marked || 'Sin respuesta')}</span> · Correcta: <span class="ok">${esc(d.correct)}</span></p>
          <p><b>Explicación:</b> ${esc(d.explanation)}</p>
        </div>`).join('') || '<p class="ok">No hubo preguntas falladas.</p>';

      resultPanel.innerHTML = `
        <div class="eyebrow">Resultado final</div>
        <h1>${score}%</h1>
        <p><span class="ok">Intento calificado y guardado de forma segura.</span></p>
        <p style="font-size:15px;color:#667085"><b>ID de intento:</b> ${esc(data.attempt_id)}</p>
        <div class="grid">
          <div class="kpi"><small>Estado</small><b>${esc(status)}</b></div>
          <div class="kpi"><small>Correctas</small><b>${correct}/${total}</b></div>
          <div class="kpi"><small>Nivel</small><b>${esc(lvl)}</b></div>
          <div class="kpi"><small>Licencia</small><b>${esc(config.license)}</b></div>
        </div>
        <h2>Recomendación</h2><p>${esc(recommendation)}</p>
        <h2>Materias críticas</h2><p>${critical.map(esc).join('<br>')}</p>
        <h2>Desempeño por materia</h2>
        <table><thead><tr><th>Materia</th><th>Correctas</th><th>Resultado</th></tr></thead><tbody>${catRows}</tbody></table>
        <h2 style="margin-top:30px">Retroalimentación</h2>${failed}
        <div class="btns">
          <button class="gold" onclick="downloadAttemptReport(window.currentAttemptReport)">Descargar informe</button>
          <button class="dark" onclick="location.reload()">Repetir</button>
          <button class="ghost" onclick="location.href='/'">Volver a Veyra</button>
        </div>`;

      window.currentAttemptReport = {
        attemptId:data.attempt_id, studentName, studentCourse, score, correct, total,
        level:lvl, status, usedSeconds:Number(data.time_used_seconds||0), categorySummary,
        failedDetails, recommendation, critical
      };
      sessionId = '';
    }catch(error){
      resultPanel.innerHTML = `<div class="eyebrow">No se pudo finalizar</div><h2>El intento no fue calificado.</h2><p class="bad">${esc(error.message)}</p><div class="btns"><button class="dark" onclick="location.reload()">Volver a intentar</button></div>`;
    }finally{
      finishing = false;
    }
  }

  window.VeyraSecurePractice = {
    install(options){
      config = options;
      window.startPractice = secureStartPractice;
      window.finishPractice = secureFinishPractice;
      initSecurePractice();
    }
  };
})();
