export type ResultMap=Record<string,{score:number;passed:boolean}>;
export type ReadinessRecords={seniorResults:ResultMap;evidenceResults:ResultMap;investigationResults:ResultMap;operationsResults:ResultMap};
export function evaluateReadiness(ids:string[],records:ReadinessRecords):{modules:Array<{moduleId:string;passed:number;outcomes:boolean[]}>;checked:number;possible:number;percent:number};
