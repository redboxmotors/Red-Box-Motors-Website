import { createClient } from '@supabase/supabase-js';
import { createServerClient as createSSRServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

type CookieToSet = { name: string; value: string; options?: CookieOptions };

// Server-side anon client for public reads in Server Components (listings,
// projects, sourced, images, placements, settings). No user session — RLS
// public-read policies apply (published rows only).
export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  );
}

// Cookie-aware session client for server components / server actions under
// /admin — the authenticated user's RLS applies. Pair with the middleware
// session refresh (src/middleware.ts).
export function createSessionClient() {
  const cookieStore = cookies();
  return createSSRServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component — middleware handles refresh.
          }
        },
      },
    },
  );
}

// Service-role client — bypasses RLS. Server-only. Never import into a client
// component. Used for lead submissions from the API route and admin utilities
// that must not depend on the caller's session.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );
}
