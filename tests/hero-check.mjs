// Run with the same CHROME_PATH / CDP_HELPER environment as browser-check.mjs.
import {homedir} from 'node:os';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const {Browser,sleep}=await import(pathToFileURL(process.env.CDP_HELPER || resolve(homedir(), '.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs')));
import {writeFileSync,mkdirSync} from 'node:fs';
const base=process.env.SITE_URL || 'http://localhost:4173';
const out='docs/design/hero-preview'; mkdirSync(out,{recursive:true});
const b=await Browser.launch();
const checks=[];const check=(ok,name,detail)=>{checks.push({pass:!!ok,name,detail});if(!ok)process.exitCode=1};
try {
 const p=await b.newPage(); const results=[];
 for(const width of [375,768,1440]) {
  await p.setViewport({width,height:width===375?900:1000}); await p.goto(base);
  await p.eval(async()=>{document.documentElement.dataset.theme='light';await document.fonts.ready;window.scrollTo(0,0)});
  results.push(await p.eval(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,title:document.querySelector('h1').innerText,hero:document.querySelector('.hero').getBoundingClientRect().toJSON(),font:getComputedStyle(document.querySelector('.hero-description')).fontFamily,bodySize:getComputedStyle(document.querySelector('.hero-description')).fontSize,errors:[...document.images].filter(x=>!x.complete||!x.naturalWidth).length})));
  await sleep(250);
  check(await p.eval(()=>document.documentElement.scrollWidth===innerWidth),`No overflow at ${width}`);
  check(await p.eval(()=>{const e=document.querySelector('.hero .button');const r=e.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.height>=44}),`CTA reachable at ${width}`);
  check(await p.eval(()=>getComputedStyle(document.querySelector('.hero-note')).display!=='none'),`Copy visible at ${width}`);
  await p.screenshot({path:`${out}/hero-${width}.png`,format:'png'});
 }
 await p.eval(()=>document.documentElement.dataset.theme='dark'); await sleep(250); await p.screenshot({path:`${out}/hero-dark.png`,format:'png'});
 await p.eval(()=>{document.documentElement.dataset.theme='light';document.querySelector('.hero .button').focus()});
 results.push(await p.eval(()=>({focus:getComputedStyle(document.activeElement).outline,focused:document.activeElement.textContent,errors:performance.getEntriesByType('resource').filter(x=>!x.name.startsWith(location.origin)).map(x=>x.name)})));
 await p.screenshot({path:`${out}/hero-focus.png`,format:'png'});

 await p.goto(base+'/#hero'); await sleep(300);
 check(await p.eval(()=>{const h=document.getElementById('hero');const r=h.getBoundingClientRect();return r.top<120&&document.querySelector('.hero-papercut-desktop svg,.hero-papercut-mobile svg')}),'Project anchor scrolls to papercut hero');
 await p.goto(base+'/#print-frame'); await sleep(300);
 check(await p.eval(()=>document.getElementById('print-frame').querySelector('.engraving')),'Gravura section exposes preserved engraving');
 await p.eval(()=>document.getElementById('unfold').focus());
 await p.send('Input.dispatchKeyEvent',{type:'keyDown',text:' ',key:' ',code:'Space',windowsVirtualKeyCode:32});
 await p.send('Input.dispatchKeyEvent',{type:'keyUp',key:' ',code:'Space',windowsVirtualKeyCode:32});
 check(await p.eval(()=>document.getElementById('unfold').getAttribute('aria-pressed')==='true'),'Keyboard toggles gravura unfold');
 await p.goto(base);
 await p.eval(()=>{document.documentElement.style.zoom='2'});
 const overflow=await p.eval(()=>[...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.right>innerWidth+1}).map(e=>e.className).filter(x=>typeof x==='string'));
 results.push({zoomOverflow:overflow});
 check(!overflow.some(x=>/cloud-hero|hero-copy|hero-description|header/.test(x)),'Hero and navigation fit at 200 percent zoom',overflow);
 await p.eval(()=>document.documentElement.style.zoom='');
 check(!p.consoleErrors.length,'No browser exceptions',p.consoleErrors);
 results.push({checks});
 writeFileSync(`${out}/measurements.json`,JSON.stringify(results,null,2)); console.log(JSON.stringify(results,null,2));
} finally {await b.close()}
