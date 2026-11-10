export type SeniorQuestion = { id: string; prompt: string; options: string[]; correct: number; explanation: string };
export type SeniorChallenge = { moduleId: string; challengeId: string; questions: SeniorQuestion[] };
export type SeniorEvaluation = { correct: number; total: number; score: number; passed: boolean; details: { id: string; selected: number; correct: boolean; correctIndex: number; explanation: string }[]; verification: 'objective-quiz-only' };
export function evaluateDecisionQuiz(challenge: SeniorChallenge, answers: number[]): SeniorEvaluation;
export function validSeniorRecord(record: unknown, moduleId: string, challenge: SeniorChallenge | undefined): boolean;
