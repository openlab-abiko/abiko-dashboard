/* v0.50: Only page navigation and local project navigation are enhanced here.
   Original filter buttons remain the source of truth; no project data is copied. */
(()=>{'use strict';
  const $=(selector,root=document)=>root.querySelector(selector);
  const all=(selector,root=document)=>[...root.querySelectorAll(selector)];
  function issueMethod(){
    if(document.body.dataset.view!=='issues')return;
    const method=$('#issues .civic-method');
    if(!method)return;
    const move=()=>{
      const switcher=$('#issues .issue-switcher');
      if(switcher&&method.nextElementSibling!==switcher) switcher.before(method);
    };
    move();
    if(!$('#issues .issue-switcher')){
      const observer=new MutationObserver(()=>{if($('#issues .issue-switcher')){move();observer.disconnect()}});
      observer.observe($('#issues'),{subtree:true,childList:true});
    }
  }
  function projectSwitcher(){
    if(document.body.dataset.view!=='projects')return;
    const discovery=$('#projects .project-discovery');
    const goals=$('#topicFilters'),regions=$('#projectRegionFilters');
    if(!discovery||!goals||!regions)return;
    const root=document.createElement('div');root.className='issue-switcher project-switcher';
    root.setAttribute('aria-label','重点事業を分野や地域で切り替える');
    root.innerHTML=`<button class="issue-step issue-step-prev" type="button" data-step="-1"><span class="issue-step-arrow" aria-hidden="true">←</span><span class="issue-step-copy"><small>前の項目</small><b>—</b></span></button><button class="issue-current" type="button" aria-controls="project-switcher-options" aria-expanded="false"><b class="issue-current-number">基本目標</b><span class="issue-current-title" aria-live="polite">すべて</span><span class="issue-chevron" aria-hidden="true">⌄</span></button><button class="issue-step issue-step-next" type="button" data-step="1"><span class="issue-step-copy"><small>次の項目</small><b>—</b></span><span class="issue-step-arrow" aria-hidden="true">→</span></button><div class="issue-switcher-options" id="project-switcher-options" hidden role="group" aria-label="絞り込み一覧"></div>`;
    discovery.after(root);
    const current=$('.issue-current',root),options=$('.issue-switcher-options',root);
    const mode=()=>$('#projects [data-project-mode][aria-pressed="true"]')?.dataset.projectMode||'goal';
    const buttons=()=>all(mode()==='region'?'#projectRegionFilters [data-project-region]':'#topicFilters [data-topic]');
    const label=b=>b?.querySelector('.topic-name')?.textContent.trim()||b?.textContent.replace(/\s*\d+\s*件\s*$/,'').trim()||'';
    const selected=()=>Math.max(0,buttons().findIndex(b=>b.classList.contains('active')||b.getAttribute('aria-pressed')==='true'));
    const close=()=>{options.hidden=true;current.setAttribute('aria-expanded','false');root.classList.remove('open')};
    const sync=()=>{
      const b=buttons();if(!b.length)return;
      const i=selected(),name=mode()==='goal'?'基本目標':'地域';
      $('.issue-current-number',root).textContent=name;
      $('.issue-current-title',root).textContent=label(b[i]);
      for(const [step,idx] of [[-1,i-1],[1,i+1]]){
        const btn=$(`.issue-step[data-step="${step}"]`,root);
        btn.disabled=idx<0||idx>=b.length;
        btn.querySelector('b').textContent=btn.disabled?'—':label(b[idx]);
        btn.setAttribute('aria-label',btn.disabled?'これ以上の項目はありません':`${step<0?'前':'次'}の${name}へ：${label(b[idx])}`);
      }
      options.replaceChildren(...b.map((button,index)=>{
        const option=document.createElement('button');option.type='button';option.dataset.target=String(index);
        const n=document.createElement('span');n.textContent=String(index+1).padStart(2,'0');option.append(n,document.createTextNode(label(button)));
        if(index===i)option.setAttribute('aria-current','true');
        return option;
      }));
    };
    const jump=i=>{
      const b=buttons();if(!b.length)return;
      const idx=Math.max(0,Math.min(b.length-1,i));
      b[idx].click();sync();close();
      const target=$('#projectGrid');
      if(target){
        const bottom=$('#globalHeader')?.getBoundingClientRect().bottom||0;
        const y=target.getBoundingClientRect().top+window.scrollY-bottom-94;
        window.scrollTo({top:Math.max(0,y),behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
      }
    };
    current.addEventListener('click',()=>{
      const expand=options.hidden;sync();options.hidden=!expand;root.classList.toggle('open',expand);current.setAttribute('aria-expanded',String(expand));
    });
    root.querySelectorAll('[data-step]').forEach(btn=>btn.addEventListener('click',()=>jump(selected()+Number(btn.dataset.step))));
    options.addEventListener('click',event=>{
      const target=event.target.closest('[data-target]');
      if(target)jump(Number(target.dataset.target));
    });
    document.addEventListener('click',event=>{if(!root.contains(event.target))close()});
    document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!options.hidden){close();current.focus()}});
    [goals,regions,$('#projects .project-search-mode')].forEach(el=>{
      el?.addEventListener('click',()=>queueMicrotask(sync));
    });
    // Filters and their selected state may be replaced, or updated in place.
    // Observe both paths so the floating control always follows the source menu.
    const observer=new MutationObserver(sync);
    const watch={childList:true,subtree:true,attributes:true,attributeFilter:['aria-pressed','class']};
    observer.observe(goals,watch);observer.observe(regions,watch);
    const modeControls=$('#projects .project-search-mode');
    if(modeControls)observer.observe(modeControls,watch);
    sync();
  }
  function init(){issueMethod();projectSwitcher()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
