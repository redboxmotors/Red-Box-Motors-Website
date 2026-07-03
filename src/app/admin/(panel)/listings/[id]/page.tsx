import { notFound } from 'next/navigation';
import { createSessionClient } from '@/lib/supabase/server';
import type { DbImage, Listing } from '@/lib/db/types';
import { ListingEditor } from '@/components/admin/ListingEditor';

export const dynamic = 'force-dynamic';

export default async function AdminListingEditorPage({ params }: { params: { id: string } }) {
  if (params.id === 'new') {
    return <ListingEditor listing={null} images={[]} activeSurfaces={[]} />;
  }

  const supabase = createSessionClient();
  const { data: listing } = await supabase
    .from('listings')
    .select('*')
    .eq('id', params.id)
    .is('deleted_at', null)
    .single();

  if (!listing) notFound();

  const [{ data: images }, { data: placements }] = await Promise.all([
    supabase
      .from('images')
      .select('*')
      .eq('parent_type', 'listing')
      .eq('parent_id', params.id)
      .order('sort_order', { ascending: true }),
    supabase.from('placements').select('surface').eq('item_type', 'listing').eq('item_id', params.id),
  ]);

  return (
    <ListingEditor
      listing={listing as Listing}
      images={(images ?? []) as DbImage[]}
      activeSurfaces={(placements ?? []).map((p) => p.surface)}
    />
  );
}
