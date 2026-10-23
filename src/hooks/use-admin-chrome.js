/**
 * WordPress dependencies
 */
import { useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { useAdminLocation } from '../components/admin-router';
import { markCurrentMenuItem, retitle } from '../utils/admin-chrome';

/**
 * Name the open screen in the browser title and highlight it in the
 * WordPress menu, every time it changes.
 *
 * Call it once, from whatever renders the current screen. Under
 * `<AdminRouter>` it follows the router's address; without one, the page's.
 *
 * @param {string} screenTitle The open screen's name, e.g. "Declutter".
 */
export default function useAdminChrome( screenTitle ) {
	const { href } = useAdminLocation();

	useEffect( () => {
		if ( screenTitle ) {
			document.title = retitle( document.title, screenTitle );
		}

		markCurrentMenuItem( { location: href } );
	}, [ href, screenTitle ] );
}
