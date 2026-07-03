import Link from 'next/link';
import { getSurfaceCards, focalPosition, type SurfaceCard } from '@/lib/public/content';

// Sliding "Featured" marquee (Feature Bar.dc.html) — for-sale + recent-work
// cards. Reads the feature_bar placement slot (auto-fallback when empty).
// Pure CSS loop: the list renders twice and translates -50%; pauses on hover.

function MarqueeCard({ card, ariaHidden }: { card: SurfaceCard; ariaHidden?: boolean }) {
  return (
    <Link
      href={card.href}
      aria-hidden={ariaHidden}
      tabIndex={ariaHidden ? -1 : undefined}
      className="relative block h-[158px] flex-none basis-[180px] overflow-hidden bg-rb-surface-4 transition-[filter] duration-200 hover:brightness-125"
    >
      {card.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={card.image.thumb_url ?? card.image.url}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: focalPosition(card.image) }}
          loading="lazy"
        />
      ) : (
        <div className="rb-stripe absolute inset-0" />
      )}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0)_38%,rgba(8,8,8,0.6)_70%,rgba(6,6,6,0.94)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 px-3 pb-[11px] pt-2.5">
        <div className="overflow-hidden text-ellipsis whitespace-nowrap text-[12.5px] font-medium tracking-tight text-white">
          {card.title}
        </div>
        <div className="mt-1.5 flex items-center justify-between gap-2">
          <span className="overflow-hidden text-ellipsis whitespace-nowrap font-mono text-[10px] tracking-[0.5px] text-[#9a9a9a]">
            {card.spec}
          </span>
          {card.label === 'FOR SALE' ? (
            <span className="flex-none whitespace-nowrap bg-rb-red px-[7px] py-1 font-mono text-[8px] tracking-[1.5px] text-white">
              FOR SALE
            </span>
          ) : (
            <span className="flex-none whitespace-nowrap border border-[#444] px-1.5 py-[3px] font-mono text-[8px] tracking-[1.5px] text-[#cfcfcf]">
              {card.label}
            </span>
          )}
        </div>
      </div>
      <span className="absolute right-[11px] top-[11px] text-white">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M4 12L12 4M12 4H5.2M12 4V10.8" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </span>
    </Link>
  );
}

export async function FeatureBar() {
  const cards = await getSurfaceCards('feature_bar', 8);
  if (cards.length === 0) return null;

  return (
    <div className="border-t border-rb-line bg-rb-surface">
      <div className="flex items-center justify-between px-7 pb-[11px] pt-3">
        <span className="text-[13px] font-bold uppercase tracking-[2px] text-rb-tx-mute-2">
          Featured
        </span>
        <span className="font-mono text-[11px] tracking-[1px] text-rb-tx-faint-2">
          for sale + recent work
        </span>
      </div>
      <div className="group overflow-hidden bg-black">
        <div className="flex w-max gap-0.5 motion-safe:animate-rb-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          {cards.map((c) => (
            <MarqueeCard key={`${c.type}-${c.id}`} card={c} />
          ))}
          {cards.map((c) => (
            <MarqueeCard key={`${c.type}-${c.id}-dup`} card={c} ariaHidden />
          ))}
        </div>
      </div>
    </div>
  );
}
