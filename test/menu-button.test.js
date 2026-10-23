/**
 * External dependencies
 */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/**
 * Internal dependencies
 */
import { MenuButton } from '../src';

const OPTIONS = [
	{ value: 15, label: 'For 15 minutes' },
	{ value: 60, label: 'For 1 hour' },
	{ value: 240, label: 'For 4 hours', disabled: true },
	{ type: 'separator' },
	{ value: 0, label: 'Until I stop it' },
];

const DESCRIPTION =
	'Recording watches every admin page load, which costs a little each time.';

/**
 * @param {Object} props Overrides.
 * @return {Object} The render result.
 */
const renderButton = ( props = {} ) =>
	render(
		<MenuButton
			label="Start recording"
			description={ DESCRIPTION }
			options={ OPTIONS }
			onSelect={ jest.fn() }
			{ ...props }
		/>
	);

describe( 'MenuButton', () => {
	it( 'is one button until it is opened', () => {
		renderButton();

		expect(
			screen.getByRole( 'button', { name: 'Start recording' } )
		).toBeInTheDocument();
		expect( screen.queryByRole( 'menu' ) ).toBeNull();
	} );

	it( 'opens a menu described by what to know before choosing', async () => {
		renderButton();

		await userEvent.click(
			screen.getByRole( 'button', { name: 'Start recording' } )
		);

		const menu = await screen.findByRole( 'menu' );

		expect( menu ).toHaveAccessibleDescription( DESCRIPTION );
		expect(
			screen
				.getAllByRole( 'menuitem' )
				.map( ( item ) => item.textContent )
		).toEqual( [
			'For 15 minutes',
			'For 1 hour',
			'For 4 hours',
			'Until I stop it',
		] );
		expect( screen.getByRole( 'separator' ) ).toBeInTheDocument();
	} );

	it( 'hands back the chosen value and closes', async () => {
		const onSelect = jest.fn();
		renderButton( { onSelect } );

		await userEvent.click(
			screen.getByRole( 'button', { name: 'Start recording' } )
		);
		await userEvent.click(
			await screen.findByRole( 'menuitem', { name: 'For 1 hour' } )
		);

		expect( onSelect ).toHaveBeenCalledWith( 60 );
		await waitFor( () =>
			expect( screen.queryByRole( 'menu' ) ).toBeNull()
		);
	} );

	it( 'does not choose a disabled option', async () => {
		const onSelect = jest.fn();
		renderButton( { onSelect } );

		await userEvent.click(
			screen.getByRole( 'button', { name: 'Start recording' } )
		);
		await userEvent.click(
			await screen.findByRole( 'menuitem', { name: 'For 4 hours' } )
		);

		expect( onSelect ).not.toHaveBeenCalled();
	} );

	it( 'closes on Escape and returns focus to the button', async () => {
		renderButton();

		const button = screen.getByRole( 'button', {
			name: 'Start recording',
		} );

		await userEvent.click( button );
		await screen.findByRole( 'menu' );
		await userEvent.keyboard( '{Escape}' );

		await waitFor( () =>
			expect( screen.queryByRole( 'menu' ) ).toBeNull()
		);
		expect( button ).toHaveFocus();
	} );
} );
