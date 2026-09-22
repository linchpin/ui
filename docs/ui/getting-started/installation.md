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

The specifier is `style.css`; the file behind it is `build-style/chrome.css`, and that is
deliberate. `@wordpress/scripts` carries a `splitChunks` cache group matching any module whose
file is named `style.css` — the mechanism that separates a block's front-end styles from its
editor ones — and it routes every match into its own `style-<entry>.css`. A library stylesheet
named `style.css` therefore leaves the plugin's bundle for a file the plugin does not enqueue,
and the screen loads with no chrome on it. Naming the file something else fixes that for every
consumer with no webpack configuration at all.

If you are pinned to an older version that still ships `build-style/style.css`, switch the
cache group off in the plugin's `webpack.config.js` — an admin entry has no blocks to split:

```js
optimization: {
	...defaultConfig.optimization,
	splitChunks: {
		...defaultConfig.optimization.splitChunks,
		cacheGroups: {
			...defaultConfig.optimization.splitChunks.cacheGroups,
			style: false,
		},
	},
},
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

The SCSS source is published too, at `@linchpinagency/ui/style.scss` (or `chrome.scss`, the
same file), for a plugin that compiles its own bundle and wants the chrome inside it.

## WordPress floor

WordPress **6.9**. That is where the design system tokens (`--wpds-*`) and
`@wordpress/theme` land. Mantle runs 7.1 and is unaffected.
