/* ORIGINAL: finance-editorial-v59.js */
(()=>{'use strict';
const data=window.ABIKO_FINANCE_DATA;
const items=data.budget,max=512.3;
const fmt=v=>Number(v).toLocaleString('ja-JP',{minimumFractionDigits:1,maximumFractionDigits:2});
const svgNS='http://www.w3.org/2000/svg';
const host=document.getElementById('editorDonut'),detail=document.getElementById('editorDonutDetail');
function xy(cx,cy,r,a){const t=(a-90)*Math.PI/180;return [cx+r*Math.cos(t),cy+r*Math.sin(t)]}
function arc(cx,cy,outer,inner,start,end){const p1=xy(cx,cy,outer,start),p2=xy(cx,cy,outer,end),p3=xy(cx,cy,inner,end),p4=xy(cx,cy,inner,start),large=end-start>180?1:0;return `M ${p1.join(' ')} A ${outer} ${outer} 0 ${large} 1 ${p2.join(' ')} L ${p3.join(' ')} A ${inner} ${inner} 0 ${large} 0 ${p4.join(' ')} Z`}
let svg='<svg viewBox="0 0 360 360" role="group" aria-label="2026年度一般会計歳出の11費目。各区分は選択可能">';
let start=0;
items.forEach((d,i)=>{const sweep=d.value/max*360, end=start+sweep;svg+=`<path class="editor-arc" tabindex="0" role="button" aria-label="${d.name} ${fmt(d.value)}億円" data-budget-index="${i}" d="${arc(180,180,155,86,start+.3,end-.3)}" fill="${d.color}" opacity=".91"><title>${d.name} ${fmt(d.value)}億円</title></path>`;start=end});
svg+='<circle cx="180" cy="180" r="83" fill="#f5faf5"/><text x="180" y="162" text-anchor="middle" font-size="11" fill="#557963">2026年度当初予算</text><text x="180" y="199" text-anchor="middle" font-size="35" font-weight="850" fill="#193f33">512.3</text><text x="180" y="221" text-anchor="middle" font-size="12" fill="#557963">億円・一般会計</text></svg>';
host.innerHTML=svg;
function select(i){const d=items[i];host.querySelectorAll('.editor-arc').forEach((el,k)=>{el.classList.toggle('is-selected',i===k);el.setAttribute('aria-pressed',String(i===k));el.style.opacity=i===k?'1':'.63'});detail.innerHTML=`<span class="editor-detail-kicker">${String(i+1).padStart(2,'0')} / 11 PURPOSES</span><h4>${d.name}</h4><b>${fmt(d.value)}<small style="font-size:13px;margin-left:4px">億円</small></b> <span style="font-size:13px;color:#5f7a6e">(${(d.value/max*100).toFixed(1)}%)</span><p>${d.readerSummary||''}</p>`;}
host.querySelectorAll('[data-budget-index]').forEach(el=>{const i=+el.dataset.budgetIndex;el.addEventListener('click',()=>select(i));el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select(i)}})});select(0);
const f=[{year:2023,value:39.45},{year:2024,value:36.63},{year:2025,value:42.94}],w=650,h=240,left=64,right=35,top=36,bottom=40;
const x=i=>left+i*(w-left-right)/(f.length-1),y=v=>top+(48-v)/(48-30)*(h-top-bottom);
let out=`<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="財政調整基金の残高。2023年39.45億円、2024年36.63億円、2025年42.94億円">`;
[30,35,40,45].forEach(v=>{out+=`<line x1="${left}" x2="${w-right}" y1="${y(v)}" y2="${y(v)}" stroke="#d1e0d6" stroke-dasharray="3 7"/><text x="${left-12}" y="${y(v)+4}" text-anchor="end" font-size="13" fill="#60786a">${v}億</text>`});
out+=`<polyline class="trend-line" fill="none" stroke="#267c62" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" points="${f.map((d,i)=>x(i)+','+y(d.value)).join(' ')}"/>`;
f.forEach((d,i)=>{out+=`<circle cx="${x(i)}" cy="${y(d.value)}" r="6" fill="#267c62" stroke="white" stroke-width="2"/><text x="${x(i)}" y="${y(d.value)-15}" text-anchor="middle" font-size="16" font-weight="800" fill="#1d5949">${fmt(d.value)}</text><text x="${x(i)}" y="${h-7}" text-anchor="middle" font-size="13" fill="#567265">${d.year}</text>`});out+='</svg>';document.getElementById('editorReserveChart').innerHTML=out;
const watched=[...document.querySelectorAll('.editor-data-panel,.figure,.history-chart')];
if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-inview');io.unobserve(e.target)}}),{threshold:.12});watched.forEach(n=>io.observe(n))}else watched.forEach(n=>n.classList.add('is-inview'));
})();
;
/* ORIGINAL: v63-budget.js */
(()=>{'use strict';
const el=id=>document.getElementById(id), d=window.ABIKO_FINANCE_DATA, total=512.3;
const yen=n=>Math.round(n/total*MONTHLY_INCOME).toLocaleString('ja-JP')+'円';
const MONTHLY_INCOME=Math.round(5000000/12);
const bfmt=n=>n.toLocaleString('ja-JP',{minimumFractionDigits:1,maximumFractionDigits:1})+'億円';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Income chart: actual FY 2026 local budget data; no heuristic grouping of unrelated funds.
const leading=['市税','国庫支出金','地方交付税','県支出金','地方消費税交付金','市債'];
const shown=leading.map(name=>d.income.find(x=>x.name===name));
shown.push({name:'その他（繰入金・使用料など）',value:total-shown.reduce((s,x)=>s+x.value,0)});
el('finIncomeBars').innerHTML=shown.map(v=>`<div class="v63-fin-bar-row"><div><b>${esc(v.name)}</b><span>${bfmt(v.value)}　${(v.value/total*100).toFixed(1)}%</span></div><div class="v63-fin-bar-track"><div class="v63-fin-bar-fill" style="width:${v.value/total*100}%"></div></div></div>`).join('');
const householdIncome=[
 ['市税（給料などのイメージ）',d.income.find(x=>x.name==='市税').value],
 ['国・県支出金（補助金）',d.income.filter(x=>['国庫支出金','県支出金'].includes(x.name)).reduce((s,x)=>s+x.value,0)],
 ['地方交付税',d.income.find(x=>x.name==='地方交付税').value],
 ['市債（借り入れ）',d.income.find(x=>x.name==='市債').value],
 ['繰入金（積立金の取り崩し等）',d.income.find(x=>x.name==='繰入金').value],
 ['その他（交付金・使用料等）',0]
];
householdIncome[5][1]=total-householdIncome.slice(0,5).reduce((s,x)=>s+x[1],0);
const householdExpense=d.budget.map(x=>[x.name,x.value]);
function renderRows(id,arr){const scaled=arr.map(([,value])=>Math.round(value/total*MONTHLY_INCOME));scaled[scaled.length-1]=MONTHLY_INCOME-scaled.slice(0,-1).reduce((s,x)=>s+x,0);el(id).innerHTML=arr.map(([name],i)=>`<div class="v63-home-row"><b>${esc(name)}</b><strong>${scaled[i].toLocaleString('ja-JP')}円</strong></div>`).join('')}
renderRows('finHouseIncome',householdIncome);renderRows('finHouseExpense',householdExpense);
const historyMax=Math.max(...d.annual.map(x=>Math.max(x.income,x.expense)))+5;
el('finAnnualBars').innerHTML=d.annual.map(item=>`<div class="v63-annual-row"><strong>${item.year}年度</strong><div class="v63-annual-bars"><div class="v63-annual-track"><i style="width:${(item.income/historyMax*100).toFixed(1)}%"></i><span>歳入 ${item.income.toFixed(1)}億</span></div><div class="v63-annual-track expense"><i style="width:${(item.expense/historyMax*100).toFixed(1)}%"></i><span>歳出 ${item.expense.toFixed(1)}億</span></div></div></div>`).join('')+'<div class="v63-annual-legend"><span>歳入</span><span>歳出</span></div>';
// Shared global nav is floating/sticky and can change heights at breakpoints.
const hdr=el('globalHeader'), toc=el('tocMobile'), main=el('main');
function setNavHeight(){const h=Math.ceil(hdr?.getBoundingClientRect().height||0);document.documentElement.style.setProperty('--v63-nav-height',h+'px');}
if(window.ResizeObserver && hdr){new ResizeObserver(setNavHeight).observe(hdr)}
window.addEventListener('resize',setNavHeight,{passive:true});setNavHeight();
// Reposition contents after a tap on narrow screens so its top is never covered.
if(toc){toc.querySelector('summary').addEventListener('click',()=>{requestAnimationFrame(()=>{setNavHeight();if(toc.getBoundingClientRect().top<(hdr?.getBoundingClientRect().bottom||0)+6){window.scrollTo({top:Math.max(0,window.scrollY+toc.getBoundingClientRect().top-(hdr?.getBoundingClientRect().bottom||0)-13),behavior:'instant'})}})})}
const links=[...document.querySelectorAll('#tocDesktop a,#tocMobile a')];
const sectionIds=[...new Set(links.map(a=>a.getAttribute('href').slice(1)))];
const sections=sectionIds.map(id=>el(id)).filter(Boolean);
function offset(){return (hdr?.getBoundingClientRect().height||0)+(window.matchMedia('(max-width:760px)').matches?64:28)}
let lockedUntil=0;
function setActive(id){links.forEach(a=>{let on=a.getAttribute('href')==='#'+id;a.classList.toggle('active',on);if(on)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')})}
for(const a of links){a.addEventListener('click',event=>{let id=a.getAttribute('href').slice(1),target=el(id);if(!target)return;event.preventDefault();toc.open=false;lockedUntil=Date.now()+600;setActive(id);setTimeout(watch,650);history.replaceState(null,'','#'+id);requestAnimationFrame(()=>{setNavHeight();window.scrollTo({top:Math.max(0,target.getBoundingClientRect().top+window.scrollY-offset()),behavior:'instant'})})})}
function watch(){if(Date.now()<lockedUntil)return;const probe=window.scrollY+offset()+16;let current=sections[0]?.id;for(const s of sections){if(s.getBoundingClientRect().top+window.scrollY<=probe)current=s.id}if(window.innerHeight+window.scrollY>=document.documentElement.scrollHeight-5)current=sections.at(-1)?.id;if(current)setActive(current);const y=document.documentElement.scrollHeight-window.innerHeight;el('readProgress').style.width=(y>0?Math.min(100,window.scrollY/y*100):100)+'%'}
let ticking=false;window.addEventListener('scroll',()=>{if(ticking)return;ticking=true;requestAnimationFrame(()=>{watch();ticking=false})},{passive:true});
window.addEventListener('load',()=>{setNavHeight();let hash=decodeURIComponent(location.hash.slice(1));if(sectionIds.includes(hash)){const target=el(hash);window.scrollTo({top:Math.max(0,target.getBoundingClientRect().top+window.scrollY-offset()),behavior:'instant'});setActive(hash)}else watch()},{once:true});
// Observation animation should not hide bars for browsers lacking observers or reduced-motion.
const income=el('finIncomeBars');if(window.IntersectionObserver){let obs=new IntersectionObserver(items=>{items.forEach(item=>{if(item.isIntersecting){income.classList.add('is-inview');obs.disconnect()}})},{threshold:.1});obs.observe(income)}else income.classList.add('is-inview');
})();

