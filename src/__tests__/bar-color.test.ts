/**
 * Holds the home page's toolbar colour to one value in the two places that
 * carry it.
 *
 * Safari on iOS floats a translucent toolbar over the foot of the screen and
 * tints it from the BODY's background. The home page's hero is a dark gradient
 * in both colour modes, so in light mode the body underneath is white and a
 * white strip was drawn across the foot of the hero.
 *
 * Two copies, because each is read by something that cannot see the other:
 *
 *   1. `data-bar-color` on the hero, whose VALUE the theme script paints onto
 *      the body while the hero covers the bottom edge of the screen. Read with
 *      getAttribute rather than out of the cascade, which is not reliable for a
 *      custom property on iOS Safari.
 *   2. `--bar-color` in the homepage stylesheet, which is the hero's base
 *      colour under its glows. This is the one the other is meant to match:
 *      the toolbar is right when it carries the colour the hero actually
 *      finishes on.
 *
 * `theme-color` is not one of them — that tag does not reach this surface.
 *
 * Nothing else ties these two together, so this does.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const read = (p: string) => readFileSync(join(process.cwd(), p), 'utf8');

const HOME = 'src/components/pages/views/HomeView.astro';
const LAYOUT = 'src/layouts/BaseLayout.astro';
const HOME_CSS = 'src/styles/home-premium.css';

/** The hero's `.hp-hero { … }` rule. */
function heroRule(): string {
  const block = read(HOME_CSS).match(/\.hp-hero\s*\{([^}]*)\}/);
  expect(block, `${HOME_CSS} declares .hp-hero`).not.toBeNull();
  return block![1];
}

/** The hero's base colour, which the attribute is a copy of. */
function stylesheetValue(): string {
  const found = heroRule().match(/--bar-color\s*:\s*([^;]+);/);
  expect(found, '.hp-hero declares --bar-color').not.toBeNull();
  return found![1].trim();
}

describe('home page toolbar colour', () => {
  it('the hero finishes on the named colour', () => {
    // Guards the premise rather than the copies: if the hero stopped ending on
    // this colour, the two values would agree with each other and disagree
    // with the page. The last background layer is the solid base under the
    // glows, and it must be the named colour all the way down.
    const background = heroRule().match(/background:\s*([^;]+);/);
    expect(background, 'the hero declares a background').not.toBeNull();
    expect(background![1].trim()).toMatch(/var\(--bar-color\)\s*100%\)$/);
  });

  it('the hero attribute carries the same value', () => {
    const found = read(HOME).match(/data-bar-color="([^"]+)"/);
    expect(found, `${HOME} sets data-bar-color`).not.toBeNull();
    expect(found![1]).toBe(stylesheetValue());
  });

  it('the attribute is a value, not a bare flag', () => {
    // A bare `data-bar-color` renders as "true", which the script would paint
    // onto the body verbatim. It reads the attribute rather than the cascade,
    // so nothing else would catch it.
    expect(read(HOME)).not.toMatch(/data-bar-color(?=[\s>])/);
  });

  it('the script reads the attribute rather than the cascade', () => {
    const layout = read(LAYOUT);
    expect(layout).toMatch(/'data-bar-color-light' : 'data-bar-color'/);
    expect(layout).toMatch(/getAttribute\(attr\)/);
    expect(layout).not.toMatch(/getPropertyValue\('--bar-color'\)/);
  });

  it('in light mode the hero ends on white and nothing is painted', () => {
    // The hero is light in light mode, the same white as the body, so the
    // light attribute is empty: painting the dark value there would draw a
    // dark strip under a white page.
    const light = read(HOME_CSS).match(/html:not\(\.dark\) \.hp-hero\s*\{([^}]*)\}/);
    expect(light, 'home-premium.css has a light-mode hero rule').not.toBeNull();
    expect(light![1]).toMatch(/--bar-color\s*:\s*#ffffff\s*;/);
    expect(read(HOME)).toMatch(/data-bar-color-light=""/);
  });

  it('switching colour mode repaints', () => {
    const layout = read(LAYOUT);
    expect(layout).toMatch(/new MutationObserver\(onScroll\)/);
  });

  it('the paint is cleared as well as applied', () => {
    // The section stops covering the bottom edge as soon as the page moves. A
    // paint that is never cleared would sit under every section below it.
    const layout = read(LAYOUT);
    expect(layout).toMatch(/addEventListener\('scroll', onScroll/);
    expect(layout).toMatch(/const want = color \|\| '';/);
  });
});
