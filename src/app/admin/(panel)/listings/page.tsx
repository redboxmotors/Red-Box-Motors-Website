import { createSessionClient } from '@/lib/supabase/server';
import type { DbImage, Listing } from '@/lib/db/types';
import { ListingsManager } from '@/components/admin/ListingsManager';

export const dynamic = 'force-dynamic';

export default async function AdminListingsPage() {
  const supabase = createSessionClient();

  const { data: listings } = await supabase
    .from('listings')
    .select('*')
    .is('deleted_at', null)
    .order('sort_order', { ascending: true });

  const rows = (listings ?? []) as Listing[];

  let heroes: Record<string, DbImage> = {};
  if (rows.length) {
    const { data: imgs } = await supabase
      .from('images')
      .select('*')
      .eq('parent_type', 'listing')
      .eq('is_hero', true)
      .in('parent_id', rows.map((l) => l.id));
    heroes = Object.fromEntries(((imgs ?? []) as DbImage[]).map((i) => [i.parent_id, i]));
  }

  return <ListingsManager listings={rows} heroes={heroes} />;
}
