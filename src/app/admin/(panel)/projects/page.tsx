import { createSessionClient } from '@/lib/supabase/server';
import type { DbImage, Project } from '@/lib/db/types';
import { ProjectsManager } from '@/components/admin/ProjectsManager';

export const dynamic = 'force-dynamic';

export default async function AdminProjectsPage() {
  const supabase = createSessionClient();

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .is('deleted_at', null)
    .order('sort_order', { ascending: true });

  const rows = (projects ?? []) as Project[];

  let heroes: Record<string, DbImage> = {};
  if (rows.length) {
    const { data: imgs } = await supabase
      .from('images')
      .select('*')
      .eq('parent_type', 'project')
      .eq('is_hero', true)
      .in('parent_id', rows.map((p) => p.id));
    heroes = Object.fromEntries(((imgs ?? []) as DbImage[]).map((i) => [i.parent_id, i]));
  }

  return <ProjectsManager projects={rows} heroes={heroes} />;
}
