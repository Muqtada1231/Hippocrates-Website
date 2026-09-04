-- =============================================================================
-- HIPPOCRATES — مزامنة قاعدة البيانات مع الكتالوك الحيّ في الموقع
-- شغّله مرة واحدة في Supabase SQL Editor. آمن لإعادة التشغيل أكثر من مرة.
--
-- ليش نحتاجه؟
-- الموقع يعرض الأسعار من js/store.js، لكن السيرفر يعيد حساب الطلب من هذي
-- الجداول. الاثنان افترقا، فأي سلة تحتوي منتجاً ناقصاً كان الطلب يفشل
-- برسالة "سلتك فارغة"، وكورسان كانا يُحسبان بسعر غلط.
--
-- يعالج: عمود مراحل ناقص · محاضرتان · كورسان · 3 بكجات · سعران خطأ
-- =============================================================================


-- ── 1. عمود المراحل المتعددة (هذا سبب فشل السكربت السابق) ────────────────────
-- قاعدتك انبنت قبل ما تُضاف ميزة "الكورس ينتمي لأكثر من مرحلة"، فالعمود مفقود.
-- نضيفه، ثم نعبّيه من عمود stage القديم لكل الصفوف الموجودة.

alter table public.courses
  add column if not exists stages smallint[] not null default '{}';

update public.courses
   set stages = case
                  when stage is null then '{}'::smallint[]
                  else array[stage]::smallint[]
                end
 where stages = '{}'::smallint[];

create index if not exists courses_stages_idx on public.courses using gin (stages);


-- ── 2. المحاضرتان الناقصتان ──────────────────────────────────────────────────
insert into public.lecturers (key, name_en, name_ar, photo) values
  ('tabarak', 'Tabarak Sabah Ali',  'تبارك صباح علي', 'assets/lecturers/tabarak.png'),
  ('ayat',    'Ayat Ghalib Nasser', 'آيات غالب ناصر', 'assets/lecturers/ayat.png')
on conflict (key) do update
  set name_en = excluded.name_en,
      name_ar = excluded.name_ar,
      photo   = excluded.photo;


-- ── 3. الكورسان الناقصان ─────────────────────────────────────────────────────
insert into public.courses
  (key, title, title_ar, lecturer_key, stage, stages, price, tags, enabled, sort_order) values
  ('pathology',  'Pathology',  'علم الأمراض', 'tabarak', 3, '{3}'::smallint[], 20000, '{basic}'::text[], true,  70),
  ('physiology', 'Physiology', 'الفسلجة',     'ayat',    2, '{2}'::smallint[], 25000, '{basic}'::text[], true, 230)
on conflict (key) do update
  set title        = excluded.title,
      title_ar     = excluded.title_ar,
      lecturer_key = excluded.lecturer_key,
      stage        = excluded.stage,
      stages       = excluded.stages,
      price        = excluded.price,
      tags         = excluded.tags,
      enabled      = excluded.enabled;


-- ── 4. تصحيح السعرين المختلفين عن الموقع ─────────────────────────────────────
update public.courses set price = 25000 where key = 'pharma';    -- الموقع يعرض 25,000
update public.courses set price = 20000 where key = 'clin-med';  -- الموقع يعرض 20,000


-- ── 5. الكورسات التي تخدم أكثر من مرحلة ──────────────────────────────────────
update public.courses set stages = '{3,4,6}'::smallint[] where key in ('clin-surg', 'clin-med');
update public.courses set stages = '{4,6}'::smallint[]   where key in ('git', 'resp', 'cardio');


-- ── 6. البكجات الثلاثة الناقصة ───────────────────────────────────────────────
insert into public.packages
  (key, name, name_ar, description, description_ar,
   stage, price, featured, best_value, enabled, promo_enabled, sort_order) values
  ('year3',
   'Third Year Package', 'بكج المرحلة الثالثة',
   'The third-year basic sciences load in one enrollment.',
   'منهج المرحلة الثالثة الأساسي بتسجيل واحد.',
   3, 50000, true, false, true, true, 10),
  ('obspeds4',
   '4th Stage Obs & Pediatrics Package', 'بكج النسائية والأطفال — المرحلة الرابعة',
   'Obstetrics & Gynecology with Pediatrics, fourth stage.',
   'النسائية والتوليد مع طب الأطفال للمرحلة الرابعة.',
   4, 40000, false, false, true, true, 70),
  ('obspeds5',
   '5th Stage Obs & Pediatrics Package', 'بكج النسائية والأطفال — المرحلة الخامسة',
   'Obstetrics & Gynecology with Pediatrics, fifth stage.',
   'النسائية والتوليد مع طب الأطفال للمرحلة الخامسة.',
   5, 35000, false, false, true, true, 80)
on conflict (key) do update
  set name           = excluded.name,
      name_ar        = excluded.name_ar,
      description    = excluded.description,
      description_ar = excluded.description_ar,
      stage          = excluded.stage,
      price          = excluded.price,
      featured       = excluded.featured,
      enabled        = excluded.enabled;


-- ── 7. محتويات البكجات الجديدة (allocation = التوزيع على الفاتورة) ───────────
insert into public.package_courses (package_id, course_id, allocation, sort_order) values
  ('year3',    'basic-med', 15500, 1),
  ('year3',    'pharma',    19000, 2),
  ('year3',    'pathology', 15500, 3),
  ('obspeds4', 'obgyn4',    20000, 1),
  ('obspeds4', 'peds4',     20000, 2),
  ('obspeds5', 'obgyn5',    22000, 1),
  ('obspeds5', 'peds5',     13000, 2)
on conflict (package_id, course_id) do update
  set allocation = excluded.allocation,
      sort_order = excluded.sort_order;


-- ── 8. تحقّق ─────────────────────────────────────────────────────────────────
-- المتوقع: courses = 23 · packages = 9 · lecturers = 16
select
  (select count(*) from public.courses)   as courses,
  (select count(*) from public.packages)  as packages,
  (select count(*) from public.lecturers) as lecturers;
