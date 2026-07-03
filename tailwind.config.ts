import type { Config } from 'tailwindcss';

// Theme seeded from handoff/design-tokens.tailwind.js — the literal values
// used across the approved *.dc.html prototypes. Don't "clean up" numbers.
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        rb: {
          black: '#000000',
          bg: '#050505',
          surface: '#0A0A0A',
          'surface-2': '#0C0C0C',
          'surface-3': '#0D0D0D',
          'surface-4': '#0E0E0E',
          raised: '#111111',
          'raised-2': '#131313',
          'raised-3': '#161616',
          line: '#1A1A1A',
          'line-2': '#1C1C1C',
          border: '#222222',
          'border-2': '#2A2A2A',
          'border-3': '#333333',
          red: '#CC0000',
          // text scale
          tx: '#FFFFFF',
          'tx-2': '#DCDCDC',
          'tx-3': '#CCCCCC',
          'tx-mute': '#AAAAAA',
          'tx-mute-2': '#888888',
          'tx-mute-3': '#777777',
          'tx-faint': '#666666',
          'tx-faint-2': '#555555',
          'tx-ghost': '#3A3A3A',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SF Mono', 'Menlo', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.035em',
        tighter: '-0.03em',
        tight: '-0.02em',
        label: '0.18em', // ~2-3px on small uppercase labels
        wide: '0.1em',
      },
      borderRadius: {
        // sharp edges — intentionally none beyond 0
        none: '0px',
      },
      transitionTimingFunction: {
        rb: 'cubic-bezier(.2,.8,.2,1)', // the one curve
      },
      transitionDuration: {
        tile: '240ms',
        btn: '220ms',
        enter: '500ms',
      },
      boxShadow: {
        'rb-card': '0 30px 70px rgba(0,0,0,.55), 0 8px 24px rgba(0,0,0,.45)',
        'rb-card-lg': '0 40px 90px rgba(0,0,0,.60), 0 12px 32px rgba(0,0,0,.45)',
        'rb-box': '0 18px 44px rgba(0,0,0,.55), 0 6px 16px rgba(0,0,0,.45)',
        'rb-hover': '0 22px 44px rgba(0,0,0,.62), 0 8px 18px rgba(0,0,0,.50)',
        'rb-btn': '0 12px 26px rgba(0,0,0,.50)',
        'rb-btn-red': '0 16px 34px rgba(204,0,0,.36)',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        panelIn: {
          '0%': { opacity: '0', transform: 'scale(.985)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        // opacity-only fade (e.g. modal backdrop — must cover the full viewport
        // the entire time, so it can't translate like fadeUp does)
        fade: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        // Feature Bar marquee — list is rendered twice, loop = half width
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'rb-fade-up': 'fadeUp 500ms cubic-bezier(.2,.8,.2,1) both',
        'rb-fade': 'fade 240ms ease both',
        'rb-panel-in': 'panelIn 500ms ease both',
        'rb-marquee': 'marquee 52s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
