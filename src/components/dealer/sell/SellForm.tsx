'use client';

import { useCallback, useRef, useState } from 'react';
import { submitConsignment } from '@/lib/leads/client';
import { TurnstileWidget } from '@/components/site/TurnstileWidget';
import {
  ChipGroup,
  FormFooterNote,
  Honeypot,
  SelectField,
  TextAreaField,
  TextField,
} from '@/components/forms/primitives';

// /dealer/sell — multi-step consignment intake (2026-07-07 form system;
// the Photos & Docs upload step was removed per owner 2026-07-08 — the API
// still accepts uploads, so restoring the step is additive). Five steps with
// a progress indicator; state lives in the parent so progress survives
// moving between steps. Per-step validation mirrors /api/consignments.

type Group = Record<string, string>;
type Errors = Record<string, string>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const STEPS = ['Contact', 'Vehicle', 'Ownership', 'Condition', 'Sale'] as const;

const CONTACT_METHODS = ['Phone call', 'Text', 'Email'] as const;
const TITLE_STATUSES = ['Clean', 'Rebuilt', 'Bonded', 'Other'] as const;
const YES_NO = ['Yes', 'No'] as const;
const ACCIDENTS = ['None', 'Minor', 'Major'] as const;
const TIMELINES = ['As soon as possible', 'Within 30 days', '1–3 months', 'Just exploring'] as const;
const TRANSMISSIONS = ['Automatic', 'Manual', 'Other'] as const;
const OWNER_COUNTS = ['1', '2', '3', '4+', 'Not sure'] as const;
const KEY_COUNTS = ['1', '2', '3+'] as const;
// Single option for now (owner decision) — extend alongside the API's
// REPRESENTATIONS set when more options open up.
const REPRESENTATIONS = ['Consignment'] as const;


