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
| `<AdminRouter>` | Follows links within one screen without reloading it. | `onChange` |
| `<AdminLink>` | An `<a>` that stays on the screen when it can. | `href`, `replace` |
| `<StatTile>`, `<StatTiles>` | The counts above a list: filters, links or facts. | `value`, `label`, `detail`, `tone`, `href`, `onClick`, `isPressed`, `isLoading`, `footer` |
| `<FactList>` | Read-only label and value pairs. | `items`, `layout` |
| `<FeatureList>` | What something does: icon, name and sentence per line, with no tile around each. | `items`, `columns`, `headingLevel` |
| `<LinchpinAdminLayout>` | The body: up to three columns — menu, work, help. | `nav`, `sidebar`, `label` |
| `<SettingsCard>` | A section of a settings screen: heading, one sentence, controls. | `title`, `description`, `headingLevel`, `actions`, `size` |
| `<DangerZone>` | The panel that holds irreversible controls. | `title`, `description`, `warning`, `status`, `actions` |
| `<LinchpinNotice>` | A notice: the plugin's mark, what it says, and its actions in a column of their own. Also renderable from PHP. | `icon`, `eyebrow`, `title`, `status`, `tone`, `surface`, `variant`, `actions`, `onDismiss` |
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

### A page per record, without a reload

A screen that lists records — sites, clients, packages — eventually wants each record to have
a page of its own: something to bookmark, paste into Slack, open in a second tab or link to
from an alert email. In wp-admin that page is the same screen with the record in the query
string: `admin.php?page=sites&site=35`. What is left is not reloading the whole of wp-admin on
every click.

`<AdminRouter>` does that and nothing else. There is no route table: the screen reads the
query string and renders what it names, as it would on a full load, and the address bar stays
the only state.

```jsx
import {
	AdminLink,
	AdminRouter,
	adminUrl,
	sectionNavigation,
	useAdminLocation,
} from '@linchpinagency/ui';

function Sites() {
	const location = useAdminLocation();
	const site = location.query.get( 'site' );

	if ( site ) {
		return (
			<LinchpinAdminPage
				title={ null }
				breadcrumbs={
					<LinchpinBreadcrumbs
						headingLevel={ 1 }
						linkComponent={ AdminLink }
						items={ [
							{ label: 'Sites', href: adminUrl() },
							{ label: hostname },
						] }
					/>
				}
				components={ { link: AdminLink } }
				navigation={ sectionNavigation( {
					sections: SITE_SECTIONS,
					keep: [ 'site' ],
					location,
				} ) }
			>
				…
			</LinchpinAdminPage>
		);
	}

	return <SitesList renderItemLink={ ( { item, ...props } ) => (
		<AdminLink href={ adminUrl( { site: item.id } ) } { ...props } />
	) } />;
}

<LinchpinAdminFrame plugin={ PLUGIN }>
	<AdminRouter onChange={ () => ( document.title = … ) }>
		<Sites />
	</AdminRouter>
</LinchpinAdminFrame>
```

- **`adminUrl( args, { keep, path, from } )`** builds an address from the screen — its file and
  its `page` — plus the arguments you name. It does **not** carry the rest of the current
  address unless you ask (`keep: [ 'site' ]`, or `keep: true` for all of it), which is what
  stops a search typed on one list arriving as a search on the next. `null`, `false` and `''`
  remove an argument; `path` points at another wp-admin file.
- **`useNavigate()`** follows an address: in place when it is the same screen (same file, same
  `page`), as a normal page load when it is not, so a link to another menu item still gets
  wp-admin's menu, capability check and scripts. `{ replace: true }` changes the address
  without a history entry — recording a filter, say.
- **`<AdminLink>`** is an `<a>` that does the same for a click. ⌘, Ctrl, Shift, Alt, the
  middle button, `target` and `download` are left to the browser. It forwards its ref and
  every prop, so it is the `components.link` for `<LinchpinAdminPage>`, the `linkComponent`
  for the nav and the breadcrumbs, and the anchor for DataViews' `renderItemLink`.
- **`useAdminLocation()`** is the current address, with `query` as `URLSearchParams`.
  Components that read it re-render on every navigation, Back and Forward included.

Without an `<AdminRouter>` above them, all four still work, as plain links and page loads.

