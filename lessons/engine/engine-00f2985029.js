const AR_D=document.documentElement.dataset.ard==='1';function D(x){x=String(x);return AR_D?x.replace(/[0-9]/g,c=>'٠١٢٣٤٥٦٧٨٩'[+c]).replace(/-/g,'−'):x;}
/* ---------- sound ---------- */
const SND=(function(){let ctx=null,muted=false;try{muted=localStorage.getItem('q2_mute')==='1';}catch(e){}
  function c(){if(!ctx){try{ctx=new (window.AudioContext||window.webkitAudioContext)();}catch(e){}}return ctx;}
  function tone(f,d,type,vol,delay){const a=c();if(!a||muted)return;const t=a.currentTime+(delay||0);const o=a.createOscillator(),g=a.createGain();o.type=type||'sine';o.frequency.value=f;g.gain.setValueAtTime(vol||.18,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(a.destination);o.start(t);o.stop(t+d+.02);}
  return{get muted(){return muted},toggle(){muted=!muted;try{localStorage.setItem('q2_mute',muted?'1':'0');}catch(e){}return muted;},
   ok(){[523,659,784,1047].forEach((f,i)=>tone(f,.18,'triangle',.2,i*.08));},
   no(){tone(180,.35,'sawtooth',.12);},
   tick(){tone(950,.06,'square',.06);},
   buzz(){tone(120,.6,'sawtooth',.14);tone(90,.6,'square',.08);},
   pop(){tone(660,.08,'sine',.15);tone(990,.1,'sine',.12,.06);},
   minus(){tone(300,.15,'triangle',.15);tone(200,.25,'triangle',.15,.12);},
   flip(){tone(420,.05,'triangle',.1);},
   fan(){[392,523,659,784,659,784,1047].forEach((f,i)=>tone(f,.22,'triangle',.18,i*.14));},
   spin(){for(let i=0;i<22;i++)tone(700+(i%2)*150,.04,'square',.05,i*(.05+i*.008));}};})();
/* ---------- GAME state (2 teams) ---------- */
window.GAME=(function(){const KEY='q2_'+document.title;const st={sc:[0,0],nm:['الصدارة 🍉','الشرارة 🍉'],stk:[0,0],last:[-9,-9]};
  try{const s=JSON.parse(localStorage.getItem(KEY)||'null');if(s){Object.assign(st,s);}}catch(e){}
  function save(){try{localStorage.setItem(KEY,JSON.stringify(st));}catch(e){}}
  function stage(v){return v<300?'🌱':v<700?'🌿':v<1200?'🌷':v<1800?'🌸':'👑';}
  function paint(){document.querySelectorAll('[data-team]').forEach(e=>{if(e.classList.contains('award'))return;e.textContent=D(st.sc[+e.dataset.team]);});
    document.querySelectorAll('[data-nm]').forEach(e=>e.textContent=st.nm[+e.dataset.nm]);
    document.querySelectorAll('[data-av]').forEach(e=>e.textContent=stage(st.sc[+e.dataset.av]));
    document.querySelectorAll('[data-stk]').forEach(e=>{const k=st.stk[+e.dataset.stk];e.textContent=k>=2?'🔥'+D(k):'';});}
  function fx(t,p,src){const deck=document.getElementById('deck');const f=document.createElement('div');f.className='floaty';f.textContent=(p>0?'+':'')+D(p);
    f.style.color=t===0?'#B46BE0':'#18B5C2';let x=t===0?900:300,y=120;if(src&&src.getBoundingClientRect){const r=src.getBoundingClientRect(),d=deck.getBoundingClientRect(),k=d.width/1280;x=(r.left+r.width/2-d.left)/k-40;y=(r.top-d.top)/k-10;}
    f.style.left=x+'px';f.style.top=y+'px';deck.appendChild(f);setTimeout(()=>f.remove(),1400);
    if(p>0){const b=document.createElement('div');b.className='burst';const em=['✨','⭐','💜','💎','🌸','🎉'];for(let i=0;i<14;i++){const s=document.createElement('span');s.textContent=em[i%em.length];s.style.left=(x+20)+'px';s.style.top=(y+20)+'px';s.style.setProperty('--dx',(Math.random()*400-200)+'px');s.style.setProperty('--dy',(Math.random()*-300-40)+'px');b.appendChild(s);}deck.appendChild(b);setTimeout(()=>b.remove(),1200);}
    document.querySelectorAll('.slide.cur .gbar .team').forEach((e,i)=>{if(i===t){e.classList.add('bump');setTimeout(()=>e.classList.remove('bump'),300);}});}
  function add(t,p,src,silent){st.sc[t]=Math.max(0,st.sc[t]+p);save();paint();if(!silent){p>0?SND.ok():SND.minus();fx(t,p,src);}}
  function kqAward(t,qi,p,src){if(st.last[t]===qi-1)st.stk[t]++;else if(st.last[t]!==qi)st.stk[t]=1;st.last[t]=qi;add(t,p,src);
    if(st.stk[t]>0&&st.stk[t]%3===0){setTimeout(()=>{add(t,50,src,true);fx(t,50,src);SND.fan();},700);} save();paint();}
  function reset(){if(!confirm('تصفير نقاط الفريقين؟'))return;st.sc=[0,0];st.stk=[0,0];st.last=[-9,-9];save();paint();}
  function rename(t){const n=prompt('اسم الفريق:',st.nm[t]);if(n&&n.trim()){st.nm[t]=n.trim();save();paint();}}
  function podium(el){const w=st.sc[0]===st.sc[1]?-1:(st.sc[0]>st.sc[1]?0:1);const h=t=>w===-1?300:(t===w?320:200);
    el.innerHTML=[0,1].map(t=>`<div class="pod ${t===0?'tA':'tB'}" style="height:${h(t)}px"><div class="rk">${w===-1?'🤝':(t===w?'🥇':'🥈')}</div><div>${st.nm[t]}</div><div class="sc">${D(st.sc[t])}</div></div>`).join('');}
  return {st,paint,add,kqAward,reset,rename,podium};})();
(function(){
const S=[...document.querySelectorAll('.slide')],deck=document.getElementById('deck');let i=0;const PRINT=location.search.includes('print');
document.getElementById('tot').textContent=D(S.length);
function fit(){const r=Math.min(innerWidth/1280,innerHeight/720);deck.style.transform='scale('+r+')';}addEventListener('resize',fit);fit();
window.__show=n=>show(n);
function fitOne(s){const inr=s.querySelector('.inner');if(!inr)return;inr.style.transform='';inr.style.width='';const cs=getComputedStyle(s);const avail=720-parseFloat(cs.paddingTop)-parseFloat(cs.paddingBottom);
  if(inr.scrollHeight<=avail+1)return;const fits=k=>{inr.style.width=(100/k).toFixed(2)+'%';inr.style.transform='scale('+k.toFixed(3)+')';return inr.scrollHeight*k<=avail+1;};
  let lo=0.45,hi=1;for(let it=0;it<9;it++){const m=(lo+hi)/2;if(fits(m))lo=m;else hi=m;}fits(lo);}
function fitInner(){fitOne(S[i]);}window.__fit=fitInner;
const COMP={COG:'🧠 عقل يتفكّر',CRE:'🎨 عقل يبدع',EMO:'💞 عقل يشعر',ETH:'⚖️ عقل يختار'};
function show(n){S[i].classList.remove('cur');i=Math.max(0,Math.min(S.length-1,n));S[i].classList.add('cur');
  document.getElementById('cur').textContent=D(i+1);const st=S[i].dataset.strat,el=document.getElementById('strat');
  el.innerHTML=st?'<b>الاستراتيجية</b>'+st:'';el.style.visibility=st?'visible':'hidden';
  const cp=document.getElementById('comp');cp.textContent=COMP[S[i].dataset.comp]||'';cp.style.visibility=S[i].dataset.comp?'visible':'hidden';
  document.getElementById('rail').style.display=(S[i].classList.contains('title')||S[i].classList.contains('mo'))?'none':'flex';
  document.querySelectorAll('.ob').forEach(o=>{o.classList.toggle('cur',S[i].dataset.obj===o.dataset.o);});
  document.getElementById('dmenu').classList.remove('on');const pgE=S[i].querySelector('.pg');document.getElementById('railpg').textContent=pgE?pgE.textContent:'';
  upd();const pod=S[i].querySelector('.podium');if(pod){GAME.podium(pod);SND.fan();const cf=S[i].querySelector('.confetti');if(cf&&!cf.children.length){const em=['🎉','✨','⭐','🎊','💜','💎'];for(let k=0;k<26;k++){const sp=document.createElement('span');sp.textContent=em[k%em.length];sp.style.left=(k*3.8)+'%';sp.style.animationDelay=(Math.random()*3)+'s';cf.appendChild(sp);}}}
  GAME.paint();if(window.__onShow)window.__onShow(S[i]);fitInner();}
function pending(){return S[i].querySelector('.step:not(.on)');}
function upd(){const n=document.getElementById('next');const p=!!pending();n.textContent=p?'▶ الخطوة التالية':(i===S.length-1?'النهاية':'الشريحة التالية ◀');const sk=document.getElementById('skip');if(sk){sk.style.display=p?'':'none';}}
function next(){const p=pending();if(p){p.classList.add('on');upd();}else show(i+1);}
function prev(){const on=[...S[i].querySelectorAll('.step.on')];if(on.length){on[on.length-1].classList.remove('on');upd();}else show(i-1);}
document.getElementById('next').onclick=next;document.getElementById('prev').onclick=prev;document.getElementById('skip').onclick=()=>show(i+1);
document.getElementById('fs').onclick=()=>document.documentElement.requestFullscreen&&document.documentElement.requestFullscreen();
const mu=document.getElementById('mute');mu.textContent=SND.muted?'🔇':'🔊';mu.onclick=()=>{mu.textContent=SND.toggle()?'🔇':'🔊';};
const stEl=document.getElementById('strat');stEl.onclick=()=>stEl.classList.toggle('off');
addEventListener('keydown',e=>{if(e.target.tagName==='INPUT')return;if(['ArrowLeft','ArrowDown','PageDown',' ','Enter'].includes(e.key)){e.preventDefault();next();}
  else if(['ArrowRight','ArrowUp','PageUp','Backspace'].includes(e.key)){e.preventDefault();prev();}
  else if(e.key==='t'||e.key==='T')stEl.click();else if(e.key==='Home')show(0);else if(e.key==='End')show(S.length-1);});
let tx=null;deck.addEventListener('touchstart',e=>tx=e.touches[0].clientX,{passive:true});
deck.addEventListener('touchend',e=>{if(tx===null)return;const d=e.changedTouches[0].clientX-tx;if(Math.abs(d)>60){d>0?next():prev();}tx=null;});
document.querySelectorAll('[data-nm]').forEach(e=>{if(e.closest('button'))return;e.addEventListener('click',ev=>{ev.stopPropagation();GAME.rename(+e.dataset.nm);});});
/* dojo */
const dm=document.getElementById('dmenu');let djT=0;
document.querySelectorAll('#dojo .chip').forEach(c=>c.onclick=()=>{djT=+c.dataset.dj;dm.querySelector('.dmh').textContent='⭐ نقاط سلوك لـ '+GAME.st.nm[djT];dm.classList.toggle('on');SND.pop();});
dm.querySelectorAll('button').forEach(b=>b.onclick=()=>{GAME.add(djT,+b.dataset.p,document.querySelector('#dojo .chip[data-dj="'+djT+'"]'));dm.classList.remove('on');});
const jd=s=>{const j=s.querySelector('script.jd');return j?JSON.parse(j.textContent):null;};
const turnOf=s=>{const b=s.querySelector('.turn');return b?+b.dataset.turn:0;};
function setTurn(s,t){const b=s.querySelector('.turn');if(!b)return;b.dataset.turn=t;b.classList.remove('tA','tB');b.classList.add(t?'tB':'tA');b.querySelector('[data-nm]').dataset.nm=t;GAME.paint();}
document.querySelectorAll('.turn').forEach(b=>{setTurn(b.closest('.slide'),0);b.onclick=()=>{setTurn(b.closest('.slide'),1-turnOf(b.closest('.slide')));SND.pop();};});
/* award buttons generic (non-kq) */
let QI=0;
document.querySelectorAll('.slide.kq').forEach(s=>{const qi=QI++;
  const timer=s.querySelector('.timer');const total=+timer.dataset.t;let left=total,iv=null,revealed=false;const pts=()=>100+left*5;
  const stop=()=>{if(iv){clearInterval(iv);iv=null;}};
  s.querySelector('.start').onclick=()=>{stop();left=total;timer.textContent=D(left);timer.classList.remove('low');revealed=false;s.querySelector('.pts').textContent='';
    s.querySelectorAll('.kopt').forEach(o=>o.classList.remove('dim','win'));s.querySelectorAll('.award').forEach(a=>a.classList.remove('on'));const gs=s.querySelector('.gsol');if(gs)gs.classList.remove('on');
    iv=setInterval(()=>{left--;timer.textContent=D(left);if(left<=5&&left>0){timer.classList.add('low');SND.tick();}if(left<=0){stop();SND.buzz();}},1000);};
  const reveal=()=>{if(revealed)return;stop();revealed=true;s.querySelectorAll('.kopt').forEach(o=>{if(o.dataset.ok==='1')o.classList.add('win');else o.classList.add('dim');});
    const gs=s.querySelector('.gsol');if(gs)gs.classList.add('on');SND.pop();s.querySelector('.pts').textContent=D('نقاط هذا السؤال: '+pts()+' (100 + 5 لكل ثانية متبقية)');fitInner();};
  s.querySelector('.reveal').onclick=reveal;s.querySelectorAll('.kopt').forEach(o=>o.onclick=reveal);
  s.querySelectorAll('.award').forEach(a=>a.onclick=()=>{if(!revealed)reveal();const t=+a.dataset.team;if(a.classList.contains('on')){a.classList.remove('on');GAME.add(t,-pts(),a);}else{a.classList.add('on');GAME.kqAward(t,qi,pts(),a);}});});
/* memory game */
document.querySelectorAll('.memgame').forEach(s=>{const pairs=jd(s),g=s.querySelector('.mem'),pts=+g.dataset.pts;let cards=[];
  pairs.forEach((p,k)=>{cards.push({k,t:p[0]});cards.push({k,t:p[1]});});
  for(let a=cards.length-1;a>0;a--){const b=Math.floor(Math.random()*(a+1));[cards[a],cards[b]]=[cards[b],cards[a]];}
  let open=[],lock=false;
  cards.forEach((c,n)=>{const d=document.createElement('div');d.className='card';d.dataset.k=c.k;d.innerHTML='<div class="in"><div class="f">'+D(n+1)+'</div><div class="b">'+c.t+'</div></div>';g.appendChild(d);
    d.onclick=()=>{if(lock||d.classList.contains('fl'))return;d.classList.add('fl');SND.flip();open.push(d);
      if(open.length===2){lock=true;const [x,y]=open;const t=turnOf(s);
        if(x.dataset.k===y.dataset.k){setTimeout(()=>{x.classList.add('done','c'+t);y.classList.add('done','c'+t);GAME.add(t,pts,y);open=[];lock=false;},500);}
        else{setTimeout(()=>{x.classList.add('shake');y.classList.add('shake');SND.no();},500);setTimeout(()=>{x.classList.remove('fl','shake');y.classList.remove('fl','shake');open=[];lock=false;setTurn(s,1-t);},1500);}}};});});
/* wheel */
const SEG=[['+٣٠',30,'#9B4FD6'],['+١٠٠',100,'#14A9B6'],['سرقة ٤٠',-40,'#F26B8A'],['+٥٠',50,'#F7B955'],['+٢٠ للفريقين',20,'#2BB5A0'],['+٨٠',80,'#4F7CF0'],['حظ أوفر',0,'#7A7A7A'],['+٧٠',70,'#E0559C']];
document.querySelectorAll('.wheelgame').forEach(s=>{const w=s.querySelector('.wheel');const n=SEG.length,a=360/n;
  w.style.background='conic-gradient('+SEG.map((g,k)=>g[2]+' '+(k*a)+'deg '+((k+1)*a)+'deg').join(',')+')';
  SEG.forEach((g,k)=>{const ang=(k*a+a/2)*Math.PI/180;const l=document.createElement('div');l.className='lb';l.textContent=g[0];l.style.left=(50+33*Math.sin(ang))+'%';l.style.top=(50-33*Math.cos(ang))+'%';w.appendChild(l);});
  let rot=0,busy=false;const res=s.querySelector('.wres');
  s.querySelector('.spin').onclick=()=>{if(busy)return;busy=true;res.textContent='...';const k=Math.floor(Math.random()*n);const want=(360-(k*a+a/2))%360;rot=rot+360*5+((want-rot%360)+720)%360;w.style.transform='rotate('+rot+'deg)';SND.spin();
    setTimeout(()=>{busy=false;const t=turnOf(s),g=SEG[k];res.textContent=GAME.st.nm[t]+': '+g[0];
      if(g[0].includes('سرقة')){GAME.add(1-t,-40,null,true);GAME.add(t,40,s.querySelector('.spin'));}
      else if(g[0].includes('للفريقين')){GAME.add(0,20,null,true);GAME.add(1,20,s.querySelector('.spin'));}
      else if(g[1]>0)GAME.add(t,g[1],s.querySelector('.spin'));else SND.no();},4100);};});
/* boxes */
const PRZ=[['+٥٠',50],['+١٠٠',100],['+٣٠',30],['سرقة ٥٠ 😈',-50],['هدية ٣٠ للفريق الآخر 💝',-30],['+٧٠',70]];
document.querySelectorAll('.boxgame').forEach(s=>{const g=s.querySelector('.bxs'),res=s.querySelector('.wres');const pr=PRZ.slice().sort(()=>Math.random()-.5);
  pr.forEach((p,k)=>{const b=document.createElement('div');b.className='bx';b.innerHTML='🎁<b>'+D(k+1)+'</b>';g.appendChild(b);
    b.onclick=()=>{if(b.classList.contains('open'))return;b.classList.add('open');b.textContent=p[0];const t=turnOf(s);
      if(p[0].includes('سرقة')){GAME.add(1-t,-50,null,true);GAME.add(t,50,b);res.textContent=GAME.st.nm[t]+' سرقت ٥٠ نقطة!';}
      else if(p[0].includes('هدية')){GAME.add(1-t,30,b);GAME.add(t,20,null,true);res.textContent='كرم '+GAME.st.nm[t]+' أهدى ٣٠ للخصم.. ومكافأة الكرم +٢٠ 💝';}
      else{GAME.add(t,p[1],b);res.textContent=GAME.st.nm[t]+' ربحت '+p[0];}fitInner();};});});
/* lightning / tag */
document.querySelectorAll('.slide.lr').forEach(s=>{const items=jd(s);const box=s.querySelector('.lrbox'),pts=+box.dataset.pts,T0=+box.dataset.t;let k=0,iv=null,left=T0;
  const q=s.querySelector('.lrq'),a=s.querySelector('.lra'),nn=s.querySelector('.lrn'),tm=s.querySelector('.timer');
  const stop=()=>{if(iv){clearInterval(iv);iv=null;}};
  function load(){stop();left=T0;tm.textContent=D(left);tm.classList.remove('low');nn.textContent=D('السؤال '+(k+1)+' من '+items.length);q.innerHTML=items[k][0];a.innerHTML=items[k][1];a.classList.remove('on');s.querySelectorAll('.award').forEach(x=>x.classList.remove('on'));}
  load();
  s.querySelector('.lstart').onclick=()=>{load();iv=setInterval(()=>{left--;tm.textContent=D(left);if(left<=3&&left>0){tm.classList.add('low');SND.tick();}if(left<=0){stop();SND.buzz();a.classList.add('on');}},1000);};
  s.querySelector('.lreveal').onclick=()=>{stop();a.classList.add('on');SND.pop();};
  s.querySelector('.lnext').onclick=()=>{k=(k+1)%items.length;load();};
  s.querySelectorAll('.award').forEach(b=>b.onclick=()=>{stop();a.classList.add('on');const t=+b.dataset.team;if(b.classList.contains('on')){b.classList.remove('on');GAME.add(t,-pts,b);}else{b.classList.add('on');GAME.add(t,pts,b);}});});
/* trap */
document.querySelectorAll('.trapgame').forEach(s=>{s.querySelectorAll('.tline').forEach(l=>l.onclick=()=>{if(l.dataset.bad==='1'){l.classList.add('bad');s.querySelector('.texp').classList.add('on');SND.ok();}else{l.classList.add('good');SND.pop();}fitInner();});
  s.querySelectorAll('.award').forEach(b=>b.onclick=()=>{const t=+b.dataset.team;if(b.classList.contains('on')){b.classList.remove('on');GAME.add(t,-80,b);}else{b.classList.add('on');GAME.add(t,80,b);}});});
/* board */
document.querySelectorAll('.boardgame').forEach(s=>{const d=jd(s),g=s.querySelector('.brd'),m=s.querySelector('.modal');const nc=d.cats.length;g.style.gridTemplateColumns='repeat('+nc+',1fr)';
  d.cats.forEach(c=>{const h=document.createElement('div');h.className='ch';h.innerHTML=c;g.appendChild(h);});let cur=null,cv=0;
  d.pts.forEach((p,r)=>d.cats.forEach((c,ci)=>{const b=document.createElement('button');b.className='cell';b.textContent=D(p);g.appendChild(b);
    b.onclick=()=>{if(b.classList.contains('used'))return;cur=b;cv=p;m.querySelector('.mq').innerHTML=d.qa[ci][r][0];const ma=m.querySelector('.ma');ma.innerHTML=d.qa[ci][r][1];ma.classList.remove('on');m.querySelectorAll('.award').forEach(x=>x.classList.remove('on'));m.classList.add('on');SND.pop();};}));
  m.querySelector('.mrev').onclick=()=>{m.querySelector('.ma').classList.add('on');SND.pop();};
  m.querySelector('.mclose').onclick=()=>{m.classList.remove('on');if(cur){cur.classList.add('used');}setTurn(s,1-turnOf(s));};
  m.querySelectorAll('.award').forEach(b=>b.onclick=()=>{const t=+b.dataset.team;m.querySelector('.ma').classList.add('on');if(b.classList.contains('on')){b.classList.remove('on');GAME.add(t,-cv,b);cur.classList.remove('u'+t);}else{b.classList.add('on');GAME.add(t,cv,b);cur.classList.add('used','u'+t);}});});
/* ================= CLASS ROSTER (ClassDojo per student) ================= */
window.ROS=(function(){
  const el=document.getElementById('rosdata');if(!el)return null;
  const R=JSON.parse(el.textContent);const KEY='cls_'+R.id;const NKEY=KEY+'_names';try{const nm=JSON.parse(localStorage.getItem(NKEY)||'null');if(Array.isArray(nm)&&nm.length)R.students=nm;}catch(e){}function hashN(n){let h=7;for(const ch of String(n))h=(h*31+ch.codePointAt(0))%100003;return h;}function saveNames(list){try{localStorage.setItem(NKEY,JSON.stringify(list));}catch(e){}}const today=new Date().toISOString().slice(0,10);
  let st={pts:{},team:{},abs:{},day:today};
  try{const s=JSON.parse(localStorage.getItem(KEY)||'null');if(s)Object.assign(st,s);}catch(e){}
  if(st.day!==today){st.abs={};st.day=today;}
  const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(st));}catch(e){}};save();
  const AV=['🦄','🐱','🦋','🐼','🦊','🐰','🐨','🐧','🌸','🍓','🐝','🦉','🐬','🌻','🐞','🦚','🍉','🐢','🌙','⭐','🐳','🦜','🍒','🐣','🌷','🐹'];
  const N=R.students.length;
  const MC=[['#8E5BD6','#6B3FB0'],['#14A9B6','#1197A8'],['#FF8FB1','#E0559C'],['#FFB547','#E08A00'],['#5BC07A','#2E9E5B'],['#5B9BFF','#22A7C9'],['#FF7A6B','#D64545'],['#C08BFF','#8E5BD6'],['#46C9B5','#1E8E7E'],['#F7D046','#C9A400']];
  function monster(k){const c=MC[k%MC.length],sh=Math.floor(k/MC.length+k*7)%4,ey=(k*3)%3,ac=(k*5+1)%5,mo=(k*11)%3;
    let b='<svg viewBox="0 0 100 100" class="mon">';
    // accessories behind body
    if(ac===0)b+='<path d="M28 30 L22 8 L40 24Z M72 30 L78 8 L60 24Z" fill="'+c[1]+'"/>';
    if(ac===1)b+='<line x1="38" y1="26" x2="30" y2="6" stroke="'+c[1]+'" stroke-width="4"/><circle cx="30" cy="6" r="6" fill="#C9F3EE"/><line x1="62" y1="26" x2="70" y2="6" stroke="'+c[1]+'" stroke-width="4"/><circle cx="70" cy="6" r="6" fill="#C9F3EE"/>';
    if(ac===2)b+='<circle cx="22" cy="30" r="12" fill="'+c[1]+'"/><circle cx="78" cy="30" r="12" fill="'+c[1]+'"/>';
    if(ac===3)b+='<path d="M42 22 Q50 0 58 22Z" fill="'+c[1]+'"/>';
    const bodies=['<circle cx="50" cy="58" r="38"/>','<rect x="14" y="22" width="72" height="72" rx="24"/>','<path d="M50 14 C82 14 90 50 88 70 C86 92 14 92 12 70 C10 50 18 14 50 14Z"/>','<path d="M20 40 Q20 16 50 18 Q80 16 80 40 L86 92 L72 84 L60 94 L50 84 L40 94 L28 84 L14 92Z"/>'];
    b+='<g fill="'+c[0]+'" stroke="'+c[1]+'" stroke-width="3">'+bodies[sh]+'</g>';
    b+='<ellipse cx="50" cy="74" rx="20" ry="12" fill="#fff" opacity=".25"/>';
    const eye=(x,y,r)=>'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="#fff"/><circle cx="'+(x+1.5)+'" cy="'+(y+1.5)+'" r="'+(r*.5)+'" fill="#083B4F"/><circle cx="'+(x+3)+'" cy="'+(y-1)+'" r="'+(r*.18)+'" fill="#fff"/>';
    if(ey===0)b+=eye(50,48,13);else if(ey===1)b+=eye(37,48,10)+eye(63,48,10);else b+=eye(32,50,8)+eye(50,42,9)+eye(68,50,8);
    if(mo===0)b+='<path d="M36 66 Q50 80 64 66" stroke="#083B4F" stroke-width="4" fill="none" stroke-linecap="round"/>';
    else if(mo===1)b+='<path d="M38 64 Q50 84 62 64Z" fill="#083B4F"/><path d="M44 72 Q50 78 56 72Z" fill="#FF7A8A"/>';
    else b+='<path d="M36 66 Q50 76 64 66" stroke="#083B4F" stroke-width="4" fill="none" stroke-linecap="round"/><rect x="45" y="67" width="8" height="7" fill="#fff" stroke="#083B4F" stroke-width="1.5"/>';
    b+='<circle cx="26" cy="64" r="5" fill="#FF8FB1" opacity=".6"/><circle cx="74" cy="64" r="5" fill="#FF8FB1" opacity=".6"/></svg>';return b;}
  const AVH=k=>monster(hashN(R.students[k]));

  const short=n=>{const w=n.trim().split(/\s+/);return w.length>1?w[0]+' '+w[w.length-1]:w[0];};
  const present=()=>[...Array(N).keys()].filter(k=>!st.abs[k]);
  const teamOf=k=>st.team[k]===undefined?-1:st.team[k];
  const deck=document.getElementById('deck');
  /* overlay */
  const ov=document.createElement('div');ov.id='roster';
  ov.innerHTML='<div class="rhead"><div class="rtitle">🧑‍🎓 طلاب '+R.name+'</div><div class="rstat"></div>'+
   '<button class="gbtn" data-a="pick">🎲 اختر طالبًا</button><button class="gbtn" data-a="split">⚖️ وزّع على الفريقين</button>'+
   '<button class="gbtn" data-a="names">📋 كشف الأسماء</button><button class="gbtn" data-a="add">➕ إضافة</button><button class="gbtn" data-a="star">🏅 نجمة الحصة</button><button class="gbtn" data-a="allp">✅ الكل حاضرون</button><button class="gbtn" data-a="reset">↺ تصفير نقاط الطلاب</button><button class="gbtn x" data-a="close">✖</button></div>'+
   '<div class="rhint">اضغط على الطالب لمنحها نقاط سلوك (كل نقطة لها = ١٠ نقاط لفريقها) · «غائبة» تجعل بطاقتها رمادية وتُستبعد من القرعة · 📋 لاستبدال الكشف كاملًا بلصق الأسماء · ✏️ من بطاقة الطالب لتعديل الاسم أو حذفه · الأسماء تُحفظ على هذا الجهاز</div><div class="rgrid"></div>';
  deck.appendChild(ov);
  const grid=ov.querySelector('.rgrid');
  const sm=document.createElement('div');sm.id='smenu';deck.appendChild(sm);
  const BEH=[['🙋 مشاركة',1],['💡 إجابة ذكية',2],['🤝 تعاون',1],['🎯 كشف فخًّا',2],['🤫 التزام وهدوء',1],['💞 شجّع زميله',1],['🎨 فكرة مبدعة',2],['🔔 تحتاج تركيزًا',-1]];
  function card(k){const d=document.createElement('div');d.className='scard';d.dataset.k=k;
    d.innerHTML='<div class="sav">'+AVH(k)+'</div><div class="snm">'+short(R.students[k])+'</div><div class="spt"></div>';
    d.onclick=e=>{e.stopPropagation();openMenu(k,d);};return d;}
  for(let k=0;k<N;k++)grid.appendChild(card(k));
  function paint(){let tot=0,pr=0;
    grid.querySelectorAll('.scard').forEach(c=>{const k=+c.dataset.k,p=st.pts[k]||0;tot+=p;if(!st.abs[k])pr++;
      c.querySelector('.spt').textContent=D(p);c.classList.toggle('abs',!!st.abs[k]);c.classList.remove('t0','t1');const t=teamOf(k);if(t>=0)c.classList.add('t'+t);});
    ov.querySelector('.rstat').textContent=D('الحاضرات '+pr+' من '+N+' · مجموع النقاط '+tot);
    document.querySelectorAll('.rosmini').forEach(paintMini);document.querySelectorAll('.dboard').forEach(paintBoard);document.querySelectorAll('.dbstat').forEach(e=>e.textContent=D('الحاضرات '+pr+' من '+N+' · نجوم الصف '+tot+' ⭐'));}
  function openMenu(k,src){const p=st.pts[k]||0;
    sm.innerHTML='<div class="smh"><span class="sav">'+AVH(k)+'</span>'+R.students[k]+'<b>'+D(p)+' ⭐</b></div><div class="beh">'+
      BEH.map(b=>'<button data-p="'+b[1]+'" class="'+(b[1]<0?'neg':'')+'">'+b[0]+' '+D((b[1]>0?'+':'')+b[1])+'</button>').join('')+'</div>'+
      '<div class="sm2"><button data-t="0" class="tA">'+GAME.st.nm[0]+'</button><button data-t="1" class="tB">'+GAME.st.nm[1]+'</button><button data-abs="1" class="absb">'+(st.abs[k]?'✅ حاضرة':'🌫️ غائبة')+'</button><button data-ren="1">✏️ تعديل الاسم</button><button data-del="1" class="neg">🗑 حذف</button><button data-x="1">إغلاق</button></div>';
    sm.classList.add('on');SND.pop();
    sm.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{award(k,+b.dataset.p,src);sm.classList.remove('on');});
    sm.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{st.team[k]=+b.dataset.t;save();paint();sm.classList.remove('on');SND.pop();});
    sm.querySelector('[data-abs]').onclick=()=>{st.abs[k]=!st.abs[k];if(!st.abs[k])delete st.abs[k];save();paint();sm.classList.remove('on');SND.flip();};
    sm.querySelector('[data-ren]').onclick=()=>{const n=prompt('اسم الطالب:',R.students[k]);if(n&&n.trim()){const L=R.students.slice();L[k]=n.trim();saveNames(L);location.reload();}};
    sm.querySelector('[data-del]').onclick=()=>{if(!confirm('حذف '+R.students[k]+' من الكشف؟'))return;const L=R.students.slice();L.splice(k,1);
      const mv=o=>{const r={};Object.keys(o).forEach(i=>{i=+i;if(i<k)r[i]=o[i];else if(i>k)r[i-1]=o[i];});return r;};st.pts=mv(st.pts);st.team=mv(st.team);st.abs=mv(st.abs);save();saveNames(L);location.reload();};
    sm.querySelector('[data-x]').onclick=()=>sm.classList.remove('on');}
  function award(k,p,src){st.pts[k]=(st.pts[k]||0)+p;save();paint();const t=teamOf(k);
    if(t>=0)GAME.add(t,p*10,src);else{p>0?SND.ok():SND.minus();}
    if(src){const r=src.getBoundingClientRect(),dr=deck.getBoundingClientRect(),sc=dr.width/1280;const f=document.createElement('div');f.className='floaty';f.style.color=p>0?'#2E9E5B':'#D64545';
      f.textContent=(p>0?'+':'')+D(p)+' ⭐';f.style.left=((r.left-dr.left)/sc+20)+'px';f.style.top=((r.top-dr.top)/sc)+'px';deck.appendChild(f);setTimeout(()=>f.remove(),1300);}}
  function split(){const pr=present().sort(()=>Math.random()-.5);pr.forEach((k,n)=>st.team[k]=n%2);save();paint();SND.fan();}
  /* random pick with animation; cb(k) */
  const pop=document.createElement('div');pop.id='pickpop';deck.appendChild(pop);
  function pick(cb,pool,forced){pool=(pool||present());if(!pool.length){if(!N&&window.ROS_openNames){ov.classList.add('on');paint();ROS_openNames();}else alert('لا يوجد طلاب حاضرون');return;}
    /* قرعة عادلة: كيس دُر — لا يتكرر اسم قبل أن يمرّ الجميع */
    if(!Array.isArray(st.bag))st.bag=[];let fresh=false;let cand=st.bag.filter(x=>pool.includes(x));
    if(!cand.length&&forced==null){cand=pool.slice();if(cand.length>1&&st.lastPick!=null&&cand.includes(st.lastPick))cand=cand.filter(x=>x!==st.lastPick);fresh=true;const keep=st.bag.filter(x=>!pool.includes(x));st.bag=keep.concat(pool.filter(x=>!keep.includes(x)));}
    let n=0;const steps=18;const k=forced!=null?forced:cand[Math.floor(Math.random()*cand.length)];
    if(forced==null){st.bag=st.bag.filter(x=>x!==k);st.lastPick=k;save();}
    const leftN=st.bag.filter(x=>pool.includes(x)).length;
    pop.classList.add('on');pop.innerHTML='';const tick=()=>{const j=pool[Math.floor(Math.random()*pool.length)];
      pop.innerHTML='<div class="pk"><div class="sav bigav">'+AVH(j)+'</div><div class="pnm">'+short(R.students[j])+'</div></div>';SND.tick();
      if(++n<steps)setTimeout(tick,50+n*12);else done();};
    function done(){const t=teamOf(k);pop.innerHTML='<div class="pk pwin '+(t>=0?'t'+t:'')+'"><div class="sav bigav">'+AVH(k)+'</div><div class="pnm">'+R.students[k]+'</div>'+
        (t>=0?'<div class="ptm">'+GAME.st.nm[t]+'</div>':'')+(forced==null?'<div class="pfair">'+(fresh?'🔁 بدأت دورة قرعة جديدة · ':'')+'⚖️ قرعة عادلة: تبقّى '+D(leftN)+' من '+D(pool.length)+' قبل أن يتكرر أحد</div>':'')+
        '<div class="gctl" style="justify-content:center"><button class="gbtn" data-p="1">🙋 +١</button><button class="gbtn" data-p="2">💡 +٢</button><button class="gbtn" data-again="1">🎲 قرعة جديدة</button><button class="gbtn" data-x="1">✖ إغلاق</button></div></div>';
      SND.ok();pop.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{award(k,+b.dataset.p,b);b.disabled=true;});
      pop.querySelector('[data-again]').onclick=()=>pick(cb,pool);if(forced!=null){pop.querySelectorAll('[data-p],[data-again]').forEach(x=>x.remove());const xb=pop.querySelector('[data-x]');xb.textContent='▶ ابدأ الإجابة (٢٠ ثانية)';const tg=document.createElement('div');tg.className='ptm';tg.textContent='👤 سؤال فردي';pop.querySelector('.pk').insertBefore(tg,pop.querySelector('.pk').firstChild);}pop.querySelector('[data-x]').onclick=()=>pop.classList.remove('on');
      if(cb)cb(k);}
    tick();}
  ov.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{const a=b.dataset.a;
    if(a==='close')ov.classList.remove('on');else if(a==='pick')pick();else if(a==='split')split();
    else if(a==='add'){const n=prompt('اسم الطالب الجديد:');if(n&&n.trim()){const L=R.students.concat([n.trim()]);saveNames(L);location.reload();}}
    else if(a==='names'){openNames();}
    else if(a==='allp'){st.abs={};save();paint();}
    else if(a==='reset'){if(confirm('تصفير نقاط جميع طلاب '+R.name+'؟')){st.pts={};save();paint();}}
    else if(a==='star'){let best=-1,bk=[];present().forEach(k=>{const p=st.pts[k]||0;if(p>best){best=p;bk=[k];}else if(p===best)bk.push(k);});
      if(best<=0){alert('لم تُمنح نقاط بعد 🌱');return;}pop.classList.add('on');pop.innerHTML='<div class="pk pwin"><div style="font-size:70px">🏅</div><div class="ptm">نجمة '+R.name+'</div>'+bk.map(k=>'<div class="pnm">'+AVH(k)+' '+R.students[k]+'</div>').join('')+'<div class="ptm">'+D(best)+' ⭐</div><div class="gctl" style="justify-content:center"><button class="gbtn" data-x="1">✖</button></div></div>';SND.fan();pop.querySelector('[data-x]').onclick=()=>pop.classList.remove('on');}});
  document.addEventListener('click',e=>{if(!sm.contains(e.target))sm.classList.remove('on');});
  const nmod=document.createElement('div');nmod.id='nmodal';nmod.innerHTML='<div class="box"><h3>📋 أسماء طلاب الصف</h3><p>اكتب أو ألصق الأسماء: اسم واحد في كل سطر (أو مفصولة بفاصلة). عند الحفظ يُستبدل الكشف الحالي وتُحفظ الأسماء على هذا الجهاز.</p><textarea placeholder="اسم في كل سطر"></textarea><div class="gctl"><button class="gbtn" data-s="1">💾 حفظ الكشف</button><button class="gbtn" data-c="1">إلغاء</button></div></div>';deck.appendChild(nmod);
  const ta=nmod.querySelector('textarea');
  function openNames(){ta.value=R.students.join(String.fromCharCode(10));nmod.classList.add('on');setTimeout(()=>ta.focus(),50);}
  nmod.querySelector('[data-c]').onclick=()=>nmod.classList.remove('on');
  nmod.querySelector('[data-s]').onclick=()=>{const L=ta.value.split(new RegExp('[,،'+String.fromCharCode(10)+String.fromCharCode(13)+']+')).map(x=>x.trim()).filter(Boolean);if(!L.length){alert('اكتب اسمًا واحدًا على الأقل');return;}
    const same=L.length===R.students.length&&L.every((x,i)=>x===R.students[i]);if(!same){st.pts={};st.team={};st.abs={};save();}saveNames(L);location.reload();};
  ta.addEventListener('keydown',e=>e.stopPropagation());
  if(N===0){const em=document.createElement('div');em.className='empty';em.innerHTML='لا توجد أسماء بعد 🌱<br>اضغط <b>📋 كشف الأسماء</b> واكتب أسماء طلاب صفك، ثم وزّعهم على الفريقين (⚖️ تلقائيًا أو من بطاقة كل طالب)، ويمكنك تغيير اسم كل فريق بالضغط عليه.';grid.appendChild(em);}
  window.ROS_openNames=openNames;
  /* nav buttons */
  const nav=document.getElementById('nav');
  const b1=document.createElement('button');b1.className='ghost';b1.textContent='🧑‍🎓';b1.title='طلاب الصف (C)';b1.onclick=e=>{e.stopPropagation();ov.classList.toggle('on');paint();SND.pop();};
  const b2=document.createElement('button');b2.className='ghost';b2.textContent='🎲';b2.title='قرعة طالب (R)';b2.onclick=e=>{e.stopPropagation();pick();};
  nav.appendChild(b1);nav.appendChild(b2);
  addEventListener('keydown',e=>{if(e.key==='c'||e.key==='C'||e.key==='ؤ')b1.click();if(e.key==='r'||e.key==='R'||e.key==='ق')b2.click();if(e.key==='Escape'){ov.classList.remove('on');pop.classList.remove('on');sm.classList.remove('on');}});
  /* mini roster on slides */
  function paintMini(m){m.innerHTML='';const t=m.dataset.team;[...Array(N).keys()].forEach(k=>{if(t!==undefined&&t!==''&&teamOf(k)!==+t)return;const c=card(k);c.classList.add('mini');c.querySelector('.spt').textContent=D(st.pts[k]||0);c.classList.toggle('abs',!!st.abs[k]);const tt=teamOf(k);if(tt>=0)c.classList.add('t'+tt);m.appendChild(c);});}
  function paintBoard(m){m.innerHTML='';m.style.gridTemplateColumns='repeat('+(N>20?7:N>15?6:5)+',1fr)';[...Array(N).keys()].forEach(k=>{const c=card(k);c.classList.add('big');c.querySelector('.snm').textContent=short(R.students[k]);c.querySelector('.spt').textContent=D(st.pts[k]||0);c.classList.toggle('abs',!!st.abs[k]);const tt=teamOf(k);if(tt>=0)c.classList.add('t'+tt);m.appendChild(c);});}
  paint();
  return{R,st,present,teamOf,short,AV,pick,award,split,paint,name:k=>R.students[k],av:k=>AVH(k)};
})();
document.querySelectorAll('.pickbtn').forEach(b=>b.onclick=e=>{e.stopPropagation();ROS&&ROS.pick();});
document.querySelectorAll('.allpbtn').forEach(b=>b.onclick=()=>{if(ROS){ROS.st.abs={};try{localStorage.setItem('cls_'+ROS.R.id,JSON.stringify(ROS.st));}catch(e){}ROS.paint();}});
document.querySelectorAll('.starbtn').forEach(b=>b.onclick=e=>{e.stopPropagation();document.querySelector('#roster [data-a="star"]').click();});
document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{window.__show(+b.dataset.go);});
document.querySelectorAll('.splitbtn').forEach(b=>b.onclick=()=>{if(ROS){ROS.split();}});
document.querySelectorAll('.rosbtn').forEach(b=>b.onclick=e=>{e.stopPropagation();document.querySelector('#nav button[title^="طلاب"]').click();});

