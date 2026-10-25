/**
 * Tag-slug conventions shared across content types (blog, projects).
 *
 * Kept here — rather than inside `lib/blog` — so blog and project tag
 * archives derive identical, collision-free slugs from the same rules.
 */

/**
 * Convert a human-readable tag (e.g. "Web Performance") to a URL slug
 * (e.g. "web-performance"). Two-way deterministic — pair with `findTagBySlug`.
 *
 * Letters from any script are kept, so an Arabic tag ("منصة أدلة") gets an
 * Arabic slug ("منصة-ادلة") rather than an empty one. Combining marks are
 * dropped: Latin accents ("café" → "cafe") and the Arabic hamza and vowel
 * signs that NFKD splits off.
 */
export function tagToSlug(tag: string): string {
  return tag
    .toLowerCase()
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}

/** Find the original tag string given its slug, from a list of known tags. */
export function findTagBySlug(slug: string, allTags: string[]): string | undefined {
  return allTags.find((tag) => tagToSlug(tag) === slug);
}
