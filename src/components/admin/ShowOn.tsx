'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import type { ContentType, PlacementSurface } from '@/lib/db/types';
import { SURFACES, surfacesForType } from '@/lib/placements';
import { addPlacement, removePlacementBySurface } from '@/app/admin/(panel)/placements/actions';

// "Show on" checkboxes (admin-cms-build.md §3c): checking creates a placement
// row at the end of that slot; unchecking removes it. Ordering happens in the
// slot manager.
export function ShowOn({
  itemType,
  itemId,
  activeSurfaces,
}: {
  itemType: ContentType;
  itemId: string;
  activeSurfaces: PlacementSurface[];
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [active, setActive] = useState<Set<PlacementSurface>>(new Set(activeSurfaces));
  const eligible = surfacesForType(itemType);

  function toggle(surface: PlacementSurface, on: boolean) {
    setActive((s) => {
      const next = new Set(s);
      if (on) next.add(surface);
      else next.delete(surface);
      return next;
    });
    startTransition(async () => {
      if (on) await addPlacement(surface, itemType, itemId);
      else await removePlacementBySurface(surface, itemType, itemId);
      router.refresh();
    });
  }

  return (
    <div className="border border-rb-line bg-rb-surface p-5">
      <p className="mb-1 text-[13px] font-semibold text-rb-tx">Show on</p>
      <p className="mb-4 text-[11px] font-medium text-rb-tx-faint">
        Checked slots include this item; new items land at the end — arrange order in the{' '}
        <Link href="/admin/placements" className="underline underline-offset-2 hover:text-rb-tx">
          slot managers
        </Link>
        . Unpublishing removes it from every slot.
      </p>
      <div className="space-y-2.5">
        {eligible.map((surface) => (
          <label key={surface} className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={active.has(surface)}
              onChange={(e) => toggle(surface, e.target.checked)}
              className="h-4 w-4 appearance-none border border-rb-border bg-rb-surface-3 transition-colors checked:border-rb-red checked:bg-rb-red focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-rb-red"
            />
            <span className="text-[13px] font-medium text-rb-tx-2">{SURFACES[surface].label}</span>
            <span className="rb-mono-caption hidden md:inline">{SURFACES[surface].rendersOn}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
