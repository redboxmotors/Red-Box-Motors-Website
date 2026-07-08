import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteNav } from '@/components/site/SiteNav';
import { ScrollShell } from '@/components/site/ScrollShell';
import { HeroSection, HeroBadge } from '@/components/site/Hero';
import { ExpandingScrollBox } from '@/components/site/ExpandingScrollBox';
import { VisitAndFAQ } from '@/components/site/VisitAndFAQ';
import { BuildsGrid } from '@/components/cosmetics/BuildsGrid';
import { getSurfaceCards } from '@/lib/public/content';
import { SchemaScript } from '@/components/site/SchemaScript';
import { serviceSchema } from '@/lib/seo/schema';
import type { Faq } from '@/components/site/FaqAccordion';

// Red Box Restoration — the consolidated protection/restoration/customization
// page (formerly "Cosmetics"; /cosmetics now 301s here). All services live
// here as anchored sections with a sticky jump menu; the old per-service
// subpages still exist but are unlinked. Recent Work remains its own
// portfolio page. Estimate CTAs route to /restoration/estimate (owner
// checklist 2026-07-07) — one band every few sections plus a sticky button,
// not one per service.

export const revalidate = 60;

export const metadata: Metadata = {
  alternates: { canonical: '/restoration' },
  title: { absolute: 'Red Box Restoration — Vehicle Protection, Restoration & Customization | Red Box Motors' },
  description:
    'Paint protection film, paint correction, ceramic coatings, vinyl wraps, window tint, detailing and wheel services in Austin, TX.',
};

const EASE = 'cubic-bezier(.2,.8,.2,1)';

const eyebrowCls = 'font-mono text-[11px] uppercase tracking-[4px] text-rb-red';

