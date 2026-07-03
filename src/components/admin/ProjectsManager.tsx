'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useOptimistic, useTransition } from 'react';
import type { DbImage, Project } from '@/lib/db/types';
import {
  deleteProject,
  duplicateProject,
  reorderProjects,
  setProjectFlags,
} from '@/app/admin/(panel)/projects/actions';
import { SortableList } from './SortableList';
import { ConfirmButton, FeaturedStar, Toggle } from './ui';

export function ProjectsManager({
  projects,
  heroes,
}: {
  projects: Project[];
  heroes: Record<string, DbImage>;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [rows, applyLocal] = useOptimistic(
    projects,
    (state, update: (p: Project[]) => Project[]) => update(state),
  );

  const q = (params.get('q') ?? '').toLowerCase();
  const filtered = useMemo(
    () =>
      rows
        .filter((p) => !q || `${p.title} ${p.vehicle} ${p.category} ${p.slug}`.toLowerCase().includes(q))
        .sort((a, b) => a.sort_order - b.sort_order),
    [rows, q],
  );

  function mutate(fn: () => Promise<unknown>, local: (p: Project[]) => Project[]) {
    startTransition(async () => {
      applyLocal(local);
      await fn();
      router.refresh();
    });
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-[30px] font-semibold tracking-tight text-rb-tx">Projects</h1>
        <Link
          href="/admin/projects/new"
          className="rb-btn-red bg-rb-red px-5 py-3 text-[11px] font-bold uppercase tracking-label text-white"
        >
          ＋ New project
        </Link>
      </div>

      <input
        type="search"
        defaultValue={q}
        onChange={(e) => {
          const next = new URLSearchParams(params.toString());
          if (e.target.value) next.set('q', e.target.value);
          else next.delete('q');
          router.replace(`/admin/projects?${next.toString()}`);
        }}
        placeholder="Search title, vehicle, service…"
        aria-label="Search projects"
        className="mb-6 w-64 border border-rb-line bg-rb-surface-3 px-3 py-2 text-[13px] font-medium text-rb-tx outline-none placeholder:text-rb-tx-faint-2 focus:border-rb-red"
      />

      {filtered.length ? (
        <SortableList
          items={filtered}
          disabled={pending || !!q}
          onReorder={(ids) =>
            mutate(
              () => reorderProjects(ids),
              (ps) =>
                ps.map((p) => {
                  const i = ids.indexOf(p.id);
                  return i === -1 ? p : { ...p, sort_order: i };
                }),
            )
          }
          renderRow={(p, handle) => (
            <div className="flex items-center gap-3 px-3 py-2.5">
              {handle}
              <div className="h-10 w-16 shrink-0 overflow-hidden bg-rb-surface-3">
                {heroes[p.id] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={heroes[p.id].thumb_url ?? heroes[p.id].url}
                    alt=""
                    className="h-full w-full object-cover"
                    style={{
                      objectPosition: `${heroes[p.id].focal_x * 100}% ${heroes[p.id].focal_y * 100}%`,
                    }}
                  />
                ) : (
                  <div className="rb-stripe h-full w-full" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/admin/projects/${p.id}`}
                  className="block truncate text-[14px] font-semibold text-rb-tx hover:text-rb-tx-2"
                >
                  {p.title}
                </Link>
                <p className="truncate text-[11px] font-medium text-rb-tx-faint">
                  {[p.vehicle, p.category].filter(Boolean).join(' · ')}
                </p>
              </div>
              <span className="hidden border border-rb-line px-2 py-1 text-[10px] font-bold uppercase tracking-label text-rb-tx-faint md:inline">
                {p.category}
              </span>
              <FeaturedStar
                featured={p.featured}
                onChange={(v) =>
                  mutate(
                    () => setProjectFlags(p.id, { featured: v }),
                    (ps) => ps.map((x) => (x.id === p.id ? { ...x, featured: v } : x)),
                  )
                }
              />
              <Toggle
                checked={p.published}
                onChange={(v) =>
                  mutate(
                    () => setProjectFlags(p.id, { published: v }),
                    (ps) => ps.map((x) => (x.id === p.id ? { ...x, published: v } : x)),
                  )
                }
                label={`Publish ${p.title}`}
              />
              <div className="flex items-center gap-1 pl-2">
                <Link
                  href={`/admin/projects/${p.id}`}
                  className="px-2 py-1 text-[10px] font-bold uppercase tracking-label text-rb-tx-faint transition-colors hover:text-rb-tx"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() =>
                    startTransition(async () => {
                      const newId = await duplicateProject(p.id);
                      if (newId) router.push(`/admin/projects/${newId}`);
                    })
                  }
                  className="px-2 py-1 text-[10px] font-bold uppercase tracking-label text-rb-tx-faint transition-colors hover:text-rb-tx"
                >
                  Duplicate
                </button>
                <ConfirmButton
                  onConfirm={() =>
                    mutate(
                      () => deleteProject(p.id),
                      (ps) => ps.filter((x) => x.id !== p.id),
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
          <p className="text-[14px] font-medium text-rb-tx-faint">
            {q ? 'Nothing matches that search.' : 'No projects yet.'}
          </p>
        </div>
      )}
    </div>
  );
}
