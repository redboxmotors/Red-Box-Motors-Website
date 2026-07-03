'use server';

import { requireUser } from '@/lib/auth';

export async function setLeadStatus(id: string, status: 'new' | 'handled') {
  const { supabase } = await requireUser();
  await supabase.from('leads').update({ status }).eq('id', id);
}
