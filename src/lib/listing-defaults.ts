import type { ListingFaqItem } from '@/lib/db/types';

// Site-default listing FAQ (owner brief 2026-07-08) — rendered on listing
// pages whose listing_faq is null; the admin editor can load these as a
// starting point for per-listing customization. Setting listing_faq to []
// hides the section entirely.
export const DEFAULT_LISTING_FAQ: ListingFaqItem[] = [
  { q: 'Can I schedule a private viewing?', a: 'Yes, visits are by appointment at our Austin facility. Use the inquiry form or call us to set a time.' },
  { q: 'Is additional documentation available?', a: 'Request available documentation through the inquiry form and we will share what exists for this vehicle.' },
  { q: 'Can a third-party inspection be arranged?', a: 'Yes, we accommodate independent pre-purchase inspections and can help coordinate one locally.' },
  { q: 'Can enclosed transportation be coordinated?', a: 'Yes. Enclosed, insured door-to-door transport can be coordinated nationwide.' },
  { q: 'Can Red Box complete PPF or ceramic coating before delivery?', a: 'Yes, Red Box Restoration can protect and prepare the vehicle before delivery. Ask about pre-delivery options in your inquiry.' },
  { q: 'How do I begin the purchase process?', a: 'Send an inquiry through the form or call us, a member of the team will walk you through next steps, documents and payment.' },
];

// Suggested Condition & Inspection topics (shown as hints in the admin —
// only owner-verified items get written and published).
export const CONDITION_TOPIC_SUGGESTIONS = [
  'Cosmetic notes',
  'Paintwork history',
  'Accident history',
  'PPF status',
  'Tires',
  'Recent service',
  'Battery / hybrid system',
  'Inspection availability',
];
