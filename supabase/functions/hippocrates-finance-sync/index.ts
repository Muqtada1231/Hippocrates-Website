/**
 * hippocrates-finance-sync
 * ─────────────────────────────────────────────────────────────────────────────
 * الجسر الوحيد بين Supabase ونظام الحسابات في Google Sheets.
 *
 * ليش موجود: سر الويبهوك ما يجوز يوصل المتصفح أبداً. فالمتصفح ينادي هذي
 * الدالة بجلسة المدير، والدالة هي اللي تنادي Google Apps Script سيرفر-لسيرفر.
 *
 * شنو ما تسويه: ما تحسب أي عمولة ولا حصة محاضر ولا تعيد تسعير شي. المنطق
 * المالي كله (Transaction · Subscription · 10/10/80) يبقى في Apps Script.
 * وما تسحب أسعار اليوم لطلب قديم — تستعمل القيم المحفوظة وقت الشراء فقط.
 *
 * الأسرار (Project Settings → Edge Functions → Secrets):
 *   HIPPO_GOOGLE_SHEETS_WEBHOOK_URL   رابط /exec المنشور
 *   HIPPO_WEBHOOK_SECRET              نفس قيمة Script Properties
 *   HIPPO_FINANCE_PAYMENT_METHOD      اختياري — تسمية طريقة الدفع بالشيت
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const WEBHOOK_URL = Deno.env.get('HIPPO_GOOGLE_SHEETS_WEBHOOK_URL') ?? '';
const WEBHOOK_SECRET = Deno.env.get('HIPPO_WEBHOOK_SECRET') ?? '';
const PAYMENT_METHOD = Deno.env.get('HIPPO_FINANCE_PAYMENT_METHOD') ?? 'SuperQi';
/* مهلة النداء تختلف حسب حجم الشغل عند Apps Script.
   بيع واحد خفيف؛ الكتالوك كامل (23 كورس + 9 بكجات) ياخذ ~24 ثانية عملياً،
   فمهلة الـ 25 ثانية الموحّدة السابقة كانت تقطع النداء بالضبط عند الحافة
   وترجع "The signal has been aborted" قبل ما يرد السكربت.
   نبقي الحماية موجودة — بس نعطي الكتالوك مجالاً معقولاً، وتحت سقف مدة
   طلب Edge Function (150 ثانية) بهامش واسع. */
const WEBHOOK_TIMEOUT_MS = 25000;          // الافتراضي: مزامنة بيع مؤكد
const CATALOG_TIMEOUT_MS = 90000;          // مزامنة الكتالوك كاملاً

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SERVICE_KEY =
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ??
  Deno.env.get('SUPABASE_SECRET_KEY') ?? '';
const ANON_KEY =
  Deno.env.get('SUPABASE_ANON_KEY') ??
  Deno.env.get('SUPABASE_PUBLISHABLE_KEY') ?? '';

/* رموز الخطأ اللي يرجعها Apps Script عند فشل الربط — ما نخمّن مكانها */
const MAPPING_CODES = [
  'AMBIGUOUS_COURSE_MATCH',
  'AMBIGUOUS_PACKAGE_MATCH',
  'UNMAPPED_COURSE',
  'UNMAPPED_PACKAGE',
];

type Json = Record<string, unknown>;

function json(body: Json, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}

const admin = () => createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

/* ── من ينادي؟ الجلسة هي الهوية، وصف admins هو الإذن ───────────────────────── */
async function authorize(req: Request) {
  const authHeader = req.headers.get('Authorization') ?? '';
  if (!authHeader.startsWith('Bearer ')) return { error: 'missing-token' as const };

  const asUser = createClient(SUPABASE_URL, ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
    auth: { persistSession: false },
  });

  const { data, error } = await asUser.auth.getUser();
  if (error || !data?.user) return { error: 'invalid-token' as const };

  const { data: row } = await admin()
    .from('admins')
    .select('id, email, role, can_confirm_payments, can_edit_catalog')
    .eq('id', data.user.id)
    .maybeSingle();

  if (!row) return { error: 'not-admin' as const };

  const owner = row.role === 'owner';
  return {
    admin: {
      id: row.id as string,
      email: (row.email as string) ?? data.user.email ?? '',
      canConfirm: owner || !!row.can_confirm_payments,
      canCatalog: owner || !!row.can_edit_catalog,
    },
  };
}

