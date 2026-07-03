'use client';

import { useEffect, useState } from 'react';

// Fixed blurred/dimmed backdrop (design-language.md §6): a curated brand
// photo chosen at random per load (data/bg.js → pickHero() in the
// prototypes), swapped in on mount so SSR ships a stable default.
const HEROES = [
  '/assets/hero-lineup.jpeg',
  '/assets/trust-gt3rs.jpeg',
  '/assets/collection-lineup.jpeg',
  '/assets/cosmetics-garage.jpeg',
  '/assets/dealer-garage.jpeg',
  '/assets/collection-garage.jpeg',
];

export function RandomBackdrop({ position = 'center 56%' }: { position?: string }) {
  const [src, setSrc] = useState(HEROES[0]);

  useEffect(() => {
    setSrc(HEROES[Math.floor(Math.random() * HEROES.length)]);
  }, []);

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" aria-hidden className="rb-bg-photo" style={{ objectPosition: position }} />
      <div className="rb-bg-dim" />
    </>
  );
}
