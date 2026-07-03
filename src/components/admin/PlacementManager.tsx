'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState, useTransition } from 'react';
import type { ContentType, Placement, PlacementSurface } from '@/lib/db/types';
import {
  addPlacement,
  removePlacement,
  reorderPlacements,
  togglePlacement,
} from '@/app/admin/(panel)/placements/actions';
import { SortableList } from './SortableList';
import { Toggle } from './ui';

export type PlacementCard = {
  itemId: string;
  itemType: ContentType;
  title: string;
  subtitle: string;
  thumb: string | null;
};

const TYPE_LABEL: Record<ContentType, string> = {
  listing: 'Car',
  project: 'Project',
  sourced: 'Sourced',
};

export function PlacementManager({
  surface,
  label,
  rendersOn,
  fallback,
  current,
  candidates,
}: {
  surface: PlacementSurface;
  label: string;
  rendersOn: string;
  fallback: string;
  current: { placement: Placement; card: PlacementCard }[];
  candidates: PlacementCard[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [rows, setRows] = useState(current);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [q, setQ] = useState('');

  const filteredCandidates = useMemo(
    () =>
      candidates.filter(
        (c) => !q || `${c.title} ${c.subtitle}`.toLowerCase().includes(q.toLowerCase()),
      ),
    [candidates, q],
  );

  const items = rows.map((r) => ({ id: r.placement.id, ...r }));

  return (
    <div className="max-w-3xl">
      <Link href="/admin/placements" className="rb-label text-rb-tx-faint hover:text-rb-tx">
        ← Placements
      </Link>
      <h1 className="mb-1 mt-1 text-[30px] font-semibold tracking-tight text-rb-tx">{label}</h1>
      <p className="mb-8 text-[13px] font-medium text-rb-tx-faint">{rendersOn}</p>

      {items.length ? (
        <SortableList
          items={items}
          disabled={pending}
          onReorder={(ids) => {
            setRows((rs) => ids.map((id) => rs.find((r) => r.placement.id === id)!));
            startTransition(async () => {
              await reorderPlacements(ids);
              router.refresh();
            });
          }}
          renderRow={(item, handle) => (
            <div className="flex items-center gap-3 px-3 py-2.5">
              {handle}
              <div className="h-10 w-16 shrink-0 overflow-hidden bg-rb-surface-3">
                {item.card.thumb ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.card.thumb} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="rb-stripe h-full w-full" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-semibold text-rb-tx">{item.card.title}</p>
                <p className="truncate text-[11px] font-medium text-rb-tx-faint">{item.card.subtitle}</p>
              </div>
              <span className="border border-rb-line px-2 py-1 text-[9px] font-bold uppercase tracking-label text-rb-tx-faint">
                {TYPE_LABEL[item.card.itemType]}
              </span>
              <Toggle
                checked={item.placement.enabled}
                onChange={(v) => {
                  setRows((rs) =>
                    rs.map((r) =>
                      r.placement.id === item.placement.id
                        ? { ...r, placement: { ...r.placement, enabled: v } }
                        : r,
                    ),
                  );
                  startTransition(async () => {
                    await togglePlacement(item.placement.id, v);
                    router.refresh();
                  });
                }}
                label={`Enable ${item.card.title}`}
              />
              <button
                type="button"
                onClick={() => {
                  setRows((rs) => rs.filter((r) => r.placement.id !== item.placement.id));
                  startTransition(async () => {
                    await removePlacement(item.placement.id);
                    router.refresh();
                  });
                }}
                className="px-2 py-1 text-[10px] font-bold uppercase tracking-label text-rb-tx-faint transition-colors hover:text-rb-red"
              >
                Remove
              </button>
            </div>
          )}
        />
      ) : (
        <div className="border border-rb-line bg-rb-surface p-10 text-center">
          <p className="mb-1 text-[14px] font-semibold text-rb-tx-2">This slot is on auto</p>
          <p className="text-[12px] font-medium text-rb-tx-faint">
            Nothing curated yet — the site shows: {fallback}. Add items below to take control.
          </p>
        </div>
      )}

      <div className="mt-6">
        {!pickerOpen ? (
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="rb-btn border border-rb-border px-5 py-3 text-[11px] font-bold uppercase tracking-label text-rb-tx hover:bg-rb-raised-3"
          >
            ＋ Add to this slot
          </button>
        ) : (
          <div className="border border-rb-line bg-rb-surface p-4">
            <div className="mb-3 flex items-center gap-3">
              <input
                autoFocus
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search eligible items…"
                aria-label="Search eligible items"
                className="w-full border border-rb-line bg-rb-surface-3 px-3 py-2 text-[13px] font-medium text-rb-tx outline-none placeholder:text-rb-tx-faint-2 focus:border-rb-red"
              />
              <button
                type="button"
                onClick={() => setPickerOpen(false)}
                className="rb-label shrink-0 text-rb-tx-faint hover:text-rb-tx"
              >
                Close
              </button>
            </div>
            {filteredCandidates.length ? (
              <ul className="max-h-72 divide-y divide-rb-line overflow-y-auto border border-rb-line">
                {filteredCandidates.map((c) => (
                  <li key={`${c.itemType}:${c.itemId}`}>
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() =>
                        startTransition(async () => {
                          await addPlacement(surface, c.itemType, c.itemId);
                          router.refresh();
                          // append locally so it shows immediately
                          setRows((rs) => [
                            ...rs,
                            {
                              placement: {
                                id: `optimistic-${c.itemId}`,
                                surface,
                                item_type: c.itemType,
                                item_id: c.itemId,
                                sort_order: rs.length,
                                enabled: true,
                                created_at: '',
                              },
                              card: c,
                            },
                          ]);
                        })
                      }
                      className="flex w-full items-center gap-3 bg-rb-surface-3 px-3 py-2 text-left transition-colors hover:bg-rb-raised disabled:opacity-50"
                    >
                      <div className="h-8 w-12 shrink-0 overflow-hidden bg-rb-surface">
                        {c.thumb ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={c.thumb} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="rb-stripe h-full w-full" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-semibold text-rb-tx">{c.title}</p>
                        <p className="truncate text-[11px] font-medium text-rb-tx-faint">{c.subtitle}</p>
                      </div>
                      <span className="border border-rb-line px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-label text-rb-tx-faint">
                        {TYPE_LABEL[c.itemType]}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-6 text-center text-[12px] font-medium text-rb-tx-faint-2">
                {q ? 'No matches.' : 'Everything eligible is already in this slot.'}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
