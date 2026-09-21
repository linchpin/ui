/**
 * Give every relative specifier a file extension, at build time.
 *
 * WordPress source writes `from './components/admin-frame'`, and Babel with
 * `modules: false` hands that through untouched. A bundler resolves it, so
 * every plugin consuming this package is fine — but Node's own ESM resolver
 * requires the extension and refuses:
 *
 *     Error [ERR_MODULE_NOT_FOUND]: Cannot find module
 *     '.../build-module/components/admin-frame'
 *     imported from '.../build-module/index.js'
 *
 * The package declares `"type": "module"` and points `exports` at ESM, so it
 * presents as something Node can load and was not. Rewriting at build time
 * fixes the artifact while leaving the source looking like every other
 * WordPress package.
 *
 * Local rather than a dependency on purpose: the two published plugins that
 * do this were last released in 2021 and 2022, and a five-year-stale build
 * dependency is a worse trade than thirty lines we own.
 *
 * Resolution is against the filesystem, not a blind `.js` append, so a
 * directory import becomes `/index.js` and anything genuinely unresolvable is
 * left alone — a wrong path stays a visible error rather than becoming a
 * confidently wrong one.
 */

/**
 * External dependencies
 */
const { existsSync } = require( 'node:fs' );
const { dirname, resolve } = require( 'node:path' );

/** Extensions Node will not need us to add. */
const RESOLVED = /\.(js|mjs|cjs|json|node|css|scss)$/;

/** The extensions a source file may actually have here. */
const CANDIDATES = [ '.js', '.jsx' ];

/**
 * Work out what a relative specifier should become.
 *
 * @param {string} source   The specifier, e.g. `./components/admin-frame`.
 * @param {string} filename The file it appears in.
 * @return {string|null} The rewritten specifier, or null to leave it alone.
 */
function rewrite( source, filename ) {
	if ( ! source.startsWith( './' ) && ! source.startsWith( '../' ) ) {
		return null;
	}

	if ( RESOLVED.test( source ) ) {
		return null;
	}

	if ( ! filename ) {
		return null;
	}

	const from = dirname( filename );

	for ( const extension of CANDIDATES ) {
		if ( existsSync( resolve( from, source + extension ) ) ) {
			// Always `.js`: the output is compiled, so a `.jsx` source file
			// lands beside its siblings as `.js`.
			return `${ source }.js`;
		}
	}

	for ( const extension of CANDIDATES ) {
		if ( existsSync( resolve( from, source, `index${ extension }` ) ) ) {
			return `${ source }/index.js`;
		}
	}

	return null;
}

/**
 * @return {Object} The Babel plugin.
 */
module.exports = function addJsExtension() {
	/**
	 * @param {Object} path  The declaration's path.
	 * @param {Object} state Babel's file state.
	 */
	const visit = ( path, state ) => {
		const { source } = path.node;

		// `export { a }` with no `from` has no source to rewrite.
		if ( ! source ) {
			return;
		}

		const next = rewrite( source.value, state.file.opts.filename );

		if ( next ) {
			source.value = next;
		}
	};

	return {
		name: 'add-js-extension',
		visitor: {
			ImportDeclaration: visit,
			ExportNamedDeclaration: visit,
			ExportAllDeclaration: visit,
		},
	};
};
