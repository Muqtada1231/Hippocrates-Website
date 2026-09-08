-- REVIEW ONLY: run after approval. Adds new records DISABLED in one transaction.
-- Never reuses or updates an existing lecturer/product. Any collision aborts.
-- Finance setup and verification in ANATOMY-MIGRATION-PLAN.md precede activation.
begin;

do $$
begin
  if exists (select 1 from public.lecturers
    where key = 'sajad' or lower(name_en) like '%sajad%' or lower(name_en) like '%sajjad%' or name_ar like '%سجاد%')
  or exists (select 1 from public.courses where key in
    ('anatomy-upper','anatomy-lower','anatomy-thorax','anatomy-ul-ll','anatomy-ll-thorax','anatomy-complete'))
  or exists (select 1 from public.packages where key in
    ('anatomy-upper','anatomy-lower','anatomy-thorax','anatomy-ul-ll','anatomy-ll-thorax','anatomy-complete')) then
    raise exception 'Anatomy ID/name collision: resolve existing records before proceeding. Nothing changed.';
  end if;
end $$;

insert into public.lecturers (key, name_en, name_ar, photo, bio_en, bio_ar) values
  ('sajad', 'Sajad Abdul Aziz Khalifa', 'د. سجاد عبد العزيز خليفة',
   'assets/lecturers/sajad-abdul-aziz-khalifa.png',
   'Responsible for teaching Anatomy for first-year students on Hippocrates.',
   E'من أوائل خريجي طب النهرين بتسلسل 34\nالمعدل التراكمي: 78.38\nحاصل على درجة الامتياز في مادة التشريح مع اهتمام وشغف خاص بالمادة\nخبرة في تدريس مادة التشريح لأكثر من 30 ساعة تدريسية مجانية حققت أكثر من ربع مليون مشاهدة\nمسيرة أكاديمية متميزة خلال سنوات الكلية ومشارك في أنشطة وفعاليات الكلية\nمسؤول عن شرح مادة Anatomy للمرحلة الأولى في منصة Hippocrates');

insert into public.courses
  (key, title, title_ar, lecturer_key, stage, stages, price, tags, includes, enabled, sort_order) values
  ('anatomy-upper', 'Upper Limb Anatomy', 'تشريح الطرف العلوي', 'sajad', 1, '{1}', 35000, '{basic}', '{anatomyIntro}', false, 240),
  ('anatomy-lower', 'Lower Limb Anatomy', 'تشريح الطرف السفلي', 'sajad', 1, '{1}', 30000, '{basic}', '{}', false, 250),
  ('anatomy-thorax', 'Thorax Anatomy', 'تشريح الصدر', 'sajad', 1, '{1}', 25000, '{basic}', '{}', false, 260);

insert into public.packages
  (key, name, name_ar, description, description_ar, stage, price,
   featured, best_value, enabled, purchasable, promo_enabled, sort_order) values
  ('anatomy-ul-ll', 'Upper Limb + Lower Limb', 'الطرف العلوي + الطرف السفلي',
   'First-year Anatomy with Sajad Abdul Aziz Khalifa.', 'تشريح المرحلة الأولى مع د. سجاد عبد العزيز خليفة.',
   1, 60000, false, false, false, true, true, 100),
  ('anatomy-ll-thorax', 'Lower Limb + Thorax', 'الطرف السفلي + الصدر',
   'First-year Anatomy with Sajad Abdul Aziz Khalifa.', 'تشريح المرحلة الأولى مع د. سجاد عبد العزيز خليفة.',
   1, 50000, false, false, false, true, true, 110),
  ('anatomy-complete', 'Upper Limb + Lower Limb + Thorax', 'بكج التشريح الكامل',
   'Complete first-year Anatomy with Sajad Abdul Aziz Khalifa.', 'تشريح المرحلة الأولى كاملاً مع د. سجاد عبد العزيز خليفة.',
   1, 80000, false, false, false, true, true, 120);

-- Content membership only. The Sheet owns 100% package Lecturer Pool allocation.
-- The accompanying Edge Function allowlist omits component amount fields.
insert into public.package_courses (package_id, course_id, allocation, sort_order) values
  ('anatomy-ul-ll', 'anatomy-upper', null, 10),
  ('anatomy-ul-ll', 'anatomy-lower', null, 20),
  ('anatomy-ll-thorax', 'anatomy-lower', null, 10),
  ('anatomy-ll-thorax', 'anatomy-thorax', null, 20),
  ('anatomy-complete', 'anatomy-upper', null, 10),
  ('anatomy-complete', 'anatomy-lower', null, 20),
  ('anatomy-complete', 'anatomy-thorax', null, 30);

commit;
