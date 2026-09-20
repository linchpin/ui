/**
 * wp-scripts brings the jsdom environment and the style mocks; this adds
 * jest-dom's matchers, points at our own test directory, and teaches Jest to
 * read the two dependencies that ship ES modules only.
 */
export default {
	preset: '@wordpress/jest-preset-default',
	setupFilesAfterEnv: [ '<rootDir>/test/setup.js' ],
	testMatch: [ '<rootDir>/test/**/*.test.js' ],
	collectCoverageFrom: [ 'src/**/*.js' ],
	/*
	 * `@wordpress/theme` is published as .mjs only and `uuid` (reached through
	 * `@wordpress/components`) is ESM too. The preset transforms .js/.ts and
	 * skips node_modules, so both have to be named here or the whole suite
	 * fails to load. Node 24.9+ can require ESM natively, but CI should not
	 * depend on the runtime being new enough.
	 */
	transform: {
		'\\.[jt]sx?$': 'babel-jest',
		'\\.mjs$': 'babel-jest',
	},
	transformIgnorePatterns: [ 'node_modules/(?!(uuid|@wordpress/theme)/)' ],
};
