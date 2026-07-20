'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePathname } from 'next/navigation';
import { ContactLink } from '@/components/contact/ContactModal';

// Mobile header (design_handoff, all screens): 3px red top rule, cube logo +
// "RED BOX MOTORS" wordmark, hamburger (two white bars + short red bar).
// Static — scrolls with the page, unlike the fixed desktop SiteNav. The
// hamburger opens the same full-screen drawer pattern as SiteNav (flat six
// links; Contact opens the global modal).

export type MobileNavKey =
  | ''
  | 'inventory'
  | 'sell'
  | 'restoration'
  | 'work'
  | 'about'
  | 'contact';

const LINKS: { key: Exclude<MobileNavKey, '' | 'contact'>; label: string; href: string }[] = [
  { key: 'inventory', label: 'Current Inventory', href: '/dealer/inventory' },
  { key: 'sell', label: 'Sell Your Vehicle', href: '/dealer' },
  { key: 'restoration', label: 'Red Box Restoration', href: '/restoration' },
  { key: 'work', label: 'Recent Work', href: '/restoration/work' },
  { key: 'about', label: 'About', href: '/about' },
];

export function MobileHeader({ current = '' }: { current?: MobileNavKey }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <header
      className="relative z-[5] flex items-center justify-between border-t-[3px] border-rb-red bg-rb-surface px-5 py-[18px]"
      style={{ paddingTop: 'max(env(safe-area-inset-top), 18px)' }}
    >
      <Link href="/" className="flex items-center gap-2.5" aria-label="Red Box Motors, home">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/brand/rbm-logo-header.png" alt="" className="h-5 w-5 flex-none" />
        <span className="text-[13px] font-extrabold tracking-[0.22em] text-white">
          RED BOX MOTORS
        </span>
      </Link>

      <button
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex flex-col items-end gap-[5px] px-1 py-3"
      >
        <span className="block h-0.5 w-6 bg-white" />
        <span className="block h-0.5 w-6 bg-white" />
        <span className="block h-0.5 w-3.5 bg-rb-red" />
      </button>

      {mounted &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="rb-drawer fixed inset-0 z-[60] flex flex-col bg-[#070707]/[0.985] md:hidden"
            style={{
              opacity: open ? 1 : 0,
              visibility: open ? 'visible' : 'hidden',
              transform: open ? 'none' : 'translateY(-10px)',
              transition:
                'opacity 320ms cubic-bezier(.2,.8,.2,1), transform 320ms cubic-bezier(.2,.8,.2,1), visibility 320ms',
              paddingTop: 'max(env(safe-area-inset-top), 12px)',
              paddingBottom: 'max(env(safe-area-inset-bottom), 20px)',
            }}
          >
            <div className="flex items-center justify-between px-5 py-2">
              <Link href="/" className="inline-flex items-center gap-3" onClick={() => setOpen(false)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/brand/rbm-logo-header.png" alt="" className="h-[30px] w-[30px]" />
                <span className="text-[12px] font-bold tracking-[3px] text-white">RED BOX MOTORS</span>
              </Link>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="flex h-12 w-12 items-center justify-center"
              >
                <span className="relative block h-[18px] w-[18px]">
                  <span className="absolute left-0 top-[8px] h-0.5 w-full rotate-45 bg-white" />
                  <span className="absolute left-0 top-[8px] h-0.5 w-full -rotate-45 bg-white" />
                </span>
              </button>
            </div>
            <nav aria-label="Site, mobile" className="mt-2 flex-1 overflow-y-auto px-5">
              {LINKS.map((link, i) => {
                const active = link.key === current;
                return (
                  <Link
                    key={link.key}
                    href={link.href}
                    aria-current={active ? 'page' : undefined}
                    className={`rb-drawer-item flex min-h-[52px] items-center gap-3.5 border-b border-rb-line py-3 text-[17px] font-medium tracking-[0.6px] ${
                      active ? 'text-white' : 'text-[#d6d6d6]'
                    }`}
                    style={{
                      opacity: open ? 1 : 0,
                      transform: open ? 'none' : 'translateY(8px)',
                      transition: `opacity 380ms cubic-bezier(.2,.8,.2,1) ${open ? 60 + i * 40 : 0}ms, transform 380ms cubic-bezier(.2,.8,.2,1) ${open ? 60 + i * 40 : 0}ms`,
                    }}
                  >
                    <span
                      className="h-[6px] w-[6px] flex-none"
                      style={{ background: active ? '#CC0000' : '#2c2c2c' }}
                    />
                    {link.label}
                  </Link>
                );
              })}
              <ContactLink
                className={`rb-drawer-item flex min-h-[52px] w-full items-center gap-3.5 border-b border-rb-line py-3 text-left text-[17px] font-medium tracking-[0.6px] ${
                  current === 'contact' ? 'text-white' : 'text-[#d6d6d6]'
                }`}
                style={{
                  opacity: open ? 1 : 0,
                  transform: open ? 'none' : 'translateY(8px)',
                  transition: `opacity 380ms cubic-bezier(.2,.8,.2,1) ${open ? 60 + LINKS.length * 40 : 0}ms, transform 380ms cubic-bezier(.2,.8,.2,1) ${open ? 60 + LINKS.length * 40 : 0}ms`,
                }}
              >
                <span
                  className="h-[6px] w-[6px] flex-none"
                  style={{ background: current === 'contact' ? '#CC0000' : '#2c2c2c' }}
                />
                Contact
              </ContactLink>
            </nav>
            <div className="px-5 pt-4">
              <Link
                href="/dealer"
                className="flex min-h-[50px] items-center justify-center gap-2.5 bg-rb-red text-[13.5px] font-semibold tracking-[1px] text-white"
              >
                Sell Your Vehicle
              </Link>
            </div>
          </div>,
          document.body,
        )}
    </header>
  );
}
