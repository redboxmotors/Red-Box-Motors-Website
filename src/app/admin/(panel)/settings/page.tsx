import { createSessionClient } from '@/lib/supabase/server';
import type { Settings } from '@/lib/db/types';
import { SettingsEditor } from '@/components/admin/SettingsEditor';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const supabase = createSessionClient();
  const { data } = await supabase.from('settings').select('*').eq('id', 1).maybeSingle();
  return <SettingsEditor settings={(data as Settings) ?? null} />;
}
