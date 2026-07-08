import type { Metadata } from 'next';
import { Archivo } from 'next/font/google';
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Shop phone for the urgent/high-value line under every form (forms spec).
  const settings = await getSettings();
  return (
    <html lang="en" className={archivo.variable}>
      <body className="bg-rb-bg font-sans text-rb-tx">
        <IntroLoader />
        <ContactModalProvider phone={settings.phone}>{children}</ContactModalProvider>
        <FilmGrain />
        <RevealObserver />
      </body>
    </html>
  );
}
