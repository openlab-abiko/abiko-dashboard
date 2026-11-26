/* Newspaper-style domestic / international list on every story page. */
(()=>{'use strict';function init(){const rail=document.querySelector('.press-article-rail');if(!rail)return;const tabs=[...rail.querySelectorAll('[data-v64-region]')],items=[...rail.querySelectorAll('.v64-rail-list > li')],count=rail.querySelector('.v64-rail-count');
 function show(which){tabs.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.v64Region===which)));let n=0;items.forEach(li=>{const on=li.dataset.region===which;li.hidden=!on;if(on)n++});if(count)count.textContent=`${which==='domestic'?'国内':'海外'}の事例 ${n}件`}
 tabs.forEach(b=>b.addEventListener('click',()=>show(b.dataset.v64Region)));show('domestic');}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();})();
