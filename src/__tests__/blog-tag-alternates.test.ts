import { describe, it, expect, vi } from 'vitest';

// Tags are translated, so the same tag has a different slug in each locale.
// Posts pair across locales by `uid` (slugs may differ); `solo` has no
// translation, so its switch has to land on the blog index.
const MOCK_POSTS = [
  {
    id: 'en/start-ai',
    data: { locale: 'en', uid: 'ai', tags: ['AI', 'Small business', 'GCC'], draft: false },
  },
  {
    id: 'ar/badaa-ai',
    data: { locale: 'ar', uid: 'ai', tags: ['الذكاء الاصطناعي', 'الشركات الصغيرة', 'الخليج'], draft: false },
  },
  { id: 'en/solo', data: { locale: 'en', tags: ['Django'], draft: false } },
];

vi.mock('astro:content', () => ({
  getCollection: vi.fn(async (_name: string, filter?: (entry: unknown) => boolean) =>
    filter ? MOCK_POSTS.filter(filter) : MOCK_POSTS
  ),
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

import { getBlogTagAlternates, getTagUrl } from '@/lib/blog';

describe('getBlogTagAlternates', () => {
  it('links an English tag to its Arabic translation through the post uid', async () => {
    expect(await getBlogTagAlternates('GCC', 'en')).toEqual({
      en: '/blog/tag/gcc/',
      ar: getTagUrl('الخليج', 'ar'),
    });
  });

  it('links an Arabic tag back to its English original', async () => {
    expect(await getBlogTagAlternates('الذكاء الاصطناعي', 'ar')).toEqual({
      en: '/blog/tag/ai/',
      ar: getTagUrl('الذكاء الاصطناعي', 'ar'),
    });
  });

  it('falls back to the blog index when the post has no translation', async () => {
    expect(await getBlogTagAlternates('Django', 'en')).toEqual({
      en: '/blog/tag/django/',
      ar: '/ar/blog/',
    });
  });
});
