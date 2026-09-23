(function(){'use strict';
function h(){
  var e=document.getElementById('loading');if(e)e.style.display='none';
  e=document.getElementById('loginDiv');if(e)e.style.display='none';
  e=document.getElementById('settingDiv');if(e)e.style.display='block';
  document.querySelectorAll('.mf007_memberSection,.memberSection,.logout-btn,#purchaseBtn').forEach(function(x){x.style.display='none'});
}
function boot(){h();setTimeout(h,500);setTimeout(h,1500)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();