import { ContactLink } from '@/components/contact/ContactModal';
import { getSettings } from '@/lib/public/content';
import { FaqAccordion, type Faq } from './FaqAccordion';

// Simplified site footer: Location · FAQ · direct contact · minimal bottom
// bar. No division tiles, no featured marquee, no repeated company blurbs.
// Pages may pass their own division-specific FAQ list; the default set is
// the four broad homepage questions.

type Division = 'all' | 'dealer' | 'cosmetics' | 'collection';

// Broad questions only — detailed sales/service FAQs live on their own pages.
const DEFAULT_FAQ: Faq[] = [
  {
    q: 'What services does Red Box Motors provide?',
    a: 'Two divisions under one roof: Sales & Consignment, curated inventory and professional consignment representation for enthusiast and collector vehicles, and Red Box Restoration, paint protection film, ceramic coatings, paint correction, vinyl wraps, tint, detailing, wheels and specialty automotive installations.',
  },
  {
    q: 'Where is Red Box Motors located?',
    a: 'Austin, Texas. Visits are by appointment, reach out and we will set a time to walk the showroom or talk through your vehicle.',
  },
  {
    q: 'Do you work with clients outside Texas?',
    a: 'Yes. Sales, consignment, marketing and transportation are coordinated nationwide. Physical restoration and protection work is performed at our Austin facility.',
  },
  {
    q: 'How do I get started?',
    a: 'Browse the current inventory, tell us about a vehicle you would like to sell or consign, or request an estimate for protection and customization work, the contact form routes your inquiry to the right person.',
  },
];

export async function VisitAndFAQ({
  faqs = DEFAULT_FAQ,
}: {
  division?: Division;
  faqs?: Faq[];
}) {
  const settings = await getSettings();

  return (
    <section className="relative z-[1] flex items-stretch justify-center bg-transparent text-white">
      <div className="flex w-full animate-rb-panel-in flex-col overflow-hidden bg-rb-surface">
        <div className="flex items-baseline gap-3.5 border-b border-rb-line px-6 py-6 md:px-12">
          <h2 className="text-[13px] font-bold uppercase tracking-[3px] text-white">
            {faqs.length > 0 ? <>Questions &amp; Location</> : <>Facility &amp; Contact</>}
          </h2>
        </div>

        <div className={`grid items-stretch gap-0.5 bg-black ${faqs.length ? 'md:grid-cols-2' : ''}`}>
          {/* Location */}
          <div className="flex flex-col justify-center bg-rb-surface">
            <div className="px-7 py-[22px]">
              <div className="mb-3 flex items-center gap-2.5">
                <span className="h-[7px] w-[7px] flex-none bg-rb-red" />
                <span className="font-mono text-[11px] uppercase tracking-[3px] text-rb-red">Location</span>
              </div>
              <div className="mb-1.5 text-[26px] font-semibold tracking-tight text-white">Austin, Texas</div>
              <p className="mb-3.5 text-[13px] leading-relaxed text-rb-tx-mute-2">
                Visits by appointment.
              </p>
              <div className="flex items-center justify-between border-t border-rb-line-2 py-[11px]">
                <span className="text-[12.5px] text-rb-tx-3">Sales &amp; Consignment</span>
                <span className="font-mono text-[10.5px] tracking-[1px] text-rb-tx-mute-3">NATIONWIDE</span>
              </div>
              <div className="flex items-center justify-between border-t border-rb-line-2 py-[11px]">
                <span className="text-[12.5px] text-rb-tx-3">Restoration &amp; Protection</span>
                <span className="font-mono text-[10.5px] tracking-[1px] text-rb-tx-mute-3">AUSTIN</span>
              </div>
            </div>
          </div>

          {/* FAQ — pass faqs={[]} to render Location/contact only (owner
              checklist: no repeated general FAQ on About / Recent Work) */}
          {faqs.length > 0 && <FaqAccordion faqs={faqs} />}

          {/* Talk to a person */}
          <div className="flex flex-col justify-center gap-5 bg-rb-surface-3 px-8 py-[22px] md:col-span-2">
            <div className="flex items-center gap-[11px]">
              <span className="h-[7px] w-[7px] flex-none bg-rb-red" />
              <span className="font-mono text-[11px] uppercase tracking-[3px] text-rb-red">Talk to a person</span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex flex-wrap items-start gap-x-[46px] gap-y-6">
                <a
                  href={`tel:${(settings.phone ?? '').replace(/[^+\d]/g, '')}`}
                  className="block border-b border-transparent pb-[5px] transition-colors duration-150 hover:border-rb-red"
                >
                  <div className="mb-[9px] text-[10px] uppercase tracking-[2px] text-rb-tx-faint">Call</div>
                  <div className="text-[21px] font-semibold tracking-tight text-white">{settings.phone}</div>
                </a>
                <a
                  href={`mailto:${settings.email}`}
                  className="block border-b border-transparent pb-[5px] transition-colors duration-150 hover:border-rb-red"
                >
                  <div className="mb-[9px] text-[10px] uppercase tracking-[2px] text-rb-tx-faint">Email</div>
                  <div className="text-[21px] font-semibold tracking-tight text-white">{settings.email}</div>
                </a>
                <a
                  href="https://www.instagram.com/redboxmotors/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block border-b border-transparent pb-[5px] transition-colors duration-150 hover:border-rb-red"
                >
                  <div className="mb-[9px] text-[10px] uppercase tracking-[2px] text-rb-tx-faint">Instagram</div>
                  <div className="text-[21px] font-semibold tracking-tight text-white">@redboxmotors</div>
                </a>
              </div>
              <ContactLink className="rb-btn-red inline-flex items-center gap-[11px] whitespace-nowrap bg-rb-red px-[34px] py-[18px] text-[15px] tracking-[0.5px] text-white">
                Contact Red Box Motors
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M4 12L12 4M12 4H5.2M12 4V10.8" stroke="#fff" strokeWidth="1.4" />
                </svg>
              </ContactLink>
            </div>
          </div>
        </div>

        {/* minimal bottom bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-rb-line px-7 py-5">
          <div className="flex items-center gap-[11px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/brand/rbm-logo-header.png" alt="" className="h-[22px] w-[22px]" />
            <span className="text-[11px] uppercase tracking-[2px] text-rb-tx-faint">
              Red Box Motors · Austin, Texas
            </span>
          </div>
          <span className="font-mono text-[10px] tracking-[1px] text-rb-tx-faint">
            Sales &amp; Consignment · Restoration
          </span>
        </div>
      </div>
    </section>
  );
}
