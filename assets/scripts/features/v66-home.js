/* v81: two fresh editorial picks per each of six sections, reshuffled each load. */
(()=>{'use strict';
if(document.body.dataset.view!=='home')return;
const D=window.ABIKO_DASHBOARD_DATA||{},P=window.DATA?.projects||[],ST=typeof ABIKO_STORIES!=='undefined'?ABIKO_STORIES:[];
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const nfmt=(v,d=1)=>Number(v).toLocaleString('ja-JP',{maximumFractionDigits:d});
const colors=['#24795f','#77ad9c','#b5c9a4','#d5b684','#a0bdca','#bd9caa','#8aaea4','#b6b6cd','#d8aa8b','#a7b19e','#b9c9a0'];
function randomIndex(max){if(globalThis.crypto?.getRandomValues){const range=new Uint32Array(1);crypto.getRandomValues(range);return range[0]%max}return Math.floor(Math.random()*max)}
function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){const k=randomIndex(i+1);[a[k],a[i]]=[a[i],a[k]]}return a}
const TEGANUMA_FALLBACK={src:'https://commons.wikimedia.org/wiki/Special:FilePath/Lake%20Tega.JPG?width=960',alt:'手賀沼の景観'};
const photo=(src,alt,credit)=>{
 const usingFallback=!src;
 const actualSrc=src||TEGANUMA_FALLBACK.src;
 const actualAlt=usingFallback?TEGANUMA_FALLBACK.alt:(alt||'資料写真');
 const actualCredit=usingFallback?'':(credit||'参考写真');
 const fallbackSrc=escape(TEGANUMA_FALLBACK.src);
 const fallbackAlt=escape(TEGANUMA_FALLBACK.alt);
 return `<figure class="v66-photo ${usingFallback?'is-fallback-photo':''}"><img src="${escape(actualSrc)}" alt="${escape(actualAlt)}" referrerpolicy="no-referrer" loading="lazy" onerror="if(!this.dataset.fallbackApplied){this.dataset.fallbackApplied='1';this.src='${fallbackSrc}';this.alt='${fallbackAlt}';var cap=this.parentElement.querySelector('figcaption');if(cap){cap.textContent='';cap.hidden=true;}this.parentElement.classList.add('is-fallback-photo');return;}this.style.display='none';this.parentElement.classList.add('is-missing-photo')"><figcaption${actualCredit?'':' hidden'}>${escape(actualCredit)}</figcaption></figure>`
};
const projectPool=P.map(p=>({category:'市の重点事業を見る',title:p.title,topic:p.topic,region:p.region,summary:p.summary||p.background||'我孫子市が2026年度に取り組む重点事業の内容を、公開資料から見ていきます。',href:`projects.html?project=${p.id}&detail=1#projectGrid`,medium:'photo',art:photo(p.illustration,p.illustrationAlt,'地域・施設の参考写真（事業対象の写真とは限りません）'),fallback:`<div class="v66-text-art"><small>2026年度 / 指定事務事業 ${String(p.id).padStart(2,'0')}</small><strong>${escape(p.topic)}</strong></div>`}));
const casePool=ST.map(a=>({category:'先行事例を見る',title:a.headline||a.title,location:a.location,caseCategory:a.categoryLabel,summary:a.deck||a.lead||'他のまちの取り組みを手がかりに、我孫子でできることを考えます。',href:`articles/${encodeURIComponent(a.slug)}.html`,medium:'photo',art:photo(a.image,a.photoSubject||a.headline,a.photoCredit||'出典・ライセンスは事例本文に記載'),fallback:`<div class="v66-text-art"><small>先行事例 / ${escape(a.location)}</small><strong>${escape(a.categoryLabel)}</strong></div>`}));
const issueNames=['人口・世代','地域の仕事','財政と基金','子育て・教育','健康と介護','道路と交通','市民参加','ごみ処理施設','市役所庁舎','手賀沼の環境'];
const issueIntroductions=[
 '人口の変化と世代ごとの人数を知ると、学校や医療、地域のこれからが見えてきます。',
 '市内で働く場所や商いは、どのように変わっているのでしょう。地域経済の数字を確かめます。',
 '税収、基金、借金。市の財政には、いまどんな余力と課題があるのでしょうか。',
 '子どもを育て、学ぶための環境はどう変わるのか。教育と子育ての数字から考えます。',
 '高齢化が進むまちで、健康や介護の支えをどうつくるか。身近なデータを入り口にします。',
 '通学路、道路、地域の交通。安心して移動できるまちの条件を数字から考えます。',
 '市民の声が政策に届く仕組みはあるのか。参加の実態と機会を見つめます。',
 'ごみ処理施設の整備費と運営費はどれくらいか。見積りの変化や論点を整理します。',
 '古くなった市役所庁舎をどうするか。建替えや施設の使い方を考えるための材料です。',
 '手賀沼の水質はどう変わってきたのか。測定結果から身近な自然環境を考えます。'
];
const issues=issueNames.map((name,i)=>({category:'我孫子市10の論点',title:name,issueIndex:i,summary:issueIntroductions[i],href:`issues.html?issue=${i+1}#issueContent`,medium:'photo',art:photo('',`手賀沼の景観（${name}のサマリー用代替画像）`,'')}));
const budgetPool=[
 {category:'市のお金',title:'今年の予算、何が変わった？',href:'budget.html#features',medium:'viz',chart:'budget'},
 {category:'市のお金',title:'暮らしのどこに、使われる？',href:'budget.html#everyday',medium:'viz',chart:'spending'},
 {category:'市のお金',title:'お金は、どこから来る？',href:'budget.html#income',medium:'viz',chart:'income'},
 {category:'市のお金',title:'何に、いくら使う？',href:'budget.html#spending',medium:'viz',chart:'spending'},
 {category:'市のお金',title:'家計に例えると',href:'budget.html#household',medium:'viz',chart:'household'},
 {category:'市のお金',title:'我孫子市の2026年度予算',href:'budget.html#overview',medium:'viz',chart:'overview'},
 {category:'市のお金',title:'今後の財政課題は？',href:'budget.html#future',medium:'viz',chart:'future'},
 {category:'市のお金',title:'これからの財政を考える',href:'budget.html#vision',medium:'viz',chart:'vision'}
];
const budgetIntroductions={
 '今年の予算、何が変わった？':'2025年度と2026年度の当初予算を比較。増えた金額とその背景から市の優先順位を考えます。',
 '暮らしのどこに、使われる？':'子育てや福祉、道路、教育など、日々の暮らしとつながる予算の使い道を見ていきます。',
 'お金は、どこから来る？':'市税、国や県からのお金、借入れなど。市の収入がどこから来るのかを確かめます。',
 '何に、いくら使う？':'一般会計512.3億円は何に使われるのか。11の費目に分けて大きさを比べます。',
 '家計に例えると':'市の収支を月収約41.7万円の家計に置き換え、予算の構造を身近な金額で見ます。',
 '我孫子市の2026年度予算':'2026年度の一般会計当初予算は512.3億円。金額の全体像と内訳をたどります。',
 '今後の財政課題は？':'これからの収支見通しや公共施設の維持など、将来の財政を考えるための材料です。',
 'これからの財政を考える':'これから何に優先してお金を使うべきか。市の数字を手がかりに問い直します。'
};
budgetPool.forEach(item=>{item.summary=budgetIntroductions[item.title]||''});
const AR=D.annualResidents||{}, AM=D.annualMovement||{},CE=D.history?.census||{};
const miniSeries=[
 ['monthlynet','自然増減と社会増減の差',AM.years,AM.births?.map((v,i)=>v-AM.deaths[i]),AM.inflow?.map((v,i)=>v-AM.outflow[i]),'自然増減','社会増減','人／年','people'],
 ['population','住民基本台帳人口の推移',AR.years,AR.population,null,'登録人口',null,'人','people'],
 ['households','世帯数の推移',AR.years,AR.households,null,'世帯数',null,'世帯','people'],
 ['foreign','外国籍住民の推移',AR.years,AR.foreign,null,'外国籍住民',null,'人','people'],
 ['births','出生と死亡',AM.years,AM.births,AM.deaths,'出生','死亡','人／年','people'],
 ['migration','転入と転出',AM.years,AM.inflow,AM.outflow,'転入','転出','人／年','people'],
 ['censuspopulation','国勢調査の人口を比べる',CE.years,CE.population,null,'国勢調査人口',null,'人','people'],
 ['treemap','歳出の大きさを面積で見る',null,null,null,'','','億円','money'],
 ['spending','市の予算は何に使う？',null,null,null,'','','億円','money'],
 ['revenue','市のお金の入り口',null,null,null,'','','億円','money'],
 ['tax','市税は歳入の何割？',null,null,null,'','','億円','money'],
 ['budgetshift','当初予算の規模を比較',['2025','2026'],[D.budget2025,D.budgetTotal],null,'一般会計',null,'億円','money']
];
/* v81: Council candidates generated from data-2026-09.json (2026-11-16 snapshot). */
const councilBills=[{"number":1,"headline":"災害対応の手当を見直す","lead":"災害時の応急作業や消防の広域応援に携わる職員の手当を改める条例です。","result":"可決","dateSubmitted":"2026-09-02","category":"行政・しくみ","votes":{"yes":22,"no":0,"left":0,"absent":1,"chairNotVoting":1}},{"number":2,"headline":"行政からの公示通知をネットでも","lead":"相手の所在地がわからない場合の公示送達について、インターネットを使う方法を加える改正です。","result":"可決","dateSubmitted":"2026-09-02","category":"行政・しくみ","votes":{"yes":22,"no":0,"left":0,"absent":1,"chairNotVoting":1}},{"number":3,"headline":"湖北台市民センターの閉館などを決定","lead":"湖北台市民センターの閉館と、布佐南近隣センターのテニスコートの夜間利用開始時期の変更などを扱います。","result":"可決","dateSubmitted":"2026-09-02","category":"福祉・くらし","votes":{"yes":22,"no":0,"left":0,"absent":1,"chairNotVoting":1}},{"number":5,"headline":"障害者福祉センターの廃止を決定","lead":"施設の老朽化と民間サービスの提供体制の整備などを理由に、障害者福祉センターを廃止する条例です。","result":"可決","dateSubmitted":"2026-09-02","category":"福祉・くらし","votes":{"yes":22,"no":0,"left":0,"absent":1,"chairNotVoting":1}},{"number":6,"headline":"中小企業向け融資条例の条文整理","lead":"国の法律改正に伴い、条例が引用する条項番号を修正する改正です。","result":"可決","dateSubmitted":"2026-09-02","category":"産業・まち","votes":{"yes":22,"no":0,"left":0,"absent":1,"chairNotVoting":1}},{"number":7,"headline":"都市計画審議会の市議会議員枠を縮小","lead":"都市計画審議会に選ばれる市議会議員の人数の上限を、4人から2人へ変更する議案です。","result":"可決","dateSubmitted":"2026-09-02","category":"行政・しくみ","votes":{"yes":20,"no":1,"left":1,"absent":1,"chairNotVoting":1}},{"number":8,"headline":"消防職員の定数を14人増やす","lead":"消防本部・消防署の職員定数を174人から188人に変更する条例です。","result":"可決","dateSubmitted":"2026-09-02","category":"防災・安全","votes":{"yes":22,"no":0,"left":0,"absent":1,"chairNotVoting":1}},{"number":9,"headline":"水道事業などの条例の引用条文を整理","lead":"地方自治法の改正に伴って、関係条例が引用する条項番号を改めます。","result":"可決","dateSubmitted":"2026-09-02","category":"水道・下水道","votes":{"yes":22,"no":0,"left":0,"absent":1,"chairNotVoting":1}},{"number":10,"headline":"学校給食費の管理を学校から市へ","lead":"学校ごとに管理していた学校給食費を、市の一般会計で管理する仕組みに移す条例です。","result":"可決","dateSubmitted":"2026-09-02","category":"教育・子育て","votes":{"yes":22,"no":0,"left":0,"absent":1,"chairNotVoting":1}},{"number":17,"headline":"2025年度の市の一般会計決算を認定","lead":"市の一般会計について、2025年度の収入と支出の決算を議会が審査・認定する議案です。","result":"認定","dateSubmitted":"2026-09-02","category":"財政・予算","votes":{"yes":20,"no":2,"left":0,"absent":1,"chairNotVoting":1}},{"number":18,"headline":"2025年度の国保会計決算を認定","lead":"国民健康保険事業特別会計の2025年度決算を認定する議案です。","result":"認定","dateSubmitted":"2026-09-02","category":"財政・予算","votes":{"yes":20,"no":2,"left":0,"absent":1,"chairNotVoting":1}},{"number":23,"headline":"9月末、1億2,500万円の補正予算を追加","lead":"一般会計に1億2,500万円を追加し、補正後の歳入・歳出予算をそれぞれ518億1,700万円とする議案です。","result":"可決","dateSubmitted":"2026-09-29","category":"財政・予算","votes":{"yes":22,"no":0,"left":0,"absent":1,"chairNotVoting":1}},{"number":24,"headline":"教育委員会委員の再任に同意","lead":"任期満了に伴い、中村通宏氏を教育委員会委員に再任することについて議会の同意を求めた議案です。","result":"同意","dateSubmitted":"2026-09-29","category":"教育・子育て","votes":{"yes":22,"no":0,"left":0,"absent":1,"chairNotVoting":1}}];
const councilPool=councilBills.map(b=>({
 category:'市議会を見る', title:b.headline, summary:b.lead,
 href:`gikai.html#bill-${b.number}`, medium:'council',bill:b
}));
const graphPool=miniSeries.filter(v=>v[0]&&(!v[2]||(v[3]?.length>1))&& (v[0]!=='treemap'||D.spending?.length)).map(v=>({category:'数字で見る我孫子',title:v[1],href:`city-dashboard.html?category=${v[8]}&chart=${v[0]}&detail=1#chartAreaTitle`,medium:'viz',chart:'dashboard',series:v}));
const dashboardIntroductions={
 monthlynet:'生まれた人と亡くなった人、転入した人と転出した人。人口の変化を二つの動きから比べます。',
 population:'住民基本台帳に記録された我孫子の人口を年ごとに並べ、増減の流れをたどります。',
 households:'世帯数の変化から、我孫子の暮らしの単位がどう変わってきたかを見ていきます。',
 foreign:'外国籍住民の人数はどのように変わっているのか。年ごとの推移を確かめます。',
 births:'出生と死亡の人数を比べ、人口の自然な増減を読み解くためのグラフです。',
 migration:'転入と転出の人数を並べ、我孫子に移り住む人・離れる人の動きを見ます。',
 censuspopulation:'国勢調査の人口を、住民基本台帳とは異なる集計として確認できます。',
 treemap:'市の支出を面積で表すと、どの費目が大きいかがひと目で分かります。',
 spending:'市の予算の使い道を金額と割合で並べ、支出の構成を比べます。',
 revenue:'税金や交付金など、市の収入の構成を可視化します。',
 tax:'市の収入全体に対して、市税がどれくらいの割合を占めるかを見ます。',
 budgetshift:'2025年度と2026年度の一般会計当初予算を並べて比較します。'
};
graphPool.forEach(item=>{item.summary=dashboardIntroductions[item.series[0]]||'市が公表する統計をグラフにし、変化を読み解きます。'});
function councilViz(item){
 const b=item.bill, v=b.votes||{}, yes=Number(v.yes)||0,no=Number(v.no)||0,left=Number(v.left)||0;
 const total=yes+no+left,yesPct=total?yes/total*100:0,noPct=total?no/total*100:0,leftPct=total?left/total*100:0;
 return `<div class="v81-council-preview" role="img" aria-label="2026年9月議会、議案第${b.number}号、${escape(b.result)}、賛成${yes}人、反対${no}人${left?`、退席${left}人`:''}">
   <div class="v81-council-top"><span>2026年9月定例会</span><span>議案第${b.number}号</span></div>
   <div class="v81-council-outcome"><strong>${escape(b.result)}</strong><span>審議終了・採決済み</span></div>
   <div class="v81-council-meter" aria-hidden="true"><span class="v81-council-yes" style="width:${yesPct.toFixed(2)}%"></span><span class="v81-council-no" style="width:${noPct.toFixed(2)}%"></span><span class="v81-council-left" style="width:${leftPct.toFixed(2)}%"></span></div>
   <div class="v81-council-votes"><span>賛成 <b>${yes}</b>人</span><span class="${no?'has-opposition':''}">反対 <b>${no}</b>人</span>${left?`<span>退席 <b>${left}</b>人</span>`:''}</div>
   <div class="v81-council-sub">${escape(b.category)} ・ ${escape(b.dateSubmitted.slice(0,7).replace('-','.'))} 提出</div>
 </div>`;
}
function cover(item){if(item.medium==='council')return councilViz(item);
if(item.medium==='viz')return `<div class="v66-graphic" data-v66-graphic="${escape(item.chart)}">${item.series?'<span class="v66-chart-fallback">集計データを表示します</span>':''}</div>`;
 return item.art||item.fallback||photo('','','')}
