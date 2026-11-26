/* v66 interactive municipal finance charts. Preserves official 2026 budget values. */
(()=>{'use strict';
const node=id=>document.getElementById(id), data=window.ABIKO_FINANCE_DATA;if(!data)return;
const total=512.3, scaled=Math.round(5000000/12);
const format=(value,d=1)=>Number(value).toLocaleString('ja-JP',{minimumFractionDigits:d,maximumFractionDigits:d});
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const palette=['#236d59','#4a9b83','#7bb7a3','#b6c99c','#d6b27c','#7d9aa9','#c09ba4','#8caa8c','#e3a97a','#9aafc3','#9aa58e','#c6b4a4'];
const primary=['市税','国庫支出金','地方交付税','県支出金','地方消費税交付金','市債'];
const top=primary.map(name=>data.income.find(x=>x.name===name)).filter(Boolean);top.push({name:'その他',value:total-top.reduce((s,x)=>s+x.value,0)});
const inGroups=[
 ['市税（給料などのイメージ）',data.income.find(x=>x.name==='市税').value],
 ['国・県支出金（補助金）',data.income.filter(x=>['国庫支出金','県支出金'].includes(x.name)).reduce((s,x)=>s+x.value,0)],
 ['地方交付税',data.income.find(x=>x.name==='地方交付税').value],
 ['市債（借り入れ）',data.income.find(x=>x.name==='市債').value],
 ['繰入金（積立金の取り崩し等）',data.income.find(x=>x.name==='繰入金').value],
 ['その他（交付金・使用料等）',0]
];inGroups[5][1]=total-inGroups.slice(0,5).reduce((s,v)=>s+v[1],0);
const expenses=data.budget.map(x=>[x.name,x.value,x.color]);
function point(deg,r=124){const a=(deg-90)*Math.PI/180;return [155+r*Math.cos(a),155+r*Math.sin(a)]}
function arc(a,b){const p1=point(a),p2=point(b),p3=point(b,0);const large=b-a>180?1:0;return `M 155 155 L ${p1.join(' ')} A 124 124 0 ${large} 1 ${p2.join(' ')} Z`}
function renderPie(hostId, rows, subtitle, yen=false, legendId){const host=node(hostId);if(!host)return;
 const sum=rows.reduce((s,x)=>s+x[1],0), colors=rows.map((r,i)=>r[2]||palette[i%palette.length]);
 let start=0,segments='';for(let i=0;i<rows.length;i++){const [name,val]=rows[i];const sweep=val/sum*360;const end=start+sweep;
 segments+=`<path tabindex="0" role="button" data-pie-index="${i}" d="${arc(start+.06,end-.06)}" fill="${colors[i]}" aria-label="${esc(name)}：${yen?format(val/sum*scaled,0)+'円':format(val,1)+'億円'}、${format(val/sum*100,1)}%"><title>${esc(name)} ${format(val/sum*100,1)}%</title></path>`;start=end;}
 host.classList.add('v66-pie');host.innerHTML=`<svg class="v66-pie-svg" viewBox="0 0 310 310" aria-label="${esc(subtitle)}。各区分を選択できます" role="group">${segments}<circle cx="155" cy="155" r="58" fill="#fafcf8"/><text x="155" y="144" text-anchor="middle" font-size="12" fill="#537366">${yen?'月収換算':'2026年度'}</text><text x="155" y="170" text-anchor="middle" font-size="23" font-weight="850" fill="#235442">${yen?'41.7万円':'512.3億'}</text></svg><div class="v66-pie-selection" aria-live="polite"></div>`;
 const list=legendId?node(legendId):null;
 if(list)list.innerHTML=rows.map((r,i)=>`<button type="button" data-pie-list="${i}"><i style="background:${colors[i]}"></i><span>${esc(r[0])}</span><b>${format(r[1]/sum*100,1)}%</b></button>`).join('');
 const selection=host.querySelector('.v66-pie-selection'),paths=[...host.querySelectorAll('[data-pie-index]')];
 const toVal=v=>yen?format(v/sum*scaled,0)+'円':format(v,2)+'億円';
 function select(i,locked=false){paths.forEach((p,j)=>p.classList.toggle('active',i===j));if(list)list.querySelectorAll('[data-pie-list]').forEach((p,j)=>{p.classList.toggle('active',i===j);p.setAttribute('aria-pressed',String(i===j))});selection.innerHTML=`<span>${esc(rows[i][0])}</span><strong>${toVal(rows[i][1])}</strong><small>${format(rows[i][1]/sum*100,1)}%</small>`;host.dataset.selected=String(i);host.dataset.locked=locked?'true':'false'}
 paths.forEach((p,i)=>{p.addEventListener('pointerenter',()=>{select(i)});p.addEventListener('click',()=>select(i,true));p.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select(i,true)}})});
 if(list)list.querySelectorAll('[data-pie-list]').forEach((b,i)=>{b.addEventListener('pointerenter',()=>{select(i)});b.addEventListener('click',()=>select(i,true))});select(0);
}
renderPie('finIncomePie',top.map((x,i)=>[x.name,x.value,palette[i]]),'一般会計歳入の構成',false,'finIncomeLegend');
renderPie('finHouseIncomePie',inGroups.map((r,i)=>[r[0],r[1],palette[i]]),'家計に換算した収入',true);
renderPie('finHouseExpensePie',expenses,'家計に換算した支出',true);
// All finance doughnuts share one hover/focus tooltip behavior.
function bindPieTooltip(host, selector, getInfo){
 if(!host)return;const tip=document.createElement('div');tip.className='v66-budget-tooltip v71-pie-tooltip';tip.setAttribute('role','status');tip.hidden=true;host.append(tip);
 const show=(e,el)=>{const info=getInfo(el);if(!info)return;tip.hidden=false;tip.innerHTML=`<strong>${esc(info.name)}</strong><span>${info.amount}　(${format(info.pct,1)}%)</span>`;const rect=host.getBoundingClientRect(),width=Math.min(200,Math.max(155,rect.width-8));tip.style.maxWidth=width+'px';const cx=e?.clientX??rect.left+rect.width/2,cy=e?.clientY??rect.top+rect.height/2;tip.style.left=Math.max(4,Math.min(rect.width-width-4,cx-rect.left+12))+'px';tip.style.top=Math.max(4,Math.min(rect.height-64,cy-rect.top+12))+'px';};
 host.querySelectorAll(selector).forEach(el=>{el.addEventListener('pointerenter',e=>show(e,el));el.addEventListener('pointermove',e=>show(e,el));el.addEventListener('pointerleave',()=>{tip.hidden=true});el.addEventListener('focus',e=>show(e,el));el.addEventListener('blur',()=>{tip.hidden=true})});
}
const asInfo=(r,rows,monthly)=>{const sum=rows.reduce((s,x)=>s+x[1],0);return {name:r[0],pct:r[1]/sum*100,amount:monthly?format(r[1]/sum*scaled,0)+'円':format(r[1],2)+'億円'}};
bindPieTooltip(node('finIncomePie'),'[data-pie-index]',el=>{const rows=top.map(v=>[v.name,v.value]);return asInfo(rows[Number(el.dataset.pieIndex)],rows,false)});
bindPieTooltip(node('finHouseIncomePie'),'[data-pie-index]',el=>asInfo(inGroups[Number(el.dataset.pieIndex)],inGroups,true));
bindPieTooltip(node('finHouseExpensePie'),'[data-pie-index]',el=>asInfo(expenses[Number(el.dataset.pieIndex)],expenses,true));
const budgetHost=node('editorDonut');
bindPieTooltip(budgetHost,'[data-budget-index]',el=>{const item=data.budget[Number(el.dataset.budgetIndex)];return {name:item.name,pct:item.value/total*100,amount:format(item.value,2)+'億円'}});
// Reveal numbers as they scroll into view; chosen text nodes only, so units and qualifiers stay unchanged.
function addCounter(el,match){if(!el||el.querySelector('[data-v66-count]'))return;const child=[...el.childNodes].find(x=>x.nodeType===Node.TEXT_NODE && match.test(x.textContent));if(!child)return;
 const text=child.textContent, m=text.match(match);if(!m)return;const value=Number(m[1].replaceAll(',',''));if(!Number.isFinite(value))return;
 const before=document.createTextNode(text.slice(0,m.index)),after=document.createTextNode(text.slice(m.index+m[1].length));const span=document.createElement('span');span.dataset.v66Count=String(value);span.dataset.decimals=String((m[1].split('.')[1]||'').length);span.className='v66-count';span.textContent=m[1];el.insertBefore(before,child);el.insertBefore(span,child);el.insertBefore(after,child);child.remove();}
