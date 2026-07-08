'use server';

import { requireUser } from '@/lib/auth';
import { revalidatePublic } from '@/lib/admin/revalidate';
import { parseNumeric, slugify } from '@/lib/admin/slug';
import type { ConditionNote, ListingFaqItem, ListingStatus } from '@/lib/db/types';

export type ListingInput = {
  slug: string;
  year: string | number | null;
  make: string;
  model: string;
  price: string | number | null;
  mileage: string | number | null;
  exterior: string | null;
  interior: string | null;
  engine: string | null;
  transmission: string | null;
  vin: string | null;
  vin_public: boolean;
  status: ListingStatus;
  eta: string | null;
  spec: string | null;
  placed_with: string | null;
  sale_detail: string | null;
  published: boolean;
  featured: boolean;
  // 2026-07-08 owner-authored content (requires the 2026-07-08 SQL patch)
  overview: string | null;
  highlights: string[];
  chassis_no: string | null;
  title_status: string | null;
  body_style: string | null;
  drivetrain: string | null;
  powertrain: string | null;
  output_hp: string | number | null;
  torque_lbft: string | number | null;
  msrp: string | number | null;
  special_spec: string | null;
  documentation: string[];
  condition_notes: ConditionNote[];
  // null = site default questions; [] = section hidden
  listing_faq: ListingFaqItem[] | null;
};

export type SaveResult =
  | { ok: true; id: string }
  | { ok: false; errors: Record<string, string> };

function validate(input: ListingInput): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!input.make?.trim()) errors.make = 'Make is required.';
  if (!input.model?.trim()) errors.model = 'Model is required.';
  if (!input.slug?.trim()) errors.slug = 'Slug is required.';
  else if (slugify(input.slug) !== input.slug) errors.slug = 'Lowercase letters, numbers and dashes only.';
  if (input.status === 'coming_soon' && input.year == null && !input.eta?.trim()) {
    errors.eta = 'Give coming-soon cars an ETA (e.g. "July", "In transit").';
  }
  return errors;
}

function toRow(input: ListingInput) {
  return {
    slug: input.slug.trim(),
    year: parseNumeric(input.year),
    make: input.make.trim(),
    model: input.model.trim(),
    price: parseNumeric(input.price),
    mileage: parseNumeric(input.mileage),
    exterior: input.exterior?.trim() || null,
    interior: input.interior?.trim() || null,
    engine: input.engine?.trim() || null,
    transmission: input.transmission?.trim() || null,
    vin: input.vin?.trim() || null,
    vin_public: input.vin_public,
    status: input.status,
    eta: input.status === 'coming_soon' ? input.eta?.trim() || null : null,
    spec: input.spec?.trim() || null,
    placed_with: input.placed_with?.trim() || null,
    sale_detail: input.sale_detail?.trim() || null,
    published: input.published,
    featured: input.featured,
  };
}

// Owner-authored content columns (2026-07-08 patch). Written in a SEPARATE
// update so a pre-patch database still saves the base listing and gets a
// clear "run the patch" message instead of a wholesale failure.
function toContentRow(input: ListingInput) {
  const strings = (list: string[]) => list.map((s) => s.trim()).filter(Boolean);
  return {
    overview: input.overview?.trim() || null,
    highlights: strings(input.highlights),
    chassis_no: input.chassis_no?.trim() || null,
    title_status: input.title_status?.trim() || null,
    body_style: input.body_style?.trim() || null,
    drivetrain: input.drivetrain?.trim() || null,
    powertrain: input.powertrain?.trim() || null,
    output_hp: parseNumeric(input.output_hp),
    torque_lbft: parseNumeric(input.torque_lbft),
    msrp: parseNumeric(input.msrp),
    special_spec: input.special_spec?.trim() || null,
    documentation: strings(input.documentation),
    condition_notes: input.condition_notes
      .map((n) => ({ label: n.label.trim(), value: n.value.trim() }))
      .filter((n) => n.label || n.value),
    listing_faq:
      input.listing_faq === null
        ? null
        : input.listing_faq
            .map((f) => ({ q: f.q.trim(), a: f.a.trim() }))
            .filter((f) => f.q || f.a),
  };
}

