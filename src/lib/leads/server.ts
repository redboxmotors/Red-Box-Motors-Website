// Server-side gates shared by every public form endpoint (/api/leads,
// /api/consignments). Extracted from the original leads route so all forms
// sit behind identical protections: honeypot, per-IP rate limit, optional
// Turnstile (enforced only when TURNSTILE_SECRET_KEY is set), and
// best-effort Resend email that never fails the request.

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// —— Per-IP sliding window rate limit ——————————————————————————————
// In-memory — per serverless instance, so it's a soft limit; Turnstile is
// the real gate once enabled. `check` before insert, `hit` only after a
// successful insert so validation retries don't burn a visitor's budget.
const WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, number[]>();

function bucket(scope: string, ip: string): string {
  return `${scope}:${ip}`;
}

export function rateLimitCheck(scope: string, ip: string, max = 5): boolean {
  const now = Date.now();
  const key = bucket(scope, ip);
  const list = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.set(key, list);
  return list.length >= max;
}

export function rateLimitHit(scope: string, ip: string): void {
  const key = bucket(scope, ip);
  const list = hits.get(key) ?? [];
  list.push(Date.now());
  hits.set(key, list);
  if (hits.size > 5000) hits.clear(); // memory backstop
}

export function clientIp(req: Request): string {
  return (req.headers.get('x-forwarded-for') ?? 'unknown').split(',')[0].trim();
}

// —— Idempotency fallback ————————————————————————————————————————————
// Post-migration the DB enforces uniqueness on leads.submission_key; until
// then this in-memory set absorbs rapid double-submits per instance.
const recentKeys = new Map<string, number>();

export function seenSubmissionKey(key: string): boolean {
  const now = Date.now();
  recentKeys.forEach((t, k) => {
    if (now - t > WINDOW_MS) recentKeys.delete(k);
  });
  if (recentKeys.has(key)) return true;
  recentKeys.set(key, now);
  return false;
}

// —— Turnstile ————————————————————————————————————————————————————————
export async function verifyTurnstile(token: string | null, ip: string): Promise<boolean> {
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

// —— Email (Resend, raw fetch) ————————————————————————————————————————
export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Best-effort — the lead is already in the DB (visible in /admin/leads), so
// a send failure (or no RESEND_API_KEY at all) must never fail the request.
export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return; // email not configured yet — DB + admin only
  const from = process.env.NOTIFY_FROM ?? 'Red Box Motors <onboarding@resend.dev>';
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: opts.to,
        subject: opts.subject,
        html: opts.html,
        ...(opts.replyTo ? { reply_to: opts.replyTo } : {}),
      }),
    });
  } catch {
    // swallowed — lead is safe in the DB
  }
}

export function notifyTo(): string {
  return process.env.NOTIFY_TO ?? 'info@redboxmotors.com';
}

// Render [label, value] rows as the simple <p><strong> block used in all
// internal notification emails. Empty values render as an em dash.
export function emailRows(rows: Array<[string, string | null | undefined]>): string {
  return rows
    .map(([k, v]) => `<p><strong>${escapeHtml(k)}:</strong> ${escapeHtml(v || '—')}</p>`)
    .join('\n');
}

// —— Body helpers ————————————————————————————————————————————————————
export function strFrom(body: Record<string, unknown>) {
  return (k: string, max = 2000): string =>
    typeof body[k] === 'string' ? (body[k] as string).trim().slice(0, max) : '';
}

// Upload constraints + manifest validation live in ./uploads (isomorphic —
// the form pre-validates with the same rules). Re-exported for API routes.
export {
  UPLOAD_BUCKET,
  UPLOAD_MAX_BYTES,
  UPLOAD_MAX_FILES,
  sanitizeFilename,
  validateFileManifest,
} from './uploads';
export type { FileManifestEntry, UploadCategory } from './uploads';
