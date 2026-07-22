-- Dream College — account-linked profile schema.
-- Apply with the Supabase CLI (`supabase db push`) or paste into the SQL editor.
-- Every table is protected by row-level security so a signed-in student can only
-- read and write their own data (auth.uid() = user_id).

-- ── profiles ────────────────────────────────────────────────────────────────
-- One row per user. `data` holds the full typed ProfileBundle (application
-- profile + quiz answers + legacy signal). A few hot columns are denormalized
-- for querying/reporting; the client keeps them in sync on save.
create table if not exists public.profiles (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  data        jsonb       not null default '{}'::jsonb,
  grad_year   text,
  school_year text,
  updated_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles are self-readable" on public.profiles;
create policy "profiles are self-readable"
  on public.profiles for select
  using (auth.uid() = user_id);

drop policy if exists "profiles are self-insertable" on public.profiles;
create policy "profiles are self-insertable"
  on public.profiles for insert
  with check (auth.uid() = user_id);

drop policy if exists "profiles are self-updatable" on public.profiles;
create policy "profiles are self-updatable"
  on public.profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── profile_extra_fields ─────────────────────────────────────────────────────
-- Controlled registry of additional reusable fields (see src/profile/schema.ts
-- EXTRA_FIELDS). Kept as a keyed table so new reusable fields can be added
-- without scattering tool-local state. Optional: the client also stores these
-- inside `profiles.data`; this table exists for reporting / future querying.
create table if not exists public.profile_extra_fields (
  user_id    uuid        not null references auth.users (id) on delete cascade,
  field_id   text        not null,
  value      jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, field_id)
);

alter table public.profile_extra_fields enable row level security;

drop policy if exists "extra fields are self-managed" on public.profile_extra_fields;
create policy "extra fields are self-managed"
  on public.profile_extra_fields for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── auto-provision a profile row on signup ───────────────────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (user_id) values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
