import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gradeInvestigation,validateInvestigation,verifiedInvestigationRecord} from '../src/features/senior/engine/investigation.mjs';
const cases=JSON.parse(readFileSync(new URL('../src/content/senior/investigations.json',import.meta.url),'utf8'));
test('18 unique and module-specific investigations',()=>{assert.equal(cases.length,18);assert.equal(new Set(cases.map(x=>x.moduleId)).size,18);assert.equal(new Set(cases.flatMap(x=>x.steps.map(y=>y.prompt))).size,54);cases.forEach(validateInvestigation)});
test('correct outcomes and remediation are deterministic',()=>{for(const c of cases){const answers=c.steps.map(s=>s.correct);const r=gradeInvestigation(c,answers);assert.equal(r.score,100);assert.equal(r.passed,true);assert.equal(r.details.length,3);assert.ok(r.details.every(d=>d.explanation.length>20))}});
test('wrong outcomes do not pass',()=>{for(const c of cases){const answers=c.steps.map(s=>(s.correct+1)%3);const r=gradeInvestigation(c,answers);assert.equal(r.score,0);assert.equal(r.passed,false)}});
test('invalid answers and tampered results fail',()=>{const c=cases[0];assert.throws(()=>gradeInvestigation(c,[0,0]));assert.throws(()=>gradeInvestigation(c,[0,0,99]));const answers=c.steps.map(s=>s.correct);const r=gradeInvestigation(c,answers);const record={moduleId:c.moduleId,challengeId:'investigation-lab',version:1,score:r.score,correct:r.correct,passed:r.passed,answers,completedAt:new Date().toISOString()};assert.equal(verifiedInvestigationRecord(record,c),true);assert.equal(verifiedInvestigationRecord({...record,score:50},c),false);assert.equal(verifiedInvestigationRecord({...record,version:2},c),false)});
