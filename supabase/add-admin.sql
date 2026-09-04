-- =============================================================================
-- HIPPOCRATES — منح صلاحية الدخول للوحة الإدارة
--
-- الدخول يحتاج شيئين معاً، وأي واحد لوحده لا يكفي:
--   1. حساب في Supabase Auth   (Authentication → Users → Add user)
--   2. صف في جدول public.admins  (هذا الملف)
--
-- أي شخص يسجّل دخوله بدون صف هنا لا يرى ولا شيء — كل سياسات الحماية (RLS)
-- مكتوبة على أساس هذا الجدول. يعني الحماية بقاعدة البيانات نفسها،
-- مو بإخفاء الصفحة.
--
-- شغّل هذا الملف بعد ما تنشئ الحسابين من Authentication → Users.
-- =============================================================================


-- ── المدراء المصرّح لهم ──────────────────────────────────────────────────────
-- الإيميلات تُطابَق بحروف صغيرة، فلا يهم شكل الحروف عند إنشاء الحساب.

insert into public.admins (id, email, full_name, role, active)
select u.id, u.email, x.full_name, 'owner', true
from (values
  ('muqtadaali.123@gmail.com',  'مقتدى علي'),
  ('halah.waleed.k@gmail.com',  'هالة وليد')
) as x(email, full_name)
join auth.users u on lower(u.email) = lower(x.email)
on conflict (id) do update
  set role      = 'owner',
      active    = true,
      full_name = excluded.full_name;


-- ── تحقّق: منو عنده صلاحية الآن؟ ─────────────────────────────────────────────
-- المفروض يظهر صفّان فقط، كلاهما owner و active = true.
-- إذا ظهر صف واحد أو ولا صف: يعني أحد الحسابين ما انعمل بعد في Authentication → Users.

select email, full_name, role, active, created_at
from public.admins
order by email;


-- =============================================================================
-- ملاحظات للمستقبل
-- =============================================================================
--
-- الدور 'owner' يملك كل الصلاحيات تلقائياً. إذا حبيت تضيف موظف دعم
-- بصلاحيات محدودة (يشوف الطلبات ويأكد الدفع فقط، بدون تحكم بالأسعار
-- أو أكواد الخصم):
--
--   insert into public.admins
--     (id, email, full_name, role,
--      can_view_orders, can_confirm_payments, can_manage_promos,
--      can_edit_catalog, can_manage_staff)
--   select id, email, 'اسم الموظف', 'staff',
--          true,   -- يشوف الطلبات
--          true,   -- يأكد أو يرفض الدفع
--          false,  -- أكواد الخصم
--          false,  -- الأسعار والكورسات
--          false   -- إضافة مدراء
--   from auth.users where lower(email) = lower('staff@example.com')
--   on conflict (id) do nothing;
--
-- إيقاف حساب مؤقتاً بدون حذفه (يحافظ على سجل تأكيداته السابقة):
--   update public.admins set active = false where lower(email) = lower('someone@example.com');
--
-- سحب الصلاحية نهائياً:
--   delete from public.admins where lower(email) = lower('someone@example.com');
