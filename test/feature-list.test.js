/**
 * External dependencies
 */
import { render, screen } from '@testing-library/react';

/**
 * WordPress dependencies
 */
import { check } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { FeatureList } from '../src';

describe( 'FeatureList', () => {
	it( 'renders each line as a list item with its name as a heading', () => {
		const { container } = render(
			<FeatureList
				items={ [
					{
						key: 'uptime',
						icon: check,
						title: 'Uptime',
						text: 'Alerts when the site stops answering.',
					},
					{ key: 'cache', title: 'Cache', text: 'Clears it.' },
				] }
			/>
		);

		expect( container.querySelectorAll( 'li' ) ).toHaveLength( 2 );
		expect( screen.getByText( 'Uptime' ).tagName ).toBe( 'H3' );
		expect(
			screen.getByText( 'Alerts when the site stops answering.' )
		).toBeInTheDocument();
		// The icon is decoration: the name says what the line is.
		expect(
			container.querySelector( '.lp-admin__feature-icon' )
		).toHaveAttribute( 'aria-hidden', 'true' );
	} );

	it( 'takes the heading level and the column layout it is given', () => {
		const { container } = render(
			<FeatureList
				columns
				headingLevel={ 4 }
				items={ [ { key: 'a', title: 'A', text: 'One.' } ] }
			/>
		);

		expect( screen.getByText( 'A' ).tagName ).toBe( 'H4' );
		expect( container.firstChild ).toHaveClass( 'is-columns' );
	} );
} );
