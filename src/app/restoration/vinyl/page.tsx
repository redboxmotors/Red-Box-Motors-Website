import type { Metadata } from 'next';
import { VisitAndFAQ } from '@/components/site/VisitAndFAQ';
import { ServiceScrollPage, type ServicePageContent } from '@/components/cosmetics/ServiceScrollPage';
import { SchemaScript } from '@/components/site/SchemaScript';
import { serviceSchema } from '@/lib/seo/schema';

// Vinyl.dc.html → /cosmetics/vinyl. Copy is the approved prototype copy, verbatim.

export const revalidate = 60;

export const metadata: Metadata = {
  // Unpublished (owner revision) — unlinked from nav/sitemap, kept for later restore.
  robots: { index: false, follow: false },
  title: 'Vinyl Wrap & Color Change Austin',
  description:
    'Color-change and custom vinyl wraps — reversible and paint-safe, in Austin, TX.',
};

const content: ServicePageContent = {
  bg: { src: '/assets/placeholders/detail-bay.jpg', alt: '', position: 'center 56%' },
  kicker: '— Cosmetics · Vinyl Wrap',
  hero: {
    src: '/assets/placeholders/detail-bay.jpg',
    alt: 'Vinyl wrap install, Austin TX',
    position: 'center 50%',
  },
  titleLines: ['A whole new look.', 'Fully reversible.'],
  sub: 'STEK color-change and finish films — installed in Austin, Texas.',
  ribbon: ['Color-change', 'Reversible', 'Any finish', 'Hand-laid'],
  statement: {
    heading: 'Change everything, without touching the paint.',
    paras: [
      'A vinyl wrap transforms the entire look of a car without a single drop of paint — color-change, satin, matte, gloss, chrome-delete and custom finishes, all applied over the factory surface.',
      "It's the cleanest way to reinvent a daily, a track car or a collectible, protect the paint underneath while you own it, and return the car to original for resale.",
    ],
  },
  properties: {
    kicker: '— Why wrap',
    items: [
      {
        title: 'Reversible',
        text: "Film sits on top of your paint — run a bold look for a season, then peel it and you're back to factory.",
      },
      {
        title: 'Any finish',
        text: 'Gloss, satin, matte, chrome-delete or a printed custom design across hundreds of colors.',
      },
      {
        title: 'Paint protected',
        text: "The original finish is shielded from UV, light chips and wash marring the whole time it's covered.",
      },
      {
        title: 'Hand-laid',
        text: 'Every panel cut and laid by hand with wrapped edges and clean gaps — no lifting, no bubbles, no seams.',
      },
    ],
  },
  packages: {
    photo: {
      src: '/assets/dealer-garage.jpeg',
      alt: 'Color-change vinyl wrap finishes',
      position: 'center 52%',
    },
    kicker: '— Finishes',
    heading: 'Every finish, done right.',
    note: "See samples in person — we'll map the wrap to your car.",
    rows: [
      {
        kicker: '01 · Color change',
        title: 'A new identity',
        desc: 'Full-body color across hundreds of shades.',
        chips: [
          { label: 'Gloss' },
          { label: 'Satin' },
          { label: 'Matte' },
          { label: 'Color-shift' },
        ],
      },
      {
        kicker: '02 · Accents',
        title: 'Chrome-delete & trim',
        desc: 'A tighter, modern look without a full wrap.',
        chips: [
          { label: 'Blackout trim' },
          { label: 'Roof & mirrors' },
          { label: 'Badges' },
          { label: 'Accent stripes' },
        ],
      },
      {
        kicker: '03 · Custom',
        title: 'Liveries & one-offs',
        desc: 'Bespoke designs built to your spec.',
        chips: [
          { label: 'Printed liveries' },
          { label: 'Two-tones' },
          { label: 'Design built to your spec', tone: 'red' },
        ],
      },
    ],
  },
  process: {
    heading: 'Prep, lay, finish.',
    steps: [
      {
        title: 'Prep',
        text: 'The paint is washed, decontaminated and corrected first — vinyl only looks as good as the surface under it, and clean paint lets the film bond and last.',
      },
      {
        title: 'Lay',
        text: 'Each panel is cut and laid by hand, heat-formed to the contours and worked out from the center so the film sits tight with no bubbles.',
      },
      {
        title: 'Finish',
        text: 'Edges are wrapped and tucked, panel gaps cleaned up and trim reset — so the wrap reads like the car came painted that way.',
      },
    ],
  },
  splits: [
    {
      photoSide: 'right',
      photo: {
        src: '/assets/hero-lineup.jpeg',
        alt: 'Wrapped cars by Red Box Motors',
        position: 'center 52%',
      },
      minHeight: 420,
      caption: 'STEK wrap · STEK PPF',
      kicker: '— Wrap + protect',
      heading: 'The new look, and long-term protection.',
      headingMax: '16ch',
      paras: [
        'Want both? We can lay STEK paint protection film first and wrap over it, or run a colored PPF that changes the finish and armors the paint in one layer — same shop, same standard, planned together so the surfaces work as a system.',
        'Prep is everything with vinyl — we correct and decontaminate the paint before a single panel is laid, so the finish is flawless and the film lasts.',
      ],
    },
  ],
  cta: {
    variant: 'flush',
    photoAlt: 'Book a vinyl wrap',
    kicker: '— Transform it',
    heading: 'Reinvent the car.',
    text: "Bring us the color or finish you have in mind — we'll show you samples and map the wrap to your car.",
    secondary: { label: 'Add PPF →', href: '/restoration/ppf' },
  },
};

export default function VinylPage() {
  return (
    <>
      <SchemaScript schema={serviceSchema('Vinyl Wrap & Color Change', 'Color-change and custom vinyl wraps — reversible and paint-safe, in Austin, TX.', '/restoration/vinyl')} />
      <ServiceScrollPage content={content} visitAndFaq={<VisitAndFAQ division="cosmetics" />} />
    </>
  );
}