/* helpers for student-aware games */
function whoHTML(k){if(!window.ROS||k==null)return '';const t=ROS.teamOf(k);return '<span class="who '+(t>=0?'t'+t:'')+'"><span class="sav">'+ROS.av(k)+'</span>'+ROS.short(ROS.name(k))+'</span>';}
function stuAward(k,p,src){if(window.ROS&&k!=null)ROS.award(k,p,src);}

/* ================= BOOM 💥 ================= */
document.querySelectorAll('.boomgame').forEach(s=>{const d=JSON.parse(s.querySelector('script.jd').textContent);
  const big=s.querySelector('.bmnum'),who=s.querySelector('.bmwho'),hist=s.querySelector('.bmhist'),outEl=s.querySelector('.bmout');
  let n=1,order=[],pos=0,out=new Set(),shown=false;
  const isBoom=x=>(x%d.k===0)||(d.dig&&String(x).includes(String(d.k)));
  function newOrder(){order=window.ROS?ROS.present().filter(k=>!out.has(k)).sort(()=>Math.random()-.5):[null];pos=0;}
  function cur(){return order.length?order[pos%order.length]:null;}
  function draw(){shown=false;big.textContent='؟';big.classList.remove('boom','bnum');who.innerHTML=window.ROS?('الدور على: '+whoHTML(cur())):'الدور على الطالب التالية في الدائرة';
    outEl.innerHTML=out.size?('خرجت من اللعبة: '+[...out].map(k=>whoHTML(k)).join(' ')):'';window.__fit&&__fit();}
  function reveal(){shown=true;if(isBoom(n)){big.textContent='💥 بوم';big.classList.add('boom');SND.buzz();}else{big.textContent=D(n);big.classList.add('bnum');SND.pop();}}
  function advance(){const h=document.createElement('span');h.className='bmh'+(isBoom(n)?' b':'');h.textContent=isBoom(n)?'💥':D(n);hist.appendChild(h);while(hist.children.length>14)hist.firstChild.remove();n++;pos++;}
  s.querySelector('.bmstart').onclick=()=>{n=d.start||1;out.clear();hist.innerHTML='';newOrder();draw();SND.fan();};
  s.querySelector('.bmrev').onclick=reveal;
  s.querySelector('.bmok').onclick=b=>{if(!shown)reveal();const k=cur();stuAward(k,1,s.querySelector('.bmok'));if(k==null)SND.ok();advance();setTimeout(draw,shown?700:0);};
  s.querySelector('.bmno').onclick=()=>{if(!shown)reveal();const k=cur();SND.no();if(k!=null){out.add(k);order.splice(pos%order.length,1);if(order.length<=1){const w=order[0];setTimeout(()=>{who.innerHTML='🏆 الفائز: '+whoHTML(w);if(w!=null)stuAward(w,3,who);SND.fan();},700);return;}}advance();pos--;if(pos<0)pos=0;setTimeout(draw,700);};
  newOrder();draw();});

