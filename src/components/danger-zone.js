/**
 * WordPress dependencies
 */
import {
	Card,
	CardBody,
	CardHeader,
	Icon,
	Notice,
} from '@wordpress/components';
import { caution } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

/**
 * Where the irreversible controls live.
 *
 * Every plugin grows one of these — uninstall behaviour, reset settings, purge
 * a log, disconnect a site — and before this component each one drew it
 * differently. Psst's uninstall toggle was an ordinary card with an ordinary
 * heading, indistinguishable from the settings above it; Mantle's reset was a
 * card with an error notice inside it and a destructive button at the bottom.
 * Mantle had the right idea, so this is Mantle's shape, made reusable.
 *
 * Still a panel. The treatment is a stroke, a tinted head and one standing
 * warning — enough that the section reads differently at a glance from the
 * settings above it, and not so much that a screen with two of them looks
 * like a failure state.
 *
 * What it does *not* do is confirm on the plugin's behalf. Whether an action
 * needs a modal, a typed confirmation or nothing at all depends on what it
 * destroys, so the action goes in `actions` and the plugin owns the
 * consequences. Buttons there should carry `isDestructive`.
 *
 * @param {Object}         props               Props.
 * @param {string}         [props.title]       Heading. Defaults to `Danger zone`.
 * @param {string}         [props.description] A sentence on what this section is for.
 * @param {string|boolean} [props.warning]     The standing warning. Pass `false` for none.
 * @param {string}         [props.status]      Notice status: `error` (default) or `warning`.
 * @param {Element}        [props.actions]     The destructive buttons, below the controls.
 * @param {Element}        props.children      The controls.
 * @param {string}         [props.className]   Extra class names.
 * @return {Element} The panel.
 */
export default function DangerZone( {
	title,
	description,
	warning: warningText,
	status = 'error',
	actions,
	children,
	className,
} ) {
	const notice =
		warningText === false
			? null
			: ( warningText ??
				__( 'These actions are permanent and cannot be undone.' ) );

	return (
		<Card
			className={ [ 'lp-admin__danger', className ]
				.filter( Boolean )
				.join( ' ' ) }
		>
			<CardHeader>
				<h2 className="lp-admin__danger-title">
					<Icon icon={ caution } size={ 20 } />
					{ title ?? __( 'Danger zone' ) }
				</h2>
			</CardHeader>
			<CardBody>
				{ description && (
					<p className="lp-admin__danger-description">
						{ description }
					</p>
				) }

				{ notice && (
					/*
					 * Rendered, not announced. `Notice` speaks its children
					 * on mount and `error` speaks them assertively, but this
					 * describes a risk rather than reporting an event. An
					 * empty `spokenMessage` is core's way to opt out.
					 */
					<Notice
						status={ status }
						isDismissible={ false }
						politeness="polite"
						spokenMessage=""
					>
						{ notice }
					</Notice>
				) }

				{ children && (
					<div className="lp-admin__danger-controls">
						{ children }
					</div>
				) }

				{ actions && (
					<div className="lp-admin__danger-actions">{ actions }</div>
				) }
			</CardBody>
		</Card>
	);
}
