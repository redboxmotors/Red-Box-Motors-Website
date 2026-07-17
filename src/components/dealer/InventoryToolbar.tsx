'use client';

import { usePathname, useRouter } from 'next/navigation';

// Inventory filter + sort bar (Dealer Inventory.dc.html toolbar). Functional:
// make chips (derived from the data) + price/year/miles sort + live count.
// Production version drives the state from URL query params so filtered views
// are shareable (?make=porsche&sort=price-desc) — the server page reads
// searchParams, filters/sorts, and this bar just updates the URL.

import { DEFAULT_SORT, makeParam, type SortKey } from './inventory-params';

export { DEFAULT_SORT, makeParam, type SortKey };

const SORT_DEFS: { key: SortKey; label: string }[] = [
  { key: 'price-desc', label: 'Price ↓' },
  { key: 'price-asc', label: 'Price ↑' },
  { key: 'year-desc', label: 'Year' },
  { key: 'miles-asc', label: 'Miles' },
];

export function InventoryToolbar({
  makes,
  activeMake,
  sortKey,
  countLabel,
}: {
  makes: string[];
  activeMake: string; // 'All' or a make from the data
  sortKey: SortKey;
  countLabel: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const apply = (make: string, sort: SortKey) => {
    const p = new URLSearchParams();
    if (make !== 'All') p.set('make', makeParam(make));
    if (sort !== DEFAULT_SORT) p.set('sort', sort);
    const qs = p.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 px-3 pb-5 pt-6 md:gap-5 md:px-12 md:pt-7">
      <div className="rb-noscrollbar flex min-w-0 items-center gap-2 overflow-x-auto">
        {['All', ...makes].map((m) => {
          const active = activeMake === m;
          return (
            <button
              key={m}
              type="button"
              aria-pressed={active}
              onClick={() => apply(m, sortKey)}
              className={`min-h-[44px] flex-none cursor-pointer whitespace-nowrap border px-3.5 py-2 text-[11px] uppercase tracking-[1.5px] transition-colors duration-150 active:scale-[0.96] ${
                active
                  ? 'border-white bg-rb-raised-3 text-white'
                  : 'border-[#1f1f1f] bg-transparent text-rb-tx-mute-2'
              }`}
            >
              {m}
            </button>
          );
        })}
      </div>
      <div className="flex flex-none items-center gap-[18px]">
        <span aria-live="polite" className="font-mono text-[11px] tracking-[1px] text-rb-tx-faint-2">
          {countLabel}
        </span>
        <div className="flex border border-[#1f1f1f]">
          {SORT_DEFS.map((s, i) => {
            const active = sortKey === s.key;
            return (
              <button
                key={s.key}
                type="button"
                aria-pressed={active}
                onClick={() => apply(activeMake, s.key)}
                className={`cursor-pointer whitespace-nowrap px-3.5 py-2 text-[11px] tracking-[0.5px] transition-colors duration-150 active:scale-[0.97] ${
                  i === 0 ? '' : 'border-l border-rb-line'
                } ${active ? 'bg-[#181818] text-white' : 'bg-transparent text-rb-tx-mute-3'}`}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
