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
.pc-msg { position: relative; clear: both; overflow: visible; margin: 0.15em 0.25em; padding: 0; word-wrap: break-word; }
.pc-pic { float: left; width: 2.5em; height: 2.5em; margin-right: 4px; object-fit: cover; cursor: zoom-in; }
.pc-nme { display: inline; padding-right: 0.5em; font-weight: bolder; color: #aaa; }
.pc-nme a { color: inherit; text-decoration: none; }
.pc-lvl2 .pc-nme { color: #333; }
.pc-lvl2 .pc-nme:after { content: '\f006'; font-family: FontAwesome; margin-left: 0.2em; font-weight: normal; }
.pc-lvl4 .pc-nme { color: #e79fc4; }
.pc-lvl4 .pc-nme:after { content: '\f006'; font-family: FontAwesome; margin-left: 0.2em; font-weight: normal; }
.pc-body { display: inline; }
.pc-body img { max-width: 100%; max-height: 10em; margin-top: 3px; display: block; cursor: zoom-in; }
.pc-dtxt { color: #aaa; font-size: 80%; line-height: 1.5em; text-align: right; float: right; padding: 0 0.5em; min-width: 6em; }

.pc-tools { float: right; position: relative; }
.pc-dots { color: #ccc; cursor: pointer; font-size: 90%; padding: 0 0.4em; }
.pc-dots:hover { color: #e79fc4; }
.pc-tray {
  display: none; position: absolute; right: 0; top: 100%;
  background: #fff; border: 1px solid #f3cddd; z-index: 20;
  white-space: nowrap; box-shadow: 0 2px 6px rgba(0,0,0,.12);
}
.pc-tray.open { display: block; }
.pc-tray button {
  display: block; width: 100%; text-align: left;
  background: #fff; border: none; cursor: pointer;
  padding: 6px 12px; font-size: 12px; color: #666;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
}
.pc-tray button:hover { background: #FFF2FB; color: #b5849c; }

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

.pc-overlay {
  display: none; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(255,255,255,.97); z-index: 25;
  flex-direction: column; align-items: center; justify-content: center; gap: 12px;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; font-size: 13px;
}
.pc-overlay.show { display: flex; }
.pc-overlay input { width: 230px; padding: 6px 8px; border: 1px solid #ddd; font-size: 12px; }
#pc-avpreview { width: 90px; height: 90px; object-fit: cover; background: #f3f3f3; }
.pc-overlay label { font-size: 12px; color: #666; }
.pc-pbtn { background: #FFF2FB; color: #b5849c; border: 1px solid #f3cddd; padding: 6px 14px; font-size: 12px; cursor: pointer; font-family: 'Pixelify Sans', cursive; }
#pc-pwmsg { font-size: 11px; color: #c9666a; min-height: 14px; }
#pc-pwtitle { font-size: 13px; color: #666; }

#pc-zoom {
  display: none; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(255,255,255,.9); z-index: 30; cursor: zoom-out;
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
      <button class="pc-pbtn" onclick="document.getElementById('pc-avfile').click()">change picture</button>
      <input type="file" id="pc-avfile" accept="image/*">
      <label>profile url:</label>
      <input type="text" id="pc-profurl" placeholder="https://">
      <div style="display:flex;gap:8px">
        <button class="pc-pbtn" onclick="pcSaveProfile()">save</button>
        <button class="pc-pbtn" onclick="pcLogout()">log out</button>
        <button class="pc-pbtn" onclick="pcCloseProfile()">close</button>
      </div>
    </div>

    <div id="pc-pw" class="pc-overlay">
      <div id="pc-pwtitle">password</div>
      <input type="password" id="pc-pwinput" placeholder="password">
      <div id="pc-pwmsg"></div>
      <div style="display:flex;gap:8px">
        <button class="pc-pbtn" onclick="pcPwSubmit()">go</button>
        <button class="pc-pbtn" onclick="document.getElementById('pc-pw').classList.remove('show')">cancel</button>
      </div>
    </div>

    <div id="pc-zoom" onclick="this.classList.remove('show')"><img src=""></div>

    <div id="pc-bar">
      <div id="pc-toprow">
        <i class="fa fa-user" onclick="pcOpenProfile()" title="your profile"></i>
        <input id="pc-name" placeholder="name" maxlength="25">
        <button class="pc-iconbtn" onclick="pcClaim()" title="log in"><i class="fa fa-sign-in"></i></button>
        <button class="pc-iconbtn" id="pc-soundbtn" onclick="pcToggleSound()" title="sound"><i class="fa fa-volume-up"></i></button>
      </div>
      <div id="pc-status"></div>
      <div id="pc-botrow">
        <button class="pc-iconbtn" onclick="document.getElementById('pc-imgfile').click()" title="image"><i class="fa fa-picture-o"></i></button>
        <input type="file" id="pc-imgfile" accept="image/*">
        <input id="pc-text" placeholder="message" maxlength="500">
        <button class="pc-iconbtn" onclick="pcSend()" title="post"><i class="fa fa-caret-right" style="font-size:19px"></i></button>
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
  var soundOn=false, lastCount=0, firstLoad=true;
  var BEEP_URL = "";
  var nameEl=document.getElementById('pc-name'), statusEl=document.getElementById('pc-status');

  var saved=localStorage.getItem('pc_me');
  if(saved){try{var s=JSON.parse(saved);nameEl.value=s.name||'';myPass=s.pass||null;if(s.name)verifyName(s.name);}catch(e){}}
  soundOn = localStorage.getItem('pc_sound')==='1';
  updateSoundBtn();

  function say(m){statusEl.textContent=m;setTimeout(function(){if(statusEl.textContent===m)statusEl.textContent='';},3000);}

  function verifyName(n){
    sb.from('users').select('*').eq('name',n).then(function(r){
      var rows=r.data||[];
      if(!rows.length){myLevel=1;myAvatar=null;myProfUrl=null;return;}
      var u=rows[0];
      if(u.password&&u.password===myPass){myLevel=u.level||2;myAvatar=u.avatar_url;myProfUrl=u.profile_url;}
      else if(u.password){myLevel=1;myAvatar=null;myProfUrl=null;}
      else {myLevel=2;myAvatar=u.avatar_url;myProfUrl=u.profile_url;}
    });
  }

  window.pcOpenProfile=function(){
    if(!myPass){say('log in first');return;}
    document.getElementById('pc-avpreview').src = myAvatar||'';
    document.getElementById('pc-profurl').value = myProfUrl||'';
    document.getElementById('pc-profile').classList.add('show');
  };
  window.pcCloseProfile=function(){document.getElementById('pc-profile').classList.remove('show');};

  window.pcLogout=function(){
    myPass=null; myLevel=1; myAvatar=null; myProfUrl=null;
    localStorage.removeItem('pc_me');
    nameEl.value='';
    pcCloseProfile();
    say('logged out');
    load();
  };

  window.pcSaveProfile=function(){
    var n=nameEl.value.trim();
    var url=document.getElementById('pc-profurl').value.trim()||null;
    sb.from('users').update({profile_url:url}).eq('name',n).then(function(){
      myProfUrl=url; say('profile saved'); pcCloseProfile();
    });
  };

  window.pcClaim=function(){
    var n=nameEl.value.trim();
    if(!n){say('type a name first');return;}
    document.getElementById('pc-pwtitle').textContent='password for '+n;
    document.getElementById('pc-pwinput').value='';
    document.getElementById('pc-pwmsg').textContent='';
    document.getElementById('pc-pw').classList.add('show');
    setTimeout(function(){document.getElementById('pc-pwinput').focus();},50);
  };

  window.pcPwSubmit=function(){
    var n=nameEl.value.trim();
    var p=document.getElementById('pc-pwinput').value;
    var msg=document.getElementById('pc-pwmsg');
    if(!p){msg.textContent='enter a password';return;}
    sb.from('users').select('*').eq('name',n).then(function(r){
      var rows=r.data||[];
      function done(){document.getElementById('pc-pw').classList.remove('show');}
      if(!rows.length){
        sb.from('users').insert({name:n,password:p,level:2}).then(function(){
          myPass=p;myLevel=2;
          localStorage.setItem('pc_me',JSON.stringify({name:n,pass:p}));
          done();say('name claimed');load();
        });
        return;
      }
      var u=rows[0];
      if(!u.password){
        sb.from('users').update({password:p,level:2}).eq('name',n).then(function(){
          myPass=p;myLevel=2;
          localStorage.setItem('pc_me',JSON.stringify({name:n,pass:p}));
          done();say('name claimed');load();
        });
        return;
      }
      if(u.password===p){
        myPass=p;myLevel=u.level||2;myAvatar=u.avatar_url;myProfUrl=u.profile_url;
        localStorage.setItem('pc_me',JSON.stringify({name:n,pass:p}));
        done();say('logged in');load();
        return;
      }
      msg.textContent='wrong password';
    });
  };

  window.pcToggleSound=function(){
    soundOn=!soundOn;
    localStorage.setItem('pc_sound', soundOn?'1':'0');
    updateSoundBtn();
  };
  function updateSoundBtn(){
    var b=document.getElementById('pc-soundbtn');
    b.className = 'pc-iconbtn' + (soundOn?' on':'');
    b.innerHTML = soundOn ? '<i class="fa fa-volume-up"></i>' : '<i class="fa fa-volume-off"></i>';
  }
  function playBeep(){
    if(!soundOn||!BEEP_URL)return;
    try{ new Audio(BEEP_URL).play(); }catch(e){}
  }

  document.getElementById('pc-avfile').onchange=function(){
    var n=nameEl.value.trim();
    if(!n||!myPass){say('log in first');return;}
    var f=this.files[0];if(!f)return;
    var path='av_'+Date.now()+'_'+Math.random().toString(36).slice(2);
    sb.storage.from('chat-images').upload(path,f).then(function(u){
      if(u.error){say('upload failed');return;}
      var url=sb.storage.from('chat-images').getPublicUrl(path).data.publicUrl;
      sb.from('users').update({avatar_url:url}).eq('name',n).then(function(){
        myAvatar=url;
        document.getElementById('pc-avpreview').src=url;
        say('avatar updated');
      });
    });
  };

  nameEl.addEventListener('blur',function(){var n=nameEl.value.trim();if(n)verifyName(n);});
  document.getElementById('pc-pwinput').addEventListener('keydown',function(e){if(e.key==='Enter')pcPwSubmit();});

  window.pcToggleTray=function(id,ev){
    ev.stopPropagation();
    var all=document.querySelectorAll('.pc-tray');
    for(var i=0;i<all.length;i++){
      if(all[i].id!=='tray'+id) all[i].classList.remove('open');
    }
    document.getElementById('tray'+id).classList.toggle('open');
  };
  document.addEventListener('click',function(){
    var all=document.querySelectorAll('.pc-tray');
    for(var i=0;i<all.length;i++) all[i].classList.remove('open');
  });

  window.pcBan=function(name){
    if(!confirm('Ban '+name+'?'))return;
    sb.from('bans').insert({name:name}).then(function(){say(name+' banned');});
  };

  function esc(s){var d=document.createElement('div');d.textContent=s;return d.innerHTML;}
  function ago(t){
    var s=Math.floor((Date.now()-new Date(t).getTime())/1000);
    if(s<60)return s+' secs ago';
    var m=Math.floor(s/60);if(m<60)return m+(m===1?' min ago':' mins ago');
    var h=Math.floor(m/60);if(h<24)return h+(h===1?' hour ago':' hours ago');
    var d=Math.floor(h/24);return d+(d===1?' day ago':' days ago');
  }

  window.pcZoom=function(src){
    var z=document.getElementById('pc-zoom');
    z.querySelector('img').src=src;
    z.classList.add('show');
  };

  function load(){
    var cutoff=new Date(Date.now()-30*24*60*60*1000).toISOString();
    sb.from('messages').select('*').gte('created_at',cutoff).order('created_at',{ascending:true}).then(function(r){
      var rows=r.data||[],box=document.getElementById('pc-messages');
      if(!firstLoad && rows.length>lastCount) playBeep();
      lastCount=rows.length; firstLoad=false;
      var atBottom=box.scrollHeight-box.scrollTop-box.clientHeight<40;
      box.innerHTML='';
      var myName=nameEl.value.trim();
      rows.forEach(function(m){
        var lvl=m.level||1,d=document.createElement('div');
        d.className='pc-msg pc-lvl'+lvl;
        var pic=m.avatar_url?'<img class="pc-pic" src="'+m.avatar_url+'" onclick="pcZoom(\''+m.avatar_url+'\')">':'';
        var canDel=(myLevel===4)||(myPass&&m.name===myName);
        var tools='';
        if(canDel||myLevel===4||myPass){
          tools='<div class="pc-tools"><span class="pc-dots" onclick="pcToggleTray('+m.id+',event)"><i class="fa fa-ellipsis-v"></i></span><div class="pc-tray" id="tray'+m.id+'">';
          if(myLevel===4) tools+='<button onclick="pcBan(\''+esc(m.name)+'\')">ban user</button>';
          if(canDel) tools+='<button onclick="pcDel('+m.id+')">delete</button>';
          tools+='<button onclick="alert(\'coming soon\')">private message</button>';
          tools+='</div></div>';
        }
        var nameHtml = m.profile_url ? '<a href="'+esc(m.profile_url)+'" target="_blank">'+esc(m.name)+'</a>' : esc(m.name);
        var body='';
        if(m.text)body+=esc(m.text);
        if(m.image_url)body+='<img src="'+m.image_url+'" onclick="pcZoom(\''+m.image_url+'\')">';
        d.innerHTML=tools+'<div class="pc-dtxt">'+ago(m.created_at)+'</div>'+pic+'<div class="pc-nme">'+nameHtml+'</div><div class="pc-body">'+body+'</div>';
        box.appendChild(d);
      });
      if(atBottom)box.scrollTop=box.scrollHeight;
    });
  }

  window.pcDel=function(id){if(!confirm('Delete this message?'))return;sb.from('messages').delete().eq('id',id).then(load);};

  window.pcSend=function(){
    var n=nameEl.value.trim();
    if(!n){say('enter a name');return;}
    var t=document.getElementById('pc-text').value.trim();
    var f=document.getElementById('pc-imgfile').files[0];
    if(!t&&!f)return;
    sb.from('bans').select('name').eq('name',n).then(function(b){
      if((b.data||[]).length){say('you are banned');return;}
      sb.from('users').select('*').eq('name',n).then(function(r){
        var rows=r.data||[];
        if(rows.length && rows[0].password && rows[0].password!==myPass){
          say('that name is registered — log in first');
          pcClaim();
          return;
        }
        if(f&&myLevel<2){say('log in to post images');return;}
        localStorage.setItem('pc_me',JSON.stringify({name:n,pass:myPass}));
        if(f){
          var path=Date.now()+'_'+Math.random().toString(36).slice(2);
          sb.storage.from('chat-images').upload(path,f).then(function(u){
            if(u.error){say('image failed');return;}
            ins(n,t,sb.storage.from('chat-images').getPublicUrl(path).data.publicUrl);
          });
        } else ins(n,t,null);
      });
    });
  };

  function ins(n,t,img){
    sb.from('messages').insert({name:n,level:myLevel,avatar_url:myAvatar,profile_url:myProfUrl,text:t||null,image_url:img}).then(function(){
      document.getElementById('pc-text').value='';
      document.getElementById('pc-imgfile').value='';
      load();
    });
  }

  document.getElementById('pc-text').addEventListener('keydown',function(e){if(e.key==='Enter')pcSend();});
  load();setInterval(load,3000);
})();
</script>
