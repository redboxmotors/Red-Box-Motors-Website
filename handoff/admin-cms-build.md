# Red Box Motors — Admin / CMS Build Spec

The owner must be able to run the whole site's content without a developer: **add / edit / delete
any car listing, recent-work project, or sourced car; upload and arrange its photos; reorder
everything; mark things featured; and choose which page(s) each item appears on** — all behind a
login.

This doc is the build spec for that back-office. It sits on top of two existing docs:
- **`admin-and-photos.md`** — the per-record **photo manager** (upload, reorder, hero, focal point,
  alt text) and the content-vs-design photo split. Still current; build it as described there.
- **`routes-and-pages.md`** — the public pages and which data feeds each.

Everything here is the *plumbing Claude Code builds once*; the owner uses it forever after.

---

## 0. Stack (suggested, not mandatory)
- **Next.js (App Router) + TypeScript**, server components + server actions.
- **Postgres** (Supabase or Neon). **Prisma** or Drizzle for the schema below.
- **Object storage** for photos (Supabase Storage / Cloudflare R2 / S3) + an on-upload thumbnail
  derivative.
- **Auth:** Auth.js (NextAuth) or Supabase Auth. Single **owner** role is enough to launch;
  leave room for an **editor** role.
- Public site is SSR/ISR for SEO; `/admin` is client-interactive behind auth.

Match whatever the target repo already uses if one exists — these are defaults for a greenfield build.

---

## 1. Entities (from `data/*.js`)

Each content module becomes a table. Fields below are the **exact** shapes the prototypes bind to
(see the data files); add the operational columns in **bold**.

### `listings` (Dealer inventory) — from `data/listings.js`
`id, slug, year, make, model, price, mileage, exterior, interior, engine, transmission, vin`
- **`status`** enum: `for_sale | coming_soon | sold` (folds in the prototype's inline
  `COMING_SOON` / `SOLD_LIST` — see routes-and-pages.md "Coming Soon / Sold").
- **`eta`** (string, only for `coming_soon`, e.g. "July", "In transit").
- **`published`** bool, **`featured`** bool, **`order`** int (manual sort within its gallery).
- Store **full VIN** server-side; a **`vinPublic`** bool decides whether it renders publicly
  (prototype truncates with `···`).
- Parse **numeric** `priceValue` / `mileageValue` server-side for sort/filter (don't sort the
  formatted strings).
- `images[]` relation (see admin-and-photos.md §3) replaces `photos: number`.

### `projects` (Cosmetics recent work) — from `data/projects.js`
`id, slug, title, vehicle, make, category, services[], finish, duration, year, coverage,
location, summary, scope[]`
- **`published`** bool, **`featured`** bool, **`order`** int.
- `images[]` replaces `photos` + `tag`.

### `sourced` (Cars found for clients) — from `data/found.js`
Fields per `data/found.js` (`make, model, client, tag, …`).
- **`published`** bool, **`featured`** bool, **`order`** int.
- `images[]` replaces the placeholder.

> `sold` can be its own table **or** just a `status=sold` view of `listings` (preferred — one place
> to manage a car through its whole life: coming soon → for sale → sold).

### `settings` (single row / key-value) — replaces hard-coded contact info
`phone, email, addressLine, hoursJson, mapEmbedUrl` — the single source of truth the README flags
(phone is inconsistent across prototypes; unify it here). Consumed by Contact, Visit & FAQ, footer,
and `LocalBusiness` schema.

---

## 2. The "featured / placement" system  ← the core of the ask

There are two kinds of surface on the site. Model both.

### 2a. Query-driven galleries (automatic — just order + status + published)
These show *everything* in a table, filtered by status/published and sorted by `order` (then a
sensible default). No curation UI needed beyond the per-item toggles.

| Surface | Feed |
|---|---|
| `/dealer/inventory` roster | `listings` where `status=for_sale`, `published` |
| Inventory "Coming Soon" group | `listings` where `status=coming_soon` |
| Inventory "Sold" group + `/dealer/sold` | `listings` where `status=sold` |
| `/dealer/sourced` | all `sourced`, `published` |
| `/cosmetics/work` (Recent Work) | all `projects`, `published` |

### 2b. Curated placement slots (hand-picked — pick / reorder / toggle)
These are the marquees and previews where the owner chooses *exactly* which cards appear and in what
order. Model as one **`placements`** table:

```
placement {
  id
  surface     enum   // slot key, see table below
  itemType    enum   // 'listing' | 'project' | 'sourced'
  itemId      fk
  order       int    // drag-to-reorder within the slot
  enabled     bool
}
```

| `surface` key | Where it renders (prototype) |
|---|---|
| `home_featured` | Homepage "Featured right now" marquee (mix of for-sale + recent work) — today an inline array |
| `feature_bar` | The sliding **Feature Bar** marquee (embedded in Visit & FAQ + homepage) |
| `dealer_forsale_preview` | Dealer landing → "Cars currently for sale" preview grid |
| `dealer_sold_preview` | Dealer landing → "Cars we've sold" preview |
| `dealer_sourced_preview` | Dealer landing → "Cars we found for clients" preview |
| `cosmetics_builds_preview` | Cosmetics landing → "Builds & transformations" preview |

