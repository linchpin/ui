/**
 * External dependencies
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/**
 * Internal dependencies
 */
import {
	LinchpinAdminFrame,
	LinchpinAdminLayout,
	LinchpinAdminNav,
} from '../src';

const PLUGIN = { name: 'Mantle', slug: 'mantle', version: '2.21.1' };

const ITEMS = [
	{ name: 'dashboard', label: 'Dashboard', href: '?view=dashboard' },
	{ name: 'security', label: 'Security', href: '?view=security' },
	{ name: 'tools', label: 'Tools', href: '?view=tools', disabled: true },
];

/**
 * @param {Object}  props          Props.
 * @param {Element} props.children The screen under test.
 * @return {Element} A mounted frame.
 */
function Frame( { children } ) {
	return (
		<LinchpinAdminFrame plugin={ PLUGIN }>{ children }</LinchpinAdminFrame>
	);
}

describe( 'LinchpinAdminNav', () => {
	it( 'renders links, so a section can be middle-clicked or copied', () => {
		render(
			<Frame>
				<LinchpinAdminNav items={ ITEMS } current="dashboard" />
			</Frame>
		);

		expect(
			screen.getByRole( 'link', { name: 'Security' } )
		).toHaveAttribute( 'href', '?view=security' );
		expect( screen.queryAllByRole( 'button' ) ).toHaveLength( 0 );
	} );

	it( 'marks the current section with aria-current, which drives the styling', () => {
		render(
			<Frame>
				<LinchpinAdminNav items={ ITEMS } current="security" />
			</Frame>
		);

		expect(
			screen.getByRole( 'link', { name: 'Security' } )
		).toHaveAttribute( 'aria-current', 'page' );
		expect(
			screen.getByRole( 'link', { name: 'Dashboard' } )
		).not.toHaveAttribute( 'aria-current' );
	} );

	it( 'matches the current section by href when no name is given', () => {
		render(
			<Frame>
				<LinchpinAdminNav items={ ITEMS } currentHref="?view=tools" />
			</Frame>
		);

		expect( screen.getByRole( 'link', { name: 'Tools' } ) ).toHaveAttribute(
			'aria-current',
			'page'
		);
	} );

	it( 'names the landmark after the plugin unless told otherwise', () => {
		const { rerender } = render(
			<Frame>
				<LinchpinAdminNav items={ ITEMS } />
			</Frame>
		);
		expect(
			screen.getByRole( 'navigation', { name: 'Mantle' } )
		).toBeInTheDocument();

		rerender(
			<Frame>
				<LinchpinAdminNav items={ ITEMS } ariaLabel="Modules" />
			</Frame>
		);
		expect(
			screen.getByRole( 'navigation', { name: 'Modules' } )
		).toBeInTheDocument();
	} );

	it( 'routes in-app on a plain click', async () => {
		const onNavigate = jest.fn();
		const user = userEvent.setup();

		render(
			<Frame>
				<LinchpinAdminNav
					items={ ITEMS }
					current="dashboard"
					onNavigate={ onNavigate }
				/>
			</Frame>
		);

		await user.click( screen.getByRole( 'link', { name: 'Security' } ) );

		expect( onNavigate ).toHaveBeenCalledWith(
			'security',
			expect.anything()
		);
	} );

	it( 'leaves a modified click to the browser, so the href stays honest', async () => {
		const onNavigate = jest.fn();
		const user = userEvent.setup();

		// Hash hrefs: a modified click is *meant* to reach the browser, and
		// jsdom logs "Not implemented: navigation" for anything else — noise
		// that would make the test read as a failure rather than a pass.
		render(
			<Frame>
				<LinchpinAdminNav
					items={ [
						{
							name: 'dashboard',
							label: 'Dashboard',
							href: '#dashboard',
						},
						{
							name: 'security',
							label: 'Security',
							href: '#security',
						},
					] }
					current="dashboard"
					onNavigate={ onNavigate }
				/>
			</Frame>
		);

		await user.keyboard( '{Meta>}' );
		await user.click( screen.getByRole( 'link', { name: 'Security' } ) );
		await user.keyboard( '{/Meta}' );

		expect( onNavigate ).not.toHaveBeenCalled();
	} );

	it( 'does not navigate from a disabled item', async () => {
		const onNavigate = jest.fn();
		const user = userEvent.setup();

		render(
			<Frame>
				<LinchpinAdminNav items={ ITEMS } onNavigate={ onNavigate } />
			</Frame>
		);

		const tools = screen.getByRole( 'link', { name: 'Tools' } );
		expect( tools ).toHaveAttribute( 'aria-disabled', 'true' );

		await user.click( tools, { pointerEventsCheck: 0 } );
		expect( onNavigate ).not.toHaveBeenCalled();
	} );

	it( 'renders the header and footer slots', () => {
		render(
			<Frame>
				<LinchpinAdminNav
					items={ ITEMS }
					header={ <p>Hi Aaron!</p> }
					footer={ <p>Need help?</p> }
				/>
			</Frame>
		);

		expect( screen.getByText( 'Hi Aaron!' ) ).toBeInTheDocument();
		expect( screen.getByText( 'Need help?' ) ).toBeInTheDocument();
	} );

	it( 'takes a router link component in place of the anchor', () => {
		const RouterLink = ( { href, children, ...rest } ) => (
			<a href={ href } data-router="yes" { ...rest }>
				{ children }
			</a>
		);

		render(
			<Frame>
				<LinchpinAdminNav
					items={ ITEMS }
					linkComponent={ RouterLink }
				/>
			</Frame>
		);

		expect(
			screen.getByRole( 'link', { name: 'Dashboard' } )
		).toHaveAttribute( 'data-router', 'yes' );
	} );

	it( 'accepts an icon as an element or as a component', () => {
		const items = [
			{
				name: 'a',
				label: 'Element',
				href: '#a',
				icon: <svg data-testid="as-element" />,
			},
			{
				name: 'b',
				label: 'Component',
				href: '#b',
				icon: () => <svg data-testid="as-component" />,
			},
		];

		render(
			<Frame>
				<LinchpinAdminNav items={ items } />
			</Frame>
		);

		expect( screen.getByTestId( 'as-element' ) ).toBeInTheDocument();
		expect( screen.getByTestId( 'as-component' ) ).toBeInTheDocument();
	} );

	it( 'sizes an icon that arrives without a size of its own', () => {
		// What `@wordpress/icons` exports: a bare `<svg viewBox>`. Rendered
		// as-is in a flex row it resolves to no width, so the menu drew seven
		// icons nobody could see.
		render(
			<Frame>
				<LinchpinAdminNav
					items={ [
						{
							name: 'a',
							label: 'Dashboard',
							href: '#a',
							icon: (
								<svg
									data-testid="sizeless"
									viewBox="0 0 24 24"
								/>
							),
						},
					] }
				/>
			</Frame>
		);

		const icon = screen.getByTestId( 'sizeless' );

		expect( icon ).toHaveAttribute( 'width', '24' );
		expect( icon ).toHaveAttribute( 'height', '24' );
	} );
} );

describe( 'LinchpinAdminLayout with a nav', () => {
	it( 'lays out three columns when a screen has all three', () => {
		const { container } = render(
			<Frame>
				<LinchpinAdminLayout
					nav={ <LinchpinAdminNav items={ ITEMS } /> }
					sidebar={ <p>help</p> }
					label="About Mantle"
				>
					main
				</LinchpinAdminLayout>
			</Frame>
		);

		const body = container.querySelector( '.lp-admin__body' );
		expect( body ).toHaveClass( 'has-nav', 'has-sidebar' );
		expect( body ).not.toHaveClass( 'is-full-width' );
	} );

	it( 'is full width only when it has neither column', () => {
		const { container } = render(
			<Frame>
				<LinchpinAdminLayout>main</LinchpinAdminLayout>
			</Frame>
		);

		expect( container.querySelector( '.lp-admin__body' ) ).toHaveClass(
			'is-full-width'
		);
	} );
} );
