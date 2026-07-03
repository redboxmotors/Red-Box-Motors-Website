import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createSessionClient } from '@/lib/supabase/server';

// Admin shell — dark, sharp-edged, Archivo; clarity over marketing polish
// (admin-cms-build.md §3). The middleware already guards this tree; the
// layout re-checks so a stale render can't leak.
const NAV = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/listings', label: 'Listings' },
  { href: '/admin/projects', label: 'Projects' },
  { href: '/admin/sourced', label: 'Sourced' },
  { href: '/admin/placements', label: 'Placements' },
  { href: '/admin/leads', label: 'Leads' },
  { href: '/admin/settings', label: 'Settings' },
];

async function signOut() {
  'use server';
  const supabase = createSessionClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createSessionClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');

  return (
    <div className="flex min-h-screen bg-rb-bg">
      <aside className="flex w-56 shrink-0 flex-col border-r border-rb-line bg-rb-surface">
        <Link href="/admin" className="m-6 inline-block self-start bg-rb-red px-3 py-2">
          <span
            className="whitespace-nowrap text-[10px] font-semibold uppercase text-white"
            style={{ letterSpacing: '2.5px' }}
          >
            Red Box Motors
          </span>
        </Link>

        <nav className="flex flex-1 flex-col gap-1 px-3">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2.5 text-[12px] font-semibold uppercase tracking-label text-rb-tx-mute transition-colors hover:bg-rb-raised hover:text-rb-tx"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-rb-line p-3">
          <p className="truncate px-3 pb-2 text-[11px] font-medium text-rb-tx-faint">{user.email}</p>
          <form action={signOut}>
            <button
              type="submit"
              className="w-full px-3 py-2 text-left text-[12px] font-semibold uppercase tracking-label text-rb-tx-faint transition-colors hover:bg-rb-raised hover:text-rb-tx"
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <main className="min-w-0 flex-1 p-10">{children}</main>
    </div>
  );
}
