(()=>{
 'use strict';
 const root=document.getElementById('compare');if(!root)return;
 const posts=window.ABIKO_STORIES||ABIKO_STORIES;
 const groups=[['all','すべて'],['child','子育て・教育'],['district','まちづくり'],['culture','文化・市民参加'],['circular','資源循環'],['build','公共施設'],['walking','歩く・移動']];
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const abroad=a=>/^(米国|英国|スペイン|フランス|フィンランド|ドイツ|デンマーク|オランダ|スウェーデン|台湾|韓国|中国|カナダ|オーストラリア)/.test(a.location);
 const picture=a=>a.image?`<img loading="lazy" referrerpolicy="no-referrer" alt="${esc(a.photoSubject||a.title)}" src="${esc(a.image)}" onerror="this.style.display='none';this.parentElement.classList.add('photo-error')">`:'<span class="press-photo-placeholder">公式資料で事例を見る</span>';
 const credit=a=>{
   if(!a.image||!a.photoCreator||!a.photoSource||!a.photoLicense||!a.photoLicenseUrl)return '';
   return `<small class="press-index-credit">写真：<a href="${esc(a.photoSource)}">${esc(a.photoCreator)}</a> ／ <a href="${esc(a.photoLicenseUrl)}">${esc(a.photoLicense)}</a></small>`;
 };
 const url=a=>'articles/'+encodeURIComponent(a.slug)+'.html';
 const bydate=[...posts].sort((a,b)=>b.published.localeCompare(a.published)||a.order-b.order);
 const picked=posts.find(a=>a.slug==='echigo-tsumari')||posts[0];
 const tile=(a,cls='')=>`<article class="press-teaser ${cls}"><a href="${url(a)}" class="press-teaser-media">${picture(a)}</a><div class="press-teaser-copy"><div class="press-kicker">${esc(a.categoryLabel)} <span class="press-location">${esc(a.location)}</span></div><h3><a href="${url(a)}">${esc(a.headline)}</a></h3><p>${esc(a.deck)}</p><span class="press-date">${esc(a.published)} 公開</span>${credit(a)}</div></article>`;
 const feed=a=>`<li><a href="${url(a)}"><time datetime="${esc(a.published)}">${esc(a.published).replace(/-/g,'.')}</time><span>${esc(a.headline)}</span><small>${esc(a.categoryLabel)} ／ ${abroad(a)?'海外':'国内'}</small></a></li>`;
 root.innerHTML=`<div class="press-index">
  <div class="press-hero" aria-labelledby="pressPageTitle"><div class="press-wrap press-hero-inner"><div class="press-overline">03 / CIVIC CASE JOURNAL</div><h1 id="pressPageTitle">先行事例を見る</h1><p>ほかのまちは、同じような課題にどう向き合ったのか。国内外の政策や市民の実践を、背景・仕組み・難しさまで読み解きます。</p></div></div>
  <div class="press-wrap press-index-content"><nav class="press-tabs" aria-label="事例のカテゴリ" id="pressTabs">${groups.map(([key,label])=>`<button type="button" data-group="${key}" aria-pressed="${key==='all'}">${label}</button>`).join('')}</nav>
   <div class="press-newsgrid"><section class="press-featured" aria-labelledby="pressFeatureTitle"><div class="press-column-heading"><h2 id="pressFeatureTitle">おすすめ事例</h2><span></span></div><div id="pressFeature"></div><div id="pressFeatureMore" class="press-feature-more" aria-label="おすすめの次に読む事例"></div></section>
   <section class="press-center" aria-labelledby="pressMoreTitle"><div class="press-column-heading"><h2 id="pressMoreTitle">そのほかの事例</h2><span id="pressCount"></span></div><div id="pressStories"></div></section>
   <aside class="press-latest" aria-labelledby="pressLatestTitle"><div class="press-column-heading press-latest-heading"><h2 id="pressLatestTitle">すべての新着事例</h2><span></span></div><div class="press-region-tabs" role="group" aria-label="新着事例の掲載地域"><button type="button" class="press-region-tab" data-region="domestic" aria-pressed="true">国内</button><button type="button" class="press-region-tab" data-region="international" aria-pressed="false">海外</button></div><ol class="press-latest-list" id="pressLatest" aria-live="polite"></ol><p class="press-region-count" id="pressRegionCount"></p></aside></div>
  <p class="press-index-note">※ 事例の評価は本サイトによる編集・考察です。制度の現状や実施効果は、各事例に掲げる原資料をご確認ください。写真は再利用条件を確認できたものに限り掲載し、表示に合わせてトリミングする場合があります。</p>
  </div></div>`;
 const groupBtns=[...root.querySelectorAll('[data-group]')];
 const regionBtns=[...root.querySelectorAll('[data-region]')];
 function renderRegion(region){
  regionBtns.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.region===region)));
  const filtered=bydate.filter(a=>region==='international'?abroad(a):!abroad(a));
  root.querySelector('#pressLatest').innerHTML=filtered.map(feed).join('');
  root.querySelector('#pressRegionCount').textContent=`${region==='domestic'?'国内':'海外'}の事例 ${filtered.length}件 / 全${posts.length}件`;
 }
 function render(g){
  groupBtns.forEach(b=>b.setAttribute('aria-pressed',String(g===b.dataset.group)));
  const articles=(g==='all'?bydate:bydate.filter(a=>a.category===g));
  const featured=g==='all'?picked:(articles.find(a=>a.image)||articles[0]);
  root.querySelector('#pressFeature').innerHTML=featured?`<article class="press-feature"><a class="press-feature-image" href="${url(featured)}">${picture(featured)}</a><div class="press-kicker">${esc(featured.categoryLabel)} <span class="press-location">${esc(featured.location)}</span></div><h3><a href="${url(featured)}">${esc(featured.headline)}</a></h3><p>${esc(featured.deck)}</p>${credit(featured)}<a class="press-readmore" href="${url(featured)}">事例を読む <span aria-hidden="true">→</span></a></article>`:'';
  const rest=articles.filter(a=>a!==featured);
  // Continuous reading in both columns: the left column must not end after the hero article.
  // Give the first few items to the center to retain the classic newspaper overview.
  const left=rest.filter((a,i)=>i>=2&&i%2===0);
  const center=rest.filter((a,i)=>i<2||i%2!==0);
  root.querySelector('#pressFeatureMore').innerHTML=left.map(a=>tile(a,'press-teaser-under-feature')).join('');
  root.querySelector('#pressStories').innerHTML=center.length?center.map(a=>tile(a)).join(''):(left.length?'':'<p class="press-empty">このカテゴリの事例は現在1件です。</p>');
  root.querySelector('#pressCount').textContent=articles.length+'件';
 }
 groupBtns.forEach(b=>b.addEventListener('click',()=>render(b.dataset.group)));
 regionBtns.forEach(b=>b.addEventListener('click',()=>renderRegion(b.dataset.region)));
 const params=new URLSearchParams(location.search),filter=params.get('category');
 render(groups.some(g=>g[0]===filter)?filter:'all');renderRegion('domestic');
})();
