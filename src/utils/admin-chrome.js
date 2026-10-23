/**
 * Keep WordPress's own chrome in step with a screen that changes in place.
 *
 * PHP names the screen in the browser title and highlights it in the
 * WordPress menu, but only for the screen the page was loaded on. A plugin
 * that switches screens without a reload, under `AdminRouter` or its own
 * routing, leaves both describing the first screen after the first click:
 * every tab says "Dashboard", and so does the history a screen reader reads.
 */

/**
 * What WordPress puts between the screen name and the site in an admin title
 * ("Dashboard ‹ Acme — WordPress"), as the browser reads `&lsaquo;`.
 *
 * @type {string}
 */
const TITLE_SEPARATOR = ' ‹ ';

/**
 * Swap the screen name at the front of an admin title.
 *
 * A title without the separator is left alone: it is not one WordPress built,
 * so there is no screen name in it to swap.
 *
 * @param {string} title       The current document title.
 * @param {string} screenTitle The open screen's name.
 * @return {string} The document title.
 */
export function retitle( title, screenTitle ) {
	const at = title.indexOf( TITLE_SEPARATOR );

	if ( ! screenTitle || at === -1 ) {
		return title;
	}

	return screenTitle + title.slice( at );
}

/**
 * Mark the WordPress menu item for the current address, and only that one.
 *
 * A plugin's screens are usually submenu links to one admin page, told apart
 * by a query argument (`view`, `tab`) that the first link often leaves out.
 * So the current item is the one whose arguments the address carries, all of
 * them, and the most of them: on `?page=mantle&view=declutter`, the link with
 * `view=declutter` beats the bare `?page=mantle`, which still wins for any
 * view no link names. Only links to the same `page` are touched.
 *
 * @param {Object}   [options]          Options.
 * @param {string}   [options.location] The current address. Defaults to `window.location.href`.
 * @param {Document} [options.document] The document to update.
 * @return {Element|null} The link now marked current, if any.
 */
export function markCurrentMenuItem( {
	location = window.location.href,
	document: doc = window.document,
} = {} ) {
	const current = new URL( location );
	const page = current.searchParams.get( 'page' );

	if ( ! page ) {
		return null;
	}

	const links = [
		...doc.querySelectorAll( '#adminmenu .wp-submenu a[href]' ),
	].filter( ( link ) => {
		try {
			const url = new URL( link.getAttribute( 'href' ), location );

			return (
				url.pathname === current.pathname &&
				url.searchParams.get( 'page' ) === page
			);
		} catch {
			return false;
		}
	} );

	let best = null;
	let bestScore = -1;

	links.forEach( ( link ) => {
		const params = [
			...new URL( link.getAttribute( 'href' ), location ).searchParams,
		];
		const matches = params.every(
			( [ key, value ] ) => current.searchParams.get( key ) === value
		);

		if ( matches && params.length > bestScore ) {
			best = link;
			bestScore = params.length;
		}
	} );

	links.forEach( ( link ) => {
		const isCurrent = link === best;

		link.classList.toggle( 'current', isCurrent );
		link.parentElement?.classList.toggle( 'current', isCurrent );

		if ( isCurrent ) {
			link.setAttribute( 'aria-current', 'page' );
		} else {
			link.removeAttribute( 'aria-current' );
		}
	} );

	return best;
}
