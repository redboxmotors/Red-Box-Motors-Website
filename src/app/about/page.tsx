import type { Metadata } from 'next';
import Link from 'next/link';
import { ContactLink } from '@/components/contact/ContactModal';
import { RandomBackdrop } from '@/components/site/RandomBackdrop';
import { ExpandingScrollBox, TintSection } from '@/components/site/ExpandingScrollBox';
import { SiteNav } from '@/components/site/SiteNav';
import { VisitAndFAQ } from '@/components/site/VisitAndFAQ';
import { SchemaScript } from '@/components/site/SchemaScript';
import { aboutPageSchema } from '@/lib/seo/schema';

// /about — the Red Box story. Personal, not a services rehash: origin →
// founder → evolution → ownership lifecycle → the Red Box Standard → team →
// credentials → facility → closing. This page carries the site's ONLY
// COTA-proximity mention (Facility & Location section). Owner copy where
// quoted — verbatim.

export const revalidate = 60;

export const metadata: Metadata = {
  alternates: { canonical: '/about' },
  title: 'About',
  description:
    'From Red Box Restoration to Red Box Motors, the story, the standard and the team behind a complete automotive company in Austin, Texas.',
};

const EASE = 'cubic-bezier(.2,.8,.2,1)';

function ArrowIcon({ size = 13, stroke = 'currentColor', width = 1.2 }: { size?: number; stroke?: string; width?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M4 12L12 4M12 4H5.2M12 4V10.8" stroke={stroke} strokeWidth={width} />
    </svg>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div data-reveal className="mb-[13px] font-mono text-[11px] uppercase tracking-[4px] text-rb-red">
      {children}
    </div>
  );
}

// Owner-specified operating principles — specific, not generic.
const STANDARD = [
  { title: 'Accountability', text: 'One team owns the outcome. If something is not right, we make it right.' },
  { title: 'Inspection & Documentation', text: 'Condition recorded before work begins and after it ends, photographs, notes and paperwork you can keep.' },
  { title: 'Clear Communication', text: 'You hear from us before decisions are made, not after. Scope, timeline and cost in writing.' },
  { title: 'Professional Preparation', text: 'Every service starts with proper prep, decontamination, correction and masking before anything is installed or applied.' },
  { title: 'Quality Materials & Processes', text: 'Premium films, coatings and processes we have trained and certified on, no shortcuts on what goes on your car.' },
  { title: 'Final Inspection', text: 'Nothing is delivered until it passes the same inspection we would want on our own cars.' },
  { title: 'Follow-Through', text: 'Aftercare guidance and a direct line to the people who did the work, the relationship does not end at delivery.' },
];

// Supportable credentials & partnerships only — no invented claims.
const CREDENTIALS = [
  { name: 'STEK', kind: 'Certified paint protection film installer' },
  { name: 'LEGEND', kind: 'Certified paint protection film installer' },
  { name: 'Carbon Collective', kind: 'Ceramic coating partner' },
  { name: 'ASE', kind: 'Automotive service certification' },
  { name: 'I-CAR Platinum', kind: 'Advanced collision-industry training' },
  { name: 'DuPont', kind: 'Automotive refinishing education' },
  { name: 'Advanced Detailing & Paint Correction', kind: 'Professional hands-on training' },
  { name: 'Six Sigma Black Belt', kind: 'Process discipline' },
  { name: '8Twelve Wheels', kind: 'Wheel partner' },
  { name: 'Forgiato', kind: 'Wheel partner' },
];

const LIFECYCLE = [
  { stage: 'Buy', text: 'Curated inventory and consignment representation through Sales & Consignment.' },
  { stage: 'Protect', text: 'PPF, ceramic coatings and correction before the miles go on.' },
  { stage: 'Maintain', text: 'Detailing and vehicle care that keep the finish at delivery standard.' },
  { stage: 'Enjoy', text: 'Tint, wheels, wraps and the specialty installations that make the car yours.' },
  { stage: 'Sell', text: 'Preparation, presentation and professional representation when it is time.' },
];

