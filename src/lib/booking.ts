/**
 * "Book a free call" and WhatsApp links.
 *
 * With `siteConfig.booking.calLink` set, a booking button links to the Cal.com
 * page and carries `data-cal-link`, which <BookingPopup> picks up to open the
 * booking calendar in a popup instead. The plain link still works without
 * JavaScript and on middle-click. Without a Cal link, the button falls back to
 * the page it is given (the contact page).
 */
import siteConfig from '@/config/site.config';

const calLink = siteConfig.booking?.calLink;

/**
 * wa.me chat link for `siteConfig.whatsapp`, with an optional message typed
 * in for the visitor. Undefined when no number is configured.
 */
export function whatsAppUrl(message?: string): string | undefined {
  const number = siteConfig.whatsapp?.replace(/\D/g, '');
  if (!number) return undefined;
  return message ? `https://wa.me/${number}?text=${encodeURIComponent(message)}` : `https://wa.me/${number}`;
}

/** Attributes for a booking button: spread onto <Button> or an <a>. */
export function bookingLinkAttrs(fallbackHref: string): { href: string; 'data-cal-link'?: string } {
  return calLink ? { href: `https://cal.com/${calLink}`, 'data-cal-link': calLink } : { href: fallbackHref };
}
