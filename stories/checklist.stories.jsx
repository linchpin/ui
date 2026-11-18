/**
 * Internal dependencies
 */
import {
	Checklist,
	LinchpinAdminFrame,
	SettingsCard,
} from '@linchpinagency/ui';

const PLUGIN = { name: 'Governance', slug: 'linchpin-governing' };

/**
 * A list of things to check, each leading with its status: what is done,
 * what isn't and what to do about it.
 */
export default {
	title: 'Chrome/Checklist',
	component: Checklist,
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

const SETUP_STATUSES = {
	fail: { label: 'Missing', tone: 'error' },
	unknown: { label: 'Unknown', tone: 'neutral' },
	pass: { label: 'Pass', tone: 'success' },
	na: { label: 'Doesn’t apply', tone: 'neutral', quiet: true },
};

/**
 * A site's setup audit (packagist): tiers as groups, what is missing first,
 * and the fix for each.
 */
export const SetupAudit = {
	render: () => (
		<SettingsCard
			title="Setup"
			description="What a supported site should have in place."
		>
			<Checklist
				statuses={ SETUP_STATUSES }
				sortByStatus
				summary
				groups={ [
					{ id: 'baseline', title: 'Baseline' },
					{ id: 'recommended', title: 'Recommended' },
				] }
				items={ [
					{
						id: 'staging',
						group: 'baseline',
						status: 'pass',
						label: 'Production and staging are registered',
						detail: 'Staging is contoso-stg.example.',
					},
					{
						id: 'patchstack',
						group: 'baseline',
						status: 'fail',
						label: 'Patchstack is active on production',
						detail: 'Patchstack is not installed.',
						action: {
							label: 'Install and activate Patchstack, then connect it.',
							href: 'https://app.patchstack.com/',
						},
					},
					{
						id: 'uptime',
						group: 'baseline',
						status: 'unknown',
						label: 'Production has an uptime monitor',
						detail: 'StatusCake couldn’t be read.',
					},
					{
						id: 'nightly',
						group: 'recommended',
						status: 'fail',
						tone: 'caution',
						label: 'The last nightly run passed',
						detail: 'The last nightly run failed.',
						action: {
							label: 'Open the run in Sisyphus and triage it.',
							href: '/wp-admin/admin.php?page=sisyphus',
						},
					},
					{
						id: 'host',
						group: 'recommended',
						status: 'na',
						label: 'The host knows this site',
						detail: 'Backups before updates cover Pressable and WP Engine.',
					},
				] }
			/>
		</SettingsCard>
	),
};

/**
 * A setup wizard's steps (Mantle onboarding): numbered, the current one
 * marked, finished ones reopenable, with sub-steps.
 */
export const Onboarding = {
	render: () => (
		<SettingsCard title="Set up Mantle">
			<Checklist
				ordered
				marker="icon"
				statuses={ {
					incomplete: { label: 'To do', tone: 'neutral' },
					in_progress: { label: 'In progress', tone: 'info' },
					complete: { label: 'Done', tone: 'success' },
				} }
				items={ [
					{
						id: 'authentication',
						status: 'complete',
						label: 'Authentication',
						items: [
							{ id: 'pin', status: 'complete', label: 'PIN' },
							{ id: 'token', status: 'complete', label: 'Token' },
						],
					},
					{
						id: 'client',
						status: 'complete',
						label: 'Client info',
						onSelect: () => {},
					},
					{
						id: 'license',
						status: 'in_progress',
						label: 'License',
						detail: 'Enter the license key from my.linchpin.com.',
						current: true,
					},
					{ id: 'modules', status: 'incomplete', label: 'Modules' },
					{
						id: 'monitoring',
						status: 'incomplete',
						label: 'Monitoring',
					},
				] }
			/>
		</SettingsCard>
	),
};

/**
 * Health checks with an icon marker and a remedy (Mantle's Tools > Debug).
 */
export const HealthChecks = {
	render: () => (
		<SettingsCard title="Checks">
			<Checklist
				marker="icon"
				items={ [
					{
						id: 'api',
						status: 'pass',
						label: 'api.linchpin.com answers',
						detail: 'Reported 4 minutes ago.',
					},
					{
						id: 'commands',
						status: 'fail',
						label: 'Remote commands land',
						detail: 'The relay got a Cloudflare Access login page.',
						meta: 'Add the Packagist Push service policy to the Access app.',
					},
					{
						id: 'cron',
						status: 'warning',
						label: 'WP-Cron runs',
						detail: 'The last run was 3 hours ago.',
					},
				] }
			/>
		</SettingsCard>
	),
};
