/**
 * Homepage images and placeholders.
 *
 * The homepage design has image slots (phone screenshots, a founder portrait,
 * service screenshots and so on). A slot is filled by dropping an image into
 * `src/assets/home/` named after the slot id, e.g. `founder-portrait.jpg`.
 * A locale-specific file wins over the shared one: `hero-desktop-ar.png` is
 * used on the Arabic homepage, `hero-desktop.png` everywhere else. The full
 * list of slot ids is in `src/assets/home/README.md`.
 *
 * Copy that isn't real yet is written in the locale files with square
 * brackets, e.g. "[Client name]". Empty slots and bracketed copy show as
 * placeholders in `astro dev` so the layout can be reviewed, and are left out
 * of production builds, so the live site never shows a placeholder.
 */
import type { ImageMetadata } from 'astro';

const files = import.meta.glob<{ default: ImageMetadata }>('/src/assets/home/*.{png,jpg,jpeg,webp,avif}', {
  eager: true,
});

const byName = new Map<string, ImageMetadata>(
  Object.entries(files).map(([path, mod]) => [
    path
      .split('/')
      .pop()!
      .replace(/\.[^.]+$/, ''),
    mod.default,
  ])
);

/** True in `astro dev`: placeholders are shown. False in a production build. */
export const SHOW_PLACEHOLDERS = import.meta.env.DEV;

/** The image for a slot, preferring the locale's own version. */
export function homeImage(id: string, locale?: string): ImageMetadata | undefined {
  return (locale && byName.get(`${id}-${locale}`)) || byName.get(id);
}

/**
 * Inline `aspect-ratio` for a frame that should take its image's own shape,
 * so a screenshot shows in full instead of being cropped to the design's
 * ratio. Undefined (keep the CSS ratio) when the slot has no image.
 */
export function slotAspect(id: string, locale?: string, fallback?: ImageMetadata): string | undefined {
  const image = homeImage(id, locale) ?? fallback;
  return image ? `aspect-ratio: ${image.width} / ${image.height}` : undefined;
}

/** Copy still waiting for real content: anything with a "[...]" in it. */
export function isPlaceholder(value: string | undefined | null): boolean {
  return !value || /\[[^\]]+\]/.test(value);
}

/** Whether to render a piece of copy: always when real, only in dev when a placeholder. */
export function showCopy(value: string | undefined | null): boolean {
  return !isPlaceholder(value) || SHOW_PLACEHOLDERS;
}

/** Whether to render an image slot: when it has an image, or in dev as a placeholder. */
export function showSlot(id: string, locale?: string): boolean {
  return Boolean(homeImage(id, locale)) || SHOW_PLACEHOLDERS;
}
