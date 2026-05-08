-- ============================================================
-- SME Photos
-- ============================================================
create table if not exists sme_photos (
  id               uuid        primary key default gen_random_uuid(),
  sme_profile_id   uuid        not null references sme_profiles(id) on delete cascade,
  photo_url        text        not null,
  is_primary       boolean     not null default false,
  display_order    integer     not null default 0,
  created_at       timestamptz not null default now()
);

create index idx_sme_photos_sme_profile_id on sme_photos(sme_profile_id);

-- Enforce at most one primary photo per profile at the DB level
create unique index idx_sme_photos_one_primary
  on sme_photos(sme_profile_id)
  where is_primary = true;

alter table sme_photos enable row level security;

-- Anyone (anon + authenticated) can read photos
create policy "anyone can read sme photos"
  on sme_photos for select
  using (true);

-- sme_profiles.id IS the auth user id, so sme_profile_id = auth.uid() is the correct owner check
create policy "sme can insert own photos"
  on sme_photos for insert
  with check (sme_profile_id = auth.uid());

create policy "sme can update own photos"
  on sme_photos for update
  using  (sme_profile_id = auth.uid())
  with check (sme_profile_id = auth.uid());

create policy "sme can delete own photos"
  on sme_photos for delete
  using (sme_profile_id = auth.uid());


-- ============================================================
-- Storage policies for the new sme-photos/ path
-- (photos go into the existing 'avatars' bucket)
-- Path convention: sme-photos/{sme_profile_id}/{uuid}.{ext}
-- foldername() returns an array of path segments excluding the filename,
-- so foldername('sme-photos/abc/file.jpg') = ARRAY['sme-photos','abc']
-- ============================================================
create policy "owner can upload sme photo files"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = 'sme-photos'
    and (storage.foldername(name))[2] = auth.uid()::text
  );

create policy "owner can delete sme photo files"
  on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = 'sme-photos'
    and (storage.foldername(name))[2] = auth.uid()::text
  );
