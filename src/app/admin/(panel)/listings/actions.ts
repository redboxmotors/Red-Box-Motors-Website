'use server';

import { requireUser } from '@/lib/auth';
import { revalidatePublic } from '@/lib/admin/revalidate';
import { parseNumeric, slugify } from '@/lib/admin/slug';
import type { ListingStatus } from '@/lib/db/types';

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

  if (id) {
    const { error } = await supabase.from('listings').update(row).eq('id', id);
    if (error) return { ok: false, errors: { _form: error.message } };
    revalidatePublic();
    return { ok: true, id };
  }

  const { data, error } = await supabase.from('listings').insert(row).select('id').single();
  if (error || !data) return { ok: false, errors: { _form: error?.message ?? 'Insert failed.' } };
  revalidatePublic();
  return { ok: true, id: data.id };
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
