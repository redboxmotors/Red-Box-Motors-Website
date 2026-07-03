# Red Box Motors — SEO Map

Per-page metadata for the production pass. **Factual only** — no invented numbers, ratings, or
claims (CLAUDE.md rule). Titles target how people actually search ("PPF Austin", "{car} for sale").
Descriptions are ≤ ~155 chars. Replace `redboxmotors.com` with the real domain.

## Global
- **Brand:** Red Box Motors — Austin, TX (near Circuit of the Americas).
- **Title pattern:** `{Page} — Red Box Motors | Austin, TX` (home is just the brand line).
- **Org schema (site-wide):** `LocalBusiness` (or `AutomotiveBusiness`) with real name, address,
  geo, phone, hours, `sameAs` socials. ⚑ needs real address/phone/hours.
- **OpenGraph/Twitter:** per page, image = the page's hero/lead photo (from CMS); fall back to a
  brand image. `og:type` = `website` (content pages: `article` for project posts).
- **Canonical** on every page; one H1 per page (already structured this way in the prototypes).
- Generate `sitemap.xml` + `robots.txt`; SSR/SSG every content route so listings/projects are
  crawlable.

## Pages
| Route | `<title>` | Meta description | H1 | Schema |
|---|---|---|---|---|
| `/` | `Red Box Motors — All Things Automotive | Austin, TX` | Cosmetics, sales and collection management for serious cars in Austin, Texas — minutes from Circuit of the Americas. | All Things Automotive | `LocalBusiness` |
| `/about` | `About — Red Box Motors` | One Austin facility for cosmetics, dealer sales and collection management, near COTA. | About Red Box Motors | `AboutPage` |
| `/contact` | `Contact — Red Box Motors | Austin, TX` | Reach Red Box Motors for cosmetics, buying/selling or collection management in Austin, TX. | Let's talk about the car. | `ContactPage` |
| `/dealer` | `Dealer — Private Car Sales & Acquisitions | Red Box Motors` | Private sales, acquisitions and consignment of exceptional cars — nationwide, from Austin, TX. | (dealer hero H1) | `AutoDealer` |
| `/dealer/inventory` | `Inventory for Sale — Red Box Motors` | Browse exceptional cars for sale at Red Box Motors, Austin, TX. Sales and acquisitions nationwide. | Inventory | `ItemList` of `Vehicle`/`Car` |
| `/dealer/inventory/[slug]` | `{Year} {Make} {Model} for Sale — Red Box Motors` | {Year} {Make} {Model} for sale at Red Box Motors, Austin, TX — {mileage}, {exterior}. Inquire today. | {Make} {Model} | `Car` (name, brand, mileage, color, vehicleEngine, vehicleTransmission, offers→price/availability) |
| `/dealer/sourced` | `Cars We Found for Clients — Red Box Motors` | Off-market and pre-allocation cars we've sourced and acquired for buyers nationwide. | Cars We Found for Clients | `CollectionPage` |
| `/cosmetics` | `Cosmetics — PPF, Ceramic, Vinyl & Wheels | Red Box Motors` | Paint protection, ceramic coating, paint correction, vinyl wrap and wheel refinishing in Austin, TX. | Finish First | `Service` |
| `/cosmetics/ppf` | `Paint Protection Film (PPF) Austin — Red Box Motors` | Self-healing STEK paint protection film — full-body and high-impact packages in Austin, TX. | Invisible Armor | `Service` |
| `/cosmetics/ceramic-correction` | `Ceramic Coating & Paint Correction Austin — Red Box Motors` | Multi-stage paint correction and Carbon Collective ceramic coatings in Austin, TX. | (page H1) | `Service` |
| `/cosmetics/vinyl` | `Vinyl Wrap & Color Change Austin — Red Box Motors` | Color-change and custom vinyl wraps — reversible and paint-safe, in Austin, TX. | (page H1) | `Service` |
| `/cosmetics/wheels` | `Wheel Refinishing & Powder Coat Austin — Red Box Motors` | Strip, powder coat and custom wheel finishes in Austin, TX. | (page H1) | `Service` |
| `/cosmetics/custom-builds` | `Custom Builds & Modifications — Red Box Motors` | Custom builds, aero, wheels and modifications, executed end to end in Austin, TX. | (page H1) | `Service` |
| `/cosmetics/work` | `Recent Work — Cosmetics | Red Box Motors` | Recent PPF, ceramic, wrap, wheel and custom-build projects from Red Box Motors, Austin, TX. | Recent Work | `CollectionPage` |
| `/cosmetics/work/[slug]` | `{Project Title} — {Vehicle} | Red Box Motors` | {summary, trimmed to ~155 chars}. {Service} on a {Vehicle} in Austin, TX. | {Project Title} | `Article`/`CreativeWork` (+ `about` → the vehicle; `image` gallery) |
| `/collection` | `Collection Management — Concierge & Maintenance | Red Box Motors` | Concierge, maintenance coordination, transport and track prep for collections in Austin, TX. | We Handle the Rest | `Service` |

## Project Detail — extra SEO notes
The page already builds keyword-rich, factual long-form copy ("About this build", toggled by the
`showStory` prop) from real fields and hashtags from `{services, category, vehicle, location}`.
Keep that as crawlable body text. Use the project's **first image as `og:image`**, the **gallery as
`image[]`** in schema, and the **`summary` as the meta description** (trimmed).

## Don'ts
- No fabricated review counts, star ratings, "trusted by N", warranty year numbers, or sales totals
  in titles/descriptions/schema until the owner supplies real data.
- Don't keyword-stuff city names; one natural "Austin, TX" per field.
