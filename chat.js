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
            var wasFirst=firstLoad;
            if(!firstLoad && rows.length>lastCount) playBeep();
            var newMax=rows.length?rows[rows.length-1].id:0;
            lastCount=rows.length; firstLoad=false;
            var atBottom=wasFirst||(box.scrollHeight-box.scrollTop-box.clientHeight<40);
            box.innerHTML='';
            var myName=nameEl.value.trim();
            rows.forEach(function(m){
              var lvl=m.level||1,d=document.createElement('div');
              d.className='pc-msg pc-lvl'+lvl;
              if(!wasFirst && m.id>lastMaxId) d.className+=' pc-new';
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
