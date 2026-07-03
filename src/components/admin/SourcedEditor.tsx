'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import type { DbImage, PlacementSurface, Sourced } from '@/lib/db/types';
import { saveSourced, type SourcedInput } from '@/app/admin/(panel)/sourced/actions';
import { Field, Toggle, inputCls } from './ui';
import { PhotoManager } from './PhotoManager';
import { ShowOn } from './ShowOn';

export function SourcedEditor({
  sourced,
  images,
  activeSurfaces,
}: {
  sourced: Sourced | null;
  images: DbImage[];
  activeSurfaces: PlacementSurface[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState<SourcedInput>({
    year: sourced?.year ?? '',
    make: sourced?.make ?? '',
    model: sourced?.model ?? '',
    spec: sourced?.spec ?? '',
    client: sourced?.client ?? '',
    sourced_detail: sourced?.sourced_detail ?? '',
    published: sourced?.published ?? false,
    featured: sourced?.featured ?? false,
  });

  function set<K extends keyof SourcedInput>(key: K, value: SourcedInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  function onSave() {
    startTransition(async () => {
      setErrors({});
      const result = await saveSourced(sourced?.id ?? null, form);
      if (!result.ok) {
        setErrors(result.errors);
        return;
      }
      setSaved(true);
      if (!sourced) router.replace(`/admin/sourced/${result.id}`);
      else router.refresh();
    });
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <Link href="/admin/sourced" className="rb-label text-rb-tx-faint hover:text-rb-tx">
            ← Sourced
          </Link>
          <h1 className="mt-1 text-[30px] font-semibold tracking-tight text-rb-tx">
            {sourced ? `${sourced.year} ${sourced.make} ${sourced.model}` : 'New sourced car'}
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

      <section className="mb-8 grid grid-cols-2 gap-5 md:grid-cols-4">
        <Field label="Year" error={errors.year}>
          <input className={inputCls} inputMode="numeric" aria-invalid={!!errors.year} value={form.year ?? ''} onChange={(e) => set('year', e.target.value)} />
        </Field>
        <Field label="Make" error={errors.make}>
          <input className={inputCls} aria-invalid={!!errors.make} value={form.make} onChange={(e) => set('make', e.target.value)} />
        </Field>
        <div className="col-span-2">
          <Field label="Model" error={errors.model}>
            <input className={inputCls} aria-invalid={!!errors.model} value={form.model} onChange={(e) => set('model', e.target.value)} />
          </Field>
        </div>
      </section>

      <section className="mb-8 grid gap-5 md:grid-cols-3">
        <Field label="Spec line" hint='e.g. "6-Speed Manual · PTS Oak Green"'>
          <input className={inputCls} value={form.spec ?? ''} onChange={(e) => set('spec', e.target.value)} />
        </Field>
        <Field label="Client (anonymized)" hint='e.g. "Collector · Austin, TX"'>
          <input className={inputCls} value={form.client ?? ''} onChange={(e) => set('client', e.target.value)} />
        </Field>
        <Field label="How it was sourced" hint='e.g. "Sourced off-market"'>
          <input className={inputCls} value={form.sourced_detail ?? ''} onChange={(e) => set('sourced_detail', e.target.value)} />
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

      {/* Placements */}
      {sourced && (
        <section className="mb-8">
          <ShowOn itemType="sourced" itemId={sourced.id} activeSurfaces={activeSurfaces} />
        </section>
      )}

      <section className="mb-8">
        <h2 className="rb-label mb-3">Photos</h2>
        {sourced ? (
          <PhotoManager
            parentType="sourced"
            parentId={sourced.id}
            images={images}
            defaultAlt={`${form.year} ${form.make} ${form.model} — sourced for a client, Austin TX`}
          />
        ) : (
          <div className="border border-rb-line bg-rb-surface p-8 text-center">
            <p className="text-[13px] font-medium text-rb-tx-faint">Save the record first, then add photos.</p>
          </div>
        )}
      </section>
    </div>
  );
}
