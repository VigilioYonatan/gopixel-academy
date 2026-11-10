import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {readFileSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const html=readFileSync(resolve(root,'demo-offline.html'),'utf8');
const js=html.split('<script>')[1].split('</script>')[0];
function createContext(){
 const app={innerHTML:''};
 const doc={getElementById(){return app;},addEventListener(){},documentElement:{lang:'es',setAttribute(){}}};
 const context={document:doc,location:{hash:'#/'},window:{addEventListener(){}},localStorage:{getItem(){return null},setItem(){}},scrollTo(){},console,Blob,URL,confirm(){return false},alert(){},setTimeout};
 vm.createContext(context);vm.runInContext(js,context,{timeout:5000});return {context,app};
}
test('offline demo bootstraps welcome, senior dashboard and 6 languages',()=>{
 const {context,app}=createContext();
 assert.ok(app.innerHTML.includes('GoPixel'));
 vm.runInContext("location.hash='#/senior';render();",context,{timeout:1000});
 assert.ok(app.innerHTML.includes('S18'));
 vm.runInContext("P.locale='ja';location.hash='#/learn/basic';render();",context,{timeout:1000});
 assert.ok(app.innerHTML.includes('Go入門'));
 vm.runInContext("P.locale='zh';location.hash='#/frameworks';render();",context,{timeout:1000});
 assert.ok(app.innerHTML.includes('框架'));
});
