'use client';

import { useEffect, useRef, useState } from 'react';

// Muted looping background video for server-rendered sections.
//
// Mobile pass 2026-07-17: the video src is chosen AFTER mount (never in the
// SSR markup) so the poster image is what paints first — that makes the
// lightweight poster the LCP element instead of a multi-megabyte video, and
// avoids the browser starting a video download the mobile branch may not even
// want. On phones we prefer `mobileSrc` (a lighter encode) when supplied and
// otherwise hold on the (optionally lighter) poster with no video download at
// all. React also drops `muted` from SSR markup, which blocks autoplay — we
// re-assert it before calling play(). Reduced-motion users keep the poster.
export function BgVideo({
  src,
  poster,
  className = '',
  position = 'center',
  mobileSrc,
  mobilePoster,
}: {
  src: string;
  poster?: string;
  className?: string;
  position?: string;
  /** Lighter encode served to phones; when omitted, phones hold on the poster. */
  mobileSrc?: string;
  /** Smaller poster rendition for phones. */
  mobilePoster?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  // Start with poster only (no src) — the poster paints as the LCP frame.
  const [activeSrc, setActiveSrc] = useState<string | undefined>(undefined);
  const [activePoster, setActivePoster] = useState<string | undefined>(poster);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const small = window.matchMedia('(max-width: 767px)').matches;
    if (small && mobilePoster) setActivePoster(mobilePoster);
    if (reduced) return; // hold the poster, no video
    // On phones use the lighter encode; if there isn't one, don't download the
    // heavy desktop video — the poster stands in.
    const chosen = small ? mobileSrc : src;
    if (chosen) setActiveSrc(chosen);
  }, [src, mobileSrc, mobilePoster]);

  useEffect(() => {
    const v = ref.current;
    if (!v || !activeSrc) return;
    v.muted = true;
    v.play().catch(() => {});
  }, [activeSrc]);

  return (
    <video
      ref={ref}
      src={activeSrc}
      poster={activePoster}
      autoPlay
      muted
      loop
      playsInline
      preload={activeSrc ? 'metadata' : 'none'}
      aria-hidden
      className={`object-cover ${className}`}
      style={{ objectPosition: position }}
    />
  );
}
