import type { Faq } from '@/components/site/FaqAccordion';
import { MFaq } from './MFaq';
import { ED } from './ui';

// "Questions & Location" block (design_handoff, all screens): mono heading →
// red-square LOCATION eyebrow → "Austin, Texas" → "Visits by appointment." →
// two service rows → FAQ accordion. About mobile renders it as "FACILITY &
// CONTACT" without the FAQ.

export function QuestionsLocation({
  faqs = [],
  heading = 'QUESTIONS & LOCATION',
}: {
  faqs?: Faq[];
  heading?: string;
}) {
  return (
    <section
      className="flex flex-col gap-7 border-t border-white/[0.06] px-5 pb-14 pt-11"
    >
      <div className="font-plex text-[11px] tracking-[0.35em] text-white">{heading}</div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2.5">
          <div className="h-2 w-2 bg-rb-red" />
          <div className="font-plex text-[10px] tracking-[0.3em] text-rb-red">LOCATION</div>
        </div>
        <div className="text-[30px] font-extrabold tracking-tight text-white">Austin, Texas</div>
        <div className="text-[14px]" style={{ color: ED(0.6) }}>
          Visits by appointment.
        </div>
        <div className="mt-1.5 flex flex-col">
          <div className="flex items-baseline justify-between gap-3 border-t border-white/[0.08] py-[15px]">
            <div className="text-[14px]" style={{ color: ED(0.85) }}>
              Sales &amp; Consignment
            </div>
            <div className="font-plex text-[10px] tracking-[0.2em]" style={{ color: ED(0.5) }}>
              NATIONWIDE
            </div>
          </div>
          <div className="flex items-baseline justify-between gap-3 border-y border-white/[0.08] py-[15px]">
            <div className="text-[14px]" style={{ color: ED(0.85) }}>
              Restoration &amp; Protection
            </div>
            <div className="font-plex text-[10px] tracking-[0.2em]" style={{ color: ED(0.5) }}>
              AUSTIN
            </div>
          </div>
        </div>
      </div>
      {faqs.length > 0 && <MFaq faqs={faqs} />}
    </section>
  );
}
