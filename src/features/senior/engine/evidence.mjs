/** Deterministic evidence analysis exercises, not live Go execution. */
export function evaluateEvidenceLab(lab, selections) {
  if (lab?.challengeId !== 'evidence-lab' || !Array.isArray(lab.findings) || lab.findings.length < 3 || lab.findings.length > 12 || !Array.isArray(lab.correctFindings)) throw new TypeError('Invalid evidence lab');
  if (!Array.isArray(selections) || selections.length > lab.findings.length || new Set(selections).size !== selections.length || selections.some(n => !Number.isInteger(n) || n < 0 || n >= lab.findings.length)) throw new TypeError('Invalid selections');
  const expected = new Set(lab.correctFindings);
  if (expected.size === 0 || [...expected].some(n => !Number.isInteger(n) || n < 0 || n >= lab.findings.length)) throw new TypeError('Invalid answer key');
  const selected = new Set(selections);
  const matches = lab.findings.map((_, i) => selected.has(i) === expected.has(i));
  const correct = matches.filter(Boolean).length;
  return { correct, total: lab.findings.length, score: Math.round(100 * correct / lab.findings.length), passed: correct === lab.findings.length, expected: [...expected], verification: 'static-evidence-lab' };
}
export function verifiedEvidenceRecord(record, lab) {
  if (!record || typeof record !== 'object' || Array.isArray(record) || !lab || record.moduleId !== lab.moduleId || record.challengeId !== 'evidence-lab' || record.version !== lab.version || typeof record.completedAt !== 'string' || !Number.isFinite(Date.parse(record.completedAt)) || record.completedAt.length > 32) return false;
  try { const verified = evaluateEvidenceLab(lab,record.selections); return record.correct === verified.correct && record.score === verified.score && record.passed === verified.passed; } catch {return false;}
}
