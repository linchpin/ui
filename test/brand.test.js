/**
 * Internal dependencies
 */
import { brandStyle, defineBrand } from '../src/brand/define-brand';
import { colorVar, LINCHPIN_COLORS, onBrandFor } from '../src/brand/colors';
import { linchpinLinks } from '../src/brand/links';

describe( 'defineBrand', () => {
	it( 'fills the Linchpin palette when a plugin names nothing', () => {
		const brand = defineBrand();

		// Blue is the bar, black is the ink: both agency colours, each doing
		// the job it is for.
		expect( brand.deep ).toBe( LINCHPIN_COLORS.blue );
		expect( brand.primary ).toBe( LINCHPIN_COLORS.black );
		expect( brand.accent ).toBe( LINCHPIN_COLORS.blue );
	} );

	it( 'keeps the agency bar white, because the agency said so', () => {
		// White on Linchpin blue is 2.15:1. It is the lockup Linchpin signs
		// its work with, and it is named in `DEFAULTS` rather than measured.
		expect( defineBrand().onBrand ).toBe( LINCHPIN_COLORS.onBrand );
	} );

	it( 'measures a plugin’s bar rather than assuming white reads on it', () => {
		// Psst's is nearly black, so white it is.
		expect( defineBrand( { deep: '#082318' } ).onBrand ).toBe(
			LINCHPIN_COLORS.onBrand
		);

		// A pale bar is the case the measurement exists for.
		expect( defineBrand( { deep: '#ffe066' } ).onBrand ).toBe(
			LINCHPIN_COLORS.black
		);

		// And a brand that has decided for itself is not overruled.
		expect(
			defineBrand( { deep: '#ffe066', onBrand: LINCHPIN_COLORS.onBrand } )
				.onBrand
		).toBe( LINCHPIN_COLORS.onBrand );
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

describe( 'onBrandFor', () => {
	it( 'takes the worse of the two gradient stops', () => {
		// White is fine on the violet, and hopeless on the light stop, and
		// the bar carries content at both ends.
		expect( onBrandFor( '#7d2bd6', '#f5f5f5' ) ).toBe(
			LINCHPIN_COLORS.black
		);
		expect( onBrandFor( '#7d2bd6', '#082318' ) ).toBe(
			LINCHPIN_COLORS.onBrand
		);
	} );

	it( 'reads both hex forms', () => {
		expect( onBrandFor( '#fff' ) ).toBe( LINCHPIN_COLORS.black );
		expect( onBrandFor( '#FFFFFF' ) ).toBe( LINCHPIN_COLORS.black );
		expect( onBrandFor( '#000' ) ).toBe( LINCHPIN_COLORS.onBrand );
	} );

	it( 'leaves white alone when it cannot measure the surface', () => {
		// A plugin may colour its bar from a custom property, or in a space
		// this does not parse. Guessing black there would be worse.
		expect( onBrandFor( 'var( --brand )' ) ).toBe(
			LINCHPIN_COLORS.onBrand
		);
		expect( onBrandFor( 'rgb(63 193 208)' ) ).toBe(
			LINCHPIN_COLORS.onBrand
		);
		expect( onBrandFor() ).toBe( LINCHPIN_COLORS.onBrand );
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

		// There is one Linchpin blue, and it is not called cyan.
		expect( () => colorVar( 'cyan' ) ).toThrow( /unknown colour/ );
	} );
} );
