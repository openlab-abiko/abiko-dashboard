(()=>{'use strict';
  const D=window.ABIKO_DASHBOARD_DATA;if(!D)return;
  const month=D._periods?.residents?.at(-1);
  if(month){
    const el=document.getElementById('v37PopulationAsOf');
    if(el)el.textContent=month.replace(/^(\d{4})-(\d{2})$/,'$1.$2.01');
  }
  const stats=document.querySelectorAll('.headline-stats .head-stat');
  if(stats.length>=4){
    const R=D.residents,n=(key)=>Number(R[key]?.at(-1)).toLocaleString('ja-JP');
    const values=[[n('population'),'人'],[n('households'),'世帯'],[Number(D.budgetTotal).toLocaleString('ja-JP'),'億円'],[n('foreign'),'人']];
    [0,1,3].forEach(i=>{const b=stats[i].querySelector('b');if(b)b.innerHTML=`${values[i][0]}<small>${values[i][1]}</small>`;const p=stats[i].querySelector('p');if(p&&month)p.textContent=month.replace(/(\d{4})-(\d{2})/,'$1.$2')+'.01 現在';});
  }
  const note=document.querySelector('.sidebar-bottom p');
  if(note&&D._automation?.lastSuccessfulSync)note.textContent=`人口・人口動態：最終自動取得 ${D._automation.lastSuccessfulSync.slice(0,10)}。財政・教育・環境は別の公表時点です。`;
})();
