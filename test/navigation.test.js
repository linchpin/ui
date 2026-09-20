/**
 * Internal dependencies
 */
import { currentSection, sectionNavigation } from '../src/utils/navigation';

const SECTIONS = [
	{ name: 'settings', label: 'Settings' },
	{ name: 'secrets', label: 'Secrets' },
	{ name: 'health', label: 'Health' },
];

/**
 * @param {string} search A query string.
 * @return {Object} Enough of a Location for the helpers.
 */
function at( search ) {
	return { pathname: '/wp-admin/admin.php', search };
}

describe( 'sectionNavigation', () => {
	it( 'keeps the rest of the URL, changing only the section argument', () => {
		const { items } = sectionNavigation( {
			sections: SECTIONS,
			location: at( '?page=psst&paged=2' ),
		} );

		expect( items[ 1 ].href ).toBe(
			'/wp-admin/admin.php?page=psst&paged=2&tab=secrets'
		);
	} );

	it( 'marks the section the URL asks for', () => {
		const { currentHref } = sectionNavigation( {
			sections: SECTIONS,
			location: at( '?page=psst&tab=health' ),
		} );

		expect( currentHref ).toBe(
			'/wp-admin/admin.php?page=psst&tab=health'
		);
	} );

	it( 'falls back to the first section when the URL asks for one we do not have', () => {
		const { currentHref } = sectionNavigation( {
			sections: SECTIONS,
			location: at( '?page=psst&tab=nonsense' ),
		} );

		expect( currentHref ).toBe(
			'/wp-admin/admin.php?page=psst&tab=settings'
		);
	} );

	it( 'honours an explicit current section over the URL', () => {
		const { currentHref } = sectionNavigation( {
			sections: SECTIONS,
			current: 'secrets',
			location: at( '?page=psst&tab=health' ),
		} );

		expect( currentHref ).toContain( 'tab=secrets' );
	} );

	it( 'takes a different query argument', () => {
		const { items } = sectionNavigation( {
			sections: SECTIONS,
			queryArg: 'view',
			location: at( '?page=psst' ),
		} );

		expect( items[ 0 ].href ).toContain( 'view=settings' );
	} );

	it( 'omits currentHref and ariaLabel rather than passing undefined', () => {
		const config = sectionNavigation( {
			sections: [],
			location: at( '' ),
		} );

		expect( config ).toEqual( { items: [] } );
	} );
} );

describe( 'currentSection', () => {
	it( 'reads the section from the URL', () => {
		expect(
			currentSection( {
				sections: SECTIONS,
				location: at( '?tab=secrets' ),
			} )
		).toBe( 'secrets' );
	} );

	it( 'defaults to the first section', () => {
		expect(
			currentSection( { sections: SECTIONS, location: at( '' ) } )
		).toBe( 'settings' );
		expect(
			currentSection( {
				sections: SECTIONS,
				location: at( '?tab=nonsense' ),
			} )
		).toBe( 'settings' );
	} );
} );
