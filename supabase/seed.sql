-- ============================================================================
-- Red Box Motors — seed (run AFTER schema.sql)
-- Generated from the prototype data modules:
--   data/listings.js (12 for-sale) + Dealer Inventory.dc.html COMING_SOON (3)
--   data/sold.js (9, folded into listings as status='sold')
--   data/projects.js (6) · data/found.js (8 sourced)
-- Placeholders carried over on purpose (README known-placeholders):
--   * VINs are truncated with '···' — owner must supply full VINs
--   * settings phone/email/address are the prototype values — owner must
--     confirm real ones before launch (phone was inconsistent: 0123 vs 0199)
-- No placements are seeded: every curated slot starts on its auto-fallback.
-- ============================================================================

-- listings: for sale ---------------------------------------------------------
insert into public.listings
  (slug, year, make, model, price, mileage, exterior, interior, engine, transmission, vin, status, published, featured, sort_order)
values
  ('911-gt3-rs',           2023, 'Porsche',      '911 GT3 RS',           329000,  1250, 'Arctic Grey',        'Black / Race-Tex',       '4.0L Flat-6',                     '7-Speed PDK',      'WP0AF2A99PS278···', 'for_sale', true, true,  0),
  ('488-pista',            2020, 'Ferrari',      '488 Pista',            405000,  3900, 'Giallo Modena',      'Nero / Alcantara',       '3.9L Twin-Turbo V8',              '7-Speed DCT',      'ZFF90HLA2L0253···', 'for_sale', true, true,  1),
  ('mclaren-p1',           2015, 'McLaren',      'P1',                  1250000,  2100, 'Volcano Yellow',     'Carbon Black',           '3.8L Twin-Turbo V8 Hybrid',       '7-Speed SSG',      'SBM12ABA7FW000···', 'for_sale', true, true,  2),
  ('aventador-svj',        2021, 'Lamborghini',  'Aventador SVJ',        598000,  1800, 'Rosso Mars',         'Nero Ade',               '6.5L V12',                        '7-Speed ISR',      'ZHWUV5ZD9MLA12···', 'for_sale', true, false, 3),
  ('amg-gt-black-series',  2022, 'Mercedes-AMG', 'GT Black Series',      425000,  2600, 'Magma Beam',         'Black Exclusive Nappa',  '4.0L Twin-Turbo V8',              '7-Speed DCT',      'W1KYK7BA0NA017···', 'for_sale', true, false, 4),
  ('911-gt2-rs',           2019, 'Porsche',      '911 GT2 RS',           359000,  4400, 'GT Silver Metallic', 'Black / Red Alcantara',  '3.8L Twin-Turbo Flat-6',          '7-Speed PDK',      'WP0AE2A91KS185···', 'for_sale', true, false, 5),
  ('r8-v10',               2021, 'Audi',         'R8 V10 Performance',   182000,  7200, 'Daytona Grey',       'Black Fine Nappa',       '5.2L V10',                        '7-Speed S tronic', 'WUAKBAFX9M790···',  'for_sale', true, false, 6),
  ('765lt',                2021, 'McLaren',      '765LT',                489000,  1500, 'Smoked White',       'Carbon / Alcantara',     '4.0L Twin-Turbo V8',              '7-Speed SSG',      'SBM16FCA5MW003···', 'for_sale', true, false, 7),
  ('f8-tributo',           2021, 'Ferrari',      'F8 Tributo',           329000,  3100, 'Rosso Corsa',        'Nero',                   '3.9L Twin-Turbo V8',              '7-Speed DCT',      'ZFF92LLA8M0265···', 'for_sale', true, false, 8),
  ('huracan-sto',          2022, 'Lamborghini',  'Huracán STO',          415000,   990, 'Blu Laufey',         'Nero / Arancio',         '5.2L V10',                        '7-Speed DCT',      'ZHWUF5ZF6NLA14···', 'for_sale', true, false, 9),
  ('gtr-nismo',            2020, 'Nissan',       'GT-R NISMO',           215000,  5800, 'Pearl White',        'Black / Red',            '3.8L Twin-Turbo V6',              '6-Speed DCT',      'JN1AR5EF8LM360···', 'for_sale', true, false, 10),
  ('continental-gt-speed', 2023, 'Bentley',      'Continental GT Speed', 289000,  2300, 'Onyx',               'Beluga / Hotspur',       '6.0L Twin-Turbo W12',             '8-Speed DCT',      'SCBCG4ZG8PC012···', 'for_sale', true, false, 11)
