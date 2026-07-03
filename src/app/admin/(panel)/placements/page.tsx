import Link from 'next/link';
import { createSessionClient } from '@/lib/supabase/server';
import { SURFACES, SURFACE_KEYS } from '@/lib/placements';
import type { Placement } from '@/lib/db/types';

export const dynamic = 'force-dynamic';

export default async function PlacementsIndexPage() {
  const supabase = createSessionClient();
  const { data } = await supabase.from('placements').select('*');
  const placements = (data ?? []) as Placement[];

  return (
    <div className="max-w-3xl">
      <h1 className="mb-2 text-[30px] font-semibold tracking-tight text-rb-tx">Placements</h1>
      <p className="mb-8 text-[13px] font-medium text-rb-tx-faint">
        Choose exactly which cars and projects appear in each marquee and preview — and in what
        order. Empty slots fall back to an automatic pick so the site is never blank.
      </p>

      <ul className="divide-y divide-rb-line border border-rb-line">
        {SURFACE_KEYS.map((key) => {
          const slot = SURFACES[key];
          const count = placements.filter((p) => p.surface === key).length;
          return (
            <li key={key}>
              <Link
                href={`/admin/placements/${key}`}
                className="flex items-center gap-4 bg-rb-surface px-5 py-4 transition-colors hover:bg-rb-raised"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-semibold text-rb-tx">{slot.label}</p>
                  <p className="truncate text-[11px] font-medium text-rb-tx-faint">{slot.rendersOn}</p>
                </div>
                <span
                  className={`border px-2 py-1 text-[10px] font-bold uppercase tracking-label ${
                    count ? 'border-rb-border-2 text-rb-tx-2' : 'border-rb-line text-rb-tx-faint-2'
                  }`}
                >
                  {count ? `${count} curated` : 'Auto'}
                </span>
                <span aria-hidden className="text-rb-tx-ghost">
                  →
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
