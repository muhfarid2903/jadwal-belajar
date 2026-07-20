/* Kurikulum SpJP — Tabel 2.3 "Daftar Kompetensi Masalah/Penyakit
   Kardiovaskular Dokter SpJP", dari Standar Nasional Pendidikan Dokter
   Spesialis Jantung dan Pembuluh Darah (Kolegium IPJPDI / PERKI, 2018).

   Struktur: 39 bab, masing-masing berisi satu atau lebih topik (leaf).
   Bab tanpa subtopik di dokumen aslinya diwakili satu topik dengan id
   sama dengan nomor babnya.

   `id` mengikuti penomoran dokumen dan dipakai sebagai kunci penyimpanan
   progres, jadi JANGAN diubah setelah dipakai — mengubahnya membuat topik
   yang sudah dicentang terbaca sebagai topik baru yang belum selesai.

   Beberapa penyimpangan dari dokumen, semuanya disengaja:
   - Bab "Penyakit Jantung Iskemik" tercetak bernomor 1 di dokumen (jelas
     salah cetak, karena subtopiknya bernomor 12.x); di sini jadi 12.
   - Sub-bab 22.4 tercetak "Takiaritmia Supraventrikular" padahal isinya
     aritmia ventrikular dan 22.3 sudah memakai judul itu; di sini
     dikoreksi jadi "Takiaritmia Ventrikular".
   - Salah ketik hasil penataan huruf dirapikan ("pdkehamilan" ->
     "pada Kehamilan", "EdukasidanKonseling" -> "Edukasi dan Konseling",
     dst). Isi materi tidak diubah.
   - Fibrilasi Atrium memang muncul dua kali di dokumen (22.3 dan 22.5);
     keduanya dipertahankan apa adanya. */

const PAL=[
  {bg:'rgba(245,166,35,.18)',tc:'#F5A623'},
  {bg:'rgba(155,114,207,.18)',tc:'#B89EE8'},
  {bg:'rgba(232,83,58,.18)',tc:'#E8765A'},
  {bg:'rgba(91,141,239,.18)',tc:'#7AAAF5'},
  {bg:'rgba(78,205,196,.18)',tc:'#4ECDC4'},
  {bg:'rgba(245,230,66,.18)',tc:'#F5E642'}
];

