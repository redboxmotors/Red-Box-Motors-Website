import { createAdminClient, createServerClient } from '@/lib/supabase/server';
import { SURFACES } from '@/lib/placements';
import type {
  ContentType,
  DbImage,
  Listing,
  PlacementSurface,
  Project,
  Settings,
  Sourced,
} from '@/lib/db/types';
import { formatMileage, formatPrice, listingTitle } from '@/lib/db/types';

// ————————————————————————————————————————————————————————————————
// Public read layer. Every public gallery/marquee goes through here
// (admin-cms-build.md §4): curated surfaces read `placements` and fall
// back to the auto-query when the slot is empty; roster galleries read
// their table with the status/publish filter.
// ————————————————————————————————————————————————————————————————

export { focalPosition, type SurfaceCard } from './cards';
import { type SurfaceCard } from './cards';

// Explicit column list for anon listing reads — everything EXCEPT `vin`,
// which is not selectable by the anon role (column-level grant, schema.sql).
// The detail page fetches the VIN via getPublicVin() only when vin_public.
const LISTING_PUBLIC_COLS =
  'id,slug,year,make,model,price,mileage,exterior,interior,engine,transmission,' +
  'vin_public,status,eta,spec,placed_with,sale_detail,published,featured,' +
  'sort_order,deleted_at,created_at,updated_at';

export function listingHref(l: Pick<Listing, 'slug'>): string {
  return `/dealer/inventory/${l.slug}`;
}

export function projectHref(p: Pick<Project, 'slug'>): string {
  return `/cosmetics/work/${p.slug}`;
}

function listingLabel(status: Listing['status']): SurfaceCard['label'] {
  if (status === 'sold') return 'SOLD';
  if (status === 'coming_soon') return 'COMING SOON';
  return 'FOR SALE';
}

function listingSpec(l: Listing): string {
  return [l.year, l.mileage != null ? formatMileage(l.mileage) : null]
    .filter(Boolean)
    .join(' · ');
}

function projectSpec(p: Project): string {
  return [p.vehicle.split(' ').slice(-1)[0], p.category].filter(Boolean).join(' · ');
}

function listingCard(l: Listing, image: DbImage | null): SurfaceCard {
  const priceMileage =
    l.status === 'sold'
      ? l.placed_with
      : [l.price != null ? formatPrice(l.price) : null, l.mileage != null ? formatMileage(l.mileage) : null]
          .filter(Boolean)
          .join(' · ') || null;
  return {
    type: 'listing',
    id: l.id,
    title: listingTitle(l),
    spec: listingSpec(l),
    href: listingHref(l),
    label: listingLabel(l.status),
    image,
    eyebrow: [l.year, l.make].filter(Boolean).join(' · ') || null,
    name: l.model,
    meta: priceMileage,
  };
}

function projectCard(p: Project, image: DbImage | null): SurfaceCard {
  return {
    type: 'project',
    id: p.id,
    title: p.title,
    spec: projectSpec(p),
    href: projectHref(p),
    label: 'RECENT WORK',
    image,
    eyebrow: null,
    name: p.title,
    meta: null,
  };
}

function sourcedCard(s: Sourced, image: DbImage | null): SurfaceCard {
  return {
    type: 'sourced',
    id: s.id,
    title: `${s.year} ${s.make} ${s.model}`,
    spec: s.spec ?? '',
    href: '/dealer/sourced',
    label: 'SOURCED',
    image,
    eyebrow: `${s.year} · ${s.make}`,
    name: s.model,
    meta: s.client,
  };
}

// Hero image per (parent_type, parent_id): is_hero first, else first by order.
export async function getHeroImages(
  keys: { type: ContentType; id: string }[],
): Promise<Map<string, DbImage>> {
  const map = new Map<string, DbImage>();
  if (keys.length === 0) return map;
  const supabase = createServerClient();
  const ids = Array.from(new Set(keys.map((k) => k.id)));
  const { data } = await supabase
    .from('images')
    .select('*')
    .in('parent_id', ids)
    .order('is_hero', { ascending: false })
    .order('sort_order', { ascending: true });
  for (const img of (data ?? []) as DbImage[]) {
    const key = `${img.parent_type}:${img.parent_id}`;
    if (!map.has(key)) map.set(key, img);
  }
  return map;
}

