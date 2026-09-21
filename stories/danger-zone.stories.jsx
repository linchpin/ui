/**
 * WordPress dependencies
 */
import { Button, ToggleControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { DangerZone, LinchpinAdminFrame } from '@linchpinagency/ui';

const PLUGIN = { name: 'Psst', slug: 'psst', version: '2.1.0' };

/**
 * One shape for every irreversible control in every Linchpin plugin.
 *
 * Psst drew its uninstall toggle as an ordinary card, indistinguishable from
 * the settings above it; Mantle drew its reset as a card with a standing
 * error notice and a destructive button. Mantle was right, so this is
 * Mantle's shape with the parts a plugin varies pulled out as props.
 *
 * It stays a panel. The stroke and the tinted head are the whole treatment —
 * enough to read differently at a glance, not so much that a screen with two
 * of them looks like something has gone wrong.
 *
 * The component does not confirm anything on the plugin's behalf. Whether an
 * action needs a modal, a typed confirmation or nothing depends on what it
 * destroys, so the buttons go in `actions` and the plugin owns the
 * consequences.
 */
export default {
	title: 'Chrome/Danger zone',
	component: DangerZone,
	parameters: { layout: 'padded' },
	decorators: [
		( Story ) => (
			<div className="sb-wpcontent">
				<LinchpinAdminFrame plugin={ PLUGIN }>
					<div style={ { maxWidth: '760px', paddingTop: '24px' } }>
						<Story />
					</div>
				</LinchpinAdminFrame>
			</div>
		),
	],
};

/**
 * A setting that only bites later. No button, because nothing happens now —
 * the toggle is the whole control.
 */
export const Uninstall = {
	render: () => (
		<DangerZone
			title="Uninstall"
			description="What Psst leaves behind when the plugin is deleted."
			warning="Deleting the plugin with this on removes every stored secret. There is no export."
		>
			<ToggleControl
				__nextHasNoMarginBottom
				label="Delete all secrets and settings on uninstall"
				help="Secrets are ephemeral by definition. The two pages stay either way."
				checked
				onChange={ () => {} }
			/>
		</DangerZone>
	),
};

/**
 * An action that bites immediately, which is what `actions` is for. The
 * button carries `isDestructive`; the confirmation is the plugin's job.
 */
export const ResetSettings = {
	name: 'Reset settings',
	render: () => (
		<DangerZone
			description="Wipe this plugin's settings and start setup again."
			actions={
				<Button __next40pxDefaultSize variant="primary" isDestructive>
					Reset settings
				</Button>
			}
		>
			<ToggleControl
				__nextHasNoMarginBottom
				label="Keep license data"
				help="Preserves the saved license key and activation state."
				checked
				onChange={ () => {} }
			/>
		</DangerZone>
	),
};

/**
 * Not everything destructive is a catastrophe. `status="warning"` is for the
 * ones that are recoverable, or that only cost time.
 */
export const Warning = {
	name: 'A recoverable action',
	render: () => (
		<DangerZone
			title="Rebuild the index"
			description="Clears the search index and rebuilds it from scratch."
			warning="Search returns nothing until the rebuild finishes, which takes a few minutes on a large site."
			status="warning"
			actions={
				<Button __next40pxDefaultSize variant="secondary" isDestructive>
					Rebuild now
				</Button>
			}
		/>
	),
};