/* ================= WATERMELON 🍉 ================= */
let MUS=null,MAC=null;
function music(on){if(MUS){clearInterval(MUS);MUS=null;}if(!on||SND.muted)return;const notes=[523,587,659,698,784,698,659,587,523,659,784,1047,784,659];let k=0;
  try{MAC=MAC||new (window.AudioContext||window.webkitAudioContext)();}catch(e){return;}const ac=MAC;
  MUS=setInterval(()=>{const o=ac.createOscillator(),g=ac.createGain();o.type='triangle';o.frequency.value=notes[k++%notes.length];g.gain.setValueAtTime(.12,ac.currentTime);g.gain.exponentialRampToValueAtTime(.0001,ac.currentTime+.16);o.connect(g);g.connect(ac.destination);o.start();o.stop(ac.currentTime+.18);},170);}
document.querySelectorAll('.potatogame').forEach(s=>{const B=JSON.parse(s.querySelector('script.jd').textContent);
  const ring=s.querySelector('.ptring'),q=s.querySelector('.ptq'),a=s.querySelector('.pta'),info=s.querySelector('.ptinfo'),tm=s.querySelector('.pttm');
  let qi={i:Math.floor(Math.random()*B.i.length),g:Math.floor(Math.random()*B.g.length)},sel=null,busy=false,mode='r',cur=null,team=-1,stolen=false,iv2=null,done=false;
  const stop2=()=>{if(iv2){clearInterval(iv2);iv2=null;}};
  s.querySelectorAll('.ptmode button').forEach(b=>b.onclick=()=>{s.querySelectorAll('.ptmode button').forEach(x=>x.classList.remove('on'));b.classList.add('on');mode=b.dataset.m;SND.pop();});
  function build(){ring.innerHTML='';if(!window.ROS||s.dataset.ring==='teams'||!ROS.present().length){const n=s.dataset.ring==='teams'?8:12;for(let k=0;k<n;k++){const t=k%2;const c=document.createElement('div');c.className='ptc t'+t+(s.dataset.ring==='teams'?' tb':'');c.dataset.t=t;c.innerHTML=(t?'🩵':'💜')+' '+GAME.st.nm[t];ring.appendChild(c);}return;}
    const pool=ROS.present();
    pool.forEach(k=>{const c=document.createElement('div');c.className='ptc';c.dataset.k=k;c.innerHTML='<span class="sav">'+ROS.av(k)+'</span>'+ROS.short(ROS.name(k)).split(' ')[0];const t=ROS.teamOf(k);if(t>=0)c.classList.add('t'+t);ring.appendChild(c);});}
  function clock(T){stop2();let left=T;tm.textContent=D(left);tm.classList.remove('low');tm.style.visibility='visible';iv2=setInterval(()=>{left--;tm.textContent=D(left);if(left<=5&&left>0){tm.classList.add('low');SND.tick();}if(left<=0){stop2();SND.buzz();}},1000);}
  build();tm.style.visibility='hidden';
  s.querySelector('.ptgo').onclick=()=>{if(busy)return;build();busy=true;sel=null;stolen=false;done=false;stop2();tm.style.visibility='hidden';q.innerHTML='';a.innerHTML='';a.classList.remove('on');info.textContent='🍉 البطيخة تدور... مرّريها بسرعة!';
    const cs=[...ring.children];if(!cs.length){busy=false;return;}let j=Math.floor(Math.random()*cs.length);const dur=5000+Math.random()*7000,t0=Date.now();music(true);
    const iv=setInterval(()=>{cs.forEach(c=>c.classList.remove('hot'));j=(j+1)%cs.length;cs[j].classList.add('hot');
      if(Date.now()-t0>dur){clearInterval(iv);music(false);SND.buzz();busy=false;const c=cs[j];c.classList.add('burn');sel=(window.ROS&&c.dataset.k!==undefined)?+c.dataset.k:null;
        cur=mode==='r'?(Math.random()<.5?'i':'g'):mode;team=window.ROS&&sel!=null?ROS.teamOf(sel):(c.dataset.t!==undefined?+c.dataset.t:-1);if(team<0)team=turnOf(s)||0;
        if(s.dataset.ring==='teams'&&window.ROS&&cur==='i'){const pool=ROS.present().filter(x=>ROS.teamOf(x)===team);const P=pool.length?pool:ROS.present();if(P.length)sel=P[Math.floor(Math.random()*P.length)];}
        const who=((window.ROS&&sel!=null)?whoHTML(sel):'<span class="who t'+team+'">'+GAME.st.nm[team]+'</span>');
        info.innerHTML=(window.ROS&&sel!=null)?(cur==='i'?('🍉 <span class="ptk i">👤 سؤال فردي</span> '+who+' يجيب بمفرده!'):('🍉 <span class="ptk g">👥 سؤال مجموعات</span> '+GAME.st.nm[team]+' يتشاور بقيادة '+who)):(cur==='i'?('🍉 <span class="ptk i">👤 سؤال فردي</span> طالب واحد من '+who+' يجيب بمفرده!'):('🍉 <span class="ptk g">👥 سؤال مجموعات</span> '+who+' تتشاور وتجيب'));
        const it=B[cur][qi[cur]%B[cur].length];qi[cur]++;q.innerHTML=it[0];a.innerHTML=it[1];
        if(cur==='i'&&window.ROS&&sel!=null){ROS.pick(null,null,sel);const wt=setInterval(()=>{if(!document.getElementById('pickpop').classList.contains('on')){clearInterval(wt);clock(20);}},300);}else clock(cur==='i'?20:45);window.__fit&&__fit();}},150);};
  s.querySelector('.ptrev').onclick=()=>{stop2();a.classList.add('on');SND.pop();};
  s.querySelector('.ptok').onclick=()=>{if(done||!cur)return;done=true;stop2();a.classList.add('on');const src=s.querySelector('.ptok');
    if(stolen){GAME.add(1-team,30,src);}
    else if(cur==='i'){if(sel!=null)stuAward(sel,2,src);else GAME.add(team,20,src);}
    else{GAME.add(team,50,src);if(sel!=null&&window.ROS){ROS.st.pts[sel]=(ROS.st.pts[sel]||0)+1;try{localStorage.setItem('cls_'+ROS.R.id,JSON.stringify(ROS.st));}catch(e){}ROS.paint();}}};
  s.querySelector('.ptpass').onclick=()=>{if(!cur||stolen)return;stolen=true;SND.no();info.innerHTML+='<br>↩ الفرصة لـ '+GAME.st.nm[1-team]+' (+٣٠ إن أجابت صحيحًا)';clock(15);window.__fit&&__fit();};});

