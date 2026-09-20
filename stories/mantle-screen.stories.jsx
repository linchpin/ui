/**
 * WordPress dependencies
 */
import {
	Button,
	Card,
	CardBody,
	ToggleControl,
} from '@wordpress/components';
import {
	cog,
	grid,
	people,
	plugins,
	shield,
	tool,
	trendingUp,
} from '@wordpress/icons';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import {
	defineBrand,
	HelpCard,
	LinchpinAdminFrame,
	LinchpinAdminLayout,
	LinchpinAdminNav,
	LinchpinAdminPage,
	LinchpinAdminTopBar,
} from '@linchpinagency/ui';

const PLUGIN = { name: 'Mantle', slug: 'mantle', version: '2.21.1' };

const BRAND = defineBrand( {
	primary: '#c4009b',
	deep: '#c4009b',
	deepEnd: '#7d2bd6',
} );

const SECTIONS = [
	{ name: 'dashboard', label: 'Dashboard', href: '#dashboard', icon: grid },
	{ name: 'client', label: 'Client Info', href: '#client', icon: people },
	{
		name: 'monitoring',
		label: 'Monitoring',
		href: '#monitoring',
		icon: trendingUp,
	},
	{
		name: 'plugins',
		label: 'Plugins & Themes',
		href: '#plugins',
		icon: plugins,
	},
	{ name: 'security', label: 'Security', href: '#security', icon: shield },
	{ name: 'tools', label: 'Tools', href: '#tools', icon: tool },
	{ name: 'settings', label: 'Settings', href: '#settings', icon: cog },
];

/** The two levels a dense plugin needs: a menu, and tabs inside a screen. */
const SUBSECTIONS = {
	security: [
		{ label: 'Admin', href: '#security/admin' },
		{ label: 'Frontend', href: '#security/frontend' },
	],
	plugins: [
		{ label: 'Overview', href: '#plugins/overview' },
		{ label: 'Plugins', href: '#plugins/plugins' },
		{ label: 'Themes', href: '#plugins/themes' },
	],
};

/**
 * The card above the menu: who you are, and which client's site this is.
 * A slot, not a component — what belongs there is the plugin's business.
 *
 * @return {Element} The card.
 */
function ClientCard() {
	return (
		<Card size="small">
			<CardBody>
				<strong style={ { display: 'block' } }>Hi Aaron!</strong>
				<span
					style={ {
						fontSize: '11px',
						letterSpacing: '0.04em',
						textTransform: 'uppercase',
					} }
				>
					Vinfen
				</span>
			</CardBody>
		</Card>
	);
}

/**
 * Mantle's shape: a vertical menu for the top level, and a tab strip inside a
 * screen for its subsections. Both are links — a section should be
 * bookmarkable and survive a save.
 */
export default {
	title: 'Chrome/Admin screen with a menu',
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
 * @param {Object}  props          Props.
 * @param {string}  [props.start]  The section to open on.
 * @param {boolean} [props.aside]  Render the help column as well.
 * @return {Element} The screen.
 */
function Screen( { start = 'security', aside = false } ) {
	const [ current, setCurrent ] = useState( start );
	const section = SECTIONS.find( ( item ) => item.name === current );
	const tabs = SUBSECTIONS[ current ];

	return (
		<LinchpinAdminFrame
			plugin={ PLUGIN }
			brand={ BRAND }
			topBar={ <LinchpinAdminTopBar status /> }
		>
			<LinchpinAdminLayout
				label="About Mantle"
				nav={
					<LinchpinAdminNav
						items={ SECTIONS }
						current={ current }
						onNavigate={ setCurrent }
						header={ <ClientCard /> }
					/>
				}
				sidebar={ aside ? <HelpCard /> : undefined }
			>
				<LinchpinAdminPage
					title={ section.label }
					badges={ null }
					navigation={
						tabs
							? {
									items: tabs,
									currentHref: tabs[ 0 ].href,
									ariaLabel: `${ section.label } sections`,
							  }
							: undefined
					}
				>
					<Card>
						<CardBody>
							<ToggleControl
								__nextHasNoMarginBottom
								label="Enable Security Features"
								help="Master toggle to enable all security features."
								checked
								onChange={ () => {} }
							/>
							<ToggleControl
								__nextHasNoMarginBottom
								label="Restrict User REST API Access"
								help="Only allow logged-in users to access user information via the REST API."
								checked={ false }
								onChange={ () => {} }
							/>
							<Button __next40pxDefaultSize variant="primary">
								Save Settings
							</Button>
						</CardBody>
					</Card>
				</LinchpinAdminPage>
			</LinchpinAdminLayout>
		</LinchpinAdminFrame>
	);
}

export const MenuAndTabs = {
	name: 'Menu plus subsection tabs',
	render: () => <Screen start="security" />,
};

export const MenuOnly = {
	name: 'Menu, no subsections',
	render: () => <Screen start="dashboard" />,
};

export const MenuAndHelpColumn = {
	name: 'Menu, tabs and a help column',
	render: () => <Screen start="plugins" aside />,
};
