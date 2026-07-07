'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState, useTransition } from 'react';
import type { Lead, LeadType } from '@/lib/db/types';
import { getLeadUploads, setLeadStatus, type LeadUpload } from '@/app/admin/(panel)/leads/actions';

// Leads inbox (admin-cms-build.md §3b "New leads"). Newest first, expandable
// detail, mark handled / reopen. 2026-07-07 form system: four lead types in
// one list (contact, listing inquiry, consignment, first look) with a type
// filter, structured `payload` rendering, and a private-bucket uploads
// viewer (signed URLs minted on demand by an admin-only server action).

type StatusFilter = 'all' | 'new' | 'handled';
type TypeFilter = 'all' | LeadType;

const TYPE_LABEL: Record<string, string> = {
  contact: 'Contact',
  listing: 'Vehicle inquiry',
  consignment: 'Consignment',
  first_look: 'First look',
};

const TYPE_FILTERS: Array<{ key: TypeFilter; label: string }> = [
  { key: 'all', label: 'All types' },
  { key: 'consignment', label: 'Consignments' },
  { key: 'listing', label: 'Vehicle inquiries' },
  { key: 'first_look', label: 'First look' },
  { key: 'contact', label: 'Contact' },
];

function fmtDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Chicago',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(iso));
  } catch {
    return iso.slice(0, 10);
  }
}

