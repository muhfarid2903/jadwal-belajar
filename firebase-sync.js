/* Firebase: init, Google sign-in, Firestore sync, and push notification
   registration. Loaded after app.js and relies on its globals (STATE, L,
   render, save, saveLocal, T, ...). */

const FB_CONFIG={
  apiKey:"AIzaSyB3Gu4o9BiL3i9Gi9dLGvGF0yxcCmXXp80",
  authDomain:"jadwal-belajar-11785.firebaseapp.com",
  projectId:"jadwal-belajar-11785",
  storageBucket:"jadwal-belajar-11785.firebasestorage.app",
  messagingSenderId:"899989543339",
  appId:"1:899989543339:web:c81bc363fb3d8501e01aee"
};
const VAPID_KEY="BLK0sgKT9A9Ub3wRDyFUI84mMLISczpI7aThvzTVWBVGXi_HbG8yb1dxDO1g-tzhrN-UlHYW68o_SgETA9gXF-s";
let fbMessaging=null,fbAuth=null,fbDb=null;
try{
  firebase.initializeApp(FB_CONFIG);
  fbMessaging=firebase.messaging();
  fbAuth=firebase.auth();
  fbDb=firebase.firestore();
}catch(e){console.warn('Firebase init:',e);}

/* ── AUTH + SYNC ── */
let currentUser=null,fsUnsub=null,lastPushed=null;

function doAuth(){
  if(!fbAuth){alert('Firebase belum ter-load.');return;}
  if(currentUser){
    if(confirm(L==='id'?'Keluar dari akun?':'Sign out?'))fbAuth.signOut();
  }else{
    const p=new firebase.auth.GoogleAuthProvider();
    fbAuth.signInWithPopup(p).catch(e=>{
      if(e.code==='auth/popup-blocked'||e.code==='auth/operation-not-supported-in-this-environment'){
        fbAuth.signInWithRedirect(p);
      }else alert('Sign in error: '+e.message);
    });
  }
}

function renderAuth(){
  const btn=document.getElementById('authbtn'),av=document.getElementById('auth-av'),tx=document.getElementById('auth-tx');
  if(currentUser){
    btn.classList.add('signed');
    tx.textContent=(currentUser.displayName||currentUser.email||'').toUpperCase();
    if(currentUser.photoURL){av.style.backgroundImage='url('+currentUser.photoURL+')';av.textContent='';}
    else{av.style.backgroundImage='';av.textContent=(currentUser.displayName||currentUser.email||'?').charAt(0).toUpperCase();}
  }else{
    btn.classList.remove('signed');
    tx.textContent=L==='id'?'MASUK':'SIGN IN';
    av.style.backgroundImage='';av.textContent='?';
  }
}

function cloudSave(){
  if(!currentUser||!fbDb)return;
  const payload={data:STATE.data||{},topics:STATE.topics||{},terms:STATE.terms||{},lang:STATE.lang||'id'};
  // Remembered so the snapshot listener can recognize this write's own echo
  // by content instead of a one-shot "skip next" flag, which could get
  // consumed by the wrong event (and mask a real remote change) whenever
  // Firestore fires more than one snapshot per write or writes overlap.
  lastPushed=JSON.stringify(payload);
  fbDb.collection('users').doc(currentUser.uid).set({
    ...payload,
    updatedAt:firebase.firestore.FieldValue.serverTimestamp()
  }).catch(e=>console.warn('cloudSave:',e));
}

