/**
 * External dependencies
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/**
 * Internal dependencies
 */
import { LinchpinGlobalNotices } from '../src';

const KEY = 'test-dismissed-global-notices';

const DISCONNECTED = {
	id: 'api-disconnected',
	title: 'Mantle is not connected to the API',
	message:
		'Monitoring and licensing are switched off until this site reconnects.',
	actions: <button>Reconnect this site</button>,
};

describe( 'LinchpinGlobalNotices', () => {
	beforeEach( () => {
		window.sessionStorage.clear();
	} );

	it( 'renders nothing when there is nothing to say', () => {
		const { container } = render(
			<LinchpinGlobalNotices notices={ [] } storageKey={ KEY } />
		);

		expect( container ).toBeEmptyDOMElement();
	} );

	it( 'shows each notice as a tinted banner with its action', () => {
		const { container } = render(
			<LinchpinGlobalNotices
				notices={ [ DISCONNECTED ] }
				storageKey={ KEY }
			/>
		);

		const banner = container.querySelector( '.lp-notice' );

		expect( banner ).toHaveClass(
			'is-banner',
			'is-tinted',
			'is-tone-warning'
		);
		expect(
			screen.getByText( 'Mantle is not connected to the API' )
		).toBeInTheDocument();
		expect(
			screen.getByRole( 'button', { name: 'Reconnect this site' } )
		).toBeInTheDocument();
	} );

	it( 'remembers a dismissal for the rest of the session', async () => {
		const { unmount } = render(
			<LinchpinGlobalNotices
				notices={ [ DISCONNECTED ] }
				storageKey={ KEY }
			/>
		);

		await userEvent.click(
			screen.getByRole( 'button', { name: 'Dismiss this notice' } )
		);

		expect(
			screen.queryByText( 'Mantle is not connected to the API' )
		).toBeNull();

		unmount();

		render(
			<LinchpinGlobalNotices
				notices={ [ DISCONNECTED ] }
				storageKey={ KEY }
			/>
		);

		expect(
			screen.queryByText( 'Mantle is not connected to the API' )
		).toBeNull();
	} );

	it( 'keeps a notice that is not dismissible', () => {
		render(
			<LinchpinGlobalNotices
				notices={ [ { ...DISCONNECTED, dismissible: false } ] }
				storageKey={ KEY }
			/>
		);

		expect(
			screen.queryByRole( 'button', { name: 'Dismiss this notice' } )
		).toBeNull();
	} );

	it( 'shows banners passed as children after its own', () => {
		render(
			<LinchpinGlobalNotices notices={ [] } storageKey={ KEY }>
				<p>A banner raised by another module</p>
			</LinchpinGlobalNotices>
		);

		expect(
			screen.getByText( 'A banner raised by another module' )
		).toBeInTheDocument();
	} );

	it( 'still renders when session storage is unavailable', async () => {
		const getItem = jest
			.spyOn( Storage.prototype, 'getItem' )
			.mockImplementation( () => {
				throw new Error( 'blocked' );
			} );
		const setItem = jest
			.spyOn( Storage.prototype, 'setItem' )
			.mockImplementation( () => {
				throw new Error( 'blocked' );
			} );

		render(
			<LinchpinGlobalNotices
				notices={ [ DISCONNECTED ] }
				storageKey={ KEY }
			/>
		);

		await userEvent.click(
			screen.getByRole( 'button', { name: 'Dismiss this notice' } )
		);

		expect(
			screen.queryByText( 'Mantle is not connected to the API' )
		).toBeNull();

		getItem.mockRestore();
		setItem.mockRestore();
	} );
} );
