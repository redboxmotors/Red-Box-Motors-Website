'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ContactLink } from '@/components/contact/ContactModal';

// Fixed top nav (Site Nav.dc.html). `current` highlights the active section;
// Dealer + Cosmetics carry hover dropdown panels.

type NavKey = '' | 'dealer' | 'cosmetics' | 'collection' | 'about' | 'contact';

const LINKS: {
  key: Exclude<NavKey, ''>;
  label: string;
  href: string;
  children?: { label: string; desc: string; href: string }[];
}[] = [
  {
    key: 'dealer',
    label: 'Dealer',
    href: '/dealer',
    children: [
      { label: 'Inventory', desc: 'Cars currently for sale', href: '/dealer/inventory' },
      { label: 'Sold', desc: 'Cars we’ve sold', href: '/dealer/sold' },
      { label: 'Sourced', desc: 'Cars we found for clients', href: '/dealer/sourced' },
    ],
  },
  {
    key: 'cosmetics',
    label: 'Cosmetics',
    href: '/cosmetics',
    children: [
      { label: 'Recent Work', desc: 'Project gallery', href: '/cosmetics/work' },
      { label: 'Paint Protection Film', desc: 'STEK PPF', href: '/cosmetics/ppf' },
      { label: 'Ceramic & Correction', desc: 'Coatings & polish', href: '/cosmetics/ceramic-correction' },
      { label: 'Vinyl', desc: 'Wraps & color change', href: '/cosmetics/vinyl' },
      { label: 'Wheels', desc: 'Refinish & powder coat', href: '/cosmetics/wheels' },
      { label: 'Custom Builds', desc: 'Bespoke transformations', href: '/cosmetics/custom-builds' },
    ],
  },
  { key: 'collection', label: 'Collection', href: '/collection' },
  { key: 'about', label: 'About', href: '/about' },
  { key: 'contact', label: 'Contact', href: '/contact' },
];

export function SiteNav({ current = '' }: { current?: NavKey }) {
  const [open, setOpen] = useState<NavKey>('');

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex animate-rb-fade-up items-center justify-between px-6 py-5 md:px-11 [animation-delay:150ms]">
      <Link
        href="/"
        className="rb-btn-red pointer-events-auto inline-flex items-center bg-rb-red px-[11px] py-[7px]"
      >
        <span className="whitespace-nowrap text-[11px] font-bold tracking-[2.5px] text-white">
          RED BOX MOTORS
        </span>
      </Link>

      <nav className="pointer-events-auto flex items-start gap-6" aria-label="Site">
        {LINKS.map((link) => {
          const active = link.key === current;
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
                const cls = `inline-flex items-center gap-2 text-[12px] tracking-[1.5px] ${
                  active || isOpen ? 'text-white' : 'text-[#9a9a9a]'
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
                          <span className="text-[10.5px] tracking-[0.6px] text-rb-tx-mute-3">
                            {child.desc}
                          </span>
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
  );
}
