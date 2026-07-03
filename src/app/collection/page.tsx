import type { Metadata } from 'next';
import { SiteNav } from '@/components/site/SiteNav';
import { VisitAndFAQ } from '@/components/site/VisitAndFAQ';
import { SchemaScript } from '@/components/site/SchemaScript';
import { serviceSchema } from '@/lib/seo/schema';
import {
  CollectionExperience,
  type CollectionService,
} from '@/components/collection/CollectionExperience';

export const revalidate = 60;

// seo-map.md: /collection
export const metadata: Metadata = {
  title: 'Collection Management — Concierge & Maintenance | Red Box Motors',
  description:
    'Concierge, maintenance coordination, transport and track prep for collections in Austin, TX.',
};

// Approved services list from the prototype (config copy, not DB content).
// Verbatim — detailing/washing and servicing are coordinated, not performed.
const SERVICES: CollectionService[] = [
  { num: '01', title: 'Concierge', desc: 'Pickup, drop-off and the small errands — your car where you want it, when you want it.', tag: 'On request' },
  { num: '02', title: 'Maintenance & Servicing', desc: 'We schedule and oversee service with trusted shops, and stay ahead of what is due.', tag: 'Coordinated' },
  { num: '03', title: 'Battery & Fluids', desc: 'Regular battery tending and fluid checks so every car turns over ready to run.', tag: 'Hands-on' },
  { num: '04', title: 'Pre-Trip & Track Prep', desc: 'Inspected, fueled and set up before a road trip or a day at COTA.', tag: 'Hands-on' },
  { num: '05', title: 'Transport & Logistics', desc: 'Enclosed transport and coordination — across town or to the event.', tag: 'Arranged' },
  { num: '06', title: 'Detailing & Washing', desc: 'Booked and managed with our detailers, returned looking the way it should.', tag: 'Coordinated' },
];

export default function CollectionPage() {
  return (
    <>
      <SchemaScript schema={serviceSchema('Collection Management', 'Concierge, maintenance coordination, transport and track prep for collections in Austin, TX.', '/collection')} />
      <SiteNav current="collection" />
      <CollectionExperience
        services={SERVICES}
        visitAndFaq={<VisitAndFAQ division="collection" />}
      />
    </>
  );
}
