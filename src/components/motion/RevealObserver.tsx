'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Universal reveals: a viewport-rooted IntersectionObserver marks any
// [data-reveal] element revealed (opacity 1 / transform none — see
// globals.css). Complements per-page observers (e.g. the box-rooted one
// inside ExpandingScrollBox). Honors prefers-reduced-motion by revealing
// everything immediately.
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]:not([data-revealed])'));
    if (els.length === 0) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach((el) => el.setAttribute('data-revealed', ''));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute('data-revealed', '');
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
