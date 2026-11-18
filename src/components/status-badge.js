/**
 * WordPress dependencies
 */
import { Badge, Tooltip, VisuallyHidden } from '@wordpress/ui';

/**
 * Tones a status can have, and the `@wordpress/ui` Badge intent each one
 * paints with. One vocabulary for every plugin: packagist, Sisyphus and psst
 * each drew the same pill with their own words (up-to-date, is-ok, ok), and a
 * screen built from two of them read as two systems.
 *
 * - `success`: fine. Up to date, passing, reporting.
 * - `info`: worth knowing, nothing to do. Running, scheduled.
 * - `caution`: something to get to. An update waiting.
 * - `warning`: something going wrong. Late, degraded.
 * - `error`: broken or unsafe. Failed, vulnerable, silent.
 * - `neutral`: no judgement. Unknown, not applicable, paused.
 */
export const STATUS_TONES = {
	success: 'stable',
	info: 'informational',
	caution: 'low',
	warning: 'medium',
	error: 'high',
	neutral: 'draft',
};

/**
 * Other names for the tones, so a caller already using one of the library's
 * older words (FactList's `ok`) or a plugin's own lands on the same colour.
 */
const TONE_ALIASES = {
	ok: 'success',
	danger: 'error',
	problem: 'error',
};

/**
 * Resolve a tone name to one of {@link STATUS_TONES}.
 *
 * @param {string} tone Tone or alias.
 * @return {string} A key of STATUS_TONES; `neutral` for anything unknown.
 */
export function statusTone( tone ) {
	const resolved = TONE_ALIASES[ tone ] || tone;

	return Object.prototype.hasOwnProperty.call( STATUS_TONES, resolved )
		? resolved
		: 'neutral';
}

/**
 * A status, as a short toned pill.
 *
 * For the state of something: whether a site is reporting, a run passed, a
 * check is missing. Not for categories (a license type, an environment, a
 * version), which are labels rather than judgements and stay as they are.
 *
 * Absence is not a pill. With no label it renders a muted dash, the way a
 * table cell with nothing to report should read; and a caller with an
 * ordinary, nothing-to-see state is better served by plain text than a column
 * of green pills that drown the ones that matter.
 *
 * `description` says why. It shows in a tooltip on hover and keyboard focus
 * (the badge becomes focusable only then) and is read by screen readers with
 * the label, which a bare `title` attribute never was.
 *
 * @param {Object}  props               Props.
 * @param {string}  props.children      The status in a word or two.
 * @param {string}  [props.tone]        One of STATUS_TONES (or an alias). Default `neutral`.
 * @param {string}  [props.description] Why, or what it means. Shown in a tooltip.
 * @param {boolean} [props.quiet]       Dimmed: a status that is shown but not held against anything (muted alerts, an ungraded copy).
 * @param {string}  [props.size]        `md` (default) or `lg`, for a headline status such as a grade.
 * @param {boolean} [props.isGoing]     Something in progress: adds a pulsing dot.
 * @param {string}  [props.className]   Extra class names.
 * @return {Element} The badge.
 */
export default function StatusBadge( {
	children,
	tone = 'neutral',
	description,
	quiet = false,
	size = 'md',
	isGoing = false,
	className,
} ) {
	const label =
		children === undefined || children === null || children === false
			? ''
			: String( children );

	if ( '' === label ) {
		return (
			<span
				className={ [ 'lp-admin__status-badge-empty', className ]
					.filter( Boolean )
					.join( ' ' ) }
			>
				—
			</span>
		);
	}

	const resolved = statusTone( tone );
	const badge = (
		<Badge
			intent={ STATUS_TONES[ resolved ] }
			className={ [
				'lp-admin__status-badge',
				`is-${ resolved }`,
				quiet ? 'is-quiet' : '',
				'lg' === size ? 'is-large' : '',
				isGoing ? 'is-going' : '',
				description ? '' : className,
			]
				.filter( Boolean )
				.join( ' ' ) }
		>
			{ label }
		</Badge>
	);

	if ( ! description ) {
		return badge;
	}

	return (
		<Tooltip.Root>
			<Tooltip.Trigger
				render={
					<span
						className={ [
							'lp-admin__status-badge-trigger',
							className,
						]
							.filter( Boolean )
							.join( ' ' ) }
						// Focusable so keyboard users reach the tooltip; the description is also in the accessible name below.
						tabIndex={ 0 }
					/>
				}
			>
				{ badge }
				<VisuallyHidden>{ `: ${ description }` }</VisuallyHidden>
			</Tooltip.Trigger>
			<Tooltip.Popup>{ description }</Tooltip.Popup>
		</Tooltip.Root>
	);
}

/**
 * A row of status badges that wraps, for a cell or a header holding more than
 * one.
 *
 * @param {Object}  props             Props.
 * @param {Element} props.children    StatusBadges.
 * @param {string}  [props.label]     Accessible name for the group.
 * @param {string}  [props.className] Extra class names.
 * @return {Element} The row.
 */
export function StatusBadges( { children, label, className } ) {
	return (
		<span
			className={ [ 'lp-admin__status-badges', className ]
				.filter( Boolean )
				.join( ' ' ) }
			role={ label ? 'group' : undefined }
			aria-label={ label }
		>
			{ children }
		</span>
	);
}
