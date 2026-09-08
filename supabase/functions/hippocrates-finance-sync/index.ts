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
/* HIP-128 completed in Apps Script after 28.3 seconds. The former 25-second
   caller timeout therefore reported failure while the write continued.
   confirm_sale gets a bounded 60-second window; catalog keeps 90 seconds. */
const CONFIRM_SALE_TIMEOUT_MS = 60000;
const STATUS_TIMEOUT_MS = 25000;
const CATALOG_TIMEOUT_MS = 90000;

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

/* بنود المحتوى المرجعي (بكج المرحلة السادسة) تعرفها الأنظمة بأسماء مختلفة:
   الموقع يعرض "Obstetrics & Gynecology" للطالب، ونظام الحسابات يعرفها
   "Obs & Gyne". هذا جسر تسمية بين نظامين على المفتاح الثابت ref_key —
   مو بيانات عمل مكرّرة: المبالغ ومعرّف البكج كلها تُقرأ حيّة من Supabase،
   ولا عنوان واحد بالموقع ينتغيّر. */
const REFERENCE_ITEM_NAMES: Record<string, string> = {
  'ref-medicine': 'Internal Medicine',
  'ref-surgery': 'Surgery',
  'ref-obgyn': 'Obs & Gyne',
  'ref-peds': 'Pediatrics',
};

/* كورس مجمّع (عنده covers) هو بكج مالياً، رغم إنه صف بجدول courses.
   ما ننقله بـ Supabase — الواجهة والسلة والـ upsell كلها مبنية على كونه
   كورساً. التحويل بطبقة النقل وحدها. اسمه داخل بكج آخر يعرفه نظام
   الحسابات بصيغته الخاصة. */
const NESTED_BUNDLE_NAMES: Record<string, string> = {
  'derm-full': 'Dermatology (Theory + Summary)',
};

/* بكجات يملك نظام الحسابات توزيعها على مستوى البكج (Package Lecturer).
   مكوّناتها تُرسل للتعريف بالمحتوى فقط — بلا أي حقل مبلغ إطلاقاً، ولا صفر:
   الحقل يُحذف كلياً حتى ما ندهس توزيع الشيت. */
const CONTENT_ONLY_PACKAGES = new Set(['radiology', 'anatomy-ul-ll', 'anatomy-ll-thorax', 'anatomy-complete']);

type Json = Record<string, unknown>;

