import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { dedupeModel } from '@/lib/db/types';
import {
  EMAIL_RE,
  clientIp,
  emailRows,
  escapeHtml,
  notifyTo,
  rateLimitCheck,
  rateLimitHit,
  seenSubmissionKey,
  sendEmail,
  strFrom,
  verifyTurnstile,
} from '@/lib/leads/server';

export const runtime = 'nodejs';

// Lead submission endpoint (handoff/forms.md — owner chose email + DB).
// Handles four lead types behind identical gates (honeypot, per-IP rate
// limit, validation, optional Turnstile, service-role insert):
//   contact    — general contact form (/contact + modal)
//   listing    — vehicle-specific inquiry on inventory detail pages; the
//                vehicle facts (year/make/model/VIN/price/URL) are enriched
//                SERVER-SIDE from the listing slug so they can't be tampered
//                with and the customer never re-enters them
//   first_look — Arriving Soon / First Look requests
//   estimate   — Restoration estimate requests (/restoration/estimate)
// Consignments have their own richer endpoint (/api/consignments).
//
// Pre-migration fallback: if the DB lacks the 2026-07-07 patch (payload
// column / new enum values), structured extras fold into `message` and
// first_look/estimate rows land as type 'contact' — nothing is dropped.

// Contact categories (owner checklist, 2026-07-07 rev 2). Must match
// ContactForm's CATEGORIES.
const INTERESTS = new Set([
  'Buy a Vehicle',
  'Sell or Consign a Vehicle',
  'Request a Restoration Estimate',
  'Ask About an Existing Listing',
  'General Question',
]);

// Estimate services (owner service list). Must match EstimateForm.
const ESTIMATE_SERVICES = new Set([
  'Paint Protection Film',
  'Paint Correction',
  'Ceramic Coating',
  'Vinyl Wrap or Graphics',
  'Window Tint',
  'Detailing',
  'Wheels, Tires & Calipers',
  'Specialty Project',
]);

// Inquiry types for listing inquiries (2026-07-08 consolidated list).
// 'Trade-in' intentionally omitted — add here and in InquiryPanel when it
// opens up. Must match InquiryPanel's list exactly.
const INQUIRY_TYPES = new Set([
  'Request additional information',
  'Request available documentation',
  'Request a specification sheet',
  'Request additional photographs',
  'Request a live video walkaround',
  'Schedule a private viewing',
  'Discuss a third-party inspection',
  'Discuss enclosed transportation',
  'Discuss pre-delivery PPF, coating, tint or detailing',
]);

const TIMEFRAMES = new Set([
  'As soon as possible',
  'Within 30 days',
  '1–3 months',
  'Just researching',
]);

const CONTACT_METHODS = new Set(['Phone call', 'Text', 'Email']);

