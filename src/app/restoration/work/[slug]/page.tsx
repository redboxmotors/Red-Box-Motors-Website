import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ContactLink } from '@/components/contact/ContactModal';
import { RandomBackdrop } from '@/components/site/RandomBackdrop';
import { SiteNav } from '@/components/site/SiteNav';
import { VisitAndFAQ } from '@/components/site/VisitAndFAQ';
import { focalPosition, getImagesFor, getProjectBySlug, getSettings } from '@/lib/public/content';
import type { DbImage, Project } from '@/lib/db/types';
import { SchemaScript } from '@/components/site/SchemaScript';
import { projectArticleSchema } from '@/lib/seo/schema';
import { MobileShell } from '@/components/mobile/MobileShell';
import { MobileFooter } from '@/components/mobile/MobileFooter';
import { QuestionsLocation } from '@/components/mobile/QuestionsLocation';
import { MGallery, type MGalleryImage } from '@/components/mobile/MGallery';
import { RESTORATION_FAQ } from '@/components/restoration/faq';
import { ED, MArrow, mBtnRedCls } from '@/components/mobile/ui';

// Project Detail.dc.html → /cosmetics/work/[slug] — social-post-style project
// page: author row, headline, photo collage, action bar, narrative + details,
// wide closing shot and the keyword-rich "About this build" story.

export const revalidate = 60;

const pad2 = (x: number) => String(x).padStart(2, '0');
const lc = (s: string) => String(s).toLowerCase();

// Placeholder-art label until photos land ("[ gt3 rs · ppf ]" style).
function tagFor(p: Project): string {
  const model = p.make ? p.vehicle.replace(p.make, '').trim() : p.vehicle;
  return `${model || p.vehicle} · ${p.category}`.toLowerCase();
}

// Long-form, keyword-rich copy built from real fields (no invented claims).
function storyParas(p: Project): string[] {
  const location = p.location ?? 'Austin, TX';
  const opener = `${p.title} is a ${p.vehicle} ${lc(p.category)} project completed by Red Box Motors in ${location}.`;
  const first = p.summary ? `${opener} ${p.summary}` : opener;

  const close = `Book ${lc(p.category)} and other cosmetic work at Red Box Motors in Austin, Texas.`;
  let second: string;
  if (p.year != null && p.coverage && p.finish && p.duration && p.services.length > 0) {
    // All fields present → the prototype's exact sentence shape.
    second = `Finished in ${p.year}, the work covered ${lc(p.coverage)} with a ${lc(p.finish)} finish over ${p.duration}, and included ${p.services.map(lc).join(', ')}. ${close}`;
  } else {
    const bits: string[] = [];
    if (p.coverage) bits.push(`covered ${lc(p.coverage)}`);
    if (p.finish) bits.push(`carried a ${lc(p.finish)} finish`);
    if (p.duration) bits.push(`ran ${p.duration}`);
    if (p.services.length > 0) bits.push(`included ${p.services.map(lc).join(', ')}`);
    if (bits.length > 0) {
      const lead = p.year != null ? `Finished in ${p.year}, the work` : 'The work';
      const joined =
        bits.length > 1 ? `${bits.slice(0, -1).join(', ')} and ${bits[bits.length - 1]}` : bits[0];
      second = `${lead} ${joined}. ${close}`;
    } else {
      second = close;
    }
  }
  return [first, second];
}

// Hashtags: real, descriptive, SEO-friendly — services + service line + car + city.
function hashtagsFor(p: Project): string[] {
  const raw = [...p.services, p.category, p.vehicle, p.location ?? ''];
  const seen = new Set<string>();
  const tags: string[] = [];
  for (const r of raw) {
    const t = `#${r.replace(/[^A-Za-z0-9]/g, '')}`;
    const k = t.toLowerCase();
    if (t.length > 1 && !seen.has(k)) {
      seen.add(k);
      tags.push(t);
    }
  }
  return tags;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const p = await getProjectBySlug(params.slug);
  if (!p) return {};
  const summary = (p.summary ?? '').trim();
  const trimmed = summary.length > 155 ? `${summary.slice(0, 152).trimEnd()}…` : summary;
  const description = [trimmed, `${p.category} on a ${p.vehicle} in Austin, TX.`]
    .filter(Boolean)
    .join(' ');
  const images = await getImagesFor('project', p.id);
  return {
    title: { absolute: `${p.title}, ${p.vehicle} | Red Box Motors` },
    description,
    alternates: { canonical: `/restoration/work/${p.slug}` },
    openGraph: {
      title: `${p.title}, ${p.vehicle}`,
      description,
      type: 'article',
      url: `/restoration/work/${p.slug}`,
      ...(images[0] ? { images: [images[0].url] } : {}),
    },
  };
}

