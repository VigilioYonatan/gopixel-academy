export type WorkerPoolInput = {workers:number;capacity:number;arrivalPerTick:number;serviceTicks:number;ticks?:number};
export type WorkerPoolTick = {tick:number;queued:number;active:number;completed:number;rejected:number};
export type WorkerPoolOutput = {arrived:number;accepted:number;completed:number;rejected:number;queued:number;active:number;peakQueue:number;utilization:number;timeline:WorkerPoolTick[];kind:'deterministic-simulation'};
export function simulateWorkerPool(input:WorkerPoolInput): WorkerPoolOutput;
