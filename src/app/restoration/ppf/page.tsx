import type { Metadata } from 'next';
import { VisitAndFAQ } from '@/components/site/VisitAndFAQ';
import { ServiceScrollPage, type ServicePageContent } from '@/components/cosmetics/ServiceScrollPage';
import { SchemaScript } from '@/components/site/SchemaScript';
import { serviceSchema } from '@/lib/seo/schema';

// PPF.dc.html → /cosmetics/ppf. Copy is the approved prototype copy, verbatim.

export const revalidate = 60;

export const metadata: Metadata = {
  // Unpublished (owner revision) — unlinked from nav/sitemap, kept for later restore.
  robots: { index: false, follow: false },
  title: 'Paint Protection Film (PPF) Austin',
  description:
    'Self-healing STEK paint protection film — full-body and high-impact packages in Austin, TX.',
};

const content: ServicePageContent = {
  bg: { src: '/assets/ppf-hero.jpg', alt: '', position: 'center 56%' },
  kicker: '— Cosmetics · Paint Protection Film',
  hero: {
    src: '/assets/ppf-coverage.jpg',
    alt: 'Porsche GT2 RS protected with paint protection film, Austin TX',
    position: 'center 42%',
  },
  titleLines: ['Invisible armor', 'for your paint.'],
  sub: 'STEK self-healing paint protection film — precision-cut and installed in Austin, Texas.',
  ribbon: ['Self-healing', 'High-impact', 'Hydrophobic', 'Optically clear'],
  statement: {
    heading: 'The single best thing you can do for a car you actually drive.',
    paras: [
      'Paint protection film is a tough, optically clear urethane layer that takes the rock chips, road rash, bug etching and wash marring that would otherwise scar your paint — while its self-healing top coat erases light swirls with heat from the sun or warm water.',
      'We install STEK PPF, precision-cut for every panel with wrapped edges wherever possible — so the protection is there without ever changing how the car looks.',
    ],
  },
  properties: {
    kicker: '— Why the film works',
    items: [
      {
        title: 'Self-healing',
        text: 'The elastomeric top coat closes light swirls and wash marring on its own with heat from the sun or warm water.',
      },
      {
        title: 'High-impact',
        text: 'A thick urethane layer absorbs rock chips, road rash and bug etching before they ever reach the clear coat.',
      },
      {
        title: 'Hydrophobic',
        text: 'The surface sheds water, dirt and road film and resists chemical and bug staining — the car stays cleaner, longer.',
      },
      {
        title: 'Optically clear',
        text: 'Precision-cut with wrapped edges — no lifting, no seams, nothing that reads as anything but factory paint.',
      },
    ],
  },
  packages: {
    photo: {
      src: '/assets/ppf-hero.jpg',
      alt: 'Paint protection film install at Red Box Motors, Austin TX',
      position: 'center 45%',
    },
    kicker: '— Packages',
    heading: 'Coverage for how you drive.',
    note: 'Every panel mapped with you — mix and match as needed.',
    rows: [
      {
        kicker: '01 · Front-end',
        title: 'High-impact',
        desc: 'The daily-driver essential — the zones that take the chips.',
        chips: [
          { label: 'Front bumper' },
          { label: 'Hood (partial / full)' },
          { label: 'Fenders' },
          { label: 'Mirrors' },
          { label: 'Headlights' },
        ],
      },
      {
        kicker: '02 · Track',
        title: 'Extended coverage',
        desc: 'Front-end plus the surfaces that catch debris at speed.',
        chips: [
          { label: 'Everything in Front-end', tone: 'dim' },
          { label: 'Rocker panels' },
          { label: 'A-pillars' },
          { label: 'Roof leading edge' },
          { label: 'Lower doors' },
          { label: 'Rear arches' },
        ],
      },
      {
        kicker: '03 · Full-body',
        title: 'Total protection',
        desc: 'Every painted surface wrapped — the most protection, completely invisible.',
        chips: [{ label: 'Every painted panel, wrapped edge to edge', tone: 'red' }],
      },
    ],
  },
  splits: [
    {
      photoSide: 'left',
      photo: {
        src: '/assets/ppf-disassembly.jpg',
        alt: 'Ford Raptor disassembled for paint protection film install',
        position: 'center 50%',
      },
      minHeight: 440,
      caption: 'In the bay · panels off',
      kicker: '— How we install',
      heading: 'We take the car apart to wrap it right.',
      headingMax: '16ch',
      paras: [
        "A seamless install can't happen with everything bolted on. We disassemble the car so the film tucks behind every edge instead of stopping at it — removing badges and emblems, lights, mirror caps, trim and grilles, and pulling bumpers, spoilers and panels where the wrap needs to wrap.",
        'With the parts off, edges are wrapped, gaps are tucked and relief cuts stay hidden — then everything goes back together torqued to spec. The result reads as factory paint: no lifting, no visible seams, nothing to catch a fingernail.',
      ],
      chips: [
        { label: 'Badges & emblems' },
        { label: 'Lights' },
        { label: 'Mirror caps' },
        { label: 'Trim & grilles' },
        { label: 'Bumpers' },
        { label: 'Spoilers' },
      ],
    },
    {
      photoSide: 'right',
      photo: {
        src: '/assets/placeholders/detail-bay.jpg',
        alt: 'Color-change paint protection film',
        position: 'center 54%',
      },
      minHeight: 420,
      caption: 'STEK · protect + transform · reversible',
      kicker: '— Color-change PPF',
      heading: 'Change the color. Keep the protection.',
      headingMax: '15ch',
      paras: [
        'STEK colored and finish-changing paint protection film transforms the look of the car and armors it at the same time — one film doing two jobs. Go gloss to satin or matte, shift to a whole new color, or add a brushed or color-flip finish, all over the same self-healing, chip-resistant urethane.',
        "Because it's film, not paint, the factory finish stays untouched underneath and the change is fully reversible — ideal for a lease, a resale plan, or simply a new look without committing to a respray.",
      ],
      chips: [
        { label: 'Gloss' },
        { label: 'Satin' },
        { label: 'Matte' },
        { label: 'Brushed' },
        { label: 'Color-shift' },
      ],
      chipsUppercase: true,
    },
  ],
  cta: {
    variant: 'wrap',
    photoAlt: 'Book paint protection film',
    kicker: '— Protect it',
    heading: 'Armor it before the first chip.',
    text: "Tell us the car and how you drive it, and we'll map the right STEK coverage — front-end, track or full-body.",
    secondary: { label: 'Add ceramic →', href: '/restoration/ceramic-correction' },
  },
};

export default function PpfPage() {
  return (
    <>
      <SchemaScript schema={serviceSchema('Paint Protection Film', 'Self-healing STEK paint protection film — full-body and high-impact packages in Austin, TX.', '/restoration/ppf')} />
      <ServiceScrollPage content={content} visitAndFaq={<VisitAndFAQ division="cosmetics" />} />
    </>
  );
}
