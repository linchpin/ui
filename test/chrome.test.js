/**
 * External dependencies
 */
import { render, screen } from '@testing-library/react';

/**
 * Internal dependencies
 */
import {
	AboutLinchpinCard,
	AboutLinchpinPage,
	defineBrand,
	LINCHPIN_COLORS,
	LinchpinAdminFooter,
	LinchpinAdminFrame,
	LinchpinAdminLayout,
	LinchpinAdminPage,
	LinchpinAdminTopBar,
	LinchpinLogo,
	VersionBadge,
} from '../src';

const PLUGIN = { name: 'Psst', slug: 'psst', version: '2.1.0' };
const BRAND = defineBrand( { primary: '#318873', deep: '#082318' } );

/**
 * @param {Object}  props          Props.
 * @param {Element} props.children The screen under test.
 * @return {Element} A mounted frame.
 */
function Frame( { children, ...rest } ) {
	return (
		<LinchpinAdminFrame plugin={ PLUGIN } brand={ BRAND } { ...rest }>
			{ children }
		</LinchpinAdminFrame>
	);
}

describe( 'LinchpinAdminFrame', () => {
	it( 'publishes the brand as custom properties', () => {
		const { container } = render( <Frame>screen</Frame> );
		const frame = container.querySelector( '.lp-admin' );

		expect( frame.style.getPropertyValue( '--lp-brand-primary' ) ).toBe(
			'#318873'
		);
		expect( frame.style.getPropertyValue( '--lp-brand-deep' ) ).toBe(
			'#082318'
		);
	} );

	it( 'publishes the agency palette too, so no component needs a hex', () => {
		const { container } = render( <Frame>screen</Frame> );
		const frame = container.querySelector( '.lp-admin' );

		expect( frame.style.getPropertyValue( '--lp-color-blue' ) ).toBe(
			LINCHPIN_COLORS.blue
		);
		expect( frame.style.getPropertyValue( '--lp-color-cyan' ) ).toBe(
			LINCHPIN_COLORS.cyan
		);
	} );

	it( 'defaults a brandless plugin to Linchpin blue', () => {
		const { container } = render(
			<LinchpinAdminFrame plugin={ PLUGIN }>screen</LinchpinAdminFrame>
		);

		expect(
			container
				.querySelector( '.lp-admin' )
				.style.getPropertyValue( '--lp-brand-primary' )
		).toBe( LINCHPIN_COLORS.blue );
	} );

	it( 'keeps the top bar outside the gutter and the screen inside it', () => {
		const { container } = render(
			<Frame topBar={ <div data-testid="bar" /> }>
				<p>screen</p>
			</Frame>
		);

		expect(
			container.querySelector( '.lp-admin > [data-testid="bar"]' )
		).not.toBeNull();
		expect(
			container.querySelector( '.lp-admin__shell > p' )
		).not.toBeNull();
	} );

	it( 'refuses to mount without a slug, which every link is built from', () => {
		expect( () =>
			render( <LinchpinAdminFrame plugin={ { name: 'Nameless' } } /> )
		).toThrow( /plugin.slug is required/ );

		// React reports the throw before it reaches us; @wordpress/jest-console
		// fails the test on an unclaimed console.error, so claim it.
		expect( console ).toHaveErrored();
	} );
} );

