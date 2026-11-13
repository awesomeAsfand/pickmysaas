# Homepage images

Drop an image in this folder, named after its slot, and it appears on the
homepage. PNG, JPG, WebP or AVIF all work. Astro resizes and compresses them,
so export at about 2× the size shown.

Add `-ar` before the extension for an Arabic-only version, for example
`hero-desktop-ar.png`. The Arabic homepage uses it instead of the shared file.

Until a slot has an image, `astro dev` shows a dashed placeholder with the slot
name, and production leaves the slot out (the hero's desktop screenshot and the
project screenshots fall back to the existing project images).

| File name | Where it appears | Shape |
| --- | --- | --- |
| `hero-desktop` | Hero, browser frame | 16:9 desktop screenshot |
| `hero-phone-en` | Hero, left phone | 9:19.5 phone screenshot, English |
| `hero-phone-ar` | Hero, right phone | 9:19.5 phone screenshot, Arabic |
| `work-gulfnurseries-desktop` | GulfNurseries card, browser frame (defaults to the project screenshot) | 16:10 |
| `work-gulfnurseries-mobile` | GulfNurseries card, phone | 9:19.5 |
| `work-gulfnurseries-1` … `-3` | GulfNurseries thumbnails: map search, nursery page, owner plans | 4:3 |
| `work-healing-with-attia-desktop` / `-mobile` / `-1` … `-3` | Healing with Attia card: services, WhatsApp booking, blog | as above |
| `work-shop-desktop` / `-mobile` / `-1` … `-3` | E-commerce concept card: catalogue, product page & cart, collection page (dev only until its copy is filled in). | as above |
| `svc-web`, `svc-shop`, `svc-saas`, `svc-mvp` | Service cards | 5:4 |
| `cta-founder` | Final call to action, small round photo | Square |

Thumbnail captions and all the homepage wording live in `src/i18n/en.json` and
`src/i18n/ar.json` under `pages.home`. Anything written in square brackets,
like `[Client name]`, is a placeholder: it shows in dev and is hidden in
production until you replace it.
