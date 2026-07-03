import Link from 'next/link';
import { focalPosition, type SurfaceCard } from '@/lib/public/content';

// "Builds & transformations" preview grid (Cosmetics.dc.html) — 4-across
// square project tiles fed by the cosmetics_builds_preview placement slot.
// While the CMS slot is empty the grid renders placeholder stripes.

const STRIPE =
  'repeating-linear-gradient(135deg, #171717 0, #171717 11px, #101010 11px, #101010 22px)';

const tileCls =
  'relative z-[1] block aspect-square cursor-pointer overflow-hidden bg-rb-surface-4 transition-[filter,transform,box-shadow] duration-[240ms] ease-rb hover:z-[5] hover:-translate-y-1.5 hover:scale-[1.014] hover:shadow-[0_26px_54px_rgba(0,0,0,0.62)] hover:brightness-[1.16]';

function TileArt({ card }: { card: SurfaceCard }) {
  return (
    <>
      {card.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={card.image.url}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: focalPosition(card.image) }}
          loading="lazy"
        />
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ backgroundImage: STRIPE }}
        >
          <span className="font-mono text-[11px] tracking-[1px] text-rb-tx-ghost">
            [ {card.label} ]
          </span>
        </div>
      )}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0)_42%,rgba(8,8,8,0.62)_74%,rgba(6,6,6,0.95)_100%)]" />
      <div className="absolute right-[15px] top-[15px] text-white">
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M4 12L12 4M12 4H5.2M12 4V10.8" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </div>
      <div className="absolute inset-x-0 bottom-0 px-4 pb-[18px] pt-4">
        <div className="mb-[5px] text-[9px] uppercase tracking-[2px] text-[#999]">{card.label}</div>
        <div className="mb-1.5 overflow-hidden text-ellipsis whitespace-nowrap text-[15px] font-semibold leading-[1.15] tracking-[-0.015em] text-white">
          {card.title}
        </div>
        <div className="overflow-hidden text-ellipsis whitespace-nowrap font-mono text-[10.5px] tracking-[0.5px] text-[#9a9a9a]">
          {card.spec}
        </div>
      </div>
    </>
  );
}

export function BuildsGrid({ cards }: { cards: SurfaceCard[] }) {
  return (
    <div className="grid grid-cols-2 gap-1.5 px-6 md:px-[52px] lg:grid-cols-4">
      {cards.length > 0
        ? cards.slice(0, 8).map((card) => (
            <Link key={`${card.type}-${card.id}`} href={card.href} className={tileCls}>
              <TileArt card={card} />
            </Link>
          ))
        : Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className="relative flex aspect-square items-center justify-center overflow-hidden bg-rb-surface-4"
              style={{ backgroundImage: STRIPE }}
              aria-hidden
            >
              <span className="font-mono text-[11px] tracking-[1px] text-rb-tx-ghost">
                [ Recent work ]
              </span>
            </div>
          ))}
    </div>
  );
}
