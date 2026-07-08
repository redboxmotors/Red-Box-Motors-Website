import type { MetadataRoute } from 'next';
import { getListings, getProjects, listingHref, projectHref } from '@/lib/public/content';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const revalidate = 3600;

// Unpublished routes (kept in code but unlinked + noindexed, restorable):
// /collection, /dealer/sold, /dealer/sourced, /cosmetics/{ppf,
// ceramic-correction, vinyl, wheels, custom-builds}.
const STATIC_ROUTES = [
  '/',
  '/about',
  '/contact',
  '/dealer',
  '/dealer/inventory',
  '/dealer/sell',
  '/restoration',
  '/restoration/work',
  '/restoration/estimate',
  '/privacy',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${SITE}${path}`,
    changeFrequency: path === '/' || path.endsWith('/inventory') ? 'daily' : 'weekly',
    priority: path === '/' ? 1 : 0.7,
  }));

  try {
    const [listings, projects] = await Promise.all([getListings(), getProjects()]);
    for (const l of listings) {
      if (l.status !== 'sold') {
        entries.push({
          url: `${SITE}${listingHref(l)}`,
          lastModified: l.updated_at,
          changeFrequency: 'daily',
          priority: 0.8,
        });
      }
    }
    for (const p of projects) {
      entries.push({
        url: `${SITE}${projectHref(p)}`,
        lastModified: p.updated_at,
        changeFrequency: 'weekly',
        priority: 0.6,
      });
    }
  } catch {
    // DB unreachable — ship the static routes.
  }

  return entries;
}
