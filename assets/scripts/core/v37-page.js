(()=>{'use strict';
  const view=document.body?.dataset.view;
  const routes={projects:'projects.html',budget:'budget.html',compare:'compare.html',issues:'issues.html'};
  function init(){
    if(Object.hasOwn(routes,view)){
      for(const sec of document.querySelectorAll('#featurePanels > section')){
        const active=sec.id===view;
        sec.setAttribute('aria-hidden',String(!active));
      }
    }
    // Always redirect links to editorial section roots to their own pages,
    // including when such links appear in the home-page footer or old content.
    document.querySelectorAll('a[href^="#"]').forEach(a=>{
      const id=a.getAttribute('href').slice(1);
      if(routes[id]&&id!==view)a.setAttribute('href',routes[id]);
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
  else init();
  document.addEventListener('click',e=>{
    const a=e.target.closest('a[href^="#"]');if(!a)return;
    const id=a.getAttribute('href').slice(1);
    if(routes[id]&&id!==view){e.preventDefault();e.stopImmediatePropagation();window.location.href=routes[id];}
  },true);
})();
