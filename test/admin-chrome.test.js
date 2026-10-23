/**
 * External dependencies
 */
import { render } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { markCurrentMenuItem, retitle, useAdminChrome } from '../src';

const BASE = 'https://example.test/wp-admin/admin.php';

/**
 * A plugin's menu as WordPress prints it, with the first item current, which
 * is what it does on every screen of a single-page app.
 *
 * @return {void}
 */
const renderMenu = () => {
	document.body.innerHTML = `
		<ul id="adminmenu">
			<li id="toplevel_page_mantle">
				<ul class="wp-submenu">
					<li class="current"><a href="admin.php?page=mantle" class="current" aria-current="page">Dashboard</a></li>
					<li><a href="${ BASE }?page=mantle&amp;view=communication">Communication</a></li>
					<li><a href="${ BASE }?page=mantle&amp;view=settings">Settings</a></li>
				</ul>
			</li>
			<li id="menu-posts">
				<ul class="wp-submenu">
					<li class="current"><a href="edit.php" class="current" aria-current="page">All Posts</a></li>
				</ul>
			</li>
		</ul>`;
};

/**
 * @return {string[]} The text of every plugin menu link marked current.
 */
const currentItems = () =>
	[ ...document.querySelectorAll( '#toplevel_page_mantle a.current' ) ].map(
		( link ) => link.textContent
	);

afterEach( () => {
	document.body.innerHTML = '';
} );

describe( 'retitle', () => {
	it( 'replaces only the screen name', () => {
		expect(
			retitle( 'Dashboard ‹ Acme — WordPress', 'Communication' )
		).toBe( 'Communication ‹ Acme — WordPress' );
	} );

	it( 'leaves a title WordPress did not build alone', () => {
		expect( retitle( 'Acme — WordPress', 'Communication' ) ).toBe(
			'Acme — WordPress'
		);
	} );

	it( 'leaves the title alone without a screen name', () => {
		expect( retitle( 'Dashboard ‹ Acme', '' ) ).toBe( 'Dashboard ‹ Acme' );
	} );
} );

describe( 'markCurrentMenuItem', () => {
	it( 'moves the highlight to the link the address matches most', () => {
		renderMenu();

		markCurrentMenuItem( {
			location: `${ BASE }?page=mantle&view=communication&tab=slack`,
		} );

		expect( currentItems() ).toEqual( [ 'Communication' ] );

		const link = [ ...document.querySelectorAll( '#adminmenu a' ) ].find(
			( a ) => a.textContent === 'Communication'
		);

		expect( link ).toHaveAttribute( 'aria-current', 'page' );
		expect( link.parentElement ).toHaveClass( 'current' );
	} );

	it( 'falls back to the bare page link for a screen no link names', () => {
		renderMenu();

		markCurrentMenuItem( {
			location: `${ BASE }?page=mantle&view=settings`,
		} );
		markCurrentMenuItem( {
			location: `${ BASE }?page=mantle&view=dashboard`,
		} );

		expect( currentItems() ).toEqual( [ 'Dashboard' ] );
	} );

	it( 'leaves other menus alone', () => {
		renderMenu();

		markCurrentMenuItem( {
			location: `${ BASE }?page=mantle&view=communication`,
		} );

		expect( document.querySelector( '#menu-posts a' ) ).toHaveAttribute(
			'aria-current',
			'page'
		);
	} );

	it( 'does nothing on an address with no admin page', () => {
		renderMenu();

		expect(
			markCurrentMenuItem( { location: `${ BASE }?post=12` } )
		).toBeNull();
		expect( currentItems() ).toEqual( [ 'Dashboard' ] );
	} );
} );

describe( 'useAdminChrome', () => {
	it( 'names and highlights the open screen', () => {
		window.history.replaceState(
			{},
			'',
			'/wp-admin/admin.php?page=mantle&view=communication'
		);
		document.title = 'Dashboard ‹ Acme — WordPress';

		function Screen() {
			useAdminChrome( 'Communication' );

			return null;
		}

		render( <Screen /> );
		renderMenu();
		render( <Screen /> );

		expect( document.title ).toBe( 'Communication ‹ Acme — WordPress' );
		expect( currentItems() ).toEqual( [ 'Communication' ] );
	} );
} );