export function SellForm({ phone }: { phone: string | null }) {
  const [contact, setContact] = useState<Group>({
    first_name: '', last_name: '', email: '', phone: '', contact_method: '', city_state: '',
  });
  const [vehicle, setVehicle] = useState<Group>({
    year: '', make: '', model: '', trim: '', vin: '', mileage: '',
    exterior: '', interior: '', transmission: '', location: '',
  });
  const [ownership, setOwnership] = useState<Group>({
    title_in_name: '', title_status: '', has_loan: '', payoff: '',
    owners: '', keys: '', listed_elsewhere: '',
  });
  const [condition, setCondition] = useState<Group>({
    accidents: '', accident_details: '', mechanical: '', cosmetic: '', protection: '',
    modifications: '', maintenance: '', service_records: '', window_sticker: '', extras: '',
  });
  const [sale, setSale] = useState<Group>({
    asking_price: '', minimum: '', timeline: '', reason: '',
    representation: 'Consignment', notes: '',
  });
  const [step, setStep] = useState(0);
  const [maxVisited, setMaxVisited] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [phase, setPhase] = useState<'form' | 'submitting' | 'done'>('form');
  const [website, setWebsite] = useState(''); // honeypot

  const submissionKey = useRef<string>('');
  if (!submissionKey.current && typeof crypto !== 'undefined') {
    submissionKey.current = crypto.randomUUID();
  }
  const turnstileToken = useRef<string | null>(null);
  const onToken = useCallback((t: string | null) => {
    turnstileToken.current = t;
  }, []);
  const topRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);


  const clearError = (k: string) =>
    setErrors((e) => (e[k] ? { ...e, [k]: undefined as unknown as string } : e));

  const bind = (gk: string, g: Group, set: React.Dispatch<React.SetStateAction<Group>>, k: string) => ({
    value: g[k] ?? '',
    onChange: (v: string) => {
      set((p) => ({ ...p, [k]: v }));
      clearError(`${gk}.${k}`);
    },
    error: errors[`${gk}.${k}`],
  });

  // —— Per-step validation (mirrors /api/consignments) ————————————————
  const validateStep = (i: number): Errors => {
    const e: Errors = {};
    if (i === 0) {
      if (!contact.first_name.trim()) e['contact.first_name'] = 'Enter your first name';
      if (!contact.last_name.trim()) e['contact.last_name'] = 'Enter your last name';
      if (!contact.email.trim()) e['contact.email'] = 'Enter your email';
      else if (!EMAIL_RE.test(contact.email.trim())) e['contact.email'] = 'Enter a valid email';
      if (!contact.phone.trim()) e['contact.phone'] = 'Enter your phone number';
      if (!contact.contact_method) e['contact.contact_method'] = 'Pick one';
      if (!contact.city_state.trim()) e['contact.city_state'] = 'Enter your city and state';
    }
    if (i === 1) {
      const yr = Number(vehicle.year.trim());
      if (!/^\d{4}$/.test(vehicle.year.trim()) || yr < 1900 || yr > new Date().getFullYear() + 2)
        e['vehicle.year'] = 'Enter the model year';
      if (!vehicle.make.trim()) e['vehicle.make'] = 'Enter the make';
      if (!vehicle.model.trim()) e['vehicle.model'] = 'Enter the model';
      if (!/^[\d,]+$/.test(vehicle.mileage.trim()) || vehicle.mileage.trim() === '')
        e['vehicle.mileage'] = 'Enter the mileage';
      if (!vehicle.location.trim()) e['vehicle.location'] = 'Where is the vehicle located?';
      const vin = vehicle.vin.replace(/\s/g, '');
      if (vin && !/^[A-HJ-NPR-Z0-9]{11,17}$/i.test(vin))
        e['vehicle.vin'] = 'Check the VIN — 17 characters, no I, O or Q';
    }
    if (i === 2) {
      if (!ownership.title_in_name) e['ownership.title_in_name'] = 'Pick one';
      if (!ownership.title_status) e['ownership.title_status'] = 'Pick one';
      if (!ownership.has_loan) e['ownership.has_loan'] = 'Pick one';
    }
    if (i === 3) {
      if (!condition.accidents) e['condition.accidents'] = 'Pick one';
    }
    if (i === 4) {
      if (!sale.timeline) e['sale.timeline'] = 'Pick one';
    }
    return e;
  };

  const scrollToFirstError = () => {
    requestAnimationFrame(() => {
      const box = topRef.current?.querySelector<HTMLElement>('[data-field-error="true"]');
      box?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      box?.querySelector<HTMLElement>('input, textarea, select, button')?.focus({ preventScroll: true });
    });
  };

  const goTo = (i: number) => {
    setStep(i);
    setMaxVisited((m) => Math.max(m, i));
    requestAnimationFrame(() =>
      topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
    );
  };

  const next = () => {
    const e = validateStep(step);
    if (Object.keys(e).length) {
      setErrors((prev) => ({ ...prev, ...e }));
      scrollToFirstError();
      return;
    }
    goTo(step + 1);
  };

  // —— Submit ————————————————————————————————————————————————————————
  const submit = async () => {
    // Re-validate every step; jump back to the first one with problems.
    for (let i = 0; i < STEPS.length; i++) {
      const e = validateStep(i);
      if (Object.keys(e).length) {
        setErrors((prev) => ({ ...prev, ...e }));
        goTo(i);
        scrollToFirstError();
        return;
      }
    }

    setServerError(null);
    setPhase('submitting');
    const result = await submitConsignment({
      submission_key: submissionKey.current,
      source_page: '/dealer/sell',
      website,
      turnstileToken: turnstileToken.current,
      contact,
      vehicle,
      ownership,
      condition,
      sale,
      files: [],
    });

    if (!result.ok) {
      setPhase('form');
      if (result.errors) {
        setErrors((prev) => ({ ...prev, ...result.errors }));
        const firstKey = Object.keys(result.errors)[0] ?? '';
        const stepOf: Record<string, number> = {
          contact: 0, vehicle: 1, ownership: 2, condition: 3, sale: 4, files: 5,
        };
        goTo(stepOf[firstKey.split('.')[0]] ?? step);
        scrollToFirstError();
      }
      setServerError(
        result.error ??
          (result.errors ? null : 'Something went wrong — please try again, or call us directly.'),
      );
      return;
    }

    setPhase('done');
    requestAnimationFrame(() => doneRef.current?.focus());
  };

  // —— Success ————————————————————————————————————————————————————————
  if (phase === 'done') {
    return (
      <div className="flex min-h-[380px] animate-rb-fade-up flex-col items-start justify-center">
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
          Submission received.
        </div>
        <p className="mb-4 max-w-[520px] text-[15px] leading-[1.65] text-[#9a9a9a]">
          Thank you for submitting your vehicle to Red Box Motors. Our team will review the
          information and contact you to discuss the vehicle, current market positioning and next
          steps.
        </p>
        <FormFooterNote phone={phone} />
      </div>
    );
  }

  const busy = phase === 'submitting';
  const lastStep = step === STEPS.length - 1;

  return (
    <div ref={topRef} className="scroll-mt-[110px]">
      {/* Progress */}
      <div className="mb-7">
        <div className="mb-3 flex items-baseline justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-[2px] text-rb-tx-faint">
            Step {step + 1} of {STEPS.length}
          </span>
          <span className="text-[13px] font-semibold tracking-[0.5px] text-white">
            {STEPS[step]}
          </span>
        </div>
        <div className="flex gap-1" role="list" aria-label="Form progress">
          {STEPS.map((title, i) => {
            const reachable = i <= maxVisited;
            return (
              <button
                key={title}
                type="button"
                role="listitem"
                disabled={!reachable || busy}
                onClick={() => reachable && goTo(i)}
                aria-label={`${title}${i === step ? ' (current step)' : ''}`}
                aria-current={i === step ? 'step' : undefined}
                className="h-[3px] flex-1 transition-colors duration-200 disabled:cursor-default"
                style={{
                  background: i < step ? '#CC0000' : i === step ? '#CC0000' : reachable ? '#3a3a3a' : '#1c1c1c',
                  opacity: i === step ? 1 : i < step ? 0.55 : 1,
                }}
              />
            );
          })}
        </div>
      </div>

      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (busy) return;
          if (lastStep) void submit();
          else next();
        }}
        className="relative"
      >
        <Honeypot id="sf-website" value={website} onChange={setWebsite} />

        {/* STEP 1 — Contact */}
        {step === 0 && (
          <div className="grid animate-rb-fade-up gap-0.5">
            <div className="grid gap-0.5 sm:grid-cols-2">
              <TextField id="sf-contact-first" label="First name" autoComplete="given-name"
                placeholder="First name" {...bind('contact', contact, setContact, 'first_name')} />
              <TextField id="sf-contact-last" label="Last name" autoComplete="family-name"
                placeholder="Last name" {...bind('contact', contact, setContact, 'last_name')} />
            </div>
            <div className="grid gap-0.5 sm:grid-cols-2">
              <TextField id="sf-contact-email" label="Email" type="email" autoComplete="email"
                placeholder="you@email.com" {...bind('contact', contact, setContact, 'email')} />
              <TextField id="sf-contact-phone" label="Phone" type="tel" autoComplete="tel"
                placeholder="(512) 555-0000" {...bind('contact', contact, setContact, 'phone')} />
            </div>
            <ChipGroup label="Preferred contact method" options={CONTACT_METHODS}
              {...bind('contact', contact, setContact, 'contact_method')} />
            <TextField id="sf-contact-city" label="City / State" autoComplete="address-level2"
              placeholder="Austin, TX" {...bind('contact', contact, setContact, 'city_state')} />
          </div>
        )}

        {/* STEP 2 — Vehicle */}
        {step === 1 && (
          <div className="grid animate-rb-fade-up gap-0.5">
            <div className="grid gap-0.5 sm:grid-cols-3">
              <TextField id="sf-vehicle-year" label="Year" inputMode="numeric" maxLength={4}
                placeholder="2021" {...bind('vehicle', vehicle, setVehicle, 'year')} />
              <TextField id="sf-vehicle-make" label="Make" placeholder="Porsche"
                {...bind('vehicle', vehicle, setVehicle, 'make')} />
              <TextField id="sf-vehicle-model" label="Model" placeholder="911"
                {...bind('vehicle', vehicle, setVehicle, 'model')} />
            </div>
            <div className="grid gap-0.5 sm:grid-cols-2">
              <TextField id="sf-vehicle-trim" label="Trim / Edition" optional placeholder="GT3 Touring"
                {...bind('vehicle', vehicle, setVehicle, 'trim')} />
              <TextField id="sf-vehicle-vin" label="VIN" optional placeholder="17 characters"
                {...bind('vehicle', vehicle, setVehicle, 'vin')} />
            </div>
            <div className="grid gap-0.5 sm:grid-cols-2">
              <TextField id="sf-vehicle-mileage" label="Mileage" inputMode="numeric"
                placeholder="12,500" {...bind('vehicle', vehicle, setVehicle, 'mileage')} />
              <SelectField id="sf-vehicle-transmission" label="Transmission" optional
                options={TRANSMISSIONS} {...bind('vehicle', vehicle, setVehicle, 'transmission')} />
            </div>
            <div className="grid gap-0.5 sm:grid-cols-2">
              <TextField id="sf-vehicle-exterior" label="Exterior color" optional placeholder="GT Silver"
                {...bind('vehicle', vehicle, setVehicle, 'exterior')} />
              <TextField id="sf-vehicle-interior" label="Interior color" optional placeholder="Black leather"
                {...bind('vehicle', vehicle, setVehicle, 'interior')} />
            </div>
            <TextField id="sf-vehicle-location" label="Current vehicle location"
              placeholder="City, state — or “at Red Box Motors”"
              {...bind('vehicle', vehicle, setVehicle, 'location')} />
          </div>
        )}

        {/* STEP 3 — Ownership */}
        {step === 2 && (
          <div className="grid animate-rb-fade-up gap-0.5">
            <div className="grid gap-0.5 sm:grid-cols-2">
              <ChipGroup label="Is the title in your name?" options={YES_NO}
                {...bind('ownership', ownership, setOwnership, 'title_in_name')} />
              <ChipGroup label="Title status" options={TITLE_STATUSES}
                {...bind('ownership', ownership, setOwnership, 'title_status')} />
            </div>
            <div className="grid gap-0.5 sm:grid-cols-2">
              <ChipGroup label="Outstanding loan or payoff?" options={YES_NO}
                {...bind('ownership', ownership, setOwnership, 'has_loan')} />
              {ownership.has_loan === 'Yes' ? (
                <TextField id="sf-ownership-payoff" label="Approx. payoff amount" optional
                  inputMode="decimal" placeholder="$"
                  {...bind('ownership', ownership, setOwnership, 'payoff')} />
              ) : (
                <div className="hidden sm:block" aria-hidden />
              )}
            </div>
            <div className="grid gap-0.5 sm:grid-cols-3">
              <SelectField id="sf-ownership-owners" label="Number of owners" optional
                options={OWNER_COUNTS} placeholder="If known"
                {...bind('ownership', ownership, setOwnership, 'owners')} />
              <SelectField id="sf-ownership-keys" label="Number of keys" optional
                options={KEY_COUNTS} {...bind('ownership', ownership, setOwnership, 'keys')} />
              <ChipGroup label="Listed elsewhere?" optional options={YES_NO}
                {...bind('ownership', ownership, setOwnership, 'listed_elsewhere')} />
            </div>
          </div>
        )}

        {/* STEP 4 — Condition & history */}
        {step === 3 && (
          <div className="grid animate-rb-fade-up gap-0.5">
            <ChipGroup label="Accident / damage history" options={ACCIDENTS}
              {...bind('condition', condition, setCondition, 'accidents')} />
            <TextAreaField id="sf-condition-accident-details" optional
              label="Accidents, paintwork or body repairs — details"
              placeholder="What happened, when, and how it was repaired"
              {...bind('condition', condition, setCondition, 'accident_details')} />
            <div className="grid gap-0.5 sm:grid-cols-2">
              <TextAreaField id="sf-condition-mechanical" optional
                label="Mechanical issues / warning lights"
                {...bind('condition', condition, setCondition, 'mechanical')} />
              <TextAreaField id="sf-condition-cosmetic" optional label="Cosmetic imperfections"
                {...bind('condition', condition, setCondition, 'cosmetic')} />
            </div>
            <div className="grid gap-0.5 sm:grid-cols-2">
              <TextAreaField id="sf-condition-protection" optional
                label="Existing PPF / ceramic / wrap / tint"
                {...bind('condition', condition, setCondition, 'protection')} />
              <TextAreaField id="sf-condition-modifications" optional label="Modifications"
                {...bind('condition', condition, setCondition, 'modifications')} />
            </div>
            <TextAreaField id="sf-condition-maintenance" optional label="Recent maintenance"
              placeholder="Last service, tires, brakes…"
              {...bind('condition', condition, setCondition, 'maintenance')} />
            <div className="grid gap-0.5 sm:grid-cols-2">
              <ChipGroup label="Service records available?" optional options={['Yes', 'Partial', 'No']}
                {...bind('condition', condition, setCondition, 'service_records')} />
              <ChipGroup label="Original window sticker / build sheet?" optional options={YES_NO}
                {...bind('condition', condition, setCondition, 'window_sticker')} />
            </div>
            <TextAreaField id="sf-condition-extras" optional
              label="Other accessories / documentation"
              placeholder="Extra wheels, tools, books, car cover…"
              {...bind('condition', condition, setCondition, 'extras')} />
          </div>
        )}

        {/* STEP 5 — Sale expectations */}
        {step === 4 && (
          <div className="grid animate-rb-fade-up gap-0.5">
            <div className="grid gap-0.5 sm:grid-cols-2">
              <TextField id="sf-sale-asking" label="Desired asking price" optional
                inputMode="decimal" placeholder="$"
                {...bind('sale', sale, setSale, 'asking_price')} />
              <TextField id="sf-sale-minimum" label="Minimum acceptable / desired net" optional
                inputMode="decimal" placeholder="$"
                {...bind('sale', sale, setSale, 'minimum')} />
            </div>
            <ChipGroup label="Desired timeline" options={TIMELINES}
              {...bind('sale', sale, setSale, 'timeline')} />
            <div className="grid gap-0.5 sm:grid-cols-2">
              <TextField id="sf-sale-reason" label="Reason for selling" optional
                placeholder="Making room, next build…"
                {...bind('sale', sale, setSale, 'reason')} />
              <ChipGroup label="Representation" options={REPRESENTATIONS}
                {...bind('sale', sale, setSale, 'representation')} />
            </div>
            <TextAreaField id="sf-sale-notes" optional label="Anything else we should know"
              rows={3} {...bind('sale', sale, setSale, 'notes')} />
            <TurnstileWidget onToken={onToken} />
          </div>
        )}

        {serverError && (
          <p role="alert" className="mt-4 border-l-2 border-rb-red bg-rb-surface-3 px-4 py-3 text-[12.5px] font-medium leading-relaxed text-rb-tx-2">
            {serverError}
          </p>
        )}

        {/* Nav */}
        <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
          {step > 0 ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => goTo(step - 1)}
              className="rb-btn inline-flex items-center gap-[9px] border border-rb-border-2 px-[22px] py-[15px] text-[12.5px] tracking-[1px] text-white transition-colors hover:border-[#444] disabled:opacity-60"
            >
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M10 3L5 8L10 13" stroke="#fff" strokeWidth="1.4" />
              </svg>
              Back
            </button>
          ) : (
            <span />
          )}
          <button
            type="submit"
            disabled={busy}
            className="rb-btn-red inline-flex items-center gap-3 whitespace-nowrap bg-rb-red px-9 py-[17px] text-[14.5px] font-semibold tracking-[0.5px] text-white disabled:opacity-60"
          >
            {phase === 'submitting' ? 'Submitting…' : lastStep ? 'Submit My Vehicle' : 'Continue'}
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M4 12L12 4M12 4H5.2M12 4V10.8" stroke="#fff" strokeWidth="1.4" />
            </svg>
          </button>
        </div>

        <FormFooterNote phone={phone} />
      </form>
    </div>
  );
}
