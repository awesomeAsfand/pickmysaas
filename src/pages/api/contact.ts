export const prerender = false;

import type { APIRoute } from 'astro';
import { contactSchema, readContactForm, FIELDS_WITH_MESSAGES } from '@/lib/contact-schema';
import { Resend } from 'resend';
import siteConfig from '@/config/site.config';
import { t, resolveLocale, getLocaleDirection } from '@/i18n';

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

/**
 * The form posts in the background with `Accept: application/json` and gets
 * JSON. Without JavaScript it posts normally, and the visitor gets a short
 * page in their language with the result and a link back.
 */
function reply(
  request: Request,
  locale: string,
  status: number,
  body: { success: boolean; errors?: Record<string, string[]> },
  back: string
): Response {
  if ((request.headers.get('accept') ?? '').includes('application/json')) {
    return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
  }
  const messages = body.success
    ? [t('home.contact.brief.ok', locale)]
    : Object.values(body.errors ?? {}).flat();
  const safeBack = back.startsWith('/') && !back.startsWith('//') ? back : '/';
  const html = `<!doctype html><html lang="${locale}" dir="${getLocaleDirection(locale)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${escapeHtml(siteConfig.name)}</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#EEEBE3;color:#121212;font:17px/1.6 system-ui,sans-serif;padding:24px}main{max-width:560px}a{color:#2D2DF5;font-weight:600}</style></head><body><main>${messages
    .map((m) => `<p>${escapeHtml(m)}</p>`)
    .join('')}<p><a href="${escapeHtml(safeBack)}">${escapeHtml(t('contact.back', locale))}</a></p></main></body></html>`;
  return new Response(html, { status, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

export const POST: APIRoute = async ({ request }) => {
  // Answer in the language of the page the form was sent from.
  let locale = resolveLocale(undefined);
  let back = '/';
  try {
    const formData = await request.formData();
    locale = resolveLocale(formData.get('locale')?.toString());
    const data = readContactForm(formData);
    back = data.page || '/';

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
      return reply(request, locale, 400, { success: false, errors: fieldErrors }, back);
    }

    const brief = result.data;
    const siteLabel = siteConfig.name;
    const rows: [string, string][] = [
      ['Name', brief.name],
      ['Email', brief.email],
      ['WhatsApp', brief.whatsapp || '—'],
      ['Needs', brief.needs.join(', ') || '—'],
      ['Budget', brief.budget || '—'],
      ['Heard about us', brief.heard],
      ['Language', locale],
      ['Page', brief.page || '—'],
    ];
    const notification: Notification = {
      subject: brief.subject
        ? `[${siteLabel}] ${brief.subject}`
        : `[${siteLabel}] New brief from ${brief.name}${brief.needs.length ? ` (${brief.needs.join(', ')})` : ''}`,
      // Replying in the inbox answers the visitor, not the site.
      replyTo: brief.email,
      html: `
        ${rows.map(([label, value]) => `<p><strong>${label}:</strong> ${escapeHtml(value)}</p>`).join('\n')}
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(brief.message).replace(/\n/g, '<br>')}</p>
      `,
      text: `${rows.map(([label, value]) => `${label}: ${value}`).join('\n')}\n\n${brief.message}`,
    };

    const sent =
      siteConfig.contactForm?.sendVia === 'cloudflare'
        ? await sendViaCloudflare(notification)
        : await sendViaResend(notification);

    if (!sent.ok) {
      console.error('Contact form delivery failed:', sent.error);
      return reply(request, locale, 500, { success: false, errors: { form: [t(sent.visitorKey, locale)] } }, back);
    }

    return reply(request, locale, 200, { success: true }, back);
  } catch (error) {
    console.error('Contact form error:', error);
    return reply(request, locale, 500, { success: false, errors: { form: [t(SEND_FAILED, locale)] } }, back);
  }
};
