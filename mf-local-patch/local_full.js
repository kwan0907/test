(function(){
'use strict';
if(window.__MF007_LOCAL_FULL__)return;window.__MF007_LOCAL_FULL__=true;
var $q=function(s,r){return(r||document).querySelector(s)},$qa=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var text=function(e){return((e&&e.textContent)||'').replace(/\s+/g,' ').trim()},num=function(v){v=parseFloat(String(v==null?'':v).replace(/[^0-9.\-]/g,''));return isFinite(v)?v:NaN},iv=function(v){v=parseInt(String(v==null?'':v).replace(/\D/g,''),10);return isFinite(v)?v:NaN};
function installLocalCss(){
  if(document.getElementById('mf007_local_css'))return;
  var st=document.createElement('style');
  st.id='mf007_local_css';
  st.textContent=[
    '#mf007_loginDiv{display:none!important}',
    '#mf007_member-btn,.mf007_member-btn,.mf007_logout-btn{display:none!important}',
    '#mf007_localSmartBtn{display:block!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important}'
  ].join('');
  (document.head||document.documentElement).appendChild(st);
}
function hideLogin(){installLocalCss();}
function ensureSmartButton(){
  var e=$q('#mf007_SCcalbet')||$q('#mf007_calbet')||$q('#mf007_localSmartBtn');
  if(e){
    if(e.tagName==='INPUT')e.value='聰明計算';else e.textContent='聰明計算';
    e.id='mf007_localSmartBtn';
    e.style.display='';
    e.style.visibility='visible';
    e.style.opacity='1';
    e.style.pointerEvents='auto';
    e.removeAttribute('disabled');
    return e;
  }

  // Original logged-out UI renders this exact error block.
  var err=$q('.mf007_blockErr');
  if(err&&/聰明計算不能使用/.test(text(err))){
    var b=document.createElement('a');
    b.href='javascript:void(0)';
    b.id='mf007_localSmartBtn';
    b.className='mf007_calbet mf007_btnLeft';
    b.textContent='聰明計算';
    b.style.display='block';
    b.style.textAlign='center';
    err.parentNode.replaceChild(b,err);
    return b;
  }

  // Final fallback: only touch the known MF calculator host.
  var host=$q('#mf007_calbetbtnDiv');
  if(host&&!$q('#mf007_localSmartBtn')){
    var x=document.createElement('a');
    x.href='javascript:void(0)';
    x.id='mf007_localSmartBtn';
    x.className='mf007_calbet mf007_btnLeft';
    x.textContent='聰明計算';
    host.insertBefore(x,host.firstChild);
    return x;
  }
  return null;
}
function race(){var e=$q('[id^="raceno_"].active,[id^="raceno_"].selected'),m=e&&e.id.match(/raceno_(\d+)/);if(m)return+m[1];m=location.pathname.match(/\/(\d+)(?:\/?$|\?)/);return m?+m[1]:1}
function pool(){var e=$qa('.mf007_tb.mf007_btnOn,.mf007_qtb.mf007_btnOn').filter(function(x){return x.getClientRects().length})[0];if(e&&e.getAttribute('rel'))return e.getAttribute('rel');var a=[['#mf007_betWin','w'],['#mf007_betPla','p'],['#mf007_betWP','wp'],['#mf007_betQin','q'],['#mf007_betQpl','qp'],['#mf007_betQQP','qqp'],['#mf007_betFctB','fctb'],['#mf007_betFctBM','fctbm'],['#mf007_betDbl','dbl']];for(var i=0;i<a.length;i++){e=$q(a[i][0]);if(e&&e.classList.contains('mf007_btnOn'))return a[i][1]}return'q'}
function selected(s){return $qa(s).filter(function(e){return e.classList.contains('mf007_btnOn')||e.classList.contains('mf007_btnBanker')}).map(function(e){return iv(e.getAttribute('rel')||e.id||text(e))}).filter(function(x){return isFinite(x)&&x>0&&x<60})}
function bankers(){return $qa('.mf007_hno').filter(function(e){return e.classList.contains('mf007_btnBanker')}).map(function(e){return iv(e.getAttribute('rel')||e.id||text(e))}).filter(isFinite)}
function fieldOn(){var e=$q('#mf007_hno_F');return !!(e&&e.classList.contains('mf007_btnOn'))}
function visibleHorses(){return $qa('.mf007_hno').filter(function(e){return !e.hidden&&e.getClientRects().length>0&&!e.classList.contains('disabled')}).map(function(e){return iv(e.getAttribute('rel')||e.id||text(e))}).filter(function(x){return isFinite(x)&&x>0&&x<60})}
function summary(){
  var all=$qa('[id^="mf007_"]');
  for(var i=0;i<all.length;i++){
    var t=text(all[i]),m=t.match(/(?:^|\s)(\d{1,2})\s*>\s*F(?:\s|$)/i);
    if(m){
      var banker=+m[1],horses=$qa('.mf007_hno').map(function(e){return iv(e.getAttribute('rel')||e.id||text(e))}).filter(function(x){return isFinite(x)&&x>0&&x<60&&x!==banker});
      if(!horses.length){
        var panel=$q('#mf007_dataArea')||document;
        horses=$qa('a,button,td,div',panel).map(function(e){var tt=text(e);return /^\d{1,2}$/.test(tt)?+tt:NaN}).filter(function(x){return isFinite(x)&&x>0&&x<60&&x!==banker});
      }
      horses=Array.from(new Set(horses)).sort(function(a,b){return a-b});
      if(horses.length)return{b:[banker],l:horses};
    }
    m=t.match(/(?:^|\s)(\d{1,2})\s*>\s*((?:\d{1,2}[\s,]+){1,}\d{1,2})/);
    if(m)return{b:[+m[1]],l:(m[2].match(/\d{1,2}/g)||[]).map(Number)};
  }
  return null;
}
function uniq(a){return Array.from(new Set(a))}
function combos(p){
  var f=selected('.mf007_hno'),s2=selected('.mf007_hno2'),b=bankers(),o=[],all=visibleHorses(),l=f.filter(function(x){return b.indexOf(x)<0});
  if(fieldOn()){
    l=all.filter(function(x){return b.indexOf(x)<0});
    if(!b.length&&f.length)b=[f[0]];
  }else{
    var z=summary();
    if((!b.length||!l.length)&&z){b=z.b;l=z.l}
  }
  if(p==='w'||p==='p')return uniq(fieldOn()?all:(f.length?f:b.concat(l))).map(function(x){return{h:[x]}});
  if(p==='wp'){uniq(fieldOn()?all:(f.length?f:b.concat(l))).forEach(function(x){o.push({h:[x],sub:'WIN'});o.push({h:[x],sub:'PLA'})});return o}
  if(p==='dbl'){uniq(f.length?f:b.concat(l)).forEach(function(x){uniq(s2).forEach(function(y){o.push({h:[x,y]})})});return o}
  if(p==='fctb'||p==='fctbm'){
    if(b.length){b.forEach(function(x){l.forEach(function(y){if(x!==y)o.push({h:[x,y]})})})}
    else{f=uniq(fieldOn()?all:f);f.forEach(function(x){f.forEach(function(y){if(x!==y)o.push({h:[x,y]})})})}
    return o
  }
  if(b.length){b.forEach(function(x){l.forEach(function(y){if(x!==y)o.push({h:[Math.min(x,y),Math.max(x,y)]})})})}
  else{f=uniq(fieldOn()?all:(f.length?f:l));for(var i=0;i<f.length;i++)for(var j=i+1;j<f.length;j++)o.push({h:[Math.min(f[i],f[j]),Math.max(f[i],f[j])]})}
  var seen={};return o.filter(function(c){var k=c.h.join('-');if(seen[k])return false;seen[k]=1;return true})
}
function direct(p,r,c){var a=c.h[0],b=c.h[1],codes=p==='q'?['QIN','Q']:p==='qp'?['QPL','QP']:p==='qqp'?['QQP']:(p==='fctb'||p==='fctbm')?['FCT','F']:p==='dbl'?['DBL']:p==='w'?['WIN']:p==='p'?['PLA']:c.sub?[c.sub]:[];for(var z=0;z<codes.length;z++){var code=codes[z],ids=b==null?['odds_'+code+'_'+r+'_'+a]:['odds_'+code+'_'+r+'_'+a+'_'+b,'odds_'+code+'_'+r+'_'+b+'_'+a,'odds_'+code+'_'+a+'_'+b,'odds_'+code+'_'+b+'_'+a];for(var k=0;k<ids.length;k++){var v=num(text(document.getElementById(ids[k])));if(v>0)return v}}return NaN}
function matrixTables(){return $qa('table').filter(function(t){if(t.closest('[id^="mf007_"]')||!t.getClientRects().length)return false;var n=$qa('td,th',t).map(function(c){return num(text(c))}).filter(function(x){return x>0}).length;return n>=30&&t.getBoundingClientRect().width>250}).sort(function(a,b){return a.getBoundingClientRect().top-b.getBoundingClientRect().top})}
function parseMatrix(t){
  var n=visibleHorses().length||12,map=new Map(),rows=$qa('tr',t),raceRow=0;
  function vals(row){return $qa('td,th',row).map(function(c){return num(text(c))}).filter(function(v){return isFinite(v)&&v>0&&v<10000})}
  function isHeader(a){
    if(a.length<n-2)return false;
    var seq=0;
    for(var i=0;i<a.length;i++)if(Math.abs(a[i]-Math.round(a[i]))<1e-9&&a[i]>=2&&a[i]<=n)seq++;
    return seq>=n-2&&a.slice(-Math.min(n-1,a.length)).every(function(v,i,arr){return i===0||v>=arr[i-1]})
  }
  for(var ri=0;ri<rows.length&&raceRow<n-1;ri++){
    var a=vals(rows[ri]);if(!a.length||isHeader(a))continue;
    var r=raceRow+1,need=n-r;
    if(need<=0)break;
    if(a.length<need)continue;
    var oddsVals=a.slice(-need);
    var plausible=oddsVals.filter(function(v){return v>=1&&v<10000}).length;
    if(plausible<need)continue;
    for(var j=0;j<oddsVals.length;j++)map.set(r+'-'+(r+1+j),oddsVals[j]);
    raceRow++;
  }
  return map
}
function odds(p,r,cc){var maps=matrixTables().map(parseMatrix).filter(function(m){return m.size>=3});return cc.map(function(c){var o=direct(p,r,c);if(!(o>1)&&c.h.length===2&&maps.length){var key=Math.min(c.h[0],c.h[1])+'-'+Math.max(c.h[0],c.h[1]),ix=p==='qp'?1:0;if(!maps[ix])ix=0;o=maps[ix]&&maps[ix].get(key)}if(!(o>1)&&p==='dbl'){var x=direct('w',r,{h:[c.h[0]]}),y=direct('w',r+1,{h:[c.h[1]]});if(x>1&&y>1)o=x*y}c.o=o;return c})}
function dutch(rows,b){rows=rows.filter(function(x){return x.o>1});if(!rows.length)return null;if(b<rows.length*10)return{err:'總投注額至少需要 $'+rows.length*10};var inv=rows.map(function(x){return 1/x.o}),sum=inv.reduce(function(a,c){return a+c},0),st=inv.map(function(w){return Math.max(10,Math.floor((b*w/sum)/10)*10)}),used=st.reduce(function(a,c){return a+c},0);while(used+10<=b){var bi=0,bd=-1e9;for(var i=0;i<rows.length;i++){var d=b*inv[i]/sum-st[i];if(d>bd){bd=d;bi=i}}st[bi]+=10;used+=10}return{rows:rows.map(function(x,i){x.stake=st[i];x.pay=st[i]*x.o;return x}),used:used,left:b-used}}
function label(p){return{w:'獨贏',p:'位置',wp:'獨贏 + 位置',q:'連贏',qp:'位置Q',qqp:'連贏及位置Q',fctb:'單膽二重彩',fctbm:'複膽二重彩',dbl:'孖寶'}[p]||p}
function addClass(p){return p==='q'?'mf007_calbetSubmit_qin':p==='qp'?'mf007_calbetSubmit_qpl':(p==='fctb'||p==='fctbm')?'mf007_calbetSubmit_fct':p==='dbl'?'mf007_calbetSubmit_dbl':p==='w'?'mf007_calbetSubmit_win':''}
function rel(p,x){return p==='w'?x.h[0]+'|'+x.stake:x.h.length===2?x.h[0]+'|'+x.h[1]+'|'+x.stake:''}
function show(p,b,c){var h=$q('#mf007_calbetResultDiv');if(!h){h=document.createElement('div');h.id='mf007_calbetResultDiv';var a=$q('#mf007_calbetbtnDiv')||$q('#mf007_dataArea')||$q('[id^="mf007_"]');if(a)a.parentNode.insertBefore(h,a.nextSibling)}var rows=c.rows.map(function(x){return'<tr><td>'+x.h.join(' > ')+'</td><td>'+x.o.toFixed(2)+'</td><td>$'+x.stake+'</td><td>$'+x.pay.toFixed(0)+'</td></tr>'}).join(''),C=addClass(p),R=c.rows.map(function(x){return rel(p,x)}).filter(Boolean).join('@@'),avg=c.rows.reduce(function(s,x){return s+x.pay},0)/c.rows.length;h.innerHTML='<table class="mf007_betCaltbd" style="width:100%"><thead><tr><td colspan="4">'+label(p)+' 本機聰明計算</td></tr><tr><td>組合</td><td>賠率</td><td>總數</td><td>預計派彩*</td></tr></thead><tbody>'+rows+'</tbody></table><div style="padding:6px 0;font-size:12px">設定總投注：$'+b+'　實際：$'+c.used+(c.left?'　未分配：$'+c.left:'')+'　平均預計派彩：約 $'+avg.toFixed(0)+'</div>'+(C&&R?'<div style="padding:5px 0;text-align:center"><a href="javascript:void(0)" class="mf007_cbsubmit '+C+'" rel="'+R+'">加入'+label(p)+'組合</a></div>':'')+'<div style="font-size:10px;color:#666">本機 Dutching；實際派彩以馬會最後派彩為準。</div>';h.style.display='block'}
function run(){hideLogin();var p=pool(),r=race(),cc=combos(p);if(!cc.length){alert('====== 聰明投注訊息 ======\n\n請先選擇投注組合。');return}var last=+(localStorage.getItem('mf007_local_smart_budget')||1000)||1000,raw=prompt('本機聰明計算（'+label(p)+'）\n\n請輸入今次總投注額：',String(last));if(raw===null)return;var b=Math.floor(num(raw)/10)*10;if(!(b>=10)){alert('請輸入有效總投注額（$10 的倍數）。');return}localStorage.setItem('mf007_local_smart_budget',String(b));var pp=odds(p,r,cc),missing=pp.filter(function(x){return !(x.o>1)});if(missing.length){alert('====== 聰明投注訊息 ======\n\n目前頁面未能讀取 '+missing.length+' 個組合的即時賠率。\n請確認馬會賠率矩陣已載入，再試一次。');return}var c=dutch(pp,b);if(c&&c.err){alert(c.err);return}if(c)show(p,b,c)}
document.addEventListener('click',function(e){var x=e.target&&e.target.closest&&e.target.closest('#mf007_calbet,#mf007_SCcalbet,#mf007_localSmartBtn');if(!x)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();try{run()}catch(err){console.error(err);alert('本機聰明計算出現錯誤，請刷新頁面後再試。')}},true);
var syncUI=function(){hideLogin();ensureSmartButton()};
if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',function(){
    syncUI();
    setTimeout(syncUI,1200);
    setTimeout(syncUI,3000);
  },{once:true});
}else{
  syncUI();
  setTimeout(syncUI,1200);
  setTimeout(syncUI,3000);
}
})();