export function heroFor(map: Map<string, DbImage>, type: ContentType, id: string): DbImage | null {
  return map.get(`${type}:${id}`) ?? null;
}

async function fetchItems(
  refs: { item_type: ContentType; item_id: string }[],
): Promise<Map<string, Listing | Project | Sourced>> {
  const supabase = createServerClient();
  const byType: Record<ContentType, string[]> = { listing: [], project: [], sourced: [] };
  refs.forEach((r) => byType[r.item_type].push(r.item_id));

  const [listings, projects, sourced] = await Promise.all([
    byType.listing.length
      ? supabase.from('listings').select(LISTING_PUBLIC_COLS).in('id', byType.listing).eq('published', true).is('deleted_at', null)
      : Promise.resolve({ data: [] }),
    byType.project.length
      ? supabase.from('projects').select('*').in('id', byType.project).eq('published', true).is('deleted_at', null)
      : Promise.resolve({ data: [] }),
    byType.sourced.length
      ? supabase.from('sourced').select('*').in('id', byType.sourced).eq('published', true).is('deleted_at', null)
      : Promise.resolve({ data: [] }),
  ]);

  const map = new Map<string, Listing | Project | Sourced>();
  ((listings.data ?? []) as unknown as Listing[]).forEach((l) => map.set(`listing:${l.id}`, l));
  (projects.data ?? []).forEach((p) => map.set(`project:${p.id}`, p as Project));
  (sourced.data ?? []).forEach((s) => map.set(`sourced:${s.id}`, s as Sourced));
  return map;
}

function toCard(type: ContentType, item: Listing | Project | Sourced, image: DbImage | null): SurfaceCard {
  if (type === 'listing') return listingCard(item as Listing, image);
  if (type === 'project') return projectCard(item as Project, image);
  return sourcedCard(item as Sourced, image);
}

// Auto-fallback when a curated slot is empty (admin-cms-build.md §2b):
// newest featured rows of the surface's allowed types, padded with newest.
async function fallbackCards(surface: PlacementSurface, limit: number): Promise<SurfaceCard[]> {
  const supabase = createServerClient();
  const types = SURFACES[surface].types;
  const cards: { type: ContentType; item: Listing | Project | Sourced }[] = [];

  const soldSlot = surface === 'dealer_sold_preview';
  await Promise.all(
    types.map(async (t) => {
      const table = t === 'listing' ? 'listings' : t === 'project' ? 'projects' : 'sourced';
      let q = supabase
        .from(table)
        .select(t === 'listing' ? LISTING_PUBLIC_COLS : '*')
        .eq('published', true)
        .is('deleted_at', null)
        .order('featured', { ascending: false })
        .order('sort_order', { ascending: true })
        .limit(limit);
      if (t === 'listing') q = soldSlot ? q.eq('status', 'sold') : q.neq('status', 'sold');
      const { data } = await q;
      ((data ?? []) as unknown as (Listing | Project | Sourced)[]).forEach((item) =>
        cards.push({ type: t, item }),
      );
    }),
  );

  // Interleave types so mixed slots alternate (car / project / car …).
  const buckets = types.map((t) => cards.filter((c) => c.type === t));
  const mixed: typeof cards = [];
  for (let i = 0; mixed.length < Math.min(limit, cards.length); i++) {
    for (const b of buckets) if (b[i]) mixed.push(b[i]);
  }
  const sliced = mixed.slice(0, limit);

  const heroes = await getHeroImages(sliced.map((c) => ({ type: c.type, id: (c.item as { id: string }).id })));
  return sliced.map((c) =>
    toCard(c.type, c.item, heroFor(heroes, c.type, (c.item as { id: string }).id)),
  );
}

