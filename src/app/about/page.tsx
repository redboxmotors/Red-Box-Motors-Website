import type { Metadata } from 'next';
import Link from 'next/link';
import { ContactLink } from '@/components/contact/ContactModal';
import { RandomBackdrop } from '@/components/site/RandomBackdrop';
import { ExpandingScrollBox, TintSection } from '@/components/site/ExpandingScrollBox';
import { SiteNav } from '@/components/site/SiteNav';
import { VisitAndFAQ } from '@/components/site/VisitAndFAQ';
import { SchemaScript } from '@/components/site/SchemaScript';
import { aboutPageSchema } from '@/lib/seo/schema';

// /about — About Red Box Motors.dc.html. Brand story; division tiles; sticky
// contact. Expanding-box pattern with NO hero: the page opens straight into
// the box's faded mini-hero photo (routes-and-pages.md).

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'About',
  description:
    'One Austin facility for cosmetics, dealer sales and collection management, near COTA.',
};

const EASE = 'cubic-bezier(.2,.8,.2,1)';

function ArrowIcon({ size = 13, stroke = 'currentColor', width = 1.2 }: { size?: number; stroke?: string; width?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M4 12L12 4M12 4H5.2M12 4V10.8" stroke={stroke} strokeWidth={width} />
    </svg>
  );
}

// Approved prototype copy — verbatim.
const DIVISIONS = [
  {
    href: '/cosmetics',
    label: 'Cosmetics',
    title: 'Protect & transform',
    desc: 'PPF, paint correction, ceramic coating, vinyl wraps, wheels & full custom builds.',
  },
  {
    href: '/dealer',
    label: 'Dealer',
    title: 'Buy, sell & source',
    desc: 'Private sales, acquisitions and consignment of enthusiast and collector cars, nationwide.',
  },
  {
    href: '/collection',
    label: 'Collection Management',
    title: 'Keep it ready',
    desc: 'Concierge, coordinated maintenance, track prep & transport — management, not storage. Austin only.',
  },
];

