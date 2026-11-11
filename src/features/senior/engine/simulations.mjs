/** Deterministic teaching models, not Go execution or production metrics. */
export function inventoryScenario({stock=1,customers=2,mode='unsafe'}={}) {
 if (!Number.isInteger(stock)||stock<0||stock>100||!Number.isInteger(customers)||customers<1||customers>100||!['unsafe','atomic'].includes(mode)) throw new TypeError('Invalid inventory scenario');
 const initial=stock;
 // Unsafe: all clients read the same initial snapshot before any writes.
 const fulfilled=mode==='atomic'?Math.min(stock,customers):(initial>0?customers:0);
 const finalStock=stock-fulfilled;
 return {mode,initialStock:stock,customers,fulfilled,finalStock,oversold:Math.max(0,-finalStock),violatesInvariant:finalStock<0,verification:'deterministic-inventory-model'};
}
export function retryStormScenario({requests=40,failurePercent=50,maxRetries=2,policy='immediate'}={}) {
 if(!Number.isInteger(requests)||requests<1||requests>500||!Number.isInteger(failurePercent)||failurePercent<0||failurePercent>100||!Number.isInteger(maxRetries)||maxRetries<0||maxRetries>6||!['immediate','bounded'].includes(policy)) throw new TypeError('Invalid retry scenario');
 // A fraction of attempts fail deterministically per generation; count attempts,
 // do not claim latency or measured throughput. Bounded mode enforces retry budget=1.
 const retryCap=policy==='bounded'?Math.min(maxRetries,1):maxRetries;
 let attempts=requests, outstanding=requests, failed=0;
 const generations=[requests];
 for(let i=0;i<=retryCap;i++){
  failed=Math.floor(outstanding*failurePercent/100);
  if(i<retryCap){outstanding=failed;attempts+=outstanding;generations.push(outstanding)}
 }
 return {requests,attempts,retryAttempts:attempts-requests,generations,unresolved:failed,amplification:Number((attempts/requests).toFixed(2)),policy,verification:'deterministic-retry-model'};
}
/** Bounded pedagogical memory-retention model, not Go heap profiling. */
export function sliceRetentionScenario({backingBytes=1000000,retainedBytes=100,copy=false}={}) {
 if(!Number.isInteger(backingBytes)||backingBytes<1||backingBytes>100000000||!Number.isInteger(retainedBytes)||retainedBytes<0||retainedBytes>backingBytes||typeof copy!=='boolean')throw new TypeError('Invalid retention model');
 const modeledRetained=copy?retainedBytes:backingBytes;
 return {backingBytes,retainedBytes,copy,modeledRetained,extraBytes:modeledRetained-retainedBytes,verification:'deterministic-slice-retention-model'};
}
/** At-least-once delivery can replay an event; idempotency suppresses duplicate effects. */
export function deliveryScenario({events=10,replays=3,idempotent=false}={}) {
 if(!Number.isInteger(events)||events<1||events>1000||!Number.isInteger(replays)||replays<0||replays>events||typeof idempotent!=='boolean')throw new TypeError('Invalid delivery model');
 return {events,replays,deliveries:events+replays,effects:idempotent?events:events+replays,duplicateEffects:idempotent?0:replays,verification:'deterministic-delivery-model'};
}
/** Elementary capacity model with fixed ticks and no stochastic scheduling. */
export function capacityScenario({arrivalsPerTick=20,servedPerTick=10,capacity=50,ticks=10}={}) {
 for(const [v,lo,hi] of [[arrivalsPerTick,0,500],[servedPerTick,0,500],[capacity,0,10000],[ticks,1,100]])if(!Number.isInteger(v)||v<lo||v>hi)throw new TypeError('Invalid capacity model');
 let queued=0,rejected=0,completed=0;
 for(let i=0;i<ticks;i++){
  const free=capacity-queued;
  const incoming=Math.min(arrivalsPerTick,Math.max(0,free));
  rejected+=arrivalsPerTick-incoming;
  queued+=incoming;
  const done=Math.min(queued,servedPerTick);
  completed+=done;queued-=done;
 }
 return {arrived:arrivalsPerTick*ticks,completed,queued,rejected,capacity,ticks,verification:'deterministic-queue-capacity-model'};
}

