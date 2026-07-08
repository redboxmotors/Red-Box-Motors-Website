// Entity types mirroring supabase/schema.sql (admin-cms-build.md §1).
// The pre-rebuild types in src/lib/types.ts die with the old components.

export type ListingStatus = 'for_sale' | 'coming_soon' | 'sold';
export type ContentType = 'listing' | 'project' | 'sourced';
export type PlacementSurface =
  | 'home_featured'
  | 'feature_bar'
  | 'dealer_forsale_preview'
  | 'dealer_sold_preview'
  | 'dealer_sourced_preview'
  | 'cosmetics_builds_preview';
export type LeadType = 'contact' | 'listing' | 'consignment' | 'first_look' | 'estimate';
export type LeadStatus = 'new' | 'handled';

export interface Listing {
  id: string;
  slug: string;
  year: number | null;
  make: string;
  model: string;
  price: number | null;
  mileage: number | null;
  exterior: string | null;
  interior: string | null;
  engine: string | null;
  transmission: string | null;
  // Absent on public (anon) reads — the column is not anon-readable at the DB
  // layer. Detail pages use getPublicVin(); admin reads (select *) include it.
  vin?: string | null;
  vin_public: boolean;
  status: ListingStatus;
  eta: string | null;
  spec: string | null;
  placed_with: string | null;
  sale_detail: string | null;
  published: boolean;
  featured: boolean;
  sort_order: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  vehicle: string;
  make: string | null;
  category: string;
  services: string[];
  finish: string | null;
  duration: string | null;
  year: number | null;
  coverage: string | null;
  location: string | null;
  summary: string | null;
  scope: string[];
  published: boolean;
  featured: boolean;
  sort_order: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Sourced {
  id: string;
  year: number;
  make: string;
  model: string;
  spec: string | null;
  client: string | null;
  sourced_detail: string | null;
  published: boolean;
  featured: boolean;
  sort_order: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbImage {
  id: string;
  parent_type: ContentType;
  parent_id: string;
  url: string;
  thumb_url: string | null;
  alt: string;
  focal_x: number;
  focal_y: number;
  sort_order: number;
  is_hero: boolean;
  created_at: string;
}

export interface Placement {
  id: string;
  surface: PlacementSurface;
  item_type: ContentType;
  item_id: string;
  sort_order: number;
  enabled: boolean;
  created_at: string;
}

export interface Settings {
  id: number;
  phone: string | null;
  email: string | null;
  address_line: string | null;
  hours_json: Record<string, string>;
  map_embed_url: string | null;
  updated_at: string;
}

export interface Lead {
  id: string;
  type: LeadType;
  name: string;
  email: string;
  phone: string | null;
  interest: string | null;
  message: string | null;
  listing_slug: string | null;
  listing_title: string | null;
  source_page: string | null;
  // 2026-07-07 form system (patches/2026-07-07-consignment-forms.sql).
  // Optional: absent on rows created before the patch (and on pre-patch DBs).
  contact_method?: string | null;
  city_state?: string | null;
  payload?: Record<string, unknown> | null;
  submission_key?: string | null;
  status: LeadStatus;
  created_at: string;
}

// —— Display formatting (numeric source of truth, format server-side) ——
export function formatPrice(price: number | null): string {
  if (price == null) return '';
  return `$${Math.round(price).toLocaleString('en-US')}`;
}

export function formatMileage(mileage: number | null): string {
  if (mileage == null) return '';
  return `${mileage.toLocaleString('en-US')} mi`;
}

export function listingTitle(l: Pick<Listing, 'year' | 'make' | 'model'>): string {
  return [l.year, l.make, l.model].filter(Boolean).join(' ');
}
