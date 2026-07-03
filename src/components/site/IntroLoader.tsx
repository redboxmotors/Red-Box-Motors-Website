'use client';

import { useEffect, useState } from 'react';

// Intro loader — plays on full reload / external entry ONLY (the prototypes'
// data-nav="full" heuristic). Client-side navigations never remount the root
// layout, and same-origin referrers skip it, so in-site movement stays plain
// per the owner's direction.
export function IntroLoader() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let full = true;
    try {
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
      const type = nav ? nav.type : 'navigate';
      const sameOrigin = document.referrer !== '' && document.referrer.indexOf(location.origin) === 0;
      full = type === 'reload' || !sameOrigin;
    } catch {
      /* default to showing */
    }
    if (!full) return;
    setShow(true);
    const t = setTimeout(() => setShow(false), 2600);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex flex-col items-center justify-center gap-7 bg-black"
      style={{ willChange: 'clip-path', animation: 'rbmLoaderLift .95s cubic-bezier(.76,0,.24,1) forwards 1.5s' }}
      aria-hidden
    >
      <div className="flex items-center gap-[15px]" style={{ animation: 'rbmBoxIn .8s cubic-bezier(.2,.8,.2,1) both' }}>
        <span className="inline-flex bg-rb-red px-[18px] py-[13px]">
          <span className="text-[15px] font-extrabold tracking-[4px] text-white">RBM</span>
        </span>
        <span className="text-[12px] font-semibold uppercase tracking-[6px] text-rb-tx-faint">
          Red Box Motors
        </span>
      </div>
      <div className="h-0.5 w-[210px] overflow-hidden bg-[#171717]">
        <div
          className="h-full origin-left bg-rb-red"
          style={{ transform: 'scaleX(0)', animation: 'rbmBarGrow 1.5s cubic-bezier(.45,0,.1,1) forwards' }}
        />
      </div>
    </div>
  );
}
