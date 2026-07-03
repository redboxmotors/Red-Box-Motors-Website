'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useOptimistic, useTransition } from 'react';
import type { DbImage, Sourced } from '@/lib/db/types';
import {
  deleteSourced,
  duplicateSourced,
  reorderSourced,
  setSourcedFlags,
} from '@/app/admin/(panel)/sourced/actions';
import { SortableList } from './SortableList';
import { ConfirmButton, FeaturedStar, Toggle } from './ui';

export function SourcedManager({
  sourced,
  heroes,
}: {
  sourced: Sourced[];
  heroes: Record<string, DbImage>;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [rows, applyLocal] = useOptimistic(
    sourced,
    (state, update: (s: Sourced[]) => Sourced[]) => update(state),
  );

  function mutate(fn: () => Promise<unknown>, local: (s: Sourced[]) => Sourced[]) {
    startTransition(async () => {
      applyLocal(local);
      await fn();
      router.refresh();
    });
  }

  const items = [...rows].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-[30px] font-semibold tracking-tight text-rb-tx">Sourced</h1>
          <p className="mt-1 text-[13px] font-medium text-rb-tx-faint">
            Cars found for clients — proof of sourcing, not for sale.
          </p>
        </div>
        <Link
          href="/admin/sourced/new"
          className="rb-btn-red bg-rb-red px-5 py-3 text-[11px] font-bold uppercase tracking-label text-white"
        >
          ＋ New sourced car
        </Link>
      </div>

      {items.length ? (
        <SortableList
          items={items}
          disabled={pending}
          onReorder={(ids) =>
            mutate(
              () => reorderSourced(ids),
              (ss) =>
                ss.map((s) => {
                  const i = ids.indexOf(s.id);
                  return i === -1 ? s : { ...s, sort_order: i };
                }),
            )
          }
          renderRow={(s, handle) => (
            <div className="flex items-center gap-3 px-3 py-2.5">
              {handle}
              <div className="h-10 w-16 shrink-0 overflow-hidden bg-rb-surface-3">
                {heroes[s.id] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={heroes[s.id].thumb_url ?? heroes[s.id].url}
                    alt=""
                    className="h-full w-full object-cover"
                    style={{
                      objectPosition: `${heroes[s.id].focal_x * 100}% ${heroes[s.id].focal_y * 100}%`,
                    }}
                  />
                ) : (
                  <div className="rb-stripe h-full w-full" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/admin/sourced/${s.id}`}
                  className="block truncate text-[14px] font-semibold text-rb-tx hover:text-rb-tx-2"
                >
                  {s.year} {s.make} {s.model}
                </Link>
                <p className="truncate text-[11px] font-medium text-rb-tx-faint">
                  {[s.spec, s.client].filter(Boolean).join(' · ')}
                </p>
              </div>
              <FeaturedStar
                featured={s.featured}
                onChange={(v) =>
                  mutate(
                    () => setSourcedFlags(s.id, { featured: v }),
                    (ss) => ss.map((x) => (x.id === s.id ? { ...x, featured: v } : x)),
                  )
                }
              />
              <Toggle
                checked={s.published}
                onChange={(v) =>
                  mutate(
                    () => setSourcedFlags(s.id, { published: v }),
                    (ss) => ss.map((x) => (x.id === s.id ? { ...x, published: v } : x)),
                  )
                }
                label={`Publish ${s.make} ${s.model}`}
              />
              <div className="flex items-center gap-1 pl-2">
                <Link
                  href={`/admin/sourced/${s.id}`}
                  className="px-2 py-1 text-[10px] font-bold uppercase tracking-label text-rb-tx-faint transition-colors hover:text-rb-tx"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() =>
                    startTransition(async () => {
                      const newId = await duplicateSourced(s.id);
                      if (newId) router.push(`/admin/sourced/${newId}`);
                    })
                  }
                  className="px-2 py-1 text-[10px] font-bold uppercase tracking-label text-rb-tx-faint transition-colors hover:text-rb-tx"
                >
                  Duplicate
                </button>
                <ConfirmButton
                  onConfirm={() =>
                    mutate(
                      () => deleteSourced(s.id),
                      (ss) => ss.filter((x) => x.id !== s.id),
                    )
                  }
                  className="px-2 py-1 text-[10px] font-bold uppercase tracking-label text-rb-tx-faint transition-colors hover:text-rb-red"
                >
                  Delete
                </ConfirmButton>
              </div>
            </div>
          )}
        />
      ) : (
        <div className="border border-rb-line bg-rb-surface p-12 text-center">
          <p className="text-[14px] font-medium text-rb-tx-faint">No sourced cars yet.</p>
        </div>
      )}
    </div>
  );
}
