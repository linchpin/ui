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
	LinchpinAdminFooter,
	LinchpinAdminFrame,
	LinchpinAdminLayout,
	LinchpinAdminMasthead,
	LinchpinAdminTopBar,
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

	it( 'falls back to the plugin name when there is no logo', () => {
		render( <Frame topBar={ <LinchpinAdminTopBar /> } /> );

		expect( screen.getByText( 'Psst' ) ).toBeInTheDocument();
	} );

	it( 'leaves the status dot off unless asked', () => {
		const { container } = render(
			<Frame topBar={ <LinchpinAdminTopBar /> } />
		);

		expect( container.querySelector( '.lp-admin__status' ) ).toBeNull();
	} );
} );

describe( 'LinchpinAdminMasthead', () => {
	it( 'titles the screen after the plugin and renders its actions', () => {
		render(
			<Frame>
				<LinchpinAdminMasthead description="One-time secrets.">
					<button>Share a secret</button>
				</LinchpinAdminMasthead>
			</Frame>
		);

		expect(
			screen.getByRole( 'heading', { level: 1, name: 'Psst' } )
		).toBeInTheDocument();
		expect( screen.getByText( 'One-time secrets.' ) ).toBeInTheDocument();
		expect(
			screen.getByRole( 'button', { name: 'Share a secret' } )
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
