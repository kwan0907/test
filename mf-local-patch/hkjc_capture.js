(function(){
'use strict';
if(window.__MF007_HKJC_CAPTURE__)return;
window.__MF007_HKJC_CAPTURE__=true;

var CACHE_ID='mf007_hkjc_official_odds_cache';

function writeCache(pools){
  try{
    if(!Array.isArray(pools)||!pools.length)return;
    var clean=[];
    pools.forEach(function(p){
      if(!p||!p.oddsType||!Array.isArray(p.oddsNodes))return;
      var typ=String(p.oddsType).toUpperCase();
      if(!/^(QIN|QPL|QQP|WIN|PLA|DBL)/.test(typ))return;
      clean.push({
        oddsType:typ,
        leg:p.leg||null,
        oddsNodes:p.oddsNodes.map(function(n){
          return {
            combString:n&&n.combString,
            oddsValue:n&&n.oddsValue,
            bankerOdds:Array.isArray(n&&n.bankerOdds)?n.bankerOdds.map(function(b){
              return {combString:b&&b.combString,oddsValue:b&&b.oddsValue};
            }):[]
          };
        })
      });
    });
    if(!clean.length)return;

    var el=document.getElementById(CACHE_ID);
    if(!el){
      el=document.createElement('script');
      el.type='application/json';
      el.id=CACHE_ID;
      el.style.display='none';
      (document.documentElement||document).appendChild(el);
    }

    var old=[];
    try{old=JSON.parse(el.textContent||'[]');if(!Array.isArray(old))old=[];}catch(_e){old=[];}

    // Replace same pool/race entries with the newest official response.
    clean.forEach(function(nw){
      var race=(nw.leg&&Array.isArray(nw.leg.races)&&nw.leg.races.length)?String(nw.leg.races[0]):'';
      old=old.filter(function(x){
        var xr=(x&&x.leg&&Array.isArray(x.leg.races)&&x.leg.races.length)?String(x.leg.races[0]):'';
        return !(String(x&&x.oddsType||'')===nw.oddsType&&xr===race);
      });
      old.push(nw);
    });
    if(old.length>40)old=old.slice(-40);
    el.textContent=JSON.stringify(old);
    el.setAttribute('data-updated',String(Date.now()));
  }catch(_e){}
}

function collect(obj,out,seen){
  if(!obj||typeof obj!=='object')return;
  if(seen.has(obj))return;
  seen.add(obj);
  if(obj.oddsType&&Array.isArray(obj.oddsNodes))out.push(obj);
  if(Array.isArray(obj)){
    for(var i=0;i<obj.length;i++)collect(obj[i],out,seen);
  }else{
    Object.keys(obj).forEach(function(k){collect(obj[k],out,seen);});
  }
}

function inspectJson(data){
  try{
    var pools=[];
    collect(data,pools,new WeakSet());
    if(pools.length)writeCache(pools);
  }catch(_e){}
}

var origFetch=window.fetch;
if(typeof origFetch==='function'){
  window.fetch=function(){
    var args=arguments;
    return origFetch.apply(this,args).then(function(res){
      try{
        var req=args[0];
        var url=typeof req==='string'?req:(req&&req.url)||'';
        if(/info\.cld\.hkjc\.com\/graphql\/base/i.test(url)){
          res.clone().json().then(inspectJson).catch(function(){});
        }
      }catch(_e){}
      return res;
    });
  };
}

// Keep XMLHttpRequest coverage as a fallback in case HKJC changes transport.
var XHR=window.XMLHttpRequest;
if(XHR&&XHR.prototype){
  var oOpen=XHR.prototype.open,oSend=XHR.prototype.send;
  XHR.prototype.open=function(method,url){
    this.__mf007_url=String(url||'');
    return oOpen.apply(this,arguments);
  };
  XHR.prototype.send=function(){
    if(/info\.cld\.hkjc\.com\/graphql\/base/i.test(this.__mf007_url||'')){
      this.addEventListener('load',function(){
        try{inspectJson(JSON.parse(this.responseText));}catch(_e){}
      },{once:true});
    }
    return oSend.apply(this,arguments);
  };
}
})();