'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { SurfaceCard } from '@/lib/public/cards';
import { focalPosition } from '@/lib/public/cards';
import { ContactLink } from '@/components/contact/ContactModal';
import { SiteNav } from '@/components/site/SiteNav';

// Homepage: hero + two-division mosaic + boxed overview, all over one shared
// fixed background that blurs and dims with scroll. Owner-approved copy —
// verbatim. Collection Management and the "Featured right now" marquee are
// unpublished (SHOW_FEATURED / the removed tiles), not deleted — see git
// history to restore.

const EASE = 'cubic-bezier(.2,.8,.2,1)';

// Featured marquee is unpublished per owner revision (no featured inventory
// on the homepage for now). Flip to true to restore — data still flows in
// through the `featured` prop.
const SHOW_FEATURED = false;

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
  { label: 'Paint Protection Film', href: '/restoration#ppf' },
  { label: 'STEK Films', href: '/restoration#ppf' },
  { label: 'Paint Correction', href: '/restoration#correction' },
  { label: 'Ceramic Coatings', href: '/restoration#coatings' },
  { label: 'Carbon Collective', href: '/restoration#coatings' },
  { label: 'Vinyl Wraps & Liveries', href: '/restoration#wraps' },
  { label: 'Window Tint', href: '/restoration#tint' },
  { label: 'Detailing & Vehicle Care', href: '/restoration#detailing' },
  { label: 'Wheels, Tires & Calipers', href: '/restoration#wheels' },
  { label: 'Curated Inventory', href: '/dealer/inventory' },
  { label: 'Consignment', href: '/dealer/sell' },
];

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

// Gradient link tiles under the "One Facility. Every Discipline." division
// columns (the old mosaic quick-link column is in git history). Borderless
// floating rectangles — gradient surface + soft shadow only.
const overviewSquareCls =
  'group relative flex w-full flex-col items-center justify-center gap-3 px-5 py-9 text-center transition-[transform,box-shadow,filter] duration-[240ms] ease-rb hover:-translate-y-[3px] hover:shadow-[0_24px_52px_rgba(0,0,0,0.65),0_0_30px_rgba(204,0,0,0.18)] hover:brightness-[1.14] active:translate-y-0 active:scale-[0.98]';

const overviewSquareBg = {
  background: 'linear-gradient(150deg,#232323 0%,#151515 48%,#0C0C0C 100%)',
  boxShadow: '0 18px 40px rgba(0,0,0,0.55)',
};

// Red CTA + red-outline ghost CTA used in the hero.
const heroRed =
  'rb-btn-red inline-flex items-center gap-2.5 bg-rb-red px-[26px] py-[15px] text-[13px] font-semibold tracking-[1px] text-white';
const heroGhost =
  'rb-btn inline-flex items-center gap-2.5 border border-rb-red bg-transparent px-[24px] py-[14px] text-[12.5px] font-semibold tracking-[1px] text-rb-red transition-colors duration-[180ms] hover:bg-rb-red hover:text-white';

