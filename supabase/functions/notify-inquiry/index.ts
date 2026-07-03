// Supabase Edge Function: notify-inquiry — DEPRECATED, DO NOT DEPLOY
// ---------------------------------------------------------------------------
// Removed by the 2026-07-02 security audit: deploying with --no-verify-jwt
// made this a publicly invokable email sender (anyone could burn the Resend
// quota / phish the owner's inbox), and it interpolated user input into HTML
// unescaped. The lead notification email is now sent by the Next.js API route
// (src/app/api/leads/route.ts, RESEND_API_KEY env) behind its validation,
// rate-limit and Turnstile gates. The on_new_lead pg_net trigger was dropped
// (supabase/patches/2026-07-02-security-hardening.sql). Kept for reference
// only.
// ---------------------------------------------------------------------------

interface Inquiry {
  id: string;
  listing_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  division: string;
  created_at: string;
}

Deno.serve(async (req: Request) => {
  try {
    const inquiry = (await req.json()) as Inquiry;

    const apiKey = Deno.env.get('RESEND_API_KEY');
    const to = Deno.env.get('NOTIFY_TO') ?? 'info@redboxmotors.com';
    const from = Deno.env.get('NOTIFY_FROM') ?? 'Red Box Motors <onboarding@resend.dev>';

    if (!apiKey) {
      console.error('RESEND_API_KEY not set — skipping email send.');
      return new Response(JSON.stringify({ ok: false, reason: 'no api key' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    const subject = `New ${inquiry.division} inquiry — ${inquiry.name}`;
    const html = `
      <h2>New ${inquiry.division} inquiry</h2>
      <p><strong>Name:</strong> ${inquiry.name}</p>
      <p><strong>Email:</strong> ${inquiry.email}</p>
      <p><strong>Phone:</strong> ${inquiry.phone ?? '—'}</p>
      ${inquiry.listing_id ? `<p><strong>Listing:</strong> ${inquiry.listing_id}</p>` : ''}
      <p><strong>Message:</strong></p>
      <p>${(inquiry.message ?? '').replace(/\n/g, '<br/>')}</p>
      <hr/>
      <p style="color:#888">Received ${inquiry.created_at}</p>
    `;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to, subject, html, reply_to: inquiry.email }),
    });

    const body = await res.text();
    return new Response(JSON.stringify({ ok: res.ok, body }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  }
});
