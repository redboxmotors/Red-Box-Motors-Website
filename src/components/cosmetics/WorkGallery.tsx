'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { DbImage } from '@/lib/db/types';
import { focalPosition } from '@/lib/public/cards';

// Recent Work roster (Recent Work.dc.html): category chips + sort toggle +
// 3-across project grid. Tiles lift/brighten on hover, reveal a spec line +
// VIEW arrow and sweep a red bar in from the left.

export type WorkItem = {
  id: string;
  slug: string;
  title: string;
  vehicle: string;
  category: string;
  year: number | null;
  tag: string;
  metaLine: string;
  specLine: string;
  image: DbImage | null;
};

type SortKey = 'year-desc' | 'year-asc' | 'name';

const SORTS: { key: SortKey; label: string }[] = [
  { key: 'year-desc', label: 'Year ↓' },
  { key: 'year-asc', label: 'Year ↑' },
  { key: 'name', label: 'A–Z' },
];

const SORTERS: Record<SortKey, (a: WorkItem, b: WorkItem) => number> = {
  'year-desc': (a, b) => (b.year ?? 0) - (a.year ?? 0),
  'year-asc': (a, b) => (a.year ?? 0) - (b.year ?? 0),
  name: (a, b) => a.title.localeCompare(b.title),
};

function chipStyle(active: boolean): React.CSSProperties {
  return {
    flex: 'none',
    padding: '8px 14px',
    fontSize: '11px',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    border: '1px solid',
    borderColor: active ? '#fff' : '#1f1f1f',
    color: active ? '#fff' : '#888',
    background: active ? '#161616' : 'transparent',
    transition: 'border-color 150ms ease, color 150ms ease, background 150ms ease',
  };
}

function sortStyle(active: boolean, first: boolean): React.CSSProperties {
  return {
    padding: '8px 14px',
    fontSize: '11px',
    letterSpacing: '0.5px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    borderLeft: first ? 'none' : '1px solid #1a1a1a',
    color: active ? '#fff' : '#777',
    background: active ? '#181818' : 'transparent',
    transition: 'background 150ms ease, color 150ms ease',
  };
}

export function WorkGallery({ items }: { items: WorkItem[] }) {
  const [catFilter, setCatFilter] = useState('All');
  const [sortKey, setSortKey] = useState<SortKey>('year-desc');

  const cats = ['All', ...Array.from(new Set(items.map((p) => p.category)))];
  const filtered = items
    .filter((p) => catFilter === 'All' || p.category === catFilter)
    .sort(SORTERS[sortKey]);

  const countLabel =
    catFilter === 'All'
      ? `${items.length} projects`
      : `${filtered.length} of ${items.length} projects`;

  return (
    <>
      {/* TOOLBAR */}
      <div className="flex flex-wrap items-center justify-between gap-5 px-6 pb-5 pt-7 md:px-12">
        <div className="rb-noscrollbar flex min-w-0 items-center gap-2 overflow-x-auto">
          {cats.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCatFilter(c)}
              className="active:scale-[0.96]"
              style={chipStyle(catFilter === c)}
              aria-pressed={catFilter === c}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex flex-none items-center gap-[18px]">
          <span className="font-mono text-[11px] tracking-[1px] text-rb-tx-faint-2">{countLabel}</span>
          <div className="flex border border-[#1f1f1f]">
            {SORTS.map((s, i) => (
              <button
                key={s.key}
                type="button"
                onClick={() => setSortKey(s.key)}
                className="active:scale-[0.97]"
                style={sortStyle(sortKey === s.key, i === 0)}
                aria-pressed={sortKey === s.key}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ROSTER GRID */}
      {filtered.length > 0 && (
        <div className="mx-6 grid grid-cols-1 gap-1.5 bg-black p-1.5 md:mx-12 md:grid-cols-3">
          {filtered.map((p) => (
            <Link
              key={p.id}
              href={`/cosmetics/work/${p.slug}`}
              className="group relative z-[1] block h-[330px] cursor-pointer overflow-hidden hover:z-[6] hover:-translate-y-[5px] hover:scale-[1.015] hover:brightness-[1.14] hover:shadow-[0_24px_50px_rgba(0,0,0,0.62)] active:translate-y-0 active:scale-[0.992] motion-reduce:transform-none motion-reduce:transition-none [transition:filter_240ms_ease,transform_260ms_cubic-bezier(.2,.8,.2,1),box-shadow_260ms_cubic-bezier(.2,.8,.2,1)]"
              style={{ background: 'linear-gradient(165deg,#131313 0%,#0D0D0D 55%,#090909 100%)' }}
            >
              {p.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.image.url}
                  alt={p.image.alt || `${p.title} — ${p.vehicle}`}
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ objectPosition: focalPosition(p.image) }}
                  loading="lazy"
                />
              ) : (
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(135deg,#171717 0,#171717 11px,#101010 11px,#101010 22px)',
                  }}
                >
                  <span className="font-mono text-[11px] tracking-[1px] text-[#383838]">
                    [ {p.tag} ]
                  </span>
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 h-[62%] bg-[linear-gradient(transparent,rgba(0,0,0,0.55)_45%,rgba(0,0,0,0.92))]" />
              <div className="absolute left-[22px] top-[18px] border border-[#2e2e2e] bg-black/35 px-[9px] py-[5px]">
                <span className="font-mono text-[9px] uppercase tracking-[2px] text-[#cfcfcf]">
                  {p.category}
                </span>
              </div>
              {p.year != null && (
                <div className="absolute right-[22px] top-[18px] font-mono text-[13px] tracking-[0.5px] text-white">
                  {p.year}
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 px-[22px] pb-5 pt-[18px]">
                <div className="mb-1.5 text-[10px] uppercase tracking-[2px] text-rb-tx-mute-2">
                  {p.vehicle}
                </div>
                <div className="overflow-hidden text-ellipsis whitespace-nowrap text-[22px] font-semibold leading-[1.1] tracking-[-0.015em] text-white">
                  {p.title}
                </div>
                <div className="mt-2 font-mono text-[11px] tracking-[0.5px] text-[#8a8a8a]">
                  {p.metaLine}
                </div>
                <div className="mt-0 flex max-h-0 items-center justify-between gap-[14px] overflow-hidden opacity-0 group-hover:mt-[10px] group-hover:max-h-[26px] group-hover:opacity-100 [transition:max-height_220ms_cubic-bezier(.2,.8,.2,1),opacity_200ms_ease,margin-top_220ms_cubic-bezier(.2,.8,.2,1)]">
                  <span className="font-mono text-[11px] tracking-[0.5px] text-[#bbb]">{p.specLine}</span>
                  <span className="inline-flex items-center gap-1.5 text-[11px] tracking-[1.5px] text-white">
                    VIEW
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <path d="M4 12L12 4M12 4H5.2M12 4V10.8" stroke="#CC0000" strokeWidth="1.4" />
                    </svg>
                  </span>
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-rb-red group-hover:scale-x-100 [transition:transform_300ms_cubic-bezier(.2,.8,.2,1)]" />
            </Link>
          ))}
        </div>
      )}
      {items.length > 0 && filtered.length === 0 && (
        <div className="mx-6 bg-black px-6 py-[60px] text-center md:mx-12">
          <div className="mb-1.5 text-[16px] tracking-[0.3px] text-rb-tx-mute-2">
            No projects match this filter.
          </div>
          <div className="text-[13px] text-rb-tx-faint-2">Try a different service.</div>
        </div>
      )}
    </>
  );
}
