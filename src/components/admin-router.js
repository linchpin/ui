/**
 * WordPress dependencies
 */
import {
	createContext,
	forwardRef,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from '@wordpress/element';

/**
 * Internal dependencies
 */
import { isSameScreen } from '../utils/admin-url';

/**
 * Following links inside one wp-admin screen without reloading it.
 *
 * A screen with a list and a page per record — a site, a client, a package —
 * wants each record to have an address: something a person can bookmark,
 * paste into Slack, open in a second tab, or reach from an alert email. The
 * address is the query string next to `page`, and once that is true the only
 * thing left is to stop every click from reloading the whole of wp-admin.
 *
 * That is all this does. There is no route table, no matching and no nested
 * outlets: the screen reads the query string and renders what it names, the
 * way a wp-admin screen already does on a full load. Mantle reached for
 * react-router's `MemoryRouter` and then wrote a hundred lines keeping it and
 * the address bar in step; the address bar *is* the state here, so there is
 * nothing to keep in step.
 *
 * - `<AdminRouter>` holds the current address and updates it on Back and
 *   Forward.
 * - `useAdminLocation()` reads it. A component that calls it re-renders when
 *   the address changes.
 * - `useNavigate()` follows an address: in place when it is the same screen
 *   (same file, same `page`), as an ordinary page load when it is not, so a
 *   link to another menu item still gets wp-admin's menu, capability check
 *   and scripts.
 * - `<AdminLink>` is an `<a>` that does the same for a click, and leaves
 *   every click that means "somewhere else" — ⌘, Ctrl, Shift, Alt, the middle
 *   button, `target` — to the browser. It is the `components.link` for
 *   `<LinchpinAdminPage>` and the `linkComponent` for the nav and the
 *   breadcrumbs.
 *
 * Every piece works without the provider, as a plain link to a plain page
 * load, so a component written against them can render anywhere.
 */

const AdminRouterContext = createContext( null );

/**
 * @return {Object} The address loaded, in the shape `useAdminLocation()` returns.
 */
function readLocation() {
	if ( typeof window === 'undefined' ) {
		return {
			href: '',
			pathname: '',
			search: '',
			hash: '',
			query: new URLSearchParams(),
		};
	}

	const { href, pathname, search, hash } = window.location;

	return {
		href,
		pathname,
		search,
		hash,
		query: new URLSearchParams( search ),
	};
}

/**
 * Follow an address with no router to do it in place.
 *
 * @param {string} href The address.
 */
function load( href ) {
	window.location.assign( href );
}

/**
 * Holds the address for every link and view beneath it.
 *
 * Mount it once, inside the frame and around the page.
 *
 * @param {Object}   props            Props.
 * @param {Function} [props.onChange] Called with the new location after an in-place navigation or Back/Forward — to set `document.title`, say.
 * @param {Element}  props.children   The screen.
 * @return {Element} The provider.
 */
export function AdminRouter( { onChange, children } ) {
	const [ location, setLocation ] = useState( readLocation );

	useEffect( () => {
		const onPopState = () => setLocation( readLocation() );

		window.addEventListener( 'popstate', onPopState );

		return () => window.removeEventListener( 'popstate', onPopState );
	}, [] );

	useEffect( () => {
		onChange?.( location );
		// Only a change of address should call it, not a new handler.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ location ] );

	const navigate = useCallback( ( href, { replace = false } = {} ) => {
		if ( ! isSameScreen( href ) ) {
			load( href );
			return;
		}

		const url = new URL( href, window.location.href );

		if ( url.href === window.location.href ) {
			return;
		}

		window.history[ replace ? 'replaceState' : 'pushState' ](
			null,
			'',
			url.href
		);
		setLocation( readLocation() );

		// A new view starts at the top, as a new page would. Replacing the
		// address — recording a filter, say — is not a new view.
		if ( ! replace ) {
			window.scrollTo( 0, 0 );
		}
	}, [] );

	const value = useMemo(
		() => ( { location, navigate } ),
		[ location, navigate ]
	);

	return (
		<AdminRouterContext.Provider value={ value }>
			{ children }
		</AdminRouterContext.Provider>
	);
}

/**
 * The current address.
 *
 * @return {Object} `{ href, pathname, search, hash, query }`, where `query` is a `URLSearchParams`. Treat it as read-only.
 */
export function useAdminLocation() {
	const router = useContext( AdminRouterContext );

	return router ? router.location : readLocation();
}

/**
 * A function that follows an address.
 *
 * In place for the same screen, a page load for any other. Pass
 * `{ replace: true }` to change the address without adding a history entry,
 * e.g. to record a filter the person just chose.
 *
 * @return {Function} `( href, { replace } ) => void`.
 */
export function useNavigate() {
	const router = useContext( AdminRouterContext );

	return router ? router.navigate : load;
}

/**
 * A link that stays on the screen when it can.
 *
 * Renders an `<a>` with every prop it is given, so it can stand in wherever a
 * component takes a link component, and forwards its ref for the same reason
 * (core's `Page` navigation renders through it).
 *
 * @param {Object}   props            Props.
 * @param {string}   props.href       The address.
 * @param {boolean}  [props.replace]  Replace the history entry instead of adding one.
 * @param {Function} [props.onClick]  Called first; `event.preventDefault()` there cancels the navigation.
 * @param {Element}  [props.children] The link's text.
 * @param {Object}   ref              Forwarded to the `<a>`.
 * @return {Element} The link.
 */
function AdminLinkComponent(
	{ href, replace = false, onClick, children, ...props },
	ref
) {
	const navigate = useNavigate();
	const router = useContext( AdminRouterContext );

	const handleClick = ( event ) => {
		onClick?.( event );

		if (
			! router ||
			event.defaultPrevented ||
			event.button !== 0 ||
			event.metaKey ||
			event.ctrlKey ||
			event.shiftKey ||
			event.altKey ||
			( props.target && props.target !== '_self' ) ||
			props.download !== undefined ||
			! href ||
			! isSameScreen( href )
		) {
			return;
		}

		event.preventDefault();
		navigate( href, { replace } );
	};

	return (
		<a ref={ ref } href={ href } onClick={ handleClick } { ...props }>
			{ children }
		</a>
	);
}

export const AdminLink = forwardRef( AdminLinkComponent );