/* ================= WALA KALMA 🤐 ================= */
document.querySelectorAll('.walagame').forEach(s=>{const items=JSON.parse(s.querySelector('script.jd').textContent).sort(()=>Math.random()-.5);
  const w=s.querySelector('.wkw'),f=s.querySelector('.wkf'),tm=s.querySelector('.timer'),who=s.querySelector('.wkwho');let k=-1,iv=null,left=60,hidden=true,pres=null;
  const stop=()=>{if(iv){clearInterval(iv);iv=null;}};
  function load(){hidden=true;w.textContent='🤐 الكلمة مخفية';f.innerHTML='';w.classList.add('hid');}
  function nextW(){k=(k+1)%items.length;load();}
  s.querySelector('.wkpick').onclick=()=>{const t=turnOf(s);if(window.ROS){const pool=ROS.present().filter(x=>ROS.teamOf(x)===t);const P=pool.length?pool:ROS.present();ROS.pick(x=>{pres=x;who.innerHTML='المُمثِّل: '+whoHTML(x);},P);}};
  s.querySelector('.wkshow').onclick=()=>{if(k<0)nextW();hidden=!hidden;if(hidden){load();}else{w.classList.remove('hid');w.innerHTML=items[k][0];f.innerHTML='🚫 ممنوع قول: '+items[k][1].map(x=>'<span>'+x+'</span>').join('');}SND.flip();window.__fit&&__fit();};
  s.querySelector('.wkgo').onclick=()=>{stop();left=60;tm.textContent=D(left);tm.classList.remove('low');iv=setInterval(()=>{left--;tm.textContent=D(left);if(left<=5&&left>0){tm.classList.add('low');SND.tick();}if(left<=0){stop();SND.buzz();}},1000);};
  s.querySelector('.wkok').onclick=b=>{const t=turnOf(s);GAME.add(t,50,s.querySelector('.wkok'));if(pres!=null&&window.ROS)ROS.award(pres,1,null);nextW();};
  s.querySelector('.wkskip').onclick=()=>{SND.no();nextW();};
  load();});
