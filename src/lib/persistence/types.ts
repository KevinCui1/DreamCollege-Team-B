import type {
  ApplicationProfile,
  QuizAnswers,
  StudentProfile,
} from "../../context/StudentProfileContext";

/**
 * A snapshot of student-entered inputs (College Profile + quiz), saved right
 * before "Reset progress" clears the live profile so it can be brought back
 * with "Restore Inputs". Deliberately excludes completion/rank/achievement
 * progress — those are not "inputs" and reset independently.
 */
export type InputSnapshot = {
  application: ApplicationProfile;
  quiz: QuizAnswers | null;
  savedAt: string;
};

/**
 * The full set of account-linked student data persisted as one unit. The three
 * slices mirror the context's state so the store can be swapped (Supabase vs
 * local) without the rest of the app knowing which backend is live.
 */
export type ProfileBundle = {
  application: ApplicationProfile;
  quiz: QuizAnswers | null;
  legacy: StudentProfile;
  /** Most recent pre-reset snapshot, if any; restorable via "Restore Inputs". */
  backup?: InputSnapshot | null;
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
