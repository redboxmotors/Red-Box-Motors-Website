'use client';

import { FormEvent, Suspense, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

// /admin/login — email + password via Supabase Auth (admin-cms-build.md §3a).
// Supabase applies server-side rate limits to auth endpoints; we add a small
// client-side backoff after repeated failures.
function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const failures = useRef(0);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);

    // simple client-side throttle: 2s extra wait per failure beyond the first
    if (failures.current > 0) {
      await new Promise((r) => setTimeout(r, Math.min(failures.current * 2000, 8000)));
    }

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      failures.current += 1;
      setError('Sign-in failed. Check your email and password.');
      setBusy(false);
      return;
    }

    failures.current = 0;
    const next = params.get('next');
    router.replace(next && next.startsWith('/admin') ? next : '/admin');
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-rb-bg px-6">
      <div className="w-full max-w-sm bg-rb-surface p-10 shadow-rb-box">
        {/* Logo block */}
        <div className="mb-10 inline-block bg-rb-red px-3 py-2">
          <span className="text-[11px] font-semibold uppercase text-white" style={{ letterSpacing: '2.5px' }}>
            Red Box Motors
          </span>
        </div>

        <h1 className="mb-1 text-[22px] font-semibold tracking-tight text-rb-tx">Admin</h1>
        <p className="mb-8 text-[13px] font-medium text-rb-tx-faint">Sign in to manage the site.</p>

        <form onSubmit={onSubmit} noValidate>
          <label className="rb-label mb-2 block" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-6 w-full border-0 border-b border-rb-border bg-transparent px-0 py-3 text-[15px] font-medium text-rb-tx outline-none transition-colors placeholder:text-rb-tx-faint-2 focus:border-rb-red"
          />

          <label className="rb-label mb-2 block" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-8 w-full border-0 border-b border-rb-border bg-transparent px-0 py-3 text-[15px] font-medium text-rb-tx outline-none transition-colors placeholder:text-rb-tx-faint-2 focus:border-rb-red"
          />

          {error && (
            <p role="alert" className="mb-6 border-l-2 border-rb-red pl-3 text-[13px] font-medium text-rb-tx-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="rb-btn-red w-full bg-rb-red px-7 py-4 text-[11px] font-bold uppercase tracking-label text-white disabled:opacity-60"
          >
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