/* Explicit editorial dates: the year on municipal data is the target year,
 * the case/issue label is the date this summary was edited, not its source date. */
const issueKeywords=[
 ['人口変化','年齢構成','将来の暮らし'],
 ['地域経済','働く場所','事業所'],
 ['基金','税収','市の財政'],
 ['子育て','学校','教育環境'],
 ['高齢化','医療','介護'],
 ['交通安全','公共交通','通学路'],
 ['市民参加','政策づくり','意見募集'],
 ['施設整備','ごみ','運営費'],
 ['庁舎','公共施設','建替え'],
 ['手賀沼','水質','環境']
];
const budgetKeywords={
 budget:['予算比較','前年度比','重点施策'],spending:['歳出','予算の使い道','11費目'],
 income:['歳入','市税','国・県からのお金'],household:['家計換算','収入と支出','一般会計'],
 overview:['一般会計','512.3億円','2026年度'],future:['財政見通し','基金','公共施設'],
 vision:['財政運営','政策の優先順位','市民参加']
};
const dashboardKeywords={
 monthlynet:['人口動態','自然増減','社会増減'],population:['人口','年次推移'],
 households:['世帯数','暮らし'],foreign:['外国籍住民','人口'],
 births:['出生','死亡','人口動態'],migration:['転入','転出','人口移動'],
 censuspopulation:['国勢調査','人口推移'],treemap:['支出の内訳','面積比較'],
 spending:['歳出','費目別'],revenue:['歳入','収入の内訳'],tax:['市税','歳入割合'],
 budgetshift:['当初予算','年度比較']
};
function editorialDate(item){
 if(item.medium==='council')return `${item.bill.dateSubmitted.replaceAll('-','.')} 提出`;
 if(item.category==='市の重点事業を見る'||item.category==='市のお金')return '2026年度';
 if(item.category==='数字で見る我孫子'){
  const years=item.series?.[2];const final=years?.length?String(years.at(-1)):'';
  return /^\d{4}$/.test(final)?`${final}年まで`:'2026年度';
 }
 return '2026.11.17 編集';
}
function editorialTags(item){
 let tags=[];
 if(item.medium==='council')tags=[item.bill.category,`議案第${item.bill.number}号`,item.bill.result];
 else if(item.category==='市の重点事業を見る')tags=[item.topic||'市の事業',item.region||'我孫子市','2026年度'];
 else if(item.category==='先行事例を見る')tags=[item.location,item.caseCategory,'他自治体の取り組み'];
 else if(item.category==='我孫子市10の論点')tags=issueKeywords[item.issueIndex]||[item.title,'市政の論点'];
 else if(item.category==='市のお金')tags=budgetKeywords[item.chart]||['予算','市の財政'];
 else if(item.category==='数字で見る我孫子')tags=dashboardKeywords[item.series?.[0]]||['市の統計','データ'];
 return [...new Set(tags.map(x=>String(x??'').trim()).filter(x=>x&&x.length<=20))].slice(0,3);
}
function card(item){
 const date=editorialDate(item), tags=editorialTags(item);
 return `<article class="v64-brief v65-brief v66-brief v80-editorial-card ${item.medium==='council'?'v81-council-card':''} ${item.chart==='dashboard'?'v81-dashboard-card':''}"><a class="v64-brief-link" href="${item.href}" aria-label="${escape(item.category)}：${escape(item.title)}の詳細を開く"><div class="v80-card-copy"><div class="v82-card-meta"><span class="v80-category">${escape(item.category)}</span><time class="v82-card-date" title="年度は資料の対象年度、提出日は議案の提出日、それ以外はサマリーの編集基準日です">${escape(date)}</time></div><h3 class="v80-card-title">${escape(item.title)}</h3><p class="v80-card-summary">${escape(item.summary||'公開資料を手がかりに、我孫子のこれからを考えます。')}</p></div><div class="v64-brief-art v65-card-art v80-card-media">${cover(item)}</div><div class="v82-card-tags" aria-label="関連するキーワード">${tags.map(tag=>`<span class="v82-card-tag">${escape(tag)}</span>`).join('')}</div><div class="v80-card-bottom"><span>詳しく見る</span><span class="v80-card-arrow" aria-hidden="true">↗</span></div></a></article>`;
}
function miniHead(label,right){return `<div class="v66-minihead"><b>${escape(label)}</b><span>${escape(right||'')}</span></div>`}
function stacked(el,rows,total,label){const cols=rows.map((r,i)=>r.color||colors[i%colors.length]);const top=rows.reduce((s,r)=>s+r.value,0);el.innerHTML=miniHead(label,'2026年度')+`<div class="v66-stacked-bar">${rows.map((r,i)=>`<span style="width:${r.value/top*100}%;background:${cols[i]}"><b title="${escape(r.name)} ${nfmt(r.value,2)}億円"></b></span>`).join('')}</div><div class="v66-fin-key">${rows.map((r,i)=>`<span><i style="background:${cols[i]}"></i><em>${escape(r.name)}</em><b>${nfmt(r.value/total*100)}%</b></span>`).join('')}</div>`}
function budgetViz(el){const x=[D.budget2025,D.budgetTotal];el.innerHTML=miniHead('一般会計当初予算','億円')+`<div class="v66-budget-mini">${x.map((v,i)=>`<div><span>${2025+i}年度</span><b>${nfmt(v,1)}億</b><i><em style="--v66-goal:${(v/D.budgetTotal*100).toFixed(2)}%;background:${i?'#257c61':'#92b3a3'}"></em></i></div>`).join('')}<strong>＋${nfmt(x[1]-x[0])}億円 <small>前年度比＋${nfmt((x[1]/x[0]-1)*100)}%</small></strong></div>`}
function infoViz(el,type){const key={future:['2027年度編成方針','8.42','億円の収支不足見込み','将来の見通し。2026年度決算の赤字ではありません。'],overview:['2026年度・一般会計','512.3','億円','予算総額は全会計約919億円。'],household:['年収に置き換えると','500','万円','一般会計512.3億円を比例換算'],vision:['財政を見る3つの視点','01 / 02 / 03','','収支の見通し・公共施設の維持・政策の成果']}[type];el.innerHTML=`<div class="v66-info-art"><small>${key[0]}</small><strong>${key[1]}<em>${key[2]}</em></strong><span>${key[3]}</span></div>`}
/* Large card-first graphics (other pages and the finance mini-visuals are untouched). */
function chartRange(series){
 const nums=series.flat().filter(Number.isFinite);const lo=Math.min(...nums),hi=Math.max(...nums);
 if(!nums.length)return[0,1];if(lo===hi)return[lo-1,hi+1];
 const narrow=lo>0 && (hi-lo)/Math.max(1,hi)<.35;
 const a=narrow?Math.max(0,lo-(hi-lo)*.20):Math.min(0,lo);
 return[a,hi+(hi-a)*.075];
}
function bigTrend(el,years,values,values2,label1,label2,unit){
 if(!years?.length||!values?.length)return;
 const dual=Array.isArray(values2)&&values2.length===values.length;
 const lines=[values,...(dual?[values2]:[])];let [min,max]=chartRange(lines);
 const W=320,H=230,L=63,R=10,T=16,B=40,innerW=W-L-R,innerH=H-T-B;
 const asBars=years.length<=5;
 if(asBars && min>0)min=0; // Numeric bars always start at zero to avoid exaggerating differences.
 const x=i=>L+(asBars?(i+.5)/years.length:(years.length===1?0.5:i/(years.length-1)))*innerW;
 const y=v=>T+(max-v)/(max-min)*innerH;
 const num=v=>nfmt(v,Math.abs(v)>=100?0:1);
 let markup='';
 for(let k=0;k<4;k++){
  const val=min+(max-min)*(3-k)/3,py=y(val);
  markup+=`<line x1="${L}" y1="${py.toFixed(2)}" x2="${W-R}" y2="${py.toFixed(2)}" stroke="#d4e2d8" stroke-dasharray="${k===3?'':'3 4'}"/><text x="${L-9}" y="${(py+4).toFixed(2)}" text-anchor="end" fill="#567363" font-size="15">${num(val)}</text>`;
 }
 const tick=new Set([0,years.length-1]);
 const step=Math.max(1,Math.ceil((years.length-1)/4));for(let i=0;i<years.length;i+=step)tick.add(i);
 for(const i of [...tick].sort((a,b)=>a-b)){
  markup+=`<text x="${x(i).toFixed(2)}" y="${H-11}" text-anchor="middle" fill="#526959" font-size="15">${escape(String(years[i]))}</text>`;
 }
 const tones=['#217b5c','#d19a6d'];
 lines.forEach((vals,j)=>{
  if(asBars){
   const spacing=innerW/years.length,barW=Math.min(50,spacing/(dual?2.7:1.8));
   const base=y(Math.max(min,Math.min(max,0)));
   vals.forEach((v,i)=>{
    if(!Number.isFinite(v))return;
    const px=x(i)+(j-(lines.length-1)/2)*(barW+6)-barW/2;
    const py=Math.min(y(v),base),bh=Math.max(1,Math.abs(y(v)-base));
    markup+=`<rect x="${px.toFixed(1)}" y="${py.toFixed(1)}" width="${barW.toFixed(1)}" height="${bh.toFixed(1)}" rx="5" fill="${tones[j]}"><title>${escape(String(years[i]))} ${escape(j?label2:label1)}: ${num(v)}${escape(unit)}</title></rect>`;
   });
  }else{
   const good=vals.map((v,i)=>Number.isFinite(v)?[i,v]:null).filter(Boolean);
   const points=good.map(([i,v])=>`${x(i).toFixed(2)},${y(v).toFixed(2)}`).join(' ');
   if(!j && !dual && good.length){
    const a=good[0],z=good[good.length-1];
    markup+=`<polygon points="${x(a[0]).toFixed(2)},${(H-B).toFixed(2)} ${points} ${x(z[0]).toFixed(2)},${(H-B).toFixed(2)}" fill="#d0e9d9" opacity=".78"/>`;
   }
   markup+=`<polyline points="${points}" fill="none" stroke="${tones[j]}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>`;
   good.forEach(([i,v])=>{
    markup+=`<circle cx="${x(i).toFixed(2)}" cy="${y(v).toFixed(2)}" r="6.5" fill="transparent" stroke="none"><title>${escape(String(years[i]))} ${escape(j?label2:label1)}: ${num(v)}${escape(unit)}</title></circle>`;
   });
   if(good.length){const [i,v]=good[good.length-1];markup+=`<circle cx="${x(i).toFixed(2)}" cy="${y(v).toFixed(2)}" r="5" fill="${tones[j]}" stroke="#fff" stroke-width="2"/>`;}
  }
 });
 const legend=lines.map((vals,i)=>`<span><i style="background:${tones[i]}"></i>${escape(i?label2:label1)}</span>`).join('');
 const last=values.at(-1);
 el.innerHTML=`<div class="v81-chart-head"><span>${escape(String(years[0]))}〜${escape(String(years.at(-1)))}</span><strong>${Number.isFinite(last)?num(last):'—'}<small> ${escape(unit)}</small></strong></div><div class="v81-chart-legend">${legend}</div><svg class="v81-trend-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${escape(label1)}${dual?'と'+escape(label2):''}の年次推移">${markup}</svg>`;
}
function bigTreemap(el){
 const rows=(D.spending||[]).filter(r=>Number.isFinite(Number(r.value))&&r.value>0)
  .map(r=>({name:r.name,value:Number(r.value)})).sort((a,b)=>b.value-a.value);
 if(!rows.length)return;
 const top=rows.slice(0,5),rem=rows.slice(5).reduce((sum,r)=>sum+r.value,0);
 if(rem>0)top.push({name:'その他',value:rem});
 const total=rows.reduce((sum,r)=>sum+r.value,0),W=360,H=205;
 const rects=[];
 function partition(rs,x,y,w,h){
  if(rs.length===1){rects.push({...rs[0],x,y,w,h});return;}
  const total=rs.reduce((sum,r)=>sum+r.value,0),half=total/2;
  let split=1,sum=rs[0].value;
  while(split<rs.length-1 && sum<half){sum+=rs[split].value;split++;}
  const f=sum/total;
  if(w>=h){partition(rs.slice(0,split),x,y,w*f,h);partition(rs.slice(split),x+w*f,y,w*(1-f),h);}
  else{partition(rs.slice(0,split),x,y,w,h*f);partition(rs.slice(split),x,y+h*f,w,h*(1-f));}
 }
 partition(top,0,0,W,H);
 const fills=['#22694f','#3b8066','#5d987b','#92b9a5','#b7d2bc','#dae8dc'];
 el.innerHTML=`<div class="v81-chart-head"><span>一般会計・歳出（面積＝金額）</span><strong>${nfmt(total,1)}<small> 億円</small></strong></div><svg class="v81-treemap" viewBox="0 0 ${W} ${H}" role="img" aria-label="2026年度一般会計の費目別面積比例図">${rects.map((r,i)=>{const fill=fills[i],color=i>3?'#1f4b35':'#fff';const label=r.w>55&&r.h>33;
 return `<g><rect x="${r.x.toFixed(1)}" y="${r.y.toFixed(1)}" width="${r.w.toFixed(1)}" height="${r.h.toFixed(1)}" fill="${fill}" stroke="#f3f8f3" stroke-width="3" rx="3"><title>${escape(r.name)} ${nfmt(r.value,2)}億円 (${nfmt(r.value/total*100,1)}%)</title></rect>${label?`<text x="${(r.x+10).toFixed(1)}" y="${(r.y+22).toFixed(1)}" fill="${color}" font-size="15" font-weight="600">${escape(r.name)}</text><text x="${(r.x+10).toFixed(1)}" y="${(r.y+42).toFixed(1)}" fill="${color}" font-size="16">${nfmt(r.value/total*100,1)}%</text>`:''}</g>`}).join('')}</svg>`;
}
function bigRanking(el,rows,title,unit){
 const good=(rows||[]).filter(r=>r&&Number.isFinite(Number(r.value))&&r.value>=0).map(r=>({...r,value:Number(r.value)})).sort((a,b)=>b.value-a.value);
 if(!good.length)return;
 const total=good.reduce((s,r)=>s+r.value,0);const max=Math.max(good[0].value,.001);
 const top=good.slice(0,4);const rest=good.slice(4).reduce((s,r)=>s+r.value,0);
 const view=rest>0?[...top,{name:'その他',value:rest}]:top;
 el.innerHTML=`<div class="v81-chart-head"><span>${escape(title)}</span><strong>${nfmt(total,1)}<small> ${escape(unit)}</small></strong></div><div class="v81-ranked-list">${view.map((r,i)=>`<div class="v81-ranked-row"><div class="v81-ranked-label"><span>${escape(r.name)}</span><b>${nfmt(r.value/total*100,1)}%</b></div><div class="v81-ranked-track"><span style="width:${(r.value/max*100).toFixed(2)}%;background:${i===4?'#a8beb2':(i===0?'#267d5d':'#72b298')}"></span></div></div>`).join('')}</div>`;
}
function dashboardViz(el,item){
 const v=item.series,key=v[0];
 if(key==='treemap'){bigTreemap(el);return}
 if(key==='spending'){bigRanking(el,D.spending,'一般会計・歳出の構成','億円');return}
 if(key==='revenue'){bigRanking(el,D.revenue,'一般会計・歳入の構成','億円');return}
 if(key==='tax'){
  const tax=D.revenue?.find(x=>x.name==='市税');
  if(tax)bigRanking(el,[tax,{name:'市税以外',value:D.budgetTotal-tax.value}],'市税とそれ以外','億円');
  return;
 }
 bigTrend(el,v[2],v[3],v[4],v[5],v[6],v[7]);
}
function renderGraphic(el,item){if(!el)return;const kind=item.chart;
 if(kind==='dashboard'){dashboardViz(el,item);return;}

 if(kind==='budget')budgetViz(el);else if(kind==='spending')stacked(el,D.spending,D.budgetTotal,'使い道別・11費目');else if(kind==='income')stacked(el,D.revenue.slice(0,8),D.budgetTotal,'収入の内訳');else if(kind==='overview'||kind==='future'||kind==='household'||kind==='vision')infoViz(el,kind);
}
function mount(){
 let holder=document.querySelector('.v61-highlights');
 if(!holder){
   const hero=document.querySelector('main .hero')||document.querySelector('.hero');
   if(!hero)return;
   holder=document.createElement('section');
   holder.className='v61-highlights v64-highlights v65-highlights v66-highlights';
   holder.setAttribute('aria-label','我孫子の注目コンテンツ');
   hero.insertAdjacentElement('afterend',holder);
 }
 
 const selected=[...shuffle(projectPool).slice(0,2),...shuffle(budgetPool).slice(0,2),...shuffle(casePool).slice(0,2),...shuffle(issues).slice(0,2),...shuffle(graphPool).slice(0,2),...shuffle(councilPool).slice(0,2)];
 const arranged=shuffle(selected);holder.classList.add('v65-highlights','v64-highlights','v66-highlights');holder.innerHTML=`<div class="v64-brief-inner"><h2 class="v78-pickup-heading"><span>Pick UP</span> 注目のコンテンツ</h2><div class="v64-brief-grid">${arranged.map(card).join('')}</div></div>`;
 holder.querySelectorAll('.v66-brief').forEach((el,i)=>{const item=arranged[i];if(item.medium==='photo'&&!item.art){const a=el.querySelector('.v65-card-art');if(a)a.insertAdjacentHTML('afterbegin',item.fallback||'')}if(item.medium==='viz')renderGraphic(el.querySelector('.v66-graphic'),item)});
 const cells=[...holder.querySelectorAll('.v66-brief')];if('IntersectionObserver'in window){const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('v65-visible','v66-inview');io.unobserve(e.target)}})},{threshold:.12});cells.forEach(el=>io.observe(el))}else cells.forEach(el=>el.classList.add('v65-visible','v66-inview'));
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();