/* ── نداء الويبهوك ─────────────────────────────────────────────────────────── */
async function callWebhook(payload: Json, timeoutMs = WEBHOOK_TIMEOUT_MS) {
  const ctrl = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => { timedOut = true; ctrl.abort(); }, timeoutMs);
  try {
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, secret: WEBHOOK_SECRET }),
      redirect: 'follow',          // Apps Script /exec يعيد التوجيه دائماً
      signal: ctrl.signal,
    });
    const text = await res.text();
    let body: unknown = null;
    try { body = text ? JSON.parse(text) : null; } catch { /* HTML صفحة خطأ من جوجل */ }
    return { httpStatus: res.status, body, raw: text };
  } catch (e) {
    /* نسمّي انقطاع المهلة باسمه، حتى ما يضيع وقت التشخيص مرة ثانية على
       رسالة AbortError الغامضة. */
    const networkError = timedOut
      ? `انتهت المهلة: الويبهوك ما رد خلال ${Math.round(timeoutMs / 1000)} ثانية.`
      : String((e as Error)?.message ?? e);
    return { httpStatus: 0, body: null, raw: '', networkError, timedOut };
  } finally {
    clearTimeout(timer);
  }
}

/* HTTP 200 لحاله ما يكفي — لازم نقرأ الجسم (§25) */
function readOutcome(r: { httpStatus: number; body: unknown; raw: string; networkError?: string }) {
  if (r.networkError) return { ok: false, code: 'NETWORK_ERROR', message: r.networkError };
  if (r.httpStatus < 200 || r.httpStatus >= 300) {
    return { ok: false, code: 'HTTP_' + r.httpStatus, message: (r.raw || '').slice(0, 500) };
  }
  if (r.body === null || typeof r.body !== 'object') {
    /* رد مو JSON = غالباً صفحة تسجيل دخول جوجل أو خطأ سكربت */
    return {
      ok: false,
      code: 'BAD_RESPONSE',
      message: 'الويبهوك رجّع رداً غير JSON. تأكد أن النشر "Anyone" وأن الرابط /exec صحيح. ' + (r.raw || '').slice(0, 300),
    };
  }
  const b = r.body as Json;
  const ok = b.success === true || (b.success === undefined && b.ok === true);
  const message =
    (b.message as string) ?? (b.error as string) ?? (b.reason as string) ?? (b.code as string) ?? '';
  const code = (b.code as string) ?? (b.errorCode as string) ?? (b.error as string) ?? '';
  return { ok, code, message, body: b };
}

/* لو رجّع الويبهوك مفتاحاً اسمه سر/توكن لأي سبب، ما نخزنه ولا نرجّعه.
   ما نمسح المفتاح — نبدّل قيمته، حتى يبقى واضح أنه كان موجوداً. */
const SECRETISH = /secret|token|password|passwd|api[-_]?key|authorization|credential/i;

function scrubSecrets(node: unknown, depth = 0): unknown {
  if (depth > 12 || node === null || typeof node !== 'object') return node;
  if (Array.isArray(node)) return node.map((x) => scrubSecrets(x, depth + 1));
  const out: Json = {};
  for (const [k, v] of Object.entries(node as Json)) {
    out[k] = SECRETISH.test(k) ? '[redacted]' : scrubSecrets(v, depth + 1);
  }
  return out;
}

/* اجمع كائنات المشاكل كما رجّعها Apps Script — كاملة، بلا أي تقليص.
   ما نفترض أن المشاكل تحت مفتاح معيّن ولا بعمق معيّن: ندور بالرد كله على أي
   كائن يحمل واحداً من رموز الربط، ونحتفظ فيه حرفياً بكل حقوله
   (packageName · websitePackageId · error · أي حقل ثاني يضيفه السكربت لاحقاً). */
function collectIssueObjects(node: unknown, out: Json[], seen: Set<object>, depth = 0): void {
  if (depth > 12 || node === null || typeof node !== 'object') return;
  if (seen.has(node as object)) return;
  seen.add(node as object);

  if (Array.isArray(node)) {
    for (const x of node) collectIssueObjects(x, out, seen, depth + 1);
    return;
  }

  const obj = node as Json;
  const carriesCode = Object.values(obj).some(
    (v) => typeof v === 'string' && MAPPING_CODES.includes(v),
  );

  if (carriesCode) {
    out.push(obj);        // الكائن كامل، مثل ما وصل
    return;               // ما ننزل أعمق: هذا هو سجل المشكلة نفسه
  }

  for (const v of Object.values(obj)) collectIssueObjects(v, out, seen, depth + 1);
}

