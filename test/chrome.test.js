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
	DangerZone,
	defineBrand,
	LINCHPIN_COLORS,
	LinchpinAdminFooter,
	LinchpinAdminFrame,
	LinchpinAdminLayout,
	LinchpinAdminPage,
	LinchpinAdminTopBar,
	LinchpinBreadcrumbs,
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
		expect( frame.style.getPropertyValue( '--lp-color-black' ) ).toBe(
			LINCHPIN_COLORS.black
		);
	} );

	it( 'defaults a brandless plugin to ink on a Linchpin blue bar', () => {
		const { container } = render(
			<LinchpinAdminFrame plugin={ PLUGIN }>screen</LinchpinAdminFrame>
		);

		const frame = container.querySelector( '.lp-admin' );

		// The bar is the brand colour; the design system is seeded with ink,
		// so the buttons under it are black rather than a second cyan.
		expect( frame.style.getPropertyValue( '--lp-brand-deep' ) ).toBe(
			LINCHPIN_COLORS.blue
		);
		expect( frame.style.getPropertyValue( '--lp-brand-primary' ) ).toBe(
			LINCHPIN_COLORS.black
		);

		// The mark on that bar is the white lockup, which is the agency's own
		// call and not the measurement's — see `defineBrand`'s DEFAULTS.
		expect( frame.style.getPropertyValue( '--lp-brand-on-brand' ) ).toBe(
			LINCHPIN_COLORS.onBrand
		);
	} );

	it( 'keeps the top bar outside the shell and the screen inside it', () => {
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

	it( 'keeps the title when told to drop it, and drops it when told', () => {
		const { rerender } = render(
			<Frame>
				<LinchpinAdminPage>body</LinchpinAdminPage>
			</Frame>
		);
		expect( screen.getByText( 'Psst' ) ).toBeInTheDocument();

		// `null` is "none", the same contract as `badges` — a screen whose
		// breadcrumbs carry the heading needs it.
		rerender(
			<Frame>
				<LinchpinAdminPage title={ null }>body</LinchpinAdminPage>
			</Frame>
		);
		expect( screen.queryByText( 'Psst' ) ).not.toBeInTheDocument();
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

describe( 'LinchpinBreadcrumbs', () => {
	/*
	 * Core's `Breadcrumbs` routes every item through TanStack Router and dies
	 * without a `RouterProvider`, which a wp-admin settings screen does not
	 * have. These have to be plain links.
	 */
	it( 'links every item but the last, which is the current page', () => {
		render(
			<LinchpinBreadcrumbs
				items={ [
					{ label: 'Settings', href: '#settings' },
					{ label: 'Psst' },
				] }
			/>
		);

		expect(
			screen.getByRole( 'link', { name: 'Settings' } )
		).toHaveAttribute( 'href', '#settings' );
		expect( screen.queryByRole( 'link', { name: 'Psst' } ) ).toBeNull();
		expect( screen.getByText( 'Psst' ) ).toHaveAttribute(
			'aria-current',
			'page'
		);
	} );

	it( 'carries the page heading when the page has no title of its own', () => {
		const { rerender } = render(
			<LinchpinBreadcrumbs items={ [ { label: 'Psst' } ] } />
		);
		expect( screen.queryByRole( 'heading' ) ).toBeNull();

		rerender(
			<LinchpinBreadcrumbs
				headingLevel={ 1 }
				items={ [ { label: 'Psst' } ] }
			/>
		);
		expect(
			screen.getByRole( 'heading', { level: 1, name: 'Psst' } )
		).toBeInTheDocument();
	} );

	it( 'renders nothing rather than an empty landmark', () => {
		const { container } = render( <LinchpinBreadcrumbs items={ [] } /> );

		expect( container ).toBeEmptyDOMElement();
	} );
} );

describe( 'DangerZone', () => {
	it( 'stands a warning above the controls without being asked', () => {
		render(
			<Frame>
				<DangerZone title="Uninstall">
					<button>Delete everything</button>
				</DangerZone>
			</Frame>
		);

		expect(
			screen.getAllByText( /permanent and cannot be undone/ ).length
		).toBeGreaterThan( 0 );
		expect(
			screen.getByRole( 'heading', { name: 'Uninstall' } )
		).toBeInTheDocument();
	} );

	it( 'takes the plugin\u2019s own wording, and drops the warning entirely', () => {
		const { rerender } = render(
			<Frame>
				<DangerZone warning="There is no export." />
			</Frame>
		);
		expect(
			screen.getAllByText( 'There is no export.' ).length
		).toBeGreaterThan( 0 );

		rerender(
			<Frame>
				<DangerZone warning={ false } />
			</Frame>
		);
		expect(
			screen.queryByText( /cannot be undone/ )
		).not.toBeInTheDocument();
	} );

	it( 'leaves confirming to the plugin — it only places the action', () => {
		render(
			<Frame>
				<DangerZone actions={ <button>Reset settings</button> } />
			</Frame>
		);

		expect(
			screen.getByRole( 'button', { name: 'Reset settings' } )
		).toBeInTheDocument();
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

		// Both carry the mark and its ring; the lockup adds the wordmark.
		expect( full.querySelectorAll( 'path' ) ).toHaveLength( 14 );
		expect( mark.querySelectorAll( 'path' ) ).toHaveLength( 4 );
	} );

	it( 'uses each variant\u2019s own viewBox from the brand file', () => {
		const { container: full } = render( <LinchpinLogo variant="full" /> );
		const { container: mark } = render( <LinchpinLogo variant="mark" /> );

		expect( full.querySelector( 'svg' ) ).toHaveAttribute(
			'viewBox',
			'0 0 388 91'
		);
		expect( mark.querySelector( 'svg' ) ).toHaveAttribute(
			'viewBox',
			'0 0 81 80'
		);
	} );

	it( 'keeps the ring Linchpin blue in the tones the brand says to', () => {
		for ( const tone of [ 'primary', 'on-dark' ] ) {
			const { container } = render( <LinchpinLogo tone={ tone } /> );
			const fills = [ ...container.querySelectorAll( 'path' ) ].map(
				( path ) => path.getAttribute( 'fill' )
			);

			expect(
				fills.filter( ( fill ) => fill.includes( '--lp-color-blue' ) )
			).toHaveLength( 2 );
		}
	} );

	it( 'is single-colour in the white and black tones', () => {
		const { container } = render( <LinchpinLogo tone="black" /> );
		const fills = new Set(
			[ ...container.querySelectorAll( 'path' ) ].map( ( path ) =>
				path.getAttribute( 'fill' )
			)
		);

		// One value, not two that happen to resolve alike: ink and ring are
		// the same property in these tones.
		expect( fills.size ).toBe( 1 );
		expect( [ ...fills ][ 0 ] ).toContain( '--lp-color-black' );
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
			fills.every( ( fill ) => fill.includes( '--lp-color-' ) )
		).toBe( true );
	} );

	it( 'gives a host nothing to repaint the mark with', () => {
		const { container } = render( <LinchpinLogo /> );
		const fills = [ ...container.querySelectorAll( 'path' ) ].map(
			( path ) => path.getAttribute( 'fill' )
		);

		// The logo identifies Linchpin. An override hook we ship is one we
		// have endorsed, so there is not one — see docs/ui/development/brand.md.
		expect(
			fills.some(
				( fill ) =>
					fill.includes( '--lp-logo-ink' ) ||
					fill.includes( '--lp-logo-accent' )
			)
		).toBe( false );
	} );

	it( 'takes the surrounding colour when mono, for the brand bar', () => {
		const { container } = render( <LinchpinLogo tone="mono" /> );
		const fills = [ ...container.querySelectorAll( 'path' ) ].map(
			( path ) => path.getAttribute( 'fill' )
		);

		expect( fills.every( ( fill ) => fill === 'currentColor' ) ).toBe(
			true
		);
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
