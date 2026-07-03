import { notFound } from 'next/navigation';
import { createSessionClient } from '@/lib/supabase/server';
import type { DbImage, Sourced } from '@/lib/db/types';
import { SourcedEditor } from '@/components/admin/SourcedEditor';

export const dynamic = 'force-dynamic';

export default async function AdminSourcedEditorPage({ params }: { params: { id: string } }) {
  if (params.id === 'new') {
    return <SourcedEditor sourced={null} images={[]} activeSurfaces={[]} />;
  }

  const supabase = createSessionClient();
  const { data: sourced } = await supabase
    .from('sourced')
    .select('*')
    .eq('id', params.id)
    .is('deleted_at', null)
    .single();

  if (!sourced) notFound();

  const [{ data: images }, { data: placements }] = await Promise.all([
    supabase
      .from('images')
      .select('*')
      .eq('parent_type', 'sourced')
      .eq('parent_id', params.id)
      .order('sort_order', { ascending: true }),
    supabase.from('placements').select('surface').eq('item_type', 'sourced').eq('item_id', params.id),
  ]);

  return (
    <SourcedEditor
      sourced={sourced as Sourced}
      images={(images ?? []) as DbImage[]}
      activeSurfaces={(placements ?? []).map((p) => p.surface)}
    />
  );
}
