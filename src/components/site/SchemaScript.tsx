import { jsonLd } from '@/lib/seo/schema';

// JSON-LD structured data (seo-map.md). Server component — renders inline in
// the page body, which Google parses identically to <head> placement.
export function SchemaScript({ schema }: { schema: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(schema)} />;
}
