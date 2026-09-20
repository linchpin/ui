/**
 * WordPress dependencies
 */
import { Breadcrumbs } from '@wordpress/admin-ui';
import { Button, Card, CardBody, CardHeader } from '@wordpress/components';
import { external, link, lock, trash } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import {
	AboutLinchpinCard,
	defineBrand,
	FeatureListCard,
	HelpCard,
	LinchpinAdminFooter,
	LinchpinAdminFrame,
	LinchpinAdminLayout,
	LinchpinAdminPage,
	LinchpinAdminTopBar,
} from '@linchpinagency/ui';

const PLUGIN = { name: 'Psst', slug: 'psst', version: '2.1.0' };

const BRAND = defineBrand( {
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

/** A stand-in for the plugin's own mark. */
function PsstLogo() {
	return (
		<svg viewBox="0 0 120 32" aria-hidden="true" focusable="false">
			<rect width="120" height="32" rx="6" fill="#5beece" />
			<text
				x="12"
				y="22"
				fontFamily="system-ui, sans-serif"
				fontSize="16"
				fontWeight="700"
				fill="#082318"
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
 * @param {boolean} [props.status]  Show the platform status dot.
 * @param {boolean} [props.sidebar] Render the help column.
 * @param {boolean} [props.crumbs]  Render breadcrumbs above the title.
 * @param {boolean} [props.logo]    Give the plugin a logo.
 * @return {Element} A composed screen.
 */
function Screen( {
	status = false,
	sidebar = true,
	crumbs = false,
	logo = true,
} ) {
	return (
		<LinchpinAdminFrame
			plugin={ PLUGIN }
			brand={ BRAND }
			topBar={
				<LinchpinAdminTopBar
					logo={ logo ? <PsstLogo /> : undefined }
					status={ status }
				/>
			}
		>
			<LinchpinAdminPage
				subTitle="One-time secrets, encrypted in the browser. The server never sees the contents, and neither does this screen."
				navigation={ NAVIGATION }
				breadcrumbs={
					crumbs ? (
						<Breadcrumbs
							items={ [
								{ label: 'Settings', to: '#settings' },
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
				</LinchpinAdminLayout>
			</LinchpinAdminPage>

			<LinchpinAdminFooter />
		</LinchpinAdminFrame>
	);
}

export const Default = { render: () => <Screen /> };

export const FullHeader = {
	name: 'Full header (breadcrumbs, title, subtitle, tabs)',
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
