// Run with the same CHROME_PATH / CDP_HELPER environment as browser-check.mjs.
import {homedir} from 'node:os';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {writeFileSync,mkdirSync} from 'node:fs';

const {Browser,sleep}=await import(pathToFileURL(process.env.CDP_HELPER || resolve(homedir(),'.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs')));
const base=process.env.SITE_URL || 'http://localhost:4173';
const out=resolve(process.env.HERO_CHECK_OUT || '/tmp/kittiwake-hero-check');
mkdirSync(out,{recursive:true});
const b=await Browser.launch();
const checks=[];
const check=(ok,name,detail)=>{checks.push({pass:!!ok,name,detail});if(!ok) process.exitCode=1};

try{
  const p=await b.newPage();
  const results=[];
  for(const width of [375,768,1440]){
    await p.setViewport({width,height:width===375?900:1000});
    await p.goto(base);
    await p.eval(async()=>{document.documentElement.dataset.theme='light';await document.fonts.ready;window.scrollTo(0,0)});
    results.push(await p.eval(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,title:document.querySelector('h1').innerText,hero:document.querySelector('.hero').getBoundingClientRect().toJSON(),font:getComputedStyle(document.querySelector('.hero-description')).fontFamily,bodySize:getComputedStyle(document.querySelector('.hero-description')).fontSize,errors:[...document.images].filter(image=>!image.complete || !image.naturalWidth).length})));
    await sleep(250);
    check(await p.eval(()=>document.documentElement.scrollWidth===innerWidth),`No overflow at ${width}`);
    check(await p.eval(()=>{const element=document.querySelector('.hero .button');const rect=element.getBoundingClientRect();return rect.left>=0 && rect.right<=innerWidth && rect.height>=44}),`CTA reachable at ${width}`);
    check(await p.eval(()=>getComputedStyle(document.querySelector('.hero-note')).display!=='none'),`Copy visible at ${width}`);
    await p.screenshot({path:`${out}/hero-${width}.png`,format:'png'});
  }
  await p.eval(()=>document.documentElement.dataset.theme='dark');
  await sleep(250);
  await p.screenshot({path:`${out}/hero-dark.png`,format:'png'});
  await p.eval(()=>{document.documentElement.dataset.theme='light';document.querySelector('.hero .button').focus()});
  results.push(await p.eval(()=>({focus:getComputedStyle(document.activeElement).outline,focused:document.activeElement.textContent,errors:performance.getEntriesByType('resource').filter(resource=>!resource.name.startsWith(location.origin)).map(resource=>resource.name)})));
  await p.screenshot({path:`${out}/hero-focus.png`,format:'png'});

  await p.goto(base+'/#hero');
  await sleep(300);
  check(await p.eval(()=>{const hero=document.getElementById('hero');const rect=hero.getBoundingClientRect();return rect.top<120 && document.querySelectorAll('img.cut').length===17}),'Project anchor scrolls to PNG cut hero');
  await p.goto(base);
  const loadedCuts=await p.eval(()=>({count:document.querySelectorAll('img.cut').length,broken:[...document.querySelectorAll('img.cut')].filter(image=>image.naturalWidth<=0).length}));
  check(loadedCuts.count===17 && loadedCuts.broken===0,'PNG cut composition loads',loadedCuts);
  await p.eval(()=>{document.documentElement.style.zoom='2'});
  const overflow=await p.eval(()=>[...document.querySelectorAll('body *')].filter(element=>{const rect=element.getBoundingClientRect();return rect.width>0 && rect.right>innerWidth+1}).map(element=>element.className).filter(name=>typeof name==='string'));
  results.push({zoomOverflow:overflow});
  check(!overflow.some(name=>/hero-copy|hero-description|header/.test(name)),'Hero and navigation fit at 200 percent zoom',overflow);
  await p.eval(()=>{document.documentElement.style.zoom=''});
  check(!p.consoleErrors.length,'No browser exceptions',p.consoleErrors);
  results.push({checks});
  writeFileSync(`${out}/measurements.json`,JSON.stringify(results,null,2));
  console.log(JSON.stringify(results,null,2));
}finally{
  await b.close();
}
