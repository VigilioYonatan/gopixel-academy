/** Deterministic educational queue simulator. NOT a Go runtime or real benchmark. */
export function simulateWorkerPool({workers, capacity, arrivalPerTick, serviceTicks, ticks=30}) {
 const args=[workers,capacity,arrivalPerTick,serviceTicks,ticks];
 if(args.some(n=>!Number.isInteger(n)) || workers<1 || workers>64 || capacity<0 || capacity>10000 || arrivalPerTick<0 || arrivalPerTick>1000 || serviceTicks<1 || serviceTicks>100 || ticks<1 || ticks>1000) throw new RangeError('Invalid simulation input');
 let queued=0, completed=0, rejected=0, accepted=0, busy=Array(workers).fill(0), peakQueue=0, occupiedTicks=0;
 const timeline=[];
 for(let t=0;t<ticks;t++){
   for(let i=0;i<workers;i++){
     if(busy[i]>0){busy[i]--;if(busy[i]===0)completed++;}
   }
   // Admit arrivals directly into idle workers, then bounded queue, reject rest.
   for(let n=0;n<arrivalPerTick;n++){
     const free=busy.indexOf(0);
     if(free!==-1 && queued===0){busy[free]=serviceTicks;accepted++;}
     else if(queued<capacity){queued++;accepted++;}
     else rejected++;
   }
   for(let i=0;i<workers && queued>0;i++){
     if(busy[i]===0){busy[i]=serviceTicks;queued--;}
   }
   occupiedTicks+=busy.filter(n=>n>0).length;
   peakQueue=Math.max(peakQueue,queued);
   timeline.push({tick:t+1,queued,active:busy.filter(n=>n>0).length,completed,rejected});
 }
 return {arrived:arrivalPerTick*ticks,accepted,completed,rejected,queued,active:busy.filter(n=>n>0).length,peakQueue,utilization:Math.round(occupiedTicks/(ticks*workers)*100),timeline,kind:'deterministic-simulation'};
}
