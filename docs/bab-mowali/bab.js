/* Moteur « الباب الموالي · La porte suivante » v1.
   Utilisation : <script src="chapitres/xxx.js"></script><script src="bab.js"></script>
   Le chapitre (window.BAB_CHAPTER) contient tout le contenu ; ce fichier ne change pas d'un chapitre à l'autre. */
(function(){
var C=window.BAB_CHAPTER;if(!C){document.body.innerHTML='<p style="color:#f27b60;padding:20px">Chapitre manquant (BAB_CHAPTER).</p>';return}
var CSS=`:root{--bg:#0d0b14;--surface:#161320;--surface-2:#1e1a2b;--line:#2f2942;--fg:#f2eff9;--muted:#aaa3bf;
--coral:#f27b60;--lamp:#ffcf5c;--lav:#9b92dc;--pink:#e371cb;--teal:#6ccdb6;
--f-ar:"Cairo","Segoe UI",Tahoma,system-ui,sans-serif;--f-body:"Figtree",system-ui,-apple-system,"Segoe UI",sans-serif;
--f-display:"Lobster Two",Georgia,serif}
*{box-sizing:border-box}
html,body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.5 var(--f-body)}
body{max-width:520px;margin:0 auto;padding:0 14px 40px}
button{font:inherit;color:inherit;cursor:pointer}
.ar{font-family:var(--f-ar);direction:rtl;text-align:right;color:var(--muted);font-size:.95rem;line-height:1.7}
header{position:sticky;top:0;z-index:5;background:linear-gradient(var(--bg) 75%,transparent);padding:14px 0 10px;display:flex;align-items:center;gap:10px}
header h1{font-family:var(--f-display);font-size:1.45rem;margin:0;line-height:1.1;flex:1}
header h1 small{display:block;font-family:var(--f-ar);font-size:.85rem;color:var(--lamp);font-weight:600}
.keys{display:flex;align-items:center;gap:6px;background:var(--surface-2);border:1px solid var(--line);border-radius:99px;padding:5px 11px;font-weight:700;color:var(--lamp)}
.eyebrow{font-size:.78rem;letter-spacing:.06em;text-transform:uppercase;color:var(--lav);margin:4px 0 2px}
.card{background:var(--surface);border:1px solid var(--line);border-radius:18px;padding:16px;margin:12px 0}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border:0;border-radius:14px;padding:12px 18px;font-weight:700;background:var(--lamp);color:#241a00;min-height:46px}
.btn.ghost{background:transparent;border:1px solid var(--line);color:var(--fg)}
.btn.full{width:100%}
.btn:disabled{opacity:.35;cursor:default}
a.course{color:var(--teal);font-size:.9rem;text-decoration:none;border-bottom:1px dashed var(--teal)}
/* carte */
.map{position:relative;margin:6px 0 0}
.map svg.path{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
.door{position:relative;display:flex;gap:14px;align-items:center;width:100%;text-align:left;background:var(--surface);border:1px solid var(--line);border-radius:18px;padding:14px;margin:0 0 26px}
.door .ic{flex:none;width:58px;height:70px}
.door h3{margin:0;font-size:1.02rem}
.door p{margin:2px 0 0;font-size:.86rem;color:var(--muted)}
.door .tag{display:inline-block;font-size:.72rem;font-weight:700;border-radius:99px;padding:2px 8px;margin-top:6px}
.door.locked{opacity:.55}
.door.ready{border-color:var(--lamp);box-shadow:0 0 0 3px #ffcf5c22}
.door.done .tag{background:#6ccdb633;color:var(--teal)}
.door.ready .tag{background:#ffcf5c33;color:var(--lamp)}
.door.locked .tag{background:#2f2942;color:var(--muted)}
.door.chest{border-style:dashed}
.frags{display:flex;gap:5px;margin-top:6px}
.frags i{width:14px;height:14px;border-radius:4px;transform:rotate(45deg);background:var(--line);display:block}
.frags i.on{background:var(--lamp);box-shadow:0 0 8px var(--lamp)}
.teaserq{font-style:italic;color:var(--fg);font-size:.86rem;margin-top:4px}
/* collectif */
.bar{height:10px;background:var(--surface-2);border-radius:99px;overflow:hidden;margin:6px 0}
.bar b{display:block;height:100%;background:linear-gradient(90deg,var(--teal),var(--lamp));border-radius:99px;transition:width .8s}
/* mentor */
.mentor{display:flex;gap:10px;align-items:flex-start;margin:10px 0}
.mentor svg{flex:none;width:46px;height:56px;filter:drop-shadow(0 0 10px #ffcf5c66);animation:glow 2.6s ease-in-out infinite}
@keyframes glow{50%{filter:drop-shadow(0 0 18px #ffcf5caa)}}
.bubble{background:var(--surface-2);border:1px solid var(--line);border-radius:4px 16px 16px 16px;padding:10px 12px;font-size:.93rem;flex:1}
.bubble .ar{margin-top:4px;font-size:.88rem}
/* porte */
.steps{display:flex;gap:6px;margin:4px 0 2px}
.steps span{flex:1;height:5px;border-radius:9px;background:var(--line)}
.steps span.on{background:var(--lamp)}
.illu{width:100%;height:auto;display:block;border-radius:14px;background:var(--surface-2)}
.blur{filter:blur(7px) saturate(.8);animation:unveil 1.6s ease forwards}
@keyframes unveil{from{filter:blur(14px)}to{filter:blur(6px) saturate(.85)}}
.veil{position:relative}
.veil .q{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:var(--f-display);font-size:3.4rem;color:var(--lamp);text-shadow:0 0 18px #000}
.hook{font-size:1.15rem;font-weight:700;margin:10px 0 4px}
.opt{display:block;width:100%;text-align:left;background:var(--surface-2);border:1px solid var(--line);border-radius:12px;padding:11px 13px;margin:7px 0}
.opt.ok{border-color:var(--teal);background:#6ccdb622}
.opt.no{border-color:var(--coral);animation:shake .35s}
@keyframes shake{25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}
.vf{display:flex;align-items:center;gap:8px;padding:9px 0;border-bottom:1px solid var(--line)}
.vf:last-child{border:0}
.vf p{flex:1;margin:0;font-size:.95rem}
.vf button{border:1px solid var(--line);background:var(--surface-2);border-radius:10px;padding:7px 10px;font-weight:700;min-width:44px}
.vf.ok button{opacity:.3}
.vf.ok button.sel{opacity:1;border-color:var(--teal);background:#6ccdb622}
.hint{display:none;margin-top:8px;padding:9px 11px;border-radius:10px;background:#f27b6018;border:1px solid #f27b6055;font-size:.9rem}
.hint.show{display:block}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0}
.chip{border:1px solid var(--line);background:var(--surface-2);border-radius:99px;padding:8px 13px;font-weight:500}
.chip.sel{border-color:var(--lamp);color:var(--lamp)}
.chip.used{opacity:.25;pointer-events:none}
.seq{min-height:46px;border:1px dashed var(--line);border-radius:12px;padding:8px;display:flex;flex-wrap:wrap;gap:6px;align-items:center;color:var(--muted);font-size:.9rem}
.seq .chip{border-color:var(--teal);color:var(--teal)}
.bins{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:8px}
.bin{border:1px solid var(--line);background:var(--surface-2);border-radius:12px;padding:8px 6px;min-height:92px;text-align:center}
.bin b{display:block;font-size:.85rem;margin-bottom:4px}
.bin small{display:block;font-size:.8rem;color:var(--teal)}
input.num{width:100%;font:inherit;font-size:1.2rem;padding:11px 13px;border-radius:12px;border:1px solid var(--line);background:var(--surface-2);color:var(--fg)}
.gain{display:none;text-align:center;margin:14px 0 4px}
.gain.show{display:block}
.gain .gem{display:inline-block;width:34px;height:34px;transform:rotate(45deg);border-radius:8px;background:var(--lamp);box-shadow:0 0 22px var(--lamp);animation:pop .6s cubic-bezier(.3,1.6,.5,1)}
@keyframes pop{from{transform:rotate(45deg) scale(0)}to{transform:rotate(45deg) scale(1)}}
.gain p{margin:10px 0 0;font-weight:700;color:var(--lamp)}
.reveal h2{font-family:var(--f-display);color:var(--lamp);margin:4px 0 6px;font-size:1.5rem}
.next{border:1px solid var(--lamp);border-radius:16px;padding:12px;margin-top:12px;background:#ffcf5c0d}
.next .eyebrow{color:var(--lamp)}
/* modale */
.modal{position:fixed;inset:0;background:#0d0b14ee;display:none;align-items:flex-end;justify-content:center;z-index:20;padding:14px}
.modal.show{display:flex}
.modal .card{width:100%;max-width:500px;animation:up .3s ease}
@keyframes up{from{transform:translateY(40px);opacity:0}}
.teacher{font-size:.85rem}
.teacher li{margin:3px 0;color:var(--muted)}
.teacher li b{color:var(--fg)}
.alert{color:var(--coral)!important}
.foot{display:flex;gap:8px;flex-wrap:wrap;margin-top:16px}
.foot .btn{flex:1;font-size:.85rem;min-height:40px;padding:8px}
.player{display:flex;align-items:center;gap:10px;margin-top:12px;background:var(--surface-2);border:1px solid var(--lamp);border-radius:14px;padding:8px 12px 8px 8px}
.player .pp{flex:none;width:46px;height:46px;border-radius:50%;border:0;background:var(--lamp);display:flex;align-items:center;justify-content:center}
.player .pp:focus-visible{outline:3px solid var(--fg);outline-offset:2px}
.player .pi{flex:1;min-width:0}
.player .lb{font-size:.88rem;font-weight:700;color:var(--lamp);line-height:1.2}
.player .lb span{font-family:var(--f-ar);font-weight:600}
.player .tr{height:6px;background:var(--line);border-radius:9px;margin:7px 0 3px;overflow:hidden;cursor:pointer}
.player .tr b{display:block;height:100%;width:0;background:var(--lamp);border-radius:9px}
.player .tm{font-size:.75rem;color:var(--muted);font-variant-numeric:tabular-nums}
.player .er{display:none;font-size:.78rem;color:var(--coral)}
.player.err .er{display:block}
.player.err .tm{display:none}
.proto{font-size:.75rem;color:var(--muted);text-align:center;margin-top:18px}
[hidden]{display:none!important}`;
var st0=document.createElement('style');st0.textContent=CSS;document.head.appendChild(st0);
document.body.innerHTML=`<header>
  <h1 id="bTitle"></h1>
  <div class="keys" title="Fragments"><svg width="14" height="14" viewBox="0 0 14 14"><rect x="3" y="3" width="8" height="8" rx="2" transform="rotate(45 7 7)" fill="#ffcf5c"/></svg><span id="nFrag">0</span></div>
</header>

<!-- ===== CARTE ===== -->
<main id="vMap">
  <div class="eyebrow" id="bKick"></div>
  <div class="ar" id="bKickAr"></div>
  <div class="mentor" id="mapMentor"></div>
  <div class="map" id="map"></div>
  <div class="card" id="collective"></div>
  <div class="card teacher" id="teacher" hidden></div>
  <div class="foot">
    <button class="btn ghost" id="bTeacher">Vue professeur</button>
    <button class="btn ghost" id="bReset">Recommencer</button>
  </div>
  <p class="proto">Prototype v0 · données de la classe simulées · le cours reste toujours ouvert<br>Voix de Fanous (Darija) intégrée à la page</p>
</main>

<!-- ===== PORTE ===== -->
<main id="vDoor" hidden>
  <button class="btn ghost" id="bBack" style="min-height:38px;padding:6px 12px;margin-top:2px">← Carte</button>
  <div class="eyebrow" id="dEye"></div>
  <div class="steps" id="dSteps"></div>
  <div id="dBody"></div>
</main>

<div class="modal" id="modal"><div class="card" id="mBody"></div></div>`;
document.title=C.title+' · '+C.titleAr;
document.getElementById('bTitle').innerHTML=C.title+'<small>'+C.titleAr+'</small>';
document.getElementById('bKick').textContent=C.kicker;document.getElementById('bKickAr').textContent=C.kickerAr;
var ILL=C.ill,DOORS=C.doors,AUD=C.audio,BONUS_AT=C.bonusAt||70,ALERT_MIN=C.alertMin||3,SIM=C.sim||{donePct:[0,0,0],stuck:[0,0,0]};
var LANTERN='<svg viewBox="0 0 46 56"><path d="M15 9 h16 l-3 -6 h-10 z" fill="#9b92dc"/><circle cx="23" cy="3" r="2.5" fill="none" stroke="#9b92dc" stroke-width="1.6"/>'+
 '<path d="M11 13 h24 l3 30 h-30 z" fill="#ffcf5c" fill-opacity=".9"/><path d="M11 13 h24 l3 30 h-30 z" fill="none" stroke="#9b92dc" stroke-width="2"/>'+
 '<line x1="23" y1="13" x2="23" y2="43" stroke="#9b92dc" stroke-width="1.2" opacity=".6"/><circle cx="18" cy="26" r="2.2" fill="#241a00"/><circle cx="28" cy="26" r="2.2" fill="#241a00"/><path d="M19 32 q4 3 8 0" fill="none" stroke="#241a00" stroke-width="1.6" stroke-linecap="round"/>'+
 '<rect x="9" y="43" width="28" height="6" rx="2" fill="#9b92dc"/></svg>';
var PLAY='<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M5 3 L15 9 L5 15 Z" fill="#241a00"/></svg>';
var PAUSE='<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="4" y="3" width="3.6" height="12" rx="1" fill="#241a00"/><rect x="10.4" y="3" width="3.6" height="12" rx="1" fill="#241a00"/></svg>';
function listen(i){return '<div class="player" data-aud="'+i+'"><button class="pp" type="button" aria-label="Écouter Fanous">'+PLAY+'</button>'+
 '<div class="pi"><div class="lb">Écouter Fanous · <span>اسمع فانوس</span></div><div class="tr"><b></b></div>'+
 '<div class="tm">0:00</div><div class="er">Son indisponible pour le moment · الصوت غير متاح حاليا</div></div></div>'}
var snd={a:null,i:-1,el:null};
function fmt(t){t=Math.max(0,Math.floor(t||0));return Math.floor(t/60)+':'+('0'+t%60).slice(-2)}
function paint(){var el=snd.el,a=snd.a;if(!el||!a||!el.isConnected)return;
  var d=a.duration||0;el.querySelector('.tr b').style.width=(d?a.currentTime/d*100:0)+'%';
  el.querySelector('.tm').textContent=fmt(a.currentTime)+(d?' / '+fmt(d):'');
  var b=el.querySelector('.pp');b.innerHTML=a.paused?PLAY:PAUSE;b.setAttribute('aria-label',a.paused?'Écouter Fanous':'Pause')}
function stopSound(){if(snd.a){try{snd.a.pause()}catch(e){}paint()}}
document.addEventListener('click',function(e){
  var el=e.target.closest&&e.target.closest('.player');if(!el)return;
  var i=+el.getAttribute('data-aud');
  if(snd.i!==i||!snd.a){stopSound();var a=new Audio(AUD[i]);a.preload='auto';snd={a:a,i:i,el:el};
    a.addEventListener('timeupdate',paint);a.addEventListener('loadedmetadata',paint);
    a.addEventListener('ended',function(){a.currentTime=0;paint()});
    a.addEventListener('error',function(){el.classList.add('err');paint()})}
  snd.el=el;var a=snd.a;
  if(e.target.closest('.tr')){var r=e.target.closest('.tr').getBoundingClientRect();if(a.duration)a.currentTime=(e.clientX-r.left)/r.width*a.duration;paint();return}
  if(!e.target.closest('.pp'))return;
  if(a.paused){var pr=a.play();if(a.currentTime<.3)track('listen',i);if(pr&&pr.catch)pr.catch(function(){el.classList.add('err')})}else a.pause();
  paint();
});
/* ---------- état ---------- */
var KEY=C.storageKey;
function blank(){return {frags:[[0,0,0],[0,0,0],[0,0,0]],done:[0,0,0],pass:[1,0,0,0],start:[0,0,0],log:[],shift:0}}
var st;try{st=JSON.parse(localStorage.getItem(KEY))||blank()}catch(e){st=blank()}
function save(){try{localStorage.setItem(KEY,JSON.stringify(st))}catch(e){}}
function now(){return Date.now()+st.shift}
function track(ev,door){st.log.unshift({ev:ev,d:door,t:now()});st.log=st.log.slice(0,40);save();send(ev,door)}
/* Événements anonymes : identifiant aléatoire de l'appareil + code de classe, jamais de nom. */
var SID=(function(){try{var s=localStorage.getItem('bab_sid');if(!s){s=Math.random().toString(36).slice(2,12);localStorage.setItem('bab_sid',s)}return s}catch(e){return 'anon'}})();
var CLS=(function(){var m=/[?&]cls=([\w-]{1,20})/.exec(location.search);try{if(m)localStorage.setItem('bab_cls',m[1]);return m?m[1]:(localStorage.getItem('bab_cls')||'')}catch(e){return m?m[1]:''}})();
function send(ev,door){if(!C.endpoint)return;try{fetch(C.endpoint,{method:'POST',headers:{'Content-Type':'application/json'},keepalive:true,
  body:JSON.stringify({app:'bab',chapter:C.id,cls:CLS,sid:SID,type:ev,door:door})}).catch(function(){})}catch(e){}}

var $=function(s){return document.querySelector(s)};
function h(tag,attrs,html){var e=document.createElement(tag);if(attrs)for(var k in attrs){if(k==='on')for(var ev in attrs.on)e.addEventListener(ev,attrs.on[ev]);else e.setAttribute(k,attrs[k])}if(html!=null)e.innerHTML=html;return e}
function mentor(el,fr,ar){el.innerHTML='';el.className='mentor';el.appendChild(h('div',null,LANTERN).firstChild);el.appendChild(h('div',{'class':'bubble'},fr+(ar?'<div class="ar">'+ar+'</div>':'')))}
function nFrag(){var n=0;st.frags.forEach(function(f){f.forEach(function(x){n+=x})});return n}
function state(i){
  if(i<3&&st.done[i])return 'done';
  if(i===3&&st._chest)return 'done';
  var prevDone=i===0||st.done[i-1];
  return prevDone?'ready':'locked';
}

/* ---------- carte ---------- */
function doorIcon(s,chest){
  var col=s==='done'?'#6ccdb6':s==='ready'?'#ffcf5c':'#2f2942';
  if(chest)return '<svg class="ic" viewBox="0 0 58 70"><rect x="6" y="28" width="46" height="32" rx="5" fill="#1e1a2b" stroke="'+col+'" stroke-width="2.5"/><path d="M6 36 q23 -26 46 0" fill="#1e1a2b" stroke="'+col+'" stroke-width="2.5"/><rect x="25" y="38" width="8" height="10" rx="2" fill="'+col+'"/></svg>';
  var inner=s==='done'?'<path d="M19 38 l7 7 l14 -15" fill="none" stroke="#6ccdb6" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>':
    s==='ready'?'<text x="29" y="46" text-anchor="middle" font-size="24" font-family="Lobster Two,serif" fill="#ffcf5c">?</text>':
    '<rect x="22" y="34" width="14" height="12" rx="2" fill="#2f2942"/><path d="M24 34 v-4 a5 5 0 0 1 10 0 v4" fill="none" stroke="#2f2942" stroke-width="2.5"/>';
  return '<svg class="ic" viewBox="0 0 58 70"><path d="M8 66 V24 a21 21 0 0 1 42 0 V66 Z" fill="#1e1a2b" stroke="'+col+'" stroke-width="2.5"/>'+inner+'<circle cx="41" cy="48" r="2.2" fill="'+col+'"/></svg>';
}
function renderMap(){
  $('#nFrag').textContent=nFrag();
  var m=$('#map');m.innerHTML='';
  var firstReady=-1;
  DOORS.forEach(function(d,i){
    var s=state(i);if(s==='ready'&&firstReady<0)firstReady=i;
    var tag=s==='done'?(d.chest?'Coffre ouvert · مفتوح':'Ouverte · مفتوحة'):s==='ready'?(d.chest?'Coffre à ouvrir':'À ouvrir · افتح'):'Fermée · مغلقة';
    var b=h('button',{'class':'door '+s+(d.chest?' chest':''),'data-i':i});
    var html=doorIcon(s,d.chest)+'<div><div class="eyebrow" style="margin:0">'+(d.chest?'Coffre':'Porte '+(i+1))+'</div><h3>'+d.title+'</h3><div class="ar" style="font-size:.85rem">'+d.ar+'</div>';
    if(s==='ready'&&i>0)html+='<div class="teaserq">«'+DOORS[i-1].cliff+'»</div>';
    if(!d.chest)html+='<div class="frags">'+st.frags[i].map(function(x){return '<i class="'+(x?'on':'')+'"></i>'}).join('')+'</div>';
    html+='<span class="tag">'+tag+'</span></div>';
    b.innerHTML=html;
    b.addEventListener('click',function(){openDoor(i)});
    m.appendChild(b);
  });
  var allDone=st.done[2];
  if(firstReady===0&&!st.frags[0][0])mentor($('#mapMentor'),'Je suis Fanous. Chaque porte cache une énigme. Trouve 3 fragments pour l’ouvrir et voir ce qui t’attend derrière la suivante.','أنا فانوس. وراء كل باب لغز. اجمع 3 شظايا لتفتحه وترى ما ينتظرك خلف الباب الموالي.');
  else if(firstReady===3)mentor($('#mapMentor'),'Trois portes ouvertes ! Le coffre du chapitre suivant t’attend.','ثلاثة أبواب مفتوحة! صندوق الفصل الموالي ينتظرك.');
  else mentor($('#mapMentor'),'Une énigme est restée sans réponse… La porte '+(firstReady+1)+' la cache.','بقي لغز بلا جواب… الباب '+(firstReady+1)+' يخفيه.');
  /* collectif */
  var c=$('#collective'),rows='';
  SIM.donePct.forEach(function(p,i){var v=Math.min(100,p+(st.done[i]?1:0));rows+='<div style="display:flex;justify-content:space-between;font-size:.85rem"><span>Porte '+(i+1)+'</span><span>'+v+' %</span></div><div class="bar"><b style="width:'+v+'%"></b></div>'});
  var p3=Math.min(100,SIM.donePct[2]+(st.done[2]?1:0));
  c.innerHTML='<div class="eyebrow">'+C.levelLabel+' · '+C.levelLabelAr+'</div>'+rows+
   '<p style="margin:8px 0 0;font-size:.9rem">'+(p3>=BONUS_AT?'Énigme bonus débloquée pour tous !':'À '+BONUS_AT+' % sur la porte 3, une <b>énigme bonus</b> s’ouvre pour tout le niveau.')+'</p>'+
   '<div class="ar">عند '+BONUS_AT+' في المئة في الباب 3 يُفتح لغز إضافي لكل المستوى.</div>';
  renderTeacher();
}
function renderTeacher(){
  var t=$('#teacher');if(t.hidden)return;
  var DAY=864e5,alerts='';
  /* Alerte au niveau de la classe uniquement (règle « sans noms, code de classe seulement ») :
     le Worker compte les élèves bloqués > 2 jours par porte ; aucune alerte sous ALERT_MIN. */
  st.start.forEach(function(s,i){
    var n=SIM.stuck[i]+((s&&!st.done[i]&&now()-s>2*DAY)?1:0);
    if(n>=ALERT_MIN)alerts+='<li class="alert"><b>Alerte Telegram (classe)</b> : '+n+' élèves devant la porte '+(i+1)+' depuis plus de 2 jours.<div class="ar">'+n+' تلاميذ عند الباب '+(i+1)+' منذ أكثر من يومين.</div></li>';
  });
  var names={listen:'a écouté Fanous',start:'a commencé',frag:'fragment gagné',miss:'erreur, indice affiché',key:'mot de passe trouvé',done:'porte ouverte',chest:'coffre ouvert'};
  t.innerHTML='<div class="eyebrow">Vue professeur · ما يراه الأستاذ</div><ul style="padding-left:18px;margin:6px 0">'+alerts+
   '<li style="list-style:none;margin-left:-18px;color:var(--muted);font-size:.85rem">Journal de cet appareil (démo, anonyme) :</li>'+
   (st.log.slice(0,12).map(function(l){var d=new Date(l.t);return '<li><b>'+names[l.ev]+'</b> · porte '+(l.d+1)+' · '+d.toLocaleDateString('fr-FR',{day:'2-digit',month:'2-digit'})+' '+d.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})+'</li>'}).join('')||'<li>Aucun événement.</li>')+
   '</ul><button class="btn ghost" id="bShift" style="min-height:36px;padding:6px 12px;font-size:.85rem">Simuler 3 jours plus tard</button>';
  $('#bShift').onclick=function(){st.shift+=3*864e5;save();renderTeacher()};
}

