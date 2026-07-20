import type { Faq } from '@/components/site/FaqAccordion';

// Restoration service questions — shared by /restoration and the mobile
// Recent Work / Work Detail screens (design_handoff: same four questions on
// every restoration-side page). Owner copy, verbatim.
export const RESTORATION_FAQ: Faq[] = [
  { q: 'How do I get an estimate?', a: 'Use the estimate form, tell us the vehicle and what you want to protect or change, and we will walk you through options and put together a written estimate. Photos help; an in-person look is even better.' },
  { q: 'What PPF coverage do you offer?', a: 'From high-impact front-end packages to full-body coverage, precision-cut per panel with wrapped edges wherever possible, using premium self-healing films with manufacturer warranty coverage.' },
  { q: 'Does ceramic coating require paint correction?', a: 'Coatings lock in whatever is under them, so where needed we correct the paint to the agreed level first, that is what gives the finish its depth.' },
  { q: 'Are vinyl wraps reversible?', a: 'When installed over suitable paint and removed using proper techniques, vinyl provides a reversible appearance change. Paint condition and prior repairs can affect removal, we assess that before the work starts.' },
];
