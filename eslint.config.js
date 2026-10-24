/**
 * ESLint flat config. wp-scripts owns the rule set; this only scopes it and
 * turns off the one rule that cannot apply to a package with no text domain.
 */

/**
 * External dependencies
 */
import wpScriptsConfig from '@wordpress/scripts/config/eslint.config.cjs';

export default [
	{
		ignores: [
			'build-module/**',
			'build-style/**',
			'storybook-static/**',
			'node_modules/**',
			'*.config.js',
		],
	},
	...wpScriptsConfig,
	{
		rules: {
			/*
			 * The package has no text domain of its own, and cannot: a shared
			 * library cannot know the domain of the plugin bundling it. See
			 * src/copy.js and docs/ui/development/internationalization.md.
			 */
			'@wordpress/i18n-text-domain': 'off',
		},
	},
	{
		/*
		 * The library is built on @wordpress/ui. A legacy
		 * @wordpress/components import where ui has the replacement fails
		 * lint, so none creeps back in. `allowUseWithCaution` because the
		 * library's own building blocks (Button, Menu, IconButton,
		 * ButtonLink) are still marked use-with-caution upstream.
		 */
		files: [ 'src/**/*.js' ],
		rules: {
			'@wordpress/use-recommended-components': [
				'error',
				{ allowUseWithCaution: true },
			],
		},
	},
	{
		/*
		 * Stories import the package by its own name, as a plugin does, so
		 * they review the built artifact. That name resolves to
		 * build-module/, which CI lints before it builds.
		 */
		files: [ 'stories/**' ],
		rules: {
			'import/no-unresolved': [
				'error',
				{ ignore: [ '^@linchpinagency/ui$' ] },
			],
		},
	},
	{
		// Build scripts are run from a terminal and report to it.
		files: [ 'scripts/**/*.mjs' ],
		rules: { 'no-console': 'off' },
	},
];
