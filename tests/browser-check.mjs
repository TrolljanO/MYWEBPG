// Run with SITE_URL=http://localhost:4173 CHROME_PATH=/path/to/chrome node tests/browser-check.mjs
// CDP_HELPER may point to design-taste-frontend/scripts/lib/cdp.mjs.
import {homedir} from 'node:os';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const {Browser,sleep} = await import(pathToFileURL(process.env.CDP_HELPER || resolve(homedir(), '.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs')));
const base = (process.env.SITE_URL || 'http://localhost:4173').replace(/\/$/, '');
import {mkdirSync,writeFileSync} from 'node:fs';
const out=resolve('.taste-skill/qa');mkdirSync(out,{recursive:true});
const b=await Browser.launch();let checks=[];const assert=(condition,name,details)=>{checks.push({name,pass:!!condition,details});if(!condition)console.error('FAIL',name,details)};
try{
const p=await b.newPage();await p.goto(base);
assert(await p.eval(()=>document.querySelector('h1').innerText.includes('Guilherme')),'Home renders');
await p.eval(()=>document.querySelector('[data-filter="design"]').click());
assert(await p.eval(()=>document.querySelectorAll('.project:not([hidden])').length===1&&document.querySelector('.project:not([hidden])').dataset.category==='design'),'Project visual filter');
await p.eval(()=>document.querySelector('[data-filter="ai"]').click());
assert(await p.eval(()=>document.querySelectorAll('.project:not([hidden])').length===2),'Project AI filter');
await p.eval(()=>document.querySelector('[data-filter="all"]').click());
await p.eval(()=>document.querySelector('.theme-toggle').click());
assert(await p.eval(()=>document.documentElement.dataset.theme==='dark'),'Dark theme toggle');
await p.goto(base);assert(await p.eval(()=>document.documentElement.dataset.theme==='dark'),'Theme persists on reload');
await p.screenshot({path:out+'/dark-desktop.png'});
await p.eval(()=>document.querySelector('.theme-toggle').click());
await p.eval(()=>document.getElementById('unfold').click());await sleep(1300);
assert(await p.eval(()=>document.getElementById('unfold').getAttribute('aria-pressed')==='true'&&[...document.querySelectorAll('.art-layer')].some(e=>getComputedStyle(e).transform!=='none')),'Unfold changes layers');
await p.eval(()=>document.getElementById('motion-toggle').click());
assert(await p.eval(()=>document.documentElement.dataset.motion==='paused'&&[...document.querySelectorAll('.art-layer')].every(e=>getComputedStyle(e).transform==='none')),'Pause removes motion');
await p.eval(()=>document.getElementById('motion-toggle').click());
for(const width of [360,390,768,1440]){
 await p.setViewport({width,height:900});await p.goto(base);
 const metrics=await p.eval(()=>({w:innerWidth,scroll:document.documentElement.scrollWidth,broken:[...document.images].filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.src)}));
 assert(metrics.scroll<=width,'No horizontal overflow '+width,metrics);
 assert(!metrics.broken.length,'Images load '+width,metrics.broken);
 await p.screenshot({path:out+'/home-'+width+'.png',fullPage:true});
}
const paths=['curriculo.html','projetos/sdd-buddy.html','projetos/micro-rag.html','privacidade.html','arquivo/index.html','404.html'];
for(const path of paths){await p.goto(base+'/'+path);const x=await p.eval(()=>({title:document.querySelector('h1')?.innerText,overflow:document.documentElement.scrollWidth>innerWidth}));assert(!!x.title&&!x.overflow,'Reading page '+path,x);}
await p.goto(base+'/curriculo.html');await p.send('Emulation.setEmulatedMedia',{media:'print'});assert(await p.eval(()=>getComputedStyle(document.querySelector('.header')).display==='none'&&getComputedStyle(document.getElementById('print-cv')).display==='none'),'Print hides controls');await p.send('Emulation.setEmulatedMedia',{media:''});
const reduced=await b.newPage({reducedMotion:true,width:390,height:844});await reduced.goto(base);assert(await reduced.eval(()=>document.getElementById('unfold').disabled&&[...document.querySelectorAll('.art-layer')].every(e=>getComputedStyle(e).animationName==='none'&&getComputedStyle(e).transform==='none')),'Reduced motion respected');
const plain=await b.newPage({width:390,height:844});await plain.send('Emulation.setScriptExecutionDisabled',{value:true});await plain.goto(base);assert(await plain.eval(()=>document.querySelectorAll('.project').length===3&&document.querySelector('h1').getBoundingClientRect().height>0),'Content available without JS');
const blocked=await b.newPage();await blocked.send('Page.addScriptToEvaluateOnNewDocument',{source:'Object.defineProperty(window,"localStorage",{get(){throw new Error("blocked")}})'});await blocked.goto(base);await blocked.eval(()=>document.querySelector('.theme-toggle').click());assert(await blocked.eval(()=>document.documentElement.dataset.theme==='dark'),'Theme works without storage');
assert(p.consoleErrors.length===0&&reduced.consoleErrors.length===0&&blocked.consoleErrors.length===0,'No runtime exceptions',{regular:p.consoleErrors,reduced:reduced.consoleErrors,blocked:blocked.consoleErrors});
await p.goto(base);await p.eval(()=>{document.querySelector('.theme-toggle').click();document.querySelector('.about-copy a').focus()});assert(await p.eval(()=>getComputedStyle(document.querySelector('.about-copy a')).outlineColor!==getComputedStyle(document.querySelector('.about-section')).backgroundColor),'About focus contrasts in reversed section');
await p.goto(base+'/curriculo.html');await p.send('Emulation.setEmulatedMedia',{media:'print'});assert(await p.eval(()=>getComputedStyle(document.querySelector('.reading p')).color==='rgb(0, 0, 0)'&&document.querySelector('h1').innerText.includes('Guilherme')),'Dark-theme CV print label contrast');
assert(await p.eval(async()=>{const text=await(await fetch('/404.html')).text();return text.includes('href="/index.css"')&&text.includes('href="/"')}),'404 root asset and recovery paths');

