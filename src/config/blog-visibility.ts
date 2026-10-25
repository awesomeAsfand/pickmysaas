/**
 * Whether the blog is part of the site yet.
 *
 * Off while there are no real posts. When it is off, the blog is left out of
 * the header and footer nav, the home page, the footer Topics column, the RSS
 * links and the sitemap. The /blog routes still build, but nothing links to
 * them and search engines aren't pointed at an empty page.
 *
 * Its own file, like `branding.ts`, so `astro.config.mjs` (the sitemap) can
 * read it: that file runs before `astro:env` exists and cannot import
 * `site.config.ts`. Everything else reads it as `siteConfig.blog.visible`.
 *
 * Flip to `true` once the first post is published.
 */
export const BLOG_VISIBLE = false;
