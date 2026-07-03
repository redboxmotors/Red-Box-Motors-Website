import type { Metadata } from 'next';
import Link from 'next/link';
import { ContactLink } from '@/components/contact/ContactModal';
import { PreviewGrid } from '@/components/dealer/PreviewTiles';
import { ExpandingScrollBox } from '@/components/site/ExpandingScrollBox';
import { HeroBadge, HeroCtaRed, HeroCtas, HeroSection, HeroSub } from '@/components/site/Hero';
import { ScrollShell } from '@/components/site/ScrollShell';
import { SiteNav } from '@/components/site/SiteNav';
import { VisitAndFAQ } from '@/components/site/VisitAndFAQ';
import { getSurfaceCards } from '@/lib/public/content';
import { SchemaScript } from '@/components/site/SchemaScript';
import { localBusinessSchema } from '@/lib/seo/schema';
import { getSettings } from '@/lib/public/content';

// Dealer division landing (Dealer.dc.html). Plain photo hero (no blur/scrub —
// owner revert, see CLAUDE.md) → expanding-scroll-box overview: manifesto,
// quick actions, how-it-works, For-sale / Sold / Sourced curated previews,
// CTA and Visit & FAQ. Copy is the approved prototype copy — verbatim.

export const revalidate = 60;

export const metadata: Metadata = {
  title: { absolute: 'Dealer — Private Car Sales & Acquisitions | Red Box Motors' },
  description:
    'Private sales, acquisitions and consignment of exceptional cars — nationwide, from Austin, TX.',
};

const EASE = 'cubic-bezier(.2,.8,.2,1)';

// Prototype logic block: buying = STEPS, selling = ACQ_STEPS — verbatim.
const BUYING_STEPS = [
  { num: '01', title: 'Consultation', desc: 'A private conversation about your goals and budget.' },
  { num: '02', title: 'Assessment', desc: 'Full mechanical and cosmetic review, documented.' },
  { num: '03', title: 'Positioning', desc: 'Priced against live comparables, placed precisely.' },
  { num: '04', title: 'Transaction', desc: 'Escrow, paperwork and transport — handled.' },
];
const SELLING_STEPS = [
  { num: '01', title: 'Submit Your Car', desc: 'Send details, timeline and a target number.' },
  { num: '02', title: 'Valuation & Prep', desc: 'Appraised on live data, prepared to present.' },
  { num: '03', title: 'Private Marketing', desc: 'Placed in front of our vetted buyer network.' },
  { num: '04', title: 'You Get Paid', desc: 'Funds clear, the car ships. Done.' },
];

