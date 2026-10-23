/**
 * External dependencies
 */
import { render, screen } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { FactList } from '../src';

describe( 'FactList', () => {
	it( 'renders each fact as a term and its description', () => {
		const { container } = render(
			<FactList
				items={ [
					{ id: 'wp', label: 'WordPress', value: '7.1.3' },
					{ id: 'php', label: 'PHP', value: '8.5.12' },
				] }
			/>
		);

		expect( container.querySelectorAll( 'dt' ) ).toHaveLength( 2 );
		expect( screen.getByText( 'WordPress' ).tagName ).toBe( 'DT' );
		expect( screen.getByText( '7.1.3' ).tagName ).toBe( 'DD' );
	} );

	it( 'leaves out a fact with no value', () => {
		render(
			<FactList
				items={ [
					{ id: 'wp', label: 'WordPress', value: '7.1.3' },
					{ id: 'host', label: 'Host', value: null },
					{ id: 'repo', label: 'Repository', value: '' },
				] }
			/>
		);

		expect( screen.queryByText( 'Host' ) ).not.toBeInTheDocument();
		expect( screen.queryByText( 'Repository' ) ).not.toBeInTheDocument();
	} );

	it( 'renders nothing when no fact has a value', () => {
		const { container } = render(
			<FactList items={ [ { id: 'host', label: 'Host' } ] } />
		);

		expect( container ).toBeEmptyDOMElement();
	} );

	it( 'marks each fact with its tone and the list with its layout', () => {
		const { container } = render(
			<FactList
				layout="inline"
				items={ [
					{
						id: 'reporting',
						label: 'Reporting',
						value: 'Not reporting',
						tone: 'error',
					},
				] }
			/>
		);

		expect( container.firstChild ).toHaveClass( 'is-inline' );
		expect( screen.getByText( 'Reporting' ).parentElement ).toHaveClass(
			'is-error'
		);
	} );

	it( 'puts help under the value', () => {
		render(
			<FactList
				items={ [
					{
						id: 'sync',
						label: 'Last sync',
						value: '31 minutes ago',
						help: 'Pulled 17 minutes ago',
					},
				] }
			/>
		);

		expect(
			screen.getByText( 'Pulled 17 minutes ago' ).closest( 'dd' )
		).toHaveTextContent( '31 minutes ago' );
	} );
} );
