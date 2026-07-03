# Red Box Motors — Routes & Pages

Every prototype file, its suggested production route, what it does, its data source, and the shared
components it mounts. Filenames at the project root use spaces / URL-encoding (`%20`, `%26`) for the
prototype environment — **production routes should be clean slugs** as below.

## Shared components (mount on many pages)
| Prototype | Role | Notes |
|---|---|---|
| `Site Nav.dc.html` | Fixed top nav (logo + division links) | Prop `current` highlights the active section. Pointer-events only on the interactive bits. |
| `Visit and FAQ.dc.html` | Closing section: map, FAQ accordion, contact, the *other* two division tiles, + Featured marquee | Prop `division` ("all"/"dealer"/"cosmetics"/"collection") filters which tiles show and which FAQ context. Appears at the bottom of most pages. |
| `Feature Bar.dc.html` | Sliding "Featured" marquee of for-sale + recent-work cards | Embedded inside Visit & FAQ (and the homepage dashboard). Pauses on hover. |

## Pages
| Prototype file | Production route | Purpose | Data | Mounts |
|---|---|---|---|---|
| `Red Box Motors Homepage.dc.html` | `/` | Hero + dashboard mosaic of the 3 divisions + utility tiles + Featured marquee. Scroll-scrub background. | inline featured list (mirror of listings/projects) | Feature Bar (inline) |
| `About Red Box Motors.dc.html` | `/about` | Brand story; division tiles; sticky contact. | — | Site Nav, Visit & FAQ (`all`) |
| `Contact.dc.html` | `/contact` | Contact details + inquiry form. | — | Site Nav. Form: see forms.md |
| `Dealer.dc.html` | `/dealer` | Dealer division landing. Hero → 3-tile showroom → **expanding-scroll-box overview** (manifesto, how-it-works, Sold / Sourced / For-sale previews, CTA, FAQ). | `data/listings.js`, `data/found.js`, `data/sold.js` (previews) | Site Nav, Visit & FAQ (`dealer`) |
| `Dealer Inventory.dc.html` | `/dealer/inventory` | For-sale roster + Showcase view; Coming Soon & Sold as separate boxes. | `data/listings.js` → `LISTINGS` | Site Nav, Visit & FAQ (`dealer`) |
| `Car Detail.dc.html` | `/dealer/inventory/[slug]` | Single listing: gallery + specs + inquiry + price. | `data/listings.js` → `getListing(slug)` | Visit & FAQ (`dealer`) |
| `Sourced.dc.html` | `/dealer/sourced` | "Cars We Found for Clients" gallery (not for sale). | `data/found.js` → `FOUND` | Site Nav, Visit & FAQ (`dealer`) |
| `Sold.dc.html` | `/dealer/sold` | "Cars We've Sold" gallery — past placements (not for sale). Mini-hero (faded photo) + 3-across grid + CTA. | `data/sold.js` → `SOLD` | Site Nav, Visit & FAQ (`dealer`) |
| `Cosmetics.dc.html` | `/cosmetics` | Cosmetics landing: hero → service mosaic → **expanding-scroll-box overview** (SEO copy, service links, Builds & transformations, CTA, FAQ). | `data/projects.js` (recent) | Site Nav, Visit & FAQ (`cosmetics`) |
| `PPF.dc.html` | `/cosmetics/ppf` | Service page — Paint Protection Film (STEK). **Full SEO scroll page** (no hero): expanding box, prose + inline photos, packages, CTA, FAQ. | — | Site Nav, Visit & FAQ (`cosmetics`) |
| `Ceramic & Correction.dc.html` | `/cosmetics/ceramic-correction` | Service page — ceramic + paint correction (Carbon Collective). Full SEO scroll page (as PPF). | — | Site Nav, Visit & FAQ (`cosmetics`) |
| `Vinyl.dc.html` | `/cosmetics/vinyl` | Service page — vinyl wrap / color change. Full SEO scroll page. | — | Site Nav, Visit & FAQ (`cosmetics`) |
| `Wheels.dc.html` | `/cosmetics/wheels` | Service page — wheel refinishing / powder coat. Full SEO scroll page. | — | Site Nav, Visit & FAQ (`cosmetics`) |
| `Custom Builds.dc.html` | `/cosmetics/custom-builds` | Service page — custom builds & modifications. Full SEO scroll page. | — | Site Nav, Visit & FAQ (`cosmetics`) |
| `Recent Work.dc.html` | `/cosmetics/work` | Mini-hero (faded photo) + 3-across gallery of cosmetics projects + rich CTA + inline FAQ. | `data/projects.js` → `recent()` | Site Nav, Visit & FAQ (`cosmetics`) |
| `Project Detail.dc.html` | `/cosmetics/work/[slug]` | Social-post-style project page: photo collage, narrative, details, SEO story. | `data/projects.js` → `getProject(slug)` | Visit & FAQ (`cosmetics`) |
| `Collection Management.dc.html` | `/collection` | Collection division. Hero → **expanding-scroll-box overview** (SEO copy, what-we-handle, membership vs à-la-carte, CTA, FAQ). | inline `SERVICES` | Site Nav, Visit & FAQ (`collection`) |
| `Style Guide.dc.html` | (internal, not shipped) | Living design-system reference. | — | — |

