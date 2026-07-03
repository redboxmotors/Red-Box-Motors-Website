import Link from 'next/link';
import { createSessionClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

// Dashboard — counts + quick-create links (admin-cms-build.md §3b).
export default async function AdminDashboard() {
  const supabase = createSessionClient();

  const count = (table: string, filter?: (q: any) => any) => {
    let q: any = supabase.from(table).select('id', { count: 'exact', head: true });
    if (filter) q = filter(q);
    return q.then(({ count: c }: { count: number | null }) => c ?? 0);
  };

  const [forSale, comingSoon, sold, projects, sourced, drafts, newLeads] = await Promise.all([
    count('listings', (q) => q.eq('status', 'for_sale').is('deleted_at', null)),
    count('listings', (q) => q.eq('status', 'coming_soon').is('deleted_at', null)),
    count('listings', (q) => q.eq('status', 'sold').is('deleted_at', null)),
    count('projects', (q) => q.is('deleted_at', null)),
    count('sourced', (q) => q.is('deleted_at', null)),
    Promise.all([
      count('listings', (q) => q.eq('published', false).is('deleted_at', null)),
      count('projects', (q) => q.eq('published', false).is('deleted_at', null)),
      count('sourced', (q) => q.eq('published', false).is('deleted_at', null)),
    ]).then((xs) => xs.reduce((a, b) => a + b, 0)),
    count('leads', (q) => q.eq('status', 'new')),
  ]);

  const stats = [
    { label: 'For sale', value: forSale, href: '/admin/listings?status=for_sale' },
    { label: 'Coming soon', value: comingSoon, href: '/admin/listings?status=coming_soon' },
    { label: 'Sold', value: sold, href: '/admin/listings?status=sold' },
    { label: 'Projects', value: projects, href: '/admin/projects' },
    { label: 'Sourced', value: sourced, href: '/admin/sourced' },
    { label: 'Unpublished drafts', value: drafts, href: '/admin/listings' },
    { label: 'New leads', value: newLeads, href: '/admin/leads', accent: newLeads > 0 },
  ];

  return (
    <div>
      <h1 className="mb-8 text-[30px] font-semibold tracking-tight text-rb-tx">Dashboard</h1>

      <div className="mb-10 grid grid-cols-2 gap-px bg-rb-line md:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="group bg-rb-surface p-6 transition-colors hover:bg-rb-raised"
          >
            <p className={`text-[34px] font-semibold tracking-tight ${s.accent ? 'text-rb-red' : 'text-rb-tx'}`}>
              {s.value}
            </p>
            <p className="rb-label mt-1">{s.label}</p>
          </Link>
        ))}
      </div>

      <h2 className="rb-label mb-4">Quick actions</h2>
      <div className="flex flex-wrap gap-3">
        <Link href="/admin/listings/new" className="rb-btn-red bg-rb-red px-6 py-3.5 text-[11px] font-bold uppercase tracking-label text-white">
          ＋ New listing
        </Link>
        <Link href="/admin/projects/new" className="rb-btn border border-rb-border px-6 py-3.5 text-[11px] font-bold uppercase tracking-label text-rb-tx hover:bg-rb-raised-3">
          ＋ New project
        </Link>
        <Link href="/admin/sourced/new" className="rb-btn border border-rb-border px-6 py-3.5 text-[11px] font-bold uppercase tracking-label text-rb-tx hover:bg-rb-raised-3">
          ＋ New sourced car
        </Link>
        <Link href="/admin/placements" className="rb-btn border border-rb-border px-6 py-3.5 text-[11px] font-bold uppercase tracking-label text-rb-tx-mute hover:bg-rb-raised-3 hover:text-rb-tx">
          Manage placements
        </Link>
      </div>
    </div>
  );
}