const heroCellCls =
  'relative overflow-hidden cursor-pointer hover:z-[5] hover:-translate-y-[5px] hover:scale-[1.02] hover:shadow-[0_24px_48px_rgba(0,0,0,0.6)] hover:brightness-[1.08] active:translate-y-0 active:scale-[0.99] motion-reduce:transform-none motion-reduce:transition-none [transition:transform_240ms_cubic-bezier(.2,.8,.2,1),box-shadow_240ms_cubic-bezier(.2,.8,.2,1),filter_240ms_ease]';
const sideCellCls =
  'relative overflow-hidden cursor-pointer hover:z-[5] hover:-translate-y-[4px] hover:scale-[1.04] hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] hover:brightness-[1.1] active:translate-y-0 active:scale-[0.99] motion-reduce:transform-none motion-reduce:transition-none [transition:transform_240ms_cubic-bezier(.2,.8,.2,1),box-shadow_240ms_cubic-bezier(.2,.8,.2,1),filter_240ms_ease]';
const stripeStyle = {
  backgroundImage:
    'repeating-linear-gradient(135deg,#171717 0,#171717 11px,#101010 11px,#101010 22px)',
};

// Vertical (portrait) uploads carry width/height since the 2026-07-13 patch;
// older rows have none and are treated as landscape.
function isPortrait(img: DbImage | null | undefined) {
  return !!img && img.width != null && img.height != null && img.height > img.width;
}

