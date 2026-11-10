import {test} from 'node:test';
import assert from 'node:assert/strict';
import {simulateWorkerPool} from '../src/features/senior/engine/worker-pool.mjs';
test('zero arrivals never complete or drop jobs',()=>{const r=simulateWorkerPool({workers:4,capacity:5,arrivalPerTick:0,serviceTicks:2,ticks:25});assert.equal(r.completed,0);assert.equal(r.rejected,0);assert.equal(r.queued,0);});
test('every arriving job is accepted or rejected; completed cannot exceed accepted',()=>{for(let w of [1,3,10])for(let a of [1,5,12]){const r=simulateWorkerPool({workers:w,capacity:5,arrivalPerTick:a,serviceTicks:4});assert.equal(r.accepted+r.rejected,r.arrived);assert.ok(r.completed<=r.accepted);assert.ok(r.queued<=5);assert.ok(r.active<=w);assert.ok(r.utilization>=0&&r.utilization<=100);}});
test('higher capacity cannot increase rejected count in a fixed scenario',()=>{const input={workers:2,arrivalPerTick:6,serviceTicks:3,ticks:30};const small=simulateWorkerPool({...input,capacity:2});const large=simulateWorkerPool({...input,capacity:100});assert.ok(large.rejected<=small.rejected);});
test('invalid simulations fail with bounded ranges',()=>{assert.throws(()=>simulateWorkerPool({workers:0,capacity:3,arrivalPerTick:1,serviceTicks:2}));assert.throws(()=>simulateWorkerPool({workers:2,capacity:1000000,arrivalPerTick:1,serviceTicks:2}));});
