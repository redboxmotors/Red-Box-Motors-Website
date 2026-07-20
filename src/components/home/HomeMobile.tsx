import Link from 'next/link';
import { ContactLink } from '@/components/contact/ContactModal';
import { BUYING_STEPS, CONSIGNMENT_STEPS } from '@/components/dealer/HowItWorksSection';
import { MobileShell } from '@/components/mobile/MobileShell';
import { MobileFooter } from '@/components/mobile/MobileFooter';
import { QuestionsLocation } from '@/components/mobile/QuestionsLocation';
import { DEFAULT_FAQ } from '@/components/site/VisitAndFAQ';
import {
  ED,
  MArrow,
  MBadge,
  MBtnRed,
  MH2,
  MHero,
  MPhotoBand,
  MTextLink,
  mBtnRedCls,
  mEyebrowCls,
} from '@/components/mobile/ui';

// Homepage Mobile (Homepage Mobile.dc.html): hero → What We Do → two pillar
// blocks → quick links → How It Works (Buying + Consignment tracks) →
// Where To Next → Questions & Location → footer. Owner copy, verbatim.

const QUICK_LINKS = [
  { href: '/dealer/inventory', title: 'INVENTORY', sub: 'Cars for sale now' },
  { href: '/restoration/work', title: 'RECENT WORK', sub: 'Project gallery' },
  { href: null, title: 'CONTACT US', sub: 'Reach the team' },
];

const EXPLORE_LINKS = [
  {
    href: '/dealer/inventory',
    title: 'Current Inventory',
    sub: 'Enthusiast and collector vehicles currently offered through Red Box Motors.',
  },
  {
    href: '/dealer',
    title: 'Sell Your Vehicle',
    sub: 'Professional consignment representation, from first conversation to delivery.',
  },
  {
    href: '/restoration',
    title: 'Red Box Restoration',
    sub: 'PPF, paint correction, ceramic coatings, wraps, tint, detailing, wheels and specialty installations.',
  },
  {
    href: '/restoration/work',
    title: 'Recent Work',
    sub: 'Recent protection, correction and transformation projects from the shop floor.',
  },
  {
    href: '/about',
    title: 'About',
    sub: 'The story, the standard and the facility behind Red Box Motors.',
  },
];

function Pillar({
  href,
  img,
  imgPos,
  overlayTitle,
  eyebrow,
  body,
  cta,
}: {
  href: string;
  img: string;
  imgPos: string;
  overlayTitle: string;
  eyebrow: string;
  body: string;
  cta: string;
}) {
  return (
    <div className="flex flex-col">
      <Link href={href} className="relative block h-[280px] w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img}
          alt={overlayTitle}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: imgPos }}
          loading="lazy"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(10,10,10,0) 45%, rgba(10,10,10,0.85) 100%)',
          }}
        />
        <div className="pointer-events-none absolute bottom-5 left-5 right-5">
          <div className="text-[26px] font-bold tracking-[-0.01em] text-white">{overlayTitle}</div>
        </div>
        <div className="pointer-events-none absolute right-4 top-4 text-[16px] text-white" aria-hidden>
          ↗
        </div>
      </Link>
      <div className="flex flex-col gap-3.5 px-5 pt-[22px]">
        <div className="h-0.5 w-full bg-rb-red" />
        <div className={`mt-1.5 font-plex text-[10px] tracking-[0.3em] text-rb-red`}>{eyebrow}</div>
        <p className="m-0 text-[15px] leading-[1.7]" style={{ color: ED(0.75) }}>
          {body}
        </p>
        <Link
          href={href}
          className="mt-1.5 inline-flex items-center justify-center gap-2.5 bg-rb-red px-5 py-[15px] text-[13px] font-bold tracking-[0.08em] text-white transition-colors duration-150 hover:bg-[#E00000]"
        >
          {cta} <MArrow className="text-[14px]" />
        </Link>
      </div>
    </div>
  );
}

