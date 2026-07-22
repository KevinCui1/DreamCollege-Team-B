/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Supabase project URL (public). Absent → local fallback store. */
  readonly VITE_SUPABASE_URL?: string;
  /** Supabase anon/publishable key (public; protected by RLS). */
  readonly VITE_SUPABASE_ANON_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
