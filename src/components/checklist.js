/**
 * WordPress dependencies
 */
import { __, _n, sprintf } from '@wordpress/i18n';
import { Button, Icon, Skeleton, VisuallyHidden } from '@wordpress/ui';
import { caution, check, closeSmall, info } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { AdminLink } from './admin-router';
import StatusBadge, { statusTone } from './status-badge';

/**
 * The statuses a checklist understands out of the box, in the order a
 * to-do list wants them: what is wrong first, what doesn't apply last. A
 * caller with its own words (a setup wizard's `complete`, a gate's `skipped`)
 * passes its own map; the key order of whichever map is used is also the
 * order `sortByStatus` sorts by.
 *
 * Each status is `{ label, tone, quiet?, isGoing? }`, where `tone` is a
 * StatusBadge tone.
 */
export const CHECKLIST_STATUSES = {
	fail: { label: __( 'Fail' ), tone: 'error' },
	warning: { label: __( 'Warning' ), tone: 'warning' },
	running: { label: __( 'In progress' ), tone: 'info', isGoing: true },
	pending: { label: __( 'To do' ), tone: 'neutral' },
	unknown: { label: __( 'Unknown' ), tone: 'neutral' },
	pass: { label: __( 'Pass' ), tone: 'success' },
	na: { label: __( 'Doesn’t apply' ), tone: 'neutral', quiet: true },
};

/**
 * The icon each tone shows in the `icon` marker.
 */
const TONE_ICONS = {
	success: check,
	error: closeSmall,
	warning: caution,
	caution,
	info,
};

/**
 * The status of one item: the list's entry for it, with the item's own
 * overrides on top.
 *
 * @param {Object} item     Item.
 * @param {Object} statuses Status map.
 * @return {{label: string, tone: string, quiet: boolean, isGoing: boolean}} The status.
 */
function resolveStatus( item, statuses ) {
	const base = statuses[ item.status ] || {
		label: item.status ?? '',
		tone: 'neutral',
	};

	return {
		label: item.statusLabel ?? base.label,
		tone: statusTone( item.tone ?? base.tone ),
		quiet: Boolean( base.quiet ),
		isGoing: Boolean( item.isGoing ?? base.isGoing ),
	};
}

/**
 * Items sorted by where their status falls in the status map, keeping the
 * caller's order within a status.
 *
 * @param {Array}  items    Items.
 * @param {Object} statuses Status map.
 * @return {Array} A sorted copy.
 */
export function sortChecklistItems( items, statuses = CHECKLIST_STATUSES ) {
	const order = Object.keys( statuses );
	const rank = ( item ) => {
		const index = order.indexOf( item.status );

		return -1 === index ? order.length : index;
	};

	return items
		.map( ( item, index ) => ( { item, index } ) )
		.sort(
			( a, b ) => rank( a.item ) - rank( b.item ) || a.index - b.index
		)
		.map( ( { item } ) => item );
}

/**
 * "12 of 15 done": items whose status is a success, out of those that apply.
 * Quiet statuses (not applicable) are left out of both counts.
 *
 * @param {Array}  items    Items.
 * @param {Object} statuses Status map.
 * @return {string} The summary.
 */
export function checklistSummary( items, statuses = CHECKLIST_STATUSES ) {
	const resolved = items.map( ( item ) => resolveStatus( item, statuses ) );
	const applicable = resolved.filter( ( status ) => ! status.quiet );
	const done = applicable.filter(
		( status ) => 'success' === status.tone
	).length;

	return sprintf(
		/* translators: 1: items done, 2: items that apply. */
		_n( '%1$d of %2$d done', '%1$d of %2$d done', applicable.length ),
		done,
		applicable.length
	);
}

/**
 * Whether an address leaves this site.
 *
 * @param {string} href Address.
 * @return {boolean} True for another origin.
 */
function isExternal( href ) {
	try {
		return (
			new URL( href, window.location.href ).origin !==
			window.location.origin
		);
	} catch {
		return false;
	}
}

/**
 * One action: a node as given, a button for `onClick`, a link for `href`
 * (staying on the screen when it can, opening a new tab when it leaves the
 * site), or plain text when it is only a label.
 *
 * @param {Object}         props        Props.
 * @param {Object|Element} props.action Node or `{ label, href, onClick, external, primary }`.
 * @return {Element|null} The action.
 */
function ChecklistAction( { action } ) {
	if ( ! action ) {
		return null;
	}

	if ( 'object' !== typeof action || action.$$typeof ) {
		return action;
	}

	const { label, href, onClick, external, primary } = action;

	if ( onClick ) {
		return (
			<Button
				variant={ primary ? 'solid' : 'outline' }
				size="compact"
				onClick={ onClick }
			>
				{ label }
			</Button>
		);
	}

	if ( href && ( external || isExternal( href ) ) ) {
		return (
			<a href={ href } target="_blank" rel="noopener noreferrer">
				{ label }
				<VisuallyHidden>
					{ __( '(opens in a new tab)' ) }
				</VisuallyHidden>
			</a>
		);
	}

	if ( href ) {
		return <AdminLink href={ href }>{ label }</AdminLink>;
	}

	return <span className="lp-admin__checklist-action-text">{ label }</span>;
}

