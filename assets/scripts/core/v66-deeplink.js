/* Deep destinations: open the actual project detail / chart detail, not just the listing card. */
(()=>{'use strict';
const u=new URLSearchParams(location.search);if(u.get('detail')!=='1')return;
const project=Number(u.get('project'));const chart=u.get('chart');let stopped=false,attempts=0;
function moveIntoView(el){if(!el)return;const h=document.getElementById('globalHeader');const offset=Math.max(110,(h?.getBoundingClientRect().height||70)+40);window.scrollTo({top:Math.max(0,el.getBoundingClientRect().top+window.scrollY-offset),behavior:'instant'})}
function activate(){if(stopped||attempts++>50)return;
 if(Number.isInteger(project)&&project>=1&&document.body.dataset.view==='projects'){
 const target=document.getElementById('v64-project-'+project)||[...document.querySelectorAll('.ref-project-card')].find(c=>c.querySelector('.open-proj')?.dataset.project===String(project));
 const btn=target?.querySelector(`.open-proj[data-project="${project}"]`);if(btn){moveIntoView(target);btn.click();stopped=true;return}
 }
 if(chart&&document.body.dataset.view==='dashboard'){
 const card=[...document.querySelectorAll('#chartGrid .data-card')].find(c=>c.dataset.card===chart);const btn=card?.querySelector(`[data-expand="${CSS.escape(chart)}"]`);
 if(btn){moveIntoView(card);btn.click();stopped=true;return}
 }
 if(!stopped)requestAnimationFrame(activate)
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>requestAnimationFrame(activate));else requestAnimationFrame(activate);
})();
