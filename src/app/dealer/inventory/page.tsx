import type { Metadata } from 'next';
import Link from 'next/link';
import { ContactLink } from '@/components/contact/ContactModal';
import { FirstLookLink, FirstLookProvider } from '@/components/dealer/FirstLookModal';
import { ExpandingScrollBox } from '@/components/site/ExpandingScrollBox';
import { SiteNav } from '@/components/site/SiteNav';
import { VisitAndFAQ } from '@/components/site/VisitAndFAQ';
import { CmsImage } from '@/components/site/PhotoTile';
import { RandomBackdrop } from '@/components/site/RandomBackdrop';
import { InventoryToolbar } from '@/components/dealer/InventoryToolbar';
import { DEFAULT_SORT, makeParam, type SortKey } from '@/components/dealer/inventory-params';
import {
  getHeroImages,
  getListings,
  getSettings,
  getSourced,
  heroFor,
  listingHref,
} from '@/lib/public/content';
import type { DbImage, Listing, Sourced } from '@/lib/db/types';
import { formatMileage, formatPrice } from '@/lib/db/types';
import { SchemaScript } from '@/components/site/SchemaScript';
import { itemListSchema } from '@/lib/seo/schema';

// /dealer/inventory — Dealer Inventory.dc.html. For-sale roster with the
// functional make-filter + sort toolbar (URL-query-driven so views are
// shareable), then the "Sold, sourced & arriving" pipeline band, CTA and
// Visit & FAQ, all inside the expanding scroll box.

export const revalidate = 60;

export const metadata: Metadata = {
  alternates: { canonical: '/dealer/inventory' },
  title: 'Inventory for Sale',
  description:
    'Browse exceptional cars for sale at Red Box Motors, Austin, TX. Sales and consignment nationwide.',
};

// Sold/sourced pipeline rows are unpublished (owner revision) — flip to
// restore. Data still flows; only rendering is gated.
const SHOW_SOLD_PIPELINE = false;
const SHOW_SOURCED_PIPELINE = false;

// Inventory-specific questions (owner checklist 2026-07-07) — the general
// FAQ lives on the homepage only.
const INVENTORY_FAQ = [
  { q: 'Can I schedule a viewing?', a: 'Yes — visits are by appointment at our Austin facility. Use the inquiry form on any vehicle page or call us to set a time.' },
  { q: 'Can I request additional photos or video?', a: 'Yes. Every vehicle page has an inquiry form where you can request additional photographs or a personal video walkaround.' },
  { q: 'Can a third-party inspection be arranged?', a: 'Yes — we accommodate independent pre-purchase inspections and can help coordinate one locally.' },
  { q: 'Can enclosed transportation be coordinated?', a: 'Yes. Enclosed, insured door-to-door transport can be arranged nationwide as part of the purchase.' },
  { q: 'Can Red Box complete PPF, coating, tint or detailing before delivery?', a: 'Yes — Red Box Restoration can protect and prepare the vehicle before it ever leaves the building. Ask about pre-delivery packages on any inquiry.' },
];

const SORT_KEYS: SortKey[] = ['price-desc', 'price-asc', 'year-desc', 'miles-asc'];

const SORTERS: Record<SortKey, (a: Listing, b: Listing) => number> = {
  'price-desc': (a, b) => (b.price ?? -1) - (a.price ?? -1),
  'price-asc': (a, b) => (a.price ?? Number.MAX_SAFE_INTEGER) - (b.price ?? Number.MAX_SAFE_INTEGER),
  'year-desc': (a, b) => (b.year ?? 0) - (a.year ?? 0),
  'miles-asc': (a, b) => (a.mileage ?? Number.MAX_SAFE_INTEGER) - (b.mileage ?? Number.MAX_SAFE_INTEGER),
};

const ARROW = (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M4 12L12 4M12 4H5.2M12 4V10.8" stroke="currentColor" strokeWidth="1.3" />
  </svg>
);

function tagFor(item: Pick<Listing, 'make' | 'model'>): string {
  return `${item.make} ${item.model}`.toLowerCase();
}

