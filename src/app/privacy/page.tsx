import type { Metadata } from 'next';
import { RandomBackdrop } from '@/components/site/RandomBackdrop';
import { SiteNav } from '@/components/site/SiteNav';
import { getSettings } from '@/lib/public/content';

// /privacy — minimal, factual privacy policy linked from every form
// (2026-07-07 form system). Plain statements about what the forms collect
// and how it's used; no invented certifications or legal boilerplate.
// OWNER REVIEW: replace/extend this copy with counsel-approved language
// before launch if desired.

export const revalidate = 3600;

export const metadata: Metadata = {
  alternates: { canonical: '/privacy' },
  title: { absolute: 'Privacy Policy · Red Box Motors | Austin, TX' },
  description: 'How Red Box Motors handles the information you submit through this site.',
};

export default async function PrivacyPage() {
  const settings = await getSettings();

  const sections: Array<[string, string]> = [
    [
      'What we collect',
      'When you contact us, inquire about a vehicle, or submit a vehicle for consignment, we collect what you enter in the form: your name and contact details, and any vehicle information, documents or photos you choose to provide.',
    ],
    [
      'How we use it',
      'We use your information to respond to your inquiry, evaluate and discuss your vehicle, and arrange the services you request. If you explicitly opt in, we may also contact you about similar vehicles. We do not sell your information.',
    ],
    [
      'Where it lives',
      'Submissions are stored in our customer database and, when email notifications are enabled, delivered to our team inbox. Uploaded files are stored in a private bucket that is not publicly accessible; only authenticated Red Box Motors staff can view them.',
    ],
    [
      'Your choices',
      `You can ask us to correct or delete the information you've submitted at any time, email ${settings.email ?? 'us'} or call ${settings.phone ?? 'the shop'} and we'll take care of it.`,
    ],
  ];

  return (
    <div className="relative flex min-h-screen flex-col text-white">
      <RandomBackdrop />
      <SiteNav />

      <main className="relative z-[1] flex flex-1 items-center justify-center px-[2.5vw] pb-12 pt-[104px]">
        <div className="w-full max-w-[820px] animate-rb-panel-in bg-rb-surface px-8 py-12 shadow-rb-card-lg md:px-[56px] md:py-[64px]">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[3px] text-rb-red">
            Red Box Motors
          </p>
          <h1 className="mb-8 text-[38px] font-semibold leading-[1.06] tracking-tighter text-white">
            Privacy policy.
          </h1>
          <div className="flex flex-col">
            {sections.map(([title, body], i) => (
              <section
                key={title}
                className={`border-t border-rb-line-2 py-6 ${i === sections.length - 1 ? 'border-b' : ''}`}
              >
                <h2 className="mb-2.5 text-[13px] font-semibold uppercase tracking-[2px] text-white">
                  {title}
                </h2>
                <p className="max-w-[620px] text-[14.5px] leading-[1.7] text-rb-tx-mute">{body}</p>
              </section>
            ))}
          </div>
          <p className="mt-8 text-[12px] leading-relaxed text-rb-tx-faint">
            Questions about this policy? Reach us at{' '}
            <a href={`mailto:${settings.email}`} className="text-rb-tx-mute underline decoration-rb-border-2 underline-offset-4 hover:text-white">
              {settings.email}
            </a>
            .
          </p>
        </div>
      </main>
    </div>
  );
}
