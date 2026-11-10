import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gradeCodeReview,validateReviewCase,verifyReviewRecord} from '../src/features/senior/engine/code-review.mjs';
const bank=JSON.parse(readFileSync(new URL('../src/content/senior/code-reviews.json',import.meta.url),'utf8'));
const record=(lab,answers)=>{const result=gradeCodeReview(lab,answers);return {moduleId:lab.moduleId,challengeId:'code-review',version:1,correct:result.correct,score:result.score,answers,passed:result.passed,completedAt:'2026-11-10T00:00:00.000Z'}};
test('every senior module has a distinct valid review case with two defensible decisions',()=>{
 assert.equal(bank.length,18);
 assert.equal(new Set(bank.map(x=>x.moduleId)).size,18);
 assert.equal(new Set(bank.map(x=>x.code)).size,18);
 assert.equal(new Set(bank.flatMap(x=>x.questions.map(q=>q.explanation))).size,36);
 for(const lab of bank){assert.equal(validateReviewCase(lab),true);assert.match(lab.code,/func|if|for|type|go /);}
});
test('all exact correct answers score 100 and are verifiable',()=>{
 for(const lab of bank){const answers=lab.questions.map(q=>q.correct);const grade=gradeCodeReview(lab,answers);assert.equal(grade.score,100,lab.moduleId);assert.equal(grade.passed,true);assert.equal(verifyReviewRecord(record(lab,answers),lab),true);}
});
test('wrong answers and incomplete submissions cannot pass',()=>{
 for(const lab of bank){const answers=lab.questions.map(q=>(q.correct+1)%3);assert.equal(gradeCodeReview(lab,answers).score,0);assert.equal(gradeCodeReview(lab,answers).passed,false);assert.throws(()=>gradeCodeReview(lab,[-1,0]));assert.throws(()=>gradeCodeReview(lab,[0,99]));}
});
test('tampered localStorage reviews are rejected',()=>{
 const lab=bank[5],answers=lab.questions.map(q=>q.correct);
 const valid=record(lab,answers);
 for(const alteration of [{score:0},{correct:0},{passed:false},{version:20},{moduleId:'S19'},{challengeId:'unknown'},{completedAt:'not-a-date'},{answers:[1,100]},{completedAt:'2026-11-10T00:00:00Z'}]){
   assert.equal(verifyReviewRecord({...valid,...alteration},lab),false,JSON.stringify(alteration));
 }
 assert.equal(verifyReviewRecord(null,lab),false);
});
test('new review route connects to UI, progress, backups and result page',()=>{
 const app=readFileSync(new URL('../src/app/App.tsx',import.meta.url),'utf8');
 for(const term of ['reviewResults','verifyReviewRecord','CodeReviewLab','review-lab','Revisar código Go'])assert.ok(app.includes(term),term);
 const readiness=readFileSync(new URL('../src/features/senior/engine/readiness.mjs',import.meta.url),'utf8');assert.match(readiness,/reviewResults/);
});
