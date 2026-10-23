/**
 * External dependencies
 */
import { act, fireEvent, render, screen } from '@testing-library/react';

/**
 * Internal dependencies
 */
import {
	AdminLink,
	AdminRouter,
	adminUrl,
	sectionNavigation,
	useAdminLocation,
	useNavigate,
} from '../src';

const SCREEN = '/wp-admin/admin.php?page=sites';

beforeEach( () => {
	window.history.replaceState( null, '', SCREEN );

	// jsdom does not implement scrolling.
	window.scrollTo = jest.fn();
} );

/**
 * Renders what the address names, the way a screen does.
 *
 * @return {Element} The current view.
 */
function View() {
	const { query } = useAdminLocation();
	const site = query.get( 'site' );

	return (
		<>
			<p>{ site ? `Site ${ site }` : 'All sites' }</p>
			<AdminLink href={ adminUrl( { site: 35 } ) }>
				Open site 35
			</AdminLink>
			<AdminLink href="/wp-admin/admin.php?page=security">
				Security
			</AdminLink>
		</>
	);
}

describe( 'AdminRouter', () => {
	it( 'follows a link to the same screen in place, and records it in history', () => {
		render(
			<AdminRouter>
				<View />
			</AdminRouter>
		);

		const link = screen.getByRole( 'link', { name: 'Open site 35' } );
		const notPrevented = fireEvent.click( link );

		expect( notPrevented ).toBe( false );
		expect( screen.getByText( 'Site 35' ) ).toBeInTheDocument();
		expect( window.location.search ).toBe( '?page=sites&site=35' );
		expect( window.scrollTo ).toHaveBeenCalledWith( 0, 0 );
	} );

	it( 'goes back on popstate', () => {
		render(
			<AdminRouter>
				<View />
			</AdminRouter>
		);

		fireEvent.click( screen.getByRole( 'link', { name: 'Open site 35' } ) );

		act( () => {
			window.history.replaceState( null, '', SCREEN );
			window.dispatchEvent( new window.PopStateEvent( 'popstate' ) );
		} );

		expect( screen.getByText( 'All sites' ) ).toBeInTheDocument();
	} );

	it( 'leaves a link to another screen to the browser', () => {
		render(
			<AdminRouter>
				<View />
			</AdminRouter>
		);

		const notPrevented = fireEvent.click(
			screen.getByRole( 'link', { name: 'Security' } )
		);

		expect( notPrevented ).toBe( true );
	} );

	it( 'leaves a modified click to the browser', () => {
		render(
			<AdminRouter>
				<View />
			</AdminRouter>
		);

		const link = screen.getByRole( 'link', { name: 'Open site 35' } );

		expect( fireEvent.click( link, { metaKey: true } ) ).toBe( true );
		expect( fireEvent.click( link, { ctrlKey: true } ) ).toBe( true );
		expect( fireEvent.click( link, { button: 1 } ) ).toBe( true );
		expect( screen.getByText( 'All sites' ) ).toBeInTheDocument();
	} );

	it( 'renders a plain link with no router above it', () => {
		render( <View /> );

		expect(
			fireEvent.click(
				screen.getByRole( 'link', { name: 'Open site 35' } )
			)
		).toBe( true );
	} );

	it( 'replaces the entry instead of adding one when asked', () => {
		/**
		 * @return {Element} A control that records a filter.
		 */
		function Filter() {
			const navigate = useNavigate();
			const { query } = useAdminLocation();

			return (
				<button
					onClick={ () =>
						navigate( adminUrl( { filter: 'production' } ), {
							replace: true,
						} )
					}
				>
					{ query.get( 'filter' ) ?? 'none' }
				</button>
			);
		}

		render(
			<AdminRouter>
				<Filter />
			</AdminRouter>
		);

		const before = window.history.length;

		fireEvent.click( screen.getByRole( 'button' ) );

		expect( screen.getByRole( 'button' ) ).toHaveTextContent(
			'production'
		);
		expect( window.history.length ).toBe( before );
		expect( window.scrollTo ).not.toHaveBeenCalled();
	} );

	it( 'tells the screen when the address changes', () => {
		const onChange = jest.fn();

		render(
			<AdminRouter onChange={ onChange }>
				<View />
			</AdminRouter>
		);

		fireEvent.click( screen.getByRole( 'link', { name: 'Open site 35' } ) );

		expect( onChange ).toHaveBeenLastCalledWith(
			expect.objectContaining( { search: '?page=sites&site=35' } )
		);
	} );

	it( 'drives section links when given the router location', () => {
		/**
		 * @return {Element} Section links for the current site.
		 */
		function Sections() {
			const location = useAdminLocation();
			const { items } = sectionNavigation( {
				sections: [
					{ name: 'overview', label: 'Overview' },
					{ name: 'packages', label: 'Packages' },
				],
				keep: [ 'site' ],
				location,
			} );

			return items.map( ( item ) => (
				<AdminLink key={ item.href } href={ item.href }>
					{ item.label }
				</AdminLink>
			) );
		}

		window.history.replaceState( null, '', `${ SCREEN }&site=35&q=acme` );

		render(
			<AdminRouter>
				<Sections />
			</AdminRouter>
		);

		expect(
			screen.getByRole( 'link', { name: 'Packages' } )
		).toHaveAttribute(
			'href',
			'/wp-admin/admin.php?page=sites&site=35&tab=packages'
		);
	} );
} );
