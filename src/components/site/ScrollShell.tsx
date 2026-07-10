'use client';

import { useEffect, useRef } from 'react';

// Outer scroll-snap shell shared by the division pages (Dealer / Cosmetics /
// Collection prototypes): full-viewport snap sections over a fixed background
// photo that blurs + dims as you scroll (applyScroll in the DCs). Pass
// scrub={false} for a plain static hero photo (Dealer, per owner revert).
// Pass bgVideo for a muted looping video hero (Restoration, 2026-07-08) —
// `bg` then serves as the poster and the reduced-motion fallback.
// blurBg renders the photo statically blurred + dimmed (Dealer, owner
// 2026-07-10) — the detail-page backdrop treatment without the scroll scrub.
export function ScrollShell({
  bg,
  bgVideo,
  bgPosition = 'center 58%',
  scrub = true,
  blurBg = false,
  children,
}: {
  bg: string;
  bgVideo?: string;
  bgPosition?: string;
  scrub?: boolean;
  blurBg?: boolean;
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLElement>(null);
  const dimRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const c = containerRef.current;
    if (!c) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Muted autoplay can be dropped from SSR markup (same fix as the
    // homepage video hero) — re-assert and kick playback; hold the poster
    // for reduced-motion users.
    const v = bgRef.current;
    if (bgVideo && v instanceof HTMLVideoElement) {
      if (reduced) {
        v.pause();
      } else {
        v.muted = true;
        v.play().catch(() => {});
      }
    }

    if (!scrub || reduced) return;
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
  }, [scrub, bgVideo]);

  const bgStyle = {
    objectPosition: bgPosition,
    filter: blurBg
      ? 'blur(18px) brightness(0.55) saturate(1.05)'
      : 'blur(0px) brightness(0.9) saturate(1)',
    transform: blurBg ? 'scale(1.06)' : 'scale(1)',
    transition: 'filter 140ms linear, transform 140ms linear',
    animation: 'heroImgIn 1600ms ease both',
  } as const;

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
      {bgVideo ? (
        <video
          ref={bgRef as React.RefObject<HTMLVideoElement>}
          className="rb-hero-img fixed inset-0 z-0 h-full w-full object-cover"
          style={bgStyle}
          src={bgVideo}
          poster={bg}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={bgRef as React.RefObject<HTMLImageElement>}
          src={bg}
          alt=""
          className="rb-hero-img fixed inset-0 z-0 h-full w-full object-cover"
          style={bgStyle}
        />
      )}
      <div
        ref={dimRef}
        className="pointer-events-none fixed inset-0 z-0 bg-[#070707]"
        style={{ opacity: 0.12, transition: 'opacity 140ms linear' }}
      />
      {children}
    </div>
  );
}
