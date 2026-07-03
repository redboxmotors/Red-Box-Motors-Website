import Link from 'next/link';
import type { DbImage } from '@/lib/db/types';
import { focalPosition } from '@/lib/public/content';

// CMS-driven photo (or striped placeholder until one lands), focal-point
// object-position (admin-and-photos.md §5).
export function CmsImage({
  image,
  src,
  alt,
  className = '',
  imgClassName = '',
  position,
  priority = false,
}: {
  image?: DbImage | null;
  src?: string;
  alt?: string;
  className?: string;
  imgClassName?: string;
  position?: string;
  priority?: boolean;
}) {
  const url = image ? image.url : src;
  if (!url) {
    return <div className={`rb-stripe ${className}`} aria-hidden />;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={alt ?? image?.alt ?? ''}
      className={`${className} ${imgClassName} object-cover`}
      style={{ objectPosition: position ?? focalPosition(image ?? null) }}
      loading={priority ? 'eager' : 'lazy'}
    />
  );
}

// Full-bleed photo tile: scrim + text bottom-left, lift/brighten on hover
// (363sudbury style — design-language.md §5).
export function PhotoTile({
  href,
  image,
  src,
  alt = '',
  title,
  sub,
  meta,
  className = '',
  position,
}: {
  href: string;
  image?: DbImage | null;
  src?: string;
  alt?: string;
  title: React.ReactNode;
  sub?: React.ReactNode;
  meta?: React.ReactNode;
  className?: string;
  position?: string;
}) {
  return (
    <Link href={href} className={`rb-tile group relative block overflow-hidden bg-rb-surface-4 ${className}`}>
      <CmsImage
        image={image}
        src={src}
        alt={alt}
        className="absolute inset-0 h-full w-full"
        position={position}
      />
      <div className="rb-tile-scrim" />
      <div className="absolute inset-x-0 bottom-0 p-5">
        <div className="text-[17px] font-semibold tracking-tight text-white">{title}</div>
        {sub && <div className="mt-1.5 text-[12px] font-medium tracking-[0.3px] text-rb-tx-mute">{sub}</div>}
        {meta && (
          <div className="mt-2 flex items-center justify-between gap-3 font-mono text-[10px] tracking-[0.5px] text-[#9a9a9a]">
            {meta}
          </div>
        )}
      </div>
    </Link>
  );
}
