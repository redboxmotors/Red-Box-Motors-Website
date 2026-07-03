// ============================================================
// Red Box Motors — Tailwind config snippet (theme extension)
// Drop into tailwind.config.{js,ts} `theme.extend`. Mirrors
// handoff/design-tokens.css. Use alongside a global import of
// the Archivo font (weights 300/400/500/600).
// ============================================================

/** @type {import('tailwindcss').Config['theme']['extend']} */
const rbTheme = {
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
      'tx': '#FFFFFF',
      'tx-2': '#DCDCDC',
      'tx-3': '#CCCCCC',
      'tx-mute': '#888888',
      'tx-faint': '#666666',
      'tx-ghost': '#3A3A3A',
    },
  },
  fontFamily: {
    sans: ['Archivo', 'system-ui', 'sans-serif'],
    mono: ['ui-monospace', 'SF Mono', 'Menlo', 'monospace'],
  },
  fontWeight: {
    // bold/thick direction — body sits at medium, headings 600, labels 700
    light: '300', normal: '400', medium: '500', semibold: '600', bold: '700',
  },
  letterSpacing: {
    tightest: '-0.035em',
    tighter: '-0.03em',
    tight: '-0.02em',
    label: '0.18em',   // ~2-3px on small uppercase labels
    wide: '0.1em',
  },
  borderRadius: {
    // sharp edges — intentionally none beyond 0
    none: '0px',
  },
  transitionTimingFunction: {
    rb: 'cubic-bezier(.2,.8,.2,1)',
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
    fadeUp: { '0%': { opacity: '0', transform: 'translateY(16px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
    panelIn: { '0%': { opacity: '0', transform: 'scale(.985)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
  },
  animation: {
    'rb-fade-up': 'fadeUp 500ms cubic-bezier(.2,.8,.2,1) both',
    'rb-panel-in': 'panelIn 500ms ease both',
  },
};

module.exports = { rbTheme };

// Example component classes built from the above:
//   Tile:   "group relative bg-rb-surface overflow-hidden transition
//            duration-tile ease-rb hover:-translate-y-1.5 hover:scale-[1.03]
//            hover:brightness-110 hover:shadow-rb-hover hover:z-[5]"
//   Red CTA: "bg-rb-red text-rb-tx px-7 py-4 transition duration-btn ease-rb
//            hover:-translate-y-0.5 hover:shadow-rb-btn-red active:scale-95"
//   Ghost CTA: "border border-rb-border text-rb-tx px-5 py-3 transition
//            duration-btn ease-rb hover:-translate-y-0.5 hover:bg-rb-raised-3
//            hover:shadow-rb-btn active:scale-95"
