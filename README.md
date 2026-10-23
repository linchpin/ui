# Linchpin UI

Linchpin's admin component library for WordPress plugins — the chrome and the brand, on top of `@wordpress/admin-ui`.

See [CHANGELOG.md](CHANGELOG.md) for release history.

<!-- x-release-please-start-version -->
## Latest Release: 0.5.0
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
	SettingsCard,
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

### Let the screen fill its header

The page header belongs to the page, but what goes in it belongs to the screen inside: its primary action, its state, its sections. A screen reaches it from anywhere in its own body, and whatever the page was given directly comes first.

```jsx
function Declutter() {
	const [ section, setSection ] = useState( 'inventory' );

	usePageSections( { sections: SECTIONS, current: section, onSelect: setSection } );

	return (
		<>
			<PageHeaderBadges><Badge>Not recording</Badge></PageHeaderBadges>
			<PageHeaderActions>
				<Button variant="secondary" onClick={ startRecording }>Start recording</Button>
			</PageHeaderActions>
			<InventoryTable />
		</>
	);
}
```

- `PageHeaderActions` goes after the page's own `actions`.
- `PageHeaderBadges` goes after the page's `badges`. Pass `badges={ null }` to show only the screen's.
- `PageHeaderSubTitle` replaces the page's `subTitle`.
- The fills render through a portal, so they keep the screen's state and context. Outside a `LinchpinAdminPage` they render nothing.
- `usePageSections` draws the sections as tabs. A plain click goes to `onSelect` and switches in place. With no `onSelect`, the tab is an `AdminLink`, so it stays on the screen under `AdminRouter` and is an ordinary link otherwise. An explicit `navigation` prop on the page wins.

### Settings screens: sections and one Save

A settings screen sits on a page panel that is already a surface, so its sections are flat: `SettingsSection` draws a real heading (`h2` by default), a sentence on what the section is for, and its controls in a stacked column with the design system's large gap. Sections are set apart by space and a rule, not boxed. Pass `surface="card"` for the rare section that has to read as an object of its own. `SettingsCard` is now an alias of that card form, kept for screens written against it.

`PageSaveAction` is the screen's one Save, in the page header. It is disabled until something changes and reports the result as a snackbar (render `LinchpinNotices` once). It asks before the person leaves with unsaved changes. It holds no form state, so it works with react-hook-form or plain state alike. Pass `isDirty`, and an `onSave` that returns a promise that rejects when the save fails; with `saveEntityRecord`, that means `throwOnError: true`.

```jsx
<LinchpinAdminPage title="Communication" subTitle="How this site's team reaches Linchpin.">
	<PageSaveAction isDirty={ isDirty } onSave={ handleSubmit( save ) } />

	<SettingsSection title="Team chat" description="Chat with the Linchpin team from the admin.">
		<SwitchControl label="Enable team chat" checked={ chat } onCheckedChange={ setChat } />
	</SettingsSection>

	<SettingsSection title="Chat window" description="Where people open the chat.">
		<RadioGroupControl label="Open the chat from" items={ PLACEMENTS } value={ placement } onValueChange={ setPlacement } />
	</SettingsSection>
</LinchpinAdminPage>
```

### One choice, one button

`MenuButton` is for a decision with a few answers: record for 15 minutes, an hour or until stopped; clear every cache or one. As sibling buttons those read as separate actions; as one button, they read as the one choice they are. Put what the person needs to know to choose in `description`. It sits at the top of the menu, and the menu is described by it.

```jsx
<PageHeaderActions>
	<MenuButton
		label="Start recording"
		description="Recording watches every admin page load, which costs a little each time."
		options={ [
			{ value: 15, label: 'For 15 minutes' },
			{ value: 60, label: 'For 1 hour' },
			{ type: 'separator' },
			{ value: 0, label: 'Until I stop it' },
		] }
		onSelect={ startRecording }
	/>
</PageHeaderActions>
```

`MenuButton` is built on `Menu` and `Button` from `@wordpress/ui`, so the plugin needs `@wordpress/ui` 0.25 or later. `LinchpinAdminFrame` opts into `@wordpress/ui`'s compat overlay slot, so menus and popovers stack above core's `Page` even where `wp-components` isn't enqueued.

