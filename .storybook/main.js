/**
 * External dependencies
 */
import { resolve } from 'node:path';
import { mergeConfig } from 'vite';

/**
 * Storybook renders the *built* package, not the source.
 *
 * Vite parses JSX only in `.jsx`, and WordPress source is JSX in `.js`.
 * Rather than rename every component to suit one tool — or fight Storybook's
 * own plugin-react instance, which wins over any second copy — the stories
 * import `@linchpinagency/ui` exactly as a consuming plugin does. What you see
 * in Storybook is then the artifact we publish, which is the thing worth
 * reviewing. `npm run build` therefore has to come first; the scripts do that.
 *
 * @type {import('@storybook/react-vite').StorybookConfig}
 */
export default {
	stories: [ '../stories/**/*.stories.jsx' ],
	addons: [],
	framework: {
		name: '@storybook/react-vite',
		options: {},
	},
	core: { disableTelemetry: true },

	/**
	 * @param {Object} config The Vite config Storybook built.
	 * @return {Object} The config, pointed at our build output.
	 */
	viteFinal( config ) {
		return mergeConfig( config, {
			resolve: {
				alias: {
					'@linchpinagency/ui': resolve(
						import.meta.dirname,
						'../build-module/index.js'
					),
				},
			},
		} );
	},
};
