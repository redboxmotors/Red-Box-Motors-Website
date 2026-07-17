import Link from 'next/link';
import { ContactLink } from '@/components/contact/ContactModal';
import { SiteNav } from '@/components/site/SiteNav';
import { ExpandingScrollBox } from '@/components/site/ExpandingScrollBox';

// Shared layout for the cosmetics "full SEO scroll page" service routes
// (PPF.dc.html / Ceramic & Correction.dc.html / Vinyl.dc.html). No page hero —
// the route opens straight into the expanding box whose first section is the
// faded mini-hero photo with a spec ribbon. All copy comes in via
// ServicePageContent and is the approved prototype copy, verbatim.
//
// Section order (matches the prototypes):
//   mini-hero → statement → properties index → packages spec-sheet →
//   process (optional; Ceramic/Vinyl) → split photo/text sections → CTA →
//   Visit & FAQ.

export type ChipTone = 'default' | 'dim' | 'red';

export interface Chip {
  label: string;
  tone?: ChipTone;
}

export interface ServicePhoto {
  src: string;
  alt: string;
  position?: string;
}

export interface PackageRow {
  kicker: string; // "01 · Front-end"
  title: string;
  desc: string;
  chips: Chip[];
}

export interface SplitSection {
  photoSide: 'left' | 'right';
  photo: ServicePhoto;
  minHeight?: number;
  caption: string; // mono caption bottom-left of the photo
  kicker: string;
  heading: string;
  headingMax?: string; // e.g. '15ch'
  paras: string[];
  chips?: Chip[];
  chipsUppercase?: boolean;
}

export interface ServicePageContent {
  /** Fixed, blurred page backdrop behind the box */
  bg: ServicePhoto;
  /** Top-left mono kicker, e.g. "— Cosmetics · Paint Protection Film" */
  kicker: string;
  hero: ServicePhoto;
  titleLines: [string, string];
  sub: string;
  /** Spec ribbon along the bottom of the mini-hero (4 items) */
  ribbon: string[];
  statement: { heading: string; paras: string[] };
  properties: { kicker: string; items: { title: string; text: string }[] };
  packages: {
    photo: ServicePhoto;
    kicker: string;
    heading: string;
    note: string;
    rows: PackageRow[];
  };
  process?: { heading: string; steps: { title: string; text: string }[] };
  splits: SplitSection[];
  cta: {
    /** 'wrap' = PPF variant (16,16,16 scrim); 'flush' = Ceramic/Vinyl (56px top margin, 10,10,10 scrim) */
    variant: 'wrap' | 'flush';
    photoAlt: string;
    kicker: string;
    heading: string;
    text: string;
    secondary: { label: string; href: string };
  };
}

// Prototype reveals run at .9s (global [data-reveal] default is 500ms) — pin
// the duration inline; the transform/opacity states stay CSS-driven so the
// revealed state still wins.
const reveal = (delay?: number): React.CSSProperties => ({
  transitionDuration: '.9s',
  ...(delay ? { transitionDelay: `${delay}s` } : {}),
});

function SpecChip({
  chip,
  wide = false,
  uppercase = false,
}: {
  chip: Chip;
  /** split sections use 6px 12px padding; package rows 6px 11px */
  wide?: boolean;
  uppercase?: boolean;
}) {
  if (chip.tone === 'red') {
    return (
      <span className="inline-flex items-center gap-2 border border-rb-red bg-[rgba(204,0,0,0.08)] px-3 py-1.5 font-mono text-[11px] tracking-[0.5px] text-white">
        <span className="h-[5px] w-[5px] flex-none bg-rb-red" />
        {chip.label}
      </span>
    );
  }
  const dim = chip.tone === 'dim';
  return (
    <span
      className={`border py-1.5 font-mono text-[11px] tracking-[0.5px] ${
        dim ? 'border-rb-border text-rb-tx-mute-3' : 'border-rb-border-2 text-[#cfcfcf]'
      } ${wide ? 'px-3' : 'px-[11px]'} ${uppercase ? 'uppercase' : ''}`}
    >
      {chip.label}
    </span>
  );
}

function ArrowUpRight({ size = 15, stroke = '#fff', width = 1.5 }: { size?: number; stroke?: string; width?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M4 12L12 4M12 4H5.2M12 4V10.8" stroke={stroke} strokeWidth={width} />
    </svg>
  );
}

