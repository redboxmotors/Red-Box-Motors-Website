# Red Box Motors — Project Notes

Austin, TX automotive business near COTA. Three divisions: Cosmetics, Dealer, Collection Management.

## Copy / facts (confirmed by owner)
- **Collection Management is NOT storage.** It's management/concierge: concierge pickup/drop-off, maintenance & servicing (coordinated), battery & fluids (hands-on), pre-trip & track prep, transport & logistics. Detailing & washing are *coordinated, not performed* in-house. Local Austin only. Membership vs à-la-carte both shown (model undecided).
- **Cosmetics brands:** STEK (PPF + vinyl films), Carbon Collective (ceramic coatings).
- **No invented numeric claims** anywhere (no sales totals, warranty years, etc.) until real numbers are provided.
- Production SEO (semantic h1/h2, titles/meta, schema LocalBusiness, SSR) is a later Claude Code handoff pass — these are design prototypes.

## Design language
- Dark backgrounds: #000, #050505, #0A0A0A, #111, #161616, #1A1A1A. White primary text, #AAA secondary, #666 muted. Red #CC0000 logo/accent only.
- No rounded corners, no colored badges. Sharp edges. Typography: Archivo, weight 300–500, tight letter spacing.
- Tiles: full-bleed photo with text overlaid bottom-left over a gradient (363sudbury style). 6px gaps reveal blurred background so tiles read as floating cards.
- Hero pages: full-bleed photo, text bottom-left, scroll cue bottom-right. Homepage dashboard uses a shared fixed background image that blurs + dims on scroll (`applyScroll`). NOTE: Dealer hero was reverted to a plain photo hero (no blur/scrub) per owner — `applyScroll` there is now a no-op.
- Detail/utility pages float their content as a solid `#0A0A0A` card (big soft shadow, **no border**) over a blurred, dimmed fixed photo chosen at random per load (`data/bg.js` → `pickHero()`).
- **Hover/motion (site-wide):** one easing curve `cubic-bezier(.2,.8,.2,1)`. Tiles/cards lift on hover — `translateY(-5/6px) scale(~1.03)` + shadow bloom + `brightness(1.14)` + z-index raise (~240ms). Buttons lift `translateY(-2/3px)` (red CTAs get a red glow), press back to `scale(0.98)` on click. Grids inside `overflow:hidden`/scroll parents carry ~12px inner padding + ≥8px gaps so lifts don't clip.
- **Shared motion layer:** `assets/motion.js`, loaded from every page's helmet — page dissolve transitions between pages, universal `[data-reveal]` observer, `[data-counter]` count-ups, film-grain overlay, nav hover underline (`a[data-nav-u]` + `[data-nav-bar]`). Spec in `handoff/design-language.md`.

## Handoff package (production rebuild — read before any Claude Code build task)
The `handoff/` folder is the full brief for converting these `.dc.html` prototypes into a real Next.js + CMS site **without losing the look**. Start at `handoff/README.md`, then:
- `design-language.md` + `design-tokens.css` / `design-tokens.tailwind.js` — the visual system + copy-paste tokens, shadows, and the hover/motion spec.
- `routes-and-pages.md` — every page → production route, data source, shared components.
- `admin-and-photos.md` — the owner-run CMS + photo manager (why photos are CMS-backed, not hard-coded; focal-point cropping for tiles).
- `forms.md` — contact + listing inquiry forms (fields, validation, where leads go).
- `seo-map.md` — per-page title/meta/H1/schema (factual only).
- `migration-plan.md` — DC→React mapping, component inventory, build order.
- `Style Guide.dc.html` (project root) — a living visual reference of the system.

## Ideas / TODO (not yet built)
- (built) "Cars we found for clients" — now its own page `Sourced.dc.html` (3-across gallery) + a sliding teaser marquee in the Dealer page's "Sourced" section. Data in `data/found.js`.
- **Admin / CMS (Claude Code task, not a design prototype):** owner wants a back-office to add/edit/delete listings, recent-work projects, and sourced cars; reorder them; and choose what's featured + where. Maps onto the existing `data/*.js` shapes (`listings.js`, `projects.js`, `found.js`) — those become DB tables + an authed admin UI.
