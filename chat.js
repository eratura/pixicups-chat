(function(){
  var sb = supabase.createClient(
    "https://vhrjnaahofaqnggbdgbj.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZocmpuYWFob2ZhcW5nZ2JkZ2JqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3NzQxMjQsImV4cCI6MjEwMzM1MDEyNH0.Z4A-IDO8XtJCNEGyeCdBPtGi0jC3FyrTi__1J3rpZ1I"
  );
  var myLevel=1, myAvatar=null, myPass=null, myProfUrl=null;
  var bannedList=[], bannedPrints=[], chatPaused=false, regOnly=false;
  var filterList=[], blockLinks=false, antiSpam=true, sendTimes=[], pinnedMsg='';
  var soundOn=false, lastCount=0, firstLoad=true;
  var lastMaxId=0;
  var BEEP_URL = "https://eratura.github.io/pixicups-chat/750607__deadrobotmusic__notification-sound-1.wav";
  var nameEl=document.getElementById('pc-name'), statusEl=document.getElementById('pc-status');

  var myPrint=localStorage.getItem('pc_fp');
  if(!myPrint){
    myPrint='fp_'+Date.now().toString(36)+Math.random().toString(36).slice(2,10);
    localStorage.setItem('pc_fp',myPrint);
  }

  var saved=localStorage.getItem('pc_me');
  if(saved){try{var s=JSON.parse(saved);nameEl.value=s.name||'';myPass=s.pass||null;if(s.name)verifyName(s.name);}catch(e){}}
  soundOn = localStorage.getItem('pc_sound')==='1';
  updateSoundBtn();

  function say(m){statusEl.textContent=m;setTimeout(function(){if(statusEl.textContent===m)statusEl.textContent='';},3000);}

  function censor(text){
    if(!text||!filterList.length) return text;
    var out=text;
    for(var i=0;i<filterList.length;i++){
      var w=filterList[i];
      if(!w) continue;
      var safe=w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
      var re=new RegExp('\\b'+safe+'\\b','gi');
      out=out.replace(re,function(match){
        var stars='';
        for(var k=0;k<match.length;k++) stars+='*';
        return stars;
      });
    }
    return out;
  }

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
    var g=document.getElementById('pc-regbtn');
    if(g) g.textContent = regOnly ? 'allow guests' : 'members only';
    var bn=document.getElementById('pc-banner');
    if(bn) bn.style.display = regOnly ? 'block' : 'none';
    var lb=document.getElementById('pc-linkbtn');
    if(lb) lb.textContent = blockLinks ? 'on' : 'off';
    var sp=document.getElementById('pc-spambtn');
    if(sp) sp.textContent = antiSpam ? 'on' : 'off';
    var pn=document.getElementById('pc-pinned');
    if(pn){
      pn.textContent=pinnedMsg;
      pn.style.display = pinnedMsg ? 'block' : 'none';
    }
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

  window.pcToggleRegOnly=function(){
    var newVal = regOnly ? 'false' : 'true';
    sb.from('settings').update({value:newVal}).eq('key','regonly').then(function(){
      regOnly = !regOnly;
      updateAdminUI();
      say(regOnly ? 'members only' : 'guests allowed');
    });
  };

  window.pcToggleLinks=function(){
    var v = blockLinks ? 'false' : 'true';
    sb.from('settings').update({value:v}).eq('key','blocklinks').then(function(){
      blockLinks=!blockLinks; updateAdminUI();
      say(blockLinks?'links blocked':'links allowed');
    });
  };

  window.pcToggleSpam=function(){
    var v = antiSpam ? 'false' : 'true';
    sb.from('settings').update({value:v}).eq('key','antispam').then(function(){
      antiSpam=!antiSpam; updateAdminUI();
      say(antiSpam?'spam protection on':'spam protection off');
    });
  };

  window.pcOpenPin=function(){
    document.getElementById('pc-pininput').value=pinnedMsg||'';
    document.getElementById('pc-pin').classList.add('show');
  };

  window.pcSavePin=function(){
    var v=document.getElementById('pc-pininput').value.trim();
    sb.from('settings').update({value:v}).eq('key','pinned').then(function(){
      pinnedMsg=v;
      updateAdminUI();
      document.getElementById('pc-pin').classList.remove('show');
      say(v?'pinned':'pin removed');
    });
  };

  window.pcOpenBanList=function(){
    var body=document.getElementById('pc-banlistbody');
    body.innerHTML='loading...';
    document.getElementById('pc-banlist').classList.add('show');
    sb.from('bans').select('*').order('created_at',{ascending:false}).then(function(r){
      var rows=r.data||[];
      if(!rows.length){ body.innerHTML='<div style="color:#999;padding:8px">nobody is banned</div>'; return; }
      body.innerHTML='';
      rows.forEach(function(b){
        var row=document.createElement('div');
        row.style.cssText='display:flex;justify-content:space-between;align-items:center;padding:5px 4px;border-bottom:1px solid #f7e3ee';
        var nm=document.createElement('span');
        nm.textContent=b.name;
        var btn=document.createElement('button');
        btn.className='pc-pbtn';
        btn.style.cssText='padding:3px 9px;font-size:11px';
        btn.textContent='unban';
        btn.addEventListener('click',function(){
          sb.from('bans').delete().eq('name',b.name).then(function(){
            say(b.name+' unbanned');
            pcOpenBanList();
            load();
          });
        });
        row.appendChild(nm); row.appendChild(btn);
        body.appendChild(row);
      });
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

  window.pcBan=function(name,print){
    ask('Ban '+name+'?',function(){
      sb.from('bans').insert({name:name,fingerprint:print||null}).then(function(){say(name+' banned');load();});
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

  window.pcClearImg=function(){
    document.getElementById('pc-imgfile').value='';
    document.getElementById('pc-imgpreview').style.display='none';
  };

  document.getElementById('pc-imgfile').addEventListener('change',function(){
    var f=this.files[0];
    var box=document.getElementById('pc-imgpreview');
    if(!f){ box.style.display='none'; return; }
    var reader=new FileReader();
    reader.onload=function(e){
      document.getElementById('pc-imgthumb').src=e.target.result;
      box.style.display='flex';
    };
    reader.readAsDataURL(f);
  });

  window.pcPurgeUser=function(name){
    ask('Delete all messages from '+name+'?',function(){
      sb.from('messages').delete().eq('name',name).then(function(){
        say('deleted all from '+name);
        pcOpenUsers();
        load();
      });
    });
  };

  window.pcOpenUsers=function(){
    var body=document.getElementById('pc-usersbody');
    body.innerHTML='loading...';
    document.getElementById('pc-users').classList.add('show');
    var cutoff=new Date(Date.now()-24*60*60*1000).toISOString();
    sb.from('messages').select('name,fingerprint,created_at').gte('created_at',cutoff).order('created_at',{ascending:false}).then(function(r){
      var rows=r.data||[];
      if(!rows.length){ body.innerHTML='<div style="color:#999;padding:8px">no activity in 24h</div>'; return; }
      var seen={}, order=[];
      rows.forEach(function(m){
        if(!seen[m.name]){
          seen[m.name]={count:0,print:m.fingerprint};
          order.push(m.name);
        }
        seen[m.name].count++;
        if(!seen[m.name].print && m.fingerprint) seen[m.name].print=m.fingerprint;
      });
      body.innerHTML='';
      order.forEach(function(nm){
        var u=seen[nm];
        var row=document.createElement('div');
        row.style.cssText='display:flex;justify-content:space-between;align-items:center;padding:6px 4px;border-bottom:1px solid #f7e3ee;gap:6px';
        var left=document.createElement('div');
        left.style.cssText='flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap';
        left.innerHTML='<span style="font-weight:bold">'+esc(nm)+'</span> <span style="color:#aaa;font-size:11px">'+u.count+'</span>';
        var banBtn=document.createElement('button');
        banBtn.className='pc-pbtn';
        banBtn.style.cssText='padding:3px 8px;font-size:10px;flex:0 0 auto';
        var already=bannedList.indexOf(nm)!==-1;
        banBtn.textContent=already?'unban':'ban';
        banBtn.addEventListener('click',function(){
          document.getElementById('pc-users').classList.remove('show');
          if(already) pcUnban(nm); else pcBan(nm,u.print);
        });
        var purgeBtn=document.createElement('button');
        purgeBtn.className='pc-pbtn';
        purgeBtn.style.cssText='padding:3px 8px;font-size:10px;flex:0 0 auto';
        purgeBtn.textContent='purge';
        purgeBtn.addEventListener('click',function(){
          document.getElementById('pc-users').classList.remove('show');
          pcPurgeUser(nm);
        });
        row.appendChild(left); row.appendChild(banBtn); row.appendChild(purgeBtn);
        body.appendChild(row);
      });
    });
  };

  function load(){
    sb.from('filters').select('word').then(function(fres){
      filterList=(fres.data||[]).map(function(x){return x.word;});
      sb.from('settings').select('*').then(function(sres){
        var srows=sres.data||[];
        srows.forEach(function(s){
          if(s.key==='paused') chatPaused = s.value==='true';
          if(s.key==='regonly') regOnly = s.value==='true';
          if(s.key==='blocklinks') blockLinks = s.value==='true';
          if(s.key==='antispam') antiSpam = s.value==='true';
          if(s.key==='pinned') pinnedMsg = s.value||'';
        });
        updateAdminUI();
        var ph=document.getElementById('pc-text');
        if(ph){
          if(chatPaused && myLevel<4) ph.placeholder='chat is paused';
          else if(regOnly && myLevel<2) ph.placeholder='members only — log in';
          else ph.placeholder='message';
        }
        sb.from('bans').select('*').then(function(bres){
          var brows=bres.data||[];
          bannedList=brows.map(function(x){return x.name;});
          bannedPrints=brows.filter(function(x){return x.fingerprint;}).map(function(x){return x.fingerprint;});
          var cutoff=new Date(Date.now()-30*24*60*60*1000).toISOString();
          sb.from('messages').select('*').gte('created_at',cutoff).order('created_at',{ascending:true}).then(function(r){
            var rows=r.data||[],box=document.getElementById('pc-messages');
            if(!firstLoad && rows.length>lastCount) playBeep();
            lastCount=rows.length; firstLoad=false;
            var newMax=rows.length?rows[rows.length-1].id:0;
            var atBottom=box.scrollHeight-box.scrollTop-box.clientHeight<40;
            box.innerHTML='';
            var myName=nameEl.value.trim();
            rows.forEach(function(m){
              var lvl=m.level||1,d=document.createElement('div');
              d.className='pc-msg pc-lvl'+lvl;
              if(!firstLoad && m.id>lastMaxId) d.className+=' pc-new';
              var pic=m.avatar_url?'<img class="pc-pic" src="'+m.avatar_url+'" onclick="pcZoom(\''+m.avatar_url+'\')">':'';
              var canDel=(myLevel===4)||(myPass&&m.name===myName);
              var isBanned=bannedList.indexOf(m.name)!==-1;
              var tools='';
              if(canDel||myLevel===4||myPass){
                tools='<div class="pc-tools"><span class="pc-dots" onclick="pcToggleTray('+m.id+',event)"><i class="fa fa-ellipsis-v"></i></span><div class="pc-tray" id="tray'+m.id+'">';
                if(myLevel===4){
                  if(isBanned) tools+='<button onclick="pcUnban(\''+esc(m.name)+'\')">unban user</button>';
                  else tools+='<button onclick="pcBan(\''+esc(m.name)+'\',\''+(m.fingerprint||'')+'\')">ban user</button>';
                }
                if(canDel) tools+='<button onclick="pcDel('+m.id+')">delete</button>';
                tools+='<button onclick="pcSoon()">private message</button>';
                tools+='</div></div>';
              }
              var nameHtml = m.profile_url ? '<a href="'+esc(m.profile_url)+'" target="_blank">'+esc(m.name)+'</a>' : esc(m.name);
              var body='';
              if(m.text)body+=esc(censor(m.text));
              if(m.image_url)body+='<img src="'+m.image_url+'" onclick="pcZoom(\''+m.image_url+'\')">';
              d.innerHTML=tools+'<div class="pc-dtxt">'+ago(m.created_at)+'</div>'+pic+'<div class="pc-nme">'+nameHtml+'</div><div class="pc-body">'+body+'</div>';
              box.appendChild(d);
            });
            if(atBottom)box.scrollTop=box.scrollHeight;
            lastMaxId=newMax;
          });
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
    if(regOnly && myLevel<2){say('members only — log in to post');return;}
    if(bannedPrints.indexOf(myPrint)!==-1){say('you are banned');return;}
    if(blockLinks && myLevel<4 && /https?:\/\/|www\.|\.[a-z]{2,}\//i.test(t)){
      say('links are not allowed');
      return;
    }
    if(antiSpam && myLevel<4){
      var now=Date.now();
      sendTimes=sendTimes.filter(function(x){return now-x<10000;});
      if(sendTimes.length>=6){
        say('slow down a little');
        return;
      }
    }
    sb.from('bans').select('*').then(function(b){
      var brows=b.data||[];
      var nameHit=brows.some(function(x){return x.name===n;});
      var printHit=brows.some(function(x){return x.fingerprint && x.fingerprint===myPrint;});
      if(nameHit||printHit){say('you are banned');return;}
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
    sendTimes.push(Date.now());
    sb.from('messages').insert({name:n,level:myLevel,avatar_url:myAvatar,profile_url:myProfUrl,text:t||null,image_url:img,fingerprint:myPrint}).then(function(){
      document.getElementById('pc-text').value='';
      document.getElementById('pc-imgfile').value='';
      document.getElementById('pc-imgpreview').style.display='none';
      load();
    });
  }

  document.getElementById('pc-text').addEventListener('keydown',function(e){if(e.key==='Enter')pcSend();});
  updateAdminUI();
  load();setInterval(load,3000);
})();
