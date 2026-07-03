// ============================================================
// Red Box Motors — Cosmetics "Recent Work" project data
// Swap for a real CMS/Supabase query later; keep this shape.
//
//   id         string
//   slug       string   -> /cosmetics/work/[slug]
//   title      string   project name
//   vehicle    string   full car name
//   make       string
//   category   string   primary service (display)
//   services   string[] all services on this build
//   finish     string
//   duration   string
//   year       number
//   coverage   string
//   location   string
//   photos     number   gallery photo count (placeholder)
//   summary    string   1–2 sentence overview
//   scope      string[] bullet list of work performed
//   tag        string   short label for the placeholder art
// ============================================================

export const PROJECTS = [
  {
    id: '1', slug: 'track-armor-gt3rs', title: 'Track-Ready Armor',
    vehicle: 'Porsche 911 GT3 RS', make: 'Porsche', category: 'PPF',
    services: ['Full-Body PPF', 'Ceramic Coating'], finish: 'Satin', duration: '6 days',
    year: 2024, coverage: 'Full body', location: 'Austin, TX', photos: 5, tag: 'gt3 rs · ppf',
    summary: 'A full-body satin paint protection film package with a ceramic top coat — built to survive track days without a mark.',
    scope: ['Full-body self-healing film, wrapped edges', 'Satin finish over factory paint', 'Ceramic coating on film for slickness', 'Wheels faces coated, calipers sealed'],
  },
  {
    id: '2', slug: 'nardo-wrap-rs6', title: 'Nardo Transformation',
    vehicle: 'Audi RS6 Avant', make: 'Audi', category: 'Vinyl Wrap',
    services: ['Color-Change Wrap', 'Chrome Delete'], finish: 'Matte Nardo Grey', duration: '4 days',
    year: 2024, coverage: 'Full body', location: 'Austin, TX', photos: 4, tag: 'rs6 · wrap',
    summary: 'A full color-change to matte Nardo grey with a complete chrome delete — reversible and paint-safe throughout.',
    scope: ['Full-body matte color-change wrap', 'Chrome delete on trim and badges', 'Door jambs and edges wrapped', 'Gloss black roof accent'],
  },
  {
    id: '3', slug: 'mirror-correction-sf90', title: 'Mirror Correction',
    vehicle: 'Ferrari SF90 Stradale', make: 'Ferrari', category: 'Ceramic & Correction',
    services: ['Paint Correction', 'Ceramic Coating'], finish: 'Gloss', duration: '5 days',
    year: 2023, coverage: 'Full body', location: 'Austin, TX', photos: 5, tag: 'sf90 · ceramic',
    summary: 'Multi-stage paint correction to remove swirls and haze, sealed with a multi-year ceramic coating.',
    scope: ['Three-stage machine correction', 'Paint depth measured and mapped', 'Multi-year ceramic coating', 'Glass and wheels coated'],
  },
  {
    id: '4', slug: 'bronze-black-m4', title: 'Bronze & Black',
    vehicle: 'BMW M4 Competition', make: 'BMW', category: 'Wheel Refinishing',
    services: ['Wheel Refinishing', 'Caliper Refinish'], finish: 'Satin Bronze', duration: '3 days',
    year: 2024, coverage: 'Wheels & calipers', location: 'Austin, TX', photos: 4, tag: 'm4 · wheels',
    summary: 'A full wheel strip and refinish in satin bronze with gloss black calipers to match.',
    scope: ['Wheels stripped to bare metal', 'Powder coated satin bronze', 'Calipers refinished gloss black', 'New hardware and TPMS service'],
  },
  {
    id: '5', slug: 'widebody-gtr', title: 'Widebody Commission',
    vehicle: 'Nissan GT-R', make: 'Nissan', category: 'Custom Build',
    services: ['Widebody Kit', 'Vinyl Wrap', 'Wheels'], finish: 'Gloss / Forged', duration: '6 weeks',
    year: 2023, coverage: 'Full build', location: 'Austin, TX', photos: 6, tag: 'gt-r · build',
    summary: 'A ground-up widebody commission — bodywork, aero, forged wheels and a custom wrap, executed end to end.',
    scope: ['Widebody kit fitment and bodywork', 'Custom aero and stance', 'Forged wheels, sized to fill arches', 'Full custom wrap and detailing'],
  },
  {
    id: '6', slug: 'full-clear-amg', title: 'Full-Body Clear',
    vehicle: 'Mercedes-AMG GT', make: 'Mercedes-AMG', category: 'PPF',
    services: ['Full-Body PPF'], finish: 'Gloss', duration: '5 days',
    year: 2024, coverage: 'Full body', location: 'Austin, TX', photos: 4, tag: 'amg gt · ppf',
    summary: 'An invisible full-body gloss PPF package — total protection with zero change to the factory look.',
    scope: ['Full-body gloss self-healing film', 'Wrapped and tucked edges', 'High-impact areas double-layered', 'Ceramic boost on top'],
  },
];

export function getProject(slug) {
  return PROJECTS.find((p) => p.slug === slug) || null;
}

export function recent(n) {
  return typeof n === 'number' ? PROJECTS.slice(0, n) : PROJECTS;
}
