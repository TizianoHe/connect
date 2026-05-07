-- ============================================================
-- Contact Submissions
-- ============================================================
create table if not exists contact_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  user_type text,
  subject text not null,
  message text not null,
  status text not null default 'new'
);

alter table contact_submissions enable row level security;

-- Anyone (including unauthenticated visitors) can submit a contact form
create policy "anyone can insert contact submissions"
  on contact_submissions for insert
  with check (true);

-- Only the table owner (service role) can read submissions — refine with admin role later
create policy "service role can read contact submissions"
  on contact_submissions for select
  using (auth.role() = 'service_role');
