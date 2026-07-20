'use client';

import { useRef, useState } from 'react';

// Car Detail photo gallery (Car Detail.dc.html): 16/9 main frame with
// prev/next zones + a thumb strip. Photos come from the CMS
// (getImagesFor('listing', id)) — with none yet, a striped placeholder
// with the prototype's mono [ tag ] label renders instead.

export type GalleryImage = { url: string; alt: string; position: string; thumb?: string | null };

const pad2 = (x: number) => String(x + 1).padStart(2, '0');

export function ListingGallery({ images, tag }: { images: GalleryImage[]; tag: string }) {
  const [idx, setIdx] = useState(0);
  // previous frame index — stays mounted beneath the incoming photo so the
  // change crossfades (motion pass 2026-07-20)
  const [prevIdx, setPrevIdx] = useState<number | null>(null);
  const n = images.length;
  const goTo = (target: number) => {
    if (target === idx) return;
    setPrevIdx(idx);
    setIdx(target);
  };
  // touch swipe on the main frame (mobile pass 2026-07-17)
  const touchX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current == null || n < 2) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 40) goTo(dx < 0 ? (idx + 1) % n : (idx - 1 + n) % n);
  };

  if (n === 0) {
    return (
      <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden bg-[#1A1A1A]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'repeating-linear-gradient(135deg,#171717 0,#171717 11px,#101010 11px,#101010 22px)',
          }}
        />
        <span className="relative font-mono text-[12px] uppercase tracking-[3px] text-[#2A2A2A]">
          [ {tag} ]
        </span>
      </div>
    );
  }

  const cur = images[((idx % n) + n) % n];

  return (
    <div>
      <div
        className="relative flex aspect-video w-full touch-pan-y items-center justify-center overflow-hidden bg-[#1A1A1A]"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {prevIdx != null && images[prevIdx] && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={`prev-${prevIdx}`}
            src={images[prevIdx].url}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: images[prevIdx].position }}
          />
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={`cur-${((idx % n) + n) % n}`}
          src={cur.url}
          alt={cur.alt}
          className="rb-xfade absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: cur.position }}
        />
        {n > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous photo"
              onClick={() => goTo((idx - 1 + n) % n)}
              className="absolute bottom-0 left-0 top-0 flex w-[56px] cursor-pointer md:w-[90px] items-center justify-center text-rb-tx-faint transition-[color,background] duration-150 hover:bg-[linear-gradient(90deg,rgba(0,0,0,0.4),transparent)] hover:text-white"
            >
              <svg width="22" height="22" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={() => goTo((idx + 1) % n)}
              className="absolute bottom-0 right-0 top-0 flex w-[56px] cursor-pointer md:w-[90px] items-center justify-center text-rb-tx-faint transition-[color,background] duration-150 hover:bg-[linear-gradient(270deg,rgba(0,0,0,0.4),transparent)] hover:text-white"
            >
              <svg width="22" height="22" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </button>
            <span className="absolute bottom-3 right-4 font-mono text-[10px] tracking-[1px] text-[#cfcfcf] [text-shadow:0_1px_8px_rgba(0,0,0,0.8)]">
              {pad2(((idx % n) + n) % n)} / {String(n).padStart(2, '0')}
            </span>
          </>
        )}
      </div>
      {n > 1 && (
        <div className="rb-noscrollbar mt-0.5 flex gap-0.5 overflow-x-auto">
          {images.map((img, i) => {
            const active = i === ((idx % n) + n) % n;
            return (
              <button
                key={`${img.url}-${i}`}
                type="button"
                aria-label={`Photo ${pad2(i)}`}
                aria-current={active || undefined}
                onClick={() => goTo(i)}
                className={`relative aspect-video w-[78px] flex-none cursor-pointer overflow-hidden bg-rb-raised-3 md:w-auto md:flex-1 transition-[filter,outline-color,transform,box-shadow] duration-[220ms] ease-rb hover:z-[5] hover:-translate-y-[3px] hover:shadow-[0_12px_24px_rgba(0,0,0,0.55)] hover:brightness-100 ${
                  active
                    ? 'outline outline-1 outline-[#555] brightness-100'
                    : 'outline outline-1 outline-transparent brightness-[0.55]'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.thumb ?? img.url}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ objectPosition: img.position }}
                  loading="lazy"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
