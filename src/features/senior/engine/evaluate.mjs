/** Pure, deterministic multiple-choice knowledge assessment. NOT code compilation. */
export const MAX_RESPONSES = 20;
export function evaluateDecisionQuiz(challenge, answers) {
  if (!challenge || !Array.isArray(challenge.questions) || challenge.questions.length < 1 || challenge.questions.length > MAX_RESPONSES) throw new TypeError('Invalid challenge');
  if (!Array.isArray(answers) || answers.length !== challenge.questions.length) throw new TypeError('Missing responses');
  const details = challenge.questions.map((q, i) => {
    if (!Array.isArray(q.options) || !Number.isInteger(q.correct) || q.correct < 0 || q.correct >= q.options.length) throw new TypeError('Invalid question');
    const chosen = answers[i];
    if (!Number.isInteger(chosen) || chosen < 0 || chosen >= q.options.length) throw new TypeError('Invalid response');
    return { id: q.id, selected: chosen, correct: chosen === q.correct, correctIndex: q.correct, explanation: q.explanation };
  });
  const correct = details.filter(d => d.correct).length;
  return { correct, total: details.length, score: Math.round(correct / details.length * 100), passed: correct === details.length, details, verification: 'objective-quiz-only' };
}
export function validSeniorRecord(record, moduleId, challenge) {
  return !!challenge && challenge.moduleId === moduleId && !!record && typeof record === 'object' && !Array.isArray(record) && record.moduleId === moduleId && record.challengeId === 'decision-lab' && Number.isInteger(record.score) && record.score >= 0 && record.score <= 100 && Number.isInteger(record.correct) && record.correct >= 0 && record.correct <= 3 && Array.isArray(record.answers) && record.answers.length === 3 && record.answers.every(n => Number.isInteger(n) && n >= 0 && n <= 2) && typeof record.passed === 'boolean' && typeof record.completedAt === 'string' && /^\d{4}-\d\d-\d\dT/.test(record.completedAt) && record.completedAt.length <= 32 && Number.isFinite(Date.parse(record.completedAt)) && (() => {try {const result=evaluateDecisionQuiz(challenge, record.answers); return record.correct===result.correct && record.score===result.score && record.passed===result.passed && (record.version ?? 1)===challenge.version;}catch{return false;}})();
}
