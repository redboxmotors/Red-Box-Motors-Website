-- ============================================================================
-- Red Box Motors — owner-authored listing content (2026-07-08)
-- Run in the Supabase SQL editor against the live project. Safe to re-run.
--
-- Ships together with app changes: listing detail template rework (owner-
-- written overview/highlights/documentation/condition/FAQ — no generated
-- copy), expanded specification fields, data-driven slug redirects, and the
-- 918 Spyder data fixes (model "Porsche Porsche" duplication + slug change).
--
-- IMPORTANT: the public site reads listings as the anon role with COLUMN-
-- LEVEL grants (VIN lockdown, 2026-07-02) — every new column must be granted
-- to anon explicitly or public pages selecting it will 42501.
-- ============================================================================

-- 1) Owner-authored content + expanded specification columns.
alter table public.listings add column if not exists overview        text;    -- multi-paragraph (blank-line separated)
alter table public.listings add column if not exists highlights      jsonb;   -- ordered array of strings
alter table public.listings add column if not exists chassis_no      text;
alter table public.listings add column if not exists title_status    text;    -- Clean / Rebuilt / ...
alter table public.listings add column if not exists body_style      text;
alter table public.listings add column if not exists drivetrain      text;
alter table public.listings add column if not exists powertrain      text;    -- e.g. Plug-in hybrid
alter table public.listings add column if not exists output_hp       integer;
alter table public.listings add column if not exists torque_lbft     integer;
alter table public.listings add column if not exists msrp            numeric(12,2);
alter table public.listings add column if not exists special_spec    text;    -- e.g. "CXX Special Wishes specification"
alter table public.listings add column if not exists documentation   jsonb;   -- ordered array of strings
alter table public.listings add column if not exists condition_notes jsonb;   -- ordered array of {label, value}
alter table public.listings add column if not exists listing_faq     jsonb;   -- ordered array of {q, a}; null = site defaults, [] = hide section

-- Anon grants for the new columns (see header note). VIN stays locked.
grant select (
  overview, highlights, chassis_no, title_status, body_style, drivetrain,
  powertrain, output_hp, torque_lbft, msrp, special_spec, documentation,
  condition_notes, listing_faq
) on public.listings to anon;

-- 2) Data-driven slug redirects — when a listing slug changes, the old URL
--    301s to the new one (the admin save action records these automatically).
create table if not exists public.slug_redirects (
  old_slug   text primary key,
  new_slug   text not null,
  created_at timestamptz not null default now()
);
alter table public.slug_redirects enable row level security;
drop policy if exists "slug_redirects_public_read" on public.slug_redirects;
create policy "slug_redirects_public_read" on public.slug_redirects
  for select using (true);
drop policy if exists "slug_redirects_admin_all" on public.slug_redirects;
create policy "slug_redirects_admin_all" on public.slug_redirects
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- 3) The 918 Spyder — owner-supplied data (2026-07-08 checklist).
--    NOTE mileage: the admin previously showed 885; the owner's checklist
--    says 887 — applying 887 per the checklist. Change in /admin if wrong.
update public.listings set
  model          = '918 Spyder',   -- was "918 Spyder | CXX" / earlier contained "Porsche" (double-make root cause)
  slug           = '2015-porsche-918-spyder-cxx',
  mileage        = 887,
  engine         = '4.6-liter naturally aspirated V8 with dual electric motors',
  transmission   = '7-speed PDK',
  vin            = 'WP0CA2A18FS800796',
  vin_public     = true,
  chassis_no     = '796',
  title_status   = 'Clean',
  body_style     = 'Spyder',
  drivetrain     = 'AWD',
  powertrain     = 'Plug-in hybrid',
  output_hp      = 887,
  torque_lbft    = 944,
  msrp           = 1025900,
  special_spec   = 'CXX Special Wishes specification',
  -- Owner-verified items only; everything unverified stays empty.
  documentation  = '["Original manuals","Original accessories","Porsche CXX documentation"]'::jsonb,
  -- Seeded with the one highlight stated in the owner brief; the full
  -- 16-item list is pasted by the owner in /admin (text was not provided).
  highlights     = '["Non-Weissach specification"]'::jsonb
where slug in ('2015-porsche-porsche-918-spyder-cxx', '2015-porsche-918-spyder-cxx');

insert into public.slug_redirects (old_slug, new_slug)
values ('2015-porsche-porsche-918-spyder-cxx', '2015-porsche-918-spyder-cxx')
on conflict (old_slug) do update set new_slug = excluded.new_slug;

-- 4) PostgREST schema reload.
notify pgrst, 'reload schema';
