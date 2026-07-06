import type { Metadata } from 'next';
import { HomeShowcase } from '@/components/home/HomeShowcase';
import { VisitAndFAQ } from '@/components/site/VisitAndFAQ';
import { getSurfaceCards } from '@/lib/public/content';
import { SchemaScript } from '@/components/site/SchemaScript';
import { localBusinessSchema } from '@/lib/seo/schema';
import { getSettings } from '@/lib/public/content';

export const revalidate = 60;

export const metadata: Metadata = {
  alternates: { canonical: '/' },
  title: { absolute: 'Red Box Motors — Exceptional Cars. Fully Managed. | Austin, TX' },
  description:
    'Exotic and collector vehicle sales, consignment, protection and customization — under one roof in Austin, Texas.',
};

export default async function HomePage() {
  const featured = await getSurfaceCards('home_featured', 8);
  const settings = await getSettings();
  return (
    <>
      {/* Preload the shared hero background so it paints with the first frame
          instead of popping in mid-animation on refresh (Next hoists this
          into <head>). */}
      <link rel="preload" as="image" href="/assets/hero-lineup.jpeg" fetchPriority="high" />
      <SchemaScript schema={localBusinessSchema(settings)} />
      <HomeShowcase featured={featured} visitAndFaq={<VisitAndFAQ division="all" />} />
    </>
  );
}
