'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePathname } from 'next/navigation';
import { ContactLink } from '@/components/contact/ContactModal';

// Fixed top nav — flat six links (owner 2026-07-08): Current Inventory,
// Sell Your Vehicle, Red Box Restoration, Recent Work, About, Contact. A top scrim
// keeps the links legible over photo heroes. Collection Management and
// sourcing are unpublished — keys stay in NavKey so hidden pages still
// compile, but no link renders. Pages still pass the old section keys
// ('dealer' / 'cosmetics'); ALIAS maps them onto the flat items.

type NavKey =
  | ''
  | 'dealer'
  | 'inventory'
  | 'sell'
  | 'cosmetics'
  | 'restoration'
  | 'work'
  | 'collection'
  | 'about'
  | 'contact';

// Old section keys → the flat nav item to highlight. ('dealer' no longer
// aliases to inventory — /dealer is the consignment page and highlights
// Sell Your Vehicle via current="sell"; each page passes its exact key.)
const ALIAS: Partial<Record<NavKey, NavKey>> = {
  cosmetics: 'restoration',
};

const LINKS: {
  key: Exclude<NavKey, '' | 'dealer' | 'cosmetics' | 'collection'>;
  label: string;
  href: string;
  children?: { label: string; desc?: string; href: string }[];
}[] = [
  { key: 'inventory', label: 'Current Inventory', href: '/dealer/inventory' },
  {
    key: 'sell',
    label: 'Sell Your Vehicle',
    href: '/dealer',
    children: [
      { label: 'Consignment', desc: 'Professional consignment representation', href: '/dealer' },
      { label: 'Sell Your Vehicle', desc: 'Submit your vehicle', href: '/dealer/sell' },
    ],
  },
  // Plain link, no dropdown (owner 2026-07-09) — the sticky jump menu on
  // /restoration covers per-service navigation.
  { key: 'restoration', label: 'Red Box Restoration', href: '/restoration' },
  { key: 'work', label: 'Recent Work', href: '/restoration/work' },
  { key: 'about', label: 'About', href: '/about' },
  { key: 'contact', label: 'Contact', href: '/contact' },
];


