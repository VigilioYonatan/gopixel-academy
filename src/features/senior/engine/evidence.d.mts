export type EvidenceLab = {moduleId:string; challengeId:'evidence-lab'; version:number; kind:string; title:string; evidence:string; findings:string[]; correctFindings:number[]; explanation:string};
export type EvidenceEvaluation = { correct:number; total:number; score:number; passed:boolean; expected:number[]; verification:'static-evidence-lab' };
export function evaluateEvidenceLab(lab:EvidenceLab,selections:number[]):EvidenceEvaluation;
export function verifiedEvidenceRecord(record:unknown,lab:EvidenceLab | undefined):boolean;
