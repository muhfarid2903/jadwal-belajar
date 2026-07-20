/* Core app: schedule data, local state, rendering, and UI actions.
   No Firebase here — that lives in firebase-sync.js, which is loaded right
   after this file and shares this same top-level scope (both are classic,
   non-module <script> tags, so `let`/`const` here are visible there too). */

/* ── DATA ── */
const MUST={
  0:{n:'Dr. Yusuf Suseno',t:{id:'MENTORING',en:'MENTORING'},bg:'rgba(245,166,35,.18)',tc:'#F5A623'},
  1:{n:'Pathoma',t:{id:'PATOLOGI',en:'PATHOLOGY'},bg:'rgba(155,114,207,.18)',tc:'#B89EE8'},
  2:{n:'ACLS',t:{id:'KEGAWATAN',en:'EMERGENCY'},bg:'rgba(232,83,58,.18)',tc:'#E8765A'},
  3:{n:'Reading PPK',t:{id:'PANDUAN KLINIS',en:'CLINICAL GUIDE'},bg:'rgba(91,141,239,.18)',tc:'#7AAAF5'},
  4:{n:'Cardiology',t:{id:'KARDIOLOGI',en:'CARDIOLOGY'},bg:'rgba(232,83,58,.18)',tc:'#E8765A'},
  5:{n:'Ebook Reading',t:{id:'LITERASI',en:'LITERACY'},bg:'rgba(78,205,196,.18)',tc:'#4ECDC4'},
  6:{n:'Reading IPD',t:{id:'PENYAKIT DALAM',en:'INTERNAL MED'},bg:'rgba(91,141,239,.18)',tc:'#7AAAF5'}
};
const BLK=[
  {e:'☀️',t:'06.00–09.00',id:'Siap-siap, membaca, mandi, olahraga, sarapan',en:'Morning prep, reading, shower, exercise, breakfast'},
  {e:'💼',t:'09.00–12.00',id:'Kerja',en:'Work'},
  {e:'🛌',t:'12.00–15.00',id:'Tidur siang',en:'Afternoon nap'},
  {e:'📖',t:'15.00–18.00',id:'Olahraga, belajar 45 mnt wajib, ceklok',en:'Exercise, 45-min study, check out'},
  {e:'🌙',t:'18.00–24.00',id:'Membaca, nonton, tidur',en:'Reading, watching, sleep'}
];
const BH=[[6,9],[9,12],[12,15],[15,18],[18,24]];

const DN={id:['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'],en:['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']};
const DS={id:['MIN','SEN','SEL','RAB','KAM','JUM','SAB'],en:['SUN','MON','TUE','WED','THU','FRI','SAT']};

const T={
  id:{
    greet:['SELAMAT PAGI','SELAMAT SIANG','SELAMAT SORE','SELAMAT MALAM'],
    streak:'HARI 🔥',
    record:'REKOR',
    week:'minggu ini',month:'bulan ini',total:'total',
    tab1:'Hari ini',tab2:'Minggu',tab3:'Riwayat',
    must45:'45 menit wajib',
    msub:'45 mnt · 15.00–18.00',
    progress:'Progress minggu ini',
    blocks:'Blok waktu',
    thisweek:'Minggu ini',
    history:'14 hari terakhir',
    notifOn:'Aktifkan pengingat harian',
    notifActive:'Pengingat aktif ✓',
    done:'Selesai',notdone:'Belum',
    now:'SEKARANG',
    today:'hari ini',
    notifMsgs:['Selamat pagi! Waktunya siap-siap.','Jam kerja dimulai. Semangat!','Istirahat siang, waktunya tidur.','Waktunya belajar 45 menit wajib!','Sudah selesai belajar hari ini?'],
    notifTitle:'Jadwal Belajar',
  },
  en:{
    greet:['GOOD MORNING','GOOD AFTERNOON','GOOD AFTERNOON','GOOD EVENING'],
    streak:'DAY STREAK 🔥',
    record:'BEST',
    week:'this week',month:'this month',total:'total',
    tab1:'Today',tab2:'Week',tab3:'History',
    must45:'45-min must-do',
    msub:'45 min · 15:00–18:00',
    progress:'This week\'s progress',
    blocks:'Time blocks',
    thisweek:'This week',
    history:'Last 14 days',
    notifOn:'Enable daily reminders',
    notifActive:'Reminders active ✓',
    done:'Done',notdone:'Pending',
    now:'NOW',
    today:'today',
    notifMsgs:['Good morning! Time to get ready.','Work time. Let\'s go!','Afternoon rest, time to nap.','Time for your 45-min study!','Did you finish studying today?'],
    notifTitle:'Study Schedule',
  }
};