const QUICK_ACTIONS = [
  {
    href: '/dealer/inventory',
    img: '/assets/dealer-garage.jpeg',
    pos: 'center 55%',
    title: 'Cars for sale',
    sub: 'Browse inventory',
    icon: (
      <svg width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path d="M4 12L12 4M12 4H5.2M12 4V10.8" stroke="#fff" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    href: '/contact',
    img: '/assets/consignment.jpeg',
    pos: 'center 52%',
    title: 'Sell your car',
    sub: 'Valuation & consignment',
    icon: (
      <svg width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path d="M8 13V3M8 3L3.5 7.5M8 3L12.5 7.5" stroke="#fff" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    href: '/dealer/sourced',
    img: '/assets/mclaren-p1.jpg',
    pos: 'center 45%',
    title: 'Source a car',
    sub: 'Private acquisitions',
    icon: (
      <svg width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden>
        <circle cx="7" cy="7" r="4.3" stroke="#fff" strokeWidth="1.5" />
        <path d="M10.2 10.2L14 14" stroke="#fff" strokeWidth="1.5" />
      </svg>
    ),
  },
];

const CTA_OPTIONS = [
  { href: '/dealer/inventory', label: 'Cars for sale' },
  { href: '/contact', label: 'Sell your car' },
  { href: '/contact', label: 'Source a car' },
];

// Red-outline ghost CTA (prototype's border #CC0000 buttons).
const ghostRed =
  'rb-btn inline-flex items-center gap-[9px] whitespace-nowrap border border-rb-red bg-transparent font-semibold tracking-[0.5px] text-rb-red transition-colors duration-[180ms] hover:bg-rb-red hover:text-white';

function ArrowIcon({ size = 13, stroke = 1.3 }: { size?: number; stroke?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M4 12L12 4M12 4H5.2M12 4V10.8" stroke="currentColor" strokeWidth={stroke} />
    </svg>
  );
}

// Section header row shared by the three preview rows.
function RowHeader({
  eyebrow,
  title,
  cta,
  ctaHref,
  blurb,
}: {
  eyebrow: string;
  title: string;
  cta: string;
  ctaHref: string;
  blurb: string;
}) {
  return (
    <div className="px-6 pt-14 md:px-[52px]">
      <div data-reveal className="mb-2 flex flex-wrap items-end justify-between gap-5">
        <div>
          <div className="mb-[13px] font-mono text-[11px] uppercase tracking-[4px] text-rb-red">
            {eyebrow}
          </div>
          <h2
            className="m-0 font-bold leading-none text-white"
            style={{ fontSize: 'clamp(26px,3.4vw,46px)', letterSpacing: '-0.03em' }}
          >
            {title}
          </h2>
        </div>
        <Link href={ctaHref} className={`${ghostRed} flex-none px-6 py-[13px] text-[13px]`}>
          {cta}
          <ArrowIcon />
        </Link>
      </div>
      <p
        data-reveal
        style={{ transitionDelay: '.1s' }}
        className="m-0 max-w-[680px] text-[14.5px] leading-[1.75] text-[#999]"
      >
        {blurb}
      </p>
    </div>
  );
}

function StepTrack({
  heading,
  tag,
  steps,
  delay,
  borderRight = false,
}: {
  heading: string;
  tag: string;
  steps: typeof BUYING_STEPS;
  delay: string;
  borderRight?: boolean;
}) {
  return (
    <div
      data-reveal
      style={{ transitionDelay: delay }}
      className={`px-6 pb-[54px] pt-[46px] md:px-12 ${borderRight ? 'md:border-r md:border-rb-line' : ''}`}
    >
      <div className="mb-[22px] flex items-center gap-4">
        <span className="text-[16px] font-extrabold uppercase tracking-[3px] text-white">
          {heading}
        </span>
        <span className="h-px flex-1 bg-[#242424]" />
        <span className="font-mono text-[10px] uppercase tracking-[2px] text-rb-tx-faint">{tag}</span>
      </div>
      {steps.map((step) => (
        <div key={step.num} className="flex items-start gap-6 border-t border-[#191919] py-[22px]">
          <span
            className="w-[58px] flex-none text-[42px] font-extrabold text-rb-red"
            style={{ lineHeight: 0.8, letterSpacing: '-0.04em' }}
          >
            {step.num}
          </span>
          <div>
            <div className="mb-2 text-[18px] font-bold tracking-[-0.015em] text-white">
              {step.title}
            </div>
            <div className="text-[14px] leading-[1.6] text-[#8c8c8c]">{step.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// SEO prose band (eyebrow + heading + two-column paragraphs).
function ProseBand({
  eyebrow,
  title,
  titleMax,
  left,
  right,
  className = '',
  style,
}: {
  eyebrow: string;
  title: string;
  titleMax: string;
  left: string;
  right: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={`px-6 md:px-[52px] ${className}`} style={style}>
      <div data-reveal className="max-w-[900px]">
        <div className="mb-4 font-mono text-[11px] uppercase tracking-[4px] text-rb-red">
          {eyebrow}
        </div>
        <h2
          className="m-0 font-bold text-white"
          style={{
            fontSize: 'clamp(20px,2.2vw,30px)',
            letterSpacing: '-0.025em',
            lineHeight: 1.08,
            maxWidth: titleMax,
          }}
        >
          {title}
        </h2>
      </div>
      <div
        data-reveal
        style={{ transitionDelay: '.12s' }}
        className="mt-[38px] grid gap-11 md:grid-cols-2"
      >
        <p className="m-0 text-[15px] leading-[1.8] text-[#a2a2a2]">{left}</p>
        <p className="m-0 text-[15px] leading-[1.8] text-[#a2a2a2]">{right}</p>
      </div>
    </div>
  );
}

export default async function DealerPage() {
  const [salePreview, soldPreview, foundPreview] = await Promise.all([
    getSurfaceCards('dealer_forsale_preview', 3),
    getSurfaceCards('dealer_sold_preview', 3),
    getSurfaceCards('dealer_sourced_preview', 3),
  ]);

  return (
    <>
      <SchemaScript schema={localBusinessSchema(await getSettings())} />
      <SiteNav current="dealer" />

      <ScrollShell bg="/assets/dealer-garage.jpeg" bgPosition="center 58%" scrub={false}>
        {/* ---------- 1 · HERO (plain photo — no blur/scrub, per owner) ---------- */}
        <HeroSection>
          <HeroBadge>Red Box Motors · Dealer</HeroBadge>
          <h1
            className="relative z-[2] m-0 whitespace-nowrap font-extrabold text-white"
            style={{
              fontSize: 'clamp(34px,4.6vw,72px)',
              letterSpacing: '-0.03em',
              lineHeight: 0.94,
              textShadow: '0 1px 3px rgba(0,0,0,0.45)',
            }}
          >
            <span className="inline-block overflow-hidden align-bottom">
              <span
                className="rb-hero-line block"
                style={{ transform: 'translateY(120%)', animation: `rbmLine .95s ${EASE} forwards .28s` }}
              >
                {'Drive What '}
              </span>
            </span>
            <span className="inline-block overflow-hidden align-bottom">
              <span
                className="rb-hero-line block"
                style={{ transform: 'translateY(120%)', animation: `rbmLine .95s ${EASE} forwards .41s` }}
              >
                Matters
              </span>
            </span>
          </h1>
          <HeroSub>Private acquisitions · Consignment · Transport · Nationwide</HeroSub>
          <HeroCtas>
            <HeroCtaRed href="/contact">Start a Conversation</HeroCtaRed>
            <Link href="/dealer/inventory" className={`${ghostRed} px-[22px] py-[13px] text-[12.5px]`}>
              View Inventory
            </Link>
          </HeroCtas>
        </HeroSection>

        {/* ---------- 2 · OVERVIEW (boxed scroll → fullscreen) ---------- */}
        <ExpandingScrollBox>
          {/* PHOTO HEADER */}
          <div className="relative h-[400px] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/dealer-scroll-header.jpg"
              alt="Red Box Motors dealer floor"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: 'center 55%' }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.10)_0%,rgba(10,10,10,0.04)_40%,rgba(10,10,10,0.55)_74%,rgba(10,10,10,0.92)_92%,#0A0A0A_100%)]" />
          </div>

          {/* MANIFESTO / LEAD */}
          <div className="px-6 pt-[52px] md:px-[52px]">
            <div data-reveal className="mb-7 font-mono text-[11px] uppercase tracking-[4px] text-rb-red">
              — Dealer · Nationwide
            </div>
            <h2
              className="m-0 max-w-[18ch] font-bold text-white"
              style={{ fontSize: 'clamp(30px,4.2vw,60px)', letterSpacing: '-0.03em', lineHeight: 1.04 }}
            >
              <span data-reveal className="block">
                Buy, sell and source
              </span>
              <span data-reveal style={{ transitionDelay: '.12s' }} className="block text-rb-tx-faint">
                the cars that matter.
              </span>
            </h2>
            <p
              data-reveal
              style={{ transitionDelay: '.24s' }}
              className="mb-0 mt-9 max-w-[640px] text-[17px] font-medium leading-[1.7] text-rb-tx-mute"
            >
              Red Box Motors is a private dealer for enthusiast and collector cars — buying,
              selling, consignment and acquisitions handled with discretion and backed by live
              market data. One point of contact for the whole transaction, from the first
              conversation to the car in your driveway.
            </p>
          </div>

          {/* QUICK ACTIONS */}
          <div
            data-reveal
            style={{ transitionDelay: '.3s' }}
            className="grid gap-2 px-6 pt-12 md:grid-cols-3 md:px-[52px]"
          >
            {QUICK_ACTIONS.map((qa) => {
              const cls =
                'relative z-[1] flex items-center justify-center overflow-hidden bg-rb-surface-4 px-5 py-[46px] text-center transition-[filter,transform,box-shadow] duration-[240ms] ease-rb hover:z-[2] hover:-translate-y-[5px] hover:shadow-[0_24px_48px_rgba(0,0,0,0.6)] hover:brightness-[1.22] active:translate-y-0 active:scale-[0.99]';
              const inner = (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qa.img}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover opacity-50"
                    style={{
                      objectPosition: qa.pos,
                      filter: 'blur(26px) brightness(0.6) saturate(1.2)',
                      transform: 'scale(1.35)',
                    }}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(14,14,14,0.5)_0%,rgba(10,10,10,0.82)_100%)]" />
                  <div className="relative flex flex-col items-center gap-4">
                    <div className="flex h-[46px] w-[46px] flex-none items-center justify-center bg-rb-red shadow-[0_6px_22px_rgba(204,0,0,0.4)]">
                      {qa.icon}
                    </div>
                    <div>
                      <div className="mb-2 text-[14px] font-semibold uppercase tracking-[2.5px] text-white">
                        {qa.title}
                      </div>
                      <div className="text-[11.5px] tracking-[0.3px] text-[#b0b0b0]">{qa.sub}</div>
                    </div>
                  </div>
                </>
              );
              return qa.href === '/contact' ? (
                <ContactLink key={qa.title} className={cls}>
                  {inner}
                </ContactLink>
              ) : (
                <Link key={qa.title} href={qa.href} className={cls}>
                  {inner}
                </Link>
              );
            })}
          </div>

          {/* SEO BODY — two columns */}
          <div
            data-reveal
            style={{ transitionDelay: '.14s' }}
            className="grid gap-11 px-6 pt-[52px] md:grid-cols-2 md:px-[52px]"
          >
            <div>
              <h3 className="mb-3.5 text-[14px] font-semibold uppercase tracking-[1px] text-white">
                Buying &amp; acquisitions
              </h3>
              <p className="mb-[18px] text-[14.5px] leading-[1.75] text-[#999]">
                {
                  "Every car on the floor is one we'd own ourselves — sports cars, supercars and collectibles, inspected and fully documented before it's listed. When you're after something specific, our acquisitions service goes out and finds it: off-market, pre-allocation and nationwide."
                }
              </p>
              <p className="m-0 text-[14.5px] leading-[1.75] text-[#999]">
                {
                  "Because the same roof also protects and details cars, a vehicle bought through Red Box Motors can roll straight into PPF, ceramic or a wrap before it's handed over — ready for the road or the track the day you take delivery."
                }
              </p>
            </div>
            <div>
              <h3 className="mb-3.5 text-[14px] font-semibold uppercase tracking-[1px] text-white">
                Selling &amp; consignment
              </h3>
              <p className="mb-[18px] text-[14.5px] leading-[1.75] text-[#999]">
                Selling a car you care about comes down to trust. We handle valuation, detailing,
                marketing, buyer vetting and the full transaction — escrow, paperwork and insured
                door-to-door transport — so the only thing you think about is the car. You set the
                reserve; we do the rest.
              </p>
              <p className="m-0 text-[14.5px] leading-[1.75] text-[#999]">
                {
                  "Prefer a clean, fast exit? We'll make a direct offer and close on your timeline. Either way it's quiet, correct, and at the number the car deserves."
                }
              </p>
            </div>
          </div>

          {/* FACTS ROW */}
          <div
            data-reveal
            style={{ transitionDelay: '.2s' }}
            className="flex flex-wrap gap-12 px-6 pt-[52px] md:px-[52px]"
          >
            {[
              { big: 'Nationwide', small: 'Sales & acquisitions' },
              { big: 'Door to door', small: 'Insured transport' },
              { big: 'Discreet', small: 'Fully private' },
            ].map((f) => (
              <div key={f.big}>
                <div className="text-[30px] font-bold tracking-tight text-white">{f.big}</div>
                <div className="mt-1.5 text-[11px] uppercase tracking-[2px] text-rb-tx-faint">
                  {f.small}
                </div>
              </div>
            ))}
          </div>

          {/* HOW IT WORKS */}
          <div className="mt-14 bg-rb-surface-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
            <div data-reveal className="relative h-[400px] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/mclaren-p1.jpg"
                alt="Red Box Motors dealer"
                className="absolute inset-0 h-full w-full object-cover"
                style={{ objectPosition: 'center 45%' }}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.35)_0%,rgba(10,10,10,0.04)_32%,rgba(10,10,10,0.55)_74%,#0C0C0C_100%)]" />
              <div className="absolute inset-x-0 bottom-0 px-6 pb-[42px] md:px-[52px]">
                <div className="mb-4 font-mono text-[11px] uppercase tracking-[4px] text-rb-red">
                  — How it works
                </div>
                <h2
                  className="m-0 max-w-[15ch] font-extrabold text-white"
                  style={{
                    fontSize: 'clamp(34px,4.6vw,68px)',
                    letterSpacing: '-0.04em',
                    lineHeight: 0.92,
                    textShadow: '0 2px 30px rgba(0,0,0,0.55)',
                  }}
                >
                  End to end, either direction
                </h2>
              </div>
            </div>

            <div className="grid md:grid-cols-2">
              <StepTrack
                heading="Buying"
                tag="You want a car"
                steps={BUYING_STEPS}
                delay=".06s"
                borderRight
              />
              <StepTrack
                heading="Selling & Consignment"
                tag="You have a car"
                steps={SELLING_STEPS}
                delay=".16s"
              />
            </div>
          </div>

          {/* PREVIEW 1 · CARS CURRENTLY FOR SALE */}
          <div style={{ background: 'linear-gradient(180deg,#0C0C0C 0px,#0A0A0A 150px)' }}>
            <RowHeader
              eyebrow="— Inventory"
              title="Cars currently for sale"
              cta="View all inventory"
              ctaHref="/dealer/inventory"
              blurb="A curated, ever-changing floor of enthusiast and collector cars on the market now — each inspected and fully documented before it's listed."
            />
            <PreviewGrid cards={salePreview} variant="forsale" />
          </div>

          {/* SEO PROSE — below cars for sale */}
          <ProseBand
            className="pb-16 pt-[60px]"
            style={{ background: 'linear-gradient(180deg,#0A0A0A 0px,#151515 160px)' }}
            eyebrow="— Why buy from Red Box"
            title="Enthusiast cars, bought right the first time."
            titleMax="19ch"
            left="Every car on the Red Box Motors floor is a vehicle we would own ourselves — sports cars, supercars and modern collectibles, each inspected and fully documented before it is ever listed. Buying through a specialist dealer in Austin, Texas, minutes from Circuit of the Americas, means the hard part is already done: the car has been vetted, the history verified and the condition recorded panel by panel before you ever see it."
            right="Because the same facility also handles paint protection film, ceramic coating, wraps and detailing, a car purchased through our dealer can move straight into cosmetic work before delivery — road- or track-ready the day you take the keys. From the first inquiry to insured, door-to-door transport nationwide, one team manages the inspection, the paperwork and the handover, so buying a collector car feels as considered as owning one."
          />

          {/* PREVIEW 2 · CARS WE'VE SOLD */}
          <div style={{ background: 'linear-gradient(180deg,#151515 0px,#0A0A0A 160px)' }}>
            <RowHeader
              eyebrow="— Sold"
              title="Cars we've sold"
              cta="View all sold"
              ctaHref="/dealer/sold"
              blurb="A record of past placements — sold and consigned quietly, correctly, to the right owners. Proof of the network and the process."
            />
            <PreviewGrid cards={soldPreview} variant="sold" />
          </div>

          {/* SEO PROSE — bottom of cars we've sold */}
          <ProseBand
            className="pb-20 pt-[60px]"
            eyebrow="— A record you can trust"
            title="Sold quietly, to the right owners."
            titleMax="18ch"
            left="Every car we place is proof of the process — appraised against live market data, presented properly and marketed to a vetted buyer network rather than the open web. Selling through Red Box Motors means your car reaches serious, qualified buyers without the noise, the tire-kickers or the lowball offers of a public listing."
            right="From consignment and detailing to escrow, paperwork and insured, door-to-door transport nationwide, the entire sale is handled under one roof in Austin, Texas. You set the reserve; we manage the rest and close cleanly, discreetly and at the number the car deserves."
          />

          {/* PREVIEW 3 · CARS WE FOUND FOR CLIENTS */}
          <div
            className="pb-[52px]"
            style={{ background: 'linear-gradient(180deg,#0A0A0A 0px,#151515 160px)' }}
          >
            <RowHeader
              eyebrow="— Acquisitions"
              title="Cars we found for clients"
              cta="View all sourced"
              ctaHref="/dealer/sourced"
              blurb="Vehicles we've sourced and acquired for buyers — off-market, pre-allocation and nationwide. Proof of what we find when a client tells us exactly what they're after."
            />
            <PreviewGrid cards={foundPreview} variant="sourced" />

            {/* SEO PROSE — bottom of cars we found */}
            <ProseBand
              className="pt-[60px]"
              eyebrow="— Sourcing, done right"
              title="Tell us the car. We'll go find it."
              titleMax="18ch"
              left="Our acquisitions service is built for the cars that never reach the open market — limited allocations, single-owner examples and specific builds that take a network to reach. Tell us the exact year, specification and color, and we work our nationwide contacts, auction relationships and dealer network to locate it, verify its history and negotiate on your behalf."
              right="Every sourced car is inspected and documented before a dollar changes hands, then delivered by insured, door-to-door transport anywhere in the country. Whether it's a weekend car, a track weapon or the final piece of a collection, you get one point of contact from the first request to the keys in your hand."
            />
          </div>

          {/* HAVE A CAR IN MIND — CTA */}
          <div style={{ background: 'linear-gradient(180deg,#151515 0px,#0A0A0A 160px)' }}>
            <div className="flex flex-col md:flex-row">
              <div className="relative min-h-[280px] min-w-0 flex-[1.05] overflow-hidden md:min-h-[480px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/get-in-touch.jpeg"
                  alt="Talk to Red Box Motors"
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ objectPosition: 'center 64%' }}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,10,10,0)_55%,rgba(10,10,10,0.55)_82%,rgba(10,10,10,0.95)_100%)]" />
                <div className="absolute bottom-0 left-0 px-[30px] py-[26px]">
                  <div className="font-mono text-[11px] uppercase tracking-[3px] text-[#cfcfcf]">
                    Austin, TX · Nationwide
                  </div>
                </div>
              </div>

              <div className="flex min-w-0 flex-1 flex-col justify-center px-6 py-14 md:px-14 md:py-[72px]">
                <div className="mb-6 font-mono text-[11px] uppercase tracking-[4px] text-rb-red">
                  — Get in touch
                </div>
                <h2
                  className="m-0 max-w-[13ch] font-extrabold text-white"
                  style={{ fontSize: 'clamp(34px,4.4vw,64px)', letterSpacing: '-0.04em', lineHeight: 0.96 }}
                >
                  Have a car in mind?
                </h2>
                <p className="mb-0 mt-[26px] max-w-[440px] text-[16px] font-medium leading-[1.7] text-rb-tx-mute">
                  {
                    "Buying, selling or just exploring — start a private conversation and we'll take it from there. No pressure, no obligation."
                  }
                </p>

                {/* INLINE OPTIONS PICKER */}
                <div data-reveal style={{ transitionDelay: '.12s' }} className="mt-[30px] border-t border-[#232323]">
                  {CTA_OPTIONS.map((row) => {
                    const cls =
                      'flex items-center justify-between gap-4 border-b border-rb-line-2 px-1 py-4 transition-[padding-left,background] duration-200 hover:bg-[rgba(204,0,0,0.06)] hover:pl-3.5';
                    const inner = (
                      <>
                        <span className="flex items-center gap-3.5">
                          <span className="h-[7px] w-[7px] flex-none bg-rb-red" />
                          <span className="text-[15px] font-semibold tracking-[0.3px] text-white">
                            {row.label}
                          </span>
                        </span>
                        <span className="flex-none text-rb-red">
                          <ArrowIcon size={14} stroke={1.5} />
                        </span>
                      </>
                    );
                    return row.href === '/contact' ? (
                      <ContactLink key={row.label} className={cls}>
                        {inner}
                      </ContactLink>
                    ) : (
                      <Link key={row.label} href={row.href} className={cls}>
                        {inner}
                      </Link>
                    );
                  })}
                </div>

                <div className="mt-[34px] flex flex-wrap items-center gap-[18px]">
                  <ContactLink
                    className="rb-btn-red inline-flex items-center gap-3 bg-rb-red px-7 py-4 text-[14px] font-semibold tracking-[0.5px] text-white"
                  >
                    Start a conversation
                    <ArrowIcon size={15} stroke={1.5} />
                  </ContactLink>
                  <Link href="/dealer/inventory" className={`${ghostRed} px-[26px] py-[15px] text-[13px]`}>
                    View inventory
                    <ArrowIcon size={14} stroke={1.5} />
                  </Link>
                </div>

                <div className="mt-[52px] flex items-center gap-[11px] border-t border-rb-line pt-[26px]">
                  <span className="inline-flex bg-rb-red px-2.5 py-[7px]">
                    <span className="text-[10px] font-extrabold tracking-[2px] text-white">RBM</span>
                  </span>
                  <span className="text-[11px] uppercase tracking-[2px] text-rb-tx-faint">
                    Red Box Motors · Dealer
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* VISIT & FAQ — bottom of scrolling section */}
          <div style={{ background: 'linear-gradient(180deg,#0A0A0A 0px,#0C0C0C 130px)' }}>
            <VisitAndFAQ division="dealer" />
          </div>
        </ExpandingScrollBox>
      </ScrollShell>

      {/* STICKY INQUIRY CTA */}
      <ContactLink
        className="rb-btn-red fixed bottom-[26px] right-[26px] z-40 flex items-center gap-[11px] bg-rb-red px-[22px] py-[15px] shadow-[0_12px_30px_rgba(204,0,0,0.34)]"
      >
        <span className="h-[7px] w-[7px] flex-none bg-white" />
        <span className="text-[12px] font-semibold tracking-[1.5px] text-white">Inquire</span>
        <ArrowIcon size={13} stroke={1.5} />
      </ContactLink>
    </>
  );
}