export default function AboutPage() {
  return (
    <div className="relative text-white">
      <SchemaScript schema={aboutPageSchema()} />
      <RandomBackdrop />
      <SiteNav current="about" />

      <main
        data-scroll-container
        className="rb-noscrollbar relative z-[1] h-screen overflow-y-auto bg-transparent"
        style={{ scrollSnapType: 'y proximity' }}
      >
        <ExpandingScrollBox>
          {/* MINI HERO — photo faded into black (no page hero) */}
          <div className="relative h-[400px] overflow-hidden">
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
                — About Red Box Motors
              </h1>
              <div
                className="font-bold text-white"
                style={{ fontSize: 'clamp(36px,4.8vw,66px)', letterSpacing: '-0.04em', lineHeight: 0.96 }}
              >
                One roof, every discipline.
              </div>
              <p
                className="mt-[18px] max-w-[660px] text-[15px] leading-[1.6] tracking-[0.2px] text-[#c4c4c4]"
                style={{ textShadow: '0 1px 20px rgba(0,0,0,0.7)' }}
              >
                Cosmetics · Dealer · Collection Management — under one roof in Austin, Texas,
                minutes from Circuit of the Americas.
              </p>
            </div>
          </div>

          {/* MANIFESTO / LEAD */}
          <div className="px-7 pt-11 md:px-[52px]">
            <h2
              className="m-0 max-w-[20ch] font-bold text-white"
              style={{ fontSize: 'clamp(28px,3.6vw,52px)', letterSpacing: '-0.03em', lineHeight: 1.05 }}
            >
              <span
                data-reveal
                className="block"
                style={{ transition: `opacity .9s ${EASE},transform .9s ${EASE}` }}
              >
                Everything a serious
              </span>
              <span
                data-reveal
                className="block text-rb-tx-faint"
                style={{ transition: `opacity .9s ${EASE} .12s,transform .9s ${EASE} .12s` }}
              >
                car needs, in one place.
              </span>
            </h2>
            <p
              data-reveal
              className="mt-8 max-w-[640px] text-[17px] font-medium leading-[1.7] text-rb-tx-mute"
              style={{ transition: `opacity .9s ${EASE} .24s,transform .9s ${EASE} .24s` }}
            >
              Red Box Motors brings cosmetics, private sales and collection management under one
              roof, minutes from the Circuit of the Americas. What started as a detail bay grew
              into a full home for enthusiasts — a place to protect a car, find the next one, and
              keep the collection running right. One team, one standard, one point of contact who
              knows you and every car.
            </p>
          </div>

          {/* SEO BODY — two columns */}
          <TintSection tint>
            <div
              data-reveal
              className="grid gap-11 px-7 py-[52px] md:grid-cols-2 md:px-[52px]"
              style={{ transition: `opacity .9s ${EASE} .14s,transform .9s ${EASE} .14s` }}
            >
              <div>
                <h3 className="mb-3.5 text-[14px] font-semibold uppercase tracking-[1px] text-white">
                  Built for the obsessed
                </h3>
                <p className="mb-[18px] text-[14.5px] leading-[1.75] text-[#999]">
                  We treat every car like it&rsquo;s staying in the family — because more often than
                  not, it is. The same standard runs through a front-end PPF install, a private sale
                  and a pre-track inspection: do it properly, document it, and stand behind it.
                </p>
                <p className="text-[14.5px] leading-[1.75] text-[#999]">
                  Having cosmetics, sales and management under one roof means a car bought here can
                  be protected, detailed and looked after without ever leaving the family — one
                  relationship for the whole life of the car.
                </p>
              </div>
              <div>
                <h3 className="mb-3.5 text-[14px] font-semibold uppercase tracking-[1px] text-white">
                  Austin, Texas · near COTA
                </h3>
                <p className="mb-[18px] text-[14.5px] leading-[1.75] text-[#999]">
                  We&rsquo;re an Austin business, minutes from Circuit of the Americas — close to
                  the track days, road trips and events our clients actually drive to. Local,
                  hands-on, and easy to reach.
                </p>
                <p className="text-[14.5px] leading-[1.75] text-[#999]">
                  Whether you&rsquo;re protecting a new delivery, sourcing the next one, or keeping
                  a garage of them ready to drive, it all runs through one facility and one team.
                </p>
              </div>
            </div>
          </TintSection>

          {/* THREE DIVISIONS */}
          <TintSection tint>
            <div className="border-t border-rb-line px-7 pt-12 md:px-[52px]">
              <div
                data-reveal
                className="mb-[26px]"
                style={{ transition: `opacity .9s ${EASE},transform .9s ${EASE}` }}
              >
                <div className="mb-[13px] font-mono text-[11px] uppercase tracking-[4px] text-rb-red">
                  — The divisions
                </div>
                <h2
                  className="m-0 font-bold text-white"
                  style={{ fontSize: 'clamp(26px,3.4vw,46px)', letterSpacing: '-0.03em', lineHeight: 1 }}
                >
                  Three disciplines, one team
                </h2>
              </div>
            </div>
            <div
              data-reveal
              className="mx-7 mb-[52px] grid gap-[2px] bg-black md:mx-[52px] md:grid-cols-3"
              style={{ transition: `opacity .9s ${EASE} .1s,transform .9s ${EASE} .1s` }}
            >
              {DIVISIONS.map((d) => (
                <Link
                  key={d.href}
                  href={d.href}
                  className="relative z-[1] flex min-h-[250px] flex-col bg-rb-surface px-[34px] pb-[46px] pt-10 transition-[filter,transform,box-shadow] duration-[240ms] ease-rb hover:z-[5] hover:-translate-y-[5px] hover:shadow-[0_22px_44px_rgba(0,0,0,0.6)] hover:brightness-[1.16]"
                >
                  <div className="mb-3 text-[11px] uppercase tracking-[2.5px] text-rb-red">{d.label}</div>
                  <div className="mb-3 text-[26px] font-semibold tracking-tight text-white">{d.title}</div>
                  <div className="text-[15px] leading-[1.6] text-[#999]">{d.desc}</div>
                  <div className="mt-auto inline-flex items-center gap-2 pt-5 text-[12px] tracking-[1px] text-white">
                    Explore <ArrowIcon />
                  </div>
                </Link>
              ))}
            </div>
          </TintSection>

          {/* CTA (photo + copy) */}
          <div className="flex flex-col border-t border-rb-line md:flex-row">
            <div className="relative min-h-[300px] min-w-0 overflow-hidden md:min-h-[460px] md:flex-[1.05]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/get-in-touch.jpeg"
                alt="Talk to Red Box Motors"
                className="absolute inset-0 h-full w-full object-cover"
                style={{ objectPosition: 'center 64%' }}
                loading="lazy"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(90deg,rgba(10,10,10,0) 55%,rgba(10,10,10,0.55) 82%,rgba(10,10,10,0.95) 100%)',
                }}
              />
              <div className="absolute bottom-0 left-0 px-[30px] py-[26px]">
                <div className="font-mono text-[11px] uppercase tracking-[3px] text-[#cfcfcf]">
                  Austin, TX · Near COTA
                </div>
              </div>
            </div>
            <div className="flex min-w-0 flex-col justify-center px-7 py-12 md:flex-1 md:px-14 md:py-[72px]">
              <div className="mb-6 font-mono text-[11px] uppercase tracking-[4px] text-rb-red">
                — Get in touch
              </div>
              <h2
                className="m-0 max-w-[13ch] font-extrabold text-white"
                style={{ fontSize: 'clamp(34px,4.4vw,64px)', letterSpacing: '-0.04em', lineHeight: 0.96 }}
              >
                Come see the shop.
              </h2>
              <p className="mt-[26px] max-w-[440px] text-[16px] font-medium leading-[1.7] text-rb-tx-mute">
                Protecting a car, finding the next one, or keeping the collection running — start a
                conversation and we&rsquo;ll take it from there.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-[18px]">
                <ContactLink
                  className="rb-btn-red inline-flex items-center gap-3 bg-rb-red px-7 py-4 text-[14px] font-semibold tracking-[0.5px] text-white"
                >
                  Start a conversation <ArrowIcon size={15} stroke="#fff" width={1.5} />
                </ContactLink>
                <Link
                  href="/"
                  className="text-[13px] tracking-[1.5px] text-rb-tx-mute transition-colors duration-150 hover:text-white"
                >
                  Back to dashboard →
                </Link>
              </div>
              <div className="mt-[52px] flex items-center gap-[11px] border-t border-rb-line pt-[26px]">
                <span className="inline-flex bg-rb-red px-2.5 py-[7px]">
                  <span className="text-[10px] font-extrabold tracking-[2px] text-white">RBM</span>
                </span>
                <span className="text-[11px] uppercase tracking-[2px] text-rb-tx-faint">
                  Red Box Motors · Austin, Texas
                </span>
              </div>
            </div>
          </div>

          {/* VISIT & FAQ — bottom of scrolling section */}
          <div className="border-t border-rb-line">
            <VisitAndFAQ division="all" />
          </div>
        </ExpandingScrollBox>
      </main>

      {/* STICKY INQUIRY CTA */}
      <ContactLink
        className="fixed bottom-[26px] right-[26px] z-40 flex items-center gap-[11px] border border-rb-border-2 bg-rb-surface px-[18px] py-[13px] transition-[border-color,background,transform,box-shadow] duration-btn ease-rb hover:-translate-y-[3px] hover:border-[#555] hover:bg-rb-raised hover:shadow-[0_14px_30px_rgba(0,0,0,0.55)] active:translate-y-0 active:scale-[0.98]"
      >
        <span className="h-[7px] w-[7px] flex-none bg-rb-red" />
        <span className="text-[12px] tracking-[1.5px] text-white">Contact</span>
        <ArrowIcon stroke="#888" width={1.3} />
      </ContactLink>
    </div>
  );
}
