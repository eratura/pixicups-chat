<style>
@import url('https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400;500&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css');

#pc-toggle { display: none; }
#pc-float { position: fixed; bottom: 18px; right: 18px; z-index: 99999; text-align: right; font-family: 'Pixelify Sans', cursive; }
#pc-panel {
  display: none; width: 500px; height: 700px;
  background: #FFF2FB; border: 2px solid #f3cddd; border-radius: 14px;
  box-sizing: border-box; box-shadow: 0 6px 18px rgba(200,150,175,.3);
  overflow: hidden; flex-direction: column; margin-bottom: 8px;
  text-align: left; position: relative;
}
#pc-toggle:checked ~ #pc-panel { display: flex; }
.pc-header { text-align: center; color: #c9a3b6; font-size: 12px; padding: 10px 0 6px; flex: 0 0 auto; }

#pc-messages {
  flex: 1 1 auto; overflow-y: auto; overflow-x: hidden; min-height: 0;
  padding: 4px; background: #FFFFFF; text-align: left;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 13px; color: #333; line-height: 1.4em;
}
.pc-msg { position: relative; clear: both; overflow: hidden; margin: 0.15em 0.25em; padding: 0; word-wrap: break-word; }
.pc-pic { float: left; width: 2.5em; height: 2.5em; margin-right: 4px; object-fit: cover; cursor: zoom-in; }
.pc-nme { display: inline; padding-right: 0.5em; font-weight: bolder; color: #aaa; }
.pc-nme a { color: inherit; text-decoration: none; }
.pc-lvl2 .pc-nme { color: #333; }
.pc-lvl2 .pc-nme:after { content: '\2606'; margin-left: 0.2em; font-weight: normal; }
.pc-lvl4 .pc-nme { color: #e79fc4; }
.pc-lvl4 .pc-nme:after { content: '\2606'; margin-left: 0.2em; font-weight: normal; }
.pc-body { display: inline; }
.pc-body img { max-width: 100%; max-height: 10em; margin-top: 3px; display: block; cursor: zoom-in; }
.pc-dtxt { color: #aaa; font-size: 80%; line-height: 1.5em; text-align: right; float: right; padding: 0 0.5em; min-width: 6em; }
.pc-del { float: right; color: #ccc; cursor: pointer; font-size: 90%; padding: 0 0.3em; }
.pc-del:hover { color: #e79fc4; }

#pc-bar { flex: 0 0 auto; background: #fff; padding: 0; box-sizing: border-box; }
#pc-toprow { display: flex; align-items: center; padding: 5px 8px 2px; gap: 8px; }
#pc-toprow .fa-user { color: #999; font-size: 13px; cursor: pointer; }
#pc-name { flex: 1; border: none; outline: none; font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; font-size: 11px; color: #333; background: transparent; padding: 2px 0; }
.pc-iconbtn { background: transparent; border: none; cursor: pointer; color: #999; font-size: 14px; padding: 2px 4px; }
.pc-iconbtn:hover { color: #e79fc4; }
.pc-iconbtn.on { color: #e79fc4; }
#pc-botrow { display: flex; align-items: center; padding: 2px 8px 7px; gap: 8px; }
#pc-text { flex: 1; border: none; outline: none; font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; font-size: 13px; color: #333; background: transparent; padding: 2px 0; }
#pc-imgfile, #pc-avfile { display: none; }
#pc-status { font-size: 10px; color: #c9a3b6; padding: 0 8px; font-family: 'Pixelify Sans', cursive; }
#pc-lockmsg { font-size: 10px; color: #c9666a; padding: 0 8px; font-family: 'Pixelify Sans', cursive; }

.pc-overlay {
  display: none; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(255,255,255,.97); z-index: 5;
  flex-direction: column; align-items: center; justify-content: center; gap: 12px;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; font-size: 13px;
}
.pc-overlay.show { display: flex; }
#pc-avpreview { width: 90px; height: 90px; object-fit: cover; background: #f3f3f3; }
.pc-overlay label { font-size: 12px; color: #666; }
.pc-overlay input[type=text], .pc-overlay input[type=password] { width: 230px; padding: 6px 8px; border: 1px solid #ddd; font-size: 12px; }
.pc-pbtn { background: #FFF2FB; color: #b5849c; border: 1px solid #f3cddd; padding: 6px 14px; font-size: 12px; cursor: pointer; font-family: 'Pixelify Sans', cursive; }
#pc-pwmsg { font-size: 11px; color: #c9666a; min-height: 14px; }
#pc-pwtitle { font-size: 13px; color: #666; }

#pc-zoom {
  display: none; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(255,255,255,.9); z-index: 6; cursor: zoom-out;
  align-items: center; justify-content: center; padding: 20px; box-sizing: border-box;
}
#pc-zoom.show { display: flex; }
#pc-zoom img { max-width: 100%; max-height: 100%; }

.pc-tab { display: inline-block; margin-top: 8px; background: #FFF2FB; color: #b5849c; border: 2px solid #f3cddd; border-radius: 999px; padding: 7px 14px; font-size: 12px; cursor: pointer; box-shadow: 0 3px 10px rgba(200,150,175,.25); user-select: none; font-family: 'Pixelify Sans', cursive; }

@media (max-width: 600px) {
  #pc-float { bottom: 12px; right: 12px; left: auto; pointer-events: none; }
  #pc-float > * { pointer-events: auto; }
  #pc-panel { position: fixed; bottom: 60px; left: 50%; transform: translateX(-50%); width: 88vw; max-width: 340px; height: 72vh; max-height: 560px; }
}
</style>

<div id="pc-float">
  <input type="checkbox" id="pc-toggle">
  <div id="pc-panel">
    <div class="pc-header">♡ leave a note ♡</div>
    <div id="pc-messages"></div>

    <div id="pc-profile" class="pc-overlay">
      <img id="pc-avpreview" src="">
      <button class="pc-pbtn" id="pc-avbtn">change picture</button>
      <input type="file" id="pc-avfile" accept="image/*">
      <label>profile url:</label>
      <input type="text" id="pc-profurl" placeholder="https://">
      <div style="display:flex;gap:8px">
        <button class="pc-pbtn" id="pc-savebtn">save</button>
        <button class="pc-pbtn" id="pc-profclose">close</button>
      </div>
    </div>

    <div id="pc-pw" class="pc-overlay">
      <div id="pc-pwtitle">password</div>
      <input type="password" id="pc-pwinput" placeholder="password">
      <div id="pc-pwmsg"></div>
      <div style="display:flex;gap:8px">
        <button class="pc-pbtn" id="pc-pwgo">go</button>
        <button class="pc-pbtn" id="pc-pwcancel">cancel</button>
      </div>
    </div>

    <div id="pc-zoom"><img src=""></div>

    <div id="pc-bar">
      <div id="pc-toprow">
        <i class="fa fa-user" id="pc-profbtn" title="your profile"></i>
        <input id="pc-name" placeholder="name" maxlength="25">
        <button class="pc-iconbtn" id="pc-loginbtn" title="log in"><i class="fa fa-sign-in"></i></button>
        <button class="pc-iconbtn" id="pc-soundbtn" title="sound"><i class="fa fa-volume-up"></i></button>
      </div>
      <div id="pc-lockmsg"></div>
      <div id="pc-status"></div>
      <div id="pc-botrow">
        <button class="pc-iconbtn" id="pc-imgbtn" title="image"><i class="fa fa-picture-o"></i></button>
        <input type="file" id="pc-imgfile" accept="image/*">
        <input id="pc-text" placeholder="message" maxlength="500">
        <button class="pc-iconbtn" id="pc-sendbtn" title="post"><i class="fa fa-caret-right" style="font-size:19px"></i></button>
      </div>
    </div>
  </div>
  <label for="pc-toggle" class="pc-tab">♡ chat</label>
</div>

<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script>
(function(){
  var sb = supabase.createClient(
    "https://vhrjnaahofaqnggbdgbj.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZocmpuYWFob2ZhcW5nZ2JkZ2JqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3NzQxMjQsImV4cCI6MjEwMzM1MDEyNH0.Z4A-IDO8XtJCNEGyeCdBPtGi0jC3FyrTi__1J3rpZ1I"
  );

  var myLevel=1, myAvatar=null, myPass=null, myProfUrl=null;
  var authedName=null;
  var soundOn=false, lastCount=0, firstLoad=true;
  var BEEP_URL = "";

  var nameEl=document.getElementById('pc-name');
  var statusEl=document.getElementById('pc-status');
  var lockEl=document.getElementById('pc-lockmsg');
  var textEl=document.getElementById('pc-text');
  var msgBox=document.getElementById('pc-messages');
  var imgFile=document.getElementById('pc-imgfile');
  var avFile=document.getElementById('pc-avfile');

  function say(m){
    statusEl.textContent=m;
    setTimeout(function(){ if(statusEl.textContent===m) statusEl.textContent=''; },3000);
  }
  function showOverlay(id){ document.getElementById(id).classList.add('show'); }
  function hideOverlay(id){ document.getElementById(id).classList.remove('show'); }

  function checkName(n){
    return sb.from('users').select('*').eq('name',n).then(function(r){
      if(r.error){ authedName=null; lockEl.textContent='connection problem'; return false; }
      var rows=r.data||[];
      if(rows.length===0){
        myLevel=1; myAvatar=null; myProfUrl=null;
        authedName=n; lockEl.textContent='';
        return true;
      }
      var u=rows[0];
      if(!u.password){
        myLevel=2; myAvatar=u.avatar_url; myProfUrl=u.profile_url;
        authedName=n; lockEl.textContent='';
        return true;
      }
      if(u.password===myPass){
        myLevel=u.level||2; myAvatar=u.avatar_url; myProfUrl=u.profile_url;
        authedName=n; lockEl.textContent='';
        return true;
      }
      myLevel=1; myAvatar=null; myProfUrl=null;
      authedName=null;
      lockEl.textContent='that name is registered — log in to use it';
      return false;
    });
  }

  var saved=localStorage.getItem('pc_me');
  if(saved){
    try{
      var s=JSON.parse(saved);
      nameEl.value=s.name||'';
      myPass=s.pass||null;
      if(s.name) checkName(s.name);
    }catch(e){}
  }
  soundOn = localStorage.getItem('pc_sound')==='1';
  updateSoundBtn();

  var nameTimer=null;
  nameEl.addEventListener('input',function(){
    authedName=null;
    lockEl.textContent='';
    clearTimeout(nameTimer);
    var n=nameEl.value.trim();
    if(!n) return;
    nameTimer=setTimeout(function(){ checkName(n); },600);
  });

  document.getElementById('pc-profbtn').addEventListener('click',function(){
    if(!myPass||!authedName){ say('log in first'); return; }
    document.getElementById('pc-avpreview').src = myAvatar||'';
    document.getElementById('pc-profurl').value = myProfUrl||'';
    showOverlay('pc-profile');
  });
  document.getElementById('pc-profclose').addEventListener('click',function(){ hideOverlay('pc-profile'); });
  document.getElementById('pc-avbtn').addEventListener('click',function(){ avFile.click(); });

  document.getElementById('pc-savebtn').addEventListener('click',function(){
    var n=nameEl.value.trim();
    var url=document.getElementById('pc-profurl').value.trim()||null;
    sb.from('users').update({profile_url:url}).eq('name',n).then(function(){
      myProfUrl=url; say('profile saved'); hideOverlay('pc-profile');
    });
  });

  function openPw(){
    var n=nameEl.value.trim();
    if(!n){ say('type a name first'); return; }
    document.getElementById('pc-pwtitle').textContent='password for '+n;
    document.getElementById('pc-pwinput').value='';
    document.getElementById('pc-pwmsg').textContent='';
    showOverlay('pc-pw');
    setTimeout(function(){ document.getElementById('pc-pwinput').focus(); },50);
  }
  document.getElementById('pc-loginbtn').addEventListener('click', openPw);
  document.getElementById('pc-pwcancel').addEventListener('click',function(){ hideOverlay('pc-pw'); });

  function pwSubmit(){
    var n=nameEl.value.trim();
    var p=document.getElementById('pc-pwinput').value;
    var msg=document.getElementById('pc-pwmsg');
    if(!p){ msg.textContent='enter a password'; return; }
    sb.from('users').select('*').eq('name',n).then(function(r){
      var rows=r.data||[];
      if(rows.length===0){
        sb.from('users').insert({name:n,password:p,level:2}).then(function(){
          myPass=p; myLevel=2; authedName=n; lockEl.textContent='';
          localStorage.setItem('pc_me',JSON.stringify({name:n,pass:p}));
          hideOverlay('pc-pw'); say('name registered');
        });
        return;
      }
      var u=rows[0];
      if(!u.password){
        sb.from('users').update({password:p,level:2}).eq('name',n).then(function(){
          myPass=p; myLevel=2; authedName=n; lockEl.textContent='';
          localStorage.setItem('pc_me',JSON.stringify({name:n,pass:p}));
          hideOverlay('pc-pw'); say('name registered');
        });
        return;
      }
      if(u.password===p){
        myPass=p; myLevel=u.level||2; myAvatar=u.avatar_url; myProfUrl=u.profile_url;
        authedName=n; lockEl.textContent='';
        localStorage.setItem('pc_me',JSON.stringify({name:n,pass:p}));
        hideOverlay('pc-pw'); say('logged in');
        return;
      }
      msg.textContent='wrong password';
    });
  }
  document.getElementById('pc-pwgo').addEventListener('click', pwSubmit);
  document.getElementById('pc-pwinput').addEventListener('keydown',function(e){
    if(e.key==='Enter') pwSubmit();
  });

  function updateSoundBtn(){
    var b=document.getElementById('pc-soundbtn');
    b.className='pc-iconbtn'+(soundOn?' on':'');
    b.innerHTML = soundOn ? '<i class="fa fa-volume-up"></i>' : '<i class="fa fa-volume-off"></i>';
  }
  document.getElementById('pc-soundbtn').addEventListener('click',function(){
    soundOn=!soundOn;
    localStorage.setItem('pc_sound', soundOn?'1':'0');
    updateSoundBtn();
  });
  function playBeep(){
    if(!soundOn) return;
    if(!BEEP_URL) return;
    try{ new Audio(BEEP_URL).play(); }catch(e){}
  }

  avFile.addEventListener('change',function(){
    var n=nameEl.value.trim();
    if(!n||!myPass||!authedName){ say('log in first'); return; }
    var f=avFile.files[0];
    if(!f) return;
    var path='av_'+Date.now()+'_'+Math.random().toString(36).slice(2);
    sb.storage.from('chat-images').upload(path,f).then(function(u){
      if(u.error){ say('upload failed'); return; }
      var url=sb.storage.from('chat-images').getPublicUrl(path).data.publicUrl;
      sb.from('users').update({avatar_url:url}).eq('name',n).then(function(){
        myAvatar=url;
        document.getElementById('pc-avpreview').src=url;
        say('avatar updated');
      });
    });
  });

  document.getElementById('pc-imgbtn').addEventListener('click',function(){ imgFile.click(); });

  var zoomEl=document.getElementById('pc-zoom');
  zoomEl.addEventListener('click',function(){ zoomEl.classList.remove('show'); });
  function openZoom(src){
    zoomEl.querySelector('img').src=src;
    zoomEl.classList.add('show');
  }

  function ago(t){
    var secs=Math.floor((Date.now()-new Date(t).getTime())/1000);
    if(secs<60) return secs+' secs ago';
    var mins=Math.floor(secs/60);
    if(mins<60) return mins+(mins===1?' min ago':' mins ago');
    var hrs=Math.floor(mins/60);
    if(hrs<24) return hrs+(hrs===1?' hour ago':' hours ago');
    var days=Math.floor(hrs/24);
    return days+(days===1?' day ago':' days ago');
  }

  function buildMsg(m){
    var lvl=m.level||1;
    var wrap=document.createElement('div');
    wrap.className='pc-msg pc-lvl'+lvl;

    if(myLevel===4){
      var del=document.createElement('span');
      del.className='pc-del';
      del.innerHTML='<i class="fa fa-trash-o"></i>';
      del.addEventListener('click',function(){
        if(confirm('Delete this message?')){
          sb.from('messages').delete().eq('id',m.id).then(load);
        }
      });
      wrap.appendChild(del);
    }

    var dt=document.createElement('div');
    dt.className='pc-dtxt';
    dt.textContent=ago(m.created_at);
    wrap.appendChild(dt);

    if(m.avatar_url){
      var pic=document.createElement('img');
      pic.className='pc-pic';
      pic.src=m.avatar_url;
      pic.addEventListener('click',function(){ openZoom(m.avatar_url); });
      wrap.appendChild(pic);
    }

    var nme=document.createElement('div');
    nme.className='pc-nme';
    if(m.profile_url){
      var a=document.createElement('a');
      a.href=m.profile_url;
      a.target='_blank';
      a.textContent=m.name;
      nme.appendChild(a);
    } else {
      nme.textContent=m.name;
    }
    wrap.appendChild(nme);

    var body=document.createElement('div');
    body.className='pc-body';
    if(m.text) body.textContent=m.text;
    if(m.image_url){
      var im=document.createElement('img');
      im.src=m.image_url;
      im.addEventListener('click',function(){ openZoom(m.image_url); });
      body.appendChild(im);
    }
    wrap.appendChild(body);

    return wrap;
  }

  function load(){
    var cutoff=new Date(Date.now()-30*24*60*60*1000).toISOString();
    sb.from('messages').select('*').gte('created_at',cutoff).order('created_at',{ascending:true}).then(function(r){
      var rows=r.data||[];
      if(!firstLoad && rows.length>lastCount) playBeep();
      lastCount=rows.length;
      firstLoad=false;
      var atBottom = msgBox.scrollHeight - msgBox.scrollTop - msgBox.clientHeight < 40;
      msgBox.innerHTML='';
      for(var i=0;i<rows.length;i++){
        msgBox.appendChild(buildMsg(rows[i]));
      }
      if(atBottom) msgBox.scrollTop=msgBox.scrollHeight;
    });
  }

  function doSend(n,t,f){
    if(authedName!==n){ openPw(); return; }
    if(f && myLevel<2){ say('register your name to post images'); return; }
    localStorage.setItem('pc_me',JSON.stringify({name:n,pass:myPass}));
    if(f){
      var path=Date.now()+'_'+Math.random().toString(36).slice(2);
      sb.storage.from('chat-images').upload(path,f).then(function(u){
        if(u.error){ say('image failed'); return; }
        var url=sb.storage.from('chat-images').getPublicUrl(path).data.publicUrl;
        insert(n,t,url);
      });
    } else {
      insert(n,t,null);
    }
  }

  function insert(n,t,img){
    sb.from('messages').insert({
      name:n, level:myLevel, avatar_url:myAvatar,
      profile_url:myProfUrl, text:t||null, image_url:img
    }).then(function(){
      textEl.value='';
      imgFile.value='';
      load();
    });
  }

  function send(){
    var n=nameEl.value.trim();
    if(!n){ say('enter a name'); return; }
    var t=textEl.value.trim();
    var f=imgFile.files[0];
    if(!t && !f) return;
    if(authedName!==n){
      checkName(n).then(function(ok){
        if(!ok){ openPw(); return; }
        doSend(n,t,f);
      });
      return;
    }
    doSend(n,t,f);
  }

  document.getElementById('pc-sendbtn').addEventListener('click', send);
  textEl.addEventListener('keydown',function(e){ if(e.key==='Enter') send(); });

  load();
  setInterval(load,3000);
})();
</script>
