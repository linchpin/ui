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
