'use client';

import { useCallback, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { submitLead } from '@/lib/leads/client';
import { TurnstileWidget } from '@/components/site/TurnstileWidget';
import {
  ChipGroup,
  FormFooterNote,
  Honeypot,
  SelectField,
  TextAreaField,
  TextField,
} from '@/components/forms/primitives';

// Car Detail inquiry box — vehicle-specific inquiry form (2026-07-07 form
// system, Phase 2). Full contact details + inquiry type + purchase
// timeframe; the vehicle facts (year/make/model/VIN/price/URL) are attached
// SERVER-SIDE from the listing slug — the customer never re-enters them.

// 2026-07-08 consolidated list (owner batch): private viewing replaces
// showroom appointment, live video walkaround replaces video walkaround,
// enclosed transportation replaces transportation. 'Trade-in' intentionally
// omitted for now — add here and in the API's INQUIRY_TYPES set when it
// opens up. Must match the API set exactly.
const INQUIRY_TYPES = [
  'Request additional information',
  'Request available documentation',
  'Request a specification sheet',
  'Request additional photographs',
  'Request a live video walkaround',
  'Schedule a private viewing',
  'Discuss a third-party inspection',
  'Discuss enclosed transportation',
  'Discuss pre-delivery PPF, coating, tint or detailing',
] as const;

const TIMEFRAMES = ['As soon as possible', 'Within 30 days', '1–3 months', 'Just researching'] as const;
const CONTACT_METHODS = ['Phone call', 'Text', 'Email'] as const;

type Errors = Record<string, string>;

export function InquiryPanel({
  makeModel,
  price,
  prefill,
  listingSlug,
  listingTitle,
  phone: shopPhone,
}: {
  makeModel: string;
  price: string;
  prefill: string;
  listingSlug: string;
  listingTitle: string;
  phone?: string | null;
}) {
  const pathname = usePathname();
  const [fields, setFields] = useState<Record<string, string>>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    city_state: '',
    contact_method: '',
    timeframe: '',
    inquiry_type: 'Request additional information',
    message: prefill,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [website, setWebsite] = useState(''); // honeypot
  const turnstileToken = useRef<string | null>(null);
  const onToken = useCallback((t: string | null) => {
    turnstileToken.current = t;
  }, []);
  const rootRef = useRef<HTMLFormElement>(null);
  const submissionKey = useRef<string>('');
  if (!submissionKey.current && typeof crypto !== 'undefined') {
    submissionKey.current = crypto.randomUUID();
  }

  const bind = (k: string) => ({
    value: fields[k] ?? '',
    onChange: (v: string) => {
      setFields((p) => ({ ...p, [k]: v }));
      setErrors((e) => (e[k] ? { ...e, [k]: undefined as unknown as string } : e));
    },
    error: errors[k],
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pending) return;
    const next: Errors = {};
    if (!fields.first_name.trim()) next.first_name = 'Enter your first name';
    if (!fields.last_name.trim()) next.last_name = 'Enter your last name';
    if (!fields.email.trim()) next.email = 'Enter your email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) next.email = 'Enter a valid email';
    if (!fields.phone.trim()) next.phone = 'Enter your phone number';
    if (!fields.city_state.trim()) next.city_state = 'Enter your city and state';
    if (!fields.contact_method) next.contact_method = 'Pick one';
    if (!fields.timeframe) next.timeframe = 'Pick one';
    if (!fields.inquiry_type) next.inquiry_type = 'Pick one';
    if (!fields.message.trim()) next.message = 'Add a message';
    if (Object.keys(next).length) {
      setErrors(next);
      requestAnimationFrame(() => {
        const box = rootRef.current?.querySelector<HTMLElement>('[data-field-error="true"]');
        box?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        box?.querySelector<HTMLElement>('input, textarea, select, button')?.focus({ preventScroll: true });
      });
      return;
    }
    setErrors({});
    setServerError(null);
    setPending(true);
    const result = await submitLead({
      type: 'listing',
      first_name: fields.first_name.trim(),
      last_name: fields.last_name.trim(),
      email: fields.email.trim(),
      phone: fields.phone.trim(),
      city_state: fields.city_state.trim(),
      contact_method: fields.contact_method,
      timeframe: fields.timeframe,
      inquiry_type: fields.inquiry_type,
      message: fields.message.trim(),
      listing_slug: listingSlug,
      listing_title: listingTitle,
      source_page: pathname,
      submission_key: submissionKey.current,
      website,
      turnstileToken: turnstileToken.current,
    });
    setPending(false);
    if (!result.ok) {
      if (result.errors) setErrors(result.errors as Errors);
      setServerError(
        result.error ??
          (result.errors ? null : 'Something went wrong — please try again, or call us directly.'),
      );
      return;
    }
    setSent(true);
  };

  if (sent) {
    return (
      <div className="flex min-h-[300px] animate-rb-fade-up flex-col items-start justify-center border border-rb-border bg-rb-surface-2 px-[30px] py-9">
        <div className="mb-[22px] flex h-[42px] w-[42px] items-center justify-center bg-rb-red">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M5 12.5L10 17.5L19 7" stroke="#fff" strokeWidth="2.2" />
          </svg>
        </div>
        <div className="mb-2.5 text-[24px] font-semibold tracking-tight text-white">
          Inquiry sent.
        </div>
        <p className="mb-7 text-[14px] leading-relaxed text-[#9a9a9a]">
          Thank you for your interest in this vehicle. A member of the Red Box Motors team will
          contact you directly.
        </p>
        <FormFooterNote phone={shopPhone ?? null} />
      </div>
    );
  }

  return (
    <form
      ref={rootRef}
      noValidate
      onSubmit={submit}
      className="relative border border-[#232323] bg-rb-surface-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
    >
      <div className="flex items-center justify-between gap-3.5 border-b border-rb-line-2 bg-[linear-gradient(180deg,#111,#0c0c0c)] px-5 py-[18px]">
        <div className="flex items-center gap-2.5">
          <span className="h-[7px] w-[7px] flex-none bg-rb-red" />
          <span className="text-[13px] font-bold uppercase tracking-[1.5px] text-white">
            Inquire
          </span>
        </div>
        <span className="text-[15px] font-semibold tracking-tight text-white">{price}</span>
      </div>
      <Honeypot id="iq-website" value={website} onChange={setWebsite} />
      <div className="flex flex-col gap-0.5 px-[18px] pb-[18px] pt-4">
        <div className="grid gap-0.5 sm:grid-cols-2">
          <TextField id="iq-first" label="First name" autoComplete="given-name"
            placeholder="First name" {...bind('first_name')} />
          <TextField id="iq-last" label="Last name" autoComplete="family-name"
            placeholder="Last name" {...bind('last_name')} />
        </div>
        <TextField id="iq-email" label="Email" type="email" autoComplete="email"
          placeholder="you@email.com" {...bind('email')} />
        <div className="grid gap-0.5 sm:grid-cols-2">
          <TextField id="iq-phone" label="Phone" type="tel" autoComplete="tel"
            placeholder="(512) 555-0000" {...bind('phone')} />
          <TextField id="iq-city" label="City / State" autoComplete="address-level2"
            placeholder="Austin, TX" {...bind('city_state')} />
        </div>
        <ChipGroup label="Preferred contact method" options={CONTACT_METHODS}
          {...bind('contact_method')} />
        <SelectField id="iq-type" label="I'd like to…" options={INQUIRY_TYPES}
          {...bind('inquiry_type')} />
        <SelectField id="iq-timeframe" label="Purchase timeframe" options={TIMEFRAMES}
          {...bind('timeframe')} />
        <TextAreaField id="iq-message" label="Message" rows={2} {...bind('message')} />
        <TurnstileWidget onToken={onToken} />
        {serverError && (
          <p role="alert" className="mt-1.5 border-l-2 border-rb-red bg-rb-surface-3 px-3.5 py-2.5 text-[12px] font-medium leading-relaxed text-rb-tx-2">
            {serverError}
          </p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="rb-btn-red mt-1.5 flex cursor-pointer items-center justify-center gap-[9px] bg-rb-red p-3.5 text-[13px] tracking-[0.5px] text-white disabled:opacity-60"
        >
          {pending ? 'Sending…' : 'Inquire About This Vehicle'}
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M4 12L12 4M12 4H5.2M12 4V10.8" stroke="#fff" strokeWidth="1.4" />
          </svg>
        </button>
        <div className="px-1 pb-1">
          <FormFooterNote phone={shopPhone ?? null} />
        </div>
      </div>
    </form>
  );
}