/**
 * The marker that leads a row: the status as a badge, or a round icon (a
 * number in place of the icon for a step still to do in an ordered list).
 *
 * @param {Object} props             Props.
 * @param {Object} props.status      Resolved status.
 * @param {string} props.marker      `badge` or `icon`.
 * @param {number} props.number      Position, for ordered lists; 0 when unordered.
 * @param {string} props.description Why, for the badge's tooltip.
 * @return {Element} The marker.
 */
function ChecklistMarker( { status, marker, number, description } ) {
	if ( 'icon' !== marker ) {
		return (
			<StatusBadge
				tone={ status.tone }
				quiet={ status.quiet }
				isGoing={ status.isGoing }
				description={ description }
			>
				{ status.label }
			</StatusBadge>
		);
	}

	const icon = TONE_ICONS[ status.tone ];
	// Only a step still to do (no judgement yet, or under way) shows its
	// number. A step that passed, failed or warned shows its icon, so a
	// failure in an ordered run still reads as one.
	const showNumber =
		number > 0 && [ 'neutral', 'info' ].includes( status.tone );

	return (
		<span
			className={ [
				'lp-admin__checklist-icon',
				`is-${ status.tone }`,
				status.quiet ? 'is-quiet' : '',
				status.isGoing ? 'is-going' : '',
			]
				.filter( Boolean )
				.join( ' ' ) }
			role="img"
			aria-label={ status.label }
			title={ description || undefined }
		>
			{ showNumber && <span aria-hidden="true">{ number }</span> }
			{ ! showNumber && icon && <Icon icon={ icon } size={ 18 } /> }
		</span>
	);
}

/**
 * The rows of one list.
 *
 * @param {Object}  props              Props.
 * @param {Array}   props.items        Items.
 * @param {Object}  props.statuses     Status map.
 * @param {string}  props.marker       `badge` or `icon`.
 * @param {boolean} props.ordered      Numbered steps.
 * @param {boolean} props.sortByStatus Sort by status.
 * @param {string}  [props.label]      Accessible name for the list.
 * @return {Element} The list.
 */
function ChecklistRows( {
	items,
	statuses,
	marker,
	ordered,
	sortByStatus,
	label,
} ) {
	const shown = sortByStatus ? sortChecklistItems( items, statuses ) : items;
	const List = ordered ? 'ol' : 'ul';

	return (
		<List className="lp-admin__checklist-items" aria-label={ label }>
			{ shown.map( ( item, index ) => {
				const status = resolveStatus( item, statuses );
				const actions = [
					...( item.action ? [ item.action ] : [] ),
					...( item.actions || [] ),
				];
				const title = item.onSelect ? (
					<button
						type="button"
						className="lp-admin__checklist-select"
						onClick={ () => item.onSelect( item ) }
					>
						{ item.label }
					</button>
				) : (
					item.label
				);

				return (
					<li
						key={ item.id ?? index }
						className={ [
							'lp-admin__checklist-item',
							`is-${ status.tone }`,
							status.quiet ? 'is-quiet' : '',
							item.current ? 'is-current' : '',
						]
							.filter( Boolean )
							.join( ' ' ) }
						aria-current={ item.current ? 'step' : undefined }
					>
						<span className="lp-admin__checklist-marker">
							<ChecklistMarker
								status={ status }
								marker={ marker }
								number={ ordered ? index + 1 : 0 }
								description={ item.description }
							/>
						</span>
						<span className="lp-admin__checklist-body">
							<span className="lp-admin__checklist-label">
								{ title }
							</span>
							{ item.detail && (
								<span className="lp-admin__checklist-detail">
									{ item.detail }
								</span>
							) }
							{ item.meta && (
								<span className="lp-admin__checklist-meta">
									{ item.meta }
								</span>
							) }
							{ actions.length > 0 && (
								<span className="lp-admin__checklist-actions">
									{ actions.map( ( action, position ) => (
										<ChecklistAction
											key={ position }
											action={ action }
										/>
									) ) }
								</span>
							) }
							{ item.children }
							{ item.items?.length > 0 && (
								<ChecklistRows
									items={ item.items }
									statuses={ statuses }
									marker={ marker }
									ordered={ ordered }
									sortByStatus={ false }
								/>
							) }
						</span>
					</li>
				);
			} ) }
		</List>
	);
}

