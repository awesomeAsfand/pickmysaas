# PickMySaaS

The website for [PickMySaaS](https://pickmysaas.com), a founder-led product studio building bilingual websites, SaaS platforms and AI-first MVPs for founders and businesses across the GCC.

<p>
  <a href="https://astro.build"><img src="https://img.shields.io/badge/Astro-7.3-bc52ee?logo=astro&logoColor=white" alt="Astro" /></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind-4.3-38bdf8?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" /></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5.7-3178c6?logo=typescript&logoColor=white" alt="TypeScript" /></a>
</p>

- **Live site:** https://pickmysaas.com (Arabic home page at `/ar`)
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
| Arabic home page copy | `src/i18n/ar.json` |
| Page layouts | `src/components/pages/views/*View.astro` |
| Projects | `src/content/projects/en/*.mdx` (Arabic card text in `src/content/projects/ar/`) |
| Blog posts | `src/content/blog/en/*.mdx` |
| Tech-stack logos | `src/content/stack/*.mdx` |
| Site name, email, booking, WhatsApp, blog switch | `src/config/site.config.ts` |
| Header and footer links | `src/config/nav.config.ts` |

### Settings in `site.config.ts`

- `email`: the address shown on the site (info@pickmysaas.com).
- `booking.calLink`: the Cal.com event every "Book a free call" button opens as a popup. Remove it and the buttons go to `/contact`.
- `whatsapp`: the number for the WhatsApp buttons, digits only. Remove it and the buttons disappear.
- `contactForm.sendVia`: how the contact form sends (`cloudflare`, see below).
- `blog.visible`: `false` until the first real post is published. While it's off, the blog is left out of the header, footer, home page and RSS links. Flip it to `true` when posts exist.

## Languages

English is the default. Only the home page has an Arabic version (`/ar`, right to left), built from `src/i18n/ar.json`. Full-site translation (`i18n.config.ts` → `enabled`) stays off, so no other page gets a half-translated `/ar/...` copy. Turning it on would build every page in Arabic, which needs every page's copy translated first.

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
