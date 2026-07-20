'use client';

import { useState } from 'react';

// Mobile detail gallery (Vehicle Detail / Work Detail): 290px main image with
// ‹ › arrows (36×44, rgba(10,10,10,0.55)), "01 / 12" counter, optional
// outline chip top-left, and a horizontally scrollable 76×54 thumb rail —
// active thumb gets a red border.

export type MGalleryImage = {
  url: string;
  alt: string;
  position?: string;
  thumb?: string | null;
};

const pad2 = (n: number) => String(n).padStart(2, '0');

export function MGallery({
  images,
  chip,
  placeholderTag,
  padThumbs = false,
}: {
  images: MGalleryImage[];
  chip?: string;
  placeholderTag?: string;
  padThumbs?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const n = images.length;
  const current = images[index];
  const go = (d: number) => setIndex((i) => (i + d + n) % n);

  return (
    <div className="flex flex-col gap-2.5">
      <div className="relative h-[290px] w-full overflow-hidden">
        {current ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={current.url}
            alt={current.alt}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: current.position ?? 'center' }}
          />
        ) : (
          <div className="rb-stripe absolute inset-0 flex items-center justify-center">
            {placeholderTag && (
              <span className="font-plex text-[10px] tracking-[1px] text-rb-tx-ghost">
                [ {placeholderTag} ]
              </span>
            )}
          </div>
        )}
        {chip && (
          <div className="pointer-events-none absolute left-3 top-3 border border-white/30 bg-[rgba(10,10,10,0.5)] px-2.5 py-1.5 font-plex text-[9px] tracking-[0.25em] text-[rgba(237,237,237,0.85)]">
            {chip}
          </div>
        )}
        {n > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous photo"
              onClick={() => go(-1)}
              className="absolute left-2.5 top-1/2 flex h-11 w-9 -translate-y-1/2 items-center justify-center bg-[rgba(10,10,10,0.55)] text-[16px] text-white"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={() => go(1)}
              className="absolute right-2.5 top-1/2 flex h-11 w-9 -translate-y-1/2 items-center justify-center bg-[rgba(10,10,10,0.55)] text-[16px] text-white"
            >
              ›
            </button>
          </>
        )}
        {n > 0 && (
          <div className="pointer-events-none absolute bottom-3 right-3 bg-[rgba(10,10,10,0.6)] px-2.5 py-1.5 font-plex text-[9px] tracking-[0.2em] text-[rgba(237,237,237,0.85)]">
            {pad2(index + 1)} / {pad2(n)}
          </div>
        )}
      </div>
      {n > 1 && (
        <div
          className={`rb-noscrollbar flex gap-2 overflow-x-auto ${padThumbs ? 'px-5' : ''}`}
        >
          {images.map((img, i) => (
            <button
              key={img.url}
              type="button"
              aria-label={`Photo ${i + 1}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
              className="relative h-[54px] w-[76px] flex-none overflow-hidden border"
              style={{ borderColor: i === index ? '#CC0000' : 'rgba(255,255,255,0.12)' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.thumb ?? img.url}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
