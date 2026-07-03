import Link from 'next/link';
import { ContactLink } from '@/components/contact/ContactModal';
import { getSettings } from '@/lib/public/content';
import { FaqAccordion, type Faq } from './FaqAccordion';
import { FeatureBar } from './FeatureBar';

// Closing section (Visit and FAQ.dc.html): Location · FAQ · Talk-to-a-person ·
// the OTHER two division tiles, then the Featured marquee. `division` filters
// the tiles; pages may pass their own division-specific FAQ list.

type Division = 'all' | 'dealer' | 'cosmetics' | 'collection';

const DIVISIONS: { key: Division; href: string; img: string; label: string; sub: string }[] = [
  { key: 'dealer', href: '/dealer', img: '/assets/dealer-garage.jpeg', label: 'Dealer', sub: 'Buy · Sell · Source · Consign' },
  { key: 'cosmetics', href: '/cosmetics', img: '/assets/cosmetics-garage.jpeg', label: 'Cosmetics', sub: 'PPF · Ceramic · Vinyl · Wheels' },
  { key: 'collection', href: '/collection', img: '/assets/collection-p1.jpeg', label: 'Collection', sub: 'Concierge · Maintenance · Transport' },
];

// Approved copy from the prototype — do not invent claims.
const DEFAULT_FAQ: Faq[] = [
  { q: 'How does consignment work?', a: 'We handle valuation, detailing, marketing, buyer vetting and the full transaction. You set the reserve — we do the rest.' },
  { q: 'What does it cost to sell?', a: 'A flat consignment fee agreed up front, disclosed before anything is signed. No surprises.' },
  { q: 'Do you buy cars outright?', a: 'Yes. If you want a clean, fast exit we will make a direct offer and close on your timeline.' },
  { q: 'Can you sell or source nationwide?', a: 'Sales and acquisitions are nationwide. Transport is arranged door to door and fully insured.' },
  { q: 'Where are you located?', a: 'Austin, Texas — minutes from Circuit of the Americas. Cosmetics, collection and concierge are local; sales are national.' },
];

export async function VisitAndFAQ({
  division = 'all',
  faqs = DEFAULT_FAQ,
}: {
  division?: Division;
  faqs?: Faq[];
}) {
  const settings = await getSettings();
  const tiles = DIVISIONS.filter((t) => t.key !== division);

  return (
    <section className="relative z-[1] flex items-stretch justify-center bg-transparent text-white">
      <div className="flex w-full animate-rb-panel-in flex-col overflow-hidden bg-rb-surface">
        <div className="flex items-baseline gap-3.5 border-b border-rb-line px-6 py-6 md:px-12">
          <h2 className="text-[13px] font-bold uppercase tracking-[3px] text-white">
            Questions &amp; Location
          </h2>
          <span className="text-[11px] text-rb-tx-faint">Everything else</span>
        </div>

        <div className="grid items-stretch gap-0.5 bg-black md:grid-cols-2">
          {/* Location */}
          <div className="flex flex-col justify-center bg-rb-surface">
            <div className="px-7 py-[22px]">
              <div className="mb-3 flex items-center gap-2.5">
                <span className="h-[7px] w-[7px] flex-none bg-rb-red" />
                <span className="font-mono text-[11px] uppercase tracking-[3px] text-rb-red">Location</span>
              </div>
              <div className="mb-1.5 text-[26px] font-semibold tracking-tight text-white">Austin, Texas</div>
              <p className="mb-3.5 text-[13px] leading-relaxed text-rb-tx-mute-2">
                Minutes from Circuit of the Americas.
              </p>
              <div className="flex items-center justify-between border-t border-rb-line-2 py-[11px]">
                <span className="text-[12.5px] text-rb-tx-3">Sales &amp; Acquisitions</span>
                <span className="font-mono text-[10.5px] tracking-[1px] text-rb-tx-mute-3">NATIONWIDE</span>
              </div>
              <div className="flex items-center justify-between border-t border-rb-line-2 py-[11px]">
                <span className="text-[12.5px] text-rb-tx-3">Cosmetics · Collection · Concierge</span>
                <span className="font-mono text-[10.5px] tracking-[1px] text-rb-tx-mute-3">LOCAL · AUSTIN</span>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <FaqAccordion faqs={faqs} />

          {/* Talk to a person */}
          <div className="flex flex-col justify-center gap-5 bg-rb-surface-3 px-8 py-[22px]">
            <div className="flex items-center gap-[11px]">
              <span className="h-[7px] w-[7px] flex-none bg-rb-red" />
              <span className="font-mono text-[11px] uppercase tracking-[3px] text-rb-red">Talk to a person</span>
            </div>
            <div className="flex flex-col items-start gap-6">
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
                  href="#"
                  className="block border-b border-transparent pb-[5px] transition-colors duration-150 hover:border-rb-red"
                >
                  <div className="mb-[9px] text-[10px] uppercase tracking-[2px] text-rb-tx-faint">Instagram</div>
                  <div className="text-[21px] font-semibold tracking-tight text-white">@redboxmotors</div>
                </a>
              </div>
              <ContactLink
                className="rb-btn-red inline-flex items-center gap-[11px] whitespace-nowrap bg-rb-red px-[34px] py-[18px] text-[15px] tracking-[0.5px] text-white"
              >
                Start a Conversation
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M4 12L12 4M12 4H5.2M12 4V10.8" stroke="#fff" strokeWidth="1.4" />
                </svg>
              </ContactLink>
            </div>
          </div>

          {/* The other two division tiles */}
          <div className="relative z-[1] flex gap-0.5 bg-black">
            {tiles.map((tile) => (
              <Link
                key={tile.key}
                href={tile.href}
                className="relative z-[1] flex min-h-[140px] flex-1 flex-col items-center justify-center gap-4 overflow-hidden bg-rb-surface px-4 py-6 transition-[filter,transform,box-shadow] duration-[260ms] ease-rb hover:z-[6] hover:-translate-y-[5px] hover:scale-[1.02] hover:shadow-[0_22px_46px_rgba(0,0,0,0.6)] hover:brightness-[1.16] active:translate-y-0 active:scale-[0.99]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={tile.img}
                  alt=""
                  className="absolute inset-0 h-full w-full scale-[1.08] object-cover blur-[7px] brightness-[0.55] saturate-[1.05]"
                  style={{ objectPosition: 'center 58%' }}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,8,0.45)_0%,rgba(8,8,8,0.65)_100%)]" />
                <div className="relative flex h-[34px] w-[34px] flex-none items-center justify-center bg-rb-red">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path d="M4 12L12 4M12 4H5.2M12 4V10.8" stroke="#fff" strokeWidth="1.5" />
                  </svg>
                </div>
                <div className="relative text-center">
                  <div className="mb-[7px] text-[13px] uppercase tracking-[3px] text-white">{tile.label}</div>
                  <div className="text-[11px] tracking-[0.3px] text-[#c4c4c4]">{tile.sub}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <FeatureBar />
      </div>
    </section>
  );
}