function mappingIssues(body: unknown) {
  const text = JSON.stringify(body ?? '');
  const codes = MAPPING_CODES.filter((c) => text.includes(c));

  const found: Json[] = [];
  collectIssueObjects(body, found, new Set());

  /* المفاتيح المعتادة كمان — تلقط أي مشكلة موصوفة بدون حقل code */
  const b = (body ?? {}) as Json;
  for (const key of ['issues', 'errors', 'unmapped', 'failed', 'warnings', 'problems']) {
    const v = b[key];
    if (!Array.isArray(v)) continue;
    for (const x of v) found.push(typeof x === 'object' && x !== null ? (x as Json) : { message: String(x) });
  }

  /* إزالة التكرار مع الحفاظ على الكائن الكامل */
  const listed: Json[] = [];
  const fingerprints = new Set<string>();
  for (const x of found) {
    const fp = JSON.stringify(x);
    if (fingerprints.has(fp)) continue;
    fingerprints.add(fp);
    listed.push(scrubSecrets(x) as Json);
  }

  /* رمز ظهر بالرد بس ما لقينا كائنه: نسجّله كتلميح، ونقول وين يلقى التفاصيل.
     ما نخترع حقولاً ما رجّعها السكربت. */
  const described = JSON.stringify(listed);
  for (const c of codes) {
    if (described.includes(c)) continue;
    listed.push({
      code: c,
      detail: 'لم يرجع الويبهوك كائناً موصوفاً لهذا الرمز — الرد الخام محفوظ في finance_catalog_sync.response و finance_sync_log.response.',
    });
  }

  return { codes, listed };
}

/* ── حصة كل بند من خصم الكود ──────────────────────────────────────────────────
   بنود الطلب محفوظة بسعر ما بعد خصم البكج فقط. خصم الكود محفوظ على مستوى
   الطلب، فلازم نوزّعه على البنود بالتناسب — وإلا مجموع "المدفوع فعلاً" ما
   يساوي إجمالي الطلب، ويطلع فرق بالفاتورة المالية.
   نوزّع بأكبر باقٍ حتى المجموع يطابق الإجمالي بالدينار تماماً. */
function allocateDiscount(prices: number[], totalToRemove: number): number[] {
  const out = prices.map(() => 0);
  if (totalToRemove <= 0) return out;

  const base = prices.reduce((s, p) => s + p, 0);
  if (base <= 0) return out;

  totalToRemove = Math.round(totalToRemove);
  const exact = prices.map((p) => (p * totalToRemove) / base);
  let assigned = 0;
  for (let i = 0; i < prices.length; i++) {
    out[i] = Math.min(prices[i], Math.floor(exact[i]));
    assigned += out[i];
  }

  let left = totalToRemove - assigned;
  const order = prices
    .map((_, i) => i)
    .sort((a, b) => (exact[b] - out[b]) - (exact[a] - out[a]));

  for (let k = 0; left > 0 && k < order.length * 2; k++) {
    const i = order[k % order.length];
    if (out[i] < prices[i]) { out[i]++; left--; }
  }
  return out;
}

