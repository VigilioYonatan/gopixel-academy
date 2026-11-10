import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {evaluateDecisionQuiz, validSeniorRecord} from '../src/features/senior/engine/evaluate.mjs';
const data=JSON.parse(readFileSync(new URL('../src/content/senior/challenges.json',import.meta.url),'utf8'));
test('18 distinct senior decision labs and exactly 54 questions',()=>{
 assert.equal(data.length,18);assert.equal(new Set(data.map(c=>c.moduleId)).size,18);
 assert.equal(data.reduce((acc,c)=>acc+c.questions.length,0),54);
 for(const c of data){assert.equal(c.questions.length,3);assert.equal(c.challengeId,'decision-lab');for(const q of c.questions){assert.ok(q.prompt.length>12);assert.ok(q.explanation.length>25);assert.equal(q.options.length,3);assert.equal(new Set(q.options).size,3);assert.ok(q.correct>=0&&q.correct<3);}}
});
test('perfect decision answers score 100 and pass',()=>{for(const c of data){const result=evaluateDecisionQuiz(c,c.questions.map(q=>q.correct));assert.equal(result.passed,true);assert.equal(result.score,100);assert.equal(result.verification,'objective-quiz-only');}});
test('all wrong answers fail; incomplete and invalid input rejected',()=>{for(const c of data){const wrong=c.questions.map(q=>(q.correct+1)%3);const result=evaluateDecisionQuiz(c,wrong);assert.equal(result.correct,0);assert.equal(result.score,0);assert.equal(result.passed,false);assert.throws(()=>evaluateDecisionQuiz(c,[-1,0,0]));assert.throws(()=>evaluateDecisionQuiz(c,[0]));assert.throws(()=>evaluateDecisionQuiz(c,[0,0,3]));}});
test('imported quiz records are recomputed against answer key',()=>{
 const c=data.find(x=>x.moduleId==='S05');
 const answers=c.questions.map(q=>q.correct);
 const r={moduleId:'S05',challengeId:'decision-lab',version:1,correct:3,score:100,answers,passed:true,completedAt:'2026-11-09T20:00:00.000Z'};
 assert.equal(validSeniorRecord(r,'S05',c),true);
 assert.equal(validSeniorRecord({...r,score:99},'S05',c),false);
 assert.equal(validSeniorRecord({...r,correct:0},'S05',c),false);
 assert.equal(validSeniorRecord({...r,passed:false},'S05',c),false);
 assert.equal(validSeniorRecord({...r,answers:[99,0,1]},'S05',c),false);
 assert.equal(validSeniorRecord({...r,version:12},'S05',c),false);
 assert.equal(validSeniorRecord(null,'S05',c),false);
 assert.equal(validSeniorRecord(r,'S06',c),false);
});
