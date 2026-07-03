'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState, useTransition } from 'react';
import type { DbImage, PlacementSurface, Project } from '@/lib/db/types';
import { saveProject, type ProjectInput } from '@/app/admin/(panel)/projects/actions';
import { slugify } from '@/lib/admin/slug';
import { ChipListInput, Field, Toggle, inputCls } from './ui';
import { PhotoManager } from './PhotoManager';
import { ShowOn } from './ShowOn';

export function ProjectEditor({
  project,
  images,
  activeSurfaces,
}: {
  project: Project | null;
  images: DbImage[];
  activeSurfaces: PlacementSurface[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [slugTouched, setSlugTouched] = useState(!!project);

  const [form, setForm] = useState<ProjectInput>({
    slug: project?.slug ?? '',
    title: project?.title ?? '',
    vehicle: project?.vehicle ?? '',
    make: project?.make ?? '',
    category: project?.category ?? '',
    services: project?.services ?? [],
    finish: project?.finish ?? '',
    duration: project?.duration ?? '',
    year: project?.year ?? '',
    coverage: project?.coverage ?? '',
    location: project?.location ?? 'Austin, TX',
    summary: project?.summary ?? '',
    scope: project?.scope ?? [],
    published: project?.published ?? false,
    featured: project?.featured ?? false,
  });

  function set<K extends keyof ProjectInput>(key: K, value: ProjectInput[K]) {
    setForm((f) => {
      const next = { ...f, [key]: value };
      if (!slugTouched && (key === 'title' || key === 'vehicle')) {
        next.slug = slugify(`${next.title} ${next.vehicle}`);
      }
      return next;
    });
    setSaved(false);
  }

  // Live SEO preview (seo-map.md — Project Detail row)
  const seo = useMemo(
    () => ({
      title: form.title ? `${form.title} — ${form.vehicle} | Red Box Motors` : 'Red Box Motors',
      description: form.summary
        ? `${form.summary.slice(0, 155)}`
        : `${form.category} on a ${form.vehicle} in Austin, TX.`,
      url: `/cosmetics/work/${form.slug || '…'}`,
    }),
    [form],
  );

  function onSave() {
    startTransition(async () => {
      setErrors({});
      const result = await saveProject(project?.id ?? null, form);
      if (!result.ok) {
        setErrors(result.errors);
        return;
      }
      setSaved(true);
      if (!project) router.replace(`/admin/projects/${result.id}`);
      else router.refresh();
    });
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <Link href="/admin/projects" className="rb-label text-rb-tx-faint hover:text-rb-tx">
            ← Projects
          </Link>
          <h1 className="mt-1 text-[30px] font-semibold tracking-tight text-rb-tx">
            {project ? project.title : 'New project'}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          {saved && <span className="text-[12px] font-semibold text-rb-tx-mute">Saved.</span>}
          <button
            type="button"
            onClick={onSave}
            disabled={pending}
            className="rb-btn-red bg-rb-red px-6 py-3.5 text-[11px] font-bold uppercase tracking-label text-white disabled:opacity-60"
          >
            {pending ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      {errors._form && (
        <p role="alert" className="mb-6 border-l-2 border-rb-red bg-rb-surface p-4 text-[13px] font-medium text-rb-tx-2">
          {errors._form}
        </p>
      )}

      <section className="mb-8 grid gap-5 md:grid-cols-2">
        <Field label="Project title" error={errors.title}>
          <input className={inputCls} aria-invalid={!!errors.title} value={form.title} onChange={(e) => set('title', e.target.value)} />
        </Field>
        <Field label="Vehicle (full name)" error={errors.vehicle} hint='e.g. "Porsche 911 GT3 RS"'>
          <input className={inputCls} aria-invalid={!!errors.vehicle} value={form.vehicle} onChange={(e) => set('vehicle', e.target.value)} />
        </Field>
        <Field label="Make">
          <input className={inputCls} value={form.make ?? ''} onChange={(e) => set('make', e.target.value)} />
        </Field>
        <Field label="Primary service (category)" error={errors.category} hint="PPF · Vinyl Wrap · Ceramic & Correction · Wheel Refinishing · Custom Build">
          <input className={inputCls} aria-invalid={!!errors.category} value={form.category} onChange={(e) => set('category', e.target.value)} />
        </Field>
      </section>

      <section className="mb-8 grid gap-5 md:grid-cols-2">
        <Field label="All services on this build">
          <ChipListInput values={form.services} onChange={(v) => set('services', v)} placeholder="Add a service, press Enter" />
        </Field>
        <Field label="Work performed (scope)">
          <ChipListInput values={form.scope} onChange={(v) => set('scope', v)} placeholder="Add a scope line, press Enter" />
        </Field>
      </section>

      <section className="mb-8 grid grid-cols-2 gap-5 md:grid-cols-4">
        <Field label="Finish">
          <input className={inputCls} value={form.finish ?? ''} onChange={(e) => set('finish', e.target.value)} />
        </Field>
        <Field label="Duration">
          <input className={inputCls} value={form.duration ?? ''} onChange={(e) => set('duration', e.target.value)} />
        </Field>
        <Field label="Year">
          <input className={inputCls} inputMode="numeric" value={form.year ?? ''} onChange={(e) => set('year', e.target.value)} />
        </Field>
        <Field label="Coverage">
          <input className={inputCls} value={form.coverage ?? ''} onChange={(e) => set('coverage', e.target.value)} />
        </Field>
      </section>

      <section className="mb-8">
        <Field label="Summary" hint="1–2 sentences — also the meta description.">
          <textarea
            className={`${inputCls} min-h-24 resize-y`}
            value={form.summary ?? ''}
            onChange={(e) => set('summary', e.target.value)}
          />
        </Field>
      </section>

      <section className="mb-8 flex items-center gap-8 border border-rb-line bg-rb-surface p-5">
        <label className="flex items-center gap-2.5">
          <span className="rb-label">Published</span>
          <Toggle checked={form.published} onChange={(v) => set('published', v)} label="Published" />
        </label>
        <label className="flex items-center gap-2.5">
          <span className="rb-label">Featured</span>
          <Toggle checked={form.featured} onChange={(v) => set('featured', v)} label="Featured" />
        </label>
      </section>

      <section className="mb-8 border border-rb-line bg-rb-surface p-5">
        <Field label="URL slug" error={errors.slug}>
          <input
            className={`${inputCls} font-mono`}
            aria-invalid={!!errors.slug}
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true);
              set('slug', slugify(e.target.value));
            }}
          />
        </Field>
        <div className="mt-4 border border-rb-line bg-rb-surface-3 p-4">
          <p className="rb-label mb-2 text-[9px]">Search preview</p>
          <p className="truncate text-[15px] font-semibold text-rb-tx-2">{seo.title}</p>
          <p className="rb-mono-caption mt-0.5">{`redboxmotors.com${seo.url}`}</p>
          <p className="mt-1 line-clamp-2 text-[12px] font-medium text-rb-tx-faint">{seo.description}</p>
        </div>
      </section>

      {/* Placements */}
      {project && (
        <section className="mb-8">
          <ShowOn itemType="project" itemId={project.id} activeSurfaces={activeSurfaces} />
        </section>
      )}

      <section className="mb-8">
        <h2 className="rb-label mb-3">Photos</h2>
        {project ? (
          <PhotoManager
            parentType="project"
            parentId={project.id}
            images={images}
            defaultAlt={`${form.vehicle} — ${form.category}, Austin TX`}
          />
        ) : (
          <div className="border border-rb-line bg-rb-surface p-8 text-center">
            <p className="text-[13px] font-medium text-rb-tx-faint">Save the project first, then add photos.</p>
          </div>
        )}
      </section>
    </div>
  );
}
