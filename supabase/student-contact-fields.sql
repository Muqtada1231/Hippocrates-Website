-- =============================================================================
-- HIPPOCRATES — حفظ هاتف وبريد الطالب مع الطلب
--
-- النموذج كان يجمع رقم الهاتف ويعرضه بالفاتورة، بس ما يوصل قاعدة البيانات
-- إطلاقاً: hippo_place_order يقرأ الاسم والمعرّف والمرحلة فقط. فالهاتف
-- ما كان يقدر يوصل شيت الطلاب لأنه ما وصل Supabase أصلاً.
--
-- نضيف العمودين، ونمرّر القيمتين بالدالة نفسها بنصّها الحالي + التنظيف.
-- ما نلمس: الأسعار · الأكواد · السلة · حساب الطلب · أي منطق مالي.
-- آمن لإعادة التشغيل.
-- =============================================================================

alter table public.orders
  add column if not exists student_phone text,
  add column if not exists student_email text;

comment on column public.orders.student_email is
  'اختياري. مُنظَّف ومحوَّل لحروف صغيرة عند الحفظ. يُتحقق من صيغته فقط إذا كُتب.';

CREATE OR REPLACE FUNCTION public.hippo_place_order(p_student jsonb, p_items jsonb, p_code text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_name    text;
  v_tg      text;
  v_phone   text;
  v_email   text;
  v_stage   smallint;
  v_cart    jsonb;
  v_promo   jsonb;
  v_pid     uuid;
  v_pcode   text;
  v_pdisc   integer := 0;
  v_total   integer;
  v_oid     uuid;
  v_ono     text;
  v_made    timestamptz;
begin
  v_name := left(btrim(coalesce(p_student->>'name', '')), 120);
  v_tg := left(lower(btrim(regexp_replace(coalesce(p_student->>'telegram', ''), '^@+', ''))), 64);
  begin
    v_stage := nullif(btrim(coalesce(p_student->>'stage', '')), '')::smallint;
  exception when others then v_stage := null;
  end;
  if v_stage is not null and (v_stage < 1 or v_stage > 6) then v_stage := null; end if;

  -- الهاتف اختياري: نشيل الفراغات الزائدة ونحدّ الطول، بلا فرض صيغة
  -- (أرقام العراق تنكتب بأشكال كثيرة، ورفضها يخسّرنا بيانات صحيحة).
  v_phone := nullif(left(btrim(coalesce(p_student->>'phone', '')), 40), '');

  -- البريد اختياري: تنظيف + توحيد لحروف صغيرة. نتحقق من الصيغة فقط إذا
  -- الطالب كتب شي — والفارغ يمر بلا اعتراض.
  v_email := nullif(lower(btrim(coalesce(p_student->>'email', ''))), '');
  if v_email is not null then
    if length(v_email) > 254 or v_email !~ '^[^@[:space:]]+@[^@[:space:].]+(\.[^@[:space:].]+)+$' then
      return jsonb_build_object('ok', false, 'key', 'email',
        'reason', 'Enter a valid email address.', 'reasonAr', 'أدخل بريداً إلكترونياً صحيحاً.');
    end if;
  end if;

  if length(v_name) < 2 then
    return jsonb_build_object('ok', false, 'key', 'name',
      'reason', 'Student name is required.', 'reasonAr', 'الاسم مطلوب.');
  end if;
  if length(v_tg) < 3 then
    return jsonb_build_object('ok', false, 'key', 'telegram',
      'reason', 'Telegram username is required.', 'reasonAr', 'معرّف تيليجرام مطلوب.');
  end if;

  v_cart := public.hippo_resolve_cart(p_items);
  if jsonb_array_length(v_cart->'lines') = 0 then
    return jsonb_build_object('ok', false, 'key', 'empty',
      'reason', 'Your cart is empty or its items are no longer available.',
      'reasonAr', 'سلتك فارغة أو العناصر غير متاحة.');
  end if;

  -- the code is checked again here; an invalid one refuses the order outright
  if coalesce(btrim(p_code), '') <> '' then
    v_promo := public.hippo_validate_promo(p_code, p_items, v_tg);
    if (v_promo->>'ok')::boolean is not true then
      return v_promo || jsonb_build_object('promoRejected', true);
    end if;
    select id into v_pid from public.promo_codes where code = upper(btrim(p_code));
    v_pcode := v_promo->>'code';
    v_pdisc := (v_promo->>'discount')::int;
  end if;

  v_total := greatest(0, (v_cart->>'total')::int - v_pdisc);

  insert into public.orders (
    student_name, student_telegram, student_stage, student_phone, student_email,
    subtotal, bundle_discount, promo_discount, total,
    promo_code, promo_id, status, source)
  values (
    v_name, v_tg, v_stage, v_phone, v_email,
    (v_cart->>'subtotal')::int, (v_cart->>'bundleDiscount')::int, v_pdisc, v_total,
    v_pcode, v_pid, 'pending', 'web')
  returning id, order_no, created_at into v_oid, v_ono, v_made;

  insert into public.order_items (
    order_id, item_type, product_id, name, name_ar, original_price, price, contents)
  select v_oid, l->>'type', l->>'productId', l->>'name', l->>'nameAr',
         (l->>'original')::int, (l->>'price')::int, coalesce(l->'contents', '[]'::jsonb)
    from jsonb_array_elements(v_cart->'lines') as t(l);

  if v_pid is not null then
    insert into public.promo_redemptions (promo_id, order_id, student_telegram, amount)
    values (v_pid, v_oid, v_tg, v_pdisc);
  end if;

  return jsonb_build_object(
    'ok', true, 'orderId', v_oid, 'orderNo', v_ono, 'status', 'pending',
    'createdAt', v_made,
    'student', jsonb_build_object('name', v_name, 'telegram', v_tg, 'stage', v_stage,
                                  'phone', v_phone, 'email', v_email),
    'lines', v_cart->'lines',
    'subtotal', (v_cart->>'subtotal')::int,
    'bundleDiscount', (v_cart->>'bundleDiscount')::int,
    'promoCode', v_pcode, 'promoDiscount', v_pdisc,
    'discount', (v_cart->>'bundleDiscount')::int + v_pdisc,
    'total', v_total);
end
$function$
;

select column_name from information_schema.columns
 where table_schema='public' and table_name='orders' and column_name in ('student_phone','student_email');