function CollagePhoto({ image, alt }: { image: DbImage; alt: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={image.url}
      alt={image.alt || alt}
      className="absolute inset-0 h-full w-full object-cover"
      style={{ objectPosition: focalPosition(image) }}
      loading="lazy"
    />
  );
}

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const p = await getProjectBySlug(params.slug);
  if (!p) notFound();

  const images = await getImagesFor('project', p.id);
  const n = images.length;
  const tag = tagFor(p);
  const hashtags = hashtagsFor(p);
  const paras = storyParas(p);
  const sideShots = Array.from({ length: 4 }, (_, i) => images[i + 1] ?? null);
  // The closing band is a 21:8 panorama — a vertical photo would lose almost
  // everything to the crop, so prefer the first unused landscape shot.
  const wideShot = images.slice(5).find((i) => !isPortrait(i)) ?? images[5] ?? null;
  const heroPortrait = isPortrait(images[0]);

  const facts = [
    { label: 'Finish', value: p.finish },
    { label: 'Coverage', value: p.coverage },
    { label: 'Duration', value: p.duration },
    { label: 'Completed', value: p.year != null ? String(p.year) : null },
  ].filter((f): f is { label: string; value: string } => Boolean(f.value));

  const settings = await getSettings();
  const galleryImages: MGalleryImage[] = images.map((img, i) => ({
    url: img.url,
    alt: img.alt || `${p.title}, photo ${i + 1}`,
    position: focalPosition(img),
    thumb: img.thumb_url,
  }));
  const detailShot = wideShot ?? images[1] ?? null;
  const location = (p.location ?? 'Austin, TX').toUpperCase();

  return (
    <>
      <SchemaScript schema={projectArticleSchema(p, images.map((img) => img.url))} />

      {/* ===== MOBILE (design_handoff Work Detail Mobile) ===== */}
      <MobileShell current="work">
        {/* Back + post meta */}
        <section className="flex flex-col gap-5 px-5 pt-3.5">
          <Link
            href="/restoration/work"
            className="flex items-center gap-2 py-2 font-plex text-[10px] tracking-[0.25em]"
            style={{ color: ED(0.55) }}
          >
            <span className="text-rb-red" aria-hidden>
              ←
            </span>{' '}
            ALL WORK
          </Link>
          <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] pb-[18px]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-none items-center justify-center bg-rb-red font-plex text-[10px] font-medium tracking-[0.1em] text-white">
                RBM
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <div className="text-[14px] font-bold text-white">Red Box Motors</div>
                  <div className="h-1.5 w-1.5 bg-rb-red" />
                </div>
                <div className="text-[12px]" style={{ color: ED(0.5) }}>
                  @redboxmotors · Red Box Restoration
                </div>
              </div>
            </div>
            <div className="font-plex text-[9px] tracking-[0.15em]" style={{ color: ED(0.45) }}>
              {location}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <h1
              className="m-0 text-[34px] font-extrabold tracking-tight text-white"
              style={{ lineHeight: 1.06 }}
            >
              {p.title}
            </h1>
            <div className="text-[14px]" style={{ color: ED(0.55) }}>
              {p.vehicle} · {p.category}
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section className="flex flex-col gap-2.5 px-5 pt-5">
          <MGallery
            images={galleryImages}
            chip={p.category.toUpperCase()}
            placeholderTag={tag}
          />
          {hashtags.length > 0 && (
            <div className="flex flex-wrap gap-3 pt-2.5">
              {hashtags.map((t) => (
                <Link
                  key={t}
                  href="/restoration/work"
                  className="font-plex text-[11px] tracking-[0.06em]"
                  style={{ color: ED(0.5) }}
                >
                  {t}
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Want this for your car? */}
        <section className="px-5 pt-6">
          <div className="flex flex-col gap-3 border border-white/[0.08] bg-[#151515] px-5 py-6">
            <div className="text-[19px] font-bold text-white">Want this for your car?</div>
            <div className="text-[14px] leading-[1.6]" style={{ color: ED(0.65) }}>
              Tell us what you have in mind — we will scope it and quote it.
            </div>
            <Link href="/restoration/estimate" className={`${mBtnRedCls} mt-1.5`}>
              <span>Request an Estimate</span>
              <MArrow />
            </Link>
          </div>
        </section>

        {/* About this build */}
        <section className="flex flex-col gap-4 px-5 pb-12 pt-9">
          {detailShot && (
            <div className="relative h-[220px] w-full overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={detailShot.url}
                alt={detailShot.alt || `${p.title}, detail`}
                className="absolute inset-0 h-full w-full object-cover"
                style={{ objectPosition: focalPosition(detailShot) }}
                loading="lazy"
              />
            </div>
          )}
          <div className="mt-2 font-plex text-[10px] tracking-[0.3em] text-rb-red">
            ABOUT THIS BUILD
          </div>
          {paras.map((para) => (
            <p
              key={para.slice(0, 40)}
              className="m-0 text-[14px] leading-[1.7]"
              style={{ color: ED(0.72) }}
            >
              {para}
            </p>
          ))}
          <Link
            href="/restoration/work"
            className="mt-2 flex items-center justify-center gap-2.5 border border-white/20 px-5 py-[15px] text-[14px] font-bold text-[#EDEDED] transition-colors duration-150 hover:border-rb-red hover:text-white"
          >
            See more work <MArrow className="text-rb-red" />
          </Link>
        </section>

        <QuestionsLocation faqs={RESTORATION_FAQ} />
        <MobileFooter phone={settings.phone} email={settings.email} />
      </MobileShell>

      {/* ===== DESKTOP (unchanged) ===== */}
      <main className="relative hidden min-h-screen w-full bg-rb-bg text-white md:block">
      <RandomBackdrop />

      <div className="relative z-[1]">
        <SiteNav current="work" />

        <article className="mx-auto max-w-[1120px] px-6 pb-20 pt-24">
          {/* BACK */}
          <Link
            href="/restoration/work"
            className="mb-[26px] inline-flex items-center gap-[9px] text-[12px] uppercase tracking-[2px] text-rb-tx-mute-2 transition-colors duration-150 hover:text-white"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.3" />
            </svg>
            All Work
          </Link>

          <div className="bg-rb-surface px-6 pb-10 pt-[34px] shadow-[0_40px_90px_rgba(0,0,0,0.55),0_12px_32px_rgba(0,0,0,0.42)] md:px-[38px]">
            <div className="animate-rb-fade-up">
              {/* ===== AUTHOR ROW ===== */}
              <div className="flex items-center gap-[13px] border-b border-rb-raised-3 pb-[22px]">
                <Link
                  href="/restoration"
                  className="flex h-[46px] w-[46px] flex-none items-center justify-center bg-rb-red"
                >
                  <span className="font-mono text-[12px] font-bold tracking-[1px] text-white">RBM</span>
                </Link>
                <div className="flex min-w-0 flex-col gap-[3px]">
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-bold tracking-[-0.01em] text-white">
                      Red Box Motors
                    </span>
                    <span className="h-[5px] w-[5px] flex-none bg-rb-red" />
                  </div>
                  <span className="text-[12px] tracking-[0.3px] text-rb-tx-mute-3">
                    @redboxmotors · Red Box Restoration
                  </span>
                </div>
                <div className="ml-auto flex-none text-right">
                  <div className="text-[12.5px] tracking-[0.3px] text-rb-tx-mute">
                    {p.location ?? 'Austin, TX'}
                  </div>
                  {p.year != null && (
                    <div className="mt-[5px] font-mono text-[10.5px] tracking-[1px] text-rb-tx-faint-2">
                      COMPLETED {p.year}
                    </div>
                  )}
                </div>
              </div>

              {/* ===== HEADLINE ===== */}
              <h1 className="mt-7 text-[40px] font-semibold leading-[1.05] tracking-[-0.03em] text-white">
                {p.title}
              </h1>
              <div className="mt-3 text-[15px] tracking-[0.2px] text-[#8c8c8c]">
                {p.vehicle} · {p.category}
              </div>

              {/* ===== PHOTO COLLAGE (big hero + 4-up) ===== */}
              <div className="mt-6 grid grid-cols-1 gap-0.5 md:grid-cols-[1.55fr_1fr]">
                {/* big hero */}
                <div
                  className={`${heroCellCls} flex ${heroPortrait ? 'aspect-[3/4]' : 'aspect-[4/3]'} items-center justify-center`}
                  style={images[0] ? undefined : stripeStyle}
                >
                  {images[0] ? (
                    <CollagePhoto image={images[0]} alt={`${p.title}, ${p.vehicle}`} />
                  ) : (
                    <span className="font-mono text-[11px] uppercase tracking-[2px] text-[#2f2f2f]">
                      [ {tag} ]
                    </span>
                  )}
                  <div className="absolute left-4 top-4 border border-[#2e2e2e] bg-black/40 px-[11px] py-1.5">
                    <span className="font-mono text-[10px] uppercase tracking-[2px] text-[#cfcfcf]">
                      {p.category}
                    </span>
                  </div>
                  {n > 0 && (
                    <div className="absolute bottom-4 right-4 bg-black/45 px-[9px] py-[5px] font-mono text-[10px] tracking-[1px] text-[#9a9a9a]">
                      {pad2(n)} PHOTOS
                    </div>
                  )}
                </div>

                {/* 4-up grid */}
                <div className="grid grid-cols-2 grid-rows-2 gap-0.5">
                  {sideShots.map((shot, i) => (
                    <div
                      key={i}
                      className={`${sideCellCls} flex aspect-square items-center justify-center md:aspect-auto`}
                      style={shot ? undefined : stripeStyle}
                    >
                      {shot ? (
                        <CollagePhoto image={shot} alt={`${p.title}, photo ${i + 2}`} />
                      ) : (
                        <span className="font-mono text-[10px] uppercase tracking-[1px] text-[#2f2f2f]">
                          [ {tag} ]
                        </span>
                      )}
                      {shot && (
                        <div className="absolute bottom-[9px] left-[10px] font-mono text-[9px] tracking-[1px] text-rb-tx-faint">
                          {pad2(i + 2)} / {pad2(n)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* ===== ACTION / META BAR ===== */}
              <div className="flex items-center justify-between gap-4 border-b border-rb-raised-3 px-0.5 py-[15px]">
                <div className="flex items-center gap-5 text-rb-tx-mute-3">
                  <div className="flex cursor-pointer items-center gap-2 transition-colors duration-150 hover:text-white">
                    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <path
                        d="M8 14s5.5-3.4 5.5-7A3.2 3.2 0 008 4.2 3.2 3.2 0 002.5 7c0 3.6 5.5 7 5.5 7z"
                        stroke="currentColor"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </div>
                  <div className="flex cursor-pointer items-center gap-2 transition-colors duration-150 hover:text-white">
                    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <path
                        d="M13 8L6 13V10C2.5 10 1.7 6.4 2 3.5 3 5.6 4.6 6 6 6V3L13 8Z"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
                <div className="flex cursor-pointer items-center gap-1.5 text-rb-tx-mute-3 transition-colors duration-150 hover:text-white">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path
                      d="M4 2v12l4-3 4 3V2z"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              {/* ===== INFO (two columns) ===== */}
              <div className="mt-[30px] grid grid-cols-1 items-start gap-11 md:grid-cols-[1.5fr_1fr]">
                {/* LEFT — caption, tags, work */}
                <div className="min-w-0">
                  {p.summary && (
                    <p className="m-0 text-[18px] leading-[1.7] text-[#d2d2d2]">
                      <span className="font-bold text-white">Red Box Motors</span> {p.summary}
                    </p>
                  )}
                  {hashtags.length > 0 && (
                    <div className="mt-[18px] flex flex-wrap gap-x-3.5 gap-y-[9px]">
                      {hashtags.map((t) => (
                        <Link
                          key={t}
                          href="/restoration/work"
                          className="font-mono text-[12px] tracking-[0.5px] text-[#7f7f7f] transition-colors duration-150 hover:text-rb-red"
                        >
                          {t}
                        </Link>
                      ))}
                    </div>
                  )}
                  {p.scope.length > 0 && (
                    <>
                      <h2 className="mb-1 mt-10 text-[13px] font-bold uppercase tracking-[2px] text-rb-tx-mute-2">
                        What went into it
                      </h2>
                      {p.scope.map((item) => (
                        <div
                          key={item}
                          className="flex items-start gap-[13px] border-t border-rb-line-2 py-[15px]"
                        >
                          <span className="mt-[7px] h-1.5 w-1.5 flex-none bg-rb-red" />
                          <span className="text-[15px] leading-[1.55] text-[#d2d2d2]">{item}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>

                {/* RIGHT — details + CTA */}
                <div className="flex min-w-0 flex-col gap-[26px]">
                  {facts.length > 0 && (
                    <div>
                      <div className="mb-[13px] text-[12px] font-bold uppercase tracking-[2px] text-rb-tx-mute-2">
                        Details
                      </div>
                      <div className="flex flex-col gap-px bg-rb-raised-3">
                        {facts.map((fact) => (
                          <div
                            key={fact.label}
                            className="flex items-center justify-between gap-3.5 bg-rb-surface px-4 py-3.5"
                          >
                            <span className="text-[10px] uppercase tracking-[2px] text-rb-tx-faint">
                              {fact.label}
                            </span>
                            <span className="text-right text-[13.5px] tracking-[0.2px] text-white">
                              {fact.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="border border-rb-border bg-rb-surface-2 px-[26px] py-7">
                    <div className="mb-[9px] text-[20px] font-semibold tracking-[-0.015em] text-white">
                      Want this for your car?
                    </div>
                    <div className="mb-5 text-[13px] leading-[1.55] text-[#8c8c8c]">
                      Tell us what you have in mind, we will scope it and quote it.
                    </div>
                    <Link
                      href="/restoration/estimate"
                      className="rb-btn-red inline-flex items-center gap-2.5 bg-rb-red px-6 py-3.5 text-[13px] tracking-[0.5px] text-white"
                    >
                      Request an Estimate
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                        <path d="M4 12L12 4M12 4H5.2M12 4V10.8" stroke="#fff" strokeWidth="1.4" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>

              {/* ===== ONE MORE PHOTO (wide closing shot) ===== */}
              <div
                className="relative mt-9 flex aspect-[21/8] w-full cursor-pointer items-center justify-center overflow-hidden hover:z-[5] hover:-translate-y-[5px] hover:scale-[1.012] hover:shadow-[0_26px_52px_rgba(0,0,0,0.6)] hover:brightness-[1.08] active:translate-y-0 active:scale-[0.99] motion-reduce:transform-none motion-reduce:transition-none [transition:transform_260ms_cubic-bezier(.2,.8,.2,1),box-shadow_260ms_cubic-bezier(.2,.8,.2,1),filter_260ms_ease]"
                style={wideShot ? undefined : stripeStyle}
              >
                {wideShot ? (
                  <CollagePhoto image={wideShot} alt={`${p.title}, closing shot`} />
                ) : (
                  <span className="font-mono text-[11px] uppercase tracking-[2px] text-[#2f2f2f]">
                    [ {tag} · wide ]
                  </span>
                )}
              </div>

              {/* ===== SEO STORY ===== */}
              <div className="mt-[42px] max-w-[760px]">
                <h2 className="mb-4 mt-0 text-[13px] font-bold uppercase tracking-[2px] text-rb-tx-mute-2">
                  About this build
                </h2>
                {paras.map((para) => (
                  <p key={para} className="mb-[18px] mt-0 text-[16px] leading-[1.8] text-[#b4b4b4]">
                    {para}
                  </p>
                ))}
              </div>

              {/* ===== MORE WORK ===== */}
              <div className="mt-[30px] flex items-center justify-center">
                <Link
                  href="/restoration/work"
                  className="inline-flex items-center gap-[9px] border border-rb-border-2 px-[22px] py-[13px] text-[12.5px] tracking-[1px] text-white transition-[background,border-color,transform,box-shadow] duration-btn ease-rb hover:-translate-y-0.5 hover:border-[#444] hover:bg-rb-raised-3 hover:shadow-[0_12px_26px_rgba(0,0,0,0.5)] active:translate-y-0 active:scale-[0.98] motion-reduce:transform-none motion-reduce:transition-none"
                >
                  See more work
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path d="M4 12L12 4M12 4H5.2M12 4V10.8" stroke="currentColor" strokeWidth="1.3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </article>

        {/* ===== VISIT & FAQ ===== */}
        <VisitAndFAQ division="cosmetics" />
      </div>
      </main>
    </>
  );
}
