/**
 * What every piece of the chrome needs to know, without prop drilling.
 */

/**
 * WordPress dependencies
 */
import { createContext, useContext } from '@wordpress/element';

/**
 * Identity, brand and links, published by `<LinchpinAdminFrame>`.
 *
 * A component reads this rather than taking the same three props at every
 * level. Each one still accepts an explicit prop, which wins — the context is
 * the default, not a lock.
 */
export const AdminContext = createContext( {
	plugin: { name: '', slug: '', version: '' },
	brand: {},
	links: null,
} );

/**
 * @return {Object} The nearest frame's identity, brand and links.
 */
export function useAdminContext() {
	return useContext( AdminContext );
}
