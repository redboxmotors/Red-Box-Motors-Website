# Claude Code — Kickoff Prompt (Red Box Motors)

Paste the block below into Claude Code as your first message, with this whole `handoff/` folder
(and the `*.dc.html` files + `data/` + `assets/` at the project root) available in the repo. Then
work through it with Claude Code section by section.

---

You are building the production website for **Red Box Motors**, an Austin, TX automotive business
near Circuit of the Americas with three divisions: **Cosmetics** (PPF, ceramic/correction, vinyl,
wheels, custom builds), **Dealer** (private sales, acquisitions, consignment), and **Collection
Management** (concierge/servicing — *not* storage).

## What you're starting from
The repo contains approved **design prototypes** as `*.dc.html` files at the root. These are
**design references** — HTML mockups that show the exact intended look, layout, copy, and
interactions. They are **not** production code to ship as-is. Your job is to **recreate these
designs faithfully in a real, SEO-driven, owner-maintainable web app**, and to build the admin/CMS
that lets the owner run all content without a developer.

The mockups are **high-fidelity**: match colors, type, spacing, and motion precisely.

## Read these first (in `handoff/`), in order
1. `README.md` — index + ground rules + known placeholders to replace.
2. `design-language.md` — the visual system + the hover/motion spec (the non-negotiables).
3. `design-tokens.css` / `design-tokens.tailwind.js` — copy-paste tokens, shadows, motion curves.
4. `routes-and-pages.md` — every page → production route, its data source, shared components, and
   the shared "expanding scroll box" page pattern.
5. `admin-and-photos.md` — the per-record photo manager (upload / reorder / hero / focal point / alt).
6. `admin-cms-build.md` — the full admin/CMS build: **auth/login, full editability of every listing,
   project and sourced car, drag-reorder, and the featured/placement system that chooses which page
   each item appears on.**
7. `forms.md` — contact/inquiry forms (fields, validation, where leads go).
8. `seo-map.md` — per-page title/meta/H1/schema.
9. `migration-plan.md` — how a `.dc.html` Design Component maps to a React/Next component + build order.

Also open **`Style Guide.dc.html`** at the repo root to *see* the canonical tokens/components.

## Hard ground rules (carry these through)
- **Don't lose the look.** Sharp edges (no rounded corners), dark palette (`#000`–`#1A1A1A`), white
  primary / `#AAA` secondary / `#666` muted text, red `#CC0000` as **accent only**. Archivo type,
  weights 300–500, tight letter-spacing. One easing curve `cubic-bezier(.2,.8,.2,1)`; tiles/cards
  lift + brighten on hover; buttons lift, press back to `scale(0.98)`. Details in `design-language.md`.
- **No invented numbers or claims** (sales totals, warranty years, car counts, etc.) until the owner
  provides real figures.
- **Collection Management is concierge/management, not storage.** Detailing & washing are
  *coordinated, not performed* in-house. Local Austin only; sales/acquisitions are nationwide.
- **Page transitions were intentionally removed** from the prototypes (navigation is plain; intro
  loaders play on full reload only). Design the production transition fresh if you want one — don't
  port a prototype transition. (See `design-language.md` → motion layer.)
- **Save/shortlist** on inventory was cut — don't rebuild unless asked (`routes-and-pages.md`).
- Replace the flagged **placeholders** before launch: unify the phone number, confirm email/address,
  fill full VINs server-side, and swap all striped photo placeholders for CMS-driven images
  (`README.md` → Known placeholders).

## Suggested stack (use the repo's existing stack if there is one)
Next.js (App Router) + TypeScript, Postgres (Supabase/Neon) + Prisma/Drizzle, object storage for
photos, Auth.js or Supabase Auth. Public routes SSR/ISR for SEO; `/admin` behind auth.

## Deliverables
1. **Production site** recreating every page in `routes-and-pages.md` at clean routes, pixel-faithful
   to the prototypes, using the shared components (Site Nav, Visit & FAQ, Feature Bar) and the
   reusable **ExpandingScrollBox** shell.
2. **Database + seed** from the current `data/*.js` (`listings`, `projects`, `sourced`, `settings`,
   plus `images` and `placements` relations) — see `admin-cms-build.md` §1.
3. **Admin/CMS** (`admin-cms-build.md`): login; full CRUD + publish + status + drag-reorder for
   listings, projects and sourced cars; per-record photo manager; and the **featured/placement
   managers** that let the owner pick and arrange which cars/projects appear in every marquee and
   preview and on which page.
4. **Forms** wired per `forms.md`; **SEO** per `seo-map.md` (semantic headings, meta, `LocalBusiness`
   + `Vehicle`/`Service` schema, SSR).

## Where to start
Follow `admin-cms-build.md` §6 build order (schema → seed → auth → CRUD → photos → placements → wire
public → settings → SEO). Confirm the stack and any open decisions with me before scaffolding.

Ask me for the real phone/email/address, VIN display policy, and the à-la-carte-vs-membership model
for Collection Management when you reach the parts that need them — don't invent them.
