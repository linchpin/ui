/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { AdminLink } from './admin-router';

/**
 * A count, what it counts, and where it leads.
 *
 * Every screen that lists records grows a row of these above the list —
 * sites needing updates, packages withheld, jobs that failed — and every one
 * of our plugins drew its own, out of a `<button>` here and a `<div>` there.
 * The two drifted: a tile rendered as a `div` overflowed its grid track while
 * the `button` beside it did not, because only one of them was border-box.
 *
 * A tile is one of three things, and its props say which:
 *
 * - **A filter** — `onClick` with `isPressed`. It narrows the list beneath
 *   it, and announces itself as a toggle so a screen reader hears which
 *   filter is on.
 * - **A link** — `href`. It leads to the list it counts, on this screen or
 *   another. It renders through `<AdminLink>`, so under `<AdminRouter>` a
 *   link to the same screen does not reload it.
 * - **A fact** — neither. Just the number.
 *
 * `footer` sits outside the clickable part, for anything that is itself
 * interactive — a breakdown of the count into links, say. A link inside a
 * button is not something a browser or a screen reader can make sense of.
 *
 * The number's colour is its tone, and the tone is the reading of the number,
 * not decoration: `error` for something that needs a person now, `warning`
 * for drift, `success` for a count that is good news, `neutral` otherwise.
 *
 * @param {Object}        props                 Props.
 * @param {number|string} props.value           The count. A number is formatted for the reader's locale.
 * @param {string}        props.label           What it counts, e.g. "Sites needing updates".
 * @param {Element}       [props.detail]        One line of context under the label.
 * @param {string}        [props.tone]          `neutral` (default), `brand`, `success`, `warning` or `error`.
 * @param {string}        [props.href]          Makes the tile a link.
 * @param {Function}      [props.onClick]       Makes the tile a button.
 * @param {boolean}       [props.isPressed]     For a filter tile: whether its filter is on.
 * @param {boolean}       [props.isLoading]     Draw a placeholder instead of the value.
 * @param {Element}       [props.footer]        Below the tile's clickable part, e.g. a breakdown.
 * @param {Component}     [props.linkComponent] Rendered in place of `<AdminLink>`.
 * @param {string}        [props.className]     Extra class names.
 * @return {Element} The tile.
 */
export default function StatTile( {
	value,
	label,
	detail,
	tone = 'neutral',
	href,
	onClick,
	isPressed,
	isLoading = false,
	footer,
	linkComponent: Link = AdminLink,
	className,
} ) {
	const body = (
		<>
			<span className="lp-admin__stat-tile-value">
				{ isLoading ? (
					<>
						<span
							className="lp-admin__stat-tile-placeholder"
							aria-hidden="true"
						/>
						<span className="screen-reader-text">
							{ __( 'Loading' ) }
						</span>
					</>
				) : (
					formatValue( value )
				) }
			</span>
			<span className="lp-admin__stat-tile-label">{ label }</span>
			{ detail && (
				<span className="lp-admin__stat-tile-detail">{ detail }</span>
			) }
		</>
	);

	let main;

	if ( href && ! isLoading ) {
		main = (
			<Link href={ href } className="lp-admin__stat-tile-main">
				{ body }
			</Link>
		);
	} else if ( onClick && ! isLoading ) {
		main = (
			<button
				type="button"
				className="lp-admin__stat-tile-main"
				onClick={ onClick }
				aria-pressed={
					isPressed === undefined ? undefined : Boolean( isPressed )
				}
			>
				{ body }
			</button>
		);
	} else {
		main = <div className="lp-admin__stat-tile-main">{ body }</div>;
	}

	return (
		<div
			aria-busy={ isLoading || undefined }
			className={ [
				'lp-admin__stat-tile',
				`is-${ tone }`,
				isPressed ? 'is-pressed' : '',
				href || onClick ? 'is-interactive' : '',
				className,
			]
				.filter( Boolean )
				.join( ' ' ) }
		>
			{ main }
			{ footer && (
				<div className="lp-admin__stat-tile-footer">{ footer }</div>
			) }
		</div>
	);
}

/**
 * A row of tiles that wraps to the width it is given.
 *
 * A group, named, so the row reads as one summary rather than as a run of
 * unrelated buttons.
 *
 * @param {Object}  props             Props.
 * @param {string}  [props.label]     Names the group for assistive technology, e.g. "Site summary".
 * @param {Element} props.children    `<StatTile>`s.
 * @param {string}  [props.className] Extra class names.
 * @return {Element} The row.
 */
export function StatTiles( { label, children, className } ) {
	return (
		<div
			role="group"
			aria-label={ label }
			className={ [ 'lp-admin__stat-tiles', className ]
				.filter( Boolean )
				.join( ' ' ) }
		>
			{ children }
		</div>
	);
}

/**
 * @param {number|string|Element} value The count.
 * @return {string|Element} It, formatted when it is a number.
 */
function formatValue( value ) {
	if ( typeof value !== 'number' || ! Number.isFinite( value ) ) {
		return value ?? '—';
	}

	return new Intl.NumberFormat().format( value );
}
