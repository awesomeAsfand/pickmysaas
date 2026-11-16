/**
 * Cal.com embed, loaded on demand (client side only).
 *
 * Cal's script (app.cal.com/embed/embed.js) is fetched the first time a
 * booking button is pressed or an inline calendar is mounted, never on page
 * load. Every booking link is also a plain link to the Cal.com page, so
 * booking works without JavaScript.
 *
 * Fires `booking_opened` (popup or inline) and `booking_completed` (Cal's
 * bookingSuccessful event) to the data layer.
 */
import { track } from '@/lib/track';

const CAL_ORIGIN = 'https://app.cal.com';
const CAL_EMBED_SRC = `${CAL_ORIGIN}/embed/embed.js`;
const NAMESPACE = 'booking';
const BRAND = '#2D2DF5';

type CalFn = ((...args: unknown[]) => void) & {
  loaded?: boolean;
  q?: unknown[];
  ns?: Record<string, CalFn>;
};
type CalWindow = Window & { Cal?: CalFn };

/** Cal.com's loader stub, from their embed snippet: queues calls until embed.js has loaded. */
function loadCal(): CalFn {
  const w = window as CalWindow;
  if (w.Cal) return w.Cal;
  const push = (api: CalFn, args: unknown) => api.q!.push(args);
  const cal: CalFn = function (...args: unknown[]) {
    if (!cal.loaded) {
      cal.ns = {};
      cal.q = cal.q || [];
      const script = document.createElement('script');
      script.src = CAL_EMBED_SRC;
      script.async = true;
      document.head.appendChild(script);
      cal.loaded = true;
    }
    if (args[0] === 'init') {
      const api: CalFn = function (...apiArgs: unknown[]) {
        push(api, apiArgs);
      };
      api.q = [];
      const namespace = args[1];
      if (typeof namespace === 'string') {
        cal.ns![namespace] = cal.ns![namespace] || api;
        push(cal.ns![namespace], args);
        push(cal, ['initNamespace', namespace]);
      } else {
        push(cal, args);
      }
      return;
    }
    push(cal, args);
  };
  w.Cal = cal;
  return cal;
}

let api: CalFn | null = null;
let lastBooking = 0;

function calApi(): CalFn {
  if (api) return api;
  const cal = loadCal();
  cal('init', NAMESPACE, { origin: CAL_ORIGIN });
  api = cal.ns![NAMESPACE];
  api('ui', { theme: 'light', cssVarsPerTheme: { light: { 'cal-brand': BRAND } }, hideEventTypeDetails: false });
  // Cal has fired both names over time; count one booking once.
  const done = () => {
    const now = Date.now();
    if (now - lastBooking < 5000) return;
    lastBooking = now;
    track('booking_completed');
  };
  api('on', { action: 'bookingSuccessfulV2', callback: done });
  api('on', { action: 'bookingSuccessful', callback: done });
  return api;
}

/** Open the booking calendar in a popup. */
export function openBookingPopup(calLink: string, source = 'button'): void {
  track('booking_opened', { mode: 'popup', source });
  calApi()('modal', { calLink, config: { layout: 'month_view', theme: 'light' } });
}

/** Render the booking calendar inside `element`. */
export function mountInlineBooking(element: HTMLElement, calLink: string): void {
  track('booking_opened', { mode: 'inline' });
  calApi()('inline', { elementOrSelector: element, calLink, config: { layout: 'month_view', theme: 'light' } });
}
