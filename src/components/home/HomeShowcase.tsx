'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { SurfaceCard } from '@/lib/public/cards';
import { focalPosition } from '@/lib/public/cards';
import { ContactLink } from '@/components/contact/ContactModal';

// Homepage (Red Box Motors Homepage - Showcase.dc.html): hero + dashboard
// mosaic + boxed overview, all over one shared fixed background that blurs
// and dims with scroll. Copy is the approved prototype copy — verbatim.

const EASE = 'cubic-bezier(.2,.8,.2,1)';

// True only on the first mount within a document (a genuine full load or
// refresh) — false on in-site client navigations, which reuse the module.
// The hero entrance is choreographed to sit under the ~2.6s IntroLoader on a
// full load; on a client-nav back to home there is no loader, so replaying
// those long delays would leave the hero blank for ~2s and read as lag. We
// compress the timeline in that case. A refresh reloads the module → resets.
let documentMounted = false;
function useFirstDocumentMount(): boolean {
  const [first] = useState(() => !documentMounted);
  useEffect(() => {
    documentMounted = true;
  }, []);
  return first;
}

const TICKER: { label: string; href: string }[] = [
  { label: 'Paint Protection Film', href: '/cosmetics/ppf' },
  { label: 'STEK Films', href: '/cosmetics/ppf' },
  { label: 'Ceramic Coating', href: '/cosmetics/ceramic-correction' },
  { label: 'Carbon Collective', href: '/cosmetics/ceramic-correction' },
  { label: 'Paint Correction', href: '/cosmetics/ceramic-correction' },
  { label: 'Vinyl Wraps', href: '/cosmetics/vinyl' },
  { label: 'Wheel Refinishing', href: '/cosmetics/wheels' },
  { label: 'Custom Builds', href: '/cosmetics/custom-builds' },
  { label: 'Private Sales', href: '/dealer' },
  { label: 'Acquisitions', href: '/dealer' },
  { label: 'Consignment', href: '/dealer' },
  { label: 'Concierge', href: '/collection' },
  { label: 'Transport & Logistics', href: '/collection' },
  { label: 'Track Prep', href: '/collection' },
];

function Clock() {
  const [time, setTime] = useState('—:—:—');
  useEffect(() => {
    const tick = () => {
      try {
        setTime(
          new Intl.DateTimeFormat('en-US', {
            timeZone: 'America/Chicago',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
          }).format(new Date()),
        );
      } catch {
        /* leave placeholder */
      }
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div
      className="pointer-events-none fixed right-6 top-9 z-50 font-mono text-[11px] tracking-[1px] text-[#9a9a9a] md:right-11"
      style={{ opacity: 0, animation: `fadeUp .9s ease forwards 2.6s` }}
    >
      {time} CST
    </div>
  );
}

function FeaturedSquare({ card, ariaHidden }: { card: SurfaceCard; ariaHidden?: boolean }) {
  return (
    <Link
      href={card.href}
      aria-hidden={ariaHidden}
      tabIndex={ariaHidden ? -1 : undefined}
      className="relative block h-[300px] flex-none basis-[300px] overflow-hidden bg-rb-surface-4 transition-[filter,transform,box-shadow] duration-[240ms] ease-rb hover:z-[5] hover:-translate-y-1.5 hover:shadow-[0_26px_54px_rgba(0,0,0,0.62)] hover:brightness-[1.16]"
    >
      {card.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={card.image.url}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: focalPosition(card.image) }}
          loading="lazy"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'repeating-linear-gradient(135deg,#161616 0,#161616 12px,#101010 12px,#101010 24px)',
          }}
        />
      )}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0)_42%,rgba(8,8,8,0.62)_74%,rgba(6,6,6,0.95)_100%)]" />
      <div className="absolute left-4 top-4">
        {card.label === 'FOR SALE' ? (
          <span className="whitespace-nowrap bg-rb-red px-[9px] py-[5px] font-mono text-[9px] tracking-[1.5px] text-white">
            FOR SALE
          </span>
        ) : (
          <span className="whitespace-nowrap border border-white/40 bg-black/40 px-2 py-1 font-mono text-[9px] tracking-[1.5px] text-[#cfcfcf]">
            {card.label}
          </span>
        )}
      </div>
      <div className="absolute inset-x-0 bottom-0 px-[22px] pb-6 pt-[22px]">
        <div className="mb-2.5 text-[21px] font-semibold leading-[1.15] tracking-tight text-white">
          {card.title}
        </div>
        <div className="flex items-center justify-between gap-2.5">
          <span className="font-mono text-[12px] tracking-[0.5px] text-[#9a9a9a]">{card.spec}</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M4 12L12 4M12 4H5.2M12 4V10.8" stroke="#fff" strokeWidth="1.3" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

