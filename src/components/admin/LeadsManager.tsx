'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState, useTransition } from 'react';
import type { Lead } from '@/lib/db/types';
import { setLeadStatus } from '@/app/admin/(panel)/leads/actions';

// Leads inbox (admin-cms-build.md §3b "New leads"). Newest first, expandable
// message, mark handled / reopen. Contact + listing inquiries in one list —
// listing leads carry their car for attribution.

type Filter = 'all' | 'new' | 'handled';

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

export function LeadsManager({ leads }: { leads: Lead[] }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [filter, setFilter] = useState<Filter>('all');
  const [open, setOpen] = useState<string | null>(null);

  const shown = useMemo(
    () => (filter === 'all' ? leads : leads.filter((l) => l.status === filter)),
    [leads, filter],
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
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-[30px] font-semibold tracking-tight text-rb-tx">Leads</h1>
          <p className="mt-1 text-[13px] font-medium text-rb-tx-faint">
            {newCount > 0 ? `${newCount} new` : 'All caught up'} · contact + listing inquiries
          </p>
        </div>
        <div className="flex gap-1">
          {(['all', 'new', 'handled'] as Filter[]).map((f) => (
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

      {shown.length === 0 ? (
        <div className="border border-rb-line bg-rb-surface p-12 text-center">
          <p className="text-[13px] font-medium text-rb-tx-faint">
            {filter === 'all' ? 'No leads yet — they land here when the contact or inquiry forms are submitted.' : `No ${filter} leads.`}
          </p>
        </div>
      ) : (
        <div className="border border-rb-line">
          {shown.map((lead) => {
            const isOpen = open === lead.id;
            return (
              <div key={lead.id} className={`border-b border-rb-line last:border-b-0 ${lead.status === 'new' ? 'bg-rb-surface' : 'bg-rb-bg'}`}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : lead.id)}
                  className="grid w-full grid-cols-[10px_1.2fr_1.6fr_1fr_auto] items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-rb-raised"
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
                  <span className="min-w-0 truncate font-mono text-[10.5px] tracking-[0.5px] text-rb-tx-faint">
                    {lead.type === 'listing' ? (lead.listing_title ?? 'Listing inquiry') : (lead.interest ?? 'Contact')}
                  </span>
                  <span className="whitespace-nowrap font-mono text-[10.5px] text-rb-tx-faint-2">
                    {fmtDate(lead.created_at)}
                  </span>
                </button>

                {isOpen && (
                  <div className="border-t border-rb-line-2 bg-rb-surface-3 px-5 py-5">
                    <p className="mb-4 whitespace-pre-wrap text-[13.5px] leading-relaxed text-rb-tx-2">
                      {lead.message}
                    </p>
                    <div className="mb-5 grid gap-x-8 gap-y-2 text-[12px] font-medium text-rb-tx-mute md:grid-cols-2">
                      <span>Email: <a className="text-rb-tx underline underline-offset-2" href={`mailto:${lead.email}`}>{lead.email}</a></span>
                      {lead.phone && <span>Phone: <a className="text-rb-tx underline underline-offset-2" href={`tel:${lead.phone}`}>{lead.phone}</a></span>}
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
