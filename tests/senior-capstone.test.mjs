import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const read=p=>readFileSync(new URL(p,import.meta.url),'utf8');
const cap=JSON.parse(read('../src/content/senior/capstone.json'));
test('capstone defines six distinct real Go skills with tests and limits',()=>{
 assert.equal(cap.steps.length,6);
 assert.equal(new Set(cap.steps.map(s=>s.id)).size,6);
 assert.equal(cap.boundaries.length,5);
 for(const s of cap.steps){assert.ok(s.detail.length>80,s.id);assert.ok(s.test.length>5,s.id)}
});
test('source packages and tests are checked into the repository',()=>{
 for(const path of ['orders/orders.go','orders/orders_test.go','httpapi/handler.go','httpapi/handler_test.go','demo/main.go'])assert.equal(existsSync(new URL('../labs-native/capstone/'+path,import.meta.url)),true,path);
});
test('capstone route, UI and downloadable archive are referenced',()=>{
 assert.match(read('../src/app/App.tsx'),/SeniorCapstone/);
 assert.match(read('../src/app/App.tsx'),/parts\[1\]==='capstone'/);
 assert.match(read('../src/features/senior/SeniorCapstone.tsx'),/go-native-senior-labs\.zip/);
 assert.match(read('../src/features/senior/NativeLabCatalog.tsx'),/go-native-senior-labs\.zip/);
});
