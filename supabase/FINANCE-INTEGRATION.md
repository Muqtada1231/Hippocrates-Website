# ربط الموقع بنظام الحسابات في Google Sheets

هذا تكامل فقط. ما انبنى موقع جديد ولا نظام طلبات جديد ولا لوحة إدارة جديدة —
انضاف جسر واحد بين Supabase و Apps Script، وشوية أعمدة حالة، وزرّين بلوحة الإدارة.

## المسار

```
الطالب يطلب  →  Supabase (pending)
             →  المدير يراجع إثبات الدفع
             →  المدير يضغط «تأكيد الدفع»          ← الطلب يصير confirmed بقاعدة البيانات
             →  hippocrates-finance-sync (Edge Function)
             →  Google Apps Script /exec
             →  Google Sheets
```

المتصفح ما ينادي Apps Script أبداً. سر الويبهوك ما ينزل للمتصفح ولا مرة —
موجود بأسرار Edge Functions فقط.

---

## 1. شغّل الترحيل (SQL)

Supabase Dashboard → **SQL Editor** → الصق محتوى `supabase/finance-integration.sql` → Run.

يضيف:

| الشيء | الوين |
|---|---|
| `payment_method`, `payment_reference`, `confirmed_at` | `orders` |
| `finance_sync_status`, `finance_synced_at`, `finance_sync_error`, `finance_sync_attempts` | `orders` |
| `finance_sync_log` | جدول جديد — سجل كل محاولة مزامنة |
| `finance_catalog_sync` | جدول جديد — صف واحد لحالة آخر مزامنة كتالوك |

`finance_sync_status` قيمه: `not_synced` · `syncing` · `synced` · `sync_error`.

> الملف يبدأ بفحص أمان: إذا كان التريكر الحارس على `orders` مكتوباً بأسلوب
> «قارن الصف كله»، السكربت **يتوقف بخطأ واضح** بدل ما يخرب شي. إذا طلعتلك
> تلك الرسالة، عدّل التريكر ليسمح بالأعمدة المذكورة بالرسالة وأعد التشغيل.

---

## 2. انشر الـ Edge Function

من مجلد المشروع:

```bash
supabase functions deploy hippocrates-finance-sync --project-ref klfdhfjyueihnzazdqnp
```

إذا ما عندك Supabase CLI، تكدر تنشرها من الداشبورد:
**Edge Functions → Deploy a new function** والصق محتوى
`supabase/functions/hippocrates-finance-sync/index.ts`.

---

## 3. الأسرار

Dashboard → **Project Settings → Edge Functions → Secrets** → Add new secret:

| المفتاح | القيمة |
|---|---|
| `HIPPO_GOOGLE_SHEETS_WEBHOOK_URL` | رابط `/exec` المنشور من Apps Script |
| `HIPPO_WEBHOOK_SECRET` | نفس قيمة `HIPPO_WEBHOOK_SECRET` في Script Properties |
| `HIPPO_FINANCE_PAYMENT_METHOD` | (اختياري) تسمية طريقة الدفع كما هي بالشيت. الافتراضي `SuperQi` |

**لا تحط أي من هذي بملف `js/config.js` ولا بأي ملف يروح للمتصفح ولا بـ GitHub.**

`SUPABASE_URL` و `SUPABASE_SERVICE_ROLE_KEY` تحطهم Supabase بنفسها داخل الدالة —
ما تحتاج تضيفهم.

### تأكد أن السر وصل

بعد النشر، افتح لوحة الإدارة وسجّل دخول، وبالكونسول:

```js
await HIPPO_ADMIN.financePing()
```

المتوقع: `{ ok: true, webhookConfigured: true, secretConfigured: true, ... }`.
الرد ما يحتوي السر — يقول موجود أو لا فقط.

---

## 4. أول مزامنة كتالوك

لوحة الإدارة → **الكورسات** → زر **«مزامنة الكتالوك مع الحسابات»**.

يرسل `action: sync_catalog` وفيه:

- **الكورسات** — `websiteCourseId` (= `courses.key` الحقيقي)، الاسم، الاسم العربي،
  المراحل، السعر الحالي، المحاضر، الحالة، وقت آخر تعديل.
