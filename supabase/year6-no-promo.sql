-- =============================================================================
-- HIPPOCRATES — إزالة دلالات العروض عن بكج العرض فقط (year6)
--
-- المنتج ما ينباع، فما يصح يحمل شارة عرض ولا حملة خصم.
-- يعدّل عَلَم العروض فقط. السعر والقيمة المرجعية والمحتويات والمفتاح
-- والظهور بالموقع — كلها بدون مساس.
--
-- ملاحظة: hippo_resolve_cart أصلاً يرفض البكج ذا promo_enabled=false، فهذا
-- يصير حاجزاً سيرفرياً ثانياً فوق حاجز purchasable. حزامان، لا واحد.
-- =============================================================================

update public.packages
   set promo_enabled = false
 where key = 'year6'
   and purchasable is false
   and promo_enabled;

select key, name, price, enabled, purchasable, promo_enabled
  from public.packages order by sort_order;