/* ── STATE ── */
function fk(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function tk(){return fk(new Date())}
function load(){try{const r=localStorage.getItem('jadwal-v3');return r?JSON.parse(r):{data:{},lang:'id'};}catch(e){return {data:{},lang:'id'};}}
function saveLocal(){try{localStorage.setItem('jadwal-v3',JSON.stringify(STATE));}catch(e){}}
function save(){saveLocal();cloudSave();}

let STATE=load();
if(!STATE.data)STATE={data:{},lang:'id'};
let L=STATE.lang||'id';

/* ── HELPERS ── */
function abk(){const h=new Date().getHours()+new Date().getMinutes()/60;return BH.findIndex(([s,e])=>h>=s&&h<e);}
function wdays(){const t=new Date(),dw=t.getDay(),a=[];for(let i=0;i<7;i++){const d=new Date(t);d.setDate(t.getDate()-dw+i);a.push({key:fk(d),dw:i});}return a;}
function streak(){let s=0,d=new Date();for(let i=0;i<90;i++){if(STATE.data[fk(d)])s++;else if(i>0)break;d.setDate(d.getDate()-1);}return s;}
function bestStreak(){
  const keys=Object.keys(STATE.data).filter(k=>STATE.data[k]).sort();
  if(!keys.length)return 0;
  let best=1,run=1;
  for(let i=1;i<keys.length;i++){
    const diff=Math.round((new Date(keys[i]+'T00:00:00')-new Date(keys[i-1]+'T00:00:00'))/86400000);
    if(diff===1){run++;if(run>best)best=run;}
    else if(diff>1){run=1;}
  }
  return best;
}
function cMonth(){const n=new Date(),d=new Date(n.getFullYear(),n.getMonth(),1);let c=0;while(d.getMonth()===n.getMonth()&&d<=n){if(STATE.data[fk(d)])c++;d.setDate(d.getDate()+1);}return c;}
function cTotal(){return Object.keys(STATE.data).filter(k=>STATE.data[k]).length;}
function greet(){const h=new Date().getHours();const i=h<11?0:h<14?1:h<18?2:3;return T[L].greet[i];}

/* ── RENDER ── */
function render(){
  const now=new Date(),dw=now.getDay(),key=tk(),done=!!STATE.data[key],mu=MUST[dw];
  const tx=T[L];

  /* header */
  document.getElementById('greet').textContent=greet();
  document.getElementById('dayname').textContent=DN[L][dw];
  document.getElementById('datestr').textContent=now.toLocaleDateString(L==='id'?'id-ID':'en-GB',{day:'numeric',month:'long',year:'numeric'}).toUpperCase();
  document.getElementById('stn').textContent=streak();
  document.getElementById('slbl-streak').textContent=tx.streak;
  document.getElementById('srec').textContent=tx.record+' '+bestStreak();

  /* lang toggle */
  const ltId=document.getElementById('lt-id'),ltEn=document.getElementById('lt-en');
  ltId.className='ltab'+(L==='id'?' on':'');ltId.setAttribute('aria-pressed',L==='id'?'true':'false');
  ltEn.className='ltab'+(L==='en'?' on':'');ltEn.setAttribute('aria-pressed',L==='en'?'true':'false');

  /* stats labels */
  document.getElementById('lbl-week').textContent=tx.week;
  document.getElementById('lbl-month').textContent=tx.month;
  document.getElementById('lbl-total').textContent=tx.total;

  /* stats values */
  const wd=wdays(),wc=wd.filter(d=>STATE.data[d.key]).length;
  document.getElementById('sw').textContent=wc;
  document.getElementById('sm').textContent=cMonth();
  document.getElementById('stot').textContent=cTotal();

  /* tabs */
  document.getElementById('tab-today').textContent=tx.tab1;
  document.getElementById('tab-week').textContent=tx.tab2;
  document.getElementById('tab-hist').textContent=tx.tab3;

  /* must */
  document.getElementById('lbl-must45').textContent=tx.must45;
  document.getElementById('mn').textContent=mu.n;
  document.getElementById('msub').textContent=tx.msub;
  const mp=document.getElementById('mp');mp.textContent=mu.t[L];mp.style.background=mu.bg;mp.style.color=mu.tc;
  const mc=document.getElementById('mc');
  mc.className='mcard'+(done?' done':' ready');
  mc.setAttribute('aria-pressed',done?'true':'false');
  mc.setAttribute('aria-label',mu.n+' — '+(done?tx.done:tx.notdone));
  document.getElementById('cb').className='cbtn'+(done?' on':'');

  /* progress */
  document.getElementById('lbl-progress').textContent=tx.progress;
  document.getElementById('pv').textContent=wc+'/7';
  document.getElementById('pf').style.width=Math.round(wc/7*100)+'%';

  /* blocks */
  document.getElementById('lbl-blocks').textContent=tx.blocks;
  const ab=abk();
  document.getElementById('blks').innerHTML=BLK.map((b,i)=>{
    const isN=i===ab;
    return`<div class="blk${isN?' now':''}"><div class="bico">${b.e}</div><div class="bbd"><div class="bbt">${b.t}${isN?`<span class="nchip">${tx.now}</span>`:''}</div><div class="bbd2">${b[L]}</div></div></div>`;
  }).join('');

  /* notif */
  document.getElementById('nt').textContent=
    (typeof Notification!=='undefined'&&Notification.permission==='granted')?tx.notifActive:tx.notifOn;

  /* week tab */
  document.getElementById('lbl-thisweek').textContent=tx.thisweek;
  document.getElementById('wr').innerHTML=wd.map(d=>{
    const isT=d.key===key,isDone=!!STATE.data[d.key];
    return`<div class="wd${isT?' today':isDone?' donew':''}"><span class="wdl">${DS[L][d.dw]}</span><div class="wdot"></div></div>`;
  }).join('');
  document.getElementById('wlist').innerHTML=wd.map(d=>{
    const mu2=MUST[d.dw],isDone=!!STATE.data[d.key],isT=d.key===key;
    return`<div class="ritem"><div class="rdot" style="background:${isDone?'#F5E642':'#2A2A2A'}"></div><div class="rdate">${DS[L][d.dw]}${isT?' •':''}</div><div class="rname">${mu2.n}</div><div class="rok" style="color:${isDone?'#F5E642':'#333'}">${isDone?'✓':'–'}</div></div>`;
  }).join('');

  /* history tab */
  document.getElementById('lbl-history').textContent=tx.history;
  let hr='';
  for(let i=0;i<14;i++){
    const d=new Date();d.setDate(d.getDate()-i);
    const k=fk(d),mu2=MUST[d.getDay()],isDone=!!STATE.data[k];
    const dstr=d.toLocaleDateString(L==='id'?'id-ID':'en-GB',{day:'numeric',month:'short'}).toUpperCase();
    hr+=`<div class="ritem"><div class="rdot" style="background:${isDone?'#F5E642':'#2A2A2A'}"></div><div class="rdate">${dstr}</div><div class="rname">${mu2.n}</div><div class="rok" style="color:${isDone?'#F5E642':'#333'}">${isDone?'✓':'–'}</div></div>`;
  }
  document.getElementById('hlist').innerHTML=hr;
}

/* ── ACTIONS ── */
function toggleMust(){
  const k=tk();if(STATE.data[k])delete STATE.data[k];else STATE.data[k]=true;
  save();render();
}
function showTab(id,el){
  document.querySelectorAll('.sec').forEach(s=>s.classList.remove('show'));
  document.getElementById('sec-'+id).classList.add('show');
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('on'));
  el.classList.add('on');
}
function setLang(l){
  L=l;STATE.lang=l;save();render();renderAuth();
}
