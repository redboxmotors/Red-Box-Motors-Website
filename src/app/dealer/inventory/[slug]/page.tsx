import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteNav } from '@/components/site/SiteNav';
import { VisitAndFAQ } from '@/components/site/VisitAndFAQ';
import { RandomBackdrop } from '@/components/site/RandomBackdrop';
import { ListingGallery, type GalleryImage } from '@/components/dealer/ListingGallery';
import { InquiryPanel } from '@/components/dealer/InquiryPanel';
import {
  focalPosition,
  getImagesFor,
  getListingBySlug,
  getPublicVin,
  getSettings,
} from '@/lib/public/content';
import type { Listing } from '@/lib/db/types';
import { formatMileage, formatPrice, listingTitle } from '@/lib/db/types';
import { SchemaScript } from '@/components/site/SchemaScript';
import { carSchema } from '@/lib/seo/schema';

// /dealer/inventory/[slug] — Car Detail.dc.html. Single listing: gallery
// (CMS images), specs, inquiry box, price and the SEO overview copy, floated
// as a solid card over the blurred random background. VIN renders ONLY when
// vin_public.

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
  return {
    title: `${title} for Sale`,
    description: `${title} for sale at Red Box Motors, Austin, TX${detail ? ` — ${detail}` : ''}. Inquire today.`,
  };
}

// Overview paragraphs built from real listing fields only (prototype
// templates), skipping clauses whose data is missing — never invented.
function overviewParagraphs(l: Listing): string[] {
  const title = listingTitle(l);
  const mm = `${l.make} ${l.model}`;

  const clauses: string[] = [];
  if (l.exterior && l.interior) {
    clauses.push(`is presented in ${l.exterior} over a ${l.interior} interior`);
  } else if (l.exterior) {
    clauses.push(`is presented in ${l.exterior}`);
  } else if (l.interior) {
    clauses.push(`features a ${l.interior} interior`);
  }
  if (l.engine) {
    clauses.push(
      `${clauses.length ? 'powered' : 'is powered'} by its ${l.engine}${
        l.transmission ? ` paired with a ${l.transmission}` : ''
      }`,
    );
  }
  const first = clauses.length ? `This ${title} ${clauses.join(', ')}.` : `This ${title}.`;
  const second =
    l.mileage != null
      ? `Showing ${formatMileage(l.mileage)} on the odometer, it has been inspected and fully documented by Red Box Motors before listing.`
      : 'It has been inspected and fully documented by Red Box Motors before listing.';

  return [
    `${first} ${second}`,
    'Every car we offer is one we would own ourselves — vetted for condition, history and provenance so there are no surprises. Full ownership and service records travel with the car, and our team is happy to arrange a walkaround, additional photos or a pre-purchase inspection on request.',
    `Because the same roof also protects and details cars, your ${mm} can roll straight into paint protection film, a ceramic coating or a vinyl wrap before it is handed over — ready for the road or the track the day you take delivery, anywhere in the country via insured door-to-door transport.`,
  ];
}

