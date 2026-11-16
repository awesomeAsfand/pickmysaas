/**
 * Currency conversion for display. Prices are set in US dollars; SAR and AED
 * figures are conversions at the pegged rates the site already uses (Saudi
 * pages: "3.75 ريال للدولار"; $500 ≈ AED 1,835), rounded to the nearest 5.
 * Safe to import on the client.
 */
export const CURRENCIES = {
  USD: { rate: 1, en: '$', ar: 'دولار' },
  SAR: { rate: 3.75, en: 'SAR', ar: 'ر.س' },
  AED: { rate: 3.6725, en: 'AED', ar: 'د.إ' },
} as const;

export type Currency = keyof typeof CURRENCIES;

export function convert(usd: number, currency: Currency): number {
  const value = usd * CURRENCIES[currency].rate;
  return currency === 'USD' ? value : Math.round(value / 5) * 5;
}

/** "$300", "SAR 1,125" in English; "300 دولار", "1,125 ر.س" in Arabic. */
export function formatPrice(usd: number, currency: Currency, locale: string): string {
  const n = convert(usd, currency).toLocaleString('en-US');
  const c = CURRENCIES[currency];
  if (locale === 'ar') return `${n} ${c.ar}`;
  return currency === 'USD' ? `$${n}` : `${c.en} ${n}`;
}
