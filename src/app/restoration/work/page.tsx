import type { Metadata } from 'next';
import Link from 'next/link';
import { ContactLink } from '@/components/contact/ContactModal';
import { RandomBackdrop } from '@/components/site/RandomBackdrop';
import { WorkGallery, type WorkItem } from '@/components/cosmetics/WorkGallery';
import { ExpandingScrollBox } from '@/components/site/ExpandingScrollBox';
import { SiteNav } from '@/components/site/SiteNav';
import { getHeroImages, getProjects, heroFor } from '@/lib/public/content';
import type { Project } from '@/lib/db/types';
import { SchemaScript } from '@/components/site/SchemaScript';
import { collectionPageSchema } from '@/lib/seo/schema';

// Recent Work.dc.html → /cosmetics/work — mini photo header + filterable
// 3-across gallery of cosmetics projects + rich CTA + Visit & FAQ, all inside
// the expanding scroll box over a random blurred background.

export const revalidate = 60;

export const metadata: Metadata = {
  alternates: { canonical: '/restoration/work' },
  title: { absolute: 'Recent Work — Red Box Restoration | Red Box Motors' },
  description:
    'Recent paint protection film, ceramic coating, paint correction, wrap and wheel projects from Red Box Restoration, Austin, TX.',
};

// Placeholder-art label until a photo lands ("[ gt3 rs · ppf ]" style).
function tagFor(p: Project): string {
  const model = p.make ? p.vehicle.replace(p.make, '').trim() : p.vehicle;
  return `${model || p.vehicle} · ${p.category}`.toLowerCase();
}