export function HomeShowcase({
  featured,
  visitAndFaq,
}: {
  featured: SurfaceCard[];
  visitAndFaq: React.ReactNode;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLVideoElement>(null);
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

    // Video backdrop: hold on the poster for reduced-motion users; otherwise
    // make sure muted autoplay actually starts (React can drop the muted
    // attribute in SSR markup, which blocks autoplay policies).
    const vid = bgRef.current;
    if (vid) {
      vid.muted = true;
      if (reduced) vid.pause();
      else vid.play().catch(() => {});
    }

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
      {/* top progress + site nav */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5">
        <div ref={topbarRef} className="h-full origin-left bg-rb-red" style={{ transform: 'scaleX(0)', willChange: 'transform' }} />
      </div>
      <SiteNav />

      {/* shared fixed background — Brabus trailer loop (muted, 19s,
          compressed to ~2.7MB). Poster frame paints before the video streams
          in; the scroll scrub blurs/dims it exactly like the old photo. */}
      <video
        ref={bgRef}
        src="/assets/hero-brabus.mp4"
        poster="/assets/hero-brabus-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden
        className="fixed inset-0 z-0 h-full w-full object-cover"
        style={{
          objectPosition: 'center 50%',
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
          style={{ fontSize: 'clamp(38px,4.6vw,70px)', letterSpacing: '-0.04em', lineHeight: 0.96, textShadow: '0 1px 3px rgba(0,0,0,0.45)' }}
        >
          <span className="block overflow-hidden pb-[0.14em] -mb-[0.14em]">
            <span className="rb-hero-line block" style={{ transform: 'translateY(120%)', animation: `rbmLine .95s ${EASE} forwards ${heroDelay(1.75, 0.14)}s` }}>
              Exceptional Cars.{' '}
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.14em] -mb-[0.14em]">
            <span className="rb-hero-line block" style={{ transform: 'translateY(120%)', animation: `rbmLine .95s ${EASE} forwards ${heroDelay(1.88, 0.22)}s` }}>
              One Trusted Partner.
            </span>
          </span>
        </h1>
        <p
          className="rb-hero-in relative z-[2] mt-7 max-w-[520px] text-[16px] font-medium leading-relaxed text-rb-tx-2"
          style={{ textShadow: '0 1px 20px rgba(0,0,0,0.8)', opacity: 0, animation: `fadeUp .9s ${EASE} forwards ${heroDelay(2.35, 0.34)}s` }}
        >
          Exotic and collector vehicle sales, consignment, protection and customization—under one
          roof in Austin, Texas.
        </p>
        <div
          className="rb-hero-in relative z-[2] mt-8 flex flex-wrap items-center gap-3.5"
          style={{ opacity: 0, animation: `fadeUp .9s ${EASE} forwards ${heroDelay(2.55, 0.44)}s` }}
        >
          <Link href="/dealer/inventory" className={heroRed}>
            View Inventory
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden><path d="M4 12L12 4M12 4H5.2M12 4V10.8" stroke="currentColor" strokeWidth="1.5" /></svg>
          </Link>
          <Link href="/dealer/sell" className={heroRed}>
            Sell Your Vehicle
          </Link>
          <Link href="/restoration" className={heroGhost}>
            Explore Restoration Services
          </Link>
        </div>
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

      {/* ——— 2 · DIVISION MOSAIC (two divisions) ——— */}
      <section className="relative z-[1] flex h-screen snap-start items-center justify-center overflow-hidden px-4 pb-[22px] pt-[88px]">
        <div className="flex h-full w-[92%] flex-col gap-1.5">
          <div ref={mosaicRef} className="flex min-h-0 flex-1 gap-1.5">
            {/* SALES & CONSIGNMENT */}
            <div className="min-h-0 min-w-0 flex-1" style={dashReveal(0)}>
              <Link href="/dealer" className={`${tileCls} h-full w-full`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/home-sales-tile.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: 'center 62%' }} />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.12)_0%,rgba(10,10,10,0)_38%,rgba(8,8,8,0.55)_70%,rgba(6,6,6,0.92)_100%)]" />
                <div className="absolute right-[22px] top-[22px] text-white"><MosaicArrow /></div>
                <div className="absolute inset-x-0 bottom-0 p-[30px] px-[34px]">
                  <div className="mb-2.5 text-[32px] font-semibold tracking-tight text-white">Sales &amp; Consignment</div>
                  <div className="max-w-[420px] text-[15px] leading-relaxed text-[#d6d6d6]">
                    Curated inventory and premium consignment representation for enthusiast and
                    collector vehicles.
                  </div>
                  <span className="mt-5 inline-flex items-center gap-2.5 bg-rb-red px-5 py-3 text-[12px] font-semibold tracking-[1.5px] text-white">
                    EXPLORE SALES
                    <MosaicArrow size={13} />
                  </span>
                </div>
              </Link>
            </div>

            {/* PROTECTION & CUSTOMIZATION */}
            <div className="min-h-0 min-w-0 flex-1" style={dashReveal(1)}>
              <Link href="/restoration" className={`${tileCls} h-full w-full`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/home-protection-tile.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: 'center 53%' }} />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.12)_0%,rgba(10,10,10,0)_38%,rgba(8,8,8,0.55)_70%,rgba(6,6,6,0.92)_100%)]" />
                <div className="absolute right-[22px] top-[22px] text-white"><MosaicArrow /></div>
                <div className="absolute inset-x-0 bottom-0 p-[30px] px-[34px]">
                  <div className="mb-2.5 text-[32px] font-semibold tracking-tight text-white">Protection &amp; Customization</div>
                  <div className="max-w-[420px] text-[15px] leading-relaxed text-[#d6d6d6]">
                    PPF, ceramic coatings, paint correction, vinyl wraps, tint, detailing, wheels
                    and specialty automotive projects.
                  </div>
                  <span className="mt-5 inline-flex items-center gap-2.5 bg-rb-red px-5 py-3 text-[12px] font-semibold tracking-[1.5px] text-white">
                    EXPLORE SERVICES
                    <MosaicArrow size={13} />
                  </span>
                </div>
              </Link>
            </div>

          </div>

          {/* capabilities — static row (side-scroll marquee removed 2026-07-08) */}
          <div
            className="flex-none border-t border-rb-line bg-rb-surface"
            style={dashReveal(2)}
          >
            <div className="flex flex-wrap items-center justify-center">
              {TICKER.map((cap) => (
                <Link
                  key={cap.label}
                  href={cap.href}
                  className="inline-flex items-center gap-2.5 px-5 py-[15px] transition-colors duration-150 hover:bg-rb-raised"
                >
                  <span className="h-1.5 w-1.5 flex-none bg-rb-red" />
                  <span className="whitespace-nowrap text-[11.5px] font-semibold uppercase tracking-[2px] text-[#cfcfcf]">
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

          {/* manifesto — owner copy, verbatim. Scaled to match the Tell Us
              section below; division description columns + square link tiles
              follow the paragraph. */}
          <div className="px-6 pt-[72px] md:px-12 md:pt-[96px]">
            <div data-hreveal className="mb-8 font-mono text-[11px] uppercase tracking-[4px] text-rb-red" style={reveal()}>
              — What we do
            </div>
            <h2 className="m-0 max-w-[16ch] font-extrabold text-white" style={{ fontSize: 'clamp(38px,5.4vw,84px)', letterSpacing: '-0.04em', lineHeight: 0.98 }}>
              <span data-hreveal className="block" style={reveal()}>One Facility.{' '}</span>
              <span data-hreveal className="block text-rb-tx-faint" style={reveal(0.12)}>Every Discipline.</span>
            </h2>

            <p data-hreveal className="mb-0 mt-10 max-w-[760px] text-[18px] font-medium leading-[1.75] text-rb-tx-mute md:text-[19px]" style={reveal(0.24)}>
              Red Box Motors brings vehicle sales, protection and customization together through
              one trusted automotive partner. From protecting a new delivery to representing a
              collector vehicle for sale, one accountable team can prepare, protect, present,
              sell and deliver your car — start to finish.
            </p>

            {/* division description columns — red label · paragraph · explore
                link (Collection Management stays unpublished) */}
            <div data-hreveal className="mt-14 grid gap-12 md:grid-cols-2 md:gap-14" style={reveal(0.3)}>
              {[
                {
                  label: 'Sales & Consignment',
                  text: 'Curated inventory and premium consignment representation for enthusiast and collector vehicles — buying, selling and consigning, managed by one team from first conversation to delivery.',
                  cta: 'Explore Sales',
                  href: '/dealer',
                },
                {
                  label: 'Red Box Restoration',
                  text: 'Paint protection film, ceramic coatings, paint correction, vinyl wraps, window tint, detailing, wheels and specialty automotive projects — delivered to one standard, under one roof.',
                  cta: 'Explore Services',
                  href: '/restoration',
                },
              ].map((div_) => (
                <div key={div_.href} className="border-t-2 border-rb-red/80 pt-7">
                  <div className="text-[14px] font-bold uppercase tracking-[2.5px] text-rb-red">
                    {div_.label}
                  </div>
                  <p className="mb-0 mt-4 text-[15.5px] leading-[1.75] text-[#a6a6a6]">{div_.text}</p>
                  <Link
                    href={div_.href}
                    className="mt-6 inline-flex items-center gap-2.5 text-[13.5px] font-semibold tracking-[1px] text-white transition-[gap,color] duration-200 hover:gap-4 hover:text-rb-red"
                  >
                    {div_.cta}
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <path d="M2 8H13M13 8L8.5 3.5M13 8L8.5 12.5" stroke="currentColor" strokeWidth="1.4" />
                    </svg>
                  </Link>
                </div>
              ))}
            </div>

            {/* floating link tiles — Inventory · Recent Work · Contact (modal),
                evenly spread across the section width */}
            <div data-hreveal className="mt-14 grid gap-4 sm:grid-cols-3 md:gap-6" style={reveal(0.38)}>
              {[
                {
                  href: '/dealer/inventory',
                  label: 'Inventory',
                  sub: 'Cars for sale now',
                  // car
                  icon: (
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <path d="M2 10.5h12M3.2 10.5V8.2L4.6 5h6.8L13 8.2v2.3" stroke="#fff" strokeWidth="1.3" />
                      <circle cx="5.2" cy="12.2" r="1.2" stroke="#fff" strokeWidth="1.2" />
                      <circle cx="10.8" cy="12.2" r="1.2" stroke="#fff" strokeWidth="1.2" />
                    </svg>
                  ),
                },
                {
                  href: '/restoration/work',
                  label: 'Recent Work',
                  sub: 'Project gallery',
                  // photo gallery
                  icon: (
                    <svg width="15" height="15" viewBox="0 0 18 18" fill="none" aria-hidden>
                      <rect x="2.5" y="3.5" width="13" height="11" stroke="#fff" strokeWidth="1.3" />
                      <circle cx="6" cy="7" r="1.3" fill="#fff" />
                      <path d="M3.5 13L7 9.5L9.5 12L12 9L14.5 11.5" stroke="#fff" strokeWidth="1.3" />
                    </svg>
                  ),
                },
                {
                  href: null,
                  label: 'Contact Us',
                  sub: 'Reach the team',
                  // envelope
                  icon: (
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <path d="M2 4h12v8H2z M2 4l6 4 6-4" stroke="#fff" strokeWidth="1.3" />
                    </svg>
                  ),
                },
              ].map((tile) => {
                const inner = (
                  <>
                    <span className="flex h-8 w-8 flex-none items-center justify-center bg-rb-red transition-transform duration-[240ms] ease-rb group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                      {tile.icon}
                    </span>
                    <span className="flex flex-col gap-1.5">
                      <span className="text-[12.5px] font-semibold uppercase tracking-[2px] text-white md:text-[13.5px]">
                        {tile.label}
                      </span>
                      <span className="text-[11px] tracking-[0.4px] text-rb-tx-mute-3">{tile.sub}</span>
                    </span>
                  </>
                );
                return tile.href ? (
                  <Link key={tile.label} href={tile.href} className={overviewSquareCls} style={overviewSquareBg}>
                    {inner}
                  </Link>
                ) : (
                  <ContactLink key={tile.label} className={overviewSquareCls} style={overviewSquareBg}>
                    {inner}
                  </ContactLink>
                );
              })}
            </div>
          </div>

          {/* featured marquee — unpublished (SHOW_FEATURED) */}
          {SHOW_FEATURED && marquee.length > 0 && (
            <div className="pt-16">
              <div className="group overflow-hidden">
                {/* static, user-scrollable (auto-marquee removed 2026-07-08) */}
                <div className="rb-noscrollbar flex gap-1.5 overflow-x-auto px-1.5">
                  {marquee.map((c) => (
                    <FeaturedSquare key={`${c.type}-${c.id}`} card={c} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TELL US ABOUT YOUR CAR — two customer paths */}
          <div className="mt-[96px] grid border-t border-rb-line bg-rb-surface md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
            <div className="relative min-h-[340px] overflow-hidden bg-rb-surface-4 md:min-h-[640px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/home-tell-us.jpg" alt="Talk to Red Box Motors" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: '34% center' }} />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,10,10,0)_46%,rgba(10,10,10,0.5)_80%,rgba(10,10,10,0.96)_100%)]" />
            </div>
            <div className="flex flex-col justify-center px-6 py-[72px] md:px-16 md:py-[110px]">
              <div data-hreveal className="mb-6 font-mono text-[11px] uppercase tracking-[4px] text-rb-red" style={reveal()}>
                — Where do we start?
              </div>
              <h2 data-hreveal className="m-0 max-w-[14ch] font-extrabold text-white" style={{ ...reveal(), fontSize: 'clamp(40px,5.4vw,84px)', letterSpacing: '-0.045em', lineHeight: 0.94 }}>
                Tell us about your car.
              </h2>

              <div data-hreveal className="mt-10 border-t border-[#232323]" style={reveal(0.1)}>
                {[
                  {
                    href: '/dealer',
                    label: 'Buy or Sell a Vehicle',
                    sub: 'View available inventory or discuss professional consignment representation.',
                  },
                  {
                    href: '/restoration',
                    label: 'Protect or Customize a Vehicle',
                    sub: 'Request an estimate for PPF, coatings, paint correction, wraps, tint, detailing, wheels or specialty work.',
                  },
                ].map((row) => (
                  <Link
                    key={row.href}
                    href={row.href}
                    className="flex items-center justify-between gap-5 border-b border-rb-line-2 px-1 py-8 transition-[padding-left,background] duration-200 hover:bg-[rgba(204,0,0,0.06)] hover:pl-4 md:py-9"
                  >
                    <span className="flex flex-col gap-2.5">
                      <span className="flex items-center gap-4">
                        <span className="h-2 w-2 flex-none bg-rb-red" />
                        <span className="text-[20px] font-semibold tracking-[0.2px] text-white md:text-[22px]">{row.label}</span>
                      </span>
                      <span className="pl-6 text-[14.5px] leading-relaxed tracking-[0.2px] text-rb-tx-mute-3 md:text-[15px]">{row.sub}</span>
                    </span>
                    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" className="flex-none" aria-hidden>
                      <path d="M4 12L12 4M12 4H5.2M12 4V10.8" stroke="#CC0000" strokeWidth="1.5" />
                    </svg>
                  </Link>
                ))}
              </div>

              <div data-hreveal className="mt-11 flex flex-wrap items-center gap-[22px]" style={reveal(0.14)}>
                <Link href="/dealer/sell" className="rb-btn-red inline-flex items-center gap-3.5 bg-rb-red px-9 py-5 text-[15px] font-semibold tracking-[0.5px] text-white">
                  Tell Us About Your Vehicle
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden><path d="M4 12L12 4M12 4H5.2M12 4V10.8" stroke="#fff" strokeWidth="1.5" /></svg>
                </Link>
                <Link href="/about" className="text-[13.5px] tracking-[1.5px] text-rb-tx-mute transition-colors duration-150 hover:text-white">
                  About Red Box Motors →
                </Link>
              </div>
              <div data-hreveal className="mt-14 flex items-center gap-[11px]" style={reveal(0.24)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/brand/rbm-logo-header.png" alt="" className="h-[26px] w-[26px]" />
                <span className="text-[11px] uppercase tracking-[2px] text-rb-tx-faint">
                  Red Box Motors · Austin, Texas
                </span>
              </div>
            </div>
          </div>

          {/* Visit & FAQ — generous breathing room above so it reads as its own
              chapter, clearly separated from the Tell Us section */}
          <div
            className="pt-[110px] md:pt-[160px]"
            style={{ background: 'linear-gradient(180deg,#050505 0px,#0A0A0A 110px,#111 260px)' }}
          >
            {visitAndFaq}
          </div>
        </div>
      </section>
    </div>
  );
}
