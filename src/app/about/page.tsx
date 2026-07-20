import type { Metadata } from 'next';
import Link from 'next/link';
import { ContactLink } from '@/components/contact/ContactModal';
import { SchemaScript } from '@/components/site/SchemaScript';
import { aboutPageSchema } from '@/lib/seo/schema';
import { getSettings } from '@/lib/public/content';
import { MobileShell } from '@/components/mobile/MobileShell';
import { MobileFooter } from '@/components/mobile/MobileFooter';
import { QuestionsLocation } from '@/components/mobile/QuestionsLocation';
import {
  ED,
  MArrow,
  MHero,
  MPhotoBand,
  mBtnOutlineCls,
  mBtnRedCls,
  mEyebrowCls,
  mEyebrowTightCls,
} from '@/components/mobile/ui';

// /about — rebuilt from the 2026-07 design handoff: mobile-native layout
// below md (About Mobile.dc.html) and the redesigned desktop layout above
// (About Desktop.dc.html — fixes the old page's dead space). Owner copy,
// verbatim. This page carries the site's ONLY COTA-proximity mention.

export const revalidate = 60;

export const metadata: Metadata = {
  alternates: { canonical: '/about' },
  title: 'About',
  description:
    'From Red Box Restoration to Red Box Motors, the story, the standard and the team behind a complete automotive company in Austin, Texas.',
};

// —— Owner copy (identical on both layouts) ——

const INTRO =
  'Red Box began with a simple belief: exceptional vehicles deserve more care, more attention and more accountability than the traditional automotive experience provides. What started as Red Box Restoration has evolved into Red Box Motors, a complete automotive company built around the ownership, protection, presentation and sale of enthusiast and collector vehicles.';

const ORIGIN_PARAS = [
  'Red Box Restoration first established itself through detailing, paint correction, paint protection film, ceramic coatings and presentation work, the slow, hands-on disciplines where the difference between good and exceptional lives in the prep. The problem it solved was accountability: owners of serious cars had plenty of places to drop a car off, and very few where one person owned the result.',
  'The work built trust, and trust changed the business. Clients began asking Red Box to help sell vehicles, prepare new purchases for delivery and coordinate transportation. Sales & consignment did not replace the restoration work, it grew out of it.',
];

const FOUNDER_PARAS = [
  'Justin’s background is automotive through and through, including time with Ford Motor Company and years spent evaluating automotive damage and repair quality, learning exactly where corners get cut and what a proper repair looks like from the inside. Add hands-on education in detailing and paint correction, and you get a founder who can judge a panel with his own eyes and hands, not just a checklist.',
  'He founded Red Box because the cars he cared about deserved better than the experience the industry offered. Today he sets the standard for the company: quality control on the work that leaves the building, the client relationships that built the business, and the direction that carries Red Box Restoration’s standards into Red Box Motors.',
];

const EVOLUTION_PARA =
  'The company expanded from protection and restoration into professional vehicle sales and consignment, without abandoning the original standards. The restoration bay is still where every represented vehicle is prepared, and the same inspection discipline that built the brand now backs every transaction.';

const LIFECYCLE = [
  { stage: 'Buy', text: 'Curated inventory and consignment representation through Sales & Consignment.' },
  { stage: 'Protect', text: 'PPF, ceramic coatings and correction before the miles go on.' },
  { stage: 'Maintain', text: 'Detailing and vehicle care that keep the finish at delivery standard.' },
  { stage: 'Enjoy', text: 'Tint, wheels, wraps and the specialty installations that make the car yours.' },
  { stage: 'Sell', text: 'Preparation, presentation and professional representation when it is time.' },
];

const LIFECYCLE_CLOSE =
  'Red Box Motors is built to support each stage, so the shop that protected the car is the same one that presents it properly when it is time to move on.';

