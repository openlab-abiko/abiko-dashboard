(()=>{
  const ready=fn=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn):fn();
  ready(()=>{
    const top=document.getElementById('v39BackToTop');
    if(!top)return;
    const update=()=>{
      const visible=window.scrollY>360;
      top.classList.toggle('v39-visible',visible);
      top.disabled=!visible;
      top.tabIndex=visible?0:-1;
      top.setAttribute('aria-hidden',String(!visible));
    };
    top.addEventListener('click',()=>window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}));
    window.addEventListener('scroll',update,{passive:true});
    update();
  });
})();
