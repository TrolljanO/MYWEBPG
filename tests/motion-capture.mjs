// Run with SITE_URL=http://127.0.0.1:4174 CHROME_PATH=/path/to/chrome
// CDP_HELPER=/path/to/cdp.mjs node tests/motion-capture.mjs
import {homedir} from 'node:os';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {mkdirSync,writeFileSync} from 'node:fs';

const {Browser,sleep}=await import(pathToFileURL(process.env.CDP_HELPER || resolve(homedir(),'.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs')));
const base=(process.env.SITE_URL || 'http://127.0.0.1:4174').replace(/\/$/,'');
const out=resolve(process.env.MOTION_CAPTURE_OUT || '/tmp/kittiwake-motion-capture');
const targets=[0,900,1800,2700,3600,4500];
const viewports=[{width:1440,height:900},{width:390,height:844}];
mkdirSync(out,{recursive:true});

const b=await Browser.launch();
const report={base,out,generatedAt:new Date().toISOString(),viewports:[],zoom200:null};

const percentile=(values,fraction)=>{
  if(!values.length) return null;
  const sorted=[...values].sort((a,b)=>a-b);
  return sorted[Math.max(0,Math.ceil(sorted.length*fraction)-1)];
};

const pageState=page=>page.eval(()=>{
  const intersects=(rect)=>rect.bottom>0 && rect.top<innerHeight && rect.right>0 && rect.left<innerWidth;
  const containers=[...document.querySelectorAll('main section,body>footer')];
  const sections=containers.map((section,index)=>{
    const rect=section.getBoundingClientRect();
    if(!intersects(rect)) return null;
    const label=section.id || section.classList[0] || `${section.tagName.toLowerCase()}-${index}`;
    const hidden=[];
    let visibleContentCount=0;
    for(const element of section.querySelectorAll('h1,h2,h3,p,a,button')){
      if(element.closest('[aria-hidden="true"]')) continue;
      const style=getComputedStyle(element);
      const box=element.getBoundingClientRect();
      const isHidden=element.hidden || style.display==='none' || style.visibility==='hidden' || style.visibility==='collapse' || Number(style.opacity)<0.01 || box.width===0 || box.height===0;
      if(isHidden) hidden.push((element.textContent || element.getAttribute('aria-label') || element.tagName).trim().replace(/\s+/g,' ').slice(0,80));
      else if(intersects(box)) visibleContentCount++;
    }
    return {
      section:label,
      top:Math.round(rect.top),
      bottom:Math.round(rect.bottom),
      visibleContentCount,
      hiddenContent:hidden
    };
  }).filter(Boolean);
  return {
    scrollY:Math.round(scrollY*100)/100,
    maxScroll:Math.max(0,document.documentElement.scrollHeight-innerHeight),
    motion:document.documentElement.dataset.motion,
    lenis:document.documentElement.classList.contains('lenis'),
    sections
  };
});

const prepare=async viewport=>{
  const page=await b.newPage(viewport);
  await page.send('Page.addScriptToEvaluateOnNewDocument',{source:'try{localStorage.setItem("gt-motion","active")}catch{}'});
  await page.goto(base);
  await page.eval(async()=>{
    await document.fonts.ready;
    await Promise.all([...document.images].map(image=>image.complete ? Promise.resolve() : new Promise(resolve=>image.addEventListener('load',resolve,{once:true}))));
  });
  return page;
};