type WebhookCallResult = {
  httpStatus: number;
  body: unknown;
  raw: string;
  networkError?: string;
  timedOut?: boolean;
};

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
async function callWebhook(payload: Json, timeoutMs: number): Promise<WebhookCallResult> {
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
function readOutcome(r: WebhookCallResult) {
  if (r.timedOut) {
    return {
      ok: false,
      unknown: true,
      code: 'WEBHOOK_TIMEOUT_UNKNOWN',
      message: 'انتهت مهلة الاتصال، لكن Apps Script قد يكون أكمل العملية. لا تعِد الإرسال؛ افحص حالة الطلب بالحسابات.',
    };
  }
  if (r.networkError) {
    return { ok: false, unknown: true, code: 'NETWORK_ERROR', message: r.networkError };
  }

  const structuredBody = r.body !== null && typeof r.body === 'object'
    ? r.body as Json
    : null;
  const definitive = structuredBody !== null &&
    (typeof structuredBody.success === 'boolean' || typeof structuredBody.ok === 'boolean');

  if (r.httpStatus < 200 || r.httpStatus >= 300) {
    if (definitive) {
      const b = structuredBody as Json;
      const ok = b.success === true || (b.success === undefined && b.ok === true);
      const message =
        (b.message as string) ?? (b.error as string) ?? (b.reason as string) ?? (b.code as string) ?? '';
      const code = (b.code as string) ?? (b.errorCode as string) ?? (b.error as string) ?? '';
      return { ok, unknown: false, code, message, body: b };
    }
    return {
      ok: false,
      unknown: true,
      code: 'HTTP_' + r.httpStatus,
      message: (r.raw || '').slice(0, 500),
    };
  }
  if (r.body === null || typeof r.body !== 'object') {
    /* رد مو JSON = غالباً صفحة تسجيل دخول جوجل أو خطأ سكربت */
    return {
      ok: false,
      unknown: true,
      code: 'BAD_RESPONSE',
      message: 'الويبهوك رجّع رداً غير JSON. تأكد أن النشر "Anyone" وأن الرابط /exec صحيح. ' + (r.raw || '').slice(0, 300),
    };
  }
  const b = r.body as Json;
  if (!definitive) {
    return {
      ok: false,
      unknown: true,
      code: 'BAD_RESPONSE',
      message: 'الويبهوك رجّع JSON بدون نتيجة success/ok مؤكدة.',
      body: b,
    };
  }
  const ok = b.success === true || (b.success === undefined && b.ok === true);
  const message =
    (b.message as string) ?? (b.error as string) ?? (b.reason as string) ?? (b.code as string) ?? '';
  const code = (b.code as string) ?? (b.errorCode as string) ?? (b.error as string) ?? '';
  return { ok, unknown: false, code, message, body: b };
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

/* ── فحص بيع موجود بالحسابات — قراءة فقط، بلا confirm_sale ─────────────────── */
async function checkSaleStatus(websiteOrderId: string, expectedSubscriptionCount: number) {
  const res = await callWebhook({
    action: 'get_sale_sync_status',
    websiteOrderId,
    expectedSubscriptionCount,
  }, STATUS_TIMEOUT_MS);

  const outcome = readOutcome(res);
  const body = res.body !== null && typeof res.body === 'object'
    ? res.body as Json
    : {};

  return {
    res,
    outcome,
    body,
    state: String(body.state ?? ''),
    synced: outcome.ok && body.synced === true,
    transactionIds: Array.isArray(body.transactionIds)
      ? body.transactionIds.map(String)
      : [],
    subscriptionIds: Array.isArray(body.subscriptionIds)
      ? body.subscriptionIds.map(String)
      : [],
  };
}

async function reconcileOrder(orderId: string, actorEmail: string) {
  const db = admin();
  const { data: order, error } = await db
    .from('orders')
    .select('id, order_no, status, finance_synced_at, order_items(id)')
    .eq('id', orderId)
    .maybeSingle();

  if (error) return json({ ok: false, key: 'load-failed', message: error.message }, 500);
  if (!order) return json({ ok: false, key: 'not-found', message: 'الطلب غير موجود.' }, 404);
  if (order.status !== 'confirmed') {
    return json({ ok: false, key: 'not-confirmed', message: 'الفحص المالي متاح للطلبات المؤكدة فقط.' }, 409);
  }

  const expectedSubscriptionCount = Array.isArray(order.order_items)
    ? order.order_items.length
    : 0;
  if (!expectedSubscriptionCount) {
    return json({ ok: false, key: 'no-items', message: 'الطلب بدون بنود.' }, 409);
  }

  const check = await checkSaleStatus(order.id, expectedSubscriptionCount);
  const notFound = check.outcome.ok && check.state === 'not_found';
  const nextStatus = check.synced
    ? 'synced'
    : (notFound ? 'not_synced' : 'sync_unknown');
  const now = new Date().toISOString();
  const message = check.synced
    ? 'تم العثور على المعاملة والاشتراكات الموجودة وتأكيد المزامنة بدون إنشاء سجلات جديدة.'
    : notFound
      ? 'لم توجد سجلات مالية لهذا الطلب. لم يتم تشغيل confirm_sale.'
      : 'النتيجة غير مكتملة أو تعذر فحصها. لم يتم تشغيل confirm_sale.';

  const rawResponse = (
    scrubSecrets(check.res.body) ??
    { raw: (check.res.raw || '').slice(0, 4000) }
  ) as Json;

  const { error: logError } = await db.from('finance_sync_log').insert({
    order_id: order.id,
    action: 'reconcile_sale',
    ok: check.synced,
    http_status: check.res.httpStatus,
    request: {
      action: 'get_sale_sync_status',
      websiteOrderId: order.id,
      expectedSubscriptionCount,
    },
    response: rawResponse,
    error: check.synced ? null : (check.outcome.message || message),
  });
  if (logError) return json({ ok: false, key: 'log-failed', message: logError.message }, 500);

  const { error: updateError } = await db.from('orders').update({
    finance_sync_status: nextStatus,
    finance_synced_at: check.synced ? now : order.finance_synced_at,
    finance_sync_error: check.synced ? null : message,
  }).eq('id', order.id);
  if (updateError) return json({ ok: false, key: 'update-failed', message: updateError.message }, 500);

  // Every completed reconciliation returns HTTP 200. `status` is authoritative.
  return json({
    ok: check.synced,
    reconciled: true,
    confirmSaleCalled: false,
    status: nextStatus,
    syncedAt: check.synced ? now : null,
    websiteOrderId: order.id,
    websiteOrderNo: order.order_no,
    transactionIds: check.transactionIds,
    subscriptionIds: check.subscriptionIds,
    webhookResponse: rawResponse,
    message,
  });
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

  /* Unknown and in-progress outcomes may represent a still-running or already
     completed Apps Script execution. Never send confirm_sale from either state. */
  if (order.finance_sync_status === 'sync_unknown' ||
      order.finance_sync_status === 'syncing') {
    return json({
      ok: false,
      key: 'reconciliation-required',
      status: order.finance_sync_status,
      message: 'لا يمكن إعادة confirm_sale من هذه الحالة. استخدم فحص حالة الحسابات أولاً.',
    }, 409);
  }

  const items = (order.order_items ?? []) as Json[];
  if (!items.length) {
    return json({ ok: false, key: 'no-items', message: 'الطلب بدون بنود.' }, 409);
  }

  /* 3 — بكج عرض فقط ما يجوز يصير له بيع مدفوع.
     hippo_resolve_cart يمنعه من الأساس، فوصوله لهنا يعني إما طلباً قديماً
     سابقاً للقرار أو إدخالاً يدوياً. نوقف قبل ما ننشئ Transaction مدفوعة
     ولا حصص محاضرين — وحالة الدفع بالطلب تبقى كما هي، ما نلمسها. */
  const nonCommercialIds = new Set<string>();
  const pkgIds = items.filter((i) => String(i.item_type) === 'package').map((i) => String(i.product_id));
  if (pkgIds.length) {
    const { data: pkgRows } = await db
      .from('packages').select('key, purchasable').in('key', pkgIds);
    for (const row of pkgRows ?? []) {
      if ((row as Json).purchasable === false) nonCommercialIds.add(String((row as Json).key));
    }
  }
  if (nonCommercialIds.size) {
    const names = [...nonCommercialIds].join(', ');
    await db.from('orders').update({
      finance_sync_status: 'sync_error',
      finance_sync_error: `NON_COMMERCIAL_PACKAGE — الطلب يحتوي بكج عرض فقط (${names}). لا تُنشأ معاملة مالية مدفوعة له.`,
    }).eq('id', order.id);
    return json({
      ok: false, key: 'non-commercial',
      message: `الطلب يحتوي بكج غير قابل للشراء (${names}). ما تنشأ له معاملة مالية — الوصول يُمنح إدارياً بلا بيع.`,
    }, 409);
  }

  /* 4 — تحقّق من المبالغ قبل ما نرسل أي شي للحسابات */
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

  /* الكورس المجمّع (derm-full) محفوظ بالطلب كـ course — وهذا مقصود، الواجهة
     والسلة مبنية عليه. مالياً هو بكج: بند واحد بمعرّف بكج، وما ينفك لكورسين. */
  const bundleSet = new Set<string>();
  {
    const { data: bundleRows } = await db.from('courses').select('key, covers');
    for (const row of bundleRows ?? []) {
      const covers = (row as Json).covers;
      if (Array.isArray(covers) && covers.length) bundleSet.add(String((row as Json).key));
    }
  }

  const promoAlloc = allocateDiscount(prices, itemsSum - total);
  const paid = prices.map((p, i) => p - promoAlloc[i]);

  /* 5 — علّم "جاري المزامنة" وارفع عدّاد المحاولات */
  const confirmedAt = order.confirmed_at ?? new Date().toISOString();
  await db.from('orders').update({
    confirmed_at: confirmedAt,
    finance_sync_status: 'syncing',
    finance_sync_error: null,
    finance_sync_attempts: (Number(order.finance_sync_attempts) || 0) + 1,
  }).eq('id', order.id);

  /* 6 — الحمولة: كلها من القيم المحفوظة وقت الشراء، ولا رقم واحد من كتالوك اليوم */
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
      /* كانا مثبّتين فاضيين لأن الجدول ما كان يحتوي العمودين. صارا يُقرآن
         من الطلب نفسه — قيمة وقت الشراء، مو من أي مكان آخر. الفارغ يُرسل
         كنص فارغ حتى ما يدهس قيمة موجودة بشيت الطلاب. */
      phone: order.student_phone ?? '',
      email: order.student_email ?? '',
    },

    payment: {
      paymentMethod: order.payment_method || PAYMENT_METHOD,
      paymentStatus: 'Confirmed',
    },

    promoCode: order.promo_code ?? '',
    orderTotalIQD: total,

    items: items.map((it, i) => {
      const asPackage = String(it.item_type) === 'package' || bundleSet.has(String(it.product_id));
      return {
        websiteProductId: it.product_id,
        productType: asPackage ? 'Package' : 'Course',
        websiteCourseId: asPackage ? null : it.product_id,
        websitePackageId: asPackage ? it.product_id : null,
        productName: it.name ?? it.name_ar ?? '',
        productNameAr: it.name_ar ?? '',
        originalPriceIQD: originals[i],
        discountIQD: originals[i] - paid[i],
        actualPaidIQD: paid[i],
      };
    }),
  };

  /* 7 — نداء واحد لكل طلب، فيه كل البنود (§14) */
  const res = await callWebhook(payload, CONFIRM_SALE_TIMEOUT_MS);
  const outcome = readOutcome(res);

  /* Duplicate alone does not prove that both records are complete. Verify the
     existing rows read-only before treating it as a successful sync. */
  const duplicate =
    !outcome.ok && JSON.stringify(res.body ?? res.raw).includes('DUPLICATE_ORDER_ID');

  const duplicateCheck = duplicate
    ? await checkSaleStatus(order.id, items.length)
    : null;
  const duplicateConfirmed = !!duplicateCheck?.synced;
  const success = outcome.ok || duplicateConfirmed;
  const unknown = outcome.unknown === true || (duplicate && !duplicateConfirmed);
  const finalStatus = success
    ? 'synced'
    : (unknown ? 'sync_unknown' : 'sync_error');
  const now = new Date().toISOString();

  const scrubbed = { ...payload };
  delete (scrubbed as Json).secret;                 // احتياط: السر ما ينضاف هنا أصلاً

  /* نفس معاملة sync_catalog بالضبط: الرد الخام كما وصل، بلا إعادة بناء ولا
     تقليص، وبمساحة احتياط أوسع للنص غير الـ JSON. */
  const confirmResponse = (
    scrubSecrets(res.body) ?? { raw: (res.raw || '').slice(0, 4000) }
  ) as Json;
  const rawResponse = duplicateCheck
    ? {
        confirmSale: confirmResponse,
        reconciliation: scrubSecrets(duplicateCheck.res.body),
      }
    : confirmResponse;
  const failureMessage = unknown
    ? 'UNKNOWN_OUTCOME — Apps Script قد يكون أكمل العملية. لا تعِد confirm_sale؛ استخدم المصالحة.'
    : (outcome.message || outcome.code || 'unknown');

  await db.from('finance_sync_log').insert({
    order_id: order.id,
    action: 'confirm_sale',
    ok: success,
    http_status: res.httpStatus,
    request: scrubbed,
    response: rawResponse,
    error: success ? null : failureMessage,
  });

  await db.from('orders').update({
    finance_sync_status: finalStatus,
    finance_synced_at: success ? now : order.finance_synced_at,
    finance_sync_error: success ? null : failureMessage.slice(0, 1000),
  }).eq('id', order.id);

  return json({
    ok: success,
    duplicate,
    unknown,
    status: finalStatus,
    syncedAt: success ? now : null,
    code: unknown ? 'UNKNOWN_OUTCOME' : (outcome.code || null),
    webhookResponse: rawResponse,   // الرد الخام كامل للمتصل — مثل sync_catalog
    httpStatus: res.httpStatus,
    message: success
      ? (duplicateConfirmed ? 'تم التحقق من السجلات الموجودة — ما انضاف تكرار.' : 'تمت المزامنة.')
      : failureMessage,
    by: actorEmail,
  }, success ? 200 : (unknown ? 202 : 502));
}

