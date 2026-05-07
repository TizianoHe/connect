-- Add positioning and team fields to SME profiles
-- All columns are nullable so existing profiles are unaffected

alter table sme_profiles
  add column if not exists positioning_line text
    check (char_length(positioning_line) <= 200),
  add column if not exists best_suited_for text
    check (char_length(best_suited_for) <= 500),
  add column if not exists how_they_work text
    check (char_length(how_they_work) <= 500),
  add column if not exists clients_appreciate text
    check (char_length(clients_appreciate) <= 500),
  add column if not exists team_size text
    check (team_size in ('solo', '2-5', '6-20', '21-50', '50+'));