try{
  for(const viewport of viewports){
    const page=await prepare(viewport);
    const probe=await page.eval(async()=>{
      window.scrollTo(0,0);
      await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
      const before=scrollY;
      window.scrollTo(0,Math.min(900,document.documentElement.scrollHeight-innerHeight));
      const immediate=scrollY;
      await new Promise(resolve=>setTimeout(resolve,500));
      return {before,immediate,settled:scrollY,target:Math.min(900,document.documentElement.scrollHeight-innerHeight)};
    });
    probe.movesLenis=Math.abs(probe.settled-probe.target)<=5;
    const method=probe.movesLenis ? 'window.scrollTo' : 'Input.dispatchMouseEvent mouseWheel';
    if(probe.movesLenis){
      await page.eval(()=>window.scrollTo(0,0));
      await sleep(350);
    }else if(probe.settled){
      await page.wheel(-probe.settled,{step:180,pauseMs:30});
      await sleep(500);
    }

    const captures=[];
    for(const requestedY of targets){
      const current=await page.eval(()=>scrollY);
      const maxScroll=await page.eval(()=>Math.max(0,document.documentElement.scrollHeight-innerHeight));
      const targetY=Math.min(requestedY,maxScroll);
      if(probe.movesLenis) await page.eval(y=>window.scrollTo(0,y),targetY);
      else await page.wheel(targetY-current,{step:180,pauseMs:30});
      await sleep(650);
      const state=await pageState(page);
      const filename=`motion-${viewport.width}-y${String(requestedY).padStart(4,'0')}.jpg`;
      await page.screenshot({path:resolve(out,filename),format:'jpeg',quality:78});
      captures.push({requestedY,targetY,filename,...state});
    }

    if(probe.movesLenis) await page.eval(()=>window.scrollTo(0,0));
    else await page.wheel(-await page.eval(()=>scrollY),{step:180,pauseMs:25});
    await sleep(400);
    await page.eval(()=>{
      const sample={deltas:[],done:false};
      window.__motionFrameSample=sample;
      let last;
      const until=performance.now()+2200;
      const tick=now=>{
        if(last!==undefined) sample.deltas.push(now-last);
        last=now;
        if(now<until) requestAnimationFrame(tick);
        else sample.done=true;
      };
      requestAnimationFrame(tick);
    });
    await page.wheel(4500,{step:120,pauseMs:16});
    await sleep(1700);
    const frameDeltas=await page.eval(()=>window.__motionFrameSample?.deltas || []);
    const p95=percentile(frameDeltas,0.95);
    const frames={
      count:frameDeltas.length,
      p95Ms:p95===null ? null : Math.round(p95*100)/100,
      maxMs:frameDeltas.length ? Math.round(Math.max(...frameDeltas)*100)/100 : null
    };

    const lifecycle={before:await page.eval(()=>({hidden:document.hidden,focused:document.hasFocus(),motion:document.documentElement.dataset.motion,lenis:document.documentElement.classList.contains('lenis')}))};
    await page.send('Emulation.setFocusEmulationEnabled',{enabled:false});
    await page.eval(()=>window.dispatchEvent(new Event('blur')));
    await sleep(100);
    lifecycle.blur=await page.eval(()=>({hidden:document.hidden,focused:document.hasFocus(),motion:document.documentElement.dataset.motion,lenis:document.documentElement.classList.contains('lenis')}));
    try{
      await page.send('Emulation.setPageVisibilityOverride',{hidden:true});
      await sleep(100);
      lifecycle.hidden=await page.eval(()=>({hidden:document.hidden,focused:document.hasFocus(),motion:document.documentElement.dataset.motion,lenis:document.documentElement.classList.contains('lenis')}));
      await page.send('Emulation.setPageVisibilityOverride',{hidden:false});
    }catch(error){
      lifecycle.hidden={measured:false,error:error.message};
    }

    report.viewports.push({viewport,scrollProbe:probe,method,captures,frames,lifecycle,consoleErrors:page.consoleErrors});
    await page.close();
  }

  const zoom=await prepare({width:1440,height:1400});
  await zoom.eval(()=>{document.documentElement.style.zoom='2';window.scrollTo(0,0)});
  await sleep(400);
  const metrics=await zoom.eval(()=>{
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
      if(cutIndex!==-1 && (textIndex===-1 || cutIndex<textIndex)) covered.push(element.textContent.trim().replace(/\s+/g,' ').slice(0,80));
    }
    return {innerWidth,scrollWidth:document.documentElement.scrollWidth,overflowPx:document.documentElement.scrollWidth-innerWidth,covered};
  });
  const zoomFilename='motion-zoom-200.jpg';
  await zoom.screenshot({path:resolve(out,zoomFilename),format:'jpeg',quality:78});
  report.zoom200={viewport:{width:1440,height:1400},filename:zoomFilename,...metrics,consoleErrors:zoom.consoleErrors};
  await zoom.close();

  writeFileSync(resolve(out,'motion-capture.json'),JSON.stringify(report,null,2));
  console.log(JSON.stringify(report,null,2));
}finally{
  await b.close();
}