describe( 'LinchpinAdminTopBar', () => {
	it( 'shows the plugin logo when it has one', () => {
		render(
			<Frame
				topBar={
					<LinchpinAdminTopBar
						logo={ <svg data-testid="plugin-logo" /> }
					/>
				}
			/>
		);

		expect( screen.getByTestId( 'plugin-logo' ) ).toBeInTheDocument();
		expect( screen.queryByText( 'Psst' ) ).not.toBeInTheDocument();
	} );

	it( 'accepts a URL for a logo the plugin ships, and names it', () => {
		render(
			<Frame topBar={ <LinchpinAdminTopBar logo="/psst/logo.svg" /> } />
		);

		expect( screen.getByRole( 'img', { name: 'Psst' } ) ).toHaveAttribute(
			'src',
			'/psst/logo.svg'
		);
	} );

	it( 'falls back to the name only when there is no logo at all', () => {
		render( <Frame topBar={ <LinchpinAdminTopBar /> } /> );

		expect( screen.getByText( 'Psst' ) ).toBeInTheDocument();
	} );

	it( 'takes the logo from the frame identity as well as from props', () => {
		render(
			<LinchpinAdminFrame
				plugin={ { ...PLUGIN, logo: '/psst/from-identity.svg' } }
				brand={ BRAND }
				topBar={ <LinchpinAdminTopBar /> }
			/>
		);

		expect( screen.getByRole( 'img', { name: 'Psst' } ) ).toHaveAttribute(
			'src',
			'/psst/from-identity.svg'
		);
	} );

	it( 'shows the version and links to Linchpin with the plugin tagged', () => {
		render( <Frame topBar={ <LinchpinAdminTopBar /> } /> );

		expect( screen.getByText( 'v2.1.0' ) ).toBeInTheDocument();
		expect(
			screen.getByLabelText( /Linchpin \(opens in a new tab\)/ )
		).toHaveAttribute(
			'href',
			expect.stringContaining( 'utm_source=psst' )
		);
	} );

	it( 'leaves the status dot off unless asked', () => {
		const { container } = render(
			<Frame topBar={ <LinchpinAdminTopBar /> } />
		);

		expect( container.querySelector( '.lp-admin__status' ) ).toBeNull();
	} );
} );

describe( 'LinchpinAdminPage', () => {
	it( 'titles the page after the plugin and renders the full header', () => {
		render(
			<Frame>
				<LinchpinAdminPage
					subTitle="One-time secrets."
					actions={ <button>Share a secret</button> }
				>
					body
				</LinchpinAdminPage>
			</Frame>
		);

		expect( screen.getByText( 'Psst' ) ).toBeInTheDocument();
		expect( screen.getByText( 'One-time secrets.' ) ).toBeInTheDocument();
		expect(
			screen.getByRole( 'button', { name: 'Share a secret' } )
		).toBeInTheDocument();
	} );

	it( 'badges the version without being asked, and drops it when told', () => {
		const { rerender } = render(
			<Frame>
				<LinchpinAdminPage>body</LinchpinAdminPage>
			</Frame>
		);
		expect( screen.getByText( 'v2.1.0' ) ).toBeInTheDocument();

		rerender(
			<Frame>
				<LinchpinAdminPage badges={ null }>body</LinchpinAdminPage>
			</Frame>
		);
		expect( screen.queryByText( 'v2.1.0' ) ).not.toBeInTheDocument();
	} );

	it( 'renders section navigation as links, with the current one marked', () => {
		render(
			<Frame>
				<LinchpinAdminPage
					navigation={ {
						items: [
							{ label: 'Settings', href: '?tab=settings' },
							{ label: 'Secrets', href: '?tab=secrets' },
						],
						currentHref: '?tab=secrets',
						ariaLabel: 'Sections',
					} }
				>
					body
				</LinchpinAdminPage>
			</Frame>
		);

		expect(
			screen.getByRole( 'link', { name: 'Settings' } )
		).toBeInTheDocument();
		expect(
			screen.getByRole( 'link', { name: 'Secrets' } )
		).toHaveAttribute( 'aria-current', 'page' );
	} );
} );

describe( 'LinchpinAdminLayout', () => {
	it( 'drops the aside entirely when a screen has no sidebar', () => {
		const { container } = render(
			<Frame>
				<LinchpinAdminLayout>main</LinchpinAdminLayout>
			</Frame>
		);

		expect( container.querySelector( 'aside' ) ).toBeNull();
		expect(
			container.querySelector( '.lp-admin__body.is-full-width' )
		).not.toBeNull();
	} );

	it( 'labels the aside for assistive technology', () => {
		render(
			<Frame>
				<LinchpinAdminLayout sidebar={ <p>help</p> } label="About Psst">
					main
				</LinchpinAdminLayout>
			</Frame>
		);

		expect(
			screen.getByRole( 'complementary', { name: 'About Psst' } )
		).toBeInTheDocument();
	} );
} );

