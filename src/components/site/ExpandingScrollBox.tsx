'use client';

import { useEffect, useRef } from 'react';

// The signature shared layout (routes-and-pages.md → "expanding scroll box"):
// a full-viewport snap section holding a floating #0A0A0A box that scrolls
// internally and expands 90% → 100% as you scroll in, its shadow fading and
// the section padding collapsing (onBoxScroll in the DCs). A side rail shows
// scroll progress + percent. Reveals inside use the global [data-reveal]
// observer.

export function ExpandingScrollBox({ children }: { children: React.ReactNode }) {
  const sectionRef = useRef<HTMLElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const progRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const lastE = useRef<number | undefined>(undefined);

  useEffect(() => {
    const b = boxRef.current;
    if (!b) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const onBoxScroll = () => {
      const max = b.scrollHeight - b.clientHeight;
      const p = max > 0 ? Math.max(0, Math.min(1, b.scrollTop / max)) : 0;
      if (progRef.current) progRef.current.style.height = `${(p * 100).toFixed(1)}%`;
      if (pctRef.current) pctRef.current.textContent = String(Math.round(p * 100)).padStart(2, '0');

      if (reduced) return;
      // box → fullscreen, expands as you scroll in and stays full
      const T = 220;
      const e = Math.max(0, Math.min(1, b.scrollTop / T));
      if (lastE.current === undefined || Math.abs(e - lastE.current) > 0.005) {
        lastE.current = e;
        const sz = `${(90 + 10 * e).toFixed(2)}%`;
        b.style.width = sz;
        b.style.height = sz;
        b.style.boxShadow = `0 40px 90px rgba(0,0,0,${(0.7 * (1 - e)).toFixed(3)}), 0 8px 30px rgba(0,0,0,${(0.55 * (1 - e)).toFixed(3)})`;
        if (sectionRef.current) sectionRef.current.style.padding = `${(16 * (1 - e)).toFixed(1)}px`;
      }
    };

    b.addEventListener('scroll', onBoxScroll, { passive: true });
    onBoxScroll();
    return () => b.removeEventListener('scroll', onBoxScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative z-[1] flex h-screen snap-start items-center justify-center overflow-hidden bg-transparent p-4 transition-[padding] duration-200 ease-rb"
    >
      {/* side scroll-progress rail */}
      <div
        className="pointer-events-none absolute top-1/2 z-[5] flex -translate-y-1/2 flex-col items-center gap-3.5"
        style={{ right: 'calc(4vw - 18px)' }}
        aria-hidden
      >
        <span className="font-mono text-[9.5px] uppercase tracking-[3px] text-[#cfcfcf] [writing-mode:vertical-rl]">
          Scroll
        </span>
        <div className="relative h-[150px] w-0.5 overflow-hidden bg-white/[0.14]">
          <div
            ref={progRef}
            className="absolute left-0 top-0 w-0.5 bg-rb-red"
            style={{ height: '0%', transition: 'height 90ms linear' }}
          />
        </div>
        <span ref={pctRef} className="font-mono text-[9.5px] tracking-[1px] text-rb-tx-mute-3">
          00
        </span>
      </div>

      <div
        ref={boxRef}
        className="rb-noscrollbar h-[90%] w-[90%] overflow-y-auto overflow-x-hidden bg-rb-surface motion-reduce:h-full motion-reduce:w-full"
        style={{ boxShadow: '0 40px 90px rgba(0,0,0,0.7), 0 8px 30px rgba(0,0,0,0.55)' }}
      >
        {children}
      </div>
    </section>
  );
}

// Alternating content band inside the box: base #0A0A0A vs subtle #101010
// with an inset top hairline so sections read as distinct.
export function TintSection({
  tint = false,
  className = '',
  children,
}: {
  tint?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={className}
      style={
        tint
          ? { background: '#101010', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)' }
          : { background: '#0A0A0A' }
      }
    >
      {children}
    </div>
  );
}