export default async function RecentWorkPage() {
  const projects = await getProjects();
  const heroes = await getHeroImages(projects.map((p) => ({ type: 'project' as const, id: p.id })));

  const items: WorkItem[] = projects.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    vehicle: p.vehicle,
    category: p.category,
    year: p.year,
    tag: tagFor(p),
    metaLine: [p.finish, p.coverage].filter(Boolean).join(' · '),
    specLine: [...p.services, p.duration].filter(Boolean).join(' · '),
    image: heroFor(heroes, 'project', p.id),
  }));

  return (
    <main className="relative bg-rb-bg text-white">
      <SchemaScript schema={collectionPageSchema('Recent Work', 'Recent paint protection film, ceramic coating, paint correction, wrap and wheel projects from Red Box Restoration, Austin, TX.', '/restoration/work')} />
      <RandomBackdrop />
      <SiteNav current="work" />

      <div
        className="rb-noscrollbar relative z-[1] h-screen overflow-y-auto bg-transparent"
        style={{ scrollSnapType: 'y proximity' }}
      >
        <ExpandingScrollBox>
          <h1 className="sr-only">Recent Work</h1>

          {/* PHOTO HEADER */}
          <div className="relative h-[400px] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/tell-us-car.jpg"
              alt="Recent work by Red Box Motors, Austin TX"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: 'center 54%' }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.10)_0%,rgba(10,10,10,0.04)_40%,rgba(10,10,10,0.55)_74%,rgba(10,10,10,0.92)_92%,#0A0A0A_100%)]" />
            <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-6 px-6 pb-[34px] md:px-12">
              <div>
                <div className="mb-4 font-mono text-[11px] uppercase tracking-[4px] text-rb-red">
                  — Red Box Restoration · Recent Work
                </div>
                <div
                  className="font-bold text-white"
                  style={{ fontSize: 'clamp(36px,4.8vw,66px)', letterSpacing: '-0.04em', lineHeight: 0.96 }}
                >
                  Protection. Correction. Transformation.
                </div>
                <p
                  className="m-0 mt-[18px] max-w-[640px] text-[15px] leading-[1.6] tracking-[0.2px] text-[#c4c4c4]"
                  style={{ textShadow: '0 1px 20px rgba(0,0,0,0.7)' }}
                >
                  Every project here came through our Austin shop — paint protection, ceramic,
                  correction, wraps and wheels. Documented panel by panel so you
                  can judge the standard before you drop a car off.
                </p>
              </div>
              <Link
                href="/restoration"
                className="inline-flex items-center gap-[9px] whitespace-nowrap text-[12.5px] tracking-[1.5px] text-rb-tx-mute transition-colors duration-150 hover:text-white"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.3" />
                </svg>
                Restoration overview
              </Link>
            </div>
          </div>

          {/* TOOLBAR + ROSTER GRID */}
          <WorkGallery items={items} />

          {/* CTA SECTION (rich) */}
          <div
            className="mt-14 border-t border-rb-raised-3"
            style={{ background: '#101010', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)' }}
          >
            <div className="flex flex-wrap items-stretch">
              <div className="relative min-h-[480px] min-w-[300px] flex-[1.05] overflow-hidden md:min-h-[620px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/placeholders/detail-bay.jpg"
                  alt="Start a project with Red Box Motors"
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ objectPosition: 'center 54%' }}
                />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(16,16,16,0.15)_0%,rgba(16,16,16,0.5)_60%,rgba(16,16,16,0.95)_100%)]" />
                <div className="absolute bottom-0 left-0 px-7 py-6">
                  <div className="font-mono text-[11px] uppercase tracking-[3px] text-[#cfcfcf]">
                    STEK · Carbon Collective · Austin, TX
                  </div>
                </div>
              </div>
              <div className="flex min-w-[320px] flex-1 flex-col justify-center px-6 py-20 md:px-16 md:py-[100px]">
                <div className="mb-[22px] font-mono text-[11px] uppercase tracking-[4px] text-rb-red">
                  — Start a project
                </div>
                <h2
                  className="m-0 max-w-[15ch] font-extrabold text-white"
                  style={{ fontSize: 'clamp(38px,5vw,72px)', letterSpacing: '-0.04em', lineHeight: 0.96 }}
                >
                  Bring us the car.
                </h2>
                <p className="m-0 mt-7 max-w-[500px] text-[16.5px] font-medium leading-[1.7] text-rb-tx-mute">
                  Tell us what you&rsquo;re protecting or transforming — paint protection, ceramic,
                  correction, wrap, wheels or specialty work. We&rsquo;ll walk you through the
                  right approach for your car and handle it under one roof in Austin.
                </p>

                <div className="mt-[30px] grid grid-cols-1 gap-0.5 bg-rb-raised-3 sm:grid-cols-2">
                  {[
                    { h: 'Protection', d: 'STEK self-healing PPF — front-end to full-body coverage.' },
                    { h: 'Finish', d: 'Carbon Collective ceramics over a proper paint correction.' },
                    { h: 'Transformation', d: 'Color-change wraps, wheel refinishing and custom finishes.' },
                    { h: 'Specialty', d: 'Wheels, tint, detailing and one-off specialty projects.' },
                  ].map((cell) => (
                    <div key={cell.h} className="bg-rb-surface px-[22px] py-5">
                      <div className="mb-1.5 text-[13px] font-bold tracking-[0.3px] text-white">
                        {cell.h}
                      </div>
                      <div className="text-[12.5px] leading-[1.5] text-rb-tx-mute-2">{cell.d}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-10 flex flex-wrap items-center gap-[22px]">
                  <Link
                    href="/restoration/estimate"
                    className="rb-btn-red inline-flex items-center gap-3.5 bg-rb-red px-9 py-5 text-[15px] font-semibold tracking-[0.5px] text-white"
                  >
                    Request an Estimate
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <path d="M4 12L12 4M12 4H5.2M12 4V10.8" stroke="#fff" strokeWidth="1.5" />
                    </svg>
                  </Link>
                  <Link
                    href="/restoration"
                    className="text-[13px] tracking-[1.5px] text-rb-tx-mute transition-colors duration-150 hover:text-white"
                  >
                    Explore Restoration →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Visit & FAQ removed per owner checklist — "Bring us the car"
              is the final section on this page. */}
        </ExpandingScrollBox>
      </div>

      {/* floating contact */}
      <ContactLink
        className="fixed bottom-[26px] right-[26px] z-40 flex items-center gap-[11px] border border-rb-border-2 bg-rb-surface px-[18px] py-[13px] transition-[border-color,background,transform,box-shadow] duration-btn ease-rb hover:-translate-y-[3px] hover:border-[#555] hover:bg-rb-raised hover:shadow-[0_14px_30px_rgba(0,0,0,0.55)] active:translate-y-0 active:scale-[0.98] motion-reduce:transform-none motion-reduce:transition-none"
      >
        <span className="h-[7px] w-[7px] flex-none bg-rb-red" />
        <span className="text-[12px] tracking-[1.5px] text-white">Contact</span>
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M4 12L12 4M12 4H5.2M12 4V10.8" stroke="#888" strokeWidth="1.3" />
        </svg>
      </ContactLink>
    </main>
  );
}
