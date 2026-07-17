import type { Metadata } from 'next';
import { RandomBackdrop } from '@/components/site/RandomBackdrop';
import { ContactForm } from '@/components/contact/ContactForm';
import { SiteNav } from '@/components/site/SiteNav';
import { getListingBySlug, getSettings } from '@/lib/public/content';
import { listingTitle } from '@/lib/db/types';
import { SchemaScript } from '@/components/site/SchemaScript';
import { contactPageSchema } from '@/lib/seo/schema';

// /contact — Contact.dc.html: contact details (left, from settings) + the
// inquiry form (right, Contact Form.dc.html / forms.md) as one floating panel
// over the blurred fixed background. `?listing=slug` prefills the message
// with the specific car (forms.md §B) and attaches attribution to the lead.

export const revalidate = 60;

export const metadata: Metadata = {
  alternates: { canonical: '/contact' },
  title: { absolute: 'Contact · Red Box Motors | Austin, TX' },
  description:
    'Reach Red Box Motors about buying, selling, consignment, protection or customization in Austin, TX.',
};

function DetailRow({ label, value, href, last = false }: { label: string; value: string; href?: string; last?: boolean }) {
  const val = <span className="text-[14px] tracking-[0.2px] text-[#eee]">{value}</span>;
  return (
    <div
      className={`flex items-center justify-between border-t border-rb-line-2 py-4 ${last ? 'border-b' : ''}`}
    >
      <span className="text-[11px] uppercase tracking-[2px] text-rb-tx-faint">{label}</span>
      {href ? (
        <a href={href} className="no-underline">
          {val}
        </a>
      ) : (
        val
      )}
    </div>
  );
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: { listing?: string };
}) {
  const settings = await getSettings();
  const listing = searchParams.listing ? await getListingBySlug(searchParams.listing) : null;
  const carTitle = listing ? listingTitle(listing) : undefined;

  return (
    <div className="relative flex min-h-screen flex-col text-white">
      <SchemaScript schema={contactPageSchema(settings)} />
      <RandomBackdrop />
      <SiteNav current="contact" />

      <main className="relative z-[1] flex flex-1 items-center justify-center px-[2.5vw] pb-12 pt-[104px]">
        <div className="flex w-full max-w-[1280px] animate-rb-panel-in flex-col overflow-hidden bg-rb-surface shadow-rb-card-lg">
          <div className="flex items-baseline gap-3.5 border-b border-rb-line px-7 py-5">
            <span className="text-[13px] font-bold uppercase tracking-[3px] text-white">
              Get in Touch
            </span>
            <span className="text-[11px] text-rb-tx-faint">We reply within one business day</span>
          </div>

          <div className="grid gap-0.5 bg-black md:grid-cols-[1fr_1.1fr]">
            {/* LEFT — details */}
            <div className="flex animate-rb-fade-up flex-col justify-center bg-rb-surface-3 px-6 py-12 md:px-[46px]">
              <h1 className="mb-[18px] text-[32px] font-semibold leading-[1.05] tracking-tighter text-white md:text-[40px]">
                Let&rsquo;s talk
                <br />
                about the car.
              </h1>
              <p className="mb-10 max-w-[420px] text-[15px] leading-[1.65] text-[#9a9a9a]">
                Tell us about the vehicle and what you would like to accomplish. Your inquiry will
                be directed to the appropriate Red Box Motors team member.
              </p>

              <div className="flex flex-col">
                <DetailRow label="Email" value={settings.email ?? ''} href={`mailto:${settings.email}`} />
                <DetailRow
                  label="Phone"
                  value={settings.phone ?? ''}
                  href={`tel:${(settings.phone ?? '').replace(/[^+\d]/g, '')}`}
                />
                <DetailRow label="Location" value={settings.address_line ?? 'Austin, TX'} />
                <DetailRow label="Hours" value="By appointment · Mon-Sat" last />
              </div>
            </div>

            {/* RIGHT — form */}
            <div className="flex animate-rb-fade-up flex-col justify-center bg-rb-surface px-6 py-12 [animation-delay:90ms] md:px-[46px]">
              <ContactForm
                sourcePage="/contact"
                listingSlug={listing?.slug}
                listingTitle={carTitle}
                prefillMessage={carTitle ? `I'm interested in the ${carTitle}.` : ''}
                phone={settings.phone}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
