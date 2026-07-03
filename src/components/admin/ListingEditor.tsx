'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState, useTransition } from 'react';
import type { DbImage, Listing, ListingStatus, PlacementSurface } from '@/lib/db/types';
import { listingTitle } from '@/lib/db/types';
import { saveListing, type ListingInput } from '@/app/admin/(panel)/listings/actions';
import { slugify } from '@/lib/admin/slug';
import { Field, Toggle, inputCls } from './ui';
import { PhotoManager } from './PhotoManager';
import { ShowOn } from './ShowOn';

const STATUSES: { value: ListingStatus; label: string }[] = [
  { value: 'for_sale', label: 'For sale' },
  { value: 'coming_soon', label: 'Coming soon' },
  { value: 'sold', label: 'Sold' },
];

export function ListingEditor({
  listing,
  images,
  activeSurfaces,
}: {
  listing: Listing | null;
  images: DbImage[];
  activeSurfaces: PlacementSurface[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [slugTouched, setSlugTouched] = useState(!!listing);

  const [form, setForm] = useState<ListingInput>({
    slug: listing?.slug ?? '',
    year: listing?.year ?? '',
    make: listing?.make ?? '',
    model: listing?.model ?? '',
    price: listing?.price ?? '',
    mileage: listing?.mileage ?? '',
    exterior: listing?.exterior ?? '',
    interior: listing?.interior ?? '',
    engine: listing?.engine ?? '',
    transmission: listing?.transmission ?? '',
    vin: listing?.vin ?? '',
    vin_public: listing?.vin_public ?? false,
    status: listing?.status ?? 'for_sale',
    eta: listing?.eta ?? '',
    spec: listing?.spec ?? '',
    placed_with: listing?.placed_with ?? '',
    sale_detail: listing?.sale_detail ?? '',
    published: listing?.published ?? false,
    featured: listing?.featured ?? false,
  });

  function set<K extends keyof ListingInput>(key: K, value: ListingInput[K]) {
    setForm((f) => {
      const next = { ...f, [key]: value };
      // auto-slug from year/make/model until the owner edits the slug directly
      if (!slugTouched && (key === 'year' || key === 'make' || key === 'model')) {
        next.slug = slugify(`${next.year ?? ''} ${next.make} ${next.model}`);
      }
      return next;
    });
    setSaved(false);
  }

  // Live SEO preview (seo-map.md — Car Detail row)
  const seo = useMemo(() => {
    const title = listingTitle({
      year: typeof form.year === 'string' ? Number(form.year) || null : form.year,
      make: form.make,
      model: form.model,
    });
    return {
      title: title ? `${title} for Sale — Red Box Motors` : 'Red Box Motors',
      description: title
        ? `${title} for sale at Red Box Motors, Austin, TX${form.mileage ? ` — ${form.mileage} mi` : ''}${form.exterior ? `, ${form.exterior}` : ''}. Inquire today.`
        : '',
      url: `/dealer/inventory/${form.slug || '…'}`,
    };
  }, [form]);

  function onSave() {
    startTransition(async () => {
      setErrors({});
      const result = await saveListing(listing?.id ?? null, form);
      if (!result.ok) {
        setErrors(result.errors);
        return;
      }
      setSaved(true);
      if (!listing) {
        router.replace(`/admin/listings/${result.id}`);
      } else {
        router.refresh();
      }
    });
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <Link href="/admin/listings" className="rb-label text-rb-tx-faint hover:text-rb-tx">
            ← Listings
          </Link>
          <h1 className="mt-1 text-[30px] font-semibold tracking-tight text-rb-tx">
            {listing ? listingTitle(listing) : 'New listing'}
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

      {/* Identity */}
      <section className="mb-8 grid grid-cols-2 gap-5 md:grid-cols-4">
        <Field label="Year" error={errors.year}>
          <input className={inputCls} inputMode="numeric" value={form.year ?? ''} onChange={(e) => set('year', e.target.value)} />
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

      {/* Status + lifecycle */}
      <section className="mb-8 border border-rb-line bg-rb-surface p-5">
        <div className="flex flex-wrap items-end gap-5">
          <Field label="Status">
            <div className="flex gap-1.5">
              {STATUSES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  aria-pressed={form.status === s.value}
                  onClick={() => set('status', s.value)}
                  className={`border px-3 py-2.5 text-[10px] font-bold uppercase tracking-label transition-colors ${
                    form.status === s.value
                      ? 'border-rb-red text-rb-tx'
                      : 'border-rb-line text-rb-tx-faint hover:border-rb-border-2'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </Field>
          {form.status === 'coming_soon' && (
            <div className="w-44">
              <Field label="ETA" error={errors.eta} hint='"July", "In transit"…'>
                <input className={inputCls} aria-invalid={!!errors.eta} value={form.eta ?? ''} onChange={(e) => set('eta', e.target.value)} />
              </Field>
            </div>
          )}
          <div className="ml-auto flex items-center gap-6">
            <label className="flex items-center gap-2.5">
              <span className="rb-label">Published</span>
              <Toggle checked={form.published} onChange={(v) => set('published', v)} label="Published" />
            </label>
            <label className="flex items-center gap-2.5">
              <span className="rb-label">Featured</span>
              <Toggle checked={form.featured} onChange={(v) => set('featured', v)} label="Featured" />
            </label>
          </div>
        </div>

        {form.status === 'sold' && (
          <div className="mt-5 grid gap-5 border-t border-rb-line pt-5 md:grid-cols-3">
            <Field label="Spec line" hint='e.g. "GT Silver · 1 of 1,270"'>
              <input className={inputCls} value={form.spec ?? ''} onChange={(e) => set('spec', e.target.value)} />
            </Field>
            <Field label="Placed with" hint="Anonymized — no client names">
              <input className={inputCls} value={form.placed_with ?? ''} onChange={(e) => set('placed_with', e.target.value)} />
            </Field>
            <Field label="Sale detail" hint='e.g. "Consigned & placed privately"'>
              <input className={inputCls} value={form.sale_detail ?? ''} onChange={(e) => set('sale_detail', e.target.value)} />
            </Field>
          </div>
        )}
      </section>

      {/* Specs */}
      <section className="mb-8 grid gap-5 md:grid-cols-2">
        <Field label="Price (USD)" hint="Numbers only — formatted on the site. Sold cars show no price.">
          <input className={inputCls} inputMode="numeric" value={form.price ?? ''} onChange={(e) => set('price', e.target.value)} />
        </Field>
        <Field label="Mileage" hint="Numbers only.">
          <input className={inputCls} inputMode="numeric" value={form.mileage ?? ''} onChange={(e) => set('mileage', e.target.value)} />
        </Field>
        <Field label="Exterior">
          <input className={inputCls} value={form.exterior ?? ''} onChange={(e) => set('exterior', e.target.value)} />
        </Field>
        <Field label="Interior">
          <input className={inputCls} value={form.interior ?? ''} onChange={(e) => set('interior', e.target.value)} />
        </Field>
        <Field label="Engine">
          <input className={inputCls} value={form.engine ?? ''} onChange={(e) => set('engine', e.target.value)} />
        </Field>
        <Field label="Transmission">
          <input className={inputCls} value={form.transmission ?? ''} onChange={(e) => set('transmission', e.target.value)} />
        </Field>
      </section>

      {/* VIN — server-side only unless made public */}
      <section className="mb-8 border border-rb-line bg-rb-surface p-5">
        <div className="grid items-end gap-5 md:grid-cols-[1fr_auto]">
          <Field
            label="VIN (full)"
            hint="Stored server-side. Never rendered publicly unless the toggle is on."
          >
            <input className={`${inputCls} font-mono`} value={form.vin ?? ''} onChange={(e) => set('vin', e.target.value)} />
          </Field>
          <label className="flex items-center gap-2.5 pb-1">
            <span className="rb-label">Show publicly</span>
            <Toggle checked={form.vin_public} onChange={(v) => set('vin_public', v)} label="Show VIN publicly" />
          </label>
        </div>
      </section>

      {/* Slug + SEO preview */}
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
      {listing && (
        <section className="mb-8">
          <ShowOn itemType="listing" itemId={listing.id} activeSurfaces={activeSurfaces} />
        </section>
      )}

      {/* Photos — mounted by the photo manager (task: admin-and-photos.md) */}
      <section className="mb-8">
        <h2 className="rb-label mb-3">Photos</h2>
        {listing ? (
          <PhotoManager parentType="listing" parentId={listing.id} images={images} defaultAlt={`${listingTitle(listing)}, Austin TX`} />
        ) : (
          <div className="border border-rb-line bg-rb-surface p-8 text-center">
            <p className="text-[13px] font-medium text-rb-tx-faint">Save the listing first, then add photos.</p>
          </div>
        )}
      </section>
    </div>
  );
}
