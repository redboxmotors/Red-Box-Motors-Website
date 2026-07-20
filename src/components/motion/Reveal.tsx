'use client';

import { useEffect, useRef, useState } from 'react';

// Fire-once viewport reveal for CLIENT-rendered lists (filtered inventory /
// work cards), where server-side [data-reveal] + the global RevealObserver
// can't help: filtering remounts cards after the observer pass, which would
// leave them stuck at opacity 0. Each wrapper runs its own observer, reveals
// once, and disconnects. Transform/opacity only; honors reduced motion.
export function Reveal({
  delay = 0,
  className = '',
  children,
}: {
  delay?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : 'translateY(14px)',
        transition: `opacity 700ms cubic-bezier(.2,.8,.2,1) ${delay}ms, transform 700ms cubic-bezier(.2,.8,.2,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
