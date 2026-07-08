import type { Metadata } from 'next';
import Link from 'next/link';
import { ContactLink } from '@/components/contact/ContactModal';
import { SiteNav } from '@/components/site/SiteNav';
import { VisitAndFAQ } from '@/components/site/VisitAndFAQ';
import { ExpandingScrollBox } from '@/components/site/ExpandingScrollBox';
import { FixedContactLink, GalleryCard, GalleryPlaceholder } from '@/components/dealer/GalleryCard';
import { RandomBackdrop } from '@/components/site/RandomBackdrop';
import { getHeroImages, getSourced, heroFor } from '@/lib/public/content';
import { SchemaScript } from '@/components/site/SchemaScript';
import { collectionPageSchema } from '@/lib/seo/schema';

// Sourced.dc.html → /dealer/sourced — "Cars We Found for Clients":
// mini-hero (faded photo header) + 3-across gallery of sourced cars
// (not for sale) + start-a-search CTA, inside the expanding scroll box.

export const revalidate = 60;

export const metadata: Metadata = {
  // Unpublished (owner revision) — unlinked from nav/sitemap, kept for later restore.
  robots: { index: false, follow: false },
  title: 'Cars We Found for Clients',
  description:
    "Off-market and pre-allocation cars we've sourced and acquired for buyers nationwide.",
};

const EASE = 'cubic-bezier(.2,.8,.2,1)';