let firstSync=true;
function startSync(){
  if(!currentUser||!fbDb)return;
  if(fsUnsub)fsUnsub();
  firstSync=true;
  const ref=fbDb.collection('users').doc(currentUser.uid);
  fsUnsub=ref.onSnapshot(snap=>{
    if(!snap.exists){
      firstSync=false;cloudSave();return;
    }
    const d=snap.data();
    const sData=d.data||{};
    const sTopics=d.topics||{};
    const sTerms=d.terms||{};
    const sLang=d.lang||'id';

    if(JSON.stringify({data:sData,topics:sTopics,terms:sTerms,lang:sLang})===lastPushed)return;

    if(firstSync){
      firstSync=false;
      const lData=STATE.data||{},lTopics=STATE.topics||{},lTerms=STATE.terms||{};
      const newDays=Object.keys(lData).some(k=>!(k in sData));
      const newTopics=Object.keys(lTopics).some(k=>!(k in sTopics));
      const newTerms=Object.keys(lTerms).some(k=>!(k in sTerms));
      // Anything ticked off on this device while signed out would be lost by
      // taking the cloud copy wholesale, so on the first snapshot the two are
      // unioned and the result pushed back up.
      if(newDays||newTopics||newTerms){
        STATE.data={...sData,...lData};
        STATE.topics={...sTopics,...lTopics};
        STATE.terms={...sTerms,...lTerms};
        STATE.lang=sLang;L=sLang;
        saveLocal();render();renderAuth();
        cloudSave();
        return;
      }
    }
    STATE.data=sData;
    STATE.topics=sTopics;
    STATE.terms=sTerms;
    STATE.lang=sLang;L=sLang;
    saveLocal();render();renderAuth();
  },e=>console.warn('onSnapshot:',e));
}

function stopSync(){if(fsUnsub){fsUnsub();fsUnsub=null;}}

if(fbAuth){
  fbAuth.onAuthStateChanged(u=>{
    currentUser=u;
    renderAuth();
    if(u){
      // The local cache may still belong to a different Google account that
      // was signed in earlier on this device. Merging it into this account's
      // cloud doc would leak that other account's history in, so drop it
      // first whenever the owning uid doesn't match.
      if(STATE.uid&&STATE.uid!==u.uid){
        STATE.data={};STATE.topics={};STATE.terms={};
        saveLocal();render();
      }
      STATE.uid=u.uid;saveLocal();
      startSync();
    }else{
      stopSync();
    }
  });
  fbAuth.getRedirectResult().catch(e=>console.warn('redirect:',e));
}

function saveToken(tok){
  STATE.fcmToken=tok;saveLocal();
  if(!currentUser||!fbDb){alert(L==='id'?'Firebase belum siap. Coba lagi.':'Firebase not ready. Try again.');return;}
  fbDb.collection('fcmTokens').doc(tok).set({
    token:tok,
    uid:currentUser.uid,
    ua:navigator.userAgent,
    updatedAt:firebase.firestore.FieldValue.serverTimestamp()
  },{merge:true}).then(()=>{
    render();
    alert(L==='id'?'Pengingat aktif ✓ Perangkat ini terdaftar.':'Reminders active ✓ This device is registered.');
  }).catch(e=>alert('Error: '+e.message));
}

function doNotif(){
  if(!('Notification' in window)){alert(L==='id'?'Browser tidak mendukung notifikasi.':'Your browser does not support notifications.');return;}
  if(location.protocol==='file:'){alert(L==='id'?'Buka lewat http:// atau https://, bukan file://':'Open via http:// or https://, not file://');return;}
  if(!currentUser){alert(L==='id'?'Masuk dulu dengan Google agar pengingat bisa dikirim ke perangkat ini.':'Sign in with Google first so reminders can reach this device.');return;}
  Notification.requestPermission().then(p=>{
    if(p!=='granted'){
      if(p==='denied')alert(L==='id'?'Izin notifikasi ditolak. Aktifkan lewat pengaturan browser/situs untuk memakai pengingat.':'Notification permission denied. Enable it in your browser/site settings to use reminders.');
      return;
    }
    render();
    if(!fbMessaging){alert('Firebase belum ter-load. Refresh halaman.');return;}
    navigator.serviceWorker.register('sw.js').then(reg=>{
      return fbMessaging.getToken({vapidKey:VAPID_KEY,serviceWorkerRegistration:reg});
    }).then(tok=>{
      if(tok)saveToken(tok);
      else alert(L==='id'?'Gagal dapat token.':'Failed to get token.');
    }).catch(err=>{alert('Error: '+err.message);});
  });
}

if('serviceWorker' in navigator && location.protocol!=='file:'){
  window.addEventListener('load',()=>{
    navigator.serviceWorker.register('sw.js').catch(()=>{});
  });
}
render();
setInterval(render,60000);