if(window.ROS){ROS.paint();}

/* ================= DUEL ⚔️ (split screen, twin questions) ================= */
document.querySelectorAll('.duelgame').forEach(s=>{
  const tm=s.querySelector('.timer');const T0=+tm.dataset.t;let left=T0,iv=null;
  const stop=()=>{if(iv){clearInterval(iv);iv=null;}};
  s.querySelector('.dgo').onclick=()=>{stop();left=T0;tm.textContent=D(left);tm.classList.remove('low');s.querySelectorAll('.dq').forEach(q=>q.classList.add('on'));s.querySelectorAll('.da').forEach(a=>a.classList.remove('on'));SND.pop();
    iv=setInterval(()=>{left--;tm.textContent=D(left);if(left<=5&&left>0){tm.classList.add('low');SND.tick();}if(left<=0){stop();SND.buzz();}},1000);};
  s.querySelectorAll('.dside').forEach(sd=>{const t=+sd.dataset.t;
    sd.querySelector('.drev').onclick=()=>{sd.querySelector('.da').classList.add('on');SND.pop();};
    sd.querySelector('.dok').onclick=b=>{const btn=sd.querySelector('.dok');if(btn.classList.contains('on'))return;btn.classList.add('on');sd.querySelector('.da').classList.add('on');
      const first=!s.querySelector('.dok.on.first');if(first)btn.classList.add('first');GAME.add(t,first?150:100,btn);
      sd.querySelector('.dbadge').textContent=first?'⚡ الأسرع! +150':'✓ +100';};});});

