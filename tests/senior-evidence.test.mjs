import { test } from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {evaluateEvidenceLab,verifiedEvidenceRecord} from '../src/features/senior/engine/evidence.mjs';
const labs=JSON.parse(readFileSync(new URL('../src/content/senior/evidence-labs.json',import.meta.url),'utf8'));
test('all 18 modules have specific evidence labs with valid solutions',()=>{
 assert.equal(labs.length,18);
 assert.equal(new Set(labs.map(l=>l.moduleId)).size,18);
 assert.equal(new Set(labs.map(l=>l.evidence)).size,18);
 assert.ok(new Set(labs.map(l=>l.kind)).size>=5);
 for(const l of labs){const x=evaluateEvidenceLab(l,l.correctFindings);assert.equal(x.score,100);assert.equal(x.passed,true);assert.equal(x.verification,'static-evidence-lab');}
});
test('wrong and partial selections do not pass',()=>{
 for(const l of labs){assert.equal(evaluateEvidenceLab(l,[]).passed,false);assert.equal(evaluateEvidenceLab(l,[2,3]).passed,false);}
});
test('evidence lab rejects malformed and repeated selections',()=>{
 const l=labs[0];for(const x of [[1,1],[15],[-1],[1.5],['0'],null])assert.throws(()=>evaluateEvidenceLab(l,x));
});
test('tampered evidence records are refused, score is recomputed',()=>{
 const l=labs[0], v=evaluateEvidenceLab(l,l.correctFindings);
 const rec={moduleId:l.moduleId,challengeId:'evidence-lab',version:l.version,selections:l.correctFindings,correct:v.correct,score:v.score,passed:v.passed,completedAt:'2026-11-09T21:00:00.000Z'};
 assert.equal(verifiedEvidenceRecord(rec,l),true);
 assert.equal(verifiedEvidenceRecord({...rec,score:33},l),false);
 assert.equal(verifiedEvidenceRecord({...rec,passed:false},l),false);
 assert.equal(verifiedEvidenceRecord({...rec,selections:[0,1,2]},l),false);
 assert.equal(verifiedEvidenceRecord({...rec,completedAt:'???'},l),false);
});
