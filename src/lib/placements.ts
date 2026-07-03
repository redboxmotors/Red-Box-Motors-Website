import type { ContentType, PlacementSurface } from '@/lib/db/types';

// The six curated slots (admin-cms-build.md §2b) — single source of truth for
// the admin managers, the "Show on" checkboxes, and the public readers.
export const SURFACES: Record<
  PlacementSurface,
  { label: string; rendersOn: string; types: ContentType[]; fallback: string }
> = {
  home_featured: {
    label: 'Homepage — Featured right now',
    rendersOn: 'Homepage marquee',
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
    label: 'Dealer — Sold preview',
    rendersOn: 'Dealer landing → “Cars we’ve sold”',
    types: ['listing'],
    fallback: 'Newest sold cars',
  },
  dealer_sourced_preview: {
    label: 'Dealer — Sourced preview',
    rendersOn: 'Dealer landing → “Cars we found for clients”',
    types: ['sourced'],
    fallback: 'Newest featured sourced cars',
  },
  cosmetics_builds_preview: {
    label: 'Cosmetics — Builds & transformations',
    rendersOn: 'Cosmetics landing preview grid',
    types: ['project'],
    fallback: 'Newest featured projects',
  },
};

export const SURFACE_KEYS = Object.keys(SURFACES) as PlacementSurface[];

export function surfacesForType(type: ContentType): PlacementSurface[] {
  return SURFACE_KEYS.filter((k) => SURFACES[k].types.includes(type));
}
