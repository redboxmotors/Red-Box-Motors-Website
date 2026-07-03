# Red Box Motors — Design Language

The rules that make the site feel like Red Box. Keep these intact through the React rebuild. If a
new component doesn't follow these, it's wrong even if it "works."

---

## 1. Tone & posture
Quiet, confident, mechanical. The cars and the photography are the loudest things on the page; the
UI gets out of the way. Lots of black, sharp edges, thin type, one red accent. Nothing playful, no
rounded "friendly" UI, no badges, no gradients-as-decoration.

---

## 2. Color
Dark, near-black neutrals with a single red accent. **Never introduce new hues.**

| Role | Values |
|---|---|
| Page black / seams | `#000`, `#050505` |
| Surfaces (cards, tiles) | `#0A0A0A`, `#0c0c0c`, `#0d0d0d`, `#0E0E0E` |
| Raised / hover surface | `#111`, `#121212`, `#131313`, `#161616` |
| Placeholder stripe | `#171717` / `#101010` (135° repeating) |
| Hairlines / borders | `#1a1a1a`, `#1c1c1c`, `#222`, `#2a2a2a`, `#333` |
| Text primary | `#fff` |
| Text secondary | `#dcdcdc`, `#ccc`, `#aaa` |
| Text muted | `#888`, `#777`, `#666` |
| Text faint / placeholder | `#555`, `#3a3a3a`, `#383838`, `#2f2f2f` |
| **Accent (red)** | `#CC0000` — logo block, active dots, one-per-view emphasis, primary CTAs |

Red is a spice, not a sauce: a 5–7px square, an active indicator, a single button. Never large red
fills beyond a CTA.

---

## 3. Typography
**Archivo** (Google Fonts), weights **300 / 400 / 500 / 600 / 700** (700 added for the bold display
direction). Tight tracking on headings, wide tracking on small uppercase labels. Monospace (system
mono) is used *only* for small technical captions (photo counts, spec tags, "[ placeholder ]" art
labels).

The type is intentionally **bold and thick** — display and headings carry real weight, labels are
heavy, and body sits at medium (never thin). Scale:

| Use | Size | Weight | Tracking |
|---|---|---|---|
| Hero H1 | 64–78px | 600–700 | `-0.03em` to `-0.04em` |
| Page / panel title | 30–48px | 600 | `-0.02em` to `-0.03em` |
| Card title | 19–34px | 600 | `-0.02em` to `-0.025em` |
| Section label (uppercase) | 11–13px | 700 | `2–3px`, `text-transform:uppercase` |
| Eyebrow / small label | 10–12px | 600 | `2px`, often uppercase |
| Body | 13–16px | 500 | normal, `line-height 1.5–1.8` |
| Mono caption | 9–11px | — | `1–2px` |

Weight migration applied site-wide: `300→600`, `400→500`, `500→700`, `600→700`. (The Style Guide's
biggest hero is 700; most other heros are 600.)

Always `-webkit-font-smoothing:antialiased`. Use `text-wrap:pretty` on paragraphs and long titles.

---

## 4. Layout patterns
Reuse these; don't invent new ones.

- **Tile (the signature element).** Full-bleed photo, dark gradient scrim from the bottom, text
  overlaid **bottom-left**. A small category chip top-left, an arrow glyph top-right. Tiles sit in
  grids with thin seams (`gap:2px`, or `6px` on the homepage mosaic) so the dark background reads
  between them like floating cards. On hover the meta/specs row fades up from `translateY(10px)`.
- **Hero.** Full-bleed photo, content **bottom-left** (kicker → H1 → one line of subcopy), a
  "Scroll" cue bottom-right. Landing/homepage heroes use the **scroll-scrub background** (§6).
- **Floating card.** A solid `#0A0A0A` panel with a big soft shadow and **no border**, centered on
  a blurred photo background. Used on detail/utility pages. Section sub-blocks (e.g. Inventory's
  Coming Soon / Sold) are separate shadowed boxes with transparent gaps so the background shows
  between them.
- **Scroll-snap sections.** Many pages are full-height `scroll-snap-align:start` sections with a
  thin animated scroll cue and (on Collection) a right-edge section indicator.
- **Two-column content.** Detail pages lead with a photo collage (big hero + 4-up), then info in a
  `1.5fr / 1fr` grid (narrative left, details + CTA right), then a wide closing photo.

---

## 5. Components & ornaments
- **Logo block:** white "RED BOX MOTORS" on a `#CC0000` square, `letter-spacing:2.5px`, weight 600.
- **Red square bullet:** 5–7px `#CC0000` square (never a round dot) for list/emphasis marks.
- **Arrow glyph:** the diagonal "↗" (`M4 12L12 4…`) for "go to / open"; the chevron for back/scroll.
- **Chips:** thin 1px-border boxes, uppercase mono/!label text. No fill, no rounding.
- **Placeholder art:** 135° repeating stripe + a centered mono `[ label ]`. This is where real
  photos go — every one is CMS-backed.

