import type { Metadata } from 'next';
import Link from 'next/link';
import { ContactLink } from '@/components/contact/ContactModal';
import { SiteNav } from '@/components/site/SiteNav';
import { ScrollShell } from '@/components/site/ScrollShell';
import { HeroSection, HeroBadge } from '@/components/site/Hero';
import { ExpandingScrollBox } from '@/components/site/ExpandingScrollBox';
import { VisitAndFAQ } from '@/components/site/VisitAndFAQ';
import { ServiceTiles, ServicePicker } from '@/components/cosmetics/ServiceTiles';
import { BuildsGrid } from '@/components/cosmetics/BuildsGrid';
import { getSurfaceCards } from '@/lib/public/content';
import { SchemaScript } from '@/components/site/SchemaScript';
import { serviceSchema } from '@/lib/seo/schema';

// Cosmetics division landing (Cosmetics.dc.html): scroll-scrub hero over the
// garage photo, then the expanding boxed overview — service tiles, SEO copy,
// builds preview, "Bring us the car" CTA and Visit & FAQ. Copy verbatim.

export const revalidate = 60;

export const metadata: Metadata = {
  title: { absolute: 'Cosmetics — PPF, Ceramic, Vinyl & Wheels | Red Box Motors' },
  description:
    'Paint protection, ceramic coating, paint correction, vinyl wrap and wheel refinishing in Austin, TX.',
};

const EASE = 'cubic-bezier(.2,.8,.2,1)';

const eyebrowCls = 'font-mono text-[11px] uppercase tracking-[4px] text-rb-red';

function Arrow({ size = 14, width = 1.5 }: { size?: number; width?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M4 12L12 4M12 4H5.2M12 4V10.8" stroke="currentColor" strokeWidth={width} />
    </svg>
  );
}

