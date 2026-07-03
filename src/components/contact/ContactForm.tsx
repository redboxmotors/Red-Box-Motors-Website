'use client';

import { useCallback, useRef, useState } from 'react';
import { submitLead } from '@/lib/leads/client';
import { TurnstileWidget } from '@/components/site/TurnstileWidget';

// Contact form (Contact.dc.html / Contact Form.dc.html + handoff/forms.md):
// name, email, single-select "Interested In" chips, message, optional phone,
// hidden source page. Live inline validation in the design language — red
// #CC0000 hairline on the field box + small red error text, never an alert
// box. Valid submit swaps in the quiet "Message sent." state.

const INTERESTS = ['Cosmetics', 'Buying / Selling', 'Collection'] as const;

type FieldKey = 'name' | 'email' | 'interest' | 'message';
type Errors = Partial<Record<FieldKey, string>>;

export function ContactForm({
  sourcePage,
  listingSlug,
  listingTitle,
  prefillMessage = '',
}: {
  sourcePage: string;
  listingSlug?: string;
  listingTitle?: string;
  prefillMessage?: string;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
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

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const chipRef = useRef<HTMLButtonElement>(null);
  const msgRef = useRef<HTMLTextAreaElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);

  const clearError = (k: FieldKey) => {
    setErrors((e) => (e[k] ? { ...e, [k]: undefined } : e));
  };

  const selectInterest = (it: string) => {
    setInterest(it);
    clearError('interest');
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
      listing_slug: listingSlug ?? null,
      listing_title: listingTitle ?? null,
      source_page: sourcePage,
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
    setMessage('');
    setInterest(null);
    setErrors({});
    setSent(false);
  };

  const fieldBox = (hasErr: boolean): React.CSSProperties => ({
    background: '#0d0d0d',
    border: '1px solid',
    borderColor: hasErr ? '#CC0000' : '#1c1c1c',
    padding: '16px 18px',
    transition: 'border-color 150ms ease',
  });

  const inputClass =
    'w-full bg-transparent p-0 text-[14px] tracking-[0.2px] text-white outline-none placeholder:text-rb-tx-ghost';
  const labelClass = 'mb-[9px] block text-[10px] uppercase tracking-[2px] text-rb-tx-faint';
  const errClass = 'mt-2 text-[10px] tracking-[0.5px] text-rb-red';

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
      <input type="hidden" name="source_page" value={sourcePage} />
      {listingSlug ? <input type="hidden" name="listing_slug" value={listingSlug} /> : null}
      {/* Honeypot — visually hidden, never announced; bots fill it */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="cf-website">Website</label>
        <input
          id="cf-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div className="mb-0.5 grid gap-0.5 sm:grid-cols-2">
        <div style={fieldBox(!!errors.name)}>
          <label htmlFor="cf-name" className={labelClass}>
            Name
          </label>
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
            className={inputClass}
            style={{ caretColor: '#CC0000' }}
          />
          {errors.name && (
            <div id="cf-name-err" className={errClass}>
              {errors.name}
            </div>
          )}
        </div>
        <div style={fieldBox(!!errors.email)}>
          <label htmlFor="cf-email" className={labelClass}>
            Email
          </label>
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
            className={inputClass}
            style={{ caretColor: '#CC0000' }}
          />
          {errors.email && (
            <div id="cf-email-err" className={errClass}>
              {errors.email}
            </div>
          )}
        </div>
      </div>

      <fieldset className="m-0 border-0 p-0" style={{ ...fieldBox(!!errors.interest), marginBottom: '2px' }}>
        <legend className="sr-only">Interested In</legend>
        <div className={labelClass} aria-hidden>
          Interested In
        </div>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map((it, i) => {
            const active = interest === it;
            return (
              <button
                key={it}
                ref={i === 0 ? chipRef : undefined}
                type="button"
                aria-pressed={active}
                onClick={() => selectInterest(it)}
                className="whitespace-nowrap px-[13px] py-[7px] text-[11px] tracking-[0.5px] active:scale-[0.96]"
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
        {errors.interest && <div className="mt-2.5 text-[10px] tracking-[0.5px] text-rb-red">{errors.interest}</div>}
      </fieldset>

      <div className="mb-0.5" style={{ ...fieldBox(!!errors.message), minHeight: '118px' }}>
        <label htmlFor="cf-message" className={labelClass}>
          Message
        </label>
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
          className={`${inputClass} min-h-[70px] resize-none leading-[1.5]`}
          style={{ caretColor: '#CC0000' }}
        />
        {errors.message && (
          <div id="cf-message-err" className={errClass}>
            {errors.message}
          </div>
        )}
      </div>

      {/* Phone — optional (forms.md recommended addition, not in the prototype) */}
      <div style={fieldBox(false)}>
        <label htmlFor="cf-phone" className={labelClass}>
          Phone · Optional
        </label>
        <input
          id="cf-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="Your phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={inputClass}
          style={{ caretColor: '#CC0000' }}
        />
      </div>

      <TurnstileWidget onToken={onToken} />

      {serverError && (
        <p role="alert" className="mt-4 border-l-2 border-rb-red bg-rb-surface-3 px-4 py-3 text-[12.5px] font-medium leading-relaxed text-rb-tx-2">
          {serverError}
        </p>
      )}

      <div className="mt-[22px] flex items-center justify-between gap-4">
        <span className="text-[11px] tracking-[0.5px] text-rb-tx-faint">
          We reply within one business day.
        </span>
        <button
          type="submit"
          disabled={pending}
          className="rb-btn-red inline-flex items-center gap-2.5 whitespace-nowrap bg-rb-red px-7 py-[15px] text-[13px] tracking-[0.5px] text-white disabled:opacity-60"
        >
          {pending ? 'Sending…' : 'Send Message'}
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M4 12L12 4M12 4H5.2M12 4V10.8" stroke="#fff" strokeWidth="1.4" />
          </svg>
        </button>
      </div>
    </form>
  );
}
