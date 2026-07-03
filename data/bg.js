// ============================================================
// Red Box Motors — shared default background pool
// Pages without their own hero photo use one of these as a
// blurred, dimmed fixed background. pickHero() returns a random
// one per load so flat pages get the brand's photographic depth.
// ============================================================

export const HEROES = [
  'assets/hero-lineup.jpeg',
  'assets/trust-gt3rs.jpeg',
  'assets/collection-lineup.jpeg',
  'assets/cosmetics-garage.jpeg',
  'assets/dealer-garage.jpeg',
  'assets/collection-garage.jpeg',
];

export function pickHero() {
  return HEROES[Math.floor(Math.random() * HEROES.length)];
}
