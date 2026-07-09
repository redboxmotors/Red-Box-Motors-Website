'use client';

import { useEffect, useRef } from 'react';

// Muted looping background video for server-rendered sections. React drops
// the `muted` attribute from SSR markup, which blocks autoplay policies —
// this re-asserts it and kicks playback; reduced-motion users keep the
// poster frame.
export function BgVideo({
  src,
  poster,
  className = '',
  position = 'center',
}: {
  src: string;
  poster?: string;
  className?: string;
  position?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      v.pause();
      return;
    }
    v.muted = true;
    v.play().catch(() => {});
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden
      className={`object-cover ${className}`}
      style={{ objectPosition: position }}
    />
  );
}
