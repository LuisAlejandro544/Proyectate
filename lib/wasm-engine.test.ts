import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getWasmEngine,
  analyzeProjectionWithWasm,
  getPsychologicalDiagnosis,
  PROJECTION_TRIGGERS,
} from './wasm-engine';

test('WebAssembly engine exports expected arithmetic and hashing functions', async () => {
  const engine = await getWasmEngine();
  assert.ok(typeof engine.calc_score === 'function', 'calc_score should be exported');
  assert.ok(typeof engine.hash_step === 'function', 'hash_step should be exported');
  assert.ok(typeof engine.mix_entropy === 'function', 'mix_entropy should be exported');

  // Test calc_score: length / 4 + triggers * 14
  const score1 = engine.calc_score(40, 2, 1, 1);
  assert.equal(score1, 10 + 28 + 5 + 4); // 47

  // Test hash_step: deterministic FNV-1a
  const hashVal = engine.hash_step(0x811c9dc5, 65);
  assert.ok(typeof hashVal === 'number', 'hash must return a number');
});

test('analyzeProjectionWithWasm detects viral TikTok triggers and calculates delulu score', async () => {
  const text = 'No me importa que mi ex no me escriba, en terapia aprendí que esto es un situationship canon event.';
  const result = await analyzeProjectionWithWasm(text);

  assert.ok(result.score >= 50, 'High delulu text should yield projection score >= 50');
  assert.ok(result.hash.startsWith('0x'), 'Hash must be hexadecimal prefixed with 0x');
  assert.ok(result.triggerCount >= 3, 'Must detect triggers: mi ex, terapia, situationship');
  assert.ok(result.diagnosis.length > 10, 'Diagnosis must be descriptive');
});

test('getPsychologicalDiagnosis returns accurate contextual feedback', () => {
  const diag1 = getPsychologicalDiagnosis(90, 'mi ex volverá pronto');
  assert.match(diag1, /delulu/i);

  const diag2 = getPsychologicalDiagnosis(85, 'ya lo superé y no me importa');
  assert.match(diag2, /negación/i);

  const diag3 = getPsychologicalDiagnosis(20, 'comí cereal esta mañana');
  assert.match(diag3, /Desahogo Cotidiano Ligero/i);
});

test('Dictionary contains viral TikTok cultural projection keywords', () => {
  assert.ok(PROJECTION_TRIGGERS.includes('mi ex'));
  assert.ok(PROJECTION_TRIGGERS.includes('situationship'));
  assert.ok(PROJECTION_TRIGGERS.includes('canon event'));
  assert.ok(PROJECTION_TRIGGERS.includes('delulu'));
});