`sectionNavigation()` takes the same `keep`. Its default is still to carry every argument,
which is right for a settings screen and wrong for sections that hold different lists.

## Records

### Stat tiles

The counts above a list. `<StatTile>` is one of three things, and its props say which:

| Props | It is | Renders |
| --- | --- | --- |
| `onClick`, `isPressed` | A filter on the list beneath it | A toggle button (`aria-pressed`) |
| `href` | A way to the list it counts | An `<AdminLink>` |
| neither | A fact | Text |

`tone` is the number's reading, not decoration: `error` for something that needs a person
now, `warning` for drift, `success` for good news, `brand` or `neutral` otherwise. `footer`
sits outside the clickable part, for anything interactive of its own, such as a breakdown of
the count into links. `isLoading` holds the tile's height with a placeholder.

Wrap a row in `<StatTiles label="…">`: a named group that wraps to the width it is given.

```jsx
<StatTiles label="Site summary">
	<StatTile value={ 73 } label="Total sites" detail="20 clients" onClick={ clear } isPressed={ ! filter } />
	<StatTile value={ 39 } label="Needs updates" tone="warning" onClick={ toggle( 'needs_update' ) } isPressed={ filter === 'needs_update' } />
	<StatTile value={ 9 } label="Not reporting" tone="error" href={ adminUrl( { filter: 'not_reporting' } ) } />
</StatTiles>
```

### Facts

`<FactList>` is read-only label and value pairs: a record's overview, a health check, the
strip under a record's title. `layout="rows"` (the default) puts one fact per line;
`layout="inline"` runs them along one wrapping line, label over value.

Each item is `{ id, label, value, tone, help }`. `tone` is `ok` (a quiet mark before the
value), `warning`, `error` or `info`. An item with no value is left out rather than drawn as
an empty row.

### Features

`<FeatureList>` says what something does, a line each: an icon, a name and a sentence. It has
no card and no tile around a line, so it can sit on a page or inside a card -- the welcome
screen's grid of bordered tiles is the surface-in-a-surface it replaces. `columns` lays the
lines out in a grid that fills the width it is given; without it they stack.

Each item is `{ key, icon, title, text }`. The icon is decoration, hidden from assistive
technology, so the name has to say what the line is. Titles are `h3` unless `headingLevel`
says otherwise. `<FeatureListCard>` is the short single-column explainer for a sidebar.

## Notices

`<LinchpinNotice>` is the one shape for every message a plugin raises, in its own screens and
in wp-admin's notice area alike: the plugin's mark on a brand tile at the left, the content
beside it, and the actions in a column of their own on the right. The column drops beneath the
content when the notice is too narrow for it — a phone, a sidebar — by a container query on
the notice itself, not the viewport.

Every part of the content is optional, and the point is to give only what the notice needs:

| Prop | What it is | Leave it out when |
| --- | --- | --- |
| `eyebrow` | Who is speaking, small, above the title. | The title or the sentence already says so. "Linchpin" over "Linchpin can handle these updates" is the same word twice. |
| `title` | The point of the notice. | One sentence says everything. |
| `status` | A chip beside the title: *Needs an answer*, *Action needed*. | Nothing is waiting on the reader. |
| children | The detail. | The title is the whole message. |
| `actions` | Buttons, in the right-hand column. | There is nothing to do. |
| `onDismiss` | Shows the dismiss button in the corner. | It must stay until it is answered. |

Tone is never a stripe down one edge. `tone` (`info`, `success`, `warning`, `error`) sets the
chip's colour; `surface="tinted"` also gives the notice the tone's background — use it for a
notice that is waiting on the reader. A plain `error` notice draws its whole border in the
error stroke. `variant="banner"` is the full-bleed strip under a plugin's top bar: no corners,
no side strokes, inset by the frame's gutter.

`icon` is the mark on the tile. It defaults to the Linchpin mark; a plugin passes its own, in
white, and the tile paints it on the brand gradient (`--lp-brand-deep` to `--lp-brand-deep-end`).
`icon={ false }` drops the tile.

