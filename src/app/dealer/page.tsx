import type { Metadata } from 'next';
import Link from 'next/link';
import { PreviewGrid } from '@/components/dealer/PreviewTiles';
import { BUYING_STEPS, CONSIGNMENT_STEPS, StepTrack } from '@/components/dealer/HowItWorksSection';
import { ExpandingScrollBox } from '@/components/site/ExpandingScrollBox';
import { BgVideo } from '@/components/site/BgVideo';
import { ScrollShell } from '@/components/site/ScrollShell';
import { SiteNav } from '@/components/site/SiteNav';
import { VisitAndFAQ } from '@/components/site/VisitAndFAQ';
import { getSurfaceCards } from '@/lib/public/content';
import { SchemaScript } from '@/components/site/SchemaScript';
import { localBusinessSchema } from '@/lib/seo/schema';
import { getSettings } from '@/lib/public/content';
import type { Faq } from '@/components/site/FaqAccordion';

// Sales & Consignment landing (customer-facing rename of "Dealer" — the
// /dealer URL is kept to avoid routing churn). Owner-approved copy, verbatim.
// Page order (consignment-focused, owner 2026-07-08): hero → More Than a
// Listing → How Consignment Works (full-width steps) → Why Red Box trust →
// featured inventory → closing chapter (Vehicles Worth
// Representing framing + Sell Your Vehicle action, one section) → FAQ. The
// one-team intro, Buy/Sell path chapters, Buying track and seller visual
// are unpublished (SHOW_* flags); the "End to end" chapter lives on the
// homepage (components/dealer/HowItWorksSection).

export const revalidate = 60;

export const metadata: Metadata = {
  alternates: { canonical: '/dealer' },
  title: { absolute: 'Sales & Consignment · Exceptional Cars. Properly Represented. | Red Box Motors' },
  description:
    'Curated enthusiast and collector vehicles and premium consignment representation from Red Box Motors in Austin, Texas.',
};

const EASE = 'cubic-bezier(.2,.8,.2,1)';

// "Your Car Deserves More Than an Online Listing" is unpublished per owner
// revision (redundant with the enlarged "More than a listing" section, which
// inherited its consignment-process photo). Flip to restore.
const SHOW_SELLER_VISUAL = false;

// 2026-07-08 consignment-focused reorder — hidden, not deleted. Flip to restore.
const SHOW_ONE_TEAM_INTRO = false;
const SHOW_PATH_CHAPTERS = false;
const SHOW_BUYING_TRACK = false;

// BUYING_STEPS / CONSIGNMENT_STEPS / StepTrack now live in
// components/dealer/HowItWorksSection (shared with the homepage End-to-end
// section).

// Owner copy — verbatim.
const MORE_THAN_A_LISTING = [
  { title: 'Market Positioning', text: 'Pricing informed by current listings, recent sales, specification, condition and market demand.' },
  { title: 'Vehicle Preparation', text: 'Detailing, paint correction, PPF evaluation, mechanical-service coordination and presentation planning.' },
  { title: 'Professional Media', text: 'Photography, video, written automotive storytelling, and the organization and presentation of all available vehicle documentation.' },
  { title: 'Qualified Exposure', text: 'Targeted listing placement, direct buyer outreach, social media and enthusiast networks.' },
  { title: 'Transaction Management', text: 'Inquiry handling, buyer qualification, documents, payment coordination and transportation.' },
];

// Owner copy — verbatim.
const WHY_BUY = [
  { title: 'Thoughtful Selection', text: 'Vehicles chosen for their specification, condition, history and enthusiast appeal.' },
  { title: 'Clear Presentation', text: 'Detailed photography, available documentation and transparent condition information.' },
  { title: 'One Point of Contact', text: 'Purchase coordination, documents, transportation and delivery managed through one team.' },
  { title: 'Delivery Ready', text: 'Optional detailing, PPF, paint correction, ceramic coating, tint and customization before delivery.' },
];

// Supportable claims only — no invented numbers.
const CREDIBILITY = [
  { big: 'Licensed', small: 'Texas motor vehicle dealer' },
  { big: 'Austin', small: 'Showroom & facility' },
  { big: 'Nationwide', small: 'Marketing & transport coordination' },
  { big: 'In-house', small: 'Professional detailing' },
  { big: 'Documented', small: 'Intake & consignment agreements' },
  { big: 'Connected', small: 'Enthusiast, event & industry networks' },
];

