---
title: Components
---

Everything the package exports, and which part of the screen it owns.

## Chrome

| Export | Owns | Notable props |
| --- | --- | --- |
| `<LinchpinAdminFrame>` | The root. Seeds the `ThemeProvider` from the brand, publishes identity/brand/links on context, and does the wp-admin gutter dance. | `plugin`, `brand`, `links`, `topBar`, `cornerRadius`, `isRoot` |
| `<LinchpinAdminTopBar>` | The brand bar: plugin logo left, version and Linchpin mark right. | `logo`, `logoAlt`, `version`, `status` |
| `<LinchpinAdminPage>` | The page header and body — a wrapper around core's `Page`. | `title`, `subTitle`, `breadcrumbs`, `badges`, `visual`, `actions`, `navigation`, `headingLevel`, `hasPadding`, `components` |
| `<LinchpinAdminNav>` | The vertical section menu down the left. | `items`, `current`, `currentHref`, `onNavigate`, `linkComponent`, `header`, `footer`, `ariaLabel` |
| `<LinchpinAdminLayout>` | The body: up to three columns — menu, work, help. | `nav`, `sidebar`, `label` |
| `<LinchpinNotices>` | Snackbars from the `core/notices` store. | `className` |
| `<LinchpinAdminFooter>` | The links row. | `links` |

Only one frame may exist per document: `isRoot` hoists the resolved design tokens to the
document so portalled popovers and snackbars read the same values, and two roots would fight.

### The page header is core's, not ours

`<LinchpinAdminPage>` wraps `Page` from `@wordpress/admin-ui` and adds two things: the title
defaults to the plugin's name, and the version appears as a badge unless the screen passes
`badges={ null }`. Everything else is core's — breadcrumbs, subtitle, badges, a decorative
`visual`, actions, and the section navigation that replaces what three of our plugins each
built as a tab strip.

That is the whole point of the wrapper. `Page` is the shape WordPress is standardising on, so
a screen that uses it inherits every future improvement to admin page structure; a hand-rolled
masthead inherits none of them. If you want the [full header from the Gutenberg
storybook](https://wordpress.github.io/gutenberg/?path=/story/admin-ui-page--full-header) —
breadcrumbs, title, subtitle and tabs together — pass those props and you have it.

`Page`'s navigation is a list of **links**, not tab state, which is right for wp-admin: a
section should be linkable, bookmarkable and survive a save. `sectionNavigation()` builds the
config from a list of sections; `currentSection()` tells the screen which one to render.

```jsx
const SECTIONS = [
	{ name: 'settings', label: 'Settings' },
	{ name: 'secrets', label: 'Secrets' },
	{ name: 'health', label: 'Health' },
];

<LinchpinAdminPage navigation={ sectionNavigation( { sections: SECTIONS } ) }>
	<View section={ currentSection( { sections: SECTIONS } ) } />
</LinchpinAdminPage>
```

### Two levels of navigation

A plugin with three screens needs one level: the tab strip above. A plugin with eight needs
two — Mantle has a vertical menu for Dashboard, Client Info, Monitoring, Plugins & Themes,
Security, Tools and Settings, **and** a tab strip inside a screen for its subsections, so
Security carries Admin and Frontend under it.

Both exist here, and they compose in that order: the menu is a column of the layout, and the
tabs belong to the page inside it.

```jsx
<LinchpinAdminFrame plugin={ PLUGIN } brand={ BRAND } topBar={ <LinchpinAdminTopBar /> }>
	<LinchpinAdminLayout
		nav={
			<LinchpinAdminNav
				items={ SECTIONS }
				current={ current }
				onNavigate={ setCurrent }
				header={ <ClientCard /> }
			/>
		}
		sidebar={ <HelpCard /> }
	>
		<LinchpinAdminPage title="Security" navigation={ SUBSECTION_TABS }>
			{ /* the screen */ }
		</LinchpinAdminPage>
	</LinchpinAdminLayout>
</LinchpinAdminFrame>
```

Note the nesting is the other way round from a screen with no menu, where the page wraps the
layout. Both are fine: they are independent components, and which contains which is decided
by whether the menu should sit beside the page header or below it. Beside, for a menu.

The menu is **links**, for the same reason the tabs are — with one refinement Mantle learned:
a modified click (⌘, Ctrl, Shift, middle) is left to the browser even when `onNavigate` is
routing in-app, or the address each row advertises becomes a lie. Pass `linkComponent` to
render a router link instead of an `<a>`.

The columns a layout renders are the ones it is given. Below 1400px the help column goes
first, because it is context rather than the work; below 782px the menu stacks above the
screen rather than squeezing it.

## Sidebar cards

| Export | Owns | Takes copy? |
| --- | --- | --- |
| `<FeatureListCard>` | A short explainer list, each line with an icon. | Yes — it is the plugin's own explanation. |
| `<HelpCard>` | Where to get help. | Yes — support routing genuinely differs per plugin. |
| `<AboutLinchpinCard>` | Who makes this. | **No.** |
| `<AboutLinchpinPage>` | The standard About Linchpin page. | **No.** |

## Primitives

| Export | Notes |
| --- | --- |
| `<LinchpinLogo>` | Two variants — `full` (the lockup) and `mark` (the brandmark) — and five tones: the brand's `primary`, `on-dark`, `white` and `black`, plus `mono`, which paints in `currentColor` so the logo inherits the colour of the bar it sits on. Artwork is generated from the brand file, so there is no SVGR loader and no runtime `plugin_url` lookup. Recolour with `--lp-logo-ink` and `--lp-logo-accent`. |
| `<VersionBadge>` | Adds the `v`, once. Renders nothing without a version. |

## Helpers

| Export | Notes |
| --- | --- |
| `defineBrand()` | Validates and freezes a brand. See [the brand contract](../development/brand.md). |
| `brandStyle()` | A brand as `--lp-brand-*` custom properties. |
| `linchpinLinks()` | The standard links, UTM-tagged with the plugin slug. |
| `useAdminContext()` | Identity, brand and links from the nearest frame. |
| `usePlatformStatus()` | Polls status.linchpin.com. Opt-in; reports `unknown` rather than `down` when a request fails. |
| `sectionNavigation()` | Builds `Page`'s `navigation` config, varying one query argument and keeping the rest of the URL. |
| `currentSection()` | Which section the URL asks for, falling back to the first. |
| `LINCHPIN_COLORS`, `colorVar()`, `colorVars()` | The agency palette, and the `--lp-color-*` properties that carry it. |
| `aboutBlurb()`, `aboutPageCopy()` | The agency copy, read-only. |
