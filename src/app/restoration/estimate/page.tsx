import type { Metadata } from 'next';
import { RandomBackdrop } from '@/components/site/RandomBackdrop';
import { SiteNav } from '@/components/site/SiteNav';
import { EstimateForm } from '@/components/restoration/EstimateForm';
import { getSettings } from '@/lib/public/content';

// /restoration/estimate — dedicated Restoration estimate request (owner
// checklist 2026-07-07, Priority 1). Utility-page convention: floating
// card over the blurred random backdrop.

export const revalidate = 60;

export const metadata: Metadata = {
  alternates: { canonical: '/restoration/estimate' },
  title: { absolute: 'Request a Restoration Estimate · Red Box Motors | Austin, TX' },
  description:
    'Request an estimate for paint protection film, paint correction, ceramic coating, wraps, tint, detailing or wheels from Red Box Restoration in Austin, TX.',
};

const STEPS = [
  ['Consultation', 'Tell us about the car and what you want to accomplish.'],
  ['Inspection & scope', 'We review the vehicle and agree on the exact work.'],
  ['Execution', 'The work is completed and inspected before delivery.'],
] as const;

export default async function EstimatePage() {
  const settings = await getSettings();

  return (
    <div className="relative flex min-h-screen flex-col text-white">
      <RandomBackdrop />
      <SiteNav current="restoration" />

      <main className="relative z-[1] flex flex-1 items-start justify-center px-[2.5vw] pb-14 pt-[104px]">
        <div className="flex w-full max-w-[1180px] animate-rb-panel-in flex-col overflow-hidden bg-rb-surface shadow-rb-card-lg">
          <div className="flex flex-wrap items-baseline gap-x-3.5 gap-y-1 border-b border-rb-line px-7 py-5">
            <span className="text-[13px] font-bold uppercase tracking-[3px] text-white">
              Request an Estimate
            </span>
            <span className="text-[11px] text-rb-tx-faint">
              Red Box Restoration, Austin, TX
            </span>
          </div>

          <div className="grid gap-0.5 bg-black lg:grid-cols-[0.8fr_1.2fr]">
            <div className="flex animate-rb-fade-up flex-col justify-center bg-rb-surface-3 px-8 py-12 lg:px-[46px]">
              <h1 className="mb-[18px] text-[36px] font-semibold leading-[1.06] tracking-tighter text-white">
                Tell us about
                <br />
                the project.
              </h1>
              <p className="mb-10 max-w-[400px] text-[15px] leading-[1.65] text-[#9a9a9a]">
                Protection, correction or a full transformation, describe the car and the goal,
                and the right specialist will come back to you with scope and pricing.
              </p>
              <ol className="flex flex-col">
                {STEPS.map(([title, detail], i) => (
                  <li
                    key={title}
                    className={`flex gap-4 border-t border-rb-line-2 py-4 ${
                      i === STEPS.length - 1 ? 'border-b' : ''
                    }`}
                  >
                    <span className="text-[11px] font-semibold tracking-[1px] text-rb-red">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span>
                      <span className="block text-[13.5px] font-medium tracking-[0.3px] text-white">
                        {title}
                      </span>
                      <span className="mt-0.5 block text-[12.5px] leading-relaxed text-rb-tx-faint">
                        {detail}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="animate-rb-fade-up bg-rb-surface px-8 py-12 [animation-delay:90ms] lg:px-[46px]">
              <EstimateForm phone={settings.phone} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
