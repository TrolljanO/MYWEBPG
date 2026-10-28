// Run with SITE_URL=http://localhost:4173 CHROME_PATH=/path/to/chrome node tests/browser-check.mjs
// CDP_HELPER may point to design-taste-frontend/scripts/lib/cdp.mjs.
import {homedir} from 'node:os';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {mkdirSync,writeFileSync} from 'node:fs';

const {Browser,sleep}=await import(pathToFileURL(process.env.CDP_HELPER || resolve(homedir(),'.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs')));
const base=(process.env.SITE_URL || 'http://localhost:4173').replace(/\/$/,'');
const out=resolve(process.env.BROWSER_CHECK_OUT || '/tmp/kittiwake-browser-check');
mkdirSync(out,{recursive:true});

const b=await Browser.launch();
const checks=[];
const assert=(condition,name,details)=>{
  checks.push({name,pass:!!condition,details});
  if(!condition) console.error('FAIL',name,details);
};

const zoomMetrics=page=>page.eval(()=>{
  const covered=[];
  const text=[...document.querySelectorAll('.wrap h1,.wrap h2,.wrap h3,.wrap p,.wrap a,.wrap button')];
  for(const element of text){
    const rect=element.getBoundingClientRect();
    if(rect.width<=0 || rect.height<=0) continue;
    const x=Math.min(innerWidth-1,Math.max(0,rect.left+rect.width/2));
    const y=Math.min(innerHeight-1,Math.max(0,rect.top+rect.height/2));
    const stack=document.elementsFromPoint(x,y);
    const textIndex=stack.findIndex(item=>item===element || element.contains(item));
    const cutIndex=stack.findIndex(item=>item.matches?.('.cut'));
    if(cutIndex!==-1 && (textIndex===-1 || cutIndex<textIndex)) covered.push(element.textContent.trim().slice(0,60));
  }
  return {overflow:document.documentElement.scrollWidth>innerWidth,covered};
});

