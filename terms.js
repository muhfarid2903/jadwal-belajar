/* Istilah medis harian — satu istilah per hari, diambil dari semua sistem.

   Struktur: kelompok (sistem organ / bidang) berisi daftar istilah.
   Tiap istilah: `t` istilah, `a` sinonim atau padanan yang lazim dipakai,
   `d` definisi singkat (id/en).

   `id` dipakai sebagai kunci penyimpanan progres, jadi JANGAN diubah
   setelah dipakai — mengubahnya membuat istilah yang sudah dicentang
   terbaca sebagai istilah baru yang belum dipelajari. Menambah istilah
   baru di akhir kelompok aman.

   PAL berasal dari curriculum.js, yang dimuat sebelum file ini. */

const ISTILAH=[
  {n:1,t:{id:'Tanda & Gejala Umum',en:'General Signs & Symptoms'},items:[
    {id:'t1.1',t:'Ikterus',a:'jaundice, sakit kuning',d:{
      id:'Warna kuning pada kulit, sklera, dan mukosa karena bilirubin menumpuk di jaringan; baru terlihat bila bilirubin serum sekitar >2–3 mg/dL, dan paling awal tampak di sklera.',
      en:'Yellow discoloration of skin, sclerae, and mucosa from bilirubin deposition; visible once serum bilirubin exceeds roughly 2–3 mg/dL, earliest in the sclerae.'}},
    {id:'t1.2',t:'Sianosis',a:'cyanosis',d:{
      id:'Warna kebiruan pada kulit dan mukosa akibat hemoglobin terdeoksigenasi >5 g/dL; sentral bila tampak di lidah dan bibir, perifer bila hanya di ujung ekstremitas.',
      en:'Bluish discoloration of skin and mucosa from >5 g/dL deoxygenated haemoglobin; central when the tongue and lips are involved, peripheral when limited to the extremities.'}},
    {id:'t1.3',t:'Edema',a:'bengkak',d:{
      id:'Penumpukan cairan berlebih di ruang interstisial; disebut pitting bila jejak jari bertahan setelah ditekan, dan anasarka bila menyeluruh ke seluruh tubuh.',
      en:'Excess fluid accumulation in the interstitial space; called pitting when a finger indentation persists, and anasarca when generalized.'}},
    {id:'t1.4',t:'Kakeksia',a:'cachexia',d:{
      id:'Sindrom kehilangan berat badan berat disertai hilangnya massa otot yang tidak sepenuhnya pulih dengan nutrisi, khas pada keganasan, gagal jantung, dan infeksi kronik.',
      en:'A syndrome of severe weight loss with muscle wasting not fully reversed by nutrition, typical of malignancy, heart failure, and chronic infection.'}},
    {id:'t1.5',t:'Febris',a:'demam, pyrexia',d:{
      id:'Suhu tubuh di atas rentang normal harian (umumnya >38 °C) karena set point hipotalamus dinaikkan oleh pirogen — berbeda dari hipertermia yang set point-nya normal.',
      en:'Body temperature above the normal daily range (usually >38 °C) because pyrogens raise the hypothalamic set point — unlike hyperthermia, where the set point is normal.'}},
    {id:'t1.6',t:'Sinkop',a:'syncope, pingsan',d:{
      id:'Kehilangan kesadaran sesaat akibat hipoperfusi serebral global, timbul mendadak, singkat, dan pulih sendiri secara sempurna tanpa tindakan.',
      en:'Transient loss of consciousness from global cerebral hypoperfusion, with rapid onset, short duration, and complete spontaneous recovery.'}},
    {id:'t1.7',t:'Malaise',a:'lemas, tidak enak badan',d:{
      id:'Rasa tidak enak badan menyeluruh, lemas, dan tidak bugar yang sulit ditunjuk lokasinya; gejala awal yang tidak khas pada banyak infeksi dan penyakit sistemik.',
      en:'A generalized feeling of discomfort, weakness, and being unwell that cannot be localized; a nonspecific early symptom of many infections and systemic diseases.'}},
    {id:'t1.8',t:'Diaforesis',a:'keringat berlebih, diaphoresis',d:{
      id:'Keringat berlebihan di luar kebutuhan termoregulasi, sering menyertai aktivasi simpatis pada infark miokard, hipoglikemia, atau syok.',
      en:'Excessive sweating beyond thermoregulatory need, often accompanying sympathetic activation in myocardial infarction, hypoglycaemia, or shock.'}},
    {id:'t1.9',t:'Prodromal',a:'fase prodromal',d:{
      id:'Fase awal penyakit dengan gejala samar yang mendahului tanda khasnya, misalnya demam dan nyeri otot sebelum ruam campak muncul.',
      en:'The early phase of an illness with vague symptoms preceding its characteristic features, such as fever and myalgia before the measles rash.'}},
    {id:'t1.10',t:'Anoreksia',a:'hilang nafsu makan',d:{
      id:'Hilangnya nafsu makan sebagai gejala — berbeda dari anoreksia nervosa, yang merupakan gangguan makan dengan pembatasan makan yang disengaja.',
      en:'Loss of appetite as a symptom — distinct from anorexia nervosa, an eating disorder involving deliberate food restriction.'}}
  ]},

  {n:2,t:{id:'Konsep Klinis & Epidemiologi',en:'Clinical Concepts & Epidemiology'},items:[
    {id:'t2.1',t:'Idiopatik',a:'idiopathic',d:{
      id:'Penyakit yang penyebabnya tidak diketahui meski sudah dicari; berbeda dari esensial (dipakai untuk hipertensi primer) dan kriptogenik (sumbernya tak terlacak).',
      en:'A disease whose cause remains unknown despite investigation; distinct from essential (used for primary hypertension) and cryptogenic (source untraceable).'}},
    {id:'t2.2',t:'Iatrogenik',a:'iatrogenic',d:{
      id:'Kelainan yang timbul akibat tindakan medis itu sendiri, misalnya pneumotoraks setelah pemasangan kateter vena sentral.',
      en:'A condition caused by medical intervention itself, such as pneumothorax after central venous catheter insertion.'}},
    {id:'t2.3',t:'Nosokomial',a:'infeksi terkait layanan kesehatan, HAI',d:{
      id:'Infeksi yang didapat selama perawatan di fasilitas kesehatan dan tidak sedang dalam masa inkubasi saat pasien masuk; lazimnya muncul >48 jam setelah admisi.',
      en:'An infection acquired during care in a health facility and not incubating on admission; typically appearing >48 hours after admission.'}},
    {id:'t2.4',t:'Patognomonik',a:'pathognomonic',d:{
      id:'Tanda yang bila ditemukan langsung memastikan satu diagnosis, misalnya bercak Koplik pada campak; sangat spesifik meski sering tidak sensitif.',
      en:'A finding that by itself establishes one diagnosis, such as Koplik spots in measles; highly specific though often not sensitive.'}},
    {id:'t2.5',t:'Eksaserbasi',a:'exacerbation, kekambuhan akut',d:{
      id:'Perburukan akut gejala pada penyakit kronik yang melebihi variasi hariannya, misalnya eksaserbasi akut PPOK atau asma.',
      en:'An acute worsening of symptoms in a chronic disease beyond its normal day-to-day variation, such as an acute COPD or asthma exacerbation.'}},
    {id:'t2.6',t:'Remisi',a:'remission',d:{
      id:'Berkurang atau hilangnya tanda dan gejala penyakit, sebagian atau seluruhnya, tanpa berarti penyakitnya sudah sembuh permanen.',
      en:'Partial or complete reduction of the signs and symptoms of a disease, without implying permanent cure.'}},
    {id:'t2.7',t:'Sekuele',a:'sequela, gejala sisa',d:{
      id:'Kelainan menetap yang tertinggal setelah penyakit akut selesai, misalnya hemiparesis pasca stroke atau penyakit katup pasca demam rematik.',
      en:'A lasting abnormality remaining after an acute illness resolves, such as post-stroke hemiparesis or valve disease after rheumatic fever.'}},
    {id:'t2.8',t:'Komorbiditas',a:'comorbidity, penyakit penyerta',d:{
      id:'Penyakit lain yang menyertai penyakit utama pada pasien yang sama dan memengaruhi tatalaksana serta prognosisnya.',
      en:'An additional disease coexisting with the primary condition in the same patient, affecting management and prognosis.'}},
    {id:'t2.9',t:'Sensitivitas & Spesifisitas',a:'sensitivity, specificity',d:{
      id:'Sensitivitas adalah kemampuan uji mendeteksi yang benar sakit (sedikit negatif palsu); spesifisitas adalah kemampuannya menyingkirkan yang sehat (sedikit positif palsu).',
      en:'Sensitivity is a test\'s ability to detect those who truly have the disease (few false negatives); specificity is its ability to exclude those who do not (few false positives).'}},
    {id:'t2.10',t:'Insidens & Prevalensi',a:'incidence, prevalence',d:{
      id:'Insidens adalah jumlah kasus baru dalam periode tertentu; prevalensi adalah jumlah seluruh kasus, lama dan baru, pada satu titik waktu.',
      en:'Incidence is the number of new cases over a period; prevalence is the total number of existing cases, old and new, at a point in time.'}}
  ]},

  {n:3,t:{id:'Kardiovaskular',en:'Cardiovascular'},items:[
    {id:'t3.1',t:'Ortopnea',a:'orthopnoea',d:{
      id:'Sesak napas yang timbul saat berbaring dan mereda bila duduk atau kepala ditinggikan; diukur kasar dari jumlah bantal yang dibutuhkan untuk tidur.',
      en:'Breathlessness that appears on lying flat and eases on sitting up; roughly graded by the number of pillows needed to sleep.'}},
    {id:'t3.2',t:'Paroxysmal Nocturnal Dyspnea',a:'PND',d:{
      id:'Serangan sesak napas hebat yang membangunkan pasien 1–2 jam setelah tidur dan memaksanya duduk atau berdiri; khas pada gagal jantung kiri.',
      en:'A sudden attack of severe breathlessness waking the patient 1–2 hours after falling asleep and forcing them to sit or stand; typical of left heart failure.'}},
    {id:'t3.3',t:'Pulsus Paradoksus',a:'pulsus paradoxus',d:{
      id:'Turunnya tekanan darah sistolik >10 mmHg saat inspirasi; dicari pada tamponade jantung, perikarditis konstriktif, dan asma berat.',
      en:'A fall in systolic blood pressure of more than 10 mmHg during inspiration; sought in cardiac tamponade, constrictive pericarditis, and severe asthma.'}},
    {id:'t3.4',t:'Thrill',a:'getaran bising',d:{
      id:'Getaran yang teraba di dinding dada akibat aliran turbulen; menandakan bising jantung yang keras, minimal derajat 4 dari 6.',
      en:'A palpable vibration on the chest wall produced by turbulent flow; it marks a loud murmur, at least grade 4 of 6.'}},
    {id:'t3.5',t:'Klaudikasio Intermiten',a:'intermittent claudication',d:{
      id:'Nyeri otot tungkai yang muncul saat berjalan pada jarak yang tetap dan hilang dengan istirahat; gejala khas penyakit arteri perifer.',
      en:'Leg muscle pain appearing after a reproducible walking distance and relieved by rest; the hallmark symptom of peripheral arterial disease.'}},
    {id:'t3.6',t:'Palpitasi',a:'palpitation, berdebar',d:{
      id:'Kesadaran subjektif akan denyut jantung sendiri — terasa cepat, kuat, atau tidak teratur — yang belum tentu disertai aritmia.',
      en:'Subjective awareness of one\'s own heartbeat — fast, forceful, or irregular — which does not necessarily indicate an arrhythmia.'}},
    {id:'t3.7',t:'Tekanan Vena Jugularis',a:'JVP, jugular venous pressure',d:{
      id:'Perkiraan tekanan atrium kanan dari tinggi pulsasi vena jugularis interna pada posisi 45°; meningkat pada gagal jantung kanan dan tamponade.',
      en:'An estimate of right atrial pressure from the height of the internal jugular pulsation at 45°; raised in right heart failure and tamponade.'}},
    {id:'t3.8',t:'Syok Kardiogenik',a:'cardiogenic shock',d:{
      id:'Hipoperfusi jaringan akibat kegagalan pompa jantung meski volume intravaskular cukup; ditandai hipotensi menetap dan tanda perfusi organ yang buruk.',
      en:'Tissue hypoperfusion from pump failure despite adequate intravascular volume, marked by sustained hypotension and signs of poor organ perfusion.'}},
    {id:'t3.9',t:'Regurgitasi',a:'insufisiensi katup, regurgitation',d:{
      id:'Aliran balik darah melalui katup yang tidak menutup rapat, sehingga sebagian curah jantung kembali ke ruang sebelumnya.',
      en:'Backward blood flow through a valve that fails to close completely, returning part of the cardiac output to the preceding chamber.'}},
    {id:'t3.10',t:'Aterosklerosis',a:'atherosclerosis',d:{
      id:'Penebalan dinding arteri oleh plak berisi lipid, sel radang, dan jaringan fibrosa; dasar dari penyakit jantung koroner, stroke iskemik, dan penyakit arteri perifer.',
      en:'Thickening of the arterial wall by plaques of lipid, inflammatory cells, and fibrous tissue; the basis of coronary disease, ischaemic stroke, and peripheral arterial disease.'}}
  ]},

  {n:4,t:{id:'Respirasi',en:'Respiratory'},items:[
    {id:'t4.1',t:'Dispnea',a:'dyspnoea, sesak napas',d:{
      id:'Rasa sulit atau tidak nyaman saat bernapas yang disadari pasien; keluhan subjektif yang berbeda dari takipnea dan hipoksemia yang objektif.',
      en:'The subjective sensation of difficult or uncomfortable breathing; a symptom, distinct from the objective findings of tachypnoea and hypoxaemia.'}},
    {id:'t4.2',t:'Hemoptisis',a:'haemoptysis, batuk darah',d:{
      id:'Batuk mengeluarkan darah yang berasal dari saluran napas bawah; darahnya berbusa dan berwarna merah segar, berbeda dari hematemesis.',
      en:'Coughing up blood originating from the lower airways; the blood is frothy and bright red, unlike haematemesis.'}},
    {id:'t4.3',t:'Stridor',a:'stridor',d:{
      id:'Suara napas kasar bernada tinggi akibat sumbatan saluran napas atas, umumnya terdengar saat inspirasi tanpa stetoskop.',
      en:'A harsh high-pitched breath sound from upper airway obstruction, usually heard on inspiration without a stethoscope.'}},
    {id:'t4.4',t:'Mengi',a:'wheezing',d:{
      id:'Suara napas musikal bernada tinggi dari penyempitan saluran napas bawah, paling jelas saat ekspirasi; khas pada asma dan PPOK.',
      en:'A musical high-pitched sound from narrowed lower airways, loudest on expiration; characteristic of asthma and COPD.'}},
    {id:'t4.5',t:'Ronki Basah',a:'crackles, rales',d:{
      id:'Suara tambahan terputus-putus seperti gemeretak yang terdengar saat inspirasi, timbul dari alveoli atau saluran napas kecil yang terbuka kembali.',
      en:'Discontinuous crackling sounds heard on inspiration, produced by alveoli or small airways popping open.'}},
    {id:'t4.6',t:'Hipoksemia',a:'hypoxaemia',d:{
      id:'Rendahnya kadar oksigen dalam darah arteri (PaO₂ rendah atau SaO₂ <90%); berbeda dari hipoksia, yaitu kurangnya oksigen di tingkat jaringan.',
      en:'Low oxygen level in arterial blood (low PaO₂ or SaO₂ <90%); distinct from hypoxia, which is inadequate oxygen at tissue level.'}},
    {id:'t4.7',t:'Apnea',a:'apnoea',d:{
      id:'Berhentinya aliran udara napas ≥10 detik; pada sleep apnea obstruktif terjadi berulang saat tidur akibat kolapsnya saluran napas atas.',
      en:'Cessation of airflow for 10 seconds or more; in obstructive sleep apnoea it recurs during sleep from upper airway collapse.'}},
    {id:'t4.8',t:'Jari Tabuh',a:'clubbing finger',d:{
      id:'Pembesaran ujung jari dengan hilangnya sudut kuku normal; ditemukan pada penyakit paru kronik, penyakit jantung bawaan sianotik, dan sirosis.',
      en:'Bulbous enlargement of the fingertips with loss of the normal nail-fold angle; seen in chronic lung disease, cyanotic congenital heart disease, and cirrhosis.'}},
    {id:'t4.9',t:'Atelektasis',a:'atelectasis',d:{
      id:'Kolapsnya sebagian atau seluruh jaringan paru sehingga alveoli tidak terisi udara, akibat sumbatan bronkus, kompresi, atau hipoventilasi.',
      en:'Collapse of part or all of a lung so the alveoli contain no air, caused by bronchial obstruction, compression, or hypoventilation.'}},
    {id:'t4.10',t:'Efusi Pleura',a:'pleural effusion',d:{
      id:'Penumpukan cairan abnormal di rongga pleura; dibedakan menjadi transudat (mis. gagal jantung) dan eksudat (mis. infeksi, keganasan) lewat kriteria Light.',
      en:'Abnormal fluid accumulation in the pleural space; separated into transudate (e.g. heart failure) and exudate (e.g. infection, malignancy) by Light\'s criteria.'}}
  ]},

  {n:5,t:{id:'Gastrointestinal & Hepatobilier',en:'Gastrointestinal & Hepatobiliary'},items:[
    {id:'t5.1',t:'Disfagia',a:'dysphagia',d:{
      id:'Kesulitan menelan atau rasa makanan tersangkut; disebut orofaringeal bila terjadi saat memulai menelan, esofageal bila terasa beberapa detik kemudian.',
      en:'Difficulty swallowing or a sense of food sticking; oropharyngeal when it occurs at the start of the swallow, oesophageal when felt seconds later.'}},
    {id:'t5.2',t:'Odinofagia',a:'odynophagia',d:{
      id:'Nyeri saat menelan, umumnya karena peradangan atau ulkus mukosa esofagus; berbeda dari disfagia yang berupa hambatan mekanis atau motorik.',
      en:'Pain on swallowing, usually from oesophageal mucosal inflammation or ulceration; distinct from dysphagia, which is a mechanical or motor obstruction.'}},
    {id:'t5.3',t:'Melena',a:'melaena',d:{
      id:'Tinja hitam pekat, lengket, dan berbau khas akibat darah dari saluran cerna atas yang telah dicerna; perlu perdarahan sekitar 50 mL atau lebih.',
      en:'Black, tarry, foul-smelling stool from digested upper gastrointestinal blood; usually requires bleeding of about 50 mL or more.'}},
    {id:'t5.4',t:'Hematemesis',a:'muntah darah',d:{
      id:'Muntah darah segar atau berwarna seperti ampas kopi, menandakan perdarahan saluran cerna proksimal dari ligamentum Treitz.',
      en:'Vomiting of fresh blood or coffee-ground material, indicating bleeding proximal to the ligament of Treitz.'}},
    {id:'t5.5',t:'Hematokezia',a:'haematochezia',d:{
      id:'Keluarnya darah merah segar per rektum, umumnya dari saluran cerna bawah, tetapi bisa juga dari perdarahan atas yang masif dan cepat.',
      en:'Passage of fresh red blood per rectum, usually from the lower gastrointestinal tract but possible with massive rapid upper bleeding.'}},
    {id:'t5.6',t:'Asites',a:'ascites',d:{
      id:'Penumpukan cairan patologis di rongga peritoneum; penyebab tersering adalah sirosis dengan hipertensi portal, dinilai lewat gradien albumin serum-asites.',
      en:'Pathological fluid accumulation in the peritoneal cavity; most often from cirrhosis with portal hypertension, assessed by the serum-ascites albumin gradient.'}},
    {id:'t5.7',t:'Tenesmus',a:'tenesmus',d:{
      id:'Rasa ingin buang air besar yang terus-menerus dan nyeri meski rektum kosong; menandakan iritasi rektum pada disentri atau proktitis.',
      en:'A persistent, painful urge to defecate despite an empty rectum, indicating rectal irritation in dysentery or proctitis.'}},
    {id:'t5.8',t:'Steatorea',a:'steatorrhoea',d:{
      id:'Tinja berlemak, pucat, mengambang, dan sulit disiram akibat malabsorpsi lemak, misalnya pada insufisiensi pankreas atau penyakit seliak.',
      en:'Fatty, pale, floating stool that is hard to flush, caused by fat malabsorption as in pancreatic insufficiency or coeliac disease.'}},
    {id:'t5.9',t:'Ensefalopati Hepatik',a:'hepatic encephalopathy',d:{
      id:'Gangguan fungsi otak akibat gagal hati dan pintas portosistemik, dengan spektrum dari perubahan perilaku ringan sampai koma; asteriksis khas ditemukan.',
      en:'Brain dysfunction from liver failure and portosystemic shunting, ranging from subtle behavioural change to coma; asterixis is characteristic.'}},
    {id:'t5.10',t:'Spider Nevi',a:'spider angioma, nevus araneus',d:{
      id:'Lesi vaskular dengan arteriol sentral dan cabang halus menyerupai laba-laba yang memucat bila ditekan; banyak ditemukan pada penyakit hati kronik.',
      en:'A vascular lesion with a central arteriole and radiating branches that blanches on pressure; commonly seen in chronic liver disease.'}}
  ]},

  {n:6,t:{id:'Ginjal & Urologi',en:'Renal & Urology'},items:[
    {id:'t6.1',t:'Oliguria',a:'oliguria',d:{
      id:'Produksi urin di bawah 0,5 mL/kg/jam atau kira-kira <400 mL per hari pada dewasa; penanda dini gangguan ginjal akut.',
      en:'Urine output below 0.5 mL/kg/hour, or roughly under 400 mL per day in adults; an early marker of acute kidney injury.'}},
    {id:'t6.2',t:'Anuria',a:'anuria',d:{
      id:'Produksi urin hampir berhenti sama sekali, umumnya <100 mL per hari; sering menandakan obstruksi total atau kerusakan ginjal berat.',
      en:'Near-total cessation of urine production, generally under 100 mL per day; often indicating complete obstruction or severe renal injury.'}},
    {id:'t6.3',t:'Poliuria',a:'polyuria',d:{
      id:'Produksi urin berlebih, umumnya >3 liter per hari pada dewasa; penyebab utamanya diuresis osmotik dan diabetes insipidus.',
      en:'Excessive urine output, generally more than 3 litres per day in adults; chiefly caused by osmotic diuresis and diabetes insipidus.'}},
    {id:'t6.4',t:'Disuria',a:'dysuria',d:{
      id:'Nyeri, panas, atau perih saat berkemih; gejala utama infeksi saluran kemih bawah dan uretritis.',
      en:'Pain, burning, or stinging on urination; the cardinal symptom of lower urinary tract infection and urethritis.'}},
    {id:'t6.5',t:'Hematuria',a:'haematuria',d:{
      id:'Adanya darah dalam urin; makroskopik bila terlihat mata telanjang, mikroskopik bila hanya terdeteksi pada pemeriksaan sedimen.',
      en:'Blood in the urine; gross when visible to the naked eye, microscopic when detected only on urinalysis.'}},
    {id:'t6.6',t:'Proteinuria',a:'proteinuria',d:{
      id:'Ekskresi protein urin melebihi normal (>150 mg/hari); di atas 3,5 g/hari disebut rentang nefrotik dan menandakan kerusakan glomerulus.',
      en:'Urinary protein excretion above normal (>150 mg/day); above 3.5 g/day it is termed nephrotic range and indicates glomerular damage.'}},
    {id:'t6.7',t:'Azotemia',a:'azotaemia',d:{
      id:'Peningkatan kadar sisa nitrogen darah seperti ureum dan kreatinin; temuan laboratorium yang belum tentu disertai gejala.',
      en:'Elevated blood nitrogenous waste such as urea and creatinine; a laboratory finding that need not cause symptoms.'}},
    {id:'t6.8',t:'Uremia',a:'uraemia',d:{
      id:'Sindrom klinis akibat azotemia berat, meliputi mual, gatal, perikarditis, dan gangguan kesadaran; menjadi indikasi dialisis.',
      en:'The clinical syndrome of severe azotaemia, including nausea, pruritus, pericarditis, and altered consciousness; an indication for dialysis.'}},
    {id:'t6.9',t:'Nokturia',a:'nocturia',d:{
      id:'Terbangun untuk berkemih pada malam hari; penyebabnya beragam, dari pembesaran prostat sampai gagal jantung dan diabetes.',
      en:'Waking at night to void; causes range from prostatic enlargement to heart failure and diabetes.'}},
    {id:'t6.10',t:'Hidronefrosis',a:'hydronephrosis',d:{
      id:'Pelebaran pelvis dan kaliks ginjal akibat sumbatan aliran urin; bila lama, menekan parenkim dan menurunkan fungsi ginjal permanen.',
      en:'Dilatation of the renal pelvis and calyces from obstructed urine flow; if prolonged, it compresses the parenchyma and permanently reduces renal function.'}}
  ]},

  {n:7,t:{id:'Neurologi',en:'Neurology'},items:[
    {id:'t7.1',t:'Afasia',a:'aphasia',d:{
      id:'Gangguan berbahasa akibat lesi otak, mengenai bicara, pemahaman, membaca, atau menulis; tipe Broca ekspresif, tipe Wernicke reseptif.',
      en:'A language disorder from brain injury affecting speech, comprehension, reading, or writing; Broca type is expressive, Wernicke type receptive.'}},
    {id:'t7.2',t:'Disartria',a:'dysarthria',d:{
      id:'Bicara pelo atau tidak jelas karena gangguan otot artikulasi, sementara isi bahasanya tetap utuh — berbeda dari afasia.',
      en:'Slurred or unclear speech from impaired articulatory muscles while language content remains intact — unlike aphasia.'}},
    {id:'t7.3',t:'Hemiparesis',a:'hemiparesis',d:{
      id:'Kelemahan otot pada satu sisi tubuh; bila kelemahannya total tanpa gerak sama sekali disebut hemiplegia.',
      en:'Muscle weakness on one side of the body; when total with no movement at all it is termed hemiplegia.'}},
    {id:'t7.4',t:'Parestesia',a:'paraesthesia, kesemutan',d:{
      id:'Sensasi abnormal spontan seperti kesemutan, kebas, atau tertusuk jarum tanpa rangsang nyeri; menandakan gangguan saraf sensorik.',
      en:'Spontaneous abnormal sensation such as tingling, numbness, or pins and needles without a painful stimulus; indicates sensory nerve dysfunction.'}},
    {id:'t7.5',t:'Ataksia',a:'ataxia',d:{
      id:'Gangguan koordinasi gerakan sehingga langkah dan gerakan terarah menjadi kacau, biasanya karena lesi serebelum atau jaras proprioseptif.',
      en:'Impaired coordination making gait and targeted movements clumsy, usually from cerebellar or proprioceptive pathway lesions.'}},
    {id:'t7.6',t:'Nistagmus',a:'nystagmus',d:{
      id:'Gerakan bola mata bolak-balik yang tidak disadari dan berirama; ditemukan pada gangguan vestibular, serebelum, atau efek obat.',
      en:'Involuntary rhythmic to-and-fro eye movement; seen in vestibular or cerebellar disorders and drug effects.'}},
    {id:'t7.7',t:'Meningismus',a:'rangsang meningeal',d:{
      id:'Kumpulan tanda iritasi selaput otak berupa kaku kuduk, tanda Kernig, dan Brudzinski; dicari pada meningitis dan perdarahan subaraknoid.',
      en:'The cluster of meningeal irritation signs — neck stiffness, Kernig\'s, and Brudzinski\'s — sought in meningitis and subarachnoid haemorrhage.'}},
    {id:'t7.8',t:'Papiledema',a:'papilloedema',d:{
      id:'Pembengkakan diskus optikus pada kedua mata akibat tekanan intrakranial meningkat, tampak pada funduskopi sebagai batas diskus yang kabur.',
      en:'Swelling of both optic discs from raised intracranial pressure, seen on fundoscopy as blurred disc margins.'}},
    {id:'t7.9',t:'Refleks Babinski',a:'Babinski sign, refleks plantar ekstensor',d:{
      id:'Ibu jari kaki ekstensi ke atas saat telapak kaki digores; normal pada bayi, tetapi pada dewasa menandakan lesi upper motor neuron.',
      en:'Upward extension of the great toe on stroking the sole; normal in infants, but in adults it indicates an upper motor neuron lesion.'}},
    {id:'t7.10',t:'Transient Ischemic Attack',a:'TIA, serangan iskemik sepintas',d:{
      id:'Defisit neurologis fokal akibat iskemia otak yang pulih sempurna tanpa infark pada pencitraan; peringatan dini risiko stroke.',
      en:'A focal neurological deficit from cerebral ischaemia that resolves completely without infarction on imaging; an early warning of stroke risk.'}}
  ]},

  {n:8,t:{id:'Hematologi & Onkologi',en:'Haematology & Oncology'},items:[
    {id:'t8.1',t:'Anemia',a:'anaemia',d:{
      id:'Turunnya massa sel darah merah atau hemoglobin di bawah normal menurut usia dan jenis kelamin sehingga pengangkutan oksigen berkurang.',
      en:'A reduction in red cell mass or haemoglobin below the age- and sex-specific normal, impairing oxygen delivery.'}},
    {id:'t8.2',t:'Petekie',a:'petechiae',d:{
      id:'Bintik perdarahan kulit berdiameter <3 mm yang tidak memucat saat ditekan; khas pada trombositopenia dan vaskulitis.',
      en:'Pinpoint skin haemorrhages under 3 mm that do not blanch on pressure; typical of thrombocytopenia and vasculitis.'}},
    {id:'t8.3',t:'Ekimosis',a:'ecchymosis, memar',d:{
      id:'Perdarahan di bawah kulit berukuran lebih besar dari 1 cm dengan warna yang berubah seiring pemecahan hemoglobin.',
      en:'Subcutaneous bleeding larger than 1 cm whose colour changes as haemoglobin breaks down.'}},
    {id:'t8.4',t:'Limfadenopati',a:'lymphadenopathy',d:{
      id:'Pembesaran kelenjar getah bening; sifat kenyal dan nyeri mengarah ke infeksi, sedangkan keras, terfiksasi, dan tanpa nyeri mencurigakan keganasan.',
      en:'Enlargement of lymph nodes; tender, rubbery nodes suggest infection, while hard, fixed, painless nodes raise suspicion of malignancy.'}},
    {id:'t8.5',t:'Splenomegali',a:'splenomegaly',d:{
      id:'Pembesaran limpa hingga teraba di bawah arkus kosta kiri; sering menyertai hipertensi portal, infeksi kronik, dan keganasan hematologi.',
      en:'Enlargement of the spleen so that it is palpable below the left costal margin; common in portal hypertension, chronic infection, and haematological malignancy.'}},
    {id:'t8.6',t:'Pansitopenia',a:'pancytopenia',d:{
      id:'Penurunan ketiga lini sel darah — eritrosit, leukosit, dan trombosit — sekaligus, misalnya pada anemia aplastik atau infiltrasi sumsum tulang.',
      en:'Simultaneous reduction of all three blood cell lines — red cells, white cells, and platelets — as in aplastic anaemia or marrow infiltration.'}},
    {id:'t8.7',t:'Trombositopenia',a:'thrombocytopenia',d:{
      id:'Jumlah trombosit di bawah 150.000/µL; risiko perdarahan spontan meningkat tajam bila turun di bawah 20.000/µL.',
      en:'A platelet count below 150,000/µL; the risk of spontaneous bleeding rises sharply below 20,000/µL.'}},
    {id:'t8.8',t:'Koagulopati',a:'coagulopathy',d:{
      id:'Gangguan pembekuan darah yang membuat pasien mudah berdarah atau justru mudah membeku, bawaan maupun didapat.',
      en:'A disorder of blood clotting that predisposes to bleeding or, conversely, to thrombosis, whether inherited or acquired.'}},
    {id:'t8.9',t:'Metastasis',a:'metastasis, anak sebar',d:{
      id:'Penyebaran sel kanker dari tumor primer ke organ lain lewat aliran darah, limfe, atau rongga tubuh, membentuk tumor sekunder.',
      en:'Spread of cancer cells from the primary tumour to distant organs via blood, lymph, or body cavities, forming secondary tumours.'}},
    {id:'t8.10',t:'Neutropenia Febril',a:'febrile neutropenia',d:{
      id:'Demam pada pasien dengan neutrofil absolut <500/µL, umumnya pasca kemoterapi; kegawatan onkologi yang menuntut antibiotik segera.',
      en:'Fever in a patient with an absolute neutrophil count below 500/µL, usually after chemotherapy; an oncological emergency requiring immediate antibiotics.'}}
  ]},

  {n:9,t:{id:'Endokrin & Metabolik',en:'Endocrine & Metabolic'},items:[
    {id:'t9.1',t:'Poliuria–Polidipsia–Polifagia',a:'trias klasik diabetes',d:{
      id:'Trias klasik hiperglikemia: banyak berkemih karena diuresis osmotik, banyak minum akibat dehidrasi, dan banyak makan karena glukosa tak masuk sel.',
      en:'The classic hyperglycaemia triad: frequent urination from osmotic diuresis, excessive thirst from dehydration, and excessive hunger as glucose cannot enter cells.'}},
    {id:'t9.2',t:'Eksoftalmus',a:'exophthalmos, proptosis',d:{
      id:'Penonjolan bola mata ke depan dari rongga orbita; pada penyakit Graves terjadi karena jaringan retro-orbita membengkak akibat proses autoimun.',
      en:'Forward protrusion of the eyeball from the orbit; in Graves\' disease it results from autoimmune swelling of retro-orbital tissue.'}},
    {id:'t9.3',t:'Struma',a:'goiter, gondok',d:{
      id:'Pembesaran kelenjar tiroid, tanpa memandang fungsinya — bisa disertai hipertiroid, hipotiroid, maupun eutiroid.',
      en:'Enlargement of the thyroid gland regardless of its function — it may accompany hyperthyroid, hypothyroid, or euthyroid states.'}},
    {id:'t9.4',t:'Hirsutisme',a:'hirsutism',d:{
      id:'Tumbuhnya rambut kasar berpola pria pada perempuan akibat kelebihan androgen, misalnya pada sindrom ovarium polikistik.',
      en:'Growth of coarse male-pattern hair in women due to androgen excess, as in polycystic ovary syndrome.'}},
    {id:'t9.5',t:'Ketoasidosis Diabetik',a:'DKA',d:{
      id:'Kegawatan diabetes berupa hiperglikemia, ketosis, dan asidosis metabolik akibat defisiensi insulin berat; ditandai napas Kussmaul dan bau aseton.',
      en:'A diabetic emergency of hyperglycaemia, ketosis, and metabolic acidosis from severe insulin deficiency, marked by Kussmaul breathing and acetone breath.'}},
    {id:'t9.6',t:'Hipoglikemia',a:'hypoglycaemia',d:{
      id:'Glukosa darah rendah (umumnya <70 mg/dL) dengan gejala adrenergik lalu neuroglikopenik; harus dikoreksi segera karena mengancam otak.',
      en:'Low blood glucose (generally under 70 mg/dL) with adrenergic then neuroglycopenic symptoms; requires immediate correction as it threatens the brain.'}},
    {id:'t9.7',t:'Sindrom Cushing',a:'Cushing syndrome',d:{
      id:'Kumpulan gejala akibat kelebihan kortisol: moon face, punuk kerbau, striae ungu, obesitas sentral, dan hipertensi.',
      en:'The syndrome of cortisol excess: moon face, buffalo hump, purple striae, central obesity, and hypertension.'}},
    {id:'t9.8',t:'Akromegali',a:'acromegaly',d:{
      id:'Pembesaran tulang wajah, tangan, dan kaki pada dewasa akibat kelebihan hormon pertumbuhan setelah lempeng epifisis menutup.',
      en:'Enlargement of facial bones, hands, and feet in adults from growth hormone excess after the epiphyseal plates have closed.'}},
    {id:'t9.9',t:'Galaktorea',a:'galactorrhoea',d:{
      id:'Keluarnya cairan menyerupai ASI dari payudara di luar masa menyusui, paling sering karena hiperprolaktinemia.',
      en:'Milky nipple discharge outside lactation, most often caused by hyperprolactinaemia.'}},
    {id:'t9.10',t:'Tetani',a:'tetany',d:{
      id:'Kejang otot dan kaku akibat hipokalsemia, dengan tanda Chvostek dan Trousseau; sering menyusul operasi tiroid atau paratiroid.',
      en:'Muscle spasm and cramping from hypocalcaemia, with Chvostek\'s and Trousseau\'s signs; often follows thyroid or parathyroid surgery.'}}
  ]},

  {n:10,t:{id:'Muskuloskeletal & Reumatologi',en:'Musculoskeletal & Rheumatology'},items:[
    {id:'t10.1',t:'Artralgia',a:'arthralgia',d:{
      id:'Nyeri sendi tanpa tanda peradangan objektif; berbeda dari artritis yang disertai bengkak, panas, dan keterbatasan gerak.',
      en:'Joint pain without objective signs of inflammation; distinct from arthritis, which includes swelling, warmth, and restricted movement.'}},
    {id:'t10.2',t:'Mialgia',a:'myalgia',d:{
      id:'Nyeri otot; bila menyeluruh dapat menyertai infeksi virus, atau menandakan miopati akibat obat seperti statin.',
      en:'Muscle pain; when generalized it may accompany viral infection or signal drug-induced myopathy such as with statins.'}},
    {id:'t10.3',t:'Krepitasi',a:'crepitus',d:{
      id:'Bunyi atau sensasi berderak saat sendi digerakkan atau fragmen tulang saling bergesek; ditemukan pada osteoartritis dan fraktur.',
      en:'A grating sound or sensation as a joint moves or bone fragments rub; found in osteoarthritis and fractures.'}},
    {id:'t10.4',t:'Kontraktur',a:'contracture',d:{
      id:'Pemendekan menetap otot, tendon, atau kapsul sendi yang membatasi lingkup gerak, akibat imobilisasi lama atau jaringan parut.',
      en:'Permanent shortening of muscle, tendon, or joint capsule that limits range of motion, from prolonged immobilization or scarring.'}},
    {id:'t10.5',t:'Tofus',a:'tophus',d:{
      id:'Endapan kristal monosodium urat berupa benjolan di jaringan lunak dan sendi pada gout kronik yang lama tidak terkendali.',
      en:'A deposit of monosodium urate crystals forming a nodule in soft tissue and joints in long-standing uncontrolled gout.'}},
    {id:'t10.6',t:'Kaku Pagi',a:'morning stiffness',d:{
      id:'Kekakuan sendi setelah bangun tidur; bila berlangsung lebih dari satu jam mengarah ke artritis inflamatorik seperti artritis reumatoid.',
      en:'Joint stiffness after waking; lasting more than an hour it points to inflammatory arthritis such as rheumatoid arthritis.'}},
    {id:'t10.7',t:'Osteofit',a:'osteophyte, spur',d:{
      id:'Taji tulang baru yang tumbuh di tepi sendi sebagai respons terhadap degenerasi rawan; ciri radiologis osteoartritis.',
      en:'A bony spur growing at the joint margin in response to cartilage degeneration; a radiological hallmark of osteoarthritis.'}},
    {id:'t10.8',t:'Subluksasi',a:'subluxation',d:{
      id:'Pergeseran sebagian permukaan sendi yang masih menyisakan kontak antar tulang; dislokasi bila kontaknya hilang sepenuhnya.',
      en:'Partial displacement of joint surfaces with some bony contact retained; dislocation when contact is lost completely.'}},
    {id:'t10.9',t:'Fenomena Raynaud',a:'Raynaud phenomenon',d:{
      id:'Perubahan warna jari yang berurutan pucat, biru, lalu merah akibat vasospasme saat dingin atau stres; dapat primer atau menyertai penyakit jaringan ikat.',
      en:'Sequential pallor, cyanosis, then rubor of the digits from vasospasm on cold or stress; either primary or secondary to connective tissue disease.'}},
    {id:'t10.10',t:'Osteoporosis',a:'osteoporosis',d:{
      id:'Berkurangnya massa dan mikroarsitektur tulang sehingga rapuh dan mudah patah; ditegakkan dengan T-score DEXA ≤ −2,5.',
      en:'Loss of bone mass and microarchitecture leaving bone fragile and fracture-prone; diagnosed by a DEXA T-score of −2.5 or lower.'}}
  ]},

  {n:11,t:{id:'Dermatologi',en:'Dermatology'},items:[
    {id:'t11.1',t:'Makula',a:'macule',d:{
      id:'Perubahan warna kulit yang datar, berbatas tegas, dan berdiameter <1 cm tanpa perubahan permukaan; bila lebih besar disebut patch.',
      en:'A flat, well-defined change in skin colour under 1 cm with no surface change; larger lesions are called patches.'}},
    {id:'t11.2',t:'Papula',a:'papule',d:{
      id:'Penonjolan kulit padat berdiameter <1 cm; bila lebih besar dan lebih dalam disebut nodul.',
      en:'A solid raised skin lesion under 1 cm; larger and deeper lesions are called nodules.'}},
    {id:'t11.3',t:'Vesikel & Bula',a:'vesicle, bulla',d:{
      id:'Lepuh berisi cairan jernih; vesikel bila <1 cm seperti pada herpes, bula bila lebih besar seperti pada pemfigus.',
      en:'Blisters containing clear fluid; a vesicle is under 1 cm as in herpes, a bulla is larger as in pemphigus.'}},
    {id:'t11.4',t:'Pustula',a:'pustule',d:{
      id:'Lepuh kecil berisi nanah; belum tentu menandakan infeksi karena juga muncul pada psoriasis pustulosa dan akne.',
      en:'A small blister filled with pus; it does not necessarily indicate infection, as it also occurs in pustular psoriasis and acne.'}},
    {id:'t11.5',t:'Urtika',a:'wheal, biduran',d:{
      id:'Penonjolan kulit yang gatal, pucat di tengah dengan tepi kemerahan, dan bersifat sementara — biasanya hilang dalam 24 jam.',
      en:'An itchy raised lesion, pale centrally with a red rim, that is transient — usually resolving within 24 hours.'}},
    {id:'t11.6',t:'Skuama',a:'scale',d:{
      id:'Serpihan lapisan tanduk yang terkelupas dari permukaan kulit; halus pada dermatitis, tebal dan berlapis perak pada psoriasis.',
      en:'Flakes of stratum corneum shedding from the skin surface; fine in dermatitis, thick and silvery in psoriasis.'}},
    {id:'t11.7',t:'Likenifikasi',a:'lichenification',d:{
      id:'Penebalan kulit dengan garis-garis kulit yang makin jelas akibat garukan berulang, khas pada dermatitis atopik kronik.',
      en:'Skin thickening with accentuated skin markings from repeated scratching, characteristic of chronic atopic dermatitis.'}},
    {id:'t11.8',t:'Erosi & Ulkus',a:'erosion, ulcer',d:{
      id:'Erosi adalah hilangnya epidermis saja dan sembuh tanpa jaringan parut; ulkus menembus dermis dan meninggalkan parut.',
      en:'An erosion involves loss of epidermis only and heals without scarring; an ulcer extends into the dermis and leaves a scar.'}},
    {id:'t11.9',t:'Pruritus',a:'gatal, itch',d:{
      id:'Rasa gatal yang menimbulkan keinginan menggaruk; bila tanpa lesi kulit primer, perlu dicari penyebab sistemik seperti kolestasis atau uremia.',
      en:'An itching sensation provoking the urge to scratch; without primary skin lesions, look for systemic causes such as cholestasis or uraemia.'}},
    {id:'t11.10',t:'Eritema',a:'erythema',d:{
      id:'Kemerahan kulit akibat pelebaran pembuluh darah yang memucat bila ditekan — pembeda dari purpura, yang tidak memucat.',
      en:'Skin redness from vascular dilatation that blanches on pressure — the key distinction from purpura, which does not blanch.'}}
  ]},

  {n:12,t:{id:'Infeksi & Imunologi',en:'Infection & Immunology'},items:[
    {id:'t12.1',t:'Sepsis',a:'sepsis',d:{
      id:'Disfungsi organ yang mengancam jiwa akibat respons tubuh yang tidak teratur terhadap infeksi; dinilai dengan kenaikan skor SOFA ≥2.',
      en:'Life-threatening organ dysfunction caused by a dysregulated host response to infection, identified by a rise in SOFA score of 2 or more.'}},
    {id:'t12.2',t:'Bakteremia',a:'bacteraemia',d:{
      id:'Adanya bakteri hidup di dalam darah yang dibuktikan lewat kultur; bisa sementara dan tanpa gejala, jadi tidak sama dengan sepsis.',
      en:'The presence of viable bacteria in the blood proven by culture; it may be transient and asymptomatic, so it is not the same as sepsis.'}},
    {id:'t12.3',t:'Masa Inkubasi',a:'incubation period',d:{
      id:'Rentang waktu antara masuknya patogen dan munculnya gejala pertama; menentukan lamanya karantina pada penyakit menular.',
      en:'The interval between pathogen entry and the first symptoms; it determines quarantine duration in communicable disease.'}},
    {id:'t12.4',t:'Endemis, Epidemi, Pandemi',a:'endemic, epidemic, pandemic',d:{
      id:'Endemis bila penyakit selalu ada pada tingkat tetap di suatu wilayah, epidemi bila kasus melonjak melebihi biasanya, pandemi bila lonjakan itu melintasi banyak negara.',
      en:'Endemic means constantly present at a steady level in an area, epidemic means cases surge above the expected level, and pandemic means such a surge crosses many countries.'}},
    {id:'t12.5',t:'Zoonosis',a:'zoonosis',d:{
      id:'Penyakit yang secara alami menular dari hewan vertebrata ke manusia, misalnya rabies, leptospirosis, dan flu burung.',
      en:'A disease naturally transmitted from vertebrate animals to humans, such as rabies, leptospirosis, and avian influenza.'}},
    {id:'t12.6',t:'Anafilaksis',a:'anaphylaxis',d:{
      id:'Reaksi hipersensitivitas sistemik berat dan mendadak dengan gangguan napas dan sirkulasi; tatalaksana utamanya adrenalin intramuskular.',
      en:'A severe, sudden systemic hypersensitivity reaction with airway and circulatory compromise; the first-line treatment is intramuscular adrenaline.'}},
    {id:'t12.7',t:'Imunosupresi',a:'immunosuppression',d:{
      id:'Menurunnya kemampuan sistem imun, akibat penyakit maupun obat, sehingga pasien rentan terhadap infeksi oportunistik.',
      en:'A reduced capacity of the immune system, from disease or drugs, leaving the patient susceptible to opportunistic infection.'}},
    {id:'t12.8',t:'Infeksi Oportunistik',a:'opportunistic infection',d:{
      id:'Infeksi oleh kuman yang biasanya tidak berbahaya, tetapi menimbulkan penyakit ketika daya tahan tubuh menurun.',
      en:'Infection by an organism that is usually harmless but causes disease when host defences are impaired.'}},
    {id:'t12.9',t:'Resistensi Antimikroba',a:'antimicrobial resistance, AMR',d:{
      id:'Kemampuan mikroorganisme bertahan terhadap obat yang sebelumnya efektif; dipercepat oleh pemakaian antibiotik yang tidak rasional.',
      en:'The ability of microorganisms to survive drugs that were previously effective, accelerated by irrational antibiotic use.'}},
    {id:'t12.10',t:'Profilaksis',a:'prophylaxis',d:{
      id:'Tindakan atau obat yang diberikan untuk mencegah penyakit sebelum terjadi, misalnya antibiotik pra-bedah atau antikoagulan pencegah trombosis.',
      en:'A measure or drug given to prevent disease before it occurs, such as pre-operative antibiotics or anticoagulants to prevent thrombosis.'}}
  ]},

  {n:13,t:{id:'Mata & THT',en:'Eye, Ear, Nose & Throat'},items:[
    {id:'t13.1',t:'Miosis & Midriasis',a:'miosis, mydriasis',d:{
      id:'Miosis adalah penyempitan pupil, midriasis pelebarannya; keduanya penting menilai keracunan opioid, antikolinergik, dan lesi batang otak.',
      en:'Miosis is pupillary constriction and mydriasis is dilatation; both are key in assessing opioid or anticholinergic poisoning and brainstem lesions.'}},
    {id:'t13.2',t:'Fotofobia',a:'photophobia',d:{
      id:'Rasa tidak nyaman atau nyeri pada mata saat terkena cahaya; ditemukan pada meningitis, uveitis, dan migrain.',
      en:'Eye discomfort or pain on exposure to light; found in meningitis, uveitis, and migraine.'}},
    {id:'t13.3',t:'Diplopia',a:'penglihatan ganda',d:{
      id:'Melihat satu objek menjadi dua; binokular bila hilang saat satu mata ditutup dan menandakan gangguan otot atau saraf penggerak bola mata.',
      en:'Seeing one object as two; binocular when it disappears on covering one eye, indicating an extraocular muscle or nerve disorder.'}},
    {id:'t13.4',t:'Ptosis',a:'ptosis',d:{
      id:'Kelopak mata atas yang turun; dapat menandakan lesi nervus okulomotor, sindrom Horner, atau miastenia gravis.',
      en:'Drooping of the upper eyelid; it may indicate an oculomotor nerve lesion, Horner syndrome, or myasthenia gravis.'}},
    {id:'t13.5',t:'Tinitus',a:'tinnitus',d:{
      id:'Persepsi suara berdenging atau berdengung tanpa sumber suara dari luar; sering menyertai gangguan pendengaran atau efek obat ototoksik.',
      en:'The perception of ringing or buzzing without an external sound source; often accompanies hearing loss or ototoxic drug effects.'}},
    {id:'t13.6',t:'Vertigo',a:'vertigo',d:{
      id:'Ilusi gerakan berputar pada diri atau lingkungan akibat gangguan vestibular; berbeda dari pusing melayang yang tidak berputar.',
      en:'The illusion of spinning of oneself or the surroundings from vestibular dysfunction; distinct from non-rotatory lightheadedness.'}},
    {id:'t13.7',t:'Otalgia',a:'nyeri telinga',d:{
      id:'Nyeri telinga; disebut primer bila sumbernya di telinga sendiri dan referred bila berasal dari gigi, faring, atau sendi temporomandibular.',
      en:'Ear pain; primary when arising from the ear itself and referred when originating from teeth, pharynx, or the temporomandibular joint.'}},
    {id:'t13.8',t:'Epistaksis',a:'mimisan, nosebleed',d:{
      id:'Perdarahan dari hidung; sebagian besar berasal dari pleksus Kiesselbach di septum anterior dan berhenti dengan penekanan.',
      en:'Bleeding from the nose; most arise from Kiesselbach\'s plexus on the anterior septum and stop with direct pressure.'}},
    {id:'t13.9',t:'Anosmia',a:'anosmia',d:{
      id:'Hilangnya kemampuan membau, dapat karena sumbatan hidung, kerusakan saraf olfaktorius, atau infeksi virus.',
      en:'Loss of the sense of smell, whether from nasal obstruction, olfactory nerve damage, or viral infection.'}},
    {id:'t13.10',t:'Disfonia',a:'suara serak, dysphonia',d:{
      id:'Perubahan kualitas suara menjadi serak atau lemah akibat gangguan pita suara; bila menetap >2 minggu perlu dievaluasi laringoskopi.',
      en:'Hoarse or weak voice from vocal cord dysfunction; persisting beyond two weeks it warrants laryngoscopic evaluation.'}}
  ]},

  {n:14,t:{id:'Obstetri & Ginekologi',en:'Obstetrics & Gynaecology'},items:[
    {id:'t14.1',t:'Amenorea',a:'amenorrhoea',d:{
      id:'Tidak adanya haid; primer bila belum pernah haid sampai usia 15 tahun, sekunder bila berhenti ≥3 siklus pada yang sebelumnya teratur.',
      en:'Absence of menstruation; primary when menses have never occurred by age 15, secondary when they stop for three or more cycles in a previously regular woman.'}},
    {id:'t14.2',t:'Dismenorea',a:'dysmenorrhoea',d:{
      id:'Nyeri haid; primer bila tanpa kelainan panggul dan diperantarai prostaglandin, sekunder bila ada penyebab seperti endometriosis atau mioma.',
      en:'Painful menstruation; primary when no pelvic pathology exists and prostaglandins mediate it, secondary when caused by endometriosis or fibroids.'}},
    {id:'t14.3',t:'Menoragia',a:'menorrhagia',d:{
      id:'Perdarahan haid yang terlalu banyak atau terlalu lama tetapi siklusnya tetap teratur; penyebab umum anemia defisiensi besi pada perempuan.',
      en:'Menstrual bleeding that is excessive or prolonged while the cycle remains regular; a common cause of iron deficiency anaemia in women.'}},
    {id:'t14.4',t:'Metroragia',a:'metrorrhagia',d:{
      id:'Perdarahan dari rahim di luar jadwal haid, tanpa pola waktu yang teratur.',
      en:'Uterine bleeding occurring between menstrual periods without a regular pattern.'}},
    {id:'t14.5',t:'Gravida & Para',a:'gravidity, parity',d:{
      id:'Gravida adalah jumlah seluruh kehamilan, para adalah jumlah persalinan yang mencapai usia viabel — dicatat sebagai G_P_A_ bersama abortus.',
      en:'Gravidity is the total number of pregnancies and parity the number of births reaching viability — recorded as G_P_A_ together with abortions.'}},
    {id:'t14.6',t:'Preeklampsia',a:'pre-eclampsia',d:{
      id:'Hipertensi yang muncul setelah usia kehamilan 20 minggu disertai proteinuria atau disfungsi organ; kelanjutannya menjadi eklampsia bila timbul kejang.',
      en:'Hypertension arising after 20 weeks of gestation with proteinuria or organ dysfunction; it becomes eclampsia when seizures occur.'}},
    {id:'t14.7',t:'Abortus',a:'abortion, keguguran',d:{
      id:'Berakhirnya kehamilan sebelum janin viabel, umumnya sebelum 20 minggu atau berat janin <500 gram.',
      en:'Termination of pregnancy before fetal viability, generally before 20 weeks or a fetal weight under 500 grams.'}},
    {id:'t14.8',t:'Leukorea',a:'keputihan, fluor albus',d:{
      id:'Keluarnya cairan dari vagina; fisiologis bila jernih dan tidak berbau, patologis bila berubah warna, berbau, atau disertai gatal.',
      en:'Vaginal discharge; physiological when clear and odourless, pathological when discoloured, malodorous, or accompanied by itching.'}},
    {id:'t14.9',t:'Kehamilan Ektopik',a:'ectopic pregnancy',d:{
      id:'Implantasi hasil konsepsi di luar rongga rahim, tersering di tuba falopi; kegawatan bila pecah dan menimbulkan perdarahan intraabdomen.',
      en:'Implantation of the conceptus outside the uterine cavity, most often in the fallopian tube; an emergency if it ruptures and causes intra-abdominal bleeding.'}},
    {id:'t14.10',t:'Partus & Kala Persalinan',a:'labour stages',d:{
      id:'Kala I adalah pembukaan serviks, kala II lahirnya bayi, kala III lahirnya plasenta, dan kala IV dua jam pengawasan pasca persalinan.',
      en:'Stage I is cervical dilatation, stage II delivery of the baby, stage III delivery of the placenta, and stage IV the two hours of postpartum observation.'}}
  ]},

  {n:15,t:{id:'Psikiatri & Perilaku',en:'Psychiatry & Behaviour'},items:[
    {id:'t15.1',t:'Halusinasi',a:'hallucination',d:{
      id:'Persepsi pancaindra tanpa rangsang nyata dari luar, paling sering auditorik pada skizofrenia dan visual pada delirium.',
      en:'A sensory perception without any real external stimulus, most often auditory in schizophrenia and visual in delirium.'}},
    {id:'t15.2',t:'Waham',a:'delusion',d:{
      id:'Keyakinan yang salah dan dipertahankan meski ada bukti yang membantah, serta tidak sesuai latar budaya penderitanya.',
      en:'A false belief held firmly despite contradicting evidence and not shared by the person\'s cultural background.'}},
    {id:'t15.3',t:'Ilusi',a:'illusion',d:{
      id:'Salah tafsir terhadap rangsang nyata yang benar-benar ada — berbeda dari halusinasi yang sama sekali tanpa rangsang.',
      en:'A misinterpretation of a real external stimulus — unlike a hallucination, which has no stimulus at all.'}},
    {id:'t15.4',t:'Anhedonia',a:'anhedonia',d:{
      id:'Hilangnya kemampuan merasakan senang dari kegiatan yang dulu dinikmati; gejala inti depresi bersama mood depresif.',
      en:'Loss of the ability to feel pleasure from previously enjoyed activities; a core symptom of depression alongside depressed mood.'}},
    {id:'t15.5',t:'Afek Datar',a:'flat affect',d:{
      id:'Sangat berkurangnya ekspresi emosi pada wajah, suara, dan gerak tubuh; termasuk gejala negatif skizofrenia.',
      en:'Marked reduction of emotional expression in face, voice, and gesture; one of the negative symptoms of schizophrenia.'}},
    {id:'t15.6',t:'Delirium',a:'delirium',d:{
      id:'Gangguan kesadaran dan atensi yang timbul akut, berfluktuasi sepanjang hari, dan disebabkan kondisi medis atau obat; umumnya reversibel.',
      en:'An acute disturbance of consciousness and attention that fluctuates through the day, caused by a medical condition or drugs; usually reversible.'}},
    {id:'t15.7',t:'Demensia',a:'dementia',d:{
      id:'Penurunan fungsi kognitif yang progresif dan menetap sehingga mengganggu kemandirian; kesadaran tetap jernih, berbeda dari delirium.',
      en:'A progressive, persistent decline in cognition that impairs independence; consciousness stays clear, unlike in delirium.'}},
    {id:'t15.8',t:'Ansietas',a:'anxiety, cemas',d:{
      id:'Rasa khawatir dan tegang terhadap ancaman yang belum tentu ada, disertai gejala otonom seperti berdebar, berkeringat, dan gemetar.',
      en:'Worry and tension about a threat that may not be present, accompanied by autonomic symptoms such as palpitations, sweating, and tremor.'}},
    {id:'t15.9',t:'Insomnia',a:'insomnia',d:{
      id:'Kesulitan memulai atau mempertahankan tidur, atau tidur yang tidak menyegarkan, disertai terganggunya fungsi pada siang hari.',
      en:'Difficulty initiating or maintaining sleep, or non-restorative sleep, together with impaired daytime functioning.'}},
    {id:'t15.10',t:'Tilikan',a:'insight',d:{
      id:'Kesadaran pasien bahwa dirinya sakit dan membutuhkan pengobatan; tilikan yang buruk menjadi hambatan utama kepatuhan terapi.',
      en:'A patient\'s awareness of being ill and needing treatment; poor insight is a major barrier to treatment adherence.'}}
  ]},

  {n:16,t:{id:'Farmakologi Klinik',en:'Clinical Pharmacology'},items:[
    {id:'t16.1',t:'Farmakokinetik',a:'pharmacokinetics',d:{
      id:'Perjalanan obat di dalam tubuh — absorpsi, distribusi, metabolisme, dan ekskresi; ringkasnya, apa yang tubuh lakukan terhadap obat.',
      en:'The movement of a drug through the body — absorption, distribution, metabolism, and excretion; in short, what the body does to the drug.'}},
    {id:'t16.2',t:'Farmakodinamik',a:'pharmacodynamics',d:{
      id:'Efek obat terhadap tubuh dan mekanisme kerjanya pada reseptor; ringkasnya, apa yang obat lakukan terhadap tubuh.',
      en:'The effects of a drug on the body and its mechanism at the receptor; in short, what the drug does to the body.'}},
    {id:'t16.3',t:'Waktu Paruh',a:'half-life, t½',d:{
      id:'Waktu yang dibutuhkan agar kadar obat dalam plasma turun setengahnya; menentukan interval pemberian dan kapan kadar tunak tercapai.',
      en:'The time for plasma drug concentration to fall by half; it determines dosing interval and when steady state is reached.'}},
    {id:'t16.4',t:'Efek Lintas Pertama',a:'first-pass effect',d:{
      id:'Berkurangnya jumlah obat yang mencapai sirkulasi sistemik karena dimetabolisme hati setelah diserap dari usus; alasan sebagian obat tidak diberikan per oral.',
      en:'Reduction in the amount of drug reaching systemic circulation because the liver metabolises it after intestinal absorption; the reason some drugs are not given orally.'}},
    {id:'t16.5',t:'Indeks Terapeutik',a:'therapeutic index',d:{
      id:'Jarak antara dosis efektif dan dosis toksik; obat dengan indeks sempit seperti digoksin dan warfarin memerlukan pemantauan kadar.',
      en:'The margin between effective and toxic doses; narrow-index drugs such as digoxin and warfarin require concentration monitoring.'}},
    {id:'t16.6',t:'Dosis Muat',a:'loading dose',d:{
      id:'Dosis awal yang lebih besar untuk mencapai kadar terapeutik dengan cepat, lalu dilanjutkan dosis rumatan agar kadar itu bertahan.',
      en:'A larger initial dose to reach therapeutic concentration quickly, followed by a maintenance dose to sustain it.'}},
    {id:'t16.7',t:'Titrasi Dosis',a:'dose titration',d:{
      id:'Penyesuaian dosis bertahap naik atau turun sampai tercapai efek yang diinginkan dengan efek samping minimal.',
      en:'Stepwise upward or downward dose adjustment until the desired effect is achieved with minimal adverse effects.'}},
    {id:'t16.8',t:'Agonis & Antagonis',a:'agonist, antagonist',d:{
      id:'Agonis mengikat reseptor dan mengaktifkannya, antagonis mengikat tanpa mengaktifkan sekaligus menghalangi agonis bekerja.',
      en:'An agonist binds a receptor and activates it; an antagonist binds without activating and blocks the agonist from acting.'}},
    {id:'t16.9',t:'Efek Samping & Adverse Event',a:'side effect, adverse drug reaction',d:{
      id:'Efek samping adalah efek di luar tujuan terapi yang dapat diperkirakan; adverse drug reaction adalah respons merugikan pada dosis lazim.',
      en:'A side effect is a predictable unintended effect; an adverse drug reaction is a harmful response occurring at normal doses.'}},
    {id:'t16.10',t:'Kontraindikasi',a:'contraindication',d:{
      id:'Keadaan yang membuat suatu obat atau tindakan tidak boleh diberikan; absolut bila mutlak dilarang, relatif bila manfaatnya masih bisa melebihi risiko.',
      en:'A condition in which a drug or procedure must not be given; absolute when strictly forbidden, relative when benefit may still outweigh risk.'}}
  ]},

  {n:17,t:{id:'Prosedur & Pemeriksaan',en:'Procedures & Examination'},items:[
    {id:'t17.1',t:'Anamnesis',a:'history taking',d:{
      id:'Wawancara medis untuk menggali riwayat penyakit; disebut autoanamnesis bila langsung dari pasien dan aloanamnesis bila dari orang lain.',
      en:'The medical interview used to elicit the history; autoanamnesis when taken from the patient and heteroanamnesis when from someone else.'}},
    {id:'t17.2',t:'Inspeksi–Palpasi–Perkusi–Auskultasi',a:'the four examination steps',d:{
      id:'Empat langkah baku pemeriksaan fisik: melihat, meraba, mengetuk, lalu mendengar — pada abdomen urutannya diubah agar auskultasi mendahului palpasi.',
      en:'The four standard steps of physical examination: look, feel, tap, then listen — on the abdomen the order changes so auscultation precedes palpation.'}},
    {id:'t17.3',t:'Diagnosis Banding',a:'differential diagnosis',d:{
      id:'Daftar kemungkinan penyakit yang dapat menjelaskan keluhan pasien, disusun berurutan dari yang paling mungkin dan paling berbahaya.',
      en:'The list of conditions that could explain the patient\'s presentation, ordered by likelihood and by how dangerous each would be to miss.'}},
    {id:'t17.4',t:'Prognosis',a:'prognosis',d:{
      id:'Perkiraan perjalanan dan hasil akhir penyakit, mencakup kemungkinan sembuh, kambuh, cacat, maupun kematian.',
      en:'The predicted course and outcome of a disease, including the chances of recovery, recurrence, disability, or death.'}},
    {id:'t17.5',t:'Biopsi',a:'biopsy',d:{
      id:'Pengambilan contoh jaringan hidup untuk diperiksa mikroskopis; dapat berupa biopsi jarum, insisi, atau eksisi seluruh lesi.',
      en:'Removal of living tissue for microscopic examination, whether by needle, incision, or excision of the whole lesion.'}},
    {id:'t17.6',t:'Punksi',a:'puncture, tap',d:{
      id:'Penusukan jarum untuk mengambil cairan tubuh, misalnya punksi lumbal untuk cairan serebrospinal dan torakosentesis untuk cairan pleura.',
      en:'Needle puncture to obtain body fluid, such as lumbar puncture for cerebrospinal fluid and thoracentesis for pleural fluid.'}},
    {id:'t17.7',t:'Endoskopi',a:'endoscopy',d:{
      id:'Pemeriksaan rongga tubuh dengan alat berkamera yang dimasukkan lewat lubang alami atau sayatan kecil, sekaligus bisa untuk terapi.',
      en:'Inspection of a body cavity using a camera-bearing instrument passed through a natural orifice or small incision, and usable for therapy as well.'}},
    {id:'t17.8',t:'Kateterisasi',a:'catheterization',d:{
      id:'Pemasangan selang ke dalam pembuluh darah atau rongga tubuh untuk diagnostik maupun terapi, misalnya kateterisasi jantung dan kateter urin.',
      en:'Insertion of a tube into a vessel or body cavity for diagnosis or therapy, such as cardiac catheterization and urinary catheterization.'}},
    {id:'t17.9',t:'Informed Consent',a:'persetujuan tindakan medis',d:{
      id:'Persetujuan yang diberikan pasien setelah menerima penjelasan tentang tindakan, manfaat, risiko, dan alternatifnya; syarat sah tindakan medis.',
      en:'Consent given by a patient after being informed of the procedure, its benefits, risks, and alternatives; a legal requirement for medical intervention.'}},
    {id:'t17.10',t:'Triase',a:'triage',d:{
      id:'Pemilahan pasien berdasarkan tingkat kegawatan untuk menentukan urutan penanganan ketika sumber daya terbatas.',
      en:'Sorting patients by severity to determine the order of treatment when resources are limited.'}}
  ]}
];

/* Flat list of every term, each carrying its group for display. */
const TERMS=ISTILAH.flatMap((sys,si)=>
  sys.items.map(it=>({...it,sys:sys.n,sysT:sys.t,pal:PAL[si%PAL.length]}))
);
const TERM_BY_ID=Object.fromEntries(TERMS.map(t=>[t.id,t]));

/* Urutan harian mengambil satu istilah bergiliran dari tiap kelompok, supaya
   istilah tiap hari datang dari sistem yang berbeda-beda — bukan menghabiskan
   satu sistem dulu baru pindah. Tab Istilah tetap menampilkannya per sistem. */
const TERM_SEQ=(()=>{
  const out=[],max=Math.max(...ISTILAH.map(s=>s.items.length));
  for(let i=0;i<max;i++)ISTILAH.forEach(s=>{if(i<s.items.length)out.push(TERM_BY_ID[s.items[i].id]);});
  return out;
})();
