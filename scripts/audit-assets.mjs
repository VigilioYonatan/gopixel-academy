import {readFileSync,existsSync,readdirSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../', import.meta.url));
const read=(p)=>readFileSync(join(root,p),'utf8');
const app=read('src/app/App.tsx');
const names=[...app.matchAll(/<Icon name="([a-z-]+)"/g)].map(m=>m[1]);
let misses=[];
for(const n of new Set(names)) if(!existsSync(join(root,'public/assets/icons',n+'.svg'))) misses.push('icon:'+n);
for(const locale of ['es','en','ja','zh','pt','fr']) {
 const obj=JSON.parse(read('src/i18n/'+locale+'.json'));
 if(Object.values(obj).some(v=>typeof v!=='string'||!v.trim()))misses.push('i18n:'+locale);
}
const data=JSON.parse(read('src/data/curriculum.json'));
for(const m of data) if(!m.id||!m.slug||!m.track)misses.push('curriculum:'+m.id);
if(misses.length){console.error(misses.join('\n'));process.exit(1)}
console.log(`OK: ${names.length} static icon references; ${data.length} content entries; 6 UI dictionaries`);