// Detailed sales questions live here (moved off the homepage).
const DEALER_FAQ: Faq[] = [
  { q: 'How does consignment work?', a: 'We handle valuation, preparation, marketing, buyer qualification and the full transaction. You approve the positioning and terms, we manage the rest through closing and delivery.' },
  { q: 'How is pricing established?', a: 'Pricing is informed by current listings, recent sales, specification, condition and market demand, reviewed with you and agreed before the car is listed.' },
  { q: 'What does it cost to sell?', a: 'Representation fees and any approved preparation costs are disclosed in writing before anything is signed. No surprises.' },
  { q: 'Can you sell nationwide?', a: 'Yes. Marketing and transportation are coordinated nationwide, with enclosed door-to-door transport arranged for delivery.' },
  { q: 'What happens before my car is listed?', a: 'Approved reconditioning, detailing, photography, video and organization of all available documentation, an agreed preparation, presentation and marketing plan for every consigned vehicle.' },
];

const ghostRed =
  'rb-btn inline-flex items-center gap-[9px] whitespace-nowrap border border-rb-red bg-transparent font-semibold tracking-[0.5px] text-rb-red transition-colors duration-[180ms] hover:bg-rb-red hover:text-white';

function ArrowIcon({ size = 13, stroke = 1.3 }: { size?: number; stroke?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M4 12L12 4M12 4H5.2M12 4V10.8" stroke="currentColor" strokeWidth={stroke} />
    </svg>
  );
}

function SectionHeader({ eyebrow, title, blurb }: { eyebrow: string; title: string; blurb?: string }) {
  return (
    <div className="px-6 md:px-[52px]">
      <div data-reveal className="mb-[13px] font-mono text-[11px] uppercase tracking-[4px] text-rb-red">
        {eyebrow}
      </div>
      <h2
        data-reveal
        className="m-0 font-bold leading-none text-white"
        style={{ fontSize: 'clamp(26px,3.4vw,46px)', letterSpacing: '-0.03em' }}
      >
        {title}
      </h2>
      {blurb && (
        <p
          data-reveal
          style={{ transitionDelay: '.1s' }}
          className="mb-0 mt-4 max-w-[680px] text-[14.5px] leading-[1.75] text-[#999]"
        >
          {blurb}
        </p>
      )}
    </div>
  );
}


