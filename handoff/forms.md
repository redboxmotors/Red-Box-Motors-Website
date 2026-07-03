# Red Box Motors — Forms Spec

There are two inquiry surfaces. Both are **visual placeholders** in the prototypes ("Form is a
placeholder — to be wired up later", "Form component mounts here"). This spec defines fields,
validation, and destinations so Claude Code can build them for real. **Owner decisions are flagged
`⚑`.**

---

## A. Contact form (`/contact`)
The main inquiry form. Left column shows contact details; right column is the form.

**Fields (from the prototype):**
| Field | Type | Required | Notes |
|---|---|---|---|
| Name | text | yes | |
| Email | email | yes | validate format |
| Interested In | single-select chips | yes | options: **Cosmetics**, **Buying / Selling**, **Collection** |
| Message | textarea | yes | "Tell us about the car or the project…" |

Add (recommended, not in prototype): **Phone** (optional), and a hidden **source/page** field so
the team knows which page the inquiry came from.

**Submit button:** red CTA "Send Message".

> **Prototype status:** the Contact form is now functionally built — real inputs, single-select
> "Interested In" chips, live inline validation (required name/message/interest + email format),
> and a success state ("Message sent.") that swaps in on valid submit with a "Send another" reset.
> What's left for production is the **backend**: on submit, POST to the leads destination below
> instead of just flipping to the success state, add spam protection, and surface a server-error
> state if the POST fails.

**Behavior:**
- Client + server validation; inline error states in the design language (red `#CC0000` hairline /
  text, never a rounded alert box).
- On success: replace the form card with a quiet confirmation ("Thanks — we reply within one
  business day.") using the existing `fadeUp` entrance. Don't navigate away.
- Spam protection: honeypot + a privacy-friendly challenge (e.g. Turnstile). ⚑ owner: ok to use
  Cloudflare Turnstile?

---

## B. Listing inquiry (`/dealer/inventory/[slug]`)
Car Detail has an "Inquiry" column that currently renders a placeholder box. Make it a short form
**scoped to the specific car**.

**Fields:**
| Field | Type | Required | Notes |
|---|---|---|---|
| Name | text | yes | |
| Email | email | yes | |
| Phone | tel | no | |
| Message | textarea | no | prefill: "I'm interested in the {year} {make} {model}." |
| (hidden) listing slug + title | — | — | so the lead is attributable |

Same submit/validation/confirmation pattern as the contact form.

> **Prototype status:** the listing inquiry form is now functionally built — name/email/phone/message
> fields, the message **prefilled** with the specific car ("I'm interested in the {year} {make}
> {model}."), live inline validation (required name/message + email format; phone optional), and an
> "Inquiry sent." success state with a "Send another" reset. Remaining production work is the
> backend POST to the leads destination (with the listing slug/title attached), spam protection, and
> a server-error state — same as the contact form.

---

## Where submissions go ⚑
Pick one (owner decision). All are compatible with the Next.js rebuild:
1. **Email only** — send via a transactional provider (Resend / Postmark / SES) to the shop inbox.
   Simplest; no dashboard.
2. **Email + database** — also store leads in a `leads` table so the admin (admin-and-photos.md)
   can show an inbox and mark items handled. Recommended if the CMS is being built anyway.
3. **CRM** — forward to an existing CRM/webhook. ⚑ owner: is there a CRM already?

**Recommendation:** option 2 — one `leads` table (`id, type, name, email, phone, interest,
message, listingSlug, sourcePage, createdAt, status`) plus an email notification. It reuses the
admin you're already building and keeps a record.

---

## Notes
- Use the **single source of truth** for phone/email from config (see README known-placeholders —
  the two phone numbers currently disagree).
- No `<select>` default chrome — style the "Interested In" chips like the prototype's thin-border
  chips, with the selected chip getting a `#CC0000` border/inset.
- Honor `prefers-reduced-motion` on the success transition.
- Accessibility: real `<label>`s (visually the small uppercase caption already present), `aria-invalid`
  on errored fields, focus moves to the first error / to the confirmation on submit.
