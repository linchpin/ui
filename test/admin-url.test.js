/**
 * Internal dependencies
 */
import { adminUrl, isSameScreen } from '../src/utils/admin-url';

const SITES = 'https://example.com/wp-admin/admin.php?page=sites&q=acme';

describe( 'adminUrl', () => {
	it( 'starts from the screen, not from everything on the current address', () => {
		expect( adminUrl( { site: 35 }, { from: SITES } ) ).toBe(
			'/wp-admin/admin.php?page=sites&site=35'
		);
	} );

	it( 'carries the arguments it is asked to keep', () => {
		expect(
			adminUrl( { tab: 'packages' }, { keep: [ 'q' ], from: SITES } )
		).toBe( '/wp-admin/admin.php?page=sites&q=acme&tab=packages' );
	} );

	it( 'carries everything when keep is true', () => {
		expect(
			adminUrl( { tab: 'packages' }, { keep: true, from: SITES } )
		).toBe( '/wp-admin/admin.php?page=sites&q=acme&tab=packages' );
	} );

	it( 'removes an argument set to null, false or an empty string', () => {
		expect(
			adminUrl(
				{ q: null, tab: false, site: '' },
				{ keep: true, from: SITES }
			)
		).toBe( '/wp-admin/admin.php?page=sites' );
	} );

	it( 'joins an array with commas', () => {
		expect(
			adminUrl(
				{ filter: [ 'production', 'patchable' ] },
				{ from: SITES }
			)
		).toBe(
			'/wp-admin/admin.php?page=sites&filter=production%2Cpatchable'
		);
	} );

	it( 'points at another screen when given its page and file', () => {
		expect(
			adminUrl(
				{ page: 'governance-settings' },
				{ path: 'options-general.php', from: SITES }
			)
		).toBe( '/wp-admin/options-general.php?page=governance-settings' );
	} );

	it( 'accepts a Location-like object', () => {
		expect(
			adminUrl(
				{ site: 1 },
				{
					from: {
						pathname: '/wp-admin/admin.php',
						search: '?page=sites',
					},
				}
			)
		).toBe( '/wp-admin/admin.php?page=sites&site=1' );
	} );
} );

describe( 'isSameScreen', () => {
	it( 'is true for another view of the same page', () => {
		expect(
			isSameScreen( '/wp-admin/admin.php?page=sites&site=35', SITES )
		).toBe( true );
	} );

	it( 'is false for another page on the same file', () => {
		expect(
			isSameScreen( '/wp-admin/admin.php?page=security', SITES )
		).toBe( false );
	} );

	it( 'is false for the same page under another file', () => {
		expect(
			isSameScreen( '/wp-admin/plugins.php?page=sites', SITES )
		).toBe( false );
	} );

	it( 'is false for another origin', () => {
		expect(
			isSameScreen(
				'https://other.test/wp-admin/admin.php?page=sites',
				SITES
			)
		).toBe( false );
	} );
} );
