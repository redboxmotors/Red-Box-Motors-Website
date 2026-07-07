// Upload constraints for the private lead-uploads bucket. Isomorphic — the
// consignment form imports these for client-side pre-validation (UX) and the
// API route re-validates server-side; the bucket itself enforces mime + size
// as the final backstop (see supabase/patches/2026-07-07-consignment-forms.sql).

export const UPLOAD_MAX_FILES = 24;
export const UPLOAD_MAX_BYTES = 10 * 1024 * 1024; // 10 MB
export const UPLOAD_BUCKET = 'lead-uploads';
export const UPLOAD_LIMITS_TEXT = 'JPEG, PNG, WEBP, HEIC or PDF · up to 10 MB per file · 24 files total';

export const UPLOAD_MIME_EXT: Record<string, string[]> = {
  'image/jpeg': ['jpg', 'jpeg'],
  'image/png': ['png'],
  'image/webp': ['webp'],
  'image/avif': ['avif'],
  'image/heic': ['heic'],
  'image/heif': ['heif'],
  'application/pdf': ['pdf'],
};

export const UPLOAD_ACCEPT = '.jpg,.jpeg,.png,.webp,.avif,.heic,.heif,.pdf';

export const UPLOAD_CATEGORIES = [
  'exterior',
  'interior',
  'odometer',
  'vin-plate',
  'engine-bay',
  'imperfections',
  'service-records',
  'build-sheet',
  'history-report',
] as const;

export type UploadCategory = (typeof UPLOAD_CATEGORIES)[number];

export type FileManifestEntry = {
  category: UploadCategory;
  name: string;
  type: string;
  size: number;
};

export function validFileType(name: string, type: string): boolean {
  if (!(type in UPLOAD_MIME_EXT)) return false;
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  return UPLOAD_MIME_EXT[type].includes(ext);
}

// Sanitize a client-supplied filename into a safe storage path segment.
export function sanitizeFilename(name: string): string {
  const base = name.split(/[\\/]/).pop() ?? 'file';
  const cleaned = base.replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^[.-]+/, '');
  return (cleaned || 'file').slice(0, 60);
}

// Validate a file manifest (server-side). Returns an error string or null.
export function validateFileManifest(files: unknown): string | null {
  if (!Array.isArray(files)) return 'Invalid file list.';
  if (files.length > UPLOAD_MAX_FILES) return `Up to ${UPLOAD_MAX_FILES} files per submission.`;
  for (const f of files) {
    if (!f || typeof f !== 'object') return 'Invalid file entry.';
    const { category, name, type, size } = f as Record<string, unknown>;
    if (typeof category !== 'string' || !(UPLOAD_CATEGORIES as readonly string[]).includes(category))
      return 'Invalid file category.';
    if (typeof name !== 'string' || !name) return 'Invalid file name.';
    if (typeof type !== 'string' || typeof size !== 'number' || size <= 0 || size > UPLOAD_MAX_BYTES)
      return 'Each file must be 10 MB or smaller.';
    if (!validFileType(name, type))
      return 'Only JPEG, PNG, WEBP, HEIC images or PDF files are accepted.';
  }
  return null;
}
