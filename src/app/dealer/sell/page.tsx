import type { Metadata } from 'next';
import { RandomBackdrop } from '@/components/site/RandomBackdrop';
import { SiteNav } from '@/components/site/SiteNav';
import { SellForm } from '@/components/dealer/sell/SellForm';
import { getSettings } from '@/lib/public/content';

// /dealer/sell — dedicated sell/consign intake (2026-07-07 form system).
// Utility-page convention: floating #0A0A0A card over the blurred random
// backdrop. Left rail explains the process (copy mirrors /dealer's
// owner-approved consignment steps); right side is the multi-step form.

export const revalidate = 60;

export const metadata: Metadata = {
  alternates: { canonical: '/dealer/sell' },
  title: { absolute: 'Sell or Consign Your Vehicle — Red Box Motors | Austin, TX' },
  description:
    'Submit your vehicle to Red Box Motors for consignment. Tell us about the car, your timeline and expectations — our team will review and contact you.',
};

const PROCESS = [
  ['Submit your vehicle', 'The details below — five minutes, photos optional.'],
  ['Valuation & strategy', 'We review the car and current market positioning with you.'],
  ['Preparation & presentation', 'Detailing, paperwork and photography handled.'],
  ['Marketing & buyer management', 'We run the listing, the calls and the negotiations.'],
  ['Closing & delivery', 'Funds, title transfer and logistics, done properly.'],
] as const;

export default async function SellPage() {
  const settings = await getSettings();

  return (
    <div className="relative flex min-h-screen flex-col text-white">
      <RandomBackdrop />
      <SiteNav current="sell" />

      <main className="relative z-[1] flex flex-1 items-start justify-center px-[2.5vw] pb-14 pt-[104px]">
        <div className="flex w-full max-w-[1280px] animate-rb-panel-in flex-col overflow-hidden bg-rb-surface shadow-rb-card-lg">
          <div className="flex flex-wrap items-baseline gap-x-3.5 gap-y-1 border-b border-rb-line px-7 py-5">
            <span className="text-[13px] font-bold uppercase tracking-[3px] text-white">
              Sell Your Vehicle
            </span>
            <span className="text-[11px] text-rb-tx-faint">
              Consignment with Red Box Motors — Austin, TX
            </span>
          </div>

          <div className="grid gap-0.5 bg-black lg:grid-cols-[0.85fr_1.3fr]">
            {/* LEFT — the pitch / process */}
            <div className="flex animate-rb-fade-up flex-col bg-rb-surface-3 px-8 py-12 lg:px-[46px]">
              <h1 className="mb-[18px] text-[38px] font-semibold leading-[1.06] tracking-tighter text-white">
                Your car,
                <br />
                represented properly.
              </h1>
              <p className="mb-10 max-w-[420px] text-[15px] leading-[1.65] text-[#9a9a9a]">
                Tell us about the vehicle once — condition, history and what you want out of the
                sale. Our team reviews every submission and comes back to you with a real read on
                the market.
              </p>
              <ol className="flex flex-col">
                {PROCESS.map(([title, detail], i) => (
                  <li
                    key={title}
                    className={`flex gap-4 border-t border-rb-line-2 py-4 ${
                      i === PROCESS.length - 1 ? 'border-b' : ''
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

            {/* RIGHT — the form */}
            <div className="animate-rb-fade-up bg-rb-surface px-8 py-12 [animation-delay:90ms] lg:px-[46px]">
              <SellForm phone={settings.phone} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
