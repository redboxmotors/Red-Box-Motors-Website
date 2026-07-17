import type { Metadata } from 'next';
import Link from 'next/link';
import { ContactLink } from '@/components/contact/ContactModal';
import { SiteNav } from '@/components/site/SiteNav';
import { VisitAndFAQ } from '@/components/site/VisitAndFAQ';
import { ExpandingScrollBox, TintSection } from '@/components/site/ExpandingScrollBox';
import { serviceSchema, jsonLd } from '@/lib/seo/schema';

// /cosmetics/wheels — Wheels.dc.html. Full SEO scroll page: no hero, opens
// straight into the expanding box's faded mini-hero photo. Copy is approved
// prototype copy — verbatim.

export const revalidate = 60;

export const metadata: Metadata = {
  // Unpublished (owner revision) — unlinked from nav/sitemap, kept for later restore.
  robots: { index: false, follow: false },
  title: 'Wheel Refinishing & Powder Coat Austin',
  description: 'Strip, powder coat and custom wheel finishes in Austin, TX.',
  openGraph: {
    title: 'Wheel Refinishing & Powder Coat Austin, Red Box Motors',
    description: 'Strip, powder coat and custom wheel finishes in Austin, TX.',
    type: 'website',
  },
};

const RIBBON = ['Repair', 'Powder-coat', 'Custom color', 'Balanced'];

const WHY: { title: string; body: string }[] = [
  {
    title: 'Powder-coat tough',
    body: 'A finish fused under heat is harder and more chip- and chemical-resistant than wet paint, built for brake dust and road salt.',
  },
  {
    title: 'Repaired first',
    body: 'Every wheel is stripped to bare metal, straightened and repaired before finishing, so the color goes on a sound surface.',
  },
  {
    title: 'Any color',
    body: 'Gloss, satin or matte in any shade, match the calipers, contrast the body, or go factory-correct.',
  },
  {
    title: 'Balanced & true',
    body: 'Faces machined true, tires remounted, balanced and torqued, it drives as good as it looks.',
  },
];

const SPEC_ROWS: {
  step: string;
  title: string;
  body: string;
  chips: string[];
  redChip?: string;
}[] = [
  {
    step: '01 · Repair',
    title: 'Curb & damage',
    body: 'Back to bare metal and made straight before any finish.',
    chips: ['Curb rash filled', 'Lips straightened', 'Faces machined true'],
  },
  {
    step: '02 · Refinish',
    title: 'Color & coat',
    body: 'Custom color, powder-coat or a factory-match respray.',
    chips: ['Powder-coat', 'Gloss / satin / matte', 'Bronze & gunmetal', 'Factory-match respray'],
  },
  {
    step: '03 · Finish',
    title: 'Mount & balance',
    body: 'Back on the car, driving as good as it looks.',
    chips: ['Tires remounted', 'Road-force balanced'],
    redChip: 'Torqued to spec',
  },
];

const PROCESS: { title: string; body: string }[] = [
  {
    title: 'Strip & repair',
    body: 'Tires are dismounted and each wheel is stripped to bare metal, then curb rash is filled, lips straightened and faces machined true.',
  },
  {
    title: 'Refinish',
    body: 'The prepped wheel is powder-coated or resprayed in your color and finish, then cured hard for a durable, even surface.',
  },
  {
    title: 'Mount & balance',
    body: 'Tires are remounted, road-force balanced and the wheels torqued back to spec so the finished set drives out true.',
  },
];

function ArrowUpRight({ size = 15, stroke = '#fff' }: { size?: number; stroke?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M4 12L12 4M12 4H5.2M12 4V10.8" stroke={stroke} strokeWidth="1.5" />
    </svg>
  );
}

