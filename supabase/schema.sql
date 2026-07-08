-- ============================================================================
-- Red Box Motors — Supabase schema (production rebuild)
-- Per handoff/admin-cms-build.md §1–§2 and handoff/admin-and-photos.md §3.
--
-- DESTRUCTIVE: drops the pre-rebuild tables (listings/listing_photos/
-- inquiries — June-18 iteration, fake Unsplash seed only) and recreates the
-- full entity set. Run in the Supabase SQL editor or `supabase db push`,
-- then run seed.sql.
-- ============================================================================

create extension if not exists "pgcrypto";

-- Drop the pre-rebuild schema ------------------------------------------------
drop table if exists public.listing_photos cascade;
drop table if exists public.inquiries cascade;
drop table if exists public.listings cascade;
drop type if exists listing_status cascade;
drop type if exists inquiry_division cascade;

-- Enums -----------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'listing_status') then
    create type listing_status as enum ('for_sale', 'coming_soon', 'sold');
  end if;
  if not exists (select 1 from pg_type where typname = 'content_type') then
    create type content_type as enum ('listing', 'project', 'sourced');
  end if;
  if not exists (select 1 from pg_type where typname = 'placement_surface') then
    create type placement_surface as enum (
      'home_featured',
      'feature_bar',
      'dealer_forsale_preview',
      'dealer_sold_preview',
      'dealer_sourced_preview',
      'cosmetics_builds_preview'
    );
  end if;
  if not exists (select 1 from pg_type where typname = 'lead_type') then
    create type lead_type as enum ('contact', 'listing', 'consignment', 'first_look', 'estimate');
  end if;
  if not exists (select 1 from pg_type where typname = 'lead_status') then
    create type lead_status as enum ('new', 'handled');
  end if;
end$$;

-- updated_at helper ------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end$$;

