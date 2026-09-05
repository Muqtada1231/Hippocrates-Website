-- =============================================================================
-- HIPPOCRATES — بكج المرحلة السادسة: عرض فقط، غير قابل للشراء
--
-- قرار العمل: year6 (PKG007) مو منتج تجاري. الطالب يشوفه بالموقع، بس ما
-- يكدر يشتريه. الوصول يُمنح مجاناً إدارياً لاحقاً، بلا معاملة مدفوعة.
--
-- قيم المحتوى المرجعي (35,000 · 23,000 · 23,000 · 19,000) تبقى كما هي،
-- بس معناها تغيّر: صارت قيماً مرجعية للعرض، **مو توزيع أرباح محاضرين**.
-- ما نحذفها ولا نعدّلها — نغيّر تصنيفها فقط.
--
-- المنع سيرفري: hippo_resolve_cart هي المسار المشترك لـ hippo_place_order
-- و hippo_validate_promo، فسطر واحد فيها يقفل السلة والكود والطلب معاً.
-- إخفاء الزر بالواجهة تجميل، مو حماية.
-- =============================================================================

-- ── 1. العَلَم ───────────────────────────────────────────────────────────────
alter table public.packages
  add column if not exists purchasable boolean not null default true;

comment on column public.packages.purchasable is
  'false = بكج للعرض فقط: يظهر بالموقع، وما يدخل السلة ولا يصير طلب مدفوع. توزيعاته قيم مرجعية لا أرباح محاضرين.';

update public.packages set purchasable = false where key = 'year6' and purchasable;


-- ── 2. البوابة السيرفرية ────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.hippo_resolve_cart(p_items jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_it        jsonb;
  v_seen      text[] := '{}';
  v_type      text;
  v_id        text;
  v_lines     jsonb := '[]'::jsonb;
  v_subtotal  integer := 0;
  v_total     integer := 0;
  v_original  integer;
  v_list      integer;
  v_parts     jsonb;
  c           record;
  p           record;
  pc          record;
  ri          record;
begin
  for v_it in select value from jsonb_array_elements(coalesce(p_items, '[]'::jsonb)) loop
    v_type := coalesce(v_it->>'type', 'course');
    if v_type <> 'package' then v_type := 'course'; end if;
    v_id := coalesce(v_it->>'productId', '');
    continue when v_id = '' or (v_type || ':' || v_id) = any (v_seen);
    v_seen := v_seen || (v_type || ':' || v_id);
    exit when array_length(v_seen, 1) > 40;

    if v_type = 'course' then
      select * into c from public.courses where key = v_id and enabled;
      continue when c.key is null;
      v_original := coalesce(c.original_price, c.price);
      v_subtotal := v_subtotal + v_original;
      v_total := v_total + c.price;
      v_lines := v_lines || jsonb_build_object(
        'type', 'course', 'productId', c.key, 'name', c.title, 'nameAr', c.title_ar,
        'original', v_original, 'price', c.price,
        'save', greatest(0, v_original - c.price), 'contents', '[]'::jsonb);
    else
      select * into p from public.packages where key = v_id and enabled;
      continue when p.key is null;
      -- بكج غير قابل للشراء (عرض فقط): ما يدخل السلة ولا يُسعَّر ولا يصير طلب.
      -- هذي البوابة الحقيقية: hippo_place_order و hippo_validate_promo
      -- كلاهما يمر من هنا، فالمنع سيرفري مو إخفاء زر.
      continue when p.purchasable is false;
      continue when p.promo_enabled is false;
      continue when p.promo_start is not null and p.promo_start > now();
      continue when p.promo_end is not null and p.promo_end < now();

      v_list := 0;
      v_parts := '[]'::jsonb;
      for pc in
        select co.key as ckey, co.title, co.title_ar, co.price, x.allocation
          from public.package_courses x
          join public.courses co on co.key = x.course_id
         where x.package_id = p.key
         order by x.sort_order
      loop
        v_list := v_list + pc.price;
        v_parts := v_parts || jsonb_build_object(
          'id', pc.ckey, 'title', pc.title, 'titleAr', pc.title_ar,
          'price', coalesce(pc.allocation, pc.price));
      end loop;
      for ri in
        select * from public.package_ref_items where package_id = p.key order by sort_order
      loop
        v_list := v_list + ri.price;
        v_parts := v_parts || jsonb_build_object(
          'id', ri.ref_key, 'title', ri.title, 'titleAr', ri.title_ar,
          'price', coalesce(ri.allocation, ri.price));
      end loop;

      v_original := coalesce(p.original_price, v_list);
      v_subtotal := v_subtotal + v_original;
      v_total := v_total + p.price;
      v_lines := v_lines || jsonb_build_object(
        'type', 'package', 'productId', p.key, 'name', p.name, 'nameAr', p.name_ar,
        'original', v_original, 'price', p.price,
        'save', greatest(0, v_original - p.price), 'contents', v_parts);
    end if;
  end loop;

  return jsonb_build_object(
    'lines', v_lines, 'subtotal', v_subtotal, 'total', v_total,
    'bundleDiscount', v_subtotal - v_total);
end
$function$
;

-- ── 3. تحقّق ────────────────────────────────────────────────────────────────
select key, name, price, enabled, purchasable from public.packages order by sort_order;
