export const prerender = false;

import type { APIRoute } from 'astro';
import { z } from 'astro/zod';
import { Resend } from 'resend';
import siteConfig from '@/config/site.config';
import { t, resolveLocale } from '@/i18n';

// Escape user-supplied values before they are interpolated into the
// notification email's HTML, so a message containing markup (links,
// tracking pixels, spoofed content) can't render in the recipient's inbox.
const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/** The notification the site owner receives for each submission. */
interface Notification {
  subject: string;
  replyTo: string;
  html: string;
  text: string;
}

/**
 * A failed send carries the developer-facing cause (logged) and the dictionary
 * key of what the visitor is told, in the page's language.
 */
type SendResult = { ok: true } | { ok: false; error: unknown; visitorKey: VisitorKey };
type VisitorKey = typeof NOT_CONFIGURED | typeof SEND_FAILED;

const NOT_CONFIGURED = 'contact.unavailable';
const SEND_FAILED = 'contact.error';

/** Cloudflare's `send_email` binding, as much of it as this endpoint uses. */
interface SendEmailBinding {
  send(message: { from: string; to: string; subject: string; html: string; text: string; replyTo: string }): Promise<unknown>;
}

/**
 * Deliver through the Worker's `EMAIL` send binding (wrangler.toml) to the
 * address in the `CONTACT_TO_EMAIL` secret. Cloudflare sends to a verified
 * Email Routing destination for free; the sender is an address on the site's
 * own domain, which has Email Routing on.
 */
async function sendViaCloudflare(notification: Notification): Promise<SendResult> {
  // `cloudflare:workers` only resolves inside the Workers runtime. Importing it
  // through a variable keeps the bundler from resolving it, so the Vercel and
  // Netlify builds still compile.
  const specifier = 'cloudflare:workers';
  let env: Record<string, unknown>;
  try {
    ({ env } = await import(/* @vite-ignore */ specifier));
  } catch (error) {
    return { ok: false, error, visitorKey: NOT_CONFIGURED };
  }

  const binding = env.EMAIL as SendEmailBinding | undefined;
  const to = env.CONTACT_TO_EMAIL as string | undefined;
  if (!binding || !to) {
    // Name exactly what is missing, and which bindings the Worker does have
    // (names only, never values), so the Worker logs say how to fix it.
    const missing = [!binding && 'the EMAIL send binding', !to && 'the CONTACT_TO_EMAIL secret'].filter(Boolean).join(' and ');
    return {
      ok: false,
      error: `Missing ${missing} on the Worker. Bindings present: ${Object.keys(env).join(', ') || 'none'}`,
      visitorKey: NOT_CONFIGURED,
    };
  }

  try {
    await binding.send({
      from: `website@${siteConfig.email.split('@')[1]}`,
      to,
      ...notification,
    });
    return { ok: true };
  } catch (error) {
    return { ok: false, error, visitorKey: SEND_FAILED };
  }
}

/** Deliver through Resend to `siteConfig.email`. */
async function sendViaResend(notification: Notification): Promise<SendResult> {
  const apiKey = import.meta.env.RESEND_API_KEY;
  if (!apiKey) {
    return { ok: false, error: 'RESEND_API_KEY is not set', visitorKey: NOT_CONFIGURED };
  }

  const toEmail = siteConfig.email;
  const fromEmail = import.meta.env.RESEND_FROM_EMAIL || toEmail;
  const { error } = await new Resend(apiKey).emails.send({
    from: `Contact Form <${fromEmail}>`,
    to: toEmail,
    ...notification,
  });

  return error ? { ok: false, error, visitorKey: SEND_FAILED } : { ok: true };
}

/** Fields with a message of their own in `contact.errors.*`. */
const FIELDS_WITH_MESSAGES = new Set(['name', 'email', 'subject', 'message']);

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.email('Please enter a valid email address'),
  subject: z.string().max(200).optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
  honeypot: z.string().max(0), // Anti-spam: must be empty
});

export const POST: APIRoute = async ({ request }) => {
  // Answer in the language of the page the form was sent from.
  let locale = resolveLocale(undefined);
  try {
    const formData = await request.formData();
    locale = resolveLocale(formData.get('locale')?.toString());

    const data = {
      name: formData.get('name')?.toString() || '',
      email: formData.get('email')?.toString() || '',
      subject: formData.get('subject')?.toString() || '',
      message: formData.get('message')?.toString() || '',
      honeypot: formData.get('honeypot')?.toString() || '',
    };

    // Validate
    const result = contactSchema.safeParse(data);

    if (!result.success) {
      // One message per field, in the page's language. The schema's own
      // (English) messages stay for tests and logs.
      const fieldErrors: Record<string, string[]> = {};
      for (const error of result.error.issues) {
        const field = error.path[0] as string;
        fieldErrors[field] ??= [
          FIELDS_WITH_MESSAGES.has(field) ? t(`contact.errors.${field}`, locale) : t(SEND_FAILED, locale),
        ];
      }

      return new Response(
        JSON.stringify({ success: false, errors: fieldErrors }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Honeypot check (bot detection)
    if (result.data.honeypot) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const siteLabel = siteConfig.name;
    const notification: Notification = {
      subject: result.data.subject
        ? `[${siteLabel}] ${result.data.subject}`
        : `[${siteLabel}] New contact from ${result.data.name}`,
      // Replying in the inbox answers the visitor, not the site.
      replyTo: result.data.email,
      html: `
        <p><strong>Name:</strong> ${escapeHtml(result.data.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(result.data.email)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(result.data.message).replace(/\n/g, '<br>')}</p>
      `,
      text: `Name: ${result.data.name}\nEmail: ${result.data.email}\n\n${result.data.message}`,
    };

    const sent =
      siteConfig.contactForm?.sendVia === 'cloudflare'
        ? await sendViaCloudflare(notification)
        : await sendViaResend(notification);

    if (!sent.ok) {
      console.error('Contact form delivery failed:', sent.error);
      return new Response(
        JSON.stringify({ success: false, errors: { form: [t(sent.visitorKey, locale)] } }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Contact form error:', error);

    return new Response(
      JSON.stringify({ success: false, errors: { form: [t(SEND_FAILED, locale)] } }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