/* ── ACTION: مزامنة بيع مؤكد ───────────────────────────────────────────────── */
async function syncOrder(orderId: string, actorEmail: string) {
  const db = admin();

  const { data: order, error } = await db
    .from('orders')
    .select('*, order_items(id, item_type, product_id, name, name_ar, original_price, price)')
    .eq('id', orderId)
    .maybeSingle();

  if (error) return json({ ok: false, key: 'load-failed', message: error.message }, 500);
  if (!order) return json({ ok: false, key: 'not-found', message: 'الطلب غير موجود.' }, 404);

  /* 1 — الطلب مؤهل؟ المزامنة المالية تصير بعد تأكيد الدفع فقط */
  if (order.status !== 'confirmed') {
    return json({ ok: false, key: 'not-confirmed', message: 'المزامنة المالية تصير بعد تأكيد الدفع فقط.' }, 409);
  }

  /* 2 — منع التكرار من طرفنا. Apps Script يمنعه من طرفه أيضاً */
  if (order.finance_sync_status === 'synced') {
    return json({
      ok: true, alreadySynced: true,
      status: 'synced', syncedAt: order.finance_synced_at,
      message: 'هذا الطلب مزامن أصلاً.',
    });
  }

  const items = (order.order_items ?? []) as Json[];
  if (!items.length) {
    return json({ ok: false, key: 'no-items', message: 'الطلب بدون بنود.' }, 409);
  }

  /* 3 — تحقّق من المبالغ قبل ما نرسل أي شي للحسابات */
  const prices = items.map((i) => Number(i.price) || 0);
  const originals = items.map((i) => Number(i.original_price ?? i.price) || 0);
  const itemsSum = prices.reduce((s, p) => s + p, 0);
  const total = Number(order.total) || 0;

  if (itemsSum < total) {
    return json({
      ok: false, key: 'totals-mismatch',
      message: `مجموع البنود (${itemsSum}) أقل من إجمالي الطلب (${total}). ما نرسل أرقاماً غير متطابقة للحسابات.`,
    }, 409);
  }
  for (let i = 0; i < items.length; i++) {
    if (originals[i] < prices[i]) {
      return json({
        ok: false, key: 'totals-mismatch',
        message: `البند "${items[i].name}" سعره الأصلي أقل من المدفوع.`,
      }, 409);
    }
  }

  const promoAlloc = allocateDiscount(prices, itemsSum - total);
  const paid = prices.map((p, i) => p - promoAlloc[i]);

  /* 4 — علّم "جاري المزامنة" وارفع عدّاد المحاولات */
  const confirmedAt = order.confirmed_at ?? new Date().toISOString();
  await db.from('orders').update({
    confirmed_at: confirmedAt,
    finance_sync_status: 'syncing',
    finance_sync_error: null,
    finance_sync_attempts: (Number(order.finance_sync_attempts) || 0) + 1,
  }).eq('id', order.id);

  /* 5 — الحمولة: كلها من القيم المحفوظة وقت الشراء، ولا رقم واحد من كتالوك اليوم */
  const tg = String(order.student_telegram ?? '').trim().replace(/^@+/, '').toLowerCase();

  const payload: Json = {
    action: 'confirm_sale',

    websiteOrderId: order.id,                       // معرّف Supabase الحقيقي غير القابل للتغيير
    websiteOrderNo: order.order_no,                 // الرقم المقروء بالفاتورة — للرجوع البشري
    websitePaymentReference: order.payment_reference ?? '',
    orderDate: order.created_at,
    confirmedAt,

    student: {
      websiteStudentId: tg ? 'tg:' + tg : 'order:' + order.id,
      fullName: order.student_name ?? '',
      stage: order.student_stage ?? '',
      telegram: tg ? '@' + tg : '',
      phone: '',
      email: '',
    },

    payment: {
      paymentMethod: order.payment_method || PAYMENT_METHOD,
      paymentStatus: 'Confirmed',
    },

    promoCode: order.promo_code ?? '',
    orderTotalIQD: total,

    items: items.map((it, i) => {
      const isPackage = String(it.item_type) === 'package';
      return {
        websiteProductId: it.product_id,
        productType: isPackage ? 'Package' : 'Course',
        websiteCourseId: isPackage ? null : it.product_id,
        websitePackageId: isPackage ? it.product_id : null,
        productName: it.name ?? it.name_ar ?? '',
        productNameAr: it.name_ar ?? '',
        originalPriceIQD: originals[i],
        discountIQD: originals[i] - paid[i],
        actualPaidIQD: paid[i],
      };
    }),
  };

  /* 6 — نداء واحد لكل طلب، فيه كل البنود (§14) */
  const res = await callWebhook(payload);
  const outcome = readOutcome(res);

  /* Apps Script يمنع تكرار نفس رقم الطلب. هذا مو فشل — معناه محفوظ أصلاً */
  const duplicate =
    !outcome.ok && JSON.stringify(res.body ?? res.raw).includes('DUPLICATE_ORDER_ID');

  const success = outcome.ok || duplicate;
  const now = new Date().toISOString();

  const scrubbed = { ...payload };
  delete (scrubbed as Json).secret;                 // احتياط: السر ما ينضاف هنا أصلاً

  await db.from('finance_sync_log').insert({
    order_id: order.id,
    action: 'confirm_sale',
    ok: success,
    http_status: res.httpStatus,
    request: scrubbed,
    response: (res.body ?? { raw: (res.raw || '').slice(0, 2000) }) as Json,
    error: success ? null : (outcome.message || outcome.code || 'unknown'),
  });

  await db.from('orders').update({
    finance_sync_status: success ? 'synced' : 'sync_error',
    finance_synced_at: success ? now : order.finance_synced_at,
    finance_sync_error: success ? null : ([outcome.code, outcome.message].filter(Boolean).join(' — ')).slice(0, 1000),
  }).eq('id', order.id);

  return json({
    ok: success,
    duplicate,
    status: success ? 'synced' : 'sync_error',
    syncedAt: success ? now : null,
    code: outcome.code || null,
    message: success
      ? (duplicate ? 'الطلب كان مسجّلاً بالحسابات — ما انضاف تكرار.' : 'تمت المزامنة.')
      : (outcome.message || outcome.code || 'فشل غير معروف'),
    by: actorEmail,
  }, success ? 200 : 502);
}