export default async function DealerPage() {
  const salePreview = await getSurfaceCards('dealer_forsale_preview', 3);

  return (
    <>
      <SchemaScript schema={localBusinessSchema(await getSettings())} />
      <SiteNav current="sell" />

      <ScrollShell bg="/assets/hero-brabus-poster.jpg" bgPosition="center 58%" scrub={false}>
        {/* ---------- 1 · HERO (plain photo — no blur/scrub, per owner) ---------- */}
        {/* Hero removed (owner 2026-07-10) — the page opens straight into the
            scroll section; the headline lives on the video band below.
            Prior hero is in git history. */}

        {/* ---------- 2 · OVERVIEW (boxed scroll → fullscreen) ---------- */}
        <ExpandingScrollBox>
          {/* VIDEO HEADER — Lambo Rollers clip with the page headline
              (replaces the removed hero + 918 photo, owner 2026-07-10) */}
          <div className="relative h-[560px] overflow-hidden md:h-[620px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <BgVideo
              src="/assets/consign-rollers.mp4"
              poster="/assets/consign-rollers-poster.jpg"
              className="absolute inset-0 h-full w-full"
              position="center 50%"
            />
            <div className="absolute inset-x-0 bottom-0 z-[2] px-6 pb-[38px] md:px-[52px]">
              <div className="mb-3 font-mono text-[11px] uppercase tracking-[4px] text-rb-red">
                Red Box Motors · Sales &amp; Consignment
              </div>
              <h1
                className="m-0 max-w-[16ch] font-extrabold text-white"
                style={{ fontSize: 'clamp(32px,4.2vw,64px)', letterSpacing: '-0.03em', lineHeight: 0.98, textShadow: '0 2px 30px rgba(0,0,0,0.6)' }}
              >
                Exceptional Cars. Properly Represented.
              </h1>
              <div className="mt-7 flex flex-wrap items-center gap-3.5">
                <Link
                  href="/dealer/inventory"
                  className="rb-btn-red inline-flex items-center gap-2.5 bg-rb-red px-[22px] py-[13px] text-[12.5px] font-semibold tracking-[1px] text-white"
                >
                  View Inventory
                </Link>
                <Link href="/dealer/sell" className={`${ghostRed} px-[22px] py-[13px] text-[12.5px]`}>
                  Sell Your Vehicle
                </Link>
              </div>
            </div>
            {/* fades into More Than a Listing's #131313 below (restored 2026-07-08) */}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(19,19,19,0.10)_0%,rgba(19,19,19,0.04)_40%,rgba(19,19,19,0.55)_74%,rgba(19,19,19,0.92)_92%,#131313_100%)]" />
          </div>

          {/* ONE-TEAM INTRO — unpublished (owner 2026-07-08 reorder; the
              "End to end" story now lives on the homepage). Flip to restore. */}
          {SHOW_ONE_TEAM_INTRO && (
          <>
          {/* INTRO — owner copy, verbatim */}
          <div className="px-6 pt-[72px] md:px-[52px] md:pt-[88px]">
            <div data-reveal className="mb-7 font-mono text-[11px] uppercase tracking-[4px] text-rb-red">
              Sales &amp; Consignment
            </div>
            <h2
              className="m-0 max-w-[18ch] font-bold text-white"
              style={{ fontSize: 'clamp(30px,4.2vw,60px)', letterSpacing: '-0.03em', lineHeight: 1.04 }}
            >
              <span data-reveal className="block">
                One team, from first
              </span>
              <span data-reveal style={{ transitionDelay: '.12s' }} className="block text-rb-tx-faint">
                conversation to delivery.
              </span>
            </h2>
            <p
              data-reveal
              style={{ transitionDelay: '.24s' }}
              className="mb-0 mt-9 max-w-[720px] text-[17px] font-medium leading-[1.7] text-rb-tx-mute"
            >
              Red Box Motors represents enthusiast, exotic and collector vehicles through
              professional preparation, thoughtful presentation and direct transaction management.
              Whether you are purchasing one of our available vehicles or consigning a vehicle for
              sale, one team manages the process from the first conversation through delivery.
            </p>
          </div>

          {/* spacer under the intro before the buy/sell chapters */}
          <div className="h-16 md:h-24" />

          </>
          )}

          {/* MORE THAN A LISTING — representation pillars as a tile row that
              overlaps into the featured-inventory section below, visually
              tying the consignment pitch to the cars it produces. */}
          <div className="bg-[#131313] pt-14 md:pt-16">
            <div className="grid gap-10 px-6 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] md:px-[52px]">
              <div>
                <div data-reveal className="mb-4 font-mono text-[11px] uppercase tracking-[4px] text-rb-red">
                  Representation
                </div>
                <h2
                  data-reveal
                  className="m-0 font-extrabold text-white"
                  style={{ fontSize: 'clamp(36px,4.8vw,72px)', letterSpacing: '-0.04em', lineHeight: 0.96 }}
                >
                  More than a listing
                </h2>
                <p
                  data-reveal
                  style={{ transitionDelay: '.1s' }}
                  className="mb-0 mt-6 max-w-[560px] text-[17px] font-medium leading-[1.7] text-rb-tx-mute"
                >
                  Every consigned vehicle receives an agreed preparation, presentation and marketing plan.
                </p>
              </div>
              <div data-reveal style={{ transitionDelay: '.12s' }} className="relative min-h-[240px] overflow-hidden bg-rb-surface-4">
                {/* PLACEHOLDER IMAGE — replace /public/assets/placeholders/consignment-process.jpg
                    with a collage of consignment-process stages: photography, detailing,
                    inspection, video production, showroom presentation, enclosed transport
                    loading. Same filename = drop-in swap. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/placeholders/consignment-process.jpg"
                  alt="Red Box Motors consignment process, photography, detailing, inspection, video production, showroom presentation and enclosed transport"
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 px-5 py-4">
                  <div className="font-mono text-[10px] uppercase tracking-[2.5px] text-[#9a9a9a]">
                    Photography · Detailing · Inspection · Video · Showroom · Transport
                  </div>
                </div>
              </div>
            </div>

            {/* pillar tiles — pulled down across the section boundary */}
            <div
              data-reveal
              style={{ transitionDelay: '.16s' }}
              className="relative z-[2] -mb-24 mt-14 grid gap-1.5 px-6 sm:grid-cols-2 md:grid-cols-3 md:px-[52px] xl:grid-cols-5"
            >
              {MORE_THAN_A_LISTING.map((item) => (
                <div
                  key={item.title}
                  className="flex flex-col gap-3 px-7 py-8 transition-[transform,box-shadow,filter] duration-[240ms] ease-rb hover:z-[3] hover:-translate-y-[5px] hover:brightness-[1.14]"
                  style={{
                    background: 'linear-gradient(165deg,#1d1d1d 0%,#131313 55%,#0D0D0D 100%)',
                    boxShadow: '0 22px 48px rgba(0,0,0,0.5)',
                  }}
                >
                  <div className="text-[15px] font-bold uppercase leading-snug tracking-[1px] text-rb-red">
                    {item.title}
                  </div>
                  <p className="m-0 text-[13.5px] leading-[1.65] text-[#a0a0a0]">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* HOW CONSIGNMENT WORKS — consignment-only (owner 2026-07-08).
              The Buying track is unpublished below (SHOW_BUYING_TRACK) and the
              "End to end, either direction" banner moved to the homepage.
              Top padding clears the MTAL tiles overlapping in from above. */}
          <div className="bg-rb-surface-2 pt-40 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] md:pt-48">
            <div className="px-6 md:px-[52px]">
              <div data-reveal className="mb-[13px] font-mono text-[11px] uppercase tracking-[4px] text-rb-red">
                How it works
              </div>
              <h2
                data-reveal
                className="m-0 font-bold leading-none text-white"
                style={{ fontSize: 'clamp(28px,3.6vw,52px)', letterSpacing: '-0.03em' }}
              >
                How Consignment Works
              </h2>
            </div>
            {/* steps span the full page width (photo band removed per owner) */}
            <div className="px-0 pb-4 md:px-10">
              <StepTrack heading="Consignment" tag="Five steps" steps={CONSIGNMENT_STEPS} delay=".06s" />
            </div>
            {SHOW_BUYING_TRACK && (
              <div className="grid border-t border-rb-line md:grid-cols-2">
                <StepTrack heading="Buying" tag="You want a car" steps={BUYING_STEPS} delay=".06s" borderRight />
                <StepTrack heading="Consignment" tag="You have a car" steps={CONSIGNMENT_STEPS} delay=".16s" />
              </div>
            )}
          </div>

          {/* PHOTO BAND — full-bleed transition into the trust section,
              same treatment as the page opener (owner 2026-07-08) */}
          <div className="relative h-[400px] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/dealer-trust.jpg"
              alt="Client vehicles lined up outside Red Box Motors, Austin TX"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: 'center 62%' }}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(21,21,21,0.10)_0%,rgba(21,21,21,0.04)_40%,rgba(21,21,21,0.55)_74%,rgba(21,21,21,0.92)_92%,#151515_100%)]" />
          </div>

          {/* WHY RED BOX — the buying pillars and the owner-credibility claims,
              merged into one big trust section (hard cut from How It Works).
              Supportable claims only. */}
          <div className="bg-[#151515] pb-24 pt-16">
            <SectionHeader
              eyebrow="Why Red Box"
              title="Why buyers and owners trust Red Box Motors"
              blurb="Whether you are buying one of our vehicles or consigning your own, the same team, facility and standard stand behind the transaction."
            />
            <div data-reveal style={{ transitionDelay: '.12s' }} className="mt-12 grid gap-x-12 gap-y-10 px-6 md:grid-cols-2 md:px-[52px]">
              {WHY_BUY.map((item) => (
                <div key={item.title} className="border-t border-rb-line pt-6">
                  <div className="mb-3 text-[18px] font-bold uppercase tracking-[1px] text-white">{item.title}</div>
                  <p className="m-0 text-[15px] leading-[1.75] text-[#a6a6a6]">{item.text}</p>
                </div>
              ))}
            </div>
            <div
              data-reveal
              style={{ transitionDelay: '.1s' }}
              className="mx-6 mt-16 grid grid-cols-2 gap-x-10 gap-y-9 border-t-2 border-[#242424] pt-12 md:mx-[52px] md:grid-cols-3 lg:grid-cols-6"
            >
              {CREDIBILITY.map((f) => (
                <div key={f.small}>
                  <div className="text-[24px] font-bold tracking-tight text-white">{f.big}</div>
                  <div className="mt-2 text-[10.5px] uppercase leading-snug tracking-[1.5px] text-rb-tx-faint">
                    {f.small}
                  </div>
                </div>
              ))}
            </div>
            {/* OWNER TODO: when real numbers are approved, add visible proof
                here, customer reviews, completed sales, social reach, as
                CREDIBILITY entries above. No invented claims. */}
          </div>

          {/* FEATURED INVENTORY */}
          <div className="pb-24 pt-20 md:pt-24" style={{ background: 'linear-gradient(180deg,#0C0C0C 0px,#0A0A0A 340px)' }}>
            <div className="flex flex-wrap items-end justify-between gap-5 px-6 md:px-[52px]">
              <div>
                <div data-reveal className="mb-[13px] font-mono text-[11px] uppercase tracking-[4px] text-rb-red">
                  Featured inventory
                </div>
                <h2
                  data-reveal
                  className="m-0 font-bold leading-none text-white"
                  style={{ fontSize: 'clamp(32px,4.4vw,64px)', letterSpacing: '-0.035em' }}
                >
                  Currently represented
                </h2>
              </div>
              <Link href="/dealer/inventory" className={`${ghostRed} flex-none px-6 py-[13px] text-[13px]`}>
                View Inventory
                <ArrowIcon />
              </Link>
            </div>
            <PreviewGrid cards={salePreview} variant="forsale" />
          </div>

          {/* BUY + SELL/CONSIGN PATH CHAPTERS — unpublished (owner 2026-07-08
              reorder; superseded by the consignment-focused order). Flip to
              restore. */}
          {SHOW_PATH_CHAPTERS && (
          <>
          {/* BUY — full section: photo + copy + button (owner copy verbatim) */}
          <div data-reveal className="border-t border-rb-line bg-[#0C0C0C]">
            <div className="flex flex-col md:flex-row">
              <div className="relative min-h-[300px] min-w-0 flex-[1.05] overflow-hidden md:min-h-[520px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/dealer-garage.jpeg"
                  alt="Enthusiast and collector vehicles on the Red Box Motors floor"
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ objectPosition: 'center 55%' }}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,12,12,0)_55%,rgba(12,12,12,0.55)_82%,rgba(12,12,12,0.95)_100%)]" />
                <div className="absolute bottom-0 left-0 px-[30px] py-[26px]">
                  <div className="font-mono text-[11px] uppercase tracking-[3px] text-[#cfcfcf]">
                    Curated inventory · Austin, TX
                  </div>
                </div>
              </div>
              <div className="flex min-w-0 flex-1 flex-col justify-center px-6 py-16 md:px-16 md:py-[90px]">
                <div className="mb-6 font-mono text-[11px] uppercase tracking-[4px] text-rb-red">
                  You want a car
                </div>
                <h2
                  className="m-0 max-w-[13ch] font-extrabold text-white"
                  style={{ fontSize: 'clamp(36px,4.8vw,72px)', letterSpacing: '-0.04em', lineHeight: 0.96 }}
                >
                  Buy a vehicle.
                </h2>
                <p className="mb-0 mt-7 max-w-[460px] text-[17px] font-medium leading-[1.7] text-rb-tx-mute">
                  Explore enthusiast and collector vehicles currently represented by Red Box
                  Motors.
                </p>
                <div className="mt-10">
                  <Link
                    href="/dealer/inventory"
                    className="rb-btn-red inline-flex items-center gap-3.5 bg-rb-red px-9 py-5 text-[15px] font-semibold tracking-[0.5px] text-white"
                  >
                    View Inventory
                    <ArrowIcon size={16} stroke={1.5} />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* SELL / CONSIGN — full section, mirrored (owner copy verbatim) */}
          <div
            id="sell"
            data-reveal
            className="border-t border-rb-line bg-[#101010]"
            style={{ scrollMarginTop: '90px' }}
          >
            <div className="flex flex-col md:flex-row-reverse">
              <div className="relative min-h-[300px] min-w-0 flex-[1.05] overflow-hidden md:min-h-[520px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/dealer-sell-consign.jpg"
                  alt="Consigned Ferrari Dino represented by Red Box Motors"
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ objectPosition: '60% 55%' }}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-[linear-gradient(270deg,rgba(16,16,16,0)_55%,rgba(16,16,16,0.55)_82%,rgba(16,16,16,0.95)_100%)]" />
                <div className="absolute bottom-0 right-0 px-[30px] py-[26px]">
                  <div className="font-mono text-[11px] uppercase tracking-[3px] text-[#cfcfcf]">
                    Consignment · Nationwide
                  </div>
                </div>
              </div>
              <div className="flex min-w-0 flex-1 flex-col justify-center px-6 py-16 md:px-16 md:py-[90px]">
                <div className="mb-6 font-mono text-[11px] uppercase tracking-[4px] text-rb-red">
                  You have a car
                </div>
                <h2
                  className="m-0 max-w-[14ch] font-extrabold text-white"
                  style={{ fontSize: 'clamp(36px,4.8vw,72px)', letterSpacing: '-0.04em', lineHeight: 0.96 }}
                >
                  Sell or consign a vehicle.
                </h2>
                <p className="mb-0 mt-7 max-w-[460px] text-[17px] font-medium leading-[1.7] text-rb-tx-mute">
                  Professionally prepare, market and represent your vehicle to qualified buyers
                  nationwide.
                </p>
                <div className="mt-10">
                  <Link
                    href="/dealer/sell"
                    className="rb-btn-red inline-flex items-center gap-3.5 bg-rb-red px-9 py-5 text-[15px] font-semibold tracking-[0.5px] text-white"
                  >
                    Sell Your Vehicle
                    <ArrowIcon size={16} stroke={1.5} />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          </>
          )}

          {/* SELLER-FOCUSED VISUAL — unpublished (SHOW_SELLER_VISUAL) */}
          {SHOW_SELLER_VISUAL && (
          <div className="flex flex-col md:flex-row" style={{ background: 'linear-gradient(180deg,#151515 0px,#0A0A0A 200px)' }}>
            <div className="relative min-h-[300px] min-w-0 overflow-hidden md:min-h-[500px] md:flex-[1.1]">
              {/* PLACEHOLDER IMAGE — replace /public/assets/placeholders/consignment-process.jpg
                  with a collage of consignment-process stages: photography, detailing,
                  inspection, video production, showroom presentation, enclosed transport
                  loading. Same filename = drop-in swap. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/placeholders/consignment-process.jpg"
                alt="Red Box Motors consignment process, photography, detailing, inspection, video production, showroom presentation and enclosed transport"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,10,10,0)_55%,rgba(10,10,10,0.5)_82%,rgba(10,10,10,0.95)_100%)]" />
              <div className="absolute bottom-0 left-0 px-[30px] py-[26px]">
                <div className="font-mono text-[10px] uppercase tracking-[2.5px] text-[#8a8a8a]">
                  Photography · Detailing · Inspection · Video · Showroom · Enclosed transport
                </div>
              </div>
            </div>
            <div className="flex min-w-0 flex-1 flex-col justify-center px-6 py-14 md:px-14 md:py-[72px]">
              <div data-reveal className="mb-6 font-mono text-[11px] uppercase tracking-[4px] text-rb-red">
                Consignment
              </div>
              <h2
                data-reveal
                className="m-0 max-w-[18ch] font-extrabold text-white"
                style={{ fontSize: 'clamp(28px,3.6vw,52px)', letterSpacing: '-0.035em', lineHeight: 1.02 }}
              >
                Your Car Deserves More Than an Online Listing
              </h2>
              <p
                data-reveal
                style={{ transitionDelay: '.12s' }}
                className="mb-0 mt-7 max-w-[520px] text-[15.5px] font-medium leading-[1.75] text-rb-tx-mute"
              >
                Red Box Motors combines vehicle preparation, visual presentation, automotive
                storytelling and transaction management to represent each consigned vehicle as a
                complete offering, not simply another classified listing.
              </p>
              <div data-reveal style={{ transitionDelay: '.18s' }} className="mt-9">
                <Link
                  href="/dealer/sell"
                  className="rb-btn-red inline-flex items-center gap-3 bg-rb-red px-7 py-4 text-[14px] font-semibold tracking-[0.5px] text-white"
                >
                  Sell Your Vehicle
                  <ArrowIcon size={15} stroke={1.5} />
                </Link>
              </div>
            </div>
          </div>
          )}

          {/* CLOSING CHAPTER — Vehicles Worth Representing framing + the
              Sell Your Vehicle action in ONE section (owner 2026-07-08 redo).
              Owner copy verbatim. */}
          <div className="border-t border-rb-line bg-[#101010]">
            <div className="flex flex-col md:flex-row">
              <div className="relative min-h-[340px] min-w-0 flex-[1.05] overflow-hidden md:min-h-[620px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/dealer-buying-selling.jpg"
                  alt="Race car cockpit, consign your vehicle with Red Box Motors"
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ objectPosition: 'center 50%' }}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(16,16,16,0)_55%,rgba(16,16,16,0.55)_82%,rgba(16,16,16,0.95)_100%)]" />
                <div className="absolute bottom-0 left-0 px-[30px] py-[26px]">
                  <div className="font-mono text-[11px] uppercase tracking-[3px] text-[#cfcfcf]">
                    Austin, TX · Nationwide
                  </div>
                </div>
              </div>

              <div className="flex min-w-0 flex-1 flex-col justify-center px-6 py-16 md:px-16 md:py-[90px]">
                <div data-reveal className="mb-5 font-mono text-[11px] uppercase tracking-[4px] text-rb-red">
                  What we represent
                </div>
                <h2
                  data-reveal
                  className="m-0 max-w-[14ch] font-extrabold text-white"
                  style={{ fontSize: 'clamp(34px,4.4vw,64px)', letterSpacing: '-0.04em', lineHeight: 0.98 }}
                >
                  Vehicles Worth Representing
                </h2>
                <p
                  data-reveal
                  style={{ transitionDelay: '.1s' }}
                  className="mb-0 mt-7 max-w-[520px] text-[17px] font-medium leading-[1.7] text-rb-tx-2"
                >
                  We represent vehicles with enthusiast value, compelling specification and a story
                  worth presenting, from modern exotics and limited-production performance cars to
                  significant classics, restomods and specialty vehicles.
                </p>
                <p
                  data-reveal
                  style={{ transitionDelay: '.14s' }}
                  className="mb-0 mt-6 max-w-[480px] text-[15px] font-medium leading-[1.7] text-rb-tx-mute"
                >
                  Tell us about the car you would like us to represent.
                </p>

                <div data-reveal style={{ transitionDelay: '.18s' }} className="mt-10 flex flex-wrap items-center gap-[22px]">
                  <Link
                    href="/dealer/sell"
                    className="rb-btn-red inline-flex items-center gap-3.5 bg-rb-red px-9 py-5 text-[15px] font-semibold tracking-[0.5px] text-white"
                  >
                    Sell Your Vehicle
                    <ArrowIcon size={16} stroke={1.5} />
                  </Link>
                  <Link href="/dealer/inventory" className={`${ghostRed} px-[30px] py-[17px] text-[14px]`}>
                    View Inventory
                    <ArrowIcon size={15} stroke={1.5} />
                  </Link>
                </div>

                <div className="mt-[46px] flex items-center gap-[11px] border-t border-rb-line pt-[26px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/brand/rbm-logo-header.png" alt="" className="h-[24px] w-[24px]" />
                  <span className="text-[11px] uppercase tracking-[2px] text-rb-tx-faint">
                    Red Box Motors · Sales &amp; Consignment
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* VISIT & FAQ — bottom of scrolling section, with breathing room */}
          <div className="pt-16 md:pt-24" style={{ background: 'linear-gradient(180deg,#0A0A0A 0px,#0C0C0C 200px)' }}>
            <VisitAndFAQ division="dealer" faqs={DEALER_FAQ} />
          </div>
        </ExpandingScrollBox>
      </ScrollShell>

      {/* STICKY INQUIRY CTA */}
      <Link
        href="/dealer/sell"
        className="rb-btn-red fixed bottom-[26px] right-[26px] z-40 hidden items-center gap-[11px] bg-rb-red px-[22px] py-[15px] sm:flex shadow-[0_12px_30px_rgba(204,0,0,0.34)]"
      >
        <span className="h-[7px] w-[7px] flex-none bg-white" />
        <span className="text-[12px] font-semibold tracking-[1.5px] text-white">Sell Your Vehicle</span>
        <ArrowIcon size={13} stroke={1.5} />
      </Link>
    </>
  );
}
