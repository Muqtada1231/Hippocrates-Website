(function () {
  'use strict';

  var FACULTY = [
    { photo: 'assets/lecturers/sajad-abdul-aziz-khalifa.png', name: 'د. سجاد عبد العزيز خليفة', nameEn: 'Sajad Abdul Aziz Khalifa', subject: 'Anatomy · First Year', gpa: '78.38' },
    { photo: 'assets/lecturers/muqtada.png', name: 'د. مقتدى علي', nameEn: 'Dr. Muqtada Ali', subject: 'Medicine · Cardiology', gpa: '81.37', founder: true },
    { photo: 'assets/lecturers/ayat.png', name: 'د. ايات غالب', nameEn: 'Dr. Ayat Ghalib', subject: 'Physiology', gpa: '80.99' },
    { photo: 'assets/lecturers/karrar.png', name: 'د. كرار حيدر', nameEn: 'Dr. Karrar Haider', subject: 'Biochemistry · Immunology', gpa: '72.9' },
    { photo: 'assets/lecturers/tabarak.png', name: 'د. تبارك صباح', nameEn: 'Dr. Tabarak Sabah', subject: 'Pathology', gpa: '' },
    { photo: 'assets/lecturers/haider.png', name: 'د. حيدر خالد', nameEn: 'Dr. Haider Khaled', subject: 'Pharmacology', gpa: '82.56' },
    { photo: 'assets/lecturers/rafal.png', name: 'د. رفل زياد', nameEn: 'Dr. Rafal Ziyad', subject: 'Obs & Gyn', gpa: '79.72' },
    { photo: 'assets/lecturers/sara.png', name: 'د. سارة صباح', nameEn: 'Dr. Sara Sabah', subject: 'Clinical Surgery', gpa: '79.2' },
    { photo: 'assets/lecturers/zahraa-raad.png', name: 'د. زهراء رعد', nameEn: 'Dr. Zahraa Raad', subject: 'GIT', gpa: '87.54' },
    { photo: 'assets/lecturers/narjis.png', name: 'د. نرجس كاظم', nameEn: 'Dr. Narjis Kadhim', subject: 'Clinical Medicine', gpa: '82.41' },
    { photo: 'assets/lecturers/yaseen.png', name: 'د. ياسين نبيل', nameEn: 'Dr. Yaseen Nabeel', subject: 'Respiratory', gpa: '77.49' },
    { photo: 'assets/lecturers/zahraa-hamid.png', name: 'د. زهراء حامد', nameEn: 'Dr. Zahraa Hamid', subject: 'Pediatrics', gpa: '80.23' },
    { photo: 'assets/lecturers/zahraa-hasan.png', name: 'د. زهراء حسن', nameEn: 'Dr. Zahraa Hasan', subject: 'Dermatology', gpa: '82.64' },
    { photo: 'assets/lecturers/aya-thamer.png', name: 'د. اية ثامر', nameEn: 'Dr. Aya Thamer', subject: 'ENT', gpa: '72.6' },
    { photo: 'assets/lecturers/furqan.png', name: 'د. فرقان عبد القادر', nameEn: 'Dr. Furqan Abdulqadir', subject: 'Psychiatry · Neurology', gpa: '74.92' },
    { photo: 'assets/lecturers/asal.png', name: 'د. عسل زياد', nameEn: 'Dr. Asal Ziad', subject: 'Radiology', gpa: '82.42' },
    { photo: 'assets/lecturers/hussein.png', name: 'د. حسين كمال', nameEn: 'Dr. Hussein Kamal', subject: 'Community Medicine', gpa: '76.56' }
  ];

  /* same order as the lecturers page: founder first, then GPA highest-first,
     anyone without a recorded GPA last */
  FACULTY.sort(function (a, b) {
    if (!!a.founder !== !!b.founder) return a.founder ? -1 : 1;
    var ga = parseFloat(a.gpa), gb = parseFloat(b.gpa);
    if (isNaN(ga) && isNaN(gb)) return 0;
    if (isNaN(ga)) return 1;
    if (isNaN(gb)) return -1;
    return gb - ga;
  });

  var COPY = {
    ar: {
      register: 'سجّل الآن', arrow: '←', lecturers: 'المحاضرون',
      s1: 'مراحل دراسية', s2: 'كورس متاح', s3: 'محاضر',
      chooseStage: 'اختر مرحلتك',
      chooseHint: 'اختر مرحلتك الدراسية وتظهر لك كورسات هذه المرحلة فقط — بدون بحث ولا لبس بأي كورس يخصك.',
      showAll: 'اعرض كل المراحل', allCourses: 'كل الكورسات',
      lecturerRole: 'محاضر معتمد — ابوقراط',
      initial: 'د',
      orbitKicker: 'منظومة ابوقراط',
      orbitTitle: 'كل اللي تحتاجه بمكان واحد',
      orbitSub: 'من الشرح إلى المراجعة وبنك الأسئلة — كل أدوات دراستك مرتبة ضمن مسار واحد.',
      o1: 'بنك أسئلة', o2: 'مراجعة امتحانية', o3: 'شرح تفصيلي', o5: 'كورسات منظمة', o6: 'ملازم وملخصات',
      lecturersTitle: 'المحاضرون',
      lecturersHint: 'كل مادة عندها محاضر مسؤول عنها — طبيب متخرّج بمعدل متميز وله خبرة فعلية بالشرح والتلخيص. شوف ملفه التعريفي قبل ما تسجّل.',
      lecturersCta: 'شوف كل المحاضرين وملفاتهم',
      lecturersNote: '17 محاضر · 23 كورس طبي',
      fPackages: 'الباقات',
      viewCourse: 'شوف الكورس',
      emptyStage: 'كورسات هذه المرحلة قريباً — تصفّح باقي الكورسات الآن.',
      soon: 'قريباً',
      stagePkg: 'بكج المرحلة',
      seePackage: 'شوف البكج',
      emptyStagePkg: 'محتوى هذه المرحلة متوفر كبكج شامل — كل المواد الأساسية بتسجيل واحد.',
      pkgKicker: 'وفّر أكثر',
      pkgTitle: 'وفّر أكثر مع الباقات',
      pkgSub: 'الباقة تجمع كورسات مرحلتك بسعر أقل من شرائها منفصلة',
      bestValue: 'أفضل قيمة',
      firstMonth: 'خصم الشهر الأول',
      getPackage: 'احصل على الباقة',
      viewDetails: 'التفاصيل',
      individualValue: 'القيمة الإفرادية',
      packagePrice: 'سعر الباقة',
      youSave: 'توفيرك',
      includedCourses: 'الكورسات المشمولة',
      close: 'إغلاق',
      instead: 'بدلاً من',
      heading: function (s) { return 'كورسات ' + s; }, count: function (n) { return n + ' كورسات'; },
      navApp: 'حمّل التطبيق',
      appTitle: 'حمّل التطبيق',
      appSub: 'كل كورساتك ومحتواك الدراسي بمكان واحد — تابع دروسك وملازمك من الموبايل بأي وقت.',
      appStoreSmall: 'حمّل من', playSmall: 'احصل عليه من',
      followTitle: 'تابعنا',
      followSub: 'كل الكورسات الجديدة والعروض تنشر أول شي على قناة التليكرام وحساب الانستغرام.',
      tgName: 'قناة التليكرام', igName: 'حساب الانستغرام',
      joinNow: 'انضم للقناة', followNow: 'تابع الحساب',
      contact: 'تواصل معنا', contactCta: 'راسل الدعم',
      cart: 'السلة', addToCart: 'أضف إلى السلة', inCart: 'موجود بالسلة ✓', addPkg: 'أضف الباقة للسلة',
      displayOnly: 'للعرض فقط', displayOnlyNote: 'غير معروض للبيع — الوصول يُمنح من الإدارة.', refValue: 'القيمة المرجعية',
      toastAdded: 'تمت الإضافة إلى السلة ✓', toastAlready: 'موجود بالسلة أصلاً', toastKept: 'مشمول ضمن باقة موجودة بالسلة',
      viewCart: 'شوف السلة',
      dupTitle: 'محتوى مكرر',
      dupPkgBody: 'الكورسات التالية موجودة بسلتك وهي أصلاً مشمولة بهذه الباقة — لا تدفع مرتين لنفس المحتوى:',
      dupCourseBody: 'هذا الكورس مشمول أصلاً بباقة موجودة بسلتك:',
      dupVariantBody: 'اختيارك هذا يشمل محتوى موجود بسلتك — الأفضل تستبدله بدل ما تدفع مرتين:',
      dupCleanVariant: 'استبدله بالخيار الكامل (مستحسن)',
      dupCleanPkg: 'احذف الكورسات المكررة وأضف الباقة',
      dupCleanCourse: 'خلّي الباقة فقط (مستحسن)',
      dupBoth: 'أضف الاثنين',
      off: function (p) { return 'خصم ' + p; },
      included: function (n) { return n + ' كورسات مشمولة'; }
    },
    en: {
      register: 'Enroll now', arrow: '→', lecturers: 'Lecturers',
      s1: 'Stages', s2: 'Courses', s3: 'Lecturers',
      chooseStage: 'Choose your stage',
      chooseHint: 'Pick your academic stage and only its courses appear — no searching, no guessing which course is yours.',
      showAll: 'Show all stages', allCourses: 'All courses',
      lecturerRole: 'Verified lecturer — Hippocrates',
      initial: 'D',
      orbitKicker: 'The Hippocrates system',
      orbitTitle: 'Everything You Need in One Place',
      orbitSub: 'From detailed explanations to exam reviews and QBank — your study tools in one organized pathway.',
      o1: 'QBank', o2: 'Exam Review', o3: 'Detailed Explanations', o5: 'Structured Courses', o6: 'Notes & Summaries',
      lecturersTitle: 'Our lecturers',
      lecturersHint: 'Every subject has a lecturer behind it — a graduated doctor with a strong record and real teaching experience. Read their profile before you enroll.',
      lecturersCta: 'See all lecturers & profiles',
      lecturersNote: '17 lecturers · 23 medical courses',
      fPackages: 'Packages',
      viewCourse: 'View course',
      emptyStage: 'Courses for this stage are coming soon — browse the rest of the catalog.',
      soon: 'Soon',
      stagePkg: 'Package',
      seePackage: 'View the package',
      emptyStagePkg: 'This stage is offered as one comprehensive package — every major component in a single enrollment.',
      pkgKicker: 'Save more',
      pkgTitle: 'Save More with Packages',
      pkgSub: 'A package bundles your stage’s courses for less than buying them one by one — all prices in IQD, savings calculated for you.',
      bestValue: 'BEST VALUE',
      firstMonth: 'First Month Offer',
      getPackage: 'Get package',
      viewDetails: 'Details',
      individualValue: 'Individual value',
      packagePrice: 'Package price',
      youSave: 'You save',
      includedCourses: 'Included courses',
      close: 'Close',
      instead: 'Instead of',
      heading: function (s) { return s + ' — courses'; }, count: function (n) { return n + ' courses'; },
      navApp: 'Get the app',
      appTitle: 'Get the app',
      appSub: 'All your courses and study material in one place — follow your lectures and notes from your phone, anytime.',
      appStoreSmall: 'Download on the', playSmall: 'Get it on',
      followTitle: 'Follow us',
      followSub: 'New courses and offers are announced first on the Telegram channel and Instagram.',
      tgName: 'Telegram channel', igName: 'Instagram',
      joinNow: 'Join channel', followNow: 'Follow',
      contact: 'Contact us', contactCta: 'Message support',
      cart: 'Cart', addToCart: 'Add to cart', inCart: 'Already in cart ✓', addPkg: 'Add package to cart',
      displayOnly: 'Display only', displayOnlyNote: 'Not for sale — access is granted by the team.', refValue: 'Reference value',
      toastAdded: 'Added to cart ✓', toastAlready: 'Already in your cart', toastKept: 'Already included in a package in your cart',
      viewCart: 'View cart',
      dupTitle: 'Duplicate content',
      dupPkgBody: 'These courses are in your cart and already included in this package — don’t pay twice for the same content:',
      dupCourseBody: 'This course is already included in a package in your cart:',
      dupVariantBody: 'This option already covers content in your cart — replace it instead of paying twice:',
      dupCleanVariant: 'Replace with the complete option (recommended)',
      dupCleanPkg: 'Remove duplicates and add the package',
      dupCleanCourse: 'Keep the package only (recommended)',
      dupBoth: 'Keep both',
      off: function (p) { return p + ' OFF'; },
      included: function (n) { return n + ' courses included'; }
    }
  };

  var state = { lang: 'ar', stage: 0, filter: 'all', pkg: null, warn: null };

  var root = document.getElementById('root');
  var header = document.getElementById('header');
  var btnAr = document.getElementById('btn-ar');
  var btnEn = document.getElementById('btn-en');
  var stageGrid = document.getElementById('stage-grid');
  var filterChips = document.getElementById('filter-chips');
  var courseGrid = document.getElementById('course-grid');
  var activeHeading = document.getElementById('active-heading');
  var activeCount = document.getElementById('active-count');
  var emptyState = document.getElementById('empty-state');
  var btnClear = document.getElementById('btn-clear');
  var lectGrid = document.getElementById('lect-grid');
  var lectCtaArrow = document.getElementById('lect-cta-arrow');
  var pkgFeatured = document.getElementById('pkg-featured');
  var pkgCompact = document.getElementById('pkg-compact');
  var cartBadge = document.getElementById('cart-badge');

  var pmOverlay = document.getElementById('pkg-modal-overlay');
  var pmSheet = document.getElementById('pkg-modal-sheet');
  var warnOverlay = document.getElementById('warn-modal-overlay');
  var warnSheet = document.getElementById('warn-modal-sheet');
  var toastEl = document.getElementById('toast');
  var toastTimer = null;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function checkIcon() {
    return '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0E7490" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
  }

  function H() { return window.HIPPO; }

  /* Radiology stays a package in the catalog, cart, order, and finance paths.
     This projection changes storefront placement only, for both the built-in
     fallback catalog and the live Supabase catalog loaded after first paint. */
  function storefrontCourses(h) {
    var list = h.COURSES.map(function (c) {
      if (c.id !== 'radio-theory' && c.id !== 'radio-prac') return c;
      return Object.assign({}, c, { stage: 5, stages: [5] });
    });
    var p = h.packageById('radiology');
    if (!p || p.enabled === false) return list;
    var theory = h.courseById('radio-theory');
    var practical = h.courseById('radio-prac');
    var original = (theory ? theory.price : 0) + (practical ? practical.price : 0);
    list.push({
      id: p.id,
      title: 'Radiology — Theory + Practical',
      titleAr: 'الأشعة — نظري + عملي',
      lect: (theory && theory.lect) || (practical && practical.lect) || 'asal',
      stage: 5,
      stages: [5],
      price: p.price,
      originalPrice: p.originalPrice != null ? p.originalPrice : original,
      tags: [],
      badge: 'tp',
      includes: ['theory', 'practical'],
      cartType: 'package'
    });
    return list;
  }

  function storefrontPackages(h) {
    return h.PACKAGES.filter(function (p) { return p.id !== 'radiology'; });
  }

  /* ── toast ── */
  function flash(kind) {
    var t = COPY[state.lang];
    toastEl.querySelector('#toast-text').textContent =
      kind === 'added' ? t.toastAdded : kind === 'kept' ? t.toastKept : t.toastAlready;
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.hidden = true; }, 3600);
  }

  /* ── cart add / conflict resolution ── */
  function addItem(type, id) {
    var h = H();
    if (!h) return;
    if (h.inCart(type, id)) { flash('already'); return; }
    var conf = h.conflictsFor(type, id);
    if (conf.length) { openWarn(type, id, conf); return; }
    h.addToCart(type, id);
    flash('added');
    renderStages(); renderCourses(); renderPackages();
  }

  function openWarn(type, id, conf) {
    var t = COPY[state.lang];
    var ar = state.lang === 'ar';
    var isVariant = conf.some(function (c) { return c.kind === 'course'; }) && type === 'course';
    var body = type === 'package' ? t.dupPkgBody : (isVariant ? t.dupVariantBody : t.dupCourseBody);
    var cleanLabel = type === 'package' ? t.dupCleanPkg : (isVariant ? t.dupCleanVariant : t.dupCleanCourse);

    document.getElementById('warn-body').textContent = body;
    document.getElementById('warn-rows').innerHTML = conf.map(function (c) {
      var p = c.product;
      var name = ar ? (p.nameAr || p.titleAr) : (p.name || p.title);
      return '<li>' + esc(name) + '</li>';
    }).join('');
    document.getElementById('warn-clean').textContent = cleanLabel;

    state.warn = { type: type, id: id, conf: conf };
    warnOverlay.classList.remove('hidden');

    document.getElementById('warn-clean').onclick = function () { resolveWarn('clean'); };
    document.getElementById('warn-both').onclick = function () { resolveWarn('both'); };
  }

  function closeWarn() {
    state.warn = null;
    warnOverlay.classList.add('hidden');
  }

  function resolveWarn(mode) {
    var w = state.warn;
    var h = H();
    if (!w || !h) return;
    if (mode === 'clean') {
      var variants = w.conf.filter(function (c) { return c.kind === 'course'; });
      if (w.type === 'course' && !variants.length) {
        closeWarn(); flash('kept'); return;
      }
      (w.type === 'course' ? variants : w.conf).forEach(function (c) { h.removeFromCart(c.cartId); });
    }
    h.addToCart(w.type, w.id);
    closeWarn();
    flash('added');
    renderStages(); renderCourses(); renderPackages();
  }

  warnOverlay.addEventListener('click', closeWarn);
  warnSheet.addEventListener('click', function (e) { e.stopPropagation(); });

  /* ── package details modal ── */
  function openPkgModal(id) {
    var h = H();
    var p = h.packageById(id);
    if (!p) return;
    var ar = state.lang === 'ar';
    var t = COPY[state.lang];
    var m = h.pkgMath(p);

    document.getElementById('pm-name').textContent = ar ? p.nameAr : p.name;
    document.getElementById('pm-rows').innerHTML = m.items.map(function (c) {
      var L = h.LECTURERS[c.lect] || { en: '', ar: '' };
      var hasPhoto = !!L.photo;
      var avatar = hasPhoto
        ? '<img src="' + L.photo + '" alt="' + esc(ar ? L.ar : L.en) + '" loading="lazy">'
        : '<span class="hip-pkg-modal-avatar-txt">' + esc(h.initials(L.en)) + '</span>';
      return (
        '<div class="hip-pkg-modal-row">' +
          '<span class="hip-pkg-modal-avatar">' + avatar + '</span>' +
          '<span class="hip-pkg-modal-row-info">' +
            '<span class="hip-pkg-modal-row-name">' + esc(ar ? c.titleAr : c.title) + '</span>' +
            '<span class="hip-pkg-modal-row-lect">' + esc(ar ? L.ar : L.en) + '</span>' +
          '</span>' +
          '<span class="hip-pkg-modal-row-price mono">' + esc(h.money(c.price)) + '</span>' +
        '</div>'
      );
    }).join('');
    /* بكج العرض فقط: القيمة المرجعية تبقى ظاهرة، ودلالات الخصم تختفي */
    var buyable = p.purchasable !== false;
    document.getElementById('pm-original').textContent = h.money(m.original);
    document.getElementById('pm-price').textContent = h.money(m.price);
    var pmSave = document.getElementById('pm-save');
    var pmPct = document.getElementById('pm-pct');
    pmSave.textContent = buyable ? h.money(m.save) : '';
    pmPct.textContent = buyable ? (m.pct + ' ' + (ar ? 'خصم' : 'OFF')) : '';
    if (pmSave.parentNode) pmSave.parentNode.hidden = !buyable;
    pmPct.hidden = !buyable;

    var addBtn = document.getElementById('pm-add');
    addBtn.hidden = !buyable;
    addBtn.disabled = !buyable;
    if (buyable) {
      addBtn.textContent = h.inCart('package', p.id) ? t.inCart : t.addPkg;
      addBtn.onclick = function () { addItem('package', p.id); closePkgModal(); };
    } else {
      addBtn.onclick = null;
    }
    var pmNote = document.getElementById('pm-display-note');
    if (!pmNote) {
      pmNote = document.createElement('p');
      pmNote.id = 'pm-display-note';
      pmNote.className = 'hip-pkg-display-note';
      addBtn.parentNode.insertBefore(pmNote, addBtn);
    }
    pmNote.hidden = buyable;
    pmNote.textContent = buyable ? '' : t.displayOnlyNote;

    state.pkg = id;
    pmOverlay.classList.remove('hidden');
  }

  function closePkgModal() {
    state.pkg = null;
    pmOverlay.classList.add('hidden');
  }

  pmOverlay.addEventListener('click', closePkgModal);
  pmSheet.addEventListener('click', function (e) { e.stopPropagation(); });
  document.getElementById('pm-close').addEventListener('click', closePkgModal);

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (state.pkg) closePkgModal();
    if (state.warn) closeWarn();
  });

  /* scrolls the courses heading clear of the sticky header — only ever called from a stage click */
  var calmMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  function toCourses() {
    var target = document.getElementById('courses');
    if (!target) return;
    var offset = (header ? header.offsetHeight : 64) + 20;
    var y = target.getBoundingClientRect().top + window.pageYOffset - offset;
    if (Math.abs(y - window.pageYOffset) < 4) return;
    window.scrollTo({ top: Math.max(0, y), behavior: calmMotion ? 'auto' : 'smooth' });
  }

  /* ── cart badge ── */
  function updateCartBadge() {
    var h = H();
    var n = h ? h.cartCount() : 0;
    cartBadge.textContent = String(n);
    cartBadge.hidden = n === 0;
  }

  /* ── stages ── */
  function renderStages() {
    var h = H();
    var t = COPY[state.lang];
    var ar = state.lang === 'ar';
    var displayCourses = storefrontCourses(h);
    var displayPackages = storefrontPackages(h);
    stageGrid.innerHTML = h.STAGES.map(function (s) {
      var on = s.id === state.stage;
      var n = displayCourses.filter(function (c) { return c.enabled !== false && h.inStage(c, s.id); }).length;
      var np = displayPackages.filter(function (p) { return p.enabled !== false && p.stage === s.id; }).length;
      var pulse = on ? '#B08D57' : 'rgba(14,116,144,.35)';
      return (
        '<button type="button" class="hip-stage' + (on ? ' active' : '') + '" data-stage-id="' + s.id + '" aria-pressed="' + on + '">' +
          '<span class="hip-stage-top">' +
            '<span class="hip-stage-num mono">' + s.num + '</span>' +
            '<span class="hip-stage-count">' + (n ? t.count(n) : (np ? t.stagePkg : t.soon)) + '</span>' +
          '</span>' +
          '<span class="hip-stage-name">' + esc(ar ? s.name : s.nameEn) + '</span>' +
          '<span class="hip-stage-tag">' + esc(ar ? s.tag : s.tagEn) + '</span>' +
          '<svg class="hip-stage-pulse-svg" viewBox="0 0 200 24" preserveAspectRatio="none" aria-hidden="true">' +
            '<polyline points="0,13 68,13 72,10.6 76,13 96,13 99,14.6 102,3.2 105,18.4 108,13 119,13 125,8.4 131,13 200,13" stroke="' + pulse + '"></polyline>' +
          '</svg>' +
        '</button>'
      );
    }).join('');

    Array.prototype.forEach.call(stageGrid.querySelectorAll('.hip-stage'), function (btn) {
      btn.addEventListener('click', function () {
        state.stage = parseInt(btn.getAttribute('data-stage-id'), 10);
        renderStages();
        renderCourses();
        toCourses();
      });
    });
  }

  /* ── filter chips ── */
  function renderFilters() {
    var h = H();
    var ar = state.lang === 'ar';
    filterChips.innerHTML = h.FILTERS.map(function (f) {
      var on = f.id === state.filter;
      return '<button type="button" class="hip-chip' + (on ? ' active' : '') + '" data-filter-id="' + f.id + '">' + esc(ar ? f.ar : f.en) + '</button>';
    }).join('');

    Array.prototype.forEach.call(filterChips.querySelectorAll('.hip-chip'), function (btn) {
      btn.addEventListener('click', function () {
        state.filter = btn.getAttribute('data-filter-id');
        renderFilters();
        renderCourses();
      });
    });
  }

  /* ── courses ── */
  function renderCourses() {
    var h = H();
    var t = COPY[state.lang];
    var ar = state.lang === 'ar';
    var stage = state.stage;
    var filter = state.filter;

    var list = storefrontCourses(h).filter(function (c) {
      if (c.enabled === false) return false;
      if (stage && !h.inStage(c, stage)) return false;
      return filter === 'all' || (c.tags || []).indexOf(filter) >= 0;
    });
    /* الأعلى سعراً أولاً — والمتساوية تبقى بترتيب الكتالوك (الفرز ثابت) */
    list.sort(function (a, b) { return b.price - a.price; });
    var active = h.STAGES.filter(function (s) { return s.id === stage; })[0];
    var stagePkgs = stage ? storefrontPackages(h).filter(function (p) { return p.enabled !== false && p.stage === stage; }) : [];

    activeHeading.textContent = active ? t.heading(ar ? active.name : active.nameEn) : t.allCourses;
    activeCount.textContent = t.count(list.length);

    emptyState.hidden = list.length !== 0;
    if (list.length === 0) {
      var emptyMsg = stagePkgs.length ? t.emptyStagePkg : t.emptyStage;
      emptyState.innerHTML = '<span>' + esc(emptyMsg) + '</span>' +
        (stagePkgs.length ? '<a href="#packages" class="btn btn-primary" style="margin-top:14px">' + esc(t.seePackage) + '<span class="btn-arrow">' + t.arrow + '</span></a>' : '');
    }

    courseGrid.innerHTML = list.map(function (c, idx) {
      var L = h.LECTURERS[c.lect] || { en: '', ar: '' };
      var stLabel = h.stageLabel(c, state.lang);
      var cm = h.courseMath(c);
      var badge = c.badge && h.BADGES[c.badge] ? (ar ? h.BADGES[c.badge].ar : h.BADGES[c.badge].en) : '';
      var items = (c.includes || []).concat(['qbank']).map(function (k) { return ar ? h.INC[k].ar : h.INC[k].en; });
      var cartType = c.cartType || 'course';
      var inCart = h.inCart(cartType, c.id);
      var avatar = L.photo
        ? '<img src="' + L.photo + '" alt="' + esc(ar ? L.ar : L.en) + '" loading="lazy" class="hip-course-avatar-img">'
        : '<span class="hip-course-avatar">' + esc(h.initials(L.en)) + '</span>';

      return (
        '<article class="hip-course" style="animation-delay:' + (idx * 0.05) + 's">' +
          '<div class="hip-course-top">' +
            (stLabel ? '<span class="hip-course-stage-label">' + esc(stLabel) + '</span>' : '<span></span>') +
            (badge ? '<span class="hip-course-badge2">' + esc(badge) + '</span>' : '') +
          '</div>' +
          '<h4 class="hip-course-title">' + esc(c.title) + '</h4>' +
          (ar && c.titleAr ? '<div class="hip-course-title-ar">' + esc(c.titleAr) + '</div>' : '') +
          '<div class="hip-course-lecturer">' +
            avatar +
            '<span class="hip-course-lecturer-info">' +
              '<span class="hip-course-lecturer-name">' + esc(ar ? L.ar : L.en) + '</span>' +
              '<span class="hip-course-lecturer-role">' + esc(t.lecturerRole) + '</span>' +
            '</span>' +
          '</div>' +
          '<ul class="hip-course-items">' +
            items.map(function (it) { return '<li>' + checkIcon() + esc(it) + '</li>'; }).join('') +
          '</ul>' +
          '<div class="hip-course-foot">' +
            '<div class="hip-course-price-row">' +
              '<span class="hip-course-price mono">' + esc(h.money(c.price)) + '</span>' +
              (cm.save > 0 ? '<span class="hip-course-oldprice mono">' + esc(h.money(cm.original)) + '</span><span class="hip-course-pct">' + esc(t.off(cm.pct)) + '</span>' : '') +
            '</div>' +
            '<button type="button" class="btn hip-course-cta' + (inCart ? ' in-cart' : '') + '" data-add-course="' + c.id + '" data-add-type="' + cartType + '">' + (inCart ? t.inCart : t.addToCart) + '</button>' +
          '</div>' +
        '</article>'
      );
    }).join('');

    Array.prototype.forEach.call(courseGrid.querySelectorAll('[data-add-course]'), function (btn) {
      btn.addEventListener('click', function () {
        addItem(btn.getAttribute('data-add-type') || 'course', btn.getAttribute('data-add-course'));
      });
    });
  }

  /* ── packages ── */
  function renderPackages() {
    var h = H();
    var t = COPY[state.lang];
    var ar = state.lang === 'ar';

    var vals = storefrontPackages(h).filter(function (p) { return p.enabled !== false; }).map(function (p) {
      var m = h.pkgMath(p);
      return {
        raw: p, id: p.id,
        name: ar ? p.nameAr : p.name,
        desc: ar ? p.descAr : p.desc,
        featured: !!p.featured,
        /* منتج غير قابل للشراء ما يحمل أي دلالة تجارية: لا شارة عرض ولا
           حملة خصم ولا "الأفضل قيمة" ولا نسبة خصم ولا سطر توفير. تبقى
           القيمة المرجعية ومعلومات البكج ظاهرة. هذا الشرط على purchasable
           نفسه، مو على promo_enabled — حتى لو انقلب عَلَم العروض غلطاً
           لاحقاً، ما تظهر شارة على منتج ما ينباع. */
        best: (p.purchasable !== false && p.bestValue) ? t.bestValue : '',
        offer: (p.purchasable !== false && h.offerLive(p)) ? t.firstMonth : '',
        countLabel: t.included(m.items.length),
        items: m.items.map(function (c) { return ar ? c.titleAr : c.title; }),
        original: h.money(m.original),
        price: h.money(m.price),
        pctNum: m.pct,
        save: h.money(m.save),
        inCart: h.inCart('package', p.id),
        purchasable: p.purchasable !== false
      };
    });

    var featured = vals.filter(function (v) { return v.featured; });
    var compact = vals.filter(function (v) { return !v.featured; });
    var offWord = ar ? 'خصم' : 'OFF';

    pkgFeatured.innerHTML = featured.map(function (v) {
      return (
        '<article class="hip-pkg-card featured">' +
          '<div class="hip-pkg-badges">' +
            (v.best ? '<span class="hip-pkg-badge best">' + esc(v.best) + '</span>' : '') +
            (v.offer ? '<span class="hip-pkg-badge offer">' + esc(v.offer) + '</span>' : '') +
          '</div>' +
          '<h3 class="hip-pkg-name">' + esc(v.name) + '</h3>' +
          '<p class="hip-pkg-desc">' + esc(v.desc) + '</p>' +
          '<div class="hip-pkg-count">' + esc(v.countLabel) + '</div>' +
          '<ul class="hip-pkg-items grid">' +
            v.items.map(function (it) { return '<li>' + checkIcon() + esc(it) + '</li>'; }).join('') +
          '</ul>' +
          '<div class="hip-pkg-pricebox">' +
            '<div class="hip-pkg-instead-row">' +
              '<span class="hip-pkg-instead-label">' + esc(v.purchasable ? t.instead : t.refValue) + '</span>' +
              '<span class="hip-pkg-strike mono">' + esc(v.original) + '</span>' +
              (v.purchasable
                ? '<span class="hip-pkg-off-pill"><span class="mono">' + esc(v.pctNum) + '</span> ' + esc(offWord) + '</span>'
                : '') +
            '</div>' +
            '<div class="hip-pkg-price mono">' + esc(v.price) + '</div>' +
            (v.purchasable
              ? '<div class="hip-pkg-save"><span class="mono">' + esc(v.save) + '</span> ' + esc(t.youSave) + '</div>'
              : '') +
          '</div>' +
          '<div class="hip-pkg-actions">' +
            (v.purchasable
              ? '<button type="button" class="btn hip-pkg-add' + (v.inCart ? ' in-cart' : '') + '" data-pkg-add="' + v.id + '">' + esc(v.inCart ? t.inCart : t.getPackage) + '<span class="btn-arrow">' + t.arrow + '</span></button>'
              : '<div class="hip-pkg-display-only"><span class="hip-pkg-display-tag">' + esc(t.displayOnly) + '</span>' +
                '<span class="hip-pkg-display-note">' + esc(t.displayOnlyNote) + '</span></div>') +
            '<button type="button" class="hip-pkg-details" data-pkg-open="' + v.id + '">' + esc(t.viewDetails) + '</button>' +
          '</div>' +
        '</article>'
      );
    }).join('');

    pkgCompact.innerHTML = compact.map(function (v) {
      return (
        '<article class="hip-pkg-card compact">' +
          '<div class="hip-pkg-badges">' +
            (v.purchasable
              ? '<span class="hip-pkg-off-pill"><span class="mono">' + esc(v.pctNum) + '</span> ' + esc(offWord) + '</span>'
              : '<span class="hip-pkg-display-tag">' + esc(t.displayOnly) + '</span>') +
            (v.offer ? '<span class="hip-pkg-badge offer">' + esc(v.offer) + '</span>' : '') +
          '</div>' +
          '<h3 class="hip-pkg-name compact">' + esc(v.name) + '</h3>' +
          '<div class="hip-pkg-count">' + esc(v.countLabel) + '</div>' +
          '<ul class="hip-pkg-items">' +
            v.items.map(function (it) { return '<li>' + checkIcon() + esc(it) + '</li>'; }).join('') +
          '</ul>' +
          '<div class="hip-pkg-compact-foot">' +
            '<div class="hip-pkg-compact-price-row">' +
              '<span class="hip-pkg-price compact mono">' + esc(v.price) + '</span>' +
              '<span class="hip-pkg-strike mono">' + esc(v.original) + '</span>' +
            '</div>' +
            (v.purchasable
              ? '<div class="hip-pkg-save compact"><span class="mono">' + esc(v.save) + '</span> ' + esc(t.youSave) + '</div>'
              : '') +
            '<div class="hip-pkg-actions compact">' +
              (v.purchasable
                ? '<button type="button" class="hip-pkg-add-outline' + (v.inCart ? ' in-cart' : '') + '" data-pkg-add="' + v.id + '">' + esc(v.inCart ? t.inCart : t.getPackage) + '<span class="btn-arrow">' + t.arrow + '</span></button>'
                : '<div class="hip-pkg-display-only"><span class="hip-pkg-display-tag">' + esc(t.displayOnly) + '</span></div>') +
              '<button type="button" class="hip-pkg-details" data-pkg-open="' + v.id + '">' + esc(t.viewDetails) + '</button>' +
            '</div>' +
          '</div>' +
        '</article>'
      );
    }).join('');

    Array.prototype.forEach.call(document.querySelectorAll('[data-pkg-add]'), function (btn) {
      btn.addEventListener('click', function () { addItem('package', btn.getAttribute('data-pkg-add')); });
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-pkg-open]'), function (btn) {
      btn.addEventListener('click', function () { openPkgModal(btn.getAttribute('data-pkg-open')); });
    });
  }

  function renderLecturers() {
    var ar = state.lang === 'ar';
    lectGrid.innerHTML = FACULTY.map(function (p) {
      return (
        '<a href="lecturers.html" class="hip-lect">' +
          '<img src="' + p.photo + '" alt="' + esc(ar ? p.name : p.nameEn) + '" loading="lazy">' +
          '<span class="hip-lect-name">' + esc(ar ? p.name : p.nameEn) + '</span>' +
          '<span class="hip-lect-subject">' + esc(p.subject) + '</span>' +
        '</a>'
      );
    }).join('');
  }

  function applyI18n() {
    var t = COPY[state.lang];
    Array.prototype.forEach.call(document.querySelectorAll('[data-i18n]'), function (el) {
      var key = el.getAttribute('data-i18n');
      if (t[key] === undefined) return;
      var arrowSpan = el.querySelector('.btn-arrow');
      if (arrowSpan) {
        el.firstChild.textContent = t[key];
      } else {
        el.textContent = t[key];
      }
    });
    lectCtaArrow.textContent = t.arrow;
  }

  function renderHeroStats() {
    var h = H();
    var n = h.STAGES.length;
    document.getElementById('stat-stages').textContent = n < 10 ? '0' + n : String(n);
    document.getElementById('stat-courses').textContent = String(h.COURSES.filter(function (c) { return c.enabled !== false; }).length);
    document.getElementById('stat-lecturers').textContent = String(Object.keys(h.LECTURERS).length);
  }

  function applyLang() {
    var ar = state.lang === 'ar';
    root.setAttribute('dir', ar ? 'rtl' : 'ltr');
    btnAr.classList.toggle('active', ar);
    btnEn.classList.toggle('active', !ar);
    applyI18n();
    renderStages();
    renderFilters();
    renderCourses();
    renderPackages();
    renderLecturers();
    renderHeroStats();
  }

  btnAr.addEventListener('click', function () { state.lang = 'ar'; if (H()) H().setLang('ar'); applyLang(); });
  btnEn.addEventListener('click', function () { state.lang = 'en'; if (H()) H().setLang('en'); applyLang(); });
  btnClear.addEventListener('click', function () { state.stage = 0; renderStages(); renderCourses(); });

  /* ── follow-us nav dropdown ── */
  (function () {
    var wrap = document.getElementById('follow-wrap');
    var toggle = document.getElementById('follow-toggle');
    var menu = document.getElementById('follow-menu');
    if (!wrap || !toggle || !menu) return;

    function close() { menu.hidden = true; toggle.setAttribute('aria-expanded', 'false'); }
    function open() { menu.hidden = false; toggle.setAttribute('aria-expanded', 'true'); }

    toggle.addEventListener('click', function () {
      if (menu.hidden) open(); else close();
    });
    document.addEventListener('click', function (e) {
      if (!wrap.contains(e.target)) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  })();

  function boot() {
    if (H()) state.lang = H().getLang();
    applyLang();
    updateCartBadge();
  }
  if (window.HIPPO) boot();
  else window.addEventListener('hippo:ready', boot);

  /* the live catalogue landed after first paint — redraw with the real prices */
  window.addEventListener('hippo:catalog', boot);

  window.addEventListener('hippo:cart', updateCartBadge);
  window.addEventListener('storage', updateCartBadge);

  /* ---------- header scroll compacting ---------- */
  var scrollRaf = null;
  window.addEventListener('scroll', function () {
    if (scrollRaf) return;
    scrollRaf = requestAnimationFrame(function () {
      scrollRaf = null;
      header.classList.toggle('is-compact', (window.scrollY || 0) > 40);
    });
  }, { passive: true });

  /* ---------- scroll reveal ---------- */
  var calm = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  if ('IntersectionObserver' in window && !calm) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        entry.target.classList.add('is-visible');
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    Array.prototype.forEach.call(document.querySelectorAll('[data-reveal]'), function (el) {
      io.observe(el);
    });
  } else {
    Array.prototype.forEach.call(document.querySelectorAll('[data-reveal]'), function (el) {
      el.classList.add('is-visible');
    });
  }

  /* ---------- orbit animation ---------- */
  (function orbit() {
    var box = document.getElementById('orbit');
    if (!box) return;
    var nodes = Array.prototype.slice.call(box.querySelectorAll('.hip-node'));
    if (!nodes.length) return;

    var rtl = getComputedStyle(box).direction === 'rtl';
    var dir = rtl ? -1 : 1;
    var state2 = nodes.map(function (el) {
      return { el: el, speed: 1, target: 1, drift: 0, w: el.offsetWidth, h: el.offsetHeight };
    });
    var o = { w: 0, h: 0, clock: 0, last: 0, rx: 0, ry: 0, period: 25000 };

    nodes.forEach(function (el, i) {
      var item = state2[i];
      el.addEventListener('pointerenter', function () { item.target = 0.06; run(); });
      el.addEventListener('pointerleave', function () { item.target = 1; run(); });
    });

    function measure() {
      var r = box.getBoundingClientRect();
      o.w = r.width; o.h = r.height;
      var maxNode = 150;
      var small = r.width < 520;
      o.rx = Math.max(70, r.width / 2 - maxNode * (small ? 0.48 : 0.56));
      o.ry = Math.max(70, r.height / 2 - maxNode * (small ? 0.52 : 0.58));
      o.period = small ? 30000 : 25000;
      frame(0);
    }

    function frame(dt) {
      if (!o.rx) return;
      var step = Math.PI * 2 / state2.length;
      var omega = Math.PI * 2 / o.period;
      if (!calm) o.clock += dt;
      for (var k = 0; k < state2.length; k++) {
        var n = state2[k];
        if (!calm) {
          n.speed += (n.target - n.speed) * 0.09;
          n.drift += dir * omega * dt * (n.speed - 1);
          if (n.target > 0.9 && Math.abs(n.drift) > 0.0005) n.drift *= 0.988;
        }
        var a = dir * o.clock * omega + k * step + n.drift;
        var cosA = Math.cos(a);
        var x = o.w / 2 + o.rx * Math.sin(a);
        var y = o.h / 2 - o.ry * cosA;
        var d = (1 - cosA) / 2;
        var hov = 1 + 0.05 * (1 - Math.max(0, Math.min(1, (n.speed - 0.06) / 0.94)));
        var sc = calm ? 1 : (0.88 + 0.12 * d) * hov;
        var op = calm ? 1 : 0.65 + 0.35 * d;
        var el = n.el;
        el.style.transform = 'translate3d(' + (x - n.w / 2).toFixed(1) + 'px,' + (y - n.h / 2).toFixed(1) + 'px,0) scale(' + sc.toFixed(3) + ')';
        el.style.opacity = op.toFixed(3);
        el.style.zIndex = String(10 + Math.round(d * 40));
      }
    }

    var raf = null;
    function run() {
      if (raf || calm) return;
      o.last = performance.now();
      function tick(now) {
        var t = now || performance.now();
        var dt = Math.min(50, t - o.last);
        o.last = t;
        frame(dt);
        raf = requestAnimationFrame(tick);
      }
      raf = requestAnimationFrame(tick);
    }

    if ('ResizeObserver' in window) {
      new ResizeObserver(measure).observe(box);
    } else {
      window.addEventListener('resize', measure);
    }
    measure();
    if (!calm) {
      setTimeout(run, 300);
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) run();
            else if (raf) { cancelAnimationFrame(raf); raf = null; }
          });
        }, { rootMargin: '30% 0px' }).observe(box);
      }
    }
  })();
})();
