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

export function ContactModalProvider({ children }: { children: React.ReactNode }) {
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
          {/* backdrop — blurred + dimmed, click to close */}
          <button
            type="button"
            aria-label="Close contact form"
            onClick={close}
            className="absolute inset-0 animate-rb-fade cursor-default bg-black/70 backdrop-blur-md"
          />
          {/* panel */}
          <div
            ref={panelRef}
            tabIndex={-1}
            className="rb-noscrollbar relative z-[1] max-h-[90vh] w-full max-w-[560px] animate-rb-panel-in overflow-y-auto bg-rb-surface shadow-rb-card-lg outline-none"
          >
            <div className="sticky top-0 z-[1] flex items-baseline justify-between gap-3.5 border-b border-rb-line bg-rb-surface px-7 py-5">
              <div className="flex items-baseline gap-3.5">
                <span className="text-[13px] font-bold uppercase tracking-[3px] text-white">
                  Get in Touch
                </span>
                <span className="hidden text-[11px] text-rb-tx-faint sm:inline">
                  We reply within one business day
                </span>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="rb-btn -mr-2 flex h-9 w-9 flex-none items-center justify-center text-rb-tx-mute hover:text-white"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </button>
            </div>
            <div className="px-7 py-7 md:px-8">
              <ContactForm
                sourcePage={pathname ?? '/'}
                listingSlug={opts.listingSlug}
                listingTitle={opts.listingTitle}
                prefillMessage={opts.prefillMessage ?? ''}
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
