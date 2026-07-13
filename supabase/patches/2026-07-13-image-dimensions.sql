-- 2026-07-13 — store pixel dimensions on images so the site can tell
-- vertical (portrait) photos from 16:9 landscape ones (owner request:
-- project photos may be uploaded vertical).
--
-- Idempotent — safe to run more than once in the Supabase SQL editor.
-- Existing rows keep null width/height and continue to render exactly as
-- before (treated as landscape); only new uploads carry dimensions.

alter table public.images add column if not exists width  integer;
alter table public.images add column if not exists height integer;

comment on column public.images.width  is 'Pixel width of the stored rendition (null on pre-2026-07-13 uploads).';
comment on column public.images.height is 'Pixel height of the stored rendition (null on pre-2026-07-13 uploads).';
