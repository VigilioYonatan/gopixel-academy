/** Read-only, deterministic aggregation of independently verified educational results.
 * Native lab completion is intentionally NOT auto-reported: it executes outside the browser.
 */
const keys=['seniorResults','evidenceResults','investigationResults','operationsResults','reviewResults'];
export function evaluateReadiness(ids,records){
 if(!Array.isArray(ids)||ids.some(id=>typeof id!=='string'||!/^S(0[1-9]|1[0-8])$/.test(id))||new Set(ids).size!==ids.length)throw new TypeError('Invalid modules');
 if(!records||typeof records!=='object'||Array.isArray(records))throw new TypeError('Invalid records');
 const modules=ids.map(moduleId=>{
  const outcomes=keys.map(key=>{
   const map=records[key];const row=map&&typeof map==='object'&&!Array.isArray(map)?map[moduleId]:null;
   return !!row && row.passed===true && row.score===100;
  });
  return {moduleId,passed:outcomes.filter(Boolean).length,outcomes};
 });
 const checked=modules.reduce((sum,m)=>sum+m.passed,0),possible=ids.length*keys.length;
 return {modules,checked,possible,percent:possible?Math.round(100*checked/possible):0};
}