const KURIKULUM=[
  {n:1,t:'Materi Teknik Elektrokardiografi',items:[
    {id:'1',t:'Materi Teknik Elektrokardiografi'}
  ]},
  {n:2,t:'Materi Teknik Ekokardiografi',items:[
    {id:'2',t:'Materi Teknik Ekokardiografi'}
  ]},
  {n:3,t:'Materi Teknik Uji Latih Jantung',items:[
    {id:'3',t:'Materi Teknik Uji Latih Jantung'}
  ]},
  {n:4,t:'Materi Kateterisasi Jantung dan Proteksi Radiasi',items:[
    {id:'4',t:'Materi Kateterisasi Jantung dan Proteksi Radiasi'}
  ]},
  {n:5,t:'Genetik Kardiovaskular',items:[
    {id:'5.1',t:'Kardiomiopati Hipertropik'},
    {id:'5.2',t:'Kardiomiopati Dilatasi'},
    {id:'5.3',t:'Sindroma terkait penyakit kardiovaskular (Marfan, Trisomi 13/18/21, DiGeorge, Rubella, Aortopati Familial, Ehler-Danlos, William, Noonan, Turner, Channelopathies, anomali Conotruncal)'},
    {id:'5.4',t:'Dislipidemia Familial, khususnya low density lipoprotein receptor'}
  ]},
  {n:6,t:'Farmakologi Klinik Kardiovaskular',items:[
    {id:'6.1',t:'Anti Aritmia'},
    {id:'6.2',t:'Lipid Lowering Agent'},
    {id:'6.3',t:'Anti Hipertensi'},
    {id:'6.4',t:'Obat Hipoglikemik Oral'},
    {id:'6.5',t:'Obat Gagal Jantung'},
    {id:'6.6',t:'Anti Platelet'},
    {id:'6.7',t:'Inotropik'},
    {id:'6.8',t:'Vasokonstriktor'},
    {id:'6.9',t:'Antikoagulan'},
    {id:'6.10',t:'Insulin'},
    {id:'6.11',t:'Fibrinolitik'},
    {id:'6.12',t:'Prinsip Farmakologi pada Usia Lanjut / Geriatrik'}
  ]},
  {n:7,t:'Pencegahan Penyakit Kardiovaskular',items:[
    {id:'7.1',t:'Faktor Risiko Kardiovaskular'},
    {id:'7.2',t:'Upaya Prevensi Primer dan Sekunder'}
  ]},
  {n:8,t:'Hipertensi',items:[
    {id:'8.1',t:'Hipertensi Esensial'},
    {id:'8.2',t:'Hipertensi dengan Kerusakan Target Organ'},
    {id:'8.3',t:'Hipertensi Sekunder'}
  ]},
  {n:9,t:'Penyakit Jantung dengan Kelainan Lain',items:[
    {id:'9.1',t:'Penyakit Jantung dengan Hiperglikemia'},
    {id:'9.2',t:'Penyakit Jantung dengan Hipertiroidisme'},
    {id:'9.3',t:'Penyakit Jantung dengan Gangguan Metabolisme (Lipid, Karbohidrat, Kalsium, Elektrolit)'},
    {id:'9.4',t:'Penyakit Jantung dengan Kelainan Autoimun'},
    {id:'9.5',t:'Sindroma Metabolik'},
    {id:'9.6',t:'Sindroma Kardio-Renal'},
    {id:'9.7',t:'Nefropatia Terinduksi oleh Kontras'}
  ]},
  {n:10,t:'Sindroma Koroner Akut dengan/tanpa Komplikasi',items:[
    {id:'10.1',t:'Angina Pektoris Tidak Stabil'},
    {id:'10.2',t:'Non ST Elevasi Myocardial Infark (NSTEMI)'},
    {id:'10.3',t:'ST Elevasi Myocardial Infark (STEMI)'}
  ]},
  {n:11,t:'Tatalaksana Pasca Sindroma Koroner Akut',items:[
    {id:'11.1',t:'Tatalaksana Pasca STEMI'},
    {id:'11.2',t:'Tatalaksana Pasca Non-STEMI'},
    {id:'11.3',t:'Tatalaksana Pasien tanpa Revaskularisasi'},
    {id:'11.4',t:'Tatalaksana Pasien Pasca Revaskularisasi'}
  ]},
  {n:12,t:'Penyakit Jantung Iskemik (PJK)',items:[
    {id:'12.1',t:'Penyakit Jantung Iskemik Kronik'},
    {id:'12.2',t:'Angina Pektoris Stabil'}
  ]},
  {n:13,t:'Penyakit Miokardial',items:[
    {id:'13.1',t:'Kardiomiopati'},
    {id:'13.2',t:'Miokarditis'}
  ]},
  {n:14,t:'Penyakit Perikardial',items:[
    {id:'14.1',t:'Perikarditis Akut'},
    {id:'14.2',t:'Perikarditis Kronik'},
    {id:'14.3',t:'Perikarditis Konstriktif dan Restriktif'},
    {id:'14.4',t:'Perikardial Effusion dan Tamponade Jantung'}
  ]},
  {n:15,t:'Tumor Jantung',items:[
    {id:'15.1',t:'Tumor Jantung Primer'},
    {id:'15.2',t:'Tumor Jantung Metastasis'}
  ]},
  {n:16,t:'Kehamilan pada Penyakit Jantung',items:[
    {id:'16.1',t:'Hipertensi pada Kehamilan'},
    {id:'16.2',t:'Kelainan Katup Jantung pada Kehamilan'},
    {id:'16.3',t:'Kelainan Kongenital pada Kehamilan'},
    {id:'16.4',t:'Penyakit Jantung Koroner pada Kehamilan'},
    {id:'16.5',t:'Kardiomiopati pada Kehamilan'},
    {id:'16.6',t:'Aritmia pada Kehamilan'},
    {id:'16.7',t:'Penyakit Aorta / Pembuluh Darah Perifer pada Kehamilan'}
  ]},
  {n:17,t:'Demam Rematik dan Penyakit Katup Jantung Rematik',items:[
    {id:'17.1',t:'Demam Rematik Akut dan Reaktivasi'},
    {id:'17.2',t:'Obstruksi / Regurgitasi Katup akibat Rematik'}
  ]},
  {n:18,t:'Endokarditis Infektif',items:[
    {id:'18',t:'Endokarditis Infektif'}
  ]},
  {n:19,t:'Gagal Jantung',items:[
    {id:'19.1',t:'Gagal Jantung Kronik'},
    {id:'19.2',t:'Gagal Jantung Akut'},
    {id:'19.3',t:'Gagal Jantung dengan Fraksi Ejeksi Rendah'},
    {id:'19.4',t:'Gagal Jantung dengan Fraksi Ejeksi Normal'}
  ]},
  {n:20,t:'Hipertensi Pulmoner',items:[
    {id:'20.1',t:'Hipertensi Pulmoner Idiopatik'},
    {id:'20.2',t:'Hipertensi Pulmoner Sekunder (disfungsi ventrikel kiri, kelainan paru, tromboemboli kronis)'}
  ]},
  {n:21,t:'Penyakit Jantung akibat Penyakit Autoimun',items:[
    {id:'21',t:'Penyakit Jantung akibat Penyakit Autoimun'}
  ]},
  {n:22,t:'Aritmia',items:[
    {id:'22.1',t:'Elektrofisiologi Dasar'},
    {id:'22.2.1',t:'Bradiaritmia: Disfungsi Nodus Sinus'},
    {id:'22.2.2',t:'Bradiaritmia: Blok Atrioventrikular'},
    {id:'22.3.1',t:'Takiaritmia Supraventrikular: Atrial Flutter'},
    {id:'22.3.2',t:'Takiaritmia Supraventrikular: Fibrilasi Atrium'},
    {id:'22.3.3',t:'Takiaritmia Supraventrikular: Takikardia Atrium'},
    {id:'22.3.4',t:'Takiaritmia Supraventrikular: Supraventricular Takikardia'},
    {id:'22.3.5',t:'Takiaritmia Supraventrikular: Junctional Tachycardia'},
    {id:'22.4.1',t:'Takiaritmia Ventrikular'},
    {id:'22.4.2',t:'Aritmia Ventrikular pada berbagai kondisi (Kardiomiopati, Kardiomiopati Non-Iskemik, Channelopathies, jantung struktur normal)'},
    {id:'22.5',t:'Fibrilasi Atrium'}
  ]},
  {n:23,t:'Tatalaksana Sinkop',items:[
    {id:'23',t:'Tatalaksana Sinkop'}
  ]},
  {n:24,t:'Kematian Jantung Mendadak (KJM) dan Resusitasi',items:[
    {id:'24',t:'Kematian Jantung Mendadak (KJM) dan Resusitasi'}
  ]},
  {n:25,t:'Penyakit Aorta dan Trauma Aorta',items:[
    {id:'25.1',t:'Penyakit Aorta Torakalis'},
    {id:'25.2',t:'Penyakit Aorta Abdominalis'},
    {id:'25.3',t:'Penyakit Aorta Torakoabdominalis'},
    {id:'25.4',t:'Penyakit Aorto-iliaka'}
  ]},
  {n:26,t:'Penyakit Arteri Perifer (mis. mikroangiopati diabetik)',items:[
    {id:'26.1',t:'Penyakit arteri cabang-cabang aorta (intra dan ekstrakranial) dan abdomen'},
    {id:'26.2',t:'Penyakit arteri ekstremitas atas dan bawah'}
  ]},
  {n:27,t:'Penyakit Vena Perifer (dalam, superfisial, perforator)',items:[
    {id:'27.1',t:'Penyakit Insufisiensi Vena Kronik'}
  ]},
  {n:28,t:'Penyakit Tromboembolik',items:[
    {id:'28.1',t:'Trombosis Vena Dalam'},
    {id:'28.2',t:'Obstruksi Vena Kronis di Vena Kava, Paru, Hepatika, Portal, Ekstra/Intrakranial, Ekstremitas'},
    {id:'28.3',t:'Emboli Paru Akut dan Kronik'},
    {id:'28.4',t:'Trombosis Katup Prostetik'}
  ]},
  {n:29,t:'Penyakit Limfe',items:[
    {id:'29.1',t:'Limfedema'},
    {id:'29.2',t:'Limfangitis'}
  ]},
  {n:30,t:'Kardiovaskular Akut',items:[
    {id:'30.1',t:'Nyeri Dada Akut'},
    {id:'30.2',t:'Sesak Napas Akut'},
    {id:'30.3',t:'Hipotensi dan Syok'},
    {id:'30.4',t:'Hipertensi Emergensi'}
  ]},
  {n:31,t:'Penggunaan Antiplatelet atau Antikoagulan',items:[
    {id:'31.1',t:'Indikasi penggunaan antiplatelet / antikoagulan di bidang kardiovaskular'},
    {id:'31.2',t:'Tata kelola penggunaan antiplatelet / antikoagulan bidang kardiovaskular'},
    {id:'31.3',t:'Mengatasi komplikasi perdarahan akibat penggunaan antiplatelet atau antikoagulan'}
  ]},
  {n:32,t:'Kardiologi Struktural dan Penyakit Jantung Bawaan (PJB)',items:[
    {id:'32.1.1',t:'PJB Asianotik: Atrial Septal Defect (ASD)'},
    {id:'32.1.2',t:'PJB Asianotik: Ventricular Septal Defect (VSD)'},
    {id:'32.1.3',t:'PJB Asianotik: Patent Ductus Arteriosus (PDA)'},
    {id:'32.1.4',t:'PJB Asianotik: Atrioventricular Septal Defect (AVSD)'},
    {id:'32.1.5',t:'PJB Asianotik Lainnya'},
    {id:'32.1.6',t:'PJB Asianotik: Coarctation Aorta (CoA)'},
    {id:'32.1.7',t:'PJB Asianotik: Sindroma Eisenmenger'},
    {id:'32.2.1',t:'PJB Sianotik: Tetralogy of Fallot (TOF)'},
    {id:'32.2.2',t:'PJB Sianotik: Transposition of the Great Arteries (TGA)'},
    {id:'32.2.3',t:"PJB Sianotik: Ebstein's Tricuspid Valve Anomaly"},
    {id:'32.2.4',t:'PJB Biru Kompleks'},
    {id:'32.3',t:'Spel Hipoksia'}
  ]},
  {n:33,t:'Masalah PJB pada Remaja & Dewasa',items:[
    {id:'33.1',t:'Komplikasi PJB pada usia remaja dan dewasa yang belum atau tidak dioperasi pada usia anak'},
    {id:'33.2',t:'Residua dan sequele pada PJB yang sudah dioperasi pada usia anak'},
    {id:'33.3',t:'Indikasi, kontraindikasi, dan waktu untuk dilakukan intervensi atau intervensi ulang'}
  ]},
  {n:34,t:'Sindroma Kardiorenal',items:[
    {id:'34.1',t:'Gangguan Renal akibat penyakit kardiovaskular'},
    {id:'34.2',t:'Prevensi Contrast-Induced Nephropathy'},
    {id:'34.3',t:'Acute Kidney Injury'},
    {id:'34.4',t:'Renal Replacement Therapy'}
  ]},
  {n:35,t:'Onkologi Kardiak',items:[
    {id:'35',t:'Onkologi Kardiak'}
  ]},
  {n:36,t:'Geriatrik Kardiovaskular',items:[
    {id:'36',t:'Geriatrik Kardiovaskular'}
  ]},
  {n:37,t:'Low Cardiac Output Syndrome',items:[
    {id:'37',t:'Low Cardiac Output Syndrome'}
  ]},
  {n:38,t:'Gangguan Keseimbangan Elektrolit, Asam Basa',items:[
    {id:'38',t:'Gangguan Keseimbangan Elektrolit, Asam Basa'}
  ]},
  {n:39,t:'Rehabilitasi Kardiak dan Fisiologi Latihan',items:[
    {id:'39.1.1',t:'Exercise Training and Physiology Application'},
    {id:'39.1.2',t:'Exercise Testing for Cardiac Rehabilitation (CR) Program'},
    {id:'39.1.3',t:'Exercise Prescription for Patients with Heart Disease'},
    {id:'39.1.4',t:'Exercise Prescription for Normal Patients and Those with Risk Factors'},
    {id:'39.2',t:'Penilaian dan stratifikasi risiko pasien untuk mengikuti Program CR'},
    {id:'39.3',t:'Edukasi dan Konseling'},
    {id:'39.4.1',t:'Supervisi Program Rehabilitasi Kardiak: Fase I'},
    {id:'39.4.2',t:'Supervisi Program Rehabilitasi Kardiak: Fase II'},
    {id:'39.4.3',t:'Supervisi Program Rehabilitasi Kardiak: Fase III'}
  ]}
];

/* Flat list of every topic, each carrying its chapter for display. */
const TOPICS=KURIKULUM.flatMap((bab,bi)=>
  bab.items.map(it=>({id:it.id,t:it.t,bab:bab.n,babT:bab.t,pal:PAL[bi%PAL.length]}))
);
const TOPIC_BY_ID=Object.fromEntries(TOPICS.map(t=>[t.id,t]));
