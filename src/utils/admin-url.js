/**
 * Addresses inside wp-admin, built from the screen you are on.
 *
 * A screen that has more than one view — a list and a record's own page, a
 * record and its sections — keeps the view in the query string, next to the
 * `page` argument wp-admin routes on. Building those links by copying the
 * current URL and changing one argument (what `sectionNavigation()` does, and
 * what every screen did by hand before it) carries everything else along
 * with it: a search typed on one view arrives as a search on the next, and a
 * record's ID survives into a list that has no use for it. This starts from
 * the screen instead — its file and its `page` — and adds only what the link
 * names, plus whatever the caller asks to keep.
 */

/**
 * The address a link should carry.
 *
 * @param {Object}          [args]         Query arguments to set. `null`, `undefined`, `false` and `''` remove one; arrays are joined with commas.
 * @param {Object}          [options]      Options.
 * @param {string[]|true}   [options.keep] Arguments to carry over from the current address besides `page`, or `true` for all of them.
 * @param {string}          [options.path] Another wp-admin file to point at, e.g. `admin.php`. Resolved against the current address.
 * @param {Location|string} [options.from] The address to build from. Defaults to `window.location`.
 * @return {string} A path and query string, e.g. `/wp-admin/admin.php?page=sites&site=35`.
 */
export function adminUrl( args = {}, { keep = [], path, from } = {} ) {
	const base = toUrl( from );
	const target = path ? new URL( path, base ) : base;
	const current = base.searchParams;
	const params = new URLSearchParams();

	if ( keep === true ) {
		current.forEach( ( value, key ) => params.set( key, value ) );
	} else {
		[ 'page', ...keep ].forEach( ( key ) => {
			if ( current.has( key ) ) {
				params.set( key, current.get( key ) );
			}
		} );
	}

	Object.entries( args ).forEach( ( [ key, value ] ) => {
		if (
			value === null ||
			value === undefined ||
			value === false ||
			value === ''
		) {
			params.delete( key );
			return;
		}

		params.set(
			key,
			Array.isArray( value ) ? value.join( ',' ) : String( value )
		);
	} );

	const query = params.toString();

	return `${ target.pathname }${ query ? `?${ query }` : '' }`;
}

/**
 * Whether an address is the screen already loaded, so a link to it can be
 * followed without reloading the page.
 *
 * Same file, same `page`. wp-admin decides which menu item is current, which
 * scripts load and which capability applies from exactly those two, so a link
 * that changes either has to be a real navigation; anything else is a view of
 * the screen already on the page.
 *
 * @param {string|URL}      href   The address.
 * @param {Location|string} [from] The address loaded. Defaults to `window.location`.
 * @return {boolean} True when following it needs no reload.
 */
export function isSameScreen( href, from ) {
	const base = toUrl( from );
	let url;

	try {
		url = new URL( href, base );
	} catch {
		return false;
	}

	return (
		url.origin === base.origin &&
		url.pathname === base.pathname &&
		url.searchParams.get( 'page' ) === base.searchParams.get( 'page' )
	);
}

/**
 * @param {Location|string|undefined} from An address, or nothing for the current one.
 * @return {URL} It, as a URL.
 */
function toUrl( from ) {
	if ( typeof from === 'string' ) {
		return new URL( from, 'http://localhost' );
	}

	const location =
		from ?? ( typeof window === 'undefined' ? undefined : window.location );

	if ( location?.href ) {
		return new URL( location.href );
	}

	// A Location-like object without an href, as tests pass.
	return new URL(
		`${ location?.pathname ?? '/' }${ location?.search ?? '' }`,
		'http://localhost'
	);
}
