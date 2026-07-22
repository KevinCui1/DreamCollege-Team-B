import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { isSupabaseConfigured } from "../lib/persistence/env";
import { getSupabaseClient } from "../lib/persistence/supabaseClient";

/**
 * Authentication seam. When Supabase is configured, this wraps its auth and
 * exposes the signed-in user; otherwise it hands out a stable anonymous local
 * id so the whole app remains usable without any backend (the brief's
 * development-safe fallback). Either way, `userId` is never empty, so the
 * profile store always has a key to isolate data by.
 */
type AuthValue = {
  mode: "supabase" | "local";
  loading: boolean;
  /** Effective id used to key persisted data (real user id or local anon id). */
  userId: string;
  /** True only with a real authenticated Supabase session. */
  isAuthenticated: boolean;
  email: string | null;
  signInWithEmail: (email: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthValue | null>(null);

const LOCAL_ID_KEY = "crew-b:local-user-id";

/** A persistent anonymous id so local-mode data survives reloads. */
function getLocalUserId(): string {
  try {
    let id = localStorage.getItem(LOCAL_ID_KEY);
    if (!id) {
      id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `local-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      localStorage.setItem(LOCAL_ID_KEY, id);
    }
    return id;
  } catch {
    return "local-anonymous";
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const mode: "supabase" | "local" = isSupabaseConfigured() ? "supabase" : "local";
  const localId = useMemo(getLocalUserId, []);

  const [loading, setLoading] = useState(mode === "supabase");
  const [userId, setUserId] = useState<string>(localId);
  const [email, setEmail] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (mode !== "supabase") return;
    const supabase = getSupabaseClient();
    if (!supabase) {
      setLoading(false);
      return;
    }

    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      const user = data.session?.user ?? null;
      setUserId(user?.id ?? localId);
      setEmail(user?.email ?? null);
      setIsAuthenticated(Boolean(user));
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;
      setUserId(user?.id ?? localId);
      setEmail(user?.email ?? null);
      setIsAuthenticated(Boolean(user));
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [mode, localId]);

  const signInWithEmail = useCallback(
    async (address: string): Promise<{ error?: string }> => {
      const supabase = getSupabaseClient();
      if (!supabase) return { error: "Sign-in isn't available in local mode." };
      const { error } = await supabase.auth.signInWithOtp({
        email: address,
        options: { emailRedirectTo: window.location.origin },
      });
      return error ? { error: error.message } : {};
    },
    [],
  );

  const signOut = useCallback(async () => {
    const supabase = getSupabaseClient();
    if (supabase) await supabase.auth.signOut();
    setUserId(localId);
    setEmail(null);
    setIsAuthenticated(false);
  }, [localId]);

  const value = useMemo<AuthValue>(
    () => ({ mode, loading, userId, isAuthenticated, email, signInWithEmail, signOut }),
    [mode, loading, userId, isAuthenticated, email, signInWithEmail, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
