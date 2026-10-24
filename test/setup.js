/**
 * Vitest environment setup.
 *
 * Runs before every test file: jest-dom's matchers, the globals React and
 * WordPress scripts expect, and the console contract -- a test that logs to
 * the console fails, as it did under the Jest preset.
 */

/**
 * External dependencies
 */
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { format } from 'node:util';
import { afterEach, beforeEach, vi } from 'vitest';

// Run with WordPress's development checks on, as builds do with SCRIPT_DEBUG.
globalThis.SCRIPT_DEBUG = true;

// Let react-dom's act() know it is running under a test runner.
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// Testing Library unmounts after each test only where Vitest's globals are on;
// they are not, so it is done here.
afterEach( () => cleanup() );

/*
 * Console contract.
 *
 * Unexpected console output usually means React or a WordPress package warned
 * about something the test should not do, so any call fails the test that made
 * it. A test that expects output asserts on the spy and clears it with
 * `mockClear()`.
 */
const CONSOLE_METHODS = [ 'error', 'info', 'log', 'warn' ];

const consoleSpies = CONSOLE_METHODS.map( ( method ) =>
	vi.spyOn( console, method ).mockImplementation( () => {} )
);

beforeEach( () => {
	consoleSpies.forEach( ( spy ) => spy.mockClear() );
} );

afterEach( () => {
	const calls = consoleSpies.flatMap( ( spy, index ) =>
		spy.mock.calls.map(
			( args ) =>
				`console.${ CONSOLE_METHODS[ index ] }: ${ format( ...args ) }`
		)
	);

	if ( calls.length ) {
		throw new Error(
			`Unexpected console output:\n\n${ calls.join( '\n\n' ) }`
		);
	}
} );
