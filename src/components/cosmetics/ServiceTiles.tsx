import Link from 'next/link';

// Cosmetics landing (Cosmetics.dc.html) — the five service tiles inside the
// boxed overview, plus the inline service picker in the "Bring us the car"
// CTA. Copy is the approved prototype copy — verbatim.

type ServiceTile = {
  href: string;
  title: string;
  desc: string;
  img: string;
  position: string;
  icon: React.ReactNode;
};

const TILES: ServiceTile[] = [
  {
    href: '/cosmetics/ppf',
    title: 'Paint Protection',
    desc: 'Self-healing STEK film — full-body and high-impact coverage.',
    img: '/assets/ppf-hero.jpg',
    position: 'center 55%',
    icon: (
      <svg width="22" height="22" viewBox="0 0 16 16" fill="none" aria-hidden>
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
    href: '/cosmetics/ceramic-correction',
    title: 'Ceramic & Correction',
    desc: 'Correct the swirls, seal the gloss with Carbon Collective coatings.',
    img: '/assets/placeholders/detail-bay.jpg',
    position: 'center 50%',
    icon: (
      <svg width="22" height="22" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path
          d="M8 2.5C8 2.5 4 6.5 4 9.5A4 4 0 0 0 12 9.5C12 6.5 8 2.5 8 2.5Z"
          stroke="#fff"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    href: '/cosmetics/vinyl',
    title: 'Vinyl Wrap',
    desc: 'Color-change, custom and fully reversible wraps.',
    img: '/assets/mclaren-p1.jpg',
    position: 'center 45%',
    icon: (
      <svg width="22" height="22" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path d="M8 2.5L14 5.5L8 8.5L2 5.5L8 2.5Z" stroke="#fff" strokeWidth="1.3" strokeLinejoin="round" />
        <path d="M2.5 8.5L8 11.2L13.5 8.5" stroke="#fff" strokeWidth="1.3" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: '/cosmetics/wheels',
    title: 'Wheel Refinishing',
    desc: 'Strip, powder coat and custom finishes.',
    img: '/assets/dealer-garage.jpeg',
    position: 'center 55%',
    icon: (
      <svg width="22" height="22" viewBox="0 0 16 16" fill="none" aria-hidden>
        <circle cx="8" cy="8" r="5.3" stroke="#fff" strokeWidth="1.3" />
        <circle cx="8" cy="8" r="1.4" stroke="#fff" strokeWidth="1.3" />
        <path d="M8 2.7V5.3M8 10.7V13.3M2.7 8H5.3M10.7 8H13.3" stroke="#fff" strokeWidth="1.3" />
      </svg>
    ),
  },
  {
    href: '/cosmetics/custom-builds',
    title: 'Custom Builds',
    desc: 'Ground-up builds and modifications, executed end to end.',
    img: '/assets/ppf-hero.jpg',
    position: 'center 40%',
    icon: (
      <svg width="22" height="22" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path d="M8 2.5L13.5 8L8 13.5L2.5 8Z" stroke="#fff" strokeWidth="1.3" strokeLinejoin="round" />
      </svg>
    ),
  },
];

// The five-tile service mosaic (blurred photo backdrops, red icon squares).
export function ServiceTiles() {
  return (
    <div
      data-reveal
      className="grid gap-2 px-6 pt-11 md:px-[52px]"
      style={{
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        transitionDelay: '.3s',
      }}
    >
      {TILES.map((t) => (
        <Link
          key={t.href + t.title}
          href={t.href}
          className="relative z-[1] flex min-h-[300px] cursor-pointer flex-col justify-between overflow-hidden bg-rb-surface-4 p-[26px] pb-[22px] transition-[filter,transform,box-shadow] duration-[240ms] ease-rb hover:z-[2] hover:-translate-y-[5px] hover:shadow-[0_22px_46px_rgba(0,0,0,0.6)] hover:brightness-[1.22] active:translate-y-0 active:scale-[0.99]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={t.img}
            alt=""
            className="absolute inset-0 h-full w-full scale-[1.35] object-cover opacity-50 blur-[26px] brightness-[0.6] saturate-[1.2]"
            style={{ objectPosition: t.position }}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(14,14,14,0.5)_0%,rgba(10,10,10,0.85)_100%)]" />
          <div className="relative flex items-start justify-between">
            <div
              className="flex h-[46px] w-[46px] flex-none items-center justify-center bg-rb-red"
              style={{ boxShadow: '0 6px 20px rgba(204,0,0,0.4)' }}
            >
              {t.icon}
            </div>
          </div>
          <div className="relative">
            <div className="mb-[7px] text-[20px] font-semibold tracking-tight text-white">{t.title}</div>
            <div className="mb-4 text-[12.5px] leading-[1.5] text-[#a2a2a2]">{t.desc}</div>
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[2px] text-rb-red">
              Explore
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M4 12L12 4M12 4H5.2M12 4V10.8" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

// Inline service picker in the "Bring us the car" CTA (labels differ slightly
// from the tiles — prototype-verbatim).
const PICKER: { href: string; label: string }[] = [
  { href: '/cosmetics/ppf', label: 'Paint Protection Film' },
  { href: '/cosmetics/ceramic-correction', label: 'Ceramic & Correction' },
  { href: '/cosmetics/vinyl', label: 'Vinyl Wrap' },
  { href: '/cosmetics/wheels', label: 'Wheel Refinishing' },
  { href: '/cosmetics/custom-builds', label: 'Custom Builds' },
];

export function ServicePicker() {
  return (
    <div data-reveal className="mt-8 border-t border-[#232323]" style={{ transitionDelay: '.12s' }}>
      {PICKER.map((s) => (
        <Link
          key={s.href}
          href={s.href}
          className="flex cursor-pointer items-center justify-between gap-4 border-b border-rb-line-2 px-1 py-4 transition-[padding-left,background] duration-200 hover:bg-[rgba(204,0,0,0.06)] hover:pl-3.5"
        >
          <span className="flex items-center gap-3.5">
            <span className="h-[7px] w-[7px] flex-none bg-rb-red" />
            <span className="text-[15px] font-semibold tracking-[0.3px] text-white">{s.label}</span>
          </span>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="flex-none" aria-hidden>
            <path d="M4 12L12 4M12 4H5.2M12 4V10.8" stroke="#CC0000" strokeWidth="1.5" />
          </svg>
        </Link>
      ))}
    </div>
  );
}
