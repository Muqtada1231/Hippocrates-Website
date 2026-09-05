-- =============================================================================
-- HIPPOCRATES — مواءمة اسم بكج القلب والتنفس مع الاسم المعتمد بنظام الحسابات
--
-- الشيت يستعمل "Cardiorespiratory Package"، والموقع كان يرسل
-- "Cardiorespiratory Clinical Core"، فما انربط البكج.
-- الحل الصحيح هو تعديل الاسم بالمصدر، مو مطابقة تقريبية تخفي الفرق.
--
-- يعدّل حقل الاسم الإنجليزي فقط. المفتاح والسعر والمرحلة ومحتويات البكج
-- والتوزيعات وإعدادات العروض ما تنلمس.
-- آمن لإعادة التشغيل: الشرط على الاسم القديم يمنع أي تنفيذ ثاني.
-- =============================================================================

update public.packages
   set name = 'Cardiorespiratory Package'
 where key  = 'cardioresp'
   and name = 'Cardiorespiratory Clinical Core'
returning key, name, name_ar, price, stage, enabled, promo_enabled, sort_order;
