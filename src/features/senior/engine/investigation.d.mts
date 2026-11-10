export type InvestigationStep = { id: string; prompt: string; options: string[]; correct: number; explanation: string };
export type Investigation = { moduleId: string; challengeId: string; version: number; title: string; brief: string; mode: string; steps: InvestigationStep[] };
export type InvestigationResult = { correct: number; total: number; score: number; passed: boolean; details: Array<{id:string;selected:number;correct:boolean;expected:number;explanation:string}>; verification: string };
export declare function validateInvestigation(lab: Investigation): boolean;
export declare function gradeInvestigation(lab: Investigation, answers: number[]): InvestigationResult;
export declare function verifiedInvestigationRecord(record: unknown, lab: Investigation | undefined): boolean;
