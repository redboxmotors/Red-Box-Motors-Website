import type { ContentType, DbImage } from '@/lib/db/types';

// Client-safe pieces of the public content layer: the card shape and pure
// display helpers. Server queries live in ./content (imports next/headers —
// server components only).

export type SurfaceCard = {
  type: ContentType;
  id: string;
  title: string;
  spec: string;
  href: string;
  label: 'FOR SALE' | 'COMING SOON' | 'SOLD' | 'RECENT WORK' | 'SOURCED';
  image: DbImage | null;
  // Dealer preview-tile lines (Dealer.dc.html): "{year} · {make}" eyebrow,
  // model as the big line, and a per-type mono meta line
  // (price · mileage / placed_with / client). Null for projects.
  eyebrow: string | null;
  name: string;
  meta: string | null;
};

// Focal point → object-position (admin-and-photos.md §5).
export function focalPosition(img: Pick<DbImage, 'focal_x' | 'focal_y'> | null): string {
  if (!img) return 'center';
  return `${Math.round(img.focal_x * 100)}% ${Math.round(img.focal_y * 100)}%`;
}
