import { SITE_URL, GOOGLE_SITE_VERIFICATION, BING_SITE_VERIFICATION } from 'astro:env/server';
import i18nConfig, { type I18nConfig } from './i18n.config';
import { SITE_URL_FALLBACK } from './site-url';
import { SITE_NAME, THEME_COLOR } from './branding';
import { BLOG_VISIBLE } from './blog-visibility';

export { i18nConfig };
export type { I18nConfig };

export interface SiteConfig {
  name: string;
  description: string;
  /** Identity line under the logo in the centered footer */
  tagline?: string;
  /** Short facts line under the footer tagline (licensing, location, availability) */
  footerNote?: string;
  url: string;
  ogImage: string;
  author: string;
  email: string;
  phone?: string;
  /** WhatsApp number in international format, digits only (e.g. 971501234567). Adds a "Chat on WhatsApp" button. */
  whatsapp?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  socialLinks: string[];
  /**
   * Header options. Set `showSocialLinks: true` to render an icon link in the
   * top-right for each entry in `socialLinks` (GitHub, X, etc. — the icon is
   * inferred from the URL). Off by default; an explicit `<Header
   * showSocialLinks>` prop still overrides this per-usage.
   */
  /**
   * How the contact form delivers its notification email.
   * - 'cloudflare': the Worker's `EMAIL` send binding (wrangler.toml), to the
   *   address in the `CONTACT_TO_EMAIL` Worker secret. That address must be a
   *   verified destination in Cloudflare Email Routing; sending to it is free.
   * - 'resend': the Resend API, with `RESEND_API_KEY`. Default.
   */
  contactForm?: {
    sendVia?: 'cloudflare' | 'resend';
  };
  /**
   * Call booking. With `calLink` set, every "Book a free call" button opens
   * the Cal.com booking popup for it; without it they go to the contact page.
   */
  booking?: {
    /** Cal.com event path, the part after `cal.com/`, e.g. `name/30min`. */
    calLink?: string;
  };
  header?: {
    showSocialLinks?: boolean;
  };
  twitter?: {
    site: string;
    creator: string;
  };
  verification?: {
    google?: string;
    bing?: string;
  };
  /** Path to author photo (relative to site root, e.g. '/avatar.jpg'). Used in Person schema. */
  authorImage?: string;
  /**
   * Set to false if your blog post images already match your theme color
   * and you don't want the brand color overlay applied on top of them.
   */
  blogImageOverlay?: boolean;
  /**
   * Article features — opt-in modules for blog posts.
   * Each is OFF by default so the theme stays as light as it is today
   * for users who don't enable them.
   */
  articleFeatures?: {
    /** Table of contents shown on blog posts (auto-generated from headings) */
    toc?: {
      /** Master switch — set to true to enable site-wide */
      enabled: boolean;
      /**
       * Where to render the TOC.
       * - 'inline'  → card at the top of every post (default; preserves
       *               full reading width on desktop)
       * - 'sidebar' → sticky sidebar on `xl+` viewports (≥1280px),
       *               hidden on smaller screens
       * - 'auto'    → sidebar on `xl+`, inline card below `xl` so phone
       *               and tablet readers still get the navigation
       */
      layout?: 'inline' | 'sidebar' | 'auto';
      /**
       * Which side the sidebar TOC sits on (only applies when `layout` is
       * 'sidebar' or 'auto'). Defaults to 'right'.
       */
      sidebarPosition?: 'left' | 'right';
      /** Minimum headings before the TOC renders (avoid TOCs on short posts) */
      minHeadings?: number;
      /** Deepest heading level to include (2 = H2 only, 3 = H2+H3, etc.) */
      maxDepth?: 2 | 3 | 4;
    };
  };
  /**
   * Blog listing configuration. Counts that were previously hard-coded across
   * `lib/blog.ts` and the route files live here so they're tunable in one
   * place. (The existing `blogImageOverlay` / `articleFeatures` keys are left
   * where they are for backwards compatibility and may fold in at a major.)
   */
  blog?: {
    /**
     * Whether the blog is linked from the site: the Blog item in the header and
     * footer nav, the home page blog section, the footer Topics column and the
     * RSS links. The blog routes build either way. Default true.
     */
    visible?: boolean;
    /** Regular (non-featured) posts shown per blog index page. Default 12. */
    postsPerPage?: number;
    /** How many of the most-used tags to surface in the blog tag cloud. Default 10. */
    tagCloudLimit?: number;
  };
  /** Projects listing configuration. */
  projects?: {
    /** Projects shown per page on the projects listing. Default 12. */
    perPage?: number;
    /** How many of the most-used tags to surface in the projects tag cloud. Default 10. */
    tagCloudLimit?: number;
  };
  /**
   * Internationalization (i18n) — see `src/config/i18n.config.ts`.
   * Lives in a separate file so the i18n module can be imported by
   * unit tests without pulling in `astro:env/server`.
   */
  i18n?: I18nConfig;
  /**
   * Branding configuration
   * Logo files: Replace SVGs in src/assets/branding/
   * Favicon: Replace in public/favicon.svg
   */
  branding: {
    /** Logo alt text for accessibility */
    logo: {
      alt: string;
      /**
       * Optional path to a custom logo image in public/ (e.g. '/logo.svg').
       * When set, it replaces the generated letter-monogram badge in the
       * header, footer, and anywhere <Logo> is rendered — no layout edits
       * needed. Leave unset to keep the monogram. Per-author byline avatars
       * (which pass an explicit letter) are unaffected.
       */
      image?: string;
      /** Path to logo image for structured data (e.g. '/logo.png'). Add a PNG to public/ and set this. */
      imageUrl?: string;
    };
    /** Favicon path (lives in public/) */
    favicon: {
      svg: string;
    };
    /** Theme colors for manifest and browser UI */
    colors: {
      /** Browser toolbar color (hex) */
      themeColor: string;
      /** PWA splash screen background (hex) */
      backgroundColor: string;
    };
  };
}

