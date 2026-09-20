/**
 * Internal dependencies
 */
import { brandStyle, defineBrand } from '../src/brand/define-brand';
import { colorVar, LINCHPIN_COLORS } from '../src/brand/colors';
import { linchpinLinks } from '../src/brand/links';

describe( 'defineBrand', () => {
	it( 'fills the Linchpin palette when a plugin names nothing', () => {
		const brand = defineBrand();

		expect( brand.primary ).toBe( LINCHPIN_COLORS.blue );
		expect( brand.accent ).toBe( LINCHPIN_COLORS.cyan );
	} );

	it( 'flattens the top bar rather than inventing a second stop', () => {
		expect( defineBrand( { deep: '#082318' } ).deepEnd ).toBe( '#082318' );
		expect(
			defineBrand( { deep: '#082318', deepEnd: '#164a3b' } ).deepEnd
		).toBe( '#164a3b' );
	} );

	it( 'carries a plugin’s own vocabulary through to custom properties', () => {
		const brand = defineBrand( { primary: '#318873', mint: '#5beece' } );

		expect( brandStyle( brand ) ).toMatchObject( {
			'--lp-brand-primary': '#318873',
			'--lp-brand-mint': '#5beece',
		} );
	} );

	it( 'kebab-cases camelCase keys, so deepEnd reaches CSS as deep-end', () => {
		expect(
			brandStyle( defineBrand( { deepEnd: '#164a3b' } ) )
		).toHaveProperty( '--lp-brand-deep-end', '#164a3b' );
	} );

	it( 'refuses a colour that is not a string', () => {
		expect( () => defineBrand( { primary: 0x318873 } ) ).toThrow(
			/must be a non-empty string/
		);
	} );

	it( 'is frozen, so a screen cannot recolour itself at runtime', () => {
		const brand = defineBrand();

		expect( Object.isFrozen( brand ) ).toBe( true );
	} );
} );

describe( 'linchpinLinks', () => {
	it( 'tags the agency link so we can tell which plugin sent a visitor', () => {
		const links = linchpinLinks( { plugin: 'psst' } );
		const url = new URL( links.linchpin );

		expect( url.searchParams.get( 'utm_source' ) ).toBe( 'psst' );
		expect( url.searchParams.get( 'utm_medium' ) ).toBe( 'plugin' );
		expect( url.searchParams.get( 'utm_campaign' ) ).toBe( 'admin' );
	} );

	it( 'assumes the repo is linchpin/<slug> until told otherwise', () => {
		expect( linchpinLinks( { plugin: 'psst' } ).github ).toBe(
			'https://github.com/linchpin/psst'
		);
		expect(
			linchpinLinks( {
				plugin: 'blocks',
				repo: 'linchpin/linchpin-blocks',
			} ).issues
		).toBe( 'https://github.com/linchpin/linchpin-blocks/issues' );
	} );

	it( 'points at the README until a docs site exists', () => {
		expect( linchpinLinks( { plugin: 'psst' } ).readme ).toBe(
			'https://github.com/linchpin/psst#readme'
		);
		expect(
			linchpinLinks( {
				plugin: 'psst',
				docs: 'https://docs.linchpin.com/psst',
			} ).readme
		).toBe( 'https://docs.linchpin.com/psst' );
	} );

	it( 'requires a slug, because every link is built from it', () => {
		expect( () => linchpinLinks() ).toThrow( /plugin slug is required/ );
	} );
} );

describe( 'colorVar', () => {
	it( 'references the property and carries the palette value as a fallback', () => {
		expect( colorVar( 'blue' ) ).toBe(
			`var( --lp-color-blue, ${ LINCHPIN_COLORS.blue } )`
		);
	} );

	it( 'refuses a colour the palette does not define', () => {
		expect( () => colorVar( 'chartreuse' ) ).toThrow( /unknown colour/ );
	} );
} );
