import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import {
  EMAIL_RE,
  UPLOAD_BUCKET,
  clientIp,
  emailRows,
  escapeHtml,
  notifyTo,
  rateLimitCheck,
  rateLimitHit,
  sanitizeFilename,
  seenSubmissionKey,
  sendEmail,
  validateFileManifest,
  verifyTurnstile,
  type FileManifestEntry,
} from '@/lib/leads/server';

export const runtime = 'nodejs';

// Sell/consign intake (/dealer/sell). Same gates as /api/leads — honeypot,
// per-IP rate limit, validation, optional Turnstile — then a service-role
// insert into public.leads (type 'consignment', structured fields in
// `payload`). Files never pass through this route: after the gates we issue
// short-lived signed upload URLs into the PRIVATE lead-uploads bucket
// (leads/<lead_id>/<category>/...) and the browser uploads directly, so the
// 10 MB/file limit is enforced by the bucket itself and the route stays
// within serverless body limits. Admin reads files via signed download URLs.
//
// Pre-migration fallback: if the DB doesn't yet have the 2026-07-07 patch
// (payload column / consignment enum value), the submission still lands as a
// type 'contact' lead with every field formatted into `message` — nothing is
// ever dropped on the floor.

const CONTACT_METHODS = new Set(['Phone call', 'Text', 'Email']);
const TITLE_STATUSES = new Set(['Clean', 'Rebuilt', 'Bonded', 'Other']);
const YES_NO = new Set(['Yes', 'No']);
const ACCIDENTS = new Set(['None', 'Minor', 'Major']);
const TIMELINES = new Set(['As soon as possible', 'Within 30 days', '1-3 months', 'Just exploring']);
// Single option for now (owner decision) — add options here AND in the form
// when direct purchase / brokerage become available.
const REPRESENTATIONS = new Set(['Consignment']);

type Group = Record<string, string>;

// Pull a nested group of trimmed, length-capped strings out of the body.
function group(body: Record<string, unknown>, key: string, max = 2000): Group {
  const raw = body[key];
  const out: Group = {};
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
      if (typeof v === 'string') out[k] = v.trim().slice(0, max);
    }
  }
  return out;
}

function intIn(s: string, min: number, max: number): boolean {
  const n = Number(s.replace(/[,\s]/g, ''));
  return Number.isFinite(n) && Number.isInteger(n) && n >= min && n <= max;
}

const LABELS: Record<string, string> = {
  first_name: 'First name',
  last_name: 'Last name',
  email: 'Email',
  phone: 'Phone',
  contact_method: 'Preferred contact',
  city_state: 'City / State',
  year: 'Year',
  make: 'Make',
  model: 'Model',
  trim: 'Trim / Edition',
  vin: 'VIN',
  mileage: 'Mileage',
  exterior: 'Exterior color',
  interior: 'Interior color',
  transmission: 'Transmission',
  location: 'Vehicle location',
  title_in_name: 'Title in your name',
  title_status: 'Title status',
  has_loan: 'Outstanding loan / payoff',
  payoff: 'Approx. payoff',
  owners: 'Number of owners',
  keys: 'Number of keys',
  listed_elsewhere: 'Currently listed elsewhere',
  accidents: 'Accident / damage history',
  accident_details: 'Accident / paintwork details',
  mechanical: 'Mechanical issues / warning lights',
  cosmetic: 'Cosmetic imperfections',
  protection: 'PPF / ceramic / wrap / tint',
  modifications: 'Modifications',
  maintenance: 'Recent maintenance',
  service_records: 'Service records available',
  window_sticker: 'Window sticker / build sheet',
  extras: 'Other accessories / documentation',
  asking_price: 'Desired asking price',
  minimum: 'Minimum acceptable / desired net',
  timeline: 'Desired timeline',
  reason: 'Reason for selling',
  representation: 'Representation',
  notes: 'Anything else',
};

function groupText(title: string, g: Group): string {
  const lines = Object.entries(g)
    .filter(([, v]) => v)
    .map(([k, v]) => `${LABELS[k] ?? k}: ${v}`);
  return lines.length ? `${title}\n${lines.join('\n')}` : '';
}

