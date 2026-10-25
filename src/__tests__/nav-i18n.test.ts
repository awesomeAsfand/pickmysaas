import { describe, it, expect, vi } from 'vitest';

// Exercise the nav config's locale resolution with i18n turned ON and two
// locales. The default locale stays at the site root; the secondary locale is
// prefixed and labels are translated via the dictionary. Guards the localized
// header/footer nav and logo wired up for #438.
vi.mock('@/config/i18n.config', () => ({
  default: {
    enabled: true,
    defaultLocale: 'en',
    locales: ['en', 'ar'],
    localeNames: { en: 'English', ar: 'العربية' },
    detectBrowserLocale: false,
  },
}));

import { getNavItems, getLogoHref, resolveNavItem, type NavItem } from '@/config/nav.config';

describe('nav config — locale resolution (en default, ar secondary)', () => {
  it('keeps default-locale hrefs at the site root', () => {
    const items = getNavItems('en');
    expect(items.find((i) => i.label === 'Blog')?.href).toBe('/blog');
    expect(items.find((i) => i.label === 'About')?.href).toBe('/about');
  });

  it('prefixes secondary-locale hrefs with the locale', () => {
    const items = getNavItems('ar');
    expect(items.map((i) => i.href)).toEqual([
      '/ar',
      '/ar/services',
      '/ar/projects',
      '/ar/blog',
      '/ar/about',
      '/ar/contact',
    ]);
  });

  it('translates labels via the dictionary (labelKey)', () => {
    const ar = getNavItems('ar');
    // ar.json: nav.items.about = "من نحن", nav.items.services = "الخدمات"
    expect(ar.find((i) => i.href === '/ar/about')?.label).toBe('من نحن');
    expect(ar.find((i) => i.href === '/ar/services')?.label).toBe('الخدمات');
  });

  it('points the logo at the locale home', () => {
    expect(getLogoHref('en')).toBe('/');
    expect(getLogoHref('ar')).toBe('/ar');
  });

  it('never locale-prefixes external, mailto/tel, or anchor hrefs', () => {
    expect(
      resolveNavItem(
        { label: 'GitHub', href: 'https://github.com/x', order: 1, external: true },
        'ar'
      ).href
    ).toBe('https://github.com/x');
    expect(resolveNavItem({ label: 'Top', href: '#top', order: 1 }, 'ar').href).toBe('#top');
    expect(resolveNavItem({ label: 'Mail', href: 'mailto:a@b.com', order: 1 }, 'ar').href).toBe(
      'mailto:a@b.com'
    );
  });

  it('applies a per-locale override (label + path), still locale-prefixed', () => {
    const item: NavItem = {
      label: 'Contact',
      href: '/contact',
      order: 1,
      locales: { ar: { label: 'تواصل معنا', href: '/tawasal' } },
    };
    expect(resolveNavItem(item, 'ar')).toEqual({
      label: 'تواصل معنا',
      href: '/ar/tawasal',
      external: undefined,
    });
    // The default locale is unaffected by an ar-only override.
    expect(resolveNavItem(item, 'en')).toEqual({
      label: 'Contact',
      href: '/contact',
      external: undefined,
    });
  });

  it('falls back to the literal label when no labelKey is set', () => {
    expect(resolveNavItem({ label: 'Docs', href: '/docs', order: 1 }, 'ar').label).toBe('Docs');
  });
});
