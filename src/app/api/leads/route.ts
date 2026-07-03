import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

// Lead submission endpoint (handoff/forms.md — owner chose email + DB).
// Server-side validation, honeypot, per-IP rate limit, optional Turnstile
// (enforced only when TURNSTILE_SECRET_KEY is configured). Rows land in
// public.leads; the notification email is sent from here (Resend) so it sits
// behind the same gates — the old pg_net → edge-function pipeline was
// publicly invokable and was removed (2026-07-02 security audit).

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INTERESTS = new Set(['Cosmetics', 'Buying / Selling', 'Collection']);

// Per-IP sliding window: 5 submissions / 10 min. In-memory — per serverless
// instance, so it's a soft limit; Turnstile is the real gate once enabled.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (list.length >= MAX_PER_WINDOW) {
    hits.set(ip, list);
    return true;
  }
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.clear(); // memory backstop
  return false;
}

async function verifyTurnstile(token: string | null, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // not configured yet — skip
  if (!token) return false;
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    });
    const data = (await res.json()) as { success?: boolean };
    return !!data.success;
  } catch {
    return false;
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

type LeadRow = {
  type: string;
  name: string;
  email: string;
  phone: string | null;
  interest: string | null;
  message: string;
  listing_slug: string | null;
  listing_title: string | null;
  source_page: string | null;
};

// Best-effort notification — the lead is already in the DB (visible in
// /admin/leads), so a send failure must not fail the request.
async function sendLeadNotification(lead: LeadRow): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return; // email not configured yet — DB + admin only
  const to = process.env.NOTIFY_TO ?? 'info@redboxmotors.com';
  const from = process.env.NOTIFY_FROM ?? 'Red Box Motors <onboarding@resend.dev>';

  const label = lead.type === 'listing' ? 'listing inquiry' : 'contact message';
  const subject = `New ${label} — ${lead.name}`;
  const rows = [
    ['Name', lead.name],
    ['Email', lead.email],
    ['Phone', lead.phone ?? '—'],
    ['Interest', lead.interest ?? '—'],
    ['Listing', lead.listing_title ?? lead.listing_slug ?? '—'],
    ['From page', lead.source_page ?? '—'],
  ]
    .map(([k, v]) => `<p><strong>${k}:</strong> ${escapeHtml(v)}</p>`)
    .join('\n');
  const html = `
    <h2>New ${label}</h2>
    ${rows}
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(lead.message).replace(/\n/g, '<br/>')}</p>
  `;

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to, subject, html, reply_to: lead.email }),
    });
  } catch {
    // swallowed — lead is safe in the DB
  }
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 });
  }

  const str = (k: string, max = 2000) =>
    typeof body[k] === 'string' ? (body[k] as string).trim().slice(0, max) : '';

  // Honeypot — bots fill it; humans never see it. Pretend success.
  if (str('website')) return NextResponse.json({ ok: true });

  const ip = (req.headers.get('x-forwarded-for') ?? 'unknown').split(',')[0].trim();
  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: 'Too many messages — please try again in a few minutes.' },
      { status: 429 },
    );
  }

  const type = str('type') === 'listing' ? 'listing' : 'contact';
  const name = str('name', 200);
  const email = str('email', 320);
  const phone = str('phone', 40) || null;
  const message = str('message');
  const interest = str('interest', 60) || null;
  const listing_slug = str('listing_slug', 200) || null;
  const listing_title = str('listing_title', 200) || null;
  const source_page = str('source_page', 300) || null;

  const errors: Record<string, string> = {};
  if (!name) errors.name = 'Enter your name';
  if (!email) errors.email = 'Enter your email';
  else if (!EMAIL_RE.test(email)) errors.email = 'Enter a valid email';
  if (!message) errors.message = 'Add a short message';
  if (type === 'contact' && (!interest || !INTERESTS.has(interest))) errors.interest = 'Pick one';
  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, errors }, { status: 400 });
  }

  const turnstileOk = await verifyTurnstile(
    typeof body.turnstileToken === 'string' ? body.turnstileToken : null,
    ip,
  );
  if (!turnstileOk) {
    return NextResponse.json(
      { ok: false, error: 'Verification failed — please retry.' },
      { status: 400 },
    );
  }

  const lead: LeadRow = {
    type,
    name,
    email,
    phone,
    interest,
    message,
    listing_slug,
    listing_title,
    source_page,
  };

  const supabase = createAdminClient();
  const { error } = await supabase.from('leads').insert(lead);

  if (error) {
    return NextResponse.json(
      { ok: false, error: 'Something went wrong on our end — please call or email us directly.' },
      { status: 500 },
    );
  }

  await sendLeadNotification(lead);

  return NextResponse.json({ ok: true });
}
