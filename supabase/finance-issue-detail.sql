-- =============================================================================
-- HIPPOCRATES — حفظ رد الويبهوك كاملاً لمزامنة الكتالوك
-- شغّله مرة واحدة في Supabase SQL Editor. آمن لإعادة التشغيل.
--
-- ليش: أول مزامنة رجّعت UNMAPPED_PACKAGE بدون اسم البكج. التفاصيل كانت
-- موجودة برد Apps Script، بس التكامل كان يختصرها لرمز مجرّد قبل الحفظ.
-- هذا الملف يضيف عمود الرد الخام. ما يمس أي منطق مالي ولا أي سعر ولا أي اسم.
-- =============================================================================

alter table public.finance_catalog_sync
  add column if not exists response jsonb;

comment on column public.finance_catalog_sync.response is
  'رد الويبهوك الخام لآخر مزامنة كتالوك، بلا تقليص. المفاتيح اللي اسمها يوحي بسر تُستبدل قيمها بـ [redacted].';

comment on column public.finance_catalog_sync.issues is
  'كائنات المشاكل كاملة كما رجّعها Apps Script (code · packageName · websitePackageId · error · أي حقل آخر).';


-- ── التفاصيل التي وصلت فعلاً بأول مزامنة محفوظة أصلاً هنا ───────────────────
-- ما تحتاج تعيد المزامنة حتى تشوفها: finance_sync_log كان يحفظ الرد كاملاً
-- من البداية. هذا الاستعلام يطلع لك رد آخر مزامنة كتالوك كما وصل:

select created_at,
       http_status,
       ok,
       error,
       jsonb_pretty(response) as webhook_response
  from public.finance_sync_log
 where action = 'sync_catalog'
 order by created_at desc
 limit 1;
