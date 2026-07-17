import type { DbImage } from '@/lib/db/types';
import { CmsImage } from '@/components/site/PhotoTile';
import { ContactLink } from '@/components/contact/ContactModal';

// Shared card for the Sold / Sourced 3-across galleries (Sold.dc.html /
// Sourced.dc.html): striped placeholder art under the CMS photo, red-dot
// badge top-left, hover-revealed spec / placement meta, year·make + model
// bottom-left over a scrim. Hover lift/brighten comes from .rb-tile; the
// meta reveal is pure CSS (group-hover), so this stays a server component.

export function GalleryCard({
  image,
  alt,
  tag,
  badge,
  spec,
  metaLabel,
  metaValue,
  topLine,
  title,
}: {
  image: DbImage | null;
  alt: string;
  tag: string;
  badge: string;
  spec: string | null;
  metaLabel: string;
  metaValue: string | null;
  topLine: string;
  title: string;
}) {
  return (
    <div className="rb-tile group relative z-[1] h-[400px] cursor-pointer overflow-hidden bg-rb-surface">
      {/* striped placeholder art (where the CMS photo lands) */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          backgroundImage:
            'repeating-linear-gradient(135deg,#171717 0,#171717 11px,#101010 11px,#101010 22px)',
        }}
      >
        <span className="font-mono text-[11px] tracking-[1px] text-[#383838]">[ {tag} ]</span>
      </div>
      {image && <CmsImage image={image} alt={alt} className="absolute inset-0 h-full w-full" />}
      <div className="absolute inset-x-0 bottom-0 h-[66%] bg-[linear-gradient(transparent,rgba(0,0,0,0.55)_42%,rgba(0,0,0,0.94))]" />

      {/* badge */}
      <div className="absolute left-4 top-4 flex items-center gap-2 border border-[#2e2e2e] bg-black/40 px-2.5 py-[5px]">
        <span className="h-[5px] w-[5px] flex-none bg-rb-red" />
        <span className="font-mono text-[9px] uppercase tracking-[1.5px] text-[#cfcfcf]">{badge}</span>
      </div>

      {/* hover meta — spec + placement rows */}
      {(spec || metaValue) && (
        <div className="absolute inset-x-0 bottom-[78px] flex translate-y-[10px] gap-[26px] px-[22px] opacity-0 transition-[transform,opacity] duration-[180ms] ease-[ease] group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none">
          {spec && (
            <div className="flex min-w-0 flex-col gap-1">
              <span className="text-[9px] uppercase tracking-[1.5px] text-rb-tx-mute-3">Spec</span>
              <span className="overflow-hidden text-ellipsis whitespace-nowrap text-[12.5px] text-[#ddd]">
                {spec}
              </span>
            </div>
          )}
          {metaValue && (
            <div className="flex min-w-0 flex-col gap-1">
              <span className="text-[9px] uppercase tracking-[1.5px] text-rb-tx-mute-3">
                {metaLabel}
              </span>
              <span className="overflow-hidden text-ellipsis whitespace-nowrap text-[12.5px] text-[#ddd]">
                {metaValue}
              </span>
            </div>
          )}
        </div>
      )}

      {/* title */}
      <div className="absolute inset-x-0 bottom-0 px-6 py-[22px]">
        <div className="mb-[7px] text-[11px] uppercase tracking-[2px] text-[#999]">{topLine}</div>
        <div
          className="overflow-hidden text-ellipsis whitespace-nowrap text-[24px] font-medium text-white"
          style={{ letterSpacing: '-0.015em' }}
        >
          {title}
        </div>
      </div>
    </div>
  );
}

// Empty-state tile: keeps the 3-across grid's striped-placeholder look
// while the DB has no rows (agent brief — render gracefully, no data).
export function GalleryPlaceholder() {
  return (
    <div className="relative h-[400px] overflow-hidden bg-rb-surface" aria-hidden>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'repeating-linear-gradient(135deg,#171717 0,#171717 11px,#101010 11px,#101010 22px)',
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-[66%] bg-[linear-gradient(transparent,rgba(0,0,0,0.55)_42%,rgba(0,0,0,0.94))]" />
    </div>
  );
}

// Fixed bottom-right Contact chip (shared by both gallery prototypes) —
// opens the global contact modal (falls back to /contact on modified click).
export function FixedContactLink() {
  return (
    <ContactLink
      className="rb-corner-cta fixed right-[18px] z-40 md:right-[26px] flex items-center gap-[11px] border border-rb-border-2 bg-rb-surface px-[18px] py-[13px] transition-[border-color,background-color,transform,box-shadow] duration-btn ease-rb hover:-translate-y-[3px] hover:border-[#555] hover:bg-rb-raised hover:shadow-[0_14px_30px_rgba(0,0,0,0.55)] active:translate-y-0 active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <span className="h-[7px] w-[7px] flex-none bg-rb-red" />
      <span className="text-[12px] tracking-[1.5px] text-white">Contact</span>
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path d="M4 12L12 4M12 4H5.2M12 4V10.8" stroke="#888" strokeWidth="1.3" />
      </svg>
    </ContactLink>
  );
}
