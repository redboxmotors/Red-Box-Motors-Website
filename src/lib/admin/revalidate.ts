import { revalidatePath } from 'next/cache';

// Any admin write revalidates the whole public tree (admin-cms-build.md §4).
// The Feature Bar / Visit & FAQ marquees mount on most pages, so targeted
// invalidation buys little at this site size and risks stale marquees.
export function revalidatePublic() {
  revalidatePath('/', 'layout');
}
