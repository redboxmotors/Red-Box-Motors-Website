'use client';

import { useCallback, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { submitLead } from '@/lib/leads/client';
import { TurnstileWidget } from '@/components/site/TurnstileWidget';

// Car Detail inquiry box (Car Detail.dc.html). Prototype-faithful inline form:
// client-side validation identical to the prototype, sent-state panel on
// success. Submits to the leads pipeline (handoff/forms.md) with the listing
// slug/title attached for attribution.

type Errors = { name?: string; email?: string; message?: string };

function FieldBox({
  hasErr,
  minHeight,
  children,
}: {
  hasErr?: boolean;
  minHeight?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="border bg-rb-surface-3 px-4 py-3.5 transition-colors duration-150"
      style={{ borderColor: hasErr ? '#CC0000' : '#1c1c1c', minHeight }}
    >
      {children}
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-[7px] text-[10px] uppercase tracking-[2px] text-rb-tx-faint">{children}</div>
  );
}

function FieldError({ children }: { children: React.ReactNode }) {
  return <div className="mt-[7px] text-[10px] tracking-[0.5px] text-rb-red">{children}</div>;
}

const inputCls =
  'w-full border-none bg-transparent p-0 text-[14px] tracking-[0.2px] text-white caret-rb-red outline-none placeholder:text-rb-tx-ghost';

export function InquiryPanel({
  makeModel,
  price,
  prefill,
  listingSlug,
  listingTitle,
}: {
  makeModel: string;
  price: string;
  prefill: string;
  listingSlug: string;
  listingTitle: string;
}) {
  const pathname = usePathname();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState(prefill);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [website, setWebsite] = useState(''); // honeypot
  const turnstileToken = useRef<string | null>(null);
  const onToken = useCallback((t: string | null) => {
    turnstileToken.current = t;
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pending) return;
    const next: Errors = {};
    if (!name.trim()) next.name = 'Enter your name';
    if (!email.trim()) next.email = 'Enter your email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = 'Enter a valid email';
    if (!message.trim()) next.message = 'Add a message';
    if (Object.keys(next).length) {
      setErrors(next);
      return;
    }
    setErrors({});
    setServerError(null);
    setPending(true);
    const result = await submitLead({
      type: 'listing',
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || null,
      interest: null,
      message: message.trim(),
      listing_slug: listingSlug,
      listing_title: listingTitle,
      source_page: pathname,
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

  const reset = () => {
    setName('');
    setEmail('');
    setPhone('');
    setMessage(prefill);
    setErrors({});
    setSent(false);
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
          We&rsquo;ll be in touch about the {makeModel} within one business day.
        </p>
        <button
          type="button"
          onClick={reset}
          className="inline-flex cursor-pointer items-center gap-[9px] border border-rb-border-2 px-5 py-3 text-[12px] tracking-[1px] text-white transition-[background,border-color,transform] duration-[220ms] ease-rb hover:-translate-y-0.5 hover:border-rb-border-3 hover:bg-rb-raised-3 active:translate-y-0 active:scale-[0.98]"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form
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
      {/* Honeypot — visually hidden; bots fill it */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="iq-website">Website</label>
        <input
          id="iq-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-0.5 px-[18px] pb-[18px] pt-4">
        <FieldBox hasErr={!!errors.name}>
          <FieldLabel>Name</FieldLabel>
          <input
            type="text"
            autoComplete="name"
            placeholder="Your name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
            }}
            className={inputCls}
          />
          {errors.name && <FieldError>{errors.name}</FieldError>}
        </FieldBox>
        <FieldBox hasErr={!!errors.email}>
          <FieldLabel>Email</FieldLabel>
          <input
            type="email"
            autoComplete="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
            }}
            className={inputCls}
          />
          {errors.email && <FieldError>{errors.email}</FieldError>}
        </FieldBox>
        <FieldBox>
          <FieldLabel>
            Phone <span className="text-[#444]">· optional</span>
          </FieldLabel>
          <input
            type="tel"
            autoComplete="tel"
            placeholder="(512) 555-0000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputCls}
          />
        </FieldBox>
        <FieldBox hasErr={!!errors.message} minHeight="88px">
          <FieldLabel>Message</FieldLabel>
          <textarea
            rows={2}
            aria-label="Message"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (errors.message) setErrors((p) => ({ ...p, message: undefined }));
            }}
            className={`${inputCls} min-h-[60px] resize-none leading-normal`}
          />
          {errors.message && <FieldError>{errors.message}</FieldError>}
        </FieldBox>
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
          {pending ? 'Sending…' : 'Send Inquiry'}
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M4 12L12 4M12 4H5.2M12 4V10.8" stroke="#fff" strokeWidth="1.4" />
          </svg>
        </button>
      </div>
    </form>
  );
}