export default function WheelsPage() {
  return (
    <div className="relative bg-rb-bg font-sans text-white antialiased">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          serviceSchema(
            'Wheel Refinishing & Powder Coat',
            'Strip, powder coat and custom wheel finishes in Austin, TX.',
            '/restoration/wheels',
          ),
        )}
      />

      {/* fixed blurred background + dim */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/dealer-garage.jpeg"
        alt=""
        className="rb-bg-photo"
        style={{ objectPosition: 'center 56%' }}
      />
      <div className="rb-bg-dim" />

      <SiteNav current="cosmetics" />

      <div
        className="rb-noscrollbar relative z-[1] h-screen overflow-y-auto bg-transparent"
        style={{ scrollSnapType: 'y proximity' }}
      >
        <ExpandingScrollBox>
          {/* HERO with spec ribbon */}
          <div className="relative h-[480px] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/dealer-garage.jpeg"
              alt="Wheel refinishing, Austin TX"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: 'center 50%' }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.15)_0%,rgba(10,10,10,0.05)_34%,rgba(10,10,10,0.6)_72%,rgba(10,10,10,0.94)_92%,#0A0A0A_100%)]" />
            <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-5 px-6 pt-[34px] md:px-[52px]">
              <div className="font-mono text-[11px] uppercase tracking-[4px] text-rb-red">
                Cosmetics · Wheel Refinishing
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
            <div className="absolute inset-x-0 bottom-14 px-6 md:px-[52px]">
              <h1
                className="m-0 font-bold text-white"
                style={{ fontSize: 'clamp(40px,5.4vw,74px)', letterSpacing: '-0.045em', lineHeight: 0.94 }}
              >
                New wheels,
                <br />
                without new wheels.
              </h1>
              <p
                className="mb-0 mt-5 max-w-[600px] text-[15px] leading-relaxed text-[#c4c4c4]"
                style={{ letterSpacing: '0.2px', textShadow: '0 1px 20px rgba(0,0,0,0.7)' }}
              >
                Wheel repair, custom colors and powder-coat finishes, Austin, Texas.
              </p>
            </div>
            <div className="absolute inset-x-0 bottom-0 grid grid-cols-2 border-t border-white/10 bg-[rgba(8,8,8,0.5)] backdrop-blur-[6px] md:grid-cols-4">
              {RIBBON.map((cell, i) => (
                <div
                  key={cell}
                  className={`px-6 py-[15px] font-mono text-[10.5px] uppercase tracking-[2px] text-[#cfcfcf] ${
                    i < RIBBON.length - 1 ? 'border-r border-white/[0.07]' : ''
                  }`}
                >
                  {cell}
                </div>
              ))}
            </div>
          </div>

          {/* STATEMENT */}
          <div
            data-reveal
            className="grid items-start gap-10 px-6 pb-14 pt-[60px] md:grid-cols-[1.1fr_1fr] md:gap-14 md:px-[52px]"
          >
            <h2
              className="m-0 max-w-[16ch] font-bold text-white"
              style={{ fontSize: 'clamp(28px,3.8vw,54px)', letterSpacing: '-0.035em', lineHeight: 1.02 }}
            >
              The fastest way to change a car&rsquo;s stance and character.
            </h2>
            <div className="pt-1.5">
              <p className="mb-[18px] mt-0 text-[16px] leading-[1.75] text-[#a8a8a8]">
                Wheels are the first thing curb rash and brake dust ruin, and the quickest
                transformation on the whole car. We strip each wheel back, repair curb damage, and
                refinish it in a custom color or powder-coat that&rsquo;s tougher and more even than
                paint.
              </p>
              <p className="m-0 text-[16px] leading-[1.75] text-[#a8a8a8]">
                Gloss, satin, matte, bronze, gunmetal, a factory-match respray or a full color change
                done properly, balanced, and ready to bolt back on.
              </p>
            </div>
          </div>

          {/* PROPERTIES INDEX — Why refinish */}
          <div data-reveal className="border-t border-rb-line bg-rb-surface-2 px-6 pb-[60px] pt-14 md:px-[52px]">
            <div className="mb-[38px] font-mono text-[11px] uppercase tracking-[4px] text-rb-red">
              Why refinish
            </div>
            <div className="grid gap-0.5 border border-rb-line bg-rb-line md:grid-cols-2 lg:grid-cols-4">
              {WHY.map((item, i) => (
                <div key={item.title} className="bg-rb-surface-2 px-7 pb-[34px] pt-[30px]">
                  <div
                    className="mb-5 font-bold text-rb-red"
                    style={{ fontSize: 'clamp(40px,4.6vw,56px)', letterSpacing: '-0.04em', lineHeight: 1 }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="mb-[11px] text-[17px] font-bold tracking-tight text-white">
                    {item.title}
                  </div>
                  <p className="m-0 text-[13.5px] leading-[1.65] text-[#8f8f8f]">{item.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* WHAT WE DO — spec sheet with blended photo */}
          <div className="border-t border-rb-line">
            <div data-reveal className="relative h-[400px] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/trust-gt3rs.jpeg"
                alt="Refinished custom wheels"
                className="absolute inset-0 h-full w-full object-cover"
                style={{ objectPosition: 'center 60%' }}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.35)_0%,rgba(10,10,10,0.1)_34%,rgba(10,10,10,0.55)_68%,rgba(10,10,10,0.92)_90%,#0A0A0A_100%)]" />
              <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-6 px-6 pb-9 md:px-[52px]">
                <div>
                  <div className="mb-4 font-mono text-[11px] uppercase tracking-[4px] text-rb-red">
                    What we do
                  </div>
                  <h2
                    className="m-0 font-bold text-white"
                    style={{ fontSize: 'clamp(34px,4.6vw,62px)', letterSpacing: '-0.04em', lineHeight: 0.98 }}
                  >
                    From curb rash to concours.
                  </h2>
                </div>
                <span
                  className="max-w-[30ch] text-right font-mono text-[11px] tracking-[1px] text-[#999]"
                  style={{ textShadow: '0 1px 12px rgba(0,0,0,0.8)' }}
                >
                  Tell us the look, we&rsquo;ll build the finish to match the car.
                </span>
              </div>
            </div>

            <div data-reveal className="px-6 py-3 md:px-[52px]" style={{ transitionDelay: '100ms' }}>
              {SPEC_ROWS.map((row, i) => (
                <div
                  key={row.step}
                  className={`grid items-start gap-5 py-[38px] md:grid-cols-[320px_1fr] md:gap-9 ${
                    i < SPEC_ROWS.length - 1 ? 'border-b border-[#171717]' : 'pb-[42px]'
                  }`}
                >
                  <div>
                    <div className="mb-3 font-mono text-[11px] uppercase tracking-[2.5px] text-rb-red">
                      {row.step}
                    </div>
                    <div className="mb-[9px] text-[29px] font-semibold tracking-tight text-white">
                      {row.title}
                    </div>
                    <p className="m-0 text-[13px] leading-[1.55] text-[#8f8f8f]">{row.body}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-[7px] pt-1">
                    {row.chips.map((chip) => (
                      <span
                        key={chip}
                        className="border border-rb-border-2 px-[11px] py-1.5 font-mono text-[11px] tracking-[0.5px] text-[#cfcfcf]"
                      >
                        {chip}
                      </span>
                    ))}
                    {row.redChip && (
                      <span className="inline-flex items-center gap-2 border border-rb-red bg-[rgba(204,0,0,0.08)] px-3 py-1.5 font-mono text-[11px] tracking-[0.5px] text-white">
                        <span className="h-[5px] w-[5px] flex-none bg-rb-red" />
                        {row.redChip}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PROCESS — big numbers */}
          <div className="border-t border-rb-line px-6 pb-16 pt-[60px] md:px-[52px]">
            <div data-reveal>
              <div className="mb-[13px] font-mono text-[11px] uppercase tracking-[4px] text-rb-red">
                The process
              </div>
              <h2
                className="m-0 font-bold text-white"
                style={{ fontSize: 'clamp(26px,3.4vw,46px)', letterSpacing: '-0.03em', lineHeight: 1 }}
              >
                Strip, refinish, balance.
              </h2>
            </div>
            <div
              data-reveal
              className="mt-11 grid gap-0.5 border-t border-[#1f1f1f] bg-rb-line md:grid-cols-3"
              style={{ transitionDelay: '100ms' }}
            >
              {PROCESS.map((step, i) => (
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

          {/* FINISH THE WHOLE CAR */}
          <div
            data-reveal
            className="grid items-stretch border-t border-rb-line md:grid-cols-2"
            style={{ transitionDelay: '120ms' }}
          >
            <div className="flex flex-col justify-center px-6 py-[60px] md:px-[52px]">
              <div className="mb-4 font-mono text-[11px] uppercase tracking-[3px] text-rb-red">
                Part of the build
              </div>
              <h3
                className="m-0 mb-5 max-w-[16ch] font-bold text-white"
                style={{ fontSize: 'clamp(24px,3vw,40px)', letterSpacing: '-0.03em', lineHeight: 1.05 }}
              >
                The final touch on the whole car.
              </h3>
              <p className="mb-4 mt-0 text-[15px] leading-[1.75] text-[#a4a4a4]">
                Refinished wheels resolve a bigger transformation. Pair them with a color-change
                wrap, a fresh ceramic and paint protection film and the car leaves looking completely
                finished, every surface handled by the same team, to the same standard.
              </p>
              <p className="m-0 text-[15px] leading-[1.75] text-[#a4a4a4]">
                Tell us the look you&rsquo;re chasing and we&rsquo;ll build the wheel finish to match
                the rest of the car.
              </p>
            </div>
            <div className="relative min-h-[420px] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/hero-lineup.jpeg"
                alt="Finished cars by Red Box Motors"
                className="absolute inset-0 h-full w-full object-cover"
                style={{ objectPosition: 'center 52%' }}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,10,10,0.85)_0%,rgba(10,10,10,0.2)_42%,rgba(10,10,10,0)_100%)]" />
              <div className="absolute bottom-0 left-0 px-[26px] py-[22px]">
                <span className="font-mono text-[10px] uppercase tracking-[2px] text-[#cfcfcf]">
                  Wheels · wrap · ceramic · PPF
                </span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <TintSection tint className="mt-14 flex flex-wrap border-t border-rb-line">
            <div className="relative min-h-[460px] min-w-[280px] flex-[1.05]" style={{ overflow: 'hidden' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/get-in-touch.jpeg"
                alt="Book wheel refinishing"
                className="absolute inset-0 h-full w-full object-cover"
                style={{ objectPosition: 'center 52%' }}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,10,10,0)_55%,rgba(10,10,10,0.55)_82%,rgba(10,10,10,0.95)_100%)]" />
              <div className="absolute bottom-0 left-0 px-[30px] py-[26px]">
                <div className="font-mono text-[11px] uppercase tracking-[3px] text-[#cfcfcf]">
                  Austin, TX
                </div>
              </div>
            </div>
            <div className="flex min-w-[300px] flex-1 flex-col justify-center px-6 py-[72px] md:px-14">
              <div className="mb-6 font-mono text-[11px] uppercase tracking-[4px] text-rb-red">
                Refinish them
              </div>
              <h2
                className="m-0 max-w-[13ch] font-extrabold text-white"
                style={{ fontSize: 'clamp(34px,4.4vw,64px)', letterSpacing: '-0.04em', lineHeight: 0.96 }}
              >
                Change the stance.
              </h2>
              <p className="mb-0 mt-[26px] max-w-[440px] text-[16px] font-medium leading-[1.7] text-rb-tx-mute">
                Send us the wheels and the finish you want, we&rsquo;ll strip, repair and refinish
                them properly.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-[18px]">
                <ContactLink
                  className="rb-btn-red inline-flex items-center gap-3 bg-rb-red px-7 py-4 text-[14px] font-semibold tracking-[0.5px] text-white"
                >
                  Request a quote <ArrowUpRight />
                </ContactLink>
                <Link
                  href="/restoration"
                  className="text-[13px] tracking-[1.5px] text-rb-tx-mute transition-colors duration-150 hover:text-white"
                >
                  All cosmetics →
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