**No rounded corners anywhere.** No colored badges. No drop-shadow on text except the subtle hero
`text-shadow` for legibility over photos.

---

## 6. Background system
Two related treatments — keep both:

- **Static blurred hero (detail/utility pages):** a `position:fixed` `<img>` covering the viewport,
  `filter:blur(30px) brightness(0.62) saturate(1.08)`, `transform:scale(1.12)`, with a
  `linear-gradient(180deg, rgba(6,6,6,.32), rgba(6,6,6,.62))` dim over it. The page content sits in
  a `position:relative; z-index:1` layer above it. The image is chosen at random per load from a
  shared pool (`data/bg.js` → `pickHero()`); in production this becomes a curated set of brand
  shots.
- **Scroll-scrub hero (homepage + division landings):** the fixed hero starts sharp and, as the
  user scrolls, blurs and dims while the foreground panel scales/fades in. Driver: an `applyScroll(p)`
  function, `p` = scrollTop / viewportHeight, mapping to `blur(0→24px)`, `brightness(0.9→0.78)`,
  `scale(1→1.07)`. (Note: the Dealer hero was intentionally reverted to a plain photo hero — its
  `applyScroll` is a no-op. Preserve that choice.)

---

## 7. Motion & hover (the "satisfying" spec)
One easing curve everywhere: **`cubic-bezier(.2,.8,.2,1)`** (a smooth, slightly overshooting
ease-out). Everything interactive lifts toward the viewer and casts a deeper shadow.

**Tiles & cards (hover):**
- `transform: translateY(-5px to -6px) scale(1.014–1.03)` (bigger scale for smaller tiles)
- `box-shadow: 0 22–24px 44–50px rgba(0,0,0,0.6)` (+ a tighter second layer on grids)
- `filter: brightness(1.14–1.16)`
- raise `z-index` so the hovered tile floats above neighbors
- `transition: transform 240ms, box-shadow 240ms, filter 240ms` (all on the curve)

**Buttons / CTAs (hover):**
- `transform: translateY(-2px to -3px)` (no scale-up)
- red CTAs: `box-shadow: 0 14–16px 30–34px rgba(204,0,0,0.34–0.36)` (red glow)
- outline/ghost CTAs: `box-shadow: 0 12px 26px rgba(0,0,0,0.5)`, plus the existing border/bg shift
- `transition: ~220ms` on the curve

**Active / press (all interactives):** `transform: translateY(0) scale(0.98)` — a quick settle back.

**Nav links:** color to `#fff` + a 1px rise (`translateY(-1px)`).

**Clipping rule:** any grid/list inside an `overflow:hidden` (or scroll) parent must have ~8–12px
inner padding (and ≥8px grid gap) so the lift + shadow aren't cut at the edge. The prototypes
already do this on the Inventory/Recent Work/Sourced grids — keep it.

**Entrances:** subtle only — `fadeUp` (opacity + `translateY(14–20px)`), `panelIn` (opacity +
`scale(0.985)`), 400–800ms, used once on mount. Marquees use a long linear `translateX` loop that
pauses on hover.

---

## 8. Accessibility / production notes
- Respect `prefers-reduced-motion`: drop the lifts, scrubs, and marquee animation to simple
  opacity/no-motion. (Prototypes don't gate this yet — add it in the rebuild.)
- Hit targets ≥ 44px on touch.
- Real `<img>` needs `alt` from the CMS; the decorative fixed background `<img>` keeps `alt=""`.
- Tile text-over-photo needs the gradient scrim for contrast — keep it on every photo tile.


## Site-wide motion layer (`assets/motion.js`)
Loaded from every page's helmet (one plain script, no dependencies). Port as a small client module in production. Features:
- **Page transition:** none. Page transitions were intentionally removed from the prototype (no dissolve, no swipe, no click interception) and the intro loaders are hidden site-wide — navigation is plain. Design/implement the production transition fresh in code; do not port a transition from the prototype.
- **Universal reveals:** viewport-rooted IntersectionObserver reveals any `[data-reveal]` (opacity 1 / transform none) — complements per-page observers.
- **Counters:** `[data-counter="3" data-pad="2"]` counts up over ~900ms (cubic ease-out) when it enters the viewport.
- **Film grain:** fixed SVG-noise overlay, `opacity:.05`, `mix-blend-mode:overlay`, above content, below the page-fade layer.
- **Nav underline:** `a[data-nav-u]` links animate a 1px `#CC0000` bar (`[data-nav-bar]` child) — sweeps in from the left on hover, exits to the right; the active link's bar stays on (`data-active="1"`).
All effects honor `prefers-reduced-motion`.