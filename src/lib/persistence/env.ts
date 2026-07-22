/**
 * Reads the public Supabase client config from Vite env. Only the anon
 * (publishable) key belongs in client code — row-level security, not secrecy,
 * is what protects each user's data. No service-role key is ever referenced
 * here. When these are absent the app runs fully on the local fallback store.
 */
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as
  | string
  | undefined;

export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}
