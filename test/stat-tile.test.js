/**
 * External dependencies
 */
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/**
 * Internal dependencies
 */
import { StatTile, StatTiles } from '../src';

describe( 'StatTile', () => {
	it( 'is a toggle when it filters, and says whether it is on', async () => {
		const onClick = vi.fn();

		render(
			<StatTile
				value={ 39 }
				label="Needs updates"
				onClick={ onClick }
				isPressed
			/>
		);

		const tile = screen.getByRole( 'button', { name: /Needs updates/ } );

		expect( tile ).toHaveAttribute( 'aria-pressed', 'true' );

		await userEvent.click( tile );

		expect( onClick ).toHaveBeenCalledTimes( 1 );
	} );

	it( 'is a link when it leads somewhere', () => {
		render(
			<StatTile
				value={ 9 }
				label="Not reporting"
				href="/wp-admin/admin.php?page=sites&filter=not_reporting"
			/>
		);

		expect(
			screen.getByRole( 'link', { name: /Not reporting/ } )
		).toHaveAttribute(
			'href',
			'/wp-admin/admin.php?page=sites&filter=not_reporting'
		);
	} );

	it( 'is neither when it only states a number', () => {
		render( <StatTile value={ 73 } label="Governed sites" /> );

		expect( screen.queryByRole( 'button' ) ).not.toBeInTheDocument();
		expect( screen.queryByRole( 'link' ) ).not.toBeInTheDocument();
		expect( screen.getByText( 'Governed sites' ) ).toBeInTheDocument();
	} );

	it( 'formats a number for the reader', () => {
		render( <StatTile value={ 1285 } label="Installs" /> );

		expect(
			screen.getByText( new Intl.NumberFormat().format( 1285 ) )
		).toBeInTheDocument();
	} );

	it( 'keeps interactive extras outside the clickable part', () => {
		render(
			<StatTile
				value={ 39 }
				label="Needs updates"
				onClick={ () => {} }
				footer={ <a href="?filter=production">34 Production</a> }
			/>
		);

		const button = screen.getByRole( 'button', { name: /Needs updates/ } );
		const link = screen.getByRole( 'link', { name: '34 Production' } );

		expect( button ).not.toContainElement( link );
	} );

	it( 'draws no button or link while it loads', () => {
		render(
			<StatTile
				value={ 39 }
				label="Needs updates"
				onClick={ () => {} }
				isLoading
			/>
		);

		expect( screen.queryByRole( 'button' ) ).not.toBeInTheDocument();
		expect( screen.queryByText( '39' ) ).not.toBeInTheDocument();
	} );

	it( 'groups a row under one name', () => {
		render(
			<StatTiles label="Site summary">
				<StatTile value={ 1 } label="One" />
			</StatTiles>
		);

		expect(
			screen.getByRole( 'group', { name: 'Site summary' } )
		).toBeInTheDocument();
	} );
} );
