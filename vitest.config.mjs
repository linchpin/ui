/**
 * Vitest configuration.
 *
 * `wp-scripts test-unit-js` runs Vitest with this config. WordPress publishes
 * no Vitest preset, so what the retired Jest preset supplied lives here and in
 * test/setup.js: jsdom, jest-dom's matchers, and the console contract.
 */

/**
 * External dependencies
 */
import { fileURLToPath } from 'node:url';
import { transformWithOxc } from 'vite';
import { defineConfig } from 'vitest/config';

const ROOT = fileURLToPath( new URL( './', import.meta.url ) );

export default defineConfig( {
	plugins: [
		{
			/*
			 * The library writes JSX in `.js` files, which Babel accepts but
			 * Vite parses as plain JavaScript. Parse the source and the tests
			 * as JSX instead of renaming every file to `.jsx`.
			 */
			name: 'linchpin-ui:jsx-in-js',
			enforce: 'pre',
			transform( code, id ) {
				const inTree =
					id.startsWith( `${ ROOT }src/` ) ||
					id.startsWith( `${ ROOT }test/` );

				if ( ! inTree || ! id.endsWith( '.js' ) ) {
					return null;
				}

				return transformWithOxc( code, id, {
					lang: 'jsx',
					jsx: { runtime: 'automatic' },
				} );
			},
		},
	],
	test: {
		environment: 'jsdom',
		include: [ 'test/**/*.test.js' ],
		setupFiles: [ './test/setup.js' ],
		reporters: process.env.GITHUB_ACTIONS
			? [ 'default', 'github-actions' ]
			: [ 'default' ],
	},
} );
