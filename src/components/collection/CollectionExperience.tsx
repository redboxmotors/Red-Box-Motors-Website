import Link from 'next/link';
import { ContactLink } from '@/components/contact/ContactModal';
import { ScrollShell } from '@/components/site/ScrollShell';
import { ExpandingScrollBox } from '@/components/site/ExpandingScrollBox';
import {
  HeroSection,
  HeroBadge,
  HeroTitle,
  HeroSub,
  HeroCtas,
  HeroCtaRed,
} from '@/components/site/Hero';

// Collection Management (/collection) — ported from Collection Management.dc.html.
// Hero over the shared scrubbed background, then the expanding scroll box:
// photo header → manifesto → quick actions → SEO body → facts → what-we-handle
// services grid → membership vs à-la-carte → keys CTA → Visit & FAQ.
// Copy is approved prototype copy — verbatim. Collection Management is
// concierge/management, NOT storage; detailing/washing coordinated, not
// performed; local Austin only.

export type CollectionService = {
  num: string;
  title: string;
  desc: string;
  tag: string;
};

function ArrowIcon({ size = 14, stroke = '#CC0000' }: { size?: number; stroke?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className="flex-none" aria-hidden>
      <path d="M4 12L12 4M12 4H5.2M12 4V10.8" stroke={stroke} strokeWidth="1.5" />
    </svg>
  );
}

