/* Hippocrates — admin data access.
   Thin wrapper over Supabase. Every call runs as the logged-in administrator,
   so Row Level Security decides what is readable and writable — this file
   grants no permissions of its own and holds no secrets.
   Loaded as a plain script: window.HIPPO_ADMIN. */
(function () {
  'use strict';

  var client = null;

  function sb() {
    if (client) return client;
    var cfg = window.HIPPO_CONFIG || {};
    if (!window.supabase || !cfg.supabaseUrl || !cfg.supabaseAnonKey) return null;
    client = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey, {
      auth: { persistSession: true, autoRefreshToken: true, storageKey: 'hippo:admin:auth' }
    });
    return client;
  }

  function ready() { return !!sb(); }

  function fail(e) { return Promise.reject(e && e.message ? new Error(e.message) : e); }

  function unwrap(res) {
    if (res.error) return fail(res.error);
    return res.data;
  }

  /* ── auth ── */
  function signIn(email, password) {
    var c = sb();
    if (!c) return fail({ message: 'Supabase is not configured.' });
    return c.auth.signInWithPassword({ email: String(email || '').trim(), password: password || '' }).then(unwrap);
  }

  function signOut() {
    var c = sb();
    return c ? c.auth.signOut() : Promise.resolve();
  }

  function getSession() {
    var c = sb();
    if (!c) return Promise.resolve(null);
    return c.auth.getSession().then(function (r) { return r.data ? r.data.session : null; });
  }

  function onAuthChange(fn) {
    var c = sb();
    if (!c) return function () {};
    var sub = c.auth.onAuthStateChange(function (_e, session) { fn(session); });
    return function () { try { sub.data.subscription.unsubscribe(); } catch (e) {} };
  }

  /* The admins row IS the authorization check: a signed-in user without one
     can read nothing, because every policy is written against it. */
  function me() {
    var c = sb();
    if (!c) return Promise.resolve(null);
    return c.auth.getUser().then(function (r) {
      var user = r.data ? r.data.user : null;
      if (!user) return null;
      return c.from('admins').select('*').eq('id', user.id).maybeSingle().then(function (res) {
        if (res.error) return null;
        if (!res.data) return null;
        var row = res.data;
        row.perms = {
          viewOrders: row.role === 'owner' || row.can_view_orders,
          confirmPayments: row.role === 'owner' || row.can_confirm_payments,
          managePromos: row.role === 'owner' || row.can_manage_promos,
          editCatalog: row.role === 'owner' || row.can_edit_catalog,
          manageStaff: row.role === 'owner' || row.can_manage_staff
        };
        return row;
      });
    });
  }

  /* ── dashboard ── */
  function stats() {
    return sb().from('admin_stats').select('*').single().then(unwrap);
  }

  /* ── orders ── */
  function orders(status, limit) {
    var q = sb().from('orders')
      .select('*, order_items(id, item_type, product_id, name, name_ar, original_price, price, contents)')
      .order('created_at', { ascending: false })
      .limit(limit || 200);
    if (status && status !== 'all') q = q.eq('status', status);
    return q.then(unwrap);
  }

  function setOrderStatus(id, status, note) {
    return sb().from('orders')
      .update({ status: status, status_note: note || null })
      .eq('id', id).select().single().then(unwrap);
  }

  /* ── promo codes ── */
  function promos() {
    return sb().from('promo_codes')
      .select('*, promo_code_products(product_type, product_id)')
      .order('created_at', { ascending: false })
      .then(unwrap);
  }

  function createPromo(row, products) {
    return sb().from('promo_codes').insert(row).select().single().then(unwrap).then(function (created) {
      if (!products || !products.length) return created;
      var rows = products.map(function (p) {
        return { promo_id: created.id, product_type: p.type, product_id: p.id };
      });
      return sb().from('promo_code_products').insert(rows).then(function () { return created; });
    });
  }

  function updatePromo(id, patch) {
    return sb().from('promo_codes').update(patch).eq('id', id).select().single().then(unwrap);
  }

  function deletePromo(id) {
    return sb().from('promo_codes').delete().eq('id', id).then(function (r) {
      if (r.error) return fail(r.error);
      return true;
    });
  }

  function setPromoProducts(id, products) {
    return sb().from('promo_code_products').delete().eq('promo_id', id).then(function () {
      if (!products || !products.length) return true;
      return sb().from('promo_code_products').insert(products.map(function (p) {
        return { promo_id: id, product_type: p.type, product_id: p.id };
      })).then(function (r) { return r.error ? fail(r.error) : true; });
    });
  }

  /* ── catalog ── */
  function courses() {
    return sb().from('courses').select('*').order('sort_order', { ascending: true }).then(unwrap);
  }

  function updateCourse(key, patch) {
    return sb().from('courses').update(patch).eq('key', key).select().single().then(unwrap);
  }

  function lecturers() {
    return sb().from('lecturers').select('*').order('name_en', { ascending: true }).then(unwrap);
  }

  function packages() {
    return sb().from('packages')
      .select('*, package_courses(course_id, allocation, sort_order), package_ref_items(ref_key, title, title_ar, price, allocation, sort_order)')
      .order('sort_order', { ascending: true })
      .then(unwrap);
  }

  function updatePackage(key, patch) {
    return sb().from('packages').update(patch).eq('key', key).select().single().then(unwrap);
  }

  function addPackageCourse(packageId, courseId) {
    return sb().from('package_courses')
      .insert({ package_id: packageId, course_id: courseId, sort_order: 999 })
      .then(function (r) { return r.error ? fail(r.error) : true; });
  }

  function removePackageCourse(packageId, courseId) {
    return sb().from('package_courses').delete()
      .eq('package_id', packageId).eq('course_id', courseId)
      .then(function (r) { return r.error ? fail(r.error) : true; });
  }

  window.HIPPO_ADMIN = {
    ready: ready,
    signIn: signIn, signOut: signOut, getSession: getSession, onAuthChange: onAuthChange, me: me,
    stats: stats,
    orders: orders, setOrderStatus: setOrderStatus,
    promos: promos, createPromo: createPromo, updatePromo: updatePromo,
    deletePromo: deletePromo, setPromoProducts: setPromoProducts,
    courses: courses, updateCourse: updateCourse, lecturers: lecturers,
    packages: packages, updatePackage: updatePackage,
    addPackageCourse: addPackageCourse, removePackageCourse: removePackageCourse
  };
})();
