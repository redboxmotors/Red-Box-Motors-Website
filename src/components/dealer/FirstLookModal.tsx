'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type AnchorHTMLAttributes,
} from 'react';
import { usePathname } from 'next/navigation';
import { submitLead } from '@/lib/leads/client';
import { TurnstileWidget } from '@/components/site/TurnstileWidget';
import {
  ChipGroup,
  FormFooterNote,
  Honeypot,
  TextField,
} from '@/components/forms/primitives';

// Arriving Soon / First Look quick form (2026-07-07 form system, Phase 5).
// Modal pattern mirrors ContactModal: a provider renders the overlay,
// <FirstLookLink> is the drop-in trigger (real href="/contact" fallback for
// no-JS / modified clicks). The vehicle name + campaign (listing slug) ride
// along as hidden fields; the similar-vehicles opt-in starts UNCHECKED and
// is never auto-set.

type OpenOpts = { vehicle?: string; campaign?: string };
type Ctx = { open: (opts?: OpenOpts) => void; close: () => void };

const FirstLookContext = createContext<Ctx | null>(null);

export function useFirstLook(): Ctx {
  const ctx = useContext(FirstLookContext);
  if (!ctx) throw new Error('useFirstLook must be used within FirstLookProvider');
  return ctx;
}

const TIMEFRAMES = ['As soon as possible', 'Within 30 days', '1–3 months', 'Just researching'] as const;
const CONTACT_METHODS = ['Phone call', 'Text', 'Email'] as const;

export function FirstLookProvider({
  children,
  phone = null,
}: {
  children: React.ReactNode;
  phone?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [opts, setOpts] = useState<OpenOpts>({});
  const lastFocus = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const openModal = useCallback((o?: OpenOpts) => {
    if (typeof document !== 'undefined') lastFocus.current = document.activeElement as HTMLElement;
    setOpts(o ?? {});
    setOpen(true);
  }, []);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const raf = requestAnimationFrame(() => panelRef.current?.focus());
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      cancelAnimationFrame(raf);
      lastFocus.current?.focus?.();
    };
  }, [open, close]);

  return (
    <FirstLookContext.Provider value={{ open: openModal, close }}>
      {children}
      {open && (
        <div
          className="fixed inset-0 z-[900] flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Request a first look"
        >
          <button
            type="button"
            aria-label="Close first look form"
            onClick={close}
            className="absolute inset-0 animate-rb-fade cursor-default bg-black/80 backdrop-blur-lg"
          />
          <div
            ref={panelRef}
            tabIndex={-1}
            className="rb-noscrollbar relative z-[1] max-h-[92vh] w-full max-w-[560px] animate-rb-panel-in overflow-y-auto bg-rb-surface px-6 pb-9 pt-9 outline-none sm:px-9"
            style={{ boxShadow: '0 60px 140px rgba(0,0,0,0.9), 0 10px 40px rgba(0,0,0,0.6)' }}
          >
            <span aria-hidden className="absolute inset-x-0 top-0 z-[2] h-1 bg-rb-red" />
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="rb-btn absolute right-4 top-4 z-[2] flex h-10 w-10 flex-none items-center justify-center bg-rb-raised-3 text-rb-tx-2 hover:bg-rb-raised hover:text-white"
            >
              <svg width="17" height="17" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </button>
            <div className="mb-3 font-mono text-[11px] uppercase tracking-[4px] text-rb-red">
              — Arriving soon
            </div>
            <div className="pr-12 text-[28px] font-extrabold leading-[1.05] tracking-[-0.03em] text-white sm:text-[32px]">
              {opts.vehicle ? `First look: ${opts.vehicle}` : 'Get the first look.'}
            </div>
            <p className="mb-7 mt-3 max-w-[420px] text-[14px] leading-[1.6] text-rb-tx-mute">
              Be first in line when the car lands — photos, condition report and pricing before it
              hits the floor.
            </p>
            <FirstLookForm vehicle={opts.vehicle} campaign={opts.campaign} phone={phone} />
          </div>
        </div>
      )}
    </FirstLookContext.Provider>
  );
}