describe( 'LinchpinLogo', () => {
	it( 'draws the wordmark only in the full lockup', () => {
		const { container: full } = render( <LinchpinLogo variant="full" /> );
		const { container: mark } = render( <LinchpinLogo variant="mark" /> );

		expect( full.querySelectorAll( 'path' ) ).toHaveLength( 14 );
		expect( mark.querySelectorAll( 'path' ) ).toHaveLength( 4 );
	} );

	it( 'crops the viewBox to the mark', () => {
		const { container } = render( <LinchpinLogo variant="mark" /> );

		expect( container.querySelector( 'svg' ) ).toHaveAttribute(
			'viewBox',
			'-4 -4 89 89'
		);
	} );

	it( 'paints from custom properties, never a hex', () => {
		const { container } = render( <LinchpinLogo /> );
		const fills = [ ...container.querySelectorAll( 'path' ) ].map(
			( path ) => path.getAttribute( 'fill' )
		);

		expect( fills.every( ( fill ) => fill.startsWith( 'var(' ) ) ).toBe(
			true
		);
		expect(
			fills.some( ( fill ) => fill.includes( '--lp-logo-ink' ) )
		).toBe( true );
		expect(
			fills.some( ( fill ) => fill.includes( '--lp-logo-accent' ) )
		).toBe( true );
	} );

	it( 'takes the surrounding colour when mono, for the brand bar', () => {
		const { container } = render( <LinchpinLogo tone="mono" /> );
		const fills = [ ...container.querySelectorAll( 'path' ) ].map(
			( path ) => path.getAttribute( 'fill' )
		);

		expect( new Set( fills ) ).toEqual( new Set( [ 'currentColor' ] ) );
	} );

	it( 'is hidden from assistive technology unless it is named', () => {
		const { container, rerender } = render( <LinchpinLogo /> );
		expect( container.querySelector( 'svg' ) ).toHaveAttribute(
			'aria-hidden',
			'true'
		);

		rerender( <LinchpinLogo title="Linchpin" /> );
		expect(
			screen.getByRole( 'img', { name: 'Linchpin' } )
		).toBeInTheDocument();
	} );
} );

describe( 'the About Linchpin copy', () => {
	it( 'interpolates the plugin name and nothing else', () => {
		render(
			<Frame>
				<AboutLinchpinCard />
			</Frame>
		);

		expect(
			screen.getByText(
				/^Psst is designed, built and maintained by Linchpin/
			)
		).toBeInTheDocument();
	} );

	it( 'takes no copy prop — the page is the same for every plugin', () => {
		render(
			<Frame>
				<AboutLinchpinPage />
			</Frame>
		);

		expect(
			screen.getByText( /We have been building on WordPress since 2008/ )
		).toBeInTheDocument();
		expect(
			screen.getByRole( 'link', { name: 'Work with Linchpin' } )
		).toBeInTheDocument();
	} );
} );

describe( 'LinchpinAdminFooter', () => {
	it( 'names the plugin with its version and drops links it has no URL for', () => {
		render(
			<Frame>
				<LinchpinAdminFooter />
			</Frame>
		);

		expect(
			screen.getByRole( 'link', { name: 'Psst 2.1.0' } )
		).toHaveAttribute( 'href', 'https://github.com/linchpin/psst' );
	} );
} );

describe( 'VersionBadge', () => {
	it( 'adds the v, once', () => {
		const { rerender } = render( <VersionBadge version="2.1.0" /> );
		expect( screen.getByText( 'v2.1.0' ) ).toBeInTheDocument();

		rerender( <VersionBadge version="v2.1.0" /> );
		expect( screen.getByText( 'v2.1.0' ) ).toBeInTheDocument();
	} );

	it( 'renders nothing without a version', () => {
		const { container } = render( <VersionBadge /> );

		expect( container ).toBeEmptyDOMElement();
	} );
} );