```jsx
<LinchpinNotice
	title="Linchpin can handle these updates for you"
	actions={ <Button variant="primary">Ask Linchpin to handle it</Button> }
	onDismiss={ dismiss }
>
	Each update is tested before it is applied.
</LinchpinNotice>

<LinchpinNotice
	variant="banner"
	surface="tinted"
	tone="warning"
	icon={ <img src={ markUrl } alt="" /> }
	title="Mantle is not connected to the API"
	actions={ <Button variant="primary" href={ reconnectUrl }>Reconnect this site</Button> }
	onDismiss={ dismiss }
>
	Monitoring and plugin reporting are switched off until this site reconnects.
</LinchpinNotice>
```

A notice present when the screen renders is read with the screen, so nothing is announced. A
message that appears because of something the reader just did is a snackbar from
`core/notices`, which `<LinchpinNotices>` renders.

### Rendering a notice from PHP

`admin_notices` output renders on every wp-admin screen, most of which load no plugin bundle,
so the notice is also a markup contract with a standalone stylesheet. Compile
`@linchpinagency/ui/notice.scss` (or enqueue `notice.css`) into the stylesheet the plugin loads
admin-wide, and print:

```html
<div class="notice lp-notice is-card is-tone-warning is-tinted is-dismissible">
	<div class="lp-notice__inner">
		<span class="lp-notice__icon" aria-hidden="true"><img src="…/mark-white.svg" alt=""></span>
		<div class="lp-notice__content">
			<p class="lp-notice__eyebrow">…</p>
			<div class="lp-notice__heading">
				<h2 class="lp-notice__title">…</h2>
				<span class="lp-notice__status">…</span>
			</div>
			<div class="lp-notice__body"><p>…</p></div>
		</div>
		<div class="lp-notice__actions"><a class="button button-primary" href="…">…</a></div>
	</div>
</div>
```

Leave out any part the notice doesn't need. `notice` is core's class and keeps core's handling:
the notice moves under the screen's heading, and with `is-dismissible` core appends its own
dismiss button, which the stylesheet puts in the corner. A notice that renders its own
`.notice-dismiss` (one posting a form, say) adds `has-dismiss` instead, so core doesn't add a
second. wp-admin's `.button-primary` takes the brand's primary colour, and other `.button`s are
outlined in it.

Outside a frame nothing sets `--lp-brand-*`, so a PHP notice paints in Linchpin's palette
unless the plugin sets them on its notices:

```scss
.lp-notice.is-brand-mantle {
	--lp-brand-primary: #c900ae;
	--lp-brand-deep: #c900ae;
	--lp-brand-deep-end: #7d58c6;
}
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
| `<LinchpinLogo>` | Two variants — `full` (the lockup) and `mark` (the brandmark) — and the brand's four tones: `primary`, `on-dark`, `white` and `black`. A fifth, `mono`, paints in `currentColor` for the top bar, whose colour the plugin chose. Artwork is generated from the brand file, so there is no SVGR loader and no runtime `plugin_url` lookup. **There is no recolouring hook** — see [the brand contract](../development/brand.md). |
| `<VersionBadge>` | Adds the `v`, once. Renders nothing without a version. |

## Helpers

| Export | Notes |
| --- | --- |
| `defineBrand()` | Validates and freezes a brand. See [the brand contract](../development/brand.md). |
| `brandStyle()` | A brand as `--lp-brand-*` custom properties. |
| `linchpinLinks()` | The standard links, UTM-tagged with the plugin slug. |
| `useAdminContext()` | Identity, brand and links from the nearest frame. |
| `usePlatformStatus()` | Polls status.linchpin.com. Opt-in; any monitor down reads as `down`, and a failed request or a summary without a `down` count as `unknown`, never `down`. |
| `sectionNavigation()` | Builds `Page`'s `navigation` config, varying one query argument and keeping the rest of the URL, or only what `keep` names. |
| `currentSection()` | Which section the URL asks for, falling back to the first. |
| `adminUrl()` | An address on this screen (or another, with `path`) carrying only the arguments named. See [A page per record](#a-page-per-record-without-a-reload). |
| `isSameScreen()` | Whether an address is the screen already loaded: same file, same `page`. |
| `useAdminLocation()`, `useNavigate()` | The current address, and a function that follows one. Under `<AdminRouter>`, both stay on the screen when they can. |
| `LINCHPIN_COLORS`, `colorVar()`, `colorVars()` | The agency palette, and the `--lp-color-*` properties that carry it. |
| `aboutBlurb()`, `aboutPageCopy()` | The agency copy, read-only. |
