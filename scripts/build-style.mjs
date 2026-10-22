/**
 * Compile the stylesheets, then give every design token its fallback.
 *
 * The source writes bare `var(--wpds-*)` references, as @wordpress/theme's
 * stylelint rules require, so a hand-written fallback cannot drift from the
 * real value. Its PostCSS plugin then writes the generated fallback into each
 * reference, which is what lets `notice.css` paint on a wp-admin screen where
 * no design-tokens stylesheet has loaded — every screen a PHP `admin_notices`
 * notice can appear on. Inside a frame the tokens are defined and the
 * fallbacks are never read.
 *
 * Run through `npm run build:style`.
 */

/**
 * External dependencies
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import postcss from 'postcss';
import * as sass from 'sass';

/**
 * WordPress dependencies
 */
import dsTokenFallbacks from '@wordpress/theme/postcss-plugins/postcss-ds-token-fallbacks';

const ROOT = resolve( import.meta.dirname, '..' );

/** Source stylesheet → published file. */
const ENTRIES = {
	'src/chrome.scss': 'build-style/chrome.css',
	'src/notice.scss': 'build-style/notice.css',
};

for ( const [ source, target ] of Object.entries( ENTRIES ) ) {
	const from = resolve( ROOT, source );
	const to = resolve( ROOT, target );

	const { css } = sass.compile( from, {
		loadPaths: [ resolve( ROOT, 'node_modules' ) ],
		style: 'expanded',
	} );

	const result = await postcss( [ dsTokenFallbacks ] ).process( css, {
		from,
		to,
	} );

	await mkdir( dirname( to ), { recursive: true } );
	await writeFile( to, result.css );

	process.stdout.write( `${ source } → ${ target }\n` );
}
