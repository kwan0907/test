(function(){
'use strict';
if(window.__MF007_LOCAL_UNLOCK__)return;window.__MF007_LOCAL_UNLOCK__=true;
var DEFAULTS={id:'LOCAL',did:'LOCAL',msg:'0',exp:'本機版',sexp:'本機版',scexp:'本機版',scqexp:'本機版',
wblt:'10,20,50,100,200,500,1000|10',qblt:'10,20,50,100,200,500,1000|10',tceblt:'10,20,50,100,200,500,1000|10',triblt:'10,20,50,100,200,500,1000|10',ffblt:'10,20,50,100,200,500,1000|10',qttblt:'10,20,50,100,200,500,1000|10',fctblt:'10,20,50,100,200,500,1000|10',exblt:'10,20,50,100,200,500,1000|10',dblblt:'10,20,50,100,200,500,1000|10',
pcblt:'',eng:'0',sc:'0',mfr:'0',mfb:'0',ws:'0',qs:'0',fs:'0',cs:'0',smb:'1',scsmb:'1',wrOn:'0',wr:'0',prOn:'0',pr:'0',qrOn:'0',qr:'0',qprOn:'0',qpr:'0',qdpOn:'0',qdp:'0',auto:'0',autobet:'0'};
var profile=Object.assign({},DEFAULTS);
try{chrome.storage.local.get({mf007_local_profile:DEFAULTS},function(x){profile=Object.assign({},DEFAULTS,x.mf007_local_profile||{});});chrome.storage.sync.set({mf007_deviceid:'LOCAL'});}catch(e){}
function save(p){profile=Object.assign({},profile,p||{});try{chrome.storage.local.set({mf007_local_profile:profile});}catch(e){}}
function reply(url,data){url=String(url||'');if(/rsdatalogin11\.aspx/i.test(url))return Object.assign({},profile,{id:'LOCAL',did:'LOCAL'});if(/rsdataupdate6\.aspx/i.test(url)){save(data);return{data:''};}if(/moneyflow007\.com\/rsdata/i.test(url))return{data:''};return null}
function shim(){if(!window.jQuery||window.__MF007_LOCAL_API_SHIM__)return;window.__MF007_LOCAL_API_SHIM__=true;var $=window.jQuery,oa=$.ajax,oc=$.cors;
function h(o){o=o||{};var r=reply(o.url,o.data);if(r===null)return false;setTimeout(function(){if(o.success)o.success(r);if(o.complete)o.complete(r,'success');},0);return{abort:function(){},done:function(f){if(f)setTimeout(function(){f(r);},0);return this;},fail:function(){return this;},always:function(f){if(f)setTimeout(function(){f(r);},0);return this;}}}
$.ajax=function(o){var r=h(o);return r||oa.apply(this,arguments)};if(typeof oc==='function')$.cors=function(o){var r=h(o);return r||oc.apply(this,arguments)}}
shim();
var st=document.createElement('style');st.id='mf007_local_unlock_css';st.textContent='#mf007_loginDiv,.mf007_logout-btn,#mf007_member-btn,.mf007_member-btn{display:none!important}.mf007_settingSection{display:table-row!important}#mf007_betlink,#mf007_settinglink,#mf007_histlink,#mf007_Speed,#mf007_fnBtn,#mf007_calbetbtnDiv{visibility:visible!important;opacity:1!important;pointer-events:auto!important}';(document.head||document.documentElement).appendChild(st);
})();