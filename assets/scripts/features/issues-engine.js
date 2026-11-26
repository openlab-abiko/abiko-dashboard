/* ORIGINAL: issues-v40.js */
(()=>{'use strict';
const issue6Markup = `<header class="issue-article-header"><span class="issue-chapter">ISSUE 06 / MOBILITY</span><h3>東西に長いまちで、どう移動を支える？</h3><p class="issue-lead">我孫子市は、我孫子・天王台・湖北・新木・布佐の5地域が東西に連なるまちです。道路を広げるかどうかだけでなく、主要拠点までの行きやすさ、駅までの近さ、車を使えない人の移動手段、そして地域公共交通をどう持続させるかをまとめて考える必要があります。</p></header>
<div class="issue-facts">
  <div class="issue-stat"><span class="issue-stat-label">5地域</span><strong>東西に連なる<small>生活圏</small></strong><span class="issue-stat-context">我孫子・天王台・湖北・新木・布佐</span></div>
  <div class="issue-stat"><span class="issue-stat-label">178件</span><strong>人身事故<small>/2025年</small></strong><span class="issue-stat-context">安全の課題は今も残る</span></div>
  <div class="issue-stat"><span class="issue-stat-label">令和7〜11年度</span><strong>地域公共交通計画<small>を運用中</small></strong><span class="issue-stat-context">運転士不足・利用減少への対応が論点</span></div>
</div>
<div class="issue-visual issue-transport-visual">
  <div class="issue-chart-head"><div><span class="issue-chart-tag">EAST–WEST MOBILITY</span><h4>まずは、我孫子の移動を「東西の連なり」で見る</h4></div></div>
  <div class="issue-transport-axis">
    <div class="axis-line"></div>
    <div class="axis-stop"><b>我孫子</b><span>市役所・アビスタに最も近い。市の中心機能が集まる。</span></div>
    <div class="axis-stop"><b>天王台</b><span>駅勢圏が大きく、我孫子方面との行き来も多い。</span></div>
    <div class="axis-stop"><b>湖北</b><span>駅と生活拠点をどう結ぶかが鍵になる。</span></div>
    <div class="axis-stop"><b>新木</b><span>駅アクセスと日常の足の確保が課題。</span></div>
    <div class="axis-stop"><b>布佐</b><span>東端に位置し、移動時間差が最も大きい。</span></div>
  </div>
  <p class="issue-chart-caption">東西に細長い市域のため、同じ「市内移動」でも、どの地域からどの拠点へ向かうかで体感はかなり変わります。</p>
</div>
<section class="issue-access-section">
  <div class="issue-chart-head"><div><span class="issue-chart-tag">ACCESS MATRIX</span><h4>主要拠点まで、どれくらいかかる？</h4></div></div>
  <p class="issue-access-note">各地域の代表地点から、<b>市役所</b>・<b>アビスタ</b>までの概算時間です。厳密な最短経路ではなく、比較しやすさを重視した目安です。鉄道は「代表駅まで＋JR＋徒歩・バス」を含みます。市役所は我孫子駅南口から路線バス約10分、アビスタは我孫子駅南口から徒歩約10分または路線バス約4分、天王台駅南口からアビスタ前までバス約15分という市の案内を基準に、各地域を東西比較用に並べています。</p>
  <div class="access-matrices">
    <article class="access-card">
      <div class="access-card-head"><span>CITY HALL</span><h5>市役所まで</h5></div>
      <div class="access-table-wrap">
        <table class="access-table">
          <thead><tr><th>地域</th><th>車</th><th>鉄道</th><th>バス</th></tr></thead>
          <tbody>
            <tr><th>我孫子</th><td class="low">約8分</td><td class="low">約15分</td><td class="low">約10分</td></tr>
            <tr><th>天王台</th><td class="low">約12分</td><td class="mid">約22分</td><td class="mid">約18分</td></tr>
            <tr><th>湖北</th><td class="mid">約19分</td><td class="mid">約27分</td><td class="high">約31分</td></tr>
            <tr><th>新木</th><td class="high">約23分</td><td class="high">約31分</td><td class="high">約38分</td></tr>
            <tr><th>布佐</th><td class="high">約28分</td><td class="high">約37分</td><td class="high">約47分</td></tr>
          </tbody>
        </table>
      </div>
    </article>
    <article class="access-card">
      <div class="access-card-head"><span>ABISTA</span><h5>アビスタまで</h5></div>
      <div class="access-table-wrap">
        <table class="access-table">
          <thead><tr><th>地域</th><th>車</th><th>鉄道</th><th>バス</th></tr></thead>
          <tbody>
            <tr><th>我孫子</th><td class="low">約6分</td><td class="low">約10分</td><td class="low">約4分</td></tr>
            <tr><th>天王台</th><td class="low">約12分</td><td class="low">約16分</td><td class="mid">約15分</td></tr>
            <tr><th>湖北</th><td class="mid">約21分</td><td class="mid">約25分</td><td class="high">約33分</td></tr>
            <tr><th>新木</th><td class="high">約25分</td><td class="high">約30分</td><td class="high">約39分</td></tr>
            <tr><th>布佐</th><td class="high">約31分</td><td class="high">約36分</td><td class="high">約48分</td></tr>
          </tbody>
        </table>
      </div>
    </article>
  </div>
</section>
<section class="issue-station-section">
  <div class="issue-chart-head"><div><span class="issue-chart-tag">STATION ACCESS</span><h4>駅までの近さは、地域ごとにどう違う？</h4></div></div>
  <div class="station-grid">
    <article class="station-card"><h5>我孫子地区 → 我孫子駅</h5><div class="station-metrics"><span>徒歩 <b>約12分</b></span><span>自転車 <b>約5分</b></span><span>バス <b>約8分</b></span></div></article>
    <article class="station-card"><h5>天王台地区 → 天王台駅</h5><div class="station-metrics"><span>徒歩 <b>約10分</b></span><span>自転車 <b>約4分</b></span><span>バス <b>約7分</b></span></div></article>
    <article class="station-card"><h5>湖北地区 → 湖北駅</h5><div class="station-metrics"><span>徒歩 <b>約12分</b></span><span>自転車 <b>約5分</b></span><span>バス <b>約8分</b></span></div></article>
    <article class="station-card"><h5>新木地区 → 新木駅</h5><div class="station-metrics"><span>徒歩 <b>約14分</b></span><span>自転車 <b>約6分</b></span><span>バス <b>約10分</b></span></div></article>
    <article class="station-card"><h5>布佐地区 → 布佐駅</h5><div class="station-metrics"><span>徒歩 <b>約13分</b></span><span>自転車 <b>約5分</b></span><span>バス <b>約9分</b></span></div></article>
  </div>
</section>
<div class="issue-transport-grid">
  <div class="transport-card"><h5>① 東西軸の時間差</h5><p>我孫子地区と布佐地区では、市役所やアビスタに向かう体感時間が大きく違います。市内平均ではなく、地域差を見ることが大切です。</p></div>
  <div class="transport-card"><h5>② 駅までのラストワンマイル</h5><p>駅そのものより、「駅までどう行くか」が暮らしやすさを左右します。徒歩圏外の住宅地では、バスや送迎が日常の前提になります。</p></div>
  <div class="transport-card"><h5>③ 歩く・自転車で行ける安全性</h5><p>通学、買い物、通院で歩く人・自転車利用者にとって安全かどうかも重要です。人身事故の数字だけでなく、危険箇所の体感も合わせて見たいところです。</p></div>
  <div class="transport-card"><h5>④ スマートモビリティ</h5><p>予約型・乗合型交通、デジタル時刻案内、乗継支援、小さな実証を通じた見直しなど、地域ごとに合う手法を探っていく視点が必要です。</p></div>
</div>
<div class="issue-reading">
  <div><h4>数字からわかること</h4><p>交通事故の件数だけでは、我孫子の移動課題は見えません。公共交通計画では、利用者減少や運転士不足が課題とされており、移動手段そのものをどう維持するかが問われています。</p></div>
  <div><h4>暮らしとの関係</h4><p>駅前が便利でも、そこまで行けなければ暮らしやすさにはつながりません。高齢者、子ども連れ、車を使えない人にとって、どの地域で移動の不利が大きいかを比べて考える必要があります。</p></div>
</div>
<div class="issue-questions"><h4>市民として考えてみたいこと</h4><ol><li>東西に長い我孫子で、どの地域の移動課題を優先して支えるべきでしょうか。</li><li>路線バス、あびバス、予約型交通、デジタル案内のうち、どの組み合わせが地域ごとに合いそうですか。</li><li>駅前整備、通学路安全、歩行環境改善、公共交通維持のあいだで、どこに予算を配分したいですか。</li></ol></div>
<section class="issue-smartmobility-examples">
  <h4>先行事例を見る</h4>
  <div class="issue-smartmobility-cards">
    <article><span>SMART MOBILITY</span><h5>会津若松市</h5><p>デジタルを使った交通・行政サービス連携を進めてきた代表例。技術そのものより、地域で使い続けられる仕組みづくりが参考になります。</p><a href="https://www.city.aizuwakamatsu.fukushima.jp/docs/2017022200034/" target="_blank" rel="noopener">公式情報を見る ↗</a></article>
    <article><span>ON-DEMAND</span><h5>つくば市</h5><p>AIオンデマンド交通の実証・運用で知られる例。固定路線では拾いにくい需要にどう対応するかを考える材料になります。</p><a href="https://www.city.tsukuba.lg.jp/shisei/torikumi/1007430/1007436.html" target="_blank" rel="noopener">公式情報を見る ↗</a></article>
    <article><span>WALK & BIKE</span><h5>ロンドン・カムデン区</h5><p>スクールストリートのように、道路を大きく造り替えなくても、時間帯運用で歩行安全を高める方法があります。</p><a href="https://www.camden.gov.uk/healthy-school-streets" target="_blank" rel="noopener">公式情報を見る ↗</a></article>
  </div>
</section>
<div class="issue-source"><p>※時間は比較しやすさを重視した概算です。地域内の出発地点、混雑、時刻表、乗継条件により変動します。市役所・アビスタへの基準時間は市の施設案内ページを参照し、各地域については代表地点からの東西比較用に整理しています。</p><div class="issue-source-title">出典・関連する一次資料</div><ul><li><a href="https://www.city.abiko.chiba.jp/kurashi/kotsu_douro/anzen/shiboujiko.html" rel="noopener noreferrer" target="_blank">我孫子市内の交通事故発生状況 <span aria-hidden="true">↗</span></a></li><li><a href="https://www.city.abiko.chiba.jp/shisei/keikauhoushin/toshikiban/koutsuukeikaku.html" rel="noopener noreferrer" target="_blank">我孫子市地域公共交通計画 <span aria-hidden="true">↗</span></a></li><li><a href="https://www.city.abiko.chiba.jp/shisei/shiyakusho/honchosha.html" rel="noopener noreferrer" target="_blank">市役所本庁舎案内 <span aria-hidden="true">↗</span></a></li><li><a href="https://www.city.abiko.chiba.jp/event/shisetsu/abista.html" rel="noopener noreferrer" target="_blank">我孫子市生涯学習センター「アビスタ」 <span aria-hidden="true">↗</span></a></li></ul></div>
`;

const style = `.issue-transport-visual,.issue-access-section,.issue-station-section{display:grid;gap:18px}
.issue-transport-axis{position:relative;display:grid;grid-template-columns:repeat(5,1fr);gap:10px;padding:20px 0 0}
.issue-transport-axis .axis-line{position:absolute;left:2%;right:2%;top:25px;height:6px;background:linear-gradient(90deg,#6fc2ae,#8fc8e8,#f2c27b,#d9b5f5,#f3a2ae);border-radius:999px}
.issue-transport-axis .axis-stop{position:relative;background:#fff;border:1px solid rgba(24,51,42,.08);border-radius:18px;padding:44px 12px 14px;box-shadow:0 10px 24px rgba(34,48,58,.05)}
.issue-transport-axis .axis-stop::before{content:'';position:absolute;top:14px;left:50%;transform:translateX(-50%);width:18px;height:18px;border-radius:50%;background:#1d7f69;box-shadow:0 0 0 5px #dff2eb}
.issue-transport-axis .axis-stop b{display:block;margin-bottom:6px;font-size:15px}
.issue-transport-axis .axis-stop span{display:block;font-size:12.5px;line-height:1.55;color:#5e6d66}
.issue-access-note{margin:0;color:#4f6159;line-height:1.8;font-size:13.5px}
.access-matrices{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
.access-card,.issue-transport-grid .transport-card,.issue-smartmobility-cards article,.station-card{background:#fff;border:1px solid rgba(24,51,42,.08);border-radius:18px;padding:16px 16px 14px;box-shadow:0 10px 24px rgba(34,48,58,.05)}
.access-card-head{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:10px}.access-card-head span{display:inline-block;padding:4px 8px;border-radius:999px;background:#eef4f1;color:#56726a;font-size:11px;font-weight:700;letter-spacing:.04em}.access-card-head h5{margin:0;font-size:17px}
.access-table-wrap{overflow:auto}.access-table{width:100%;border-collapse:separate;border-spacing:0 8px;min-width:320px}.access-table thead th{font-size:12px;color:#6b7a74;font-weight:800;text-align:center;padding:0 8px 4px}.access-table thead th:first-child{text-align:left}.access-table tbody th,.access-table tbody td{padding:11px 10px;border-top:1px solid rgba(24,51,42,.07);border-bottom:1px solid rgba(24,51,42,.07);background:#f8faf8}.access-table tbody th{border-left:1px solid rgba(24,51,42,.07);border-radius:12px 0 0 12px;text-align:left;font-size:13px;white-space:nowrap}.access-table tbody td:last-child{border-right:1px solid rgba(24,51,42,.07);border-radius:0 12px 12px 0}.access-table tbody td{text-align:center;font-weight:800;font-size:13px;color:#26353b}.access-table td.low{background:#e6f5ef}.access-table td.mid{background:#eef3fb}.access-table td.high{background:#f7ede1}
.station-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:12px}.station-card h5{margin:0 0 10px;font-size:14px;line-height:1.45}.station-metrics{display:grid;gap:6px}.station-metrics span{display:flex;justify-content:space-between;gap:8px;padding:7px 10px;border-radius:10px;background:#f3f7f5;font-size:12.5px;color:#4f6159}.station-metrics b{font-size:13px;color:#203138}
.issue-transport-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.issue-transport-grid h5,.issue-smartmobility-cards h5{margin:0 0 8px;font-size:15px}.issue-transport-grid p,.issue-smartmobility-cards p{margin:0;color:#485850;line-height:1.7;font-size:13.5px}
.issue-smartmobility-examples{margin-top:22px}.issue-smartmobility-examples h4{margin:0 0 12px}.issue-smartmobility-cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.issue-smartmobility-cards article span{display:inline-block;margin-bottom:8px;padding:4px 8px;border-radius:999px;background:#eef4f1;color:#56726a;font-size:11px;font-weight:700;letter-spacing:.04em}.issue-smartmobility-cards article a{display:inline-block;margin-top:12px;font-weight:700}
@media (max-width: 1100px){.station-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media (max-width: 900px){.access-matrices,.issue-smartmobility-cards,.issue-transport-grid{grid-template-columns:1fr}.station-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width: 640px){.issue-transport-axis{grid-template-columns:1fr}.issue-transport-axis .axis-line{left:24px;right:auto;top:18px;bottom:18px;width:6px;height:auto;background:linear-gradient(180deg,#6fc2ae,#8fc8e8,#f2c27b,#d9b5f5,#f3a2ae)}.issue-transport-axis .axis-stop{padding:14px 14px 14px 50px}.issue-transport-axis .axis-stop::before{left:24px;top:50%;transform:translate(-50%,-50%)}.station-grid{grid-template-columns:1fr}.access-table tbody th,.access-table tbody td{padding:10px 8px;font-size:12.5px}}
`;

function apply(){
  if(document.getElementById('issues-v40-style')==null){const st=document.createElement('style');st.id='issues-v40-style';st.textContent=style;document.head.appendChild(st)}
  const tab=document.querySelector('#issue-choice-06 strong');
  if(tab) tab.textContent='東西に長いまちの移動';
  const panel=document.getElementById('issue-06');
  if(panel && !panel.dataset.v40Patched){panel.innerHTML=issue6Markup;panel.dataset.v40Patched='true';}
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>setTimeout(apply,0),{once:true});
else setTimeout(apply,0);
})();

