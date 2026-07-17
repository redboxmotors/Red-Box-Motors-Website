import type { Metadata } from 'next';
import Link from 'next/link';
import { ContactLink } from '@/components/contact/ContactModal';
import { SiteNav } from '@/components/site/SiteNav';
import { VisitAndFAQ } from '@/components/site/VisitAndFAQ';
import { ExpandingScrollBox, TintSection } from '@/components/site/ExpandingScrollBox';
import { RandomBackdrop } from '@/components/site/RandomBackdrop';
import { serviceSchema, jsonLd } from '@/lib/seo/schema';

// /cosmetics/custom-builds — Custom Builds.dc.html. Full SEO scroll page: no
// hero, opens straight into the expanding box's faded mini-hero photo. Copy is
// approved prototype copy — verbatim.

export const revalidate = 60;

export const metadata: Metadata = {
  // Unpublished (owner revision) — unlinked from nav/sitemap, kept for later restore.
  robots: { index: false, follow: false },
  title: 'Custom Builds & Modifications',
  description: 'Custom builds, aero, wheels and modifications, executed end to end in Austin, TX.',
  openGraph: {
    title: 'Custom Builds & Modifications, Red Box Motors',
    description:
      'Custom builds, aero, wheels and modifications, executed end to end in Austin, TX.',
    type: 'website',
  },
};

// Approved build-menu content from the prototype (BUILDS in the DC script).
const BUILDS: { id: string; tag: string; name: string; desc: string; chips: string[] }[] = [
  {
    id: 'body',
    tag: 'body kits',
    name: 'Widebody & Body Kits',
    desc: 'Bolt-on and fully-fitted widebody conversions, aero and complete kits, fitted, blended and painted to match.',
    chips: ['Liberty Walk', 'Brabus', 'LART'],
  },
  {
    id: 'wheels',
    tag: 'wheels',
    name: 'Custom Wheels',
    desc: 'One-off forged sets, refinishing and fitment dialed to the car and the stance.',
    chips: ['Forged', 'Refinished', 'Fitment'],
  },
  {
    id: 'interior',
    tag: 'interior',
    name: 'Full Interior',
    desc: 'Interiors rebuilt from the shell out, leather, Alcantara, carbon and custom trim.',
    chips: ['Retrim', 'Leather', 'Carbon'],
  },
  {
    id: 'audio',
    tag: 'audio',
    name: 'Sound Systems',
    desc: 'Complete audio builds, head units, amplification, speakers and sound deadening, installed clean.',
    chips: ['Head units', 'Amps', 'Deadening'],
  },
  {
    id: 'exhaust',
    tag: 'exhaust',
    name: 'Exhaust',
    desc: 'Note, tone and flow, cat-back, valved and titanium systems fitted end to end.',
    chips: ['Cat-back', 'Valved', 'Titanium'],
  },
  {
    id: 'stance',
    tag: 'stance',
    name: 'Stance & Fitment',
    desc: 'Ride height, suspension and air, the mechanical work coordinated to land the look.',
    chips: ['Suspension', 'Air ride', 'Coordinated'],
  },
];

const ROOF_LIST = [
  'Widebody & body kits',
  'Custom & forged wheels',
  'Full interior retrim',
  'Sound systems',
  'Exhaust, stance & fitment',
];

const STEPS: { title: string; body: string }[] = [
  {
    title: 'Concept',
    body: 'We start with the vision, stance, finish, kit and the details, then translate it into a build plan: parts sourced, disciplines sequenced and a realistic timeline set before anything comes apart.',
  },
  {
    title: 'Build',
    body: 'Kit fitment and bodywork, paint and blend, PPF and vinyl, wheel refinishing, interior, audio and exhaust are executed in the right order, in-house, so nothing gets undone by the next stage.',
  },
  {
    title: 'Deliver',
    body: 'The finished car is corrected, protected and fully detailed, then documented and handed back complete, road-ready and exactly as planned, not almost.',
  },
];

function ArrowUpRight({ size = 15, stroke = '#fff' }: { size?: number; stroke?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M4 12L12 4M12 4H5.2M12 4V10.8" stroke={stroke} strokeWidth="1.5" />
    </svg>
  );
}