function fmtKey(k: string): string {
  const s = k.replace(/_/g, ' ');
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function fmtBytes(n: number | null): string {
  if (n == null) return '';
  if (n < 1024 * 1024) return `${Math.max(1, Math.round(n / 1024))} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

// Render one payload group ({ field: value }) as a compact definition list.
function PayloadGroup({ title, data }: { title: string; data: Record<string, unknown> }) {
  const entries = Object.entries(data).filter(
    ([, v]) => v != null && v !== '' && (typeof v !== 'object' || Array.isArray(v)),
  );
  if (!entries.length) return null;
  return (
    <div className="min-w-0">
      <div className="mb-2 text-[10px] font-bold uppercase tracking-[2px] text-rb-tx-faint">
        {title}
      </div>
      <dl className="m-0 grid gap-y-1.5">
        {entries.map(([k, v]) => (
          <div key={k} className="grid grid-cols-[140px_1fr] gap-3 text-[12px]">
            <dt className="text-rb-tx-faint">{fmtKey(k)}</dt>
            <dd className="m-0 break-words font-medium text-rb-tx-2">
              {typeof v === 'boolean' ? (v ? 'Yes' : 'No') : Array.isArray(v) ? v.length : String(v)}
              {k === 'listing_url' && typeof v === 'string' ? (
                <>
                  {' '}
                  <a href={v} className="text-rb-tx underline underline-offset-2" target="_blank" rel="noreferrer">
                    open
                  </a>
                </>
              ) : null}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function LeadPayload({ payload }: { payload: Record<string, unknown> }) {
  const groups: Array<[string, Record<string, unknown>]> = [];
  const flat: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(payload)) {
    if (k === 'form' || k === 'files') continue;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      groups.push([fmtKey(k), v as Record<string, unknown>]);
    } else {
      flat[k] = v;
    }
  }
  return (
    <div className="mb-5 grid gap-x-10 gap-y-5 border border-rb-line-2 bg-rb-bg px-5 py-4 md:grid-cols-2">
      {Object.keys(flat).length > 0 && <PayloadGroup title="Details" data={flat} />}
      {groups.map(([title, data]) => (
        <PayloadGroup key={title} title={title} data={data} />
      ))}
    </div>
  );
}

function LeadFiles({ leadId, expected }: { leadId: string; expected: number | null }) {
  const [files, setFiles] = useState<LeadUpload[] | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setFiles(await getLeadUploads(leadId));
    } finally {
      setLoading(false);
    }
  };

  if (files === null) {
    return (
      <button
        type="button"
        onClick={load}
        disabled={loading}
        className="rb-btn mb-5 border border-rb-border px-4 py-2 text-[11px] font-bold uppercase tracking-label text-rb-tx-mute hover:text-rb-tx disabled:opacity-60"
      >
        {loading ? 'Loading files…' : `View files${expected ? ` (${expected})` : ''}`}
      </button>
    );
  }
  if (!files.length) {
    return (
      <p className="mb-5 text-[12px] font-medium text-rb-tx-faint">
        No files were uploaded for this lead.
      </p>
    );
  }
  return (
    <div className="mb-5 flex flex-wrap gap-2">
      {files.map((f) => {
        const isImage = /\.(jpe?g|png|webp|avif)$/i.test(f.name);
        return (
          <a
            key={`${f.category}/${f.name}`}
            href={f.url}
            target="_blank"
            rel="noreferrer"
            className="group block border border-rb-line-2 bg-rb-bg transition-colors hover:border-rb-border-2"
          >
            {isImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={f.url} alt={f.name} className="h-[92px] w-[128px] object-cover" />
            ) : (
              <span className="flex h-[92px] w-[128px] items-center justify-center font-mono text-[10px] uppercase tracking-[1px] text-rb-tx-faint">
                {f.name.split('.').pop()}
              </span>
            )}
            <span className="block max-w-[128px] truncate px-2 py-1.5 font-mono text-[9.5px] text-rb-tx-faint group-hover:text-rb-tx-mute">
              {f.category}/{f.name} {fmtBytes(f.size)}
            </span>
          </a>
        );
      })}
    </div>
  );
}

function leadContext(lead: Lead): string {
  const p = (lead.payload ?? {}) as Record<string, unknown>;
  if (lead.type === 'consignment')
    return (p.vehicle_title as string) ?? 'Consignment';
  if (lead.type === 'listing') return lead.listing_title ?? 'Vehicle inquiry';
  if (lead.type === 'first_look')
    return (p.vehicle_of_interest as string) ?? lead.listing_title ?? 'First look';
  return lead.interest ?? 'Contact';
}

export function LeadsManager({ leads }: { leads: Lead[] }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [open, setOpen] = useState<string | null>(null);

  const shown = useMemo(
    () =>
      leads
        .filter((l) => (filter === 'all' ? true : l.status === filter))
        .filter((l) => (typeFilter === 'all' ? true : l.type === typeFilter)),
    [leads, filter, typeFilter],
  );
  const newCount = leads.filter((l) => l.status === 'new').length;

  function toggle(lead: Lead) {
    const next = lead.status === 'new' ? 'handled' : 'new';
    startTransition(async () => {
      await setLeadStatus(lead.id, next);
      router.refresh();
    });
  }

  return (
    <div className="max-w-5xl">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-[30px] font-semibold tracking-tight text-rb-tx">Leads</h1>
          <p className="mt-1 text-[13px] font-medium text-rb-tx-faint">
            {newCount > 0 ? `${newCount} new` : 'All caught up'} · consignments, inquiries, first
            look &amp; contact
          </p>
        </div>
        <div className="flex gap-1">
          {(['all', 'new', 'handled'] as StatusFilter[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-[11px] font-bold uppercase tracking-label transition-colors ${
                filter === f
                  ? 'bg-rb-raised-3 text-rb-tx'
                  : 'text-rb-tx-faint hover:bg-rb-raised hover:text-rb-tx-mute'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-1">
        {TYPE_FILTERS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTypeFilter(t.key)}
            className={`border px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.5px] transition-colors ${
              typeFilter === t.key
                ? 'border-rb-red bg-[rgba(204,0,0,0.10)] text-rb-tx'
                : 'border-rb-border text-rb-tx-faint hover:text-rb-tx-mute'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <div className="border border-rb-line bg-rb-surface p-12 text-center">
          <p className="text-[13px] font-medium text-rb-tx-faint">
            {filter === 'all' && typeFilter === 'all'
              ? 'No leads yet — they land here when any of the site forms are submitted.'
              : 'Nothing matches these filters.'}
          </p>
        </div>
      ) : (
        <div className="border border-rb-line">
          {shown.map((lead) => {
            const isOpen = open === lead.id;
            const payload = (lead.payload ?? null) as Record<string, unknown> | null;
            const fileCount = Array.isArray(payload?.files) ? (payload!.files as unknown[]).length : null;
            return (
              <div key={lead.id} className={`border-b border-rb-line last:border-b-0 ${lead.status === 'new' ? 'bg-rb-surface' : 'bg-rb-bg'}`}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : lead.id)}
                  className="grid w-full grid-cols-[10px_1.2fr_1.4fr_1.1fr_auto] items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-rb-raised"
                >
                  <span
                    className={`h-2 w-2 ${lead.status === 'new' ? 'bg-rb-red' : 'border border-rb-border bg-transparent'}`}
                    aria-label={lead.status}
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-[14px] font-semibold text-rb-tx">{lead.name}</span>
                    <span className="block truncate text-[11.5px] font-medium text-rb-tx-faint">{lead.email}</span>
                  </span>
                  <span className="min-w-0 truncate text-[12.5px] font-medium text-rb-tx-mute">
                    {lead.message ?? ''}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-mono text-[10px] uppercase tracking-[1px] text-rb-tx-faint">
                      {TYPE_LABEL[lead.type] ?? lead.type}
                    </span>
                    <span className="block truncate text-[11.5px] font-medium text-rb-tx-mute">
                      {leadContext(lead)}
                    </span>
                  </span>
                  <span className="whitespace-nowrap font-mono text-[10.5px] text-rb-tx-faint-2">
                    {fmtDate(lead.created_at)}
                  </span>
                </button>

                {isOpen && (
                  <div className="border-t border-rb-line-2 bg-rb-surface-3 px-5 py-5">
                    {lead.message && (
                      <p className="mb-4 whitespace-pre-wrap text-[13.5px] leading-relaxed text-rb-tx-2">
                        {lead.message}
                      </p>
                    )}
                    <div className="mb-5 grid gap-x-8 gap-y-2 text-[12px] font-medium text-rb-tx-mute md:grid-cols-2">
                      <span>Email: <a className="text-rb-tx underline underline-offset-2" href={`mailto:${lead.email}`}>{lead.email}</a></span>
                      {lead.phone && <span>Phone: <a className="text-rb-tx underline underline-offset-2" href={`tel:${lead.phone}`}>{lead.phone}</a></span>}
                      {lead.contact_method && <span>Prefers: {lead.contact_method}</span>}
                      {lead.city_state && <span>Location: {lead.city_state}</span>}
                      {lead.interest && <span>Interested in: {lead.interest}</span>}
                      {lead.listing_slug && (
                        <span>
                          Car:{' '}
                          <Link className="text-rb-tx underline underline-offset-2" href={`/dealer/inventory/${lead.listing_slug}`}>
                            {lead.listing_title ?? lead.listing_slug}
                          </Link>
                        </span>
                      )}
                      {lead.source_page && <span>From: {lead.source_page}</span>}
                    </div>

                    {payload && <LeadPayload payload={payload} />}
                    {(lead.type === 'consignment' || fileCount) && (
                      <LeadFiles leadId={lead.id} expected={fileCount} />
                    )}

                    <button
                      type="button"
                      onClick={() => toggle(lead)}
                      className={
                        lead.status === 'new'
                          ? 'rb-btn-red bg-rb-red px-5 py-2.5 text-[11px] font-bold uppercase tracking-label text-white'
                          : 'rb-btn border border-rb-border px-5 py-2.5 text-[11px] font-bold uppercase tracking-label text-rb-tx-mute hover:text-rb-tx'
                      }
                    >
                      {lead.status === 'new' ? 'Mark handled' : 'Reopen'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
