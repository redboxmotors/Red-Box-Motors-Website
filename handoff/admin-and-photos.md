# Red Box Motors — Admin / CMS + Photo Management Spec

Handoff notes for the Claude Code production pass. These design prototypes (`*.dc.html`) define
the look; this document defines the back-office the owner runs day-to-day so adding/removing
content and photos never needs a developer.

---

## 1. Why a self-serve system (not hard-coded photos)

Inventory, recent-work projects, and sourced cars change constantly — this is ongoing
operations, not a one-time asset drop. Every new car/project = new photos. If image paths are
hard-coded, the owner needs a developer for each addition, which defeats the purpose. So:

- **Claude Code builds the plumbing** (upload, storage, editing UI) once.
- **The owner manages the photos** through that UI from then on.

---

## 2. Content photos vs. design photos (keep these separate)

| Type | Examples | Who manages | Where it lives |
|---|---|---|---|
| **Content photos** | Listing galleries, recent-work projects, sourced cars | Owner, forever, via CMS | DB rows + object storage |
| **Design photos** | Hero/brand backgrounds, division tiles | Developer, rarely changes | Repo / theme assets |

Keeping these split keeps the admin simple — the owner only ever touches content photos.

---

## 3. Data shapes the CMS maps onto

The prototypes already model the right shapes in `data/*.js`. Each becomes a DB table; the
placeholder `photos: number` becomes a real ordered list of image records.

- `data/listings.js` → **listings** (dealer inventory) — status: for-sale / coming-soon / sold.
- `data/projects.js` → **projects** (cosmetics recent work) — drives the new Project Post page.
- `data/found.js` → **sourced** (cars found for clients).

**Add an `images` relation to each** (replacing the `photos` count + `tag` placeholder):

```
image {
  id
  parentType   'listing' | 'project' | 'sourced'
  parentId
  url          // storage URL (full-size)
  thumbUrl     // generated derivative
  alt          // SEO alt text (owner-editable, defaults from car + service)
  focalX,focalY // 0..1 — see §5
  order        // int, drag-to-reorder
  isHero       // exactly one per parent = the lead/primary image
}
```

---

## 4. Admin UI — capabilities

Per the project TODO (back-office for listings, projects, sourced):

- **CRUD** each record; set status (for-sale / coming-soon / sold) on listings.
- **Reorder** records and choose **featured + placement** (what shows in the Feature Bar marquee
  and homepage dashboard).
- **Photo manager per record:**
  - Drag-and-drop **upload** (multiple), with progress; stored in object storage
    (S3 / Cloudflare R2 / Supabase Storage). Generate a thumbnail derivative on upload.
  - **Reorder** photos (drag); **pick the hero** (the lead image).
  - **Delete / replace** a photo.
  - Edit **alt text** per photo (SEO; default it from `{year} {make} {model} — {service}, Austin TX`).
  - **Focal point** picker (see §5).
- Auth (single owner role is enough to start).

---

## 5. Focal point / crop — required for the tile + post layouts

The site's signature tiles overlay text **bottom-left over a gradient**, and the new Project Post
page leads with a 3:2 hero + a 4:3 two-up gallery. A photo with a busy bottom-left, or one cropped
badly to those ratios, breaks the layout.

So the photo manager must let the owner **set a focal point** (click the subject on the image,
store `focalX/focalY` 0..1). The front-end renders `object-fit:cover` +
`object-position: calc(focalX*100%) calc(focalY*100%)` so every photo crops cleanly into any
aspect box. This is lighter than a full crop tool and covers 95% of cases; a fixed-aspect crop
tool can come later if needed.

---

## 6. Front-end wiring (when prototypes become production components)

- Replace each striped `repeating-linear-gradient` placeholder + `[ tag ]` label with a real
  `<img>` (hero) / `<img>` grid (gallery), driven by the `images` relation, ordered by `order`,
  hero first.
- `alt` from the DB; `object-position` from focal point.
- Pages that consume images today: **Car Detail**, **Project Detail** (new social-post layout),
  **Dealer Inventory**, **Sourced**, **Recent Work**, division tiles in **Visit and FAQ** /
  **Feature Bar**.
- Production SEO pass (separate, already noted): semantic h1/h2 (the Project Post page is already
  structured this way), titles/meta, `LocalBusiness` + `Vehicle`/`Service` schema, SSR.

---

## 7. Workflow summary

1. Finalize the look in the prototypes here.
2. Hand off once: Claude Code converts DCs → production components, builds the CMS + photo manager,
   wires storage.
3. Owner runs the admin day-to-day — adds cars, projects, sourced placements, and photos; sets
   hero + focal point + featured placement. **No round-trip back to the design environment.**
