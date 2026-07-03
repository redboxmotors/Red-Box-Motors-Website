import { createSessionClient } from '@/lib/supabase/server';

// Per-action auth guard (admin-cms-build.md §5). Every admin server action
// calls this first — the middleware alone is not trusted. Being signed in is
// not enough: the user must be on the public.admins allowlist. RLS enforces
// the same via is_admin(); this check just fails fast with a clean error.
export async function requireUser() {
  const supabase = createSessionClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  const { data: admin, error } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle();
  // 42P01 = admins table absent (hardening patch not applied yet) — fall back
  // to session-only auth rather than locking the owner out; RLS still applies.
  if (error ? error.code !== '42P01' : !admin) {
    throw new Error('Unauthorized');
  }
  return { supabase, user };
}
