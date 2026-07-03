-- ============================================================================
-- Red Box Motors — security hardening patch (2026-07-02 audit)
-- Run in the Supabase SQL editor against the live project. Safe to re-run.
--
-- Ships together with app changes: requireUser() admin-allowlist check,
-- lead email moved from the pg_net trigger into the API route, explicit
-- public listing columns (no `vin`), security headers.
--
-- ALSO REQUIRED (dashboard, not SQL): Authentication → Sign In / Providers →
-- turn OFF "Allow new users to sign up". Until then, anyone can self-register.
-- ============================================================================

-- 1) Admin allowlist — being "authenticated" no longer means "admin".
create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;
drop policy if exists "admins_self_read" on public.admins;
create policy "admins_self_read" on public.admins for select
  to authenticated using (user_id = auth.uid());

-- Seed: every existing auth user becomes an admin (currently just the owner).
insert into public.admins (user_id)
select id from auth.users
on conflict do nothing;

create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- 2) Content/settings/placements writes: allowlisted admins only.
drop policy if exists "listings_auth_all" on public.listings;
create policy "listings_admin_all" on public.listings for all
  to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "projects_auth_all" on public.projects;
create policy "projects_admin_all" on public.projects for all
  to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "sourced_auth_all" on public.sourced;
create policy "sourced_admin_all" on public.sourced for all
  to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "images_auth_all" on public.images;
create policy "images_admin_all" on public.images for all
  to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "placements_auth_all" on public.placements;
create policy "placements_admin_all" on public.placements for all
  to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "settings_auth_all" on public.settings;
create policy "settings_admin_all" on public.settings for all
  to authenticated using (public.is_admin()) with check (public.is_admin());

-- 3) Leads: close the anon insert hole. The API route inserts with the
-- service role (which bypasses RLS), so nothing legitimate uses this policy —
-- but it let anyone with the public anon key insert unlimited rows directly
-- via PostgREST, skipping the route's rate limit / honeypot / Turnstile.
drop policy if exists "leads_public_insert" on public.leads;

drop policy if exists "leads_auth_read" on public.leads;
create policy "leads_admin_read" on public.leads for select
  to authenticated using (public.is_admin());

drop policy if exists "leads_auth_update" on public.leads;
create policy "leads_admin_update" on public.leads for update
  to authenticated using (public.is_admin()) with check (public.is_admin());

-- 4) Images: public read only for images whose parent is published & live
-- (was: all images readable, which enumerated photo URLs of draft cars).
-- Admin access comes from images_admin_all above; policies OR together.
drop policy if exists "images_public_read" on public.images;
create policy "images_public_read" on public.images for select using (
  (parent_type = 'listing' and exists (
    select 1 from public.listings l
    where l.id = parent_id and l.published and l.deleted_at is null))
  or (parent_type = 'project' and exists (
    select 1 from public.projects p
    where p.id = parent_id and p.published and p.deleted_at is null))
  or (parent_type = 'sourced' and exists (
    select 1 from public.sourced s
    where s.id = parent_id and s.published and s.deleted_at is null))
);

-- 5) VIN column: not readable by the anon role at all. RLS is row-level only,
-- so until now anon could read the full VIN of any published listing straight
-- from PostgREST even with vin_public = false. Column-level privileges fix
-- that: revoke table-wide select, grant back every column except `vin`.
-- NOTE: future `alter table public.listings add column ...` must also
-- `grant select (new_col) on public.listings to anon` or public pages
-- selecting it will 42501.
revoke select on public.listings from anon;
grant select (
  id, slug, year, make, model, price, mileage, exterior, interior, engine,
  transmission, vin_public, status, eta, spec, placed_with, sale_detail,
  published, featured, sort_order, deleted_at, created_at, updated_at
) on public.listings to anon;

-- 6) Lead email: the pg_net trigger POSTed to an edge function that had to be
-- deployed with --no-verify-jwt (publicly invokable → arbitrary email sending
-- through the Resend account). Notification now sent by the Next.js API route
-- after its validation/rate-limit/Turnstile gates. Drop the DB-side pipeline.
drop trigger if exists on_new_lead on public.leads;
drop function if exists public.handle_new_lead();

-- 7) Storage writes: admins only (was any authenticated user).
drop policy if exists "photos_storage_auth_write" on storage.objects;
create policy "photos_storage_auth_write"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'photos' and public.is_admin())
  with check (bucket_id = 'photos' and public.is_admin());
