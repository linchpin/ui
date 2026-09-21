/**
 * External dependencies
 */
import { transformSync } from '@babel/core';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

/**
 * Internal dependencies
 */
import addJsExtension from '../scripts/babel-plugin-add-js-extension.cjs';

/*
 * The plugin resolves against the filesystem rather than appending `.js` to
 * anything that looks relative, so the fixtures have to be real files.
 */
let root;

beforeAll( () => {
	root = mkdtempSync( join( tmpdir(), 'lp-babel-' ) );

	mkdirSync( join( root, 'components' ), { recursive: true } );
	mkdirSync( join( root, 'bundle' ), { recursive: true } );

	writeFileSync( join( root, 'context.js' ), '' );
	writeFileSync( join( root, 'components', 'admin-frame.js' ), '' );
	writeFileSync( join( root, 'components', 'logo.jsx' ), '' );
	writeFileSync( join( root, 'bundle', 'index.js' ), '' );
} );

/**
 * @param {string} code Source to transform, as if it were `<root>/index.js`.
 * @return {string} The transformed code.
 */
function transform( code ) {
	return transformSync( code, {
		filename: join( root, 'index.js' ),
		configFile: false,
		babelrc: false,
		plugins: [ addJsExtension ],
	} ).code;
}

/**
 * The module specifiers in some transformed code.
 *
 * Babel normalises string quotes, so asserting on a quoted substring tests
 * Babel's formatting as much as our rewrite. Compare the specifiers instead.
 *
 * @param {string} code Source to transform.
 * @return {string[]} Every `from` / bare-import specifier, in order.
 */
function specifiers( code ) {
	return [ ...transform( code ).matchAll( /["']([^"']+)["'];/g ) ].map(
		( match ) => match[ 1 ]
	);
}

describe( 'the add-js-extension Babel plugin', () => {
	it( 'extends a relative import, which is what Node refuses without', () => {
		expect( specifiers( "import x from './context';" ) ).toEqual( [
			'./context.js',
		] );
	} );

	it( 'extends every form that carries a source', () => {
		// `export … from` is 21 of the 44 specifiers in this package, so a
		// plugin that only visited imports would fix less than half of them.
		expect(
			specifiers( "export { a } from './components/admin-frame';" )
		).toEqual( [ './components/admin-frame.js' ] );

		expect( specifiers( "export * from './context';" ) ).toEqual( [
			'./context.js',
		] );
	} );

	it( 'writes .js for a .jsx source, because the output is compiled', () => {
		expect( specifiers( "import Logo from './components/logo';" ) ).toEqual(
			[ './components/logo.js' ]
		);
	} );

	it( 'resolves a directory import to its index', () => {
		expect( specifiers( "import b from './bundle';" ) ).toEqual( [
			'./bundle/index.js',
		] );
	} );

	it( 'leaves bare specifiers alone — those are the package manager\u2019s', () => {
		expect( specifiers( "import { __ } from '@wordpress/i18n';" ) ).toEqual(
			[ '@wordpress/i18n' ]
		);
	} );

	it( 'does not double up an extension it has already got', () => {
		expect( specifiers( "import x from './context.js';" ) ).toEqual( [
			'./context.js',
		] );
		expect( specifiers( "import './style.scss';" ) ).toEqual( [
			'./style.scss',
		] );
	} );

	it( 'leaves an unresolvable specifier visibly wrong', () => {
		// Guessing here would turn a broken path into a confidently broken
		// one, and the error would then name a file that never existed.
		expect( specifiers( "import x from './nope';" ) ).toEqual( [
			'./nope',
		] );
	} );

	it( 'ignores an export that has no source to rewrite', () => {
		expect( () => transform( 'const a = 1; export { a };' ) ).not.toThrow();
	} );
} );
