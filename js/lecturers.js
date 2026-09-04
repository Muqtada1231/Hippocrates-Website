(function () {
  'use strict';

  var PEOPLE = [
    { id: 'muqtada', name: 'د. مقتدى علي مقداد', nameEn: 'Dr. Muqtada Ali Miqdad', photo: 'assets/lecturers/muqtada.png', founder: true,
      subjects: ['Medicine', 'Orthopedics', 'Cardiology'], role: 'مؤسس منصة ابوقراط — محاضر الباطنية والكسور والقلبية', gpa: '81.37',
      bio: ['من أوائل خريجي جامعة النهرين', 'خبرة في الشرح أكثر من 5 سنوات، بحوالي أكثر من 200 محاضرة طبية', 'مؤسس Hippocrates ومؤسس NUCOM34 Qbanks', 'مشارك في بنوك الأسئلة لدى MEDACE و Dr.cube', 'مشارك في أنشطة الكلية كمحاضر في حلقة وعي ومجلة أطباء الغد', 'خبرة لأكثر من 6 سنوات في مساعدة الطلبة وإعداد الملازم والملخصات'] },
    { id: 'yaseen', name: 'د. ياسين نبيل عبد المحسن', nameEn: 'Dr. Yaseen Nabeel Abdulmohsen', photo: 'assets/lecturers/yaseen.png',
      subjects: ['Respiratory'], role: 'محاضر — الجهاز التنفسي', gpa: '77.49',
      bio: ['خريج جامعة النهرين — كلية الطب', 'ضمن الربع الأول من الدفعة', 'خبرة في الشرح والتدريس الطبي لمدة 4 سنوات', 'قدّم ما يقارب 100 محاضرة طبية مجانية عبر قناته التعليمية', 'صاحب قناة تعليمية تضم أكثر من 1,500 طالب مهتم بالمحتوى الطبي والتعليمي', 'أسلوب تدريسي يركّز على الفهم، ترتيب المعلومات، وتثبيتها للامتحان'] },
    { id: 'furqan', name: 'د. فرقان عبد القادر خضير', nameEn: 'Dr. Furqan Abdulqadir Khudhair', photo: 'assets/lecturers/furqan.png',
      subjects: ['Psychiatry', 'Neurology'], role: 'محاضرة — الطب النفسي والأعصاب', gpa: '74.92',
      bio: ['خريجة جامعة النهرين — كلية الطب', 'ضمن الربع الأول من الدفعة', 'خبرة في الشرح وإيصال المادة العلمية لمدة سنتين', 'خبرة في تلخيص المحاضرات وكتابة السشنات العلمية', 'مشاركة في أنشطة الكلية كمحاضرة في حلقة وعي والمهرجانات الثقافية'] },
    { id: 'rafal', name: 'د. رفل زياد عبد الأمير', nameEn: 'Dr. Rafal Ziyad Abdulameer', photo: 'assets/lecturers/rafal.png',
      subjects: ['Obstetrics', 'Gynecology'], role: 'محاضرة — النسائية والتوليد', gpa: '79.72',
      bio: ['من أوائل خريجي طب النهرين', 'مسيرة أكاديمية متميزة خلال سنوات الدراسة', 'إمكانية إيصال المعلومات المعقدة بأسلوب مبسط وسلس يراعي مستويات الطلاب المختلفة', 'تقديم دعم أكاديمي ومنهجي شامل للطلاب، مع الإرشاد الكامل حول أفضل أساليب الدراسة واجتياز الامتحانات بنجاح'] },
    { id: 'sara', name: 'د. سارة صباح علي', nameEn: 'Dr. Sara Sabah Ali', photo: 'assets/lecturers/sara.png',
      subjects: ['Clinical Surgery', 'GIT'], role: 'محاضرة — الجراحة السريرية والجهاز الهضمي', gpa: '79.2',
      bio: ['من أوائل خريجي طب النهرين بتسلسل 29', 'خبرة بتلخيص السشنات العملية والكلنكل منذ المرحلة الرابعة', 'مسيرة أكاديمية متميزة خلال سنوات الدراسة'] },
    { id: 'zahraa-raad', name: 'د. زهراء رعد عبدالله', nameEn: 'Dr. Zahraa Raad Abdullah', photo: 'assets/lecturers/zahraa-raad.png',
      subjects: ['GIT'], role: 'محاضرة — الجهاز الهضمي', gpa: '87.54',
      bio: ['من أوائل خريجي طب النهرين بتسلسل الـ 3 على الدفعة', 'مسيرة أكاديمية متميزة خلال سنوات الدراسة'] },
    { id: 'zahraa-hasan', name: 'د. زهراء حسن هاشم', nameEn: 'Dr. Zahraa Hasan Hashim', photo: 'assets/lecturers/zahraa-hasan.png',
      subjects: ['Dermatology'], role: 'محاضرة — الأمراض الجلدية', gpa: '82.64',
      bio: ['من أوائل خريجي طب النهرين', 'مسيرة أكاديمية متميزة خلال سنوات الدراسة', 'خبرة في تقديم محتوى تعليمي يركّز على الجوانب المهمة سريرياً والأكثر ارتباطاً بالممارسة الطبية'] },
    { id: 'zahraa-hamid', name: 'د. زهراء حامد وسمي', nameEn: 'Dr. Zahraa Hamid Wasmi', photo: 'assets/lecturers/zahraa-hamid.png',
      subjects: ['Pediatrics'], role: 'محاضرة — طب الأطفال', gpa: '80.23',
      bio: ['من أوائل خريجي طب ابن سينا', 'مهتمة بمساعدة طلبة الطب وتقوم بإعداد ملخصات دراسية مرتبة ومبسطة لمساعدة الطلبة على الفهم والمراجعة', 'اهتمام أكاديمي خاص بمجال Pediatrics والتعليم الطبي', 'مسيرة أكاديمية متميزة خلال سنوات الدراسة'] },
    { id: 'hussein', name: 'د. حسين كمال شاكر', nameEn: 'Dr. Hussein Kamal Shakir', photo: 'assets/lecturers/hussein.png',
      subjects: ['Community Medicine'], role: 'محاضر — طب المجتمع', gpa: '76.56',
      bio: ['خريج كلية الطب — جامعة النهرين', 'مهتم بالأبحاث وحاصل على عدة كورسات معتمدة منها Cochrane for Systematic Review', 'Introduction for Systematic Review and Meta-analysis — Johns Hopkins', 'مسيرة أكاديمية متميزة خلال سنوات الدراسة'] },
    { id: 'haider', name: 'د. حيدر خالد طارش', nameEn: 'Dr. Haider Khaled Tarish', photo: 'assets/lecturers/haider.png',
      subjects: ['Pharmacology'], role: 'محاضر — الأدوية', gpa: '82.56',
      bio: ['من أوائل خريجي طب ذي قار بتسلسل الـ7 على الدفعة', 'مسيرة أكاديمية متميزة خلال سنوات الدراسة', 'شرح متميز ومبسط للمواد الأساسية (Basic Medical Subjects) بأسلوب واضح مع الاستعانة بالرسومات والمخططات', 'مسؤول عن شرح مادة Pharmacology في منصة Hippocrates'] },
    { id: 'narjis', name: 'د. نرجس كاظم جبر', nameEn: 'Dr. Narjis Kadhim Jabur', photo: 'assets/lecturers/narjis.png',
      subjects: ['Clinical Medicine'], role: 'محاضرة — باطنية سريري', gpa: '82.41',
      bio: ['من أوائل خريجي طب النهرين', 'خبرة في مجال التعليم الطبي من خلال تأشير وتلخيص وشرح الملازم الطبية', 'بحث علمي فائز بجائزة أفضل بحث في مؤتمر ICOPH 2026', 'باحثة مشاركة في بحث علمي منشور في مجلة Surgical Neurology International (SNI)', 'عضو في اللجنة التنظيمية للمؤتمر العلمي الدولي الثاني عشر لكلية طب النهرين', 'مسؤولة عن شرح مادة Clinical Medicine في منصة Hippocrates'] },
    { id: 'asal', name: 'د. عسل زياد نوري', nameEn: 'Dr. Asal Ziad Noori', photo: 'assets/lecturers/asal.png',
      subjects: ['Radiology'], role: 'محاضرة — الأشعة', gpa: '82.42',
      bio: ['من أوائل خريجي طب النهرين بتسلسل الـ15 على الدفعة', 'مسيرة أكاديمية متميزة خلال سنوات الدراسة', 'مشاركة في عدد من الورش والدورات الطبية لتطوير المعرفة والمهارات الطبية', 'حاصلة على درجة امتياز في مادة الأشعة', 'مسؤولة عن شرح مادة Radiology في منصة Hippocrates'] },
    { id: 'karrar', name: 'د. كرار حيدر علي', nameEn: 'Dr. Karrar Haider Ali', photo: 'assets/lecturers/karrar.png',
      subjects: ['Biochemistry', 'Immunology'], role: 'محاضر — الكيمياء الحياتية والمناعة', gpa: '72.9',
      bio: ['خريج كلية الطب — جامعة النهرين', 'مهتم بالبحوث العلمية ومشارك في بحث a cross-sectional study on the psychological impact of COVID-19 on healthcare workers across the Middle East', 'حاصل على تقدير جيد جداً في مادة البايوكمستري', 'مسيرة أكاديمية متميزة خلال سنوات الدراسة ومهتم في المعادلة الامريكية USMLE', 'مسؤول عن شرح مادة Biochemistry & Immunology في منصة Hippocrates'] },
    { id: 'ayat', name: 'د. ايات غالب ناصر', nameEn: 'Dr. Ayat Ghalib Nasser', photo: 'assets/lecturers/ayat.png',
      subjects: ['Physiology'], role: 'محاضرة — الفسلجة', gpa: '80.99',
      bio: ['من أوائل خريجي طب النهرين', 'تقديم شرح متكامل مع ربط المعلومات الفسلجية بالتطبيقات السريرية لتسهيل فهم المادة واستذكار المعلومات', 'زميلة لكم جميعاً لأي مساعدة أو استشارة في الدراسة', 'إضافة ملخصات MCQ في نهاية المحاضرة لأهم النقاط لتسهيل المراجعة في الامتحان', 'مسؤولة عن شرح مادة Physiology في منصة Hippocrates'] },
    { id: 'aya-thamer', name: 'د. اية ثامر جمعة', nameEn: 'Dr. Aya Thamer Juma', photo: 'assets/lecturers/aya-thamer.png',
      subjects: ['ENT'], role: 'محاضرة — الأنف والأذن والحنجرة', gpa: '72.6',
      bio: ['خريجة كلية الطب — جامعة النهرين', 'خبرة في ترتيب الملازم وكتابة الملخصات النظرية بطريقة ممتعة', 'حاصلة على امتياز في روتة الأنف والأذن والحنجرة', 'مسؤولة عن شرح مادة ENT في منصة Hippocrates'] },
    { id: 'tabarak', name: 'د. تبارك صباح علي', nameEn: 'Dr. Tabarak Sabah Ali', photo: 'assets/lecturers/tabarak.png',
      subjects: ['Pathology'], role: 'محاضرة — علم الأمراض', gpa: '—',
      bio: ['خريجة كلية الطب — جامعة النهرين', 'مسؤولة عن شرح مادة Pathology في منصة Hippocrates'] }
  ];

  /* display order: the founder first, then by GPA highest-first.
     Anyone without a recorded GPA sorts last. */
  function byRank(a, b) {
    if (!!a.founder !== !!b.founder) return a.founder ? -1 : 1;
    var ga = parseFloat(a.gpa), gb = parseFloat(b.gpa);
    if (isNaN(ga) && isNaN(gb)) return 0;
    if (isNaN(ga)) return 1;
    if (isNaN(gb)) return -1;
    return gb - ga;
  }
  PEOPLE.sort(byRank);

  var state = { filter: 'all', open: null };

  var header = document.getElementById('header');
  var chipsEl = document.getElementById('chips');
  var gridEl = document.getElementById('people-grid');
  var emptyNote = document.getElementById('empty-note');
  var overlay = document.getElementById('modal-overlay');
  var sheet = document.getElementById('modal-sheet');
  var modalClose = document.getElementById('modal-close');

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function allSubjects() {
    var subjects = [];
    PEOPLE.forEach(function (p) {
      p.subjects.forEach(function (s) { if (subjects.indexOf(s) < 0) subjects.push(s); });
    });
    return subjects;
  }

  function renderChips() {
    var items = ['all'].concat(allSubjects());
    chipsEl.innerHTML = items.map(function (key) {
      var label = key === 'all' ? 'كل المحاضرين' : key;
      var on = state.filter === key;
      return '<button type="button" class="hip-chip' + (on ? ' active' : '') + '" data-key="' + esc(key) + '" aria-pressed="' + on + '">' + esc(label) + '</button>';
    }).join('');

    Array.prototype.forEach.call(chipsEl.querySelectorAll('.hip-chip'), function (btn) {
      btn.addEventListener('click', function () {
        state.filter = btn.getAttribute('data-key');
        renderChips();
        renderGrid();
      });
    });
  }

  function renderGrid() {
    var f = state.filter;
    var list = PEOPLE.filter(function (p) { return f === 'all' || p.subjects.indexOf(f) >= 0; });

    emptyNote.hidden = list.length !== 0;

    gridEl.innerHTML = list.map(function (p, idx) {
      return (
        '<article class="hip-person" data-id="' + p.id + '" style="animation-delay:' + (idx * 0.05) + 's">' +
          '<div class="hip-person-photo">' +
            '<img src="' + p.photo + '" alt="' + esc(p.name) + '" loading="lazy">' +
            (p.founder ? '<span class="hip-founder-badge">مؤسس المنصة</span>' : '') +
          '</div>' +
          '<div class="hip-person-body">' +
            '<h3 class="hip-person-name">' + esc(p.name) + '</h3>' +
            '<div class="hip-person-name-en">' + esc(p.nameEn) + '</div>' +
            '<div class="hip-person-tags">' + p.subjects.map(function (s) { return '<span class="hip-tag">' + esc(s) + '</span>'; }).join('') + '</div>' +
            '<div class="hip-person-gpa">' +
              '<span class="hip-person-gpa-label">المعدل التراكمي</span>' +
              '<span class="hip-person-gpa-val mono">' + esc(p.gpa) + '</span>' +
            '</div>' +
            '<button type="button" class="hip-person-btn" data-open="' + p.id + '">الملف التعريفي<span class="btn-arrow">←</span></button>' +
          '</div>' +
        '</article>'
      );
    }).join('');

    Array.prototype.forEach.call(gridEl.querySelectorAll('[data-open]'), function (btn) {
      btn.addEventListener('click', function () {
        openModal(btn.getAttribute('data-open'));
      });
    });
  }

  function openModal(id) {
    var p = PEOPLE.filter(function (x) { return x.id === id; })[0];
    if (!p) return;
    state.open = id;

    document.getElementById('modal-photo').src = p.photo;
    document.getElementById('modal-photo').alt = p.name;
    document.getElementById('modal-name').textContent = p.name;
    document.getElementById('modal-name-en').textContent = p.nameEn;
    document.getElementById('modal-role').textContent = p.role;
    document.getElementById('modal-gpa').textContent = p.gpa;
    document.getElementById('modal-bio').innerHTML = p.bio.map(function (b) {
      return '<li><span class="hip-modal-bio-dot"></span>' + esc(b) + '</li>';
    }).join('');
    document.getElementById('modal-subjects').innerHTML = p.subjects.map(function (s) {
      return '<span class="hip-tag">' + esc(s) + '</span>';
    }).join('');

    overlay.classList.remove('hidden');
  }

  function closeModal() {
    state.open = null;
    overlay.classList.add('hidden');
  }

  overlay.addEventListener('click', closeModal);
  sheet.addEventListener('click', function (e) { e.stopPropagation(); });
  modalClose.addEventListener('click', closeModal);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  function renderStats() {
    var statLecturers = document.getElementById('stat-lecturers');
    var statSubjects = document.getElementById('stat-subjects');
    if (statLecturers) statLecturers.textContent = PEOPLE.length < 10 ? '0' + PEOPLE.length : String(PEOPLE.length);
    if (statSubjects) statSubjects.textContent = allSubjects().length < 10 ? '0' + allSubjects().length : String(allSubjects().length);
  }

  renderStats();
  renderChips();
  renderGrid();

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
})();