/* ── ACTION: مزامنة الكتالوك ───────────────────────────────────────────────── */
async function syncCatalog(actorEmail: string) {
  const db = admin();

  const [coursesRes, packagesRes, linksRes, lecturersRes, refsRes] = await Promise.all([
    db.from('courses').select('*').order('sort_order', { ascending: true }),
    db.from('packages').select('*').order('sort_order', { ascending: true }),
    db.from('package_courses').select('package_id, course_id, allocation, sort_order'),
    db.from('lecturers').select('key, name_en, name_ar'),
    db.from('package_ref_items').select('package_id, ref_key, title, allocation, sort_order'),
  ]);

  const firstError = coursesRes.error || packagesRes.error || linksRes.error
    || lecturersRes.error || refsRes.error;
  if (firstError) return json({ ok: false, key: 'load-failed', message: firstError.message }, 500);

  const lecturers = new Map<string, { en: string; ar: string }>();
  for (const l of lecturersRes.data ?? []) {
    lecturers.set(l.key as string, { en: (l.name_en as string) ?? '', ar: (l.name_ar as string) ?? '' });
  }

  /* كورس عنده covers = بكج مالياً، فيطلع من courses[] ويدخل packages[]. */
  const bundleCourses = (coursesRes.data ?? []).filter(
    (c: Json) => Array.isArray(c.covers) && (c.covers as unknown[]).length > 0,
  );
  const bundleKeys = new Set(bundleCourses.map((c: Json) => String(c.key)));

  /* بكجات العرض فقط ما تروح للحسابات إطلاقاً: لا ككتالوك ولا كمكوّنات
     ولا كمراجع. تبقى بـ Supabase وعلى الموقع كما هي. */
  const nonCommercial = new Set(
    (packagesRes.data ?? []).filter((p: Json) => p.purchasable === false).map((p: Json) => String(p.key)),
  );

  const courses = (coursesRes.data ?? []).filter((c: Json) => !bundleKeys.has(String(c.key))).map((c: Json) => {
    const l = lecturers.get(String(c.lecturer_key ?? '')) ?? { en: '', ar: '' };
    const stages = Array.isArray(c.stages) && (c.stages as unknown[]).length
      ? (c.stages as number[])
      : (c.stage != null ? [c.stage as number] : []);
    /* `courseName` هو المفتاح اللي يقرأه syncCourse_ بـ Apps Script — نفس
       قصة `packageName` بالضبط. كنا نرسل الاسم بمفتاح `name` فقط، فرفض
       الـ 23 كلهم بـ MISSING_COURSE_NAME. القيمة من `courses.title` بـ
       Supabase، بلا أي اسم مكتوب يدوياً، ونبقي `name` للتوافق. */
    return {
      websiteCourseId: c.key,                      // معرّف Supabase الحقيقي — ما نخترع معرّفات
      courseName: c.title ?? '',                   // ← المفتاح اللي يتوقعه Apps Script
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
  const packages = (packagesRes.data ?? []).filter((p: Json) => !nonCommercial.has(String(p.key))).map((p: Json) => ({
    websitePackageId: p.key,                       // معرّف Supabase الحقيقي
    packageName: p.name ?? '',                     // ← المفتاح اللي يتوقعه Apps Script
    /* بكج العرض فقط: يبقى بالكتالوك للمرجع والتقارير، بس ما ينباع، وما
       يستحق ملكية محاضر ولا توزيع أرباح ولا 10/10/80. */
    purchasable: p.purchasable !== false,
    commercialStatus: p.purchasable === false ? 'DISPLAY_ONLY' : 'COMMERCIAL',
    name: p.name ?? '',
    nameAr: p.name_ar ?? '',
    stage: p.stage ?? null,
    priceIQD: Number(p.price) || 0,
    status: p.enabled ? 'Active' : 'Inactive',
    offerEligible: !!p.promo_enabled,
    updatedAt: p.updated_at ?? null,
  })).concat(
    /* البكجات المجمّعة: بكج مالي كامل، بمعرّف الكورس الحقيقي نفسه.
       ما نرسل له websiteCourseId إطلاقاً. */
    bundleCourses.map((c: Json) => ({
      websitePackageId: c.key,
      packageName: c.title ?? '',
      purchasable: c.enabled !== false,
      commercialStatus: 'COMMERCIAL',
      name: c.title ?? '',
      nameAr: c.title_ar ?? '',
      stage: (Array.isArray(c.stages) && (c.stages as number[]).length ? (c.stages as number[])[0] : c.stage) ?? null,
      priceIQD: Number(c.price) || 0,
      status: c.enabled ? 'Active' : 'Inactive',
      offerEligible: false,
      updatedAt: c.updated_at ?? null,
    })),
  );

  /* المكوّنات القياسية — كورس حقيقي داخل بكج. الشكل كما هو، ما ننزع منه مفتاحاً
     ولا نضيف componentType. أضفنا `approvedAllocationIQD` بجنب `allocationIQD`
     لأن عقد Apps Script المعتمد يسمّيه هيك؛ إضافة مفتاح ما تكسر قارئاً، ونفس
     القيمة بالضبط بالاثنين. */
  /* بكجات يملك الشيت توزيعها على مستوى البكج: مكوّناتها للتعريف فقط.
     البكج المجمّع (derm-full) منها بطبيعته — توزيعه ما ينكسر لكورسين. */
  const contentOnly = new Set([...CONTENT_ONLY_PACKAGES, ...bundleKeys]);

  const standardComponents = (linksRes.data ?? [])
    .filter((l: Json) =>
      !nonCommercial.has(String(l.package_id)) &&   // بكج العرض فقط
      !bundleKeys.has(String(l.course_id)))         // بكج مجمّع داخل بكج ← يروح مرجعاً
    .slice()
    .sort((a: Json, b: Json) => (Number(a.sort_order) || 0) - (Number(b.sort_order) || 0))
    .map((l: Json) => {
      const base = {
        websitePackageId: l.package_id,
        websiteCourseId: l.course_id,
        sortOrder: Number(l.sort_order) || 0,
      };
      /* حقول المبالغ تُحذف كلياً — مو صفراً — حتى ما ندهس توزيع الشيت */
      if (contentOnly.has(String(l.package_id))) return base;
      const iqd = Number(l.allocation) || 0;
      return { ...base, approvedAllocationIQD: iqd, allocationIQD: iqd };
    })
    /* محتويات البكج المجمّع من covers: تعريف بالمحتوى فقط، بلا أي مبلغ */
    .concat(
      bundleCourses.flatMap((c: Json) =>
        ((c.covers ?? []) as string[]).map((courseId, i) => ({
          websitePackageId: String(c.key),
          websiteCourseId: courseId,
          sortOrder: (i + 1) * 10,
        })),
      ),
    );

  /* ── المكوّنات المرجعية ──────────────────────────────────────────────────
     مصدران:
       1) بكج مجمّع داخل بكج آخر (year5 ← derm-full): مو كورس مالياً، فما
          نرسل له websiteCourseId. الاسم من جسر التسمية، والمبلغ حيّ من
          package_courses.allocation.
       2) بنود package_ref_items للبكجات التجارية.
     البكجات غير التجارية مستبعدة من الاثنين. */
  const referenceFallbacks: string[] = [];

  const nestedBundleRefs = (linksRes.data ?? [])
    .filter((l: Json) => bundleKeys.has(String(l.course_id)) && !nonCommercial.has(String(l.package_id)))
    .slice()
    .sort((a: Json, b: Json) => (Number(a.sort_order) || 0) - (Number(b.sort_order) || 0))
    .map((l: Json) => {
      const key = String(l.course_id);
      const mapped = NESTED_BUNDLE_NAMES[key];
      if (!mapped) referenceFallbacks.push(key);
      const fallback = bundleCourses.find((c: Json) => String(c.key) === key);
      return {
        componentType: 'reference',
        websitePackageId: l.package_id,
        referenceItemName: mapped ?? String(fallback?.title ?? key),
        approvedAllocationIQD: Number(l.allocation) || 0,
      };
    });

  const refItemRefs = (refsRes.data ?? [])
    .filter((r: Json) => !nonCommercial.has(String(r.package_id)))
    .slice()
    .sort((a: Json, b: Json) => (Number(a.sort_order) || 0) - (Number(b.sort_order) || 0))
    .map((r: Json) => {
      const refKey = String(r.ref_key ?? '');
      const mapped = REFERENCE_ITEM_NAMES[refKey];
      if (!mapped) referenceFallbacks.push(refKey);
      return {
        componentType: 'reference',
        websitePackageId: r.package_id,
        referenceItemName: mapped ?? String(r.title ?? ''),
        approvedAllocationIQD: Number(r.allocation) || 0,
      };
    });

  const referenceComponents = [...nestedBundleRefs, ...refItemRefs];
  const referenceExcluded = (refsRes.data ?? []).filter((r: Json) => nonCommercial.has(String(r.package_id))).length;

  const packageComponents = [...standardComponents, ...referenceComponents];

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
    standardComponentsSent: standardComponents.length,
    referenceComponentsSent: referenceComponents.length,
    bundlePackagesSent: [...bundleKeys],
    excludedFromFinance: [...nonCommercial],
    componentsSent: packageComponents.length,
    referenceNameFallbacks: referenceFallbacks,
    nonCommercialPackages: [...nonCommercial],
    referenceComponentsExcluded: referenceExcluded,
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
    const authError = String(auth.error ?? 'invalid-token');
    return json({ ok: false, key: authError, message: map[authError] ?? map['invalid-token'] }, 403);
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

  if (action === 'reconcile_order') {
    if (!auth.admin.canConfirm) return json({ ok: false, message: 'ما عندك صلاحية تأكيد الدفع.' }, 403);
    const orderId = String(body.orderId ?? '');
    if (!orderId) return json({ ok: false, message: 'orderId مطلوب.' }, 400);
    return await reconcileOrder(orderId, auth.admin.email);
  }

  if (action === 'sync_catalog') {
    if (!auth.admin.canCatalog) return json({ ok: false, message: 'ما عندك صلاحية تعديل الكتالوك.' }, 403);
    return await syncCatalog(auth.admin.email);
  }

  return json({ ok: false, message: 'action غير معروف: ' + action }, 400);
});
