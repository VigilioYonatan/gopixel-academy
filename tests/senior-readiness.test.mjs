import test from 'node:test';
import assert from 'node:assert/strict';
import {evaluateReadiness} from '../src/features/senior/engine/readiness.mjs';
const empty={seniorResults:{},evidenceResults:{},investigationResults:{},operationsResults:{},reviewResults:{}};
test('readiness zero for missing answers',()=>assert.deepEqual(evaluateReadiness(['S01'],empty).checked,0));
test('counts only passing verified assessments',()=>{
 const input={...empty,seniorResults:{S01:{score:100,passed:true}},evidenceResults:{S01:{score:66,passed:true}},investigationResults:{S01:{score:100,passed:false}},operationsResults:{S02:{score:100,passed:true}}};
 const result=evaluateReadiness(['S01','S02'],input);assert.equal(result.checked,2);assert.equal(result.possible,10);assert.equal(result.percent,20);assert.equal(result.modules[0].passed,1);
});
test('rejects duplicates and invalid modules',()=>{assert.throws(()=>evaluateReadiness(['S01','S01'],empty));assert.throws(()=>evaluateReadiness(['bad'],empty));assert.throws(()=>evaluateReadiness(['S01'],null));});
