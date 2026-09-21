/**
 * Prove the built package is loadable by Node, not only by a bundler.
 *
 * `build-module` is what consumers resolve, and for most of them a bundler
 * does the resolving and forgives a missing file extension. Node's own ESM
 * resolver does not, so the package can present as ESM — `"type": "module"`,
 * an `exports` map pointing at it — while being unloadable by Node. That was
 * true of every version up to 0.2.0.
 *
 * `scripts/babel-plugin-add-js-extension.cjs` fixes it at build time and is
 * unit tested, but what ships is the build output, and a Babel env that
 * stopped applying the plugin would leave every unit test passing. So this
 * checks the artifact.
 *
 * Two assertions, because each catches what the other misses:
 *
 * 1. A scan, which names every offending specifier. Deliberately
 *    quote-agnostic: Babel prints single quotes when it passes a node through
 *    untouched and double quotes when it rewrites one, so a check written
 *    against double quotes alone passes in exactly the case it exists to
 *    catch.
 * 2. An actual import, which is the real question and cannot be fooled.
 *
 * Run directly, or through `npm run verify:esm`.
 */

/**
 * External dependencies
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = 'build-module';
const ENTRY = join( ROOT, 'index.js' );

/** Extensions Node resolves without help. */
const RESOLVED = /\.(js|mjs|cjs|json|node|css|scss)$/;

/** `from '…'` and bare `import '…'`, in either quote style. */
const SPECIFIER = /(?:from|import)\s+['"](\.[^'"]*)['"]/g;

/**
 * @param {string} dir Directory to walk.
 * @return {string[]} Every `.js` file beneath it.
 */
function jsFiles( dir ) {
	return readdirSync( dir ).flatMap( ( entry ) => {
		const path = join( dir, entry );

		if ( statSync( path ).isDirectory() ) {
			return jsFiles( path );
		}

		return path.endsWith( '.js' ) ? [ path ] : [];
	} );
}

const offenders = jsFiles( ROOT ).flatMap( ( file ) =>
	[ ...readFileSync( file, 'utf8' ).matchAll( SPECIFIER ) ]
		.map( ( match ) => match[ 1 ] )
		.filter( ( specifier ) => ! RESOLVED.test( specifier ) )
		.map( ( specifier ) => `${ relative( '.', file ) } → ${ specifier }` )
);

if ( offenders.length ) {
	console.error(
		`::error::${ ROOT } has ${ offenders.length } relative import(s) with no file extension, which Node's ESM resolver cannot load. Is the add-js-extension plugin still wired into the "module" Babel env?`
	);
	offenders.forEach( ( line ) => console.error( `  ${ line }` ) );
	process.exit( 1 );
}

try {
	const module = await import( pathToFileURL( ENTRY ).href );
	const count = Object.keys( module ).length;

	if ( ! count ) {
		throw new Error( `${ ENTRY } resolved but exported nothing` );
	}

	console.log(
		`${ ENTRY } resolves under native ESM, ${ count } exports, every relative specifier extended.`
	);
} catch ( error ) {
	console.error(
		`::error::${ ENTRY } does not resolve under native ESM: ${ error.message }`
	);
	process.exit( 1 );
}
