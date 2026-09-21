/**
 * WordPress dependencies
 */
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	ToggleControl,
} from '@wordpress/components';
import { external, link, lock, trash } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import {
	AboutLinchpinCard,
	DangerZone,
	defineBrand,
	FeatureListCard,
	HelpCard,
	LinchpinAdminFooter,
	LinchpinAdminFrame,
	LinchpinAdminLayout,
	LinchpinAdminPage,
	LinchpinAdminTopBar,
	LinchpinBreadcrumbs,
} from '@linchpinagency/ui';

const PLUGIN = { name: 'Psst', slug: 'psst', version: '2.1.0' };

/*
 * No `defineBrand()` call, and that is the example.
 *
 * A plugin that names no brand inherits Linchpin's own — a Linchpin blue bar
 * with black ink under it — which is what a new plugin looks like on the day
 * it is scaffolded and what most of these stories should therefore show. The
 * branded stories at the bottom are where a plugin's own palette gets
 * demonstrated.
 */
const LINCHPIN_BRAND = undefined;

/** Psst's own palette, for the story that shows a plugin branding itself. */
const PSST_BRAND = defineBrand( {
	primary: '#318873',
	deep: '#082318',
	deepEnd: '#164a3b',
} );

const NAVIGATION = {
	items: [
		{ label: 'Settings', href: '?tab=settings' },
		{ label: 'Secrets', href: '?tab=secrets' },
		{ label: 'Health', href: '?tab=health' },
	],
	currentHref: '?tab=settings',
	ariaLabel: 'Sections',
};

const HOW_IT_WORKS = [
	{
		icon: lock,
		text: 'Encrypted in the sender’s browser. WordPress stores ciphertext it has no key for.',
	},
	{
		icon: link,
		text: 'The key rides in the link’s #fragment, which browsers never send to a server.',
	},
	{
		icon: trash,
		text: 'Revealed once, then destroyed. Anything unread expires on schedule.',
	},
];

/**
 * A stand-in for the plugin's own mark.
 *
 * It paints from the brand's custom properties rather than a hex of its own,
 * so it follows whichever brand the story mounts.
 *
 * @return {Element} The mark.
 */
function PluginLogo() {
	return (
		<svg viewBox="0 0 120 32" aria-hidden="true" focusable="false">
			<rect
				width="120"
				height="32"
				rx="6"
				fill="var( --lp-brand-primary )"
			/>
			<text
				x="12"
				y="22"
				fontFamily="system-ui, sans-serif"
				fontSize="16"
				fontWeight="700"
				fill="var( --lp-brand-deep )"
			>
				psst
			</text>
		</svg>
	);
}

/**
 * The whole screen, as a plugin composes it. This is the arrangement the
 * library exists to stop three plugins from rebuilding — and the header is
 * core's `Page`, not ours.
 */
export default {
	title: 'Chrome/Admin screen',
	parameters: { layout: 'fullscreen' },
	decorators: [
		( Story ) => (
			<div className="sb-wpcontent">
				<Story />
			</div>
		),
	],
};

/**
 * @param {Object}  props           Props.
 * @param {Object}  [props.brand]   The plugin's brand. Omit for Linchpin's own.
 * @param {boolean} [props.status]  Show the platform status dot.
 * @param {boolean} [props.sidebar] Render the help column.
 * @param {boolean} [props.crumbs]  Swap the title for a breadcrumb trail.
 * @param {boolean} [props.logo]    Give the plugin a logo.
 * @param {boolean} [props.danger]  Render the danger zone under the settings.
 * @return {Element} A composed screen.
 */
function Screen( {
	brand = LINCHPIN_BRAND,
	status = false,
	sidebar = true,
	crumbs = false,
	logo = true,
	danger = false,
} ) {
	return (
		<LinchpinAdminFrame
			plugin={ PLUGIN }
			brand={ brand }
			topBar={
				<LinchpinAdminTopBar
					logo={ logo ? <PluginLogo /> : undefined }
					status={ status }
				/>
			}
		>
			<LinchpinAdminPage
				subTitle="One-time secrets, encrypted in the browser. The server never sees the contents, and neither does this screen."
				navigation={ NAVIGATION }
				// `Page` puts breadcrumbs beside the title, not above it, so a
				// screen that shows both says the plugin's name twice. The
				// trail carries the heading instead.
				title={ crumbs ? null : undefined }
				breadcrumbs={
					crumbs ? (
						<LinchpinBreadcrumbs
							headingLevel={ 1 }
							items={ [
								{ label: 'Settings', href: '#settings' },
								{ label: 'Psst' },
							] }
						/>
					) : undefined
				}
				actions={
					<>
						<Button
							__next40pxDefaultSize
							variant="primary"
							icon={ external }
							iconPosition="right"
							href="#share"
						>
							Share a secret
						</Button>
						<Button
							__next40pxDefaultSize
							variant="secondary"
							href="#docs"
						>
							Documentation
						</Button>
					</>
				}
			>
				<LinchpinAdminLayout
					label="About Psst"
					sidebar={
						sidebar ? (
							<>
								<FeatureListCard
									title="How a secret travels"
									items={ HOW_IT_WORKS }
								/>
								<HelpCard />
								<AboutLinchpinCard />
							</>
						) : undefined
					}
				>
					<Card>
						<CardHeader>
							<h2>Pages</h2>
						</CardHeader>
						<CardBody>
							<p>
								The plugin&rsquo;s own screen goes here. The
								library owns everything around it.
							</p>
						</CardBody>
					</Card>

					{ danger && (
						<DangerZone
							title="Uninstall"
							description="What Psst leaves behind when the plugin is deleted."
							actions={
								<Button
									__next40pxDefaultSize
									variant="secondary"
									isDestructive
								>
									Delete everything now
								</Button>
							}
						>
							<ToggleControl
								__nextHasNoMarginBottom
								label="Delete all secrets and settings on uninstall"
								help="Secrets are ephemeral by definition. The two pages stay either way."
								checked
								onChange={ () => {} }
							/>
						</DangerZone>
					) }
				</LinchpinAdminLayout>
			</LinchpinAdminPage>

			<LinchpinAdminFooter />
		</LinchpinAdminFrame>
	);
}

export const Default = { render: () => <Screen /> };

export const FullHeader = {
	name: 'Full header (breadcrumbs, subtitle, tabs)',
	render: () => <Screen crumbs />,
};

export const WithPlatformStatus = {
	name: 'With platform status',
	render: () => <Screen status />,
};

export const WithoutSidebar = {
	name: 'Without a sidebar',
	render: () => <Screen sidebar={ false } />,
};

export const WithoutPluginLogo = {
	name: 'Without a plugin logo (name fallback)',
	render: () => <Screen logo={ false } />,
};

export const WithDangerZone = {
	name: 'With a danger zone',
	render: () => <Screen danger />,
};

/**
 * The same screen once the plugin names a brand. Nothing below the top bar
 * was told about the colour: `primary` seeds the design system, so the
 * buttons, the tab strip and the card icons follow it.
 */
export const BrandedPsst = {
	name: 'Branded by the plugin (Psst)',
	render: () => <Screen brand={ PSST_BRAND } danger />,
};