;
/* ORIGINAL: issue-transport-v42.js */
(()=>{'use strict';
const DATA={
 cityhall:{car:[[7,13],[10,18],[17,27],[23,35],[27,41]],rail:[[11,18],[17,28],[22,34],[27,40],[32,46]],bus:[[11,18],null,null,null,null]},
 abista:{car:[[5,11],[10,18],[18,29],[23,36],[28,43]],rail:[[10,14],[13,22],[18,28],[22,33],[26,38]],bus:[[5,12],[16,24],null,null,null]}
};
const labels=['我孫子','天王台','湖北','新木','布佐'];
const modes={car:'車',rail:'鉄道＋徒歩・バス',bus:'直通バス'};
function init(){
 if(document.body.dataset.view!=='issues')return;
 const holder=document.getElementById('issue-06');if(!holder||holder.dataset.v42)return;
 const old=holder.querySelector('.issue-access-section');const station=holder.querySelector('.issue-station-section');
 if(!old||!station)return;
 const access=document.createElement('section');access.className='v42-access-explorer';
 access.innerHTML=`<div class="v42-access-heading"><span>ACCESSIBILITY / 05 DISTRICTS</span><h4>この街では、どこへ行くにも同じくらい便利？</h4><p>市の東西に連なる5駅を起点として、主要な公共施設までの移動の差を比較します。<strong>以下の範囲値は概算モデル</strong>であり、時刻表・実走行・経路検索の測定値ではありません。</p></div>
 <div class="v42-access-controls"><div class="v42-control-block"><span class="v42-control-label">目的地</span><div class="v42-segments" role="group" aria-label="目的地"><button type="button" data-destination="cityhall" aria-pressed="true">市役所</button><button type="button" data-destination="abista" aria-pressed="false">アビスタ</button></div></div><div class="v42-control-block"><span class="v42-control-label">移動手段</span><div class="v42-segments" role="group" aria-label="交通手段"><button type="button" data-transport-mode="car" aria-pressed="true">車</button><button type="button" data-transport-mode="rail" aria-pressed="false">鉄道＋徒歩・バス</button><button type="button" data-transport-mode="bus" aria-pressed="false">直通バス</button></div></div></div>
 <div id="v42JourneyRows" class="v42-journey-rows" aria-live="polite"></div>
 <div class="v42-access-footer"><span>※ 表示時間は駅周辺からの片道目安。車は道路混雑、鉄道は列車待ち・駅からの歩行などで変わります。バスは直通の運行が確認できる駅だけ表示しています。</span><details><summary>数値の根拠と一覧表を見る ＋</summary><div class="v42-method"><p>鉄道の駅間乗車時間はJR東日本公表の2026年11月時刻表（我孫子－湖北約8分、新木約12分、布佐約15〜16分）を参照。市役所へは我孫子駅からバス約10分＋徒歩1分、アビスタへは我孫子駅から徒歩10分またはバス約4分＋徒歩1分、天王台駅からアビスタへはバス約15分＋徒歩1分が市の公式案内です。</p><p><b>その他の数値</b>は道路距離・交通接続を仮定した幅を持つ編集上の概算です。GTFS-JPの路線別ダイヤを経路計算に接続したものではありません。実際の移動・公共交通計画の評価には使わず、地域差を考える導入として利用してください。</p><p><a target="_blank" rel="noopener noreferrer" href="https://timetables.jreast.co.jp/2611/train/015/018341.html">JR時刻表 ↗</a>　<a target="_blank" rel="noopener noreferrer" href="https://www.city.abiko.chiba.jp/shisei/shiyakusho/honchosha.html">市役所アクセス ↗</a>　<a target="_blank" rel="noopener noreferrer" href="https://www.city.abiko.chiba.jp/event/shisetsu/abista.html">アビスタアクセス ↗</a>　<a target="_blank" rel="noopener noreferrer" href="https://www.city.abiko.chiba.jp/shisei/opendata/GTFS-JP.html">市のバスGTFS-JP ↗</a></p><div id="v42AccessTable"></div></div></details></div>`;
 old.replaceWith(access);
 const stationUI=document.createElement('section');stationUI.className='v42-station-access';
 stationUI.innerHTML=`<div class="v42-access-heading"><span>RAIL AXIS / EAST–WEST</span><h4>JR我孫子駅まで、何分？</h4><p>5地域を代表する駅から、JR我孫子駅までの<strong>列車の乗車時間</strong>を比較します。運転日の時刻表に基づく値で、待ち時間は含みません。</p></div><div class="v42-rail-list">${[0,3,8,12,16].map((v,i)=>`<div class="v42-rail-row"><b>${labels[i]}</b><div class="v42-rail-track"><span style="width:${Math.max(2,v/16*100)}%"></span></div><strong>${v===0?'起点':v+'分'}</strong></div>`).join('')}</div><div class="v42-lastmile"><div><span class="v42-control-label">駅までの距離から考える</span><h5>家から駅までの移動時間を試算</h5><p>道路に沿った経路距離を仮定。どの駅にも共通する簡易試算で、地区全体の平均ではありません。</p><div class="v42-segments" role="group" aria-label="駅までの距離"><button type="button" data-distance="500" aria-pressed="true">500m</button><button type="button" data-distance="1000" aria-pressed="false">1km</button><button type="button" data-distance="1500" aria-pressed="false">1.5km</button><button type="button" data-distance="2000" aria-pressed="false">2km</button></div></div><div id="v42LastMileResult" class="v42-lastmile-result" aria-live="polite"></div></div><p class="v42-station-note">人口に対する「駅徒歩15分圏内の住民割合」の算出には、道路ネットワークと人口メッシュの解析が別途必要です。現段階では地区の徒歩時間を一律に決めつけていません。</p>`;
 station.replaceWith(stationUI);
 let destination='cityhall',mode='car',distance=500;
 const render=()=>{
  access.querySelectorAll('[data-destination]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.destination===destination)));
  access.querySelectorAll('[data-transport-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.transportMode===mode)));
  const arr=DATA[destination][mode];const max=50;
  access.querySelector('#v42JourneyRows').innerHTML=arr.map((v,i)=>{const value=v?`${v[0]}–${v[1]}分`:'経路未確認';const mid=v?(v[0]+v[1])/2:0;return `<div class="v42-journey-row"><b class="v42-journey-name">${String(i+1).padStart(2,'0')} <span>${labels[i]}駅</span></b><div class="v42-journey-track" title="${value}"><i style="width:${v?Math.max(2,mid/max*100):0}%" class="${v?'':'is-unknown'}"></i></div><strong class="v42-journey-time ${v?'':'is-unknown'}">${value}</strong></div>`}).join('');
  const tbl=access.querySelector('#v42AccessTable');tbl.innerHTML=`<table class="v42-access-table"><thead><tr><th>起点</th><th>車</th><th>鉄道＋徒歩・バス</th><th>直通バス</th></tr></thead><tbody>${labels.map((name,i)=>`<tr><th>${name}駅</th>${['car','rail','bus'].map(m=>{const v=DATA[destination][m][i];return `<td>${v?`${v[0]}–${v[1]}分`:'未確認'}</td>`}).join('')}</tr>`).join('')}</tbody></table>`;
 };
 const renderDistance=()=>{stationUI.querySelectorAll('[data-distance]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.distance)===distance)));stationUI.querySelector('#v42LastMileResult').innerHTML=`<span>距離 <strong>${(distance/1000).toFixed(distance%1000?'1':'0')}km</strong></span><div>徒歩 <b>約${Math.ceil(distance/80)}分</b><small>80m/分として計算</small></div><div>自転車 <b>約${Math.ceil(distance/200)}分</b><small>200m/分として計算</small></div>`};
  access.querySelectorAll('[data-destination]').forEach(b=>b.addEventListener('click',()=>{destination=b.dataset.destination;render()}));access.querySelectorAll('[data-transport-mode]').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.transportMode;render()}));stationUI.querySelectorAll('[data-distance]').forEach(b=>b.addEventListener('click',()=>{distance=Number(b.dataset.distance);renderDistance()}));
  render();renderDistance();holder.dataset.v42='true';
 }
 function wait(){const panel=document.getElementById('issue-06');if(panel?.querySelector('.issue-access-section'))init();else setTimeout(wait,40)}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(wait,40),{once:true});else setTimeout(wait,40);
})();

;
/* ORIGINAL: v62-issues.js */
(()=>{'use strict';const init=()=>{if(document.body.dataset.view!=='issues')return;const section=document.querySelector('#featurePanels > #issues');const wrap=section?.querySelector(':scope > .wrap');const intro=wrap?.querySelector(':scope > .v38-page-intro');if(!intro||section.querySelector('.civic-unified-hero'))return;const hero=document.createElement('div');hero.className='civic-unified-hero press-hero';const inside=document.createElement('div');inside.className='civic-hero-inner press-wrap';inside.append(intro);hero.append(inside);section.prepend(hero);};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();})();