// The seven service sections. STEK and Carbon Collective are the confirmed
// brand partners — no invented numeric claims. Every section carries a photo:
// real assets where we have a suitable one, named placeholder slots
// (/assets/placeholders/*, "Photography coming soon") where we don't —
// same filename = drop-in swap when real photography lands.
const SERVICES: {
  id: string;
  num: string;
  title: string;
  tags: string[];
  paras: string[];
  img: { src: string; alt: string; pos?: string; placeholder?: boolean };
}[] = [
  {
    id: 'ppf',
    num: '01',
    title: 'Paint Protection Film',
    tags: ['STEK', 'Self-healing', 'High-impact', 'Optically clear'],
    paras: [
      'A tough, optically clear urethane layer that takes the rock chips, road rash and bug etching that would otherwise scar your paint — while its self-healing top coat erases light swirls with heat.',
      'We install STEK PPF, precision-cut for every panel with wrapped edges wherever possible, from high-impact front-end packages to full-body coverage.',
    ],
    img: { src: '/assets/ppf-coverage.jpg', alt: 'Porsche GT2 RS protected with paint protection film', pos: 'center 42%' },
  },
  {
    id: 'correction',
    num: '02',
    title: 'Paint Correction',
    tags: ['Multi-stage', 'Swirl removal', 'Machine polish'],
    paras: [
      'Swirls, holograms and wash marring are leveled by machine, stage by stage, until the paint reads flat and deep. Where needed, paint correction creates the proper foundation before a coating or film installation — and it can also restore depth and clarity as a standalone service.',
    ],
    img: {
      src: '/assets/placeholders/paint-correction.jpg',
      alt: 'Multi-stage machine paint correction at Red Box Restoration',
      placeholder: true,
    },
  },
  {
    id: 'coatings',
    num: '03',
    title: 'Ceramic Coatings',
    tags: ['Carbon Collective', 'Gloss', 'Chemical resistance'],
    paras: [
      'Carbon Collective ceramic coatings applied over a proper correction. The finish sheds water, resists fading and chemicals, and stays dramatically easier to keep clean — long after the car leaves the bay.',
    ],
    img: {
      src: '/assets/mclaren-p1.jpg',
      alt: 'Deep gloss finish on a McLaren P1 — ceramic-coated paint',
      pos: 'center 60%',
    },
  },
  {
    id: 'wraps',
    num: '04',
    title: 'Vinyl Wraps, Graphics & Liveries',
    tags: ['Color change', 'Graphics', 'Reversible'],
    paras: [
      'Color-change wraps, satin and gloss finishes, racing liveries and commercial graphics. Vinyl provides a reversible appearance change when installed over suitable paint and removed using proper techniques — paint condition and prior repairs can affect removal, and we assess that up front.',
    ],
    img: {
      src: '/assets/placeholders/vinyl-wrap.jpg',
      alt: 'Color-change vinyl wrap installation at Red Box Restoration',
      placeholder: true,
    },
  },
  {
    id: 'tint',
    num: '05',
    title: 'Window Tint',
    tags: ['Heat rejection', 'UV protection', 'Clean edges'],
    paras: [
      'Precision-cut window film for heat rejection, UV protection and a finished look — installed with the same edge discipline as our film work.',
    ],
    img: {
      src: '/assets/placeholders/window-tint.jpg',
      alt: 'Window tint installation at Red Box Restoration',
      placeholder: true,
    },
  },
  {
    id: 'detailing',
    num: '06',
    title: 'Detailing & Vehicle Care',
    tags: ['Wash & decon', 'Interior', 'Maintenance'],
    paras: [
      'Detailing is where Red Box started. Proper wash and decontamination, interior care and maintenance details that protect the work — and the value — already in the car.',
    ],
    // Real wash-bay photo (replaces the wash-bay.jpg placeholder slot). Note:
    // includes a team member — swap back to /assets/placeholders/wash-bay.jpg
    // if a people-free shot is preferred.
    img: {
      src: '/assets/cosmetics-wash.jpeg',
      alt: 'Foam wash in the Red Box Restoration detailing bay, Austin TX',
      pos: 'center 55%',
    },
  },
  {
    id: 'wheels',
    num: '07',
    title: 'Wheels, Tires & Calipers',
    tags: ['Refinishing', 'Powder coat', 'Fitment'],
    paras: [
      'Red Box Restoration manages wheel repair, refinishing, custom finishes, tire sourcing, mounting and installation, coordinating specialized finishing partners where required — caliper refinishing handled in the same visit.',
      'We also coordinate select specialty automotive projects, including suspension, stance and one-off appearance work.',
    ],
    img: {
      src: '/assets/ppf-disassembly.jpg',
      alt: 'Lifted truck on aftermarket wheels and tires in the Red Box shop',
      pos: 'center 62%',
    },
  },
];

// Detailed service questions live here (moved off the homepage).
const RESTORATION_FAQ: Faq[] = [
  { q: 'How do I get an estimate?', a: 'Use the estimate form — tell us the vehicle and what you want to protect or change, and we will walk you through options and put together a written estimate. Photos help; an in-person look is even better.' },
  { q: 'What PPF coverage do you offer?', a: 'From high-impact front-end packages to full-body coverage, precision-cut per panel with wrapped edges wherever possible, in STEK clear and color films.' },
  { q: 'Does ceramic coating require paint correction?', a: 'Coatings lock in whatever is under them, so where needed we correct the paint to the agreed level first — that is what gives the finish its depth.' },
  { q: 'Are vinyl wraps reversible?', a: 'When installed over suitable paint and removed using proper techniques, vinyl provides a reversible appearance change. Paint condition and prior repairs can affect removal — we assess that before the work starts.' },
];

// Shared process — one section for every service (owner checklist).
const PROCESS = [
  ['Consultation', 'Tell us about the car and what you want to accomplish.'],
  ['Inspection & Scope', 'We assess the vehicle and agree on the exact work in writing.'],
  ['Preparation', 'Wash, decontamination and the prep the finish demands.'],
  ['Execution', 'The work itself — film, polish, coating, wrap or wheels.'],
  ['Final Inspection & Delivery', 'Checked panel by panel before the car goes home.'],
] as const;