const STANDARD = [
  { title: 'ACCOUNTABILITY', text: 'One team owns the outcome. If something is not right, we make it right.' },
  { title: 'INSPECTION & DOCUMENTATION', text: 'Condition recorded before work begins and after it ends, photographs, notes and paperwork you can keep.' },
  { title: 'CLEAR COMMUNICATION', text: 'You hear from us before decisions are made, not after. Scope, timeline and cost in writing.' },
  { title: 'PROFESSIONAL PREPARATION', text: 'Every service starts with proper prep, decontamination, correction and masking before anything is installed or applied.' },
  { title: 'QUALITY MATERIALS & PROCESSES', text: 'Premium films, coatings and processes we have trained and certified on, no shortcuts on what goes on your car.' },
  { title: 'FINAL INSPECTION', text: 'Nothing is delivered until it passes the same inspection we would want on our own cars.' },
  { title: 'FOLLOW-THROUGH', text: 'Aftercare guidance and a direct line to the people who did the work, the relationship does not end at delivery.' },
];

const CREDENTIALS = [
  { name: 'STEK', kind: 'CERTIFIED PAINT PROTECTION FILM INSTALLER' },
  { name: 'LEGEND', kind: 'CERTIFIED PAINT PROTECTION FILM INSTALLER' },
  { name: 'Carbon Collective', kind: 'CERAMIC COATING PARTNER' },
  { name: 'ASE', kind: 'AUTOMOTIVE SERVICE CERTIFICATION' },
  { name: 'I-CAR Platinum', kind: 'ADVANCED COLLISION-INDUSTRY TRAINING' },
  { name: 'DuPont', kind: 'AUTOMOTIVE REFINISHING EDUCATION' },
  { name: 'Advanced Detailing & Paint Correction', kind: 'PROFESSIONAL HANDS-ON TRAINING' },
  { name: 'Six Sigma Black Belt', kind: 'PROCESS DISCIPLINE' },
  { name: '8Twelve Wheels', kind: 'WHEEL PARTNER' },
  { name: 'Forgiato', kind: 'WHEEL PARTNER' },
];

const FACILITY_PARA =
  'Showroom, restoration bay and consignment preparation share one building on the southeast side of Austin, minutes from Circuit of the Americas, close to the track days and events our clients actually drive to. Visits are by appointment.';

const CLOSING_PARA =
  'Whether it is a newly purchased vehicle, a car you have owned for decades or one you are preparing to sell, Red Box Motors is built to provide one trusted relationship through every stage of ownership.';

const NAV_LINKS = [
  { label: 'Current Inventory', href: '/dealer/inventory' },
  { label: 'Sell Your Vehicle', href: '/dealer' },
  { label: 'Red Box Restoration', href: '/restoration' },
  { label: 'Recent Work', href: '/restoration/work' },
];

const dEyebrowCls = 'font-plex text-[11px] tracking-[0.32em] text-rb-red';

function LifecycleHeadline({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <h2 className={`m-0 font-extrabold tracking-tight text-white ${className ?? ''}`} style={style}>
      Buy <span className="text-rb-red">→</span> Protect <span className="text-rb-red">→</span>{' '}
      Maintain <span className="text-rb-red">→</span> Enjoy <span className="text-rb-red">→</span>{' '}
      Sell
    </h2>
  );
}

