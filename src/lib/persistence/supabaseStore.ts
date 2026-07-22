import type { ProfileBundle, ProfileStore } from "./types";
import { getSupabaseClient } from "./supabaseClient";
import { localProfileStore } from "./localStore";

/**
 * Account-linked store backed by a single `profiles` row per user (jsonb bundle
 * + a few typed hot columns; see supabase/migrations). Row-level security keyed
 * on `auth.uid()` guarantees a user can only read/write their own row.
 *
 * Every successful read/write also mirrors to the local store so the app stays
 * responsive offline and survives a transient network blip.
 */
export class SupabaseProfileStore implements ProfileStore {
  readonly kind = "supabase" as const;

  async load(userId: string): Promise<ProfileBundle | null> {
    const supabase = getSupabaseClient();
    if (!supabase) return localProfileStore.load(userId);

    const { data, error } = await supabase
      .from("profiles")
      .select("data")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) throw error;
    const bundle = (data?.data as ProfileBundle | undefined) ?? null;
    if (bundle) await localProfileStore.save(userId, bundle);
    return bundle;
  }

  async save(userId: string, bundle: ProfileBundle): Promise<void> {
    const supabase = getSupabaseClient();
    // Always mirror to local first so a failed network write isn't data loss.
    await localProfileStore.save(userId, bundle);
    if (!supabase) return;

    const { error } = await supabase.from("profiles").upsert(
      {
        user_id: userId,
        data: bundle,
        // Typed hot columns kept in sync for querying/reporting.
        grad_year: bundle.application.graduationYear || null,
        school_year: bundle.application.currentSchoolYear || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    );
    if (error) throw error;
  }
}

export const supabaseProfileStore = new SupabaseProfileStore();
