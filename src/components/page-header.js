/**
 * WordPress dependencies
 */
import {
	createContext,
	createPortal,
	forwardRef,
	useCallback,
	useContext,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from '@wordpress/element';

/**
 * Internal dependencies
 */
import { AdminLink } from './admin-router';

/**
 * A screen's way into the header of the page it sits in.
 *
 * Core's `Page` draws the title, subtitle, badges, actions and section tabs
 * from props, but most of what goes there belongs to the screen inside it:
 * the screen knows its primary action, whether something is recording, which
 * of its sections is open. Without a way up, every screen puts its verbs in a
 * toolbar row at the top of its body instead, which is the one place the
 * header exists to save it from.
 *
 * `LinchpinAdminPage` provides this. Screens reach it through the fills and
 * the hook below, never directly.
 */
export const PageHeaderContext = createContext( null );

const AREAS = [ 'actions', 'badges', 'subTitle' ];

/**
 * The header's state, for `LinchpinAdminPage`.
 *
 * Element areas are portal targets rather than state: a screen re-renders its
 * actions whenever it renders, and copying a fresh element into the page's
 * state on every render would render the page forever. A fill only says
 * once, on mount, that its area is in use, and the page renders a target
 * there for as long as it is.
 *
 * @return {Object} `{ value, targets, sections }`: the context value, a target element per area (or null), and the registered sections.
 */
export function usePageHeaderState() {
	const [ fills, setFills ] = useState( {
		actions: 0,
		badges: 0,
		subTitle: 0,
	} );
	const [ nodes, setNodes ] = useState( {} );
	const [ sections, setSections ] = useState( null );

	// The screen's latest `onSelect`, read when a section link is clicked,
	// so a handler that changes identity on every render needs no memoising.
	const onSelectRef = useRef( null );

	const register = useCallback( ( area ) => {
		setFills( ( current ) => ( {
			...current,
			[ area ]: current[ area ] + 1,
		} ) );

		return () =>
			setFills( ( current ) => ( {
				...current,
				[ area ]: current[ area ] - 1,
			} ) );
	}, [] );

	// One stable ref callback per area, so React does not detach and
	// re-attach the target on every render.
	const targetRefs = useMemo(
		() =>
			Object.fromEntries(
				AREAS.map( ( area ) => [
					area,
					( node ) =>
						setNodes( ( current ) =>
							current[ area ] === node
								? current
								: { ...current, [ area ]: node }
						),
				] )
			),
		[]
	);

	const select = useCallback( ( name ) => {
		onSelectRef.current?.( name );
	}, [] );

	const value = useMemo(
		() => ( {
			register,
			nodes,
			registerSections: setSections,
			onSelectRef,
			select,
			queryArg: sections?.queryArg ?? 'tab',
			handlesSelect: !! sections?.hasOnSelect,
		} ),
		[ register, nodes, select, sections?.queryArg, sections?.hasOnSelect ]
	);

	const targets = Object.fromEntries(
		AREAS.map( ( area ) => [
			area,
			fills[ area ] > 0 ? (
				<span
					key={ `lp-header-${ area }` }
					ref={ targetRefs[ area ] }
					className="lp-admin__header-fill"
				/>
			) : null,
		] )
	);

	return { value, targets, sections };
}

/**
 * Render children in one area of the page header.
 *
 * @param {Object}  props          Props.
 * @param {string}  props.area     `actions`, `badges` or `subTitle`.
 * @param {Element} props.children What to show there.
 * @return {Element|null} A portal into the header, or nothing outside a page.
 */
function PageHeaderFill( { area, children } ) {
	const header = useContext( PageHeaderContext );
	const register = header?.register;

	useLayoutEffect( () => register?.( area ), [ register, area ] );

	const node = header?.nodes[ area ];

	return node ? createPortal( children, node ) : null;
}

/**
 * The screen's actions, right-aligned in the page header.
 *
 * Put the screen's verbs here (Save, Start recording, Report now), not in a
 * toolbar row at the top of the body. They render through a portal, so they
 * keep the screen's state and context. Several fills on one screen line up in
 * mount order, after any `actions` the page was given directly.
 *
 * Outside a `LinchpinAdminPage` this renders nothing.
 *
 * @param {Object}  props          Props.
 * @param {Element} props.children Buttons.
 * @return {Element|null} The fill.
 */
export function PageHeaderActions( { children } ) {
	return <PageHeaderFill area="actions">{ children }</PageHeaderFill>;
}

/**
 * Badges beside the page title, for the screen's state at a glance:
 * "Recording until 3:45 PM", "Not connected".
 *
 * They follow whatever `badges` the page was given, so pass `badges={ null }`
 * to the page to show only the screen's own.
 *
 * @param {Object}  props          Props.
 * @param {Element} props.children Badges.
 * @return {Element|null} The fill.
 */
export function PageHeaderBadges( { children } ) {
	return <PageHeaderFill area="badges">{ children }</PageHeaderFill>;
}

/**
 * The page subtitle, from inside the screen.
 *
 * For a sentence that depends on the screen's state. A fill replaces the
 * `subTitle` the page was given rather than adding to it, because a subtitle
 * is one sentence.
 *
 * @param {Object}  props          Props.
 * @param {Element} props.children The sentence.
 * @return {Element|null} The fill.
 */
export function PageHeaderSubTitle( { children } ) {
	return <PageHeaderFill area="subTitle">{ children }</PageHeaderFill>;
}

/**
 * Register a screen's sections as the page header's tabs.
 *
 * Sections are links, built by `sectionNavigation()`, so each one can be
 * opened in a new tab or bookmarked. With `onSelect`, a plain click on one is
 * handed to the screen to switch in place; without it, the link follows the
 * nearest `<AdminRouter>`, or loads the page.
 *
 * Re-registers only when the sections or the current one change, compared by
 * what they say rather than by array identity.
 *
 * @param {Object}   options             Options.
 * @param {Array}    options.sections    `[ { name, label } ]` in display order. Empty or absent clears the tabs.
 * @param {string}   [options.current]   The open section. Defaults to the URL's, then the first.
 * @param {Function} [options.onSelect]  Called with a section's name on a plain click.
 * @param {string}   [options.queryArg]  Query argument the sections vary. Defaults to `tab`.
 * @param {string}   [options.ariaLabel] Label for the tabs' navigation landmark.
 * @param {boolean}  [options.enabled]   Register at all. Defaults to true.
 * @return {boolean} Whether a page header is drawing the sections, so a screen outside a page can draw its own.
 */
export function usePageSections( {
	sections,
	current,
	onSelect,
	queryArg = 'tab',
	ariaLabel,
	enabled = true,
} = {} ) {
	const header = useContext( PageHeaderContext );
	const registerSections = header?.registerSections;
	const onSelectRef = header?.onSelectRef;
	const active = !! enabled && !! registerSections;

	// After every render, so a click always reaches the latest handler.
	useLayoutEffect( () => {
		if ( active && onSelectRef ) {
			onSelectRef.current = onSelect ?? null;
		}
	} );

	const sectionsKey = JSON.stringify(
		( sections || [] ).map( ( section ) => [ section.name, section.label ] )
	);
	const hasOnSelect = typeof onSelect === 'function';

	useLayoutEffect( () => {
		if ( ! active ) {
			return;
		}

		const items = JSON.parse( sectionsKey ).map( ( [ name, label ] ) => ( {
			name,
			label,
		} ) );

		registerSections(
			items.length
				? { items, current, queryArg, ariaLabel, hasOnSelect }
				: null
		);
	}, [
		active,
		registerSections,
		sectionsKey,
		current,
		queryArg,
		ariaLabel,
		hasOnSelect,
	] );

	useLayoutEffect( () => {
		if ( ! active ) {
			return undefined;
		}

		return () => {
			registerSections( null );

			if ( onSelectRef ) {
				onSelectRef.current = null;
			}
		};
	}, [ active, registerSections, onSelectRef ] );

	return active;
}

/**
 * Whether a click means "open this somewhere else".
 *
 * @param {Event} event The click.
 * @return {boolean} True for a modified or non-primary click.
 */
const isModifiedClick = ( event ) =>
	0 !== event.button ||
	event.metaKey ||
	event.ctrlKey ||
	event.shiftKey ||
	event.altKey;

/**
 * The link core's `Page` renders for each section tab.
 *
 * A plain click goes to the screen's `onSelect` when it registered one;
 * everything else is an `AdminLink`, which stays on the screen under a router
 * and is an ordinary link otherwise. Modified clicks are always left to the
 * browser, or the address the link advertises would be a lie.
 *
 * `forwardRef` because core's `Page` navigation renders this through a
 * `render` prop and passes a ref.
 */
export const SectionLink = forwardRef( function RoutedSectionLink(
	{ href, onClick, className, ...props },
	ref
) {
	const header = useContext( PageHeaderContext );

	const handleClick = ( event ) => {
		onClick?.( event );

		if (
			event.defaultPrevented ||
			! header?.handlesSelect ||
			isModifiedClick( event )
		) {
			return;
		}

		const name = new URL( href, window.location.href ).searchParams.get(
			header.queryArg
		);

		if ( ! name ) {
			return;
		}

		event.preventDefault();
		header.select( name );
	};

	return (
		<AdminLink
			ref={ ref }
			href={ href }
			className={ [ 'lp-admin__section-link', className ]
				.filter( Boolean )
				.join( ' ' ) }
			{ ...props }
			onClick={ handleClick }
		/>
	);
} );
