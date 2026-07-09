'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useOptimistic, useTransition } from 'react';
import type { DbImage, Listing, ListingStatus } from '@/lib/db/types';
import { formatMileage, formatPrice, listingTitle } from '@/lib/db/types';
import {
  deleteListing,
  duplicateListing,
  reorderListings,
  setListingFlags,
} from '@/app/admin/(panel)/listings/actions';
import { SortableList } from './SortableList';
import { ConfirmButton, FeaturedStar, StatusPill, Toggle } from './ui';

const GROUPS: { status: ListingStatus; title: string }[] = [
  { status: 'for_sale', title: 'For sale' },
  { status: 'coming_soon', title: 'Coming soon' },
  { status: 'sold', title: 'Sold' },
];

export function ListingsManager({
  listings,
  heroes,
}: {
  listings: Listing[];
  heroes: Record<string, DbImage>;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [rows, applyLocal] = useOptimistic(
    listings,
    (state, update: (l: Listing[]) => Listing[]) => update(state),
  );

  const q = (params.get('q') ?? '').toLowerCase();
  const statusFilter = params.get('status') as ListingStatus | null;

  const filtered = useMemo(
    () =>
      rows.filter(
        (l) =>
          (!q ||
            `${l.year ?? ''} ${l.make} ${l.model} ${l.slug}`.toLowerCase().includes(q)) &&
          (!statusFilter || l.status === statusFilter),
      ),
    [rows, q, statusFilter],
  );

  function setParam(key: string, value: string | null) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.replace(`/admin/listings?${next.toString()}`);
  }

  function mutate(fn: () => Promise<unknown>, local: (l: Listing[]) => Listing[]) {
    startTransition(async () => {
      applyLocal(local);
      await fn();
      router.refresh();
    });
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-[30px] font-semibold tracking-tight text-rb-tx">Listings</h1>
        <Link
          href="/admin/listings/new"
          className="rb-btn-red bg-rb-red px-5 py-3 text-[11px] font-bold uppercase tracking-label text-white"
        >
          ＋ New listing
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <input
          type="search"
          defaultValue={q}
          onChange={(e) => setParam('q', e.target.value || null)}
          placeholder="Search make, model, slug…"
          aria-label="Search listings"
          className="w-64 border border-rb-line bg-rb-surface-3 px-3 py-2 text-[13px] font-medium text-rb-tx outline-none placeholder:text-rb-tx-faint-2 focus:border-rb-red"
        />
        <div className="flex gap-1.5">
          <FilterChip label="All" active={!statusFilter} onClick={() => setParam('status', null)} />
          {GROUPS.map((g) => (
            <FilterChip
              key={g.status}
              label={g.title}
              active={statusFilter === g.status}
              onClick={() => setParam('status', g.status)}
            />
          ))}
        </div>
      </div>

      {GROUPS.filter((g) => !statusFilter || g.status === statusFilter).map((group) => {
        const items = filtered
          .filter((l) => l.status === group.status)
          .sort((a, b) => a.sort_order - b.sort_order);
        if (!items.length) return null;
        return (
          <section key={group.status} className="mb-10">
            <h2 className="rb-label mb-3">
              {group.title} <span className="text-rb-tx-ghost">· {items.length}</span>
            </h2>
            <SortableList
              items={items}
              disabled={pending || !!q}
              onReorder={(ids) =>
                mutate(
                  () => reorderListings(ids),
                  (ls) =>
                    ls.map((l) => {
                      const i = ids.indexOf(l.id);
                      return i === -1 ? l : { ...l, sort_order: i };
                    }),
                )
              }
              renderRow={(l, handle) => (
                <Row
                  listing={l}
                  hero={heroes[l.id]}
                  handle={handle}
                  onPublished={(v) =>
                    mutate(
                      () => setListingFlags(l.id, { published: v }),
                      (ls) => ls.map((x) => (x.id === l.id ? { ...x, published: v } : x)),
                    )
                  }
                  onFeatured={(v) =>
                    mutate(
                      () => setListingFlags(l.id, { featured: v }),
                      (ls) => ls.map((x) => (x.id === l.id ? { ...x, featured: v } : x)),
                    )
                  }
                  onDelete={() =>
                    mutate(
                      () => deleteListing(l.id),
                      (ls) => ls.filter((x) => x.id !== l.id),
                    )
                  }
                  onDuplicate={() =>
                    startTransition(async () => {
                      const newId = await duplicateListing(l.id);
                      if (newId) router.push(`/admin/listings/${newId}`);
                    })
                  }
                />
              )}
            />
          </section>
        );
      })}

      {!filtered.length && (
        <div className="border border-rb-line bg-rb-surface p-12 text-center">
          <p className="text-[14px] font-medium text-rb-tx-faint">
            {q || statusFilter ? 'Nothing matches that filter.' : 'No listings yet.'}
          </p>
        </div>
      )}
    </div>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`border px-3 py-2 text-[10px] font-bold uppercase tracking-label transition-colors ${
        active
          ? 'border-rb-red text-rb-tx'
          : 'border-rb-line text-rb-tx-faint hover:border-rb-border-2 hover:text-rb-tx-mute'
      }`}
    >
      {label}
    </button>
  );
}

function Row({
  listing: l,
  hero,
  handle,
  onPublished,
  onFeatured,
  onDelete,
  onDuplicate,
}: {
  listing: Listing;
  hero?: DbImage;
  handle: React.ReactNode;
  onPublished: (v: boolean) => void;
  onFeatured: (v: boolean) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}) {
  return (
    <div className="flex items-center gap-3 px-3 py-2.5">
      {handle}

      {/* hero thumb or stripe placeholder */}
      <div className="aspect-video h-10 w-auto shrink-0 overflow-hidden bg-rb-surface-3">
        {hero ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={hero.thumb_url ?? hero.url}
            alt=""
            className="h-full w-full object-cover"
            style={{ objectPosition: `${hero.focal_x * 100}% ${hero.focal_y * 100}%` }}
          />
        ) : (
          <div className="rb-stripe h-full w-full" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <Link
          href={`/admin/listings/${l.id}`}
          className="block truncate text-[14px] font-semibold text-rb-tx hover:text-rb-tx-2"
        >
          {listingTitle(l)}
        </Link>
        <p className="truncate text-[11px] font-medium text-rb-tx-faint">
          {[formatPrice(l.price), formatMileage(l.mileage), l.eta].filter(Boolean).join(' · ') || l.slug}
        </p>
      </div>

      <StatusPill status={l.status} />
      <FeaturedStar featured={l.featured} onChange={onFeatured} />
      <div className="flex items-center gap-2">
        <span className="rb-label hidden text-[9px] lg:inline">Live</span>
        <Toggle checked={l.published} onChange={onPublished} label={`Publish ${listingTitle(l)}`} />
      </div>

      <div className="flex items-center gap-1 pl-2">
        <Link
          href={`/admin/listings/${l.id}`}
          className="px-2 py-1 text-[10px] font-bold uppercase tracking-label text-rb-tx-faint transition-colors hover:text-rb-tx"
        >
          Edit
        </Link>
        <button
          type="button"
          onClick={onDuplicate}
          className="px-2 py-1 text-[10px] font-bold uppercase tracking-label text-rb-tx-faint transition-colors hover:text-rb-tx"
        >
          Duplicate
        </button>
        <ConfirmButton
          onConfirm={onDelete}
          className="px-2 py-1 text-[10px] font-bold uppercase tracking-label text-rb-tx-faint transition-colors hover:text-rb-red"
        >
          Delete
        </ConfirmButton>
      </div>
    </div>
  );
}