/* ================= WAGER 💰 ================= */
document.querySelectorAll('.wagergame').forEach(s=>{const bet=[0,0];const MAX=300;
  const paint=()=>s.querySelectorAll('.wbet').forEach(e=>e.textContent=D(bet[+e.dataset.t]));
  s.querySelectorAll('[data-b]').forEach(b=>b.onclick=()=>{const t=+b.dataset.t;bet[t]=Math.max(0,Math.min(MAX,bet[t]+ +b.dataset.b));paint();SND.flip();});
  const q=s.querySelector('.wq'),a=s.querySelector('.wa'),tm=s.querySelector('.timer');let iv=null,left=+tm.dataset.t;
  s.querySelector('.wlock').onclick=()=>{s.classList.add('locked');q.classList.add('on');SND.fan();window.__fit&&__fit();left=+tm.dataset.t;tm.textContent=D(left);
    if(iv)clearInterval(iv);iv=setInterval(()=>{left--;tm.textContent=D(left);if(left<=5&&left>0){tm.classList.add('low');SND.tick();}if(left<=0){clearInterval(iv);SND.buzz();}},1000);};
  s.querySelector('.wrev').onclick=()=>{a.classList.add('on');if(iv)clearInterval(iv);SND.pop();window.__fit&&__fit();};
  s.querySelectorAll('[data-r]').forEach(b=>b.onclick=()=>{const t=+b.dataset.t,ok=b.dataset.r==='1';if(s.querySelector('.wres[data-t="'+t+'"]').textContent)return;
    if(bet[t]===0){s.querySelector('.wres[data-t="'+t+'"]').textContent='لم يحدّد تحدّيًا';return;}
    if(ok){GAME.add(t,bet[t],b);}else{GAME.add(t,-bet[t],b);setTimeout(()=>GAME.add(1-t,bet[t],b),600);}s.querySelector('.wres[data-t="'+t+'"]').textContent=ok?('كسبتم '+D(bet[t])+' 🎉'):('انتقلت '+D(bet[t])+' للفريق الآخر 😅');});
  paint();});

