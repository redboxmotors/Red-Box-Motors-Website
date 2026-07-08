import type { ContentType, PlacementSurface } from '@/lib/db/types';

// The six curated slots (admin-cms-build.md §2b) — single source of truth for
// the admin managers, the "Show on" checkboxes, and the public readers.
export const SURFACES: Record<
  PlacementSurface,
  { label: string; rendersOn: string; types: ContentType[]; fallback: string }
> = {
  home_featured: {
    label: 'Homepage — Featured right now (section currently unpublished)',
    rendersOn: 'Homepage marquee — hidden until re-enabled',
    types: ['listing', 'project'],
    fallback: 'Newest featured cars + projects',
  },
  feature_bar: {
    label: 'Feature Bar',
    rendersOn: 'Sliding marquee inside Visit & FAQ (most pages)',
    types: ['listing', 'project'],
    fallback: 'Newest featured cars + projects',
  },
  dealer_forsale_preview: {
    label: 'Dealer — For-sale preview',
    rendersOn: 'Dealer landing → “Cars currently for sale”',
    types: ['listing'],
    fallback: 'Newest featured for-sale cars',
  },
  dealer_sold_preview: {
    label: 'Sales — Sold preview (section currently unpublished)',
    rendersOn: 'Sales & Consignment landing — hidden until re-enabled',
    types: ['listing'],
    fallback: 'Newest sold cars',
  },
  dealer_sourced_preview: {
    label: 'Sales — Sourced preview (section currently unpublished)',
    rendersOn: 'Sourcing is not offered publicly right now',
    types: ['sourced'],
    fallback: 'Newest featured sourced cars',
  },
  cosmetics_builds_preview: {
    label: 'Restoration — Recent work preview',
    rendersOn: 'Restoration page → “From the shop floor”',
    types: ['project'],
    fallback: 'Newest featured projects',
  },
};

export const SURFACE_KEYS = Object.keys(SURFACES) as PlacementSurface[];

export function surfacesForType(type: ContentType): PlacementSurface[] {
  return SURFACE_KEYS.filter((k) => SURFACES[k].types.includes(type));
}
