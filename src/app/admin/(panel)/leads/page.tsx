import { createSessionClient } from '@/lib/supabase/server';
import type { Lead } from '@/lib/db/types';
import { LeadsManager } from '@/components/admin/LeadsManager';

export const dynamic = 'force-dynamic';

export default async function AdminLeadsPage() {
  const supabase = createSessionClient();
  const { data } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(500);

  return <LeadsManager leads={(data ?? []) as Lead[]} />;
}
