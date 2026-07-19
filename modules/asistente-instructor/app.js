(function () {
  "use strict";

  const kb = window.VEYRA_KB;
  if (!kb) {
    document.body.textContent = "No fue posible cargar la base académica del asistente.";
    return;
  }

  const $ = (id) => document.getElementById(id);
  const elements = {
    missionSelect: $("missionSelect"),
    sessionDate: $("sessionDate"),
    studentId: $("studentId"),
    instructorId: $("instructorId"),
    sessionRef: $("sessionRef"),
    missionId: $("missionId"),
    missionMeta: $("missionMeta"),
    missionProgram: $("missionProgram"),
    missionTitle: $("missionTitle"),
    missionSynthesis: $("missionSynthesis"),
    missionObjectives: $("missionObjectives"),
    missionFocus: $("missionFocus"),
    rawNote: $("rawNote"),
    noteCount: $("noteCount"),
    analyzeButton: $("analyzeButton"),
    clearButton: $("clearButton"),
    analysisMessage: $("analysisMessage"),
    candidateEmpty: $("candidateEmpty"),
    candidateList: $("candidateList"),
    obSearch: $("obSearch"),
    competencyFilter: $("competencyFilter"),
    resultCount: $("resultCount"),
    obResults: $("obResults"),
    strengths: $("strengths"),
    development: $("development"),
    pendingChecks: $("pendingChecks"),
    reportMessage: $("reportMessage"),
    reportText: $("reportText"),
    reportButton: $("reportButton"),
    copyButton: $("copyButton"),
    downloadButton: $("downloadButton"),
    printButton: $("printButton")
  };

  const state = {
    candidates: new Map(),
    evidenceSentences: [],
    report: ""
  };

  function normalize(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function tidySentence(value) {
    const compact = String(value || "").replace(/\s+/g, " ").trim();
    if (!compact) return "";
    const initial = compact.charAt(0).toUpperCase() + compact.slice(1);
    return /[.!?;:]$/.test(initial) ? initial : initial + ".";
  }

  function splitEvidence(value) {
    const lines = String(value || "").split(/\n+/);
    const results = [];

    lines.forEach((line) => {
      const pieces = line.match(/[^.!?;]+[.!?;]?/g) || [];
      pieces.forEach((piece) => {
        const tidy = tidySentence(piece);
        if (normalize(tidy).length >= 8) results.push(tidy);
      });
    });

    return Array.from(new Set(results));
  }

  function selectedMission() {
    return kb.missions.find((mission) => mission.id === elements.missionSelect.value) || kb.missions[0];
  }

  function setDefaultDate() {
    if (elements.sessionDate.value) return;
    const now = new Date();
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    elements.sessionDate.value = local.toISOString().slice(0, 10);
  }

  function populateMissions() {
    elements.missionSelect.replaceChildren();
    kb.missions.forEach((mission) => {
      const option = document.createElement("option");
      option.value = mission.id;
      option.textContent = `${mission.id} · ${mission.program} · ${mission.title}`;
      elements.missionSelect.appendChild(option);
    });
  }

  function populateCompetencies() {
    elements.competencyFilter.replaceChildren();
    const all = document.createElement("option");
    all.value = "";
    all.textContent = "Todas";
    elements.competencyFilter.appendChild(all);

    Object.entries(kb.competencyNames).forEach(([code, name]) => {
      const option = document.createElement("option");
      option.value = code;
      option.textContent = `${code} · ${name}`;
      elements.competencyFilter.appendChild(option);
    });
  }

  function renderMission() {
    const mission = selectedMission();
    elements.missionId.textContent = mission.id;
    elements.missionMeta.textContent = `${mission.phase} · ${mission.duration}`;
    elements.missionProgram.textContent = mission.program;
    elements.missionTitle.textContent = mission.title;
    elements.missionSynthesis.textContent = mission.synthesis;
    elements.missionObjectives.replaceChildren();
    mission.objectives.forEach((objective) => {
      const item = document.createElement("li");
      item.textContent = objective;
      elements.missionObjectives.appendChild(item);
    });
    elements.missionFocus.replaceChildren();
    mission.focus.forEach((code) => {
      const chip = document.createElement("span");
      chip.className = "chip";
      chip.textContent = `${code} · ${kb.competencyNames[code]}`;
      elements.missionFocus.appendChild(chip);
    });
  }

  function obByCode(code) {
    return kb.obs.find((ob) => ob.code === code);
  }

  function detectCandidates(sentences) {
    const mission = selectedMission();
    const detected = [];

    Object.entries(kb.evidenceRules).forEach(([code, patterns]) => {
      const ob = obByCode(code);
      if (!ob) return;

      const supports = [];
      patterns.forEach((pattern) => {
        sentences.forEach((sentence) => {
          const normalizedSentence = normalize(sentence);
          const isMatch = pattern.every((token) => normalizedSentence.includes(normalize(token)));
          if (isMatch && !supports.includes(sentence)) supports.push(sentence);
        });
      });

      if (supports.length) {
        detected.push({
          ob,
          evidence: supports.join("\n"),
          source: "regla conservadora",
          confirmed: false,
          missionPriority: mission.focus.includes(ob.competency) ? 1 : 0
        });
      }
    });

    return detected.sort((a, b) => {
      if (a.missionPriority !== b.missionPriority) return b.missionPriority - a.missionPriority;
      return Number(a.ob.code.split(".")[0]) - Number(b.ob.code.split(".")[0]) || a.ob.code.localeCompare(b.ob.code);
    });
  }

  function analyzeNote() {
    const note = elements.rawNote.value.trim();
    state.candidates.clear();
    state.evidenceSentences = splitEvidence(note);

    if (!note || !state.evidenceSentences.length) {
      elements.analysisMessage.className = "message error";
      elements.analysisMessage.textContent = "Escribe evidencia concreta antes de analizar.";
      renderCandidates();
      return;
    }

    const detected = detectCandidates(state.evidenceSentences);
    detected.forEach((candidate) => state.candidates.set(candidate.ob.code, candidate));

    if (detected.length) {
      elements.analysisMessage.className = "message warning";
      elements.analysisMessage.textContent = `${detected.length} OB candidato(s). Ninguno está confirmado: revisa la frase de evidencia y marca solamente lo que observaste.`;
    } else {
      elements.analysisMessage.className = "message warning";
      elements.analysisMessage.textContent = "La nota fue ordenada, pero no contiene evidencia suficiente para proponer un OB con las reglas conservadoras. Usa el explorador manual o añade detalles observables.";
    }
    renderCandidates();
  }

  function makeTextElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    element.textContent = text;
    return element;
  }

  function renderCandidates() {
    elements.candidateList.replaceChildren();
    const candidates = Array.from(state.candidates.values());
    elements.candidateEmpty.hidden = candidates.length > 0;

    if (!candidates.length) {
      elements.candidateEmpty.textContent = state.evidenceSentences.length
        ? "No hay OB candidatos. Esto no significa que la sesión no tenga evidencia; significa que requiere selección manual o una nota más específica."
        : "Escribe una nota y pulsa “Analizar evidencia”.";
      return;
    }

    candidates.forEach((candidate) => {
      const article = document.createElement("article");
      article.className = "candidate" + (candidate.confirmed ? " confirmed" : "");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "candidate-check";
      checkbox.checked = Boolean(candidate.confirmed);
      checkbox.disabled = !candidate.evidence.trim();
      checkbox.setAttribute("aria-label", `Confirmar OB ${candidate.ob.code}`);

      const content = document.createElement("div");
      const heading = document.createElement("div");
      heading.className = "candidate-heading";
      heading.appendChild(makeTextElement("strong", "ob-code", candidate.ob.code));
      heading.appendChild(makeTextElement("span", "competency-code", candidate.ob.competency));
      heading.appendChild(makeTextElement("span", "source-badge", candidate.source));
      content.appendChild(heading);
      content.appendChild(makeTextElement("div", "candidate-title", kb.competencyNames[candidate.ob.competency]));
      content.appendChild(makeTextElement("p", "candidate-text", candidate.ob.text));

      const evidenceLabel = document.createElement("label");
      evidenceLabel.textContent = "Frase exacta que respalda este OB";
      const evidenceArea = document.createElement("textarea");
      evidenceArea.value = candidate.evidence;
      evidenceArea.placeholder = "Escribe la conducta observada. Sin evidencia no puede confirmarse.";
      evidenceArea.setAttribute("aria-label", `Evidencia para OB ${candidate.ob.code}`);
      content.appendChild(evidenceLabel);
      content.appendChild(evidenceArea);
      content.appendChild(makeTextElement("div", "candidate-note", "La confirmación pertenece al instructor; el sistema solo organiza la evidencia."));

      checkbox.addEventListener("change", () => {
        candidate.confirmed = checkbox.checked && Boolean(candidate.evidence.trim());
        renderCandidates();
      });

      evidenceArea.addEventListener("input", () => {
        candidate.evidence = evidenceArea.value;
        checkbox.disabled = !candidate.evidence.trim();
        if (!candidate.evidence.trim()) {
          candidate.confirmed = false;
          checkbox.checked = false;
          article.classList.remove("confirmed");
        }
      });

      article.appendChild(checkbox);
      article.appendChild(content);
      elements.candidateList.appendChild(article);
    });
  }

  function addManualCandidate(ob) {
    if (state.candidates.has(ob.code)) {
      const existing = state.candidates.get(ob.code);
      elements.analysisMessage.className = "message";
      elements.analysisMessage.textContent = `El OB ${ob.code} ya está en la lista de revisión.`;
      if (!existing.evidence) existing.source = "selección manual";
    } else {
      state.candidates.set(ob.code, {
        ob,
        evidence: "",
        source: "selección manual",
        confirmed: false,
        missionPriority: 0
      });
      elements.analysisMessage.className = "message warning";
      elements.analysisMessage.textContent = `OB ${ob.code} agregado. Escribe la evidencia exacta antes de confirmarlo.`;
    }
    renderCandidates();
    renderExplorer();
    document.querySelector("#candidateTitle").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function renderExplorer() {
    const term = normalize(elements.obSearch.value);
    const competency = elements.competencyFilter.value;
    const matches = kb.obs.filter((ob) => {
      if (competency && ob.competency !== competency) return false;
      if (!term) return true;
      const haystack = normalize(`${ob.code} ${ob.competency} ${kb.competencyNames[ob.competency]} ${ob.text}`);
      return haystack.includes(term);
    });

    elements.resultCount.textContent = `${matches.length} resultado(s). Se muestran hasta 15 por búsqueda.`;
    elements.obResults.replaceChildren();
    matches.slice(0, 15).forEach((ob) => {
      const row = document.createElement("div");
      row.className = "ob-result";
      row.appendChild(makeTextElement("strong", "", ob.code));
      const copy = document.createElement("div");
      copy.appendChild(makeTextElement("div", "competency-code", `${ob.competency} · ${kb.competencyNames[ob.competency]}`));
      copy.appendChild(makeTextElement("p", "", ob.text));
      row.appendChild(copy);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "btn small";
      button.textContent = state.candidates.has(ob.code) ? "En revisión" : "Agregar OB";
      button.disabled = state.candidates.has(ob.code);
      button.addEventListener("click", () => addManualCandidate(ob));
      row.appendChild(button);
      elements.obResults.appendChild(row);
    });
  }

  function valueOrPending(value) {
    const compact = String(value || "").replace(/\s+/g, " ").trim();
    return compact || "No registrado en este borrador.";
  }

  function generateReport() {
    const mission = selectedMission();
    const confirmed = Array.from(state.candidates.values()).filter((candidate) => candidate.confirmed && candidate.evidence.trim());
    const ignoredWithoutEvidence = Array.from(state.candidates.values()).filter((candidate) => candidate.confirmed && !candidate.evidence.trim());
    const date = elements.sessionDate.value || "Sin fecha";
    const evidence = state.evidenceSentences.length ? state.evidenceSentences : splitEvidence(elements.rawNote.value);
    const references = kb.referencesByProgram[mission.program] || kb.referencesByProgram.Instrumentos;
    const lines = [];

    lines.push("VEYRA · BORRADOR DE OBSERVACIÓN DE SESIÓN");
    lines.push("================================================");
    lines.push("Estado: BORRADOR PARA REVISIÓN HUMANA · NO CONSTITUYE CALIFICACIÓN");
    lines.push("");
    lines.push("1. CONTEXTO");
    lines.push(`Fecha: ${date}`);
    lines.push(`Referencia de sesión: ${valueOrPending(elements.sessionRef.value)}`);
    lines.push(`Estudiante: ${valueOrPending(elements.studentId.value)}`);
    lines.push(`Instructor: ${valueOrPending(elements.instructorId.value)}`);
    lines.push(`Misión: ${mission.id} · ${mission.program} · ${mission.title}`);
    lines.push(`Fase / duración de referencia: ${mission.phase} · ${mission.duration}`);
    lines.push("");
    lines.push("2. ALCANCE MES DE REFERENCIA");
    lines.push(mission.synthesis);
    mission.objectives.forEach((objective) => lines.push(`- ${objective}`));
    lines.push("");
    lines.push("Nota: el foco de competencias de la misión orienta la observación, pero no demuestra ningún OB por sí solo.");
    lines.push("");
    lines.push("3. EVIDENCIA ORIGINAL ORDENADA");
    if (evidence.length) evidence.forEach((sentence) => lines.push(`- ${sentence}`));
    else lines.push("- No se registró evidencia observable.");
    lines.push("");
    lines.push("4. COMPORTAMIENTOS OBSERVABLES CONFIRMADOS POR EL INSTRUCTOR");
    if (confirmed.length) {
      confirmed.forEach((candidate) => {
        lines.push(`${candidate.ob.code} · ${candidate.ob.competency} · ${kb.competencyNames[candidate.ob.competency]}`);
        lines.push(`OB: ${candidate.ob.text}`);
        lines.push(`Evidencia: ${candidate.evidence.trim()}`);
        lines.push("");
      });
    } else {
      lines.push("- Ningún OB confirmado. No inferir competencia ni calificación.");
      lines.push("");
    }
    lines.push("5. CIERRE DEL INSTRUCTOR");
    lines.push(`Fortalezas observadas: ${valueOrPending(elements.strengths.value)}`);
    lines.push(`Foco de desarrollo: ${valueOrPending(elements.development.value)}`);
    lines.push(`Pendiente por verificar: ${valueOrPending(elements.pendingChecks.value)}`);
    lines.push("");
    lines.push("6. FUENTES QUE DEBEN CONTRASTARSE");
    references.forEach((reference) => lines.push(`- ${reference}`));
    lines.push("");
    lines.push("7. LÍMITES DEL BORRADOR");
    lines.push("- No asigna niveles de desempeño, resultado competente/no competente ni aprobación/reprobación.");
    lines.push("- No agrega hechos que no estén escritos por el instructor.");
    lines.push("- No sustituye el juicio del instructor ni la documentación vigente de la organización.");
    lines.push("- Antes de incorporarlo a un registro oficial deben verificarse misión, fuentes y evidencia.");
    if (ignoredWithoutEvidence.length) lines.push("- Se detectaron selecciones sin evidencia; fueron excluidas del borrador.");
    lines.push("");
    lines.push(`Base académica: ${kb.version}. ${kb.sourceNotice}`);

    state.report = lines.join("\n");
    elements.reportText.textContent = state.report;
    elements.copyButton.disabled = false;
    elements.downloadButton.disabled = false;
    elements.printButton.disabled = false;
    elements.reportMessage.className = confirmed.length ? "message" : "message warning";
    elements.reportMessage.textContent = confirmed.length
      ? `${confirmed.length} OB confirmado(s) incluidos. Revisa el texto completo antes de usarlo.`
      : "El borrador no incluye OB confirmados. Esto es válido cuando la evidencia es insuficiente.";
  }

  async function copyReport() {
    if (!state.report) return;
    try {
      await navigator.clipboard.writeText(state.report);
      elements.reportMessage.className = "message";
      elements.reportMessage.textContent = "Borrador copiado al portapapeles.";
    } catch (error) {
      const area = document.createElement("textarea");
      area.value = state.report;
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
      elements.reportMessage.textContent = "Borrador copiado.";
    }
  }

  function downloadReport() {
    if (!state.report) return;
    const mission = selectedMission();
    const fileName = `veyra-borrador-${mission.id.toLowerCase()}-${elements.sessionDate.value || "sin-fecha"}.txt`;
    const blob = new Blob([state.report], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function clearSession() {
    elements.rawNote.value = "";
    elements.noteCount.textContent = "0";
    elements.strengths.value = "";
    elements.development.value = "";
    elements.pendingChecks.value = "";
    elements.sessionRef.value = "";
    state.candidates.clear();
    state.evidenceSentences = [];
    state.report = "";
    elements.analysisMessage.className = "message";
    elements.analysisMessage.textContent = "Aún no se ha analizado una nota.";
    elements.reportMessage.className = "message warning";
    elements.reportMessage.textContent = "Confirma únicamente OB respaldados por evidencia concreta.";
    elements.reportText.textContent = "El borrador aparecerá aquí.";
    elements.copyButton.disabled = true;
    elements.downloadButton.disabled = true;
    elements.printButton.disabled = true;
    renderCandidates();
    renderExplorer();
  }

  elements.missionSelect.addEventListener("change", () => {
    renderMission();
    if (state.candidates.size) {
      elements.analysisMessage.className = "message warning";
      elements.analysisMessage.textContent = "La misión cambió. Vuelve a analizar la nota para revisar el contexto.";
    }
  });
  elements.rawNote.addEventListener("input", () => {
    elements.noteCount.textContent = String(elements.rawNote.value.length);
  });
  elements.analyzeButton.addEventListener("click", analyzeNote);
  elements.clearButton.addEventListener("click", clearSession);
  elements.obSearch.addEventListener("input", renderExplorer);
  elements.competencyFilter.addEventListener("change", renderExplorer);
  elements.reportButton.addEventListener("click", generateReport);
  elements.copyButton.addEventListener("click", copyReport);
  elements.downloadButton.addEventListener("click", downloadReport);
  elements.printButton.addEventListener("click", () => window.print());

  populateMissions();
  populateCompetencies();
  setDefaultDate();
  renderMission();
  renderCandidates();
  renderExplorer();
})();