/**
 * A list of things to check, each leading with its status.
 *
 * The other half of a status screen. A FactList says what is true; a
 * checklist says what is done, what isn't and what to do about it: a site's
 * setup audit, a plugin's health checks, an access gate, a setup wizard's
 * steps. Each row is a status marker, then a label, then what was found and
 * the action that fixes it.
 *
 * Statuses are words the caller owns: `statuses` maps each to a label and a
 * StatusBadge tone, defaulting to {@link CHECKLIST_STATUSES}. An item can
 * override its tone or label (a recommended check failing is a caution, not
 * an error) and carry a `description` for the badge's tooltip.
 *
 * Two markers: `badge` (the default) leads with the status as a StatusBadge;
 * `icon` with a round icon, which an `ordered` list numbers for the steps not
 * done yet. A `current` item is the step being worked on; `onSelect` makes an
 * item's label a button (re-opening a finished step); `items` nests sub-steps.
 *
 * @param {Object}         props                    Props.
 * @param {Array}          props.items              `[ { id, status, label, detail?, meta?, action?, actions?, children?, tone?, statusLabel?, description?, isGoing?, group?, current?, onSelect?, items? } ]`.
 * @param {Object}         [props.statuses]         Status key => `{ label, tone, quiet?, isGoing? }`. Its key order is the sort order.
 * @param {string}         [props.marker]           `badge` (default) or `icon`.
 * @param {boolean}        [props.ordered]          Numbered steps (`<ol>`).
 * @param {Array}          [props.groups]           `[ { id, title, description? } ]`; items name theirs with `group`.
 * @param {boolean}        [props.sortByStatus]     Sort each list by status, in `statuses` order.
 * @param {boolean|Object} [props.summary]          `true` for "n of m done", or a node of the caller's own.
 * @param {number}         [props.headingLevel]     Heading level of group titles. Default 3.
 * @param {string}         [props.label]            Accessible name for the list.
 * @param {boolean}        [props.isLoading]        Show placeholders instead of items.
 * @param {number}         [props.placeholderCount] How many placeholders. Default 3.
 * @param {string|Element} [props.emptyMessage]     Shown when there are no items.
 * @param {string}         [props.className]        Extra class names.
 * @return {Element|null} The checklist.
 */
export default function Checklist( {
	items = [],
	statuses = CHECKLIST_STATUSES,
	marker = 'badge',
	ordered = false,
	groups,
	sortByStatus = false,
	summary = false,
	headingLevel = 3,
	label,
	isLoading = false,
	placeholderCount = 3,
	emptyMessage,
	className,
} ) {
	const classes = [
		'lp-admin__checklist',
		`is-marker-${ 'icon' === marker ? 'icon' : 'badge' }`,
		className,
	]
		.filter( Boolean )
		.join( ' ' );

	if ( isLoading ) {
		return (
			<div className={ classes } aria-busy="true">
				<ul className="lp-admin__checklist-items">
					{ Array.from( { length: placeholderCount } ).map(
						( _, index ) => (
							<li
								key={ index }
								className="lp-admin__checklist-item is-placeholder"
							>
								<Skeleton className="lp-admin__checklist-placeholder" />
							</li>
						)
					) }
				</ul>
			</div>
		);
	}

	if ( ! items.length ) {
		return emptyMessage ? (
			<div className={ classes }>
				<p className="lp-admin__checklist-empty">{ emptyMessage }</p>
			</div>
		) : null;
	}

	const Heading = `h${ Math.min( 6, Math.max( 2, headingLevel ) ) }`;
	const rowProps = { statuses, marker, ordered, sortByStatus };
	const sections = groups?.length
		? [
				...groups.map( ( group ) => ( {
					...group,
					items: items.filter( ( item ) => group.id === item.group ),
				} ) ),
				{
					id: '__ungrouped',
					items: items.filter(
						( item ) =>
							! groups.some(
								( group ) => group.id === item.group
							)
					),
				},
			].filter( ( section ) => section.items.length )
		: null;

	return (
		<div className={ classes }>
			{ summary && (
				<p className="lp-admin__checklist-summary">
					{ true === summary
						? checklistSummary( items, statuses )
						: summary }
				</p>
			) }
			{ sections ? (
				sections.map( ( section ) => (
					<section
						key={ section.id }
						className="lp-admin__checklist-group"
					>
						{ section.title && (
							<Heading className="lp-admin__checklist-group-title">
								{ section.title }
							</Heading>
						) }
						{ section.description && (
							<p className="lp-admin__checklist-group-description">
								{ section.description }
							</p>
						) }
						<ChecklistRows
							{ ...rowProps }
							items={ section.items }
							label={ section.title || label }
						/>
					</section>
				) )
			) : (
				<ChecklistRows
					{ ...rowProps }
					items={ items }
					label={ label }
				/>
			) }
		</div>
	);
}