/* ---------- mot de passe ---------- */
function modal(html){$('#mBody').innerHTML='';if(typeof html==='string')$('#mBody').innerHTML=html;else $('#mBody').appendChild(html);$('#modal').classList.add('show')}
function closeModal(){$('#modal').classList.remove('show')}
$('#modal').addEventListener('click',function(e){if(e.target.id==='modal')closeModal()});
function askKey(i){
  var d=DOORS[i],k=d.key,box=h('div');
  box.innerHTML='<div class="eyebrow">Mot de passe · كلمة السر</div><p style="margin:4px 0 8px;font-weight:700">'+k.q+'</p>';
  var hint=h('div',{'class':'hint'},'Indice : '+k.h);
  k.o.forEach(function(o,j){box.appendChild(h('button',{'class':'opt',on:{click:function(){
    if(j===k.a){this.classList.add('ok');st.pass[i]=1;track('key',i);save();setTimeout(function(){closeModal();openDoor(i)},500)}
    else{this.classList.remove('no');void this.offsetWidth;this.classList.add('no');hint.classList.add('show');track('miss',i)}
  }}},o))});
  box.appendChild(hint);
  box.appendChild(h('button',{'class':'btn ghost full',style:'margin-top:10px',on:{click:closeModal}},'Plus tard'));
  modal(box);
}

