
(() => {
  "use strict";

  if (!window.supabase) {
    console.error("Supabase library did not load.");
    return;
  }

  if (
    !window.SUPABASE_URL ||
    !window.SUPABASE_PUBLISHABLE_KEY
  ) {
    console.error("Supabase configuration is missing.");
    return;
  }

  window.clientNestSupabase = window.supabase.createClient(
    window.SUPABASE_URL,
    window.SUPABASE_PUBLISHABLE_KEY
  );

  console.log("ClientNest Supabase client initialized.");
})();
