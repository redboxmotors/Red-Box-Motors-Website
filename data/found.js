// ============================================================
// Red Box Motors — "Cars We Found for Clients" showcase data
// Proof of vehicles sourced/acquired for buyers — distinct from
// the for-sale inventory. Swap for a Supabase query later;
// keep this shape.
//
//   id        string
//   year      number
//   make      string
//   model     string
//   spec      string   short trim/detail line
//   client    string   who it was found for (anonymized)
//   sourced   string   where/how it was sourced
//   tag       string   short label for placeholder art
//   photo     string   asset path ('' = striped placeholder)
// ============================================================

export const FOUND = [
  { id:'f1', year:2022, make:'Porsche',      model:'911 GT3 Touring',  spec:'6-Speed Manual · PTS Oak Green', client:'Collector · Austin, TX',   sourced:'Sourced off-market',          tag:'gt3 touring', photo:'' },
  { id:'f2', year:2021, make:'Ferrari',      model:'SF90 Stradale',    spec:'Assetto Fiorano · Rosso',        client:'Repeat buyer · Dallas, TX', sourced:'Private allocation secured',   tag:'sf90',        photo:'' },
  { id:'f3', year:2023, make:'Lamborghini',  model:'Huracán Tecnica',  spec:'Verde Mantis · Lift',            client:'First-time client · Houston', sourced:'Found in 3 weeks',            tag:'tecnica',     photo:'' },
  { id:'f4', year:2020, make:'Mercedes-AMG', model:'GT R Pro',         spec:'1 of 750 · Green Hell Magno',    client:'Collector · Austin, TX',     sourced:'Nationwide search',           tag:'gtr pro',     photo:'' },
  { id:'f5', year:2022, make:'McLaren',      model:'765LT Spider',     spec:'MSO Spec · Strata Theme',        client:'Track-day client · Austin',  sourced:'Acquired pre-market',         tag:'765lt spider',photo:'' },
  { id:'f6', year:2019, make:'Porsche',      model:'911 Speedster',    spec:'Heritage Pkg · 1 of 1948',       client:'Collector · San Antonio',    sourced:'Located out of state',        tag:'speedster',   photo:'' },
  { id:'f7', year:2023, make:'Aston Martin', model:'Valour',           spec:'V12 Manual · 1 of 110',          client:'Private commission',         sourced:'Allocation negotiated',       tag:'valour',      photo:'' },
  { id:'f8', year:2021, make:'Ford',         model:'GT',               spec:'Liquid Carbon · Akrapovič',      client:'Repeat buyer · Austin, TX',  sourced:'Owner-direct purchase',       tag:'ford gt',     photo:'' },
];

export function found(n) {
  return typeof n === 'number' ? FOUND.slice(0, n) : FOUND;
}