function FirstLookForm({
  vehicle,
  campaign,
  phone: shopPhone,
}: {
  vehicle?: string;
  campaign?: string;
  phone: string | null;
}) {
  const pathname = usePathname();
  const [fields, setFields] = useState<Record<string, string>>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    vehicle_of_interest: vehicle ?? '',
    timeframe: '',
    contact_method: '',
  });
  const [optIn, setOptIn] = useState(false); // UNCHECKED — never auto-subscribe
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
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
    if (!fields.vehicle_of_interest.trim()) next.vehicle_of_interest = 'Which car?';
    if (!fields.timeframe) next.timeframe = 'Pick one';
    if (!fields.contact_method) next.contact_method = 'Pick one';
    if (Object.keys(next).length) {
      setErrors(next);
      requestAnimationFrame(() => {
        const box = rootRef.current?.querySelector<HTMLElement>('[data-field-error="true"]');
        box?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        box?.querySelector<HTMLElement>('input, button')?.focus({ preventScroll: true });
      });
      return;
    }
    setErrors({});
    setServerError(null);
    setPending(true);
    const result = await submitLead({
      type: 'first_look',
      first_name: fields.first_name.trim(),
      last_name: fields.last_name.trim(),
      email: fields.email.trim(),
      phone: fields.phone.trim(),
      contact_method: fields.contact_method,
      timeframe: fields.timeframe,
      vehicle_of_interest: fields.vehicle_of_interest.trim(),
      campaign: campaign ?? undefined,
      opt_in: optIn,
      message: '',
      listing_slug: campaign ?? null,
      listing_title: vehicle ?? null,
      source_page: pathname,
      submission_key: submissionKey.current,
      website,
      turnstileToken: turnstileToken.current,
    });
    setPending(false);
    if (!result.ok) {
      if (result.errors) setErrors(result.errors as Record<string, string>);
      setServerError(
        result.error ??
          (result.errors ? null : 'Something went wrong — please try again, or call us directly.'),
      );
      return;
    }
    setSent(true);
    requestAnimationFrame(() => doneRef.current?.focus());
  };

  if (sent) {
    return (
      <div className="flex min-h-[240px] animate-rb-fade-up flex-col items-start justify-center">
        <div className="mb-5 flex h-[42px] w-[42px] items-center justify-center bg-rb-red">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M5 12.5L10 17.5L19 7" stroke="#fff" strokeWidth="2.2" />
          </svg>
        </div>
        <div
          ref={doneRef}
          tabIndex={-1}
          className="mb-2.5 text-[24px] font-semibold tracking-tight text-white outline-none"
        >
          You&rsquo;re on the list.
        </div>
        <p className="text-[14px] leading-relaxed text-[#9a9a9a]">
          We&rsquo;ll contact you when additional information becomes available.
        </p>
      </div>
    );
  }

  return (
    <form ref={rootRef} noValidate onSubmit={submit} className="relative">
      <Honeypot id="fl-website" value={website} onChange={setWebsite} />
      <div className="flex flex-col gap-0.5">
        <div className="grid gap-0.5 sm:grid-cols-2">
          <TextField id="fl-first" label="First name" autoComplete="given-name"
            placeholder="First name" {...bind('first_name')} />
          <TextField id="fl-last" label="Last name" autoComplete="family-name"
            placeholder="Last name" {...bind('last_name')} />
        </div>
        <div className="grid gap-0.5 sm:grid-cols-2">
          <TextField id="fl-email" label="Email" type="email" autoComplete="email"
            placeholder="you@email.com" {...bind('email')} />
          <TextField id="fl-phone" label="Phone" type="tel" autoComplete="tel"
            placeholder="(512) 555-0000" {...bind('phone')} />
        </div>
        <TextField id="fl-vehicle" label="Vehicle of interest"
          placeholder="Which arriving car?" {...bind('vehicle_of_interest')} />
        <ChipGroup label="Purchase timeframe" options={TIMEFRAMES} {...bind('timeframe')} />
        <ChipGroup label="Preferred contact method" options={CONTACT_METHODS}
          {...bind('contact_method')} />
        <label className="flex cursor-pointer items-start gap-3 border border-rb-line-2 bg-rb-surface-3 px-4 py-3.5">
          <input
            type="checkbox"
            checked={optIn}
            onChange={(e) => setOptIn(e.target.checked)}
            className="mt-0.5 h-4 w-4 flex-none cursor-pointer appearance-none border border-rb-border-2 bg-transparent transition-colors checked:border-rb-red checked:bg-rb-red"
          />
          <span className="text-[12.5px] leading-relaxed text-rb-tx-mute">
            Also let me know about similar vehicles Red Box Motors gets in.
          </span>
        </label>
      </div>
      <TurnstileWidget onToken={onToken} />
      {serverError && (
        <p role="alert" className="mt-3 border-l-2 border-rb-red bg-rb-surface-3 px-3.5 py-2.5 text-[12px] font-medium leading-relaxed text-rb-tx-2">
          {serverError}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="rb-btn-red mt-3 flex w-full cursor-pointer items-center justify-center gap-[9px] bg-rb-red p-3.5 text-[13px] tracking-[0.5px] text-white disabled:opacity-60"
      >
        {pending ? 'Sending…' : 'Request First Look'}
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M4 12L12 4M12 4H5.2M12 4V10.8" stroke="#fff" strokeWidth="1.4" />
        </svg>
      </button>
      <FormFooterNote phone={shopPhone} />
    </form>
  );
}

// Drop-in trigger. Real href="/contact" for no-JS / modified clicks; plain
// left-click opens the First Look modal with the vehicle attached.
type FirstLookLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & OpenOpts;

export function FirstLookLink({
  className,
  children,
  vehicle,
  campaign,
  onClick,
  ...rest
}: FirstLookLinkProps) {
  const { open } = useFirstLook();
  return (
    <a
      href="/contact"
      className={className}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0)
          return;
        e.preventDefault();
        open({ vehicle, campaign });
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
