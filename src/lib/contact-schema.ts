/**
 * The brief form's rules, shared by the API route (src/pages/api/contact.ts)
 * and its tests. English messages are for logs and tests; visitors get the
 * localized `contact.errors.<field>` strings.
 */
import { z } from 'astro/zod';

/** Fields whose error has its own localized message. */
export const FIELDS_WITH_MESSAGES = new Set(['name', 'email', 'subject', 'message', 'heard', 'whatsapp']);

const optionalText = (max: number) => z.string().trim().max(max).optional().default('');

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  email: z.email('Please enter a valid email address'),
  /** Optional. Digits, spaces, +, -, ( ); at least 6 digits when given. */
  whatsapp: optionalText(30).refine(
    (value) => value === '' || (/^[+\d\s()-]+$/.test(value) && value.replace(/\D/g, '').length >= 6),
    'Enter a phone number with digits only'
  ),
  /** "How did you hear about us?" Required. */
  heard: z.string().trim().min(1, 'Tell us how you heard about us').max(100),
  /** Chips: what the visitor needs. */
  needs: z.array(z.string().trim().max(60)).max(8).default([]),
  budget: optionalText(60),
  subject: z.string().max(200).optional(),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(5000),
  /** Anti-spam: must stay empty. */
  honeypot: z.string().max(0),
  /** The page the brief was sent from, for the notification. */
  page: optionalText(300),
});

export type ContactData = z.infer<typeof contactSchema>;

/** Read the form's fields into the shape the schema checks. */
export function readContactForm(form: FormData) {
  const text = (key: string) => form.get(key)?.toString() ?? '';
  return {
    name: text('name'),
    email: text('email'),
    whatsapp: text('whatsapp'),
    heard: text('heard'),
    needs: form.getAll('needs').map((value) => value.toString()),
    budget: text('budget'),
    subject: text('subject') || undefined,
    message: text('message'),
    honeypot: text('honeypot'),
    page: text('page'),
  };
}
