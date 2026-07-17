import Link from 'next/link';
import { ContactLink } from '@/components/contact/ContactModal';

// Full-viewport hero snap section (division prototypes): red badge, staggered
// line-reveal H1 bottom-left, sub line, CTA row, scroll cue bottom-right.

export function HeroBadge({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative z-[2] mb-6 inline-block max-w-full overflow-hidden bg-rb-red px-[14px] py-[10px] md:px-[18px] md:py-[11px]">
      <div
        className="rb-hero-line text-[11px] font-bold uppercase tracking-[2.5px] text-white md:whitespace-nowrap md:text-[13px] md:tracking-[4px]"
        style={{ transform: 'translateY(120%)', animation: 'rbmLine .8s cubic-bezier(.2,.8,.2,1) forwards .18s' }}
      >
        {children}
      </div>
    </div>
  );
}

export function HeroTitle({ lines }: { lines: string[] }) {
  return (
    <h1
      className="relative z-[2] m-0 font-extrabold text-white"
      style={{
        fontSize: 'clamp(34px, 5vw, 76px)',
        letterSpacing: '-0.04em',
        lineHeight: 0.94,
        textShadow: '0 1px 3px rgba(0,0,0,0.45)',
      }}
    >
      {lines.map((line, i) => (
        <span key={line} className="block overflow-hidden pb-[0.14em] -mb-[0.14em]">
          <span
            className="rb-hero-line block"
            style={{
              transform: 'translateY(120%)',
              animation: `rbmLine .95s cubic-bezier(.2,.8,.2,1) forwards ${(0.28 + i * 0.13).toFixed(2)}s`,
            }}
          >
            {line}
          </span>
        </span>
      ))}
    </h1>
  );
}

export function HeroSub({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="rb-hero-in relative z-[2] mb-0 mt-7 text-[16px] font-medium tracking-[0.3px] text-rb-tx-2"
      style={{ textShadow: '0 1px 24px rgba(0,0,0,0.85)', opacity: 0, animation: 'fadeUp .9s cubic-bezier(.2,.8,.2,1) forwards .9s' }}
    >
      {children}
    </p>
  );
}

export function HeroCtas({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rb-hero-in relative z-[2] mt-[38px] flex flex-wrap items-center gap-3.5"
      style={{ opacity: 0, animation: 'fadeUp .9s cubic-bezier(.2,.8,.2,1) forwards 1.05s' }}
    >
      {children}
    </div>
  );
}

export function HeroCtaRed({ href, children }: { href: string; children: React.ReactNode }) {
  const className =
    'rb-btn-red inline-flex items-center gap-2.5 bg-rb-red px-[30px] py-[17px] text-[14px] font-semibold tracking-[0.5px] text-white';
  const inner = (
    <>
      {children}
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path d="M4 12L12 4M12 4H5.2M12 4V10.8" stroke="#fff" strokeWidth="1.5" />
      </svg>
    </>
  );
  // /contact opens the global modal; every other href is a normal link.
  return href === '/contact' ? (
    <ContactLink className={className}>{inner}</ContactLink>
  ) : (
    <Link href={href} className={className}>
      {inner}
    </Link>
  );
}

export function HeroCtaGhost({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rb-btn inline-flex items-center gap-2.5 border border-white/30 px-[30px] py-[17px] text-[14px] font-medium tracking-[0.5px] text-white hover:border-white"
    >
      {children}
    </Link>
  );
}

export function ScrollCue() {
  return (
    <div
      className="rb-hero-in pointer-events-none absolute bottom-[30px] right-6 hidden flex-col items-center gap-[11px] md:flex md:right-11"
      style={{ animation: 'fadeUp 900ms ease both 900ms' }}
      aria-hidden
    >
      <span className="font-mono text-[9px] uppercase tracking-[3px] text-[#cfcfcf]">Scroll</span>
      <div className="relative h-8 w-0.5 overflow-hidden bg-gradient-to-b from-white/30 to-white/5">
        <div
          className="absolute left-0 h-3.5 w-0.5 bg-gradient-to-b from-transparent to-white motion-reduce:hidden"
          style={{ boxShadow: '0 0 9px rgba(255,255,255,0.55)', animation: 'scrollGlideDown 1.8s cubic-bezier(.5,0,.3,1) infinite' }}
        />
      </div>
      <svg width="10" height="6" viewBox="0 0 13 8" fill="none">
        <path d="M1 1.5L6.5 6.5L12 1.5" stroke="#bbb" strokeWidth="1.4" />
      </svg>
    </div>
  );
}

// The hero snap section wrapper: bottom-left content over a soft gradient.
export function HeroSection({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative z-[1] flex h-screen snap-start flex-col items-start justify-end overflow-hidden bg-transparent pb-[8vh] pl-[7vw] pr-6 text-left">
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(10,10,10,0.20) 0%, rgba(10,10,10,0.00) 34%, rgba(10,10,10,0.06) 60%, rgba(8,8,8,0.80) 100%)',
        }}
      />
      {children}
      <ScrollCue />
    </section>
  );
}