export function ServiceScrollPage({
  content: c,
  visitAndFaq,
}: {
  content: ServicePageContent;
  visitAndFaq: React.ReactNode;
}) {
  const ctaScrim = c.cta.variant === 'wrap' ? '16,16,16' : '10,10,10';

  return (
    <div className="relative bg-rb-bg text-white antialiased">
      {/* fixed blurred backdrop + dim (detail-page background system) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={c.bg.src} alt="" className="rb-bg-photo" style={{ objectPosition: c.bg.position ?? 'center 56%' }} />
      <div className="rb-bg-dim" />

      <SiteNav current="cosmetics" />

      <div className="rb-noscrollbar relative z-[1] bg-transparent md:h-screen md:snap-y md:snap-proximity md:overflow-y-auto">
        <ExpandingScrollBox>
          {/* ——— MINI-HERO with spec ribbon ——— */}
          <div className="relative h-[480px] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={c.hero.src}
              alt={c.hero.alt}
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: c.hero.position }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.15)_0%,rgba(10,10,10,0.05)_34%,rgba(10,10,10,0.6)_72%,rgba(10,10,10,0.94)_92%,#0A0A0A_100%)]" />
            <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-5 px-6 pt-[34px] md:px-[52px]">
              <div className="font-mono text-[11px] uppercase tracking-[4px] text-rb-red">{c.kicker}</div>
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
                {c.titleLines[0]}
                <br />
                {c.titleLines[1]}
              </h1>
              <p
                className="mb-0 mt-5 max-w-[600px] text-[15px] leading-[1.6] tracking-[0.2px] text-[#c4c4c4]"
                style={{ textShadow: '0 1px 20px rgba(0,0,0,0.7)' }}
              >
                {c.sub}
              </p>
            </div>
            <div className="absolute inset-x-0 bottom-0 grid grid-cols-2 border-t border-white/10 bg-[rgba(8,8,8,0.5)] backdrop-blur-[6px] md:grid-cols-4">
              {c.ribbon.map((item, i) => (
                <div
                  key={item}
                  className={`px-6 py-[15px] font-mono text-[10.5px] uppercase tracking-[2px] text-[#cfcfcf] ${
                    i < c.ribbon.length - 1 ? 'border-r border-white/[0.07]' : ''
                  }`}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* ——— STATEMENT ——— */}
          <div
            data-reveal
            style={reveal()}
            className="grid items-start gap-8 px-6 pb-14 pt-[60px] md:grid-cols-[1.1fr_1fr] md:gap-14 md:px-[52px]"
          >
            <h2
              className="m-0 max-w-[16ch] font-bold text-white"
              style={{ fontSize: 'clamp(28px,3.8vw,54px)', letterSpacing: '-0.035em', lineHeight: 1.02 }}
            >
              {c.statement.heading}
            </h2>
            <div className="pt-1.5">
              {c.statement.paras.map((p, i) => (
                <p
                  key={i}
                  className={`mt-0 text-[16px] leading-[1.75] text-[#a8a8a8] ${
                    i < c.statement.paras.length - 1 ? 'mb-[18px]' : 'mb-0'
                  }`}
                >
                  {p}
                </p>
              ))}
            </div>
          </div>

          {/* ——— PROPERTIES INDEX ——— */}
          <div
            data-reveal
            style={reveal()}
            className="border-t border-rb-line bg-rb-surface-2 px-6 pb-[60px] pt-14 md:px-[52px]"
          >
            <div className="mb-[38px] font-mono text-[11px] uppercase tracking-[4px] text-rb-red">
              {c.properties.kicker}
            </div>
            <div className="grid gap-[2px] border border-rb-line bg-rb-line sm:grid-cols-2 md:grid-cols-4">
              {c.properties.items.map((item, i) => (
                <div key={item.title} className="bg-rb-surface-2 px-7 pb-[34px] pt-[30px]">
                  <div
                    className="mb-5 font-bold leading-none text-rb-red"
                    style={{ fontSize: 'clamp(40px,4.6vw,56px)', letterSpacing: '-0.04em' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="mb-[11px] text-[17px] font-bold tracking-[-0.01em] text-white">{item.title}</div>
                  <p className="m-0 text-[13.5px] leading-[1.65] text-[#8f8f8f]">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ——— PACKAGES — spec sheet with blended photo ——— */}
          <div className="border-t border-rb-line">
            <div data-reveal style={reveal()} className="relative h-[400px] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.packages.photo.src}
                alt={c.packages.photo.alt}
                className="absolute inset-0 h-full w-full object-cover"
                style={{ objectPosition: c.packages.photo.position }}
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.35)_0%,rgba(10,10,10,0.1)_34%,rgba(10,10,10,0.55)_68%,rgba(10,10,10,0.92)_90%,#0A0A0A_100%)]" />
              <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-6 px-6 pb-9 md:px-[52px]">
                <div>
                  <div className="mb-4 font-mono text-[11px] uppercase tracking-[4px] text-rb-red">
                    {c.packages.kicker}
                  </div>
                  <h2
                    className="m-0 font-bold text-white"
                    style={{ fontSize: 'clamp(34px,4.6vw,62px)', letterSpacing: '-0.04em', lineHeight: 0.98 }}
                  >
                    {c.packages.heading}
                  </h2>
                </div>
                <span
                  className="max-w-[30ch] text-right font-mono text-[11px] tracking-[1px] text-[#999]"
                  style={{ textShadow: '0 1px 12px rgba(0,0,0,0.8)' }}
                >
                  {c.packages.note}
                </span>
              </div>
            </div>

            <div data-reveal style={reveal(0.1)} className="px-6 py-3 md:px-[52px]">
              {c.packages.rows.map((row, i) => {
                const last = i === c.packages.rows.length - 1;
                return (
                  <div
                    key={row.kicker}
                    className={`grid items-start gap-9 pt-[38px] md:grid-cols-[320px_1fr] ${
                      last ? 'pb-[42px]' : 'border-b border-[#171717] pb-[38px]'
                    }`}
                  >
                    <div>
                      <div className="mb-3 font-mono text-[11px] uppercase tracking-[2.5px] text-rb-red">
                        {row.kicker}
                      </div>
                      <div className="mb-[9px] text-[29px] font-semibold tracking-tight text-white">{row.title}</div>
                      <p className="m-0 text-[13px] leading-[1.55] text-[#8f8f8f]">{row.desc}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-[7px] pt-1">
                      {row.chips.map((chip) => (
                        <SpecChip key={chip.label} chip={chip} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ——— PROCESS — big numbers (Ceramic / Vinyl) ——— */}
          {c.process && (
            <div className="border-t border-rb-line px-6 pb-16 pt-[60px] md:px-[52px]">
              <div data-reveal style={reveal()}>
                <div className="mb-[13px] font-mono text-[11px] uppercase tracking-[4px] text-rb-red">
                  The process
                </div>
                <h2
                  className="m-0 font-bold leading-none text-white"
                  style={{ fontSize: 'clamp(26px,3.4vw,46px)', letterSpacing: '-0.03em' }}
                >
                  {c.process.heading}
                </h2>
              </div>
              <div
                data-reveal
                style={reveal(0.1)}
                className="mt-11 grid gap-[2px] border-t border-[#1f1f1f] bg-rb-line md:grid-cols-3"
              >
                {c.process.steps.map((step, i) => (
                  <div key={step.title} className="bg-rb-surface px-8 pb-[30px] pt-[34px]">
                    <div
                      className="mb-[18px] font-bold leading-none text-rb-red"
                      style={{ fontSize: 'clamp(44px,5vw,62px)', letterSpacing: '-0.04em' }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div className="mb-3 text-[19px] font-bold tracking-[-0.01em] text-white">{step.title}</div>
                    <p className="m-0 text-[14px] leading-[1.65] text-[#999]">{step.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ——— SPLIT PHOTO / TEXT SECTIONS ——— */}
          {c.splits.map((s) => {
            const photoEl = (
              <div className="relative overflow-hidden" style={{ minHeight: s.minHeight ?? 420 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.photo.src}
                  alt={s.photo.alt}
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ objectPosition: s.photo.position }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      s.photoSide === 'left'
                        ? 'linear-gradient(90deg,rgba(10,10,10,0) 0%,rgba(10,10,10,0.2) 58%,rgba(10,10,10,0.85) 100%)'
                        : 'linear-gradient(90deg,rgba(10,10,10,0.85) 0%,rgba(10,10,10,0.2) 42%,rgba(10,10,10,0) 100%)',
                  }}
                />
                <div className="absolute bottom-0 left-0 px-[26px] py-[22px]">
                  <span className="font-mono text-[10px] uppercase tracking-[2px] text-[#cfcfcf]">{s.caption}</span>
                </div>
              </div>
            );
            const textEl = (
              <div className="flex flex-col justify-center px-6 py-[60px] md:px-[52px]">
                <div className="mb-4 font-mono text-[11px] uppercase tracking-[3px] text-rb-red">{s.kicker}</div>
                <h3
                  className="mb-5 mt-0 font-bold text-white"
                  style={{
                    fontSize: 'clamp(24px,3vw,40px)',
                    letterSpacing: '-0.03em',
                    lineHeight: 1.05,
                    maxWidth: s.headingMax ?? '16ch',
                  }}
                >
                  {s.heading}
                </h3>
                {s.paras.map((p, i) => {
                  const isLast = i === s.paras.length - 1;
                  return (
                    <p
                      key={i}
                      className={`mt-0 text-[15px] leading-[1.75] text-[#a4a4a4] ${
                        isLast ? (s.chips ? 'mb-7' : 'mb-0') : 'mb-4'
                      }`}
                    >
                      {p}
                    </p>
                  );
                })}
                {s.chips && (
                  <div className="flex flex-wrap gap-[7px]">
                    {s.chips.map((chip) => (
                      <SpecChip key={chip.label} chip={chip} wide uppercase={s.chipsUppercase} />
                    ))}
                  </div>
                )}
              </div>
            );
            return (
              <div
                key={s.kicker}
                data-reveal
                style={reveal(0.12)}
                className="grid items-stretch border-t border-rb-line md:grid-cols-2"
              >
                {s.photoSide === 'left' ? (
                  <>
                    {photoEl}
                    {textEl}
                  </>
                ) : (
                  <>
                    {textEl}
                    {photoEl}
                  </>
                )}
              </div>
            );
          })}

          {/* ——— CTA ——— */}
          <div className={`flex flex-wrap border-t border-rb-line bg-[#101010] ${c.cta.variant === 'flush' ? 'mt-14' : ''}`}>
            <div className="relative min-h-[460px] overflow-hidden" style={{ flex: '1.05', minWidth: 280 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/get-in-touch.jpeg"
                alt={c.cta.photoAlt}
                className="absolute inset-0 h-full w-full object-cover"
                style={{ objectPosition: 'center 52%' }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(90deg,rgba(${ctaScrim},0) 55%,rgba(${ctaScrim},0.55) 82%,rgba(${ctaScrim},0.95) 100%)`,
                }}
              />
              <div className="absolute bottom-0 left-0 px-[30px] py-[26px]">
                <div className="font-mono text-[11px] uppercase tracking-[3px] text-[#cfcfcf]">
                  Austin, TX
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center px-6 py-[72px] md:px-14" style={{ flex: '1', minWidth: 300 }}>
              <div className="mb-6 font-mono text-[11px] uppercase tracking-[4px] text-rb-red">{c.cta.kicker}</div>
              <h2
                className="m-0 max-w-[13ch] font-extrabold text-white"
                style={{ fontSize: 'clamp(34px,4.4vw,64px)', letterSpacing: '-0.04em', lineHeight: 0.96 }}
              >
                {c.cta.heading}
              </h2>
              <p className="mb-0 mt-[26px] max-w-[440px] text-[16px] font-medium leading-[1.7] text-rb-tx-mute">
                {c.cta.text}
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-[18px]">
                <ContactLink
                  className="rb-btn-red inline-flex items-center gap-3 bg-rb-red px-7 py-4 text-[14px] font-semibold tracking-[0.5px] text-white"
                >
                  Request a quote
                  <ArrowUpRight />
                </ContactLink>
                <Link
                  href={c.cta.secondary.href}
                  className="text-[13px] tracking-[1.5px] text-rb-tx-mute transition-colors duration-150 hover:text-white"
                >
                  {c.cta.secondary.label}
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
          </div>

          {/* ——— VISIT & FAQ ——— */}
          <div className="border-t border-rb-line">{visitAndFaq}</div>
        </ExpandingScrollBox>
      </div>

      {/* fixed contact chip */}
      <ContactLink
        className="rb-corner-cta fixed right-[18px] z-40 md:right-[26px] flex items-center gap-[11px] border border-rb-border-2 bg-rb-surface px-[18px] py-[13px] transition-[border-color,background,transform,box-shadow] duration-btn ease-rb hover:-translate-y-[3px] hover:border-[#555] hover:bg-rb-raised hover:shadow-[0_14px_30px_rgba(0,0,0,0.55)] active:translate-y-0 active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:transform-none"
      >
        <span className="h-[7px] w-[7px] flex-none bg-rb-red" />
        <span className="text-[12px] tracking-[1.5px] text-white">Contact</span>
        <ArrowUpRight size={13} stroke="#888" width={1.3} />
      </ContactLink>
    </div>
  );
}
