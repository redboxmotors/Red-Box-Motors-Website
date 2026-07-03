import { createSessionClient } from '@/lib/supabase/server';
import type { DbImage, Sourced } from '@/lib/db/types';
import { SourcedManager } from '@/components/admin/SourcedManager';

export const dynamic = 'force-dynamic';

export default async function AdminSourcedPage() {
  const supabase = createSessionClient();

  const { data: sourced } = await supabase
    .from('sourced')
    .select('*')
    .is('deleted_at', null)
    .order('sort_order', { ascending: true });

  const rows = (sourced ?? []) as Sourced[];

  let heroes: Record<string, DbImage> = {};
  if (rows.length) {
    const { data: imgs } = await supabase
      .from('images')
      .select('*')
      .eq('parent_type', 'sourced')
      .eq('is_hero', true)
      .in('parent_id', rows.map((s) => s.id));
    heroes = Object.fromEntries(((imgs ?? []) as DbImage[]).map((i) => [i.parent_id, i]));
  }

  return <SourcedManager sourced={rows} heroes={heroes} />;
}