Rules:
- A slot with **no** placement rows falls back to a sensible auto-query (e.g. newest N `featured`
  items of the right type) so the site is never empty before the owner curates.
- Deleting/unpublishing an item cascades: hide it from every slot automatically.
- Mixed-type slots (`home_featured`, `feature_bar`) accept both listings and projects; the picker
  filters by type where a slot is single-type.

This is what lets the owner **"choose what page a car shows up on"**: it's either a status/publish
toggle (query-driven galleries) or adding it to one or more placement slots (curated marquees) —
both surfaced in the item editor as **"Show on"** checkboxes plus dedicated slot managers.

---

## 3. Admin UI

Protected under `/admin/*` (see §5). Dark, sharp-edged, Archivo — reuse the design tokens so the
back-office feels on-brand, but it prioritizes clarity over the marketing polish.

### 3a. Login  (`/admin/login`)
- Email + password (hashed) **or** magic-link, owner's choice of provider. Session cookie.
- Failed-login throttle; "forgot password" if using passwords.
- After login → **Dashboard**.

### 3b. Dashboard  (`/admin`)
- Counts: listings by status, projects, sourced, unpublished drafts, photos pending.
- Quick "＋ New listing / project / sourced" and links to each manager and slot manager.

### 3c. Content managers  (`/admin/listings`, `/admin/projects`, `/admin/sourced`)
List view (one row per record):
- Thumbnail (hero image), key fields, **status** pill, **published** toggle, **featured** star.
- **Drag handle** to reorder (writes `order`).
- Row actions: **Edit**, **Duplicate**, **Delete** (soft-delete + confirm).
- Filter/search (by make, status, text) and the same sort options as the public roster.

Editor (`/admin/listings/[id]` etc.) — **every field is editable**:
- All content fields from §1 (typed inputs; `services[]`/`scope[]` as add/remove chip lists;
  `status` + `eta` for listings).
- **Photo manager** (from admin-and-photos.md): drag-upload, reorder, pick **hero**, **focal
  point**, **alt text**, delete/replace.
- **Publish** toggle + **Featured** toggle.
- **"Show on" placements:** checkboxes for each eligible slot (§2b) — checking one creates/removes a
  `placement` row; a small "position" hint shows where it lands (end of slot; reorder in the slot
  manager).
- Live **SEO preview** (title/meta/H1) and the public URL/slug (editable slug with uniqueness check).
- Save via server action; optimistic UI; validation errors inline.

### 3d. Placement / "Featured" managers  (`/admin/placements/[surface]`)
One screen per curated slot (§2b). This is the **drag-to-arrange** curation surface:
- Ordered list of the cards currently in the slot, each with thumbnail + title + enable toggle +
  remove.
- **Drag to reorder** (writes `order` within the slot).
- **"＋ Add"** opens a picker (search the eligible tables, filtered by the slot's allowed types).
- Empty-state explains the auto-fallback (§2b).

### 3e. Settings  (`/admin/settings`)
- The `settings` row: phone, email, address, hours, map embed. One source of truth for the whole
  site + schema. Validate phone/email format.

---

## 4. Public-site wiring
- Replace every striped `repeating-linear-gradient` placeholder + `[ tag ]` label with real
  `<img>`s driven by the `images` relation (hero first, ordered by `order`), `alt` from DB,
  `object-position` from focal point (admin-and-photos.md §5, §6).
- Query-driven galleries read their table with the status/publish filter; curated marquees read
  `placements` for their `surface` (falling back to the auto-query when empty).
- Inventory filter/sort → URL query params, pushed to the DB query (routes-and-pages.md).
- Revalidate the affected public routes on any admin write (ISR `revalidatePath` / tag-based).

---

## 5. Auth & security
- All `/admin/*` routes and server actions behind an auth check (middleware + per-action guard —
  never trust the client). Single **owner** role now; **editor** role reserved.
- Photo uploads: validate type/size server-side, store outside the web root, serve via storage URLs;
  generate thumbnails server-side.
- Rate-limit login and the public contact/inquiry forms (see forms.md); add CSRF protection on
  mutations.
- Full VINs and any private lead data are server-only; never ship them to the public bundle unless a
  `*Public` flag says so.

---

## 6. Build order (admin portion)
1. Schema + migrations for the tables in §1 (+ `images`, `placements`, `settings`).
2. Seed from the current `data/*.js` so the site has real rows immediately.
3. Auth + `/admin` shell + Dashboard.
4. Content managers (list + editor) **without** photos → prove CRUD + publish + status + reorder.
5. Photo manager (admin-and-photos.md) wired to storage.
6. Placement/featured slot managers + "Show on" toggles.
7. Point every public gallery/marquee at the DB; delete the `data/*.js` mocks.
8. Settings + swap all hard-coded contact info to the `settings` row.
9. SEO pass (seo-map.md) + `revalidate` on writes.
