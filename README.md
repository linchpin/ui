# Linchpin UI

Linchpin's admin component library for WordPress plugins — the chrome and the brand, on top of `@wordpress/admin-ui`.

See [CHANGELOG.md](CHANGELOG.md) for release history.

<!-- x-release-please-start-version -->
## Latest Release: 0.1.0
<!-- x-release-please-end -->

| Workflow | Status |
|----------|--------|
| Release | ![Release Status](https://github.com/linchpin/ui/actions/workflows/release-please.yml/badge.svg) |
| JavaScript | ![JavaScript Status](https://github.com/linchpin/ui/actions/workflows/js.yml/badge.svg) |

---

## What this is

Every Linchpin plugin was building the same admin screen: a branded top bar with the plugin's
logo, its version and the Linchpin mark; a page header; tabs; a two-column body with a help
sidebar; an About Linchpin card. Mantle, Psst and linchpin-blocks each arrived at that
arrangement separately, and each carried its own copy of it.

This package is that arrangement, once. It is a thin layer **on top of** core — components
come from `@wordpress/components`, `@wordpress/ui` and `@wordpress/admin-ui`, and what lives
here is the Linchpin-specific chrome and the brand contract that makes a plugin look like
ours.

It is not a design system. It does not re-implement buttons, cards, form controls or tables,
and it does not rebuild the page header: `<LinchpinAdminPage>` wraps core's `Page`, so the
[full header](https://wordpress.github.io/gutenberg/?path=/story/admin-ui-page--full-header)
— breadcrumbs, title, subtitle, badges, actions and section navigation — is the one WordPress
is standardising on.

## Install

```bash
npm install @linchpinagency/ui
```

Every `@wordpress/*` package is a **peer dependency**. The consuming plugin already has them,
and `@wordpress/dependency-extraction-webpack-plugin` bundles rather than externalises
`admin-ui`, `ui` and `icons` — so a nested copy would double the bytes *and* fork the
`ThemeProvider` context. Never add them as dependencies of this package.

## Use

```jsx
import {
	AboutLinchpinCard,
	currentSection,
	defineBrand,
	HelpCard,
	LinchpinAdminFooter,
	LinchpinAdminFrame,
	LinchpinAdminLayout,
	LinchpinAdminPage,
	LinchpinAdminTopBar,
	LinchpinNotices,
	sectionNavigation,
} from '@linchpinagency/ui';
import '@linchpinagency/ui/style.css';

const BRAND = defineBrand( {
	primary: '#318873',
	deep: '#082318',
	deepEnd: '#164a3b',
} );

const PLUGIN = { name: 'Psst', slug: 'psst', version: window.psstAdmin.version };

const SECTIONS = [
	{ name: 'settings', label: 'Settings' },
	{ name: 'secrets', label: 'Secrets' },
	{ name: 'health', label: 'Health' },
];

function App() {
	return (
		<LinchpinAdminFrame
			plugin={ PLUGIN }
			brand={ BRAND }
			topBar={ <LinchpinAdminTopBar logo={ <PsstLogo /> } /> }
		>
			<LinchpinAdminPage
				subTitle="One-time secrets, encrypted in the browser."
				navigation={ sectionNavigation( { sections: SECTIONS } ) }
				actions={
					<Button variant="primary" href={ createUrl }>
						Share a secret
					</Button>
				}
			>
				<LinchpinNotices />

				<LinchpinAdminLayout
					label="About Psst"
					sidebar={
						<>
							<HelpCard />
							<AboutLinchpinCard />
						</>
					}
				>
					<View section={ currentSection( { sections: SECTIONS } ) } />
				</LinchpinAdminLayout>
			</LinchpinAdminPage>

			<LinchpinAdminFooter />
		</LinchpinAdminFrame>
	);
}
```

The stylesheet must load after `wp-components`. Declare it as a dependency when enqueuing:

```php
wp_enqueue_style(
	'psst-admin',
	PSST_URL . 'build/admin.css',
	[ 'wp-components' ],
	PSST_VERSION
);
```

## Two rules worth knowing before you start

**No hex in a component.** Colour comes from a `--wpds-*` design token, from the agency
palette the frame publishes as `--lp-color-*`, or from the `--lp-brand-*` properties it sets
out of `defineBrand()`. A plugin recolours itself by changing its brand object, nothing else;
Linchpin blue is the default when it names nothing.

**The About Linchpin copy is fixed.** `<AboutLinchpinPage>` and `<AboutLinchpinCard>` take no
copy props. The wording is marketing, it gets revised, and the point of the component is that
a revision reaches every plugin through a version bump instead of one pull request per
repository. `<HelpCard>` is the exception and takes props — support routing genuinely differs
per plugin.

## Development

```bash
npm install
npm run build          # babel to build-module/, sass to build-style/
npm test               # jest + @testing-library/react
npm run lint:js
npm run lint:css
npm run storybook      # the components, rendered
```

Docs live in [`docs/ui`](docs/ui) and publish to docs.linchpin.com. Storybook shows what a
component looks like; the docs say what we have decided about it. Neither restates the other.

## License

GPL-2.0-or-later. © Linchpin.

![Linchpin an award winning digital agency building immersive, high performing web experiences](https://assets.linchpin.com/github/linchpin-github-repo-banner.jpg)
