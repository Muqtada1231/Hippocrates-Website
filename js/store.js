/* Hippocrates — central catalog + cart store (single source of truth).
   Loaded as a plain script by every page: window.HIPPO.
   Admin-dashboard ready: every product/offer flag lives in the data below;
   nothing about pricing or discounts is hard-coded in the UI. */
(function () {
  'use strict';

  var CART_KEY = 'hippo:cart:v1';
  var ORDER_KEY = 'hippo:order:v1';
  var PROMO_KEY = 'hippo:promo:v1';
  var SEQ_KEY = 'hippo:orderSeq:v1';
  var LANG_KEY = 'hippo:lang';

  // single source of truth for payment details — screens read from here, never hard-code
  var PAYMENT = {
    id: 'transfer',
    name: 'Hippocrates Transfer',
    nameAr: 'تحويل ابوقراط',
    transferNumber: '917347931532',
    supportUsername: '@Hippocrates_Support',
    supportUrl: 'https://t.me/Hippocrates_Support'
  };

  var LINKS = {
    telegram: 'https://t.me/Hippoocrates',
    instagram: 'https://www.instagram.com/hippocrates.34',
    support: 'https://t.me/Hippocrates_Support',
    supportHandle: '@Hippocrates_Support'
  };

  var STAGES = [
    { id: 1, num: '01', name: 'المرحلة الأولى', nameEn: 'First Stage', tag: 'العلوم الطبية الأساسية', tagEn: 'Basic medical sciences' },
    { id: 2, num: '02', name: 'المرحلة الثانية', nameEn: 'Second Stage', tag: 'تشريح ووظائف الأعضاء', tagEn: 'Anatomy & physiology' },
    { id: 3, num: '03', name: 'المرحلة الثالثة', nameEn: 'Third Stage', tag: 'أساسيات ما قبل السريري', tagEn: 'Pre-clinical foundations' },
    { id: 4, num: '04', name: 'المرحلة الرابعة', nameEn: 'Fourth Stage', tag: 'بداية السريري', tagEn: 'Clinical entry' },
    { id: 5, num: '05', name: 'المرحلة الخامسة', nameEn: 'Fifth Stage', tag: 'تخصصات سريرية', tagEn: 'Clinical specialties' },
    { id: 6, num: '06', name: 'المرحلة السادسة', nameEn: 'Sixth Stage', tag: 'سنة التخرج والامتحان', tagEn: 'Finals year' }
  ];

  /* ── stages a course belongs to ────────────────────────────────────────────
     `stages` (array) is the source of truth. `stage` stays as the legacy primary
     stage so older reads keep working; a course with no `stages` falls back to it. */
  var STAGE_AR = { 1: 'أولى', 2: 'ثانية', 3: 'ثالثة', 4: 'رابعة', 5: 'خامسة', 6: 'سادسة' };
  var STAGE_EN = { 1: '1st', 2: '2nd', 3: '3rd', 4: '4th', 5: '5th', 6: '6th' };

  function courseStages(c) {
    if (!c) return [];
    var list = (c.stages && c.stages.length) ? c.stages : (c.stage == null ? [] : [c.stage]);
    return list.slice().sort(function (a, b) { return a - b; });
  }

  function inStage(c, id) { return courseStages(c).indexOf(id) >= 0; }

  function stageLabel(c, lang) {
    var ids = courseStages(c);
    if (!ids.length) return '';
    var ar = lang !== 'en';
    if (ids.length === 1) {
      var s = STAGES.filter(function (x) { return x.id === ids[0]; })[0];
      return s ? (ar ? s.name : s.nameEn) : '';
    }
    if (ar) return 'مرحلة ' + ids.map(function (n) { return STAGE_AR[n]; }).join(' و');
    var en = ids.map(function (n) { return STAGE_EN[n]; });
    var last = en.pop();
    return en.join(', ') + ' & ' + last + ' Stage';
  }

  var LECTURERS = {
    sajad: { en: 'Sajad Abdul Aziz Khalifa', ar: 'د. سجاد عبد العزيز خليفة', photo: 'assets/lecturers/sajad-abdul-aziz-khalifa.png' },
    hussein: { en: 'Hussein Kamal Shakir', ar: 'حسين كمال شاكر', photo: 'assets/lecturers/hussein.png' },
    asal: { en: 'Asal Ziad Noori', ar: 'عسل زياد نوري', photo: 'assets/lecturers/asal.png' },
    aya: { en: 'Aya Thamer Juma', ar: 'آية ثامر جمعة', photo: 'assets/lecturers/aya-thamer.png' },
    haider: { en: 'Haider Khaled Tarish', ar: 'حيدر خالد طارش', photo: 'assets/lecturers/haider.png' },
    sara: { en: 'Sara Sabah Ali', ar: 'سارة صباح علي', photo: 'assets/lecturers/sara.png' },
    zahraaHasan: { en: 'Zahraa Hasan Hashim', ar: 'زهراء حسن هاشم', photo: 'assets/lecturers/zahraa-hasan.png' },
    zahraaRaad: { en: 'Zahraa Raad Abdullah', ar: 'زهراء رعد عبدالله', photo: 'assets/lecturers/zahraa-raad.png' },
    yaseen: { en: 'Yaseen Nabeel Abdul-Mohsin', ar: 'ياسين نبيل عبد المحسن', photo: 'assets/lecturers/yaseen.png' },
    muqtada: { en: 'Muqtada Ali Muqdad', ar: 'مقتدى علي مقداد', photo: 'assets/lecturers/muqtada.png' },
    narjis: { en: 'Narjis Kadhim Jabur', ar: 'نرجس كاظم جبر', photo: 'assets/lecturers/narjis.png' },
    rafal: { en: 'Rafal Ziad Abdul-Ameer', ar: 'رفل زياد عبد الأمير', photo: 'assets/lecturers/rafal.png' },
    zahraaHamed: { en: 'Zahraa Hamed Wasmi', ar: 'زهراء حامد وسمي', photo: 'assets/lecturers/zahraa-hamid.png' },
    furqan: { en: 'Furqan Abdul-Qadir Khudhiar', ar: 'فرقان عبد القادر خضير', photo: 'assets/lecturers/furqan.png' },
    karrar: { en: 'Karrar Haider Ali', ar: 'كرار حيدر علي', photo: 'assets/lecturers/karrar.png' },
    tabarak: { en: 'Tabarak Sabah Ali', ar: 'تبارك صباح علي', photo: 'assets/lecturers/tabarak.png' }, // placeholder — real photo failed to transfer intact, see report
    ayat: { en: 'Ayat Ghalib Nasser', ar: 'آيات غالب ناصر', photo: 'assets/lecturers/ayat.png' }
  };

  var BADGES = {
    ms: { ar: 'باطنية + جراحة', en: 'Medicine + Surgery' },
    tp: { ar: 'نظري + عملي', en: 'Theory + Practical' },
    clinical: { ar: 'سريري', en: 'Clinical' },
    summaryInc: { ar: 'يشمل ملخص', en: 'Summary Included' },
    summaryOnly: { ar: 'ملخص فقط', en: 'Summary Only' },
    theory: { ar: 'نظري', en: 'Theory' },
    practical: { ar: 'عملي', en: 'Practical' }
  };

  var INC = {
    anatomyIntro: { ar: 'يشمل Introduction to Anatomy', en: 'Includes Introduction to Anatomy' },
    theory: { ar: 'نظري', en: 'Theory' },
    practical: { ar: 'عملي', en: 'Practical' },
    summary: { ar: 'ملخص مشمول', en: 'Summary included' },
    gitMed: { ar: 'باطنية الجهاز الهضمي', en: 'GIT Medicine' },
    gitSurg: { ar: 'جراحة الجهاز الهضمي', en: 'GIT Surgery' },
    respMed: { ar: 'باطنية الجهاز التنفسي', en: 'Respiratory Medicine' },
    respSurg: { ar: 'مواضيع جراحية مرتبطة', en: 'Related surgical topics' },
    cardio: { ar: 'أمراض القلب', en: 'Cardiology' },
    cts: { ar: 'جراحة القلب والصدر', en: 'Cardiothoracic Surgery' },
    ecg: { ar: 'تخطيط القلب ECG', en: 'ECG reading' },
    qbank: { ar: 'بنك أسئلة QBank', en: 'QBank' }
  };

  // price = individual price in IQD · stage: null = not announced · enabled:false hides it
  var COURSES = [
    { id: 'anatomy-upper', title: 'Upper Limb Anatomy', titleAr: 'تشريح الطرف العلوي', lect: 'sajad', stage: 1, stages: [1], price: 35000, tags: ['basic'], includes: ['anatomyIntro'] },
    { id: 'anatomy-lower', title: 'Lower Limb Anatomy', titleAr: 'تشريح الطرف السفلي', lect: 'sajad', stage: 1, stages: [1], price: 30000, tags: ['basic'] },
    { id: 'anatomy-thorax', title: 'Thorax Anatomy', titleAr: 'تشريح الصدر', lect: 'sajad', stage: 1, stages: [1], price: 25000, tags: ['basic'] },
    { id: 'community', title: 'Community Medicine', titleAr: 'طب المجتمع', lect: 'hussein', stage: 4, price: 20000, tags: ['medicine'] },
    { id: 'radio-theory', title: 'Radiology — Theory', titleAr: 'الأشعة — نظري', lect: 'asal', stage: null, price: 20000, tags: [], badge: 'theory' },
    { id: 'radio-prac', title: 'Radiology — Practical', titleAr: 'الأشعة — عملي', lect: 'asal', stage: null, price: 10000, tags: [], badge: 'practical' },
    { id: 'ent', title: 'ENT', titleAr: 'الأنف والأذن والحنجرة', lect: 'aya', stage: 5, price: 15000, tags: ['surgery'], badge: 'tp', includes: ['theory', 'practical'] },
    { id: 'pharma', title: 'Pharmacology', titleAr: 'علم الأدوية', lect: 'haider', stage: 3, price: 25000, tags: ['basic'] },
    { id: 'basic-med', title: 'Basic Medicine', titleAr: 'أساسيات الباطنية', lect: 'muqtada', stage: 3, price: 20000, tags: ['medicine', 'basic'], badge: 'theory', includes: ['theory'] },
    { id: 'pathology', title: 'Pathology', titleAr: 'علم الأمراض', lect: 'tabarak', stage: 3, price: 20000, tags: ['basic'] },
    { id: 'clin-surg', title: 'Clinical Surgery', titleAr: 'الجراحة السريرية', lect: 'sara', stage: 4, stages: [3, 4, 6], price: 15000, tags: ['surgery', 'clinical'], badge: 'clinical' },
    { id: 'derm-theory', title: 'Dermatology — Theory', titleAr: 'الجلدية — النظري', lect: 'zahraaHasan', stage: 5, price: 20000, tags: ['medicine'], badge: 'theory', group: 'derm', includes: ['theory'] },
    { id: 'derm-sum', title: 'Dermatology — Summary', titleAr: 'الجلدية — السمري', lect: 'zahraaHasan', stage: 5, price: 10000, tags: ['summary'], badge: 'summaryOnly', group: 'derm', includes: ['summary'] },
    { id: 'derm-full', title: 'Dermatology — Theory + Summary', titleAr: 'الجلدية — النظري + السمري', lect: 'zahraaHasan', stage: 5, price: 25000, tags: ['medicine', 'summary'], badge: 'summaryInc', group: 'derm', covers: ['derm-theory', 'derm-sum'], includes: ['theory', 'summary'] },
    { id: 'git', title: 'GIT', titleAr: 'الجهاز الهضمي', lect: 'zahraaRaad', stage: 4, stages: [4, 6], price: 30000, tags: ['medicine', 'surgery'], badge: 'ms', includes: ['gitMed', 'gitSurg'] },
    { id: 'resp', title: 'Respiratory', titleAr: 'الجهاز التنفسي', lect: 'yaseen', stage: 4, stages: [4, 6], price: 25000, tags: ['medicine', 'surgery'], badge: 'ms', includes: ['respMed', 'respSurg'] },
    { id: 'cardio', title: 'Cardiology', titleAr: 'أمراض القلب', lect: 'muqtada', stage: 4, stages: [4, 6], price: 25000, tags: ['medicine', 'surgery', 'summary'], badge: 'ms', includes: ['cardio', 'cts', 'summary', 'ecg'] },
    { id: 'clin-med', title: 'Clinical Medicine', titleAr: 'باطنية سريري', lect: 'narjis', stage: 4, stages: [3, 4, 6], price: 20000, tags: ['medicine', 'clinical'], badge: 'clinical' },
    { id: 'obgyn4', title: 'Obstetrics & Gynecology — 4th Stage', titleAr: 'النسائية والتوليد — المرحلة الرابعة', lect: 'rafal', stage: 4, price: 25000, tags: ['clinical', 'summary'], badge: 'summaryInc', includes: ['summary'] },
    { id: 'obgyn5', title: 'Obstetrics & Gynecology — 5th Stage', titleAr: 'النسائية والتوليد — المرحلة الخامسة', lect: 'rafal', stage: 5, price: 25000, tags: ['clinical', 'summary'], badge: 'summaryInc', includes: ['summary'] },
    { id: 'peds4', title: 'Pediatrics — 4th Stage', titleAr: 'طب الأطفال — المرحلة الرابعة', lect: 'zahraaHamed', stage: 4, price: 25000, tags: ['medicine'] },
    { id: 'peds5', title: 'Pediatrics — 5th Stage', titleAr: 'طب الأطفال — المرحلة الخامسة', lect: 'zahraaHamed', stage: 5, price: 15000, tags: ['medicine'] },
    { id: 'ortho', title: 'Orthopedics', titleAr: 'الكسور والمفاصل', lect: 'muqtada', stage: 5, price: 30000, tags: ['surgery', 'summary'], badge: 'summaryInc', includes: ['summary'] },
    { id: 'psych', title: 'Psychiatry', titleAr: 'الطب النفسي', lect: 'furqan', stage: 5, price: 10000, tags: ['medicine'] },
    { id: 'biochem', title: 'Biochemistry', titleAr: 'الكيمياء الحياتية', lect: 'karrar', stage: 2, price: 15000, tags: ['basic'] },
    { id: 'physiology', title: 'Physiology', titleAr: 'الفسلجة', lect: 'ayat', stage: 2, price: 25000, tags: ['basic'] }
  ];

  // packages reference course ids · price is the package's own promo price
  // originalPrice optional — summed from referenced courses when omitted
  var PACKAGES = [
    {
      id: 'anatomy-ul-ll', enabled: true, stage: 1,
      name: 'Upper Limb + Lower Limb', nameAr: 'الطرف العلوي + الطرف السفلي',
      desc: 'First-year Anatomy with Sajad Abdul Aziz Khalifa.',
      descAr: 'تشريح المرحلة الأولى مع د. سجاد عبد العزيز خليفة.',
      courses: ['anatomy-upper', 'anatomy-lower'], price: 60000
    },
    {
      id: 'anatomy-ll-thorax', enabled: true, stage: 1,
      name: 'Lower Limb + Thorax', nameAr: 'الطرف السفلي + الصدر',
      desc: 'First-year Anatomy with Sajad Abdul Aziz Khalifa.',
      descAr: 'تشريح المرحلة الأولى مع د. سجاد عبد العزيز خليفة.',
      courses: ['anatomy-lower', 'anatomy-thorax'], price: 50000
    },
    {
      id: 'anatomy-complete', enabled: true, stage: 1,
      name: 'Upper Limb + Lower Limb + Thorax', nameAr: 'بكج التشريح الكامل',
      desc: 'Complete first-year Anatomy with Sajad Abdul Aziz Khalifa.',
      descAr: 'تشريح المرحلة الأولى كاملاً مع د. سجاد عبد العزيز خليفة.',
      courses: ['anatomy-upper', 'anatomy-lower', 'anatomy-thorax'], price: 80000
    },
    {
      id: 'year3', featured: true, bestValue: false, enabled: true, stage: 3,
      name: 'Third Year Package', nameAr: 'بكج المرحلة الثالثة',
      desc: 'The third-year basic sciences load in one enrollment.',
      descAr: 'منهج المرحلة الثالثة الأساسي بتسجيل واحد.',
      courses: ['basic-med', 'pharma', 'pathology'],
      price: 50000, offer: { enabled: true, start: null, end: null },
      allocation: { 'basic-med': 15500, pharma: 19000, pathology: 15500 }
    },
    {
      id: 'year4', featured: true, bestValue: true, enabled: true, stage: 4,
      name: 'Fourth Year Package', nameAr: 'بكج المرحلة الرابعة',
      desc: 'The full fourth-year clinical load in one enrollment.',
      descAr: 'منهج المرحلة الرابعة كامل بتسجيل واحد.',
      courses: ['git', 'cardio', 'resp', 'obgyn4', 'peds4', 'community', 'clin-med', 'clin-surg'],
      price: 130000, offer: { enabled: true, start: null, end: null },
      allocation: { git: 21000, cardio: 17500, resp: 17500, obgyn4: 17500, peds4: 17500, community: 14000, 'clin-med': 14000, 'clin-surg': 11000 }
    },
    {
      id: 'year5', featured: true, bestValue: false, enabled: true, stage: 5,
      name: 'Fifth Year Package', nameAr: 'بكج المرحلة الخامسة',
      desc: 'Every fifth-year specialty course, bundled.',
      descAr: 'كل تخصصات المرحلة الخامسة بحزمة واحدة.',
      courses: ['ortho', 'derm-full', 'ent', 'psych', 'obgyn5', 'peds5'],
      price: 80000, offer: { enabled: true, start: null, end: null }
    },
    {
      id: 'year6', featured: true, bestValue: false, enabled: true, purchasable: false, stage: 6,
      name: 'Sixth Year Comprehensive Package', nameAr: 'بكج المرحلة السادسة',
      desc: 'Medicine + Surgery + Obs & Gyne + Pediatrics — four major final-year components.',
      descAr: 'الباطنية + الجراحة + النسائية والتوليد + الأطفال — أربعة محاور أساسية لسنة التخرج.',
      courses: [],
      // commercial reference values for the finals year only — they never overwrite
      // the individual 4th/5th stage Obs&Gyne or Pediatrics prices
      refItems: [
        { id: 'ref-medicine', title: 'Internal Medicine — Full Theory', titleAr: 'الباطنية — النظري كامل', price: 75000 },
        { id: 'ref-surgery', title: 'Surgery — Full Theory', titleAr: 'الجراحة — النظري كامل', price: 50000 },
        { id: 'ref-obgyn', title: 'Obstetrics & Gynecology', titleAr: 'النسائية والتوليد', price: 50000 },
        { id: 'ref-peds', title: 'Pediatrics', titleAr: 'طب الأطفال', price: 40000 }
      ],
      price: 100000, offer: { enabled: true, start: null, end: null },
      allocation: { 'ref-medicine': 35000, 'ref-surgery': 23000, 'ref-obgyn': 23000, 'ref-peds': 19000 }
    },
    {
      id: 'cardioresp', enabled: true, stage: 4,
      name: 'Cardiorespiratory Package', nameAr: 'بكج القلب والجهاز التنفسي',
      desc: 'Cardiology and respiratory together.',
      descAr: 'القلب والجهاز التنفسي مع بعض.',
      courses: ['cardio', 'resp'], price: 40000,
      allocation: { cardio: 20000, resp: 20000 }
    },
    {
      id: 'gitcore', enabled: true, stage: 4,
      name: 'GIT Clinical Core', nameAr: 'الأساس السريري للجهاز الهضمي',
      desc: 'GIT medicine and surgery with clinical surgery.',
      descAr: 'باطنية وجراحة الجهاز الهضمي مع الجراحة السريرية.',
      courses: ['git', 'clin-surg'], price: 35000,
      allocation: { git: 23500, 'clin-surg': 11500 }
    },
    {
      id: 'obspeds4', enabled: true, stage: 4,
      name: '4th Stage Obs & Pediatrics Package', nameAr: 'بكج النسائية والأطفال — المرحلة الرابعة',
      desc: 'Obstetrics & Gynecology with Pediatrics, fourth stage.',
      descAr: 'النسائية والتوليد مع طب الأطفال للمرحلة الرابعة.',
      courses: ['obgyn4', 'peds4'], price: 40000,
      allocation: { obgyn4: 20000, peds4: 20000 }
    },
    {
      id: 'obspeds5', enabled: true, stage: 5,
      name: '5th Stage Obs & Pediatrics Package', nameAr: 'بكج النسائية والأطفال — المرحلة الخامسة',
      desc: 'Obstetrics & Gynecology with Pediatrics, fifth stage.',
      descAr: 'النسائية والتوليد مع طب الأطفال للمرحلة الخامسة.',
      courses: ['obgyn5', 'peds5'], price: 35000,
      allocation: { obgyn5: 22000, peds5: 13000 }
    },
    {
      id: 'radiology', enabled: true,
      name: 'Radiology Complete', nameAr: 'الأشعة كاملة',
      desc: 'Radiology theory and practical in one course.',
      descAr: 'الأشعة نظري وعملي بكورس واحد.',
      courses: ['radio-theory', 'radio-prac'], price: 25000
    }
  ];

  // variant bundles derive their "instead of" value from the options they replace
  COURSES.forEach(function (c) {
    if (!c.covers || c.originalPrice != null) return;
    c.originalPrice = c.covers.reduce(function (sum, id) {
      var part = null;
      for (var i = 0; i < COURSES.length; i++) if (COURSES[i].id === id) part = COURSES[i];
      return sum + (part ? part.price : 0);
    }, 0);
  });

  var FILTERS = [
    { id: 'all', ar: 'الكل', en: 'All' },
    { id: 'medicine', ar: 'باطنية', en: 'Medicine' },
    { id: 'surgery', ar: 'جراحة', en: 'Surgery' },
    { id: 'clinical', ar: 'سريري', en: 'Clinical' },
    { id: 'summary', ar: 'ملخصات', en: 'Summaries' },
    { id: 'basic', ar: 'علوم أساسية', en: 'Basic sciences' }
  ];

  /* ── pricing helpers — every discount derives from the data ── */
  function money(n) { return Number(n || 0).toLocaleString('en-US') + ' IQD'; }

  function pctLabel(raw) { return String(Math.round(raw)) + '%'; }

  function courseById(id) {
    for (var i = 0; i < COURSES.length; i++) if (COURSES[i].id === id) return COURSES[i];
    return null;
  }

  function packageById(id) {
    for (var i = 0; i < PACKAGES.length; i++) if (PACKAGES[i].id === id) return PACKAGES[i];
    return null;
  }

  function pkgMath(p) {
    var items = (p.courses || []).map(courseById).filter(Boolean);
    if (p.refItems && p.refItems.length) items = items.concat(p.refItems);
    var original = p.originalPrice != null ? p.originalPrice : items.reduce(function (s, c) { return s + c.price; }, 0);
    var save = Math.max(0, original - p.price);
    return {
      items: items, original: original, price: p.price, save: save,
      pct: pctLabel(original > 0 ? (save / original) * 100 : 0)
    };
  }

  function courseMath(c) {
    var original = c.originalPrice != null ? c.originalPrice : c.price;
    var save = Math.max(0, original - c.price);
    return { original: original, price: c.price, save: save, pct: pctLabel(original > 0 ? (save / original) * 100 : 0) };
  }

  function offerLive(p) {
    var o = p.offer;
    if (!o || !o.enabled) return false;
    var now = new Date();
    if (o.start && new Date(o.start) > now) return false;
    if (o.end && new Date(o.end) < now) return false;
    return true;
  }

  function initials(en) {
    var parts = String(en || '').split(/\s+/).filter(Boolean);
    if (!parts.length) return '';
    return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
  }

  function stageById(id) {
    for (var i = 0; i < STAGES.length; i++) if (STAGES[i].id === id) return STAGES[i];
    return null;
  }

  /* ── cart (localStorage; swap these four fns for API calls when a backend lands) ── */
  function readJSON(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return fallback;
      var v = JSON.parse(raw);
      return v == null ? fallback : v;
    } catch (e) { return fallback; }
  }
  function writeJSON(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* private mode */ }
  }

  function getCart() {
    var items = readJSON(CART_KEY, []);
    if (!Array.isArray(items)) return [];
    return items.filter(function (it) {
      if (!it || !it.productId) return false;
      return it.type === 'package' ? !!packageById(it.productId) : !!courseById(it.productId);
    });
  }

  function setCart(items) {
    writeJSON(CART_KEY, items);
    try { window.dispatchEvent(new CustomEvent('hippo:cart', { detail: { count: items.length } })); } catch (e) {}
  }

  function inCart(type, productId) {
    return getCart().some(function (it) { return it.type === type && it.productId === productId; });
  }

  /* بكج العرض فقط ما يدخل السلة. السيرفر يرفضه على أي حال
     (hippo_resolve_cart)، وهذا يمنع الطالب من الوصول لتلك النقطة أصلاً. */
  function isPurchasable(type, productId) {
    if (type !== 'package') return true;
    var p = packageById(productId);
    return !p || p.purchasable !== false;
  }

  function addToCart(type, productId) {
    if (!isPurchasable(type, productId)) return false;
    if (inCart(type, productId)) return false;
    var items = getCart();
    items.push({
      id: 'ci_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      type: type, productId: productId, quantity: 1, addedAt: new Date().toISOString()
    });
    setCart(items);
    return true;
  }

  function removeFromCart(cartId) {
    setCart(getCart().filter(function (it) { return it.id !== cartId; }));
  }

  function clearCart() { setCart([]); }

  function cartCount() { return getCart().length; }

  /* resolved cart lines — prices always come from the catalog, never from storage */
  function cartLines() {
    return getCart().map(function (it) {
      if (it.type === 'package') {
        var p = packageById(it.productId);
        var m = pkgMath(p);
        return {
          cartId: it.id, type: 'package', product: p, courses: m.items,
          original: m.original, price: m.price, save: m.save, pct: m.pct
        };
      }
      var c = courseById(it.productId);
      var cm = courseMath(c);
      return {
        cartId: it.id, type: 'course', product: c, courses: [],
        original: cm.original, price: cm.price, save: cm.save, pct: cm.pct
      };
    });
  }

  function cartTotals() {
    var lines = cartLines();
    var subtotal = lines.reduce(function (s, l) { return s + l.original; }, 0);
    var afterBundle = lines.reduce(function (s, l) { return s + l.price; }, 0);
    var bundleDiscount = subtotal - afterBundle;
    var promo = getPromo();
    // the stored amount is only ever a server-issued figure; it is re-validated
    // again by the create-order function before an order is ever written
    var promoDiscount = promo ? Math.max(0, Math.min(Number(promo.discount) || 0, afterBundle)) : 0;
    var total = Math.max(0, afterBundle - promoDiscount);
    return {
      lines: lines, subtotal: subtotal, afterBundle: afterBundle,
      bundleDiscount: bundleDiscount,
      promoCode: promo ? promo.code : '', promoDiscount: promoDiscount,
      promoType: promo ? promo.discountType : '', promoValue: promo ? promo.discountValue : 0,
      total: total, discount: bundleDiscount + promoDiscount, savings: bundleDiscount + promoDiscount
    };
  }

  /* ── promo codes ──────────────────────────────────────────────────────────
     Nothing here decides a discount. The cart asks the server for a preview
     (validate-promo) and stores only what the server returned; create-order
     validates the code a second time before any order exists. Applying a code
     in the cart writes no redemption row, so it consumes no usage. */
  function apiBase() {
    var c = window.HIPPO_CONFIG || {};
    return c.useDatabase && c.supabaseUrl ? String(c.supabaseUrl).replace(/\/+$/, '') : '';
  }

  function postJSON(url, body) {
    var key = (window.HIPPO_CONFIG || {}).supabaseAnonKey || '';
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: key, Authorization: 'Bearer ' + key },
      body: JSON.stringify(body)
    }).then(function (r) {
      return r.text().then(function (txt) {
        var data = null;
        try { data = txt ? JSON.parse(txt) : null; } catch (e) {}
        return { status: r.status, data: data };
      });
    });
  }

  /* Two server transports, tried in order and then remembered: the SQL
     functions (hippo_validate_promo / hippo_place_order — no deploy step) and
     the Edge Functions. Either way the decision is made on the server; the
     browser sends product ids and a code, never an amount. */
  var RPC_NAME = { 'validate-promo': 'hippo_validate_promo', 'create-order': 'hippo_place_order' };
  var transport = null;

  function rpcArgs(name, payload) {
    if (name === 'validate-promo') {
      return { p_code: payload.code, p_items: payload.items, p_telegram: payload.telegram || '' };
    }
    return { p_student: payload.student, p_items: payload.items, p_code: payload.code || null };
  }

  function callFn(name, payload) {
    var base = apiBase();
    if (!base) return Promise.reject(new Error('no-backend'));

    function viaRpc() {
      return postJSON(base + '/rest/v1/rpc/' + RPC_NAME[name], rpcArgs(name, payload)).then(function (r) {
        if (!r.data || r.status >= 400 || typeof r.data.ok !== 'boolean') throw new Error('rpc-unavailable');
        return r.data;
      });
    }
    function viaEdge() {
      return postJSON(base + '/functions/v1/' + name, payload).then(function (r) {
        if (!r.data) throw new Error('edge-unavailable');
        return r.data;
      });
    }

    if (transport === 'rpc') return viaRpc();
    if (transport === 'fn') return viaEdge();
    return viaRpc().then(
      function (d) { transport = 'rpc'; return d; },
      function () { return viaEdge().then(function (d) { transport = 'fn'; return d; }); }
    );
  }

  function cartPayload() {
    return getCart().map(function (it) { return { type: it.type, productId: it.productId }; });
  }

  function getPromo() {
    var p = readJSON(PROMO_KEY, null);
    return p && p.code ? p : null;
  }

  function storePromo(p) {
    if (p) writeJSON(PROMO_KEY, p);
    else { try { localStorage.removeItem(PROMO_KEY); } catch (e) {} }
    try { window.dispatchEvent(new CustomEvent('hippo:promo', { detail: p || null })); } catch (e) {}
  }

  function removePromo() { storePromo(null); }

  function validatePromo(code, telegram) {
    return callFn('validate-promo', {
      code: String(code || '').trim().toUpperCase(),
      items: cartPayload(),
      telegram: telegram || ''
    });
  }

  function applyPromo(code, telegram) {
    var clean = String(code || '').trim().toUpperCase();
    if (!clean) return Promise.resolve({ ok: false, key: 'missing' });
    if (!getCart().length) return Promise.resolve({ ok: false, key: 'empty' });
    return validatePromo(clean, telegram).then(function (res) {
      if (res && res.ok) {
        var p = {
          code: res.code || clean,
          discountType: res.discountType, discountValue: res.discountValue,
          discount: res.discount, appliedAt: new Date().toISOString()
        };
        storePromo(p);
        return { ok: true, promo: p };
      }
      return { ok: false, key: (res && res.key) || 'invalid', reason: res && res.reason, reasonAr: res && res.reasonAr };
    }, function () { return { ok: false, key: 'network' }; });
  }

  /* re-check the stored code whenever the cart changes — scope or minimums may
     no longer hold, and a stale discount must never survive an edit */
  function refreshPromo(telegram) {
    var cur = getPromo();
    if (!cur) return Promise.resolve(null);
    if (!getCart().length) { removePromo(); return Promise.resolve(null); }
    return validatePromo(cur.code, telegram).then(function (res) {
      if (res && res.ok) {
        storePromo({
          code: res.code || cur.code, discountType: res.discountType,
          discountValue: res.discountValue, discount: res.discount, appliedAt: cur.appliedAt
        });
        return getPromo();
      }
      removePromo();
      return null;
    }, function () { return cur; });
  }

  /* duplicate detection: what already in the cart overlaps with what is being added */
  function conflictsFor(type, productId) {
    var lines = cartLines();
    var out = [];
    if (type === 'package') {
      var ids = (packageById(productId) || {}).courses || [];
      lines.forEach(function (l) {
        if (l.type === 'course' && ids.indexOf(l.product.id) >= 0) out.push({ cartId: l.cartId, kind: 'course', product: l.product });
        if (l.type === 'package' && l.product.id !== productId) {
          var overlap = (l.product.courses || []).filter(function (x) { return ids.indexOf(x) >= 0; });
          if (overlap.length) out.push({ cartId: l.cartId, kind: 'package', product: l.product, overlap: overlap.length });
        }
      });
    } else {
      var adding = courseById(productId) || {};
      var covers = adding.covers || [];
      lines.forEach(function (l) {
        if (l.type === 'package' && (l.product.courses || []).indexOf(productId) >= 0) {
          out.push({ cartId: l.cartId, kind: 'package', product: l.product });
        }
        if (l.type === 'course') {
          var inCartCovers = l.product.covers || [];
          if (covers.indexOf(l.product.id) >= 0 || inCartCovers.indexOf(productId) >= 0) {
            out.push({ cartId: l.cartId, kind: 'course', product: l.product });
          }
        }
      });
    }
    return out;
  }

  /* upsell — separate options in the cart that one bundle covers for less */
  function upsellFor() {
    var ids = getCart().filter(function (it) { return it.type === 'course'; }).map(function (it) { return it.productId; });
    for (var i = 0; i < COURSES.length; i++) {
      var b = COURSES[i];
      if (!b.covers || b.covers.length < 2 || ids.indexOf(b.id) >= 0) continue;
      var all = b.covers.every(function (id) { return ids.indexOf(id) >= 0; });
      if (!all) continue;
      var paid = b.covers.reduce(function (s2, id) { return s2 + (courseById(id) || {}).price; }, 0);
      if (paid <= b.price) continue;
      return { bundle: b, replaces: b.covers.slice(), paid: paid, price: b.price, save: paid - b.price };
    }
    return null;
  }

  function applyUpsell(u) {
    if (!u) return false;
    setCart(getCart().filter(function (it) { return !(it.type === 'course' && u.replaces.indexOf(it.productId) >= 0); }));
    return addToCart('course', u.bundle.id);
  }

  /* ── orders ── */
  function nextOrderId() {
    var seq = parseInt(readJSON(SEQ_KEY, 123), 10);
    if (isNaN(seq)) seq = 123;
    seq += 1;
    writeJSON(SEQ_KEY, seq);
    var year = new Date().getFullYear();
    return 'HIPP-' + year + '-' + String(seq).padStart(6, '0');
  }

  /* local invoice — used only when the order function is unreachable.
     A promo is deliberately dropped here: no discount exists without a
     server-issued figure. */
  function localOrder(student) {
    var lines = cartLines();
    var subtotal = lines.reduce(function (s, l) { return s + l.original; }, 0);
    var total = lines.reduce(function (s, l) { return s + l.price; }, 0);
    return {
      id: nextOrderId(),
      createdAt: new Date().toISOString(),
      status: 'pending',
      offline: true,
      student: student,
      lines: lines.map(function (l) {
        return {
          type: l.type, productId: l.product.id,
          name: l.product.name || l.product.title, nameAr: l.product.nameAr || l.product.titleAr,
          courses: l.courses.map(function (c) { return { id: c.id, title: c.title, titleAr: c.titleAr, price: c.price, lect: c.lect }; }),
          original: l.original, price: l.price, save: l.save, pct: l.pct
        };
      }),
      subtotal: subtotal, bundleDiscount: subtotal - total,
      promoCode: '', promoDiscount: 0,
      discount: subtotal - total, total: total, savings: subtotal - total
    };
  }

  function orderFromServer(res, student) {
    var lines = (res.lines || []).map(function (l) {
      var original = l.original != null ? l.original : l.price;
      var save = Math.max(0, original - l.price);
      return {
        type: l.type, productId: l.productId,
        name: l.name, nameAr: l.nameAr,
        courses: (l.contents || []).map(function (c) {
          return { id: c.id, title: c.title, titleAr: c.titleAr, price: c.price };
        }),
        original: original, price: l.price, save: save,
        pct: pctLabel(original > 0 ? (save / original) * 100 : 0)
      };
    });
    return {
      id: res.orderNo || res.orderId,
      uuid: res.orderId,
      createdAt: res.createdAt || new Date().toISOString(),
      status: res.status || 'pending',
      student: student,
      lines: lines,
      subtotal: res.subtotal,
      bundleDiscount: res.bundleDiscount || 0,
      promoCode: res.promoCode || '',
      promoDiscount: res.promoDiscount || 0,
      discount: res.discount != null ? res.discount : (res.bundleDiscount || 0) + (res.promoDiscount || 0),
      total: res.total,
      savings: res.discount != null ? res.discount : (res.bundleDiscount || 0) + (res.promoDiscount || 0)
    };
  }

  /* The server recomputes every price, re-validates the promo code and records
     the redemption. The browser sends product ids and a code — never an amount.
     Resolves { ok:true, order, offline? } or { ok:false, ...reason }. */
  function createOrder(student) {
    var promo = getPromo();
    var payload = {
      student: {
        name: student.name, telegram: student.telegram, stage: student.stage,
        /* الهاتف والبريد اختياريان. السيرفر هو اللي ينظّفهما ويتحقق منهما —
           هنا نمرّرهما فقط. البريد يُوحَّد لحروف صغيرة عند الحفظ بالسيرفر. */
        phone: student.phone || '', email: student.email || ''
      },
      items: cartPayload(),
      code: promo ? promo.code : null
    };
    return callFn('create-order', payload).then(function (res) {
      if (res && res.ok) {
        var order = orderFromServer(res, student);
        writeJSON(ORDER_KEY, order);
        removePromo();
        return { ok: true, order: order };
      }
      if (res && res.promoRejected) {
        removePromo();
        return { ok: false, promoRejected: true, key: res.key, reason: res.reason, reasonAr: res.reasonAr };
      }
      return { ok: false, key: (res && res.key) || 'server', reason: res && res.reason, reasonAr: res && res.reasonAr };
    }, function () {
      var order = localOrder(student);
      writeJSON(ORDER_KEY, order);
      removePromo();
      return { ok: true, offline: true, order: order };
    });
  }

  function getOrder() { return readJSON(ORDER_KEY, null); }

  /* ── live catalogue ────────────────────────────────────────────────────────
     The catalogue above is the offline copy: it paints instantly and keeps the
     site working if the database is unreachable. Straight after boot we ask
     Supabase for the real one, because the server prices every order from those
     same tables — so whatever the admin dashboard saves is what the site must
     show. A partial or empty answer is ignored rather than emptying the shop. */
  function getRows(table, select) {
    var base = apiBase();
    if (!base) return Promise.reject(new Error('no-backend'));
    var key = (window.HIPPO_CONFIG || {}).supabaseAnonKey || '';
    return fetch(base + '/rest/v1/' + table + '?select=' + encodeURIComponent(select), {
      headers: { apikey: key, Authorization: 'Bearer ' + key }
    }).then(function (r) {
      if (!r.ok) throw new Error(table + ' ' + r.status);
      return r.json();
    });
  }

  function bySortOrder(a, b) { return (a.sort_order || 0) - (b.sort_order || 0); }

  function courseFromRow(r) {
    var c = {
      id: r.key, title: r.title, titleAr: r.title_ar, lect: r.lecturer_key,
      stage: r.stage, price: r.price, tags: r.tags || [], enabled: r.enabled !== false
    };
    if (r.stages && r.stages.length) c.stages = r.stages;
    if (r.original_price != null) c.originalPrice = r.original_price;
    if (r.badge) c.badge = r.badge;
    if (r.includes && r.includes.length) c.includes = r.includes;
    if (r.group_key) c.group = r.group_key;
    if (r.covers && r.covers.length) c.covers = r.covers;
    return c;
  }

  function packageFromRow(r) {
    var contents = (r.package_courses || []).slice().sort(bySortOrder);
    var refs = (r.package_ref_items || []).slice().sort(bySortOrder);
    var p = {
      id: r.key, name: r.name, nameAr: r.name_ar,
      desc: r.description, descAr: r.description_ar,
      stage: r.stage, price: r.price,
      featured: !!r.featured, bestValue: !!r.best_value, enabled: r.enabled !== false,
      purchasable: r.purchasable !== false,
      courses: contents.map(function (x) { return x.course_id; }),
      offer: { enabled: r.promo_enabled !== false, start: r.promo_start || null, end: r.promo_end || null }
    };
    if (r.original_price != null) p.originalPrice = r.original_price;
    var alloc = {};
    contents.forEach(function (x) { if (x.allocation != null) alloc[x.course_id] = x.allocation; });
    if (refs.length) {
      p.refItems = refs.map(function (x) {
        return { id: x.ref_key, title: x.title, titleAr: x.title_ar, price: x.price };
      });
      refs.forEach(function (x) { if (x.allocation != null) alloc[x.ref_key] = x.allocation; });
    }
    if (Object.keys(alloc).length) p.allocation = alloc;
    return p;
  }

  /* replace contents in place — every page already holds a reference to these */
  function swap(target, rows) { target.length = 0; Array.prototype.push.apply(target, rows); }

  function loadCatalog() {
    return Promise.all([
      getRows('courses', '*'),
      getRows('packages', '*,package_courses(course_id,allocation,sort_order),package_ref_items(ref_key,title,title_ar,price,allocation,sort_order)'),
      getRows('lecturers', '*')
    ]).then(function (res) {
      var courses = (res[0] || []).slice().sort(bySortOrder).map(courseFromRow);
      var packages = (res[1] || []).slice().sort(bySortOrder).map(packageFromRow);
      var lecturers = res[2] || [];
      // an empty or clearly broken answer must never blank the shop
      if (!courses.length || !packages.length || !lecturers.length) return false;

      swap(COURSES, courses);
      swap(PACKAGES, packages);
      lecturers.forEach(function (l) {
        LECTURERS[l.key] = { en: l.name_en, ar: l.name_ar, photo: l.photo || (l.key === 'aya' ? 'assets/lecturers/aya-thamer.png' : '') };
      });
      // bundles priced "instead of" their parts recompute from the live prices
      COURSES.forEach(function (c) {
        if (!c.covers || c.originalPrice != null) return;
        c.originalPrice = c.covers.reduce(function (sum, id) {
          var part = courseById(id);
          return sum + (part ? part.price : 0);
        }, 0);
      });
      return true;
    }).catch(function () { return false; });
  }

  function getLang() { try { return localStorage.getItem(LANG_KEY) === 'en' ? 'en' : 'ar'; } catch (e) { return 'ar'; } }
  function setLang(v) { try { localStorage.setItem(LANG_KEY, v === 'en' ? 'en' : 'ar'); } catch (e) {} }

  window.HIPPO = {
    LINKS: LINKS, PAYMENT: PAYMENT, STAGES: STAGES, LECTURERS: LECTURERS, BADGES: BADGES, INC: INC,
    COURSES: COURSES, PACKAGES: PACKAGES, FILTERS: FILTERS,
    money: money, pctLabel: pctLabel, courseById: courseById, packageById: packageById,
    courseStages: courseStages, inStage: inStage, stageLabel: stageLabel,
    pkgMath: pkgMath, courseMath: courseMath, offerLive: offerLive, initials: initials, stageById: stageById,
    getCart: getCart, inCart: inCart, addToCart: addToCart, removeFromCart: removeFromCart,
    isPurchasable: isPurchasable,
    clearCart: clearCart, cartCount: cartCount, cartLines: cartLines, cartTotals: cartTotals,
    conflictsFor: conflictsFor, upsellFor: upsellFor, applyUpsell: applyUpsell, createOrder: createOrder, getOrder: getOrder,
    getPromo: getPromo, applyPromo: applyPromo, removePromo: removePromo, refreshPromo: refreshPromo, validatePromo: validatePromo,
    getLang: getLang, setLang: setLang,
    reloadCatalog: loadCatalog,
    CART_PAGE: 'cart.html'
  };
  try { window.dispatchEvent(new Event('hippo:ready')); } catch (e) {}

  /* Pages paint from the offline copy first, then repaint once — and only if —
     the live catalogue actually arrives. */
  loadCatalog().then(function (changed) {
    if (!changed) return;
    try { window.dispatchEvent(new Event('hippo:catalog')); } catch (e) {}
  });
})();
