(function () {
  'use strict';

  var COPY = {
    ar: {
      arrow: '←', back: '←', continueShopping: 'واصل التسوّق',
      stepCart: 'السلة', stepInfo: 'معلوماتك', stepReview: 'المراجعة', stepInvoice: 'الفاتورة',
      cartTitle: 'سلة الطلب',
      emptyTitle: 'سلتك فارغة', emptySub: 'اختر كورساتك أو باقة مرحلتك وتظهر هنا.', browse: 'تصفّح الكورسات',
      course: 'كورس', pkg: 'باقة',
      remove: 'حذف', removeSure: 'تحذفه من السلة؟', yes: 'نعم', no: 'لا',
      upsellCta: 'بدّلها',
      upsell: function (name, save, price) { return 'وفر ' + save + ' باختيار ' + name + ' بسعر ' + price + '.'; },
      clearCart: 'تفريغ السلة', clearSure: 'تفرّغ السلة كلها؟',
      summary: 'ملخص الطلب', subtotal: 'المجموع قبل الخصم', pkgDiscount: 'خصم الباقات',
      discount: 'الخصم', total: 'المجموع النهائي', totalCaps: 'المجموع',
      youSave: 'توفيرك', youSaved: 'وفّرت',
      promoQ: 'عندك كود خصم؟',
      promoPh: 'أدخل كود الخصم',
      promoApply: 'تطبيق',
      promoChecking: 'جاري التحقق…',
      promoOk: 'تم تطبيق الكود بنجاح ✅',
      promoRemove: 'إزالة الكود',
      promoCodeLabel: 'كود الخصم',
      promoDiscount: 'خصم الكود',
      promoPct: function (n) { return 'خصم ' + n + '%'; },
      promoAmt: function (v) { return 'خصم ' + v; },
      promoDropped: 'أُزيل كود الخصم لأنه ما بقى منطبق على محتويات سلتك.',
      promoErrs: {
        missing: 'كود الخصم غير صحيح.',
        invalid: 'كود الخصم غير صحيح.',
        disabled: 'كود الخصم غير مفعّل.',
        early: 'لم يبدأ سريان كود الخصم بعد.',
        expired: 'انتهت صلاحية كود الخصم.',
        exhausted: 'تم الوصول إلى الحد الأقصى لاستخدام هذا الكود.',
        perStudent: 'استخدمت هذا الكود مسبقاً.',
        minimum: 'قيمة طلبك أقل من الحد المطلوب لهذا الكود.',
        scope: 'هذا الكود لا ينطبق على محتويات سلتك.',
        scopeCourses: 'هذا الكود صالح للكورسات المفردة فقط.',
        scopePackages: 'هذا الكود صالح للبكجات فقط.',
        empty: 'سلتك فارغة.',
        network: 'تعذر التحقق من الكود — تأكد من الإنترنت وحاول مرة أخرى.'
      },
      placingOrder: 'يتم إنشاء الطلب…',
      orderFail: 'تعذر إنشاء الطلب — حاول مرة أخرى.',
      hintOffline: 'أنشأنا فاتورتك محلياً لأن الخدمة ما كانت متوفرة — أرسلها للدعم وأكد كود الخصم معهم.',
      checkout: 'إكمال الطلب',
      payNote: 'الدفع يتم بالتنسيق مع الدعم على التليكرام — ما نطلب بطاقة ولا معلومات بنكية.',
      checkoutTitle: 'معلومات الطالب',
      checkoutSub: 'نحتاج اسمك ومعرّفك بالتليكرام حتى نأكد الطلب ونرسل لك الكورسات.',
      fName: 'الاسم الكامل *', fTg: 'معرّف التليكرام *', fPhone: 'رقم الهاتف',
      fEmail: 'البريد الإلكتروني', phEmail: 'example@gmail.com', errEmail: 'أدخل بريداً إلكترونياً صحيحاً',
      fUni: 'الجامعة / الكلية', fStage: 'المرحلة *', fNotes: 'ملاحظات (اختياري)',
      phName: 'أحمد علي حسن', phUni: 'كلية الطب - جامعة النهرين', phNotes: 'أي شي تريد تذكره للدعم',
      selectStage: 'اختر مرحلتك',
      errName: 'اكتب اسمك الكامل', errTg: 'اكتب معرّفك بالتليكرام', errStage: 'اختر مرحلتك',
      reviewCta: 'راجع الطلب', backToCart: 'رجوع للسلة',
      reviewTitle: 'راجع طلبك', reviewSub: 'تأكد من الكورسات ومعلوماتك — الفاتورة تنشأ بعد التأكيد.',
      yourOrder: 'طلبك', studentInfo: 'معلومات الطالب', edit: 'تعديل',
      confirmOrder: 'أكّد الطلب',
      confirmNote: 'بعد التأكيد تنشأ فاتورة برقم طلب، وتحفظها كصورة وترسلها للدعم.',
      doneTitle: 'تم إنشاء فاتورتك بنجاح ✅',
      doneSub: 'لإكمال طلبك: حوّل المبلغ لرقم تحويل ابوقراط، احتفظ بالإيصال، ثم أرسل الفاتورة + الإيصال لفريق الدعم.',
      orderNo: 'رقم طلبك',
      date: 'التاريخ', student: 'الطالب', tg: 'التليكرام', stage: 'المرحلة', phone: 'الهاتف', email: 'البريد', uni: 'الجامعة', notes: 'ملاحظات',
      orderStatus: 'حالة الطلب:', pending: 'بانتظار تأكيد الدفع',
      saveInvoice: 'حفظ صورة الفاتورة', saving: 'يتم إنشاء الصورة…',
      sendInvoice: 'إرسال الفاتورة ووصل الدفع للدعم',
      stepsTitle: 'خطوات إكمال الشراء',
      step1Title: 'احفظ صورة الفاتورة',
      step1Body: 'احفظ فاتورة طلبك التي أنشأها موقع ابوقراط — أو انسخ نسختها الكتابية.',
      step2Title: 'حوّل المبلغ عبر SuperQi',
      step2Body: 'افتح تطبيق SuperQi وحوّل المبلغ الكامل الظاهر بفاتورتك إلى رقم التحويل التالي.',
      step3Title: 'أرسل الفاتورة ووصل الدفع',
      step3Body: 'بعد إكمال التحويل، احتفظ بصورة وصل الدفع من SuperQi، وأرسل للدعم الاثنين معاً:',
      importantWord: 'مهم:',
      importantNote: 'لا يتم تفعيل الكورس بمجرد إنشاء الفاتورة. لازم تكمل التحويل وترسل فاتورة الطلب + وصل الدفع لفريق الدعم.',
      payAmount: 'المبلغ المطلوب',
      payNumber: 'رقم التحويل',
      copyNum: 'نسخ رقم التحويل', copiedNum: 'تم نسخ رقم التحويل ✅',
      hintCopiedNum: 'تم نسخ رقم التحويل ✅ حوّل المبلغ واحتفظ بإيصال التحويل.',
      sendItem1: 'فاتورة الطلب من موقع ابوقراط.',
      sendItem2: 'وصل التحويل من تطبيق SuperQi.',
      thenSendTo: 'أرسلها إلى:',
      pendingNote: 'سيبقى طلبك «بانتظار تأكيد الدفع» لحين مراجعة عملية الدفع من فريق الدعم — لا يتغير تلقائياً بعد الحفظ أو النسخ أو فتح التليكرام.',
      msgTitle: 'النسخة الكتابية للفاتورة', copy: 'نسخ النسخة الكتابية', copied: 'تم نسخ الفاتورة ✅',
      hintCopied: 'تم نسخ الفاتورة ✅ تكدر ترسلها هسه لفريق الدعم.',
      backToCourses: 'رجوع للكورسات',
      hintSaved: 'تم حفظ الفاتورة ✅ باقي التحويل وإرسال الوصل مع الفاتورة للدعم.',
      hintFail: 'ما قدرنا ننشئ الصورة بهذا المتصفح — انسخ الرسالة الجاهزة وأرسلها للدعم مع رقم الطلب.',
      included: function (n) { return n + ' كورسات مشمولة'; },
      off: 'خصم'
    },
    en: {
      arrow: '→', back: '→', continueShopping: 'Continue shopping',
      stepCart: 'Cart', stepInfo: 'Your info', stepReview: 'Review', stepInvoice: 'Invoice',
      cartTitle: 'Shopping cart',
      emptyTitle: 'Your cart is empty', emptySub: 'Pick your courses or your stage package and they show up here.', browse: 'Browse courses',
      course: 'Course', pkg: 'Package',
      remove: 'Remove', removeSure: 'Remove it from the cart?', yes: 'Yes', no: 'No',
      upsellCta: 'Switch',
      upsell: function (name, save, price) { return 'Save ' + save + ' by choosing ' + name + ' for ' + price + '.'; },
      clearCart: 'Clear cart', clearSure: 'Clear the whole cart?',
      summary: 'Order summary', subtotal: 'Subtotal', pkgDiscount: 'Package discount',
      discount: 'Discount', total: 'Total', totalCaps: 'TOTAL',
      youSave: 'You save', youSaved: 'You saved',
      promoQ: 'Have a promo code?',
      promoPh: 'Enter promo code',
      promoApply: 'Apply',
      promoChecking: 'Checking…',
      promoOk: 'Promo code applied successfully ✅',
      promoRemove: 'Remove code',
      promoCodeLabel: 'Promo code',
      promoDiscount: 'Promo discount',
      promoPct: function (n) { return n + '% off'; },
      promoAmt: function (v) { return v + ' off'; },
      promoDropped: 'The promo code was removed — it no longer applies to your cart.',
      promoErrs: {
        missing: 'This promo code is not valid.',
        invalid: 'This promo code is not valid.',
        disabled: 'This promo code is not active.',
        early: 'This promo code is not active yet.',
        expired: 'This promo code has expired.',
        exhausted: 'This promo code has reached its usage limit.',
        perStudent: 'You have already used this promo code.',
        minimum: 'Your order does not reach this code’s minimum.',
        scope: 'This promo code does not apply to your cart.',
        scopeCourses: 'This code is valid for individual courses only.',
        scopePackages: 'This code is valid for packages only.',
        empty: 'Your cart is empty.',
        network: 'Could not check the code — check your connection and try again.'
      },
      placingOrder: 'Creating your order…',
      orderFail: 'Could not create the order — please try again.',
      hintOffline: 'We generated your invoice locally because the service was unreachable — send it to support and confirm any promo code with them.',
      checkout: 'Proceed to checkout',
      payNote: 'Payment is arranged with support on Telegram — no card or bank details needed.',
      checkoutTitle: 'Student information',
      checkoutSub: 'We need your name and Telegram username to confirm the order and deliver your courses.',
      fName: 'Full name *', fTg: 'Telegram username *', fPhone: 'Phone number',
      fEmail: 'Email Address', phEmail: 'example@gmail.com', errEmail: 'Enter a valid email address',
      fUni: 'University / College', fStage: 'Stage *', fNotes: 'Notes (optional)',
      phName: 'Ahmed Ali Hassan', phUni: 'College of Medicine - Al-Nahrain University', phNotes: 'Anything support should know',
      selectStage: 'Select your stage',
      errName: 'Enter your full name', errTg: 'Enter your Telegram username', errStage: 'Select your stage',
      reviewCta: 'Review order', backToCart: 'Back to cart',
      reviewTitle: 'Review your order', reviewSub: 'Check the courses and your details — the invoice is created after you confirm.',
      yourOrder: 'Your order', studentInfo: 'Student information', edit: 'Edit',
      confirmOrder: 'Confirm order',
      confirmNote: 'Confirming creates an invoice with an order number you can save as an image and send to support.',
      doneTitle: 'Your invoice has been generated successfully ✅',
      doneSub: 'To complete your order: transfer the amount to the Hippocrates number, save your receipt, then send the invoice and the receipt to support.',
      orderNo: 'Your order number',
      date: 'Date', student: 'Student', tg: 'Telegram', stage: 'Stage', phone: 'Phone', email: 'Email', uni: 'University', notes: 'Notes',
      orderStatus: 'Order status:', pending: 'Pending verification',
      saveInvoice: 'Save invoice image', saving: 'Generating image…',
      sendInvoice: 'Send invoice & receipt to support',
      stepsTitle: 'Steps to complete your purchase',
      step1Title: 'Save the invoice image',
      step1Body: 'Save the order invoice Hippocrates generated for you — or copy its text version.',
      step2Title: 'Transfer the amount via SuperQi',
      step2Body: 'Open the SuperQi app and transfer the full amount shown on your invoice to this number.',
      step3Title: 'Send the invoice and the receipt',
      step3Body: 'After the transfer, save the SuperQi payment receipt and send support both documents:',
      importantWord: 'Important:',
      importantNote: 'Generating the invoice does not activate the course. You must complete the transfer and send both the order invoice and the payment receipt to support.',
      payAmount: 'Amount due',
      payNumber: 'Transfer number',
      copyNum: 'Copy transfer number', copiedNum: 'Transfer number copied ✅',
      hintCopiedNum: 'Transfer number copied ✅ Make the transfer and keep your receipt.',
      sendItem1: 'Your Hippocrates order invoice.',
      sendItem2: 'Your SuperQi payment receipt.',
      thenSendTo: 'Send them to:',
      pendingNote: 'Your order stays “Pending verification” until support reviews the payment — nothing here marks it paid automatically.',
      msgTitle: 'Text version of the invoice', copy: 'Copy invoice text', copied: 'Invoice copied ✅',
      hintCopied: 'Invoice copied ✅ You can now send it to the support team.',
      backToCourses: 'Back to courses',
      hintSaved: 'Invoice saved ✅ Now make the transfer and send it with your receipt to support.',
      hintFail: 'This browser could not generate the image — copy the ready message and send it to support with your order number.',
      included: function (n) { return n + ' courses included'; },
      off: 'OFF'
    }
  };

  var STAGE_LABELS = {
    ar: ['المرحلة الأولى', 'المرحلة الثانية', 'المرحلة الثالثة', 'المرحلة الرابعة', 'المرحلة الخامسة', 'المرحلة السادسة'],
    en: ['First stage', 'Second stage', 'Third stage', 'Fourth stage', 'Fifth stage', 'Sixth stage']
  };

  var state = {
    lang: 'ar', step: 'cart',
    open: {}, confirming: '', clearAsk: false,
    form: { name: '', tg: '', phone: '', email: '', uni: '', stage: '', notes: '' },
    errors: {}, order: null, busy: false, hint: '', copied: false, copiedNum: false,
    promoInput: '', promoBusy: false, promoErr: '', placing: false, orderErr: ''
  };

  function H() { return window.HIPPO; }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function checkIcon() {
    return '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0E7490" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
  }
  function stageLabel(v) {
    var i = parseInt(v, 10) - 1;
    return i >= 0 && i < 6 ? STAGE_LABELS[state.lang][i] : '';
  }
  function tgHandle() {
    var v = String(state.form.tg || '').trim().replace(/^@+/, '');
    return v ? '@' + v : '';
  }
  function promoErrText(res) {
    var t = COPY[state.lang];
    var ar = state.lang === 'ar';
    var local = t.promoErrs[(res && res.key) || ''];
    return local || (ar ? (res && res.reasonAr) : (res && res.reason)) || t.promoErrs.invalid;
  }
  function applyPromoCode() {
    var h = H();
    var code = String(state.promoInput || '').trim();
    if (!h || !code || state.promoBusy) return;
    state.promoBusy = true; state.promoErr = '';
    renderAll();
    h.applyPromo(code, tgHandle()).then(function (res) {
      state.promoBusy = false;
      if (res && res.ok) { state.promoErr = ''; state.promoInput = ''; } else { state.promoErr = promoErrText(res); }
      renderAll();
    });
  }
  function removePromoCode() {
    var h = H();
    if (h) h.removePromo();
    state.promoErr = ''; state.promoInput = '';
    renderAll();
  }

  var root = document.getElementById('root');
  var header = document.getElementById('header');
  var btnAr = document.getElementById('btn-ar');
  var btnEn = document.getElementById('btn-en');
  var stepsRow = document.getElementById('steps-row');

  function go(step) {
    state.step = step;
    render();
    window.scrollTo(0, 0);
  }

  /* ---------- steps indicator ---------- */
  function renderSteps() {
    var t = COPY[state.lang];
    var order4 = ['cart', 'checkout', 'review', 'done'];
    var at = order4.indexOf(state.step);
    var labels = [t.stepCart, t.stepInfo, t.stepReview, t.stepInvoice];
    stepsRow.innerHTML = labels.map(function (label, i) {
      var on = i === at, past = i < at;
      var dotClass = on ? 'on' : past ? 'past' : '';
      var lblClass = on ? 'on' : past ? 'past' : '';
      return (
        '<span class="hip-step">' +
          '<span class="hip-step-dot ' + dotClass + '">' + (past ? '✓' : '0' + (i + 1)) + '</span>' +
          '<span class="hip-step-label ' + lblClass + '">' + esc(label) + '</span>' +
        '</span>'
      );
    }).join('');
  }

  /* ---------- CART step ---------- */
  function lineData() {
    var h = H();
    var t = COPY[state.lang];
    var ar = state.lang === 'ar';
    var money = h.money;
    return h.cartLines().map(function (l) {
      var p = l.product;
      var isPkg = l.type === 'package';
      var lect = !isPkg ? (h.LECTURERS[p.lect] || {}) : {};
      var stLabel = !isPkg && h.stageLabel ? h.stageLabel(p, state.lang) : '';
      var badge = !isPkg && p.badge ? h.BADGES[p.badge] : null;
      return {
        cartId: l.cartId, isPkg: isPkg,
        name: ar ? (p.nameAr || p.titleAr) : (p.name || p.title),
        lecturer: isPkg ? '' : ((ar ? lect.ar : lect.en) || ''),
        stageLabel: stLabel,
        typeLabel: badge ? (ar ? badge.ar : badge.en) : '',
        kindLabel: isPkg ? t.pkg : t.course,
        courses: l.courses.map(function (c) { return { name: ar ? c.titleAr : c.title }; }),
        original: money(l.original), price: money(l.price), pct: l.pct, discounted: l.save > 0
      };
    });
  }

  function renderCartLines() {
    var h = H();
    var t = COPY[state.lang];
    var lines = lineData();
    var container = document.getElementById('cart-lines');

    container.innerHTML = lines.map(function (l) {
      var open = !!state.open[l.cartId];
      var confirming = state.confirming === l.cartId;
      return (
        '<article class="hip-cart-line">' +
          '<div class="hip-cart-line-top">' +
            '<span class="hip-cart-line-icon ' + (l.isPkg ? 'pkg' : 'course') + '">' +
              (l.isPkg
                ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.4l8 4-8 4-8-4 8-4Z"></path><path d="M4 11.5l8 4 8-4M4 16l8 4 8-4"></path></svg>'
                : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0E7490" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6.2v13"></path><path d="M12 6.2C10.4 4.9 8.2 4.4 4.5 4.6v12.6c3.6-.2 6 .3 7.5 1.6"></path><path d="M12 6.2c1.6-1.3 3.8-1.8 7.5-1.6v12.6c-3.6-.2-6 .3-7.5 1.6"></path></svg>') +
            '</span>' +
            '<div class="hip-cart-line-body">' +
              '<div class="hip-cart-line-tags">' +
                '<span class="hip-cart-line-kind ' + (l.isPkg ? 'pkg' : 'course') + '">' + esc(l.kindLabel) + '</span>' +
                (l.stageLabel ? '<span class="hip-cart-line-tag">' + esc(l.stageLabel) + '</span>' : '') +
                (l.typeLabel ? '<span class="hip-cart-line-tag badge2">' + esc(l.typeLabel) + '</span>' : '') +
              '</div>' +
              '<h3 class="hip-cart-line-name">' + esc(l.name) + '</h3>' +
              (l.lecturer ? '<div class="hip-cart-line-lecturer">' + esc(l.lecturer) + '</div>' : '') +
              (l.isPkg ? '<button type="button" class="hip-cart-line-toggle" data-toggle="' + l.cartId + '">' + esc(t.included(l.courses.length)) + '<span class="mono">' + (open ? '▲' : '▼') + '</span></button>' : '') +
              (l.isPkg && open
                ? '<ul class="hip-cart-line-sublist">' + l.courses.map(function (c) { return '<li>' + checkIcon() + esc(c.name) + '</li>'; }).join('') + '</ul>'
                : '') +
            '</div>' +
            '<div class="hip-cart-line-price-col">' +
              (l.discounted ? '<span class="hip-cart-line-oldprice mono">' + esc(l.original) + '</span>' : '') +
              '<span class="hip-cart-line-price mono">' + esc(l.price) + '</span>' +
              (l.discounted ? '<span class="hip-cart-line-pct"><span class="mono">' + esc(l.pct) + '</span> ' + esc(t.off) + '</span>' : '') +
            '</div>' +
          '</div>' +
          '<div class="hip-cart-line-foot">' +
            (confirming
              ? '<span class="hip-confirm-row">' + esc(t.removeSure) +
                '<button type="button" class="hip-confirm-yes" data-remove="' + l.cartId + '">' + esc(t.yes) + '</button>' +
                '<button type="button" class="hip-confirm-no" data-cancel-remove="' + l.cartId + '">' + esc(t.no) + '</button></span>'
              : '<button type="button" class="hip-remove-btn" data-ask-remove="' + l.cartId + '">' +
                '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M5 7h14M9.5 7V4.8h5V7M7 7l.9 12.2h8.2L17 7"></path></svg>' + esc(t.remove) + '</button>') +
          '</div>' +
        '</article>'
      );
    }).join('');

    Array.prototype.forEach.call(container.querySelectorAll('[data-toggle]'), function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-toggle');
        state.open[id] = !state.open[id];
        renderCartLines();
      });
    });
    Array.prototype.forEach.call(container.querySelectorAll('[data-ask-remove]'), function (btn) {
      btn.addEventListener('click', function () { state.confirming = btn.getAttribute('data-ask-remove'); renderCartLines(); });
    });
    Array.prototype.forEach.call(container.querySelectorAll('[data-cancel-remove]'), function (btn) {
      btn.addEventListener('click', function () { state.confirming = ''; renderCartLines(); });
    });
    Array.prototype.forEach.call(container.querySelectorAll('[data-remove]'), function (btn) {
      btn.addEventListener('click', function () {
        H().removeFromCart(btn.getAttribute('data-remove'));
        state.confirming = '';
        renderAll();
      });
    });
  }

  function promoValueLabel(promo) {
    var t = COPY[state.lang];
    var h = H();
    if (!promo) return '';
    return promo.discountType === 'percentage'
      ? t.promoPct(Number(promo.discountValue))
      : t.promoAmt(h.money(promo.discountValue));
  }

  function promoInteractiveHTML() {
    var t = COPY[state.lang];
    var h = H();
    var promo = h.getPromo();
    var tt = h.cartTotals();
    if (promo && tt.promoCode) {
      return (
        '<div class="hip-promo-wrap"><div class="hip-promo-applied">' +
          '<span class="msg">' + esc(t.promoOk) + '</span>' +
          '<span class="row"><span class="code mono">' + esc(tt.promoCode) + '</span><span class="value">' + esc(promoValueLabel(promo)) + '</span></span>' +
          '<button type="button" class="hip-promo-remove-btn" id="promo-remove-btn">' +
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"></path></svg>' + esc(t.promoRemove) +
          '</button>' +
        '</div></div>'
      );
    }
    return (
      '<div class="hip-promo-wrap"><div class="hip-promo-idle">' +
        '<span class="q">' + esc(t.promoQ) + '</span>' +
        '<div class="hip-promo-row">' +
          '<input type="text" id="promo-input" dir="auto" placeholder="' + esc(t.promoPh) + '" value="' + esc(state.promoInput) + '"' + (state.promoErr ? ' class="error"' : '') + '>' +
          '<button type="button" id="promo-apply-btn"' + (state.promoBusy ? ' disabled' : '') + '>' + esc(state.promoBusy ? t.promoChecking : t.promoApply) + '</button>' +
        '</div>' +
        (state.promoErr
          ? '<span class="hip-promo-error"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="12" cy="12" r="9"></circle><path d="M12 8v5"></path><path d="M12 16.4h.01"></path></svg>' + esc(state.promoErr) + '</span>'
          : '') +
      '</div></div>'
    );
  }

  function wirePromoInteractive(container) {
    var removeBtn = container.querySelector('#promo-remove-btn');
    if (removeBtn) removeBtn.addEventListener('click', removePromoCode);
    var input = container.querySelector('#promo-input');
    if (input) {
      input.addEventListener('input', function () {
        state.promoInput = input.value.toUpperCase();
        input.value = state.promoInput;
        if (state.promoErr) {
          state.promoErr = '';
          var errEl = container.querySelector('.hip-promo-error');
          if (errEl) errEl.remove();
        }
      });
      input.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); applyPromoCode(); } });
    }
    var applyBtn = container.querySelector('#promo-apply-btn');
    if (applyBtn) applyBtn.addEventListener('click', applyPromoCode);
  }

  function promoReadonlyHTML(tt) {
    var t = COPY[state.lang];
    var h = H();
    if (!(tt.promoDiscount > 0 && tt.promoCode)) return '';
    return (
      '<div class="hip-summary-promo-chip-row"><span>' + esc(t.promoCodeLabel) + '</span><span class="code mono">' + esc(tt.promoCode) + '</span></div>' +
      '<div class="hip-summary-promo-discount-row"><span>' + esc(t.promoDiscount) + '</span><span class="val mono">' + esc('−' + h.money(tt.promoDiscount)) + '</span></div>'
    );
  }

  function renderCartSummary() {
    var h = H();
    var t = COPY[state.lang];
    var tt = h.cartTotals();
    var el = document.getElementById('cart-summary');
    el.innerHTML =
      '<div class="hip-summary-label">' + esc(t.summary) + '</div>' +
      '<div class="hip-summary-row"><span>' + esc(t.subtotal) + '</span><span class="val mono">' + esc(h.money(tt.subtotal)) + '</span></div>' +
      (tt.bundleDiscount > 0 ? '<div class="hip-summary-row discount"><span>' + esc(t.pkgDiscount) + '</span><span class="val mono">' + esc('−' + h.money(tt.bundleDiscount)) + '</span></div>' : '') +
      promoInteractiveHTML() +
      (tt.promoDiscount > 0 ? '<div class="hip-summary-row discount"><span>' + esc(t.promoDiscount) + '</span><span class="val mono">' + esc('−' + h.money(tt.promoDiscount)) + '</span></div>' : '') +
      '<div class="hip-summary-total-row"><span>' + esc(t.total) + '</span><span class="val mono">' + esc(h.money(tt.total)) + '</span></div>' +
      (tt.discount > 0 ? '<div class="hip-summary-save-box"><span class="lbl">' + esc(t.youSave) + '</span><span class="val mono">' + esc(h.money(tt.savings)) + '</span></div>' : '') +
      '<button type="button" class="hip-summary-btn" id="cart-summary-cta">' + esc(t.checkout) + '<span class="btn-arrow">' + t.arrow + '</span></button>' +
      '<p class="hip-summary-note">' + esc(t.payNote) + '</p>';
    document.getElementById('cart-summary-cta').addEventListener('click', function () { go('checkout'); });
    wirePromoInteractive(el);
  }

  function renderCheckoutSummary() {
    var h = H();
    var t = COPY[state.lang];
    var ar = state.lang === 'ar';
    var tt = h.cartTotals();
    var lines = lineData();
    var el = document.getElementById('checkout-summary');
    el.innerHTML =
      '<div class="hip-summary-label">' + esc(t.summary) + '</div>' +
      lines.map(function (l) {
        return '<div class="hip-summary-line-row"><span>' + esc(l.name) + '</span><span class="val">' + esc(l.price) + '</span></div>';
      }).join('') +
      promoReadonlyHTML(tt) +
      '<div class="hip-summary-total-row"><span>' + esc(t.total) + '</span><span class="val mono">' + esc(h.money(tt.total)) + '</span></div>' +
      '<button type="button" class="hip-summary-btn" id="checkout-summary-cta">' + esc(t.reviewCta) + '<span class="btn-arrow">' + t.arrow + '</span></button>' +
      '<button type="button" class="hip-summary-btn-outline" id="checkout-summary-back">' + esc(t.backToCart) + '</button>';
    document.getElementById('checkout-summary-cta').addEventListener('click', toReview);
    document.getElementById('checkout-summary-back').addEventListener('click', function () { go('cart'); });
  }

  function renderReviewSummary() {
    var h = H();
    var t = COPY[state.lang];
    var tt = h.cartTotals();
    var el = document.getElementById('review-summary');
    el.innerHTML =
      '<div class="hip-summary-row"><span>' + esc(t.subtotal) + '</span><span class="val mono">' + esc(h.money(tt.subtotal)) + '</span></div>' +
      (tt.bundleDiscount > 0 ? '<div class="hip-summary-row discount"><span>' + esc(t.pkgDiscount) + '</span><span class="val mono">' + esc('−' + h.money(tt.bundleDiscount)) + '</span></div>' : '') +
      promoReadonlyHTML(tt) +
      '<div class="hip-summary-total-row"><span>' + esc(t.total) + '</span><span class="val mono">' + esc(h.money(tt.total)) + '</span></div>' +
      '<button type="button" class="hip-summary-btn" id="review-summary-cta"' + (state.placing ? ' disabled' : '') + '>' +
        (state.placing ? '<span class="hip-step-spin" style="border-color:rgba(255,255,255,.35);border-top-color:#fff"></span>' : '') +
        esc(state.placing ? t.placingOrder : t.confirmOrder) +
        (state.placing ? '' : '<span class="btn-arrow">' + t.arrow + '</span>') +
      '</button>' +
      (state.orderErr ? '<p class="hip-order-err">' + esc(state.orderErr) + '</p>' : '') +
      '<p class="hip-summary-note">' + esc(t.confirmNote) + '</p>';
    document.getElementById('review-summary-cta').addEventListener('click', confirmOrder);
  }

  function renderCartStep() {
    var h = H();
    var t = COPY[state.lang];
    var ar = state.lang === 'ar';
    var lines = h.getCart();
    var n = lines.length;

    document.getElementById('cart-title').textContent = t.cartTitle;
    document.getElementById('cart-sub').textContent = ar
      ? (n + ' عنصر بسلتك')
      : (n + (n === 1 ? ' item in your cart' : ' items in your cart'));

    var empty = document.getElementById('cart-empty');
    var body = document.getElementById('cart-body');
    empty.hidden = n !== 0;
    body.hidden = n === 0;

    if (n === 0) {
      document.getElementById('empty-title').textContent = t.emptyTitle;
      document.getElementById('empty-sub').textContent = t.emptySub;
      var eb = document.getElementById('empty-browse');
      eb.childNodes[0].textContent = t.browse;
      return;
    }

    var up = h.upsellFor ? h.upsellFor() : null;
    var upsellBanner = document.getElementById('upsell-banner');
    if (up) {
      upsellBanner.hidden = false;
      document.getElementById('upsell-text').textContent = t.upsell(ar ? up.bundle.titleAr : up.bundle.title, h.money(up.save), h.money(up.price));
      var applyBtn = document.getElementById('upsell-apply');
      applyBtn.textContent = t.upsellCta;
      applyBtn.onclick = function () { h.applyUpsell(up); renderAll(); };
    } else {
      upsellBanner.hidden = true;
    }

    renderCartLines();

    document.getElementById('cl-text').textContent = t.continueShopping;

    var clearZone = document.getElementById('clear-zone');
    if (state.clearAsk) {
      clearZone.innerHTML =
        '<span class="hip-clear-confirm">' + esc(t.clearSure) +
        '<button type="button" class="hip-clear-yes" id="clear-yes">' + esc(t.yes) + '</button>' +
        '<button type="button" class="hip-clear-no" id="clear-no">' + esc(t.no) + '</button></span>';
      document.getElementById('clear-yes').onclick = function () { h.clearCart(); state.clearAsk = false; renderAll(); };
      document.getElementById('clear-no').onclick = function () { state.clearAsk = false; renderCartStep(); };
    } else {
      clearZone.innerHTML = '<button type="button" class="hip-clear-link" id="clear-ask">' + esc(t.clearCart) + '</button>';
      document.getElementById('clear-ask').onclick = function () { state.clearAsk = true; renderCartStep(); };
    }

    renderCartSummary();
  }

  /* ---------- CHECKOUT step ---------- */
  function fieldRow(key, label, opts) {
    opts = opts || {};
    var err = state.errors[key];
    var val = esc(state.form[key] || '');
    var input;
    if (opts.type === 'select') {
      input = '<select data-field="' + key + '">' +
        '<option value="">' + esc(COPY[state.lang].selectStage) + '</option>' +
        STAGE_LABELS[state.lang].map(function (l, i) {
          var v = String(i + 1);
          return '<option value="' + v + '"' + (state.form.stage === v ? ' selected' : '') + '>' + esc(l) + '</option>';
        }).join('') +
        '</select>';
    } else if (opts.type === 'textarea') {
      input = '<textarea data-field="' + key + '" rows="3" placeholder="' + esc(opts.placeholder || '') + '">' + val + '</textarea>';
    } else {
      input = '<input data-field="' + key + '" type="' + (opts.type === 'email' ? 'email' : 'text') + '"' +
        (opts.type === 'email' ? ' inputmode="email" autocomplete="email" spellcheck="false"' : '') +
        ' dir="' + (opts.ltr ? 'ltr' : 'auto') + '" value="' + val + '" placeholder="' + esc(opts.placeholder || '') + '">';
    }
    return (
      '<div class="hip-form-field' + (err ? ' error' : '') + (opts.full ? ' full' : '') + '">' +
        '<label>' + esc(label) + '</label>' + input +
        (err ? '<span class="hip-form-error">' + esc(err) + '</span>' : '') +
      '</div>'
    );
  }

  function renderCheckoutStep() {
    var t = COPY[state.lang];
    document.getElementById('checkout-title').textContent = t.checkoutTitle;
    document.getElementById('checkout-sub').textContent = t.checkoutSub;

    var form = document.getElementById('checkout-form');
    form.innerHTML =
      fieldRow('name', t.fName, { placeholder: t.phName }) +
      fieldRow('tg', t.fTg, { placeholder: '@username', ltr: true }) +
      fieldRow('phone', t.fPhone, { placeholder: '0770 000 0000', ltr: true }) +
      fieldRow('email', t.fEmail, { placeholder: t.phEmail, ltr: true, type: 'email' }) +
      fieldRow('uni', t.fUni, { placeholder: t.phUni }) +
      fieldRow('stage', t.fStage, { type: 'select' }) +
      fieldRow('notes', t.fNotes, { type: 'textarea', placeholder: t.phNotes, full: true });

    Array.prototype.forEach.call(form.querySelectorAll('[data-field]'), function (el) {
      el.addEventListener('change', function () {
        state.form[el.getAttribute('data-field')] = el.value;
        delete state.errors[el.getAttribute('data-field')];
      });
    });

    renderCheckoutSummary();
  }

  function validate() {
    var f = state.form;
    var t = COPY[state.lang];
    var errors = {};
    if (!String(f.name).trim()) errors.name = t.errName;
    if (!String(f.tg).replace(/^@/, '').trim()) errors.tg = t.errTg;
    if (!f.stage) errors.stage = t.errStage;
    /* البريد اختياري: ما نعترض على الفارغ إطلاقاً، ونتحقق من الصيغة فقط
       إذا كتب الطالب شي. السيرفر يعيد نفس التحقق — هذا للراحة لا للأمان. */
    var em = String(f.email || '').trim();
    if (em && !/^[^@\s]+@[^@\s.]+(\.[^@\s.]+)+$/.test(em)) errors.email = t.errEmail;
    state.errors = errors;
    return Object.keys(errors).length === 0;
  }

  function toReview() {
    if (!validate()) { renderCheckoutStep(); return; }
    go('review');
  }

  /* ---------- REVIEW step ---------- */
  function renderReviewStep() {
    var h = H();
    var t = COPY[state.lang];
    var ar = state.lang === 'ar';
    var lines = lineData();

    document.getElementById('review-title').textContent = t.reviewTitle;
    document.getElementById('review-sub').textContent = t.reviewSub;

    document.getElementById('review-order').innerHTML =
      '<div class="hip-review-label">' + esc(t.yourOrder) + '</div>' +
      lines.map(function (l) {
        return (
          '<div class="hip-review-line">' +
            '<div class="hip-review-line-row"><span class="hip-review-line-name">' + esc(l.name) + '</span><span class="hip-review-line-price mono">' + esc(l.price) + '</span></div>' +
            (l.isPkg ? '<div class="hip-review-line-count">' + esc(t.included(l.courses.length)) + '</div>' : '') +
          '</div>'
        );
      }).join('');

    var f = state.form;
    var rows = [
      { label: t.student, value: String(f.name).trim() },
      { label: t.tg, value: tgHandle() },
      { label: t.stage, value: stageLabel(f.stage) },
      { label: t.phone, value: String(f.phone).trim() },
      { label: t.email, value: String(f.email).trim().toLowerCase() },
      { label: t.uni, value: String(f.uni).trim() },
      { label: t.notes, value: String(f.notes).trim() }
    ].filter(function (r) { return !!r.value; });

    document.getElementById('review-info').innerHTML =
      '<div class="hip-review-label">' + esc(t.studentInfo) + '<button type="button" class="hip-review-edit-btn" id="review-edit">' + esc(t.edit) + '</button></div>' +
      '<div class="hip-review-info-grid">' +
        rows.map(function (r) {
          return '<div><div class="hip-review-info-item-label">' + esc(r.label) + '</div><div class="hip-review-info-item-value">' + esc(r.value) + '</div></div>';
        }).join('') +
      '</div>';
    document.getElementById('review-edit').onclick = function () { go('checkout'); };

    renderReviewSummary();
  }

  function confirmOrder() {
    var h = H();
    var t = COPY[state.lang];
    var ar = state.lang === 'ar';
    var f = state.form;
    if (state.placing) return;
    state.placing = true; state.orderErr = '';
    renderReviewSummary();
    h.createOrder({
      name: String(f.name).trim(), telegram: tgHandle(), phone: String(f.phone).trim(),
      email: String(f.email).trim().toLowerCase(),
      university: String(f.uni).trim(), stage: f.stage, notes: String(f.notes).trim()
    }).then(function (res) {
      if (!res || !res.ok) {
        state.placing = false;
        if (res && res.promoRejected) {
          state.step = 'cart';
          state.promoErr = promoErrText(res);
          render();
          window.scrollTo(0, 0);
          return;
        }
        state.orderErr = (ar ? (res && res.reasonAr) : (res && res.reason)) || t.orderFail;
        renderReviewSummary();
        return;
      }
      h.clearCart();
      state.placing = false;
      state.order = res.order;
      state.orderErr = '';
      state.hint = res.offline ? t.hintOffline : '';
      go('done');
    });
  }

  /* ---------- DONE step ---------- */
  function fileName() {
    var o = state.order;
    return 'Hippocrates-' + (o ? o.id : 'invoice') + '.png';
  }

  function invoiceMessage() {
    var o = state.order;
    var h = H();
    if (!o) return '';
    var money = h.money;
    var stages = ['1st Stage', '2nd Stage', '3rd Stage', '4th Stage', '5th Stage', '6th Stage'];
    var rule = '----------------------------';
    var out = ['HIPPOCRATES', 'Medical Education Platform', '', 'Order Invoice', '', 'Order ID:', o.id, '',
      'Student:', o.student.name, '', 'Telegram:', o.student.telegram];
    var si = parseInt(o.student.stage, 10) - 1;
    if (stages[si]) out.push('', 'Stage:', stages[si]);
    if (o.student.phone) out.push('', 'Phone:', o.student.phone);
    if (o.student.university) out.push('', 'University:', o.student.university);
    o.lines.forEach(function (l) {
      out.push('', rule, '', l.name);
      if (l.courses && l.courses.length) {
        out.push('', 'Includes:');
        l.courses.forEach(function (x) { out.push('- ' + x.title); });
      }
      if (l.save > 0) {
        out.push('', 'Original Value:', money(l.original), '', 'Package Price:', money(l.price), '', 'Savings:', money(l.save));
      } else {
        out.push('', 'Price:', money(l.price));
      }
    });
    out.push('', rule, '');
    if (o.savings > 0) out.push('Subtotal:', money(o.subtotal), '');
    if (o.bundleDiscount > 0) out.push('Package Discount:', '-' + money(o.bundleDiscount), '');
    if (o.promoDiscount > 0) out.push('Promo Code:', o.promoCode, '', 'Promo Discount:', '-' + money(o.promoDiscount), '');
    var pay = h.PAYMENT || { transferNumber: '917347931532', supportUsername: '@Hippocrates_Support' };
    out.push('TOTAL:', money(o.total), '', 'Payment Status:', 'Pending Verification', '',
      'Payment Transfer Number:', pay.transferNumber, '', 'Support:', pay.supportUsername, '', rule, '',
      'Please send this invoice together with your payment transfer receipt to Hippocrates Support.');
    return out.join('\n');
  }

  function copyText(text, onDone) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(onDone, onDone);
      return;
    }
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    ta.remove();
    onDone();
  }

  function copyInvoiceMsg() {
    var t = COPY[state.lang];
    copyText(invoiceMessage(), function () {
      state.copied = true; state.hint = t.hintCopied;
      renderDoneStep();
      clearTimeout(copyTimer);
      copyTimer = setTimeout(function () { state.copied = false; renderDoneStep(); }, 2400);
    });
  }

  var copyTimer = null, copyNumTimer = null;

  function copyTransferNumber() {
    var h = H();
    var t = COPY[state.lang];
    var num = h.PAYMENT ? h.PAYMENT.transferNumber : '917347931532';
    copyText(num, function () {
      state.copiedNum = true; state.hint = t.hintCopiedNum;
      renderDoneStep();
      clearTimeout(copyNumTimer);
      copyNumTimer = setTimeout(function () { state.copiedNum = false; renderDoneStep(); }, 2600);
    });
  }

  function renderDoneStep() {
    var h = H();
    var t = COPY[state.lang];
    var ar = state.lang === 'ar';
    var o = state.order;
    if (!o) { go('cart'); return; }

    document.getElementById('done-title').textContent = t.doneTitle;
    document.getElementById('done-sub').textContent = t.doneSub;
    document.getElementById('done-order-label').textContent = t.orderNo;
    document.getElementById('done-order-id').textContent = o.id;

    var dateStr = new Date(o.createdAt).toLocaleDateString(ar ? 'ar-IQ' : 'en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
    var meta = [
      { label: t.orderNo, value: o.id },
      { label: t.date, value: dateStr },
      { label: t.student, value: o.student.name },
      { label: t.tg, value: o.student.telegram },
      { label: t.stage, value: stageLabel(o.student.stage) }
    ].filter(function (m) { return !!m.value; });

    var invoiceLinesHTML = o.lines.map(function (l) {
      var name = ar ? (l.nameAr || l.name) : l.name;
      return (
        '<div class="hip-invoice-line">' +
          '<div class="hip-invoice-line-row">' +
            '<span class="hip-invoice-line-name">' + esc(name) + '</span>' +
            (l.save > 0 ? '<span class="hip-invoice-line-old mono">' + esc(h.money(l.original)) + '</span>' : '') +
            '<span class="hip-invoice-line-price mono">' + esc(h.money(l.price)) + '</span>' +
          '</div>' +
          (l.courses.length ? '<ul class="hip-invoice-line-courses">' + l.courses.map(function (c) {
            return '<li><span>✓</span>' + esc(ar ? c.titleAr : c.title) + '</li>';
          }).join('') + '</ul>' : '') +
        '</div>'
      );
    }).join('');

    document.getElementById('invoice-card').innerHTML =
      '<div class="hip-invoice-head">' +
        '<img src="assets/hippocrates-logo.png" alt="">' +
        '<span class="hip-invoice-brand"><span class="hip-invoice-brand-name">HIPPOCRATES</span><span class="hip-invoice-brand-sub">Medical Education Platform</span></span>' +
        '<span class="hip-invoice-order-tag"><span>ORDER INVOICE</span><span class="mono">' + esc(o.id) + '</span></span>' +
      '</div>' +
      '<div class="hip-invoice-body">' +
        '<div class="hip-invoice-meta-grid">' +
          meta.map(function (m) { return '<div><div class="hip-invoice-meta-label">' + esc(m.label) + '</div><div class="hip-invoice-meta-value">' + esc(m.value) + '</div></div>'; }).join('') +
        '</div>' +
        invoiceLinesHTML +
        '<div class="hip-invoice-totals">' +
          '<div class="hip-invoice-total-row"><span>' + esc(t.subtotal) + '</span><span class="val mono">' + esc(h.money(o.subtotal)) + '</span></div>' +
          (o.bundleDiscount > 0 ? '<div class="hip-invoice-total-row discount"><span>' + esc(t.pkgDiscount) + '</span><span class="val mono">' + esc('−' + h.money(o.bundleDiscount)) + '</span></div>' : '') +
          (o.promoDiscount > 0
            ? '<div class="hip-invoice-total-row"><span>' + esc(t.promoCodeLabel) + '</span><span class="val hip-invoice-promo-chip">' + esc(o.promoCode) + '</span></div>' +
              '<div class="hip-invoice-total-row discount"><span>' + esc(t.promoDiscount) + '</span><span class="val mono">' + esc('−' + h.money(o.promoDiscount)) + '</span></div>'
            : '') +
          '<div class="hip-invoice-total-row strong"><span>' + esc(t.totalCaps) + '</span><span class="val mono">' + esc(h.money(o.total)) + '</span></div>' +
          (o.savings > 0 ? '<div class="hip-invoice-save-box"><span class="lbl">' + esc(t.youSaved) + '</span><span class="val mono">' + esc(h.money(o.savings)) + '</span></div>' : '') +
          '<div class="hip-invoice-status-row"><span class="lbl">' + esc(t.orderStatus) + '</span><span class="hip-invoice-status-pill"><span class="dot"></span>' + esc(t.pending) + '</span></div>' +
        '</div>' +
      '</div>' +
      '<div class="hip-invoice-foot"><span>Hippocrates Medical Education Platform</span><span class="handle">' + esc(h.LINKS.supportHandle) + '</span></div>';

    var payTotal = h.money(o.total);
    var transferNumber = h.PAYMENT ? h.PAYMENT.transferNumber : '917347931532';

    var actions = document.getElementById('done-actions');
    actions.innerHTML =
      '<div class="hip-steps-card">' +
        '<div class="hip-steps-head">' +
          '<span class="ico"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0E7490" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5.5h9.5"></path><path d="M9 12h9.5"></path><path d="M9 18.5h9.5"></path><circle cx="5" cy="5.5" r="1.4"></circle><circle cx="5" cy="12" r="1.4"></circle><circle cx="5" cy="18.5" r="1.4"></circle></svg></span>' +
          '<h2>' + esc(t.stepsTitle) + '</h2>' +
        '</div>' +
        '<div class="hip-steps-list">' +
          '<div class="hip-step-row">' +
            '<span class="hip-step-marker"><span class="num">1</span><span class="line"></span></span>' +
            '<span class="hip-step-body">' +
              '<span class="title">' + esc(t.step1Title) + '</span>' +
              '<span class="desc">' + esc(t.step1Body) + '</span>' +
              '<button type="button" class="hip-step-btn-outline" id="btn-save">' + (state.busy ? '<span class="hip-step-spin"></span>' : '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.5v11"></path><path d="m7.5 10.5 4.5 4 4.5-4"></path><path d="M4.5 18.5h15"></path></svg>') + esc(state.busy ? t.saving : t.saveInvoice) + '</button>' +
              '<button type="button" class="hip-step-link-btn" id="btn-copy-msg">' + esc(state.copied ? t.copied : t.copy) + '</button>' +
            '</span>' +
          '</div>' +
          '<div class="hip-step-row">' +
            '<span class="hip-step-marker"><span class="num">2</span><span class="line"></span></span>' +
            '<span class="hip-step-body">' +
              '<span class="title">' + esc(t.step2Title) + '</span>' +
              '<span class="desc">' + esc(t.step2Body) + '</span>' +
              '<div class="hip-pay-panel">' +
                '<div class="hip-pay-row"><span class="lbl">' + esc(t.payAmount) + '</span><span class="amt">' + esc(payTotal) + '</span></div>' +
                '<div class="hip-pay-row divider"><span class="lbl">' + esc(t.payNumber) + '</span><span class="num">' + esc(transferNumber) + '</span></div>' +
                '<button type="button" class="hip-pay-copy-btn" id="btn-copy-num"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2.4"></rect><path d="M5.5 15H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v.5"></path></svg>' + esc(state.copiedNum ? t.copiedNum : t.copyNum) + '</button>' +
              '</div>' +
            '</span>' +
          '</div>' +
          '<div class="hip-step-row">' +
            '<span class="hip-step-marker"><span class="num">3</span></span>' +
            '<span class="hip-step-body">' +
              '<span class="title">' + esc(t.step3Title) + '</span>' +
              '<span class="desc">' + esc(t.step3Body) + '</span>' +
              '<div class="hip-send-checklist">' +
                '<span class="hip-send-checklist-item"><span>✓</span>' + esc(t.sendItem1) + '</span>' +
                '<span class="hip-send-checklist-item"><span>✓</span>' + esc(t.sendItem2) + '</span>' +
              '</div>' +
              '<a href="' + esc(h.LINKS.support) + '" target="_blank" rel="noopener noreferrer" class="hip-send-btn"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 4.5 2.9 11.4c-.8.3-.8 1.4 0 1.7l4.3 1.4 1.6 4.9c.2.7 1.1.9 1.6.3l2.2-2.6 4.4 3.2c.6.5 1.5.1 1.7-.6L21.9 5.6c.2-.8-.5-1.4-1.2-1.1Z"></path></svg>' + esc(t.sendInvoice) + '</a>' +
              '<span class="hip-send-to-line">' + esc(t.thenSendTo) + ' <a href="' + esc(h.LINKS.support) + '" target="_blank" rel="noopener noreferrer">' + esc(h.LINKS.supportHandle) + '</a></span>' +
            '</span>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="hip-important-box"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#B08D57" stroke-width="1.9" stroke-linecap="round"><path d="M12 8v5"></path><path d="M12 16.4h.01"></path><circle cx="12" cy="12" r="9"></circle></svg><span><strong>' + esc(t.importantWord) + '</strong> ' + esc(t.importantNote) + '</span></div>' +
      (state.hint ? '<div class="hip-hint-box">' + esc(state.hint) + '</div>' : '') +
      '<p class="hip-pending-note">' + esc(t.pendingNote) + '</p>' +
      '<details class="hip-invoice-text-details">' +
        '<summary>' + esc(t.msgTitle) + '</summary>' +
        '<pre>' + esc(invoiceMessage()) + '</pre>' +
      '</details>' +
      '<a href="index.html" class="hip-back-courses-link">' + esc(t.backToCourses) + '</a>';

    document.getElementById('btn-save').onclick = saveInvoice;
    document.getElementById('btn-copy-msg').onclick = copyInvoiceMsg;
    document.getElementById('btn-copy-num').onclick = copyTransferNumber;
  }

  function invoicePng() {
    var node = document.getElementById('invoice-card');
    if (!node || !window.htmlToImage) return Promise.reject(new Error('no exporter'));
    var opts = { pixelRatio: 2, backgroundColor: '#ffffff', cacheBust: true, width: node.offsetWidth, height: node.offsetHeight };
    return window.htmlToImage.toPng(node, opts).then(function () {
      return window.htmlToImage.toBlob(node, opts);
    });
  }

  function downloadBlob(blob) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = fileName();
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
  }

  function saveInvoice() {
    var t = COPY[state.lang];
    state.busy = true; state.hint = '';
    renderDoneStep();
    invoicePng().then(function (blob) {
      downloadBlob(blob);
      state.busy = false; state.hint = t.hintSaved;
      renderDoneStep();
    }).catch(function () {
      state.busy = false; state.hint = t.hintFail;
      renderDoneStep();
    });
  }


  /* ---------- mobile sticky bar ---------- */
  function renderMobileBar() {
    var h = H();
    var t = COPY[state.lang];
    var bar = document.getElementById('mobile-bar');
    var show = (state.step === 'cart' || state.step === 'checkout') && h.getCart().length > 0;
    bar.hidden = !show;
    if (!show) return;
    var tt = h.cartTotals();
    document.getElementById('mb-label').textContent = t.total;
    document.getElementById('mb-total').textContent = h.money(tt.total);
    var cta = document.getElementById('mb-cta');
    cta.innerHTML = esc(state.step === 'cart' ? t.checkout : t.reviewCta) + '<span class="btn-arrow">' + t.arrow + '</span>';
    cta.onclick = function () { if (state.step === 'cart') go('checkout'); else toReview(); };
  }

  /* ---------- top-level render ---------- */
  function renderStepVisibility() {
    document.getElementById('step-cart').hidden = state.step !== 'cart';
    document.getElementById('step-checkout').hidden = state.step !== 'checkout';
    document.getElementById('step-review').hidden = state.step !== 'review';
    document.getElementById('step-done').hidden = state.step !== 'done';
  }

  function applyI18nStatic() {
    var t = COPY[state.lang];
    document.getElementById('cs-text').textContent = t.continueShopping;
    document.getElementById('cs-arrow').textContent = t.arrow;
    document.getElementById('cl-arrow').textContent = t.arrow;
  }

  function render() {
    root.setAttribute('dir', state.lang === 'ar' ? 'rtl' : 'ltr');
    btnAr.classList.toggle('active', state.lang === 'ar');
    btnEn.classList.toggle('active', state.lang !== 'ar');
    applyI18nStatic();
    renderSteps();
    renderStepVisibility();
    if (state.step === 'cart') renderCartStep();
    else if (state.step === 'checkout') renderCheckoutStep();
    else if (state.step === 'review') renderReviewStep();
    else if (state.step === 'done') renderDoneStep();
    renderMobileBar();
  }

  function renderAll() { render(); }

  btnAr.addEventListener('click', function () { state.lang = 'ar'; if (H()) H().setLang('ar'); render(); });
  btnEn.addEventListener('click', function () { state.lang = 'en'; if (H()) H().setLang('en'); render(); });

  function boot() {
    if (H()) state.lang = H().getLang();
    render();
  }
  if (window.HIPPO) boot();
  else window.addEventListener('hippo:ready', boot);

  /* the live catalogue landed after first paint — cart lines reprice themselves.
     An invoice already issued is a stored snapshot and is left untouched. */
  window.addEventListener('hippo:catalog', function () {
    if (state.step !== 'done') render();
  });

  function onCartChange() {
    if (state.step !== 'cart') return;
    renderAll();
    var h = H();
    if (!h || !h.getPromo || !h.getPromo()) return;
    h.refreshPromo(tgHandle()).then(function (p) {
      renderAll();
      if (!p) { state.promoErr = COPY[state.lang].promoDropped; renderCartSummary(); }
    });
  }
  window.addEventListener('hippo:cart', onCartChange);
  window.addEventListener('storage', onCartChange);
  window.addEventListener('hippo:promo', function () { if (state.step === 'cart') renderCartSummary(); });

  /* ---------- header scroll compacting ---------- */
  var scrollRaf = null;
  window.addEventListener('scroll', function () {
    if (scrollRaf) return;
    scrollRaf = requestAnimationFrame(function () {
      scrollRaf = null;
      header.classList.toggle('is-compact', (window.scrollY || 0) > 40);
    });
  }, { passive: true });
})();
