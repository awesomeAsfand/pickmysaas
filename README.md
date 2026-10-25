# PickMySaaS

The website for [PickMySaaS](https://pickmysaas.com), a founder-led product studio building bilingual websites, SaaS platforms and AI-first MVPs for founders and businesses across the GCC.

<p>
  <a href="https://astro.build"><img src="https://img.shields.io/badge/Astro-7.3-bc52ee?logo=astro&logoColor=white" alt="Astro" /></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind-4.3-38bdf8?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" /></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5.7-3178c6?logo=typescript&logoColor=white" alt="TypeScript" /></a>
</p>

- **Live site:** https://pickmysaas.com (Arabic at https://pickmysaas.com/ar)
- **Hosting:** Cloudflare Workers. Every push to `main` deploys.
- **Built on:** the [Astro Rocket](https://github.com/hansmartensdev/astro-rocket) theme by Hans Martens (MIT, see [LICENSE](LICENSE)).

## Getting started

You need:

- **Node.js 22.12.0+**
- **pnpm 10.33.0**

```bash
pnpm install
astro dev --background   # http://localhost:4321
```

Manage the background dev server with `astro dev stop`, `astro dev status` and `astro dev logs`. If a page shows content you have already changed or deleted, stop the server, delete `.astro/data-store.json` and start it again.

If `pnpm build:cloudflare` crashes with "The Workers runtime failed to start" (`std::terminate`) after you've run the site locally with `wrangler dev`, delete the `.wrangler` folder and build again. It only holds local test state.

## Commands

| Command | What it does |
|---|---|
| `pnpm dev` | Start the dev server in the foreground |
| `pnpm build:cloudflare` | Production build for Cloudflare (what the live site runs) |
| `pnpm verify` | Check the build output for broken pages and missing assets |
| `pnpm preview` | Serve the last build locally |
| `pnpm check` | Type-check the project |
| `pnpm lint` | Lint |
| `pnpm format` | Format with Prettier |
| `pnpm test:run` | Run the test suite once |
| `pnpm validate` | Lint, type-check, test, build and verify, in one go |

## Where things live

| To change… | Edit |
|---|---|
| Page copy (English) | `src/i18n/en.json`, under `pages.home`, `pages.about`, `pages.services`, `pages.contact` |
| Arabic copy (every page) | `src/i18n/ar.json`, same keys as `en.json` (a test checks they match) |
| Page layouts | `src/components/pages/views/*View.astro` |
| Projects | `src/content/projects/en/*.mdx`, Arabic in `src/content/projects/ar/*.mdx` (same file names) |
| Blog posts | `src/content/blog/en/*.mdx` |
| Tech-stack logos | `src/content/stack/*.mdx` |
| Site name, email, booking, WhatsApp, blog switch | `src/config/site.config.ts` |
| Header and footer links | `src/config/nav.config.ts` |

### Settings in `site.config.ts`

- `email`: the address shown on the site (info@pickmysaas.com).
- `booking.calLink`: the Cal.com event every "Book a free call" button opens as a popup. Remove it and the buttons go to `/contact`.
- `whatsapp`: the number for the WhatsApp buttons, digits only. Remove it and the buttons disappear.
- `contactForm.sendVia`: how the contact form sends (`cloudflare`, see below).
- `blog.visible`: whether the blog is part of the site. It's set in `src/config/blog-visibility.ts`, so the sitemap can read it too. It stays `false` until the first real post is published, and while it's off the blog is left out of the header, footer, home page, RSS links and sitemap. Flip `BLOG_VISIBLE` to `true` when posts exist.

## Languages

The whole site is in English (at `/`) and Arabic (under `/ar`, right to left). Every page has both versions, linked by the EN/AR switch in the header and by `hreflang` tags for search engines.

- **Interface and page copy:** `src/i18n/en.json` and `src/i18n/ar.json`. They must carry exactly the same keys. A test fails if Arabic is missing one, because a missing key would quietly show English on an Arabic page.
- **Projects:** each project has an English file in `src/content/projects/en/` and an Arabic one with the same name in `src/content/projects/ar/`.
- **Blog posts,** once the blog is on: put Arabic posts in `src/content/blog/ar/`.
- **The contact form** replies (validation errors, failures) in the language of the page it was sent from.

## Deployment and secrets

Cloudflare builds and deploys every push to `main`. The Worker's settings come from `wrangler.toml`. Anything changed only in the dashboard is overwritten on the next deploy, **except secrets**.

| Name | Where | Purpose |
|---|---|---|
| `CONTACT_TO_EMAIL` | Cloudflare → Worker → Settings → Variables and Secrets, as a **Secret** | Where contact-form messages are sent. It must be a verified destination address in Cloudflare Email Routing. This repo is public, so it is never committed. |
| `PUBLIC_GA_MEASUREMENT_ID` | `.env.production` (committed; public by nature) | Google Analytics 4. Production builds only, so local testing never shows up in analytics. |
| `SITE_URL` | optional | The site's address. Falls back to `https://pickmysaas.com` (`src/config/site-url.ts`). |

### Contact form

The form sends a notification through the Worker's `EMAIL` send binding (`wrangler.toml`), from `website@pickmysaas.com` to `CONTACT_TO_EMAIL`. Sending to a verified Email Routing address is free on every Cloudflare plan. Replying to the notification answers the visitor directly.

If it fails, the Worker logs (dashboard → Observability) name exactly what's missing.

## Credits

Built on [Astro Rocket](https://github.com/hansmartensdev/astro-rocket) by Hans Martens, released under the MIT licence. The theme's copyright notice is kept in [LICENSE](LICENSE).
