// Client-side lead submission shared by the contact form and the listing
// inquiry panel (handoff/forms.md).

export type LeadPayload = {
  type: 'contact' | 'listing';
  name: string;
  email: string;
  phone: string | null;
  interest: string | null;
  message: string;
  listing_slug: string | null;
  listing_title: string | null;
  source_page: string | null;
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
