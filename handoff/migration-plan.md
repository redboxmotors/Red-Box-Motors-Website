# Red Box Motors — Migration Plan (Prototype → Production)

How to turn these Design Component (`.dc.html`) prototypes into a production Next.js app without
losing the look. The prototypes are the **source of truth for design**; this plan is the route from
there to a real, SEO-driven, owner-maintainable site.

---

## 1. Target stack (recommended)
- **Next.js (App Router) + React + TypeScript** — SSR/SSG for SEO (seo-map.md).
- **Tailwind** seeded from `handoff/design-tokens.tailwind.js` (or plain CSS from
  `design-tokens.css`). Either way, **inline-style values become tokens/classes 1:1**.
- **Database + storage** for content & images (Supabase / Postgres + S3-compatible storage). The
  `data/*.js` modules already document the exact shapes (routes-and-pages.md §Data).
- **Admin/CMS** per `admin-and-photos.md` (owner manages listings, projects, sourced, photos).
- **Email/leads** per `forms.md`.

---

## 2. How a DC maps to a React component
A `.dc.html` file is one document with three parts — they translate cleanly:

| DC concept | Becomes |
|---|---|
| `<x-dc>` template markup (inline styles) | JSX with `className`s (Tailwind) or `style` objects. Inline-style values map directly to tokens. |
| `renderVals()` returning values/handlers | component props + local state + `useMemo`/handlers |
| `state` / `setState` / lifecycle | `useState` / `useEffect` |
| `<sc-for list as>` | `.map()` |
| `<sc-if value>` | conditional render (`{cond && …}`) |
| `<dc-import name="X" …>` | a React `<X />` component (Site Nav, Visit & FAQ, Feature Bar) |
| `style-hover` / `style-active` | Tailwind `hover:` / `active:` variants (or CSS) — values in design-tokens |
| `data/*.js` `import()` | server data fetch (RSC / loader) returning the same shape |
| `data-screen-label` | not needed in prod (was for prototype comments) |

**Keep the literal numbers.** Every shadow, blur, easing curve, gap and color in the prototypes is
intentional and captured in the tokens — port them exactly rather than "cleaning up."

---

## 3. Component inventory (build these once, reuse)
- **`<SiteNav current>`** — fixed top nav. From `Site Nav.dc.html`.
- **`<VisitAndFAQ division>`** — map + FAQ accordion + contact + other-division tiles + Featured
  marquee. From `Visit and FAQ.dc.html`. Mounts on most pages.
- **`<FeatureBar>`** — sliding marquee of featured listings + projects. From `Feature Bar.dc.html`.
- **`<Tile>`** — the signature photo tile (scrim + bottom-left text + hover lift). Used by Inventory,
  Recent Work, Sourced, dashboards. Variants: car, project, sourced, division.
- **`<FloatingCard>`** — solid panel + big shadow, no border, over the blurred background.
- **`<BlurredBackground>`** — fixed `<img>` + dim layer; static (detail pages) and scroll-scrub
  (homepage/landings) modes. Wraps the `applyScroll` logic.
- **`<RedButton>` / `<GhostButton>`** — the two CTA styles with the canonical hover.
- **`<Gallery>`** — Car Detail's thumb-strip gallery; Project Detail's collage (hero + 4-up + wide).
- **`<ScrollSnapSections>` + `<SectionDots>`** — Collection-style snap nav.
- **`<ExpandingScrollBox>`** — the signature floating box that expands to full-bleed as you scroll in
  and stays full (fades its shadow; side progress rail). Wraps the `onBoxScroll` logic. Used by
  Dealer, Cosmetics, Collection, the 5 service pages, and About.
- **`<TintSection tint?>`** — a content band inside the box; `tint` renders the subtle `#101010`
  band (+ inset top highlight) vs base `#0A0A0A`. Alternate to keep sections from blending.
- **`<RevealOnScroll>`** — wrapper for `[data-reveal]` fade/translate-in (IntersectionObserver).
  Gate on `prefers-reduced-motion` in prod.

---

## 4. Suggested build order
1. **Foundation:** Next app, Tailwind tokens, Archivo font, global background + nav + footer
   (Visit & FAQ) shells. Verify the *feel* (hover, shadows, blur) against `Style Guide.dc.html`.
2. **Static pages:** Home, About, the 5 Cosmetics service pages, Collection, Contact (form UI).
   These are mostly layout + copy.
3. **Data layer:** stand up the DB + the content tables (listings, projects, sourced, **sold**) + the
   `images` relation; seed from `data/*.js`.
4. **Dynamic content:** Inventory (+ status groups), Car Detail, Recent Work, Project Detail,
   Sourced, **Sold** — wired to the DB. Add SEO metadata + schema (seo-map.md).
5. **Forms + leads** (forms.md): wire Contact + listing inquiry to email/`leads`.
6. **Admin/CMS** (admin-and-photos.md): upload, reorder, hero pick, focal point, featured
   placement, status.
7. **Polish:** `prefers-reduced-motion`, sitemap/robots, OG images, performance (image sizes from
   focal-point crops), analytics.

---

## 5. Gotchas carried from the prototypes
- **Background photos are random per load** via `pickHero()` — in production, make the set curated
  brand shots (config), not user content. Keep the blur/dim values.
- **Dealer hero is intentionally a plain photo hero** (no scroll-scrub) — its `applyScroll` is a
  no-op on purpose. Don't "fix" it.
- **Collection shows both membership and à-la-carte** with a "still shaping our plans" note — the
  model is undecided. Keep both until the owner decides (forms/CLAUDE.md).
- **Lifted tiles need padded parents** so the hover lift/shadow isn't clipped by `overflow:hidden`
  scroll containers — preserve the ~12px grid padding + ≥8px gaps.
- **No invented numbers** anywhere — see seo-map.md and CLAUDE.md.
- **Placeholder contact details disagree** (two phone numbers) — single source of truth in config.
- **Sold is its own page + module now** (`Sold.dc.html`, `data/sold.js`) — in production fold it into
  the **listings** table as a `status=sold` view, or keep a dedicated **sold** table; either way the
  Dealer overview pulls Sold / Sourced / For-sale previews from these three sources.
- **The save/shortlist feature was removed** — don't rebuild it (see routes-and-pages.md).
- **Expanding-scroll-box + alternating tint bands** is the shared page shell (routes-and-pages.md) —
  build it once; the box-expand and reveal animations must respect `prefers-reduced-motion`.