/* ── ACTION: مزامنة الكتالوك ───────────────────────────────────────────────── */
async function syncCatalog(actorEmail: string) {
  const db = admin();

  const [coursesRes, packagesRes, linksRes, lecturersRes] = await Promise.all([
    db.from('courses').select('*').order('sort_order', { ascending: true }),
    db.from('packages').select('*').order('sort_order', { ascending: true }),
    db.from('package_courses').select('package_id, course_id, allocation, sort_order'),
    db.from('lecturers').select('key, name_en, name_ar'),
  ]);

  const firstError = coursesRes.error || packagesRes.error || linksRes.error || lecturersRes.error;
  if (firstError) return json({ ok: false, key: 'load-failed', message: firstError.message }, 500);

  const lecturers = new Map<string, { en: string; ar: string }>();
  for (const l of lecturersRes.data ?? []) {
    lecturers.set(l.key as string, { en: (l.name_en as string) ?? '', ar: (l.name_ar as string) ?? '' });
  }

  const courses = (coursesRes.data ?? []).map((c: Json) => {
    const l = lecturers.get(String(c.lecturer_key ?? '')) ?? { en: '', ar: '' };
    const stages = Array.isArray(c.stages) && (c.stages as unknown[]).length
      ? (c.stages as number[])
      : (c.stage != null ? [c.stage as number] : []);
    return {
      websiteCourseId: c.key,                      // معرّف Supabase الحقيقي — ما نخترع معرّفات
      name: c.title ?? '',
      nameAr: c.title_ar ?? '',
      stages,
      stage: stages.length ? stages[0] : null,
      priceIQD: Number(c.price) || 0,
      lecturerKey: c.lecturer_key ?? '',
      lecturer: l.en,
      lecturerAr: l.ar,
      status: c.enabled ? 'Active' : 'Inactive',
      updatedAt: c.updated_at ?? null,
    };
  });

  /* `packageName` هو الاسم اللي يقرأه syncPackage_ بـ Apps Script. كنا نرسل
     الاسم بمفتاح `name` فقط، فرفض التسعة كلهم بـ MISSING_PACKAGE_NAME.
     نضيف المفتاح الصحيح ونبقي `name` كما هو — إضافة مفتاح ما تكسر شي، وحذف
     مفتاح شغّال ممكن يكسر. القيمة نفسها من `packages.name` بـ Supabase،
     بلا أي اسم مكتوب يدوياً. */
  const packages = (packagesRes.data ?? []).map((p: Json) => ({
    websitePackageId: p.key,                       // معرّف Supabase الحقيقي
    packageName: p.name ?? '',                     // ← المفتاح اللي يتوقعه Apps Script
    name: p.name ?? '',
    nameAr: p.name_ar ?? '',
    stage: p.stage ?? null,
    priceIQD: Number(p.price) || 0,
    status: p.enabled ? 'Active' : 'Inactive',
    offerEligible: !!p.promo_enabled,
    updatedAt: p.updated_at ?? null,
  }));

  const packageComponents = (linksRes.data ?? [])
    .slice()
    .sort((a: Json, b: Json) => (Number(a.sort_order) || 0) - (Number(b.sort_order) || 0))
    .map((l: Json) => ({
      websitePackageId: l.package_id,
      websiteCourseId: l.course_id,
      allocationIQD: Number(l.allocation) || 0,
      sortOrder: Number(l.sort_order) || 0,
    }));

  await db.from('finance_catalog_sync').update({
    status: 'syncing', error: null, by_email: actorEmail,
  }).eq('id', true);

  const res = await callWebhook({
    action: 'sync_catalog',
    syncedAt: new Date().toISOString(),
    courses, packages, packageComponents,
  }, CATALOG_TIMEOUT_MS);
  const outcome = readOutcome(res);
  const issues = mappingIssues(res.body);

  /* منتجات ما انربطت = مو نجاح كامل، حتى لو الويبهوك رجّع success (§9) */
  const hasIssues = issues.codes.length > 0 || issues.listed.length > 0;
  const status = !outcome.ok ? 'failed' : (hasIssues ? 'partial' : 'synced');
  const now = new Date().toISOString();

  /* الرد الخام كما وصل — بلا تقليص ولا إعادة بناء. هذا مرجع التشخيص الوحيد
     الموثوق لما يختلف شكل رد Apps Script عن توقعنا. */
  const rawResponse = (scrubSecrets(res.body) ?? { raw: (res.raw || '').slice(0, 4000) }) as Json;

  await db.from('finance_sync_log').insert({
    order_id: null,
    action: 'sync_catalog',
    ok: status === 'synced',
    http_status: res.httpStatus,
    request: { action: 'sync_catalog', courses: courses.length, packages: packages.length, packageComponents: packageComponents.length },
    response: rawResponse,
    error: status === 'synced' ? null : (outcome.message || outcome.code || issues.codes.join(', ')),
  });

  await db.from('finance_catalog_sync').update({
    status,
    synced_at: outcome.ok ? now : null,
    courses_sent: courses.length,
    packages_sent: packages.length,
    courses_mapped: Number((res.body as Json)?.coursesMapped ?? NaN) || null,
    packages_mapped: Number((res.body as Json)?.packagesMapped ?? NaN) || null,
    issues: issues.listed,          // كائنات كاملة، مو رموز مجرّدة
    response: rawResponse,
    error: status === 'synced' ? null : (outcome.message || outcome.code || issues.codes.join(', ') || null),
    by_email: actorEmail,
  }).eq('id', true);

  return json({
    ok: status === 'synced',
    status,
    syncedAt: outcome.ok ? now : null,
    coursesSent: courses.length,
    packagesSent: packages.length,
    issueCodes: issues.codes,
    issues: issues.listed,          // نفس الكائنات الكاملة للمتصل
    webhookResponse: rawResponse,   // والرد الخام كامل، للتشخيص
    httpStatus: res.httpStatus,
    message: status === 'synced'
      ? `تمت مزامنة ${courses.length} كورس و${packages.length} بكج.`
      : (outcome.message || outcome.code || 'بعض المنتجات ما انربطت.'),
  }, status === 'failed' ? 502 : 200);
}