function Stripe({ tag, faint = false }: { tag: string; faint?: boolean }) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{
        backgroundImage:
          'repeating-linear-gradient(135deg,#171717 0,#171717 11px,#101010 11px,#101010 22px)',
      }}
    >
      <span
        className={`font-mono text-[10px] tracking-[1px] ${faint ? 'text-[#333]' : 'text-rb-tx-ghost'}`}
      >
        [ {tag} ]
      </span>
    </div>
  );
}

// —— Roster tile: hover reveals spec + VIEW row and the red baseline bar ——
function RosterCard({ listing, image }: { listing: Listing; image: DbImage | null }) {
  const meta = [
    listing.year,
    listing.mileage != null ? formatMileage(listing.mileage) : null,
    listing.exterior,
  ]
    .filter(Boolean)
    .join(' · ');
  const spec = [listing.engine, listing.transmission].filter(Boolean).join(' · ');
  return (
    <Link
      href={listingHref(listing)}
      className="group relative z-[1] block h-[330px] cursor-pointer overflow-hidden transition-[filter,transform,box-shadow] duration-[260ms] ease-rb hover:z-[6] hover:-translate-y-[5px] hover:scale-[1.015] hover:shadow-[0_24px_50px_rgba(0,0,0,0.62)] hover:brightness-[1.14] active:translate-y-0 active:scale-[0.992]"
      style={{ background: 'linear-gradient(165deg,#131313 0%,#0D0D0D 55%,#090909 100%)' }}
    >
      {image ? (
        <CmsImage image={image} className="absolute inset-0 h-full w-full" />
      ) : (
        <Stripe tag={tagFor(listing)} />
      )}
      <div className="absolute inset-x-0 bottom-0 h-[62%] bg-[linear-gradient(transparent,rgba(0,0,0,0.55)_45%,rgba(0,0,0,0.92))]" />
      <div className="absolute left-[22px] top-5 text-[10px] uppercase tracking-[2.5px] text-rb-tx-mute-2">
        {listing.make}
      </div>
      <div className="absolute right-[22px] top-[18px] font-mono text-[13px] tracking-[0.5px] text-white">
        {formatPrice(listing.price)}
      </div>
      <div className="absolute inset-x-0 bottom-0 px-[22px] pb-5 pt-[18px]">
        <div className="overflow-hidden text-ellipsis whitespace-nowrap text-[21px] font-semibold leading-[1.1] tracking-[-0.015em] text-white">
          {listing.model}
        </div>
        <div className="mt-2 font-mono text-[11px] tracking-[0.5px] text-[#8a8a8a]">{meta}</div>
        <div className="flex max-h-0 items-center justify-between gap-3.5 overflow-hidden opacity-0 transition-[max-height,opacity,margin-top] duration-[220ms] ease-rb group-hover:mt-2.5 group-hover:max-h-[26px] group-hover:opacity-100">
          <span className="font-mono text-[11px] tracking-[0.5px] text-[#bbb]">{spec}</span>
          <span className="inline-flex items-center gap-1.5 text-[11px] tracking-[1.5px] text-white">
            VIEW
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M4 12L12 4M12 4H5.2M12 4V10.8" stroke="#CC0000" strokeWidth="1.4" />
            </svg>
          </span>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-rb-red transition-transform duration-300 ease-rb group-hover:scale-x-100" />
    </Link>
  );
}

