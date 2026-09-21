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
| `<LinchpinAdminNav>` | The vertical section menu down the left. Items may carry an icon and a badge. | `items`, `current`, `currentHref`, `onNavigate`, `linkComponent`, `header`, `footer`, `ariaLabel` |
| `<LinchpinBreadcrumbs>` | The trail above a nested screen. | `items`, `headingLevel`, `linkComponent`, `ariaLabel` |
| `<LinchpinAdminLayout>` | The body: up to three columns — menu, work, help. | `nav`, `sidebar`, `label` |
| `<SettingsCard>` | A section of a settings screen: heading, one sentence, controls. | `title`, `description`, `headingLevel`, `actions`, `size` |
| `<DangerZone>` | The panel that holds irreversible controls. | `title`, `description`, `warning`, `status`, `actions` |
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

### Width and spacing

The screen uses the width it is given. There is no max-width on the shell — an admin screen is
not an article, and a cap left several hundred pixels of empty grey beside the work on a wide
window. The page panel runs edge to edge under the brand bar, and there is exactly one inset
inside it: `--lp-admin-gutter`, core's `--wpds-dimension-padding-lg` (16px), which is also the
space `Page` leaves above and below its own header and body. The top bar, the page's header
and body, the footer, and a layout composed outside the page all take it, so the plugin's mark
in the bar sits directly above the title beneath it and nothing is inset twice. A plugin that
wants more can raise it on `.lp-admin`.

Two spacing defaults differ from core's, both because core's assume a context this library
does not have:

- **`hasPadding` is on, and inset by the gutter.** `Page` ships it off while padding its own
  header, so a screen that takes the default gets an indented title above a body flush with
  the panel edge, and the first card jammed under the tab strip. Core pads both by 24px
  inline; the chrome brings that back to the gutter. Pass `hasPadding={ false }` for a
  full-bleed body — a table, a data view.
- **The main column is a flex column with a gap.** Core's `Card` carries no margin, so two
  stacked cards sat flush against each other and every screen added a one-off `marginTop`. The
  aside always worked this way; the main column does now too.

### Breadcrumbs are ours, and that is not a preference

`Breadcrumbs` from `@wordpress/admin-ui` renders every item through `@wordpress/route`, which
is TanStack Router. Each link calls `useRouter()`, gets `null` without a `RouterProvider`
above it, and takes the screen down with `Cannot read properties of null (reading 'stores')`.
It also throws if any item but the last omits `to`, so there is no prop-shaped way out.

A wp-admin settings screen served from `admin.php?page=…` has no client router, and mounting
one so a header can draw two words and a slash is the wrong trade. `<LinchpinBreadcrumbs>`
renders the same shape as plain links. A screen that genuinely runs a router can pass core's
component to `breadcrumbs` instead — the prop takes any node.

`Page` puts breadcrumbs *beside* the title rather than above it, so a screen showing both says
the plugin's name twice. Pass `title={ null }` and `headingLevel={ 1 }` to let the trail carry
the heading.

### Settings sections

`<SettingsCard>` is the most-repeated shape on any settings screen — a heading, a sentence
saying what the section is for, and the controls — and it was the last one every plugin still
built by hand out of a `Card`, a `CardHeader` with an `h2` and a `p`, and a `CardBody`.

It is a composition, not a new primitive. Core's `Card` does the drawing. What the component
adds is the heading arrangement, an `actions` slot in the header, and the rule that controls
in the body are spaced from each other — the `> * + *` margin every screen was rediscovering.

`headingLevel` defaults to `2`, which is right under `<LinchpinAdminPage>`'s `h1`. A card
nested under a section that already has an `h2` passes `3`.

```jsx
<SettingsCard
	title="Expiration"
	description="Which lifetimes a sender may choose, and which is pre-selected."
>
	<CheckboxControl … />
	<SelectControl … />
</SettingsCard>
```

### The danger zone

Every plugin grows one — uninstall behaviour, reset settings, purge a log, disconnect a site —
and each drew it differently. Psst's uninstall toggle was an ordinary card, indistinguishable
from the settings above it; Mantle's reset was a card with a standing error notice and a
destructive button. Mantle was right, so `<DangerZone>` is Mantle's shape with the varying
parts as props.

It stays a panel: a stroke, a tinted head and one standing warning. Enough to read differently
at a glance, not so much that a screen with two of them looks like a failure state. The stroke
is the design system's *strong* error token at 2px, on all four sides — at 1px in the ordinary
error colour the panel read as a card with a faintly pink header rather than as the one
section on the screen that can destroy something.

The standing warning is rendered but **not announced**. `Notice` speaks its children on mount,
and an `error` status speaks them assertively, so the panel interrupted a screen reader on
every page load to read a sentence that had not changed and was already on screen. It
describes a risk; it does not report an event. Announcing belongs to whatever the plugin's
destructive action actually does.

It does not confirm anything on the plugin's behalf — whether an action needs a modal, a typed
confirmation or nothing depends on what it destroys. Put the buttons in `actions`, carrying
`isDestructive`, and own the consequences.

```jsx
<DangerZone
	title="Uninstall"
	description="What Psst leaves behind when the plugin is deleted."
	warning="Deleting the plugin with this on removes every stored secret."
>
	<ToggleControl __nextHasNoMarginBottom label="Delete all secrets on uninstall" … />
</DangerZone>
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

Each item may carry an `icon`, which is how Mantle's menu reads at a glance:

```jsx
import { cog, grid, shield } from '@wordpress/icons';

const SECTIONS = [
	{ name: 'dashboard', label: 'Dashboard', href: '#dashboard', icon: grid },
	{ name: 'security', label: 'Security', href: '#security', icon: shield },
	{ name: 'settings', label: 'Settings', href: '#settings', icon: cog },
];
```

The plugin supplies the artwork — this is the agency's chrome, not an icon set — in whatever
form it has: an `@wordpress/icons` export, a component of its own, or a dashicon name. All
three are sized to a 24px box and painted in the row's own colour, so the selected row gets an
inverted icon without being told.

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
| `<LinchpinLogo>` | Two variants — `full` (the lockup) and `mark` (the brandmark) — and the brand's four tones: `primary`, `on-dark`, `white` and `black`. A fifth, `mono`, paints in `currentColor` for the top bar, whose colour the plugin chose. Artwork is generated from the brand file, so there is no SVGR loader and no runtime `plugin_url` lookup. **There is no recolouring hook** — see [the brand contract](../development/brand.md). |
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
