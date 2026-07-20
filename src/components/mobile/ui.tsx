import Link from 'next/link';
import { MHeroVideo } from './MHeroVideo';

// ————————————————————————————————————————————————————————————————
// Mobile design kit (design_handoff_red_box_motors, 390px screens).
// Server-safe primitives shared by every mobile page: eyebrows, buttons,
// hero treatment, photo bands, step rows and the brand row. Values are the
// literal ones from the .dc.html references — keep them exact.
// ————————————————————————————————————————————————————————————————

// Body-copy alpha scale on #EDEDED (README "Design Tokens").
export const ED = (a: number) => `rgba(237,237,237,${a})`;

export const M_HAIRLINE = 'rgba(255,255,255,0.08)';
export const M_SECTION_LINE = 'rgba(255,255,255,0.06)';

export const mEyebrowCls = 'font-plex text-[10px] tracking-[0.35em] text-rb-red';
export const mEyebrowTightCls = 'font-plex text-[10px] tracking-[0.3em] text-rb-red';

export function MArrow({ className = '' }: { className?: string }) {
  return (
    <span className={`text-[16px] leading-none ${className}`} aria-hidden>
      ↗
    </span>
  );
}

// —— Buttons — full-width, label left / ↗ right, square corners ——

const redBtnCls =
  'flex w-full items-center justify-between bg-rb-red px-5 py-[17px] text-[15px] font-bold tracking-[0.01em] text-white transition-[background-color,transform,box-shadow] duration-btn ease-rb hover:bg-[#E00000] hover:shadow-[0_10px_26px_rgba(204,0,0,0.28)] active:bg-[#E00000] active:scale-[0.985] motion-reduce:transform-none motion-reduce:transition-none';
const outlineBtnCls =
  'flex w-full items-center justify-between border border-rb-red px-5 py-4 text-[15px] font-bold text-[#FF6B6B] transition-[background-color,color,transform] duration-btn ease-rb hover:bg-[rgba(204,0,0,0.12)] hover:text-[#FF8888] active:scale-[0.985] motion-reduce:transform-none motion-reduce:transition-none';

export function MBtnRed({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className={redBtnCls}>
      <span>{children}</span>
      <MArrow />
    </Link>
  );
}

export function MBtnOutline({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className={outlineBtnCls}>
      <span>{children}</span>
      <MArrow />
    </Link>
  );
}

// The same buttons around an arbitrary interactive child (ContactLink)
export const mBtnRedCls = redBtnCls;
export const mBtnOutlineCls = outlineBtnCls;

// Quiet text link with a red arrow ("Explore Restoration Services →")
export function MTextLink({
  href,
  children,
  arrow = '→',
}: {
  href: string;
  children: React.ReactNode;
  arrow?: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-0.5 py-3 text-[14px] font-semibold"
      style={{ color: ED(0.75) }}
    >
      {children} <span className="text-rb-red">{arrow}</span>
    </Link>
  );
}

// —— Red badge chip (hero eyebrow chip) ——
export function MBadge({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-rb-red px-3.5 py-[9px] font-plex text-[10px] tracking-[0.3em] text-white">
      {children}
    </div>
  );
}

// —— Hero treatment: full-bleed photo, bottom fade to #0A0A0A, text block
//    overlapping via negative margin ——
export const M_HERO_GRADIENT =
  'linear-gradient(180deg, rgba(10,10,10,0.35) 0%, rgba(10,10,10,0) 30%, rgba(10,10,10,0.55) 62%, rgba(10,10,10,0.96) 87%, #0A0A0A 100%)';

export function MHero({
  src,
  alt,
  height,
  overlap,
  position = 'center',
  padBottom = 48,
  video,
  children,
}: {
  src: string;
  alt: string;
  height: number;
  overlap: number;
  position?: string;
  padBottom?: number;
  /** Light mobile encode — poster paints first, video fades in when playing. */
  video?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="relative">
      <div className="relative w-full overflow-hidden" style={{ height }}>
        {video ? (
          <MHeroVideo video={video} poster={src} alt={alt} position={position} />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: position }}
          />
        )}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: M_HERO_GRADIENT }}
        />
      </div>
      <div
        className="relative flex flex-col items-start gap-[18px] px-5"
        style={{ marginTop: -overlap, paddingBottom: padBottom }}
      >
        {children}
      </div>
    </section>
  );
}

// —— Full-bleed photo band with a bottom fade + optional mono caption ——
export function MPhotoBand({
  src,
  alt,
  height,
  position = 'center',
  caption,
  gradient = 'linear-gradient(180deg, rgba(10,10,10,0) 50%, rgba(10,10,10,0.9) 92%, #0A0A0A 100%)',
  children,
}: {
  src: string;
  alt: string;
  height: number;
  position?: string;
  caption?: string;
  gradient?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="relative w-full" style={{ height }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: position }}
        loading="lazy"
      />
      <div className="pointer-events-none absolute inset-0" style={{ background: gradient }} />
      {caption && (
        <div
          className="pointer-events-none absolute bottom-4 left-5 font-plex text-[9px] tracking-[0.3em]"
          style={{ color: ED(0.6) }}
        >
          {caption}
        </div>
      )}
      {children}
    </div>
  );
}

// —— Numbered step row (How It Works / Consignment steps) ——
export function MStepRow({ num, title, body }: { num: string; title: string; body: string }) {
  return (
    <div className="flex gap-[18px] border-t py-5" style={{ borderColor: M_HAIRLINE }}>
      <div className="min-w-[46px] text-[30px] font-extrabold leading-none tracking-tight text-rb-red">
        {num}
      </div>
      <div className="flex flex-col gap-[7px]">
        <div className="text-[17px] font-bold text-white">{title}</div>
        <div className="text-[14px] leading-[1.6]" style={{ color: ED(0.65) }}>
          {body}
        </div>
      </div>
    </div>
  );
}

// —— Brand row: cube logo + mono caption (footers / section closers) ——
export function MBrandRow({ label, size = 12 }: { label: string; size?: number }) {
  return (
    <div className="flex items-center gap-2.5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/brand/rbm-logo-header.png" alt="" style={{ width: size + 4, height: size + 4 }} />
      <div className="font-plex text-[9px] tracking-[0.22em]" style={{ color: ED(0.45) }}>
        {label}
      </div>
    </div>
  );
}

// —— Section H2 (34–38px/800) ——
export function MH2({
  children,
  size = 38,
  className = '',
}: {
  children: React.ReactNode;
  size?: number;
  className?: string;
}) {
  return (
    <h2
      className={`m-0 font-extrabold tracking-tight text-white ${className}`}
      style={{ fontSize: size, lineHeight: 1.04, textWrap: 'balance' }}
    >
      {children}
    </h2>
  );
}