/* ================= VAULT 🔒 ================= */
document.querySelectorAll('.vaultgame').forEach(s=>{const d=JSON.parse(s.querySelector('script.jd').textContent);
  const slots=[...s.querySelectorAll('.vslot')];
  s.querySelectorAll('.vclue').forEach((c,k)=>{c.querySelector('.vshow').onclick=()=>{c.classList.add('open');slots[k].textContent=D(d.code[k]);slots[k].classList.add('on');SND.pop();
      if(slots.every(x=>x.classList.contains('on'))){s.querySelector('.vdoor').classList.add('open');SND.fan();}};});
  s.querySelectorAll('.vwin').forEach(b=>b.onclick=()=>{if(b.classList.contains('on'))return;b.classList.add('on');GAME.add(+b.dataset.team,150,b);s.querySelector('.vdoor').classList.add('open');SND.fan();});});

/* ================= RACE 🧗 ================= */
document.querySelectorAll('.racegame').forEach(s=>{const items=JSON.parse(s.querySelector('script.jd').textContent);const N=+s.dataset.steps;
  const pos=[0,0];let k=0,done=false;const q=s.querySelector('.rq'),a=s.querySelector('.ra'),nn=s.querySelector('.rn2');
  const runners=[...s.querySelectorAll('.runner')];
  function place(){runners.forEach((r,t)=>{r.style.bottom=(pos[t]/N*78+4)+'%';r.querySelector('b').textContent=D(pos[t]);});}
  function load(){q.innerHTML=items[k%items.length][0];a.innerHTML=items[k%items.length][1];a.classList.remove('on');nn.textContent=D('سؤال '+(k+1));}
  s.querySelector('.rrev').onclick=()=>{a.classList.add('on');SND.pop();};
  s.querySelector('.rnext').onclick=()=>{k++;load();SND.flip();};
  s.querySelectorAll('.rstep').forEach(b=>b.onclick=()=>{if(done)return;const t=+b.dataset.team;pos[t]++;GAME.add(t,20,b);a.classList.add('on');place();
    if(pos[t]>=N){done=true;setTimeout(()=>{GAME.add(t,200,runners[t]);s.querySelector('.rwin').innerHTML='🏁 '+GAME.st.nm[t]+' وصلت القمة أولًا! +٢٠٠';SND.fan();},400);}
    else setTimeout(()=>{k++;load();},900);});
  load();place();});

/* ===== Kahoot question on ONE line: shrink-to-fit ===== */
window.__onShow=function(sl){sl.querySelectorAll('.slide.kq .gq2, .gq2').forEach(el=>{if(!sl.classList.contains('kq'))return;
  let t=el.querySelector('.qtxt');if(!t){t=document.createElement('span');t.className='qtxt';[...el.childNodes].forEach(n=>{if(!(n.classList&&n.classList.contains('qtag')))t.appendChild(n);});el.appendChild(t);}
  t.style.fontSize='';t.style.whiteSpace='nowrap';let fs=parseFloat(getComputedStyle(t).fontSize);const W=el.clientWidth-40;
  while(t.scrollWidth>W&&fs>22){fs-=1;t.style.fontSize=fs+'px';}if(t.scrollWidth>W)t.style.whiteSpace='normal';});};

S[0].classList.add('cur');show(0);GAME.paint();
if(PRINT){document.querySelectorAll('.step').forEach(s=>s.classList.add('on'));S.forEach(s=>s.style.display=(s.classList.contains('title')||s.classList.contains('mo'))?'flex':'block');S.forEach(s=>fitOne(s));}
})();

document.addEventListener('contextmenu',e=>e.preventDefault());
document.addEventListener('keydown',e=>{const k=(e.key||'').toLowerCase();if(e.key==='F12'||(e.ctrlKey&&(k==='u'||k==='s'||k==='p'))||(e.ctrlKey&&e.shiftKey&&(k==='i'||k==='j'||k==='c'))){e.preventDefault();e.stopImmediatePropagation();}},true);
document.addEventListener('dragstart',e=>e.preventDefault());

/* ================= v2: حصة جديدة (تصفير) ================= */
(function(){const b=document.createElement('button');b.id='newsess';b.textContent='🔄 حصة جديدة';b.title='تصفير النقاط وإلغاء الإجابات المكشوفة (الأسماء تبقى)';
  b.onclick=()=>{if(!confirm('بدء حصة جديدة؟ سيتم تصفير نقاط الفريقين ونقاط الطلاب وإلغاء كل الإجابات المكشوفة. (كشف الأسماء يبقى كما هو)'))return;
    try{Object.keys(localStorage).forEach(k=>{if(k.startsWith('q2_')&&k!=='q2_mute')localStorage.removeItem(k);});
      if(window.ROS){const K='cls_'+ROS.R.id;localStorage.removeItem(K);}}catch(e){}
    location.hash='';location.reload();};
  const rail=document.getElementById('rail'),cr=rail&&rail.querySelector('.credit');if(cr)rail.insertBefore(b,cr);else (rail||document.getElementById('deck')).appendChild(b);})();
/* ================= v2: شكلي إذا 🎭 ================= */
document.querySelectorAll('.actgame').forEach(s=>{const list=JSON.parse(s.querySelector('script.jd').textContent);let used=[];const card=s.querySelector('.actcard'),q=s.querySelector('.actq');
  s.querySelector('.actnew').onclick=()=>{if(used.length>=list.length)used=[];let k;do{k=Math.floor(Math.random()*list.length);}while(used.includes(k));used.push(k);
    card.classList.remove('pop');void card.offsetWidth;card.classList.add('pop');q.textContent='شكلي إذا… '+list[k];SND.pop();};});
/* ================= v2: ابحث عن 🧐 ================= */
document.querySelectorAll('.findgame').forEach(s=>{const g=s.querySelector('.findgrid'),tm=s.querySelector('.ftm');let iv=null,left=+tm.dataset.t;
  const SETS=[['😀','🧐'],['😺','😼'],['🙂','🙃'],['🌸','🌺'],['٦','٩'],['٨','٣'],['ب','ت'],['س','ش'],['٧','٧٠'],['٢٥','٢٣'],['⬛','◼️'],['🍉','🍈']];
  function build(){g.innerHTML='';const [bg,tg]=SETS[Math.floor(Math.random()*SETS.length)];const cols=14,rows=6;g.style.gridTemplateColumns='repeat('+cols+',52px)';const hit=Math.floor(Math.random()*cols*rows);
    for(let k=0;k<cols*rows;k++){const sp=document.createElement('span');sp.textContent=k===hit?tg:bg;sp.style.transform='rotate('+(Math.random()*16-8)+'deg)';
      sp.onclick=()=>{if(k===hit){sp.classList.add('hit');SND.fan();stop();}else{sp.classList.add('miss');SND.no();}};g.appendChild(sp);}}
  const stop=()=>{if(iv){clearInterval(iv);iv=null;}};
  s.querySelector('.fnew').onclick=()=>{build();stop();left=+tm.dataset.t;tm.textContent=D(left);tm.classList.remove('low');SND.flip();};
  s.querySelector('.fstart').onclick=()=>{stop();left=+tm.dataset.t;tm.textContent=D(left);iv=setInterval(()=>{left--;tm.textContent=D(left);if(left<=5&&left>0){tm.classList.add('low');SND.tick();}if(left<=0){stop();SND.buzz();}},1000);};
  build();});
/* ================= v2: فلاش الذاكرة 🧠 ================= */
document.querySelectorAll('.flashgame').forEach(s=>{const cfg=JSON.parse(s.querySelector('script.jd').textContent);const n=s.querySelector('.flnums'),q=s.querySelector('.flq'),a=s.querySelector('.fla');let cur=null;
  const KINDS=['sum','missing','max','count'];
  s.querySelector('.flgo').onclick=()=>{const kind=KINDS[Math.floor(Math.random()*KINDS.length)];const len=4+Math.floor(Math.random()*2);const nums=[];while(nums.length<len){const v=2+Math.floor(Math.random()*28);if(!nums.includes(v))nums.push(v);}
    cur={kind,nums};a.classList.remove('on');q.textContent='';n.classList.remove('hide');n.textContent=nums.map(D).join('   ');SND.pop();
    setTimeout(()=>{n.classList.add('hide');n.textContent='🙈 اختفت الأعداد!';
      if(kind==='sum'){q.textContent='ما مجموع الأعداد التي رأيتموها؟';a.textContent=D(nums.reduce((x,y)=>x+y,0));}
      else if(kind==='missing'){const miss=nums[Math.floor(Math.random()*nums.length)];const rest=nums.filter(v=>v!==miss);q.textContent='ظهرت هذه الأعداد: '+rest.map(D).join(' ، ')+' … ما العدد المفقود؟';a.textContent=D(miss);}
      else if(kind==='max'){q.textContent='ما الفرق بين أكبر عدد وأصغر عدد؟';a.textContent=D(Math.max(...nums)-Math.min(...nums));}
      else{const ev=nums.filter(v=>v%2===0).length;q.textContent='كم عددًا زوجيًّا كان بينها؟';a.textContent=D(ev)+' ('+nums.filter(v=>v%2===0).map(D).join('، ')+')';}
      window.__fit&&__fit();},5000);};
  s.querySelector('.flrev').onclick=()=>{if(!cur)return;a.classList.add('on');SND.fan();window.__fit&&__fit();};});
