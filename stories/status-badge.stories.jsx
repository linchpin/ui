/**
 * Internal dependencies
 */
import {
	LinchpinAdminFrame,
	SettingsCard,
	StatusBadge,
	StatusBadges,
} from '@linchpinagency/ui';

const PLUGIN = { name: 'Governance', slug: 'linchpin-governing' };

/**
 * A status as a toned pill: one vocabulary for every plugin, on the
 * `@wordpress/ui` Badge. For states, not categories.
 */
export default {
	title: 'Chrome/Status badge',
	component: StatusBadge,
	decorators: [
		( Story ) => (
			<div className="sb-wpcontent">
				<LinchpinAdminFrame plugin={ PLUGIN }>
					<div
						className="lp-admin__main"
						style={ { padding: '24px', maxWidth: '760px' } }
					>
						<Story />
					</div>
				</LinchpinAdminFrame>
			</div>
		),
	],
	args: {
		children: 'Reporting',
		tone: 'success',
		description: '',
		quiet: false,
		size: 'md',
		isGoing: false,
	},
	argTypes: {
		tone: {
			control: 'select',
			options: [
				'success',
				'info',
				'caution',
				'warning',
				'error',
				'neutral',
			],
		},
		size: { control: 'inline-radio', options: [ 'md', 'lg' ] },
	},
};

export const Playground = {};

export const Tones = {
	render: () => (
		<SettingsCard
			title="Tones"
			description="What each tone is for, in the words the plugins used."
		>
			<StatusBadges label="Every tone">
				<StatusBadge tone="success">Up to date</StatusBadge>
				<StatusBadge tone="info">Scheduled</StatusBadge>
				<StatusBadge tone="caution">2 updates</StatusBadge>
				<StatusBadge tone="warning">Late</StatusBadge>
				<StatusBadge tone="error">Not reporting</StatusBadge>
				<StatusBadge tone="neutral">Unknown</StatusBadge>
			</StatusBadges>
		</SettingsCard>
	),
};

export const Variants = {
	render: () => (
		<SettingsCard
			title="Variants"
			description="Quiet for a status shown but not held against anything, large for a headline, going for work in progress, and a dash for nothing."
		>
			<StatusBadges>
				<StatusBadge
					tone="caution"
					size="lg"
					description="One baseline item is missing."
				>
					C
				</StatusBadge>
				<StatusBadge tone="error" quiet description="Alerts muted">
					Not reporting
				</StatusBadge>
				<StatusBadge tone="info" isGoing>
					Running
				</StatusBadge>
				<StatusBadge />
			</StatusBadges>
		</SettingsCard>
	),
};