/** S03: Idempotency deduplication window & cache TTL model. */
export function idempotencyWindowScenario({ requests=100, duplicateRate=30, ttlSeconds=60, windowSeconds=60 }={}) {
  if (!Number.isInteger(requests) || requests < 10 || requests > 1000 ||
      !Number.isInteger(duplicateRate) || duplicateRate < 0 || duplicateRate > 100 ||
      !Number.isInteger(ttlSeconds) || ttlSeconds < 5 || ttlSeconds > 300 ||
      !Number.isInteger(windowSeconds) || windowSeconds < 5 || windowSeconds > 300) {
    throw new TypeError('Invalid idempotency window scenario');
  }
  const duplicateRequests = Math.round(requests * (duplicateRate / 100));
  const uniqueRequests = requests - duplicateRequests;
  const ttlCoverage = Math.min(1, ttlSeconds / windowSeconds);
  const filteredDuplicates = Math.round(duplicateRequests * ttlCoverage);
  const leakedDuplicates = duplicateRequests - filteredDuplicates;
  const dbWrites = uniqueRequests + leakedDuplicates;
  return {
    requests,
    uniqueRequests,
    duplicateRequests,
    ttlSeconds,
    windowSeconds,
    filteredDuplicates,
    leakedDuplicates,
    dbWrites,
    isSafe: leakedDuplicates === 0,
    verification: 'deterministic-idempotency-ttl-model'
  };
}

/** S06: Data race vs atomic/mutex synchronization model. */
export function dataRaceScenario({ goroutines=100, iterations=10, syncMode='none' }={}) {
  if (!Number.isInteger(goroutines) || goroutines < 2 || goroutines > 500 ||
      !Number.isInteger(iterations) || iterations < 1 || iterations > 50 ||
      !['none', 'mutex', 'atomic'].includes(syncMode)) {
    throw new TypeError('Invalid data race scenario');
  }
  const targetCount = goroutines * iterations;
  if (syncMode === 'atomic' || syncMode === 'mutex') {
    return {
      goroutines,
      iterations,
      targetCount,
      finalCount: targetCount,
      lostUpdates: 0,
      raceDetected: false,
      syncMode,
      verification: 'deterministic-race-sync-model'
    };
  }
  const lossFactor = Math.min(0.48, (goroutines * 0.0035));
  const finalCount = Math.max(1, Math.floor(targetCount * (1 - lossFactor)));
  const lostUpdates = targetCount - finalCount;
  return {
    goroutines,
    iterations,
    targetCount,
    finalCount,
    lostUpdates,
    raceDetected: true,
    syncMode,
    verification: 'deterministic-race-sync-model'
  };
}

/** S14: Latency percentiles & memory allocation impact model. */
export function latencyPercentilesScenario({ baseLatencyMs=2, allocsPerOp=10, gogc=100 }={}) {
  if (!Number.isInteger(baseLatencyMs) || baseLatencyMs < 1 || baseLatencyMs > 50 ||
      !Number.isInteger(allocsPerOp) || allocsPerOp < 0 || allocsPerOp > 100 ||
      !Number.isInteger(gogc) || gogc < 20 || gogc > 400) {
    throw new TypeError('Invalid latency percentiles scenario');
  }
  const gcPressure = (allocsPerOp * 0.08) * (100 / gogc);
  const p50 = Number((baseLatencyMs * (1 + (allocsPerOp * 0.015))).toFixed(2));
  const p90 = Number((p50 * (1.15 + (allocsPerOp * 0.03))).toFixed(2));
  const p99 = Number((p50 * (1.35 + gcPressure * 2.5)).toFixed(2));
  return {
    baseLatencyMs,
    allocsPerOp,
    gogc,
    p50,
    p90,
    p99,
    jitter: Number((p99 - p50).toFixed(2)),
    verification: 'deterministic-latency-percentiles-model'
  };
}

/** S15: Graceful shutdown connection draining model. */
export function gracefulShutdownScenario({ inFlight=50, drainTimeoutSec=5, reqDurationSec=3, strategy='graceful' }={}) {
  if (!Number.isInteger(inFlight) || inFlight < 1 || inFlight > 500 ||
      !Number.isInteger(drainTimeoutSec) || drainTimeoutSec < 1 || drainTimeoutSec > 30 ||
      !Number.isInteger(reqDurationSec) || reqDurationSec < 1 || reqDurationSec > 30 ||
      !['graceful', 'hard'].includes(strategy)) {
    throw new TypeError('Invalid graceful shutdown scenario');
  }
  if (strategy === 'hard') {
    return {
      inFlight,
      drainedCleanly: 0,
      droppedConnections: inFlight,
      drainTimeoutSec,
      reqDurationSec,
      strategy,
      isZeroDowntime: false,
      verification: 'deterministic-graceful-shutdown-model'
    };
  }
  if (reqDurationSec <= drainTimeoutSec) {
    return {
      inFlight,
      drainedCleanly: inFlight,
      droppedConnections: 0,
      drainTimeoutSec,
      reqDurationSec,
      strategy,
      isZeroDowntime: true,
      verification: 'deterministic-graceful-shutdown-model'
    };
  }
  const drainedCleanly = Math.floor(inFlight * (drainTimeoutSec / reqDurationSec));
  const droppedConnections = inFlight - drainedCleanly;
  return {
    inFlight,
    drainedCleanly,
    droppedConnections,
    drainTimeoutSec,
    reqDurationSec,
    strategy,
    isZeroDowntime: droppedConnections === 0,
    verification: 'deterministic-graceful-shutdown-model'
  };
}
