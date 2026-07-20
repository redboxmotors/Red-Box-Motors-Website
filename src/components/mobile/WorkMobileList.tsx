'use client';

import Link from 'next/link';
import { useState } from 'react';
import { chipCls } from './InventoryMobileList';

// Recent Work Mobile: category chips (functional) + count + Year↓/A–Z sort
// pills + full-width project cards (outline tag chip top-left, kicker +
// name bottom-left).

export type MProjectCard = {
  id: string;
  href: string;
  tag: string;
  kicker: string;
  name: string;
  year: number | null;
  image: { url: string; position: string } | null;
  stripeTag: string;
};

type SortKey = 'year-desc' | 'name';

export function WorkMobileList({ projects }: { projects: MProjectCard[] }) {
  const cats = ['ALL', ...Array.from(new Set(projects.map((p) => p.tag)))];
  const [filter, setFilter] = useState('ALL');
  const [sortKey, setSortKey] = useState<SortKey>('year-desc');

  const shown = projects
    .filter((p) => filter === 'ALL' || p.tag === filter)
    .sort((a, b) =>
      sortKey === 'year-desc' ? (b.year ?? 0) - (a.year ?? 0) : a.name.localeCompare(b.name),
    );

  const sortPill = (key: SortKey, label: string) => {
    const active = sortKey === key;
    return (
      <button
        key={key}
        type="button"
        aria-pressed={active}
        onClick={() => setSortKey(key)}
        className="px-3 py-[9px] font-plex text-[10px] tracking-[0.1em]"
        style={{
          border: `1px solid ${active ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.08)'}`,
          color: active ? '#FFFFFF' : 'rgba(237,237,237,0.45)',
        }}
      >
        {label}
      </button>
    );
  };

  return (
    <section className="flex flex-col gap-3.5 pb-14">
      <div className="rb-noscrollbar flex gap-2 overflow-x-auto px-5 py-1">
        {cats.map((c) => {
          const s = chipCls(filter === c);
          return (
            <button
              key={c}
              type="button"
              aria-pressed={filter === c}
              onClick={() => setFilter(c)}
              className={s.className}
              style={s.style}
            >
              {c}
            </button>
          );
        })}
      </div>
      <div className="flex items-center justify-between px-5">
        <div className="font-plex text-[11px] tracking-[0.15em] text-[rgba(237,237,237,0.5)]">
          {shown.length} project{shown.length === 1 ? '' : 's'}
        </div>
        <div className="flex gap-2">
          {sortPill('year-desc', 'Year ↓')}
          {sortPill('name', 'A–Z')}
        </div>
      </div>
      <div className="flex flex-col gap-4 px-5 pt-1">
        {shown.map((p) => (
          <Link key={p.id} href={p.href} className="relative block border border-white/[0.06]">
            <div className="relative h-[250px] w-full">
              {p.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.image.url}
                  alt={p.name}
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ objectPosition: p.image.position }}
                  loading="lazy"
                />
              ) : (
                <div className="rb-stripe absolute inset-0 flex items-center justify-center">
                  <span className="font-plex text-[10px] tracking-[1px] text-rb-tx-ghost">
                    [ {p.stripeTag} ]
                  </span>
                </div>
              )}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(10,10,10,0.35) 0%, rgba(10,10,10,0) 32%, rgba(10,10,10,0.85) 100%)',
                }}
              />
              <div className="pointer-events-none absolute left-4 top-3.5 border border-white/30 bg-[rgba(10,10,10,0.45)] px-2.5 py-1.5 font-plex text-[9px] tracking-[0.25em] text-[rgba(237,237,237,0.85)]">
                {p.tag}
              </div>
              <div className="pointer-events-none absolute right-4 top-3.5 text-[15px] text-white" aria-hidden>
                ↗
              </div>
              <div className="pointer-events-none absolute bottom-3.5 left-4 right-4 flex flex-col gap-1">
                <div className="font-plex text-[9px] tracking-[0.25em] text-[rgba(237,237,237,0.6)]">
                  {p.kicker}
                </div>
                <div className="text-[22px] font-bold tracking-[-0.01em] text-white">{p.name}</div>
              </div>
            </div>
          </Link>
        ))}
        {shown.length === 0 && (
          <div className="py-14 text-center">
            <div className="mb-1.5 text-[16px] text-rb-tx-mute-2">
              No projects match this filter.
            </div>
            <div className="text-[13px] text-rb-tx-faint-2">Try a different service.</div>
          </div>
        )}
      </div>
    </section>
  );
}
