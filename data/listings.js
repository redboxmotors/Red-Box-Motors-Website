// ============================================================
// Red Box Motors — mock listings data
// Swap this module for a Supabase query later. Each object is
// the exact shape the UI binds to, so a real fetch only needs
// to return the same fields.
//
//   id            string
//   slug          string   -> /dealer/inventory/[slug]
//   year          number
//   make          string
//   model         string
//   price         string   pre-formatted display price
//   mileage       string   pre-formatted display mileage
//   exterior      string
//   interior      string
//   engine        string
//   transmission  string
//   vin           string
//   photos        number   gallery photo count (placeholder)
// ============================================================

export const LISTINGS = [
  { id:'1',  slug:'911-gt3-rs',          year:2023, make:'Porsche',      model:'911 GT3 RS',          price:'$329,000',   mileage:'1,250 mi', exterior:'Arctic Grey',        interior:'Black / Race-Tex',     engine:'4.0L Flat-6',            transmission:'7-Speed PDK',     vin:'WP0AF2A99PS278···', photos:5 },
  { id:'2',  slug:'488-pista',           year:2020, make:'Ferrari',      model:'488 Pista',           price:'$405,000',   mileage:'3,900 mi', exterior:'Giallo Modena',      interior:'Nero / Alcantara',     engine:'3.9L Twin-Turbo V8',     transmission:'7-Speed DCT',     vin:'ZFF90HLA2L0253···', photos:4 },
  { id:'3',  slug:'mclaren-p1',          year:2015, make:'McLaren',      model:'P1',                  price:'$1,250,000', mileage:'2,100 mi', exterior:'Volcano Yellow',     interior:'Carbon Black',         engine:'3.8L Twin-Turbo V8 Hybrid', transmission:'7-Speed SSG',  vin:'SBM12ABA7FW000···', photos:5 },
  { id:'4',  slug:'aventador-svj',       year:2021, make:'Lamborghini',  model:'Aventador SVJ',       price:'$598,000',   mileage:'1,800 mi', exterior:'Rosso Mars',         interior:'Nero Ade',             engine:'6.5L V12',               transmission:'7-Speed ISR',     vin:'ZHWUV5ZD9MLA12···', photos:4 },
  { id:'5',  slug:'amg-gt-black-series', year:2022, make:'Mercedes-AMG', model:'GT Black Series',     price:'$425,000',   mileage:'2,600 mi', exterior:'Magma Beam',         interior:'Black Exclusive Nappa',engine:'4.0L Twin-Turbo V8',     transmission:'7-Speed DCT',     vin:'W1KYK7BA0NA017···', photos:4 },
  { id:'6',  slug:'911-gt2-rs',          year:2019, make:'Porsche',      model:'911 GT2 RS',          price:'$359,000',   mileage:'4,400 mi', exterior:'GT Silver Metallic', interior:'Black / Red Alcantara',engine:'3.8L Twin-Turbo Flat-6', transmission:'7-Speed PDK',     vin:'WP0AE2A91KS185···', photos:5 },
  { id:'7',  slug:'r8-v10',              year:2021, make:'Audi',         model:'R8 V10 Performance',  price:'$182,000',   mileage:'7,200 mi', exterior:'Daytona Grey',       interior:'Black Fine Nappa',     engine:'5.2L V10',               transmission:'7-Speed S tronic',vin:'WUAKBAFX9M790···',  photos:3 },
  { id:'8',  slug:'765lt',               year:2021, make:'McLaren',      model:'765LT',               price:'$489,000',   mileage:'1,500 mi', exterior:'Smoked White',       interior:'Carbon / Alcantara',   engine:'4.0L Twin-Turbo V8',     transmission:'7-Speed SSG',     vin:'SBM16FCA5MW003···', photos:4 },
  { id:'9',  slug:'f8-tributo',          year:2021, make:'Ferrari',      model:'F8 Tributo',          price:'$329,000',   mileage:'3,100 mi', exterior:'Rosso Corsa',        interior:'Nero',                 engine:'3.9L Twin-Turbo V8',     transmission:'7-Speed DCT',     vin:'ZFF92LLA8M0265···', photos:4 },
  { id:'10', slug:'huracan-sto',         year:2022, make:'Lamborghini',  model:'Huracán STO',         price:'$415,000',   mileage:'990 mi',   exterior:'Blu Laufey',         interior:'Nero / Arancio',       engine:'5.2L V10',               transmission:'7-Speed DCT',     vin:'ZHWUF5ZF6NLA14···', photos:5 },
  { id:'11', slug:'gtr-nismo',           year:2020, make:'Nissan',       model:'GT-R NISMO',          price:'$215,000',   mileage:'5,800 mi', exterior:'Pearl White',        interior:'Black / Red',          engine:'3.8L Twin-Turbo V6',     transmission:'6-Speed DCT',     vin:'JN1AR5EF8LM360···', photos:3 },
  { id:'12', slug:'continental-gt-speed',year:2023, make:'Bentley',      model:'Continental GT Speed',price:'$289,000',   mileage:'2,300 mi', exterior:'Onyx',               interior:'Beluga / Hotspur',     engine:'6.0L Twin-Turbo W12',    transmission:'8-Speed DCT',     vin:'SCBCG4ZG8PC012···', photos:4 },
];

export function getListing(slug) {
  return LISTINGS.find((l) => l.slug === slug) || null;
}

export function featured(n = 3) {
  return LISTINGS.slice(0, n);
}