addCounter(document.querySelector('.v63-fin-hero-figure strong'),/([\d,]+(?:\.\d+)?)/);
document.querySelectorAll('.v63-big-number-grid strong,.v63-summary-grid strong,.v63-home-heading strong,.v63-home-row strong,.v63-number-alert strong').forEach(el=>addCounter(el,/([\d,]+(?:\.\d+)?)/));
addCounter(document.querySelector('#features .v63-fin-lead strong'),/([\d,]+(?:\.\d+)?)/);
const donutAmount=node('editorDonut')?.querySelector('svg text[font-size="35"]');if(donutAmount)donutAmount.dataset.v66Count='512.3',donutAmount.dataset.decimals='1';
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
function animateCounter(el){const target=Number(el.dataset.v66Count),digits=Number(el.dataset.decimals||0);if(reduce){el.textContent=format(target,digits);return}const dur=1100;let start=0;
 function frame(t){if(!start)start=t;const progress=Math.min(1,(t-start)/dur),eased=1-Math.pow(1-progress,3);el.textContent=format(target*eased,digits);if(progress<1)requestAnimationFrame(frame)}el.textContent=format(0,digits);requestAnimationFrame(frame)}
const visualEls=[...document.querySelectorAll('.v63-fin-hero-figure,.v63-big-number-grid,.v63-budget-band,.v63-graph-panel,.v63-home-money,.v63-summary-grid,.v63-number-alert,.v63-life-grid,.v63-annual-graph')];
function reveal(el){el.classList.add('is-v66-visible');el.querySelectorAll('[data-v66-count]').forEach(counter=>{if(counter.dataset.animated)return;counter.dataset.animated='true';animateCounter(counter)});if(el.hasAttribute('data-v66-count')&&!el.dataset.animated){el.dataset.animated='true';animateCounter(el)}}
if('IntersectionObserver' in window){const io=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){reveal(e.target);io.unobserve(e.target)}})},{threshold:.07,rootMargin:'0px 0px 20px 0px'});visualEls.forEach(e=>io.observe(e));document.querySelectorAll('[data-v66-count]').forEach(e=>{if(!visualEls.some(p=>p.contains(e)))io.observe(e)})}else visualEls.forEach(reveal);
})();
