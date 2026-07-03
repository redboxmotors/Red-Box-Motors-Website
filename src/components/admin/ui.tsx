'use client';

import { useState } from 'react';
import type { ListingStatus } from '@/lib/db/types';

// —— Shared admin UI primitives — dark, sharp, on-token (admin-cms-build.md §3) ——

export function Toggle({
  checked,
  onChange,
  label,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative h-5 w-9 shrink-0 border transition-colors duration-btn ease-rb focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-rb-red disabled:opacity-40 ${
        checked ? 'border-rb-red bg-rb-red/20' : 'border-rb-border bg-rb-raised'
      }`}
    >
      <span
        className={`absolute top-[3px] h-3 w-3 transition-transform duration-btn ease-rb ${
          checked ? 'translate-x-[19px] bg-rb-red' : 'translate-x-[3px] bg-rb-tx-faint'
        }`}
      />
    </button>
  );
}

export function FeaturedStar({
  featured,
  onChange,
}: {
  featured: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={featured}
      aria-label={featured ? 'Unmark featured' : 'Mark featured'}
      onClick={() => onChange(!featured)}
      title="Featured"
      className={`flex h-8 w-8 items-center justify-center text-[15px] transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-rb-red ${
        featured ? 'text-rb-red' : 'text-rb-tx-ghost hover:text-rb-tx-faint'
      }`}
    >
      {featured ? '★' : '☆'}
    </button>
  );
}

const STATUS_LABEL: Record<ListingStatus, string> = {
  for_sale: 'For sale',
  coming_soon: 'Coming soon',
  sold: 'Sold',
};

export function StatusPill({ status }: { status: ListingStatus }) {
  return (
    <span
      className={`inline-block border px-2 py-1 text-[10px] font-bold uppercase tracking-label ${
        status === 'for_sale'
          ? 'border-rb-red/50 text-rb-tx'
          : status === 'coming_soon'
            ? 'border-rb-border-2 text-rb-tx-mute'
            : 'border-rb-border text-rb-tx-faint'
      }`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

export function Field({
  label,
  error,
  children,
  hint,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="rb-label mb-2 block">{label}</label>
      {children}
      {hint && !error && <p className="mt-1.5 text-[11px] font-medium text-rb-tx-faint-2">{hint}</p>}
      {error && (
        <p role="alert" className="mt-1.5 border-l-2 border-rb-red pl-2 text-[12px] font-medium text-rb-tx-2">
          {error}
        </p>
      )}
    </div>
  );
}

export const inputCls =
  'w-full border border-rb-line bg-rb-surface-3 px-3 py-2.5 text-[14px] font-medium text-rb-tx outline-none transition-colors placeholder:text-rb-tx-faint-2 focus:border-rb-red aria-[invalid=true]:border-rb-red';

// Add/remove chip list for services[] / scope[] (admin-cms-build.md §3c)
export function ChipListInput({
  values,
  onChange,
  placeholder,
}: {
  values: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState('');

  function add() {
    const v = draft.trim();
    if (!v || values.includes(v)) return;
    onChange([...values, v]);
    setDraft('');
  }

  return (
    <div className="border border-rb-line bg-rb-surface-3 p-2">
      {values.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {values.map((v, i) => (
            <span
              key={`${v}-${i}`}
              className="inline-flex items-center gap-1.5 border border-rb-border px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-rb-tx-2"
            >
              {v}
              <button
                type="button"
                aria-label={`Remove ${v}`}
                onClick={() => onChange(values.filter((_, j) => j !== i))}
                className="text-rb-tx-faint transition-colors hover:text-rb-red"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            add();
          }
        }}
        onBlur={add}
        placeholder={placeholder ?? 'Type and press Enter'}
        className="w-full bg-transparent px-1 py-1 text-[13px] font-medium text-rb-tx outline-none placeholder:text-rb-tx-faint-2"
      />
    </div>
  );
}

// Quiet confirm for destructive actions — no browser confirm(), on-brand
export function ConfirmButton({
  onConfirm,
  children,
  confirmLabel = 'Confirm delete',
  className,
}: {
  onConfirm: () => void;
  children: React.ReactNode;
  confirmLabel?: string;
  className?: string;
}) {
  const [arming, setArming] = useState(false);
  if (arming) {
    return (
      <span className="inline-flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setArming(false);
            onConfirm();
          }}
          className="border border-rb-red px-2 py-1 text-[10px] font-bold uppercase tracking-label text-rb-red transition-colors hover:bg-rb-red hover:text-white"
        >
          {confirmLabel}
        </button>
        <button
          type="button"
          onClick={() => setArming(false)}
          className="px-1 text-[10px] font-bold uppercase tracking-label text-rb-tx-faint hover:text-rb-tx"
        >
          Cancel
        </button>
      </span>
    );
  }
  return (
    <button type="button" onClick={() => setArming(true)} className={className}>
      {children}
    </button>
  );
}
