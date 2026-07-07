'use server';

import { requireUser } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/server';
import { UPLOAD_BUCKET } from '@/lib/leads/uploads';

export async function setLeadStatus(id: string, status: 'new' | 'handled') {
  const { supabase } = await requireUser();
  await supabase.from('leads').update({ status }).eq('id', id);
}

export type LeadUpload = {
  category: string;
  name: string;
  size: number | null;
  url: string; // signed, short-lived — safe to render for the signed-in admin
};

// List a lead's files from the PRIVATE lead-uploads bucket and mint signed
// download URLs. Admin-only: requireUser() gates it (allowlist), then the
// service role does the storage work — the bucket has no RLS policies at
// all, so nothing short of this action (or the service key) can read it.
export async function getLeadUploads(leadId: string): Promise<LeadUpload[]> {
  await requireUser();
  if (!/^[0-9a-fA-F-]{36}$/.test(leadId)) return [];

  const admin = createAdminClient();
  const storage = admin.storage.from(UPLOAD_BUCKET);
  const prefix = `leads/${leadId}`;

  // Bucket layout: leads/<lead_id>/<category>/<nn>-<filename>
  const { data: categories } = await storage.list(prefix, { limit: 100 });
  const out: LeadUpload[] = [];
  for (const entry of categories ?? []) {
    if (entry.id) continue; // a stray file at the top level — skip
    const folder = `${prefix}/${entry.name}`;
    const { data: files } = await storage.list(folder, { limit: 100 });
    for (const f of files ?? []) {
      if (!f.id) continue;
      const path = `${folder}/${f.name}`;
      const { data: signed } = await storage.createSignedUrl(path, 60 * 60);
      if (signed?.signedUrl) {
        out.push({
          category: entry.name,
          name: f.name,
          size: (f.metadata as { size?: number } | null)?.size ?? null,
          url: signed.signedUrl,
        });
      }
    }
  }
  return out;
}
