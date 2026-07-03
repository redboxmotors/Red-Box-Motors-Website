'use server';

import { requireUser } from '@/lib/auth';
import { revalidatePublic } from '@/lib/admin/revalidate';
import { SURFACES } from '@/lib/placements';
import type { ContentType, PlacementSurface } from '@/lib/db/types';

export async function addPlacement(
  surface: PlacementSurface,
  itemType: ContentType,
  itemId: string,
) {
  const { supabase } = await requireUser();
  if (!SURFACES[surface]?.types.includes(itemType)) {
    throw new Error(`${itemType} is not allowed in ${surface}.`);
  }

  const { count } = await supabase
    .from('placements')
    .select('id', { count: 'exact', head: true })
    .eq('surface', surface);

  // lands at the end of the slot (admin-cms-build.md §3c)
  const { error } = await supabase.from('placements').insert({
    surface,
    item_type: itemType,
    item_id: itemId,
    sort_order: count ?? 0,
  });
  if (error && !error.message.includes('duplicate')) throw new Error(error.message);
  revalidatePublic();
}

export async function removePlacement(id: string) {
  const { supabase } = await requireUser();
  await supabase.from('placements').delete().eq('id', id);
  revalidatePublic();
}

export async function removePlacementBySurface(
  surface: PlacementSurface,
  itemType: ContentType,
  itemId: string,
) {
  const { supabase } = await requireUser();
  await supabase
    .from('placements')
    .delete()
    .eq('surface', surface)
    .eq('item_type', itemType)
    .eq('item_id', itemId);
  revalidatePublic();
}

export async function togglePlacement(id: string, enabled: boolean) {
  const { supabase } = await requireUser();
  await supabase.from('placements').update({ enabled }).eq('id', id);
  revalidatePublic();
}

export async function reorderPlacements(orderedIds: string[]) {
  const { supabase } = await requireUser();
  await Promise.all(
    orderedIds.map((id, i) => supabase.from('placements').update({ sort_order: i }).eq('id', id)),
  );
  revalidatePublic();
}
