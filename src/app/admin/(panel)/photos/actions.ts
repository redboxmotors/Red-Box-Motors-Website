'use server';

import { requireUser } from '@/lib/auth';
import { revalidatePublic } from '@/lib/admin/revalidate';
import type { ContentType } from '@/lib/db/types';

// Storage upload happens client-side (authenticated session, bucket policy +
// 10MB/mime limits enforced by Supabase). These actions manage the image
// records — and re-validate everything they're given (admin-cms-build.md §5).

const BUCKET_PREFIX = '/storage/v1/object/public/photos/';

function assertStorageUrl(url: string) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  if (!url.startsWith(base + BUCKET_PREFIX)) {
    throw new Error('Image URL must point at the photos bucket.');
  }
}

export async function addImage(input: {
  parent_type: ContentType;
  parent_id: string;
  url: string;
  thumb_url: string | null;
  alt: string;
}) {
  const { supabase } = await requireUser();
  assertStorageUrl(input.url);
  if (input.thumb_url) assertStorageUrl(input.thumb_url);

  // append at the end; first image becomes hero automatically
  const { count } = await supabase
    .from('images')
    .select('id', { count: 'exact', head: true })
    .eq('parent_type', input.parent_type)
    .eq('parent_id', input.parent_id);

  const { data, error } = await supabase
    .from('images')
    .insert({
      ...input,
      alt: input.alt.slice(0, 300),
      sort_order: count ?? 0,
      is_hero: (count ?? 0) === 0,
    })
    .select('*')
    .single();

  if (error) throw new Error(error.message);
  revalidatePublic();
  return data;
}

export async function updateImageMeta(
  id: string,
  meta: Partial<{ alt: string; focal_x: number; focal_y: number }>,
) {
  const { supabase } = await requireUser();
  const patch: Record<string, unknown> = {};
  if (meta.alt !== undefined) patch.alt = meta.alt.slice(0, 300);
  if (meta.focal_x !== undefined) patch.focal_x = Math.min(1, Math.max(0, meta.focal_x));
  if (meta.focal_y !== undefined) patch.focal_y = Math.min(1, Math.max(0, meta.focal_y));
  await supabase.from('images').update(patch).eq('id', id);
  revalidatePublic();
}

export async function setHeroImage(id: string, parentType: ContentType, parentId: string) {
  const { supabase } = await requireUser();
  // clear then set — the partial unique index enforces one hero per parent
  await supabase
    .from('images')
    .update({ is_hero: false })
    .eq('parent_type', parentType)
    .eq('parent_id', parentId)
    .eq('is_hero', true);
  await supabase.from('images').update({ is_hero: true }).eq('id', id);
  revalidatePublic();
}

export async function reorderImages(orderedIds: string[]) {
  const { supabase } = await requireUser();
  await Promise.all(
    orderedIds.map((id, i) => supabase.from('images').update({ sort_order: i }).eq('id', id)),
  );
  revalidatePublic();
}

export async function deleteImage(id: string) {
  const { supabase } = await requireUser();

  const { data: img } = await supabase.from('images').select('*').eq('id', id).single();
  if (!img) return;

  await supabase.from('images').delete().eq('id', id);

  // hero fallback: promote the first remaining image
  if (img.is_hero) {
    const { data: rest } = await supabase
      .from('images')
      .select('id')
      .eq('parent_type', img.parent_type)
      .eq('parent_id', img.parent_id)
      .order('sort_order', { ascending: true })
      .limit(1);
    if (rest?.length) {
      await supabase.from('images').update({ is_hero: true }).eq('id', rest[0].id);
    }
  }

  // remove the storage objects
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL! + BUCKET_PREFIX;
  const paths = [img.url, img.thumb_url]
    .filter((u): u is string => !!u && u.startsWith(base))
    .map((u) => u.slice(base.length));
  if (paths.length) {
    await supabase.storage.from('photos').remove(paths);
  }

  revalidatePublic();
}
