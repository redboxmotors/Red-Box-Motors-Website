// Shared between the server inventory page (reads searchParams) and the
// client toolbar (writes them). No 'use client' — plain module so the server
// component can call makeParam.

export type SortKey = 'price-desc' | 'price-asc' | 'year-desc' | 'miles-asc';

export const DEFAULT_SORT: SortKey = 'price-desc';

export function makeParam(make: string): string {
  return make.toLowerCase().replace(/\s+/g, '-');
}
