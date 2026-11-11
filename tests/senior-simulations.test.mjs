import {test} from 'node:test';
import assert from 'node:assert/strict';
import {
  inventoryScenario,
  retryStormScenario,
  idempotencyWindowScenario,
  dataRaceScenario,
  latencyPercentilesScenario,
  gracefulShutdownScenario,
} from '../src/features/senior/engine/simulations.mjs';

test('atomic inventory model never oversells',()=>{for(let stock=0;stock<=10;stock++)for(let buyers=1;buyers<=20;buyers++){const s=inventoryScenario({stock,customers:buyers,mode:'atomic'});assert.ok(s.finalStock>=0);assert.ok(s.fulfilled<=stock);assert.equal(s.oversold,0)}});
test('unsafe snapshot model reveals logical overbooking',()=>{const s=inventoryScenario({stock:1,customers:3,mode:'unsafe'});assert.equal(s.oversold,2);assert.equal(s.violatesInvariant,true)});
test('retry budget cannot increase attempts when bounded',()=>{for(const failurePercent of [0,10,50,90,100]){const raw=retryStormScenario({requests:100,failurePercent,maxRetries:5,policy:'immediate'});const bounded=retryStormScenario({requests:100,failurePercent,maxRetries:5,policy:'bounded'});assert.ok(bounded.attempts<=raw.attempts)}});
test('reject invalid simulator inputs',()=>{assert.throws(()=>inventoryScenario({stock:-1}));assert.throws(()=>retryStormScenario({maxRetries:999}));assert.throws(()=>retryStormScenario({policy:'unknown'}))});

test('idempotency window protects duplicate writes when TTL exceeds window',()=>{
  const safe = idempotencyWindowScenario({ requests: 100, duplicateRate: 40, ttlSeconds: 60, windowSeconds: 60 });
  assert.equal(safe.isSafe, true);
  assert.equal(safe.leakedDuplicates, 0);
  assert.equal(safe.dbWrites, safe.uniqueRequests);

  const unsafe = idempotencyWindowScenario({ requests: 100, duplicateRate: 40, ttlSeconds: 30, windowSeconds: 60 });
  assert.equal(unsafe.isSafe, false);
  assert.ok(unsafe.leakedDuplicates > 0);
  assert.ok(unsafe.dbWrites > unsafe.uniqueRequests);
});

test('data race simulation detects lost updates without synchronization',()=>{
  const unsync = dataRaceScenario({ goroutines: 100, iterations: 10, syncMode: 'none' });
  assert.equal(unsync.raceDetected, true);
  assert.ok(unsync.lostUpdates > 0);
  assert.ok(unsync.finalCount < unsync.targetCount);

  const sync = dataRaceScenario({ goroutines: 100, iterations: 10, syncMode: 'atomic' });
  assert.equal(sync.raceDetected, false);
  assert.equal(sync.lostUpdates, 0);
  assert.equal(sync.finalCount, sync.targetCount);
});

test('latency percentiles show zero-allocation bounds tail latency',()=>{
  const zeroAlloc = latencyPercentilesScenario({ baseLatencyMs: 2, allocsPerOp: 0, gogc: 100 });
  const highAlloc = latencyPercentilesScenario({ baseLatencyMs: 2, allocsPerOp: 50, gogc: 100 });
  assert.ok(highAlloc.p99 > zeroAlloc.p99);
  assert.ok(highAlloc.jitter > zeroAlloc.jitter);
});

test('graceful shutdown drains in-flight requests cleanly within timeout',()=>{
  const graceful = gracefulShutdownScenario({ inFlight: 50, drainTimeoutSec: 10, reqDurationSec: 3, strategy: 'graceful' });
  assert.equal(graceful.isZeroDowntime, true);
  assert.equal(graceful.droppedConnections, 0);
  assert.equal(graceful.drainedCleanly, 50);

  const hard = gracefulShutdownScenario({ inFlight: 50, drainTimeoutSec: 10, reqDurationSec: 3, strategy: 'hard' });
  assert.equal(hard.isZeroDowntime, false);
  assert.equal(hard.droppedConnections, 50);
});