try{
  const p=await b.newPage();
  await p.goto(base);
  assert(await p.eval(()=>document.querySelector('h1').innerText.includes('Guilherme')),'Home renders');
  const cuts=await p.eval(()=>({count:document.querySelectorAll('img.cut').length,broken:[...document.querySelectorAll('img.cut')].filter(image=>image.loading!=='lazy' && image.naturalWidth<=0).map(image=>image.src)}));
  assert(cuts.count===34 && cuts.broken.length===0,'Home loads 34 PNG cuts',cuts);
  assert(await p.eval(()=>document.documentElement.classList.contains('lenis')),'Motion load starts Lenis');

  await p.eval(()=>document.querySelector('[data-filter="design"]').click());
  assert(await p.eval(()=>document.querySelectorAll('.project:not([hidden])').length===1 && document.querySelector('.project:not([hidden])').dataset.category==='design'),'Project visual filter');
  await p.eval(()=>document.querySelector('[data-filter="ai"]').click());
  assert(await p.eval(()=>document.querySelectorAll('.project:not([hidden])').length===2),'Project AI filter');
  await p.eval(()=>document.querySelector('[data-filter="all"]').click());
  await p.eval(()=>document.querySelector('.theme-toggle').click());
  assert(await p.eval(()=>document.documentElement.dataset.theme==='dark'),'Dark theme toggle');
  await p.goto(base);
  assert(await p.eval(()=>document.documentElement.dataset.theme==='dark'),'Theme persists on reload');
  await p.screenshot({path:out+'/dark-desktop.png'});
  await p.eval(()=>document.querySelector('.theme-toggle').click());

  for(const width of [360,390,768,1440]){
    await p.setViewport({width,height:900});
    await p.goto(base);
    const metrics=await p.eval(()=>({w:innerWidth,scroll:document.documentElement.scrollWidth,broken:[...document.images].filter(image=>image.complete && image.naturalWidth===0).map(image=>image.src)}));
    assert(metrics.scroll<=width,'No horizontal overflow '+width,metrics);
    assert(!metrics.broken.length,'Images load '+width,metrics.broken);
    await p.screenshot({path:out+'/home-'+width+'.png',fullPage:true});
  }

  const paths=['curriculo.html','projetos/sdd-buddy.html','projetos/micro-rag.html','privacidade.html','arquivo/index.html','404.html'];
  for(const path of paths){
    await p.goto(base+'/'+path);
    const reading=await p.eval(()=>({title:document.querySelector('h1')?.innerText,overflow:document.documentElement.scrollWidth>innerWidth}));
    assert(!!reading.title && !reading.overflow,'Reading page '+path,reading);
  }
  await p.goto(base+'/curriculo.html');
  await p.send('Emulation.setEmulatedMedia',{media:'print'});
  assert(await p.eval(()=>getComputedStyle(document.querySelector('.header')).display==='none' && getComputedStyle(document.getElementById('print-cv')).display==='none'),'Print hides controls');
  await p.send('Emulation.setEmulatedMedia',{media:''});

  const reduced=await b.newPage({reducedMotion:true,width:390,height:844});
  await reduced.goto(base);
  assert(await reduced.eval(()=>!document.documentElement.classList.contains('lenis')),'Reduced motion skips Lenis');

  const plain=await b.newPage({width:390,height:844});
  await plain.send('Emulation.setScriptExecutionDisabled',{value:true});
  await plain.goto(base);
  assert(await plain.eval(()=>document.querySelectorAll('.project').length===3 && document.querySelector('h1').getBoundingClientRect().height>0),'Content available without JS');

  const blocked=await b.newPage();
  await blocked.send('Page.addScriptToEvaluateOnNewDocument',{source:'Object.defineProperty(window,"localStorage",{get(){throw new Error("blocked")}})'});
  await blocked.goto(base);
  await blocked.eval(()=>document.querySelector('.theme-toggle').click());
  assert(await blocked.eval(()=>document.documentElement.dataset.theme==='dark'),'Theme works without storage');

  await p.goto(base);
  await p.eval(()=>{document.querySelector('.theme-toggle').click();document.querySelector('.about-copy a').focus()});
  assert(await p.eval(()=>getComputedStyle(document.querySelector('.about-copy a')).outlineColor!==getComputedStyle(document.querySelector('.about-section')).backgroundColor),'About focus contrasts in reversed section');
  await p.goto(base+'/curriculo.html');
  await p.send('Emulation.setEmulatedMedia',{media:'print'});
  assert(await p.eval(()=>getComputedStyle(document.querySelector('.reading p')).color==='rgb(0, 0, 0)' && document.querySelector('h1').innerText.includes('Guilherme')),'Dark-theme CV print label contrast');
  assert(await p.eval(async()=>{const text=await(await fetch('/404.html')).text();return text.includes('href="/index.css"') && text.includes('href="/"')}),'404 root asset and recovery paths');
  await p.send('Emulation.setEmulatedMedia',{media:''});

  await p.goto(base+'/arquivo/index.html');
  assert(await p.eval(()=>document.querySelector('h1').innerText==='Arquivo' && !document.querySelector('.reading article')),'Archive honest empty state');
  assert(await p.eval(()=>!document.getElementById('motion-toggle').hidden && document.documentElement.classList.contains('lenis')),'Reading pages run Lenis and expose the motion control');
  const requests=await p.eval(()=>performance.getEntriesByType('resource').filter(resource=>!resource.name.startsWith(location.origin)).map(resource=>resource.name));
  assert(requests.length===0,'No third-party runtime resources',requests);

  const paused=await b.newPage({width:1440,height:900});
  await paused.send('Page.addScriptToEvaluateOnNewDocument',{source:'try{localStorage.setItem("gt-motion","paused")}catch{}'});
  await paused.goto(base);
  const pausedBefore=await paused.eval(()=>[...document.querySelectorAll('.cut')].map(element=>getComputedStyle(element).transform));
  await paused.eval(()=>window.scrollTo(0,Math.min(1800,document.documentElement.scrollHeight-innerHeight)));
  await sleep(700);
  const pausedState=await paused.eval(()=>({stopped:!document.documentElement.classList.contains('lenis'),transforms:[...document.querySelectorAll('.cut')].map(element=>getComputedStyle(element).transform)}));
  assert(pausedState.stopped && JSON.stringify(pausedState.transforms)===JSON.stringify(pausedBefore),'focus-1 paused storage tears down Lenis and cut scrub',pausedState);

  const changedReduced=await b.newPage({width:1440,height:900});
  await changedReduced.goto(base);
  await changedReduced.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await sleep(250);
  const reducedBefore=await changedReduced.eval(()=>[...document.querySelectorAll('.cut')].map(element=>getComputedStyle(element).transform));
  await changedReduced.eval(()=>window.scrollTo(0,Math.min(1800,document.documentElement.scrollHeight-innerHeight)));
  await sleep(700);
  const reducedState=await changedReduced.eval(()=>({lenis:document.documentElement.classList.contains('lenis'),transforms:[...document.querySelectorAll('.cut')].map(element=>getComputedStyle(element).transform)}));
  assert(!reducedState.lenis && JSON.stringify(reducedState.transforms)===JSON.stringify(reducedBefore),'focus-2 live reduced motion tears down Lenis and cut scrub',reducedState);

  const anchors=await b.newPage({width:1440,height:900});
  await anchors.goto(base+'/curriculo.html');
  await anchors.eval(()=>document.querySelector('a[href="/#projetos"]').click());
  await sleep(2200);
  const fromReading=await anchors.eval(()=>({hash:location.hash,top:document.getElementById('projetos')?.getBoundingClientRect().top,scrollY}));
  await sleep(500);
  const fromReadingStable=await anchors.eval(()=>scrollY);
  await anchors.goto(base);
  await anchors.eval(()=>document.querySelector('.hero .button[href="#projetos"]').click());
  await sleep(2200);
  const inPage=await anchors.eval(()=>({hash:location.hash,top:document.getElementById('projetos')?.getBoundingClientRect().top,scrollY}));
  await sleep(500);
  const inPageStable=await anchors.eval(()=>scrollY);
  const anchorsOk=fromReading.hash==='#projetos' && Math.abs(fromReading.top-32)<=2 && Math.abs(fromReadingStable-fromReading.scrollY)<=2 && inPage.hash==='#projetos' && Math.abs(inPage.top-32)<=2 && Math.abs(inPageStable-inPage.scrollY)<=2;
  assert(anchorsOk,'focus-3 cross-page and in-page anchors settle once',{fromReading,fromReadingStable,inPage,inPageStable});

  const zoom=await b.newPage({width:1440,height:1400});
  await zoom.goto(base);
  await zoom.eval(()=>{document.documentElement.style.zoom='2';window.scrollTo(0,0)});
  await sleep(300);
  const zoomState=await zoomMetrics(zoom);
  assert(!zoomState.overflow && zoomState.covered.length===0,'focus-5 200 percent zoom keeps cuts clear of text wraps',zoomState);

  const consoleErrors={regular:p.consoleErrors,reduced:reduced.consoleErrors,plain:plain.consoleErrors,blocked:blocked.consoleErrors,paused:paused.consoleErrors,changedReduced:changedReduced.consoleErrors,anchors:anchors.consoleErrors,zoom:zoom.consoleErrors};
  assert(Object.values(consoleErrors).every(errors=>errors.length===0),'No runtime exceptions',consoleErrors);

  writeFileSync(out+'/checks.json',JSON.stringify(checks,null,2));
  console.log(JSON.stringify({passed:checks.filter(check=>check.pass).length,total:checks.length,failures:checks.filter(check=>!check.pass)},null,2));
}finally{
  await b.close();
}

if(checks.some(check=>!check.pass)) process.exitCode=1;
