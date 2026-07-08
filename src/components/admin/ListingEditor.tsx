'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState, useTransition } from 'react';
import type { DbImage, Listing, ListingStatus, PlacementSurface } from '@/lib/db/types';
import { dedupeModel, listingTitle } from '@/lib/db/types';
import { saveListing, type ListingInput } from '@/app/admin/(panel)/listings/actions';
import { slugify } from '@/lib/admin/slug';
import { DEFAULT_LISTING_FAQ, CONDITION_TOPIC_SUGGESTIONS } from '@/lib/listing-defaults';
import { Field, Toggle, inputCls } from './ui';
import { ConditionListEditor, FaqListEditor, StringListEditor } from './ListingContentFields';
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
    // 2026-07-08 owner-authored content
    overview: listing?.overview ?? null,
    highlights: listing?.highlights ?? [],
    chassis_no: listing?.chassis_no ?? '',
    title_status: listing?.title_status ?? '',
    body_style: listing?.body_style ?? '',
    drivetrain: listing?.drivetrain ?? '',
    powertrain: listing?.powertrain ?? '',
    output_hp: listing?.output_hp ?? '',
    torque_lbft: listing?.torque_lbft ?? '',
    msrp: listing?.msrp ?? '',
    special_spec: listing?.special_spec ?? '',
    documentation: listing?.documentation ?? [],
    condition_notes: listing?.condition_notes ?? [],
    listing_faq: listing?.listing_faq ?? null,
  });

  function set<K extends keyof ListingInput>(key: K, value: ListingInput[K]) {
    setForm((f) => {
      const next = { ...f, [key]: value };
      // auto-slug from year/make/model until the owner edits the slug
      // directly — dedupeModel keeps a make typed into the model field from
      // producing "porsche-porsche-…" slugs (2026-07-08 fix)
      if (!slugTouched && (key === 'year' || key === 'make' || key === 'model')) {
        next.slug = slugify(
          `${next.year ?? ''} ${next.make} ${dedupeModel(next.make, next.model)}`,
        );
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

      {/* Extended specifications (2026-07-08 — render on the page only when filled) */}
      <section className="mb-8 border border-rb-line bg-rb-surface p-5">
        <h2 className="rb-label mb-4">Extended specifications</h2>
        <div className="grid gap-5 md:grid-cols-3">
          <Field label="Chassis number">
            <input className={`${inputCls} font-mono`} value={form.chassis_no ?? ''} onChange={(e) => set('chassis_no', e.target.value)} />
          </Field>
          <Field label="Title status" hint="Clean / Rebuilt / Bonded…">
            <input className={inputCls} value={form.title_status ?? ''} onChange={(e) => set('title_status', e.target.value)} />
          </Field>
          <Field label="Body style" hint='e.g. "Spyder"'>
            <input className={inputCls} value={form.body_style ?? ''} onChange={(e) => set('body_style', e.target.value)} />
          </Field>
          <Field label="Drivetrain" hint="AWD / RWD…">
            <input className={inputCls} value={form.drivetrain ?? ''} onChange={(e) => set('drivetrain', e.target.value)} />
          </Field>
          <Field label="Powertrain type" hint='e.g. "Plug-in hybrid"'>
            <input className={inputCls} value={form.powertrain ?? ''} onChange={(e) => set('powertrain', e.target.value)} />
          </Field>
          <Field label="Combined output (hp)" hint="Numbers only.">
            <input className={inputCls} inputMode="numeric" value={form.output_hp ?? ''} onChange={(e) => set('output_hp', e.target.value)} />
          </Field>
          <Field label="Torque (lb-ft)" hint="Numbers only.">
            <input className={inputCls} inputMode="numeric" value={form.torque_lbft ?? ''} onChange={(e) => set('torque_lbft', e.target.value)} />
          </Field>
          <Field label="Original MSRP (USD)" hint="Numbers only.">
            <input className={inputCls} inputMode="numeric" value={form.msrp ?? ''} onChange={(e) => set('msrp', e.target.value)} />
          </Field>
          <Field label="Special specification" hint='e.g. "CXX Special Wishes specification"'>
            <input className={inputCls} value={form.special_spec ?? ''} onChange={(e) => set('special_spec', e.target.value)} />
          </Field>
        </div>
      </section>

      {/* Overview — the owner's words, verbatim. No generated copy. */}
      <section className="mb-8 border border-rb-line bg-rb-surface p-5">
        <h2 className="rb-label mb-1.5">Overview</h2>
        <p className="mb-4 text-[12px] font-medium leading-relaxed text-rb-tx-faint">
          Published exactly as written — blank line starts a new paragraph. Leave empty and the
          page shows no overview at all (never generated filler).
        </p>
        <textarea
          className={`${inputCls} min-h-[220px] resize-y leading-relaxed`}
          value={form.overview ?? ''}
          onChange={(e) => set('overview', e.target.value)}
          placeholder={'First paragraph…\n\nSecond paragraph…'}
        />
      </section>

      {/* Vehicle highlights */}
      <section className="mb-8 border border-rb-line bg-rb-surface p-5">
        <h2 className="rb-label mb-1.5">Vehicle highlights</h2>
        <p className="mb-4 text-[12px] font-medium leading-relaxed text-rb-tx-faint">
          Short lines, in the order they should appear. Section hides when empty.
        </p>
        <StringListEditor
          items={form.highlights}
          onChange={(v) => set('highlights', v)}
          placeholder='e.g. "Non-Weissach specification"'
          addLabel="Add highlight"
        />
      </section>

      {/* Documentation & included items */}
      <section className="mb-8 border border-rb-line bg-rb-surface p-5">
        <h2 className="rb-label mb-1.5">Documentation &amp; included items</h2>
        <p className="mb-4 text-[12px] font-medium leading-relaxed text-rb-tx-faint">
          Manuals, accessories, records, keys, chargers… Section hides when empty.
        </p>
        <StringListEditor
          items={form.documentation}
          onChange={(v) => set('documentation', v)}
          placeholder='e.g. "Original manuals"'
          addLabel="Add item"
        />
      </section>

      {/* Condition & inspection */}
      <section className="mb-8 border border-rb-line bg-rb-surface p-5">
        <h2 className="rb-label mb-1.5">Condition &amp; inspection</h2>
        <p className="mb-4 text-[12px] font-medium leading-relaxed text-rb-tx-faint">
          Only owner-verified details — empty items don&rsquo;t publish. Suggested topics:
          cosmetic notes, paintwork history, accident history, PPF status, tires, recent service,
          battery / hybrid system, inspection availability.
        </p>
        <ConditionListEditor
          items={form.condition_notes}
          onChange={(v) => set('condition_notes', v)}
          suggestions={CONDITION_TOPIC_SUGGESTIONS}
        />
      </section>

      {/* Listing FAQ */}
      <section className="mb-8 border border-rb-line bg-rb-surface p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="rb-label mb-1.5">Listing FAQ</h2>
            <p className="text-[12px] font-medium leading-relaxed text-rb-tx-faint">
              {form.listing_faq === null
                ? 'Using the site default questions. Customize to edit them for this listing.'
                : form.listing_faq.length === 0
                  ? 'FAQ section hidden on this listing. Add a question or restore the defaults.'
                  : 'Custom questions for this listing.'}
            </p>
          </div>
          <div className="flex gap-1.5">
            {form.listing_faq === null ? (
              <button
                type="button"
                onClick={() => set('listing_faq', DEFAULT_LISTING_FAQ.map((f) => ({ ...f })))}
                className="border border-rb-line px-4 py-2.5 text-[10px] font-bold uppercase tracking-label text-rb-tx-faint transition-colors hover:border-rb-border-2 hover:text-rb-tx"
              >
                Customize
              </button>
            ) : (
              <button
                type="button"
                onClick={() => set('listing_faq', null)}
                className="border border-rb-line px-4 py-2.5 text-[10px] font-bold uppercase tracking-label text-rb-tx-faint transition-colors hover:border-rb-border-2 hover:text-rb-tx"
              >
                Use site defaults
              </button>
            )}
          </div>
        </div>
        {form.listing_faq !== null && (
          <FaqListEditor items={form.listing_faq} onChange={(v) => set('listing_faq', v)} />
        )}
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
