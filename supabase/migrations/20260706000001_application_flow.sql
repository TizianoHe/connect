-- ============================================================
-- Application flow: new SME profile fields + 'approved' status
-- ============================================================

-- 1. New columns on sme_profiles (all nullable, existing rows unaffected)
ALTER TABLE sme_profiles
  ADD COLUMN IF NOT EXISTS location_type         text       CHECK (location_type IN ('physical', 'service_area')),
  ADD COLUMN IF NOT EXISTS service_area          text       CHECK (char_length(service_area) <= 200),
  ADD COLUMN IF NOT EXISTS booking_url           text,
  ADD COLUMN IF NOT EXISTS uid_number            text       CHECK (char_length(uid_number) <= 20),
  ADD COLUMN IF NOT EXISTS languages             text[]     DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS wheelchair_accessible boolean,
  ADD COLUMN IF NOT EXISTS opening_hours         jsonb,
  ADD COLUMN IF NOT EXISTS category_ids          uuid[]     DEFAULT '{}';

-- 2. Backfill category_ids from existing sme_services so old profiles
--    are not broken by the new Tier-1 "at least 1 category" requirement.
UPDATE sme_profiles sp
SET    category_ids = ARRAY(
         SELECT DISTINCT ss.category_id
         FROM   sme_services ss
         WHERE  ss.sme_id = sp.id
       )
WHERE  EXISTS (
         SELECT 1 FROM sme_services ss WHERE ss.sme_id = sp.id
       );

-- 3. Add 'approved' to the status check constraint.
--    PostgreSQL auto-names inline checks as <table>_<column>_check.
--    If the name differs in your instance, find it with:
--      SELECT conname FROM pg_constraint WHERE conrelid = 'sme_profiles'::regclass AND contype = 'c';
ALTER TABLE sme_profiles
  DROP CONSTRAINT IF EXISTS sme_profiles_status_check;

ALTER TABLE sme_profiles
  ADD CONSTRAINT sme_profiles_status_check
  CHECK (status IN ('draft', 'pending_review', 'approved', 'published', 'rejected', 'unpublished'));

-- 4. Update RLS policies so that:
--    a) 'approved' SMEs can update their profile (e.g. add photos)
--    b) 'approved' SMEs can set status = 'published' once they have 3+ photos
--       (client-side enforces the photo count; RLS permits the write)
--    Separate the two cases into two policies so 'draft' users cannot
--    accidentally self-publish.
DROP POLICY IF EXISTS "sme can update own profile when editable" ON sme_profiles;

-- Draft / rejected / unpublished: can edit content and submit for review
CREATE POLICY "sme can update own profile in draft"
  ON sme_profiles FOR UPDATE
  USING  (auth.uid() = id AND status IN ('draft', 'rejected', 'unpublished'))
  WITH CHECK (auth.uid() = id AND status IN ('draft', 'rejected', 'unpublished', 'pending_review'));

-- Approved: can edit content and go live (set status = 'published')
CREATE POLICY "sme can publish own approved profile"
  ON sme_profiles FOR UPDATE
  USING  (auth.uid() = id AND status = 'approved')
  WITH CHECK (auth.uid() = id AND status IN ('approved', 'published'));