- **البكجات** — `websitePackageId` (= `packages.key` الحقيقي)، الاسم، الاسم العربي،
  المرحلة، سعر البيع، الحالة، أهلية العروض، وقت آخر تعديل.
- **محتويات البكجات** — أي كورسات داخل أي بكج + التوزيع.

**ما نخترع معرّفات.** `courses.key` و `packages.key` هما المفتاح الأساسي الحقيقي
بـ Supabase (ما بيهم عمود `id` أصلاً)، فهما اللي ينكتبون بأعمدة
Website Course ID / Website Package ID بالشيت.

الشريط فوق الصفحة يوري:

| الحالة | معناها |
|---|---|
| **مكتملة** | كل المنتجات انربطت |
| **ناقصة** | انرسلت بس بعض المنتجات ما انربطت — والقائمة تحتها تسمّيهم بالضبط |
| **فشلت** | الويبهوك ما استجاب أو رفض الطلب |

إذا رجّع Apps Script أي من `AMBIGUOUS_COURSE_MATCH` · `AMBIGUOUS_PACKAGE_MATCH` ·
`UNMAPPED_COURSE` · `UNMAPPED_PACKAGE` → الحالة تصير **ناقصة** وينعرض المنتج
بالاسم والمعرّف. ما ننجح المزامنة كلها لمجرد أن HTTP رجع 200.

---

## 5. تأكيد الدفع

ما تغيّر شي بالشكل. المدير يضغط **«تأكيد الدفع»** مثل قبل:

1. الطلب ينتقل `pending → confirmed` بنفس المسار القديم اللي تحرسه RLS.
2. بعدها فقط تنطلق المزامنة المالية.
3. النتيجة تنحفظ على الطلب وبـ `finance_sync_log`.

**لو فشل جوجل:** الدفع يبقى **مؤكداً**، وتظهر بالبطاقة حالة **«خطأ بالمزامنة»**
مع نص الخطأ وزر **«إعادة المزامنة المالية»**. الطالب ما يندفعله شي من جديد.

المزامنة ما تنطلق نهائياً على: السلة · الدفع · الفاتورة · الطلب المعلّق ·
ضغطة زر تيليجرام.

---

## 6. حمولة البيع المرسلة

نداء واحد لكل طلب، وكل بنود الطلب داخله بـ `items[]` — مو نداء لكل بند.

```
طلب واحد بالموقع  =  Transaction واحدة بالشيت
بند واحد           =  Subscription واحدة بالشيت
```

البكج ينرسل **بند واحد**، ما ينفكّ لكورسات. توزيع البكج شغلة الشيت.

### الأسعار تجي من لحظة الشراء، مو من كتالوك اليوم

`originalPriceIQD` و `discountIQD` و `actualPaidIQD` كلها محسوبة من
`order_items` المحفوظة وقت الطلب. لو غيّرت سعر كورس اليوم، الطلبات القديمة
ما تتأثر.

خصم كود الخصم محفوظ على مستوى الطلب، فيتوزّع على البنود بالتناسب بطريقة
«أكبر باقٍ» — يعني **مجموع `actualPaidIQD` يساوي `orderTotalIQD` بالدينار
تماماً**، بدون فرق كسور. وإذا ما تطابقت الأرقام لأي سبب، الدالة **ترفض
الإرسال** وتسجّل الخطأ بدل ما تبعث أرقاماً مكسورة للحسابات.

### المعرّفات

| الحقل | القيمة |
|---|---|
| `websiteOrderId` | `orders.id` — UUID الحقيقي من Supabase (عليه تشتغل حماية التكرار عند جوجل) |
| `websiteOrderNo` | `orders.order_no` — الرقم المقروء بالفاتورة، للرجوع البشري فقط |
| `websiteStudentId` | `tg:<معرّف تيليجرام>` — ثابت للطالب عبر كل طلباته |
| `websiteCourseId` / `websitePackageId` | `product_id` = مفتاح الكورس/البكج بـ Supabase |

> الموقع ما عنده حسابات طلاب ولا جدول `students`. معرّف تيليجرام هو الشيء
> الوحيد الثابت اللي يجمعه — فصار هو أساس معرّف الطالب. **ما نستعمل الاسم
> كمعرّف أبداً.** إذا انضاف نظام حسابات مستقبلاً، بدّل هذا السطر بمعرّف الحساب.

