import type { ProfileStore } from "./types";
import { isSupabaseConfigured } from "./env";
import { supabaseProfileStore } from "./supabaseStore";
import { localProfileStore } from "./localStore";

export type { ProfileBundle, ProfileStore } from "./types";
export { isSupabaseConfigured } from "./env";

/**
 * The active persistence backend: Supabase when configured, otherwise the local
 * fallback. Both satisfy the same interface, so the provider is agnostic.
 */
export function getProfileStore(): ProfileStore {
  return isSupabaseConfigured() ? supabaseProfileStore : localProfileStore;
}
