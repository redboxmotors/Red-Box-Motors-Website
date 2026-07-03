'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import type { Settings } from '@/lib/db/types';
import { saveSettings, type SettingsInput } from '@/app/admin/(panel)/settings/actions';
import { Field, inputCls } from './ui';

// The settings row (admin-cms-build.md §3e) — one source of truth for contact
// info across the public site + schema. Prototype placeholder values are
// flagged until the owner confirms the real ones.

export function SettingsEditor({ settings }: { settings: Settings | null }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState<SettingsInput>({
    phone: settings?.phone ?? '',
    email: settings?.email ?? '',
    address_line: settings?.address_line ?? '',
    hours: Object.entries(settings?.hours_json ?? {}).map(([day, hours]) => ({ day, hours })),
    map_embed_url: settings?.map_embed_url ?? '',
  });

  function set<K extends keyof SettingsInput>(key: K, value: SettingsInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  function setHour(i: number, key: 'day' | 'hours', value: string) {
    set(
      'hours',
      form.hours.map((row, j) => (j === i ? { ...row, [key]: value } : row)),
    );
  }

  function onSave() {
    startTransition(async () => {
      setErrors({});
      const result = await saveSettings(form);
      if (!result.ok) {
        setErrors(result.errors);
        return;
      }
      setSaved(true);
      router.refresh();
    });
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-[30px] font-semibold tracking-tight text-rb-tx">Settings</h1>
          <p className="mt-1 text-[13px] font-medium text-rb-tx-faint">
            Contact info shown across the whole site — phone, email, address, hours, map.
          </p>
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

      <p className="mb-8 border-l-2 border-rb-red bg-rb-surface p-4 text-[12.5px] font-medium leading-relaxed text-rb-tx-mute">
        The prototypes shipped with placeholder contact details — confirm the real phone, email and
        address here before launch. Every public page reads these values.
      </p>

      <section className="mb-8 grid gap-5 md:grid-cols-2">
        <Field label="Phone" error={errors.phone} hint='e.g. "(512) 555-0199"'>
          <input className={inputCls} inputMode="tel" aria-invalid={!!errors.phone} value={form.phone} onChange={(e) => set('phone', e.target.value)} />
        </Field>
        <Field label="Email" error={errors.email}>
          <input className={inputCls} inputMode="email" aria-invalid={!!errors.email} value={form.email} onChange={(e) => set('email', e.target.value)} />
        </Field>
      </section>

      <section className="mb-8">
        <Field label="Address / location line" hint="Shown in the Visit section and LocalBusiness schema.">
          <input className={inputCls} value={form.address_line} onChange={(e) => set('address_line', e.target.value)} />
        </Field>
      </section>

      <section className="mb-8 border border-rb-line bg-rb-surface p-5">
        <p className="rb-label mb-3">Hours</p>
        <div className="space-y-2.5">
          {form.hours.map((row, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <input
                className={`${inputCls} max-w-[220px]`}
                placeholder="Mon–Fri"
                aria-label={`Hours row ${i + 1} — days`}
                value={row.day}
                onChange={(e) => setHour(i, 'day', e.target.value)}
              />
              <input
                className={inputCls}
                placeholder="9:00 AM – 6:00 PM"
                aria-label={`Hours row ${i + 1} — hours`}
                value={row.hours}
                onChange={(e) => setHour(i, 'hours', e.target.value)}
              />
              <button
                type="button"
                aria-label={`Remove hours row ${i + 1}`}
                onClick={() => set('hours', form.hours.filter((_, j) => j !== i))}
                className="flex h-9 w-9 flex-none items-center justify-center border border-rb-border text-rb-tx-faint transition-colors hover:border-rb-red hover:text-rb-tx"
              >
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => set('hours', [...form.hours, { day: '', hours: '' }])}
          className="rb-btn mt-4 border border-rb-border px-4 py-2.5 text-[11px] font-bold uppercase tracking-label text-rb-tx-mute hover:text-rb-tx"
        >
          + Add hours row
        </button>
      </section>

      <section className="mb-8">
        <Field label="Map embed URL" error={errors.map_embed_url} hint="Google Maps embed src (https://…). Leave empty to hide the map.">
          <input className={`${inputCls} font-mono`} aria-invalid={!!errors.map_embed_url} value={form.map_embed_url} onChange={(e) => set('map_embed_url', e.target.value)} />
        </Field>
      </section>
    </div>
  );
}
