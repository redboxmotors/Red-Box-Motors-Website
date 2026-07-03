'use client';

import { useEffect, useRef } from 'react';

// [data-counter] count-up: counts 0 → value over ~900ms (cubic ease-out)
// when it enters the viewport. `pad` left-pads with zeros ("03").
// Honors prefers-reduced-motion by rendering the final value immediately.
export function Counter({ value, pad = 0, className }: { value: number; pad?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fmt = (n: number) => String(Math.round(n)).padStart(pad, '0');

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = fmt(value);
      return;
    }

    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const start = performance.now();
        const dur = 900;
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - t, 3); // cubic ease-out
          el.textContent = fmt(value * eased);
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, pad]);

  return (
    <span ref={ref} className={className}>
      {String(0).padStart(pad, '0')}
    </span>
  );
}
