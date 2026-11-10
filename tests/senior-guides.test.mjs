import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
const read=(p)=>readFileSync(new URL(p,import.meta.url),'utf8');
const guides=JSON.parse(read('../src/content/senior/guides.json'));
const catalog=JSON.parse(read('../src/content/senior/native-labs.json'));
test('18 distinct senior teaching guides, one per native lab',()=>{
 assert.equal(guides.length,18);
 assert.equal(new Set(guides.map(g=>g.id)).size,18);
 assert.deepEqual(guides.map(g=>g.id),catalog.map(x=>x.id));
});
test('senior guides provide precise rationale, risks and tests, without filler',()=>{
 for(const g of guides){
  assert.equal(g.sections.length,5,g.id);
  for(const s of g.sections){assert.ok(s.body.length>75,g.id+' '+s.title);assert.ok(!/\bTODO\b|lorem ipsum|resto igual/i.test(s.body));}
  assert.ok(g.referenceSource.startsWith('package '),g.id);
  assert.ok(g.referenceTest.includes('testing'),g.id);
  assert.ok(g.command.includes('go test -race'),g.id);
 }
});
test('source and tests embedded in guides match native Go labs byte-for-byte',()=>{
 for(const g of guides){const c=catalog.find(x=>x.id===g.id); const source=read('../'+c.directory+'/solution.go');const tests=read('../'+c.directory+'/solution_test.go');assert.equal(g.referenceSource,source,g.id);assert.equal(g.referenceTest,tests,g.id)}
});
test('guide route and reference links are integrated into application',()=>{
 const app=read('../src/app/App.tsx');assert.match(app,/parts\[2\]==='guide'/);assert.match(app,/SeniorGuide moduleId=/);assert.match(app,/Estudiar guía técnica/);
});
