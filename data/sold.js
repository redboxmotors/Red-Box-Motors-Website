// ============================================================
// Red Box Motors — "Recently Sold" showcase data
// Proof of past placements — cars we sold / consigned. Distinct
// from live for-sale inventory (a listing flips status:sold and
// moves here). Swap for a Supabase query later; keep this shape.
// No invented prices — placement is the proof, not the number.
//
//   id        string
//   year      number
//   make      string
//   model     string
//   spec      string   short trim/detail line
//   placed    string   who it went to (anonymized)
//   detail    string   how/where it sold
//   tag       string   short label for placeholder art
//   photo     string   asset path ('' = striped placeholder)
// ============================================================

export const SOLD = [
  { id:'s1', year:2005, make:'Porsche',      model:'Carrera GT',      spec:'GT Silver · 1 of 1,270',          placed:'Collector · Austin, TX',     detail:'Consigned & placed privately', tag:'carrera gt', photo:'' },
  { id:'s2', year:1991, make:'Ferrari',      model:'F40',             spec:'Rosso Corsa · Classiche',         placed:'Collector · Dallas, TX',     detail:'Sold to vetted buyer',         tag:'f40',        photo:'' },
  { id:'s3', year:2006, make:'Ford',         model:'GT',              spec:'Heritage · Gulf Livery',          placed:'Repeat client · Houston',    detail:'Direct offer, fast close',     tag:'ford gt',    photo:'' },
  { id:'s4', year:2015, make:'McLaren',      model:'P1',              spec:'Volcano Yellow · Carbon',         placed:'Private commission',         detail:'Placed off-market',            tag:'p1',         photo:'' },
  { id:'s5', year:2019, make:'Porsche',      model:'911 GT2 RS',      spec:'Weissach Pkg · GT Silver',        placed:'Track-day client · Austin',  detail:'Consigned & sold in 3 weeks',  tag:'gt2 rs',     photo:'' },
  { id:'s6', year:2014, make:'Lamborghini',  model:'Aventador',       spec:'Arancio · Full PPF',              placed:'Collector · San Antonio',    detail:'Sold to vetted buyer',         tag:'aventador',  photo:'' },
  { id:'s7', year:2021, make:'Mercedes-AMG', model:'GT Black Series', spec:'Magma Beam · 1 owner',            placed:'Repeat client · Austin, TX', detail:'Consigned & placed privately', tag:'black series', photo:'' },
  { id:'s8', year:2018, make:'Ferrari',      model:'812 Superfast',   spec:'Blu Pozzi · Daytona Seats',       placed:'Collector · Austin, TX',     detail:'Direct offer, fast close',     tag:'812',        photo:'' },
  { id:'s9', year:2020, make:'Ford',         model:'GT',              spec:'Liquid Carbon · Akrapovič',       placed:'Repeat client · Dallas',     detail:'Placed off-market',            tag:'gt carbon',  photo:'' },
];

export function sold(n) {
  return typeof n === 'number' ? SOLD.slice(0, n) : SOLD;
}
