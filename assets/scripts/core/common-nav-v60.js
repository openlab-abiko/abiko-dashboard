/* Same global menu and back-to-top behavior as the other pages. Used on
   standalone article and finance pages, which do not load commons-content.js. */
(()=>{'use strict';
 function init(){
  const btn=document.getElementById('menuToggle'),menu=document.getElementById('floatingMenu');
  if(btn&&menu){
   const close=()=>{menu.hidden=true;btn.setAttribute('aria-expanded','false');btn.setAttribute('aria-label','メニューを開く')};
   btn.addEventListener('click',()=>{const isOpening=menu.hidden;menu.hidden=!isOpening;btn.setAttribute('aria-expanded',String(isOpening));btn.setAttribute('aria-label',isOpening?'メニューを閉じる':'メニューを開く')});
   document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!menu.hidden){close();btn.focus()}});
   document.addEventListener('pointerdown',e=>{if(!menu.hidden&&!menu.contains(e.target)&&!btn.contains(e.target))close()});
   menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
  }
  const header=document.getElementById('globalHeader');
  if(header){const measure=()=>document.documentElement.style.setProperty('--abiko-header-bottom',Math.round(header.getBoundingClientRect().bottom)+'px');measure();window.addEventListener('resize',measure,{passive:true});}
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
