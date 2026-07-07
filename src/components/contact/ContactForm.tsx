'use client';

import { useCallback, useRef, useState } from 'react';
import Link from 'next/link';
import { submitLead } from '@/lib/leads/client';
import { TurnstileWidget } from '@/components/site/TurnstileWidget';
import {
  FieldBox,
  FieldError,
  FieldLabel,
  FormFooterNote,
  Honeypot,
  inputCls,
} from '@/components/forms/primitives';

// General contact form (2026-07-07 form system, Phase 4). Sales-focused
// category list (owner spec — replaces the old Cosmetics / Buying-Selling /
// Collection interests); categories with a better destination surface a
// smart-routing link (consignment form, inventory, Red Box Restoration).
// One visible category label, honeypot invisible, single reply-time line
// (lives in the page/modal header, not here) — 2026-07-07 bug fixes.

// Values must match the API's INTERESTS set (src/app/api/leads/route.ts).
const CATEGORIES = [
  'Buy a Vehicle',
  'Sell or Consign a Vehicle',
  'Ask About an Existing Listing',
  'Transportation or Delivery',
  'General Sales Question',
  'Red Box Restoration',
  'Other',
] as const;

// Smart routing — a better next step for some categories.
const ROUTES: Partial<Record<(typeof CATEGORIES)[number], { href: string; text: string }>> = {
  'Sell or Consign a Vehicle': {
    href: '/dealer/sell',
    text: 'Selling or consigning? Our dedicated consignment form gets your car in front of the team fastest',
  },
  'Ask About an Existing Listing': {
    href: '/dealer/inventory',
    text: 'Every car in our inventory has its own inquiry form — start from the vehicle page',
  },
  'Red Box Restoration': {
    href: '/cosmetics',
    text: 'Looking for protection or restoration work? Start with our services and request an estimate',
  },
};

type FieldKey = 'name' | 'email' | 'interest' | 'message';
type Errors = Partial<Record<FieldKey, string>>;

