import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const json=(p)=>JSON.parse(readFileSync(resolve(root,p),'utf8'));
const curriculum=json('src/data/curriculum.json');
const langs=['es','en','ja','zh','pt','fr'];

test('curriculum tracks counts are 12+12+12+18+8',()=>{
 const counts={basic:12,intermediate:12,advanced:12,senior:18,frameworks:8};
 for(const [track,expected] of Object.entries(counts))assert.equal(curriculum.filter(m=>m.track===track).length,expected);
 assert.equal(new Set(curriculum.map(m=>m.id)).size,62);
});
test('all module titles and summaries have six languages',()=>{
 for(const m of curriculum)for(const lang of langs){assert.ok(m.title[lang]?.trim(),`${m.id}:${lang} title`);assert.ok(m.summary[lang]?.trim(),`${m.id}:${lang} summary`)}
});
test('18 senior briefs and self-review criteria exist',()=>{
 for(const m of curriculum.filter(m=>m.track==='senior')){
  assert.ok(m.challenge);assert.equal(m.challenge.criteria.length,6);
  for(const l of langs)assert.ok(m.challenge.scenario[l]?.trim(),`${m.id}:scenario:${l}`);
 }
});
test('translation dictionaries cover the same 84 keys',()=>{
 const ref=Object.keys(json('src/i18n/es.json')).sort();assert.equal(ref.length,84);
 for(const l of langs){const data=json(`src/i18n/${l}.json`);assert.deepEqual(Object.keys(data).sort(),ref)}
});
test('asset library includes a coherent modern pixel identity',()=>{
 for(const path of ['public/assets/gophers/welcome.png','public/assets/gophers/senior.png','public/assets/ASSET-ATLAS.png','public/assets/backgrounds/landscape-dark.svg'])assert.ok(existsSync(resolve(root,path)),path);
 assert.equal(readdirSync(resolve(root,'public/assets/icons')).filter(f=>f.endsWith('.svg')).length,29);
 assert.equal(readdirSync(resolve(root,'public/assets/gophers')).filter(f=>f.endsWith('-128.png')).length,12);
 assert.equal(readdirSync(resolve(root,'public/assets/badges')).filter(f=>f.endsWith('.svg')).length,6);
});
