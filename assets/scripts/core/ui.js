/* Shared floating-nav geometry. The topic switcher remains in the article and
   only visually joins the global nav once scrolling brings their edges together. */
(()=>{'use strict';
function init(){
 const header=document.getElementById('globalHeader');
 const view=document.body.dataset.view;
 const intro=(view&&document.getElementById(view))?.querySelector('.section-head.v38-page-intro')||null;
 if(!header)return;
 const selector='#issues .issue-switcher, #compare .compare-switcher, #projects .project-switcher';
 let ticking=false;
 const setLayout=()=>{
  ticking=false;
  const headerRect=header.getBoundingClientRect();
  const headerBottom=Math.round(headerRect.bottom*10)/10;
  document.documentElement.style.setProperty('--abiko-header-bottom',`${headerBottom}px`);
  const bars=[...document.querySelectorAll(selector)];
  let connected=false;
  for(const bar of bars){
   const parent=bar.parentElement;
   const parentRect=parent.getBoundingClientRect();
   const parentPad=parseFloat(getComputedStyle(parent).paddingLeft)||0;
   const marginLeft=headerRect.left-(parentRect.left+parentPad);
   bar.style.setProperty('--abiko-switcher-width',`${headerRect.width}px`);
   bar.style.setProperty('--abiko-switcher-left',`${marginLeft}px`);
   const barRect=bar.getBoundingClientRect();
   const docked=window.scrollY>24&&Math.abs(barRect.top-headerBottom)<=2.5;
   bar.classList.toggle('is-docked',docked);
   connected=connected||docked;
  }
  header.classList.toggle('is-switcher-docked',connected);
  if(intro){
   const rect=intro.getBoundingClientRect();
   const y=rect.top+window.scrollY;
   intro.style.setProperty('--abiko-intro-top',Math.max(0,Math.round(y))+'px');
   const shift=(window.innerWidth-(rect.left*2+rect.width))/2;
   intro.style.setProperty('--abiko-intro-shift',shift+'px');
  }
 };
 const schedule=()=>{if(ticking)return;ticking=true;requestAnimationFrame(setLayout)};
 schedule();
 window.addEventListener('scroll',schedule,{passive:true});
 window.addEventListener('resize',schedule,{passive:true});
 if(window.ResizeObserver)new ResizeObserver(schedule).observe(header);
 // Local controls are injected after the shared article markup. Observe until
 // they exist, then stop watching unrelated DOM mutations.
 if((view==='issues'||view==='compare'||view==='projects')&&!document.querySelector(selector)){
  const watcher=new MutationObserver(()=>{if(document.querySelector(selector)){watcher.disconnect();schedule()}});
  watcher.observe(document.body,{childList:true,subtree:true});
 }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