export default async function CosmeticsPage() {
  const builds = await getSurfaceCards('cosmetics_builds_preview', 8);

  return (
    <ScrollShell bg="/assets/cosmetics-garage.jpeg" bgPosition="center 58%">
      <SchemaScript schema={serviceSchema('Automotive Cosmetics', 'Paint protection, ceramic coating, paint correction, vinyl wrap and wheel refinishing in Austin, TX.', '/cosmetics')} />
      <SiteNav current="cosmetics" />

      {/* ——— 1 · HERO ——— */}
      <HeroSection>
        <HeroBadge>Red Box Motors · Cosmetics</HeroBadge>
        <h1
          className="relative z-[2] m-0 whitespace-nowrap font-extrabold text-white"
          style={{
            fontSize: 'clamp(38px, 4.8vw, 72px)',
            letterSpacing: '-0.03em',
            lineHeight: 0.94,
            textShadow: '0 1px 3px rgba(0,0,0,0.45)',
          }}
        >
          <span className="inline-block overflow-hidden align-bottom">
            <span
              className="rb-hero-line block"
              style={{ transform: 'translateY(120%)', animation: `rbmLine .95s ${EASE} forwards .28s` }}
            >
              Finish&nbsp;
            </span>
          </span>
          <span className="inline-block overflow-hidden align-bottom">
            <span
              className="rb-hero-line block"
              style={{ transform: 'translateY(120%)', animation: `rbmLine .95s ${EASE} forwards .41s` }}
            >
              First
            </span>
          </span>
        </h1>
        <p
          className="rb-hero-in relative z-[2] m-0 mt-7 max-w-[560px] text-[16px] font-medium leading-[1.6] tracking-[0.3px] text-rb-tx-2"
          style={{
            textShadow: '0 1px 24px rgba(0,0,0,0.85)',
            opacity: 0,
            animation: `fadeUp .9s ${EASE} forwards .9s`,
          }}
        >
          Paint protection, correction, ceramic coating, vinyl wrap and wheel refinishing.
          <br />
          Austin, Texas · minutes from COTA.
        </p>
      </HeroSection>

      {/* ——— 2 · BOXED OVERVIEW ——— */}
      <ExpandingScrollBox>
        {/* photo header */}
        <div className="relative h-[400px] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/cosmetics-scroll-header.jpg"
            alt="Red Box Motors cosmetics bay"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: 'center 46%' }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.10)_0%,rgba(10,10,10,0.04)_40%,rgba(10,10,10,0.55)_74%,rgba(10,10,10,0.92)_92%,#0A0A0A_100%)]" />
        </div>

        {/* manifesto / lead */}
        <div className="px-6 pt-[52px] md:px-[52px]">
          <div data-reveal className={`mb-7 ${eyebrowCls}`}>
            — Cosmetics · Austin, Texas
          </div>
          <h2
            className="m-0 max-w-[18ch] font-bold text-white"
            style={{ fontSize: 'clamp(30px, 4.2vw, 60px)', letterSpacing: '-0.03em', lineHeight: 1.04 }}
          >
            <span data-reveal className="block">
              Protection, finish
            </span>
            <span data-reveal className="block text-rb-tx-faint" style={{ transitionDelay: '.12s' }}>
              and detail — done right.
            </span>
          </h2>
          <p
            data-reveal
            className="mb-0 mt-9 max-w-[620px] text-[17px] font-medium leading-[1.7] text-rb-tx-mute"
            style={{ transitionDelay: '.24s' }}
          >
            Red Box Motors is an Austin cosmetics shop for owners who care how a car looks and how
            that finish holds up. Paint protection, ceramic coating, paint correction, vinyl wrap,
            wheel refinishing and full custom builds — handled under one roof, minutes from Circuit
            of the Americas.
          </p>
        </div>

        {/* service tiles */}
        <ServiceTiles />

        {/* SEO body — two columns of written detail */}
        <div className="pb-[52px]" style={{ background: 'linear-gradient(180deg,#0A0A0A 0px,#151515 160px)' }}>
          <div
            data-reveal
            className="grid gap-11 px-6 pt-[52px] md:grid-cols-2 md:px-[52px]"
            style={{ transitionDelay: '.14s' }}
          >
            <div>
              <h3 className="mb-3.5 mt-0 text-[14px] font-semibold uppercase tracking-[1px] text-white">
                Paint protection &amp; ceramic
              </h3>
              <p className="mb-[18px] mt-0 text-[14.5px] leading-[1.75] text-[#999]">
                Our paint protection film is built around STEK self-healing PPF — clear and color
                films that absorb rock chips, road rash and track debris while staying optically
                invisible. Coverage runs from high-impact front-end packages to full-body wraps, cut
                and installed for the panels that actually take the hits.
              </p>
              <p className="m-0 text-[14.5px] leading-[1.75] text-[#999]">
                For gloss and chemical resistance we coat with Carbon Collective ceramics over a
                proper paint correction. We level swirls, holograms and wash marring first, then
                seal the finish so it sheds water, resists fading and stays easier to keep clean —
                long after the car leaves the bay.
              </p>
            </div>
            <div>
              <h3 className="mb-3.5 mt-0 text-[14px] font-semibold uppercase tracking-[1px] text-white">
                Wrap, wheels &amp; builds
              </h3>
              <p className="mb-[18px] mt-0 text-[14.5px] leading-[1.75] text-[#999]">
                Vinyl wrap changes the entire look of a car without touching the factory paint —
                color-change, satin, gloss and custom finishes that stay fully reversible.
                It&rsquo;s the cleanest way to transform a daily, a track car or a collectible and
                return it to original when you&rsquo;re ready.
              </p>
              <p className="m-0 text-[14.5px] leading-[1.75] text-[#999]">
                Wheels are stripped, repaired and refinished in custom colors and powder-coat
                finishes, and our build bay takes on ground-up custom builds and modifications end
                to end. Whatever the project, the same obsessive standard runs through every panel,
                every edge and every reveal line.
              </p>
            </div>
          </div>

          {/* facts row (no invented numbers) */}
          <div
            data-reveal
            className="flex flex-wrap gap-12 px-6 pt-[52px] md:px-[52px]"
            style={{ transitionDelay: '.2s' }}
          >
            {[
              { fact: 'STEK', sub: 'PPF & films' },
              { fact: 'Carbon Collective', sub: 'Ceramic coatings' },
              { fact: 'Austin, TX', sub: 'Near COTA' },
            ].map((f) => (
              <div key={f.fact}>
                <div className="text-[30px] font-bold tracking-tight text-white">{f.fact}</div>
                <div className="mt-1.5 text-[11px] uppercase tracking-[2px] text-rb-tx-faint">{f.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* builds & transformations */}
        <div className="pb-[52px]" style={{ background: 'linear-gradient(180deg,#151515 0px,#0A0A0A 160px)' }}>
          <div className="pt-14">
            <div
              data-reveal
              className="mb-[18px] flex flex-wrap items-end justify-between gap-5 px-6 md:px-[52px]"
            >
              <div>
                <div className={`mb-[13px] ${eyebrowCls}`}>— Recent work</div>
                <h2
                  className="m-0 font-bold leading-none text-white"
                  style={{ fontSize: 'clamp(28px, 3.6vw, 52px)', letterSpacing: '-0.03em' }}
                >
                  Builds &amp; transformations
                </h2>
              </div>
              <Link
                href="/cosmetics/work"
                className="inline-flex flex-none items-center gap-[9px] whitespace-nowrap border border-rb-red bg-transparent px-6 py-[13px] text-[13px] font-semibold tracking-[0.5px] text-rb-red transition-[background,color,transform] duration-[220ms] ease-rb hover:-translate-y-0.5 hover:bg-rb-red hover:text-white active:translate-y-0 active:scale-[0.98]"
              >
                View all work
                <Arrow size={13} width={1.3} />
              </Link>
            </div>
            <p
              data-reveal
              className="mb-[30px] mt-0 max-w-[680px] px-6 text-[14.5px] leading-[1.75] text-[#999] md:px-[52px]"
              style={{ transitionDelay: '.1s' }}
            >
              Every car that comes through the shop tells the story best. These are recent paint
              protection, ceramic, vinyl wrap, wheel and full custom-build projects — daily drivers,
              track cars and collectibles transformed and protected at our Austin facility. Each one
              is documented panel by panel so you can see exactly the finish and standard you can
              expect on your own car.
            </p>

            <BuildsGrid cards={builds} />

            {/* prose below builds */}
            <div
              data-reveal
              className="px-6 pb-10 pt-[60px] md:px-[52px]"
              style={{ transitionDelay: '.16s' }}
            >
              <div className="max-w-[900px]">
                <div className={`mb-4 ${eyebrowCls}`}>— The standard</div>
                <h2
                  className="m-0 max-w-[20ch] font-bold text-white"
                  style={{ fontSize: 'clamp(20px, 2.2vw, 30px)', letterSpacing: '-0.025em', lineHeight: 1.08 }}
                >
                  Protected to last, finished to show.
                </h2>
              </div>
              <div className="mt-[34px] grid gap-11 md:grid-cols-2">
                <p className="m-0 text-[15px] leading-[1.8] text-[#a2a2a2]">
                  Whether a car needs full-body STEK paint protection film, a Carbon Collective
                  ceramic coating over a multi-stage correction, a color-change vinyl wrap or a set
                  of refinished wheels, every project runs through the same Austin bay and the same
                  obsessive prep. The result is a finish that looks show-ready and holds up to real
                  driving — sun, rock chips, track days and daily use.
                </p>
                <p className="m-0 text-[15px] leading-[1.8] text-[#a2a2a2]">
                  We document each build panel by panel so you can see the standard before you ever
                  hand over the keys, and because sales, protection and detailing live under one
                  roof, a car can move from purchase to protection to delivery without leaving the
                  shop. One team, one facility near Circuit of the Americas, from the first quote to
                  the final reveal.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* bring us the car */}
        <div style={{ background: 'linear-gradient(180deg,#151515 0px,#0A0A0A 220px)' }}>
          <div className="flex flex-col md:flex-row">
            {/* photo side */}
            <div className="relative min-h-[280px] min-w-0 flex-[1.05] overflow-hidden md:min-h-[480px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/bring-us-car.jpg"
                alt="Red Box Motors cosmetics bay"
                className="absolute inset-0 h-full w-full object-cover"
                style={{ objectPosition: 'center 56%' }}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,10,10,0)_55%,rgba(10,10,10,0.55)_82%,rgba(10,10,10,0.95)_100%)]" />
              <div className="absolute bottom-0 left-0 px-[30px] py-[26px]">
                <div className="font-mono text-[11px] uppercase tracking-[3px] text-[#cfcfcf]">
                  Austin, TX · Near COTA
                </div>
              </div>
            </div>
            {/* copy side */}
            <div className="flex min-w-0 flex-1 flex-col justify-center px-6 py-14 md:px-14 md:py-16">
              <div className={`mb-[22px] ${eyebrowCls}`}>— Start a project</div>
              <h2
                className="m-0 max-w-[14ch] font-extrabold text-white"
                style={{ fontSize: 'clamp(32px, 4vw, 58px)', letterSpacing: '-0.04em', lineHeight: 0.96 }}
              >
                Bring us the car.
              </h2>
              <p className="mb-0 mt-[22px] max-w-[440px] text-[16px] font-medium leading-[1.7] text-rb-tx-mute">
                Tell us what you&rsquo;re protecting or transforming. Pick a service to start, or
                reach out and we&rsquo;ll walk you through the right approach for your car.
              </p>

              <ServicePicker />

              <div className="mt-[34px] flex flex-wrap items-center gap-[18px]">
                <ContactLink
                  className="rb-btn-red inline-flex items-center gap-3 bg-rb-red px-7 py-4 text-[14px] font-semibold tracking-[0.5px] text-white"
                >
                  Book a service
                  <Arrow size={15} />
                </ContactLink>
                <Link
                  href="/cosmetics/work"
                  className="inline-flex items-center gap-2 border border-rb-red bg-transparent px-[26px] py-[15px] text-[13px] font-semibold tracking-[0.5px] text-rb-red transition-[background,color,transform] duration-[220ms] ease-rb hover:-translate-y-0.5 hover:bg-rb-red hover:text-white active:translate-y-0 active:scale-[0.98]"
                >
                  See recent work
                  <Arrow size={14} />
                </Link>
              </div>
              <div className="mt-11 flex items-center gap-[11px] border-t border-rb-line pt-6">
                <span className="inline-flex bg-rb-red px-2.5 py-[7px]">
                  <span className="text-[10px] font-extrabold tracking-[2px] text-white">RBM</span>
                </span>
                <span className="text-[11px] uppercase tracking-[2px] text-rb-tx-faint">
                  Red Box Motors · Cosmetics
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* visit & FAQ */}
        <div style={{ background: 'linear-gradient(180deg,#151515 0px,#0A0A0A 130px)' }}>
          <VisitAndFAQ division="cosmetics" />
        </div>
      </ExpandingScrollBox>
    </ScrollShell>
  );
}
