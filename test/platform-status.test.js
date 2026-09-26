/**
 * Internal dependencies
 */
import {
	platformStatusFrom,
	statusLabel,
} from '../src/hooks/use-platform-status';

/*
 * The shape status.linchpin.com/api/data returns: counts of monitors, and the
 * monitors themselves. There is no `status` string.
 */
const summary = ( down ) => ( {
	up: 6 - down,
	down,
	updatedAt: 1790446382,
	monitors: {},
} );

describe( 'platformStatusFrom', () => {
	it( 'reads every monitor up as up', () => {
		expect( platformStatusFrom( summary( 0 ) ) ).toBe( 'up' );
	} );

	it( 'reads any monitor down as down', () => {
		expect( platformStatusFrom( summary( 1 ) ) ).toBe( 'down' );
	} );

	it( 'claims nothing from a summary without a down count', () => {
		expect( platformStatusFrom( { status: 'up' } ) ).toBe( 'unknown' );
		expect( platformStatusFrom( null ) ).toBe( 'unknown' );
		expect( platformStatusFrom( { down: '0' } ) ).toBe( 'unknown' );
	} );

	it( 'labels each reading', () => {
		expect( statusLabel( platformStatusFrom( summary( 0 ) ) ) ).toBe(
			'All systems operational'
		);
		expect( statusLabel( platformStatusFrom( summary( 2 ) ) ) ).toBe(
			'System issues reported'
		);
	} );
} );
