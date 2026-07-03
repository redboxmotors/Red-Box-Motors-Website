import { notFound } from 'next/navigation';
import { createSessionClient } from '@/lib/supabase/server';
import { SURFACES } from '@/lib/placements';
import type {
  ContentType,
  DbImage,
  Listing,
  Placement,
  PlacementSurface,
  Project,
  Sourced,
} from '@/lib/db/types';
import { formatPrice, listingTitle } from '@/lib/db/types';
import { PlacementManager, type PlacementCard } from '@/components/admin/PlacementManager';

export const dynamic = 'force-dynamic';

// Resolve a content row into a display card for the manager/picker.
function toCard(
  type: ContentType,
  row: Listing | Project | Sourced,
  heroes: Record<string, DbImage>,
): PlacementCard {
  const hero = heroes[row.id];
  const thumb = hero ? (hero.thumb_url ?? hero.url) : null;
  if (type === 'listing') {
    const l = row as Listing;
    return {
      itemId: l.id,
      itemType: 'listing',
      title: listingTitle(l) || l.slug,
      subtitle: [l.status === 'sold' ? 'Sold' : formatPrice(l.price), l.exterior].filter(Boolean).join(' · '),
      thumb,
    };
  }
  if (type === 'project') {
    const p = row as Project;
    return { itemId: p.id, itemType: 'project', title: p.title, subtitle: [p.vehicle, p.category].filter(Boolean).join(' · '), thumb };
  }
  const s = row as Sourced;
  return { itemId: s.id, itemType: 'sourced', title: `${s.year} ${s.make} ${s.model}`, subtitle: s.spec ?? '', thumb };
}

export default async function PlacementSurfacePage({ params }: { params: { surface: string } }) {
  const surface = params.surface as PlacementSurface;
  const config = SURFACES[surface];
  if (!config) notFound();

  const supabase = createSessionClient();

  const { data: placementRows } = await supabase
    .from('placements')
    .select('*')
    .eq('surface', surface)
    .order('sort_order', { ascending: true });
  const placements = (placementRows ?? []) as Placement[];

  // eligible pools per allowed type (published only — unpublished items are
  // hidden from slots by the cascade anyway)
  const pools: Partial<Record<ContentType, (Listing | Project | Sourced)[]>> = {};
  for (const type of config.types) {
    const table = type === 'listing' ? 'listings' : type === 'project' ? 'projects' : 'sourced';
    let q = supabase.from(table).select('*').is('deleted_at', null).eq('published', true);
    if (surface === 'dealer_forsale_preview') q = q.eq('status', 'for_sale');
    if (surface === 'dealer_sold_preview') q = q.eq('status', 'sold');
    const { data } = await q.order('sort_order', { ascending: true });
    pools[type] = (data ?? []) as (Listing | Project | Sourced)[];
  }

  // hero thumbs for everything we might show
  const allIds = [
    ...Object.values(pools).flatMap((rows) => rows.map((r) => r.id)),
    ...placements.map((p) => p.item_id),
  ];
  let heroes: Record<string, DbImage> = {};
  if (allIds.length) {
    const { data: imgs } = await supabase
      .from('images')
      .select('*')
      .eq('is_hero', true)
      .in('parent_id', allIds);
    heroes = Object.fromEntries(((imgs ?? []) as DbImage[]).map((i) => [i.parent_id, i]));
  }

  const byId: Record<string, PlacementCard> = {};
  for (const type of config.types) {
    for (const row of pools[type] ?? []) {
      byId[`${type}:${row.id}`] = toCard(type, row, heroes);
    }
  }

  const current = placements
    .map((p) => {
      const card = byId[`${p.item_type}:${p.item_id}`];
      return card ? { placement: p, card } : null;
    })
    .filter((x): x is { placement: Placement; card: PlacementCard } => !!x);

  const inSlot = new Set(placements.map((p) => `${p.item_type}:${p.item_id}`));
  const candidates = Object.entries(byId)
    .filter(([key]) => !inSlot.has(key))
    .map(([, card]) => card);

  return (
    <PlacementManager
      surface={surface}
      label={config.label}
      rendersOn={config.rendersOn}
      fallback={config.fallback}
      current={current}
      candidates={candidates}
    />
  );
}
