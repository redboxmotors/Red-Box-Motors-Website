import type { Metadata } from 'next';
import { HomeShowcase } from '@/components/home/HomeShowcase';
import { HomeMobile } from '@/components/home/HomeMobile';
import { VisitAndFAQ } from '@/components/site/VisitAndFAQ';
import { getSurfaceCards } from '@/lib/public/content';
import { SchemaScript } from '@/components/site/SchemaScript';
import { localBusinessSchema } from '@/lib/seo/schema';
import { getSettings } from '@/lib/public/content';

export const revalidate = 60;

export const metadata: Metadata = {
  alternates: { canonical: '/' },
  title: { absolute: 'Red Box Motors · Exceptional Cars. One Trusted Partner. | Austin, TX' },
  description:
    'Exotic and collector vehicle sales, professional consignment representation, protection and customization in Austin, Texas.',
};

export default async function HomePage() {
  const featured = await getSurfaceCards('home_featured', 8);
  const settings = await getSettings();
  return (
    <>
      {/* Preload the backdrop poster frame so it paints as the LCP element while
          the video streams in (Next hoists these into <head>). Per-viewport so
          phones fetch the lighter mobile rendition, not the desktop poster. */}
      <link rel="preload" as="image" href="/assets/dealer-hero-poster-m.jpg" media="(max-width: 767px)" fetchPriority="high" />
      <link rel="preload" as="image" href="/assets/dealer-hero-poster.jpg" media="(min-width: 768px)" fetchPriority="high" />
      <SchemaScript schema={localBusinessSchema(settings)} />
      {/* Mobile-native homepage below md (design_handoff 2026-07-20); the
          desktop showcase is untouched above md. */}
      <HomeMobile phone={settings.phone} email={settings.email} />
      <div className="hidden md:block">
        <HomeShowcase featured={featured} visitAndFaq={<VisitAndFAQ division="all" />} />
      </div>
    </>
  );
}
