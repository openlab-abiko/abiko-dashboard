/* v78: Position deep links beneath the sticky header after destination UI has settled. */
(()=>{'use strict';
const params=new URLSearchParams(location.search), view=document.body.dataset.view||'';
const fromSummary=params.has('project')||params.has('chart')||params.has('issue')||location.hash.length>1;
const header=()=>document.getElementById('globalHeader');
function gap(){const h=header();return Math.ceil(Math.max(0,h?.getBoundingClientRect().bottom||0))+20;}
function align(el){if(!el||!el.isConnected)return;const rect=el.getBoundingClientRect();if(!rect.height||getComputedStyle(el).display==='none')return;
 const position=Math.max(0,window.scrollY+rect.top-gap());
 if(Math.abs(window.scrollY-position)>7)window.scrollTo({top:position,behavior:'instant'});
}
function destination(){
 if(view==='projects'&&params.has('project')){
  const id=Number(params.get('project'));
  return document.getElementById('v64-project-'+id)||[...document.querySelectorAll('.ref-project-card')].find(c=>c.querySelector(`.open-proj[data-project="${id}"]`));
 }
 if(view==='issues'&&params.has('issue')){
  const id=Number(params.get('issue'));
  return document.getElementById('issue-'+String(id).padStart(2,'0'))||document.getElementById('issueContent');
 }
 if(view==='dashboard'&&params.has('chart')){
  const id=params.get('chart');return [...document.querySelectorAll('.data-card')].find(c=>c.dataset.card===id);
 }
 const id=decodeURIComponent(location.hash.slice(1));
 return id?document.getElementById(id):null;
}
function shouldSkip(){
 const dialog=document.querySelector('dialog[open]');
 return dialog!==null; // A detail dialog takes precedence over page scrolling.
}
function position(){if(shouldSkip())return;const target=destination();if(target)align(target)}
function delayed(){position();requestAnimationFrame(()=>requestAnimationFrame(position));}
// Wait for destination sections to be rendered (budget, projects and data charts load asynchronously).
const init=()=>{
 const nav=document.querySelector('#globalHeader .v37-mainnav');
 const active=nav?.querySelector('[aria-current="page"], .v37-selected');
 if(nav&&active&&matchMedia('(max-width:740px)').matches){
  const center=active.offsetLeft+active.offsetWidth/2-nav.clientWidth/2;
  nav.scrollLeft=Math.max(0,center);
 }
 if(fromSummary){delayed();setTimeout(delayed,130);setTimeout(delayed,450);}
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
if(fromSummary)window.addEventListener('load',()=>setTimeout(position,60),{once:true});
})();