---

## 7. منع التكرار

من طرفين:

- **Supabase** — إذا الطلب `finance_sync_status = 'synced'` الدالة ترجع فوراً
  `alreadySynced` وما تنادي جوجل.
- **Apps Script** — يمنع تكرار نفس `websiteOrderId`.

وإذا رجّع `DUPLICATE_ORDER_ID`، الدالة تفهمها **نجاحاً** (الطلب مسجّل أصلاً)
وتعلّمه `synced` — ما تنشئ طلباً ثانياً ولا تبدّل رقم الطلب للتحايل على الحماية.

---

## 8. الاختبارات قبل أول طالب حقيقي

بالترتيب:

1. **`financePing()`** → `webhookConfigured: true` و `secretConfigured: true`.
2. **مزامنة الكتالوك** → افتح الشيت وتأكد أن أعمدة Website Course ID /
   Website Package ID انملت بمعرّفات حقيقية (`pathology`, `year3` …) مو فاضية
   ولا مخترعة.
3. **طلب اختبار بكورس واحد** → أكّده من اللوحة. المتوقع بالشيت:
   طالب واحد · Transaction واحدة · Subscription واحدة ·
   Website Order ID صحيح · Actual Paid صحيح · 10/10/80 محسوبة ·
   وبلوحة الإدارة: **مزامن**.
4. **طلب اختبار بكورس + بكج** → المتوقع: بـ Supabase طلب واحد وبندين، وبالشيت
   Transaction واحدة و **Subscription اثنتين** بنفس Transaction ID و
   Website Order ID و Student ID، وإجمالي الـ Transaction = مجموع الـ
   Actual Paid للبندين.
5. **تكرار** → اضغط «إعادة المزامنة المالية» على نفس الطلب المزامن. المتوقع:
   ما ينضاف أي سجل مالي جديد.
6. **فشل** → غيّر `HIPPO_GOOGLE_SHEETS_WEBHOOK_URL` لرابط غلط مؤقتاً وأكّد طلباً.
   المتوقع: الدفع يبقى **مؤكداً** · الحالة **خطأ بالمزامنة** · زر إعادة المحاولة
   يظهر · وبعد ترجيع الرابط الصحيح، إعادة المحاولة تنجح **بنفس رقم الطلب**.
7. **تنظيف** → امسح الطلبات وبنودها من Supabase، والصفوف المقابلة (Students /
   Transactions / Subscriptions) من الشيت. لا تخلّي سجلات تجارية وهمية.

---

## 9. وين تشوف شنو صار

```sql
-- آخر محاولات المزامنة
select created_at, action, ok, http_status, error
  from public.finance_sync_log
 order by created_at desc limit 20;

-- الطلبات المؤكدة اللي بعدها ما انزامنت
select order_no, total, finance_sync_status, finance_sync_attempts, finance_sync_error
  from public.orders
 where status = 'confirmed' and finance_sync_status <> 'synced'
 order by created_at desc;
```

`finance_sync_log.request` يحتوي الحمولة المرسلة كاملة **بدون السر** — السر
ينضاف لحظة الإرسال فقط وما ينحفظ ولا ينسجّل بأي مكان.

---

## 10. شنو ما انعمل عمداً

- **حقل «مرجع الدفع» بواجهة التأكيد** — العمود `orders.payment_reference` موجود
  وينرسل إذا انملى، بس ما انضاف له حقل إدخال حتى ما نغيّر شكل خطوة التأكيد.
  قوللي إذا تريده وأضيفه.
- **قيمة طريقة الدفع بالشيت** — الافتراضي `SuperQi`. إذا التسمية بالشيت مختلفة
  (مثلاً `Electronic Transfer`)، غيّر السرّ `HIPPO_FINANCE_PAYMENT_METHOD`.
  ما نخترع تسمية جديدة إذا أكو وحدة موجودة تنطبق.
- **شكل رد `sync_catalog`** — قراءة الرد مكتوبة بشكل متسامح: تقبل
  `success` أو `ok`، وتدوّر رموز الربط الأربعة بالرد كله. إذا Apps Script
  يرجّع الأخطاء بشكل مختلف، ابعثلي الـ handler وأظبّطها بالضبط.
