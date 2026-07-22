import type {
  ApplicationProfile,
  QuizAnswers,
  StudentProfile,
} from "../../context/StudentProfileContext";

/**
 * The full set of account-linked student data persisted as one unit. The three
 * slices mirror the context's state so the store can be swapped (Supabase vs
 * local) without the rest of the app knowing which backend is live.
 */
export type ProfileBundle = {
  application: ApplicationProfile;
  quiz: QuizAnswers | null;
  legacy: StudentProfile;
};

/**
 * Account-linked persistence seam. Implementations do IO only and throw on
 * failure; the provider owns debouncing, save-state, and the local cache mirror.
 */
export interface ProfileStore {
  /** Which backend is active — surfaced in setup/debug UI. */
  readonly kind: "supabase" | "local";
  /** Load a user's bundle, or null if they have no stored row yet. */
  load(userId: string): Promise<ProfileBundle | null>;
  /** Persist the full bundle for a user (isolated per authenticated user). */
  save(userId: string, bundle: ProfileBundle): Promise<void>;
}
