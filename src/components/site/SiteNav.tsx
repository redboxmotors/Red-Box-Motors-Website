'use client';

import Link from 'next/link';
import { useState } from 'react';
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
  const activeKey = ALIAS[current] ?? current;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 animate-rb-fade-up [animation-delay:150ms]">
      {/* legibility scrim over photo heroes */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[110px]"
        style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.34) 55%, rgba(0,0,0,0) 100%)' }}
      />

      <div className="relative flex items-center justify-between px-6 py-5 md:px-11">
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

        <nav
          className="pointer-events-auto flex flex-wrap items-start justify-end gap-x-4 gap-y-1 md:gap-x-6"
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
    </div>
  );
}