await p.send('Emulation.setEmulatedMedia',{media:''});
await p.goto(base);
const cuts=await p.eval(()=>({count:document.querySelectorAll('.wave-cut[data-cut]').length,images:document.querySelectorAll('.engraving image').length}));
assert(cuts.count===8&&cuts.images===0,'Eight actual SVG cuts, no raster layers',cuts);
await p.eval(()=>document.getElementById('unfold').focus());
await p.send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});
await p.send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});
await sleep(1300);
assert(await p.eval(()=>document.getElementById('unfold').getAttribute('aria-pressed')==='true'&&new Set([...document.querySelectorAll('.wave-cut')].map(e=>e.style.transform)).size===8),'Keyboard opens eight independently transformed cuts');
await p.screenshot({path:out+'/cuts-open.png'});
await p.eval(()=>document.querySelector('.theme-toggle').click());await p.screenshot({path:out+'/cuts-dark.png'});
await p.setViewport({width:360,height:800});await p.goto(base);
await p.eval(()=>document.querySelector('.theme-toggle').click());await p.screenshot({path:out+'/mobile-light.png'});
await p.setViewport({width:1440,height:900});
await p.eval(()=>document.documentElement.style.zoom='2');
assert(await p.eval(()=>document.documentElement.scrollWidth<=innerWidth),'200 percent zoom no horizontal overflow');
await p.eval(()=>document.documentElement.style.zoom='');
await p.goto(base+'/arquivo/index.html');
assert(await p.eval(()=>document.querySelector('h1').innerText==='Arquivo'&&!document.querySelector('.reading article')),'Archive honest empty state');
assert(await p.eval(()=>document.getElementById('motion-toggle').hidden),'Reading pages do not expose inactive motion control');
const requests=await p.eval(()=>performance.getEntriesByType('resource').filter(r=>!r.name.startsWith(location.origin)).map(r=>r.name));
assert(requests.length===0,'No third-party runtime resources',requests);

writeFileSync(out+'/checks.json',JSON.stringify(checks,null,2));console.log(JSON.stringify({passed:checks.filter(c=>c.pass).length,total:checks.length,failures:checks.filter(c=>!c.pass)},null,2));
}finally{await b.close()}
if(checks.some(c=>!c.pass))process.exitCode=1;
