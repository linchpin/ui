---
title: Installation
---

```bash
npm install @linchpinagency/ui
```

## Peer dependencies

Every `@wordpress/*` import is a **peer dependency**, and must stay one.

`@wordpress/dependency-extraction-webpack-plugin` lists `@wordpress/admin-ui`,
`@wordpress/ui`, `@wordpress/icons`, `@wordpress/dataviews`, `@wordpress/fields`,
`@wordpress/grid` and `@wordpress/views` in `BUNDLED_PACKAGES` and returns `undefined` for
them, which means they are bundled into the consuming plugin rather than mapped to a `wp.*`
global. A nested copy inside this package would therefore ship those bytes twice **and** fork
the `ThemeProvider` context, so a popover portalled out of the tree would read different
tokens from the screen behind it.

If npm reports a peer conflict, fix the plugin's own `@wordpress/*` versions. Do not add the
packages as dependencies here.

## The stylesheet

```js
import '@linchpinagency/ui/style.css';
```

The compiled CSS must load **after** `wp-components`, so core's rules land first. Declare it
when enqueuing:

```php
wp_enqueue_style(
	'psst-admin',
	PSST_URL . 'build/admin.css',
	[ 'wp-components' ],
	PSST_VERSION
);
```

The SCSS source is published too, at `@linchpinagency/ui/style.scss`, for a plugin that
compiles its own bundle and wants the chrome inside it.

## WordPress floor

WordPress **6.9**. That is where the design system tokens (`--wpds-*`) and
`@wordpress/theme` land. Mantle runs 7.1 and is unaffected.
