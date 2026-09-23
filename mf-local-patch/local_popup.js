(function(){'use strict';
function installCss(){
  if(document.getElementById('mf007_local_popup_css'))return;
  var st=document.createElement('style');
  st.id='mf007_local_popup_css';
  st.textContent='#loading,#loginDiv,.mf007_memberSection,.memberSection,.logout-btn,#purchaseBtn{display:none!important}#settingDiv{display:block!important}';
  (document.head||document.documentElement).appendChild(st);
}
installCss();
function showSettings(){
  var e=document.getElementById('settingDiv');
  if(e)e.style.display='block';
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){installCss();showSettings()},{once:true});else showSettings();
})();