export function ContactForm({
  sourcePage,
  listingSlug,
  listingTitle,
  prefillMessage = '',
  phone: shopPhone = null,
}: {
  sourcePage: string;
  listingSlug?: string;
  listingTitle?: string;
  prefillMessage?: string;
  phone?: string | null;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [message, setMessage] = useState(prefillMessage);
  const [interest, setInterest] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [website, setWebsite] = useState(''); // honeypot
  const turnstileToken = useRef<string | null>(null);
  const onToken = useCallback((t: string | null) => {
    turnstileToken.current = t;
  }, []);
  const submissionKey = useRef<string>('');
  if (!submissionKey.current && typeof crypto !== 'undefined') {
    submissionKey.current = crypto.randomUUID();
  }

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const chipRef = useRef<HTMLButtonElement>(null);
  const msgRef = useRef<HTMLTextAreaElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);

  const clearError = (k: FieldKey) => {
    setErrors((e) => (e[k] ? { ...e, [k]: undefined } : e));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pending) return;
    const next: Errors = {};
    if (!name.trim()) next.name = 'Enter your name';
    if (!email.trim()) next.email = 'Enter your email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = 'Enter a valid email';
    if (!interest) next.interest = 'Pick one';
    if (!message.trim()) next.message = 'Add a short message';

    if (Object.keys(next).length) {
      setErrors(next);
      // a11y (forms.md): move focus to the first errored control
      const first = next.name
        ? nameRef.current
        : next.email
          ? emailRef.current
          : next.interest
            ? chipRef.current
            : msgRef.current;
      first?.focus();
      return;
    }

    setErrors({});
    setServerError(null);
    setPending(true);
    const result = await submitLead({
      type: 'contact',
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || null,
      interest,
      message: message.trim(),
      vehicle_text: vehicle.trim() || undefined,
      listing_slug: listingSlug ?? null,
      listing_title: listingTitle ?? null,
      source_page: sourcePage,
      submission_key: submissionKey.current,
      website,
      turnstileToken: turnstileToken.current,
    });
    setPending(false);

    if (!result.ok) {
      if (result.errors) setErrors(result.errors as Errors);
      setServerError(
        result.error ??
          (result.errors ? null : 'Something went wrong — please try again, or call or email us directly.'),
      );
      return;
    }

    setSent(true);
    requestAnimationFrame(() => doneRef.current?.focus());
  };

  const reset = () => {
    setName('');
    setEmail('');
    setPhone('');
    setVehicle('');
    setMessage('');
    setInterest(null);
    setErrors({});
    setSent(false);
    submissionKey.current = typeof crypto !== 'undefined' ? crypto.randomUUID() : '';
  };

  const route = interest ? ROUTES[interest as (typeof CATEGORIES)[number]] : undefined;

  if (sent) {
    return (
      <div className="flex min-h-[360px] animate-rb-fade-up flex-col items-start justify-center">
        <div className="mb-6 flex h-[46px] w-[46px] items-center justify-center bg-rb-red">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M5 12.5L10 17.5L19 7" stroke="#fff" strokeWidth="2" />
          </svg>
        </div>
        <div
          ref={doneRef}
          tabIndex={-1}
          className="mb-3 text-[30px] font-semibold tracking-tight text-white outline-none"
        >
          Message sent.
        </div>
        <p className="mb-8 max-w-[380px] text-[15px] leading-[1.6] text-[#9a9a9a]">
          Thanks — we&rsquo;ll get back to you within one business day.
        </p>
        <button
          type="button"
          onClick={reset}
          className="rb-btn inline-flex items-center gap-[9px] border border-rb-border-2 px-[22px] py-[13px] text-[12.5px] tracking-[1px] text-white transition-colors hover:border-[#444] hover:bg-rb-raised-3"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="relative">
      <Honeypot id="cf-website" value={website} onChange={setWebsite} />

      <div className="mb-0.5 grid gap-0.5 sm:grid-cols-2">
        <FieldBox hasErr={!!errors.name}>
          <FieldLabel htmlFor="cf-name">Name</FieldLabel>
          <input
            ref={nameRef}
            id="cf-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              clearError('name');
            }}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? 'cf-name-err' : undefined}
            className={inputCls}
          />
          {errors.name && <FieldError id="cf-name-err">{errors.name}</FieldError>}
        </FieldBox>
        <FieldBox hasErr={!!errors.email}>
          <FieldLabel htmlFor="cf-email">Email</FieldLabel>
          <input
            ref={emailRef}
            id="cf-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearError('email');
            }}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? 'cf-email-err' : undefined}
            className={inputCls}
          />
          {errors.email && <FieldError id="cf-email-err">{errors.email}</FieldError>}
        </FieldBox>
      </div>

      <div className="mb-0.5">
        <FieldBox hasErr={!!errors.interest}>
          <fieldset className="m-0 border-0 p-0">
            <legend className="mb-[7px] block text-[10px] uppercase tracking-[2px] text-rb-tx-faint">
              Interested in
            </legend>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((it, i) => {
                const active = interest === it;
                return (
                  <button
                    key={it}
                    ref={i === 0 ? chipRef : undefined}
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      setInterest(it);
                      clearError('interest');
                    }}
                    className="whitespace-nowrap px-3.5 py-2 text-[12px] font-medium tracking-[0.5px] active:scale-[0.96]"
                    style={{
                      border: '1px solid',
                      borderColor: active ? '#CC0000' : '#2a2a2a',
                      color: active ? '#fff' : '#aaa',
                      background: active ? 'rgba(204,0,0,0.10)' : 'transparent',
                      transition: 'border-color 150ms ease, color 150ms ease, background 150ms ease',
                    }}
                  >
                    {it}
                  </button>
                );
              })}
            </div>
            {errors.interest && <FieldError>{errors.interest}</FieldError>}
          </fieldset>
        </FieldBox>
        {route && (
          <Link
            href={route.href}
            className="mt-0.5 flex items-center justify-between gap-3 border border-rb-red/40 bg-[rgba(204,0,0,0.07)] px-4 py-3.5 text-[13px] leading-snug text-white transition-colors duration-150 hover:border-rb-red hover:bg-[rgba(204,0,0,0.12)]"
          >
            <span>{route.text}</span>
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden className="flex-none">
              <path d="M4 12L12 4M12 4H5.2M12 4V10.8" stroke="#CC0000" strokeWidth="1.6" />
            </svg>
          </Link>
        )}
      </div>

      <div className="mb-0.5 grid gap-0.5 sm:grid-cols-2">
        <FieldBox>
          <FieldLabel htmlFor="cf-phone" optional>
            Phone
          </FieldLabel>
          <input
            id="cf-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="Your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputCls}
          />
        </FieldBox>
        <FieldBox>
          <FieldLabel htmlFor="cf-vehicle" optional>
            Vehicle
          </FieldLabel>
          <input
            id="cf-vehicle"
            name="vehicle"
            type="text"
            placeholder="Year / make / model"
            value={vehicle}
            onChange={(e) => setVehicle(e.target.value)}
            className={inputCls}
          />
        </FieldBox>
      </div>

      <FieldBox hasErr={!!errors.message} minHeight="118px">
        <FieldLabel htmlFor="cf-message">Message</FieldLabel>
        <textarea
          ref={msgRef}
          id="cf-message"
          name="message"
          rows={3}
          placeholder="Tell us about the car or the project…"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            clearError('message');
          }}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? 'cf-message-err' : undefined}
          className={`${inputCls} min-h-[70px] resize-none leading-[1.5]`}
        />
        {errors.message && <FieldError id="cf-message-err">{errors.message}</FieldError>}
      </FieldBox>

      <TurnstileWidget onToken={onToken} />

      {serverError && (
        <p role="alert" className="mt-4 border-l-2 border-rb-red bg-rb-surface-3 px-4 py-3 text-[12.5px] font-medium leading-relaxed text-rb-tx-2">
          {serverError}
        </p>
      )}

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="rb-btn-red inline-flex items-center gap-3 whitespace-nowrap bg-rb-red px-9 py-[17px] text-[14.5px] font-semibold tracking-[0.5px] text-white disabled:opacity-60"
        >
          {pending ? 'Sending…' : 'Send Message'}
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M4 12L12 4M12 4H5.2M12 4V10.8" stroke="#fff" strokeWidth="1.4" />
          </svg>
        </button>
      </div>

      <FormFooterNote phone={shopPhone} />
    </form>
  );
}
