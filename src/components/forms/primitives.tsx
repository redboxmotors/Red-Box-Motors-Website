'use client';

import { forwardRef } from 'react';

// Shared form primitives for the 2026-07-07 form system (consignment wizard,
// vehicle inquiry, First Look, contact). Field-box pattern from the design
// language: dark box + 1px hairline that turns #CC0000 on error, small
// uppercase label, borderless input, inline red error text — never an alert
// box. Required is implicit; optional fields are explicitly labeled.

// 16px on touch widths — anything smaller makes iOS Safari zoom the page
// when an input is focused.
export const inputCls =
  'w-full border-none bg-transparent p-0 text-[16px] tracking-[0.2px] text-white caret-rb-red outline-none placeholder:text-rb-tx-ghost md:text-[14.5px]';

export function FieldBox({
  hasErr,
  minHeight,
  className = '',
  children,
}: {
  hasErr?: boolean;
  minHeight?: string;
  className?: string;
  children: React.ReactNode;
}) {
  // Focus micro-interaction (motion pass 2026-07-20): the hairline warms to
  // the red accent while a field inside has focus; errors still win.
  return (
    <div
      data-field-error={hasErr ? 'true' : undefined}
      className={`border bg-rb-surface-3 px-4 py-3.5 transition-[border-color,box-shadow] duration-btn ease-rb ${
        hasErr
          ? 'border-rb-red'
          : 'border-[#1c1c1c] focus-within:border-[rgba(204,0,0,0.55)] focus-within:shadow-[0_0_0_1px_rgba(204,0,0,0.12)]'
      } ${className}`}
      style={{ minHeight }}
    >
      {children}
    </div>
  );
}

export function FieldLabel({
  htmlFor,
  optional,
  children,
}: {
  htmlFor?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-[7px] block text-[10px] uppercase tracking-[2px] text-rb-tx-faint"
    >
      {children}
      {optional && <span className="text-[#444]"> · optional</span>}
    </label>
  );
}

export function FieldError({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <div id={id} className="mt-[7px] text-[10px] tracking-[0.5px] text-rb-red">
      {children}
    </div>
  );
}

type TextFieldProps = {
  id: string;
  label: string;
  optional?: boolean;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: 'text' | 'numeric' | 'tel' | 'email' | 'decimal';
  maxLength?: number;
};

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { id, label, optional, value, onChange, error, type = 'text', placeholder, autoComplete, inputMode, maxLength },
  ref,
) {
  return (
    <FieldBox hasErr={!!error}>
      <FieldLabel htmlFor={id} optional={optional}>
        {label}
      </FieldLabel>
      <input
        ref={ref}
        id={id}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        placeholder={placeholder}
        maxLength={maxLength}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-err` : undefined}
        className={inputCls}
      />
      {error && <FieldError id={`${id}-err`}>{error}</FieldError>}
    </FieldBox>
  );
});

type TextAreaFieldProps = {
  id: string;
  label: string;
  optional?: boolean;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  rows?: number;
};

export const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  function TextAreaField({ id, label, optional, value, onChange, error, placeholder, rows = 2 }, ref) {
    return (
      <FieldBox hasErr={!!error}>
        <FieldLabel htmlFor={id} optional={optional}>
          {label}
        </FieldLabel>
        <textarea
          ref={ref}
          id={id}
          rows={rows}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-err` : undefined}
          className={`${inputCls} min-h-[54px] resize-none leading-normal`}
        />
        {error && <FieldError id={`${id}-err`}>{error}</FieldError>}
      </FieldBox>
    );
  },
);

