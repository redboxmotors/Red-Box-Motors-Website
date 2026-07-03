'use client';

import { useEffect, useRef } from 'react';

// Outer scroll-snap shell shared by the division pages (Dealer / Cosmetics /
// Collection prototypes): full-viewport snap sections over a fixed background
// photo that blurs + dims as you scroll (applyScroll in the DCs). Pass
// scrub={false} for a plain static hero photo (Dealer, per owner revert).
export function ScrollShell({
  bg,
  bgPosition = 'center 58%',
  scrub = true,
  children,
}: {
  bg: string;
  bgPosition?: string;
  scrub?: boolean;
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);
  const dimRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const c = containerRef.current;
    if (!c || !scrub) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const onScroll = () => {
      const p = Math.max(0, Math.min(1, c.scrollTop / Math.max(1, c.clientHeight)));
      if (bgRef.current) {
        bgRef.current.style.filter = `blur(${(p * 24).toFixed(2)}px) brightness(${(0.9 - 0.12 * p).toFixed(3)}) saturate(${(1 + 0.05 * p).toFixed(3)})`;
        bgRef.current.style.transform = `scale(${(1 + 0.07 * p).toFixed(3)})`;
      }
      if (dimRef.current) dimRef.current.style.opacity = (0.1 + 0.2 * p).toFixed(3);
    };
    c.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => c.removeEventListener('scroll', onScroll);
  }, [scrub]);

  return (
    <div
      ref={containerRef}
      data-scroll-container
      className="rb-noscrollbar h-screen snap-y snap-mandatory overflow-y-auto"
      style={{
        background:
          'radial-gradient(135% 95% at 50% 0%, #1d1d1d 0%, #121212 38%, #080808 72%, #050505 100%)',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={bgRef}
        src={bg}
        alt=""
        className="rb-hero-img fixed inset-0 z-0 h-full w-full object-cover"
        style={{
          objectPosition: bgPosition,
          filter: 'blur(0px) brightness(0.9) saturate(1)',
          transform: 'scale(1)',
          transition: 'filter 140ms linear, transform 140ms linear',
          animation: 'heroImgIn 1600ms ease both',
        }}
      />
      <div
        ref={dimRef}
        className="pointer-events-none fixed inset-0 z-0 bg-[#070707]"
        style={{ opacity: 0.12, transition: 'opacity 140ms linear' }}
      />
      {children}
    </div>
  );
}
