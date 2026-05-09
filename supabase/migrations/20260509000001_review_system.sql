-- ============================================================
-- Review system: profile status workflow + app_admins
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. app_admins table
-- ────────────────────────────────────────────────────────────
create table if not exists app_admins (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id)
);

alter table app_admins enable row level security;

-- Security-definer helper so RLS policies can check admin status without
-- giving users direct read access to app_admins.
-- Runs with the function owner's permissions (postgres), not the caller's.
create or replace function is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (select 1 from app_admins where user_id = auth.uid())
$$;

-- Only admins can read this table directly (the function bypasses RLS internally)
create policy "admins can read app_admins"
  on app_admins for select
  using (is_admin());

-- ────────────────────────────────────────────────────────────
-- 2. Add review columns to sme_profiles
-- ────────────────────────────────────────────────────────────
alter table sme_profiles
  add column if not exists status text not null default 'draft'
    check (status in ('draft', 'pending_review', 'published', 'rejected', 'unpublished')),
  add column if not exists submitted_at     timestamptz,
  add column if not exists reviewed_at      timestamptz,
  add column if not exists rejection_reason text,
  add column if not exists reviewed_by      uuid references auth.users(id);

-- Backfill existing rows from is_published
update sme_profiles set status = 'published' where is_published = true;
-- is_published = false rows keep the default status = 'draft'

create index if not exists idx_sme_profiles_status       on sme_profiles(status);
create index if not exists idx_sme_profiles_submitted_at on sme_profiles(submitted_at);

-- ────────────────────────────────────────────────────────────
-- 3. Replace RLS policies on sme_profiles
-- ────────────────────────────────────────────────────────────
drop policy if exists "sme can manage own profile"        on sme_profiles;
drop policy if exists "anyone can read published profiles" on sme_profiles;

-- Public: only published profiles visible to everyone
create policy "public can read published profiles"
  on sme_profiles for select
  using (status = 'published');

-- Owner: always read own profile regardless of status
create policy "sme can read own profile"
  on sme_profiles for select
  using (auth.uid() = id);

-- Owner: create own profile row (onboarding)
create policy "sme can insert own profile"
  on sme_profiles for insert
  with check (auth.uid() = id);

-- Owner: update only when in an editable state.
-- 'unpublished' is included so SMEs can edit and resubmit after admin takes
-- a profile down — without it they would have no path back to published.
-- with check prevents self-approval (cannot set status = 'published').
create policy "sme can update own profile when editable"
  on sme_profiles for update
  using  (auth.uid() = id and status in ('draft', 'rejected', 'unpublished'))
  with check (auth.uid() = id and status in ('draft', 'rejected', 'unpublished', 'pending_review'));

-- Admin: read all profiles regardless of status
create policy "admin can read all profiles"
  on sme_profiles for select
  using (is_admin());

-- Admin: update any profile (status transitions, rejection reasons, etc.)
create policy "admin can update any profile"
  on sme_profiles for update
  using  (is_admin())
  with check (is_admin());
