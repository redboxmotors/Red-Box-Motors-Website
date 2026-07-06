import type { Metadata } from 'next';
import { Archivo } from 'next/font/google';
import './globals.css';
import { FilmGrain } from '@/components/motion/FilmGrain';
import { RevealObserver } from '@/components/motion/RevealObserver';
import { IntroLoader } from '@/components/site/IntroLoader';
import { ContactModalProvider } from '@/components/contact/ContactModal';

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
    default: 'Red Box Motors — Exceptional Cars. Fully Managed. | Austin, TX',
    template: '%s — Red Box Motors',
  },
  description:
    'Exotic and collector vehicle sales, consignment, protection and customization — under one roof in Austin, Texas.',
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={archivo.variable}>
      <body className="bg-rb-bg font-sans text-rb-tx">
        <IntroLoader />
        <ContactModalProvider>{children}</ContactModalProvider>
        <FilmGrain />
        <RevealObserver />
      </body>
    </html>
  );
}
