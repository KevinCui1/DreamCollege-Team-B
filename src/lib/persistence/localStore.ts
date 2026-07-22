import type { ProfileBundle, ProfileStore } from "./types";

/**
 * Dev-safe fallback + offline write-through cache. Stores one bundle per user
 * id under a namespaced key so multiple local identities stay isolated, and so
 * this same class can mirror the Supabase store as a resilient cache.
 *
 * This is intentionally NOT the account-persistence solution on its own (it does
 * not survive devices); it's the development fallback and cache the brief allows.
 */
const bundleKey = (userId: string) => `crew-b:profile-bundle:${userId}`;

export class LocalProfileStore implements ProfileStore {
  readonly kind = "local" as const;

  async load(userId: string): Promise<ProfileBundle | null> {
    try {
      const raw = localStorage.getItem(bundleKey(userId));
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" ? (parsed as ProfileBundle) : null;
    } catch {
      return null;
    }
  }

  async save(userId: string, bundle: ProfileBundle): Promise<void> {
    try {
      localStorage.setItem(bundleKey(userId), JSON.stringify(bundle));
    } catch {
      // Private mode / quota — state stays in memory; not fatal for the cache.
    }
  }
}

export const localProfileStore = new LocalProfileStore();
