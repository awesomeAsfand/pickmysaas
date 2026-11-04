import { describe, it, expect, vi } from 'vitest';

// Tags are translated, so the same tag has a different slug in each locale.
// `solo` has no translation, so its locale switch has to land on an index page.
const MOCK_PROJECTS = [
  { id: 'en/nurseries', data: { locale: 'en', tags: ['Directory Platform', 'GCC'], draft: false } },
  { id: 'ar/nurseries', data: { locale: 'ar', tags: ['منصة أدلة', 'الخليج'], draft: false } },
  { id: 'en/solo', data: { locale: 'en', tags: ['Web Tool'], draft: false } },
];

vi.mock('astro:content', () => ({
  getCollection: vi.fn(async () => MOCK_PROJECTS),
}));

vi.mock('@/config/i18n.config', () => ({
  default: {
    enabled: true,
    defaultLocale: 'en',
    locales: ['en', 'ar'],
    localeNames: { en: 'English', ar: 'العربية' },
    detectBrowserLocale: false,
  },
}));

import { getProjectTagAlternates, getProjectTagUrl } from '@/lib/projects';

describe('getProjectTagAlternates', () => {
  it('links an English tag to its Arabic translation', async () => {
    expect(await getProjectTagAlternates('GCC', 'en')).toEqual({
      en: '/projects/tag/gcc/',
      ar: getProjectTagUrl('الخليج', 'ar'),
    });
  });

  it('links an Arabic tag back to its English original', async () => {
    expect(await getProjectTagAlternates('منصة أدلة', 'ar')).toEqual({
      en: '/projects/tag/directory-platform/',
      ar: getProjectTagUrl('منصة أدلة', 'ar'),
    });
  });

  it('falls back to the projects index when the project has no translation', async () => {
    expect(await getProjectTagAlternates('Web Tool', 'en')).toEqual({
      en: '/projects/tag/web-tool/',
      ar: '/ar/projects/',
    });
  });
});
