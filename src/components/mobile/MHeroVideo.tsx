'use client';

import { useEffect, useRef, useState } from 'react';

// Mobile hero media: poster-first video (2026-07-20 hero-video fix).
//
// The poster <img> is server-rendered and paints immediately as the LCP
// element. After hydration we attach the LIGHT mobile encode (-m.mp4,
// ~1–3 MB) and fade the video in over the poster once it is actually
// playing — so slow networks simply keep the poster. iOS Safari autoplay
// needs muted + playsInline + autoplay all present, and React can drop
// `muted` from SSR markup, so it is re-asserted before play().
// Reduced-motion users and Save-Data connections hold the poster (no
// video download at all).
export function MHeroVideo({
  video,
  poster,
  alt,
  position = 'center',
}: {
  video: string;
  poster: string;
  alt: string;
  position?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [videoSrc, setVideoSrc] = useState<string | undefined>(undefined);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const conn = (navigator as { connection?: { saveData?: boolean } }).connection;
    if (reduced || conn?.saveData === true) return; // hold the poster
    setVideoSrc(video);
  }, [video]);

  useEffect(() => {
    const v = ref.current;
    if (!v || !videoSrc) return;
    v.muted = true;
    const onPlaying = () => setPlaying(true);
    v.addEventListener('playing', onPlaying);
    v.play().catch(() => {});
    return () => v.removeEventListener('playing', onPlaying);
  }, [videoSrc]);

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={poster}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: position }}
      />
      <video
        ref={ref}
        src={videoSrc}
        autoPlay
        muted
        loop
        playsInline
        preload={videoSrc ? 'auto' : 'none'}
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
        style={{
          objectPosition: position,
          opacity: playing ? 1 : 0,
          transition: 'opacity 800ms ease',
        }}
      />
    </>
  );
}
