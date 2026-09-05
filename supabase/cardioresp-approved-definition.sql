-- =============================================================================
-- HIPPOCRATES — التعريف المعتمد لبكج القلب والتنفس (cardioresp)
--
-- المعتمد:
--   المحتوى        : Cardiology + Respiratory فقط (بدون Clinical Medicine)
--   القيمة المفردة : 25,000 + 25,000 = 50,000
--   سعر البيع      : 40,000  (وفر 10,000 = 20%)
--   التوزيع        : 20,000 + 20,000 = 40,000
--
-- كل أمر مقيّد بقيمته القديمة، فالملف آمن لإعادة التشغيل وما يمس صفاً ثانياً.
-- ما يلمس أي بكج آخر ولا أي سعر كورس مفرد ولا الشيت ولا Apps Script.
-- =============================================================================

begin;

-- 1) سعر البيع: 50,000 → 40,000
update public.packages
   set price = 40000
 where key   = 'cardioresp'
   and price = 50000;

-- 2) إخراج Clinical Medicine من هذا البكج وحده
--    (clin-med يبقى كورساً مستقلاً، ويبقى داخل أي بكج آخر يضمّه)
delete from public.package_courses
 where package_id = 'cardioresp'
   and course_id  = 'clin-med';

-- 3) التوزيع الداخلي: 20,000 لكل كورس
update public.package_courses
   set allocation = 20000
 where package_id = 'cardioresp'
   and course_id in ('cardio', 'resp');

commit;
