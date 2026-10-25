/**
 * The URL used when the `SITE_URL` environment variable is not set.
 *
 * Two places need the site's own address and they must agree: `astro.config.mjs`
 * sets `site`, which produces every canonical tag, `og:url`, `og:image`, RSS
 * link and sitemap entry — and `site.config.ts` sets `url`, which the JSON-LD,
 * the share cards and the footer read. `astro.config.mjs` runs before
 * `astro:env` exists, so it cannot import `site.config.ts`; without a shared
 * constant the two drift, and a site ends up serving canonical URLs for one
 * domain while telling crawlers it lives at another.
 *
 * Set `SITE_URL` in your host's environment and this is never used. The
 * Cloudflare build sets none, so this is the production domain rather than the
 * theme's placeholder: with `https://example.com` here the live site told
 * search engines it lived at example.com.
 */
export const SITE_URL_FALLBACK = 'https://pickmysaas.com';
