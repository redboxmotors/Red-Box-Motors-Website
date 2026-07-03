import type { Listing, Project } from '@/lib/db/types';
import { listingTitle } from '@/lib/db/types';
import type { SiteSettings } from '@/lib/public/content';

// JSON-LD builders (seo-map.md). FACTUAL FIELDS ONLY — no invented ratings,
// counts, warranty terms or price claims beyond what the CMS row states.

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export function localBusinessSchema(settings: SiteSettings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'AutoDealer',
    name: 'Red Box Motors',
    url: SITE,
    ...(settings.phone ? { telephone: settings.phone } : {}),
    ...(settings.email ? { email: settings.email } : {}),
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Austin',
      addressRegion: 'TX',
      addressCountry: 'US',
    },
    areaServed: 'Austin, TX',
  };
}

export function aboutPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About Red Box Motors',
    url: `${SITE}/about`,
    about: { '@type': 'AutoDealer', name: 'Red Box Motors' },
  };
}

export function contactPageSchema(settings: SiteSettings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Red Box Motors',
    url: `${SITE}/contact`,
    about: {
      '@type': 'AutoDealer',
      name: 'Red Box Motors',
      ...(settings.phone ? { telephone: settings.phone } : {}),
      ...(settings.email ? { email: settings.email } : {}),
    },
  };
}

export function collectionPageSchema(name: string, description: string, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url: `${SITE}${path}`,
  };
}

export function itemListSchema(listings: Listing[], imageByListing?: Map<string, string>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: listings.map((l, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE}/dealer/inventory/${l.slug}`,
      item: carSchema(l, imageByListing?.get(l.id) ? [imageByListing.get(l.id)!] : [], false),
    })),
  };
}

export function carSchema(listing: Listing, imageUrls: string[], withContext = true) {
  return {
    ...(withContext ? { '@context': 'https://schema.org' } : {}),
    '@type': 'Car',
    name: listingTitle(listing),
    brand: { '@type': 'Brand', name: listing.make },
    model: listing.model,
    ...(listing.engine ? { vehicleEngine: { '@type': 'EngineSpecification', name: listing.engine } } : {}),
    ...(listing.transmission ? { vehicleTransmission: listing.transmission } : {}),
    ...(listing.year ? { vehicleModelDate: String(listing.year) } : {}),
    ...(listing.mileage != null
      ? { mileageFromOdometer: { '@type': 'QuantitativeValue', value: listing.mileage, unitCode: 'SMI' } }
      : {}),
    ...(listing.exterior ? { color: listing.exterior } : {}),
    ...(listing.vin_public && listing.vin ? { vehicleIdentificationNumber: listing.vin } : {}),
    ...(imageUrls.length ? { image: imageUrls } : {}),
    ...(listing.price != null && listing.status === 'for_sale'
      ? {
          offers: {
            '@type': 'Offer',
            price: listing.price,
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            seller: { '@type': 'AutoDealer', name: 'Red Box Motors' },
          },
        }
      : {}),
  };
}

export function serviceSchema(name: string, description: string, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url: `${SITE}${path}`,
    provider: { '@type': 'AutoDealer', name: 'Red Box Motors' },
    areaServed: 'Austin, TX',
  };
}

export function projectArticleSchema(project: Project, imageUrls: string[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${project.title} — ${project.vehicle}`,
    ...(project.summary ? { description: project.summary } : {}),
    ...(imageUrls.length ? { image: imageUrls } : {}),
    datePublished: project.created_at,
    dateModified: project.updated_at,
    author: { '@type': 'Organization', name: 'Red Box Motors' },
  };
}

// Render helper: <script type="application/ld+json" …/>
export function jsonLd(schema: object): { __html: string } {
  return { __html: JSON.stringify(schema) };
}
