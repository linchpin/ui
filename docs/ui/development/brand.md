---
title: Brand contract
---

A plugin names its colours once:

```js
import { defineBrand } from '@linchpinagency/ui';

export const BRAND = defineBrand( {
	primary: '#318873',   // seeds the whole design system
	deep: '#082318',      // top bar gradient, left stop
	deepEnd: '#164a3b',   // top bar gradient, right stop
	mint: '#5beece',      // the plugin's own vocabulary, if it has one
} );
```

## What each key does

`primary` is the seed. `<LinchpinAdminFrame>` hands it to `@wordpress/theme`'s
`ThemeProvider`, which derives every interactive colour ramp from it — which is why a plugin
only has to name one colour to look like itself.

`deep` and `deepEnd` are the top bar's gradient stops. A brand that gives only `deep` gets a
flat bar; the library will not invent a second stop on a plugin's behalf.

Any other key becomes a custom property too, so a plugin can carry its own names and use them
in its own stylesheet.

## Why not the admin colour scheme

`getAdminThemeColors()` exists, and a plugin may seed from it instead. We do not, by default:
the top bar is a fixed brand gradient, so following the user's profile colour puts a
stranger's accent directly beneath the plugin's own. Mantle made the same call.

## The agency palette

A plugin's brand is one thing; Linchpin's own colours are another. The palette lives in
`src/brand/colors.js` — Linchpin blue `#3FC1D0` and Linchpin black `#031E1E` — and the frame
publishes it as `--lp-color-*` alongside the plugin's `--lp-brand-*`. The logo paints from it,
and a plugin that names no brand inherits it.

Linchpin blue reads as a cyan, and there is exactly one of it. An earlier draft of this
package carried a second, invented navy under the name `blue` and called `#3FC1D0` the accent;
if you find that anywhere, it is wrong.

### The agency palette is not a theming hook

`--lp-color-*` is published so a screen can reference the palette in its own CSS instead of
copying a hex out of this package. It is not an invitation to repaint it, and the library
ships nothing that helps: the logo carried a `--lp-logo-ink` / `--lp-logo-accent` pair for
exactly that, and it has been removed.

The reasoning is not stylistic. The mark says who built the plugin. A site that recolours it
is attributing our work to someone else's palette, and an escape hatch we ship is an escape
hatch we have endorsed. A screen that needs the mark in one colour asks for the `white` or
`black` tone, which the brand defines for that purpose.

What a *plugin* may recolour is its own brand — `defineBrand()`, above — which is the whole
point of the two being separate.

## The logo's artwork

`src/components/logo-artwork.js` is generated from the brand file by
`scripts/import-logo.mjs` — export the `style=Primary` member of each variant set and re-run
it. The script reads the fills to decide which paths are ink and which are the ring, which is
why the Primary style specifically is the one to export. Every tone shares that geometry.

The four tones a screen may ask for are `primary`, `on-dark`, `white` and `black`. There is a
fifth, `mono`, which paints in `currentColor`; it exists for the top bar, whose colour the
plugin chose and where neither white nor black is a safe guess. It is not a brand style, and
it is not in the Storybook examples.

Nothing in the library carries a hex. Where a value is unavoidable — white on the brand bar —
it appears as the fallback inside a `var()`, so the property still wins.

## Custom properties

`brandStyle()` kebab-cases the keys, so the brand above reaches CSS as:

```css
--lp-brand-primary: #318873;
--lp-brand-deep: #082318;
--lp-brand-deep-end: #164a3b;
--lp-brand-mint: #5beece;
```

The frame sets them on its root element. **No component carries a hex value**: colour is a
`--wpds-*` design token, or one of these.
