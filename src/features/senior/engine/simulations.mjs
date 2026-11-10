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