on conflict (slug) do nothing;

-- listings: coming soon (from the Inventory prototype's inline array) --------
insert into public.listings
  (slug, make, model, eta, status, published, sort_order)
values
  ('lamborghini-revuelto',   'Lamborghini', 'Revuelto',      'Summer',     'coming_soon', true, 0),
  ('ferrari-sf90-stradale',  'Ferrari',     'SF90 Stradale', 'July',       'coming_soon', true, 1),
  ('porsche-911-st',         'Porsche',     '911 S/T',       'In transit', 'coming_soon', true, 2)
on conflict (slug) do nothing;

-- listings: sold (from data/sold.js — no prices by design: placement is the
-- proof, not the number) ------------------------------------------------------
insert into public.listings
  (slug, year, make, model, spec, placed_with, sale_detail, status, published, sort_order)
values
  ('2005-porsche-carrera-gt',       2005, 'Porsche',      'Carrera GT',       'GT Silver · 1 of 1,270',   'Collector · Austin, TX',     'Consigned & placed privately', 'sold', true, 0),
  ('1991-ferrari-f40',              1991, 'Ferrari',      'F40',              'Rosso Corsa · Classiche',  'Collector · Dallas, TX',     'Sold to vetted buyer',         'sold', true, 1),
  ('2006-ford-gt',                  2006, 'Ford',         'GT',               'Heritage · Gulf Livery',   'Repeat client · Houston',    'Direct offer, fast close',     'sold', true, 2),
  ('2015-mclaren-p1-sold',          2015, 'McLaren',      'P1',               'Volcano Yellow · Carbon',  'Private commission',         'Placed off-market',            'sold', true, 3),
  ('2019-porsche-911-gt2-rs-sold',  2019, 'Porsche',      '911 GT2 RS',       'Weissach Pkg · GT Silver', 'Track-day client · Austin',  'Consigned & sold in 3 weeks',  'sold', true, 4),
  ('2014-lamborghini-aventador',    2014, 'Lamborghini',  'Aventador',        'Arancio · Full PPF',       'Collector · San Antonio',    'Sold to vetted buyer',         'sold', true, 5),
  ('2021-amg-gt-black-series-sold', 2021, 'Mercedes-AMG', 'GT Black Series',  'Magma Beam · 1 owner',     'Repeat client · Austin, TX', 'Consigned & placed privately', 'sold', true, 6),
  ('2018-ferrari-812-superfast',    2018, 'Ferrari',      '812 Superfast',    'Blu Pozzi · Daytona Seats','Collector · Austin, TX',     'Direct offer, fast close',     'sold', true, 7),
  ('2020-ford-gt-sold',             2020, 'Ford',         'GT',               'Liquid Carbon · Akrapovič','Repeat client · Dallas',     'Placed off-market',            'sold', true, 8)
on conflict (slug) do nothing;

-- projects (data/projects.js) -------------------------------------------------
insert into public.projects
  (slug, title, vehicle, make, category, services, finish, duration, year, coverage, location, summary, scope, published, featured, sort_order)
values
  (
    'track-armor-gt3rs', 'Track-Ready Armor', 'Porsche 911 GT3 RS', 'Porsche', 'PPF',
    array['Full-Body PPF','Ceramic Coating'], 'Satin', '6 days', 2024, 'Full body', 'Austin, TX',
    'A full-body satin paint protection film package with a ceramic top coat — built to survive track days without a mark.',
    array['Full-body self-healing film, wrapped edges','Satin finish over factory paint','Ceramic coating on film for slickness','Wheels faces coated, calipers sealed'],
    true, true, 0
  ),
  (
    'nardo-wrap-rs6', 'Nardo Transformation', 'Audi RS6 Avant', 'Audi', 'Vinyl Wrap',
    array['Color-Change Wrap','Chrome Delete'], 'Matte Nardo Grey', '4 days', 2024, 'Full body', 'Austin, TX',
    'A full color-change to matte Nardo grey with a complete chrome delete — reversible and paint-safe throughout.',
    array['Full-body matte color-change wrap','Chrome delete on trim and badges','Door jambs and edges wrapped','Gloss black roof accent'],
    true, true, 1
  ),
  (
    'mirror-correction-sf90', 'Mirror Correction', 'Ferrari SF90 Stradale', 'Ferrari', 'Ceramic & Correction',
    array['Paint Correction','Ceramic Coating'], 'Gloss', '5 days', 2023, 'Full body', 'Austin, TX',
    'Multi-stage paint correction to remove swirls and haze, sealed with a multi-year ceramic coating.',
    array['Three-stage machine correction','Paint depth measured and mapped','Multi-year ceramic coating','Glass and wheels coated'],
    true, true, 2
  ),
  (
    'bronze-black-m4', 'Bronze & Black', 'BMW M4 Competition', 'BMW', 'Wheel Refinishing',
    array['Wheel Refinishing','Caliper Refinish'], 'Satin Bronze', '3 days', 2024, 'Wheels & calipers', 'Austin, TX',
    'A full wheel strip and refinish in satin bronze with gloss black calipers to match.',
    array['Wheels stripped to bare metal','Powder coated satin bronze','Calipers refinished gloss black','New hardware and TPMS service'],
    true, false, 3
  ),
  (
    'widebody-gtr', 'Widebody Commission', 'Nissan GT-R', 'Nissan', 'Custom Build',
    array['Widebody Kit','Vinyl Wrap','Wheels'], 'Gloss / Forged', '6 weeks', 2023, 'Full build', 'Austin, TX',
    'A ground-up widebody commission — bodywork, aero, forged wheels and a custom wrap, executed end to end.',
    array['Widebody kit fitment and bodywork','Custom aero and stance','Forged wheels, sized to fill arches','Full custom wrap and detailing'],
    true, false, 4
  ),
  (
    'full-clear-amg', 'Full-Body Clear', 'Mercedes-AMG GT', 'Mercedes-AMG', 'PPF',
    array['Full-Body PPF'], 'Gloss', '5 days', 2024, 'Full body', 'Austin, TX',
    'An invisible full-body gloss PPF package — total protection with zero change to the factory look.',
    array['Full-body gloss self-healing film','Wrapped and tucked edges','High-impact areas double-layered','Ceramic boost on top'],
    true, false, 5
  )
on conflict (slug) do nothing;

-- sourced (data/found.js) -------------------------------------------------------
insert into public.sourced
  (year, make, model, spec, client, sourced_detail, published, sort_order)
values
  (2022, 'Porsche',      '911 GT3 Touring', '6-Speed Manual · PTS Oak Green', 'Collector · Austin, TX',      'Sourced off-market',        true, 0),
  (2021, 'Ferrari',      'SF90 Stradale',   'Assetto Fiorano · Rosso',        'Repeat buyer · Dallas, TX',   'Private allocation secured', true, 1),
  (2023, 'Lamborghini',  'Huracán Tecnica', 'Verde Mantis · Lift',            'First-time client · Houston', 'Found in 3 weeks',          true, 2),
  (2020, 'Mercedes-AMG', 'GT R Pro',        '1 of 750 · Green Hell Magno',    'Collector · Austin, TX',      'Nationwide search',         true, 3),
  (2022, 'McLaren',      '765LT Spider',    'MSO Spec · Strata Theme',        'Track-day client · Austin',   'Acquired pre-market',       true, 4),
  (2019, 'Porsche',      '911 Speedster',   'Heritage Pkg · 1 of 1948',       'Collector · San Antonio',     'Located out of state',      true, 5),
  (2023, 'Aston Martin', 'Valour',          'V12 Manual · 1 of 110',          'Private commission',          'Allocation negotiated',     true, 6),
  (2021, 'Ford',         'GT',              'Liquid Carbon · Akrapovič',      'Repeat buyer · Austin, TX',   'Owner-direct purchase',     true, 7)
on conflict do nothing;

-- settings (prototype placeholders — owner must confirm before launch) --------
insert into public.settings (id, phone, email, address_line, hours_json, map_embed_url)
values (
  1,
  '(512) 555-0123',            -- PLACEHOLDER: prototypes disagree (0123 vs 0199)
  'hello@redboxmotors.com',    -- PLACEHOLDER: confirm real inbox
  'Austin, TX · near COTA',    -- PLACEHOLDER: real street address needed for LocalBusiness schema
  '{}'::jsonb,
  null
)
on conflict (id) do nothing;
