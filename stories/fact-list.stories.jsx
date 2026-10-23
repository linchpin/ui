/**
 * Internal dependencies
 */
import { FactList, LinchpinAdminFrame, SettingsCard } from '@linchpinagency/ui';

const PLUGIN = { name: 'Governance', slug: 'linchpin-governing' };

/**
 * Read-only facts about one thing. `rows` for an overview or a health check,
 * `inline` for the strip under a record's title.
 */
export default {
	title: 'Chrome/Fact list',
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
};

export const Rows = {
	render: () => (
		<SettingsCard title="Site" description="What the site last reported.">
			<FactList
				items={ [
					{
						id: 'url',
						label: 'URL',
						value: 'https://my.linchpin.com',
					},
					{
						id: 'reporting',
						label: 'Reporting',
						value: 'Reporting',
						tone: 'ok',
						help: 'Site reported 31 minutes ago · pulled 17 minutes ago',
					},
					{
						id: 'backup',
						label: 'Last backup',
						value: 'Completed 6 hours ago',
						tone: 'ok',
					},
					{
						id: 'commands',
						label: 'Commands',
						value: 'Not command-capable',
						tone: 'warning',
					},
					{ id: 'wordpress', label: 'WordPress', value: '7.1.3' },
					{ id: 'php', label: 'PHP', value: '8.5.12' },
					{ id: 'host', label: 'Host', value: null },
				] }
			/>
		</SettingsCard>
	),
};

export const Inline = {
	render: () => (
		<FactList
			layout="inline"
			items={ [
				{ id: 'client', label: 'Client', value: 'Wheaton College' },
				{
					id: 'environment',
					label: 'Environment',
					value: 'Production',
				},
				{ id: 'host', label: 'Host', value: 'Pressable 1335128' },
				{
					id: 'reporting',
					label: 'Last report',
					value: '3 weeks ago',
					tone: 'error',
				},
			] }
		/>
	),
};
