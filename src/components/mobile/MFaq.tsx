'use client';

import { useState } from 'react';
import type { Faq } from '@/components/site/FaqAccordion';

// Mobile FAQ accordion (design_handoff, all screens): rows divided by 0.08
// hairlines, 15px/600 question, red +/− toggle, 44px min tap target, one
// open at a time. Unlike the desktop FaqAccordion the answer expands in flow.

export function MFaq({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="flex flex-col">
      {faqs.map((faq, i) => {
        const isOpen = open === i;
        return (
          <div key={faq.q} className="border-t border-white/[0.08]">
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen((o) => (o === i ? null : i))}
              className="flex min-h-[44px] w-full items-center justify-between gap-3.5 py-[19px] text-left"
            >
              <span className="text-[15px] font-semibold leading-[1.4] text-white">{faq.q}</span>
              <span className="flex-none text-[20px] font-normal leading-none text-rb-red" aria-hidden>
                {isOpen ? '−' : '+'}
              </span>
            </button>
            {/* grid-rows 0fr→1fr keeps the open/close smooth; content stays in
                the DOM (motion pass 2026-07-20) */}
            <div
              className="grid transition-[grid-template-rows] duration-300 ease-rb motion-reduce:transition-none"
              style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
            >
              <div className="overflow-hidden">
                <div
                  className="pb-5 pr-6 text-[14px] leading-[1.65] text-[rgba(237,237,237,0.65)] transition-opacity duration-300 ease-rb motion-reduce:transition-none"
                  style={{ opacity: isOpen ? 1 : 0 }}
                  aria-hidden={!isOpen}
                >
                  {faq.a}
                </div>
              </div>
            </div>
          </div>
        );
      })}
      <div className="border-t border-white/[0.08]" />
    </div>
  );
}
