import type { Metadata, Viewport } from 'next';
import { Archivo, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import { FilmGrain } from '@/components/motion/FilmGrain';
import { RevealObserver } from '@/components/motion/RevealObserver';
import { IntroLoader } from '@/components/site/IntroLoader';
import { ContactModalProvider } from '@/components/contact/ContactModal';
import { getSettings } from '@/lib/public/content';

// Archivo, weights 300–800 — the bold/thick direction (design-language.md §3);
// 800 carries the hero display lines and RBM badges.
const archivo = Archivo({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-sans',
});

// IBM Plex Mono — the mobile handoff's eyebrow/label/metadata face
// (design_handoff README "Typography"). Exposed as font-plex; the desktop
// prototypes keep the system mono stack (font-mono).
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Red Box Motors · Exceptional Cars. One Trusted Partner. | Austin, TX',
    template: '%s · Red Box Motors',
  },
  description:
    'Exotic and collector vehicle sales, professional consignment representation, protection and customization in Austin, Texas.',
  openGraph: {
    siteName: 'Red Box Motors',
    title: 'Red Box Motors',
    description: 'Sales & Consignment. Red Box Restoration. Austin, Texas.',
    type: 'website',
    url: siteUrl,
    images: ['/assets/hero-lineup.jpeg'],
  },
  twitter: {
    card: 'summary_large_image',
  },
};

// viewportFit: 'cover' is required for env(safe-area-inset-*) to resolve to
// real values on iOS notch/home-indicator devices — the fixed nav, contact
// modal and floating CTAs all lean on those insets (mobile pass 2026-07-17).
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#050505',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Shop phone for the urgent/high-value line under every form (forms spec).
  const settings = await getSettings();
  return (
    <html lang="en" className={`${archivo.variable} ${plexMono.variable}`}>
      <body className="bg-rb-bg font-sans text-rb-tx">
        <IntroLoader />
        <ContactModalProvider phone={settings.phone}>{children}</ContactModalProvider>
        <FilmGrain />
        <RevealObserver />
      </body>
    </html>
  );
}