// Sticky jump menu targets (owner checklist: PPF | Correction | Coatings |
// Wraps | Tint | Detailing | Wheels).
const JUMP = [
  ['ppf', 'PPF'],
  ['correction', 'Correction'],
  ['coatings', 'Coatings'],
  ['wraps', 'Wraps'],
  ['tint', 'Tint'],
  ['detailing', 'Detailing'],
  ['wheels', 'Wheels'],
] as const;

function Arrow({ size = 14, width = 1.5 }: { size?: number; width?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M4 12L12 4M12 4H5.2M12 4V10.8" stroke="currentColor" strokeWidth={width} />
    </svg>
  );
}

export default async function RestorationPage() {
  const builds = await getSurfaceCards('cosmetics_builds_preview', 8);

  return (
    <ScrollShell bg="/assets/ppf-hero.jpg" bgPosition="center 55%">
      <SchemaScript
        schema={serviceSchema(
          'Vehicle Protection, Restoration & Customization',
          'Paint protection film, paint correction, ceramic coatings, vinyl wraps, window tint, detailing and wheel services in Austin, TX.',
          '/restoration',
        )}
      />
      <SiteNav current="cosmetics" />

      {/* ——— 1 · HERO ——— */}
      <HeroSection>
        <HeroBadge>Red Box Motors · Red Box Restoration</HeroBadge>
        <h1
          className="relative z-[2] m-0 font-extrabold text-white"
          style={{
            fontSize: 'clamp(30px, 3.8vw, 60px)',
            letterSpacing: '-0.03em',
            lineHeight: 1.0,
            textShadow: '0 1px 3px rgba(0,0,0,0.45)',
          }}
        >
          <span className="block overflow-hidden pb-[0.14em] -mb-[0.14em]">
            <span
              className="rb-hero-line block"
              style={{ transform: 'translateY(120%)', animation: `rbmLine .95s ${EASE} forwards .28s` }}
            >
              Vehicle Protection,{' '}
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.14em] -mb-[0.14em]">
            <span
              className="rb-hero-line block"
              style={{ transform: 'translateY(120%)', animation: `rbmLine .95s ${EASE} forwards .41s` }}
            >
              Restoration &amp; Customization
            </span>
          </span>
        </h1>
        <p
          className="rb-hero-in relative z-[2] m-0 mt-7 max-w-[560px] text-[16px] font-medium leading-[1.6] tracking-[0.3px] text-rb-tx-2"
          style={{
            textShadow: '0 1px 24px rgba(0,0,0,0.85)',
            opacity: 0,
            animation: `fadeUp .9s ${EASE} forwards .9s`,
          }}
        >
          Paint protection film, paint correction, ceramic coatings, vinyl wraps, window tint,
          detailing and wheels — Red Box Restoration, Austin, Texas.
        </p>
        <div
          className="rb-hero-in relative z-[2] mt-8 flex flex-wrap items-center gap-3.5"
          style={{ opacity: 0, animation: `fadeUp .9s ${EASE} forwards 1.05s` }}
        >
          <Link
            href="/restoration/estimate"
            className="rb-btn-red inline-flex items-center gap-2.5 bg-rb-red px-[24px] py-[14px] text-[12.5px] font-semibold tracking-[1px] text-white"
          >
            Request an Estimate
            <Arrow size={13} />
          </Link>
          <Link
            href="/restoration/work"
            className="rb-btn inline-flex items-center gap-2.5 border border-rb-red bg-transparent px-[22px] py-[13px] text-[12.5px] font-semibold tracking-[1px] text-rb-red transition-colors duration-[180ms] hover:bg-rb-red hover:text-white"
          >
            See Recent Work
          </Link>
        </div>
      </HeroSection>

      {/* ——— 2 · BOXED OVERVIEW ——— */}
      <ExpandingScrollBox>
        {/* photo header — PPF prep in progress */}
        <div className="relative h-[400px] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/bring-us-car.jpg"
            alt="Red Box Restoration bay — vehicle prepared for paint protection film"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: 'center 46%' }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.10)_0%,rgba(10,10,10,0.04)_40%,rgba(10,10,10,0.55)_74%,rgba(10,10,10,0.92)_92%,#0A0A0A_100%)]" />
        </div>

        {/* manifesto / lead */}
        <div className="px-6 pt-[52px] md:px-[52px]">
          <div data-reveal className={`mb-7 ${eyebrowCls}`}>
            — Red Box Restoration · Austin, Texas
          </div>
          <h2
            className="m-0 max-w-[18ch] font-bold text-white"
            style={{ fontSize: 'clamp(30px, 4.2vw, 60px)', letterSpacing: '-0.03em', lineHeight: 1.04 }}
          >
            <span data-reveal className="block">
              Protection, finish
            </span>
            <span data-reveal className="block text-rb-tx-faint" style={{ transitionDelay: '.12s' }}>
              and detail — done right.
            </span>
          </h2>
          <p
            data-reveal
            className="mb-0 mt-9 max-w-[640px] text-[17px] font-medium leading-[1.7] text-rb-tx-mute"
            style={{ transitionDelay: '.24s' }}
          >
            Red Box Restoration is where the company started — protecting, correcting and
            transforming enthusiast and collector vehicles in Austin, Texas. Every service below
            runs through the same bay, the same obsessive prep and the same standard.
          </p>
        </div>

        {/* ——— STICKY JUMP MENU ——— */}
        <nav
          aria-label="Services"
          className="sticky top-[64px] z-30 mt-12 border-y border-rb-line bg-[#0A0A0A]/92 px-4 backdrop-blur-md md:px-[44px]"
        >
          <div className="rb-noscrollbar flex items-center gap-1 overflow-x-auto">
            {JUMP.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                className="whitespace-nowrap px-3 py-3.5 text-[11.5px] font-semibold uppercase tracking-[1.5px] text-rb-tx-mute transition-colors duration-150 hover:text-white"
              >
                {label}
              </a>
            ))}
            <span className="flex-1" />
            <Link
              href="/restoration/estimate"
              className="hidden whitespace-nowrap px-3 py-3.5 text-[11.5px] font-semibold uppercase tracking-[1.5px] text-rb-red transition-colors duration-150 hover:text-white sm:inline"
            >
              Request an Estimate →
            </Link>
          </div>
        </nav>

        {/* ——— SERVICES ——— */}
        <div id="services" className="px-6 pb-6 pt-2 md:px-[52px]">
          {SERVICES.map((svc, i) => (
            <div key={svc.id}>
            {/* Estimate band after every few sections (owner checklist) —
                replaces the old one-CTA-per-service pattern. */}
            {(i === 3 || i === 6) && (
              <div className="mb-2 flex flex-wrap items-center justify-between gap-4 border-t border-rb-line bg-rb-surface-3 px-6 py-6">
                <span className="text-[15px] font-medium tracking-[0.2px] text-rb-tx-2">
                  Ready to talk about your car?
                </span>
                <Link
                  href="/restoration/estimate"
                  className="rb-btn-red inline-flex items-center gap-2.5 bg-rb-red px-6 py-3.5 text-[12.5px] font-semibold tracking-[1px] text-white"
                >
                  Request an Estimate
                  <Arrow size={13} />
                </Link>
              </div>
            )}
            <div
              id={svc.id}
              data-reveal
              className="grid gap-8 border-t border-rb-line py-16 md:grid-cols-[84px_minmax(0,1fr)]"
              style={{ scrollMarginTop: '124px' }}
            >
              <div
                className="text-[52px] font-extrabold text-rb-red"
                style={{ lineHeight: 0.8, letterSpacing: '-0.04em' }}
              >
                {svc.num}
              </div>
              <div className="grid gap-9 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
                <div>
                  <h3
                    className="m-0 font-bold text-white"
                    style={{ fontSize: 'clamp(26px,2.8vw,38px)', letterSpacing: '-0.025em', lineHeight: 1.05 }}
                  >
                    {svc.title}
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {svc.tags.map((t) => (
                      <span
                        key={t}
                        className="border border-rb-line-2 px-3 py-2 font-mono text-[10px] uppercase tracking-[1.5px] text-[#b0b0b0]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  {svc.paras.map((p) => (
                    <p key={p.slice(0, 24)} className="mb-0 mt-6 max-w-[620px] text-[15.5px] leading-[1.78] text-[#a6a6a6]">
                      {p}
                    </p>
                  ))}
                </div>
                <div className="relative min-h-[260px] overflow-hidden bg-rb-surface-4 md:min-h-[300px]">
                  {/* Placeholder slots live in /public/assets/placeholders/ —
                      replacing the file (same filename) swaps the photo in. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={svc.img.src}
                    alt={svc.img.alt}
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{ objectPosition: svc.img.pos ?? 'center' }}
                    loading="lazy"
                  />
                  {svc.img.placeholder && (
                    <div className="absolute inset-x-0 bottom-0 px-4 py-3">
                      <span className="font-mono text-[9px] uppercase tracking-[2px] text-[#555]">
                        Photography coming soon
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            </div>
          ))}
        </div>

        {/* ——— THE PROCESS — one shared flow for every service ——— */}
        <div className="px-6 pb-16 md:px-[52px]">
          <div data-reveal className={`mb-[13px] ${eyebrowCls}`}>
            — How every project runs
          </div>
          <h2
            data-reveal
            className="m-0 font-bold leading-none text-white"
            style={{ fontSize: 'clamp(26px,3.2vw,44px)', letterSpacing: '-0.03em' }}
          >
            One process, every service
          </h2>
          <ol className="mt-10 grid gap-0.5 md:grid-cols-5">
            {PROCESS.map(([title, detail], i) => (
              <li
                key={title}
                data-reveal
                className="bg-rb-surface-3 px-5 py-6"
                style={{ transitionDelay: `${i * 0.06}s` }}
              >
                <span className="block text-[12px] font-semibold tracking-[1px] text-rb-red">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="mt-2.5 block text-[14.5px] font-semibold tracking-[0.2px] text-white">
                  {title}
                </span>
                <span className="mt-1.5 block text-[12.5px] leading-relaxed text-rb-tx-faint">
                  {detail}
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* recent work preview */}
        <div className="pb-[52px]" style={{ background: 'linear-gradient(180deg,#0A0A0A 0px,#151515 160px)' }}>
          <div className="pt-14">
            <div
              data-reveal
              className="mb-[18px] flex flex-wrap items-end justify-between gap-5 px-6 md:px-[52px]"
            >
              <div>
                <div className={`mb-[13px] ${eyebrowCls}`}>— Recent work</div>
                <h2
                  className="m-0 font-bold leading-none text-white"
                  style={{ fontSize: 'clamp(28px, 3.6vw, 52px)', letterSpacing: '-0.03em' }}
                >
                  From the shop floor
                </h2>
              </div>
              <Link
                href="/restoration/work"
                className="inline-flex flex-none items-center gap-[9px] whitespace-nowrap border border-rb-red bg-transparent px-6 py-[13px] text-[13px] font-semibold tracking-[0.5px] text-rb-red transition-[background,color,transform] duration-[220ms] ease-rb hover:-translate-y-0.5 hover:bg-rb-red hover:text-white active:translate-y-0 active:scale-[0.98]"
              >
                View all work
                <Arrow size={13} width={1.3} />
              </Link>
            </div>
            <p
              data-reveal
              className="mb-[30px] mt-0 max-w-[680px] px-6 text-[14.5px] leading-[1.75] text-[#999] md:px-[52px]"
              style={{ transitionDelay: '.1s' }}
            >
              Recent paint protection, correction, coating, wrap and wheel projects — documented
              panel by panel so you can see exactly the finish and standard you can expect on your
              own car.
            </p>

            <BuildsGrid cards={builds} />
          </div>
        </div>

        {/* estimate CTA */}
        <div style={{ background: 'linear-gradient(180deg,#151515 0px,#0A0A0A 220px)' }}>
          <div className="flex flex-col md:flex-row">
            {/* photo side */}
            <div className="relative min-h-[340px] min-w-0 flex-[1.05] overflow-hidden md:min-h-[600px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/trust-gt3rs.jpeg"
                alt="Porsche GT3 RS at Red Box Restoration, Austin TX"
                className="absolute inset-0 h-full w-full object-cover"
                style={{ objectPosition: 'center 56%' }}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,10,10,0)_55%,rgba(10,10,10,0.55)_82%,rgba(10,10,10,0.95)_100%)]" />
              <div className="absolute bottom-0 left-0 px-[30px] py-[26px]">
                <div className="font-mono text-[11px] uppercase tracking-[3px] text-[#cfcfcf]">
                  Austin, TX
                </div>
              </div>
            </div>
            {/* copy side */}
            <div className="flex min-w-0 flex-1 flex-col justify-center px-6 py-20 md:px-16 md:py-[110px]">
              <div className={`mb-[22px] ${eyebrowCls}`}>— Start a project</div>
              <h2
                className="m-0 max-w-[14ch] font-extrabold text-white"
                style={{ fontSize: 'clamp(40px, 5.4vw, 80px)', letterSpacing: '-0.04em', lineHeight: 0.96 }}
              >
                Bring us the car.
              </h2>
              <p className="mb-0 mt-7 max-w-[480px] text-[17px] font-medium leading-[1.7] text-rb-tx-mute">
                Tell us what you&rsquo;re protecting or transforming and we&rsquo;ll walk you
                through the right approach for your car.
              </p>

              <div className="mt-11 flex flex-wrap items-center gap-[22px]">
                <Link
                  href="/restoration/estimate"
                  className="rb-btn-red inline-flex items-center gap-3.5 bg-rb-red px-9 py-5 text-[15px] font-semibold tracking-[0.5px] text-white"
                >
                  Request an Estimate
                  <Arrow size={16} />
                </Link>
                <Link
                  href="/restoration/work"
                  className="inline-flex items-center gap-2 border border-rb-red bg-transparent px-[30px] py-[17px] text-[14px] font-semibold tracking-[0.5px] text-rb-red transition-[background,color,transform] duration-[220ms] ease-rb hover:-translate-y-0.5 hover:bg-rb-red hover:text-white active:translate-y-0 active:scale-[0.98]"
                >
                  See recent work
                  <Arrow size={15} />
                </Link>
              </div>
              <div className="mt-14 flex items-center gap-[11px] border-t border-rb-line pt-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/brand/rbm-logo-header.png" alt="" className="h-[24px] w-[24px]" />
                <span className="text-[11px] uppercase tracking-[2px] text-rb-tx-faint">
                  Red Box Motors · Red Box Restoration
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* visit & FAQ */}
        <div style={{ background: 'linear-gradient(180deg,#151515 0px,#0A0A0A 130px)' }}>
          <VisitAndFAQ division="cosmetics" faqs={RESTORATION_FAQ} />
        </div>
      </ExpandingScrollBox>

      {/* STICKY ESTIMATE CTA */}
      <Link
        href="/restoration/estimate"
        className="rb-btn-red fixed bottom-[26px] right-[26px] z-40 hidden items-center gap-[11px] bg-rb-red px-[22px] py-[15px] sm:flex shadow-[0_12px_30px_rgba(204,0,0,0.34)]"
      >
        <span className="h-[7px] w-[7px] flex-none bg-white" />
        <span className="text-[12px] font-semibold tracking-[1.5px] text-white">Request an Estimate</span>
        <Arrow size={13} />
      </Link>
    </ScrollShell>
  );
}
