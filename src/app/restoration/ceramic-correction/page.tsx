import type { Metadata } from 'next';
import { VisitAndFAQ } from '@/components/site/VisitAndFAQ';
import { ServiceScrollPage, type ServicePageContent } from '@/components/cosmetics/ServiceScrollPage';
import { SchemaScript } from '@/components/site/SchemaScript';
import { serviceSchema } from '@/lib/seo/schema';

// Ceramic & Correction.dc.html → /cosmetics/ceramic-correction.
// Copy is the approved prototype copy, verbatim.

export const revalidate = 60;

export const metadata: Metadata = {
  // Unpublished (owner revision) — unlinked from nav/sitemap, kept for later restore.
  robots: { index: false, follow: false },
  title: 'Ceramic Coating & Paint Correction Austin',
  description:
    'Multi-stage paint correction and Carbon Collective ceramic coatings in Austin, TX.',
};

const content: ServicePageContent = {
  bg: { src: '/assets/trust-gt3rs.jpeg', alt: '', position: 'center 56%' },
  kicker: '— Cosmetics · Ceramic & Correction',
  hero: {
    src: '/assets/trust-gt3rs.jpeg',
    alt: 'Ceramic coating and paint correction, Austin TX',
    position: 'center 50%',
  },
  titleLines: ['Correct it.', 'Then lock it in.'],
  sub: 'Multi-stage paint correction and Carbon Collective ceramic coatings — Austin, Texas.',
  ribbon: ['Hydrophobic', 'Chemical-resistant', 'UV-resistant', 'Self-cleaning'],
  statement: {
    heading: 'A mirror finish is made in the paint, then sealed.',
    paras: [
      'Great gloss starts with the surface itself. We level swirls, holograms, wash marring and light scratches through multi-stage machine correction — bringing back the depth and clarity the factory finish is capable of.',
      'Then we seal that corrected paint with a Carbon Collective ceramic coating: a hard, hydrophobic layer that beads water, resists staining and UV fade, and makes the whole car far easier to keep clean for years.',
    ],
  },
  properties: {
    kicker: '— Why a coating works',
    items: [
      {
        title: 'Hydrophobic',
        text: 'Water and road film sheet off the surface instead of clinging, so the car self-rinses and dries spot-free.',
      },
      {
        title: 'Chemical & UV',
        text: 'A hard ceramic layer shrugs off bird-etch, fallout, bug acids and the UV fade that dulls unprotected clear coat.',
      },
      {
        title: 'Slick & clean',
        text: 'Dirt struggles to bond to the low-friction surface — cutting wash times and swirl risk every time you clean it.',
      },
      {
        title: 'Depth & gloss',
        text: 'Over freshly corrected paint, the coating adds a wet, mirror-clarity shine that holds for years, not weeks.',
      },
    ],
  },
  packages: {
    photo: {
      src: '/assets/ppf-hero.jpg',
      alt: 'Paint correction under inspection lighting',
      position: 'center 52%',
    },
    kicker: '— Packages',
    heading: 'Correction for the condition.',
    note: 'Paint assessed under controlled light — then the right number of stages.',
    rows: [
      {
        kicker: '01 · Enhancement',
        title: 'Single-stage gloss',
        desc: "A fast lift in clarity for paint that's in good shape.",
        chips: [
          { label: 'Wash & decon' },
          { label: 'Clay' },
          { label: 'One-step polish' },
          { label: 'Gloss boost' },
        ],
      },
      {
        kicker: '02 · Multi-stage',
        title: 'Full correction',
        desc: 'Chasing out deeper defects across compounding and refinement.',
        chips: [
          { label: 'Everything in Enhancement', tone: 'dim' },
          { label: 'Compounding' },
          { label: 'Refinement polishing' },
          { label: 'Swirl & hologram removal' },
        ],
      },
      {
        kicker: '03 · Show',
        title: 'Concours correction',
        desc: 'Maximum clarity — for show cars and flagship finishes.',
        chips: [
          { label: 'Everything in Multi-stage', tone: 'dim' },
          { label: 'Wet-sanding (as needed)' },
          { label: 'Paint metering & mapping' },
          { label: 'Sealed with a Carbon Collective ceramic', tone: 'red' },
        ],
      },
    ],
  },
  process: {
    heading: 'Three stages to a lasting finish.',
    steps: [
      {
        title: 'Decontaminate',
        text: 'Wash, clay and chemical decontamination strip bonded fallout and road grime so nothing gets ground into the paint before polishing.',
      },
      {
        title: 'Correct',
        text: 'Under controlled lighting we machine out swirls, holograms and marring across as many stages as the paint needs, then refine to full clarity.',
      },
      {
        title: 'Coat',
        text: 'The corrected surface is prepped and sealed with a Carbon Collective ceramic, then left to cure so the protection bonds hard.',
      },
    ],
  },
  splits: [
    {
      photoSide: 'right',
      photo: {
        src: '/assets/hero-lineup.jpeg',
        alt: 'Ceramic coating over paint protection film',
        position: 'center 52%',
      },
      minHeight: 420,
      caption: 'Carbon Collective ceramic · STEK PPF',
      kicker: '— Coating + film',
      heading: 'Coat the paint, or coat the film.',
      headingMax: '16ch',
      paras: [
        "A ceramic can seal bare corrected paint or go straight over STEK paint protection film. On a car already wearing PPF, the coating adds slickness and stain resistance to the film's impact protection — the two work as one system, and we plan them together.",
        "New delivery? We'll correct and coat before it ever sees a car wash, so the finish starts perfect and stays that way.",
      ],
    },
  ],
  cta: {
    variant: 'flush',
    photoAlt: 'Book ceramic coating',
    kicker: '— Perfect it',
    heading: 'Bring back the gloss.',
    text: "Tell us the car and its condition — we'll recommend the right correction and coating package.",
    secondary: { label: 'Add PPF →', href: '/restoration/ppf' },
  },
};

export default function CeramicCorrectionPage() {
  return (
    <>
      <SchemaScript schema={serviceSchema('Ceramic Coating & Paint Correction', 'Multi-stage paint correction and Carbon Collective ceramic coatings in Austin, TX.', '/restoration/ceramic-correction')} />
      <ServiceScrollPage content={content} visitAndFaq={<VisitAndFAQ division="cosmetics" />} />
    </>
  );
}
