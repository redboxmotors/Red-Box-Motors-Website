// Client-side lead submission shared by the contact form and the listing
// inquiry panel (handoff/forms.md).

export type LeadPayload = {
  type: 'contact' | 'listing' | 'first_look' | 'estimate';
  name?: string;
  first_name?: string;
  last_name?: string;
  email: string;
  phone: string | null;
  interest?: string | null;
  message: string;
  listing_slug: string | null;
  listing_title: string | null;
  source_page: string | null;
  // 2026-07-07 form system extras (validated per type server-side)
  contact_method?: string;
  city_state?: string;
  inquiry_type?: string;
  timeframe?: string;
  vehicle_text?: string;
  vehicle_of_interest?: string;
  campaign?: string;
  services?: string[];
  opt_in?: boolean;
  submission_key?: string;
  website: string; // honeypot — must be empty
  turnstileToken: string | null;
};

export type LeadResult =
  | { ok: true }
  | { ok: false; error?: string; errors?: Record<string, string> };

export async function submitLead(payload: LeadPayload): Promise<LeadResult> {
  try {
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = (await res.json()) as LeadResult;
    if (res.ok && data.ok) return { ok: true };
    return data.ok ? { ok: false } : data;
  } catch {
    return {
      ok: false,
      error: 'Network error — please check your connection and try again.',
    };
  }
}

// —— Consignment (/dealer/sell → /api/consignments) ————————————————————

export type ConsignmentPayload = {
  submission_key: string;
  source_page: string;
  website: string; // honeypot — must be empty
  turnstileToken: string | null;
  contact: Record<string, string>;
  vehicle: Record<string, string>;
  ownership: Record<string, string>;
  condition: Record<string, string>;
  sale: Record<string, string>;
  files: Array<{ category: string; name: string; type: string; size: number }>;
};

export type ConsignmentResult =
  | { ok: true; duplicate?: boolean; uploads: Array<{ index: number; path: string; token: string }> }
  | { ok: false; error?: string; errors?: Record<string, string> };

export async function submitConsignment(payload: ConsignmentPayload): Promise<ConsignmentResult> {
  try {
    const res = await fetch('/api/consignments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return (await res.json()) as ConsignmentResult;
  } catch {
    return {
      ok: false,
      error: 'Network error — please check your connection and try again.',
    };
  }
}

// Upload the user's files straight to the private bucket via the short-lived
// signed URLs issued by /api/consignments (files never pass through our
// serverless routes). Returns the number of failed uploads.
export async function uploadLeadFiles(
  uploads: Array<{ index: number; path: string; token: string }>,
  files: File[],
  onProgress?: (done: number, total: number) => void,
): Promise<number> {
  const { createClient } = await import('@/lib/supabase/client');
  const storage = createClient().storage.from('lead-uploads');
  let failed = 0;
  let done = 0;
  for (const u of uploads) {
    const file = files[u.index];
    if (!file) {
      failed += 1;
      continue;
    }
    try {
      const { error } = await storage.uploadToSignedUrl(u.path, u.token, file, {
        contentType: file.type,
      });
      if (error) failed += 1;
    } catch {
      failed += 1;
    }
    done += 1;
    onProgress?.(done, uploads.length);
  }
  return failed;
}
