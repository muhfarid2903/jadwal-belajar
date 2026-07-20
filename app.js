/* Core app: schedule data, local state, rendering, and UI actions.
   No Firebase here — that lives in firebase-sync.js, which is loaded right
   after this file and shares this same top-level scope (both are classic,
   non-module <script> tags, so `let`/`const` here are visible there too).
   Curriculum data comes from curriculum.js, loaded before this file. */

/* ── DATA ── */
/* The weekly rotation is the study *source* for each day (which book,
   which class). What to study comes from the curriculum instead — the two
   are shown together on the daily card. */
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
    tab1:'Hari ini',tab2:'Minggu',tab3:'Kurikulum',tab4:'Riwayat',
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
    kurTitle:'Kurikulum SpJP',
    kurProgress:'Progress kurikulum',
    kurTopik:'topik',
    kurSelesai:'Semua topik kurikulum selesai 🎉',
    kurSub:'Tabel 2.3 · Standar Nasional Pendidikan Dokter SpJP',
    bab:'Bab',
    notifMsgs:['Selamat pagi! Waktunya siap-siap.','Jam kerja dimulai. Semangat!','Istirahat siang, waktunya tidur.','Waktunya belajar 45 menit wajib!','Sudah selesai belajar hari ini?'],
    notifTitle:'Jadwal Belajar',
  },
  en:{
    greet:['GOOD MORNING','GOOD AFTERNOON','GOOD AFTERNOON','GOOD EVENING'],
    streak:'DAY STREAK 🔥',
    record:'BEST',
    week:'this week',month:'this month',total:'total',
    tab1:'Today',tab2:'Week',tab3:'Curriculum',tab4:'History',
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
    kurTitle:'Cardiology Curriculum',
    kurProgress:'Curriculum progress',
    kurTopik:'topics',
    kurSelesai:'All curriculum topics complete 🎉',
    kurSub:'Table 2.3 · Indonesian Cardiology Specialist Standard',
    bab:'Ch.',
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
if(!STATE.topics)STATE.topics={};   // topicId -> date completed (added with the curriculum)
let L=STATE.lang||'id';

/* ── HELPERS ── */
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
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

/* ── CURRICULUM ── */
function topicDone(id){return !!STATE.topics[id];}
/* Counted against TOPICS rather than the raw keys so ids left over from an
   older curriculum revision can't inflate the total past 100%. */
function kurDone(){return TOPICS.filter(t=>topicDone(t.id)).length;}
function currentTopic(){return TOPICS.find(t=>!topicDone(t.id))||null;}
function topicOnDate(k){
  const id=Object.keys(STATE.topics).find(i=>STATE.topics[i]===k);
  return id?(TOPIC_BY_ID[id]||null):null;
}

/* ── RENDER ── */
function render(){
  const now=new Date(),dw=now.getDay(),key=tk(),done=!!STATE.data[key],src=MUST[dw];
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
  document.getElementById('tab-kur').textContent=tx.tab3;
  document.getElementById('tab-hist').textContent=tx.tab4;

  /* must-do card: curriculum topic (what) + weekly source (how/when) */
  document.getElementById('lbl-must45').textContent=tx.must45;
  const shown=done?topicOnDate(key):currentTopic();
  const mn=document.getElementById('mn'),mp=document.getElementById('mp');
  if(shown){
    mn.textContent=shown.t;
    // Chapters with no subtopics use the chapter name as the topic name, so
    // the pill drops the chapter title to avoid printing it twice.
    mp.textContent=(shown.t===shown.babT?tx.bab+' '+shown.bab:tx.bab+' '+shown.bab+' · '+shown.babT).toUpperCase();
    mp.style.background=shown.pal.bg;mp.style.color=shown.pal.tc;mp.style.display='';
  }else{
    /* Either the whole curriculum is finished, or the day was ticked off
       before the curriculum existed and carries no topic. */
    mn.textContent=kurDone()>=TOPICS.length?tx.kurSelesai:src.n;
    mp.textContent=src.t[L];mp.style.background=src.bg;mp.style.color=src.tc;mp.style.display='';
  }
  document.getElementById('msub').textContent=src.n+' · '+tx.msub;
  const mc=document.getElementById('mc');
  mc.className='mcard'+(done?' done':' ready');
  mc.setAttribute('aria-pressed',done?'true':'false');
  mc.setAttribute('aria-label',(shown?shown.t:src.n)+' — '+(done?tx.done:tx.notdone));
  document.getElementById('cb').className='cbtn'+(done?' on':'');

  /* progress */
  document.getElementById('lbl-progress').textContent=tx.progress;
  document.getElementById('pv').textContent=wc+'/7';
  document.getElementById('pf').style.width=Math.round(wc/7*100)+'%';

  const kd=kurDone(),kt=TOPICS.length;
  document.getElementById('lbl-kprogress').textContent=tx.kurProgress;
  document.getElementById('kpv').textContent=kd+'/'+kt;
  document.getElementById('kpf').style.width=Math.round(kd/kt*100)+'%';

  /* blocks */
  document.getElementById('lbl-blocks').textContent=tx.blocks;
  const ab=abk();
  document.getElementById('blks').innerHTML=BLK.map((b,i)=>{
    const isN=i===ab;
    return`<div class="blk${isN?' now':''}"><div class="bico">${b.e}</div><div class="bbd"><div class="bbt">${b.t}${isN?`<span class="nchip">${tx.now}</span>`:''}</div><div class="bbd2">${esc(b[L])}</div></div></div>`;
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
    const isDone=!!STATE.data[d.key],isT=d.key===key,tp=topicOnDate(d.key);
    const label=tp?tp.t:MUST[d.dw].n;
    return`<div class="ritem"><div class="rdot" style="background:${isDone?'#F5E642':'#2A2A2A'}"></div><div class="rdate">${DS[L][d.dw]}${isT?' •':''}</div><div class="rname">${esc(label)}</div><div class="rok" style="color:${isDone?'#F5E642':'#333'}">${isDone?'✓':'–'}</div></div>`;
  }).join('');

  /* history tab */
  document.getElementById('lbl-history').textContent=tx.history;
  let hr='';
  for(let i=0;i<14;i++){
    const d=new Date();d.setDate(d.getDate()-i);
    const k=fk(d),isDone=!!STATE.data[k],tp=topicOnDate(k);
    const label=tp?tp.t:MUST[d.getDay()].n;
    const dstr=d.toLocaleDateString(L==='id'?'id-ID':'en-GB',{day:'numeric',month:'short'}).toUpperCase();
    hr+=`<div class="ritem"><div class="rdot" style="background:${isDone?'#F5E642':'#2A2A2A'}"></div><div class="rdate">${dstr}</div><div class="rname">${esc(label)}</div><div class="rok" style="color:${isDone?'#F5E642':'#333'}">${isDone?'✓':'–'}</div></div>`;
  }
  document.getElementById('hlist').innerHTML=hr;

  renderKur();
}

/* Which chapter is expanded in the curriculum tab. UI-only, so it is kept
   out of STATE and never synced. Defaults to wherever you're up to. */
let openBab=null;
function renderKur(){
  const tx=T[L],cur=currentTopic();
  if(openBab===null)openBab=cur?cur.bab:1;

  document.getElementById('lbl-kur').textContent=tx.kurTitle;
  document.getElementById('kur-sub').textContent=tx.kurSub;
  const kd=kurDone(),kt=TOPICS.length;
  document.getElementById('kur-count').textContent=kd+'/'+kt+' '+tx.kurTopik;

  document.getElementById('kurlist').innerHTML=KURIKULUM.map(bab=>{
    const dn=bab.items.filter(it=>topicDone(it.id)).length,tot=bab.items.length;
    const open=openBab===bab.n,full=dn===tot;

    // A chapter with a single topic named after the chapter would print the
    // same text twice (header + row), so it collapses into one tickable line.
    if(tot===1&&bab.items[0].t===bab.t){
      const it=bab.items[0],isDone=topicDone(it.id),isCur=cur&&cur.id===it.id;
      return`<div class="bab bsolo${isDone?' bsdone':''}${isCur?' bcur':''}">
        <button class="babh" aria-pressed="${isDone?'true':'false'}" onclick="toggleTopic('${it.id}')">
          <span class="babn${isDone?' bfull':''}">${String(bab.n).padStart(2,'0')}</span>
          <span class="babt">${esc(bab.t)}</span>
          <span class="tbox${isDone?' on':''}"><svg width="12" height="12" viewBox="0 0 22 22" fill="none"><path d="M4 11L9 16.5L18 5.5" stroke="#111" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
        </button>
      </div>`;
    }

    const rows=open?bab.items.map(it=>{
      const isDone=topicDone(it.id),isCur=cur&&cur.id===it.id;
      return`<div class="titem${isDone?' tdone':''}${isCur?' tcur':''}" role="button" tabindex="0"
        aria-pressed="${isDone?'true':'false'}"
        onclick="toggleTopic('${it.id}')"
        onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();toggleTopic('${it.id}');}">
        <div class="tbox${isDone?' on':''}"><svg width="12" height="12" viewBox="0 0 22 22" fill="none"><path d="M4 11L9 16.5L18 5.5" stroke="#111" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
        <div class="tname">${esc(it.t)}</div>
      </div>`;
    }).join(''):'';
    return`<div class="bab${open?' bopen':''}">
      <button class="babh" onclick="toggleBab(${bab.n})" aria-expanded="${open?'true':'false'}">
        <span class="babn${full?' bfull':''}">${String(bab.n).padStart(2,'0')}</span>
        <span class="babt">${esc(bab.t)}</span>
        <span class="babc${full?' bfull':''}">${dn}/${tot}</span>
        <span class="babx">${open?'▾':'▸'}</span>
      </button>
      ${open?`<div class="babb">${rows}</div>`:''}
    </div>`;
  }).join('');
}

/* ── ACTIONS ── */
function toggleMust(){
  const k=tk();
  if(STATE.data[k]){
    delete STATE.data[k];
    const prev=topicOnDate(k);
    if(prev)delete STATE.topics[prev.id];
  }else{
    STATE.data[k]=true;
    const cur=currentTopic();
    if(cur)STATE.topics[cur.id]=k;
  }
  save();render();
}
/* Ticking a topic here records the topic only — it deliberately does not
   touch the daily streak, which belongs to the 45-minute ritual. */
function toggleTopic(id){
  if(STATE.topics[id])delete STATE.topics[id];
  else STATE.topics[id]=tk();
  save();render();
}
function toggleBab(n){
  openBab=(openBab===n)?null:n;
  renderKur();
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
