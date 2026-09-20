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
| `<LinchpinAdminLayout>` | The two-column body. One column below 1100px, or when there is no sidebar. | `sidebar`, `label` |
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
| `<LinchpinLogo>` | Two variants: `full` (the lockup) and `mark` (the mark alone). Two tones: `brand` paints the ink in Linchpin blue and the swooshes in the brand cyan, `mono` paints everything in `currentColor` — which is what the top bar wants. Path data ships inside the package, so there is no SVGR loader and no runtime `plugin_url` lookup. Recolour with `--lp-logo-ink` and `--lp-logo-accent`. |
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
