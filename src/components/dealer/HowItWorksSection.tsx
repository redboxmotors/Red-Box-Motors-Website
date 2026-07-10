import Link from 'next/link';

// "End to end, either direction" — the full How It Works chapter (banner +
// Buying and Consignment step tracks). Owner copy, verbatim. Lived on
// /dealer until the 2026-07-08 reorder; the full section now renders on the
// homepage, while /dealer shows the consignment track only. Shared here so
// both stay in sync.

export const BUYING_STEPS = [
  { num: '01', title: 'Explore or Inquire', desc: 'Review available inventory or contact us about a specific represented vehicle.' },
  { num: '02', title: 'Review the Vehicle', desc: 'Receive available history, specifications, condition information, photographs and supporting documentation.' },
  { num: '03', title: 'Complete the Purchase', desc: 'Finalize purchase documents, payment and any applicable trade arrangements.' },
  { num: '04', title: 'Delivery and Preparation', desc: 'Coordinate enclosed transportation or schedule protection and customization before delivery.' },
];

export const CONSIGNMENT_STEPS = [
  { num: '01', title: 'Submit Your Vehicle', desc: 'Provide the vehicle details, history, condition, location and desired timeline.' },
  { num: '02', title: 'Valuation and Strategy', desc: 'Review the current market and agree on positioning, pricing and representation terms.' },
  { num: '03', title: 'Preparation and Presentation', desc: 'Complete approved reconditioning, photography, video and listing development.' },
  { num: '04', title: 'Marketing and Buyer Management', desc: 'Present the vehicle through targeted platforms, direct networks, social media and qualified inquiries.' },
  { num: '05', title: 'Closing and Delivery', desc: 'Coordinate documents, payment, vehicle release and transportation.' },
];

export function StepTrack({
  heading,
  tag,
  steps,
  delay,
  borderRight = false,
  cta,
}: {
  heading: string;
  tag: string;
  steps: { num: string; title: string; desc: string }[];
  delay: string;
  borderRight?: boolean;
  cta?: { label: string; href: string };
}) {
  return (
    <div
      data-reveal
      style={{ transitionDelay: delay }}
      className={`px-6 pb-[54px] pt-[46px] md:px-12 ${borderRight ? 'md:border-r md:border-rb-line' : ''}`}
    >
      <div className="mb-[22px] flex items-center gap-4">
        <span className="text-[16px] font-extrabold uppercase tracking-[3px] text-white">
          {heading}
        </span>
        <span className="h-px flex-1 bg-[#242424]" />
        <span className="font-mono text-[10px] uppercase tracking-[2px] text-rb-tx-faint">{tag}</span>
      </div>
      {steps.map((step) => (
        <div key={step.num} className="flex items-start gap-6 border-t border-[#191919] py-[22px]">
          <span
            className="w-[58px] flex-none text-[42px] font-extrabold text-rb-red"
            style={{ lineHeight: 0.8, letterSpacing: '-0.04em' }}
          >
            {step.num}
          </span>
          <div>
            <div className="mb-2 text-[18px] font-bold tracking-[-0.015em] text-white">
              {step.title}
            </div>
            <div className="text-[14px] leading-[1.6] text-[#8c8c8c]">{step.desc}</div>
          </div>
        </div>
      ))}
      {cta && (
        <div className="mt-9 border-t border-[#191919] pt-8">
          <Link
            href={cta.href}
            className="rb-btn-red inline-flex items-center gap-3 bg-rb-red px-7 py-4 text-[14px] font-semibold tracking-[0.5px] text-white"
          >
            {cta.label}
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M4 12L12 4M12 4H5.2M12 4V10.8" stroke="#fff" strokeWidth="1.5" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
}

// The complete section as it existed on /dealer: photo banner + two tracks.
export function EndToEndSection() {
  return (
    <div className="bg-rb-surface-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
      <div data-reveal className="relative h-[400px] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/mclaren-p1.jpg"
          alt="Red Box Motors, how it works"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: 'center 45%' }}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.35)_0%,rgba(10,10,10,0.04)_32%,rgba(10,10,10,0.55)_74%,#0C0C0C_100%)]" />
        <div className="absolute inset-x-0 bottom-0 px-6 pb-[42px] md:px-[52px]">
          <div className="mb-4 font-mono text-[11px] uppercase tracking-[4px] text-rb-red">
            How it works
          </div>
          <h2
            className="m-0 max-w-[15ch] font-extrabold text-white"
            style={{
              fontSize: 'clamp(34px,4.6vw,68px)',
              letterSpacing: '-0.04em',
              lineHeight: 0.92,
              textShadow: '0 2px 30px rgba(0,0,0,0.55)',
            }}
          >
            End to end, either direction
          </h2>
        </div>
      </div>

      <div className="grid md:grid-cols-2">
        <StepTrack
          heading="Buying"
          tag="You want a car"
          steps={BUYING_STEPS}
          delay=".06s"
          borderRight
          cta={{ label: 'View Inventory', href: '/dealer/inventory' }}
        />
        <StepTrack
          heading="Consignment"
          tag="You have a car"
          steps={CONSIGNMENT_STEPS}
          delay=".16s"
          cta={{ label: 'Sell Your Vehicle', href: '/dealer' }}
        />
      </div>
    </div>
  );
}
