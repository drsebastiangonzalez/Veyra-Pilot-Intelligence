/* Veyra Enterprise Intelligence. Deterministic, fictional demonstration data only. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.VeyraIntelligenceModel = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const operators = ['Colombia', 'El Salvador', 'Guatemala', 'Ecuador', 'Costa Rica', 'Carga · demo'];
  const airports = [
    { code: 'BOG', name: 'Bogotá', icao: 'SKBO' }, { code: 'MDE', name: 'Medellín', icao: 'SKRG' },
    { code: 'SAL', name: 'San Salvador', icao: 'MSLP' }, { code: 'GUA', name: 'Guatemala', icao: 'MGGT' },
    { code: 'UIO', name: 'Quito', icao: 'SEQM' }, { code: 'SJO', name: 'San José', icao: 'MROC' },
    { code: 'MIA', name: 'Miami', icao: 'KMIA' }, { code: 'MAD', name: 'Madrid', icao: 'LEMD' }
  ];
  const weather = ['VMC', 'Baja visibilidad', 'Viento cruzado', 'Lluvia / pista mojada', 'Convección'];
  const maneuvers = [
    ['M01', 'Aproximación frustrada', 'FPM', .22, 'Control de trayectoria y reparto de tareas durante la transición.'],
    ['M02', 'Aterrizaje con viento cruzado', 'FPM', .25, 'Control direccional y reconocimiento de límites del escenario.'],
    ['M03', 'Aproximación no estabilizada', 'SAW', .24, 'Detección de desviaciones y decisión oportuna según criterios del operador.'],
    ['M04', 'Fallo de motor en despegue', 'WLM', .19, 'Priorización, control de trayectoria y coordinación de tareas.'],
    ['M05', 'Despegue rechazado', 'PSD', .17, 'Reconocimiento del evento, decisión y comunicación de prioridades.'],
    ['M06', 'Aproximación RNP', 'FPA', .15, 'Configuración, supervisión de modos y conciencia de trayectoria.'],
    ['M07', 'Operación con baja visibilidad', 'PRO', .18, 'Aplicación de procedimientos y verificación cruzada.'],
    ['M08', 'Gestión de energía', 'FPM', .20, 'Anticipación del perfil y corrección de desviaciones.'],
    ['M09', 'Humo / fuego', 'WLM', .13, 'Priorización y comunicación durante una carga de trabajo elevada.'],
    ['M10', 'Despresurización', 'PRO', .12, 'Aplicación de procedimientos y coordinación de la tripulación.'],
    ['M11', 'Aproximación ILS', 'FPA', .09, 'Supervisión de automatización y referencias de aproximación.'],
    ['M12', 'Rodaje y prevención de incursión', 'COM', .08, 'Confirmación de autorizaciones y conciencia de posición.']
  ].map(([id, name, competency, difficulty, evidence]) => ({ id, name, competency, difficulty, evidence }));
  const competencies = ['KNO', 'PRO', 'COM', 'FPA', 'FPM', 'LTW', 'PSD', 'SAW', 'WLM'];
  const courses = [
    { id: 'L01', name: 'Decisiones en aproximación', subtitle: 'Del reconocimiento a la acción', maneuver: 'M03', minutes: 18, tag: 'ESCENARIO', color: 'teal' },
    { id: 'L02', name: 'Energía y trayectoria', subtitle: 'Anticipar · supervisar · corregir', maneuver: 'M08', minutes: 22, tag: 'MICROLEARNING', color: 'blue' },
    { id: 'L03', name: 'Coordinación bajo presión', subtitle: 'Prioridades compartidas', maneuver: 'M04', minutes: 16, tag: 'CREW RESOURCE MANAGEMENT', color: 'violet' },
    { id: 'L04', name: 'Preparación para viento cruzado', subtitle: 'Contexto y amenazas', maneuver: 'M02', minutes: 20, tag: 'PREPARACIÓN FFS', color: 'amber' }
  ];
  function hash(str) { let h = 2166136261; for (const c of String(str)) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; }
  const random = seed => hash(seed) / 4294967296;
  const avg = xs => xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0;
  const ratio = (a, b) => b ? a / b * 100 : 0;
  function create(source) {
    const pilots = source.pilots.map((p, i) => ({ ...p, operator: operators[hash(p.id + 'operator') % operators.length],
      age: 27 + hash(p.id + 'age') % 31, hours: 1740 + hash(p.id + 'hours') % 14830,
      typeHours: 420 + hash(p.id + 'type') % 4920, seniority: 1 + hash(p.id + 'seniority') % 24 }));
    const records = [];
    pilots.forEach(p => {
      for (let month = 0; month < 12; month++) {
        const date = new Date(Date.UTC(2025, 9 + month, 1));
        const period = month < 6 ? 'previous' : 'current';
        const ym = date.toISOString().slice(0, 7);
        const sessionId = p.id + '-' + ym;
        const instructor = source.instructor_names[hash(sessionId + 'instructor') % source.instructor_names.length];
        for (let n = 0; n < 4; n++) {
          const seed = sessionId + '-' + n;
          const maneuver = maneuvers[(hash(sessionId) + n * 5) % maneuvers.length];
          const airport = airports[hash(seed + 'airport') % airports.length].code;
          const meteo = weather[hash(seed + 'weather') % weather.length];
          // Correlate repeated difficulties within a fictional cohort instead of giving
          // almost every pilot a low grade through independent random exposure.
          const cohort = random(p.id + 'development-cohort');
          const susceptibility = cohort < .12 ? 2.2 : cohort < .32 ? .45 : .012;
          const difficulty = Math.max(.002, (maneuver.difficulty + (meteo === 'VMC' ? -.05 : .045) + (['BOG', 'UIO'].includes(airport) ? .03 : 0) - month * .004) * susceptibility);
          const roll = random(seed + 'grade');
          const grade = roll < difficulty * .12 ? 1 : roll < difficulty ? 2 : roll < difficulty + .12 ? 3 : roll < .70 ? 4 : 5;
          records.push({ id: seed, sessionId, pilotId: p.id, operator: p.operator, fleet: p.fleet, instructor,
            date: ym + '-' + String(1 + hash(sessionId + 'day') % 25).padStart(2, '0'), period, month: ym,
            maneuver: maneuver.id, airport, weather: meteo, grade, competency: maneuver.competency,
            route: (airport === 'BOG' ? 'SAL' : 'BOG') + ' → ' + airport,
            evidence: grade <= 2 ? 'Requirió intervención del instructor. ' + maneuver.evidence : grade === 3 ? 'Desarrollo sugerido: ' + maneuver.evidence : 'Ejecución autónoma observada. ' + maneuver.evidence });
        }
      }
    });
    const calibration = source.instructor_names.map((name, i) => {
      const slots = [];
      for (let round = 1; round <= 3; round++) competencies.forEach((code, c) => {
        for (let scenario = 0; scenario < 3; scenario++) {
          const ref = 2 + hash(round + code + scenario) % 3;
          const r = random(name + round + code + scenario);
          const delta = r < (i % 7 === 0 ? .30 : .10) ? -1 : r > (i % 5 === 0 ? .74 : .94) ? 1 : 0;
          slots.push({ round, code, reference: ref, rating: Math.max(1, Math.min(5, ref + delta)), keyOB: r < .87 });
        }
      });
      return { id: 'I' + i, name, slots };
    });
    return { pilots, records, calibration, instructors: source.instructor_names };
  }
  function filter(model, scope = {}) {
    return model.records.filter(r => (!scope.period || r.period === scope.period) && (!scope.operator || r.operator === scope.operator) &&
      (!scope.fleet || r.fleet === scope.fleet) && (!scope.airport || r.airport === scope.airport) && (!scope.weather || r.weather === scope.weather) &&
      (!scope.pilotId || r.pilotId === scope.pilotId) && (!scope.instructor || r.instructor === scope.instructor));
  }
  function summarize(rows) {
    const low = rows.filter(r => r.grade <= 2);
    return { n: rows.length, low: low.length, rate: ratio(low.length, rows.length), average: avg(rows.map(r => r.grade)),
      pilots: new Set(rows.map(r => r.pilotId)).size, affected: new Set(low.map(r => r.pilotId)).size,
      sessions: new Set(rows.map(r => r.sessionId)).size, grades: [1, 2, 3, 4, 5].map(g => rows.filter(r => r.grade === g).length) };
  }
  function group(rows, key) {
    const map = new Map(); rows.forEach(r => { if (!map.has(r[key])) map.set(r[key], []); map.get(r[key]).push(r); });
    return [...map].map(([name, values]) => ({ name, ...summarize(values) }));
  }
  function ranking(rows, sort = 'rate', min = 20) {
    return group(rows, 'maneuver').map(r => ({ ...r, ...maneuvers.find(m => m.id === r.name), sampleSufficient: r.n >= min }))
      .sort((a, b) => Number(b.sampleSufficient) - Number(a.sampleSufficient) || b[sort] - a[sort] || b.n - a.n);
  }
  function icap(slots) {
    const n = slots.length;
    return { n, agreement: ratio(slots.filter(s => s.rating === s.reference).length, n),
      withinOne: ratio(slots.filter(s => Math.abs(s.rating - s.reference) <= 1).length, n),
      bias: avg(slots.map(s => s.rating - s.reference)), keyOB: ratio(slots.filter(s => s.keyOB).length, n),
      errors: slots.filter(s => (s.rating <= 2) !== (s.reference <= 2)).length };
  }
  function csv(rows) { const quote = v => '"' + String(v ?? '').replace(/^[=+@-]/, "'" + String(v)[0]).replace(/"/g, '""') + '"'; return '\ufeff' + rows.map(r => r.map(quote).join(',')).join('\r\n'); }
  return { operators, airports, weather, maneuvers, competencies, courses, hash, avg, ratio, create, filter, summarize, group, ranking, icap, csv };
});
