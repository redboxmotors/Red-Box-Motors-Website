// Centralized placeholder imagery + brief copy. Swap the Unsplash URLs for
// real photography later — design polish comes after structure.

export const IMAGES = {
  homeHero: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1920&q=80',
  cosmeticHero: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1920&q=80',
  dealerHero: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=80',
  collectionHero: 'https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1920&q=80',
  contactHero: 'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1920&q=80',

  divisionCosmetic: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=1600&q=80',
  divisionDealer: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1600&q=80',
  divisionCollection: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1600&q=80',
} as const;

export const COSMETIC_SERVICES = [
  { name: 'Paint Protection Film', line: 'Invisible armor against the road.', image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Paint Correction', line: 'Flawless, mirror-deep finish.', image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Ceramic Coating', line: 'Lasting gloss and protection.', image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Vinyl Wrap', line: 'A new identity, any color.', image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Wheel Refinishing', line: 'Restored to factory and beyond.', image: 'https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?auto=format&fit=crop&w=1200&q=80' },
] as const;

export const COLLECTION_SERVICES = [
  { name: 'Storage Coordination', line: 'Climate-controlled, fully insured.', image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Maintenance Scheduling', line: 'Every service, handled on time.', image: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1200&q=80' },
  { name: 'PPI Arrangement', line: 'Independent pre-purchase inspections.', image: 'https://images.unsplash.com/photo-1632823471565-1ecdf5c6da77?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Collection Oversight', line: 'One point of contact for it all.', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80' },
] as const;