The stylesheet must load after `wp-components`. Declare it as a dependency when enqueuing:

```php
wp_enqueue_style(
	'psst-admin',
	PSST_URL . 'build/admin.css',
	[ 'wp-components' ],
	PSST_VERSION
);
```

## The page contract

Every screen built on this package follows eight rules. The components carry most of them, so a new screen gets them without anyone having to remember them.

1. **The page panel is the surface.** Settings sections sit straight on the page, set apart by space and a rule (`SettingsSection`). A card is for peers in a grid, and nothing bordered goes inside a card.
2. **One left edge.** Title, tabs, section headings, fields and a table's toolbar all start on the page gutter. Data views run full bleed.
3. **The header owns the verbs.** The screen's actions go in the header, right-aligned. Its status is a header badge, and its intro sentence is the subtitle (`PageHeaderActions`, `PageHeaderBadges`, `PageHeaderSubTitle`, or the page's own props). The body never starts with a toolbar row.
4. **One Save.** A settings screen saves from the header with one label, disabled until something changes, and reports the result as a snackbar (`PageSaveAction`). There is no save button per section and no Back button.
5. **Gaps, not margins.** Every group of siblings is a `Stack` with a token gap. Components never set their own outer margin.
6. **One choice, one control.** Mutually exclusive answers are a `MenuButton`, a `RadioGroupControl` or a `SelectControl`, never a row of buttons.
7. **Headings follow the page.** The page title is the `h1`, each section an `h2` and a group inside one an `h3`. `SettingsSection` renders the heading, so a screen cannot skip a level.
8. **One notice.** `LinchpinNotice` wherever a notice is shown, with the actions in the right-hand column beside the dismiss. A fact about the whole install goes in `LinchpinGlobalNotices` once, never on each screen that depends on it. The result of something the person just did is a snackbar.

The spacing between things, all existing `--wpds-*` tokens:

| Between | Token | |
|---|---|---|
| A heading and its description | `--wpds-dimension-gap-xs` | 4px |
| Buttons in a row, header actions | `--wpds-dimension-gap-sm` | 8px |
| The page edge and everything on it | `--lp-admin-gutter` | 16px |
| One field and the next | `--wpds-dimension-gap-lg` | 16px |
| One section and the next, with a rule | `--wpds-dimension-gap-2xl` | 32px |

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

## Upgrading to 1.0

1.0 moves the library onto `@wordpress/ui` and gives screens a way into their header. Most of it is additive. The changes a plugin can notice:

- **`@wordpress/ui` 0.25 or later is a peer dependency.** Install it alongside the other `@wordpress/*` packages. With `@wordpress/admin-ui` 3, `@wordpress/components` 43 and `@wordpress/theme` 3, npm resolves one copy of it.
- **`SettingsCard` is drawn with `@wordpress/ui`'s `Card`.** Its padding, radius and stroke now match the cards around it, and its `size` prop is ignored. It is deprecated in favour of `SettingsSection`, flat or with `surface="card"`.
- **`DangerZone`, `HelpCard`, `FeatureListCard`, `AboutLinchpinCard`, `AboutLinchpinPage`** and `LinchpinNotice`'s dismiss button are drawn with `@wordpress/ui`, and keep the same props. Links that open a new tab now say so to screen readers.
- **`LinchpinAdminFrame` turns on `@wordpress/ui`'s compat overlay slot**, so menus, popovers and tooltips stack above the page. WordPress already does this wherever `wp-components` is enqueued.
- **Section tabs size to their label.** They keep the 44px height and drop the 44px minimum width.
- **Below 782px, `LinchpinAdminNav` folds** behind one control naming the open screen.
- **New:** `PageHeaderActions`, `PageHeaderBadges`, `PageHeaderSubTitle`, `usePageSections`, `SettingsSection`, `PageSaveAction`, `useUnsavedChangesWarning`, `MenuButton`, `LinchpinGlobalNotices`, `useSessionDismissals`, `useAdminChrome`, `retitle` and `markCurrentMenuItem`.

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
