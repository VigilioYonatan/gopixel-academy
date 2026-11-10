export interface OperationsLab { moduleId:string; challengeId:'operations-lab'; version:1; kind:string; title:string; brief:string; evidence:string; diagnoses:string[]; diagnosisCorrect:number; actions:string[]; actionCorrect:number; explanation:string; verification:string }
export interface OperationsRecord { moduleId:string; challengeId:'operations-lab'; version:number; correct:number; score:number; answers:number[]; completedAt:string; passed:boolean }
export function validateOperationsLab(lab:OperationsLab):boolean;
export function gradeOperations(lab:OperationsLab,answers:number[]):{correct:number;total:number;score:number;passed:boolean;details:boolean[];verification:string};
export function verifiedOperationsRecord(record:unknown,lab:OperationsLab|undefined):boolean;
