'use server';

import { requireUser } from '@/lib/auth';
import { revalidatePublic } from '@/lib/admin/revalidate';
import { parseNumeric } from '@/lib/admin/slug';
import type { SaveResult } from '../listings/actions';

export type SourcedInput = {
  year: string | number | null;
  make: string;
  model: string;
  spec: string | null;
  client: string | null;
  sourced_detail: string | null;
  published: boolean;
  featured: boolean;
};

function validate(input: SourcedInput): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!input.make?.trim()) errors.make = 'Make is required.';
  if (!input.model?.trim()) errors.model = 'Model is required.';
  if (input.year == null || input.year === '') errors.year = 'Year is required.';
  return errors;
}

export async function saveSourced(id: string | null, input: SourcedInput): Promise<SaveResult> {
  const { supabase } = await requireUser();

  const errors = validate(input);
  if (Object.keys(errors).length) return { ok: false, errors };

  const row = {
    year: parseNumeric(input.year),
    make: input.make.trim(),
    model: input.model.trim(),
    spec: input.spec?.trim() || null,
    client: input.client?.trim() || null,
    sourced_detail: input.sourced_detail?.trim() || null,
    published: input.published,
    featured: input.featured,
  };

  if (id) {
    const { error } = await supabase.from('sourced').update(row).eq('id', id);
    if (error) return { ok: false, errors: { _form: error.message } };
    revalidatePublic();
    return { ok: true, id };
  }

  const { data, error } = await supabase.from('sourced').insert(row).select('id').single();
  if (error || !data) return { ok: false, errors: { _form: error?.message ?? 'Insert failed.' } };
  revalidatePublic();
  return { ok: true, id: data.id };
}

export async function deleteSourced(id: string) {
  const { supabase } = await requireUser();
  await supabase.from('sourced').update({ deleted_at: new Date().toISOString() }).eq('id', id);
  await supabase.from('placements').delete().eq('item_type', 'sourced').eq('item_id', id);
  revalidatePublic();
}

export async function duplicateSourced(id: string): Promise<string | null> {
  const { supabase } = await requireUser();
  const { data: src } = await supabase.from('sourced').select('*').eq('id', id).single();
  if (!src) return null;
  const { id: _id, created_at, updated_at, deleted_at, ...rest } = src;
  const { data } = await supabase
    .from('sourced')
    .insert({ ...rest, published: false })
    .select('id')
    .single();
  return data?.id ?? null;
}

export async function setSourcedFlags(id: string, flags: Partial<{ published: boolean; featured: boolean }>) {
  const { supabase } = await requireUser();
  await supabase.from('sourced').update(flags).eq('id', id);
  if (flags.published === false) {
    await supabase.from('placements').delete().eq('item_type', 'sourced').eq('item_id', id);
  }
  revalidatePublic();
}

export async function reorderSourced(orderedIds: string[]) {
  const { supabase } = await requireUser();
  await Promise.all(
    orderedIds.map((id, i) => supabase.from('sourced').update({ sort_order: i }).eq('id', id)),
  );
  revalidatePublic();
}
