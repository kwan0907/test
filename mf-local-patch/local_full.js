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
function pool(){
  var path=String(location.pathname||'').toLowerCase(),e;
  if(/\/dbl\//.test(path))return'dbl';
  e=$q('#mf007_betDbl');
  if(e&&(e.classList.contains('mf007_btnOn')||e.classList.contains('mf007_btnBanker')))return'dbl';
  e=$q('#mf007_BL_dbl');
  if(e&&(e.classList.contains('mf007_btnLinkOn')||e.classList.contains('mf007_btnOn')))return'dbl';

  var a=[['#mf007_betFctB','fctb'],['#mf007_betFctBM','fctbm'],['#mf007_betWin','w'],['#mf007_betPla','p'],['#mf007_betWP','wp'],['#mf007_betQin','q'],['#mf007_betQpl','qp'],['#mf007_betQQP','qqp']];
  for(var i=0;i<a.length;i++){
    e=$q(a[i][0]);
    if(e&&e.classList.contains('mf007_btnOn'))return a[i][1];
  }
  e=$qa('.mf007_tb.mf007_btnOn,.mf007_qtb.mf007_btnOn').filter(function(x){return x.getClientRects().length})[0];
  if(e&&e.getAttribute('rel'))return e.getAttribute('rel');
  return'q';
}
function runnerNo(e){
  if(!e)return NaN;
  var rel=String(e.getAttribute('rel')||'').trim();
  if(/^\d{1,2}$/.test(rel)){var n=+rel;if(n>0&&n<60)return n;}
  var m=String(e.id||'').match(/_(\d{1,2})$/);
  if(m){var n2=+m[1];if(n2>0&&n2<60)return n2;}
  var t=text(e);
  if(/^\d{1,2}$/.test(t)){var n3=+t;if(n3>0&&n3<60)return n3;}
  return NaN;
}
function selected(sel){
  return $qa(sel).filter(function(e){return e.classList.contains('mf007_btnOn')||e.classList.contains('mf007_btnBanker')}).map(runnerNo).filter(function(x){return isFinite(x)&&x>0&&x<60});
}
function bankers(){
  return $qa('.mf007_hno').filter(function(e){return e.classList.contains('mf007_btnBanker')}).map(runnerNo).filter(function(x){return isFinite(x)&&x>0&&x<60});
}
function allRunnerNumbers(sel){
  return Array.from(new Set($qa(sel).map(runnerNo).filter(function(x){return isFinite(x)&&x>0&&x<60}))).sort(function(a,b){return a-b});
}
function controlOn(id){
  var e=$q(id);
  return !!(e&&(e.classList.contains('mf007_btnOn')||e.classList.contains('mf007_btnBanker')||e.getAttribute('aria-pressed')==='true'));
}
function horseNumbers(){
  var out=[];
  $qa('[id^="mf007_hno_"]').forEach(function(e){
    var m=(e.id||'').match(/^mf007_hno_(\d{1,2})$/);
    if(m){var n=+m[1];if(n>0&&n<60)out.push(n)}
  });
  if(!out.length){
    $qa('.mf007_hno').forEach(function(e){
      var n=iv(e.getAttribute('rel')||e.id||text(e));
      if(isFinite(n)&&n>0&&n<60)out.push(n);
    });
  }
  if(!out.length){
    $qa('tr').forEach(function(row){
      var cells=$qa('td,th',row);
      if(!cells.length)return;
      var n=iv(text(cells[0]));
      if(isFinite(n)&&n>0&&n<=24)out.push(n);
    });
  }
  if(!out.length){
    var body=text(document.body),m;
    var re=/(?:^|\s)(\d{1,2})(?=\s)/g;
    while((m=re.exec(body))){var n=+m[1];if(n>0&&n<=24)out.push(n)}
  }
  return Array.from(new Set(out)).sort(function(a,b){return a-b});
}
function fieldOn(){
  var e=$q('#mf007_hno_F');
  if(e&&(e.classList.contains('mf007_btnOn')||e.classList.contains('mf007_btnBOn')||e.getAttribute('aria-pressed')==='true'))return true;
  var sp=selectionSpec();
  return !!(sp&&sp.field);
}
function visibleHorses(){return horseNumbers()}
function parseSelectionText(raw){
  raw=String(raw||'').replace(/\u00a0/g,' ').replace(/[，,＋+]/g,' ').replace(/\s+/g,' ').trim();
  var m=raw.match(/(?:^|\s)(\d{1,2})\s*>\s*(F|全|全餐)(?:\s|$)/i);
  if(m){
    var b=+m[1],all=horseNumbers().filter(function(x){return x!==b});
    if(all.length)return{b:[b],l:all,field:true,raw:m[0].trim()};
  }
  m=raw.match(/(?:^|\s)(\d{1,2})\s*>\s*((?:\d{1,2}\s+){1,}\d{1,2})(?:\s|$)/);
  if(m){
    var banker=+m[1],legs=(m[2].match(/\d{1,2}/g)||[]).map(Number).filter(function(x){return x!==banker&&x>0&&x<60});
    legs=Array.from(new Set(legs));
    if(legs.length)return{b:[banker],l:legs,field:false,raw:m[0].trim()};
  }
  return null;
}
function selectionSpec(){
  // Exact original MF structure: the white selection box is #mf007_fs_input.
  // Banker/legs are rendered as anchors with rel values, so read those directly
  // instead of trying to infer selection from button classes or formatted text.
  var box=$q('#mf007_fs_input');
  if(box){
    var bs=$qa('.mf007_c_banker',box).map(function(e){return String(e.getAttribute('rel')||text(e)).trim()}).filter(Boolean);
    var ls=$qa('.mf007_c_leg',box).map(function(e){return String(e.getAttribute('rel')||text(e)).trim()}).filter(Boolean);
    var bankers=bs.map(function(v){return iv(v)}).filter(function(x){return isFinite(x)&&x>0&&x<60});
    if(bankers.length&&ls.length){
      var b=bankers[0];
      if(ls.some(function(v){return /^(?:F|全|全餐)$/i.test(v)})){
        var all=horseNumbers().filter(function(x){return x!==b});
        if(all.length)return{b:[b],l:all,field:true,raw:b+' > F'};
      }
      var legs=ls.map(function(v){return iv(v)}).filter(function(x){return isFinite(x)&&x>0&&x<60&&x!==b});
      legs=Array.from(new Set(legs)).sort(function(a,b){return a-b});
      if(legs.length)return{b:[b],l:legs,field:false,raw:b+' > '+legs.join(' ')};
    }
  }

  // Fallback for any alternate original layout.
  var nodes=$qa('input[id^="mf007_"],textarea[id^="mf007_"],[id^="mf007_"]');
  for(var i=0;i<nodes.length;i++){
    var e=nodes[i],v='';
    if('value' in e&&e.value)v=e.value;
    if(!v)v=text(e);
    if(v&&v.length<=240){
      var r=parseSelectionText(v);
      if(r)return r;
    }
  }
  return null;
}
function summary(){return selectionSpec()}
function uniq(a){return Array.from(new Set(a))}
function combos(p){
  var f=selected('.mf007_hno'),s2=selected('.mf007_hno2'),b=bankers(),o=[],all=horseNumbers(),l=f.filter(function(x){return b.indexOf(x)<0}),spec=p==='dbl'?null:selectionSpec();

  if(p==='dbl'){
    var leg1=uniq(f),leg2=uniq(s2);
    if(controlOn('#mf007_hno_F')||controlOn('#mf007_hno_A'))leg1=allRunnerNumbers('.mf007_hno');
    if(controlOn('#mf007_hno2_F')||controlOn('#mf007_hno2_A'))leg2=allRunnerNumbers('.mf007_hno2');
    leg1.forEach(function(x){
      leg2.forEach(function(y){
        o.push({h:[x,y]});
      });
    });
    return o;
  }

  // The displayed original selection is authoritative for single-race pools.
  if(spec){
    b=spec.b.slice();
    l=spec.l.slice();
    f=uniq(b.concat(l));
  }else if(fieldOn()){
    l=all.filter(function(x){return b.indexOf(x)<0});
    if(!b.length&&f.length)b=[f[0]];
  }

  if(p==='w'||p==='p')return uniq(spec?b.concat(l):(fieldOn()?all:(f.length?f:b.concat(l)))).map(function(x){return{h:[x]}});
  if(p==='wp'){uniq(spec?b.concat(l):(fieldOn()?all:(f.length?f:b.concat(l)))).forEach(function(x){o.push({h:[x],sub:'WIN'});o.push({h:[x],sub:'PLA'})});return o}
  if(p==='fctb'||p==='fctbm'){
    if(b.length){b.forEach(function(x){l.forEach(function(y){if(x!==y)o.push({h:[x,y]})})})}
    else{f=uniq(fieldOn()?all:f);f.forEach(function(x){f.forEach(function(y){if(x!==y)o.push({h:[x,y]})})})}
    return o
  }

  // Q / QP banker-to-legs: one combination for each leg.
  if(b.length&&l.length){
    b.forEach(function(x){l.forEach(function(y){if(x!==y)o.push({h:[Math.min(x,y),Math.max(x,y)]})})})
  }else{
    f=uniq(fieldOn()?all:(f.length?f:l));
    for(var i=0;i<f.length;i++)for(var j=i+1;j<f.length;j++)o.push({h:[Math.min(f[i],f[j]),Math.max(f[i],f[j])]})
  }

  var seen={};return o.filter(function(c){var k=c.h.join('-');if(seen[k])return false;seen[k]=1;return true})
}
function direct(p,r,c){
  var a=c.h[0],b=c.h[1],v;

  if(b!=null&&(p==='q'||p==='qp')){
    var typ=p==='q'?'QIN':'QPL';
    var ids=[
      'qb_'+typ+'_'+a+'_'+b,
      'qb_'+typ+'_'+b+'_'+a
    ];
    for(var qi=0;qi<ids.length;qi++){
      var qe=document.getElementById(ids[qi]);
      if(qe){
        v=cleanOddText(text(qe));
        if(v>0)return v;
      }
    }
  }

  var codes=p==='q'?['QIN','Q']:p==='qp'?['QPL','QP']:p==='qqp'?['QQP']:(p==='fctb'||p==='fctbm')?['FCT','F']:p==='dbl'?['DBL']:p==='w'?['WIN']:p==='p'?['PLA']:c.sub?[c.sub]:[];
  for(var z=0;z<codes.length;z++){
    var code=codes[z],ids2=b==null?['odds_'+code+'_'+r+'_'+a]:['odds_'+code+'_'+r+'_'+a+'_'+b,'odds_'+code+'_'+r+'_'+b+'_'+a,'odds_'+code+'_'+a+'_'+b,'odds_'+code+'_'+b+'_'+a];
    for(var k=0;k<ids2.length;k++){
      v=num(text(document.getElementById(ids2[k])));
      if(v>0)return v;
    }
  }
  return NaN;
}

function cleanOddText(v){
  v=String(v==null?'':v).replace(/\s+/g,'').trim();
  if(!/^\d+(?:\.\d+)?$/.test(v))return NaN;
  var n=+v;
  return isFinite(n)&&n>=1&&n<10000?n:NaN;
}
function matrixCandidates(){
  var n=horseNumbers().length||12,out=[];
  $qa('table').forEach(function(t){
    if(!t.getClientRects().length||t.closest('[id^="mf007_"]'))return;
    var rows=$qa('tr',t),hdr=null,cols=[];
    for(var ri=0;ri<Math.min(rows.length,8);ri++){
      var cands=[];
      $qa('td,th',rows[ri]).forEach(function(c){
        var tt=text(c);
        if(/^\d{1,2}$/.test(tt)){
          var v=+tt,cr=c.getBoundingClientRect();
          if(v>=2&&v<=Math.max(14,n))cands.push({v:v,x:(cr.left+cr.right)/2,w:Math.max(1,cr.width)});
        }
      });
      cands.sort(function(a,b){return a.x-b.x});
      var best=[],run=[];
      for(var j=0;j<cands.length;j++){
        if(!run.length||cands[j].v===run[run.length-1].v+1)run.push(cands[j]);
        else run=cands[j].v===2?[cands[j]]:[];
        if(run.length>best.length)best=run.slice();
      }
      if(best.length>=Math.min(7,Math.max(5,n-3))&&best[0].v===2){
        hdr=rows[ri];cols=best;break;
      }
    }
    if(!hdr)return;
    var rect=t.getBoundingClientRect();
    out.push({table:t,header:hdr,cols:cols,top:rect.top});
  });
  out.sort(function(a,b){return a.top-b.top});
  return out;
}
function parseVisibleMatrix(entry){
  var n=horseNumbers().length||12,map=new Map(),rows=$qa('tr',entry.table);
  var hTop=entry.header.getBoundingClientRect().top,rowNo=1;
  for(var ri=0;ri<rows.length&&rowNo<n;ri++){
    var tr=rows[ri],rr=tr.getBoundingClientRect();
    if(rr.top<=hTop+1||!tr.getClientRects().length)continue;
    var cells=$qa('td,th',tr);
    if(!cells.length)continue;

    // Skip duplicate header rows.
    var seq=0;
    cells.forEach(function(c){var tt=text(c);if(/^\d{1,2}$/.test(tt)){var v=+tt;if(v>=2&&v<=n)seq++;}});
    if(seq>=Math.min(7,Math.max(5,n-3)))continue;

    var wrote=0;
    entry.cols.forEach(function(col){
      if(col.v<=rowNo||col.v>n)return;
      var target=null,dist=1e9;
      for(var ci=0;ci<cells.length;ci++){
        var cr=cells[ci].getBoundingClientRect();
        if(!cr.width)continue;
        var d=Math.abs(((cr.left+cr.right)/2)-col.x);
        if(d<dist){dist=d;target=cells[ci];}
      }
      if(!target)return;
      var lim=Math.max(18,col.w*0.65);
      if(dist>lim)return;
      var ov=cleanOddText(text(target));
      if(!(ov>0))return;
      // Never treat the diagonal horse number as an odds value.
      if(/^\d{1,2}$/.test(text(target))&&+text(target)===rowNo)return;
      map.set(rowNo+'-'+col.v,ov);
      wrote++;
    });

    if(wrote>0)rowNo++;
  }
  return map;
}
function visiblePairMap(poolCode){
  var c=matrixCandidates();
  if(!c.length)return new Map();
  var ix=poolCode==='QPL'?1:0;
  if(!c[ix])ix=0;
  return parseVisibleMatrix(c[ix]);
}
function officialPools(){
  var el=document.getElementById('mf007_hkjc_official_odds_cache');
  if(!el)return[];
  try{var x=JSON.parse(el.textContent||'[]');return Array.isArray(x)?x:[]}catch(_e){return[]}
}
function pairKeyFromComb(v){
  var nums=String(v==null?'':v).match(/\d{1,2}/g);
  if(!nums||nums.length<2)return'';
  nums=nums.map(Number).filter(function(n){return n>0&&n<60});
  if(nums.length<2)return'';
  var a=nums[nums.length-2],b=nums[nums.length-1];
  if(a===b)return'';
  return Math.min(a,b)+'-'+Math.max(a,b);
}
function oneRunner(v){
  var m=String(v==null?'':v).match(/\d{1,2}/g);
  if(!m||!m.length)return NaN;
  var n=+m[m.length-1];
  return n>0&&n<60?n:NaN;
}
function officialPairMap(poolCode,raceNo){
  var pools=officialPools(),exact=[],fallback=[];
  for(var i=0;i<pools.length;i++){
    var p=pools[i]||{},typ=String(p.oddsType||'').toUpperCase();
    var rr=p.leg&&Array.isArray(p.leg.races)&&p.leg.races.length?+p.leg.races[0]:NaN;
    if(isFinite(rr)&&rr!==+raceNo)continue;
    if(typ===poolCode)exact.push(p);
    else if(typ.indexOf(poolCode)===0)fallback.push(p);
  }
  var src=exact.length?exact:fallback,map=new Map();

  src.forEach(function(p){
    (p.oddsNodes||[]).forEach(function(n){
      if(!n)return;

      // Format A: node combString already contains a complete pair.
      var k=pairKeyFromComb(n.combString),v=num(n.oddsValue);
      if(k&&v>0)map.set(k,v);

      // Format B used by HKJC QIN/QPL matrices:
      // parent node identifies the row runner, bankerOdds entries identify
      // the other runner and carry the displayed pair odds.
      var parent=oneRunner(n.combString);
      (Array.isArray(n.bankerOdds)?n.bankerOdds:[]).forEach(function(b){
        if(!b)return;
        var bv=num(b.oddsValue);
        if(!(bv>0))return;

        var bk=pairKeyFromComb(b.combString);
        if(!bk&&isFinite(parent)){
          var other=oneRunner(b.combString);
          if(isFinite(other)&&other!==parent)bk=Math.min(parent,other)+'-'+Math.max(parent,other);
        }
        if(bk)map.set(bk,bv);
      });
    });
  });
  return map;
}
function orderedKeyFromComb(v){
  var nums=String(v==null?'':v).match(/\d{1,2}/g);
  if(!nums||nums.length<2)return'';
  nums=nums.map(Number).filter(function(n){return n>0&&n<60});
  if(nums.length<2)return'';
  return nums[nums.length-2]+'-'+nums[nums.length-1];
}
function officialFctMap(raceNo){
  var pools=officialPools(),src=[];
  for(var i=0;i<pools.length;i++){
    var p=pools[i]||{},typ=String(p.oddsType||'').toUpperCase();
    var rr=p.leg&&Array.isArray(p.leg.races)&&p.leg.races.length?+p.leg.races[0]:NaN;
    if(isFinite(rr)&&rr!==+raceNo)continue;
    if(typ==='FCT'||typ.indexOf('FCT')===0)src.push(p);
  }
  var map=new Map();
  src.forEach(function(p){
    (p.oddsNodes||[]).forEach(function(n){
      if(!n)return;
      var k=orderedKeyFromComb(n.combString),v=num(n.oddsValue);
      if(k&&v>0)map.set(k,v);

      var parent=oneRunner(n.combString);
      (Array.isArray(n.bankerOdds)?n.bankerOdds:[]).forEach(function(b){
        if(!b)return;
        var bv=num(b.oddsValue);
        if(!(bv>0))return;
        var bk=orderedKeyFromComb(b.combString);
        if(!bk&&isFinite(parent)){
          var other=oneRunner(b.combString);
          if(isFinite(other)&&other!==parent)bk=parent+'-'+other;
        }
        if(bk)map.set(bk,bv);
      });
    });
  });
  return map;
}
function officialDblMap(raceNo){
  var pools=officialPools(),src=[];
  for(var i=0;i<pools.length;i++){
    var p=pools[i]||{},typ=String(p.oddsType||'').toUpperCase(),races=p.leg&&Array.isArray(p.leg.races)?p.leg.races.map(Number):[];
    if(typ!=='DBL'&&typ.indexOf('DBL')!==0)continue;
    if(races.length&&races.indexOf(+raceNo)<0)continue;
    src.push(p);
  }
  var map=new Map();
  src.forEach(function(p){
    (p.oddsNodes||[]).forEach(function(n){
      if(!n)return;
      var k=orderedKeyFromComb(n.combString),v=num(n.oddsValue);
      if(k&&v>0)map.set(k,v);
      var parent=oneRunner(n.combString);
      (Array.isArray(n.bankerOdds)?n.bankerOdds:[]).forEach(function(b){
        if(!b)return;
        var bv=num(b.oddsValue);if(!(bv>0))return;
        var bk=orderedKeyFromComb(b.combString);
        if(!bk&&isFinite(parent)){
          var other=oneRunner(b.combString);
          if(isFinite(other))bk=parent+'-'+other;
        }
        if(bk)map.set(bk,bv);
      });
    });
  });
  return map;
}
function odds(p,r,cc){
  var officialMap=null;
  if(p==='q')officialMap=officialPairMap('QIN',r);
  else if(p==='qp')officialMap=officialPairMap('QPL',r);
  else if(p==='dbl')officialMap=officialDblMap(r);
  else if(p==='fctb'||p==='fctbm')officialMap=officialFctMap(r);

  return cc.map(function(c){
    var isOrdered=(p==='dbl'||p==='fctb'||p==='fctbm');
    var key=c.h.length===2?(isOrdered?(c.h[0]+'-'+c.h[1]):(Math.min(c.h[0],c.h[1])+'-'+Math.max(c.h[0],c.h[1]))):'';
    var o=NaN;

    if(p==='dbl'){
      // DBL is an ordered cross-race pool: race-1 runner -> race-2 runner.
      // Use the HKJC DBL pool directly. Never substitute QIN/QPL or WIN×WIN.
      if(officialMap&&key)o=officialMap.get(key);
      if(!(o>1))o=direct('dbl',r,c);
    }else if(p==='fctb'||p==='fctbm'){
      if(officialMap&&key)o=officialMap.get(key);
    }else{
      o=direct(p,r,c);
      if(!(o>1)&&officialMap&&key)o=officialMap.get(key);
    }

    c.o=o;
    return c;
  });
}
function dutch(rows,b){
  rows=rows.filter(function(x){return x.o>1});
  if(!rows.length)return null;
  var minTotal=rows.length*10;
  var cap=Math.floor((b*1.15)/10)*10;
  if(cap<minTotal)return{err:'總投注額不足；最低需要約 $'+minTotal};

  var st=rows.map(function(){return 10});
  var used=minTotal;

  while(used+10<=cap){
    var bi=0,bp=Infinity;
    for(var i=0;i<rows.length;i++){
      var pay=st[i]*rows[i].o;
      if(pay<bp){bp=pay;bi=i}
    }
    st[bi]+=10;
    used+=10;
  }

  return{
    rows:rows.map(function(x,i){x.stake=st[i];x.pay=st[i]*x.o;return x}),
    used:used,
    left:b-used,
    cap:cap
  };
}
function label(p){return{w:'獨贏',p:'位置',wp:'獨贏 + 位置',q:'連贏',qp:'位置Q',qqp:'連贏及位置Q',fctb:'單膽二重彩',fctbm:'複膽二重彩',dbl:'孖寶'}[p]||p}
function addClass(p){return p==='q'?'mf007_calbetSubmit_qin':p==='qp'?'mf007_calbetSubmit_qpl':(p==='fctb'||p==='fctbm')?'mf007_calbetSubmit_fct':p==='dbl'?'mf007_calbetSubmit_dbl':p==='w'?'mf007_calbetSubmit_win':''}
function rel(p,x){return p==='w'?x.h[0]+'|'+x.stake:x.h.length===2?x.h[0]+'|'+x.h[1]+'|'+x.stake:''}
function show(p,b,c){
  var h=$q('#mf007_calbetResultDiv');
  if(!h){
    h=document.createElement('div');h.id='mf007_calbetResultDiv';
    var a=$q('#mf007_calbetbtnDiv')||$q('#mf007_dataArea')||$q('[id^="mf007_"]');
    if(a)a.parentNode.insertBefore(h,a.nextSibling);
  }
  var rows=c.rows.map(function(x){return '<tr><td>'+x.h.join(' > ')+'</td><td>'+x.o.toFixed(2)+'</td><td>$'+x.stake+'</td><td>$'+x.pay.toFixed(0)+'</td></tr>'}).join('');
  var C=addClass(p),R=c.rows.map(function(x){return rel(p,x)}).filter(Boolean).join('@@');
  var avg=c.rows.reduce(function(sum,x){return sum+x.pay},0)/c.rows.length;
  h.innerHTML='<table class="mf007_betCaltbd" style="width:100%"><thead><tr><td colspan="4">'+label(p)+' 本機聰明計算</td></tr><tr><td>組合</td><td>賠率</td><td>總數</td><td>預計派彩*</td></tr></thead><tbody>'+rows+'</tbody></table><div style="padding:6px 0;font-size:12px">設定總投注：$'+b+'　實際：$'+c.used+'（最多 +15%）　平均預計派彩：約 $'+avg.toFixed(0)+'</div>'+(C&&R?'<div style="padding:5px 0;text-align:center"><a href="javascript:void(0)" class="mf007_cbsubmit '+C+'" rel="'+R+'">加入'+label(p)+'組合</a></div>':'')+'<div style="font-size:10px;color:#666">本機 Dutching；實際派彩以馬會最後派彩為準。</div>';
  h.style.display='block';
}
function selectedSmartBudget(){
  var e=$q('.mf007_val.mf007_btnOn')||$q('#mf007_valDefault.mf007_btnOn')||$q('.mf007_num.mf007_btnOn[rel]');
  if(e){var v=num(e.getAttribute('rel')||text(e));if(v>0)return Math.floor(v/10)*10;}
  return NaN;
}
function run(){
  hideLogin();
  var p=pool(),r=race(),cc=combos(p);
  if(!cc.length){alert('====== 聰明投注訊息 ======\n\n請先選擇投注組合。');return}
  var b=selectedSmartBudget();
  if(!(b>=10)){alert('====== 聰明投注訊息 ======\n\n請先在左邊選擇總投注額。');return}
  localStorage.setItem('mf007_local_smart_budget',String(b));
  var pp=odds(p,r,cc),missing=pp.filter(function(x){return !(x.o>1)});
  if(missing.length){alert('====== 聰明投注訊息 ======\n\n目前未能讀取 '+missing.length+' 個組合的即時賠率。\n請按馬會頁面的更新賠率按鈕，等 1–2 秒再試一次。');return}
  var c=dutch(pp,b);
  if(c&&c.err){alert(c.err);return}
  if(c)show(p,b,c);
}
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
