import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import { SiteNav } from '@/components/site/SiteNav';
import { FaqAccordion } from '@/components/site/FaqAccordion';
import { DEFAULT_LISTING_FAQ } from '@/lib/listing-defaults';
import { RandomBackdrop } from '@/components/site/RandomBackdrop';
import { ListingGallery, type GalleryImage } from '@/components/dealer/ListingGallery';
import { InquiryPanel } from '@/components/dealer/InquiryPanel';
import {
  focalPosition,
  getImagesFor,
  getListingBySlug,
  getListingContent,
  getPublicVin,
  getSettings,
  getSlugRedirect,
} from '@/lib/public/content';
import { dedupeModel, formatMileage, formatPrice, listingTitle } from '@/lib/db/types';
import { SchemaScript } from '@/components/site/SchemaScript';
import { carSchema } from '@/lib/seo/schema';
import { MobileShell } from '@/components/mobile/MobileShell';
import { MobileFooter } from '@/components/mobile/MobileFooter';
import { MFaq } from '@/components/mobile/MFaq';
import { MGallery } from '@/components/mobile/MGallery';
import { OverviewExpander } from '@/components/mobile/OverviewExpander';
import { ED, MBtnOutline } from '@/components/mobile/ui';

// /dealer/inventory/[slug] — single listing (2026-07-08 owner rework).
// Section order: gallery → name/mileage/price → primary specifications →
// owner-written overview → highlights → documentation & included items →
// condition & inspection → Available Through Red Box Motors → inquiry form →
// listing FAQ → view additional inventory.
//
// NO generated copy: overview, highlights, documentation and condition
// render ONLY when the owner has written them in /admin — empty sections
// simply don't appear. Template copy makes no absolute claims. Old slugs
// 301 via the slug_redirects table.

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const listing = await getListingBySlug(params.slug);
  if (!listing) return { title: 'Listing not found' };
  const title = listingTitle(listing);
  const detail = [
    listing.mileage != null ? formatMileage(listing.mileage) : null,
    listing.exterior,
  ]
    .filter(Boolean)
    .join(', ');
  const description = `${title} for sale at Red Box Motors, Austin, TX${detail ? `, ${detail}` : ''}. Inquire today.`;
  const path = `/dealer/inventory/${listing.slug}`;
  const images = await getImagesFor('listing', listing.id);
  return {
    title: `${title} for Sale`,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} for Sale, Red Box Motors`,
      description,
      type: 'website',
      url: path,
      ...(images[0] ? { images: [images[0].url] } : {}),
    },
  };
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-5 text-[12px] font-bold uppercase tracking-[2px] text-rb-tx-mute-2">
      {children}
    </h2>
  );
}

function BulletRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 border-t border-rb-line-2 py-[13px]">
      <span className="mt-[7px] h-[5px] w-[5px] flex-none bg-rb-red" />
      <span className="text-[14px] leading-relaxed tracking-[0.2px] text-rb-tx-2">{children}</span>
    </div>
  );
}

export default async function CarDetailPage({ params }: { params: { slug: string } }) {
  const listing = await getListingBySlug(params.slug);
  if (!listing) {
    // Renamed slug? 301 to the new URL before 404ing.
    const target = await getSlugRedirect(params.slug);
    if (target) permanentRedirect(`/dealer/inventory/${target}`);
    notFound();
  }

  const [dbImages, settings, vin, content] = await Promise.all([
    getImagesFor('listing', listing.id),
    getSettings(),
    getPublicVin(listing),
    getListingContent(listing.id),
  ]);

  const images: GalleryImage[] = dbImages.map((img) => ({
    url: img.url,
    alt: img.alt || listingTitle(listing),
    position: focalPosition(img),
    thumb: img.thumb_url,
  }));

  const makeModel = [listing.make, dedupeModel(listing.make, listing.model)]
    .filter(Boolean)
    .join(' ');
  const price = formatPrice(listing.price);
  const mileage = listing.mileage != null ? formatMileage(listing.mileage) : null;

  const specs = [
    { label: 'Year', value: listing.year != null ? String(listing.year) : null },
    { label: 'Make', value: listing.make },
    { label: 'Model', value: dedupeModel(listing.make, listing.model) },
    { label: 'Mileage', value: mileage },
    { label: 'Exterior Color', value: listing.exterior },
    { label: 'Interior Color', value: listing.interior },
    { label: 'Engine', value: listing.engine },
    { label: 'Transmission', value: listing.transmission },
    { label: 'Drivetrain', value: content.drivetrain },
    { label: 'Powertrain', value: content.powertrain },
    { label: 'Combined Output', value: content.output_hp != null ? `${content.output_hp} hp` : null },
    { label: 'Torque', value: content.torque_lbft != null ? `${content.torque_lbft} lb-ft` : null },
    { label: 'Body Style', value: content.body_style },
    { label: 'Title Status', value: content.title_status },
    { label: 'Original MSRP', value: content.msrp != null ? formatPrice(content.msrp) : null },
    // VIN renders ONLY when the owner has marked it public (fetched
    // server-side via the service role — anon cannot read the column).
    { label: 'VIN', value: vin },
    { label: 'Chassis', value: content.chassis_no },
    { label: 'Specification', value: content.special_spec },
  ].filter((s): s is { label: string; value: string } => Boolean(s.value));

  // Owner-written overview: multi-paragraph, split on blank lines. If the
  // owner hasn't written one, the section does not render — never filler.
  const overviewParas = (content.overview ?? '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  const highlights = content.highlights ?? [];
  const documentation = content.documentation ?? [];
  const conditionNotes = (content.condition_notes ?? []).filter((n) => n?.value);
  const faq = content.listing_faq === undefined || content.listing_faq === null
    ? DEFAULT_LISTING_FAQ
    : content.listing_faq;

  const prefill = `I'm interested in the ${listingTitle(listing)}. Please contact me with additional information.`;
  const tel = (settings.phone ?? '').replace(/[^+\d]/g, '');

  const mLabel = 'font-plex text-[11px] tracking-[0.3em] text-white';
  const mFieldLabel = { color: ED(0.45) };

  return (
    <>
      <SchemaScript schema={carSchema(listing, dbImages.map((img) => img.url))} />

      {/* ===== MOBILE (design_handoff Vehicle Detail Mobile) ===== */}
      <MobileShell current="inventory">
        <div className="px-5 pb-1.5 pt-3.5">
          <Link
            href="/dealer/inventory"
            className="flex items-center gap-2 py-2 font-plex text-[10px] tracking-[0.25em]"
            style={{ color: ED(0.55) }}
          >
            <span className="text-rb-red" aria-hidden>
              ←
            </span>{' '}
            ALL INVENTORY
          </Link>
        </div>

        {/* Gallery */}
        <MGallery
          images={images}
          padThumbs
          placeholderTag={makeModel.toLowerCase()}
        />

        {/* Title + price */}
        <section className="flex flex-col gap-3.5 border-b border-white/[0.08] px-5 pb-7 pt-6">
          <div className="flex flex-col gap-1.5">
            {listing.year != null && (
              <div className="font-plex text-[11px] tracking-[0.2em]" style={{ color: ED(0.5) }}>
                {listing.year}
              </div>
            )}
            <h1
              className="m-0 text-[32px] font-extrabold tracking-tight text-white"
              style={{ lineHeight: 1.08 }}
            >
              {makeModel}
            </h1>
            {mileage && (
              <div className="text-[14px]" style={{ color: ED(0.55) }}>
                {mileage}
              </div>
            )}
          </div>
          {listing.price != null && (
            <div className="flex items-baseline justify-between gap-3 border border-white/[0.06] bg-[#151515] px-[18px] py-4">
              <div className="font-plex text-[9px] tracking-[0.25em]" style={mFieldLabel}>
                ASKING PRICE
              </div>
              <div className="text-[26px] font-extrabold tracking-[-0.01em] text-white">{price}</div>
            </div>
          )}
        </section>

        {/* Specifications */}
        <section data-reveal className="flex flex-col gap-4 border-b border-white/[0.08] px-5 pb-10 pt-8">
          <div className={mLabel}>SPECIFICATIONS</div>
          <div className="grid grid-cols-2 gap-x-5">
            {specs.map((spec) => (
              <div
                key={spec.label}
                className="flex flex-col gap-1 border-b border-white/[0.07] py-[13px]"
              >
                <div
                  className="font-plex text-[9px] uppercase tracking-[0.2em]"
                  style={mFieldLabel}
                >
                  {spec.label}
                </div>
                <div className="break-words text-[14px] font-semibold text-white">{spec.value}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Overview — owner-written only, first two paragraphs + expander */}
        {overviewParas.length > 0 && (
          <section data-reveal className="flex flex-col gap-4 border-b border-white/[0.08] px-5 pb-10 pt-8">
            <div className={mLabel}>OVERVIEW</div>
            {overviewParas.slice(0, 2).map((p) => (
              <p
                key={p.slice(0, 40)}
                className="m-0 text-[14px] leading-[1.7]"
                style={{ color: ED(0.72) }}
              >
                {p}
              </p>
            ))}
            <OverviewExpander moreParas={overviewParas.slice(2)} />
          </section>
        )}

        {/* Highlights (owner-authored) */}
        {highlights.length > 0 && (
          <section data-reveal className="flex flex-col gap-4 border-b border-white/[0.08] px-5 pb-10 pt-8">
            <div className={mLabel}>VEHICLE HIGHLIGHTS</div>
            <div className="flex flex-col">
              {highlights.map((h) => (
                <div
                  key={h}
                  className="flex items-start gap-3 border-b border-white/[0.07] py-3.5"
                >
                  <div className="mt-1.5 h-[7px] w-[7px] flex-none bg-rb-red" />
                  <div className="text-[14px] leading-[1.55]" style={{ color: ED(0.8) }}>
                    {h}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Available through */}
        <section data-reveal className="flex flex-col gap-4 border-b border-white/[0.08] px-5 pb-10 pt-8">
          <div className={mLabel}>AVAILABLE THROUGH RED BOX MOTORS</div>
          <div className="flex flex-col">
            {[
              'Available vehicle history and supporting documentation',
              'Additional inspection coordination upon request',
              'Optional PPF, ceramic coating, tint and delivery preparation',
              'Enclosed transportation coordination nationwide',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 border-b border-white/[0.07] py-3.5">
                <div className="mt-1.5 h-[7px] w-[7px] flex-none bg-rb-red" />
                <div className="text-[14px] leading-[1.55]" style={{ color: ED(0.8) }}>
                  {item}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Inquire */}
        <section className="flex flex-col gap-[18px] border-b border-white/[0.08] px-5 pb-11 pt-8">
          <div className={mLabel}>INQUIRE ABOUT THIS VEHICLE</div>
          <InquiryPanel
            makeModel={makeModel}
            price={price}
            prefill={prefill}
            listingSlug={listing.slug}
            listingTitle={listingTitle(listing)}
            phone={settings.phone}
          />
          <div className="flex flex-col gap-2.5 border border-white/10 bg-[#151515] p-[18px]">
            <div className="font-plex text-[9px] tracking-[0.25em]" style={{ color: ED(0.5) }}>
              PREFER TO SPEAK DIRECTLY?
            </div>
            <div className="flex items-baseline justify-between gap-2.5">
              <div className="text-[14px] text-white">
                Call Red Box Motors at{' '}
                <a href={`tel:${tel}`} className="font-bold text-white">
                  {settings.phone}
                </a>
              </div>
              <div className="font-plex text-[9px] tracking-[0.2em]" style={{ color: ED(0.4) }}>
                CALL
              </div>
            </div>
            <div className="flex items-baseline justify-between gap-2.5">
              <div className="text-[14px]" style={{ color: ED(0.7) }}>
                Austin, TX · by appointment
              </div>
              <div className="font-plex text-[9px] tracking-[0.2em]" style={{ color: ED(0.4) }}>
                MON–SAT
              </div>
            </div>
          </div>
        </section>

        {/* Vehicle FAQ */}
        <section className="flex flex-col gap-4 border-b border-white/[0.08] px-5 pb-10 pt-8">
          {faq.length > 0 && (
            <>
              <div className={mLabel}>QUESTIONS ABOUT THIS VEHICLE</div>
              <MFaq faqs={faq} />
            </>
          )}
          <div className="flex flex-col gap-3.5 pt-2.5">
            <div className="text-[16px] font-semibold" style={{ color: ED(0.8) }}>
              Looking for another vehicle?
            </div>
            <MBtnOutline href="/dealer/inventory">View All Inventory</MBtnOutline>
          </div>
        </section>

        <MobileFooter phone={settings.phone} email={settings.email} />
      </MobileShell>

      {/* ===== DESKTOP (unchanged) ===== */}
      <main className="relative hidden min-h-screen bg-rb-bg text-white md:block">
      <RandomBackdrop />

      <div className="relative z-[1]">
        <SiteNav current="inventory" />

        <div className="mx-auto max-w-[1180px] px-5 pb-20 pt-24 md:px-11">
          {/* —— Back —— */}
          <Link
            href="/dealer/inventory"
            className="mb-[30px] inline-flex items-center gap-[9px] text-[12px] uppercase tracking-[2px] text-rb-tx-mute-2 transition-colors duration-150 hover:text-white"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.3" />
            </svg>
            All Inventory
          </Link>

          {/* —— Floating listing card —— */}
          <div className="bg-rb-surface px-5 pb-10 pt-[34px] shadow-[0_40px_90px_rgba(0,0,0,0.55),0_12px_32px_rgba(0,0,0,0.42)] md:px-10">
            <div className="animate-rb-fade-up">
              {/* 1 · Gallery */}
              <ListingGallery images={images} tag={makeModel.toLowerCase()} />

              {/* 2 · Name / mileage / price */}
              <div className="mt-[50px] flex flex-wrap items-end justify-between gap-6">
                <div className="min-w-0">
                  {listing.year != null && (
                    <div className="mb-2.5 text-[16px] tracking-[0.5px] text-rb-tx-mute-3">
                      {listing.year}
                    </div>
                  )}
                  <h1 className="m-0 text-[36px] font-semibold leading-none tracking-tighter text-white md:text-[48px]">
                    {makeModel}
                  </h1>
                  {mileage && (
                    <div className="mt-3.5 text-[14px] tracking-[0.5px] text-rb-tx-mute">
                      {mileage}
                    </div>
                  )}
                </div>
                {listing.price != null && (
                  <div className="text-right">
                    <div className="mb-1.5 text-[10px] uppercase tracking-[2px] text-rb-tx-faint">
                      Asking Price
                    </div>
                    <div className="text-[30px] font-semibold tracking-[-0.01em] text-white md:text-[34px]">
                      {price}
                    </div>
                  </div>
                )}
              </div>

              {/* 3 · Primary specifications */}
              <div className="mt-12 border-t border-rb-line-2 pt-[34px]">
                <SectionHeading>Specifications</SectionHeading>
                <div className="grid gap-x-14 sm:grid-cols-2">
                  {specs.map((spec) => (
                    <div key={spec.label} className="border-t border-rb-line-2 py-4">
                      <div className="mb-[7px] text-[10px] uppercase tracking-[2px] text-rb-tx-faint">
                        {spec.label}
                      </div>
                      <div className="text-[14px] tracking-[0.2px] text-white">{spec.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4 · Owner-written overview — renders only when written */}
              {overviewParas.length > 0 && (
                <div className="mt-12 border-t border-rb-line-2 pt-[34px]">
                  <SectionHeading>Overview</SectionHeading>
                  <div className="max-w-[820px]">
                    {overviewParas.map((p, i) => (
                      <p
                        key={p.slice(0, 32)}
                        className={`mt-0 text-[15.5px] leading-[1.8] ${
                          i === 0 ? 'text-[#c4c4c4]' : 'text-[#9a9a9a]'
                        } ${i === overviewParas.length - 1 ? 'mb-0' : 'mb-5'}`}
                      >
                        {p}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* 5 · Highlights — owner-authored list */}
              {highlights.length > 0 && (
                <div className="mt-12 border-t border-rb-line-2 pt-[34px]">
                  <SectionHeading>Vehicle Highlights</SectionHeading>
                  <div className="grid gap-x-14 sm:grid-cols-2">
                    {highlights.map((h) => (
                      <BulletRow key={h}>{h}</BulletRow>
                    ))}
                  </div>
                </div>
              )}

              {/* 6 · Documentation & included items */}
              {documentation.length > 0 && (
                <div className="mt-12 border-t border-rb-line-2 pt-[34px]">
                  <SectionHeading>Documentation &amp; Included Items</SectionHeading>
                  <div className="grid gap-x-14 sm:grid-cols-2">
                    {documentation.map((d) => (
                      <BulletRow key={d}>{d}</BulletRow>
                    ))}
                  </div>
                </div>
              )}

              {/* 7 · Condition & inspection — owner-verified details only */}
              {conditionNotes.length > 0 && (
                <div className="mt-12 border-t border-rb-line-2 pt-[34px]">
                  <SectionHeading>Condition &amp; Inspection</SectionHeading>
                  <div className="grid gap-x-14 sm:grid-cols-2">
                    {conditionNotes.map((n) => (
                      <div key={n.label} className="border-t border-rb-line-2 py-4">
                        <div className="mb-[7px] text-[10px] uppercase tracking-[2px] text-rb-tx-faint">
                          {n.label}
                        </div>
                        <div className="text-[14px] leading-relaxed tracking-[0.2px] text-rb-tx-2">
                          {n.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 8 · Available through Red Box Motors */}
              <div className="mt-12 border-t border-rb-line-2 pt-[34px]">
                <SectionHeading>Available Through Red Box Motors</SectionHeading>
                <div className="grid gap-x-14 sm:grid-cols-2">
                  {[
                    'Available vehicle history and supporting documentation',
                    'Additional inspection coordination upon request',
                    'Optional PPF, ceramic coating, tint and delivery preparation',
                    'Enclosed transportation coordination nationwide',
                  ].map((item) => (
                    <BulletRow key={item}>{item}</BulletRow>
                  ))}
                </div>
              </div>

              {/* 9 · Inquiry */}
              <div className="mt-12 border-t border-rb-line-2 pt-[34px]">
                <SectionHeading>Inquire About This Vehicle</SectionHeading>
                <div className="flex items-start gap-10 max-lg:flex-col">
                  <div className="min-w-0 flex-[1.3] max-lg:w-full">
                    <InquiryPanel
                      makeModel={makeModel}
                      price={price}
                      prefill={prefill}
                      listingSlug={listing.slug}
                      listingTitle={listingTitle(listing)}
                      phone={settings.phone}
                    />
                  </div>
                  <div className="min-w-0 flex-1 max-lg:w-full">
                    <div className="border border-rb-line-2 bg-rb-surface">
                      <div className="px-5 py-[18px]">
                        <div className="mb-3.5 text-[11px] uppercase tracking-[2px] text-rb-tx-mute-2">
                          Prefer to speak directly?
                        </div>
                        <a
                          href={`tel:${tel}`}
                          className="mb-3 flex items-center justify-between gap-2.5 no-underline"
                        >
                          <span className="text-[14px] tracking-[0.3px] text-white">
                            Call Red Box Motors at {settings.phone}
                          </span>
                          <span className="font-mono text-[10px] tracking-[1px] text-rb-tx-faint">
                            CALL
                          </span>
                        </a>
                        <div className="flex items-center justify-between gap-2.5">
                          <span className="text-[13px] tracking-[0.2px] text-[#9a9a9a]">
                            Austin, TX · by appointment
                          </span>
                          <span className="font-mono text-[10px] tracking-[1px] text-rb-tx-faint">
                            MON-SAT
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 10 · Listing-specific FAQ (below the inquiry form per owner) */}
              {faq.length > 0 && (
                <div className="mt-12 border-t border-rb-line-2 pt-[34px]">
                  <SectionHeading>Questions About This Vehicle</SectionHeading>
                  <div className="border border-rb-line-2">
                    <FaqAccordion faqs={faq} />
                  </div>
                </div>
              )}

              {/* 11 · View additional inventory */}
              <div className="mt-12 flex flex-wrap items-center justify-between gap-5 border-t border-rb-line-2 pt-8">
                <span className="text-[15px] font-medium tracking-[0.2px] text-rb-tx-mute">
                  Looking for another vehicle?
                </span>
                <Link
                  href="/dealer/inventory"
                  className="rb-btn inline-flex items-center gap-2.5 border border-rb-red bg-transparent px-6 py-3.5 text-[13px] font-semibold tracking-[0.5px] text-rb-red transition-colors duration-[180ms] hover:bg-rb-red hover:text-white"
                >
                  View All Inventory
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path d="M4 12L12 4M12 4H5.2M12 4V10.8" stroke="currentColor" strokeWidth="1.4" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      </main>
    </>
  );
}
