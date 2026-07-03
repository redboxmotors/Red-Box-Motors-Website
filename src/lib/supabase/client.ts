'use client';

import { createBrowserClient } from '@supabase/ssr';

// Browser-side Supabase client (anon key). Used by client components such as
// the inquiry forms and the admin dashboard (auth + RLS-scoped reads/writes).
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