type LeadInsert = {
  type: string;
  name: string;
  email: string;
  phone: string | null;
  interest: string | null;
  message: string;
  listing_slug: string | null;
  listing_title: string | null;
  source_page: string | null;
  contact_method?: string | null;
  city_state?: string | null;
  payload?: Record<string, unknown> | null;
  submission_key?: string | null;
};

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 });
  }

  const str = strFrom(body);

  // Honeypot — bots fill it; humans never see it. Pretend success.
  if (str('website')) return NextResponse.json({ ok: true });

  const ip = clientIp(req);
  if (rateLimitCheck('leads', ip, 5)) {
    return NextResponse.json(
      { ok: false, error: 'Too many messages — please try again in a few minutes.' },
      { status: 429 },
    );
  }

  const rawType = str('type');
  const type =
    rawType === 'listing' || rawType === 'first_look' || rawType === 'estimate'
      ? rawType
      : 'contact';

  const first_name = str('first_name', 100);
  const last_name = str('last_name', 100);
  const name = str('name', 200) || `${first_name} ${last_name}`.trim();
  const email = str('email', 320);
  const phone = str('phone', 40) || null;
  const message = str('message');
  const interest = str('interest', 60) || null;
  const listing_slug = str('listing_slug', 200) || null;
  const listing_title = str('listing_title', 200) || null;
  const source_page = str('source_page', 300) || null;
  const contact_method = str('contact_method', 30) || null;
  const city_state = str('city_state', 120) || null;
  const inquiry_type = str('inquiry_type', 80) || null;
  const timeframe = str('timeframe', 40) || null;
  const vehicle_of_interest = str('vehicle_of_interest', 200) || null;
  const vehicle_text = str('vehicle_text', 120) || null; // contact form's year/make/model
  const campaign = str('campaign', 120) || null;
  const opt_in = body.opt_in === true; // first_look — UNCHECKED by default, never assumed
  const services = Array.isArray(body.services)
    ? (body.services as unknown[])
        .filter((s): s is string => typeof s === 'string' && ESTIMATE_SERVICES.has(s))
        .slice(0, 10)
    : [];

  const errors: Record<string, string> = {};
  if (type === 'contact') {
    if (!name) errors.name = 'Enter your name';
  } else {
    if (!first_name) errors.first_name = 'Enter your first name';
    if (!last_name) errors.last_name = 'Enter your last name';
  }
  if (!email) errors.email = 'Enter your email';
  else if (!EMAIL_RE.test(email)) errors.email = 'Enter a valid email';

  if (type === 'contact') {
    if (!message) errors.message = 'Add a short message';
    if (!interest || !INTERESTS.has(interest)) errors.interest = 'Pick one';
  }
  if (type === 'listing') {
    if (!phone) errors.phone = 'Enter your phone number';
    if (!city_state) errors.city_state = 'Enter your city and state';
    if (!contact_method || !CONTACT_METHODS.has(contact_method)) errors.contact_method = 'Pick one';
    if (!timeframe || !TIMEFRAMES.has(timeframe)) errors.timeframe = 'Pick one';
    if (!inquiry_type || !INQUIRY_TYPES.has(inquiry_type)) errors.inquiry_type = 'Pick one';
    if (!message) errors.message = 'Add a message';
    if (!listing_slug) errors.message = 'Missing vehicle reference — please reload the page.';
  }
  if (type === 'first_look') {
    if (!phone) errors.phone = 'Enter your phone number';
    if (!contact_method || !CONTACT_METHODS.has(contact_method)) errors.contact_method = 'Pick one';
    if (!timeframe || !TIMEFRAMES.has(timeframe)) errors.timeframe = 'Pick one';
  }
  if (type === 'estimate') {
    if (!phone) errors.phone = 'Enter your phone number';
    if (!contact_method || !CONTACT_METHODS.has(contact_method)) errors.contact_method = 'Pick one';
    if (!vehicle_text) errors.vehicle_text = 'Tell us the year, make and model';
    if (!services.length) errors.services = 'Pick at least one';
  }
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

  const submission_key =
    typeof body.submission_key === 'string' && /^[0-9a-fA-F-]{20,64}$/.test(body.submission_key)
      ? body.submission_key
      : null;
  if (submission_key && seenSubmissionKey(submission_key)) {
    return NextResponse.json({ ok: true, duplicate: true });
  }

  const supabase = createAdminClient();

  // —— Server-side vehicle enrichment for listing inquiries ————————————
  // The customer never re-enters vehicle facts; we look them up ourselves.
  let vehicle: Record<string, unknown> | null = null;
  let vehicleTitle = listing_title;
  if (type === 'listing' && listing_slug) {
    const { data } = await supabase
      .from('listings')
      .select('slug, year, make, model, vin, price, status')
      .eq('slug', listing_slug)
      .maybeSingle();
    if (data) {
      vehicleTitle =
        [data.year, data.make, dedupeModel(data.make, data.model)].filter(Boolean).join(' ') ||
        listing_title;
      const site = process.env.NEXT_PUBLIC_SITE_URL ?? '';
      vehicle = {
        year: data.year,
        make: data.make,
        model: data.model,
        // No stock-number field exists in the schema — the slug is the stock
        // reference (decision flagged 2026-07-07).
        stock: data.slug,
        vin: data.vin ?? null, // admin-only (payload is not publicly readable)
        advertised_price: data.price,
        listing_url: `${site}/dealer/inventory/${data.slug}`,
      };
    }
  }

  const payload: Record<string, unknown> = {
    form: type,
    ...(inquiry_type ? { inquiry_type } : {}),
    ...(timeframe ? { timeframe } : {}),
    ...(vehicle ? { vehicle, vehicle_title: vehicleTitle } : {}),
    ...(vehicle_text ? { vehicle_text } : {}),
    ...(vehicle_of_interest ? { vehicle_of_interest } : {}),
    ...(campaign ? { campaign } : {}),
    ...(services.length ? { services } : {}),
    ...(type === 'first_look' ? { opt_in } : {}),
  };
  const hasPayload = Object.keys(payload).length > 1;

  const finalMessage =
    message ||
    (type === 'first_look'
      ? `First Look request — ${vehicle_of_interest ?? listing_title ?? 'arriving vehicle'}`
      : type === 'estimate'
        ? `Estimate request — ${services.join(', ')} for ${vehicle_text}`
        : '');

  const structuredRow: LeadInsert = {
    type,
    name,
    email,
    phone,
    interest,
    message: finalMessage,
    listing_slug,
    listing_title: vehicleTitle,
    source_page,
    contact_method,
    city_state,
    payload: hasPayload ? payload : null,
    submission_key,
  };

  let inserted = await supabase.from('leads').insert(structuredRow).select('id').single();

  if (inserted.error && inserted.error.code === '23505') {
    return NextResponse.json({ ok: true, duplicate: true });
  }

  if (inserted.error) {
    // Pre-migration DB — fold structured extras into the message and use a
    // legacy-safe type so the submission still lands.
    const extras = [
      inquiry_type ? `Inquiry type: ${inquiry_type}` : null,
      timeframe ? `Purchase timeframe: ${timeframe}` : null,
      contact_method ? `Preferred contact: ${contact_method}` : null,
      city_state ? `City / State: ${city_state}` : null,
      vehicle_text ? `Vehicle: ${vehicle_text}` : null,
      vehicle_of_interest ? `Vehicle of interest: ${vehicle_of_interest}` : null,
      services.length ? `Services: ${services.join(', ')}` : null,
      campaign ? `Campaign: ${campaign}` : null,
      type === 'first_look' ? `Similar-vehicle updates opt-in: ${opt_in ? 'Yes' : 'No'}` : null,
      vehicle ? `Listing URL: ${(vehicle as { listing_url?: string }).listing_url}` : null,
    ].filter(Boolean);
    const legacyRow = {
      type: type === 'listing' ? 'listing' : 'contact',
      name,
      email,
      phone,
      interest: type === 'contact' ? 'Buying / Selling' : interest,
      message: [
        type === 'first_look' ? 'FIRST LOOK REQUEST' : type === 'estimate' ? 'RESTORATION ESTIMATE REQUEST' : null,
        finalMessage,
        extras.length ? `\n${extras.join('\n')}` : null,
      ]
        .filter(Boolean)
        .join('\n'),
      listing_slug,
      listing_title: vehicleTitle,
      source_page,
    };
    inserted = await supabase.from('leads').insert(legacyRow).select('id').single();
    if (inserted.error) {
      return NextResponse.json(
        { ok: false, error: 'Something went wrong on our end — please call or email us directly.' },
        { status: 500 },
      );
    }
  }

  rateLimitHit('leads', ip);

  // —— Internal notification (per-type subjects, Phase 6 spec) ——————————
  const subject =
    type === 'listing'
      ? `Vehicle Inquiry — ${vehicleTitle ?? listing_slug ?? 'Unknown vehicle'}`
      : type === 'first_look'
        ? `First Look Request — ${vehicle_of_interest ?? listing_title ?? 'Arriving vehicle'}`
        : type === 'estimate'
          ? `Restoration Estimate Request — ${vehicle_text ?? name}`
          : `General Sales Inquiry — ${name}`;

  await sendEmail({
    to: notifyTo(),
    subject,
    replyTo: email,
    html: `
      <h2>${escapeHtml(subject)}</h2>
      ${emailRows([
        ['Name', name],
        ['Email', email],
        ['Phone', phone],
        ['Preferred contact', contact_method],
        ['City / State', city_state],
        ['Interest', interest],
        ['Inquiry type', inquiry_type],
        ['Purchase timeframe', timeframe],
        ['Vehicle', vehicleTitle ?? vehicle_of_interest ?? vehicle_text],
        // Vehicle facts enriched server-side from the listing (2026-07-08:
        // notifications must carry VIN, stock ref, asking price, listing URL)
        ...(vehicle
          ? ([
              ['VIN', (vehicle as { vin?: string | null }).vin ?? '—'],
              ['Stock ref', (vehicle as { stock?: string }).stock ?? listing_slug],
              [
                'Asking price',
                (vehicle as { advertised_price?: number | null }).advertised_price != null
                  ? `$${Math.round((vehicle as { advertised_price: number }).advertised_price).toLocaleString('en-US')}`
                  : '—',
              ],
              ['Listing URL', (vehicle as { listing_url?: string }).listing_url ?? '—'],
            ] as Array<[string, string]>)
          : ([['Listing', listing_slug]] as Array<[string, string | null]>)),
        ...(type === 'first_look'
          ? ([['Similar-vehicle opt-in', opt_in ? 'Yes' : 'No']] as Array<[string, string]>)
          : []),
        ['From page', source_page],
      ])}
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(finalMessage).replace(/\n/g, '<br/>')}</p>
      <p><a href="${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/admin/leads">Open in admin → Leads</a></p>
    `,
  });

  // —— Customer confirmation — best-effort ————————————————————————————
  const confirmBody =
    type === 'listing'
      ? `<p>Thank you for your interest${vehicleTitle ? ` in the ${escapeHtml(vehicleTitle)}` : ' in this vehicle'}. A member of the Red Box Motors team will contact you directly.</p>`
      : type === 'first_look'
        ? `<p>You're on the list. We'll contact you when additional information becomes available${vehicle_of_interest ? ` about the ${escapeHtml(vehicle_of_interest)}` : ''}.</p>`
        : type === 'estimate'
          ? `<p>Thank you for your estimate request${vehicle_text ? ` for the ${escapeHtml(vehicle_text)}` : ''}. Our team will review the project and contact you to discuss scope and next steps.</p>`
          : `<p>Thanks for reaching out — we've received your message and will get back to you within one business day.</p>`;
  await sendEmail({
    to: email,
    subject:
      type === 'listing'
        ? 'We received your vehicle inquiry — Red Box Motors'
        : type === 'first_look'
          ? "You're on the First Look list — Red Box Motors"
          : type === 'estimate'
            ? 'We received your estimate request — Red Box Motors'
            : 'We received your message — Red Box Motors',
    html: `${confirmBody}<p>— Red Box Motors, Austin, TX</p>`,
  });

  return NextResponse.json({ ok: true });
}
