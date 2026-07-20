'use client';

import { useState } from 'react';

// Vehicle Detail overview expander: first paragraphs always visible, the
// rest behind "Read the full overview +" → "Read less −".

export function OverviewExpander({ moreParas }: { moreParas: string[] }) {
  const [open, setOpen] = useState(false);
  if (moreParas.length === 0) return null;
  return (
    <>
      {open &&
        moreParas.map((p) => (
          <p
            key={p.slice(0, 40)}
            className="m-0 text-[14px] leading-[1.7] text-[rgba(237,237,237,0.72)]"
          >
            {p}
          </p>
        ))}
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex min-h-[44px] items-center gap-2 self-start py-2 text-[14px] font-semibold text-[rgba(237,237,237,0.7)]"
      >
        {open ? 'Read less' : 'Read the full overview'}{' '}
        <span className="text-rb-red" aria-hidden>
          {open ? '−' : '+'}
        </span>
      </button>
    </>
  );
}
