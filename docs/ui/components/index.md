---
title: Components
---

Everything the package exports, and which part of the screen it owns.

## Chrome

| Export | Owns | Notable props |
| --- | --- | --- |
| `<LinchpinAdminFrame>` | The root. Seeds the `ThemeProvider` from the brand, publishes identity/brand/links on context, and does the wp-admin gutter dance. | `plugin`, `brand`, `links`, `topBar`, `cornerRadius`, `isRoot` |
| `<LinchpinAdminTopBar>` | The brand bar: plugin logo left, version and Linchpin mark right. | `logo`, `version`, `status` |
| `<LinchpinAdminMasthead>` | Title, description, actions. Actions are children. | `title`, `description` |
| `<LinchpinAdminLayout>` | The two-column body. One column below 1100px, or when there is no sidebar. | `sidebar`, `label` |
| `<LinchpinAdminTabs>` | Tabs that survive a reload, through `?tab=`. | `tabs`, `remember`, `queryArg`, `initialTabName`, `onSelect` |
| `<LinchpinNotices>` | Snackbars from the `core/notices` store. | `className` |
| `<LinchpinAdminFooter>` | The links row. | `links` |

Only one frame may exist per document: `isRoot` hoists the resolved design tokens to the
document so portalled popovers and snackbars read the same values, and two roots would fight.

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
| `<LinchpinLogo>` | `variant="mono"` paints in `currentColor`; `variant="primary"` gives the mark its accent. Path data ships inside the package — no SVGR loader, no runtime `plugin_url` lookup. |
| `<VersionBadge>` | Adds the `v`, once. Renders nothing without a version. |

## Helpers

| Export | Notes |
| --- | --- |
| `defineBrand()` | Validates and freezes a brand. See [the brand contract](../development/brand.md). |
| `brandStyle()` | A brand as `--lp-brand-*` custom properties. |
| `linchpinLinks()` | The standard links, UTM-tagged with the plugin slug. |
| `useAdminContext()` | Identity, brand and links from the nearest frame. |
| `usePlatformStatus()` | Polls status.linchpin.com. Opt-in; reports `unknown` rather than `down` when a request fails. |
| `tabFromUrl()`, `rememberTab()` | The tab persistence, if you are not using `<LinchpinAdminTabs>`. |
| `aboutBlurb()`, `aboutPageCopy()` | The agency copy, read-only. |
