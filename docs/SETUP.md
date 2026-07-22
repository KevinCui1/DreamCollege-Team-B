# Account-Linked Persistence — Setup

Dream College stores each student's profile in an account-linked, database-backed
store. It ships with a **dev-safe local fallback**, so the app runs with zero
configuration; wiring Supabase makes profiles survive devices and sessions with
per-user isolation.

## How it decides which store to use

`src/lib/persistence/index.ts` → `getProfileStore()`:

- **Supabase** when both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set.
- **Local fallback** otherwise — a namespaced `localStorage` bundle per (anonymous)
  user. This is a cache/dev store, **not** the account solution; it does not sync
  across devices.

When Supabase is live, `localStorage` is demoted to a resilient write-through
cache so the UI stays responsive offline.

## Enabling Supabase

1. **Create a project** at <https://supabase.com>. Note the Project URL and the
   **anon / publishable** key (Project Settings → API). The service-role key is
   never used in the client.

2. **Apply the schema.** Either:
   - Supabase CLI: `supabase link --project-ref <ref>` then `supabase db push`
     (reads `supabase/migrations/0001_init.sql`), **or**
   - Dashboard → SQL Editor → paste `supabase/migrations/0001_init.sql` → Run.

   This creates `profiles` and `profile_extra_fields`, enables **row-level
   security** (`auth.uid() = user_id` on every policy), and adds a trigger that
   provisions a profile row on signup.

3. **Configure auth.** Dashboard → Authentication → Providers. Email (magic link)
   works out of the box; add OAuth providers if desired. Set your site URL under
   Authentication → URL Configuration so magic-link redirects resolve.

4. **Set client env.** Copy `.env.example` to `.env.local` and fill in:

   ```
   VITE_SUPABASE_URL=https://<ref>.supabase.co
   VITE_SUPABASE_ANON_KEY=<anon-key>
   ```

   Restart `npm run dev`. Only `VITE_`-prefixed vars reach the client bundle; the
   anon key is safe to expose because RLS — not secrecy — enforces access.

## Verifying isolation

- Sign in as user A, save some profile fields, sign out, sign in as user B → B
  sees an empty profile.
- In the SQL editor, `select * from profiles;` shows one row per user; RLS blocks
  a client from reading another user's row.

## Security notes

- No secrets in client code — only the public URL + anon key.
- All access is gated by RLS policies in the migration.
- The Gemini key remains server-only (dev/preview middleware); unrelated to this.