function StepList({
  heading,
  tag,
  steps,
}: {
  heading: string;
  tag: string;
  steps: { num: string; title: string; desc: string }[];
}) {
  return (
    <>
      <div className="flex items-baseline justify-between gap-3 pb-3.5">
        <div className="text-[17px] font-extrabold tracking-[0.14em] text-white">{heading}</div>
        <div className="font-plex text-[9px] tracking-[0.25em]" style={{ color: ED(0.45) }}>
          {tag}
        </div>
      </div>
      {steps.map((s) => (
        <div key={s.num} className="flex gap-[18px] border-t border-white/[0.08] py-5">
          <div className="min-w-[46px] text-[30px] font-extrabold leading-none tracking-tight text-rb-red">
            {s.num}
          </div>
          <div className="flex flex-col gap-[7px]">
            <div className="text-[17px] font-bold text-white">{s.title}</div>
            <div className="text-[14px] leading-[1.6]" style={{ color: ED(0.65) }}>
              {s.desc}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export function HomeMobile({ phone, email }: { phone: string | null; email: string | null }) {
  return (
    <MobileShell current="">
      {/* ===== HERO ===== */}
      <MHero
        src="/assets/dealer-hero-poster-m.jpg"
        alt="Red Box Motors, Austin TX"
        height={640}
        overlap={230}
        padBottom={56}
        position="center 50%"
      >
        <MBadge>RED BOX MOTORS · AUSTIN TX</MBadge>
        <h1
          className="m-0 text-[42px] font-extrabold tracking-tight text-white"
          style={{ lineHeight: 1.02, textWrap: 'balance' }}
        >
          Exceptional Cars. One Trusted Partner.
        </h1>
        <p className="m-0 max-w-[320px] text-[15px] leading-[1.65]" style={{ color: ED(0.82) }}>
          Exotic and collector vehicle sales, professional consignment representation, protection
          and customization in Austin, Texas.
        </p>
        <div className="mt-1.5 flex w-full flex-col gap-3">
          <MBtnRed href="/dealer/inventory">View Inventory</MBtnRed>
          <Link
            href="/dealer"
            className="flex w-full items-center justify-between border border-rb-red px-5 py-4 text-[15px] font-bold text-[#FF6B6B] transition-colors duration-150 hover:bg-[rgba(204,0,0,0.12)] hover:text-[#FF8888]"
          >
            Sell Your Vehicle <MArrow />
          </Link>
          <MTextLink href="/restoration">Explore Restoration Services</MTextLink>
        </div>
      </MHero>

      {/* ===== WHAT WE DO ===== */}
      <section className="border-t border-white/[0.06]">
        <MPhotoBand
          src="/assets/home-one-facility-m.jpg"
          alt="Red Box Motors facility, Austin, Texas"
          height={300}
          position="center 60%"
          gradient="linear-gradient(180deg, rgba(10,10,10,0) 55%, rgba(10,10,10,0.9) 92%, #0A0A0A 100%)"
        />
        <div className="flex flex-col gap-[18px] px-5 pb-14 pt-9">
          <div className={mEyebrowCls}>WHAT WE DO</div>
          <MH2>
            <span className="text-white">One Facility.</span>
            <br />
            <span className="text-[#6E6E6E]">Every Discipline.</span>
          </MH2>
          <p className="m-0 text-[15px] leading-[1.7]" style={{ color: ED(0.75) }}>
            Red Box Motors brings vehicle sales, protection and customization together through one
            trusted automotive partner. From protecting a new delivery to representing a collector
            vehicle for sale, one accountable team can prepare, protect, present, represent and
            deliver your vehicle from start to finish.
          </p>
        </div>
      </section>

      {/* ===== TWO PILLARS ===== */}
      <section className="flex flex-col gap-12 pb-14">
        <Pillar
          href="/dealer/inventory"
          img="/assets/home-sales-tile-m.jpg"
          imgPos="center 62%"
          overlayTitle="Our Inventory"
          eyebrow="SALES & CONSIGNMENT"
          body="Curated inventory and professional consignment representation for enthusiast and collector vehicles, managed by one team from the first conversation through delivery."
          cta="VIEW INVENTORY"
        />
        <Pillar
          href="/restoration"
          img="/assets/home-protection-tile-m.jpg"
          imgPos="center 82%"
          overlayTitle="Protection & Customization"
          eyebrow="RED BOX RESTORATION"
          body="Paint protection film, ceramic coatings, paint correction, vinyl wraps, window tint, detailing, wheels and specialty automotive installations, completed to one exacting standard."
          cta="EXPLORE SERVICES"
        />
      </section>

      {/* ===== QUICK LINKS ===== */}
      <section className="flex flex-col gap-3 px-5 pb-14">
        {QUICK_LINKS.map((q) => {
          const inner = (
            <>
              <div className="flex h-[34px] w-[34px] flex-none items-center justify-center bg-rb-red">
                <div className="h-2.5 w-2.5 bg-white" />
              </div>
              <div className="flex flex-1 flex-col gap-[3px] text-left">
                <div className="text-[14px] font-bold tracking-[0.12em] text-white">{q.title}</div>
                <div className="text-[13px]" style={{ color: ED(0.55) }}>
                  {q.sub}
                </div>
              </div>
              <div className="text-[14px]" style={{ color: ED(0.4) }} aria-hidden>
                ↗
              </div>
            </>
          );
          const cls =
            'flex items-center gap-4 border border-white/5 bg-[#151515] px-[18px] py-5 transition-colors duration-150 hover:border-[rgba(204,0,0,0.5)]';
          return q.href ? (
            <Link key={q.title} href={q.href} className={cls}>
              {inner}
            </Link>
          ) : (
            <ContactLink key={q.title} className={`${cls} w-full`}>
              {inner}
            </ContactLink>
          );
        })}
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="border-t border-white/[0.06]">
        <div className="relative">
          <MPhotoBand
            src="/assets/mclaren-p1.jpg"
            alt="Red McLaren P1, Red Box Motors"
            height={420}
            position="center 45%"
            gradient="linear-gradient(180deg, rgba(10,10,10,0.2) 0%, rgba(10,10,10,0) 35%, rgba(10,10,10,0.6) 68%, #0A0A0A 100%)"
          />
          <div className="relative -mt-[140px] flex flex-col gap-3.5 px-5 pb-10">
            <div className={mEyebrowCls}>HOW IT WORKS</div>
            <MH2>End to end, either direction</MH2>
          </div>
        </div>

        <div className="flex flex-col gap-2 px-5 pb-12 pt-3">
          <StepList heading="BUYING" tag="YOU WANT A CAR" steps={BUYING_STEPS} />
          <div className="mt-2.5">
            <MBtnRed href="/dealer/inventory">View Inventory</MBtnRed>
          </div>
        </div>

        <div className="flex flex-col gap-2 px-5 pb-14">
          <StepList heading="CONSIGNMENT" tag="YOU HAVE A CAR" steps={CONSIGNMENT_STEPS} />
          <div className="mt-2.5">
            <MBtnRed href="/dealer">Sell Your Vehicle</MBtnRed>
          </div>
        </div>
      </section>

      {/* ===== WHERE TO NEXT ===== */}
      <section className="border-t border-white/[0.06]">
        <MPhotoBand
          src="/assets/home-tell-us.jpg"
          alt="Red Box Motors, Austin TX"
          height={300}
          position="36% center"
        />
        <div className="flex flex-col gap-[22px] px-5 pb-14 pt-9">
          <div className="flex flex-col gap-3.5">
            <div className={mEyebrowCls}>WHERE TO NEXT</div>
            <MH2>Explore Red Box Motors.</MH2>
          </div>
          <div className="flex flex-col">
            {EXPLORE_LINKS.map((e) => (
              <Link
                key={e.href}
                href={e.href}
                className="flex items-start gap-3.5 border-t border-white/[0.08] py-5"
              >
                <div className="mt-[7px] h-2 w-2 flex-none bg-rb-red" />
                <div className="flex flex-1 flex-col gap-1.5">
                  <div className="text-[17px] font-bold text-white">{e.title}</div>
                  <div className="text-[13px] leading-[1.6]" style={{ color: ED(0.55) }}>
                    {e.sub}
                  </div>
                </div>
                <div className="mt-1 text-[14px] text-rb-red" aria-hidden>
                  ↗
                </div>
              </Link>
            ))}
          </div>
          <ContactLink className={mBtnRedCls}>
            <span>Contact Red Box Motors</span>
            <MArrow />
          </ContactLink>
          <div className="mt-1 flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/brand/rbm-logo-header.png" alt="" className="h-4 w-4" />
            <div className="font-plex text-[10px] tracking-[0.28em]" style={{ color: ED(0.5) }}>
              RED BOX MOTORS · AUSTIN, TEXAS
            </div>
          </div>
        </div>
      </section>

      <QuestionsLocation faqs={DEFAULT_FAQ} />
      <MobileFooter phone={phone} email={email} />
    </MobileShell>
  );
}
