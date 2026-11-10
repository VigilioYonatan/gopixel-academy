export interface ReviewQuestion {prompt:string;options:string[];correct:number;explanation:string}
export interface ReviewCase {moduleId:string;id:string;version:number;title:string;code:string;questions:ReviewQuestion[];language:string;practice:string;verification:string}
export interface ReviewRecord {moduleId:string;challengeId:'code-review';version:number;correct:number;score:number;answers:number[];completedAt:string;passed:boolean}
export interface ReviewGrade {correct:number;total:number;score:number;passed:boolean;details:{selected:number;expected:number;correct:boolean;explanation:string}[];verification:string}
export function validateReviewCase(c:ReviewCase):true;
export function gradeCodeReview(c:ReviewCase,answers:number[]):ReviewGrade;
export function verifyReviewRecord(record:unknown,c:ReviewCase | undefined):boolean;