/* ── المدخل ────────────────────────────────────────────────────────────────── */
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return json({ ok: false, message: 'POST only' }, 405);

  if (!SUPABASE_URL || !SERVICE_KEY) {
    return json({ ok: false, key: 'not-configured', message: 'مفاتيح Supabase غير متوفرة داخل الدالة.' }, 500);
  }

  const auth = await authorize(req);
  if ('error' in auth) {
    const map: Record<string, string> = {
      'missing-token': 'سجّل دخولك أولاً.',
      'invalid-token': 'الجلسة منتهية. سجّل دخولك من جديد.',
      'not-admin': 'حسابك ليس ضمن قائمة المدراء.',
    };
    return json({ ok: false, key: auth.error, message: map[auth.error] }, 403);
  }

  let body: Json = {};
  try { body = await req.json(); } catch { /* فارغ */ }
  const action = String(body.action ?? '');

  if (action === 'ping') {
    return json({
      ok: true,
      webhookConfigured: !!WEBHOOK_URL,
      secretConfigured: !!WEBHOOK_SECRET,
      paymentMethod: PAYMENT_METHOD,
      admin: auth.admin.email,
    });
  }

  if (!WEBHOOK_URL || !WEBHOOK_SECRET) {
    return json({
      ok: false, key: 'not-configured',
      message: 'أضف HIPPO_GOOGLE_SHEETS_WEBHOOK_URL و HIPPO_WEBHOOK_SECRET في أسرار Edge Functions.',
    }, 500);
  }

  if (action === 'sync_order') {
    if (!auth.admin.canConfirm) return json({ ok: false, message: 'ما عندك صلاحية تأكيد الدفع.' }, 403);
    const orderId = String(body.orderId ?? '');
    if (!orderId) return json({ ok: false, message: 'orderId مطلوب.' }, 400);
    return await syncOrder(orderId, auth.admin.email);
  }

  if (action === 'sync_catalog') {
    if (!auth.admin.canCatalog) return json({ ok: false, message: 'ما عندك صلاحية تعديل الكتالوك.' }, 403);
    return await syncCatalog(auth.admin.email);
  }

  return json({ ok: false, message: 'action غير معروف: ' + action }, 400);
});