/* ---------- porte ---------- */
var cur=-1;
function show(v){stopSound();$('#vMap').hidden=v!=='map';$('#vDoor').hidden=v!=='door';window.scrollTo(0,0)}
function openDoor(i){
  var s=state(i);
  if(s==='locked'){modal('<p style="margin:0 0 4px;font-weight:700">Cette porte est encore fermée.</p><p style="margin:0;color:var(--muted)">Termine la porte '+i+' pour découvrir son énigme. Le cours, lui, reste ouvert :</p><p><a class="course" href="'+C.courseBase+DOORS[i].id+'" target="_blank" rel="noopener">Ouvrir le cours «'+DOORS[i].title+'»</a></p><button class="btn full" onclick="document.getElementById(\'modal\').classList.remove(\'show\')">Compris</button>');return}
  if(!st.pass[i]){askKey(i);return}
  cur=i;
  if(i<3&&!st.start[i]){st.start[i]=now();track('start',i)}
  show('door');
  var d=DOORS[i];
  $('#dEye').innerHTML=(d.chest?'Coffre':'Porte '+(i+1))+' · '+d.title+'<div class="ar" style="text-transform:none;letter-spacing:0">'+d.ar+'</div>';
  if(d.chest){renderChest();return}
  var k=st.frags[i].indexOf(0),seen=st._seenHook&&st._seenHook[i];
  renderStep(st.done[i]||k<0?4:(k===0&&!seen?0:k+1));
}
function steps(n){$('#dSteps').innerHTML=[0,1,2,3,4].map(function(k){return '<span class="'+(k<=n?'on':'')+'"></span>'}).join('')}
function renderStep(n){
  var i=cur,d=DOORS[i],b=$('#dBody');b.innerHTML='';steps(n);
  if(n===0){
    var m=h('div');mentor(m,'Une énigme pour commencer. Ne cherche pas encore la réponse : garde-la en tête.','لغز للبداية. لا تبحث عن الجواب الآن، احتفظ به في ذهنك.');b.appendChild(m);
    var c=h('div',{'class':'card'});c.innerHTML=ILL[d.ill]+'<p class="hook">'+d.hook+'</p><div class="ar">'+d.hookAr+'</div>'+listen(i);b.appendChild(c);
    b.appendChild(h('button',{'class':'btn full',on:{click:function(){st._seenHook=st._seenHook||{};st._seenHook[i]=1;save();renderStep(1)}}},'Chercher les 3 fragments'));
    b.appendChild(h('p',{style:'text-align:center;margin:12px 0 0'},'<a class="course" href="'+C.courseBase+d.id+'" target="_blank" rel="noopener">Ouvrir le cours complet</a>'));
    return;
  }
  if(n===4){renderReveal();return}
  var f=d.frags[n-1],c=h('div',{'class':'card'});
  c.innerHTML='<div class="eyebrow">Fragment '+n+' / 3 · '+f.title+'</div>';
  var gain=h('div',{'class':'gain'},'<span class="gem"></span><p>Fragment '+n+' trouvé !</p>');
  var hint=h('div',{'class':'hint'});
  var nextBtn=h('button',{'class':'btn full',style:'margin-top:10px',hidden:'',on:{click:function(){renderStep(n+1)}}},n<3?'Fragment suivant':'Assembler les fragments');
  function win(){if(!st.frags[i][n-1]){st.frags[i][n-1]=1;track('frag',i);save();$('#nFrag').textContent=nFrag()}gain.classList.add('show');hint.classList.remove('show');nextBtn.hidden=false;nextBtn.scrollIntoView({behavior:'smooth',block:'center'})}
  function miss(txt){hint.innerHTML='Presque ! '+txt;hint.classList.add('show');track('miss',i)}
  if(f.t==='vf'){
    var left=f.items.length;
    f.items.forEach(function(it){
      var row=h('div',{'class':'vf'},'<p>'+it.s+'</p>');
      [['Vrai',true],['Faux',false]].forEach(function(p){row.appendChild(h('button',{on:{click:function(){
        if(row.classList.contains('ok'))return;
        if(p[1]===it.v){row.classList.add('ok');this.classList.add('sel');if(--left===0)win()}
        else{this.classList.remove('no');row.style.animation='none';void row.offsetWidth;row.style.animation='shake .35s';miss(it.h)}
      }}},p[0]))});
      c.appendChild(row);
    });
  }else if(f.t==='qcm'){
    c.appendChild(h('p',{style:'margin:6px 0;font-weight:700'},f.q));
    f.o.forEach(function(o,j){c.appendChild(h('button',{'class':'opt',on:{click:function(){
      if(gain.classList.contains('show'))return;
      if(j===f.a){this.classList.add('ok');win()}else{this.classList.remove('no');void this.offsetWidth;this.classList.add('no');miss(f.h)}
    }}},o))});
  }else if(f.t==='order'){
    c.appendChild(h('p',{style:'margin:6px 0;font-weight:700'},f.q));
    var seq=h('div',{'class':'seq'},'Touche les étapes dans l’ordre…'),pos=0;
    var shuffled=[2,0,3,1].map(function(k){return f.items[k]});
    var chips=h('div',{'class':'chips'});
    shuffled.forEach(function(s){chips.appendChild(h('button',{'class':'chip',on:{click:function(){
      if(s===f.items[pos]){if(pos===0)seq.innerHTML='';seq.appendChild(h('span',{'class':'chip'},(pos+1)+'. '+s));this.classList.add('used');if(++pos===f.items.length)win()}
      else{this.style.animation='none';void this.offsetWidth;this.style.animation='shake .35s';miss(f.h)}
    }}},s))});
    c.appendChild(seq);c.appendChild(chips);
  }else if(f.t==='sort'){
    c.appendChild(h('p',{style:'margin:6px 0;font-weight:700'},f.q));
    var sel=null,left2=f.items.length,chips2=h('div',{'class':'chips'}),bins=h('div',{'class':'bins'});
    f.items.forEach(function(it){var ch=h('button',{'class':'chip',on:{click:function(){[].forEach.call(chips2.children,function(x){x.classList.remove('sel')});ch.classList.add('sel');sel={it:it,el:ch}}}},it[0]);chips2.appendChild(ch)});
    f.bins.forEach(function(name,k){var bn=h('button',{'class':'bin',on:{click:function(){
      if(!sel){miss('Touche d’abord une matière.');return}
      if(sel.it[1]===k){bn.appendChild(h('small',null,sel.it[0]));sel.el.classList.add('used');sel.el.classList.remove('sel');sel=null;if(--left2===0)win()}
      else{bn.style.animation='none';void bn.offsetWidth;bn.style.animation='shake .35s';miss(f.h)}
    }}},'<b>'+name+'</b>');bins.appendChild(bn)});
    c.appendChild(chips2);c.appendChild(bins);
  }else if(f.t==='num'){
    c.appendChild(h('p',{style:'margin:6px 0;font-weight:700'},f.q));
    var inp=h('input',{'class':'num',inputmode:'decimal',placeholder:'ρ en '+f.unit,'aria-label':'Réponse'});
    c.appendChild(inp);
    c.appendChild(h('button',{'class':'btn ghost full',style:'margin-top:8px',on:{click:function(){
      var v=parseFloat(String(inp.value).replace(',','.'));
      if(!isNaN(v)&&Math.abs(v-f.ans)<=f.tol){inp.style.borderColor='var(--teal)';win()}else miss(f.h);
    }}},'Vérifier'));
  }
  c.appendChild(hint);c.appendChild(gain);c.appendChild(nextBtn);
  b.appendChild(c);
  var m2=h('div');mentor(m2,'Rappel de l’énigme : «'+d.hook+'»',null);b.appendChild(m2);
}
function renderReveal(){
  var i=cur,d=DOORS[i],b=$('#dBody');
  if(!st.done[i]){st.done[i]=1;track('done',i);save()}
  var nx=DOORS[i+1];
  var c=h('div',{'class':'card reveal'});
  c.innerHTML='<div class="frags" style="justify-content:center;margin:2px 0 8px"><i class="on"></i><i class="on"></i><i class="on"></i></div>'+
   '<h2>Énigme résolue</h2><p style="margin:0 0 4px">'+d.reveal+'</p><div class="ar">'+d.revealAr+'</div>'+
   '<div class="next"><div class="eyebrow">Derrière la porte suivante · وراء الباب الموالي</div>'+
   '<div class="veil">'+ILL[nx.ill].replace('class="illu"','class="illu blur"')+'<div class="q">?</div></div>'+
   '<p style="margin:10px 0 2px;font-weight:700">'+d.cliff+'</p><div class="ar">'+d.cliffAr+'</div></div>';
  b.appendChild(c);
  b.appendChild(h('button',{'class':'btn full',on:{click:function(){show('map');renderMap();openDoor(i+1)}}},nx.chest?'Ouvrir le coffre':'Vers la porte '+(i+2)));
  b.appendChild(h('button',{'class':'btn ghost full',style:'margin-top:8px',on:{click:function(){show('map');renderMap()}}},'Garder l’énigme pour demain'));
}
function renderChest(){
  var d=DOORS[3],b=$('#dBody');b.innerHTML='';steps(4);
  if(!st._chest){st._chest=1;track('chest',3);save()}
  var m=h('div');mentor(m,'Bravo, tu as ouvert le coffre ! Voici l’énigme du prochain chapitre. Ton professeur te la fera résoudre.','أحسنت، فتحت الصندوق! هذا لغز الفصل الموالي، وسيساعدك أستاذك على حله.');b.appendChild(m);
  var c=h('div',{'class':'card'});c.innerHTML=ILL[d.ill]+'<p class="hook">'+d.hook+'</p><div class="ar">'+d.hookAr+'</div>'+listen(3)+
   '<p style="margin:12px 0 0"><a class="course" href="'+C.courseBase+d.id+'" target="_blank" rel="noopener">Jeter un œil au cours «'+C.chestCourse+'»</a></p>';
  b.appendChild(c);
  b.appendChild(h('button',{'class':'btn ghost full',on:{click:function(){show('map');renderMap()}}},'Retour à la carte'));
}

/* ---------- boutons ---------- */
window.__track=track;
$('#bBack').onclick=function(){show('map');renderMap()};
$('#bTeacher').onclick=function(){var t=$('#teacher');t.hidden=!t.hidden;this.textContent=t.hidden?'Vue professeur':'Vue élève';renderTeacher()};
$('#bReset').onclick=function(){st=blank();save();renderMap()};
renderMap();
})();
