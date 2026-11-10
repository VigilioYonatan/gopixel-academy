/** Offline operational reasoning exercises. No Go execution or production measurements. */
export const OPERATIONS_LAB_ID='operations-lab';
export function validateOperationsLab(lab){
 if(!lab || !/^S(0[1-9]|1[0-8])$/.test(lab.moduleId) || lab.challengeId!==OPERATIONS_LAB_ID || lab.version!==1 || !lab.title || !lab.evidence || !lab.explanation || !lab.kind || !Array.isArray(lab.diagnoses) || lab.diagnoses.length!==3 || !Array.isArray(lab.actions) || lab.actions.length!==3 || [ ...lab.diagnoses,...lab.actions].some(s=>typeof s!=='string'||!s.trim()) || !Number.isInteger(lab.diagnosisCorrect) || !Number.isInteger(lab.actionCorrect) || lab.diagnosisCorrect<0 || lab.diagnosisCorrect>=3 || lab.actionCorrect<0 || lab.actionCorrect>=3) throw new TypeError('Invalid operations lab');
 return true;
}
export function gradeOperations(lab,answers){
 validateOperationsLab(lab);
 if(!Array.isArray(answers)||answers.length!==2 || answers.some(v=>!Number.isInteger(v)||v<0||v>2)) throw new TypeError('Invalid answers');
 const diagnostic=answers[0]===lab.diagnosisCorrect;
 const mitigation=answers[1]===lab.actionCorrect;
 const correct=Number(diagnostic)+Number(mitigation);
 return {correct,total:2,score:correct*50,passed:correct===2,details:[diagnostic,mitigation],verification:'static-operational-reasoning-only'};
}
export function verifiedOperationsRecord(record,lab){
 if(!record||typeof record!=='object'||Array.isArray(record)||!lab||record.moduleId!==lab.moduleId||record.challengeId!==OPERATIONS_LAB_ID||record.version!==lab.version||typeof record.completedAt!=='string'||record.completedAt.length>32||!Number.isFinite(Date.parse(record.completedAt)))return false;
 try{const r=gradeOperations(lab,record.answers);return r.correct===record.correct&&r.score===record.score&&r.passed===record.passed;}catch{return false;}
}
