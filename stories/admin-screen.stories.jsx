/**
 * WordPress dependencies
 */
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
	LinchpinAdminMasthead,
	LinchpinAdminTabs,
	LinchpinAdminTopBar,
} from '@linchpinagency/ui';

const PLUGIN = { name: 'Psst', slug: 'psst', version: '2.1.0' };

const BRAND = defineBrand( {
	primary: '#318873',
	deep: '#082318',
	deepEnd: '#164a3b',
} );

const TABS = [
	{ name: 'settings', title: 'Settings' },
	{ name: 'secrets', title: 'Secrets' },
	{ name: 'health', title: 'Health' },
];

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
 * The whole screen, as a plugin composes it. This is the arrangement the
 * library exists to stop three plugins from rebuilding.
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
 * @param {Object}  props         Props.
 * @param {boolean} [props.status] Show the platform status dot.
 * @param {boolean} [props.sidebar] Render the help column.
 * @return {Element} A composed screen.
 */
function Screen( { status = false, sidebar = true } ) {
	return (
		<LinchpinAdminFrame
			plugin={ PLUGIN }
			brand={ BRAND }
			topBar={ <LinchpinAdminTopBar status={ status } /> }
		>
			<LinchpinAdminMasthead description="One-time secrets, encrypted in the browser. The server never sees the contents, and neither does this screen.">
				<Button
					__next40pxDefaultSize
					variant="primary"
					icon={ external }
					iconPosition="right"
					href="#share"
				>
					Share a secret
				</Button>
				<Button __next40pxDefaultSize variant="secondary" href="#docs">
					Documentation
				</Button>
			</LinchpinAdminMasthead>

			<LinchpinAdminTabs tabs={ TABS } remember={ false }>
				{ ( tab ) => (
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
								<h2>{ tab.title }</h2>
							</CardHeader>
							<CardBody>
								<p>
									The plugin&rsquo;s own screen goes here. The
									library owns everything around it.
								</p>
							</CardBody>
						</Card>
					</LinchpinAdminLayout>
				) }
			</LinchpinAdminTabs>

			<LinchpinAdminFooter />
		</LinchpinAdminFrame>
	);
}

export const Default = { render: () => <Screen /> };

export const WithPlatformStatus = {
	name: 'With platform status',
	render: () => <Screen status />,
};

export const WithoutSidebar = {
	name: 'Without a sidebar',
	render: () => <Screen sidebar={ false } />,
};
