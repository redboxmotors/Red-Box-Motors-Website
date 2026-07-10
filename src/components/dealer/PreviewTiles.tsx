import Link from 'next/link';
import type { SurfaceCard } from '@/lib/public/content';
import { focalPosition } from '@/lib/public/content';

// Square preview tiles for the Dealer overview's three curated rows
// (Dealer.dc.html → salePreview / soldPreview / foundPreview). Cards come
// from getSurfaceCards(); when a surface is empty (DB unreachable, nothing
// placed yet) the grid renders striped placeholder squares instead.

export type PreviewVariant = 'forsale' | 'sold' | 'sourced';

const tileCls =
  'relative z-[1] block aspect-video overflow-hidden bg-rb-surface-4 transition-[filter,transform,box-shadow] duration-[260ms] ease-rb hover:z-[5] hover:-translate-y-1.5 hover:scale-[1.014] hover:shadow-[0_26px_54px_rgba(0,0,0,0.62)] hover:brightness-[1.16]';

function Badge({ variant, label }: { variant: PreviewVariant; label: string }) {
  if (variant === 'forsale') {
    return (
      <div className="absolute left-3.5 top-3.5 bg-rb-red px-[9px] py-[5px]">
        <span className="font-mono text-[9px] tracking-[1.5px] text-white">{label}</span>
      </div>
    );
  }
  if (variant === 'sold') {
    return (
      <div className="absolute left-3.5 top-3.5 border border-[#555] px-[9px] py-[5px]">
        <span className="font-mono text-[9px] tracking-[2px] text-[#bbb]">SOLD</span>
      </div>
    );
  }
  return (
    <div className="absolute left-3.5 top-3.5 flex items-center gap-2">
      <span className="h-1.5 w-1.5 flex-none bg-rb-red" />
      <span className="font-mono text-[9px] uppercase tracking-[1.5px] text-[#cfcfcf]">{label}</span>
    </div>
  );
}

function PreviewTile({ card, variant }: { card: SurfaceCard; variant: PreviewVariant }) {
  return (
    <Link href={card.href} className={tileCls}>
      {card.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={card.image.url}
          alt={card.image.alt || card.title}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: focalPosition(card.image) }}
          loading="lazy"
        />
      ) : (
        <div className="rb-stripe absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-[11px] tracking-[1px] text-[#383838]">
            [ {card.title.toLowerCase()} ]
          </span>
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 h-[62%] bg-[linear-gradient(transparent,rgba(0,0,0,0.55)_45%,rgba(0,0,0,0.94))]" />
      <Badge variant={variant} label={card.label} />
      {variant === 'forsale' && (
        <div className="absolute right-4 top-4 text-white">
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M4 12L12 4M12 4H5.2M12 4V10.8" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 px-5 pb-[18px]">
        {card.eyebrow && (
          <div className="mb-[5px] text-[10px] uppercase tracking-[2px] text-[#999]">{card.eyebrow}</div>
        )}
        <div className="overflow-hidden text-ellipsis whitespace-nowrap text-[19px] font-medium tracking-[-0.015em] text-white">
          {card.eyebrow ? card.name : card.title}
        </div>
        {(card.meta ?? card.spec) && (
          <div
            className={`mt-1.5 overflow-hidden text-ellipsis whitespace-nowrap font-mono text-[11px] tracking-[0.3px] ${
              variant === 'forsale' ? 'text-[#cfcfcf]' : 'text-[#9a9a9a]'
            }`}
          >
            {card.meta ?? card.spec}
          </div>
        )}
      </div>
    </Link>
  );
}

export function PreviewGrid({ cards, variant }: { cards: SurfaceCard[]; variant: PreviewVariant }) {
  return (
    <div
      data-reveal
      style={{ transitionDelay: '.14s' }}
      className="grid gap-1.5 px-1.5 pt-8 md:grid-cols-3"
    >
      {cards.length > 0
        ? cards.map((c) => <PreviewTile key={`${c.type}-${c.id}`} card={c} variant={variant} />)
        : [0, 1, 2].map((i) => <div key={i} className="rb-stripe aspect-video" aria-hidden />)}
    </div>
  );
}
