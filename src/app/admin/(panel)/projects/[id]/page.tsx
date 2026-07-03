import { notFound } from 'next/navigation';
import { createSessionClient } from '@/lib/supabase/server';
import type { DbImage, Project } from '@/lib/db/types';
import { ProjectEditor } from '@/components/admin/ProjectEditor';

export const dynamic = 'force-dynamic';

export default async function AdminProjectEditorPage({ params }: { params: { id: string } }) {
  if (params.id === 'new') {
    return <ProjectEditor project={null} images={[]} activeSurfaces={[]} />;
  }

  const supabase = createSessionClient();
  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('id', params.id)
    .is('deleted_at', null)
    .single();

  if (!project) notFound();

  const [{ data: images }, { data: placements }] = await Promise.all([
    supabase
      .from('images')
      .select('*')
      .eq('parent_type', 'project')
      .eq('parent_id', params.id)
      .order('sort_order', { ascending: true }),
    supabase.from('placements').select('surface').eq('item_type', 'project').eq('item_id', params.id),
  ]);

  return (
    <ProjectEditor
      project={project as Project}
      images={(images ?? []) as DbImage[]}
      activeSurfaces={(placements ?? []).map((p) => p.surface)}
    />
  );
}
