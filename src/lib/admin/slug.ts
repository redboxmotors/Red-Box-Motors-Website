export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip diacritics (Huracán → huracan)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// "$329,000" / "329000" / "1,250 mi" → number | null
export function parseNumeric(input: string | number | null | undefined): number | null {
  if (input == null || input === '') return null;
  if (typeof input === 'number') return Number.isFinite(input) ? input : null;
  const digits = input.replace(/[^0-9.]/g, '');
  if (!digits) return null;
  const n = Number(digits);
  return Number.isFinite(n) ? n : null;
}