function MosaicArrow({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M4 12L12 4M12 4H5.2M12 4V10.8" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

const tileCls =
  'relative block overflow-hidden bg-rb-surface cursor-pointer z-[1] transition-[filter,transform,box-shadow] duration-[260ms] ease-rb hover:z-[6] hover:-translate-y-[5px] hover:scale-[1.014] hover:shadow-[0_24px_50px_rgba(0,0,0,0.62)] hover:brightness-[1.16] active:translate-y-0 active:scale-[0.992]';

const quickCls =
  'flex flex-1 flex-col items-center justify-center gap-3.5 p-3.5 cursor-pointer z-[1] transition-[filter,transform,box-shadow] duration-[260ms] ease-rb hover:z-[6] hover:-translate-y-[5px] hover:scale-[1.02] hover:shadow-[0_22px_44px_rgba(0,0,0,0.6)] hover:brightness-[1.16] active:translate-y-0 active:scale-[0.99]';

const quickBg = { background: 'linear-gradient(150deg,#1a1a1a 0%,#0C0C0C 60%,#080808 100%)' };

export function HomeShowcase({
  featured,
  visitAndFaq,
}: {
  featured: SurfaceCard[];
  visitAndFaq: React.ReactNode;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);
  const dimRef = useRef<HTMLDivElement>(null);
  const topbarRef = useRef<HTMLDivElement>(null);
  const mosaicRef = useRef<HTMLDivElement>(null);
  const boxSectionRef = useRef<HTMLElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const boxProgRef = useRef<HTMLDivElement>(null);
  const boxPctRef = useRef<HTMLSpanElement>(null);
  const [dashRevealed, setDashRevealed] = useState(false);
  const firstLoad = useFirstDocumentMount();
  // Full loader-synced timing on first load; a quick, tight stagger otherwise.
  const heroDelay = (full: number, quick: number) => (firstLoad ? full : quick);

  // Background scrub + top progress bar
  useEffect(() => {
    const sc = scrollerRef.current;
    if (!sc) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf: number | null = null;

    const update = () => {
      const vh = sc.clientHeight;
      const st = sc.scrollTop;
      const max = Math.max(1, sc.scrollHeight - vh);
      if (topbarRef.current)
        topbarRef.current.style.transform = `scaleX(${Math.max(0, Math.min(1, st / max)).toFixed(4)})`;
      const hp = Math.max(0, Math.min(1, st / vh));
      if (bgRef.current) {
        bgRef.current.style.filter = reduced
          ? `brightness(${(1.04 - 0.2 * hp).toFixed(3)})`
          : `blur(${(hp * 20).toFixed(2)}px) brightness(${(1.04 - 0.22 * hp).toFixed(3)}) saturate(${(1 + 0.05 * hp).toFixed(3)})`;
        bgRef.current.style.transform = `scale(${(1.06 + 0.06 * hp).toFixed(3)})`;
      }
      if (dimRef.current) dimRef.current.style.opacity = (0.04 + 0.28 * hp).toFixed(3);
    };
    const onScroll = () => {
      if (raf == null)
        raf = requestAnimationFrame(() => {
          raf = null;
          update();
        });
    };
    sc.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => {
      sc.removeEventListener('scroll', onScroll);
      if (raf != null) cancelAnimationFrame(raf);
    };
  }, []);

  // Dashboard tile stagger reveal
  useEffect(() => {
    const mosaic = mosaicRef.current;
    const sc = scrollerRef.current;
    if (!mosaic) return;
    let io: IntersectionObserver | null = null;
    const t = setTimeout(() => setDashRevealed(true), 2600);
    try {
      io = new IntersectionObserver(
        (ents) => ents.forEach((en) => en.isIntersecting && setDashRevealed(true)),
        { root: sc ?? null, threshold: 0.15 },
      );
      io.observe(mosaic);
    } catch {
      setDashRevealed(true);
    }
    return () => {
      clearTimeout(t);
      io?.disconnect();
    };
  }, []);

  // Boxed-section: internal scroll → expansion + progress + reveals
  useEffect(() => {
    const b = boxRef.current;
    if (!b) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let lastE: number | undefined;

    const onBoxScroll = () => {
      const max = b.scrollHeight - b.clientHeight;
      const p = max > 0 ? Math.max(0, Math.min(1, b.scrollTop / max)) : 0;
      if (boxProgRef.current) boxProgRef.current.style.height = `${(p * 100).toFixed(1)}%`;
      if (boxPctRef.current)
        boxPctRef.current.textContent = String(Math.round(p * 100)).padStart(2, '0');
      if (reduced) return;
      const e = Math.max(0, Math.min(1, b.scrollTop / 220));
      if (lastE === undefined || Math.abs(e - lastE) > 0.005) {
        lastE = e;
        b.style.width = `${(92 + 8 * e).toFixed(2)}%`;
        b.style.boxShadow = `0 40px 90px rgba(0,0,0,${(0.7 * (1 - e)).toFixed(3)}), 0 8px 30px rgba(0,0,0,${(0.55 * (1 - e)).toFixed(3)})`;
        if (boxSectionRef.current)
          boxSectionRef.current.style.padding = `${(88 * (1 - e)).toFixed(1)}px ${(16 * (1 - e)).toFixed(1)}px ${(22 * (1 - e)).toFixed(1)}px`;
      }
    };

    // reveals rooted on the box
    let io: IntersectionObserver | null = null;
    const els = Array.from(b.querySelectorAll<HTMLElement>('[data-hreveal]'));
    const show = (el: HTMLElement) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    };
    try {
      io = new IntersectionObserver(
        (ents) =>
          ents.forEach((en) => {
            if (en.isIntersecting) {
              show(en.target as HTMLElement);
              io!.unobserve(en.target);
            }
          }),
        { root: b, threshold: 0.12 },
      );
      els.forEach((el) => io!.observe(el));
    } catch {
      els.forEach(show);
    }

    b.addEventListener('scroll', onBoxScroll, { passive: true });
    onBoxScroll();
    return () => {
      b.removeEventListener('scroll', onBoxScroll);
      io?.disconnect();
    };
  }, []);

  const reveal = (delay = 0): React.CSSProperties => ({
    opacity: 0,
    transform: 'translateY(24px)',
    transition: `opacity .9s ${EASE} ${delay}s, transform .9s ${EASE} ${delay}s`,
  });

  // Entrance reveal for each mosaic cell. Applied to a WRAPPER around the tile
  // (not the tile itself) so the tile's own hover lift/brighten isn't clobbered
  // by an inline transform, and the stagger delay never leaks into the hover
  // transition (that leak was the "light-up is delayed" bug).
  const dashReveal = (i: number): React.CSSProperties =>
    dashRevealed
      ? {
          opacity: 1,
          transform: 'none',
          transition: `opacity .5s ${EASE} ${i * 55}ms, transform .5s ${EASE} ${i * 55}ms`,
        }
      : { opacity: 0, transform: 'translateY(28px)' };

  const marquee = featured.length > 0 ? featured : [];

  return (
    <div
      ref={scrollerRef}
      className="rb-noscrollbar relative h-screen w-full snap-y snap-mandatory overflow-y-auto bg-black text-white"
    >
      {/* top progress + chrome */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5">
        <div ref={topbarRef} className="h-full origin-left bg-rb-red" style={{ transform: 'scaleX(0)', willChange: 'transform' }} />
      </div>
      <div
        className="pointer-events-none fixed left-6 top-[34px] z-50 flex items-center gap-[11px] md:left-10"
        style={{ opacity: 0, animation: 'fadeUp .9s ease forwards 2.5s' }}
      >
        <span className="inline-flex bg-rb-red px-[9px] py-1.5">
          <span className="text-[10px] font-extrabold tracking-[2px] text-white">RBM</span>
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-[3px] text-rb-tx-mute-2">
          Red Box Motors
        </span>
      </div>
      <Clock />

      {/* shared fixed background */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={bgRef}
        src="/assets/hero-lineup.jpeg"
        alt=""
        fetchPriority="high"
        decoding="async"
        className="fixed inset-0 z-0 h-full w-full object-cover"
        style={{
          objectPosition: 'center 56%',
          filter: 'brightness(1.04) saturate(1.02)',
          transform: 'scale(1.06)',
          transition: 'filter 140ms linear, transform 140ms linear',
          // Only fade the backdrop in on a genuine full load — on client-nav
          // returns it's cached and should just be there.
          animation: firstLoad ? 'fadeUp 1.4s ease both' : 'none',
          willChange: 'transform, filter',
        }}
      />
      <div
        ref={dimRef}
        className="pointer-events-none fixed inset-0 z-0 bg-[#060606]"
        style={{ opacity: 0.04, transition: 'opacity 140ms linear' }}
      />

      {/* ——— 1 · HERO ——— */}
      <section className="relative z-[1] flex h-screen snap-start flex-col items-start justify-end overflow-hidden pb-[11vh] pl-[7vw]">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,8,0.30)_0%,rgba(8,8,8,0)_36%,rgba(6,6,6,0.55)_78%,rgba(5,5,5,0.9)_100%)]" />
        <div className="relative z-[2] mb-6 inline-block overflow-hidden bg-rb-red px-[18px] py-[11px]">
          <div
            className="rb-hero-line whitespace-nowrap text-[13px] font-bold uppercase tracking-[4px] text-white"
            style={{ transform: 'translateY(120%)', animation: `rbmLine .8s ${EASE} forwards ${heroDelay(1.65, 0.06)}s` }}
          >
            Red Box Motors · Austin TX
          </div>
        </div>
        <h1
          className="relative z-[2] m-0 font-extrabold text-white"
          style={{ fontSize: 'clamp(40px,5vw,76px)', letterSpacing: '-0.04em', lineHeight: 0.94, textShadow: '0 1px 3px rgba(0,0,0,0.45)' }}
        >
          <span className="block overflow-hidden">
            <span className="rb-hero-line block" style={{ transform: 'translateY(120%)', animation: `rbmLine .95s ${EASE} forwards ${heroDelay(1.75, 0.14)}s` }}>
              All Things
            </span>
          </span>
          <span className="block overflow-hidden">
            <span className="rb-hero-line block" style={{ transform: 'translateY(120%)', animation: `rbmLine .95s ${EASE} forwards ${heroDelay(1.88, 0.22)}s` }}>
              Automotive
            </span>
          </span>
        </h1>
        <p
          className="rb-hero-in relative z-[2] mt-7 max-w-[480px] text-[16px] font-medium leading-relaxed text-rb-tx-2"
          style={{ textShadow: '0 1px 20px rgba(0,0,0,0.8)', opacity: 0, animation: `fadeUp .9s ${EASE} forwards ${heroDelay(2.35, 0.34)}s` }}
        >
          Cosmetics, sales and collection management — one roof in Austin, minutes from COTA.
        </p>
        <div
          className="rb-hero-in absolute bottom-[7vh] right-[7vw] z-[2] flex flex-col items-center gap-3"
          style={{ opacity: 0, animation: `fadeUp 1s ease forwards ${heroDelay(2.7, 0.5)}s` }}
          aria-hidden
        >
          <span className="font-mono text-[10px] uppercase tracking-[3px] text-[#cfcfcf]">Scroll</span>
          <div className="relative h-[34px] w-px overflow-hidden bg-white/[0.28]">
            <div
              className="absolute left-0 top-0 h-[9px] w-px bg-rb-red motion-reduce:hidden"
              style={{ animation: 'rbmScrollDot 1.8s ease-in-out infinite' }}
            />
          </div>
        </div>
      </section>

      {/* ——— 2 · DASHBOARD MOSAIC ——— */}
      <section className="relative z-[1] flex h-screen snap-start items-center justify-center overflow-hidden px-4 pb-[22px] pt-[88px]">
        <div className="flex h-full w-[92%] flex-col gap-1.5">
          <div ref={mosaicRef} className="flex min-h-0 flex-1 gap-1.5">
            {/* LEFT — Dealer + About */}
            <div className="flex min-w-0 flex-[2.3] flex-col gap-1.5">
              <div className="min-h-0 flex-[2.4]" style={dashReveal(0)}>
                <Link href="/dealer" className={`${tileCls} h-full w-full`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/dealer-garage.jpeg" alt="" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: 'center 58%' }} />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.12)_0%,rgba(10,10,10,0)_38%,rgba(8,8,8,0.55)_70%,rgba(6,6,6,0.92)_100%)]" />
                  <div className="absolute right-[22px] top-[22px] text-white"><MosaicArrow /></div>
                  <div className="absolute inset-x-0 bottom-0 p-[30px] px-[34px]">
                    <div className="mb-2.5 text-[34px] font-semibold tracking-tight text-white">Dealer</div>
                    <div className="max-w-[380px] text-[15px] leading-relaxed text-[#d6d6d6]">
                      Private car sales, acquisitions and consignment. Sourcing and selling exceptional vehicles, nationwide.
                    </div>
                    <div className="mt-4 text-[12px] uppercase tracking-[1.5px] text-[#9a9a9a]">Buy · Sell · Consign</div>
                  </div>
                </Link>
              </div>
              <div className="min-h-0 flex-1" style={dashReveal(1)}>
                <Link href="/about" className={`${tileCls} h-full w-full`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/about-dino.jpeg" alt="" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: 'center 52%' }} />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.05)_0%,rgba(10,10,10,0)_34%,rgba(8,8,8,0.5)_66%,rgba(6,6,6,0.9)_100%)]" />
                  <div className="absolute inset-x-0 bottom-0 px-[22px] pb-[17px] pt-4">
                    <div className="mb-1 text-[20px] font-semibold tracking-tight text-white">About Red Box Motors</div>
                    <div className="overflow-hidden text-ellipsis whitespace-nowrap text-[12px] leading-snug text-[#cfcfcf]">
                      One facility · every discipline · near COTA
                    </div>
                  </div>
                  <div className="absolute right-4 top-4 text-white"><MosaicArrow size={17} /></div>
                </Link>
              </div>
            </div>

            {/* MIDDLE — Cosmetics + Collection */}
            <div className="flex min-w-0 flex-[1.75] flex-col gap-1.5">
              <div className="min-h-0 flex-1" style={dashReveal(2)}>
                <Link href="/cosmetics" className={`${tileCls} h-full w-full`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/cosmetics-wash.jpeg" alt="" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: 'center 45%' }} />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.05)_0%,rgba(10,10,10,0)_34%,rgba(8,8,8,0.5)_66%,rgba(6,6,6,0.9)_100%)]" />
                  <div className="absolute inset-x-0 bottom-0 px-[22px] pb-[17px] pt-4">
                    <div className="mb-1 text-[20px] font-semibold tracking-tight text-white">Cosmetics</div>
                    <div className="overflow-hidden text-ellipsis whitespace-nowrap text-[12px] leading-snug text-[#cfcfcf]">
                      PPF · ceramic · correction · wraps
                    </div>
                  </div>
                  <div className="absolute right-4 top-4 text-white"><MosaicArrow size={17} /></div>
                </Link>
              </div>
              <div className="min-h-0 flex-1" style={dashReveal(3)}>
                <Link href="/collection" className={`${tileCls} h-full w-full`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/collection-p1.jpeg" alt="" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: 'center 60%' }} />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.05)_0%,rgba(10,10,10,0)_34%,rgba(8,8,8,0.5)_66%,rgba(6,6,6,0.9)_100%)]" />
                  <div className="absolute inset-x-0 bottom-0 px-[22px] pb-[17px] pt-4">
                    <div className="mb-1 text-[20px] font-semibold tracking-tight text-white">Collection Management</div>
                    <div className="overflow-hidden text-ellipsis whitespace-nowrap text-[12px] leading-snug text-[#cfcfcf]">
                      Concierge · maintenance · transport · Austin
                    </div>
                  </div>
                  <div className="absolute right-4 top-4 text-white"><MosaicArrow size={17} /></div>
                </Link>
              </div>
            </div>

            {/* RIGHT — quick links */}
            <div className="flex min-w-0 flex-[0.85] flex-col gap-1.5">
              <div className="flex flex-1" style={dashReveal(4)}>
                <Link href="/dealer/inventory" className={`${quickCls} h-full w-full`} style={quickBg}>
                  <div className="flex h-8 w-8 flex-none items-center justify-center bg-rb-red">
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <path d="M4 12L12 4M12 4H5.2M12 4V10.8" stroke="#fff" strokeWidth="1.5" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <div className="mb-1.5 text-[12px] uppercase tracking-[2.5px] text-white">Inventory</div>
                    <div className="text-[10.5px] tracking-[0.3px] text-rb-tx-mute-3">Browse listings</div>
                  </div>
                </Link>
              </div>
              <div className="flex flex-1" style={dashReveal(5)}>
                <Link href="/cosmetics/work" className={`${quickCls} h-full w-full`} style={quickBg}>
                  <div className="flex h-8 w-8 flex-none items-center justify-center bg-rb-red">
                    <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden>
                      <rect x="2.5" y="3.5" width="13" height="11" stroke="#fff" strokeWidth="1.3" />
                      <circle cx="6" cy="7" r="1.3" fill="#fff" />
                      <path d="M3.5 13L7 9.5L9.5 12L12 9L14.5 11.5" stroke="#fff" strokeWidth="1.3" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <div className="mb-1.5 text-[12px] uppercase tracking-[2.5px] text-white">Recent Work</div>
                    <div className="text-[10.5px] tracking-[0.3px] text-rb-tx-mute-3">See the builds</div>
                  </div>
                </Link>
              </div>
              <div className="flex flex-1" style={dashReveal(6)}>
                <ContactLink className={`${quickCls} h-full w-full`} style={quickBg}>
                  <div className="flex h-8 w-8 flex-none items-center justify-center bg-rb-red">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <path d="M2 4h12v8H2z M2 4l6 4 6-4" stroke="#fff" strokeWidth="1.3" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <div className="mb-1.5 text-[12px] uppercase tracking-[2.5px] text-white">Contact</div>
                    <div className="text-[10.5px] tracking-[0.3px] text-rb-tx-mute-3">Start a conversation</div>
                  </div>
                </ContactLink>
              </div>
            </div>
          </div>

          {/* capabilities ticker */}
          <div
            className="group h-14 flex-none overflow-hidden border-t border-rb-line bg-rb-surface"
            style={dashReveal(7)}
          >
            <div className="flex h-full w-max motion-safe:animate-rb-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none [animation-duration:54s]">
              {[...TICKER, ...TICKER].map((cap, i) => (
                <Link
                  key={`${cap.label}-${i}`}
                  href={cap.href}
                  aria-hidden={i >= TICKER.length}
                  tabIndex={i >= TICKER.length ? -1 : undefined}
                  className="inline-flex h-full flex-none items-center gap-3 border-r border-rb-raised-3 px-7 transition-colors duration-150 hover:bg-rb-raised"
                >
                  <span className="h-1.5 w-1.5 flex-none bg-rb-red" />
                  <span className="whitespace-nowrap text-[12px] font-semibold uppercase tracking-[2px] text-[#cfcfcf]">
                    {cap.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* side scroll cue */}
        <div
          className="pointer-events-none absolute bottom-16 z-[7] flex flex-col items-center gap-3"
          style={{ right: 'calc(4vw - 20px)', opacity: 0, animation: 'fadeUp 1s ease forwards .4s' }}
          aria-hidden
        >
          <span className="font-mono text-[9.5px] uppercase tracking-[3px] text-[#cfcfcf] [writing-mode:vertical-rl]">Scroll</span>
          <div className="relative h-10 w-px overflow-hidden bg-white/[0.24]">
            <div className="absolute left-0 top-0 h-[11px] w-px bg-rb-red motion-reduce:hidden" style={{ animation: 'rbmScrollDot 1.8s ease-in-out infinite' }} />
          </div>
          <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
            <path d="M8 3V13M8 13L3.5 8.5M8 13L12.5 8.5" stroke="#CC0000" strokeWidth="1.4" />
          </svg>
        </div>
      </section>

      {/* ——— 3 · BOXED OVERVIEW ——— */}
      <section
        ref={boxSectionRef}
        className="relative z-[1] flex h-screen snap-start items-center justify-center overflow-hidden px-4 pb-[22px] pt-[88px] transition-[padding] duration-200 ease-rb"
      >
        {/* side scroll-progress rail */}
        <div
          className="pointer-events-none absolute top-1/2 z-[5] flex -translate-y-1/2 flex-col items-center gap-3.5"
          style={{ right: 'calc(4vw - 18px)' }}
          aria-hidden
        >
          <span className="font-mono text-[9.5px] uppercase tracking-[3px] text-[#cfcfcf] [writing-mode:vertical-rl]">Scroll</span>
          <div className="relative h-[150px] w-0.5 overflow-hidden bg-white/[0.14]">
            <div ref={boxProgRef} className="absolute left-0 top-0 w-0.5 bg-rb-red" style={{ height: '0%', transition: 'height 90ms linear' }} />
          </div>
          <span ref={boxPctRef} className="font-mono text-[9.5px] tracking-[1px] text-rb-tx-mute-3">00</span>
        </div>

        <div
          ref={boxRef}
          className="rb-noscrollbar relative z-[1] h-full w-[92%] overflow-y-auto overflow-x-hidden bg-rb-surface"
          style={{
            boxShadow: '0 40px 90px rgba(0,0,0,0.7), 0 8px 30px rgba(0,0,0,0.55)',
            transition: `width 200ms ${EASE}, box-shadow 200ms ease`,
          }}
        >
          {/* photo header */}
          <div className="relative h-[380px] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/scroll-header.jpg" alt="Red Box Motors — Austin, Texas" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: 'center 72%' }} />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.10)_0%,rgba(10,10,10,0.04)_42%,rgba(10,10,10,0.55)_76%,rgba(10,10,10,0.92)_92%,#0A0A0A_100%)]" />
          </div>

          {/* manifesto */}
          <div className="px-6 pt-[52px] md:px-12">
            <div data-hreveal className="mb-7 font-mono text-[11px] uppercase tracking-[4px] text-rb-red" style={reveal()}>
              — What we do
            </div>
            <h2 className="m-0 max-w-[16ch] font-bold text-white" style={{ fontSize: 'clamp(32px,4.4vw,64px)', letterSpacing: '-0.03em', lineHeight: 1.04 }}>
              <span data-hreveal className="block" style={reveal()}>One facility.</span>
              <span data-hreveal className="block text-rb-tx-faint" style={reveal(0.12)}>Every discipline.</span>
            </h2>
            <p data-hreveal className="mb-0 mt-9 max-w-[560px] text-[17px] font-medium leading-[1.7] text-rb-tx-mute" style={reveal(0.24)}>
              From paint protection to private sales to caring for a collection — the same obsessive standard runs through all of it.
            </p>
            <p data-hreveal className="mb-0 mt-12 max-w-[760px] text-[15px] leading-[1.78] text-[#999]" style={reveal(0.12)}>
              Red Box Motors is a single Austin, Texas facility built around how a car looks, how it&rsquo;s bought and sold, and how it&rsquo;s cared for over time. Minutes from Circuit of the Americas, we bring cosmetics, private sales and collection management under one roof so an owner has one trusted point of contact for the whole life of the car — from protecting a brand-new delivery to sourcing the next one to keeping a garage of them road- and track-ready.
            </p>

            <div data-hreveal className="mt-12 grid gap-[38px] md:grid-cols-3" style={reveal(0.18)}>
              <div>
                <h3 className="mb-[13px] text-[14px] font-semibold uppercase tracking-[1px] text-rb-red">Cosmetics</h3>
                <p className="mb-4 text-[14px] leading-[1.75] text-[#999]">
                  Paint protection film, ceramic coating, paint correction, vinyl wrap, wheel refinishing and ground-up custom builds. We install STEK self-healing PPF and color films and seal finishes with Carbon Collective ceramics over a proper correction — so the paint underneath stays protected, glossy and easy to keep clean.
                </p>
                <Link href="/cosmetics" className="inline-flex items-center gap-[7px] text-[12.5px] tracking-[0.5px] text-white transition-[gap] duration-200 hover:gap-3">
                  Explore cosmetics
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden><path d="M4 12L12 4M12 4H5.2M12 4V10.8" stroke="currentColor" strokeWidth="1.3" /></svg>
                </Link>
              </div>
              <div>
                <h3 className="mb-[13px] text-[14px] font-semibold uppercase tracking-[1px] text-rb-red">Dealer</h3>
                <p className="mb-4 text-[14px] leading-[1.75] text-[#999]">
                  Private sales, acquisitions and consignment of enthusiast and collector cars. Whether you&rsquo;re buying from our curated inventory, selling a car without the friction of the open market, or asking us to track down a specific build, we handle the search, the vetting and the paperwork with discretion.
                </p>
                <Link href="/dealer" className="inline-flex items-center gap-[7px] text-[12.5px] tracking-[0.5px] text-white transition-[gap] duration-200 hover:gap-3">
                  Explore the dealer
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden><path d="M4 12L12 4M12 4H5.2M12 4V10.8" stroke="currentColor" strokeWidth="1.3" /></svg>
                </Link>
              </div>
              <div>
                <h3 className="mb-[13px] text-[14px] font-semibold uppercase tracking-[1px] text-rb-red">Collection Management</h3>
                <p className="mb-4 text-[14px] leading-[1.75] text-[#999]">
                  Concierge management for Austin collections — not storage. Concierge pickup and drop-off, coordinated maintenance and servicing, hands-on battery and fluids, pre-trip and track prep, and transport and logistics. Detailing and washing are coordinated on your behalf. Local Austin only, so your cars stay ready to drive.
                </p>
                <Link href="/collection" className="inline-flex items-center gap-[7px] text-[12.5px] tracking-[0.5px] text-white transition-[gap] duration-200 hover:gap-3">
                  Explore management
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden><path d="M4 12L12 4M12 4H5.2M12 4V10.8" stroke="currentColor" strokeWidth="1.3" /></svg>
                </Link>
              </div>
            </div>
          </div>

          {/* featured (big squares) */}
          <div className="pb-14 pt-[104px]" style={{ background: 'linear-gradient(180deg,#0A0A0A 0px,#151515 160px)' }}>
            <div data-hreveal className="mb-[34px] flex flex-wrap items-end justify-between gap-5 px-6 md:px-12" style={reveal()}>
              <div>
                <div className="mb-[13px] font-mono text-[11px] uppercase tracking-[4px] text-rb-red">— On the floor</div>
                <h2 className="m-0 font-bold leading-none text-white" style={{ fontSize: 'clamp(30px,3.4vw,52px)', letterSpacing: '-0.03em' }}>
                  Featured right now
                </h2>
              </div>
              <span className="font-mono text-[11px] tracking-[1px] text-rb-tx-faint">For sale + recent work</span>
            </div>
            <p data-hreveal className="mb-[30px] mt-0 max-w-[720px] px-6 text-[15px] leading-[1.78] text-[#999] md:px-12" style={reveal(0.08)}>
              The floor is always changing. Below is a live cross-section of cars currently for sale through the Red Box Motors dealer and recent paint protection, ceramic, wrap and build work from the shop — enthusiast and collector cars that have come through our Austin facility near Circuit of the Americas. It&rsquo;s the clearest way to see the inventory we carry and the standard of work you can expect on your own car.
            </p>
            {marquee.length > 0 && (
              <div className="group overflow-hidden">
                <div className="flex w-max gap-1.5 px-1.5 motion-safe:animate-rb-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none [animation-duration:64s]">
                  {marquee.map((c) => (
                    <FeaturedSquare key={`${c.type}-${c.id}`} card={c} />
                  ))}
                  {marquee.map((c) => (
                    <FeaturedSquare key={`${c.type}-${c.id}-dup`} card={c} ariaHidden />
                  ))}
                </div>
              </div>
            )}
            <div data-hreveal className="flex flex-wrap gap-3.5 px-6 pt-9 md:px-12" style={reveal(0.1)}>
              <Link href="/dealer/inventory" className="rb-btn-red inline-flex items-center gap-2.5 bg-rb-red px-6 py-3.5 text-[12.5px] font-semibold tracking-[1px] text-white">
                View all inventory
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden><path d="M4 12L12 4M12 4H5.2M12 4V10.8" stroke="currentColor" strokeWidth="1.5" /></svg>
              </Link>
              <Link href="/cosmetics/work" className="rb-btn-red inline-flex items-center gap-2.5 bg-rb-red px-6 py-3.5 text-[12.5px] font-semibold tracking-[1px] text-white">
                See recent work
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden><path d="M4 12L12 4M12 4H5.2M12 4V10.8" stroke="currentColor" strokeWidth="1.5" /></svg>
              </Link>
            </div>

            <div data-hreveal className="grid gap-11 px-6 pt-12 md:grid-cols-2 md:px-12" style={reveal(0.14)}>
              <div>
                <h3 className="mb-3.5 text-[14px] font-semibold uppercase tracking-[1px] text-white">Buying &amp; selling</h3>
                <p className="mb-[18px] text-[14.5px] leading-[1.78] text-[#999]">
                  Every car listed for sale is one we&rsquo;d be comfortable owning ourselves — sports cars, supercars and collectibles, inspected and documented before it reaches the floor. When you&rsquo;re selling, consignment lets us market and move the car on your behalf, and when you&rsquo;re buying something specific, our acquisitions service goes out and finds it.
                </p>
                <p className="m-0 text-[14.5px] leading-[1.78] text-[#999]">
                  Because the same shop also protects and details cars, a vehicle bought through Red Box Motors can roll straight into PPF, ceramic or a wrap before it&rsquo;s handed over — ready for the road or the track the day you take delivery.
                </p>
              </div>
              <div>
                <h3 className="mb-3.5 text-[14px] font-semibold uppercase tracking-[1px] text-white">Recent work</h3>
                <p className="mb-[18px] text-[14.5px] leading-[1.78] text-[#999]">
                  The recent-work tiles above are real projects from the shop — paint protection on track cars, mirror-finish paint correction, full color-change wraps and ground-up custom builds. Each one is documented panel by panel so you can judge the standard before you ever drop a car off.
                </p>
                <p className="m-0 text-[14.5px] leading-[1.78] text-[#999]">
                  It&rsquo;s the same standard whether the car is a weekend toy, a daily driver or a piece of a serious collection. One Austin facility, near Circuit of the Americas, handling the look, the sale and the care of the car from start to finish.
                </p>
              </div>
            </div>
          </div>

          {/* CTA finale */}
          <div className="grid border-t border-rb-line bg-rb-surface md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
            <div className="relative min-h-[280px] overflow-hidden bg-rb-surface-4 md:min-h-[480px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/tell-us-car.jpg" alt="Talk to Red Box Motors" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: 'center 55%' }} />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,10,10,0)_46%,rgba(10,10,10,0.5)_80%,rgba(10,10,10,0.96)_100%)]" />
            </div>
            <div className="flex flex-col justify-center px-6 py-14 md:px-14 md:py-[72px]">
              <h2 data-hreveal className="m-0 max-w-[14ch] font-extrabold text-white" style={{ ...reveal(), fontSize: 'clamp(34px,4.6vw,72px)', letterSpacing: '-0.045em', lineHeight: 0.94 }}>
                Tell us about the car.
              </h2>

              <div data-hreveal className="mt-[30px] border-t border-[#232323]" style={reveal(0.1)}>
                {[
                  { href: '/cosmetics', label: 'Cosmetics', sub: 'PPF · ceramic · wraps' },
                  { href: '/dealer', label: 'Dealer', sub: 'Buy · sell · source' },
                  { href: '/collection', label: 'Collection Management', sub: 'Concierge · care · transport' },
                ].map((row) => (
                  <Link
                    key={row.href}
                    href={row.href}
                    className="flex items-center justify-between gap-4 border-b border-rb-line-2 px-1 py-4 transition-[padding-left,background] duration-200 hover:bg-[rgba(204,0,0,0.06)] hover:pl-3.5"
                  >
                    <span className="flex items-center gap-3.5">
                      <span className="h-[7px] w-[7px] flex-none bg-rb-red" />
                      <span className="text-[15px] font-semibold tracking-[0.3px] text-white">{row.label}</span>
                      <span className="text-[12px] tracking-[0.2px] text-rb-tx-mute-3">{row.sub}</span>
                    </span>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="flex-none" aria-hidden>
                      <path d="M4 12L12 4M12 4H5.2M12 4V10.8" stroke="#CC0000" strokeWidth="1.5" />
                    </svg>
                  </Link>
                ))}
              </div>

              <div data-hreveal className="mt-[34px] flex flex-wrap items-center gap-[18px]" style={reveal(0.14)}>
                <ContactLink className="rb-btn-red inline-flex items-center gap-3 bg-rb-red px-[30px] py-[17px] text-[14px] font-semibold tracking-[0.5px] text-white">
                  Start a conversation
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden><path d="M4 12L12 4M12 4H5.2M12 4V10.8" stroke="#fff" strokeWidth="1.5" /></svg>
                </ContactLink>
                <Link href="/about" className="text-[13px] tracking-[1.5px] text-rb-tx-mute transition-colors duration-150 hover:text-white">
                  About Red Box Motors →
                </Link>
              </div>
              <div data-hreveal className="mt-12 flex items-center gap-[11px]" style={reveal(0.24)}>
                <span className="inline-flex bg-rb-red px-2.5 py-[7px]">
                  <span className="text-[10px] font-extrabold tracking-[2px] text-white">RBM</span>
                </span>
                <span className="text-[11px] uppercase tracking-[2px] text-rb-tx-faint">
                  Red Box Motors · Austin, Texas · Near COTA
                </span>
              </div>
            </div>
          </div>

          {/* Visit & FAQ */}
          <div style={{ background: 'linear-gradient(180deg,#0A0A0A 0px,#111 120px)' }}>{visitAndFaq}</div>
        </div>
      </section>
    </div>
  );
}
