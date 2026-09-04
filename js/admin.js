/* Hippocrates — admin dashboard controller.
   Nothing here grants access: every read and write goes through Supabase with
   the administrator's own session, and Row Level Security decides the rest.
   Hiding a button only tidies the screen — the database is the real gate. */
(function () {
  'use strict';

  var COPY = {
    ar: {
      cfgTitle: 'الاتصال غير مكتمل', cfgBody: 'لم يتم ضبط رابط المشروع أو المفتاح المنشور. أضفهما في هذا الملف ثم أعد التحميل.',
      loginTitle: 'تسجيل دخول المدراء', loginSub: 'هذه اللوحة مخصصة لإدارة ابوقراط فقط.',
      email: 'البريد الإلكتروني', password: 'كلمة المرور', signIn: 'دخول', signingIn: 'جاري الدخول…',
      loginNote: 'محاولات الدخول محمية على مستوى قاعدة البيانات، لا على مستوى الصفحة.',
      deniedTitle: 'لا تملك صلاحية الوصول', deniedBody: 'حسابك مسجّل لكنه غير مضاف لقائمة المدراء. راجع مالك المنصة.',
      signOut: 'خروج', refresh: 'تحديث',
      navDash: 'الرئيسية', navOrders: 'الطلبات', navPromos: 'أكواد الخصم', navCourses: 'الكورسات', navPkgs: 'البكجات',
      dashSub: 'ملخص الحالة الحالية للمنصة.',
      dashPending: 'طلبات بانتظار التأكيد', noPending: 'لا توجد طلبات معلّقة.', open: 'فتح',
      tTotalOrders: 'إجمالي الطلبات', tPending: 'بانتظار التأكيد', tConfirmed: 'مؤكدة',
      tRevenue: 'الإيرادات المؤكدة', tActivePromos: 'أكواد فعّالة', tRedemptions: 'مرات استخدام الأكواد',
      ordersSub: 'تأكيد أو رفض الدفع. الطالب لا يستطيع تغيير الحالة بنفسه.',
      searchOrders: 'ابحث برقم الطلب أو الاسم أو المعرّف…', noOrders: 'لا توجد طلبات في هذا التصنيف.',
      fAll: 'الكل', fPending: 'معلّقة', fConfirmed: 'مؤكدة', fRejected: 'مرفوضة',
      student: 'الطالب', telegram: 'تيليجرام', stage: 'المرحلة', original: 'القيمة الأصلية',
      discount: 'الخصم', promo: 'الكود', confirmPay: 'تأكيد الدفع', rejectPay: 'رفض',
      reopen: 'إرجاع إلى معلّقة',
      stPending: 'بانتظار التأكيد', stConfirmed: 'مؤكد', stRejected: 'مرفوض',
      promosSub: 'الأكواد تتوقف تلقائياً عند انتهاء المدة أو بلوغ الحد الأقصى أو عند تعطيلها.',
      newPromo: 'كود جديد', addPromo: 'إضافة كود', closeForm: 'إلغاء',
      code: 'الكود', discType: 'نوع الخصم', pct: 'نسبة مئوية', fixed: 'مبلغ ثابت',
      valuePct: 'النسبة %', valueFixed: 'المبلغ (IQD)',
      scope: 'النطاق', scopeAll: 'كل المنتجات', scopeCourses: 'الكورسات فقط', scopePackages: 'البكجات فقط',
      scopeSelCourses: 'كورسات محددة', scopeSelPackages: 'بكجات محددة',
      startDate: 'تاريخ البداية', endDate: 'تاريخ الانتهاء',
      maxUses: 'أقصى عدد استخدامات', maxPerStudent: 'أقصى استخدام للطالب',
      pickProducts: 'اختر المنتجات المشمولة', savePromoBtn: 'حفظ الكود', savingPromo: 'جاري الحفظ…',
      noPromos: 'لا توجد أكواد بعد.', uses: 'الاستخدامات', remaining: 'المتبقي', window: 'المدة',
      unlimited: 'غير محدود', always: 'دائم', enable: 'تفعيل', disable: 'تعطيل', delete: 'حذف',
      stActive: 'فعّال', stDisabled: 'معطّل', stExpired: 'منتهي', stScheduled: 'لم يبدأ', stExhausted: 'مستنفد',
      coursesSub: 'كل تعديل ينعكس فوراً على الموقع والسلة والفاتورة.',
      courseName: 'اسم الكورس (إنجليزي)', courseNameAr: 'الاسم بالعربي', lecturer: 'المحاضر', price: 'السعر (IQD)',
      notAnnounced: 'غير معلن', stageN: 'المرحلة', stagesLabel: 'المراحل',
      save: 'حفظ', saved: 'تم الحفظ', saving: 'جاري…',
      stEnabled: 'ظاهر', stHidden: 'مخفي', hide: 'إخفاء', show: 'إظهار',
      pkgsSub: 'الوفر ونسبة الخصم تُحسبان تلقائياً من محتويات البكج.',
      listValue: 'القيمة الأصلية', savings: 'الوفر', percentOff: 'نسبة الخصم',
      pkgPrice: 'سعر البكج (IQD)', promoLabel: 'عنوان العرض', promoLabelHint: 'مثال: عرض بداية السنة',
      pkgCourses: 'الكورسات المشمولة', remove: 'إزالة', addCourse: '+ إضافة كورس',
      pkgRefOnly: 'محتوى مرجعي فقط (بدون كورسات مرتبطة)',
      errSave: 'تعذر الحفظ', errLoad: 'تعذر تحميل البيانات', errCode: 'أدخل كوداً وقيمة صحيحة',
      ownerRole: 'المالك', staffRole: 'فريق الدعم'
    },
    en: {
      cfgTitle: 'Connection not configured', cfgBody: 'The project URL or publishable key is missing. Add them to this file and reload.',
      loginTitle: 'Administrator sign in', loginSub: 'This dashboard is for Hippocrates staff only.',
      email: 'Email', password: 'Password', signIn: 'Sign in', signingIn: 'Signing in…',
      loginNote: 'Access is enforced in the database, not by hiding this page.',
      deniedTitle: 'No access', deniedBody: 'Your account exists but is not on the administrator list. Ask the platform owner to add you.',
      signOut: 'Sign out', refresh: 'Refresh',
      navDash: 'Dashboard', navOrders: 'Orders', navPromos: 'Promo codes', navCourses: 'Courses', navPkgs: 'Packages',
      dashSub: 'Where the platform stands right now.',
      dashPending: 'Awaiting confirmation', noPending: 'No pending orders.', open: 'Open',
      tTotalOrders: 'Total orders', tPending: 'Pending verification', tConfirmed: 'Confirmed',
      tRevenue: 'Confirmed revenue', tActivePromos: 'Active promo codes', tRedemptions: 'Promo redemptions',
      ordersSub: 'Confirm or reject payment. Students cannot change status themselves.',
      searchOrders: 'Search by order no, name or username…', noOrders: 'No orders in this filter.',
      fAll: 'All', fPending: 'Pending', fConfirmed: 'Confirmed', fRejected: 'Rejected',
      student: 'Student', telegram: 'Telegram', stage: 'Stage', original: 'List value',
      discount: 'Discount', promo: 'Promo', confirmPay: 'Confirm payment', rejectPay: 'Reject',
      reopen: 'Move back to pending',
      stPending: 'Pending verification', stConfirmed: 'Confirmed', stRejected: 'Rejected',
      promosSub: 'Codes stop working automatically on expiry, at the usage ceiling, or when disabled.',
      newPromo: 'New code', addPromo: 'Add code', closeForm: 'Cancel',
      code: 'Code', discType: 'Discount type', pct: 'Percentage', fixed: 'Fixed amount',
      valuePct: 'Percent %', valueFixed: 'Amount (IQD)',
      scope: 'Applies to', scopeAll: 'All products', scopeCourses: 'Courses only', scopePackages: 'Packages only',
      scopeSelCourses: 'Selected courses', scopeSelPackages: 'Selected packages',
      startDate: 'Start date', endDate: 'Expiry date',
      maxUses: 'Maximum uses', maxPerStudent: 'Max uses per student',
      pickProducts: 'Choose the products it covers', savePromoBtn: 'Save code', savingPromo: 'Saving…',
      noPromos: 'No promo codes yet.', uses: 'Uses', remaining: 'Remaining', window: 'Window',
      unlimited: 'Unlimited', always: 'Always', enable: 'Enable', disable: 'Disable', delete: 'Delete',
      stActive: 'Active', stDisabled: 'Disabled', stExpired: 'Expired', stScheduled: 'Scheduled', stExhausted: 'Used up',
      coursesSub: 'Every edit shows on the site, cart and invoice immediately.',
      courseName: 'Course name', courseNameAr: 'Arabic name', lecturer: 'Lecturer', price: 'Price (IQD)',
      notAnnounced: 'Not announced', stageN: 'Stage', stagesLabel: 'Stages',
      save: 'Save', saved: 'Saved', saving: 'Saving…',
      stEnabled: 'Visible', stHidden: 'Hidden', hide: 'Hide', show: 'Show',
      pkgsSub: 'Savings and percentage recalculate from the package contents.',
      listValue: 'List value', savings: 'Savings', percentOff: 'Percent off',
      pkgPrice: 'Package price (IQD)', promoLabel: 'Promotion label', promoLabelHint: 'e.g. New year offer',
      pkgCourses: 'Included courses', remove: 'Remove', addCourse: '+ Add course',
      pkgRefOnly: 'Reference contents only (no linked courses)',
      errSave: 'Could not save', errLoad: 'Could not load data', errCode: 'Enter a valid code and value',
      ownerRole: 'Owner', staffRole: 'Support staff'
    }
  };

  var LANG_KEY = 'hippo:lang';

  var state = {
    booting: true, configError: false,
    lang: (function () { try { return localStorage.getItem(LANG_KEY) === 'en' ? 'en' : 'ar'; } catch (e) { return 'ar'; } })(),
    session: null, me: null, view: 'dashboard',
    email: '', pw: '', signingIn: false, loginError: '',
    stats: null, orders: [], orderFilter: 'pending', search: '',
    promos: [], courses: [], packages: [], lecturers: [],
    drafts: {}, savingKey: '', savedKey: '',
    showPromoForm: false, savingPromo: false, promoError: '',
    pf: { code: '', type: 'percentage', value: '', scope: 'all', start: '', end: '', maxUses: '', maxPer: '', picked: [] },
    toast: ''
  };

  var root = document.getElementById('root');
  var toastTimer = null;

  /* ---------- helpers ---------- */
  function T() { return COPY[state.lang]; }
  function isAr() { return state.lang === 'ar'; }
  function perms() { return state.me ? state.me.perms : {}; }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function money(n) { return Number(n || 0).toLocaleString('en-US') + ' IQD'; }
  function iso(v) { return v ? String(v).slice(0, 10) : ''; }
  function fmtDate(v) {
    if (!v) return '—';
    var d = new Date(v);
    if (isNaN(d)) return '—';
    var p = function (x) { return String(x).padStart(2, '0'); };
    return p(d.getDate()) + '/' + p(d.getMonth() + 1) + '/' + d.getFullYear();
  }
  /* every stage a course belongs to — `stages` is the source of truth, `stage` the legacy fallback */
  function courseStageList(c) {
    var list = (c && c.stages && c.stages.length) ? c.stages : (c && c.stage != null ? [c.stage] : []);
    return list.slice().sort(function (a, b) { return a - b; });
  }
  function stageLabel(n) { return n == null ? T().notAnnounced : T().stageN + ' ' + n; }
  function courseName(row) {
    return isAr() ? (row.title_ar || row.title) : (row.title || row.title_ar);
  }

  function toast(msg) {
    state.toast = msg;
    paintToast();
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { state.toast = ''; paintToast(); }, 2600);
  }
  function paintToast() {
    var el = document.getElementById('toast-slot');
    if (!el) return;
    el.innerHTML = state.toast
      ? '<div class="ad-toast-wrap"><div class="ad-toast">' + esc(state.toast) + '</div></div>'
      : '';
  }
  function errToast(prefix, e) { toast(prefix + ' — ' + ((e && e.message) || '')); }

  /* ---------- boot ---------- */
  function waitForApi(tries) {
    var api = window.HIPPO_ADMIN;
    if (api && api.ready()) return boot();
    if (tries > 60) { state.booting = false; state.configError = true; return render(); }
    setTimeout(function () { waitForApi(tries + 1); }, 100);
  }

  function boot() {
    var api = window.HIPPO_ADMIN;
    api.onAuthChange(function (session) {
      if (!session) { state.session = null; state.me = null; render(); }
    });
    api.getSession().then(function (session) {
      if (!session) { state.booting = false; state.session = null; return render(); }
      return api.me().then(function (me) {
        state.booting = false; state.session = session; state.me = me;
        render();
        if (me) loadAll();
      });
    }).catch(function () { state.booting = false; state.session = null; render(); });
  }

  function loadAll() {
    var api = window.HIPPO_ADMIN;
    Promise.all([
      api.stats().catch(function () { return null; }),
      api.orders('all').catch(function () { return []; }),
      api.promos().catch(function () { return []; }),
      api.courses().catch(function () { return []; }),
      api.packages().catch(function () { return []; }),
      api.lecturers().catch(function () { return []; })
    ]).then(function (r) {
      state.stats = r[0]; state.orders = r[1] || []; state.promos = r[2] || [];
      state.courses = r[3] || []; state.packages = r[4] || []; state.lecturers = r[5] || [];
      state.drafts = {};
      render();
    }).catch(function () { toast(T().errLoad); });
  }

  /* ---------- auth actions ---------- */
  function doSignIn(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (!state.email || !state.pw) return;
    state.signingIn = true; state.loginError = '';
    render();
    window.HIPPO_ADMIN.signIn(state.email, state.pw)
      .then(function () { return window.HIPPO_ADMIN.me(); })
      .then(function (me) {
        return window.HIPPO_ADMIN.getSession().then(function (session) {
          state.signingIn = false; state.session = session; state.me = me; state.pw = '';
          render();
          if (me) loadAll();
        });
      })
      .catch(function (err) {
        state.signingIn = false;
        state.loginError = (err && err.message) || T().errLoad;
        render();
      });
  }

  function doSignOut() {
    window.HIPPO_ADMIN.signOut().then(function () {
      state.session = null; state.me = null; state.view = 'dashboard';
      state.orders = []; state.promos = []; state.courses = []; state.packages = []; state.stats = null;
      render();
    });
  }

  /* ---------- drafts ---------- */
  function draftOf(kind, key, source) {
    return state.drafts[kind + ':' + key] || source;
  }
  function setDraft(kind, key, patch, source) {
    var id = kind + ':' + key;
    state.drafts[id] = Object.assign({}, state.drafts[id] || source, patch);
    state.savedKey = '';
    paintSaveButton(id);
  }
  function clearDraft(id) { delete state.drafts[id]; }

  /* Update just this card's save button so typing never costs the caret. */
  function paintSaveButton(id) {
    var btn = document.querySelector('[data-save="' + id + '"]');
    if (!btn) return;
    var dirty = !!state.drafts[id];
    var saving = state.savingKey === id;
    btn.disabled = !dirty || saving;
    btn.className = 'ad-btn-save' + (dirty && !saving ? ' dirty' : '');
    btn.textContent = saving ? T().saving : (state.savedKey === id ? T().saved : T().save);
  }

  /* ---------- orders ---------- */
  function setStatus(id, status) {
    var t = T();
    window.HIPPO_ADMIN.setOrderStatus(id, status)
      .then(function (updated) {
        state.orders = state.orders.map(function (o) { return o.id === id ? Object.assign({}, o, updated) : o; });
        render();
        toast(status === 'confirmed' ? t.stConfirmed : status === 'rejected' ? t.stRejected : t.stPending);
        return window.HIPPO_ADMIN.stats().then(function (s) { state.stats = s; render(); }).catch(function () {});
      })
      .catch(function (e) { errToast(t.errSave, e); });
  }

  /* ---------- promo form ---------- */
  function pfSet(patch, repaint) {
    state.pf = Object.assign({}, state.pf, patch);
    state.promoError = '';
    if (repaint) render();
  }

  function togglePicked(type, id) {
    var key = type + ':' + id;
    var picked = state.pf.picked.slice();
    var i = picked.indexOf(key);
    if (i >= 0) picked.splice(i, 1); else picked.push(key);
    pfSet({ picked: picked }, true);
  }

  function promoState(p) {
    var t = T();
    var now = new Date();
    if (!p.active) return { kind: 'neutral', label: t.stDisabled };
    if (p.starts_at && new Date(p.starts_at) > now) return { kind: 'pending', label: t.stScheduled };
    if (p.expires_at && new Date(p.expires_at) < now) return { kind: 'rejected', label: t.stExpired };
    if (p.max_uses != null && p.uses >= p.max_uses) return { kind: 'rejected', label: t.stExhausted };
    return { kind: 'live', label: t.stActive };
  }

  function savePromo() {
    var t = T();
    var pf = state.pf;
    var code = String(pf.code || '').trim().toUpperCase();
    var value = Number(pf.value);
    if (code.length < 3 || !value || value <= 0) { state.promoError = t.errCode; return render(); }
    if (pf.type === 'percentage' && value > 100) { state.promoError = t.errCode; return render(); }

    var row = {
      code: code,
      discount_type: pf.type,
      discount_value: value,
      scope: pf.scope,
      starts_at: pf.start ? new Date(pf.start + 'T00:00:00').toISOString() : null,
      expires_at: pf.end ? new Date(pf.end + 'T23:59:59').toISOString() : null,
      max_uses: pf.maxUses ? parseInt(pf.maxUses, 10) : null,
      max_uses_per_student: pf.maxPer ? parseInt(pf.maxPer, 10) : null,
      active: true,
      created_by: state.me ? state.me.id : null
    };
    var products = (pf.scope === 'selected_courses' || pf.scope === 'selected_packages')
      ? pf.picked.map(function (k) { return { type: k.split(':')[0], id: k.split(':')[1] }; })
      : [];

    state.savingPromo = true; render();
    window.HIPPO_ADMIN.createPromo(row, products)
      .then(function () { return window.HIPPO_ADMIN.promos(); })
      .then(function (promos) {
        state.savingPromo = false; state.showPromoForm = false; state.promos = promos || [];
        state.pf = { code: '', type: 'percentage', value: '', scope: 'all', start: '', end: '', maxUses: '', maxPer: '', picked: [] };
        render();
        toast(t.saved);
        return window.HIPPO_ADMIN.stats().then(function (s) { state.stats = s; render(); }).catch(function () {});
      })
      .catch(function (e) {
        state.savingPromo = false;
        state.promoError = (e && e.message) || t.errSave;
        render();
      });
  }

  /* ---------- catalog saves ---------- */
  function saveCourse(c) {
    var t = T();
    var id = 'course:' + c.key;
    var d = state.drafts[id];
    if (!d) return;
    state.savingKey = id; paintSaveButton(id);
    var stages = String(d.stages || '').split(',').map(function (v) { return parseInt(v, 10); })
      .filter(function (n) { return n >= 1 && n <= 6; }).sort(function (a, b) { return a - b; });
    window.HIPPO_ADMIN.updateCourse(c.key, {
      title: d.title, title_ar: d.title_ar,
      lecturer_key: d.lecturer_key || null,
      stages: stages,
      stage: stages.length ? stages[0] : null,
      price: parseInt(d.price, 10) || 0
    }).then(function (updated) {
      state.courses = state.courses.map(function (x) { return x.key === c.key ? Object.assign({}, x, updated) : x; });
      clearDraft(id);
      state.savingKey = ''; state.savedKey = id;
      render();
      toast(t.saved);
    }).catch(function (e) {
      state.savingKey = ''; paintSaveButton(id);
      errToast(t.errSave, e);
    });
  }

  function toggleCourse(c) {
    var t = T();
    window.HIPPO_ADMIN.updateCourse(c.key, { enabled: !c.enabled })
      .then(function (updated) {
        state.courses = state.courses.map(function (x) { return x.key === c.key ? Object.assign({}, x, updated) : x; });
        render();
        toast(updated.enabled ? t.stEnabled : t.stHidden);
      })
      .catch(function (e) { errToast(t.errSave, e); });
  }

  function savePackage(p) {
    var t = T();
    var id = 'pkg:' + p.key;
    var d = state.drafts[id];
    if (!d) return;
    state.savingKey = id; paintSaveButton(id);
    window.HIPPO_ADMIN.updatePackage(p.key, {
      price: parseInt(d.price, 10) || 0,
      promo_label: d.promo_label || null,
      promo_start: d.promo_start ? new Date(d.promo_start + 'T00:00:00').toISOString() : null,
      promo_end: d.promo_end ? new Date(d.promo_end + 'T23:59:59').toISOString() : null
    }).then(function (updated) {
      state.packages = state.packages.map(function (x) { return x.key === p.key ? Object.assign({}, x, updated) : x; });
      clearDraft(id);
      state.savingKey = ''; state.savedKey = id;
      render();
      toast(t.saved);
    }).catch(function (e) {
      state.savingKey = ''; paintSaveButton(id);
      errToast(t.errSave, e);
    });
  }

  function togglePackage(p) {
    var t = T();
    window.HIPPO_ADMIN.updatePackage(p.key, { enabled: !p.enabled })
      .then(function (updated) {
        state.packages = state.packages.map(function (x) { return x.key === p.key ? Object.assign({}, x, updated) : x; });
        render();
        toast(updated.enabled ? t.stEnabled : t.stHidden);
      })
      .catch(function (e) { errToast(t.errSave, e); });
  }

  function reloadPackages() {
    return window.HIPPO_ADMIN.packages().then(function (packages) {
      state.packages = packages || [];
      render();
    });
  }

  /* package math — mirrors the server */
  function pkgMath(p) {
    var byKey = {};
    state.courses.forEach(function (c) { byKey[c.key] = c; });
    var list = 0;
    (p.package_courses || []).forEach(function (pc) { var c = byKey[pc.course_id]; if (c) list += c.price; });
    (p.package_ref_items || []).forEach(function (r) { list += r.price; });
    var original = p.original_price != null ? p.original_price : list;
    var save = Math.max(0, original - p.price);
    var pct = original > 0 ? Math.round((save / original) * 100) : 0;
    return { original: original, save: save, pct: pct };
  }

  /* ---------- screens ---------- */
  function render() {
    root.setAttribute('dir', isAr() ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', state.lang);
    var t = T();

    if (state.booting) {
      root.innerHTML = '<div class="ad-boot"><div class="ad-spinner"></div>' +
        '<div class="ad-boot-word">HIPPOCRATES ADMIN</div></div>';
      return;
    }
    if (state.configError) return renderConfigError();
    if (!state.session) return renderLogin();
    if (!state.me) return renderDenied();
    renderApp();
    paintToast();
  }

  function renderConfigError() {
    var t = T();
    root.innerHTML =
      '<div class="ad-centre"><div class="ad-card" style="max-width:440px">' +
        '<h1>' + esc(t.cfgTitle) + '</h1>' +
        '<p>' + esc(t.cfgBody) + '</p>' +
        '<code class="ad-code" dir="ltr">js/config.js</code>' +
      '</div></div>';
  }

  function renderLogin() {
    var t = T();
    root.innerHTML =
      '<div class="ad-centre"><div class="ad-login-wrap">' +
        '<div class="ad-brand">' +
          '<img src="assets/hippocrates-logo.png" alt="">' +
          '<span class="ad-brand-text"><span class="ad-brand-name">HIPPOCRATES</span>' +
          '<span class="ad-brand-sub">admin</span></span>' +
        '</div>' +
        '<div class="ad-login-card">' +
          '<h1>' + esc(t.loginTitle) + '</h1>' +
          '<p class="sub">' + esc(t.loginSub) + '</p>' +
          '<form id="login-form">' +
            '<label class="ad-label" for="f-email">' + esc(t.email) + '</label>' +
            '<input class="ad-input-lg" id="f-email" type="email" dir="ltr" autocomplete="username" value="' + esc(state.email) + '">' +
            '<label class="ad-label" for="f-pw">' + esc(t.password) + '</label>' +
            '<input class="ad-input-lg" id="f-pw" type="password" dir="ltr" autocomplete="current-password" value="' + esc(state.pw) + '">' +
            (state.loginError ? '<div class="ad-error">' + esc(state.loginError) + '</div>' : '') +
            '<button class="ad-btn-primary-full" type="submit"' + (state.signingIn ? ' disabled' : '') + '>' +
              esc(state.signingIn ? t.signingIn : t.signIn) + '</button>' +
          '</form>' +
        '</div>' +
        '<p class="ad-login-note">' + esc(t.loginNote) + '</p>' +
      '</div></div>';

    var email = document.getElementById('f-email');
    var pw = document.getElementById('f-pw');
    email.addEventListener('input', function () { state.email = email.value; });
    pw.addEventListener('input', function () { state.pw = pw.value; });
    document.getElementById('login-form').addEventListener('submit', doSignIn);
    (state.email ? pw : email).focus();
  }

  function renderDenied() {
    var t = T();
    root.innerHTML =
      '<div class="ad-centre"><div class="ad-card" style="max-width:420px;text-align:center">' +
        '<h1>' + esc(t.deniedTitle) + '</h1>' +
        '<p>' + esc(t.deniedBody) + '</p>' +
        '<button class="ad-btn-outline" type="button" id="btn-signout">' + esc(t.signOut) + '</button>' +
      '</div></div>';
    document.getElementById('btn-signout').addEventListener('click', doSignOut);
  }

  function renderApp() {
    var t = T();
    var me = state.me;
    var pendingCount = state.orders.filter(function (o) { return o.status === 'pending'; }).length;
    var navDefs = [
      { id: 'dashboard', label: t.navDash },
      { id: 'orders', label: t.navOrders, badge: pendingCount || 0 },
      { id: 'promos', label: t.navPromos },
      { id: 'courses', label: t.navCourses },
      { id: 'packages', label: t.navPkgs }
    ];

    root.innerHTML =
      '<header class="ad-header">' +
        '<img src="assets/hippocrates-logo.png" alt="">' +
        '<span class="ad-header-text">' +
          '<span class="ad-header-name">HIPPOCRATES</span>' +
          '<span class="ad-header-role">' + esc(me.role === 'owner' ? t.ownerRole : t.staffRole) + '</span>' +
        '</span>' +
        '<span class="ad-header-actions">' +
          '<span class="ad-lang">' +
            '<button type="button" id="lang-ar" class="' + (isAr() ? 'on' : '') + '">ع</button>' +
            '<button type="button" id="lang-en" class="' + (!isAr() ? 'on' : '') + '">EN</button>' +
          '</span>' +
          '<button class="ad-icon-btn" type="button" id="btn-refresh" title="' + esc(t.refresh) + '" aria-label="' + esc(t.refresh) + '">' +
            '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M21 12a9 9 0 1 1-3-6.7"></path><path d="M21 4v5h-5"></path></svg>' +
          '</button>' +
          '<button class="ad-ghost-btn" type="button" id="btn-signout">' + esc(t.signOut) + '</button>' +
        '</span>' +
      '</header>' +
      '<div class="ad-shell">' +
        '<nav class="ad-nav">' +
          navDefs.map(function (n) {
            return '<button type="button" data-view="' + n.id + '" class="' + (state.view === n.id ? 'on' : '') + '">' +
              '<span>' + esc(n.label) + '</span>' +
              (n.badge ? '<span class="badge">' + n.badge + '</span>' : '') +
            '</button>';
          }).join('') +
        '</nav>' +
        '<main class="ad-main" id="view-slot"></main>' +
      '</div>' +
      '<div id="toast-slot"></div>';

    document.getElementById('lang-ar').addEventListener('click', function () { setLang('ar'); });
    document.getElementById('lang-en').addEventListener('click', function () { setLang('en'); });
    document.getElementById('btn-refresh').addEventListener('click', function () { loadAll(); toast(t.refresh); });
    document.getElementById('btn-signout').addEventListener('click', doSignOut);
    Array.prototype.forEach.call(root.querySelectorAll('[data-view]'), function (b) {
      b.addEventListener('click', function () { state.view = b.getAttribute('data-view'); render(); });
    });

    renderView();
    paintToast();
  }

  function setLang(v) {
    state.lang = v;
    try { localStorage.setItem(LANG_KEY, v); } catch (e) {}
    render();
  }

  function renderView() {
    if (state.view === 'dashboard') return renderDashboard();
    if (state.view === 'orders') return renderOrders();
    if (state.view === 'promos') return renderPromos();
    if (state.view === 'courses') return renderCourses();
    if (state.view === 'packages') return renderPackages();
  }

  /* ---------- dashboard ---------- */
  function renderDashboard() {
    var t = T();
    var st = state.stats || {};
    var tiles = [
      { label: t.tTotalOrders, value: st.total_orders != null ? String(st.total_orders) : '—' },
      { label: t.tPending, value: st.pending_orders != null ? String(st.pending_orders) : '—' },
      { label: t.tConfirmed, value: st.confirmed_orders != null ? String(st.confirmed_orders) : '—' },
      { label: t.tRevenue, value: st.revenue != null ? money(st.revenue) : '—' },
      { label: t.tActivePromos, value: st.active_promos != null ? String(st.active_promos) : '—' },
      { label: t.tRedemptions, value: st.promo_redemptions != null ? String(st.promo_redemptions) : '—' }
    ];
    var pending = state.orders.filter(function (o) { return o.status === 'pending'; });

    document.getElementById('view-slot').innerHTML =
      '<h1>' + esc(t.navDash) + '</h1><p class="ad-sub">' + esc(t.dashSub) + '</p>' +
      '<div class="ad-tiles">' +
        tiles.map(function (x) {
          return '<div class="ad-tile"><div class="ad-tile-label">' + esc(x.label) + '</div>' +
            '<div class="ad-tile-value">' + esc(x.value) + '</div></div>';
        }).join('') +
      '</div>' +
      '<h2>' + esc(t.dashPending) + '</h2>' +
      (pending.length === 0
        ? '<p class="ad-empty">' + esc(t.noPending) + '</p>'
        : '<div class="ad-list">' + pending.slice(0, 5).map(function (o) {
            return '<div class="ad-pending-row">' +
              '<span class="no">' + esc(o.order_no) + '</span>' +
              '<span class="name">' + esc(o.student_name) + '</span>' +
              '<span class="tg">@' + esc(o.student_telegram) + '</span>' +
              '<span class="total">' + esc(money(o.total)) + '</span>' +
              '<button class="ad-btn-open" type="button" data-goorders="1">' + esc(t.open) + '</button>' +
            '</div>';
          }).join('') + '</div>');

    Array.prototype.forEach.call(document.querySelectorAll('[data-goorders]'), function (b) {
      b.addEventListener('click', function () {
        state.view = 'orders'; state.orderFilter = 'pending'; render();
      });
    });
  }

  /* ---------- orders ---------- */
  function renderOrders() {
    var t = T();
    var filters = [
      { id: 'pending', label: t.fPending }, { id: 'confirmed', label: t.fConfirmed },
      { id: 'rejected', label: t.fRejected }, { id: 'all', label: t.fAll }
    ];
    document.getElementById('view-slot').innerHTML =
      '<h1>' + esc(t.navOrders) + '</h1><p class="ad-sub">' + esc(t.ordersSub) + '</p>' +
      '<div class="ad-filters">' + filters.map(function (f) {
        return '<button type="button" data-filter="' + f.id + '" class="' + (state.orderFilter === f.id ? 'on' : '') + '">' +
          esc(f.label) + '</button>';
      }).join('') + '</div>' +
      '<input class="ad-search" id="order-search" type="search" value="' + esc(state.search) + '" placeholder="' + esc(t.searchOrders) + '">' +
      '<div id="orders-slot"></div>';

    Array.prototype.forEach.call(document.querySelectorAll('[data-filter]'), function (b) {
      b.addEventListener('click', function () { state.orderFilter = b.getAttribute('data-filter'); render(); });
    });
    var search = document.getElementById('order-search');
    search.addEventListener('input', function () { state.search = search.value; paintOrderList(); });
    paintOrderList();
  }

  function paintOrderList() {
    var t = T();
    var p = perms();
    var q = state.search.trim().toLowerCase();
    var rows = state.orders
      .filter(function (o) { return state.orderFilter === 'all' || o.status === state.orderFilter; })
      .filter(function (o) {
        return !q ||
          String(o.order_no).toLowerCase().indexOf(q) >= 0 ||
          String(o.student_name).toLowerCase().indexOf(q) >= 0 ||
          String(o.student_telegram).toLowerCase().indexOf(q) >= 0;
      });

    document.getElementById('orders-slot').innerHTML = rows.length === 0
      ? '<p class="ad-empty">' + esc(t.noOrders) + '</p>'
      : '<div class="ad-list">' + rows.map(function (o) {
          var statusLabel = o.status === 'confirmed' ? t.stConfirmed : o.status === 'rejected' ? t.stRejected : t.stPending;
          var canAct = !!p.confirmPayments && o.status === 'pending';
          var canReopen = !!p.confirmPayments && o.status !== 'pending';
          return '<div class="ad-panel">' +
            '<div class="ad-order-head">' +
              '<span class="ad-order-no">' + esc(o.order_no) + '</span>' +
              '<span class="ad-tag ' + esc(o.status) + '">' + esc(statusLabel) + '</span>' +
              '<span class="ad-order-date">' + esc(fmtDate(o.created_at)) + '</span>' +
            '</div>' +
            '<div class="ad-order-meta">' +
              '<div><div class="ad-meta-label">' + esc(t.student) + '</div><div class="ad-meta-value">' + esc(o.student_name) + '</div></div>' +
              '<div><div class="ad-meta-label">' + esc(t.telegram) + '</div>' +
                '<a class="ltr" href="https://t.me/' + esc(o.student_telegram) + '" target="_blank" rel="noopener">@' + esc(o.student_telegram) + '</a></div>' +
              '<div><div class="ad-meta-label">' + esc(t.stage) + '</div><div class="ad-meta-value">' + esc(stageLabel(o.student_stage)) + '</div></div>' +
            '</div>' +
            '<div class="ad-items">' + (o.order_items || []).map(function (it) {
              return '<div class="ad-item"><span>' + esc(isAr() ? (it.name_ar || it.name) : (it.name || it.name_ar)) + '</span>' +
                '<span class="price">' + esc(money(it.price)) + '</span></div>';
            }).join('') + '</div>' +
            '<div class="ad-order-totals">' +
              '<span>' + esc(t.original) + ' <b>' + esc(money(o.subtotal)) + '</b></span>' +
              '<span>' + esc(t.discount) + ' <b>' + esc(money((o.bundle_discount || 0) + (o.promo_discount || 0))) + '</b></span>' +
              (o.promo_code ? '<span>' + esc(t.promo) + ' <b class="promo">' + esc(o.promo_code) + '</b></span>' : '') +
              '<span class="ad-order-total">' + esc(money(o.total)) + '</span>' +
            '</div>' +
            (canAct
              ? '<div class="ad-order-actions">' +
                  '<button class="ad-btn-confirm" type="button" data-confirm="' + esc(o.id) + '">' + esc(t.confirmPay) + '</button>' +
                  '<button class="ad-btn-reject" type="button" data-reject="' + esc(o.id) + '">' + esc(t.rejectPay) + '</button>' +
                '</div>'
              : '') +
            (canReopen
              ? '<div style="margin-top:14px"><button class="ad-btn-reopen" type="button" data-reopen="' + esc(o.id) + '">' + esc(t.reopen) + '</button></div>'
              : '') +
          '</div>';
        }).join('') + '</div>';

    wire('[data-confirm]', 'data-confirm', function (id) { setStatus(id, 'confirmed'); });
    wire('[data-reject]', 'data-reject', function (id) { setStatus(id, 'rejected'); });
    wire('[data-reopen]', 'data-reopen', function (id) { setStatus(id, 'pending'); });
  }

  function wire(sel, attr, fn) {
    Array.prototype.forEach.call(document.querySelectorAll(sel), function (b) {
      b.addEventListener('click', function () { fn(b.getAttribute(attr)); });
    });
  }

  /* ---------- promos ---------- */
  function renderPromos() {
    var t = T();
    var p = perms();
    var scopeLabels = {
      all: t.scopeAll, courses: t.scopeCourses, packages: t.scopePackages,
      selected_courses: t.scopeSelCourses, selected_packages: t.scopeSelPackages
    };
    var pf = state.pf;
    var showPicker = pf.scope === 'selected_courses' || pf.scope === 'selected_packages';
    var pickerSource = pf.scope === 'selected_packages'
      ? state.packages.map(function (x) { return { type: 'package', id: x.key, label: isAr() ? x.name_ar : x.name }; })
      : state.courses.map(function (c) { return { type: 'course', id: c.key, label: courseName(c) }; });

    var form = !state.showPromoForm ? '' :
      '<div class="ad-form">' +
        '<h2>' + esc(t.newPromo) + '</h2>' +
        '<div class="ad-form-grid">' +
          field(t.code, '<input class="code" id="pf-code" type="text" dir="ltr" value="' + esc(pf.code) + '" placeholder="HIPPO25">') +
          field(t.discType, '<select id="pf-type">' +
            opt('percentage', t.pct, pf.type) + opt('fixed', t.fixed, pf.type) + '</select>') +
          field(pf.type === 'percentage' ? t.valuePct : t.valueFixed,
            '<input class="num" id="pf-value" type="number" dir="ltr" min="1" value="' + esc(pf.value) + '">') +
          field(t.scope, '<select id="pf-scope">' +
            opt('all', t.scopeAll, pf.scope) + opt('courses', t.scopeCourses, pf.scope) +
            opt('packages', t.scopePackages, pf.scope) + opt('selected_courses', t.scopeSelCourses, pf.scope) +
            opt('selected_packages', t.scopeSelPackages, pf.scope) + '</select>') +
          field(t.startDate, '<input id="pf-start" type="date" dir="ltr" value="' + esc(pf.start) + '">') +
          field(t.endDate, '<input id="pf-end" type="date" dir="ltr" value="' + esc(pf.end) + '">') +
          field(t.maxUses, '<input class="num" id="pf-maxuses" type="number" dir="ltr" min="1" placeholder="∞" value="' + esc(pf.maxUses) + '">') +
          field(t.maxPerStudent, '<input class="num" id="pf-maxper" type="number" dir="ltr" min="1" placeholder="∞" value="' + esc(pf.maxPer) + '">') +
        '</div>' +
        (showPicker
          ? '<div style="margin-bottom:16px"><div class="ad-field-label">' + esc(t.pickProducts) + '</div>' +
            '<div class="ad-picker">' + pickerSource.map(function (o) {
              var on = pf.picked.indexOf(o.type + ':' + o.id) >= 0;
              return '<button type="button" class="' + (on ? 'on' : '') + '" data-pick="' + esc(o.type + ':' + o.id) + '">' +
                esc(o.label) + '</button>';
            }).join('') + '</div></div>'
          : '') +
        (state.promoError ? '<div class="ad-error">' + esc(state.promoError) + '</div>' : '') +
        '<button class="ad-btn-savepromo" type="button" id="pf-save"' + (state.savingPromo ? ' disabled' : '') + '>' +
          esc(state.savingPromo ? t.savingPromo : t.savePromoBtn) + '</button>' +
      '</div>';

    document.getElementById('view-slot').innerHTML =
      '<div class="ad-head-row"><h1>' + esc(t.navPromos) + '</h1>' +
        (p.managePromos ? '<button class="ad-btn-primary" type="button" id="btn-toggleform">' +
          esc(state.showPromoForm ? t.closeForm : t.addPromo) + '</button>' : '') +
      '</div>' +
      '<p class="ad-sub">' + esc(t.promosSub) + '</p>' +
      form +
      (state.promos.length === 0
        ? '<p class="ad-empty">' + esc(t.noPromos) + '</p>'
        : '<div class="ad-list">' + state.promos.map(function (x) {
            var stt = promoState(x);
            return '<div class="ad-panel">' +
              '<div class="ad-promo-head">' +
                '<span class="ad-promo-code">' + esc(x.code) + '</span>' +
                '<span class="ad-tag ' + esc(stt.kind) + '">' + esc(stt.label) + '</span>' +
                '<span class="ad-promo-value">' + esc(x.discount_type === 'percentage'
                  ? Number(x.discount_value) + '%' : money(x.discount_value)) + '</span>' +
              '</div>' +
              '<div class="ad-promo-grid">' +
                '<div><div class="ad-meta-label">' + esc(t.uses) + '</div><div class="v">' + esc(String(x.uses || 0)) + '</div></div>' +
                '<div><div class="ad-meta-label">' + esc(t.remaining) + '</div><div class="v">' +
                  esc(x.max_uses == null ? t.unlimited : String(Math.max(0, x.max_uses - (x.uses || 0)))) + '</div></div>' +
                '<div><div class="ad-meta-label">' + esc(t.window) + '</div><div class="v small">' +
                  esc((x.starts_at || x.expires_at) ? (fmtDate(x.starts_at) + ' → ' + fmtDate(x.expires_at)) : t.always) + '</div></div>' +
                '<div><div class="ad-meta-label">' + esc(t.scope) + '</div><div class="v text">' +
                  esc(scopeLabels[x.scope] || x.scope) + '</div></div>' +
              '</div>' +
              (p.managePromos
                ? '<div class="ad-promo-actions">' +
                    '<button class="ad-btn-toggle" type="button" data-ptoggle="' + esc(x.id) + '" data-active="' + (x.active ? '1' : '0') + '">' +
                      esc(x.active ? t.disable : t.enable) + '</button>' +
                    '<button class="ad-btn-delete" type="button" data-pdel="' + esc(x.id) + '">' + esc(t.delete) + '</button>' +
                  '</div>'
                : '') +
            '</div>';
          }).join('') + '</div>');

    var toggleForm = document.getElementById('btn-toggleform');
    if (toggleForm) toggleForm.addEventListener('click', function () {
      state.showPromoForm = !state.showPromoForm; state.promoError = ''; render();
    });

    bindText('pf-code', function (v) { pfSet({ code: v }); });
    bindText('pf-value', function (v) { pfSet({ value: v }); });
    bindText('pf-start', function (v) { pfSet({ start: v }); });
    bindText('pf-end', function (v) { pfSet({ end: v }); });
    bindText('pf-maxuses', function (v) { pfSet({ maxUses: v }); });
    bindText('pf-maxper', function (v) { pfSet({ maxPer: v }); });
    bindChange('pf-type', function (v) { pfSet({ type: v }, true); });
    bindChange('pf-scope', function (v) { pfSet({ scope: v, picked: [] }, true); });

    Array.prototype.forEach.call(document.querySelectorAll('[data-pick]'), function (b) {
      b.addEventListener('click', function () {
        var parts = b.getAttribute('data-pick').split(':');
        togglePicked(parts[0], parts[1]);
      });
    });
    var save = document.getElementById('pf-save');
    if (save) save.addEventListener('click', savePromo);

    wire('[data-ptoggle]', 'data-ptoggle', function () {});
    Array.prototype.forEach.call(document.querySelectorAll('[data-ptoggle]'), function (b) {
      b.addEventListener('click', function () {
        var id = b.getAttribute('data-ptoggle');
        var active = b.getAttribute('data-active') === '1';
        window.HIPPO_ADMIN.updatePromo(id, { active: !active })
          .then(function () { return window.HIPPO_ADMIN.promos(); })
          .then(function (rows) { state.promos = rows || []; render(); toast(T().saved); })
          .catch(function (e) { errToast(T().errSave, e); });
      });
    });
    wire('[data-pdel]', 'data-pdel', function (id) {
      window.HIPPO_ADMIN.deletePromo(id)
        .then(function () { return window.HIPPO_ADMIN.promos(); })
        .then(function (rows) { state.promos = rows || []; render(); toast(T().delete); })
        .catch(function (e) { errToast(T().errSave, e); });
    });
  }

  function field(label, control) {
    return '<div><label class="cap">' + esc(label) + '</label>' + control + '</div>';
  }
  function opt(value, label, current) {
    return '<option value="' + esc(value) + '"' + (current === value ? ' selected' : '') + '>' + esc(label) + '</option>';
  }
  function bindText(id, fn) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('input', function () { fn(el.value); });
  }
  function bindChange(id, fn) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('change', function () { fn(el.value); });
  }

  /* ---------- courses ---------- */
  function renderCourses() {
    var t = T();
    var p = perms();
    var lecturerOptions = [{ value: '', label: '—' }].concat(
      state.lecturers.map(function (l) { return { value: l.key, label: isAr() ? l.name_ar : l.name_en }; })
    );

    document.getElementById('view-slot').innerHTML =
      '<h1>' + esc(t.navCourses) + '</h1><p class="ad-sub">' + esc(t.coursesSub) + '</p>' +
      '<div class="ad-list">' + state.courses.map(function (c) {
        var id = 'course:' + c.key;
        var src = {
          title: c.title, title_ar: c.title_ar, lecturer_key: c.lecturer_key || '',
          stages: courseStageList(c).join(','), price: String(c.price)
        };
        var d = draftOf('course', c.key, src);
        var dirty = !!state.drafts[id];
        var picked = String(d.stages || '').split(',').filter(Boolean);
        return '<div class="ad-panel">' +
          '<div class="ad-card-head">' +
            '<span class="ad-key">' + esc(c.key) + '</span>' +
            '<span class="ad-tag ' + (c.enabled ? 'live' : 'neutral') + '">' + esc(c.enabled ? t.stEnabled : t.stHidden) + '</span>' +
          '</div>' +
          '<div class="ad-grid">' +
            '<div class="ad-span-all"><label class="ad-field-label">' + esc(t.courseName) + '</label>' +
              '<input class="ad-input" type="text" data-cf="title" data-key="' + esc(c.key) + '" value="' + esc(d.title) + '"></div>' +
            '<div><label class="ad-field-label">' + esc(t.courseNameAr) + '</label>' +
              '<input class="ad-input" type="text" data-cf="title_ar" data-key="' + esc(c.key) + '" value="' + esc(d.title_ar) + '"></div>' +
            '<div><label class="ad-field-label">' + esc(t.lecturer) + '</label>' +
              '<select class="ad-input" data-cf="lecturer_key" data-key="' + esc(c.key) + '">' +
                lecturerOptions.map(function (l) { return opt(l.value, l.label, d.lecturer_key); }).join('') +
              '</select></div>' +
            '<div class="ad-span-all"><label class="ad-field-label">' + esc(t.stagesLabel) + '</label>' +
              '<div class="ad-stage-boxes">' + [1, 2, 3, 4, 5, 6].map(function (n) {
                var on = picked.indexOf(String(n)) >= 0;
                return '<label class="ad-stage-box' + (on ? ' on' : '') + '">' +
                  '<input type="checkbox" data-stage="' + n + '" data-key="' + esc(c.key) + '"' + (on ? ' checked' : '') + '>' +
                  esc(t.stageN + ' ' + n) + '</label>';
              }).join('') + '</div>' +
              '<div class="ad-stages-summary">' + esc(picked.map(function (n) { return t.stageN + ' ' + n; }).join(' · ') || t.notAnnounced) + '</div>' +
            '</div>' +
            '<div><label class="ad-field-label">' + esc(t.price) + '</label>' +
              '<input class="ad-input num" type="number" dir="ltr" min="0" step="1000" data-cf="price" data-key="' + esc(c.key) + '" value="' + esc(d.price) + '"></div>' +
          '</div>' +
          (p.editCatalog
            ? '<div class="ad-row-actions">' +
                '<button class="ad-btn-save' + (dirty ? ' dirty' : '') + '" type="button" data-save="' + esc(id) + '" data-csave="' + esc(c.key) + '"' +
                  (dirty ? '' : ' disabled') + '>' + esc(state.savedKey === id ? t.saved : t.save) + '</button>' +
                '<button class="ad-btn-quiet" type="button" data-ctoggle="' + esc(c.key) + '">' + esc(c.enabled ? t.hide : t.show) + '</button>' +
              '</div>'
            : '') +
        '</div>';
      }).join('') + '</div>';

    var byKey = {};
    state.courses.forEach(function (c) { byKey[c.key] = c; });
    function srcOf(c) {
      return {
        title: c.title, title_ar: c.title_ar, lecturer_key: c.lecturer_key || '',
        stages: courseStageList(c).join(','), price: String(c.price)
      };
    }

    Array.prototype.forEach.call(document.querySelectorAll('[data-cf]'), function (el) {
      var key = el.getAttribute('data-key');
      var f = el.getAttribute('data-cf');
      var ev = el.tagName === 'SELECT' ? 'change' : 'input';
      el.addEventListener(ev, function () {
        var patch = {}; patch[f] = el.value;
        setDraft('course', key, patch, srcOf(byKey[key]));
      });
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-stage]'), function (box) {
      box.addEventListener('change', function () {
        var key = box.getAttribute('data-key');
        var n = box.getAttribute('data-stage');
        var c = byKey[key];
        var src = srcOf(c);
        var cur = String(draftOf('course', key, src).stages || '').split(',').filter(Boolean);
        var next = box.checked ? cur.concat([n]) : cur.filter(function (v) { return v !== n; });
        next.sort(function (a, b) { return parseInt(a, 10) - parseInt(b, 10); });
        setDraft('course', key, { stages: next.join(',') }, src);
        box.parentNode.classList.toggle('on', box.checked);
        var summary = box.closest('.ad-span-all').querySelector('.ad-stages-summary');
        summary.textContent = next.map(function (v) { return T().stageN + ' ' + v; }).join(' · ') || T().notAnnounced;
      });
    });
    wire('[data-csave]', 'data-csave', function (key) { saveCourse(byKey[key]); });
    wire('[data-ctoggle]', 'data-ctoggle', function (key) { toggleCourse(byKey[key]); });
  }

  /* ---------- packages ---------- */
  function renderPackages() {
    var t = T();
    var p = perms();
    var courseByKey = {};
    state.courses.forEach(function (c) { courseByKey[c.key] = c; });

    document.getElementById('view-slot').innerHTML =
      '<h1>' + esc(t.navPkgs) + '</h1><p class="ad-sub">' + esc(t.pkgsSub) + '</p>' +
      '<div class="ad-list">' + state.packages.map(function (x) {
        var id = 'pkg:' + x.key;
        var src = {
          price: String(x.price), promo_label: x.promo_label || '',
          promo_start: iso(x.promo_start), promo_end: iso(x.promo_end)
        };
        var d = draftOf('pkg', x.key, src);
        var dirty = !!state.drafts[id];
        var math = pkgMath(x);
        var included = (x.package_courses || []).map(function (pc) { return pc.course_id; });
        return '<div class="ad-pkg">' +
          '<div class="ad-pkg-head"><h2>' + esc(isAr() ? x.name_ar : x.name) + '</h2>' +
            '<span class="ad-tag ' + (x.enabled ? 'live' : 'neutral') + '">' + esc(x.enabled ? t.stEnabled : t.stHidden) + '</span></div>' +
          '<div class="ad-pkg-math">' +
            '<span>' + esc(t.listValue) + ' <b>' + esc(money(math.original)) + '</b></span>' +
            '<span>' + esc(t.savings) + ' <b class="good">' + esc(money(math.save)) + '</b></span>' +
            '<span>' + esc(t.percentOff) + ' <b class="good">' + math.pct + '%</b></span>' +
          '</div>' +
          '<div class="ad-pkg-grid">' +
            '<div><label class="ad-field-label">' + esc(t.pkgPrice) + '</label>' +
              '<input class="ad-input num" type="number" dir="ltr" min="0" step="5000" data-pf2="price" data-key="' + esc(x.key) + '" value="' + esc(d.price) + '"></div>' +
            '<div><label class="ad-field-label">' + esc(t.promoLabel) + '</label>' +
              '<input class="ad-input" type="text" data-pf2="promo_label" data-key="' + esc(x.key) + '" value="' + esc(d.promo_label) + '" placeholder="' + esc(t.promoLabelHint) + '"></div>' +
            '<div><label class="ad-field-label">' + esc(t.startDate) + '</label>' +
              '<input class="ad-input" type="date" dir="ltr" data-pf2="promo_start" data-key="' + esc(x.key) + '" value="' + esc(d.promo_start) + '"></div>' +
            '<div><label class="ad-field-label">' + esc(t.endDate) + '</label>' +
              '<input class="ad-input" type="date" dir="ltr" data-pf2="promo_end" data-key="' + esc(x.key) + '" value="' + esc(d.promo_end) + '"></div>' +
          '</div>' +
          '<div style="margin-bottom:14px">' +
            '<div class="ad-field-label">' + esc(t.pkgCourses) + '</div>' +
            '<div class="ad-chips">' +
              included.map(function (cid) {
                return '<span class="ad-chip"><span>' + esc(courseByKey[cid] ? courseName(courseByKey[cid]) : cid) + '</span>' +
                  (p.editCatalog ? '<button type="button" aria-label="' + esc(t.remove) + '" data-pcrm="' + esc(x.key + '|' + cid) + '">×</button>' : '') +
                '</span>';
              }).join('') +
              (included.length === 0 ? '<span class="ad-hint">' + esc(t.pkgRefOnly) + '</span>' : '') +
            '</div>' +
            (p.editCatalog
              ? '<select class="ad-add-select" data-pcadd="' + esc(x.key) + '">' +
                  opt('', t.addCourse, '') +
                  state.courses.filter(function (c) { return included.indexOf(c.key) < 0; })
                    .map(function (c) { return opt(c.key, courseName(c), ''); }).join('') +
                '</select>'
              : '') +
          '</div>' +
          (p.editCatalog
            ? '<div class="ad-row-actions">' +
                '<button class="ad-btn-save' + (dirty ? ' dirty' : '') + '" type="button" data-save="' + esc(id) + '" data-psave="' + esc(x.key) + '"' +
                  (dirty ? '' : ' disabled') + '>' + esc(state.savedKey === id ? t.saved : t.save) + '</button>' +
                '<button class="ad-btn-quiet" type="button" data-ptoggle2="' + esc(x.key) + '">' + esc(x.enabled ? t.hide : t.show) + '</button>' +
              '</div>'
            : '') +
        '</div>';
      }).join('') + '</div>';

    var byKey = {};
    state.packages.forEach(function (x) { byKey[x.key] = x; });
    function srcOf(x) {
      return {
        price: String(x.price), promo_label: x.promo_label || '',
        promo_start: iso(x.promo_start), promo_end: iso(x.promo_end)
      };
    }

    Array.prototype.forEach.call(document.querySelectorAll('[data-pf2]'), function (el) {
      var key = el.getAttribute('data-key');
      var f = el.getAttribute('data-pf2');
      el.addEventListener('input', function () {
        var patch = {}; patch[f] = el.value;
        setDraft('pkg', key, patch, srcOf(byKey[key]));
      });
    });
    wire('[data-psave]', 'data-psave', function (key) { savePackage(byKey[key]); });
    wire('[data-ptoggle2]', 'data-ptoggle2', function (key) { togglePackage(byKey[key]); });
    wire('[data-pcrm]', 'data-pcrm', function (v) {
      var parts = v.split('|');
      window.HIPPO_ADMIN.removePackageCourse(parts[0], parts[1])
        .then(reloadPackages).then(function () { toast(T().saved); })
        .catch(function (e) { errToast(T().errSave, e); });
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-pcadd]'), function (sel) {
      sel.addEventListener('change', function () {
        var cid = sel.value;
        if (!cid) return;
        window.HIPPO_ADMIN.addPackageCourse(sel.getAttribute('data-pcadd'), cid)
          .then(reloadPackages).then(function () { toast(T().saved); })
          .catch(function (e) { errToast(T().errSave, e); });
      });
    });
  }

  /* ---------- go ---------- */
  render();
  waitForApi(0);
})();
