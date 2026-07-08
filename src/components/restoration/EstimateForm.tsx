'use client';

import { useCallback, useRef, useState } from 'react';
import { submitLead } from '@/lib/leads/client';
import { TurnstileWidget } from '@/components/site/TurnstileWidget';
import {
  ChipGroup,
  FormFooterNote,
  Honeypot,
  MultiChipGroup,
  TextAreaField,
  TextField,
} from '@/components/forms/primitives';

// Restoration estimate request (owner checklist 2026-07-07, Priority 1).
// Quick single-page form — every "Request an Estimate" CTA routes here.
// Submits type 'estimate' through the shared hardened /api/leads pipeline.

// Must match the API's ESTIMATE_SERVICES set (src/app/api/leads/route.ts).
const SERVICES = [
  'Paint Protection Film',
  'Paint Correction',
  'Ceramic Coating',
  'Vinyl Wrap or Graphics',
  'Window Tint',
  'Detailing',
  'Wheels, Tires & Calipers',
  'Specialty Installations',
] as const;

const CONTACT_METHODS = ['Phone call', 'Text', 'Email'] as const;

export function EstimateForm({ phone: shopPhone }: { phone: string | null }) {
  const [fields, setFields] = useState<Record<string, string>>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    contact_method: '',
    vehicle_text: '',
    message: '',
  });
  const [services, setServices] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [website, setWebsite] = useState(''); // honeypot
  const turnstileToken = useRef<string | null>(null);
  const onToken = useCallback((t: string | null) => {
    turnstileToken.current = t;
  }, []);
  const rootRef = useRef<HTMLFormElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
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
    const next: Record<string, string> = {};
    if (!fields.first_name.trim()) next.first_name = 'Enter your first name';
    if (!fields.last_name.trim()) next.last_name = 'Enter your last name';
    if (!fields.email.trim()) next.email = 'Enter your email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) next.email = 'Enter a valid email';
    if (!fields.phone.trim()) next.phone = 'Enter your phone number';
    if (!fields.contact_method) next.contact_method = 'Pick one';
    if (!fields.vehicle_text.trim()) next.vehicle_text = 'Tell us the year, make and model';
    if (!services.length) next.services = 'Pick at least one';
    if (Object.keys(next).length) {
      setErrors(next);
      requestAnimationFrame(() => {
        const box = rootRef.current?.querySelector<HTMLElement>('[data-field-error="true"]');
        box?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        box?.querySelector<HTMLElement>('input, textarea, button')?.focus({ preventScroll: true });
      });
      return;
    }
    setErrors({});
    setServerError(null);
    setPending(true);
    const result = await submitLead({
      type: 'estimate',
      first_name: fields.first_name.trim(),
      last_name: fields.last_name.trim(),
      email: fields.email.trim(),
      phone: fields.phone.trim(),
      contact_method: fields.contact_method,
      vehicle_text: fields.vehicle_text.trim(),
      services,
      interest: 'Request a Restoration Estimate',
      message: fields.message.trim(),
      listing_slug: null,
      listing_title: null,
      source_page: '/restoration/estimate',
      submission_key: submissionKey.current,
      website,
      turnstileToken: turnstileToken.current,
    });
    setPending(false);
    if (!result.ok) {
      if (result.errors) setErrors(result.errors as Record<string, string>);
      setServerError(
        result.error ??
          (result.errors ? null : 'Something went wrong, please try again, or call us directly.'),
      );
      return;
    }
    setSent(true);
    requestAnimationFrame(() => doneRef.current?.focus());
  };

  if (sent) {
    return (
      <div className="flex min-h-[320px] animate-rb-fade-up flex-col items-start justify-center">
        <div className="mb-6 flex h-[46px] w-[46px] items-center justify-center bg-rb-red">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M5 12.5L10 17.5L19 7" stroke="#fff" strokeWidth="2" />
          </svg>
        </div>
        <div
          ref={doneRef}
          tabIndex={-1}
          className="mb-3 text-[28px] font-semibold tracking-tight text-white outline-none"
        >
          Estimate request received.
        </div>
        <p className="mb-4 max-w-[460px] text-[15px] leading-[1.65] text-[#9a9a9a]">
          Our team will review the project and contact you to discuss scope, scheduling and next
          steps.
        </p>
        <FormFooterNote phone={shopPhone} />
      </div>
    );
  }

  return (
    <form ref={rootRef} noValidate onSubmit={submit} className="relative">
      <Honeypot id="ef-website" value={website} onChange={setWebsite} />
      <div className="flex flex-col gap-0.5">
        <div className="grid gap-0.5 sm:grid-cols-2">
          <TextField id="ef-first" label="First name" autoComplete="given-name"
            placeholder="First name" {...bind('first_name')} />
          <TextField id="ef-last" label="Last name" autoComplete="family-name"
            placeholder="Last name" {...bind('last_name')} />
        </div>
        <div className="grid gap-0.5 sm:grid-cols-2">
          <TextField id="ef-email" label="Email" type="email" autoComplete="email"
            placeholder="you@email.com" {...bind('email')} />
          <TextField id="ef-phone" label="Phone" type="tel" autoComplete="tel"
            placeholder="(512) 555-0000" {...bind('phone')} />
        </div>
        <ChipGroup label="Preferred contact method" options={CONTACT_METHODS}
          {...bind('contact_method')} />
        <TextField id="ef-vehicle" label="Vehicle" placeholder="Year, make and model"
          {...bind('vehicle_text')} />
        <MultiChipGroup label="Services, pick all that apply" options={SERVICES}
          value={services}
          onChange={(v) => {
            setServices(v);
            setErrors((e) => (e.services ? { ...e, services: undefined as unknown as string } : e));
          }}
          error={errors.services} />
        <TextAreaField id="ef-message" optional label="Tell us about the project"
          rows={3} placeholder="Goals, coverage, condition, timing…" {...bind('message')} />
      </div>
      <TurnstileWidget onToken={onToken} />
      {serverError && (
        <p role="alert" className="mt-3 border-l-2 border-rb-red bg-rb-surface-3 px-3.5 py-2.5 text-[12px] font-medium leading-relaxed text-rb-tx-2">
          {serverError}
        </p>
      )}
      <div className="mt-5 flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="rb-btn-red inline-flex items-center gap-3 whitespace-nowrap bg-rb-red px-9 py-[17px] text-[14.5px] font-semibold tracking-[0.5px] text-white disabled:opacity-60"
        >
          {pending ? 'Sending…' : 'Request an Estimate'}
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M4 12L12 4M12 4H5.2M12 4V10.8" stroke="#fff" strokeWidth="1.4" />
          </svg>
        </button>
      </div>
      <FormFooterNote phone={shopPhone} />
    </form>
  );
}
