-- ============================================================
-- Service Categories (static lookup)
-- ============================================================
create table if not exists service_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  icon_name text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table service_categories enable row level security;

create policy "anyone can read categories"
  on service_categories for select
  using (true);


-- ============================================================
-- SME Profiles
-- ============================================================
create table if not exists sme_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  business_name text not null,
  tagline text check (char_length(tagline) <= 120),
  description text check (char_length(description) <= 1000),
  website_url text,
  phone text,
  email_public text,
  location_city text,
  location_country text not null default 'CH',
  avatar_url text,
  onboarding_step integer not null default 1,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_sme_profiles_is_published on sme_profiles(is_published);
create index idx_sme_profiles_location_city on sme_profiles(location_city);

alter table sme_profiles enable row level security;

-- Owner can always read/write their own row
create policy "sme can manage own profile"
  on sme_profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Anyone (incl. anon) can read published profiles
create policy "anyone can read published profiles"
  on sme_profiles for select
  using (is_published = true);


-- ============================================================
-- SME Services
-- ============================================================
create table if not exists sme_services (
  id uuid primary key default gen_random_uuid(),
  sme_id uuid not null references sme_profiles(id) on delete cascade,
  category_id uuid not null references service_categories(id),
  title text not null,
  description text,
  price_from numeric(10, 2),
  price_currency text not null default 'CHF',
  created_at timestamptz not null default now()
);

create index idx_sme_services_sme_id on sme_services(sme_id);
create index idx_sme_services_category_id on sme_services(category_id);

alter table sme_services enable row level security;

-- Anyone can read services (used in browse view)
create policy "anyone can read sme services"
  on sme_services for select
  using (true);

-- Owner can manage their own services
create policy "sme can manage own services"
  on sme_services for all
  using (
    exists (
      select 1 from sme_profiles
      where sme_profiles.id = sme_services.sme_id
        and sme_profiles.id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from sme_profiles
      where sme_profiles.id = sme_services.sme_id
        and sme_profiles.id = auth.uid()
    )
  );


-- ============================================================
-- updated_at trigger
-- ============================================================
create or replace function handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger on_sme_profiles_updated
  before update on sme_profiles
  for each row execute function handle_updated_at();


-- ============================================================
-- Storage bucket (run after enabling Storage extension)
-- ============================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

create policy "owner can upload avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "owner can update avatar"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "owner can delete avatar"
  on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "anyone can view avatars"
  on storage.objects for select
  using (bucket_id = 'avatars');
