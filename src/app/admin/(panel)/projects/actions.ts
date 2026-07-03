'use server';

import { requireUser } from '@/lib/auth';
import { revalidatePublic } from '@/lib/admin/revalidate';
import { parseNumeric, slugify } from '@/lib/admin/slug';
import type { SaveResult } from '../listings/actions';

export type ProjectInput = {
  slug: string;
  title: string;
  vehicle: string;
  make: string | null;
  category: string;
  services: string[];
  finish: string | null;
  duration: string | null;
  year: string | number | null;
  coverage: string | null;
  location: string | null;
  summary: string | null;
  scope: string[];
  published: boolean;
  featured: boolean;
};

function validate(input: ProjectInput): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!input.title?.trim()) errors.title = 'Title is required.';
  if (!input.vehicle?.trim()) errors.vehicle = 'Vehicle is required.';
  if (!input.category?.trim()) errors.category = 'Category is required.';
  if (!input.slug?.trim()) errors.slug = 'Slug is required.';
  else if (slugify(input.slug) !== input.slug) errors.slug = 'Lowercase letters, numbers and dashes only.';
  return errors;
}

export async function saveProject(id: string | null, input: ProjectInput): Promise<SaveResult> {
  const { supabase } = await requireUser();

  const errors = validate(input);
  if (Object.keys(errors).length) return { ok: false, errors };

  let slugQuery = supabase.from('projects').select('id').eq('slug', input.slug.trim());
  if (id) slugQuery = slugQuery.neq('id', id);
  const { data: clash } = await slugQuery.limit(1);
  if (clash?.length) return { ok: false, errors: { slug: 'That slug is already in use.' } };

  const row = {
    slug: input.slug.trim(),
    title: input.title.trim(),
    vehicle: input.vehicle.trim(),
    make: input.make?.trim() || null,
    category: input.category.trim(),
    services: input.services.map((s) => s.trim()).filter(Boolean),
    finish: input.finish?.trim() || null,
    duration: input.duration?.trim() || null,
    year: parseNumeric(input.year),
    coverage: input.coverage?.trim() || null,
    location: input.location?.trim() || null,
    summary: input.summary?.trim() || null,
    scope: input.scope.map((s) => s.trim()).filter(Boolean),
    published: input.published,
    featured: input.featured,
  };

  if (id) {
    const { error } = await supabase.from('projects').update(row).eq('id', id);
    if (error) return { ok: false, errors: { _form: error.message } };
    revalidatePublic();
    return { ok: true, id };
  }

  const { data, error } = await supabase.from('projects').insert(row).select('id').single();
  if (error || !data) return { ok: false, errors: { _form: error?.message ?? 'Insert failed.' } };
  revalidatePublic();
  return { ok: true, id: data.id };
}

export async function deleteProject(id: string) {
  const { supabase } = await requireUser();
  await supabase.from('projects').update({ deleted_at: new Date().toISOString() }).eq('id', id);
  await supabase.from('placements').delete().eq('item_type', 'project').eq('item_id', id);
  revalidatePublic();
}

export async function duplicateProject(id: string): Promise<string | null> {
  const { supabase } = await requireUser();
  const { data: src } = await supabase.from('projects').select('*').eq('id', id).single();
  if (!src) return null;
  const { id: _id, created_at, updated_at, deleted_at, ...rest } = src;
  const { data } = await supabase
    .from('projects')
    .insert({ ...rest, slug: `${src.slug}-copy`, published: false })
    .select('id')
    .single();
  return data?.id ?? null;
}

export async function setProjectFlags(id: string, flags: Partial<{ published: boolean; featured: boolean }>) {
  const { supabase } = await requireUser();
  await supabase.from('projects').update(flags).eq('id', id);
  if (flags.published === false) {
    await supabase.from('placements').delete().eq('item_type', 'project').eq('item_id', id);
  }
  revalidatePublic();
}

export async function reorderProjects(orderedIds: string[]) {
  const { supabase } = await requireUser();
  await Promise.all(
    orderedIds.map((id, i) => supabase.from('projects').update({ sort_order: i }).eq('id', id)),
  );
  revalidatePublic();
}