export async function saveListing(id: string | null, input: ListingInput): Promise<SaveResult> {
  const { supabase } = await requireUser();

  const errors = validate(input);
  if (Object.keys(errors).length) return { ok: false, errors };

  // slug uniqueness (excluding self)
  let slugQuery = supabase.from('listings').select('id').eq('slug', input.slug.trim());
  if (id) slugQuery = slugQuery.neq('id', id);
  const { data: clash } = await slugQuery.limit(1);
  if (clash?.length) return { ok: false, errors: { slug: 'That slug is already in use.' } };

  const row = toRow(input);

  let savedId = id;
  let oldSlug: string | null = null;

  if (id) {
    const { data: existing } = await supabase.from('listings').select('slug').eq('id', id).maybeSingle();
    oldSlug = existing?.slug ?? null;
    const { error } = await supabase.from('listings').update(row).eq('id', id);
    if (error) return { ok: false, errors: { _form: error.message } };
  } else {
    const { data, error } = await supabase.from('listings').insert(row).select('id').single();
    if (error || !data) return { ok: false, errors: { _form: error?.message ?? 'Insert failed.' } };
    savedId = data.id;
  }

  // Slug changed → record a permanent redirect so the old URL keeps working,
  // and repoint any older redirects at the new slug (no chains). Best-effort:
  // a pre-patch DB (table missing) just skips it.
  if (oldSlug && oldSlug !== row.slug) {
    await supabase.from('slug_redirects').upsert({ old_slug: oldSlug, new_slug: row.slug });
    await supabase.from('slug_redirects').update({ new_slug: row.slug }).eq('new_slug', oldSlug);
    // never redirect a slug to itself (e.g. renamed back)
    await supabase.from('slug_redirects').delete().eq('old_slug', row.slug);
  }

  // Owner-authored content — separate write with a clear pre-patch error.
  const { error: contentError } = await supabase
    .from('listings')
    .update(toContentRow(input))
    .eq('id', savedId!);
  if (contentError) {
    return {
      ok: false,
      errors: {
        _form:
          'Base listing saved, but the overview/highlights/spec fields need the 2026-07-08 database patch (supabase/patches/2026-07-08-listing-content.sql) — run it in the Supabase SQL editor and save again.',
      },
    };
  }

  revalidatePublic();
  return { ok: true, id: savedId! };
}

export async function deleteListing(id: string) {
  const { supabase } = await requireUser();
  // soft delete (admin-cms-build.md §3c)
  await supabase.from('listings').update({ deleted_at: new Date().toISOString() }).eq('id', id);
  await supabase.from('placements').delete().eq('item_type', 'listing').eq('item_id', id);
  revalidatePublic();
}

export async function duplicateListing(id: string): Promise<string | null> {
  const { supabase } = await requireUser();
  const { data: src } = await supabase.from('listings').select('*').eq('id', id).single();
  if (!src) return null;
  const { id: _id, created_at, updated_at, deleted_at, ...rest } = src;
  const copy = {
    ...rest,
    slug: `${src.slug}-copy`,
    published: false, // duplicates start as drafts
  };
  const { data } = await supabase.from('listings').insert(copy).select('id').single();
  return data?.id ?? null;
}

export async function setListingFlags(
  id: string,
  flags: Partial<{ published: boolean; featured: boolean; status: ListingStatus }>,
) {
  const { supabase } = await requireUser();
  await supabase.from('listings').update(flags).eq('id', id);
  if (flags.published === false) {
    // unpublish cascades out of every curated slot (admin-cms-build.md §2b)
    await supabase.from('placements').delete().eq('item_type', 'listing').eq('item_id', id);
  }
  revalidatePublic();
}

export async function reorderListings(orderedIds: string[]) {
  const { supabase } = await requireUser();
  await Promise.all(
    orderedIds.map((id, i) => supabase.from('listings').update({ sort_order: i }).eq('id', id)),
  );
  revalidatePublic();
}