export function SiteNav({ current = '' }: { current?: NavKey }) {
  const [open, setOpen] = useState<NavKey>('');
  const [drawer, setDrawer] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const activeKey = ALIAS[current] ?? current;

  // The nav's root carries an entrance transform, which would make it the
  // containing block for the drawer's position:fixed (clipping it to the nav
  // bar). Portal the drawer to <body> so inset-0 covers the full viewport.
  useEffect(() => setMounted(true), []);

  // drawer closes on route change and locks background scroll while open
  useEffect(() => setDrawer(false), [pathname]);
  useEffect(() => {
    if (!drawer) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setDrawer(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [drawer]);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 animate-rb-fade-up [animation-delay:150ms]">
      {/* legibility scrim over photo heroes */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[110px]"
        style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.34) 55%, rgba(0,0,0,0) 100%)' }}
      />

      <div
        className="relative flex items-center justify-between px-5 py-4 md:px-11 md:py-5"
        style={{ paddingTop: 'max(env(safe-area-inset-top), 1rem)' }}
      >
        <Link href="/" className="pointer-events-auto inline-flex items-center gap-3.5" aria-label="Red Box Motors, home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/brand/rbm-logo-header.png"
            alt=""
            className="h-[34px] w-[34px] flex-none"
            style={{ filter: 'drop-shadow(0 1px 6px rgba(0,0,0,0.5))' }}
          />
          <span className="hidden whitespace-nowrap text-[12px] font-bold tracking-[3px] text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.6)] lg:inline">
            RED BOX MOTORS
          </span>
        </Link>

        {/* mobile: hamburger (desktop links are hidden below md) */}
        <button
          type="button"
          aria-label={drawer ? 'Close menu' : 'Open menu'}
          aria-expanded={drawer}
          onClick={() => setDrawer((d) => !d)}
          className="pointer-events-auto relative z-[70] flex h-12 w-12 items-center justify-center md:hidden"
        >
          <span className="relative block h-[14px] w-[22px]">
            <span
              className="absolute left-0 top-0 h-[2px] w-full bg-white transition-transform duration-200"
              style={{ transform: drawer ? 'translateY(6px) rotate(45deg)' : 'none' }}
            />
            <span
              className="absolute left-0 top-[6px] h-[2px] w-full bg-white transition-opacity duration-200"
              style={{ opacity: drawer ? 0 : 1 }}
            />
            <span
              className="absolute left-0 top-[12px] h-[2px] w-full bg-white transition-transform duration-200"
              style={{ transform: drawer ? 'translateY(-6px) rotate(-45deg)' : 'none' }}
            />
          </span>
        </button>

        <nav
          className="pointer-events-auto hidden flex-wrap items-start justify-end gap-x-4 gap-y-1 md:flex md:gap-x-6"
          aria-label="Site"
        >
          {LINKS.map((link) => {
            const active = link.key === activeKey;
            const isOpen = open === link.key;
            return (
              <div
                key={link.key}
                className="relative"
                onMouseEnter={() => setOpen(link.key)}
                onMouseLeave={() => setOpen((o) => (o === link.key ? '' : o))}
                onFocus={() => setOpen(link.key)}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen((o) => (o === link.key ? '' : o));
                }}
              >
                {(() => {
                  const cls = `inline-flex items-center gap-2 text-[12.5px] font-medium tracking-[1.5px] transition-colors duration-150 [text-shadow:0_1px_6px_rgba(0,0,0,0.65)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rb-red ${
                    active || isOpen ? 'text-white' : 'text-[#d6d6d6] hover:text-white'
                  }`;
                  const inner = (
                    <>
                      <span
                        className="h-[5px] w-[5px] flex-none"
                        style={{ background: active ? '#CC0000' : 'transparent' }}
                      />
                      <span className="relative inline-block pb-[3px]">
                        {link.label}
                        <span data-nav-bar />
                      </span>
                    </>
                  );
                  // Contact opens the global modal instead of navigating.
                  return link.key === 'contact' ? (
                    <ContactLink data-nav-u data-active={active ? '1' : '0'} className={cls}>
                      {inner}
                    </ContactLink>
                  ) : (
                    <Link
                      data-nav-u
                      data-active={active ? '1' : '0'}
                      href={link.href}
                      aria-current={active ? 'page' : undefined}
                      className={cls}
                    >
                      {inner}
                    </Link>
                  );
                })()}

                {link.children && (
                  <div
                    className="absolute left-[-13px] top-full pt-4 transition-all duration-[220ms] ease-rb"
                    style={{
                      opacity: isOpen ? 1 : 0,
                      transform: isOpen ? 'translateY(0)' : 'translateY(6px)',
                      visibility: isOpen ? 'visible' : 'hidden',
                      pointerEvents: isOpen ? 'auto' : 'none',
                    }}
                  >
                    <div className="min-w-[236px] bg-rb-surface p-2 shadow-[0_24px_60px_rgba(0,0,0,0.7)]">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="flex items-center gap-3 px-[13px] py-[11px] transition-colors duration-200 hover:bg-rb-raised-3"
                        >
                          <span className="h-[5px] w-[5px] flex-none bg-rb-red" />
                          <span className="flex flex-col gap-0.5">
                            <span className="text-[12.5px] font-medium tracking-[0.4px] text-white">
                              {child.label}
                            </span>
                            {child.desc && (
                              <span className="text-[10.5px] tracking-[0.6px] text-rb-tx-mute-3">
                                {child.desc}
                              </span>
                            )}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* ——— mobile drawer (portaled to <body> so it escapes the nav's
          entrance transform and covers the full viewport) ——— */}
      {mounted &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="rb-drawer pointer-events-auto fixed inset-0 z-[60] flex flex-col bg-[#070707]/[0.985] transition-[opacity,visibility,transform] duration-300 ease-rb md:hidden"
        style={{
          opacity: drawer ? 1 : 0,
          visibility: drawer ? 'visible' : 'hidden',
          transform: drawer ? 'none' : 'translateY(-10px)',
          paddingTop: 'max(env(safe-area-inset-top), 12px)',
          paddingBottom: 'max(env(safe-area-inset-bottom), 20px)',
        }}
      >
        <div className="flex items-center px-5 py-2">
          <Link href="/" className="inline-flex items-center gap-3" onClick={() => setDrawer(false)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/brand/rbm-logo-header.png" alt="" className="h-[30px] w-[30px]" />
            <span className="text-[12px] font-bold tracking-[3px] text-white">RED BOX MOTORS</span>
          </Link>
        </div>
        <nav aria-label="Site, mobile" className="mt-2 flex-1 overflow-y-auto px-5">
          {LINKS.map((link) => {
            const active = link.key === activeKey;
            const rowCls =
              'flex min-h-[52px] items-center gap-3.5 border-b border-rb-line py-3 text-[17px] font-medium tracking-[0.6px]';
            const dot = (
              <span className="h-[6px] w-[6px] flex-none" style={{ background: active ? '#CC0000' : '#2c2c2c' }} />
            );
            if (link.key === 'contact') {
              return (
                <ContactLink key={link.key} className={`${rowCls} w-full text-left ${active ? 'text-white' : 'text-[#d6d6d6]'}`}>
                  {dot}
                  {link.label}
                </ContactLink>
              );
            }
            return (
              <div key={link.key}>
                <Link
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={`${rowCls} ${active ? 'text-white' : 'text-[#d6d6d6]'}`}
                >
                  {dot}
                  {link.label}
                </Link>
                {link.children && (
                  <div className="border-b border-rb-line py-1">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="flex min-h-[48px] items-center gap-3 py-2 pl-[22px] text-[14.5px] tracking-[0.4px] text-rb-tx-mute"
                      >
                        <span className="h-[5px] w-[5px] flex-none bg-rb-red" />
                        <span className="flex flex-col">
                          <span className="text-white">{child.label}</span>
                          {child.desc && <span className="text-[11.5px] text-rb-tx-mute-3">{child.desc}</span>}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        <div className="px-5 pt-4">
          <Link
            href="/dealer"
            className="rb-btn-red flex min-h-[50px] items-center justify-center gap-2.5 bg-rb-red text-[13.5px] font-semibold tracking-[1px] text-white"
          >
            Sell Your Vehicle
          </Link>
        </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
