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
import { ContactForm } from './ContactForm';

// Global contact modal (replaces navigating to /contact for internal links).
// A provider in the root layout renders the overlay and exposes open()/close()
// through context; <ContactLink> is the drop-in trigger. The /contact route
// still exists as an SEO/no-JS fallback — ContactLink renders a real
// href="/contact" anchor and only intercepts an unmodified left-click.

type OpenOpts = { listingSlug?: string; listingTitle?: string; prefillMessage?: string };
type Ctx = { open: (opts?: OpenOpts) => void; close: () => void };

const ContactModalContext = createContext<Ctx | null>(null);

export function useContactModal(): Ctx {
  const ctx = useContext(ContactModalContext);
  if (!ctx) throw new Error('useContactModal must be used within ContactModalProvider');
  return ctx;
}

export function ContactModalProvider({
  children,
  phone = null,
}: {
  children: React.ReactNode;
  phone?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [opts, setOpts] = useState<OpenOpts>({});
  const pathname = usePathname();
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
      // restore focus to the trigger for keyboard users
      lastFocus.current?.focus?.();
    };
  }, [open, close]);

  return (
    <ContactModalContext.Provider value={{ open: openModal, close }}>
      {children}
      {open && (
        <div
          className="fixed inset-0 z-[900] flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Contact Red Box Motors"
        >
          {/* backdrop — blurred + heavily dimmed so the panel pops, click to close */}
          <button
            type="button"
            aria-label="Close contact form"
            onClick={close}
            className="absolute inset-0 animate-rb-fade cursor-default bg-black/80 backdrop-blur-lg"
          />
          {/* panel — CTA moment: photo flank + big heading + red accent */}
          <div
            ref={panelRef}
            tabIndex={-1}
            className="relative z-[1] flex max-h-[92vh] w-full max-w-[960px] animate-rb-panel-in overflow-hidden bg-rb-surface outline-none"
            style={{ boxShadow: '0 60px 140px rgba(0,0,0,0.9), 0 10px 40px rgba(0,0,0,0.6)' }}
          >
            {/* red signature strip */}
            <span aria-hidden className="absolute inset-x-0 top-0 z-[2] h-1 bg-rb-red" />

            {/* photo flank (md+) */}
            <div className="relative hidden w-[320px] flex-none md:block lg:w-[380px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/get-in-touch.jpeg"
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                style={{ objectPosition: 'center 52%' }}
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,17,17,0)_55%,rgba(17,17,17,0.45)_84%,#111_100%)]" />
              <div className="absolute bottom-0 left-0 px-7 py-6">
                <div className="font-mono text-[10.5px] uppercase tracking-[3px] text-[#e0e0e0]">
                  Red Box Motors
                  <br />
                  Austin, Texas
                </div>
              </div>
            </div>

            {/* form column */}
            <div className="rb-noscrollbar relative min-w-0 flex-1 overflow-y-auto px-6 pb-9 pt-9 sm:px-9 md:px-11 md:pb-11">
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
                Get in touch
              </div>
              <div className="pr-12 text-[30px] font-extrabold leading-[1.02] tracking-[-0.03em] text-white sm:text-[36px]">
                Tell us about your car.
              </div>
              <p className="mb-8 mt-3.5 max-w-[440px] text-[14.5px] leading-[1.6] text-rb-tx-mute">
                Buying, selling, protecting or transforming, we reply within one business day.
              </p>

              <ContactForm
                sourcePage={pathname ?? '/'}
                listingSlug={opts.listingSlug}
                listingTitle={opts.listingTitle}
                prefillMessage={opts.prefillMessage ?? ''}
                phone={phone}
              />
            </div>
          </div>
        </div>
      )}
    </ContactModalContext.Provider>
  );
}

// Drop-in replacement for <Link href="/contact"> / <a href="/contact">.
// Keeps the real href (SEO, no-JS, open-in-new-tab) but opens the modal on a
// plain left-click.
type ContactLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & OpenOpts;

export function ContactLink({
  className,
  children,
  listingSlug,
  listingTitle,
  prefillMessage,
  onClick,
  ...rest
}: ContactLinkProps) {
  const { open } = useContactModal();
  return (
    <a
      href="/contact"
      className={className}
      onClick={(e) => {
        onClick?.(e);
        // let modified clicks (new tab/window) fall through to the real page
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0)
          return;
        e.preventDefault();
        open({ listingSlug, listingTitle, prefillMessage });
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
