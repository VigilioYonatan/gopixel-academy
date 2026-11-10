/** Deterministic, versioned review assessment; runs fully offline.
 * Not a static analyzer, compiler, or authoritative proof of competence.
 */
export function validateReviewCase(c) {
 if (!c || typeof c !== 'object' || !/^S(0[1-9]|1[0-8])$/.test(c.moduleId) ||
   c.version!==1 || typeof c.code!=='string' || c.code.length<50 || c.code.length>6000 ||
   !Array.isArray(c.questions) || c.questions.length!==2) throw new TypeError('Invalid review case');
 for(const q of c.questions){
   if(typeof q.prompt!=='string'||q.prompt.length<8||typeof q.explanation!=='string'||q.explanation.length<15||
     !Array.isArray(q.options)||q.options.length!==3||!q.options.every(x=>typeof x==='string'&&x.length>15)||
     !Number.isInteger(q.correct)||q.correct<0||q.correct>2)throw new TypeError('Invalid review question');
 }
 return true;
}
export function gradeCodeReview(c,answers){
 validateReviewCase(c);
 if(!Array.isArray(answers)||answers.length!==2||!answers.every(a=>Number.isInteger(a)&&a>=0&&a<3))throw new TypeError('Invalid review answers');
 const details=c.questions.map((q,index)=>({selected:answers[index],expected:q.correct,correct:answers[index]===q.correct,explanation:q.explanation}));
 const correct=details.filter(x=>x.correct).length;
 return {correct,total:2,score:correct*50,passed:correct===2,details,verification:'objective-code-review'};
}
export function verifyReviewRecord(candidate,c){
 try {
   validateReviewCase(c);
   if(!candidate||typeof candidate!=='object'||Array.isArray(candidate)||candidate.moduleId!==c.moduleId||
     candidate.challengeId!=='code-review'||candidate.version!==c.version||typeof candidate.completedAt!=='string'||
     candidate.completedAt.length>32||!/^\d{4}-\d{2}-\d{2}T/.test(candidate.completedAt)||
     !Number.isFinite(Date.parse(candidate.completedAt))||new Date(candidate.completedAt).toISOString()!==candidate.completedAt) return false;
   const grade=gradeCodeReview(c,candidate.answers);
   return candidate.correct===grade.correct && candidate.score===grade.score && candidate.passed===grade.passed;
 }catch{return false;}
}