/* ================= v2: أزرار منح نقاط عامة ================= */
document.querySelectorAll('.award2').forEach(b=>b.onclick=()=>{GAME.add(+b.dataset.tm,+b.dataset.p,b);});

/* ================= v2: ابحث عن.. مهمات أصعب 🔍 ================= */
document.querySelectorAll('.scenegame').forEach((s,si)=>{const CFG=JSON.parse(s.querySelector('script.jd').textContent),SC=CFG.scenes,LOOK=CFG.look;
  const board=s.querySelector('.scboard'),ask=s.querySelector('.scask'),txt=s.querySelector('.sctxt'),item=s.querySelector('.scitem'),cnt=s.querySelector('.sccnt'),prog=s.querySelector('.scprog'),tm=s.querySelector('.sctm');
  let iv=null,left=+tm.dataset.t,tasks=[],cur=-1,found=0,th=null,cellEls=[];
  const shuf=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
  const rnd=n=>Math.floor(Math.random()*n);const stop=()=>{if(iv){clearInterval(iv);iv=null;}};
  function build(){th=SC[(si+rnd(SC.length))%SC.length];board.style.background=th.bg;const cols=18,rows=8,N=cols*rows;board.style.gridTemplateColumns='repeat('+cols+',1fr)';
    const cells=new Array(N).fill(null);const free=shuf([...Array(N).keys()]);let fp=0;const take=()=>{while(fp<free.length&&cells[free[fp]])fp++;return free[fp++];};
    const pool=shuf(th.tg.slice());tasks=[];const used=new Set();const pick=()=>{let x;do{x=pool.pop();}while(x&&used.has(x));used.add(x);return x;};
    const put=(idx,k,extra)=>{const c=Object.assign({k,task:tasks.length-1},extra||{});cells[idx]=c;return c;};
    // 1) بحث عادي مع مشتت شبيه
    let e=pick();let n=2+rnd(2);tasks.push({type:'find',k:e,n});for(let q=0;q<n;q++)put(take(),e);
    // 2) النسخة المعكوسة
    if(th.asym.length){const a=shuf(th.asym.filter(x=>!used.has(x)));e=a[0];used.add(e);tasks.push({type:'flip',k:e,n:1});put(take(),e,{flip:true});for(let q=0;q<3+rnd(2);q++)cells[take()]={k:e};}
    // 3) عدد بخاصية
    {const S=6+rnd(10);const okn=[];for(let v=10;v<100;v++)if(((v/10|0)+(v%10))===S)okn.push(v);const num=okn[rnd(okn.length)];tasks.push({type:'num',k:String(num),n:1,S});put(take(),String(num),{num:true});
      const dec=new Set();while(dec.size<5){const v=10+rnd(90);if(((v/10|0)+(v%10))!==S)dec.add(v);}dec.forEach(v=>cells[take()]={k:String(v),num:true});}
    // 4) الوحيد في اللوحة
    e=pick();tasks.push({type:'unique',k:e,n:1});put(take(),e);
    // 5) اثنان متلاصقان
    {e=pick();tasks.push({type:'pair',k:e,n:1});let i;do{i=rnd(N-1);}while(cells[i]||cells[i+1]||(i%cols)===cols-1);put(i,e);put(i+1,e);
      let singles=0;while(singles<3){const j=take();const nb=[j-1,j+1,j-cols,j+cols].filter(x=>x>=0&&x<N);if(nb.some(x=>cells[x]&&cells[x].k===e)){cells[j]={k:th.fill[rnd(th.fill.length)]};continue;}cells[j]={k:e};singles++;}}
    // 6) المقلوب رأسًا على عقب (أو بحث ثانٍ في الأشكال)
    if(th.asym.length){const a=shuf(th.asym.filter(x=>!used.has(x)));e=a[0]||th.asym[0];used.add(e);tasks.push({type:'up',k:e,n:1});put(take(),e,{up:true});for(let q=0;q<3+rnd(2);q++)cells[take()]={k:e};}
    else{e=pick();n=3;tasks.push({type:'find',k:e,n});for(let q=0;q<n;q++)put(take(),e);}
    // مشتتات شبيهة لكل هدف
    tasks.forEach(t=>{const lk=LOOK[t.k];if(lk&&!th.fill.includes(lk)){for(let q=0;q<2+rnd(2);q++)cells[take()]={k:lk};}});
    // تعبئة الباقي: كل عنصر حشو يظهر مرتين على الأقل (حتى تكون مهمة «الوحيد» صادقة)
    const fillers=th.fill.filter(x=>!used.has(x));for(let i=0;i<N;i++)if(!cells[i])cells[i]={k:fillers[rnd(fillers.length)]};
    const counts={};cells.forEach(c=>{if(!c.task&&!c.num)counts[c.k]=(counts[c.k]||0)+1;});
    for(let i=0;i<N;i++){const c=cells[i];if(!c.task&&!c.num&&counts[c.k]===1){const k2=fillers[rnd(fillers.length)];counts[c.k]--;c.k=k2;counts[k2]=(counts[k2]||0)+1;}}
    tasks.forEach((t,ti)=>{t.idx=ti;});
    board.innerHTML='';cellEls=[];cells.forEach(c=>{const sp=document.createElement('span');sp.textContent=c.num?D(c.k):c.k;if(c.num)sp.className='num';else if(th.txt)sp.className='shp';
      const rot=c.up?180:(Math.random()*50-25);sp.style.transform='rotate('+rot+'deg) scale('+(0.8+Math.random()*0.4)+')'+(c.flip?' scaleX(-1)':'');
      sp.onclick=()=>{if(cur<0||sp.classList.contains('hit'))return;const t=tasks[cur];if(c.task===t.idx&&cells.indexOf(c)>=0){sp.classList.add('hit');found++;SND.ok();paint();if(found>=t.n){ask.classList.add('done');stop();SND.fan();}}else{sp.classList.add('miss');SND.no();setTimeout(()=>sp.classList.remove('miss'),500);}};
      board.appendChild(sp);cellEls.push(sp);});
    cur=-1;found=0;next();}
  function paint(){const t=tasks[cur];item.className='scitem';item.textContent='';cnt.textContent='';
    if(t.type==='find'){txt.textContent='ابحثوا عن:';item.textContent=t.k;cnt.textContent='× '+D(t.n)+' · وجدنا '+D(found)+' — انتبهوا للشبيه!';}
    else if(t.type==='flip'){txt.textContent='النسخة المعكوسة كالمرآة من:';item.textContent=t.k;item.classList.add('flip');cnt.textContent='واحدة فقط معكوسة';}
    else if(t.type==='up'){txt.textContent='المقلوب رأسًا على عقب من:';item.textContent=t.k;item.classList.add('up');cnt.textContent='واحد فقط مقلوب';}
    else if(t.type==='num'){txt.textContent='العدد الذي مجموع رقميه = '+D(t.S);cnt.textContent='عدد واحد فقط';}
    else if(t.type==='unique'){txt.textContent='الشيء الذي ظهر مرة واحدة فقط في اللوحة كلها 🧐';cnt.textContent='كل ما عداه مكرر';}
    else if(t.type==='pair'){txt.textContent='اثنان من';item.textContent=t.k;cnt.textContent='متلاصقان جنبًا إلى جنب (لا المنفردة)';}
    prog.textContent=th.name+' · مهمة '+D(cur+1)+' من '+D(tasks.length);window.__fit&&__fit();}
  function next(){if(cur+1>=tasks.length){build();return;}cellEls.forEach(x=>x.classList.remove('hit','miss'));cur++;found=0;ask.classList.remove('done');paint();stop();left=+tm.dataset.t;tm.textContent=D(left);tm.classList.remove('low');SND.flip();}
  s.querySelector('.scnext').onclick=next;
  s.querySelector('.scnew').onclick=()=>{build();stop();left=+tm.dataset.t;tm.textContent=D(left);tm.classList.remove('low');};
  s.querySelector('.scstart').onclick=()=>{stop();left=+tm.dataset.t;tm.textContent=D(left);iv=setInterval(()=>{left--;tm.textContent=D(left);if(left<=5&&left>0){tm.classList.add('low');SND.tick();}if(left<=0){stop();SND.buzz();}},1000);};
  build();});

/* نقل أيقونات الأدوات من شريط التنقل إلى الشريط الجانبي حتى لا تتعارض مع رقائق الفريقين */
(function(){const rail=document.getElementById('rail'),nav=document.getElementById('nav');if(!rail||!nav)return;const box=document.createElement('div');box.id='railtools';const sp=rail.querySelector('.sp');rail.insertBefore(box,sp||rail.firstChild);
  [...nav.querySelectorAll('button.ghost')].filter(x=>x.id!=='prev'&&x.id!=='skip').forEach(x=>box.appendChild(x));})();

document.querySelectorAll('.fairpick').forEach(x=>x.onclick=()=>{window.ROS&&ROS.pick();});

/* ================= v2: برق المحطة ================= */
document.querySelectorAll('.revone').forEach(b=>b.onclick=()=>{const sp=b.nextElementSibling;sp.textContent=b.dataset.a;sp.classList.add('on');b.style.display='none';SND.pop();});