export default async function CarDetailPage({ params }: { params: { slug: string } }) {
  const listing = await getListingBySlug(params.slug);
  if (!listing) notFound();

  const [dbImages, settings, vin] = await Promise.all([
    getImagesFor('listing', listing.id),
    getSettings(),
    getPublicVin(listing),
  ]);

  const images: GalleryImage[] = dbImages.map((img) => ({
    url: img.url,
    alt: img.alt || listingTitle(listing),
    position: focalPosition(img),
  }));

  const makeModel = `${listing.make} ${listing.model}`;
  const price = formatPrice(listing.price);
  const mileage = listing.mileage != null ? formatMileage(listing.mileage) : null;

  const specs: { label: string; value: string }[] = [
    { label: 'Year', value: listing.year != null ? String(listing.year) : null },
    { label: 'Make', value: listing.make },
    { label: 'Model', value: listing.model },
    { label: 'Mileage', value: mileage },
    { label: 'Exterior Color', value: listing.exterior },
    { label: 'Interior Color', value: listing.interior },
    { label: 'Engine', value: listing.engine },
    { label: 'Transmission', value: listing.transmission },
    // VIN renders ONLY when the owner has marked it public (fetched
    // server-side via the service role — anon cannot read the column).
    { label: 'VIN', value: vin },
  ].filter((s): s is { label: string; value: string } => Boolean(s.value));

  const [overview1, overview2, overview3] = overviewParagraphs(listing);
  const highlights = [
    listing.exterior ? `${listing.exterior} exterior` : null,
    listing.interior ? `${listing.interior} interior` : null,
    listing.engine,
    listing.transmission,
    mileage ? `${mileage} · documented history` : null,
  ].filter((h): h is string => Boolean(h));

  const prefill = `I'm interested in the ${[listing.year, makeModel].filter(Boolean).join(' ')}.`;
  const tel = (settings.phone ?? '').replace(/[^+\d]/g, '');

  return (
    <main className="relative min-h-screen bg-rb-bg text-white">
      <SchemaScript schema={carSchema(listing, dbImages.map((img) => img.url))} />
      <RandomBackdrop />

      <div className="relative z-[1]">
        <SiteNav current="dealer" />

        <div className="mx-auto max-w-[1180px] px-11 pb-20 pt-24">
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
          <div className="bg-rb-surface px-10 pb-10 pt-[34px] shadow-[0_40px_90px_rgba(0,0,0,0.55),0_12px_32px_rgba(0,0,0,0.42)]">
            <div className="animate-rb-fade-up">
              {/* Gallery */}
              <ListingGallery images={images} tag={makeModel.toLowerCase()} />

              {/* Name */}
              <div className="mt-[50px]">
                {listing.year != null && (
                  <div className="mb-2.5 text-[16px] tracking-[0.5px] text-rb-tx-mute-3">
                    {listing.year}
                  </div>
                )}
                <h1 className="m-0 text-[48px] font-semibold leading-none tracking-tighter text-white">
                  {makeModel}
                </h1>
              </div>

              {/* Two column: specs | inquiry */}
              <div className="mt-12 flex items-start gap-14 max-lg:flex-col">
                <div className="min-w-0 flex-[1.4] max-lg:w-full">
                  <h2 className="mb-2 text-[12px] font-bold uppercase tracking-[2px] text-rb-tx-mute-2">
                    Specifications
                  </h2>
                  {specs.map((spec) => (
                    <div key={spec.label} className="border-t border-rb-line-2 py-4">
                      <div className="mb-[7px] text-[10px] uppercase tracking-[2px] text-rb-tx-faint">
                        {spec.label}
                      </div>
                      <div className="text-[14px] tracking-[0.2px] text-white">{spec.value}</div>
                    </div>
                  ))}
                </div>

                <div className="sticky top-[100px] min-w-0 flex-1 max-lg:static max-lg:w-full">
                  <InquiryPanel
                    makeModel={makeModel}
                    price={price}
                    prefill={prefill}
                    listingSlug={listing.slug}
                    listingTitle={makeModel}
                  />

                  {/* Supplementary */}
                  <div className="mt-0.5 border border-rb-line-2 bg-rb-surface">
                    <div className="border-b border-rb-raised-3 px-5 py-[18px]">
                      <div className="mb-3.5 text-[11px] uppercase tracking-[2px] text-rb-tx-mute-2">
                        Prefer to talk?
                      </div>
                      <a
                        href={`tel:${tel}`}
                        className="mb-3 flex items-center justify-between gap-2.5 no-underline"
                      >
                        <span className="text-[14px] tracking-[0.3px] text-white">
                          {settings.phone}
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
                          MON–SAT
                        </span>
                      </div>
                    </div>
                    <div className="px-5 py-[18px]">
                      <div className="mb-3.5 text-[11px] uppercase tracking-[2px] text-rb-tx-mute-2">
                        Every purchase includes
                      </div>
                      {[
                        'Inspected & fully documented',
                        'PPF, ceramic or wrap before delivery',
                        'Insured door-to-door transport',
                      ].map((item) => (
                        <div key={item} className="flex items-center gap-[11px] py-[9px]">
                          <span className="h-[5px] w-[5px] flex-none bg-rb-red" />
                          <span className="text-[13px] text-rb-tx-3">{item}</span>
                        </div>
                      ))}
                      <Link
                        href="/dealer/sourced"
                        className="mt-3.5 inline-flex items-center gap-2 text-[12px] tracking-[1px] text-rb-tx-mute transition-colors duration-150 hover:text-white"
                      >
                        Not quite it? We&rsquo;ll source it
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
                          <path d="M4 12L12 4M12 4H5.2M12 4V10.8" stroke="currentColor" strokeWidth="1.3" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price */}
              {listing.price != null && (
                <div className="mt-12 border-t border-rb-line-2 pt-7">
                  <div className="mb-2.5 text-[11px] uppercase tracking-[2px] text-rb-tx-mute-3">
                    Asking Price
                  </div>
                  <div className="text-[32px] font-semibold tracking-[-0.01em] text-white">
                    {price}
                  </div>
                </div>
              )}

              {/* Overview / description (SEO) */}
              <div className="mt-12 border-t border-rb-line-2 pt-[34px]">
                <h2 className="mb-5 text-[12px] font-bold uppercase tracking-[2px] text-rb-tx-mute-2">
                  Overview
                </h2>
                <div className="flex flex-wrap items-start gap-14">
                  <div className="min-w-[320px] flex-[1.4] max-md:min-w-0 max-md:basis-full">
                    <p className="mb-5 mt-0 text-[16px] leading-[1.8] text-[#c4c4c4]">{overview1}</p>
                    <p className="mb-5 mt-0 text-[15px] leading-[1.8] text-[#9a9a9a]">{overview2}</p>
                    <p className="m-0 text-[15px] leading-[1.8] text-[#9a9a9a]">{overview3}</p>
                  </div>
                  <div className="min-w-[260px] flex-1 max-md:min-w-0 max-md:basis-full">
                    <div className="mb-3.5 text-[10px] uppercase tracking-[2px] text-rb-tx-faint">
                      Highlights
                    </div>
                    <div className="flex flex-col">
                      {highlights.map((h) => (
                        <div
                          key={h}
                          className="flex items-center gap-3 border-t border-rb-line-2 py-[13px]"
                        >
                          <span className="h-[5px] w-[5px] flex-none bg-rb-red" />
                          <span className="text-[13.5px] tracking-[0.2px] text-rb-tx-2">{h}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 border border-rb-line bg-rb-surface-2 px-5 py-[18px]">
                      <div className="mb-2 text-[11px] uppercase tracking-[1.5px] text-rb-tx-mute-2">
                        Buy with Red Box Motors
                      </div>
                      <div className="text-[13px] leading-relaxed text-[#999]">
                        Inspected &amp; documented · PPF, ceramic or wrap before delivery · insured
                        door-to-door transport nationwide.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <VisitAndFAQ division="dealer" />
      </div>
    </main>
  );
}
