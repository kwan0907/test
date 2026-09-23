(()=>{
  if(window.__MFST_SMART_V2__)return;window.__MFST_SMART_V2__=true;
  const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
  const text=e=>((e&&e.textContent)||'').replace(/\s+/g,' ').trim();
  const num=v=>{const n=parseFloat(String(v==null?'':v).replace(/[^0-9.\-]/g,''));return Number.isFinite(n)?n:NaN};
  function horseCount(){let max=0;$$('tr').forEach(row=>{const n=parseInt((row.querySelector('td')?.textContent||'').trim(),10);if(n>max&&n<=24)max=n});return Math.max(14,max)}
  function state(){
    const type=$('.mfst-tab.active[data-type]')?.dataset.type||'qin';
    const selected=$$('.mfst-num.on[data-n]').map(x=>Number(x.dataset.n)).filter(Number.isFinite).sort((a,b)=>a-b);
    const banker=$('#mfst-banker')?.classList.contains('on')?(selected[0]||null):null;
    const field=!!($('#mfst-field')?.classList.contains('on')||$('.mfst-num[data-field="1"]')?.classList.contains('on'));
    return{type,selected,banker,field};
  }
  function combos(s){
    const all=Array.from({length:horseCount()},(_,i)=>i+1),out=[];
    if(s.type==='win'||s.type==='place')return(s.field?all:s.selected).map(h=>({h:[h]}));
    if(s.type==='qin'||s.type==='qpl'){
      if(s.banker){
        const legs=s.field?all.filter(x=>x!==s.banker):s.selected.filter(x=>x!==s.banker);
        legs.forEach(x=>out.push({h:[Math.min(s.banker,x),Math.max(s.banker,x)]}));
      }else{
        const src=s.field?all:s.selected;
        for(let i=0;i<src.length;i++)for(let j=i+1;j<src.length;j++)out.push({h:[src[i],src[j]]});
      }
      return out;
    }
    return[];
  }
  function race(){const e=$('[id^="raceno_"].active,[id^="raceno_"].selected'),m=e&&e.id.match(/raceno_(\d+)/);return m?Number(m[1]):1}
  function directOdds(type,c){
    const a=c.h[0],b=c.h[1],r=race(),codes=type==='qin'?['QIN','Q']:type==='qpl'?['QPL','QP']:type==='win'?['WIN']:['PLA'];
    for(const code of codes){
      const ids=b==null?['odds_'+code+'_'+r+'_'+a]:['odds_'+code+'_'+r+'_'+a+'_'+b,'odds_'+code+'_'+r+'_'+b+'_'+a,'odds_'+code+'_'+a+'_'+b,'odds_'+code+'_'+b+'_'+a];
      for(const id of ids){const v=num(text(document.getElementById(id)));if(v>1)return v}
    }
    return NaN;
  }
  function matrixMaps(){
    const n=horseCount();
    return $$('table').filter(t=>!t.closest('#mfst-root')&&t.getClientRects().length&&t.getBoundingClientRect().width>250).map(t=>{
      const map=new Map(),rows=$$('tr',t);let rr=0;
      for(const row of rows){
        if(rr>=n-1)break;
        const vals=$$('td,th',row).map(c=>num(text(c))).filter(v=>Number.isFinite(v)&&v>0&&v<10000);
        const need=n-(rr+1);
        if(vals.length<need)continue;
        const odds=vals.slice(-need);if(odds.filter(v=>v>=1&&v<10000).length<need)continue;
        odds.forEach((v,j)=>map.set((rr+1)+'-'+(rr+2+j),v));rr++;
      }
      return map;
    }).filter(m=>m.size>=3);
  }
  function priceRows(type,rows){
    const maps=matrixMaps();
    return rows.map(c=>{
      let o=directOdds(type,c);
      if(!(o>1)&&c.h.length===2&&maps.length){
        const key=Math.min(c.h[0],c.h[1])+'-'+Math.max(c.h[0],c.h[1]);
        let ix=type==='qpl'?1:0;if(!maps[ix])ix=0;o=maps[ix]?.get(key);
      }
      return{...c,o:Number(o)};
    });
  }
  function dutch(rows,budget){
    if(budget<rows.length*10)return{err:'總投注額至少需要 $'+(rows.length*10)};
    const inv=rows.map(x=>1/x.o),sum=inv.reduce((a,b)=>a+b,0);
    const stakes=inv.map(w=>Math.max(10,Math.floor((budget*w/sum)/10)*10));let used=stakes.reduce((a,b)=>a+b,0);
    while(used+10<=budget){let bi=0,bd=-Infinity;for(let i=0;i<rows.length;i++){const d=budget*inv[i]/sum-stakes[i];if(d>bd){bd=d;bi=i}}stakes[bi]+=10;used+=10}
    return{rows:rows.map((x,i)=>({...x,stake:stakes[i],pay:stakes[i]*x.o})),used,left:budget-used};
  }
  function render(result,budget){
    let box=$('#mfst-smart-result-v2');
    if(!box){box=document.createElement('div');box.id='mfst-smart-result-v2';box.style.cssText='margin-top:8px;border:1px solid #2d4358;border-radius:8px;overflow:hidden;background:#08141d;color:#fff;font-size:11px';$('#mfst-smart')?.insertAdjacentElement('afterend',box)}
    const avg=result.rows.reduce((s,x)=>s+x.pay,0)/result.rows.length;
    const body=result.rows.map(x=>'<tr><td style="padding:5px 6px;border-top:1px solid #183142">'+x.h.join(' - ')+'</td><td style="text-align:center;border-top:1px solid #183142">'+x.o.toFixed(2)+'</td><td style="text-align:center;border-top:1px solid #183142">$'+x.stake+'</td><td style="text-align:center;border-top:1px solid #183142">$'+x.pay.toFixed(0)+'</td></tr>').join('');
    box.innerHTML='<div style="padding:7px 8px;background:#0f2534;font-weight:700;color:#76df9a">聰明配對 · 本機 Dutching</div><div style="max-height:230px;overflow:auto"><table style="width:100%;border-collapse:collapse"><thead><tr><th>組合</th><th>賠率</th><th>分配注碼</th><th>預計派彩*</th></tr></thead><tbody>'+body+'</tbody></table></div><div style="padding:7px 8px;color:#9fb7c8">預算 $'+budget+' · 實際 $'+result.used+(result.left?' · 未分配 $'+result.left:'')+' · 平均預計派彩約 $'+avg.toFixed(0)+'</div><div style="padding:0 8px 7px;color:#718b9d;font-size:9px">按目前頁面賠率做等派彩分注；實際派彩以馬會最後派彩為準。</div>';
  }
  function setStatus(msg){const e=$('#mfst-status');if(e)e.textContent=msg}
  function run(){
    const s=state(),cs=combos(s);
    if(!cs.length){setStatus('請先選擇投注組合；F／全餐亦可用，但需要有效膽／選擇。');return}
    const priced=priceRows(s.type,cs),missing=priced.filter(x=>!(x.o>1));
    if(missing.length){setStatus('讀不到 '+missing.length+' 個組合賠率；請先等馬會賠率表載入。');return}
    chrome.storage.local.get({mfStandalone:{smartBudget:1000}},data=>{
      const budget=Math.max(10,Math.floor((Number(data.mfStandalone?.smartBudget)||1000)/10)*10);
      const r=dutch(priced,budget);if(r.err){setStatus(r.err);return}render(r,budget);setStatus('聰明計算完成：'+r.rows.length+' 注，實際分配 $'+r.used+'。');
    });
  }
  document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('#mfst-smart');if(!b)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();run()},true);
})();