export default async function AboutPage() {
  const settings = await getSettings();
  const tel = (settings.phone ?? '').replace(/[^+\d]/g, '');

  return (
    <>
      <SchemaScript schema={aboutPageSchema()} />

      {/* ================= MOBILE (About Mobile.dc.html) ================= */}
      <MobileShell current="about">
        <MHero
          src="/assets/hero-lineup.jpeg"
          alt="Porsches at Red Box Motors, Austin TX"
          height={520}
          overlap={180}
          padBottom={48}
          position="center 52%"
        >
          <div className={mEyebrowTightCls}>ABOUT RED BOX MOTORS</div>
          <h1
            className="m-0 text-[40px] font-extrabold tracking-tight text-white"
            style={{ lineHeight: 1.04 }}
          >
            Same Obsessive Standards. Bigger Vision.
          </h1>
          <p className="m-0 text-[15px] leading-[1.7]" style={{ color: ED(0.78) }}>
            {INTRO}
          </p>
        </MHero>

        {/* Origin */}
        <section className="border-t border-white/[0.06]">
          <MPhotoBand
            src="/assets/about-dino.jpeg"
            alt="Classic Ferrari Dino cared for by Red Box"
            height={260}
            position="center 52%"
            gradient="linear-gradient(180deg, rgba(10,10,10,0) 55%, rgba(10,10,10,0.9) 92%, #0A0A0A 100%)"
          />
          <div data-reveal className="flex flex-col gap-4 px-5 pb-12 pt-[30px]">
            <div className={mEyebrowCls}>THE ORIGIN</div>
            <h2
              className="m-0 text-[34px] font-extrabold tracking-tight text-white"
              style={{ lineHeight: 1.06 }}
            >
              Trust was earned one panel at a time.
            </h2>
            {ORIGIN_PARAS.map((p) => (
              <p key={p.slice(0, 32)} className="m-0 text-[14px] leading-[1.7]" style={{ color: ED(0.72) }}>
                {p}
              </p>
            ))}
          </div>
        </section>

        {/* Founder */}
        <section className="border-t border-white/[0.06]">
          <MPhotoBand
            src="/assets/placeholders/founder-justin.jpg"
            alt="Justin McClung, founder of Red Box Motors"
            height={320}
            gradient="linear-gradient(180deg, rgba(10,10,10,0) 55%, rgba(10,10,10,0.9) 92%, #0A0A0A 100%)"
          />
          <div data-reveal className="flex flex-col gap-4 px-5 pb-12 pt-[30px]">
            <div className={mEyebrowCls}>THE FOUNDER</div>
            <h2
              className="m-0 text-[36px] font-extrabold tracking-tight text-white"
              style={{ lineHeight: 1.04 }}
            >
              Justin McClung
            </h2>
            {FOUNDER_PARAS.map((p) => (
              <p key={p.slice(0, 32)} className="m-0 text-[14px] leading-[1.7]" style={{ color: ED(0.72) }}>
                {p}
              </p>
            ))}
          </div>
        </section>

        {/* Evolution */}
        <section data-reveal className="flex flex-col gap-4 border-t border-white/[0.06] px-5 pb-12 pt-10">
          <div className={mEyebrowCls}>THE EVOLUTION</div>
          <div className="flex flex-col gap-1">
            <div className="text-[27px] font-extrabold tracking-tight text-[#6E6E6E]">
              Red Box Restoration
            </div>
            <div className="flex items-center gap-3">
              <div className="text-[22px] text-rb-red" aria-hidden>
                ↓
              </div>
              <div className="text-[27px] font-extrabold tracking-tight text-white">
                Red Box Motors
              </div>
            </div>
          </div>
          <p className="m-0 text-[14px] leading-[1.7]" style={{ color: ED(0.72) }}>
            {EVOLUTION_PARA}
          </p>
        </section>

        {/* Lifecycle */}
        <section data-reveal className="flex flex-col gap-[18px] border-t border-white/[0.06] px-5 pb-12 pt-10">
          <div className={mEyebrowCls}>ONE RELATIONSHIP, EVERY STAGE</div>
          <LifecycleHeadline className="text-[32px]" style={{ lineHeight: 1.15 }} />
          <div className="flex flex-col">
            {LIFECYCLE.map((s, i) => (
              <div key={s.stage} className="flex gap-4 border-t border-white/[0.08] py-[18px]">
                <div className="min-w-[26px] pt-[3px] font-plex text-[11px] text-rb-red">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="text-[17px] font-bold text-white">{s.stage}</div>
                  <div className="text-[13px] leading-[1.6]" style={{ color: ED(0.62) }}>
                    {s.text}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p
            className="m-0 border-t border-white/[0.08] pt-[18px] text-[14px] leading-[1.7]"
            style={{ color: ED(0.72) }}
          >
            {LIFECYCLE_CLOSE}
          </p>
        </section>

        {/* The Red Box Standard */}
        <section data-reveal className="flex flex-col gap-[18px] border-t border-white/[0.06] px-5 pb-12 pt-10">
          <div className={mEyebrowCls}>THE RED BOX STANDARD</div>
          <h2
            className="m-0 text-[34px] font-extrabold tracking-tight text-white"
            style={{ lineHeight: 1.06 }}
          >
            How the work actually gets done.
          </h2>
          <div className="flex flex-col">
            {STANDARD.map((s) => (
              <div key={s.title} className="flex flex-col gap-[7px] border-t border-white/[0.08] py-[18px]">
                <div className="font-plex text-[10px] tracking-[0.2em] text-rb-red">{s.title}</div>
                <div className="text-[14px] leading-[1.6]" style={{ color: ED(0.7) }}>
                  {s.text}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Credentials */}
        <section data-reveal className="flex flex-col gap-5 border-t border-white/[0.06] px-5 pb-12 pt-10">
          <div className={mEyebrowCls}>CREDENTIALS &amp; PARTNERSHIPS</div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-[22px]">
            {CREDENTIALS.map((c) => (
              <div key={c.name} className="flex flex-col gap-1.5 border-t border-white/10 pt-3">
                <div className="text-[16px] font-extrabold tracking-[-0.01em] text-white">
                  {c.name}
                </div>
                <div
                  className="font-plex text-[8.5px] tracking-[0.12em]"
                  style={{ color: ED(0.45), lineHeight: 1.6 }}
                >
                  {c.kind}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Facility */}
        <section className="border-t border-white/[0.06]">
          <MPhotoBand
            src="/assets/get-in-touch-m.jpg"
            alt="Red Box Motors facility, Austin TX"
            height={280}
            position="center 52%"
          />
          <div data-reveal className="flex flex-col gap-4 px-5 pb-12 pt-[30px]">
            <div className={mEyebrowCls}>FACILITY &amp; LOCATION</div>
            <h2
              className="m-0 text-[36px] font-extrabold tracking-tight text-white"
              style={{ lineHeight: 1.04 }}
            >
              Austin, Texas.
            </h2>
            <p className="m-0 text-[14px] leading-[1.7]" style={{ color: ED(0.72) }}>
              {FACILITY_PARA}
            </p>
          </div>
        </section>

        {/* Closing CTA */}
        <section data-reveal className="flex flex-col items-center gap-[18px] border-t border-white/[0.06] px-5 pb-14 pt-[52px] text-center">
          <h2
            className="m-0 text-[36px] font-extrabold tracking-tight text-white"
            style={{ lineHeight: 1.08, textWrap: 'balance' }}
          >
            Your Car Is Part of the Story.
          </h2>
          <p className="m-0 max-w-[320px] text-[15px] leading-[1.7]" style={{ color: ED(0.72) }}>
            {CLOSING_PARA}
          </p>
          <div className="mt-1.5 flex w-full flex-col gap-3">
            <ContactLink className={mBtnRedCls}>
              <span>Tell Us About Your Vehicle</span>
              <MArrow />
            </ContactLink>
            <Link href="/contact" className={mBtnOutlineCls}>
              <span>Visit Red Box Motors</span>
              <MArrow />
            </Link>
          </div>
        </section>

        <QuestionsLocation heading="FACILITY & CONTACT" />
        <MobileFooter phone={settings.phone} email={settings.email} />
      </MobileShell>

      {/* ================= DESKTOP (About Desktop.dc.html) ================= */}
      <div className="relative hidden overflow-hidden border-t-[3px] border-rb-red bg-rb-surface text-[#EDEDED] md:block">
        {/* NAV — static, per the redesign: logo left, six links right,
            active = red square + red underline */}
        <header className="relative z-[5] flex items-center justify-between bg-rb-surface px-8 py-[22px] xl:px-14">
          <Link href="/" className="flex items-center gap-3" aria-label="Red Box Motors, home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/brand/rbm-logo-header.png" alt="" className="h-5 w-5" />
            <span className="text-[13px] font-extrabold tracking-[0.22em] text-white">
              RED BOX MOTORS
            </span>
          </Link>
          <nav className="flex items-center gap-6 lg:gap-[34px]" aria-label="Site">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-[13px] tracking-[0.06em] transition-colors duration-150 hover:text-white"
                style={{ color: ED(0.7) }}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/about"
              aria-current="page"
              className="flex items-center gap-2 border-b-2 border-rb-red pb-[3px] text-[13px] font-bold tracking-[0.06em] text-white"
            >
              <span className="inline-block h-1.5 w-1.5 bg-rb-red" />
              About
            </Link>
            <ContactLink
              className="text-[13px] tracking-[0.06em] transition-colors duration-150 hover:text-white"
              style={{ color: ED(0.7) }}
            >
              Contact
            </ContactLink>
          </nav>
        </header>

        {/* HERO — 680px, headline bottom-left / intro bottom-right */}
        <section className="relative">
          <div className="relative h-[680px] w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/hero-lineup.jpeg"
              alt="Porsches at Red Box Motors, Austin TX"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: 'center 52%' }}
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'linear-gradient(180deg, rgba(10,10,10,0.4) 0%, rgba(10,10,10,0) 28%, rgba(10,10,10,0.35) 55%, rgba(10,10,10,0.95) 85%, #0A0A0A 100%)',
              }}
            />
            <div className="pointer-events-none absolute inset-x-8 bottom-14 grid grid-cols-[7fr_5fr] items-end gap-[60px] xl:inset-x-14">
              <div className="flex flex-col gap-[18px]">
                <div className={dEyebrowCls}>ABOUT RED BOX MOTORS</div>
                <h1
                  className="m-0 font-extrabold text-white"
                  style={{
                    fontSize: 'clamp(48px, 5vw, 72px)',
                    lineHeight: 1.0,
                    letterSpacing: '-0.025em',
                  }}
                >
                  Same Obsessive Standards.
                  <br />
                  Bigger Vision.
                </h1>
              </div>
              <p
                className="m-0 mb-1.5 max-w-[460px] text-[16px] leading-[1.7]"
                style={{ color: ED(0.8) }}
              >
                {INTRO}
              </p>
            </div>
          </div>
        </section>

        {/* ORIGIN — text left / image right */}
        <section className="grid grid-cols-2 items-center gap-12 border-t border-white/[0.06] px-8 py-24 xl:gap-[72px] xl:px-14">
          <div data-reveal className="flex max-w-[560px] flex-col gap-[22px]">
            <div className={dEyebrowCls}>THE ORIGIN</div>
            <h2
              className="m-0 font-extrabold tracking-tight text-white"
              style={{ fontSize: 'clamp(38px, 3.4vw, 48px)', lineHeight: 1.05 }}
            >
              Trust was earned one panel at a time.
            </h2>
            {ORIGIN_PARAS.map((p) => (
              <p key={p.slice(0, 32)} className="m-0 text-[15px] leading-[1.75]" style={{ color: ED(0.72) }}>
                {p}
              </p>
            ))}
          </div>
          <div className="relative h-[460px] w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/about-dino.jpeg"
              alt="Classic Ferrari Dino cared for by Red Box"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: 'center 52%' }}
              loading="lazy"
            />
          </div>
        </section>

        {/* FOUNDER — image left / text right on #0D0D0D */}
        <section className="grid grid-cols-[5fr_7fr] items-center gap-12 border-t border-white/[0.06] bg-rb-surface-3 px-8 py-24 xl:gap-[72px] xl:px-14">
          <div className="relative h-[520px] w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/placeholders/founder-justin.jpg"
              alt="Justin McClung, founder of Red Box Motors"
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div data-reveal className="flex max-w-[620px] flex-col gap-[22px]">
            <div className={dEyebrowCls}>THE FOUNDER</div>
            <h2
              className="m-0 font-extrabold tracking-tight text-white"
              style={{ fontSize: 'clamp(42px, 3.8vw, 54px)', lineHeight: 1.02 }}
            >
              Justin McClung
            </h2>
            {FOUNDER_PARAS.map((p) => (
              <p key={p.slice(0, 32)} className="m-0 text-[15px] leading-[1.75]" style={{ color: ED(0.72) }}>
                {p}
              </p>
            ))}
          </div>
        </section>

        {/* EVOLUTION — statement left / red-rule paragraph right */}
        <section className="grid grid-cols-[7fr_5fr] items-center gap-12 border-t border-white/[0.06] px-8 py-[88px] xl:gap-[72px] xl:px-14">
          <div data-reveal className="flex flex-col gap-5">
            <div className={dEyebrowCls}>THE EVOLUTION</div>
            <div className="flex flex-wrap items-baseline gap-[22px]">
              <div
                className="font-extrabold tracking-tight text-[#6E6E6E]"
                style={{ fontSize: 'clamp(34px, 3vw, 44px)' }}
              >
                Red Box Restoration
              </div>
              <div className="text-[30px] text-rb-red" aria-hidden>
                ↗
              </div>
              <div
                className="font-extrabold tracking-tight text-white"
                style={{ fontSize: 'clamp(34px, 3vw, 44px)' }}
              >
                Red Box Motors
              </div>
            </div>
          </div>
          <p
            data-reveal
            className="m-0 border-l-2 border-rb-red pl-7 text-[15px] leading-[1.75]"
            style={{ color: ED(0.72) }}
          >
            {EVOLUTION_PARA}
          </p>
        </section>

        {/* LIFECYCLE — 5-across on #0D0D0D */}
        <section className="flex flex-col gap-11 border-t border-white/[0.06] bg-rb-surface-3 px-8 py-24 xl:px-14">
          <div className="flex flex-col gap-[18px]">
            <div className={dEyebrowCls}>ONE RELATIONSHIP, EVERY STAGE</div>
            <LifecycleHeadline
              style={{ fontSize: 'clamp(38px, 3.9vw, 56px)', lineHeight: 1.04 }}
            />
          </div>
          <div data-reveal className="grid grid-cols-5 gap-8 max-lg:grid-cols-2">
            {LIFECYCLE.map((s, i) => (
              <div
                key={s.stage}
                className="flex flex-col gap-3 border-t border-white/[0.14] pt-[18px]"
              >
                <div className="flex items-baseline gap-2.5">
                  <div className="font-plex text-[11px] text-rb-red">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="text-[19px] font-bold text-white">{s.stage}</div>
                </div>
                <div className="text-[13.5px] leading-[1.65]" style={{ color: ED(0.62) }}>
                  {s.text}
                </div>
              </div>
            ))}
          </div>
          <p className="m-0 max-w-[640px] text-[15px] leading-[1.7]" style={{ color: ED(0.72) }}>
            {LIFECYCLE_CLOSE}
          </p>
        </section>

        {/* STANDARD — 3-col card grid with hairline gaps */}
        <section className="flex flex-col gap-[52px] border-t border-white/[0.06] px-8 py-24 xl:px-14">
          <div className="grid grid-cols-[5fr_7fr] items-end gap-[72px]">
            <div className="flex flex-col gap-[18px]">
              <div className={dEyebrowCls}>THE RED BOX STANDARD</div>
              <h2
                className="m-0 font-extrabold tracking-tight text-white"
                style={{ fontSize: 'clamp(38px, 3.4vw, 48px)', lineHeight: 1.05 }}
              >
                How the work actually gets done.
              </h2>
            </div>
            <div />
          </div>
          <div data-reveal className="grid grid-cols-3 gap-px border border-white/[0.08] bg-white/[0.08] max-lg:grid-cols-2">
            {STANDARD.map((s) => (
              <div
                key={s.title}
                className="flex min-h-[120px] flex-col gap-3 bg-rb-raised px-7 py-[30px]"
              >
                <div className="font-plex text-[10px] tracking-[0.2em] text-rb-red">{s.title}</div>
                <div className="text-[14px] leading-[1.65]" style={{ color: ED(0.7) }}>
                  {s.text}
                </div>
              </div>
            ))}
            <div className="flex items-end bg-rb-raised px-7 py-[30px]">
              <div className="flex items-center gap-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/brand/rbm-logo-header.png" alt="" className="h-4 w-4" />
                <div className="font-plex text-[9px] tracking-[0.22em]" style={{ color: ED(0.4) }}>
                  THE RED BOX STANDARD
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CREDENTIALS — 5-across */}
        <section className="flex flex-col gap-9 border-t border-white/[0.06] px-8 py-20 xl:px-14">
          <div className={dEyebrowCls}>CREDENTIALS &amp; PARTNERSHIPS</div>
          <div data-reveal className="grid grid-cols-5 gap-x-9 gap-y-10 max-lg:grid-cols-3">
            {CREDENTIALS.map((c) => (
              <div key={c.name} className="flex flex-col gap-2 border-t border-white/[0.12] pt-3.5">
                <div className="text-[17px] font-extrabold tracking-[-0.01em] text-white">
                  {c.name}
                </div>
                <div
                  className="font-plex text-[9px] tracking-[0.14em]"
                  style={{ color: ED(0.45), lineHeight: 1.6 }}
                >
                  {c.kind}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FACILITY — 50/50 image / text band */}
        <section className="grid grid-cols-2 items-stretch border-t border-white/[0.06]">
          <div className="relative min-h-[460px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/get-in-touch.jpeg"
              alt="Red Box Motors facility, Austin TX"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: 'center 52%' }}
              loading="lazy"
            />
          </div>
          <div data-reveal className="flex flex-col justify-center gap-5 bg-rb-surface-3 px-10 py-[88px] xl:px-[72px]">
            <div className={dEyebrowCls}>FACILITY &amp; LOCATION</div>
            <h2
              className="m-0 font-extrabold tracking-tight text-white"
              style={{ fontSize: 'clamp(40px, 3.6vw, 52px)', lineHeight: 1.02 }}
            >
              Austin, Texas.
            </h2>
            <p className="m-0 max-w-[480px] text-[15px] leading-[1.75]" style={{ color: ED(0.72) }}>
              {FACILITY_PARA}
            </p>
          </div>
        </section>

        {/* CTA — centered */}
        <section data-reveal className="flex flex-col items-center gap-[22px] border-t border-white/[0.06] px-8 py-[110px] text-center xl:px-14">
          <h2
            className="m-0 max-w-[720px] font-extrabold tracking-tight text-white"
            style={{ fontSize: 'clamp(44px, 4.2vw, 60px)', lineHeight: 1.05, textWrap: 'balance' }}
          >
            Your Car Is Part of the Story.
          </h2>
          <p className="m-0 max-w-[560px] text-[16px] leading-[1.75]" style={{ color: ED(0.72) }}>
            {CLOSING_PARA}
          </p>
          <div className="mt-2.5 flex gap-4">
            <ContactLink className="inline-flex items-center gap-3 bg-rb-red px-7 py-[17px] text-[14px] font-bold text-white transition-colors duration-150 hover:bg-[#E00000]">
              Tell Us About Your Vehicle <MArrow className="text-[14px]" />
            </ContactLink>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 border border-rb-red px-7 py-4 text-[14px] font-bold text-[#FF6B6B] transition-colors duration-150 hover:bg-[rgba(204,0,0,0.12)] hover:text-[#FF8888]"
            >
              Visit Red Box Motors
            </Link>
          </div>
        </section>

        {/* FACILITY & CONTACT footer */}
        <section className="border-t border-white/[0.08]">
          <div className="border-b border-white/[0.08] px-8 py-[26px] font-plex text-[12px] tracking-[0.3em] text-white xl:px-14">
            FACILITY &amp; CONTACT
          </div>
          <div className="grid grid-cols-[5fr_7fr] gap-[60px] px-8 py-11 xl:px-14">
            <div className="flex flex-col gap-3.5">
              <div className="flex items-center gap-2.5">
                <div className="h-2 w-2 bg-rb-red" />
                <div className="font-plex text-[10px] tracking-[0.3em] text-rb-red">LOCATION</div>
              </div>
              <div className="text-[30px] font-extrabold tracking-tight text-white">
                Austin, Texas
              </div>
              <div className="text-[14px]" style={{ color: ED(0.6) }}>
                Visits by appointment.
              </div>
              <div className="mt-1.5 flex flex-col">
                <div className="flex items-baseline justify-between gap-3 border-t border-white/[0.08] py-3.5">
                  <div className="text-[14px]" style={{ color: ED(0.85) }}>
                    Sales &amp; Consignment
                  </div>
                  <div className="font-plex text-[10px] tracking-[0.2em]" style={{ color: ED(0.5) }}>
                    NATIONWIDE
                  </div>
                </div>
                <div className="flex items-baseline justify-between gap-3 border-y border-white/[0.08] py-3.5">
                  <div className="text-[14px]" style={{ color: ED(0.85) }}>
                    Restoration &amp; Protection
                  </div>
                  <div className="font-plex text-[10px] tracking-[0.2em]" style={{ color: ED(0.5) }}>
                    AUSTIN
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center gap-[26px]">
              <div className="flex items-center gap-2.5">
                <div className="h-2 w-2 bg-rb-red" />
                <div className="font-plex text-[10px] tracking-[0.3em] text-rb-red">
                  TALK TO A PERSON
                </div>
              </div>
              <div className="flex flex-wrap items-end gap-10 xl:gap-14">
                <div className="flex flex-col gap-[5px]">
                  <div className="font-plex text-[9px] tracking-[0.28em]" style={{ color: ED(0.45) }}>
                    CALL
                  </div>
                  <a href={`tel:${tel}`} className="text-[21px] font-bold text-white">
                    {settings.phone}
                  </a>
                </div>
                <div className="flex flex-col gap-[5px]">
                  <div className="font-plex text-[9px] tracking-[0.28em]" style={{ color: ED(0.45) }}>
                    EMAIL
                  </div>
                  <a href={`mailto:${settings.email}`} className="text-[21px] font-bold text-white">
                    {settings.email}
                  </a>
                </div>
                <div className="flex flex-col gap-[5px]">
                  <div className="font-plex text-[9px] tracking-[0.28em]" style={{ color: ED(0.45) }}>
                    INSTAGRAM
                  </div>
                  <a
                    href="https://www.instagram.com/redboxmotors/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[21px] font-bold text-white"
                  >
                    @redboxmotors
                  </a>
                </div>
                <ContactLink className="ml-auto inline-flex items-center gap-3 bg-rb-red px-[26px] py-4 text-[14px] font-bold text-white transition-colors duration-150 hover:bg-[#E00000]">
                  Contact Red Box Motors <MArrow className="text-[14px]" />
                </ContactLink>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-white/[0.08] px-8 py-5 xl:px-14">
            <div className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/brand/rbm-logo-header.png" alt="" className="h-3.5 w-3.5" />
              <div className="font-plex text-[9px] tracking-[0.22em]" style={{ color: ED(0.45) }}>
                RED BOX MOTORS · AUSTIN, TEXAS
              </div>
            </div>
            <div className="font-plex text-[9px] tracking-[0.15em]" style={{ color: ED(0.3) }}>
              Sales &amp; Consignment · Restoration
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