export default async function SourcedPage() {
  const items = await getSourced();
  const heroes = await getHeroImages(items.map((s) => ({ type: 'sourced' as const, id: s.id })));

  return (
    <div className="relative bg-rb-bg text-white">
      <SchemaScript schema={collectionPageSchema('Cars We Found for Clients', "Off-market and pre-allocation cars we've sourced and acquired for buyers nationwide.", '/dealer/sourced')} />
      <RandomBackdrop />
      <SiteNav current="inventory" />

      <div
        data-scroll-container
        className="rb-noscrollbar relative z-[1] h-screen overflow-y-auto bg-transparent"
        style={{ scrollSnapType: 'y proximity' }}
      >
        <ExpandingScrollBox>
          {/* PHOTO HEADER */}
          <div className="relative h-[400px] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/dealer-garage.jpeg"
              alt="Cars sourced by Red Box Motors"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: 'center 54%' }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.10)_0%,rgba(10,10,10,0.04)_40%,rgba(10,10,10,0.55)_74%,rgba(10,10,10,0.92)_92%,#0A0A0A_100%)]" />
            <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-6 px-6 pb-[34px] md:px-12">
              <div>
                <div className="mb-4 font-mono text-[11px] uppercase tracking-[4px] text-rb-red">
                  — Dealer · Acquisitions
                </div>
                <h1
                  className="m-0 font-bold text-white"
                  style={{ fontSize: 'clamp(36px,4.8vw,66px)', letterSpacing: '-0.04em', lineHeight: 0.96 }}
                >
                  Found for clients.
                </h1>
                <p
                  className="mb-0 mt-[18px] max-w-[640px] text-[15px] leading-[1.6] tracking-[0.2px] text-[#c4c4c4]"
                  style={{ textShadow: '0 1px 20px rgba(0,0,0,0.7)' }}
                >
                  Vehicles we&rsquo;ve sourced and acquired for buyers — off-market, pre-allocation
                  and nationwide. Not for sale; a record of what we find when someone has a car in
                  mind.
                </p>
              </div>
              <Link
                href="/dealer"
                className="inline-flex items-center gap-[9px] whitespace-nowrap text-[12.5px] tracking-[1.5px] text-rb-tx-mute transition-colors duration-150 hover:text-white"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.3" />
                </svg>
                Dealer overview
              </Link>
            </div>
          </div>

          {/* COUNT BAR */}
          <div className="flex flex-wrap items-center justify-between gap-5 px-6 pb-5 pt-7 md:px-12">
            <div className="flex items-baseline gap-3.5">
              <span className="text-[12px] font-bold uppercase tracking-[3px] text-white">
                Acquisitions
              </span>
              <span className="text-[11px] tracking-[0.5px] text-rb-tx-faint">
                Sourced on request — off-market &amp; nationwide
              </span>
            </div>
            {items.length > 0 && (
              <span className="whitespace-nowrap font-mono text-[11px] tracking-[1px] text-rb-tx-faint-2">
                {items.length} placements
              </span>
            )}
          </div>

          {/* GRID */}
          <div className="mx-6 grid grid-cols-1 gap-[6px] bg-black p-[6px] md:mx-12 md:grid-cols-3">
            {items.length > 0
              ? items.map((s) => (
                  <GalleryCard
                    key={s.id}
                    image={heroFor(heroes, 'sourced', s.id)}
                    alt={`${s.year} ${s.make} ${s.model}`}
                    tag={s.model.toLowerCase()}
                    badge={s.sourced_detail ?? 'Sourced'}
                    spec={s.spec}
                    metaLabel="Found for"
                    metaValue={s.client}
                    topLine={`${s.year} · ${s.make}`}
                    title={s.model}
                  />
                ))
              : [0, 1, 2].map((i) => <GalleryPlaceholder key={i} />)}
          </div>

          {/* CTA — clean split: image left, single ask right */}
          <div
            data-reveal
            className="mt-14 flex flex-wrap border-t border-rb-line bg-[#101010]"
            style={{ transition: `opacity .9s ${EASE} .1s, transform .9s ${EASE} .1s` }}
          >
            <div className="relative min-h-[420px] min-w-[280px] flex-[1.05] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/trust-gt3rs.jpeg"
                alt="Start a search with Red Box Motors"
                className="absolute inset-0 h-full w-full object-cover"
                style={{ objectPosition: 'center 54%' }}
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(16,16,16,0)_55%,rgba(16,16,16,0.55)_82%,rgba(16,16,16,0.95)_100%)]" />
              <div className="absolute bottom-0 left-0 px-[30px] py-[26px]">
                <div className="font-mono text-[11px] uppercase tracking-[3px] text-[#cfcfcf]">
                  Off-market · Pre-allocation · Nationwide
                </div>
              </div>
            </div>
            <div className="flex min-w-[300px] flex-1 flex-col justify-center px-8 py-14 md:px-14 md:py-16">
              <div className="mb-[22px] font-mono text-[11px] uppercase tracking-[4px] text-rb-red">
                — Have a car in mind?
              </div>
              <h2
                className="m-0 max-w-[14ch] font-extrabold text-white"
                style={{ fontSize: 'clamp(30px,3.6vw,52px)', letterSpacing: '-0.04em', lineHeight: 0.98 }}
              >
                Tell us the car. We&rsquo;ll find it.
              </h2>
              <p className="mb-0 mt-6 max-w-[460px] text-[15px] font-medium leading-[1.7] text-rb-tx-mute">
                Give us the exact spec — build, color, options, mileage — and we go hunting. We work
                our network of dealers, collectors and private owners, vet every car, and handle
                inspection, negotiation and insured door-to-door transport. You see only the ones
                worth seeing.
              </p>
              <div className="mt-[34px] flex flex-wrap items-center gap-[18px]">
                <ContactLink
                  className="rb-btn-red inline-flex items-center gap-3 bg-rb-red px-7 py-4 text-[14px] font-semibold tracking-[0.5px] text-white"
                >
                  Start a search
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path d="M4 12L12 4M12 4H5.2M12 4V10.8" stroke="#fff" strokeWidth="1.5" />
                  </svg>
                </ContactLink>
                <Link
                  href="/dealer/inventory"
                  className="text-[13px] tracking-[1.5px] text-rb-tx-mute transition-colors duration-150 hover:text-white"
                >
                  Browse inventory →
                </Link>
              </div>
              <div className="mt-12 flex items-center gap-[11px] border-t border-rb-line pt-[26px]">
                <span className="inline-flex bg-rb-red px-2.5 py-[7px]">
                  <span className="text-[10px] font-extrabold tracking-[2px] text-white">RBM</span>
                </span>
                <span className="text-[11px] uppercase tracking-[2px] text-rb-tx-faint">
                  Red Box Motors · Dealer · Austin, Texas
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-rb-line">
            <VisitAndFAQ division="dealer" />
          </div>
        </ExpandingScrollBox>
      </div>

      <FixedContactLink />
    </div>
  );
}
