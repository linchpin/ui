/**
 * External dependencies
 */
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import {
	LinchpinAdminPage,
	PageHeaderActions,
	PageHeaderBadges,
	PageHeaderSubTitle,
	usePageSections,
} from '../src';

/**
 * @param {Element} element An element in the page.
 * @return {Element} The page body it sits in.
 */
const bodyOf = ( element ) => element.closest( '[class*="__content"]' );

/**
 * @param {Element} first  An element.
 * @param {Element} second Another element.
 * @return {boolean} Whether `first` comes before `second` in the document.
 */
const comesBefore = ( first, second ) => {
	const all = Array.from( document.body.querySelectorAll( '*' ) );

	return all.indexOf( first ) < all.indexOf( second );
};

describe( 'Page header fills', () => {
	it( 'puts a screen’s actions in the header, keeping the screen’s state', async () => {
		function Screen() {
			const [ count, setCount ] = useState( 0 );

			return (
				<>
					<PageHeaderActions>
						<button onClick={ () => setCount( count + 1 ) }>
							Record
						</button>
					</PageHeaderActions>
					<p>Recorded { count } times</p>
				</>
			);
		}

		render(
			<LinchpinAdminPage
				showSidebarToggle={ false }
				title="Declutter"
				badges={ null }
			>
				<Screen />
			</LinchpinAdminPage>
		);

		const button = screen.getByRole( 'button', { name: 'Record' } );
		const body = bodyOf( screen.getByText( /Recorded/ ) );

		expect( body ).not.toContainElement( button );
		expect(
			comesBefore(
				screen.getByRole( 'heading', { level: 1, name: 'Declutter' } ),
				button
			)
		).toBe( true );

		await userEvent.click( button );

		expect( screen.getByText( 'Recorded 1 times' ) ).toBeInTheDocument();
	} );

	it( 'puts the page’s own actions first, then the screen’s', () => {
		render(
			<LinchpinAdminPage
				showSidebarToggle={ false }
				title="Monitoring"
				badges={ null }
				actions={ <button>Refresh</button> }
			>
				<PageHeaderActions>
					<button>Create test</button>
				</PageHeaderActions>
			</LinchpinAdminPage>
		);

		const refresh = screen.getByRole( 'button', { name: 'Refresh' } );
		const create = screen.getByRole( 'button', { name: 'Create test' } );

		expect( comesBefore( refresh, create ) ).toBe( true );
	} );

	it( 'shows only the screen’s badges when the page has none of its own', () => {
		render(
			<LinchpinAdminPage
				showSidebarToggle={ false }
				title="Declutter"
				badges={ null }
			>
				<PageHeaderBadges>
					<span>Not recording</span>
				</PageHeaderBadges>
			</LinchpinAdminPage>
		);

		const badge = screen.getByText( 'Not recording' );

		expect( bodyOf( badge ) ).toBeNull();
	} );

	it( 'replaces the page’s subtitle with the screen’s', () => {
		render(
			<LinchpinAdminPage
				showSidebarToggle={ false }
				title="Declutter"
				subTitle="Static sentence."
			>
				<PageHeaderSubTitle>
					Recording until 3:45 PM.
				</PageHeaderSubTitle>
			</LinchpinAdminPage>
		);

		expect( screen.queryByText( 'Static sentence.' ) ).toBeNull();
		expect(
			bodyOf( screen.getByText( 'Recording until 3:45 PM.' ) )
		).toBeNull();
	} );

	it( 'clears the header when the screen goes away', () => {
		function Page( { showScreen } ) {
			return (
				<LinchpinAdminPage
					showSidebarToggle={ false }
					title="Tools"
					badges={ null }
				>
					{ showScreen && (
						<PageHeaderActions>
							<button>Check again</button>
						</PageHeaderActions>
					) }
				</LinchpinAdminPage>
			);
		}

		const { container, rerender } = render( <Page showScreen /> );

		expect(
			screen.getByRole( 'button', { name: 'Check again' } )
		).toBeInTheDocument();

		rerender( <Page showScreen={ false } /> );

		expect(
			screen.queryByRole( 'button', { name: 'Check again' } )
		).toBeNull();
		expect(
			container.querySelector( '.lp-admin__header-fill' )
		).toBeNull();
	} );

	it( 'renders nothing outside a page', () => {
		const { container } = render(
			<PageHeaderActions>
				<button>Orphan</button>
			</PageHeaderActions>
		);

		expect( container ).toBeEmptyDOMElement();
	} );
} );

describe( 'usePageSections', () => {
	const SECTIONS = [
		{ name: 'inventory', label: 'Admin inventory' },
		{ name: 'ignored', label: 'Ignored sources' },
	];

	/**
	 * A screen that rebuilds its sections and its handler on every render,
	 * the way an unmemoised screen does.
	 *
	 * @param {Object}   props          Props.
	 * @param {Function} props.onSelect Receives the chosen section.
	 * @return {Element} The screen.
	 */
	function Sectioned( { onSelect } ) {
		const [ current, setCurrent ] = useState( 'inventory' );

		usePageSections( {
			sections: SECTIONS.map( ( section ) => ( { ...section } ) ),
			current,
			onSelect: ( name ) => {
				setCurrent( name );
				onSelect( name );
			},
		} );

		return <p>Showing { current }</p>;
	}

	it( 'draws the sections as links, with the current one marked', () => {
		render(
			<LinchpinAdminPage
				showSidebarToggle={ false }
				title="Declutter"
				badges={ null }
			>
				<Sectioned onSelect={ jest.fn() } />
			</LinchpinAdminPage>
		);

		const inventory = screen.getByRole( 'link', {
			name: 'Admin inventory',
		} );
		const ignored = screen.getByRole( 'link', { name: 'Ignored sources' } );

		expect( inventory.getAttribute( 'href' ) ).toContain( 'tab=inventory' );
		expect( ignored.getAttribute( 'href' ) ).toContain( 'tab=ignored' );
		expect( inventory ).toHaveAttribute( 'aria-current', 'page' );
	} );

	it( 'hands a plain click to the screen and switches in place', async () => {
		const onSelect = jest.fn();

		render(
			<LinchpinAdminPage
				showSidebarToggle={ false }
				title="Declutter"
				badges={ null }
			>
				<Sectioned onSelect={ onSelect } />
			</LinchpinAdminPage>
		);

		await userEvent.click(
			screen.getByRole( 'link', { name: 'Ignored sources' } )
		);

		expect( onSelect ).toHaveBeenCalledWith( 'ignored' );
		expect( screen.getByText( 'Showing ignored' ) ).toBeInTheDocument();
		expect(
			screen.getByRole( 'link', { name: 'Ignored sources' } )
		).toHaveAttribute( 'aria-current', 'page' );
	} );

	it( 'leaves a modified click to the browser', () => {
		const onSelect = jest.fn();

		render(
			<LinchpinAdminPage
				showSidebarToggle={ false }
				title="Declutter"
				badges={ null }
			>
				<Sectioned onSelect={ onSelect } />
			</LinchpinAdminPage>
		);

		const link = screen.getByRole( 'link', { name: 'Ignored sources' } );
		let prevented;

		act( () => {
			prevented = ! fireEvent.click( link, { metaKey: true } );
		} );

		expect( onSelect ).not.toHaveBeenCalled();
		expect( prevented ).toBe( false );
	} );

	it( 'says when there is no page to draw the sections', () => {
		let drawn;

		function Probe() {
			drawn = usePageSections( { sections: SECTIONS } );

			return null;
		}

		render( <Probe /> );

		expect( drawn ).toBe( false );
	} );
} );