export default function CustomBuildsPage() {
  return (
    <div className="relative bg-rb-bg font-sans text-white antialiased">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          serviceSchema(
            'Custom Builds & Modifications',
            'Custom builds, aero, wheels and modifications, executed end to end in Austin, TX.',
            '/restoration/custom-builds',
          ),
        )}
      />

      {/* fixed blurred background (random hero per load) + dim */}
      <RandomBackdrop />
      <div className="rb-bg-dim" />

      <SiteNav current="cosmetics" />

      <div
        className="rb-noscrollbar relative z-[1] bg-transparent md:h-screen md:overflow-y-auto md:snap-y md:snap-proximity"
      >
        <ExpandingScrollBox>
          {/* PHOTO HEADER */}
          <div className="relative h-[400px] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/hero-lineup.jpeg"
              alt="Custom builds, Austin TX"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: 'center 52%' }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.10)_0%,rgba(10,10,10,0.04)_40%,rgba(10,10,10,0.55)_74%,rgba(10,10,10,0.92)_92%,#0A0A0A_100%)]" />
            <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-6 px-6 pb-[34px] md:px-12">
              <div>
                <div className="mb-4 font-mono text-[11px] uppercase tracking-[4px] text-rb-red">
                  Cosmetics · Custom Builds
                </div>
                <h1
                  className="m-0 font-bold text-white"
                  style={{ fontSize: 'clamp(36px,4.8vw,66px)', letterSpacing: '-0.04em', lineHeight: 0.96 }}
                >
                  Built to your spec.
                </h1>
                <p
                  className="mb-0 mt-[18px] max-w-[640px] text-[15px] leading-relaxed text-[#c4c4c4]"
                  style={{ letterSpacing: '0.2px', textShadow: '0 1px 20px rgba(0,0,0,0.7)' }}
                >
                  Widebody kits, wheels, interiors, audio and exhaust, planned as one car and
                  executed under one roof in Austin, Texas.
                </p>
              </div>
              <Link
                href="/restoration"
                className="inline-flex items-center gap-[9px] whitespace-nowrap text-[12.5px] tracking-[1.5px] text-rb-tx-mute transition-colors duration-150 hover:text-white"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.3" />
                </svg>
                Cosmetics overview
              </Link>
            </div>
          </div>

          {/* SECTION LABEL */}
          <div
            data-reveal
            className="flex flex-wrap items-end justify-between gap-5 px-6 pb-6 pt-11 md:px-12"
          >
            <div>
              <div className="mb-[13px] font-mono text-[11px] uppercase tracking-[4px] text-rb-red">
                What goes into a build
              </div>
              <h2
                className="m-0 font-bold text-white"
                style={{ fontSize: 'clamp(26px,3.4vw,46px)', letterSpacing: '-0.03em', lineHeight: 1 }}
              >
                Pick a direction, or all of it.
              </h2>
            </div>
            <span className="max-w-[34ch] text-right font-mono text-[11px] tracking-[1px] text-rb-tx-faint">
              Every discipline in-house, planned together, not bolted on after.
            </span>
          </div>

          {/* BUILD MENU */}
          <div className="mx-6 grid grid-cols-1 gap-2 bg-black p-3 md:mx-12 md:grid-cols-2 lg:grid-cols-3">
            {BUILDS.map((b, i) => (
              <div
                key={b.id}
                className="relative z-[1] h-[320px] cursor-pointer overflow-hidden bg-rb-surface transition-[transform,box-shadow,filter] duration-tile ease-rb hover:z-[5] hover:-translate-y-1.5 hover:scale-[1.03] hover:shadow-[0_22px_44px_rgba(0,0,0,0.62),0_8px_18px_rgba(0,0,0,0.5)] hover:brightness-[1.14]"
              >
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(135deg,#171717 0,#171717 11px,#101010 11px,#101010 22px)',
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 h-[78%] bg-[linear-gradient(transparent,rgba(0,0,0,0.62)_40%,rgba(0,0,0,0.95))]" />
                <div className="absolute left-4 top-4 font-mono text-[10px] uppercase tracking-[2px] text-[#4a4a4a]">
                  [ {b.tag} ]
                </div>
                <div className="absolute right-4 top-3.5 font-mono text-[11px] text-[#5a5a5a]">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="absolute inset-x-0 bottom-0 px-[22px] pb-6 pt-[22px]">
                  <div className="mb-2.5 text-[23px] font-semibold tracking-[-0.015em] text-white">
                    {b.name}
                  </div>
                  <p className="mb-4 mt-0 text-[13px] leading-[1.55] text-[#a4a4a4]">{b.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {b.chips.map((chip) => (
                      <span
                        key={chip}
                        className="border border-[#2e2e2e] bg-black/35 px-[9px] py-1 font-mono text-[10px] uppercase tracking-[0.5px] text-[#cfcfcf]"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* WIDEBODY + PROCESS */}
          <div className="mt-10">
            {/* full-bleed opener image, blended top & bottom */}
            <div
              data-reveal
              className="relative h-[300px] overflow-hidden"
              style={{ transitionDelay: '100ms' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/trust-gt3rs.jpeg"
                alt="Liberty Walk and Brabus widebody custom builds in Austin, TX"
                className="absolute inset-0 h-full w-full object-cover"
                style={{ objectPosition: 'center 56%' }}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,10,10,0.94)_0%,rgba(10,10,10,0.55)_50%,rgba(10,10,10,0.1)_100%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,#0A0A0A_0%,rgba(10,10,10,0.15)_22%,rgba(10,10,10,0.15)_62%,rgba(10,10,10,0.75)_88%,#0A0A0A_100%)]" />
              <div className="absolute bottom-0 left-0 top-0 flex max-w-[680px] flex-col justify-center px-6 md:px-12">
                <div className="mb-3.5 font-mono text-[11px] uppercase tracking-[3px] text-rb-red">
                  Widebody &amp; full builds
                </div>
                <div
                  className="font-bold text-white"
                  style={{ fontSize: 'clamp(26px,3.2vw,42px)', letterSpacing: '-0.03em', lineHeight: 1 }}
                >
                  Liberty Walk. Brabus. LART.
                </div>
                <p className="mb-0 mt-4 max-w-[540px] text-[14.5px] leading-[1.65] text-[#c4c4c4]">
                  Named widebody kit or a one-off vision, every conversion is fitted, blended and
                  painted to OEM standard, then wrapped, protected and set on the wheels to match.
                </p>
              </div>
            </div>

            {/* SEO editorial + numbered process */}
            <div className="px-6 pb-16 pt-14 md:px-12">
              <div
                data-reveal
                className="grid items-start gap-10 md:grid-cols-[1.15fr_1fr] md:gap-12"
              >
                <div>
                  <h2
                    className="m-0 mb-[22px] max-w-[20ch] font-bold text-white"
                    style={{ fontSize: 'clamp(26px,3.4vw,44px)', letterSpacing: '-0.03em', lineHeight: 1.04 }}
                  >
                    Ground-up custom builds, from concept to keys.
                  </h2>
                  <p className="mb-4 mt-0 text-[15px] leading-[1.75] text-[#a4a4a4]">
                    Red Box Motors builds complete, ground-up custom cars at our Austin, Texas shop,
                    From bolt-on aero to full Liberty Walk,
                    Brabus and LART widebody conversions, every kit is fitted and blended into the
                    bodywork, refinished in-house and protected, never simply screwed on and handed
                    back.
                  </p>
                  <p className="m-0 text-[15px] leading-[1.75] text-[#a4a4a4]">
                    Because bodywork, paint, STEK paint protection film, vinyl wraps, wheels,
                    interior, audio and exhaust all happen under one roof, the disciplines are
                    planned together instead of bolted on after the fact. One team scopes the car,
                    sequences the work and owns the result, so a full build looks as intentional as
                    a single detail.
                  </p>
                </div>
                <div className="border-l border-[#1f1f1f] pl-10">
                  <div className="mb-[18px] font-mono text-[11px] uppercase tracking-[3px] text-rb-tx-faint">
                    Under one roof
                  </div>
                  <div className="flex flex-col">
                    {ROOF_LIST.map((item, i) => (
                      <div
                        key={item}
                        className={`flex items-center gap-3 py-[13px] ${
                          i < ROOF_LIST.length - 1 ? 'border-b border-[#171717]' : ''
                        }`}
                      >
                        <span className="h-[5px] w-[5px] flex-none bg-rb-red" />
                        <span className="text-[14px] tracking-[0.2px] text-[#ddd]">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* numbered 1 2 3 */}
              <div
                data-reveal
                className="mt-14 grid gap-0.5 border-t border-[#1f1f1f] bg-rb-line pt-3.5 md:grid-cols-3"
                style={{ transitionDelay: '100ms' }}
              >
                {STEPS.map((step, i) => (
                  <div key={step.title} className="bg-rb-surface px-8 pb-[30px] pt-[34px]">
                    <div
                      className="mb-[18px] font-bold text-rb-red"
                      style={{ fontSize: 'clamp(44px,5vw,62px)', letterSpacing: '-0.04em', lineHeight: 1 }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div className="mb-3 text-[19px] font-bold tracking-tight text-white">
                      {step.title}
                    </div>
                    <p className="m-0 text-[14px] leading-[1.65] text-[#999]">{step.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div data-reveal style={{ transitionDelay: '100ms' }}>
          <TintSection tint className="flex flex-wrap border-t border-rb-line">
            <div className="relative min-h-[460px] min-w-[280px] flex-[1.05] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/get-in-touch.jpeg"
                alt="Start a custom build"
                className="absolute inset-0 h-full w-full object-cover"
                style={{ objectPosition: 'center 52%' }}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(16,16,16,0)_55%,rgba(16,16,16,0.55)_82%,rgba(16,16,16,0.95)_100%)]" />
              <div className="absolute bottom-0 left-0 px-[30px] py-[26px]">
                <div className="font-mono text-[11px] uppercase tracking-[3px] text-[#cfcfcf]">
                  Austin, TX
                </div>
              </div>
            </div>
            <div className="flex min-w-[300px] flex-1 flex-col justify-center px-6 py-[72px] md:px-14">
              <div className="mb-6 font-mono text-[11px] uppercase tracking-[4px] text-rb-red">
                Build it
              </div>
              <h2
                className="m-0 max-w-[13ch] font-extrabold text-white"
                style={{ fontSize: 'clamp(34px,4.4vw,64px)', letterSpacing: '-0.04em', lineHeight: 0.96 }}
              >
                Let&rsquo;s build it.
              </h2>
              <p className="mb-0 mt-[26px] max-w-[440px] text-[16px] font-medium leading-[1.7] text-rb-tx-mute">
                Bring us the car and the vision. We&rsquo;ll scope the build and manage it end to
                end.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-[18px]">
                <ContactLink
                  className="rb-btn-red inline-flex items-center gap-3 bg-rb-red px-7 py-4 text-[14px] font-semibold tracking-[0.5px] text-white"
                >
                  Start a build <ArrowUpRight />
                </ContactLink>
                <Link
                  href="/restoration/work"
                  className="text-[13px] tracking-[1.5px] text-rb-tx-mute transition-colors duration-150 hover:text-white"
                >
                  See recent work →
                </Link>
              </div>
              <div className="mt-[52px] flex items-center gap-[11px] border-t border-rb-line pt-[26px]">
                <span className="inline-flex bg-rb-red px-2.5 py-[7px]">
                  <span className="text-[10px] font-extrabold tracking-[2px] text-white">RBM</span>
                </span>
                <span className="text-[11px] uppercase tracking-[2px] text-rb-tx-faint">
                  Red Box Motors · Cosmetics
                </span>
              </div>
            </div>
          </TintSection>
          </div>

          <div className="border-t border-rb-line">
            <VisitAndFAQ division="cosmetics" />
          </div>
        </ExpandingScrollBox>
      </div>

      {/* fixed contact pill */}
      <ContactLink
        className="rb-corner-cta fixed right-[18px] z-40 md:right-[26px] flex items-center gap-[11px] border border-rb-border-2 bg-rb-surface px-[18px] py-[13px] transition-[border-color,background,transform,box-shadow] duration-btn ease-rb hover:-translate-y-[3px] hover:border-[#555] hover:bg-rb-raised hover:shadow-[0_14px_30px_rgba(0,0,0,0.55)] active:translate-y-0 active:scale-[0.98]"
      >
        <span className="h-[7px] w-[7px] flex-none bg-rb-red" />
        <span className="text-[12px] tracking-[1.5px] text-white">Contact</span>
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M4 12L12 4M12 4H5.2M12 4V10.8" stroke="#888" strokeWidth="1.3" />
        </svg>
      </ContactLink>
    </div>
  );
}
