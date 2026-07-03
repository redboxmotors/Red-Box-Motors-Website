'use server';

import { requireUser } from '@/lib/auth';
import { revalidatePublic } from '@/lib/admin/revalidate';
import type { SaveResult } from '../listings/actions';

export type SettingsInput = {
  phone: string;
  email: string;
  address_line: string;
  hours: { day: string; hours: string }[];
  map_embed_url: string;
};

const PHONE_RE = /^[+()\-.\s\d]{7,20}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(input: SettingsInput): Record<string, string> {
  const errors: Record<string, string> = {};
  if (input.phone.trim() && !PHONE_RE.test(input.phone.trim()))
    errors.phone = 'Enter a valid phone number, e.g. (512) 555-0199.';
  if (input.email.trim() && !EMAIL_RE.test(input.email.trim()))
    errors.email = 'Enter a valid email address.';
  if (input.map_embed_url.trim() && !/^https:\/\//.test(input.map_embed_url.trim()))
    errors.map_embed_url = 'Map embed URL must start with https://';
  return errors;
}

export async function saveSettings(input: SettingsInput): Promise<SaveResult> {
  const { supabase } = await requireUser();

  const errors = validate(input);
  if (Object.keys(errors).length) return { ok: false, errors };

  const hours_json: Record<string, string> = {};
  for (const row of input.hours) {
    if (row.day.trim() && row.hours.trim()) hours_json[row.day.trim()] = row.hours.trim();
  }

  const row = {
    id: 1,
    phone: input.phone.trim() || null,
    email: input.email.trim() || null,
    address_line: input.address_line.trim() || null,
    hours_json,
    map_embed_url: input.map_embed_url.trim() || null,
  };

  const { error } = await supabase.from('settings').upsert(row);
  if (error) return { ok: false, errors: { _form: error.message } };
  revalidatePublic();
  return { ok: true, id: '1' };
}
