import {test} from 'node:test';
import assert from 'node:assert/strict';
import {inventoryScenario,retryStormScenario} from '../src/features/senior/engine/simulations.mjs';
test('atomic inventory model never oversells',()=>{for(let stock=0;stock<=10;stock++)for(let buyers=1;buyers<=20;buyers++){const s=inventoryScenario({stock,customers:buyers,mode:'atomic'});assert.ok(s.finalStock>=0);assert.ok(s.fulfilled<=stock);assert.equal(s.oversold,0)}});
test('unsafe snapshot model reveals logical overbooking',()=>{const s=inventoryScenario({stock:1,customers:3,mode:'unsafe'});assert.equal(s.oversold,2);assert.equal(s.violatesInvariant,true)});
test('retry budget cannot increase attempts when bounded',()=>{for(const failurePercent of [0,10,50,90,100]){const raw=retryStormScenario({requests:100,failurePercent,maxRetries:5,policy:'immediate'});const bounded=retryStormScenario({requests:100,failurePercent,maxRetries:5,policy:'bounded'});assert.ok(bounded.attempts<=raw.attempts)}});
test('reject invalid simulator inputs',()=>{assert.throws(()=>inventoryScenario({stock:-1}));assert.throws(()=>retryStormScenario({maxRetries:999}));assert.throws(()=>retryStormScenario({policy:'unknown'}))});
