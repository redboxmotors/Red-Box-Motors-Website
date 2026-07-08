import type { Metadata } from 'next';
import Link from 'next/link';
import { ContactLink } from '@/components/contact/ContactModal';
import { SiteNav } from '@/components/site/SiteNav';
import { VisitAndFAQ } from '@/components/site/VisitAndFAQ';
import { ExpandingScrollBox } from '@/components/site/ExpandingScrollBox';
import { FixedContactLink, GalleryCard, GalleryPlaceholder } from '@/components/dealer/GalleryCard';
import { RandomBackdrop } from '@/components/site/RandomBackdrop';
import { getHeroImages, getListings, heroFor } from '@/lib/public/content';
import { SchemaScript } from '@/components/site/SchemaScript';
import { collectionPageSchema } from '@/lib/seo/schema';

// Sold.dc.html → /dealer/sold — "Cars We've Sold": mini-hero (faded photo
// header) + 3-across grid of past placements (status:sold listings, not
// for sale) + sell/consign CTA, inside the expanding scroll box.

export const revalidate = 60;

export const metadata: Metadata = {
  // Unpublished (owner revision) — unlinked from nav/sitemap, kept for later restore.
  robots: { index: false, follow: false },
  title: "Cars We've Sold",
  description:
    'A record of past placements — cars sold and consigned by Red Box Motors, Austin, TX, to vetted owners.',
};

const EASE = 'cubic-bezier(.2,.8,.2,1)';

export default async function SoldPage() {
  const items = await getListings('sold');
  const heroes = await getHeroImages(items.map((l) => ({ type: 'listing' as const, id: l.id })));

  return (
    <div className="relative bg-rb-bg text-white">
      <SchemaScript schema={collectionPageSchema("Cars We've Sold", 'Past placements sold and consigned through Red Box Motors, Austin, TX.', '/dealer/sold')} />
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
              src="/assets/trust-gt3rs.jpeg"
              alt="Cars placed by Red Box Motors"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: 'center 54%' }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.10)_0%,rgba(10,10,10,0.04)_40%,rgba(10,10,10,0.55)_74%,rgba(10,10,10,0.92)_92%,#0A0A0A_100%)]" />
            <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-6 px-6 pb-[34px] md:px-12">
              <div>
                <div className="mb-4 font-mono text-[11px] uppercase tracking-[4px] text-rb-red">
                  — Dealer · Track record
                </div>
                <h1
                  className="m-0 font-bold text-white"
                  style={{ fontSize: 'clamp(36px,4.8vw,66px)', letterSpacing: '-0.04em', lineHeight: 0.96 }}
                >
                  Cars we&rsquo;ve sold.
                </h1>
                <p
                  className="mb-0 mt-[18px] max-w-[640px] text-[15px] leading-[1.6] tracking-[0.2px] text-[#c4c4c4]"
                  style={{ textShadow: '0 1px 20px rgba(0,0,0,0.7)' }}
                >
                  A record of past placements — sold and consigned quietly, correctly, to the right
                  owners. Proof of the network and the process, not for sale.
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
                Placements
              </span>
              <span className="text-[11px] tracking-[0.5px] text-rb-tx-faint">
                Sold &amp; consigned to vetted owners
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
              ? items.map((l) => (
                  <GalleryCard
                    key={l.id}
                    image={heroFor(heroes, 'listing', l.id)}
                    alt={[l.year, l.make, l.model].filter(Boolean).join(' ')}
                    tag={l.model.toLowerCase()}
                    badge="Sold"
                    spec={l.spec}
                    metaLabel="Placed with"
                    metaValue={l.placed_with}
                    topLine={[l.year, l.make].filter(Boolean).join(' · ')}
                    title={l.model}
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
                src="/assets/consignment.jpeg"
                alt="Sell or consign with Red Box Motors"
                className="absolute inset-0 h-full w-full object-cover"
                style={{ objectPosition: 'center 52%' }}
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(16,16,16,0)_55%,rgba(16,16,16,0.55)_82%,rgba(16,16,16,0.95)_100%)]" />
              <div className="absolute bottom-0 left-0 px-[30px] py-[26px]">
                <div className="font-mono text-[11px] uppercase tracking-[3px] text-[#cfcfcf]">
                  Consign · Direct offer · Acquisitions
                </div>
              </div>
            </div>
            <div className="flex min-w-[300px] flex-1 flex-col justify-center px-8 py-14 md:px-14 md:py-16">
              <div className="mb-[22px] font-mono text-[11px] uppercase tracking-[4px] text-rb-red">
                — Your car could be next
              </div>
              <h2
                className="m-0 max-w-[14ch] font-extrabold text-white"
                style={{ fontSize: 'clamp(30px,3.6vw,52px)', letterSpacing: '-0.04em', lineHeight: 0.98 }}
              >
                Have one to sell? We&rsquo;ll place it.
              </h2>
              <p className="mb-0 mt-6 max-w-[460px] text-[15px] font-medium leading-[1.7] text-rb-tx-mute">
                We handle valuation, detailing, marketing, buyer vetting and the full transaction —
                escrow, paperwork and insured transport. You set the reserve; we do the rest. Prefer
                a clean exit? We&rsquo;ll make a direct offer and close on your timeline.
              </p>
              <div className="mt-[34px] flex flex-wrap items-center gap-[18px]">
                <Link
                  href="/dealer/sell"
                  className="rb-btn-red inline-flex items-center gap-3 bg-rb-red px-7 py-4 text-[14px] font-semibold tracking-[0.5px] text-white"
                >
                  Sell Your Vehicle
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path d="M4 12L12 4M12 4H5.2M12 4V10.8" stroke="#fff" strokeWidth="1.5" />
                  </svg>
                </Link>
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
