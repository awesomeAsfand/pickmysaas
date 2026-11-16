/**
 * Push an event to the Google Tag Manager data layer, with the page's
 * language. Safe before GTM loads: the data layer is a plain array that GTM
 * reads when it arrives (it loads after the page settles, see Analytics).
 *
 * Events: whatsapp_click, booking_opened, booking_completed, brief_sent.
 */
export function track(event: string, data: Record<string, unknown> = {}): void {
  const w = window as Window & { dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, page_language: document.documentElement.lang || 'en', ...data });
}