const siteConfig: SiteConfig = {
  // Read from ./branding so the build-time favicon generator, which cannot
  // import this file, uses the same values. Change them there.
  name: SITE_NAME,
  description:
    // The owner-approved one-line brand description (approved 16 Nov 2026,
    // docs/seo/implementation/brand-description.md). It feeds the
    // Organization and WebSite markup and llms.txt; if it changes, change it
    // in directory profiles and social bios too.
    'PickMySaaS is a founder-led web design studio for Gulf businesses: custom websites and online stores in Arabic and English, at fixed prices.',
  tagline: 'Web design studio for Gulf businesses',
  footerNote: 'Works remotely · Focused on the six Gulf countries',
  url: SITE_URL || SITE_URL_FALLBACK,
  // Generated at build time from `name`, `tagline` and the brand colour below.
  // Point this at a file in `public/` to use your own — it has to be a raster
  // (PNG or JPEG): social platforms don't render SVG share images.
  ogImage: '/og/default.png',
  author: 'PickMySaaS',
  email: 'info@pickmysaas.com',
  // No address on purpose: PickMySaaS works worldwide. Setting one adds a
  // location card to the contact page and a postal address to the
  // structured data.
  // PickMySaaS's public profiles. They feed the structured data's sameAs and
  // the footer's "Find us on" line (named directories and LinkedIn; other
  // URLs go to sameAs only). Add a profile only once it loads logged out: a
  // sameAs link to a page that doesn't exist hurts more than no link. Use the
  // approved brand description (docs/seo/implementation/brand-description.md)
  // as each profile's bio. Entasher is not listed yet: its public page is
  // unconfirmed (22 Nov 2026).
  socialLinks: [
    'https://clutch.co/profile/pickmysaas',
    'https://www.sortlist.com/agency/pickmysaas',
    'https://techbehemoths.com/company/pickmysaas',
    // 'https://www.linkedin.com/company/<your-page>/',
    // 'https://github.com/<your-account>',
    // 'https://x.com/<your-handle>',
    // 'https://www.instagram.com/<your-handle>/',
  ],
  whatsapp: '923495533955',
  contactForm: {
    // Cloudflare Email Routing sends to the verified Gmail behind info@. The
    // address itself is the CONTACT_TO_EMAIL secret on the Worker, not here:
    // this repo is public.
    sendVia: 'cloudflare',
  },
  booking: {
    // "Book a free call" opens this Cal.com event in a popup.
    calLink: 'asfand-yar-khan-o7957h/30min',
  },
  header: {
    // Flip to `true` to show the social icons (incl. GitHub) in the header.
    showSocialLinks: false,
  },
  verification: {
    google: GOOGLE_SITE_VERIFICATION,
    bing: BING_SITE_VERIFICATION,
  },
  // The brand mark, generated at build time from the logo (see src/lib/favicon).
  authorImage: '/apple-touch-icon.png',
  blogImageOverlay: true,
  articleFeatures: {
    toc: {
      enabled: true,
      layout: 'auto',
      sidebarPosition: 'right',
      minHeadings: 3,
      maxDepth: 3,
    },
  },
  blog: {
    // Set in ./blog-visibility.ts, which the sitemap (astro.config.mjs) reads too.
    visible: BLOG_VISIBLE,
    postsPerPage: 12,
    tagCloudLimit: 10,
  },
  projects: {
    perPage: 12,
    tagCloudLimit: 10,
  },
  i18n: i18nConfig,
  branding: {
    logo: {
      alt: 'PickMySaaS',
      // image: '/logo.svg', // Optional: set to a file in public/ to use a custom logo image instead of the letter monogram.
      imageUrl: '/favicon.svg',
    },
    favicon: {
      svg: '/favicon.svg',
    },
    colors: {
      themeColor: THEME_COLOR,
      backgroundColor: '#EEEBE3',
    },
  },
};

export default siteConfig;
