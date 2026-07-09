'use client';

import { useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, arrayMove, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { createClient } from '@/lib/supabase/client';
import type { ContentType, DbImage } from '@/lib/db/types';
import {
  addImage,
  deleteImage,
  reorderImages,
  setHeroImage,
  updateImageMeta,
} from '@/app/admin/(panel)/photos/actions';
import { ConfirmButton } from './ui';

// Originals can be full-res (5760×3240 ≈ 5–10 MB+); we accept up to 40 MB
// and store a 2560px display rendition + 480px thumb, generated client-side.
const MAX_BYTES = 40 * 1024 * 1024;
const DISPLAY_WIDTH = 2560;
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

// Per-record photo manager (admin-and-photos.md §4–§5): drag-upload with
// progress, drag-reorder, hero pick, focal-point picker, alt text, delete.
export function PhotoManager({
  parentType,
  parentId,
  images: initial,
  defaultAlt,
}: {
  parentType: ContentType;
  parentId: string;
  images: DbImage[];
  defaultAlt: string;
}) {
  const router = useRouter();
  const [images, setImages] = useState<DbImage[]>(initial);
  const [uploads, setUploads] = useState<{ name: string; error?: string }[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [focalFor, setFocalFor] = useState<DbImage | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const upload = useCallback(
    async (files: FileList | File[]) => {
      const supabase = createClient();
      for (const file of Array.from(files)) {
        if (!ACCEPTED.includes(file.type)) {
          setUploads((u) => [...u, { name: file.name, error: 'Not an image (jpeg/png/webp/avif).' }]);
          continue;
        }
        if (file.size > MAX_BYTES) {
          setUploads((u) => [...u, { name: file.name, error: 'Over 40 MB.' }]);
          continue;
        }

        setUploads((u) => [...u, { name: file.name }]);
        try {
          const stamp = Date.now().toString(36);
          const safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-');
          const base = safe.replace(/\.[a-z0-9]+$/, '');
          const thumbBlob = await makeThumb(file, 480);
          const thumbPath = `${parentType}/${parentId}/${stamp}-thumb-${base}.jpg`;

          // Display rendition: originals are downscaled to ≤2560px wide
          // (native aspect preserved — 16:9 sources stay exactly 16:9).
          // If canvas processing fails, fall back to the original when it
          // fits the bucket's 10 MB cap.
          const displayBlob = await makeThumb(file, DISPLAY_WIDTH, 0.86);
          const useOriginal = !displayBlob;
          if (useOriginal && file.size > 10 * 1024 * 1024) {
            throw new Error('Could not process this image locally and it exceeds the 10 MB storage cap.');
          }
          const path = useOriginal
            ? `${parentType}/${parentId}/${stamp}-${safe}`
            : `${parentType}/${parentId}/${stamp}-${base}.jpg`;

          const { error: upErr } = await supabase.storage
            .from('photos')
            .upload(path, useOriginal ? file : displayBlob!, {
              contentType: useOriginal ? file.type : 'image/jpeg',
              cacheControl: '31536000',
            });
          if (upErr) throw new Error(upErr.message);

          let thumbUrl: string | null = null;
          if (thumbBlob) {
            const { error: thumbErr } = await supabase.storage
              .from('photos')
              .upload(thumbPath, thumbBlob, { contentType: 'image/jpeg', cacheControl: '31536000' });
            if (!thumbErr) {
              thumbUrl = supabase.storage.from('photos').getPublicUrl(thumbPath).data.publicUrl;
            }
          }

          const url = supabase.storage.from('photos').getPublicUrl(path).data.publicUrl;
          const record = await addImage({
            parent_type: parentType,
            parent_id: parentId,
            url,
            thumb_url: thumbUrl,
            alt: defaultAlt,
          });
          setImages((imgs) => [...imgs, record as DbImage]);
          setUploads((u) => u.filter((x) => x.name !== file.name));
        } catch (e) {
          setUploads((u) =>
            u.map((x) => (x.name === file.name ? { ...x, error: (e as Error).message } : x)),
          );
        }
      }
      router.refresh();
    },
    [parentType, parentId, defaultAlt, router],
  );

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = images.findIndex((i) => i.id === active.id);
    const newIndex = images.findIndex((i) => i.id === over.id);
    const next = arrayMove(images, oldIndex, newIndex);
    setImages(next);
    void reorderImages(next.map((i) => i.id));
  }

  return (
    <div className="border border-rb-line bg-rb-surface p-4">
      {/* drop zone */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload photos"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          void upload(e.dataTransfer.files);
        }}
        className={`mb-4 flex cursor-pointer items-center justify-center border border-dashed px-6 py-8 transition-colors ${
          dragOver ? 'border-rb-red bg-rb-raised' : 'border-rb-border bg-rb-surface-3 hover:border-rb-border-2'
        }`}
      >
        <p className="text-[13px] font-medium text-rb-tx-faint">
          Drop photos here or <span className="text-rb-tx-2 underline underline-offset-4">browse</span>
          <span className="rb-mono-caption ml-2">jpeg / png / webp / avif · originals ≤40 MB · stored at 2560px</span>
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED.join(',')}
          multiple
          hidden
          onChange={(e) => e.target.files && void upload(e.target.files)}
        />
      </div>

      {/* upload progress / errors */}
      {uploads.length > 0 && (
        <ul className="mb-4 space-y-1">
          {uploads.map((u) => (
            <li key={u.name} className="flex items-center gap-2 text-[12px] font-medium">
              {u.error ? (
                <>
                  <span className="text-rb-red">✕</span>
                  <span className="text-rb-tx-2">{u.name}</span>
                  <span className="text-rb-tx-faint">— {u.error}</span>
                  <button
                    type="button"
                    onClick={() => setUploads((x) => x.filter((y) => y.name !== u.name))}
                    className="ml-auto text-rb-tx-faint hover:text-rb-tx"
                  >
                    Dismiss
                  </button>
                </>
              ) : (
                <>
                  <span className="inline-block h-2 w-2 animate-pulse bg-rb-red" />
                  <span className="text-rb-tx-faint">Uploading {u.name}…</span>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* photo grid */}
      {images.length ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={images.map((i) => i.id)} strategy={rectSortingStrategy}>
            <ul className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
              {images.map((img) => (
                <PhotoCard
                  key={img.id}
                  img={img}
                  onHero={() => {
                    setImages((imgs) => imgs.map((i) => ({ ...i, is_hero: i.id === img.id })));
                    void setHeroImage(img.id, parentType, parentId);
                  }}
                  onAlt={(alt) => {
                    setImages((imgs) => imgs.map((i) => (i.id === img.id ? { ...i, alt } : i)));
                    void updateImageMeta(img.id, { alt });
                  }}
                  onFocal={() => setFocalFor(img)}
                  onDelete={() => {
                    setImages((imgs) => {
                      const rest = imgs.filter((i) => i.id !== img.id);
                      if (img.is_hero && rest.length) rest[0] = { ...rest[0], is_hero: true };
                      return rest;
                    });
                    void deleteImage(img.id);
                  }}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      ) : (
        uploads.length === 0 && (
          <p className="py-4 text-center text-[12px] font-medium text-rb-tx-faint-2">
            No photos yet — the site shows the striped placeholder until you add one.
          </p>
        )
      )}

      {/* focal point picker */}
      {focalFor && (
        <FocalPicker
          img={focalFor}
          onClose={() => setFocalFor(null)}
          onSet={(x, y) => {
            setImages((imgs) =>
              imgs.map((i) => (i.id === focalFor.id ? { ...i, focal_x: x, focal_y: y } : i)),
            );
            void updateImageMeta(focalFor.id, { focal_x: x, focal_y: y });
            setFocalFor(null);
          }}
        />
      )}
    </div>
  );
}

function PhotoCard({
  img,
  onHero,
  onAlt,
  onFocal,
  onDelete,
}: {
  img: DbImage;
  onHero: () => void;
  onAlt: (alt: string) => void;
  onFocal: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: img.id,
  });
  const [alt, setAlt] = useState(img.alt);

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`border bg-rb-surface-3 ${
        img.is_hero ? 'border-rb-red' : 'border-rb-line'
      } ${isDragging ? 'relative z-10 shadow-rb-hover' : ''}`}
    >
      <div className="relative">
        <button
          type="button"
          aria-label="Drag to reorder"
          {...attributes}
          {...listeners}
          className="block w-full cursor-grab active:cursor-grabbing"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img.thumb_url ?? img.url}
            alt={img.alt}
            className="aspect-video w-full object-cover"
            style={{ objectPosition: `${img.focal_x * 100}% ${img.focal_y * 100}%` }}
          />
        </button>
        {img.is_hero && (
          <span className="absolute left-0 top-0 bg-rb-red px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-label text-white">
            Hero
          </span>
        )}
      </div>

      <div className="space-y-1.5 p-2">
        <input
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          onBlur={() => alt !== img.alt && onAlt(alt)}
          placeholder="Alt text (SEO)"
          aria-label="Alt text"
          className="w-full border border-rb-line bg-rb-surface px-2 py-1.5 text-[11px] font-medium text-rb-tx-2 outline-none placeholder:text-rb-tx-faint-2 focus:border-rb-red"
        />
        <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-label">
          {!img.is_hero ? (
            <button type="button" onClick={onHero} className="text-rb-tx-faint transition-colors hover:text-rb-tx">
              Set hero
            </button>
          ) : (
            <span className="text-rb-tx-ghost">Lead image</span>
          )}
          <button type="button" onClick={onFocal} className="text-rb-tx-faint transition-colors hover:text-rb-tx">
            Focal
          </button>
          <ConfirmButton onConfirm={onDelete} confirmLabel="Delete" className="text-rb-tx-faint transition-colors hover:text-rb-red">
            Delete
          </ConfirmButton>
        </div>
      </div>
    </li>
  );
}

// Click-the-subject focal picker (admin-and-photos.md §5). Renders the full
// image; a click stores focal_x/focal_y as 0..1.
function FocalPicker({
  img,
  onClose,
  onSet,
}: {
  img: DbImage;
  onClose: () => void;
  onSet: (x: number, y: number) => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Set focal point"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-8"
      onClick={onClose}
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
    >
      <div className="max-h-full max-w-3xl bg-rb-surface p-4 shadow-rb-card" onClick={(e) => e.stopPropagation()}>
        <p className="rb-label mb-3">Click the subject — tiles crop toward that point</p>
        <div className="relative cursor-crosshair">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img.url}
            alt={img.alt}
            className="max-h-[70vh] w-full object-contain"
            onClick={(e) => {
              const rect = (e.target as HTMLImageElement).getBoundingClientRect();
              onSet(
                Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width)),
                Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height)),
              );
            }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute h-3 w-3 border border-white bg-rb-red"
            style={{
              left: `calc(${img.focal_x * 100}% - 6px)`,
              top: `calc(${img.focal_y * 100}% - 6px)`,
            }}
          />
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-4 border border-rb-border px-4 py-2 text-[10px] font-bold uppercase tracking-label text-rb-tx-mute transition-colors hover:text-rb-tx"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// Canvas thumbnail derivative (~480px wide JPEG) generated client-side on
// upload — keeps list views light without server image infra.
async function makeThumb(file: File, width: number, quality = 0.82): Promise<Blob | null> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, width / bitmap.width);
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    return await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));
  } catch {
    return null;
  }
}
