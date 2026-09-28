const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const M = require('../assets/js/enterprise-intelligence-model.js');
const source = require('../data/avianca-trial-pilot-population-v2.json');
const model = M.create(source);
test('deterministic synthetic population, exposure and referential integrity', () => {
  assert.equal(model.pilots.length, 1187);
  assert.equal(model.records.length, 1187 * 12 * 4);
  assert.equal(new Set(model.records.map(r => r.id)).size, model.records.length);
  const ids = new Set(model.pilots.map(p => p.id));
  model.records.forEach(r => { assert.ok(ids.has(r.pilotId)); assert.ok(r.grade >= 1 && r.grade <= 5); assert.ok(M.maneuvers.some(m => m.id === r.maneuver)); assert.ok(r.date <= '2026-09-28'); });
  assert.deepEqual(M.create({ ...source, pilots: source.pilots.slice(0, 1) }).records, model.records.filter(r => r.pilotId === source.pilots[0].id));
});
test('cohort filters and exact ranking denominators', () => {
  const scope = { period: 'current', operator: 'Colombia', fleet: 'Airbus A320', airport: 'BOG', weather: 'Baja visibilidad' };
  const rows = M.filter(model, scope);
  assert.ok(rows.length > 0);
  rows.forEach(r => Object.entries(scope).forEach(([k, v]) => assert.equal(r[k], v)));
  const s = M.summarize(rows), rank = M.ranking(rows);
  assert.equal(rank.reduce((a, b) => a + b.n, 0), s.n);
  assert.equal(rank.reduce((a, b) => a + b.low, 0), s.low);
  assert.equal(s.grades.reduce((a, b) => a + b, 0), s.n);
  rank.forEach(r => assert.equal(r.rate, r.low / r.n * 100));
});
test('empty samples do not emit NaN or spurious results', () => {
  assert.deepEqual(M.ranking([]), []);
  assert.equal(M.summarize([]).rate, 0);
  assert.equal(M.icap([]).bias, 0);
  assert.equal(M.filter(model, { pilotId: 'nonexistent' }).length, 0);
});
test('rates rank differently from counts and limited samples are marked', () => {
  const rows = [ ...Array.from({ length: 100 }, (_, i) => ({ maneuver: 'M01', grade: i < 20 ? 2 : 4, pilotId: 'A', sessionId: 'S' })), ...Array.from({ length: 20 }, (_, i) => ({ maneuver: 'M02', grade: i < 10 ? 2 : 4, pilotId: 'B', sessionId: 'T' })) ];
  assert.equal(M.ranking(rows, 'rate')[0].id, 'M02');
  assert.equal(M.ranking(rows, 'low')[0].id, 'M01');
  assert.equal(M.ranking(rows, 'rate', 50)[1].sampleSufficient, false);
});
test('calibration formulas use paired ratings', () => {
  const s = M.icap([{ reference: 2, rating: 3, keyOB: true }, { reference: 4, rating: 4, keyOB: false }]);
  assert.equal(s.agreement, 50); assert.equal(s.withinOne, 100); assert.equal(s.bias, .5); assert.equal(s.errors, 1); assert.equal(s.keyOB, 50);
  model.calibration.forEach(i => assert.equal(i.slots.length, 81));
});
test('CSV escapes delimiters and spreadsheet formulas', () => {
  const csv = M.csv([['=SUM(A1)', 'a,"b', 'line\nbreak']]);
  assert.ok(csv.includes('"\'=SUM(A1)"')); assert.ok(csv.includes('"a,""b"')); assert.ok(csv.includes('"line\nbreak"'));
});
test('new JavaScript assets parse and every local asset is linked', () => {
  const html = fs.readFileSync('avianca-tms-trial.html', 'utf8');
  // Inline scripts are parsed by the browser's native HTML parser in the browser suite.
  for (const f of ['assets/js/enterprise-intelligence-model.js', 'assets/js/enterprise-intelligence.js']) new vm.Script(fs.readFileSync(f, 'utf8'), { filename: f });
  for (const f of ['assets/js/enterprise-intelligence-model.js', 'assets/js/enterprise-intelligence.js', 'assets/css/enterprise-intelligence.css']) { assert.ok(html.includes(f)); assert.ok(fs.existsSync(f)); }
  assert.ok(html.includes('window.VeyraIntelligence.init(data,'));
});