// Single-select chip row (the contact form's "Interested In" pattern).
// NOTE: the visible label IS the <legend> — browsers ignore positioning
// tricks (sr-only) on <legend>, so a hidden legend + separate visible label
// renders the text TWICE (the "duplicated label" bug, fixed 2026-07-08).
export const ChipGroup = forwardRef<HTMLButtonElement, {
  label: string;
  optional?: boolean;
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
  error?: string;
}>(function ChipGroup({ label, optional, options, value, onChange, error }, ref) {
  return (
    <FieldBox hasErr={!!error}>
      <fieldset className="m-0 border-0 p-0">
        <legend className="mb-[7px] block p-0 text-[10px] uppercase tracking-[2px] text-rb-tx-faint">
          {label}
          {optional && <span className="text-[#444]"> · optional</span>}
        </legend>
        <div className="flex flex-wrap gap-2">
          {options.map((opt, i) => {
            const active = value === opt;
            return (
              <button
                key={opt}
                ref={i === 0 ? ref : undefined}
                type="button"
                aria-pressed={active}
                onClick={() => onChange(opt)}
                className="min-h-[44px] whitespace-nowrap px-3.5 py-2 text-[12px] font-medium tracking-[0.5px] active:scale-[0.96]"
                style={{
                  border: '1px solid',
                  borderColor: active ? '#CC0000' : '#2a2a2a',
                  color: active ? '#fff' : '#aaa',
                  background: active ? 'rgba(204,0,0,0.10)' : 'transparent',
                  transition: 'border-color 150ms ease, color 150ms ease, background 150ms ease',
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>
        {error && <FieldError>{error}</FieldError>}
      </fieldset>
    </FieldBox>
  );
});

// Multi-select chip row (e.g. estimate services — pick all that apply).
export function MultiChipGroup({
  label,
  optional,
  options,
  value,
  onChange,
  error,
}: {
  label: string;
  optional?: boolean;
  options: readonly string[];
  value: string[];
  onChange: (v: string[]) => void;
  error?: string;
}) {
  return (
    <FieldBox hasErr={!!error}>
      <fieldset className="m-0 border-0 p-0">
        {/* visible label = the legend itself (see ChipGroup note) */}
        <legend className="mb-[7px] block p-0 text-[10px] uppercase tracking-[2px] text-rb-tx-faint">
          {label}
          {optional && <span className="text-[#444]"> · optional</span>}
        </legend>
        <div className="flex flex-wrap gap-2">
          {options.map((opt) => {
            const active = value.includes(opt);
            return (
              <button
                key={opt}
                type="button"
                aria-pressed={active}
                onClick={() =>
                  onChange(active ? value.filter((v) => v !== opt) : [...value, opt])
                }
                className="min-h-[44px] whitespace-nowrap px-3.5 py-2 text-[12px] font-medium tracking-[0.5px] active:scale-[0.96]"
                style={{
                  border: '1px solid',
                  borderColor: active ? '#CC0000' : '#2a2a2a',
                  color: active ? '#fff' : '#aaa',
                  background: active ? 'rgba(204,0,0,0.10)' : 'transparent',
                  transition: 'border-color 150ms ease, color 150ms ease, background 150ms ease',
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>
        {error && <FieldError>{error}</FieldError>}
      </fieldset>
    </FieldBox>
  );
}

// Native select styled into the field-box pattern (used where a chip row
// would be too wide — e.g. long option lists on mobile).
export function SelectField({
  id,
  label,
  optional,
  value,
  onChange,
  options,
  error,
  placeholder = 'Select…',
}: {
  id: string;
  label: string;
  optional?: boolean;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  error?: string;
  placeholder?: string;
}) {
  return (
    <FieldBox hasErr={!!error}>
      <FieldLabel htmlFor={id} optional={optional}>
        {label}
      </FieldLabel>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-err` : undefined}
        className={`${inputCls} appearance-none bg-rb-surface-3 ${value ? 'text-white' : 'text-rb-tx-ghost'}`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o} value={o} className="bg-rb-surface-3 text-white">
            {o}
          </option>
        ))}
      </select>
      {error && <FieldError id={`${id}-err`}>{error}</FieldError>}
    </FieldBox>
  );
}

// Honeypot — visually hidden, never announced; bots fill it. Hidden with
// INLINE styles (not utility classes) so no CSS-pipeline change can ever
// make it visible again (2026-07-08 — the field had shown up on the listing
// inquiry form).
export function Honeypot({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        left: '-9999px',
        top: 0,
        width: '1px',
        height: '1px',
        overflow: 'hidden',
        clipPath: 'inset(50%)',
        pointerEvents: 'none',
      }}
    >
      <label htmlFor={id}>Website</label>
      <input
        id={id}
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

// Privacy link + direct-phone line shown below every form.
export function FormFooterNote({ phone }: { phone: string | null }) {
  const tel = (phone ?? '').replace(/[^+\d]/g, '');
  return (
    <p className="mt-5 text-[12px] leading-relaxed tracking-[0.3px] text-rb-tx-faint">
      {phone && tel ? (
        <>
          Prefer to speak directly? Call Red Box Motors at{' '}
          <a href={`tel:${tel}`} className="text-rb-tx-mute underline decoration-rb-border-2 underline-offset-4 hover:text-white">
            {phone}
          </a>
          .{' '}
        </>
      ) : null}
      By submitting, you agree to our{' '}
      <a href="/privacy" className="text-rb-tx-mute underline decoration-rb-border-2 underline-offset-4 hover:text-white">
        privacy policy
      </a>
      . We never sell your information.
    </p>
  );
}