-- ============================================================================
-- listings — Dealer inventory (one row for a car's whole life:
-- coming_soon → for_sale → sold)
-- ============================================================================
create table public.listings (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  year          integer,            -- nullable: coming_soon cars may not have one yet
  make          text not null,
  model         text not null,
  -- numeric source of truth; format for display server-side (never sort the
  -- formatted strings — admin-cms-build.md §1)
  price         numeric(12,2),
  mileage       integer,
  exterior      text,
  interior      text,
  engine        text,
  transmission  text,
  -- full VIN server-side only; vin_public decides public rendering
  vin           text,
  vin_public    boolean not null default false,
  status        listing_status not null default 'for_sale',
  eta           text,               -- only for coming_soon ("July", "In transit")
  -- sold-display fields (data/sold.js: spec line, who it went to, how it sold)
  spec          text,
  placed_with   text,
  sale_detail   text,
  published     boolean not null default false,
  featured      boolean not null default false,
  sort_order    integer not null default 0,
  deleted_at    timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index listings_status_idx on public.listings (status, published, sort_order);
create index listings_make_idx on public.listings (make);
create trigger listings_updated_at before update on public.listings
  for each row execute function public.set_updated_at();

-- ============================================================================
-- projects — Cosmetics recent work
-- ============================================================================
create table public.projects (
  id         uuid primary key default gen_random_uuid(),
  slug       text unique not null,
  title      text not null,
  vehicle    text not null,
  make       text,
  category   text not null,       -- primary service (display)
  services   text[] not null default '{}',
  finish     text,
  duration   text,
  year       integer,
  coverage   text,
  location   text default 'Austin, TX',
  summary    text,
  scope      text[] not null default '{}',
  published  boolean not null default false,
  featured   boolean not null default false,
  sort_order integer not null default 0,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index projects_pub_idx on public.projects (published, sort_order);
create trigger projects_updated_at before update on public.projects
  for each row execute function public.set_updated_at();

-- ============================================================================
-- sourced — Cars we found for clients (not for sale; no detail pages)
-- ============================================================================
create table public.sourced (
  id             uuid primary key default gen_random_uuid(),
  year           integer not null,
  make           text not null,
  model          text not null,
  spec           text,             -- short trim/detail line
  client         text,             -- who it was found for (anonymized)
  sourced_detail text,             -- where/how it was sourced
  published      boolean not null default false,
  featured       boolean not null default false,
  sort_order     integer not null default 0,
  deleted_at     timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index sourced_pub_idx on public.sourced (published, sort_order);
create trigger sourced_updated_at before update on public.sourced
  for each row execute function public.set_updated_at();

-- ============================================================================
-- images — generalized photo relation (admin-and-photos.md §3)
-- ============================================================================
create table public.images (
  id          uuid primary key default gen_random_uuid(),
  parent_type content_type not null,
  parent_id   uuid not null,
  url         text not null,          -- storage URL (full-size)
  thumb_url   text,                   -- generated derivative
  alt         text not null default '',
  focal_x     real not null default 0.5 check (focal_x between 0 and 1),
  focal_y     real not null default 0.5 check (focal_y between 0 and 1),
  sort_order  integer not null default 0,
  is_hero     boolean not null default false,
  created_at  timestamptz not null default now()
);

create index images_parent_idx on public.images (parent_type, parent_id, sort_order);
-- exactly one hero per parent
create unique index images_one_hero_idx on public.images (parent_type, parent_id)
  where is_hero;

-- ============================================================================
-- placements — curated slots (admin-cms-build.md §2b)
-- ============================================================================
create table public.placements (
  id         uuid primary key default gen_random_uuid(),
  surface    placement_surface not null,
  item_type  content_type not null,
  item_id    uuid not null,
  sort_order integer not null default 0,
  enabled    boolean not null default true,
  created_at timestamptz not null default now(),
  unique (surface, item_type, item_id)
);

create index placements_surface_idx on public.placements (surface, sort_order);

-- ============================================================================
-- settings — single row, the site's source of truth for contact info
-- ============================================================================
create table public.settings (
  id            integer primary key default 1 check (id = 1),
  phone         text,
  email         text,
  address_line  text,
  hours_json    jsonb not null default '{}'::jsonb,
  map_embed_url text,
  updated_at    timestamptz not null default now()
);

create trigger settings_updated_at before update on public.settings
  for each row execute function public.set_updated_at();

-- ============================================================================
-- leads — contact + listing inquiries (forms.md, owner chose email + DB)
-- ============================================================================
create table public.leads (
  id           uuid primary key default gen_random_uuid(),
  type         lead_type not null default 'contact',
  name         text not null,
  email        text not null,
  phone        text,
  interest     text,               -- Cosmetics | Buying / Selling | Collection
  message      text,
  listing_slug text,               -- attribution for listing inquiries
  listing_title text,
  source_page  text,
  contact_method text,             -- Phone / Text / Email (2026-07-07 forms)
  city_state   text,
  payload      jsonb,              -- form-specific structured fields (consignment,
                                   -- inquiry, first_look — see patches/2026-07-07)
  submission_key text,             -- client-generated idempotency key
  status       lead_status not null default 'new',
  created_at   timestamptz not null default now()
);

create index leads_status_idx on public.leads (status, created_at desc);
create unique index leads_submission_key_idx
  on public.leads (submission_key) where submission_key is not null;

-- ============================================================================
-- Admin allowlist — being "authenticated" is not enough to write. Supabase
-- signups must ALSO be disabled in the dashboard (Authentication → Sign In /
-- Providers → "Allow new users to sign up" OFF); this is defense in depth.
-- ============================================================================
create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;
create policy "admins_self_read" on public.admins for select
  to authenticated using (user_id = auth.uid());

-- Seed: every existing auth user becomes an admin (run after creating the
-- owner's account).
insert into public.admins (user_id)
select id from auth.users
on conflict do nothing;

create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table public.listings   enable row level security;
alter table public.projects   enable row level security;
alter table public.sourced    enable row level security;
alter table public.images     enable row level security;
alter table public.placements enable row level security;
alter table public.settings   enable row level security;
alter table public.leads      enable row level security;

-- Content: anon sees only published + not deleted; allowlisted admins write
create policy "listings_public_read" on public.listings for select
  using (published and deleted_at is null);
create policy "listings_admin_all" on public.listings for all
  to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "projects_public_read" on public.projects for select
  using (published and deleted_at is null);
create policy "projects_admin_all" on public.projects for all
  to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "sourced_public_read" on public.sourced for select
  using (published and deleted_at is null);
create policy "sourced_admin_all" on public.sourced for all
  to authenticated using (public.is_admin()) with check (public.is_admin());

-- Images: public read only when the parent is published & live (no photo-URL
-- enumeration of draft cars). Admin access comes from images_admin_all.
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
create policy "images_admin_all" on public.images for all
  to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "placements_public_read" on public.placements for select
  using (enabled);
create policy "placements_admin_all" on public.placements for all
  to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "settings_public_read" on public.settings for select using (true);
create policy "settings_admin_all" on public.settings for all
  to authenticated using (public.is_admin()) with check (public.is_admin());

-- Leads: NO public insert policy — the API route inserts with the service
-- role (bypasses RLS) behind validation / rate limit / Turnstile. An anon
-- insert policy would let anyone with the public anon key spam the table
-- directly via PostgREST. Only admins read/update.
create policy "leads_admin_read" on public.leads for select
  to authenticated using (public.is_admin());
create policy "leads_admin_update" on public.leads for update
  to authenticated using (public.is_admin()) with check (public.is_admin());

-- VIN: RLS is row-level only, so the vin column is locked with column-level
-- privileges — anon gets every listings column EXCEPT vin. Public pages read
-- an explicit column list (src/lib/public/content.ts); the detail page fetches
-- the VIN server-side (service role) only when vin_public.
-- NOTE: a future `alter table public.listings add column ...` must also
-- `grant select (new_col) on public.listings to anon`.
revoke select on public.listings from anon;
grant select (
  id, slug, year, make, model, price, mileage, exterior, interior, engine,
  transmission, vin_public, status, eta, spec, placed_with, sale_detail,
  published, featured, sort_order, deleted_at, created_at, updated_at
) on public.listings to anon;

-- ============================================================================
-- Storage — one bucket for all content photos (listings/projects/sourced)
-- ============================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'photos', 'photos', true,
  10485760, -- 10 MB per file
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update
  set file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "photos_storage_public_read" on storage.objects;
create policy "photos_storage_public_read"
  on storage.objects for select
  using (bucket_id = 'photos');

drop policy if exists "photos_storage_auth_write" on storage.objects;
create policy "photos_storage_auth_write"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'photos' and public.is_admin())
  with check (bucket_id = 'photos' and public.is_admin());

-- Private lead-uploads bucket (2026-07-07 consignment forms). NOT public and
-- deliberately NO storage.objects policies: with RLS on and zero policies,
-- anon/authenticated can neither read, list, nor write. Uploads happen via
-- short-lived signed upload URLs issued by /api/consignments behind its
-- gates; admin reads via signed download URLs from an admin-only server
-- action. The bucket itself enforces mime types + 10 MB size server-side.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'lead-uploads', 'lead-uploads', false,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif',
        'image/heic', 'image/heif', 'application/pdf']
)
on conflict (id) do update
  set public = false,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Retire the pre-rebuild bucket policies (bucket may stay; harmless if empty)
drop policy if exists "listing_photos_storage_public_read" on storage.objects;
drop policy if exists "listing_photos_storage_auth_write" on storage.objects;

-- ============================================================================
-- Email notification on new lead: sent by the Next.js API route
-- (src/app/api/leads/route.ts, RESEND_API_KEY env) AFTER its validation /
-- rate-limit / Turnstile gates. The earlier pg_net → edge-function pipeline
-- was removed (2026-07-02 security audit): the function had to be deployed
-- with --no-verify-jwt, making it a publicly invokable email sender.
-- ============================================================================
drop trigger if exists on_new_lead on public.leads;
drop function if exists public.handle_new_lead();