## Data modules (become DB tables / API)
| Module | Export(s) | Shape → table |
|---|---|---|
| `data/listings.js` | `LISTINGS`, `getListing(slug)`, `featured(n)` | **listings** — for-sale inventory (status: for-sale / coming-soon / sold) |
| `data/projects.js` | `PROJECTS`, `getProject(slug)`, `recent(n)` | **projects** — cosmetics recent work (drives Project Detail) |
| `data/found.js` | `FOUND`, `found(n)` | **sourced** — cars found for clients |
| `data/sold.js` | `SOLD`, `sold(n)` | **sold** — past placements (or a `status=sold` view of **listings**) |
| `data/bg.js` | `HEROES`, `pickHero()` | curated brand background set (config, not user content) |

Each content table gains an `images` relation (see admin-and-photos.md §3) replacing the
placeholder `photos: number` / `tag` fields.

## Shared page pattern: expanding scroll box + tint bands
Most division/service pages share one signature layout, worth building as a reusable shell:
- An outer **scroll-snap container** (`scroll-snap-type:y`) holds full-viewport sections.
- The final section is a **floating box** (`#0A0A0A`, big soft shadow, no border) that **expands to
  full-bleed as you scroll into it** and stays full — driven by an inner-scroll handler that grows
  the box `90%→100%` and fades its shadow (see `onBoxScroll` in the DCs). A side scroll-progress
  rail shows percent.
- Inside the box, content sections **alternate background** between base `#0A0A0A` and a subtle
  `#101010` band (with `box-shadow:inset 0 1px 0 rgba(255,255,255,0.03)`) so sections read as
  distinct instead of blending. Photos/CTA split-bands sit between as natural separators.
- Service pages (PPF/Ceramic/Vinyl/Wheels/Custom Builds) and About use this with **no hero** — they
  open straight into the box's faded mini-hero photo.
- Reveal-on-scroll: `[data-reveal]` elements fade/translate in via an IntersectionObserver rooted on
  the box. In production, gate on `prefers-reduced-motion`.

Build once as e.g. `<ExpandingScrollBox>` + `<TintSection tint?>` and reuse across Dealer,
Cosmetics, Collection, the 5 service pages, and About.

## Coming Soon / Sold
The Inventory page renders three groups: **for-sale roster**, **Coming Soon**, **Sold**. In the
prototype these come from `LISTINGS` (for-sale) plus inline `COMING_SOON` / `SOLD_LIST` arrays.
In production, fold all into the **listings** table with a `status` enum and filter by it.

## Inventory filter + sort (functional)
The Roster view has a working **filter + sort** bar: filter by make (chips, derived from the data),
sort by price (↓/↑), year, or mileage, with a live "N of 12 vehicles" count. The make filter also
applies to the Coming Soon / Sold sections and hides a section when it has no matches. It's
client-side state in the prototype. **In production:** drive it from URL query params
(`?make=porsche&sort=price-desc`) so filtered views are shareable and crawlable, and push the
filter/sort to the DB query for large inventories. Parse numeric price/mileage server-side rather
than from formatted strings.

## Save / shortlist
**Removed.** An earlier prototype had a save/shortlist toggle on inventory cards + Car Detail
(`localStorage` key `rbm:saved`). The owner cut this feature — do **not** rebuild it unless asked.
If revived later, persist per-account once auth exists, keyed by listing slug.
