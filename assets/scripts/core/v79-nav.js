/* v79: One accessible full-screen navigation, opened only by the bottom-right button.
   Top-level destinations and their contextual contents share a consistent layout. */
(()=>{'use strict';
const onReady=fn=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn,{once:true}):fn();
const $=(selector,context=document)=>context.querySelector(selector);
const $$=(selector,context=document)=>[...context.querySelectorAll(selector)];
const article=location.pathname.includes('/articles/');
const prefix=article?'../':'';
const pageFiles=[
 ['index.html','トップ'],['projects.html','市の重点事業を見る'],['budget.html','市のお金'],
 ['compare.html','先行事例を見る'],['issues.html','10の論点'],['gikai.html','市議会を見る'],
 ['city-dashboard.html','数字で見る我孫子']
];
const budgetChapters=[['about','01 財政って、なに？'],['overview','02 我孫子市の予算'],['features','03 予算の特徴'],['everyday','04 日々の暮らしのなかの予算'],['income','05 一般会計の収入'],['spending','06 一般会計の支出'],['household','07 予算を家計に例えると'],['future','08 今後の課題って？'],['vision','09 持続可能な財政のために'],['questions','10 財政のギモン'],['summary','11 ポイントをおさらい！'],['citizen','12 未来のためにできること'],['data','13 データ集・出典']];
const issues=['人口・世代','地域の仕事','財政と基金','子育て・教育','健康と介護','道路と交通','市民参加','ごみ処理施設','市役所庁舎','手賀沼の環境'];
const council=[['home','いまの市議会'],['bills','議案を読む'],['schedule','議会日程'],['guide','議会のしくみ'],['sources','出典と方針']];
const cases=[['all','すべての事例'],['child','子育て・教育'],['district','まちづくり'],['culture','文化・市民参加'],['circular','資源循環'],['build','公共施設'],['walking','歩く・移動']];
const data=[['all','すべてを見る'],['people','人口と暮らし'],['money','市のお金'],['education','子育て・教育'],['environment','水と環境'],['favorites','お気に入り']];
const pageByView={home:'index.html',projects:'projects.html',budget:'budget.html',compare:'compare.html',issues:'issues.html',gikai:'gikai.html',dashboard:'city-dashboard.html'};
function init(){
 const openButton=$('#menuToggle'),header=$('#globalHeader');
 if(!openButton||!header)return;
 const currentPage=pageByView[document.body.dataset.view]||(article?'compare.html':(location.pathname.split('/').pop()||'index.html'));
 const prefersReduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
 const oldMenu=$('#floatingMenu');if(oldMenu){oldMenu.hidden=true;oldMenu.setAttribute('aria-hidden','true');}
 // The top header intentionally has only the six visible links. Remove any old hamburger.
 $$('.v75-header-menu,.v73-header-burger',header).forEach(el=>el.remove());
 const overlay=document.createElement('div');
 overlay.className='v75-overlay v77-overlay v79-overlay';overlay.id='v79Overlay';
 overlay.hidden=true;overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');
 overlay.setAttribute('aria-labelledby','v79MenuTitle');
 overlay.innerHTML=`<div class="v75-overlay-inner v79-overlay-inner">
   <header class="v75-overlay-top v79-overlay-top"><a href="${prefix}index.html" class="v75-overlay-home">あびこ、どうなってる？</a><h2 id="v79MenuTitle" tabindex="-1">ページを選ぶ</h2></header>
   <nav id="v75SiteNav" class="v77-menu-grid v79-menu-grid" aria-label="サイト内のページと目次"></nav>
   <div class="v79-overlay-bottom"><button class="v75-close v79-close" type="button" aria-label="メニューを閉じる"><span aria-hidden="true">×</span> 閉じる</button></div>
  </div>`;
 document.body.append(overlay);
 const nav=$('#v75SiteNav',overlay),closeButton=$('.v79-close',overlay),title=$('#v79MenuTitle',overlay);
 const childrenByPage={
   'projects.html':[['projects','48の重点事業を探す','projects.html#projectGrid']],
   'budget.html':budgetChapters.map(([key,label])=>[key,label,'budget.html#'+key]),
   'compare.html':cases.map(([key,label])=>[key,label,'compare.html?category='+key+'#pressTabs']),
   'issues.html':issues.map((name,i)=>[String(i+1),`${String(i+1).padStart(2,'0')} ${name}`,`issues.html?issue=${i+1}#issueContent`]),
   'gikai.html':council.map(([key,label])=>[key,label,'gikai.html#'+key]),
   'city-dashboard.html':data.map(([key,label])=>[key,label,'city-dashboard.html?category='+key])
 };
 const blocks=[];
 function selectedSubpage(){
  if(currentPage==='budget.html'||currentPage==='gikai.html')return location.hash.slice(1)||(currentPage==='gikai.html'?'home':'');
  if(currentPage==='issues.html')return String($('#issues .issue-pick[aria-selected="true"]')?.dataset.issue||new URLSearchParams(location.search).get('issue')||'1');
  if(currentPage==='compare.html')return $('#pressTabs [data-group][aria-pressed="true"]')?.dataset.group||new URLSearchParams(location.search).get('category')||'all';
  if(currentPage==='city-dashboard.html')return $('#sidebarCategories [data-category][aria-pressed="true"]')?.dataset.category||$('#mobileCategories [data-category][aria-pressed="true"]')?.dataset.category||new URLSearchParams(location.search).get('category')||'all';
  return '';
 }
 function jump(target){
  if(!target)return;
  requestAnimationFrame(()=>{const height=header.getBoundingClientRect().bottom;const position=target.getBoundingClientRect().top+scrollY-height-18;
   scrollTo({top:Math.max(0,position),behavior:prefersReduced()?'instant':'smooth'});
  });
 }
 let lastFocus=openButton;
 function close(restore=true){
  if(overlay.hidden)return;
  overlay.hidden=true;
  document.documentElement.classList.remove('v75-menu-open');
  document.body.classList.remove('v75-menu-open');
  openButton.setAttribute('aria-expanded','false');
  openButton.setAttribute('aria-label','メニューを開く');
  if(restore&&lastFocus?.isConnected)lastFocus.focus({preventScroll:true});
 }
 function collapse(block){
  const list=$('.v77-menu-children',block),button=$('.v77-sub-toggle',block);
  if(!list||!button)return;
  list.hidden=true;button.setAttribute('aria-expanded','false');
  button.setAttribute('aria-label',`${block.dataset.title}の目次を開く`);
 }
 function expand(block){
  for(const other of blocks){if(other!==block)collapse(other);}
  const list=$('.v77-menu-children',block),button=$('.v77-sub-toggle',block);
  if(!list||!button)return;
  list.hidden=false;button.setAttribute('aria-expanded','true');
  button.setAttribute('aria-label',`${block.dataset.title}の目次を閉じる`);
 }
 function updateCurrent(){
  const sub=selectedSubpage();
  blocks.forEach(block=>{
   const on=block.dataset.page===currentPage;
   block.classList.toggle('is-active',on);
   const main=$('.v77-page-link',block);
   if(on)main.setAttribute('aria-current','page');else main.removeAttribute('aria-current');
   $$('.v77-sub-link',block).forEach(a=>{
    const match=on&&a.dataset.key===sub;
    a.classList.toggle('is-current',match);
    if(match)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');
   });
  });
 }
 function localNavigate(which,key){
  if(which!==currentPage)return false;
  if(which==='budget.html'){
   const target=document.getElementById(key);if(!target)return false;
   history.replaceState(null,'','#'+key);close();jump(target);return true;
  }
  if(which==='projects.html'){
   const target=document.getElementById('projectGrid');if(!target)return false;
   close();jump(target);return true;
  }
  if(which==='issues.html'){
   const control=$(`#issues .issue-pick[data-issue="${key}"]`);if(!control)return false;
   control.click();history.replaceState(null,'',`?issue=${key}#issueContent`);
   close();jump($('#issueContent')||$('#issues'));return true;
  }
  if(which==='gikai.html'){close();location.hash=key;return true;}
  if(which==='compare.html'){
   const control=$(`#pressTabs [data-group="${key}"]`);if(!control)return false;
   control.click();history.replaceState(null,'',`?category=${key}#pressTabs`);
   close();jump($('#pressTabs'));return true;
  }
  if(which==='city-dashboard.html'){
   const control=$(`#sidebarCategories [data-category="${key}"]`)||$(`#mobileCategories [data-category="${key}"]`);
   if(!control)return false;control.click();close();jump($('#chartAreaTitle'));return true;
  }
  return false;
 }
 for(const [href,label] of pageFiles){
  const block=document.createElement('section');block.className='v77-menu-group v79-menu-group';block.dataset.page=href;block.dataset.title=label;
  const head=document.createElement('div');head.className='v77-page-head v79-page-head';
  const link=document.createElement('a');link.className='v77-page-link';link.href=prefix+href;link.textContent=label;
  head.append(link);
  const subs=childrenByPage[href]||[];
  if(subs.length){
   const list=document.createElement('div');list.className='v77-menu-children v79-menu-children';list.id='v79-sub-'+href.replace(/\W/g,'');list.hidden=true;
   const toggle=document.createElement('button');toggle.className='v77-sub-toggle v79-sub-toggle';toggle.type='button';toggle.setAttribute('aria-controls',list.id);toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label',`${label}の目次を開く`);
   toggle.innerHTML='<span>目次</span><span class="v77-chevron" aria-hidden="true"></span>';
   head.append(toggle);
   block.append(head,list);
   for(const [key,text,path] of subs){
    const sub=document.createElement('a');sub.className='v77-sub-link';sub.href=prefix+path;sub.dataset.key=key;sub.textContent=text;
    sub.addEventListener('click',ev=>{if(href===currentPage){ev.preventDefault();if(!localNavigate(href,key)){location.href=sub.href;}}});
    list.append(sub);
   }
   toggle.addEventListener('click',()=>list.hidden?expand(block):collapse(block));
  }else block.append(head);
  nav.append(block);blocks.push(block);
 }
 function open(){
  if(!overlay.hidden){close();return;}
  lastFocus=openButton;updateCurrent();
  blocks.forEach(b=>collapse(b));
  const current=blocks.find(b=>b.dataset.page===currentPage);
  if(current)expand(current);
  overlay.hidden=false;
  document.documentElement.classList.add('v75-menu-open');document.body.classList.add('v75-menu-open');
  openButton.setAttribute('aria-expanded','true');openButton.setAttribute('aria-label','メニューを閉じる');
  overlay.scrollTop=0;
  title.focus({preventScroll:true});
 }
 const clickHandler=ev=>{ev.preventDefault();ev.stopPropagation();ev.stopImmediatePropagation();open();};
 openButton.setAttribute('aria-controls',overlay.id);
 openButton.addEventListener('click',clickHandler,true);
 closeButton.addEventListener('click',()=>close());
 overlay.addEventListener('click',ev=>{if(ev.target===overlay)close();});
 document.addEventListener('keydown',ev=>{
  if(overlay.hidden)return;
  if(ev.key==='Escape'){ev.preventDefault();close();return;}
  if(ev.key!=='Tab')return;
  const tabbable=$$('a[href],button:not([disabled])',overlay).filter(n=>n.getClientRects().length&&getComputedStyle(n).visibility!=='hidden');
  if(!tabbable.length){ev.preventDefault();return;}
  const index=tabbable.indexOf(document.activeElement);
  if(ev.shiftKey&&(index<=0)){ev.preventDefault();tabbable.at(-1).focus();}
  else if(!ev.shiftKey&&(index===tabbable.length-1||index<0)){ev.preventDefault();tabbable[0].focus();}
 });
 window.addEventListener('hashchange',()=>{if(!overlay.hidden)updateCurrent();});
 // Defensive guard if the hosting page still contains two generated copies.
 const footers=$$('footer.footer.v45-footer');
 footers.slice(1).forEach(x=>x.remove());
}
onReady(init);
})();