// Curated surface reader: placements first, auto-fallback when empty.
export async function getSurfaceCards(surface: PlacementSurface, limit = 8): Promise<SurfaceCard[]> {
  const supabase = createServerClient();
  const { data: placements, error } = await supabase
    .from('placements')
    .select('item_type, item_id, sort_order')
    .eq('surface', surface)
    .eq('enabled', true)
    .order('sort_order', { ascending: true })
    .limit(limit);

  if (error || !placements || placements.length === 0) return fallbackCards(surface, limit);

  const items = await fetchItems(placements);
  const present = placements.filter((p) => items.has(`${p.item_type}:${p.item_id}`));
  if (present.length === 0) return fallbackCards(surface, limit);

  const heroes = await getHeroImages(present.map((p) => ({ type: p.item_type, id: p.item_id })));
  return present.map((p) =>
    toCard(
      p.item_type,
      items.get(`${p.item_type}:${p.item_id}`)!,
      heroFor(heroes, p.item_type, p.item_id),
    ),
  );
}

// ————————————————————————————————————————————————————————————————
// Roster queries (query-driven galleries, admin-cms-build.md §2a)
// ————————————————————————————————————————————————————————————————

export async function getListings(status?: Listing['status']): Promise<Listing[]> {
  const supabase = createServerClient();
  let q = supabase
    .from('listings')
    .select(LISTING_PUBLIC_COLS)
    .eq('published', true)
    .is('deleted_at', null)
    .order('sort_order', { ascending: true });
  if (status) q = q.eq('status', status);
  const { data } = await q;
  return (data ?? []) as unknown as Listing[];
}

export async function getListingBySlug(slug: string): Promise<Listing | null> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from('listings')
    .select(LISTING_PUBLIC_COLS)
    .eq('slug', slug)
    .eq('published', true)
    .is('deleted_at', null)
    .maybeSingle();
  return (data as unknown as Listing) ?? null;
}

// Full VIN for the detail page. The anon role cannot select `vin` at all, so
// when the owner has marked it public we fetch it with the service-role
// client (server-only) — the vin_public flag stays the single gate.
export async function getPublicVin(l: Pick<Listing, 'id' | 'vin_public'>): Promise<string | null> {
  if (!l.vin_public) return null;
  const supabase = createAdminClient();
  const { data } = await supabase.from('listings').select('vin').eq('id', l.id).maybeSingle();
  return data?.vin ?? null;
}

export async function getProjects(): Promise<Project[]> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('published', true)
    .is('deleted_at', null)
    .order('sort_order', { ascending: true });
  return (data ?? []) as Project[];
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .is('deleted_at', null)
    .maybeSingle();
  return (data as Project) ?? null;
}

export async function getSourced(): Promise<Sourced[]> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from('sourced')
    .select('*')
    .eq('published', true)
    .is('deleted_at', null)
    .order('sort_order', { ascending: true });
  return (data ?? []) as Sourced[];
}

export async function getImagesFor(type: ContentType, id: string): Promise<DbImage[]> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from('images')
    .select('*')
    .eq('parent_type', type)
    .eq('parent_id', id)
    .order('is_hero', { ascending: false })
    .order('sort_order', { ascending: true });
  return (data ?? []) as DbImage[];
}

// ————————————————————————————————————————————————————————————————
// Settings — single source of contact info. The DB row wins; these
// fallbacks are the prototype placeholders, flagged in README.md as
// OWNER-TODO (real phone/email/address before launch).
// ————————————————————————————————————————————————————————————————

export type SiteSettings = Pick<Settings, 'phone' | 'email' | 'address_line' | 'map_embed_url'> & {
  hours_json: Record<string, string>;
};

export const SETTINGS_FALLBACK: SiteSettings = {
  phone: '(512) 555-0199',
  email: 'hello@redboxmotors.com',
  address_line: 'Austin, Texas — minutes from Circuit of the Americas',
  map_embed_url: null,
  hours_json: {},
};

export async function getSettings(): Promise<SiteSettings> {
  const supabase = createServerClient();
  const { data } = await supabase.from('settings').select('*').limit(1).maybeSingle();
  if (!data) return SETTINGS_FALLBACK;
  const s = data as Settings;
  return {
    phone: s.phone ?? SETTINGS_FALLBACK.phone,
    email: s.email ?? SETTINGS_FALLBACK.email,
    address_line: s.address_line ?? SETTINGS_FALLBACK.address_line,
    map_embed_url: s.map_embed_url,
    hours_json: s.hours_json ?? {},
  };
}