function groupRows(g: Group): string {
  return emailRows(
    Object.entries(g)
      .filter(([, v]) => v)
      .map(([k, v]) => [LABELS[k] ?? k, v] as [string, string]),
  );
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 });
  }

  // Honeypot — bots fill it; humans never see it. Pretend success.
  if (typeof body.website === 'string' && body.website.trim())
    return NextResponse.json({ ok: true, uploads: [] });

  const ip = clientIp(req);
  if (rateLimitCheck('consign', ip, 4)) {
    return NextResponse.json(
      { ok: false, error: 'Too many submissions, please try again in a few minutes.' },
      { status: 429 },
    );
  }

  const contact = group(body, 'contact', 320);
  const vehicle = group(body, 'vehicle', 300);
  const ownership = group(body, 'ownership', 300);
  const condition = group(body, 'condition', 2000);
  const sale = group(body, 'sale', 2000);

  const errors: Record<string, string> = {};
  const need = (g: Group, gk: string, k: string, msg: string) => {
    if (!g[k]) errors[`${gk}.${k}`] = msg;
  };

  // Contact
  need(contact, 'contact', 'first_name', 'Enter your first name');
  need(contact, 'contact', 'last_name', 'Enter your last name');
  if (!contact.email) errors['contact.email'] = 'Enter your email';
  else if (!EMAIL_RE.test(contact.email)) errors['contact.email'] = 'Enter a valid email';
  need(contact, 'contact', 'phone', 'Enter your phone number');
  if (!CONTACT_METHODS.has(contact.contact_method ?? ''))
    errors['contact.contact_method'] = 'Pick one';
  need(contact, 'contact', 'city_state', 'Enter your city and state');

  // Vehicle
  if (!vehicle.year || !intIn(vehicle.year, 1900, new Date().getFullYear() + 2))
    errors['vehicle.year'] = 'Enter the model year';
  need(vehicle, 'vehicle', 'make', 'Enter the make');
  need(vehicle, 'vehicle', 'model', 'Enter the model');
  if (!vehicle.mileage || !intIn(vehicle.mileage, 0, 2000000))
    errors['vehicle.mileage'] = 'Enter the mileage';
  need(vehicle, 'vehicle', 'location', 'Where is the vehicle located?');
  if (vehicle.vin && !/^[A-HJ-NPR-Z0-9]{11,17}$/i.test(vehicle.vin.replace(/\s/g, '')))
    errors['vehicle.vin'] = 'Check the VIN, 17 characters, no I, O or Q';

  // Ownership
  if (!YES_NO.has(ownership.title_in_name ?? '')) errors['ownership.title_in_name'] = 'Pick one';
  if (!TITLE_STATUSES.has(ownership.title_status ?? '')) errors['ownership.title_status'] = 'Pick one';
  if (!YES_NO.has(ownership.has_loan ?? '')) errors['ownership.has_loan'] = 'Pick one';

  // Condition & sale
  if (!ACCIDENTS.has(condition.accidents ?? '')) errors['condition.accidents'] = 'Pick one';
  if (!TIMELINES.has(sale.timeline ?? '')) errors['sale.timeline'] = 'Pick one';
  if (!REPRESENTATIONS.has(sale.representation ?? '')) sale.representation = 'Consignment';

  const files = (Array.isArray(body.files) ? body.files : []) as FileManifestEntry[];
  const fileError = validateFileManifest(files);
  if (fileError) errors['files'] = fileError;

  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, errors }, { status: 400 });
  }

  const turnstileOk = await verifyTurnstile(
    typeof body.turnstileToken === 'string' ? body.turnstileToken : null,
    ip,
  );
  if (!turnstileOk) {
    return NextResponse.json(
      { ok: false, error: 'Verification failed, please retry.' },
      { status: 400 },
    );
  }

  const submission_key =
    typeof body.submission_key === 'string' && /^[0-9a-fA-F-]{20,64}$/.test(body.submission_key)
      ? body.submission_key
      : crypto.randomUUID();

  // Rapid resubmits: same-instance duplicates end here; post-migration the
  // unique index on leads.submission_key catches the rest (23505 below).
  if (seenSubmissionKey(submission_key)) {
    return NextResponse.json({ ok: true, duplicate: true, uploads: [] });
  }

  const name = `${contact.first_name} ${contact.last_name}`;
  const vehicleTitle = [vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(' ');
  const source_page =
    typeof body.source_page === 'string' ? body.source_page.trim().slice(0, 300) : '/dealer/sell';

  const summary = [
    `${vehicleTitle}${vehicle.trim ? ` ${vehicle.trim}` : ''}, ${vehicle.mileage} mi, located ${vehicle.location}.`,
    [
      sale.asking_price ? `Asking ${sale.asking_price}` : null,
      `Timeline: ${sale.timeline}`,
    ]
      .filter(Boolean)
      .join(' · '),
    sale.notes ? `\n${sale.notes}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  const supabase = createAdminClient();

  let leadId: string | null = null;
  let structuredMode = true;

  const structured = await supabase
    .from('leads')
    .insert({
      type: 'consignment',
      name,
      email: contact.email,
      phone: contact.phone,
      interest: 'Sell or Consign a Vehicle',
      message: summary,
      listing_slug: null,
      listing_title: null,
      source_page,
      contact_method: contact.contact_method,
      city_state: contact.city_state,
      payload: {
        form: 'consignment',
        vehicle_title: vehicleTitle,
        contact,
        vehicle,
        ownership,
        condition,
        sale,
        files: files.map((f) => ({ ...f, name: sanitizeFilename(f.name) })),
      },
      submission_key,
    })
    .select('id')
    .single();

  if (!structured.error) {
    leadId = structured.data.id;
  } else if (structured.error.code === '23505') {
    // duplicate submission_key — the first request already landed
    return NextResponse.json({ ok: true, duplicate: true, uploads: [] });
  } else {
    // Pre-migration DB (missing payload column / enum value) — degrade to a
    // legacy-shaped lead with everything formatted into the message.
    structuredMode = false;
    const fullText = [
      `CONSIGNMENT SUBMISSION, ${vehicleTitle}`,
      groupText('Contact', contact),
      groupText('Vehicle', vehicle),
      groupText('Ownership', ownership),
      groupText('Condition & history', condition),
      groupText('Sale expectations', sale),
      files.length
        ? `Files (${files.length}, in lead-uploads bucket under this lead's id):\n${files
            .map((f) => `${f.category}/${sanitizeFilename(f.name)}`)
            .join('\n')}`
        : '',
    ]
      .filter(Boolean)
      .join('\n\n');

    const legacy = await supabase
      .from('leads')
      .insert({
        type: 'contact',
        name,
        email: contact.email,
        phone: contact.phone,
        interest: 'Buying / Selling',
        message: fullText,
        source_page,
      })
      .select('id')
      .single();

    if (legacy.error) {
      return NextResponse.json(
        { ok: false, error: 'Something went wrong on our end, please call or email us directly.' },
        { status: 500 },
      );
    }
    leadId = legacy.data.id;
  }

  rateLimitHit('consign', ip);

  // Signed upload URLs into the private bucket — the browser uploads
  // directly; the bucket enforces mime + size server-side.
  const uploads: Array<{ index: number; path: string; token: string }> = [];
  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    const path = `leads/${leadId}/${f.category}/${String(i + 1).padStart(2, '0')}-${sanitizeFilename(f.name)}`;
    const { data, error } = await supabase.storage
      .from(UPLOAD_BUCKET)
      .createSignedUploadUrl(path);
    if (!error && data) uploads.push({ index: i, path: data.path, token: data.token });
  }

  const site = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://redboxmotors.com';
  await sendEmail({
    to: notifyTo(),
    subject: `New Consignment Submission, ${vehicleTitle}`,
    replyTo: contact.email,
    html: `
      <h2>New consignment submission</h2>
      <h3>Contact</h3>${groupRows(contact)}
      <h3>Vehicle</h3>${groupRows(vehicle)}
      <h3>Ownership</h3>${groupRows(ownership)}
      <h3>Condition &amp; history</h3>${groupRows(condition)}
      <h3>Sale expectations</h3>${groupRows(sale)}
      <h3>Files</h3>
      <p>${
        files.length
          ? `${files.length} file(s), view via the admin (sign-in required):`
          : 'No files attached.'
      }</p>
      ${files.map((f) => `<p>· ${escapeHtml(`${f.category}/${sanitizeFilename(f.name)}`)}</p>`).join('\n')}
      <p><a href="${site}/admin/leads">Open in admin → Leads</a></p>
      ${structuredMode ? '' : '<p><em>Note: stored as a contact-type lead, run the 2026-07-07 SQL patch for structured consignment leads.</em></p>'}
    `,
  });

  // Customer confirmation — best-effort, mirrors the on-screen message.
  await sendEmail({
    to: contact.email,
    subject: 'We received your vehicle submission, Red Box Motors',
    html: `
      <p>Hi ${escapeHtml(contact.first_name ?? '')},</p>
      <p>Thank you for submitting your vehicle to Red Box Motors. Our team will
      review the information and contact you to discuss the vehicle, current
      market positioning and next steps.</p>
      <p>Vehicle submitted: <strong>${escapeHtml(vehicleTitle)}</strong></p>
      <p>Red Box Motors · Austin, TX</p>
    `,
  });

  return NextResponse.json({ ok: true, uploads });
}
