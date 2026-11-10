import {spawnSync} from 'node:child_process';
const runs=[['node',['--test','tests/senior-guides.test.mjs']],['node',['--test','tests/senior-engine.test.mjs']]];
for (const [cmd,args] of runs){const r=spawnSync(cmd,args,{stdio:'inherit'});if(r.status!==0)process.exit(r.status??1)}
console.log('Senior v7 content checks passed. This does not verify Vite or Go WASM.');
