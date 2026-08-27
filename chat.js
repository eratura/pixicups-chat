(function(){
  var sb = supabase.createClient(
    "https://vhrjnaahofaqnggbdgbj.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZocmpuYWFob2ZhcW5nZ2JkZ2JqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3NzQxMjQsImV4cCI6MjEwMzM1MDEyNH0.Z4A-IDO8XtJCNEGyeCdBPtGi0jC3FyrTi__1J3rpZ1I"
  );
  var myLevel=1, myAvatar=null, myPass=null, myProfUrl=null;
  var bannedList=[], chatPaused=false;
  var soundOn=false, lastCount=0, firstLoad=true;
  var BEEP_URL = "";
  var nameEl=document.getElementById('pc-name'), statusEl=document.getElementById('pc-status');

  var saved=localStorage.getItem('pc_me');
  if(saved){try{var s=JSON.parse(saved);nameEl.value=s.name||'';myPass=s.pass||null;if(s.name)verifyName(s.name);}catch(e){}}
  soundOn = localStorage.getItem('pc_sound')==='1';
  updateSoundBtn();

  function say(m){statusEl.textContent=m;setTimeout(function(){if(statusEl.textContent===m)statusEl.textContent='';},3000);}

  function ask(text,onYes){
    document.getElementById('pc-confirmtext').textContent=text;
    var box=document.getElementById('pc-confirm');
    var yes=document.getElementById('pc-confirmyes');
    var fresh=yes.cloneNode(true);
    yes.parentNode.replaceChild(fresh,yes);
    fresh.addEventListener('click',function(){
      box.classList.remove('show');
      onYes();
    });
    box.classList.add('show');
  }

  window.pcSoon=function(){ say('private messages coming soon'); };

  function updateAdminUI(){
    var b=document.getElementById('pc-modbox');
    if(b) b.style.display = (myLevel===4) ? 'block' : 'none';
    var p=document.getElementById('pc-pausebtn');
    if(p) p.textContent = chatPaused ? 'unpause chat' : 'pause chat';
  }

  function verifyName(n){
    sb.from('users').select('*').eq('name',n).then(function(r){
      var rows=r.data||[];
      if(!rows.length){myLevel=1;myAvatar=null;myProfUrl=null;updateAdminUI();return;}
      var u=rows[0];
      if(u.password&&u.password===myPass){myLevel=u.level||2;myAvatar=u.avatar_url;myProfUrl=u.profile_url;}
      else if(u.password){myLevel=1;myAvatar=null;myProfUrl=null;}
      else {myLevel=2;myAvatar=u.avatar_url;myProfUrl=u.profile_url;}
      updateAdminUI();
    });
  }

  window.pcOpenProfile=function(){
    if(!myPass){say('log in first');return;}
    document.getElementById('pc-avpreview').src = myAvatar||'';
    document.getElementById('pc-profurl').value = myProfUrl||'';
    updateAdminUI();
    document.getElementById('pc-profile').classList.add('show');
  };
  window.pcCloseProfile=function(){document.getElementById('pc-profile').classList.remove('show');};

  window.pcLogout=function(){
    myPass=null; myLevel=1; myAvatar=null; myProfUrl=null;
    localStorage.removeItem('pc_me');
    nameEl.value='';
    pcCloseProfile();
    updateAdminUI();
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

  window.pcClearAll=function(){
    ask('Delete ALL messages? This cannot be undone.',function(){
      sb.from('messages').delete().neq('id',0).then(function(){
        say('chat cleared'); pcCloseProfile(); load();
      });
    });
  };

  window.pcTogglePause=function(){
    var newVal = chatPaused ? 'false' : 'true';
    sb.from('settings').update({value:newVal}).eq('key','paused').then(function(){
      chatPaused = !chatPaused;
      updateAdminUI();
      say(chatPaused ? 'chat paused' : 'chat unpaused');
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
      function done(){document.getElementById('pc-pw').classList.remove('show');updateAdminUI();}
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
    ask('Ban '+name+'?',function(){
      sb.from('bans').insert({name:name}).then(function(){say(name+' banned');load();});
    });
  };
  window.pcUnban=function(name){
    ask('Unban '+name+'?',function(){
      sb.from('bans').delete().eq('name',name).then(function(){say(name+' unbanned');load();});
    });
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
    sb.from('settings').select('*').eq('key','paused').then(function(sres){
      var srows=sres.data||[];
      chatPaused = srows.length && srows[0].value==='true';
      updateAdminUI();
      var ph=document.getElementById('pc-text');
      if(ph) ph.placeholder = (chatPaused && myLevel<4) ? 'chat is paused' : 'message';
      sb.from('bans').select('name').then(function(bres){
        bannedList=(bres.data||[]).map(function(x){return x.name;});
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
            var isBanned=bannedList.indexOf(m.name)!==-1;
            var tools='';
            if(canDel||myLevel===4||myPass){
              tools='<div class="pc-tools"><span class="pc-dots" onclick="pcToggleTray('+m.id+',event)"><i class="fa fa-ellipsis-v"></i></span><div class="pc-tray" id="tray'+m.id+'">';
              if(myLevel===4){
                if(isBanned) tools+='<button onclick="pcUnban(\''+esc(m.name)+'\')">unban user</button>';
                else tools+='<button onclick="pcBan(\''+esc(m.name)+'\')">ban user</button>';
              }
              if(canDel) tools+='<button onclick="pcDel('+m.id+')">delete</button>';
              tools+='<button onclick="pcSoon()">private message</button>';
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
      });
    });
  }

  window.pcDel=function(id){
    ask('Delete this message?',function(){
      sb.from('messages').delete().eq('id',id).then(load);
    });
  };

  window.pcSend=function(){
    var n=nameEl.value.trim();
    if(!n){say('enter a name');return;}
    var t=document.getElementById('pc-text').value.trim();
    var f=document.getElementById('pc-imgfile').files[0];
    if(!t&&!f)return;
    if(chatPaused && myLevel<4){say('chat is paused');return;}
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
  updateAdminUI();
  load();setInterval(load,3000);
})();
