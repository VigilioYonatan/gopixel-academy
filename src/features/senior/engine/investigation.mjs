/** Deterministic offline reasoning labs. These do NOT execute Go or production systems. */
export const INVESTIGATION_LAB_ID = 'investigation-lab';
export function validateInvestigation(lab) {
  if (!lab || lab.challengeId !== INVESTIGATION_LAB_ID || !/^S(0[1-9]|1[0-8])$/.test(lab.moduleId) || !Number.isInteger(lab.version) || lab.version < 1 || !Array.isArray(lab.steps) || lab.steps.length !== 3) throw new TypeError('Invalid investigation');
  const ids = new Set();
  for (const s of lab.steps) {
    if (typeof s.id !== 'string' || ids.has(s.id) || !s.prompt || !s.explanation || !Array.isArray(s.options) || s.options.length !== 3 || s.options.some(v=>typeof v !== 'string' || !v.trim()) || !Number.isInteger(s.correct) || s.correct < 0 || s.correct >= s.options.length) throw new TypeError('Invalid step');
    ids.add(s.id);
  }
  return true;
}
export function gradeInvestigation(lab, answers) {
  validateInvestigation(lab);
  if (!Array.isArray(answers) || answers.length !== lab.steps.length) throw new TypeError('Incomplete answers');
  const details = lab.steps.map((s,i) => {
    const selected = answers[i];
    if (!Number.isInteger(selected) || selected < 0 || selected >= s.options.length) throw new TypeError('Invalid answer');
    return {id:s.id, selected, correct:selected === s.correct, expected:s.correct, explanation:s.explanation};
  });
  const correct=details.filter(d=>d.correct).length;
  return {correct,total:details.length,score:Math.round(correct*100/details.length),passed:correct===details.length,details,verification:'static-investigation-only'};
}
export function verifiedInvestigationRecord(record, lab) {
  if (!record || typeof record !== 'object' || Array.isArray(record) || !lab || record.moduleId !== lab.moduleId || record.challengeId !== INVESTIGATION_LAB_ID || record.version !== lab.version || typeof record.completedAt !== 'string' || record.completedAt.length > 32 || !Number.isFinite(Date.parse(record.completedAt))) return false;
  try {
    const result=gradeInvestigation(lab,record.answers);
    return result.score===record.score && result.correct===record.correct && result.passed===record.passed;
  } catch {return false;}
}
