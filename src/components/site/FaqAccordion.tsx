'use client';

import { useState } from 'react';

export type Faq = { q: string; a: string };

// FAQ column (Visit and FAQ.dc.html) — answers drop over the rows beneath as
// an absolutely-positioned panel with a red top rule, so row heights stay put.
export function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="relative z-[2] flex flex-col bg-rb-surface">
      {faqs.map((faq, i) => {
        const isOpen = open === i;
        return (
          <div key={faq.q} className="relative flex flex-1 flex-col justify-center border-t border-rb-line">
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen((o) => (o === i ? null : i))}
              className="flex w-full items-center justify-between gap-[18px] px-7 py-3.5 text-left transition-colors duration-150 hover:bg-rb-surface-4"
            >
              <span className="text-[14px] tracking-tight text-[#e8e8e8]">{faq.q}</span>
              <span className="w-4 flex-none text-center text-[20px] font-semibold leading-none text-rb-red" aria-hidden>
                {isOpen ? '–' : '+'}
              </span>
            </button>
            <div
              className="absolute inset-x-0 top-full z-[9] border-t-2 border-rb-red bg-rb-raised-2 px-7 pb-[18px] pt-[15px]"
              style={{
                opacity: isOpen ? 1 : 0,
                transform: isOpen ? 'translateY(0)' : 'translateY(-6px)',
                pointerEvents: isOpen ? 'auto' : 'none',
                boxShadow: isOpen ? '0 26px 48px rgba(0,0,0,0.62)' : undefined,
                transition: isOpen
                  ? 'opacity 200ms ease, transform 200ms ease'
                  : 'opacity 140ms ease, transform 140ms ease',
              }}
            >
              <span className="block text-[12.5px] leading-relaxed text-[#9a9a9a]">{faq.a}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