// Quick-action tiles (compact, picture-free)
const QUICK_ACTIONS: { title: string; sub: string; icon: React.ReactNode }[] = [
  {
    title: 'Kept Ready',
    sub: 'Battery, fluids, pre-trip prep',
    icon: (
      <svg width="19" height="19" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path
          d="M8 2L13 4V7.5C13 10.5 10.8 12.7 8 13.8C5.2 12.7 3 10.5 3 7.5V4L8 2Z"
          stroke="#fff"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: 'Coordinated Care',
    sub: 'Servicing & detailing managed',
    icon: (
      <svg width="19" height="19" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path
          d="M6.5 2.5a3 3 0 0 0 3.8 3.8l3.2 3.2-1.6 1.6-3.2-3.2A3 3 0 0 1 4.9 4.1l1.6 1.6 1.2-1.2L6.5 2.5Z"
          stroke="#fff"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: 'Concierge & Transport',
    sub: 'Pickup, delivery, logistics',
    icon: (
      <svg width="19" height="19" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path d="M1.5 4.5h8v6h-8zM9.5 6.5h3l2 2v2h-5z" stroke="#fff" strokeWidth="1.2" strokeLinejoin="round" />
        <circle cx="4" cy="11" r="1.3" stroke="#fff" strokeWidth="1.2" />
        <circle cx="11.5" cy="11" r="1.3" stroke="#fff" strokeWidth="1.2" />
      </svg>
    ),
  },
];

// Inline service picker rows in the keys CTA
const PICKER: string[] = [
  'Concierge & transport',
  'Maintenance & servicing',
  'Pre-trip & track prep',
  'Full membership management',
];

const FACTS: { big: string; small: string }[] = [
  { big: 'Austin only', small: 'Local, hands-on' },
  { big: 'One contact', small: 'Knows every car' },
  { big: 'Ready to drive', small: 'Not storage' },
];

const revealDelay = (s: number): React.CSSProperties => ({ transitionDelay: `${s}s` });

export function CollectionExperience({
  services,
  visitAndFaq,
}: {
  services: CollectionService[];
  visitAndFaq: React.ReactNode;
}) {
  return (
    <>
      <ScrollShell bg="/assets/collection-p1.jpeg" bgPosition="center 58%">
        {/* ---------- 1 · HERO ---------- */}
        <HeroSection>
          <HeroBadge>Red Box Motors · Collection Management</HeroBadge>
          <HeroTitle lines={['You Drive.', 'We Handle the Rest.']} />
          <HeroSub>Concierge · Maintenance · Track prep · Transport · Austin, TX</HeroSub>
          <HeroCtas>
            <HeroCtaRed href="/contact">Start a Conversation</HeroCtaRed>
          </HeroCtas>
        </HeroSection>

        {/* ---------- 2 · OVERVIEW (boxed scroll → fullscreen) ---------- */}
        <ExpandingScrollBox>
          {/* PHOTO HEADER (faded into black) */}
          <div className="relative h-[400px] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/collection-scroll-header.jpg"
              alt="A managed collection, Austin TX"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: 'center 30%' }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.10)_0%,rgba(10,10,10,0.04)_42%,rgba(10,10,10,0.55)_76%,rgba(10,10,10,0.92)_92%,#0A0A0A_100%)]" />
            <div className="absolute bottom-0 left-0 px-6 py-[26px] md:px-[52px]">
              <div className="font-mono text-[11px] uppercase tracking-[3px] text-[#cfcfcf]">
                Management, not storage · Austin only
              </div>
            </div>
          </div>

          {/* MANIFESTO / LEAD */}
          <div className="px-6 pt-11 md:px-[52px]">
            <div data-reveal className="mb-7 font-mono text-[11px] uppercase tracking-[4px] text-rb-red">
              — Collection Management · Local Austin
            </div>
            <h2
              className="m-0 max-w-[18ch] font-bold text-white"
              style={{ fontSize: 'clamp(30px,4.2vw,60px)', letterSpacing: '-0.03em', lineHeight: 1.04 }}
            >
              <span data-reveal className="block">
                Everything around
              </span>
              <span data-reveal className="block text-rb-tx-faint" style={revealDelay(0.12)}>
                owning the cars.
              </span>
            </h2>
            <p
              data-reveal
              className="mb-0 mt-9 max-w-[640px] text-[17px] font-medium leading-[1.7] text-rb-tx-mute"
              style={revealDelay(0.24)}
            >
              We look after the upkeep, the logistics and the small obligations that come with a serious
              collection — so the only thing left for you is driving. Hands-on where it counts, coordinated
              with trusted partners where it helps, and one point of contact who knows you and every car.
              This is active management, not storage: your cars stay where they live, and we keep them
              ready.
            </p>
          </div>

          {/* QUICK ACTIONS (compact, picture-free) */}
          <div
            data-reveal
            className="grid gap-1.5 px-6 pt-11 md:grid-cols-3 md:px-[52px]"
            style={revealDelay(0.3)}
          >
            {QUICK_ACTIONS.map((qa) => (
              <ContactLink
                key={qa.title}
                className="z-[1] flex cursor-pointer flex-col items-center justify-center gap-[13px] px-4 py-[30px] text-center transition-[filter,transform,box-shadow] duration-[240ms] ease-rb hover:z-[2] hover:-translate-y-1 hover:brightness-[1.25] hover:shadow-[0_18px_40px_rgba(0,0,0,0.55)] active:translate-y-0 active:scale-[0.99]"
                style={{ background: 'linear-gradient(135deg,#191919 0%,#0C0C0C 100%)' }}
              >
                <div className="flex h-10 w-10 flex-none items-center justify-center bg-rb-red shadow-[0_6px_20px_rgba(204,0,0,0.4)]">
                  {qa.icon}
                </div>
                <div>
                  <div className="mb-1.5 text-[13px] font-semibold uppercase tracking-[1.5px] text-white">
                    {qa.title}
                  </div>
                  <div className="text-[11px] tracking-[0.3px] text-rb-tx-mute-2">{qa.sub}</div>
                </div>
              </ContactLink>
            ))}
          </div>

          {/* SEO BODY — two columns */}
          <div className="pb-[52px]" style={{ background: 'linear-gradient(180deg,#0A0A0A 0px,#151515 200px)' }}>
            <div
              data-reveal
              className="grid gap-11 px-6 pt-[52px] md:grid-cols-2 md:px-[52px]"
              style={revealDelay(0.14)}
            >
              <div>
                <h3 className="m-0 mb-3.5 text-[14px] font-semibold uppercase tracking-[1px] text-white">
                  Hands-on where it counts
                </h3>
                <p className="m-0 mb-[18px] text-[14.5px] leading-[1.75] text-[#999]">
                  Batteries tended, fluids checked, cars started and exercised on a schedule so nothing sits
                  and sours. Before a road trip or a day at COTA we inspect, fuel and set the car up
                  ourselves — tire pressures, fluids, a proper once-over — so it&#39;s ready the moment you
                  are.
                </p>
                <p className="m-0 text-[14.5px] leading-[1.75] text-[#999]">
                  When a car needs to move, we handle enclosed transport and logistics across Austin and to
                  the event — coordinated, insured and on your timeline.
                </p>
              </div>
              <div>
                <h3 className="m-0 mb-3.5 text-[14px] font-semibold uppercase tracking-[1px] text-white">
                  Coordinated where it helps
                </h3>
                <p className="m-0 mb-[18px] text-[14.5px] leading-[1.75] text-[#999]">
                  Maintenance and servicing are scheduled and overseen with trusted shops, and we stay ahead
                  of what&#39;s due so nothing lapses. Detailing and washing are booked and managed with our
                  detailers — coordinated on your behalf, not performed in-house.
                </p>
                <p className="m-0 text-[14.5px] leading-[1.75] text-[#999]">
                  One relationship covers all of it. You call one person who knows every car, its history
                  and how you drive it — and the rest simply gets handled.
                </p>
              </div>
            </div>

            {/* FACTS ROW */}
            <div
              data-reveal
              className="flex flex-wrap gap-12 px-6 pt-[52px] md:px-[52px]"
              style={revealDelay(0.2)}
            >
              {FACTS.map((f) => (
                <div key={f.big}>
                  <div className="text-[30px] font-bold tracking-tight text-white">{f.big}</div>
                  <div className="mt-1.5 text-[11px] uppercase tracking-[2px] text-rb-tx-faint">{f.small}</div>
                </div>
              ))}
            </div>
          </div>

          {/* WHAT WE HANDLE */}
          <div style={{ background: 'linear-gradient(180deg,#151515 0px,#0A0A0A 220px)' }}>
            {/* bold photo banner with overlaid heading */}
            <div data-reveal className="relative h-[360px] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/collection-handle-banner.jpg"
                alt="Red Box Motors collection management"
                className="absolute inset-0 h-full w-full object-cover"
                style={{ objectPosition: 'center 40%' }}
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(21,21,21,0.35)_0%,rgba(10,10,10,0.04)_34%,rgba(10,10,10,0.55)_74%,#0A0A0A_100%)]" />
              <div className="absolute inset-x-0 bottom-0 px-6 pb-10 md:px-[52px]">
                <div className="mb-4 font-mono text-[11px] uppercase tracking-[4px] text-rb-red">
                  — What we handle
                </div>
                <h2
                  className="m-0 font-extrabold text-white md:whitespace-nowrap"
                  style={{
                    fontSize: 'clamp(32px,4.2vw,60px)',
                    letterSpacing: '-0.04em',
                    lineHeight: 0.94,
                    textShadow: '0 2px 30px rgba(0,0,0,0.55)',
                  }}
                >
                  Six things off your plate.
                </h2>
              </div>
            </div>
            {/* services grid, oversized numbers */}
            <div
              data-reveal
              className="mx-6 grid gap-0.5 bg-black md:mx-[52px] md:grid-cols-3"
              style={revealDelay(0.1)}
            >
              {services.map((s) => (
                <div key={s.num} className="flex min-h-[230px] flex-col gap-3 bg-rb-surface px-[30px] pb-[30px] pt-[34px]">
                  <div className="text-[42px] font-extrabold text-rb-red" style={{ lineHeight: 0.8, letterSpacing: '-0.04em' }}>
                    {s.num}
                  </div>
                  <div className="mt-1.5 text-[19px] font-bold text-white" style={{ letterSpacing: '-0.015em' }}>
                    {s.title}
                  </div>
                  <div className="text-[14px] leading-[1.6] text-[#8c8c8c]">{s.desc}</div>
                  <div className="mt-auto text-[10px] uppercase tracking-[2px] text-rb-tx-faint-2">{s.tag}</div>
                </div>
              ))}
            </div>
          </div>

          {/* WAYS TO WORK */}
          <div className="pb-[52px]" style={{ background: 'linear-gradient(180deg,#0A0A0A 0px,#151515 200px)' }}>
            <div className="mt-0 px-6 pt-14 md:px-[52px]">
              <div data-reveal className="mb-[26px]">
                <div className="mb-[13px] font-mono text-[11px] uppercase tracking-[4px] text-rb-red">
                  — Ways to work with us
                </div>
                <h2
                  className="m-0 font-bold leading-none text-white"
                  style={{ fontSize: 'clamp(26px,3.4vw,46px)', letterSpacing: '-0.03em' }}
                >
                  Two ways in — shaped around you
                </h2>
              </div>
            </div>
            <div
              data-reveal
              className="mx-6 grid gap-0.5 bg-black md:mx-[52px] md:grid-cols-2"
              style={revealDelay(0.1)}
            >
              {/* Membership */}
              <div className="flex flex-col bg-rb-surface px-6 py-[38px] md:px-10">
                <div className="mb-[18px] flex items-center gap-[9px]">
                  <span className="h-1.5 w-1.5 flex-none bg-rb-red" />
                  <span className="text-[11px] font-bold uppercase tracking-[2.5px] text-white">Membership</span>
                </div>
                <div className="mb-3.5 text-[30px] font-bold text-white" style={{ letterSpacing: '-0.025em' }}>
                  Continuous care
                </div>
                <p className="m-0 mb-[26px] text-[14.5px] leading-[1.6] text-[#9a9a9a]">
                  Your cars under ongoing management. We stay ahead of what&#39;s due, keep everything ready
                  to drive, and you have one relationship to call. Best for active collections that move
                  often.
                </p>
                <div className="mt-auto flex flex-col">
                  {[
                    'Proactive maintenance & readiness',
                    'Priority concierge & transport',
                    'One dedicated point of contact',
                  ].map((line, i, arr) => (
                    <div
                      key={line}
                      className={`flex items-center gap-[15px] border-t border-[#232323] py-[19px]${i === arr.length - 1 ? ' border-b' : ''}`}
                    >
                      <span className="h-2 w-2 flex-none bg-rb-red" />
                      <span className="text-[16.5px] font-medium text-[#e2e2e2]" style={{ letterSpacing: '-0.01em' }}>
                        {line}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              {/* À La Carte */}
              <div className="flex flex-col bg-rb-surface px-6 py-[38px] md:px-10">
                <div className="mb-[18px] flex items-center gap-[9px]">
                  <span className="h-1.5 w-1.5 flex-none bg-rb-tx-faint" />
                  <span className="text-[11px] font-bold uppercase tracking-[2.5px] text-white">À La Carte</span>
                </div>
                <div className="mb-3.5 text-[30px] font-bold text-white" style={{ letterSpacing: '-0.025em' }}>
                  When you need it
                </div>
                <p className="m-0 mb-[26px] text-[14.5px] leading-[1.6] text-[#9a9a9a]">
                  Call for a single job — a service coordinated, a car transported, a weekend at COTA
                  prepped for. No commitment; just the help you need, when you need it.
                </p>
                <div className="mt-auto flex flex-col">
                  {[
                    'Per-service, no ongoing commitment',
                    'Maintenance, transport or event prep',
                    'A simple way to try us out',
                  ].map((line, i, arr) => (
                    <div
                      key={line}
                      className={`flex items-center gap-[15px] border-t border-[#232323] py-[19px]${i === arr.length - 1 ? ' border-b' : ''}`}
                    >
                      <span className="h-2 w-2 flex-none bg-rb-tx-faint" />
                      <span className="text-[16.5px] font-medium text-[#e2e2e2]" style={{ letterSpacing: '-0.01em' }}>
                        {line}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div data-reveal className="px-6 pt-4 md:px-[52px]" style={revealDelay(0.16)}>
              <span className="text-[12px] tracking-[0.3px] text-rb-tx-faint">
                Still shaping our plans — tell us how you&#39;d want to work and we&#39;ll build around it.
              </span>
            </div>
          </div>

          {/* HAND US THE KEYS — CTA (photo + copy) */}
          <div className="flex flex-col md:flex-row" style={{ background: 'linear-gradient(180deg,#151515 0px,#0A0A0A 220px)' }}>
            <div className="relative min-h-[320px] min-w-0 overflow-hidden md:min-h-[520px] md:flex-[1.05]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/collection-keys.jpg"
                alt="Hand us the keys"
                className="absolute inset-0 h-full w-full object-cover"
                style={{ objectPosition: 'center 56%' }}
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,10,10,0)_55%,rgba(10,10,10,0.55)_82%,rgba(10,10,10,0.95)_100%)]" />
              <div className="absolute bottom-0 left-0 px-[30px] py-[26px]">
                <div className="font-mono text-[11px] uppercase tracking-[3px] text-[#cfcfcf]">
                  Austin, TX · Near COTA
                </div>
              </div>
            </div>
            <div className="flex min-w-0 flex-1 flex-col justify-center px-6 py-14 md:px-14 md:py-16">
              <div className="mb-[22px] font-mono text-[11px] uppercase tracking-[4px] text-rb-red">
                — Get in touch
              </div>
              <h2
                className="m-0 max-w-[12ch] font-extrabold text-white"
                style={{ fontSize: 'clamp(32px,4vw,58px)', letterSpacing: '-0.04em', lineHeight: 0.96 }}
              >
                Hand us the keys.
              </h2>
              <p className="mb-0 mt-[22px] max-w-[440px] text-[16px] font-medium leading-[1.7] text-rb-tx-mute">
                Tell us about your cars and how you drive them. Pick what you need to start, or reach out
                and we&#39;ll shape a way to keep them ready.
              </p>

              {/* INLINE SERVICE PICKER */}
              <div data-reveal className="mt-[30px] border-t border-[#232323]" style={revealDelay(0.12)}>
                {PICKER.map((label) => (
                  <ContactLink
                    key={label}
                    className="flex cursor-pointer items-center justify-between gap-4 border-b border-rb-line-2 py-[15px] pl-1 pr-1 transition-[padding-left,background] duration-200 hover:bg-[rgba(204,0,0,0.06)] hover:pl-3.5"
                  >
                    <span className="flex items-center gap-3.5">
                      <span className="h-[7px] w-[7px] flex-none bg-rb-red" />
                      <span className="text-[15px] font-semibold tracking-[0.3px] text-white">{label}</span>
                    </span>
                    <ArrowIcon />
                  </ContactLink>
                ))}
              </div>

              <div className="mt-[34px] flex flex-wrap items-center gap-[18px]">
                <ContactLink
                  className="rb-btn-red inline-flex items-center gap-3 bg-rb-red px-7 py-4 text-[14px] font-semibold tracking-[0.5px] text-white"
                >
                  Start a conversation
                  <ArrowIcon size={15} stroke="#fff" />
                </ContactLink>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 border border-rb-red bg-transparent px-[26px] py-[15px] text-[13px] font-semibold tracking-[0.5px] text-rb-red transition-[background,color,transform] duration-[180ms] ease-rb hover:-translate-y-0.5 hover:bg-rb-red hover:text-white active:translate-y-0 active:scale-[0.98]"
                >
                  Back to dashboard
                </Link>
              </div>
              <div className="mt-11 flex items-center gap-[11px] border-t border-rb-line pt-6">
                <span className="inline-flex bg-rb-red px-2.5 py-[7px]">
                  <span className="text-[10px] font-extrabold tracking-[2px] text-white">RBM</span>
                </span>
                <span className="text-[11px] uppercase tracking-[2px] text-rb-tx-faint">
                  Red Box Motors · Collection Management
                </span>
              </div>
            </div>
          </div>

          {/* VISIT & FAQ — bottom of scrolling section */}
          <div style={{ background: 'linear-gradient(180deg,#0A0A0A 0px,#0C0C0C 130px)' }}>{visitAndFaq}</div>
        </ExpandingScrollBox>
      </ScrollShell>

      {/* ===================== STICKY INQUIRY CTA ===================== */}
      <ContactLink
        className="fixed bottom-[26px] right-[26px] z-40 flex items-center gap-[11px] bg-rb-red px-[22px] py-[15px] shadow-[0_12px_30px_rgba(204,0,0,0.34)] transition-[filter,transform,box-shadow] duration-[220ms] ease-rb hover:-translate-y-[3px] hover:brightness-[1.12] hover:shadow-[0_18px_40px_rgba(204,0,0,0.5)] active:translate-y-0 active:scale-[0.98]"
      >
        <span className="h-[7px] w-[7px] flex-none bg-white" />
        <span className="text-[12px] font-semibold tracking-[1.5px] text-white">Inquire</span>
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M4 12L12 4M12 4H5.2M12 4V10.8" stroke="#fff" strokeWidth="1.5" />
        </svg>
      </ContactLink>
    </>
  );
}
