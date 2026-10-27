/**
 * WordPress dependencies
 */
import { backup, cloud, lock, shield } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import {
	FeatureList,
	LinchpinAdminFrame,
	SettingsCard,
} from '@linchpinagency/ui';

const PLUGIN = { name: 'Mantle', slug: 'mantle' };

const ITEMS = [
	{
		key: 'monitoring',
		icon: cloud,
		title: 'Monitoring',
		text: 'Uptime, SSL and PageSpeed tests from StatusCake, and the alerts they raise.',
	},
	{
		key: 'security',
		icon: shield,
		title: 'Security',
		text: 'Closes off the user list, password resets and author details WordPress gives away.',
	},
	{
		key: 'sso',
		icon: lock,
		title: 'Single sign-on',
		text: 'Linchpin staff sign in with their Linchpin account.',
	},
	{
		key: 'cache',
		icon: backup,
		title: 'Cache',
		text: 'Clears the host’s and Cloudflare’s caches from one menu.',
	},
];

/**
 * What something does, as icon, name and sentence -- with no tile around a
 * line, so it can sit inside a card.
 */
export default {
	title: 'Chrome/Feature list',
	decorators: [
		( Story ) => (
			<div className="sb-wpcontent">
				<LinchpinAdminFrame plugin={ PLUGIN }>
					<div
						className="lp-admin__main"
						style={ { padding: '24px', maxWidth: '960px' } }
					>
						<Story />
					</div>
				</LinchpinAdminFrame>
			</div>
		),
	],
};

export const Columns = {
	render: () => (
		<SettingsCard
			title="What Mantle can do"
			description="Switch on the modules this site needs."
		>
			<FeatureList columns items={ ITEMS } />
		</SettingsCard>
	),
};

export const OneColumn = {
	render: () => <FeatureList items={ ITEMS } />,
};
