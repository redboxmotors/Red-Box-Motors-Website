'use client';

import Link from 'next/link';
import { useState } from 'react';

// Inventory Mobile: horizontally scrollable brand chips (functional — filter
// the card list, count label updates), Price sort pill (toggles ↓/↑),
// full-width vehicle cards, then the Recently Sold rail (SOLD outline badge).

export type MVehicleCard = {
  id: string;
  href: string | null;
  brand: string;
  name: string;
  price: string | null;
  priceValue: number | null;
  meta: string;
  image: { url: string; position: string } | null;
  tag: string;
};

export function chipCls(active: boolean): { className: string; style: React.CSSProperties } {
  return {
    className:
      'flex min-h-[44px] flex-none items-center px-4 py-[13px] font-plex text-[10px] tracking-[0.18em] transition-colors duration-150',
    style: {
      border: `1px solid ${active ? '#FFFFFF' : 'rgba(255,255,255,0.15)'}`,
      color: active ? '#FFFFFF' : 'rgba(237,237,237,0.55)',
      background: active ? 'rgba(255,255,255,0.06)' : 'transparent',
    },
  };
}

function CardMedia({ card, height }: { card: MVehicleCard; height: number }) {
  return card.image ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={card.image.url}
      alt={`${card.brand} ${card.name}`}
      className="absolute inset-0 h-full w-full object-cover"
      style={{ objectPosition: card.image.position }}
      loading="lazy"
    />
  ) : (
    <div className="rb-stripe absolute inset-0 flex items-center justify-center" style={{ height }}>
      <span className="font-plex text-[10px] tracking-[1px] text-rb-tx-ghost">[ {card.tag} ]</span>
    </div>
  );
}

export function InventoryMobileList({
  vehicles,
  sold,
}: {
  vehicles: MVehicleCard[];
  sold: MVehicleCard[];
}) {
  const brands = ['ALL', ...Array.from(new Set(vehicles.map((v) => v.brand)))];
  const [filter, setFilter] = useState('ALL');
  const [priceDesc, setPriceDesc] = useState(true);

  const byBrand = (v: MVehicleCard) => filter === 'ALL' || v.brand === filter;
  const shown = vehicles
    .filter(byBrand)
    .sort((a, b) =>
      priceDesc
        ? (b.priceValue ?? -1) - (a.priceValue ?? -1)
        : (a.priceValue ?? Number.MAX_SAFE_INTEGER) - (b.priceValue ?? Number.MAX_SAFE_INTEGER),
    );
  const soldShown = sold.filter(byBrand);

  return (
    <>
      {/* —— Filters —— */}
      <section className="flex flex-col gap-3.5 pb-6">
        <div className="rb-noscrollbar flex gap-2 overflow-x-auto px-5 py-1">
          {brands.map((b) => {
            const c = chipCls(filter === b);
            return (
              <button
                key={b}
                type="button"
                aria-pressed={filter === b}
                onClick={() => setFilter(b)}
                className={c.className}
                style={c.style}
              >
                {b}
              </button>
            );
          })}
        </div>
        <div className="flex items-center justify-between px-5">
          <div className="font-plex text-[11px] tracking-[0.15em] text-[rgba(237,237,237,0.5)]">
            {shown.length} vehicle{shown.length === 1 ? '' : 's'}
          </div>
          <button
            type="button"
            onClick={() => setPriceDesc((d) => !d)}
            className="border border-white/[0.15] px-3.5 py-2.5 font-plex text-[11px] tracking-[0.1em] text-white"
            aria-label={`Sort by price, ${priceDesc ? 'descending' : 'ascending'}`}
          >
            Price {priceDesc ? '↓' : '↑'}
          </button>
        </div>
      </section>

      {/* —— Vehicle grid —— */}
      <section className="flex flex-col gap-4 px-5 pb-14">
        {shown.map((v) => (
          <Link
            key={v.id}
            href={v.href ?? '/dealer/inventory'}
            className="relative block border border-white/[0.06]"
          >
            <div className="relative h-[240px] w-full">
              <CardMedia card={v} height={240} />
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0) 30%, rgba(10,10,10,0) 50%, rgba(10,10,10,0.85) 100%)',
                }}
              />
              <div className="pointer-events-none absolute left-4 right-4 top-3.5 flex items-baseline justify-between gap-2.5">
                <div className="font-plex text-[10px] tracking-[0.25em] text-[rgba(237,237,237,0.7)]">
                  {v.brand}
                </div>
                <div className="font-plex text-[13px] text-white">{v.price}</div>
              </div>
              <div className="pointer-events-none absolute bottom-3.5 left-4 right-4 flex flex-col gap-1">
                <div className="text-[22px] font-bold tracking-[-0.01em] text-white">{v.name}</div>
                <div className="font-plex text-[11px] text-[rgba(237,237,237,0.65)]">{v.meta}</div>
              </div>
            </div>
          </Link>
        ))}
        {shown.length === 0 && (
          <div className="px-5 py-14 text-center">
            <div className="mb-1.5 text-[16px] text-rb-tx-mute-2">
              No vehicles match this filter.
            </div>
            <div className="text-[13px] text-rb-tx-faint-2">Try a different make.</div>
          </div>
        )}
      </section>

      {/* —— Recently sold —— */}
      {soldShown.length > 0 && (
        <section className="flex flex-col gap-5 border-t border-white/[0.06] px-5 pb-14 pt-11">
          <div className="flex flex-col gap-2">
            <h2 className="m-0 text-[34px] font-extrabold tracking-tight text-white" style={{ lineHeight: 1.04 }}>
              Recently sold
            </h2>
            <div className="text-[13px] text-[rgba(237,237,237,0.5)]">
              Placed with the right owners
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {soldShown.map((v) => (
              <div key={v.id} className="relative border border-white/[0.06]">
                <div className="relative h-[210px] w-full">
                  <CardMedia card={v} height={210} />
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(180deg, rgba(10,10,10,0.5) 0%, rgba(10,10,10,0.15) 35%, rgba(10,10,10,0.3) 60%, rgba(10,10,10,0.88) 100%)',
                    }}
                  />
                  <div className="pointer-events-none absolute left-4 right-4 top-3.5 flex items-baseline justify-between gap-2.5">
                    <div className="font-plex text-[10px] tracking-[0.25em] text-[rgba(237,237,237,0.55)]">
                      {v.brand}
                    </div>
                    <div className="border border-white/25 bg-[rgba(10,10,10,0.4)] px-2.5 py-[5px] font-plex text-[10px] tracking-[0.25em] text-[rgba(237,237,237,0.8)]">
                      SOLD
                    </div>
                  </div>
                  <div className="pointer-events-none absolute bottom-3.5 left-4 right-4 flex flex-col gap-1">
                    <div className="text-[21px] font-bold tracking-[-0.01em] text-white">
                      {v.name}
                    </div>
                    <div className="font-plex text-[11px] text-[rgba(237,237,237,0.6)]">{v.meta}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