export default function AboutPage() {
  return (
    <div className="relative text-white">
      <SchemaScript schema={aboutPageSchema()} />
      <RandomBackdrop />
      <SiteNav current="about" />

      <main
        data-scroll-container
        className="rb-noscrollbar relative z-[1] bg-transparent md:h-screen md:overflow-y-auto md:snap-y md:snap-proximity"
      >
        <ExpandingScrollBox>
          {/* 1 · HERO — evolution from Red Box Restoration to Red Box Motors */}
          <div className="relative h-[440px] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/hero-lineup.jpeg"
              alt="Red Box Motors, Austin TX"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: 'center 52%' }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(180deg,rgba(10,10,10,0.10) 0%,rgba(10,10,10,0.04) 40%,rgba(10,10,10,0.55) 74%,rgba(10,10,10,0.92) 92%,#0A0A0A 100%)',
              }}
            />
            <div className="absolute inset-x-0 bottom-0 px-7 pb-[34px] md:px-[52px]">
              <h1 className="mb-4 font-mono text-[11px] uppercase tracking-[4px] text-rb-red">
                About Red Box Motors
              </h1>
              <div
                className="font-bold text-white"
                style={{ fontSize: 'clamp(34px,4.4vw,62px)', letterSpacing: '-0.04em', lineHeight: 0.98 }}
              >
                Same Obsessive Standards.
                <br />
                Bigger Vision.
              </div>
            </div>
          </div>

          <div className="px-7 pt-10 md:px-[52px]">
            <p
              data-reveal
              className="m-0 max-w-[760px] text-[17px] font-medium leading-[1.75] text-rb-tx-mute"
              style={{ transition: `opacity .9s ${EASE},transform .9s ${EASE}` }}
            >
              Red Box began with a simple belief: exceptional vehicles deserve more care, more
              attention and more accountability than the traditional automotive experience
              provides. What started as Red Box Restoration has evolved into Red Box Motors, a
              complete automotive company built around the ownership, protection, presentation and
              sale of enthusiast and collector vehicles.
            </p>
          </div>

          {/* 2 · ORIGIN STORY */}
          <TintSection tint>
            <div className="mt-12 grid gap-10 border-t border-rb-line px-7 pt-12 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:px-[52px]">
              <div>
                <Eyebrow>,  The origin</Eyebrow>
                <h2
                  data-reveal
                  className="m-0 max-w-[18ch] font-bold text-white"
                  style={{ fontSize: 'clamp(26px,3.4vw,46px)', letterSpacing: '-0.03em', lineHeight: 1.05 }}
                >
                  Trust was earned one panel at a time.
                </h2>
                <p data-reveal style={{ transitionDelay: '.1s' }} className="mb-0 mt-7 text-[15px] leading-[1.8] text-[#a2a2a2]">
                  Red Box Restoration first established itself through detailing, paint correction,
                  paint protection film, ceramic coatings and presentation work, the slow,
                  hands-on disciplines where the difference between good and exceptional lives in
                  the prep. The problem it solved was accountability: owners of serious cars had
                  plenty of places to drop a car off, and very few where one person owned the
                  result.
                </p>
                <p data-reveal style={{ transitionDelay: '.16s' }} className="mb-12 mt-5 text-[15px] leading-[1.8] text-[#a2a2a2]">
                  The work built trust, and trust changed the business. Clients began asking
                  Red Box to help sell vehicles, prepare new purchases for delivery and
                  coordinate transportation. Sales &amp; consignment did not replace the
                  restoration work, it grew out of it.
                </p>
              </div>
              <div className="relative mb-12 min-h-[300px] overflow-hidden bg-rb-surface-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/about-dino.jpeg"
                  alt="Classic Ferrari Dino cared for by Red Box"
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ objectPosition: 'center 52%' }}
                  loading="lazy"
                />
              </div>
            </div>
          </TintSection>

          {/* 3 · FOUNDER */}
          <TintSection tint>
            <div className="grid gap-10 border-t border-rb-line px-7 py-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:px-[52px]">
              <div className="relative min-h-[380px] overflow-hidden bg-rb-surface-4">
                {/* PLACEHOLDER — replace /public/assets/placeholders/founder-justin.jpg
                    with a professional photo of Justin McClung (same filename =
                    drop-in swap). */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/placeholders/founder-justin.jpg"
                  alt="Justin McClung, founder of Red Box Motors"
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 px-4 py-3">
                  <span className="font-mono text-[9px] uppercase tracking-[2px] text-[#555]">
                    Photography coming soon
                  </span>
                </div>
              </div>
              <div>
                <Eyebrow>,  The founder</Eyebrow>
                <h2
                  data-reveal
                  className="m-0 font-bold text-white"
                  style={{ fontSize: 'clamp(26px,3.4vw,46px)', letterSpacing: '-0.03em', lineHeight: 1.05 }}
                >
                  Justin McClung
                </h2>
                <p data-reveal style={{ transitionDelay: '.08s' }} className="mb-0 mt-6 text-[15px] leading-[1.8] text-[#a2a2a2]">
                  Justin&rsquo;s background is automotive through and through, including time with
                  Ford Motor Company and years spent evaluating automotive damage and repair
                  quality, learning exactly where corners get cut and what a proper repair looks
                  like from the inside. Add hands-on education in detailing and paint correction,
                  and you get a founder who can judge a panel with his own eyes and hands, not
                  just a checklist.
                </p>
                <p data-reveal style={{ transitionDelay: '.14s' }} className="mb-0 mt-5 text-[15px] leading-[1.8] text-[#a2a2a2]">
                  He founded Red Box because the cars he cared about deserved better than the
                  experience the industry offered. Today he sets the standard for the company:
                  quality control on the work that leaves the building, the client relationships
                  that built the business, and the direction that carries Red Box Restoration&rsquo;s
                  standards into Red Box Motors.
                </p>
              </div>
            </div>
          </TintSection>

          {/* 4 · COMPANY EVOLUTION */}
          <TintSection tint>
            <div className="border-t border-rb-line px-7 py-12 md:px-[52px]">
              <Eyebrow>,  The evolution</Eyebrow>
              <div data-reveal className="flex flex-wrap items-center gap-4">
                <span className="text-[24px] font-bold tracking-tight text-rb-tx-faint md:text-[32px]">
                  Red Box Restoration
                </span>
                <span className="text-rb-red">
                  <ArrowIcon size={26} width={1.6} />
                </span>
                <span className="text-[24px] font-bold tracking-tight text-white md:text-[32px]">
                  Red Box Motors
                </span>
              </div>
              <p data-reveal style={{ transitionDelay: '.1s' }} className="mb-0 mt-6 max-w-[760px] text-[15px] leading-[1.8] text-[#a2a2a2]">
                The company expanded from protection and restoration into professional vehicle
                sales and consignment, without abandoning the original standards. The restoration
                bay is still where every represented vehicle is prepared, and the same inspection
                discipline that built the brand now backs every transaction.
              </p>
            </div>
          </TintSection>

          {/* 5 · VEHICLE-OWNERSHIP LIFECYCLE */}
          <TintSection tint>
            <div className="border-t border-rb-line px-7 py-12 md:px-[52px]">
              <Eyebrow>,  One relationship, every stage</Eyebrow>
              <h2
                data-reveal
                className="m-0 font-bold text-white"
                style={{ fontSize: 'clamp(24px,3vw,40px)', letterSpacing: '-0.03em', lineHeight: 1.05 }}
              >
                Buy → Protect → Maintain → Enjoy → Sell
              </h2>
              <div data-reveal style={{ transitionDelay: '.1s' }} className="mt-9 grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-5">
                {LIFECYCLE.map((step, i) => (
                  <div key={step.stage} className="border-t border-rb-line-2 pt-4">
                    <div className="mb-2 flex items-baseline gap-2.5">
                      <span className="font-mono text-[11px] text-rb-red">{String(i + 1).padStart(2, '0')}</span>
                      <span className="text-[17px] font-semibold tracking-tight text-white">{step.stage}</span>
                    </div>
                    <p className="m-0 text-[13px] leading-[1.65] text-[#999]">{step.text}</p>
                  </div>
                ))}
              </div>
              <p data-reveal style={{ transitionDelay: '.16s' }} className="mb-0 mt-8 max-w-[720px] text-[14.5px] leading-[1.75] text-[#a2a2a2]">
                Red Box Motors is built to support each stage, so the shop that protected the car
                is the same one that presents it properly when it is time to move on.
              </p>
            </div>
          </TintSection>

          {/* 6 · THE RED BOX STANDARD */}
          <TintSection tint>
            <div className="border-t border-rb-line px-7 py-12 md:px-[52px]">
              <Eyebrow>,  The Red Box Standard</Eyebrow>
              <h2
                data-reveal
                className="m-0 max-w-[20ch] font-bold text-white"
                style={{ fontSize: 'clamp(26px,3.4vw,46px)', letterSpacing: '-0.03em', lineHeight: 1.05 }}
              >
                How the work actually gets done.
              </h2>
              <div data-reveal style={{ transitionDelay: '.1s' }} className="mt-9 grid gap-x-10 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
                {STANDARD.map((s) => (
                  <div key={s.title} className="border-t border-rb-line-2 pt-4">
                    <div className="mb-2 text-[14px] font-semibold uppercase tracking-[1px] text-rb-red">{s.title}</div>
                    <p className="m-0 text-[13.5px] leading-[1.7] text-[#999]">{s.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </TintSection>

          {/* 7 · TEAM — removed per owner checklist (2026-07-07): add back only
               when names, roles and biographies are complete. Prior placeholder
               scaffold is in git history. */}

          {/* 8 · CREDENTIALS & PARTNERSHIPS */}
          <TintSection tint>
            <div className="border-t border-rb-line px-7 py-12 md:px-[52px]">
              <Eyebrow>,  Credentials &amp; partnerships</Eyebrow>
              <div data-reveal className="grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-5">
                {CREDENTIALS.map((c) => (
                  <div key={c.name} className="border-t border-rb-line-2 pt-3.5">
                    <div className="text-[15px] font-semibold leading-snug tracking-tight text-white">{c.name}</div>
                    <div className="mt-1 text-[10.5px] uppercase tracking-[1.5px] text-rb-tx-faint">{c.kind}</div>
                  </div>
                ))}
              </div>
            </div>
          </TintSection>

          {/* 9 · FACILITY & LOCATION — the site's only COTA mention */}
          <div className="flex flex-col border-t border-rb-line md:flex-row">
            <div className="relative min-h-[300px] min-w-0 overflow-hidden md:min-h-[460px] md:flex-[1.05]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/get-in-touch.jpeg"
                alt="Red Box Motors facility, Austin TX"
                className="absolute inset-0 h-full w-full object-cover"
                style={{ objectPosition: 'center 52%' }}
                loading="lazy"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(90deg,rgba(10,10,10,0) 55%,rgba(10,10,10,0.55) 82%,rgba(10,10,10,0.95) 100%)',
                }}
              />
            </div>
            <div className="flex min-w-0 flex-col justify-center px-7 py-12 md:flex-1 md:px-14 md:py-[72px]">
              <Eyebrow>,  Facility &amp; location</Eyebrow>
              <h2
                className="m-0 max-w-[13ch] font-extrabold text-white"
                style={{ fontSize: 'clamp(30px,3.8vw,54px)', letterSpacing: '-0.04em', lineHeight: 0.98 }}
              >
                Austin, Texas.
              </h2>
              <p className="mb-0 mt-6 max-w-[460px] text-[15px] leading-[1.8] text-[#a2a2a2]">
                Showroom, restoration bay and consignment preparation share one building on the
                southeast side of Austin, minutes from Circuit of the Americas, close to the
                track days and events our clients actually drive to. Visits are by appointment.
              </p>
            </div>
          </div>

          {/* 10 · CLOSING — owner copy, verbatim */}
          <div className="border-t border-rb-line px-7 py-16 text-center md:px-[52px]">
            <h2
              data-reveal
              className="mx-auto my-0 max-w-[16ch] font-extrabold text-white"
              style={{ fontSize: 'clamp(32px,4.2vw,60px)', letterSpacing: '-0.04em', lineHeight: 0.98 }}
            >
              Your Car Is Part of the Story.
            </h2>
            <p
              data-reveal
              style={{ transitionDelay: '.1s' }}
              className="mx-auto mb-0 mt-7 max-w-[640px] text-[16px] font-medium leading-[1.75] text-rb-tx-mute"
            >
              Whether it is a newly purchased vehicle, a car you have owned for decades or one
              you are preparing to sell, Red Box Motors is built to provide one trusted
              relationship through every stage of ownership.
            </p>
            <div data-reveal style={{ transitionDelay: '.16s' }} className="mt-9 flex flex-wrap items-center justify-center gap-[18px]">
              <ContactLink className="rb-btn-red inline-flex items-center gap-3 bg-rb-red px-7 py-4 text-[14px] font-semibold tracking-[0.5px] text-white">
                Tell Us About Your Vehicle
                <ArrowIcon size={15} stroke="#fff" width={1.5} />
              </ContactLink>
              <Link
                href="/contact"
                className="rb-btn inline-flex items-center gap-2.5 border border-rb-red bg-transparent px-[26px] py-[15px] text-[13px] font-semibold tracking-[0.5px] text-rb-red transition-colors duration-[180ms] hover:bg-rb-red hover:text-white"
              >
                Visit Red Box Motors
              </Link>
            </div>
          </div>

          {/* VISIT & FAQ — bottom of scrolling section */}
          <div className="border-t border-rb-line">
            <VisitAndFAQ division="all" faqs={[]} />
          </div>
        </ExpandingScrollBox>
      </main>

      {/* STICKY INQUIRY CTA */}
      <ContactLink
        className="rb-corner-cta fixed right-[18px] z-40 md:right-[26px] flex items-center gap-[11px] border border-rb-border-2 bg-rb-surface px-[18px] py-[13px] transition-[border-color,background,transform,box-shadow] duration-btn ease-rb hover:-translate-y-[3px] hover:border-[#555] hover:bg-rb-raised hover:shadow-[0_14px_30px_rgba(0,0,0,0.55)] active:translate-y-0 active:scale-[0.98]"
      >
        <span className="h-[7px] w-[7px] flex-none bg-rb-red" />
        <span className="text-[12px] tracking-[1.5px] text-white">Contact Red Box Motors</span>
        <ArrowIcon stroke="#888" width={1.3} />
      </ContactLink>
    </div>
  );
}
