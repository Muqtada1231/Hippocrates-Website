-- =============================================================================
-- HIPPOCRATES — تعبئة التوزيع الداخلي المفقود لثلاثة بكجات
--
-- التدقيق أظهر أن هذي الثلاثة كل صفوفها allocation = NULL، فكانت مبيعاتها
-- تروح للحسابات بلا حصة محاضر. الأرقام أدناه معتمدة من العمل، ومجموع كل
-- بكج يساوي سعر بيعه بالضبط.
--
-- كل أمر مقيّد بـ (package_id, course_id) و allocation is null معاً:
--   · ما يقدر يلمس البكجات الستة الأخرى
--   · ما يقدر يدهس توزيعاً موجوداً
--   · آمن لإعادة التشغيل
--
-- ما يمس: الأسعار · المحتويات · أسعار الكورسات · المفاتيح · الشيت · Apps Script
-- =============================================================================

begin;

-- 1) GIT Clinical Core — 35,000
update public.package_courses set allocation = 23500
 where package_id='gitcore' and course_id='git'       and allocation is null;
update public.package_courses set allocation = 11500
 where package_id='gitcore' and course_id='clin-surg' and allocation is null;

-- 2) Radiology Complete — 25,000
update public.package_courses set allocation = 17000
 where package_id='radiology' and course_id='radio-theory' and allocation is null;
update public.package_courses set allocation =  8000
 where package_id='radiology' and course_id='radio-prac'   and allocation is null;

-- 3) Fifth Year Package — 80,000
update public.package_courses set allocation = 20000
 where package_id='year5' and course_id='ortho'     and allocation is null;
update public.package_courses set allocation = 17000
 where package_id='year5' and course_id='derm-full' and allocation is null;
update public.package_courses set allocation = 17000
 where package_id='year5' and course_id='obgyn5'    and allocation is null;
update public.package_courses set allocation = 10000
 where package_id='year5' and course_id='ent'       and allocation is null;
update public.package_courses set allocation = 10000
 where package_id='year5' and course_id='peds5'     and allocation is null;
update public.package_courses set allocation =  6000
 where package_id='year5' and course_id='psych'     and allocation is null;

commit;
