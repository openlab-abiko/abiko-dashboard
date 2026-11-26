/* v64 | Open the exact card, issue or visualization linked by the homepage. */
(()=>{'use strict';
const params=new URLSearchParams(location.search);
let done=false;
function scrollTarget(target){if(!target)return;requestAnimationFrame(()=>requestAnimationFrame(()=>{const h=document.getElementById('globalHeader');const bottom=h?h.getBoundingClientRect().bottom:90;const toc=document.getElementById('tocMobile');const tocHeight=toc&&getComputedStyle(toc).display!=='none'?(toc.querySelector('summary')?.getBoundingClientRect().height||50):0;const y=target.getBoundingClientRect().top+window.scrollY-Math.max(bottom+tocHeight+22,112);window.scrollTo({top:Math.max(0,y),behavior:'instant'});}));}
function highlight(target){if(!target)return;target.classList.add('v64-targeted');scrollTarget(target);}
function cleanupMenu(){
 const menu=document.getElementById('floatingMenu'),btn=document.getElementById('menuToggle');
 const other=document.getElementById('globalMenu'),otherButton=document.getElementById('globalMenuToggle');if(other){other.hidden=true;if(otherButton)otherButton.setAttribute('aria-expanded','false')} 
 if(menu){menu.hidden=true;if(btn){btn.setAttribute('aria-expanded','false');btn.setAttribute('aria-label','メニューを開く')}}

}
function openProject(){const id=Number(params.get('project'));if(!Number.isInteger(id)||id<1)return true;
 const project=window.DATA?.projects?.find(p=>p.id===id);const filters=document.getElementById('topicFilters'),grid=document.getElementById('projectGrid');if(!project||!filters||!grid)return false;
 const btn=[...filters.querySelectorAll('[data-topic]')].find(b=>b.dataset.topic===project.topic);
 if(btn&&btn.getAttribute('aria-pressed')!=='true')btn.click();
 const find=()=>[...grid.querySelectorAll('.ref-project-card')].find(c=>c.querySelector('h3')?.textContent.trim()===project.title);
 if(!find()){const show=document.getElementById('showMore');if(show&&!show.parentElement.hidden)show.click()}
 const card=find();if(!card)return false;
 card.id='v64-project-'+id;highlight(card);return true;
}
function openIssue(){const id=Number(params.get('issue'));if(!Number.isInteger(id)||id<1)return true;
 const btn=document.querySelector(`#issues .issue-pick[data-issue="${id}"]`),target=document.getElementById('issue-'+String(id).padStart(2,'0'));
 if(!btn||!target)return false;
 btn.click();const shown=target.getAttribute('aria-hidden')!=='true'&&getComputedStyle(target).display!=='none';if(!shown)return false;
 highlight(target);return true;
}
function openChart(){const id=params.get('chart');if(!id)return true;
 const card=[...document.querySelectorAll('#chartGrid .data-card')].find(c=>c.dataset.card===id);if(!card)return false;
 highlight(card);return true;
}
function openBudget(){const id=location.hash.replace('#','');if(!id)return true;const section=document.getElementById(id);if(!section)return true;scrollTarget(section);return true;}
function attempt(){if(done)return;const view=document.body?.dataset.view;cleanupMenu();
 let ok=true;
 if(view==='projects')ok=openProject();else if(view==='issues')ok=openIssue();else if(view==='dashboard')ok=openChart();else if(document.body.classList.contains('v63-finance-page'))ok=openBudget();
 if(ok)done=true;
}
function init(){attempt();if(!done){let remaining=12;function retry(){if(done||remaining--<=0)return;attempt();if(!done)requestAnimationFrame(retry)}requestAnimationFrame(retry)}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