// —— Small pipeline card (Recently sold / Found for clients / Arriving) ——
function PipelineCard({
  href,
  image,
  tag,
  chip,
  chipBorder,
  chipColor,
  make,
  title,
  sub,
  sold = false,
  firstLook,
}: {
  href: string;
  image: DbImage | null;
  tag: string;
  chip: string;
  chipBorder: string;
  chipColor: string;
  make: string;
  title: string;
  sub?: string | null;
  sold?: boolean;
  firstLook?: { vehicle: string; campaign?: string };
}) {
  const cls = `relative z-[1] block h-[190px] cursor-pointer overflow-hidden bg-rb-surface transition-[filter,transform,box-shadow] duration-[260ms] ease-rb hover:z-[6] hover:-translate-y-[5px] hover:scale-[1.02] hover:shadow-[0_22px_44px_rgba(0,0,0,0.6)] active:translate-y-0 active:scale-[0.99] ${
    sold ? 'hover:brightness-[1.1]' : 'hover:brightness-[1.14]'
  }`;
  const inner = (
    <>
      {image ? (
        <CmsImage image={image} className="absolute inset-0 h-full w-full" />
      ) : (
        <Stripe tag={tag} faint={sold} />
      )}
      {sold && <div className="absolute inset-0 bg-[rgba(5,5,5,0.3)]" />}
      <div className="absolute inset-x-0 bottom-0 h-[64%] bg-[linear-gradient(transparent,rgba(0,0,0,0.55)_45%,rgba(0,0,0,0.92))]" />
      <div
        className="absolute left-3.5 top-[13px] border bg-black/40 px-2 py-1"
        style={{ borderColor: chipBorder }}
      >
        <span className="font-mono text-[9px] tracking-[2px]" style={{ color: chipColor }}>
          {chip}
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 px-4 py-3.5">
        <div
          className={`mb-1 text-[9.5px] uppercase tracking-[2px] ${sold ? 'text-rb-tx-mute-3' : 'text-rb-tx-mute-2'}`}
        >
          {make}
        </div>
        <div
          className={`overflow-hidden text-ellipsis whitespace-nowrap text-[16px] font-semibold tracking-[-0.015em] ${
            sold ? 'text-[#cfcfcf]' : 'text-white'
          }`}
        >
          {title}
        </div>
        {sub && (
          <div className="mt-[5px] overflow-hidden text-ellipsis whitespace-nowrap font-mono text-[10px] tracking-[0.5px] text-[#8a8a8a]">
            {sub}
          </div>
        )}
      </div>
    </>
  );
  // Arriving cards open the First Look form; sold/sourced use real routes.
  return firstLook ? (
    <FirstLookLink vehicle={firstLook.vehicle} campaign={firstLook.campaign} className={cls}>
      {inner}
    </FirstLookLink>
  ) : (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}

function SectionHeader({
  label,
  note,
  link,
}: {
  label: string;
  note: string;
  link: React.ReactNode;
}) {
  return (
    <div data-reveal className="mb-3 flex flex-wrap items-baseline justify-between gap-3.5">
      <div className="flex items-baseline gap-3.5">
        <span className="text-[12px] font-bold uppercase tracking-[3px] text-white">{label}</span>
        <span className="text-[11px] tracking-[0.5px] text-rb-tx-faint">{note}</span>
      </div>
      {link}
    </div>
  );
}

export default async function DealerInventoryPage({
  searchParams,
}: {
  searchParams?: { make?: string | string[]; sort?: string | string[] };
}) {
  const [forSale, coming, sold, sourced, settings] = await Promise.all([
    getListings('for_sale'),
    getListings('coming_soon'),
    getListings('sold'),
    getSourced(),
    getSettings(),
  ]);

  // —— URL-driven filter + sort (?make=porsche&sort=price-desc) ——
  const makes = Array.from(new Set(forSale.map((l) => l.make)));
  const makeRaw = searchParams?.make;
  const sortRaw = searchParams?.sort;
  const makeQ = (typeof makeRaw === 'string' ? makeRaw : '').toLowerCase();
  const activeMake = makes.find((m) => makeParam(m) === makeQ) ?? 'All';
  const sortKey: SortKey =
    typeof sortRaw === 'string' && SORT_KEYS.includes(sortRaw as SortKey)
      ? (sortRaw as SortKey)
      : DEFAULT_SORT;
  const byMake = (l: { make: string }) => activeMake === 'All' || l.make === activeMake;

  const roster = forSale.filter(byMake).sort(SORTERS[sortKey]);
  const soldShown = sold.filter(byMake).slice(0, 4);
  const comingShown = coming.filter(byMake).slice(0, 4);
  const sourcedShown: Sourced[] = sourced.slice(0, 4);

  const countLabel =
    activeMake === 'All'
      ? `${forSale.length} vehicles`
      : `${roster.length} of ${forSale.length} vehicles`;

  const heroes = await getHeroImages([
    ...[...roster, ...soldShown, ...comingShown].map((l) => ({ type: 'listing' as const, id: l.id })),
    ...sourcedShown.map((s) => ({ type: 'sourced' as const, id: s.id })),
  ]);

  const hasPipeline =
    (SHOW_SOLD_PIPELINE && soldShown.length > 0) ||
    (SHOW_SOURCED_PIPELINE && sourcedShown.length > 0) ||
    comingShown.length > 0;

  return (
    <FirstLookProvider phone={settings.phone}>
    <main className="relative bg-rb-bg text-white">
      <SchemaScript schema={itemListSchema(forSale)} />
      <RandomBackdrop />
      <SiteNav current="inventory" />

      <div
        className="rb-noscrollbar relative z-[1] h-screen overflow-y-auto bg-transparent"
        style={{ scrollSnapType: 'y proximity' }}
      >
        <ExpandingScrollBox>
          {/* —— Photo header —— */}
          <div className="relative h-[400px] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/inventory-represented.jpg"
              alt="Aston Martin Valkyrie pair represented by Red Box Motors, Austin TX"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: 'center 45%' }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.10)_0%,rgba(10,10,10,0.04)_40%,rgba(10,10,10,0.55)_74%,rgba(10,10,10,0.92)_92%,#0A0A0A_100%)]" />
            <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-6 px-12 pb-[34px]">
              <div>
                <div className="mb-4 font-mono text-[11px] uppercase tracking-[4px] text-rb-red">
                  — Sales &amp; Consignment · Inventory
                </div>
                <h1
                  className="m-0 font-bold text-white"
                  style={{
                    fontSize: 'clamp(36px,4.8vw,66px)',
                    letterSpacing: '-0.04em',
                    lineHeight: 0.96,
                  }}
                >
                  Currently represented.
                </h1>
                <p className="mb-0 mt-[18px] max-w-[640px] text-[15px] leading-relaxed tracking-[0.2px] text-[#c4c4c4] [text-shadow:0_1px_20px_rgba(0,0,0,0.7)]">
                  Explore enthusiast and collector vehicles currently offered through Red Box
                  Motors. Each represented vehicle is presented with available specifications,
                  history, condition information and supporting documentation so buyers can make
                  an informed decision.
                </p>
              </div>
              <Link
                href="/dealer"
                className="inline-flex items-center gap-[9px] whitespace-nowrap text-[12.5px] tracking-[1.5px] text-rb-tx-mute transition-colors duration-150 hover:text-white"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.3" />
                </svg>
                Sales &amp; Consignment overview
              </Link>
            </div>
          </div>

          {/* —— Toolbar (functional filter + sort) —— */}
          <InventoryToolbar
            makes={makes}
            activeMake={activeMake}
            sortKey={sortKey}
            countLabel={countLabel}
          />

          {/* —— Roster grid —— */}
          {roster.length > 0 ? (
            <div className="mx-12 grid grid-cols-1 gap-1.5 bg-black p-1.5 md:grid-cols-2 lg:grid-cols-3">
              {roster.map((l) => (
                <RosterCard key={l.id} listing={l} image={heroFor(heroes, 'listing', l.id)} />
              ))}
            </div>
          ) : forSale.length > 0 ? (
            <div className="mx-12 bg-black px-6 py-[60px] text-center">
              <div className="mb-1.5 text-[16px] tracking-[0.3px] text-rb-tx-mute-2">
                No vehicles match this filter.
              </div>
              <div className="text-[13px] text-rb-tx-faint-2">Try a different make.</div>
            </div>
          ) : (
            <div className="mx-12 bg-black px-6 py-[60px] text-center">
              <div className="mb-1.5 text-[16px] tracking-[0.3px] text-rb-tx-mute-2">
                No vehicles are listed right now.
              </div>
              <div className="text-[13px] text-rb-tx-faint-2">The floor changes weekly.</div>
            </div>
          )}

          {/* —— The pipeline: sold, sourced & arriving —— */}
          {hasPipeline && (
            <div
              className="mt-14 px-12 py-14"
              style={{
                background: 'linear-gradient(180deg,#0A0A0A 0px,#151515 160px)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)',
              }}
            >
              <div
                data-reveal
                className="mb-[34px] flex flex-wrap items-end justify-between gap-5"
              >
                <div>
                  <div className="mb-[13px] font-mono text-[11px] uppercase tracking-[4px] text-rb-red">
                    — Beyond the floor
                  </div>
                  <h2
                    className="m-0 font-bold leading-none text-white"
                    style={{ fontSize: 'clamp(28px,3.2vw,48px)', letterSpacing: '-0.03em' }}
                  >
                    Arriving soon
                  </h2>
                </div>
                <span className="font-mono text-[11px] tracking-[1px] text-rb-tx-faint">
                  The floor moves weekly
                </span>
              </div>

              {SHOW_SOLD_PIPELINE && soldShown.length > 0 && (
                <>
                  <SectionHeader
                    label="Recently sold"
                    note="Placed with the right owners"
                    link={
                      <Link
                        href="/dealer/sold"
                        className="inline-flex items-center gap-[7px] text-[12px] tracking-[0.5px] text-rb-tx-mute transition-[gap,color] duration-200 hover:gap-3 hover:text-white"
                      >
                        All placements {ARROW}
                      </Link>
                    }
                  />
                  <div className="mb-10 grid grid-cols-2 gap-1.5 bg-black p-1.5 lg:grid-cols-4">
                    {soldShown.map((l) => (
                      <PipelineCard
                        key={l.id}
                        href="/dealer/sold"
                        image={heroFor(heroes, 'listing', l.id)}
                        tag={tagFor(l)}
                        chip="SOLD"
                        chipBorder="#555"
                        chipColor="#bbb"
                        make={l.make}
                        title={l.model}
                        sold
                      />
                    ))}
                  </div>
                </>
              )}

              {SHOW_SOURCED_PIPELINE && sourcedShown.length > 0 && (
                <>
                  <SectionHeader
                    label="Found for clients"
                    note="Sourced on request — off-market & nationwide"
                    link={
                      <Link
                        href="/dealer/sourced"
                        className="inline-flex items-center gap-[7px] text-[12px] tracking-[0.5px] text-rb-tx-mute transition-[gap,color] duration-200 hover:gap-3 hover:text-white"
                      >
                        Every find {ARROW}
                      </Link>
                    }
                  />
                  <div className="mb-10 grid grid-cols-2 gap-1.5 bg-black p-1.5 lg:grid-cols-4">
                    {sourcedShown.map((s) => (
                      <PipelineCard
                        key={s.id}
                        href="/dealer/sourced"
                        image={heroFor(heroes, 'sourced', s.id)}
                        tag={`${s.make} ${s.model}`.toLowerCase()}
                        chip="SOURCED"
                        chipBorder="#444"
                        chipColor="#cfcfcf"
                        make={s.make}
                        title={s.model}
                        sub={s.client}
                      />
                    ))}
                  </div>
                </>
              )}

              {comingShown.length > 0 && (
                <>
                  <SectionHeader
                    label="Arriving"
                    note="On the way to the floor"
                    link={
                      <FirstLookLink
                        className="inline-flex items-center gap-[7px] text-[12px] tracking-[0.5px] text-white transition-[gap] duration-200 hover:gap-3"
                      >
                        Get first look
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
                          <path d="M4 12L12 4M12 4H5.2M12 4V10.8" stroke="#CC0000" strokeWidth="1.3" />
                        </svg>
                      </FirstLookLink>
                    }
                  />
                  <div className="grid grid-cols-2 gap-1.5 bg-black p-1.5 lg:grid-cols-4">
                    {comingShown.map((l) => (
                      <PipelineCard
                        key={l.id}
                        href="/contact"
                        image={heroFor(heroes, 'listing', l.id)}
                        tag={tagFor(l)}
                        chip={(l.eta ?? 'COMING SOON').toUpperCase()}
                        chipBorder="#444"
                        chipColor="#cfcfcf"
                        make={l.make}
                        title={l.model}
                        firstLook={{
                          vehicle: [l.year, l.make, l.model].filter(Boolean).join(' '),
                          campaign: l.slug,
                        }}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* —— CTA — clearly separated from the pipeline above —— */}
          <div data-reveal className="mt-20 flex flex-wrap border-t border-rb-line bg-[#101010] md:mt-28">
            <div className="relative min-h-[480px] min-w-[280px] flex-[1.05] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/keys-handoff.jpg"
                alt="Consign your car with Red Box Motors"
                className="absolute inset-0 h-full w-full object-cover"
                style={{ objectPosition: 'center 54%' }}
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(16,16,16,0)_55%,rgba(16,16,16,0.55)_82%,rgba(16,16,16,0.95)_100%)]" />
              <div className="absolute bottom-0 left-0 px-[30px] py-[26px]">
                <div className="font-mono text-[11px] uppercase tracking-[3px] text-[#cfcfcf]">
                  Buy · Sell · Consign · Nationwide
                </div>
              </div>
            </div>
            <div className="flex min-w-[300px] flex-1 flex-col justify-center px-6 py-20 md:px-16 md:py-[100px]">
              <div className="mb-[22px] font-mono text-[11px] uppercase tracking-[4px] text-rb-red">
                — Don&rsquo;t see it here?
              </div>
              <h2
                className="m-0 max-w-[14ch] font-extrabold text-white"
                style={{
                  fontSize: 'clamp(38px,5vw,72px)',
                  letterSpacing: '-0.04em',
                  lineHeight: 0.96,
                }}
              >
                The floor changes weekly.
              </h2>
              <p className="mb-0 mt-7 max-w-[500px] text-[17px] font-medium leading-[1.7] text-rb-tx-mute">
                Selling a car you care about? We professionally prepare, market and represent
                vehicles to qualified buyers nationwide — tell us about yours.
              </p>
              <div className="mt-11 flex flex-wrap items-center gap-[22px]">
                <Link
                  href="/dealer/sell"
                  className="rb-btn-red inline-flex items-center gap-3.5 bg-rb-red px-9 py-5 text-[15px] font-semibold tracking-[0.5px] text-white"
                >
                  Sell Your Vehicle
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path d="M4 12L12 4M12 4H5.2M12 4V10.8" stroke="#fff" strokeWidth="1.5" />
                  </svg>
                </Link>
              </div>
              <div className="mt-12 flex items-center gap-[11px] border-t border-rb-line pt-[26px]">
                <span className="inline-flex bg-rb-red px-2.5 py-[7px]">
                  <span className="text-[10px] font-extrabold tracking-[2px] text-white">RBM</span>
                </span>
                <span className="text-[11px] uppercase tracking-[2px] text-rb-tx-faint">
                  Red Box Motors · Sales &amp; Consignment · Austin, Texas
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-rb-line">
            <VisitAndFAQ division="dealer" faqs={INVENTORY_FAQ} />
          </div>
        </ExpandingScrollBox>
      </div>

      {/* —— Floating contact —— */}
      <ContactLink
        className="fixed bottom-[26px] right-[26px] z-40 flex items-center gap-[11px] border border-rb-border-2 bg-rb-surface px-[18px] py-[13px] transition-[border-color,background,transform,box-shadow] duration-[220ms] ease-rb hover:-translate-y-[3px] hover:border-rb-tx-faint-2 hover:bg-rb-raised hover:shadow-[0_14px_30px_rgba(0,0,0,0.55)] active:translate-y-0 active:scale-[0.98]"
      >
        <span className="h-[7px] w-[7px] flex-none bg-rb-red" />
        <span className="text-[12px] tracking-[1.5px] text-white">Contact</span>
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M4 12L12 4M12 4H5.2M12 4V10.8" stroke="#888" strokeWidth="1.3" />
        </svg>
      </ContactLink>
    </main>
    </FirstLookProvider>
  );
}
