# Red Box Motors — Handoff Package

This folder is the brief for the production rebuild (Next.js + CMS) in Claude Code. The
`*.dc.html` files at the project root are the **approved design prototypes**; these docs tell you
how to turn them into a real, SEO-driven, owner-maintainable site **without losing the look or
feel**.

> **Handing off?** Start with **`CLAUDE-CODE-PROMPT.md`** — a paste-ready kickoff prompt for Claude
> Code that points at everything below in the right order.

Read in this order:

1. **design-language.md** — the visual system: palette, type, layout patterns, and the
   hover/motion spec. The non-negotiables that make it feel like Red Box.
2. **design-tokens.md** — the same system as copy-paste values: CSS custom properties, a Tailwind
   config block, and the motion curves/shadows.
3. **routes-and-pages.md** — every page, its production route, what it does, its data source, and
   the shared components it mounts.
4. **admin-and-photos.md** — the owner-run CMS + photo manager (the reason photos are *not*
   hard-coded). Already written; still current.
5. **admin-cms-build.md** — the full admin build spec: **login/auth, full editability of every
   listing / project / sourced car, drag-reorder, and the featured/placement system that chooses
   which page each item appears on.** Read alongside admin-and-photos.md.
6. **forms.md** — the contact/inquiry forms: fields, validation, and where submissions go
   (decisions flagged for the owner).
7. **seo-map.md** — per-page `<title>`, meta description, H1, and schema type. The SEO pass.
8. **migration-plan.md** — how a `.dc.html` Design Component maps to a React/Next component, plus a
   suggested build order.

There is also a visual reference at the project root: **`Style Guide.dc.html`** — a living
style-guide page that renders the real tokens and components (palette, type scale, tiles, buttons
with the hover). Open it to *see* the canonical look in one place.

## Ground rules carried over from CLAUDE.md
- **No invented numbers or claims** (sales totals, warranty years, etc.) until the owner provides
  real figures.
- **Collection Management is concierge/management, not storage.** Detailing & washing are
  *coordinated, not performed* in-house. Local Austin only; sales/acquisitions are nationwide.
- Sharp edges, dark palette, red `#CC0000` as accent only, Archivo type. See design-language.md.

## Known placeholders to replace before launch
- **Phone is inconsistent**: Contact shows `(512) 555-0123`, Visit & FAQ shows `(512) 555-0199`.
  Pick one real number and make it a single source of truth (env/config).
- **Email** `hello@redboxmotors.com`, **address** "Austin, TX · near COTA" — confirm real values
  (needed for `LocalBusiness` schema).
- **All gallery photos** are striped placeholders — filled via the CMS (admin-and-photos.md).
- **VINs** in `data/listings.js` are truncated with `···` — store full VINs server-side; decide
  whether to display them publicly.
