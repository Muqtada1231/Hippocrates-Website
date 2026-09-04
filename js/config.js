/* Hippocrates — backend connection settings.
   Only publishable values belong in this file. It ships to the browser.
   The secret key (sb_secret_…) must NEVER appear here — Supabase injects it
   into the Edge Functions by itself, so the site never needs it. */
window.HIPPO_CONFIG = {
  supabaseUrl: 'https://klfdhfjyueihnzazdqnp.supabase.co',
  supabaseAnonKey: 'sb_publishable_Pbyy42-uvXDdRV3MTtyOgg_zgOISgqh',

  // Set false to run the site entirely on the built-in catalog in hippo-store.js
  // (useful offline, or if the database is ever unreachable).
  useDatabase: true
};
