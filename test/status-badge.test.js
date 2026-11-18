/**
 * External dependencies
 */
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/**
 * Internal dependencies
 */
import { StatusBadge, StatusBadges, STATUS_TONES, statusTone } from '../src';

describe( 'StatusBadge', () => {
	it( 'shows its label in a pill toned by the status', () => {
		render( <StatusBadge tone="error">Not reporting</StatusBadge> );

		const badge = screen.getByText( 'Not reporting' );

		expect( badge ).toHaveClass( 'lp-admin__status-badge', 'is-error' );
	} );

	it( 'maps every tone to a @wordpress/ui Badge intent', () => {
		expect( STATUS_TONES ).toEqual( {
			success: 'stable',
			info: 'informational',
			caution: 'low',
			warning: 'medium',
			error: 'high',
			neutral: 'draft',
		} );
	} );

	it( 'accepts the older tone words and treats anything else as neutral', () => {
		expect( statusTone( 'ok' ) ).toBe( 'success' );
		expect( statusTone( 'problem' ) ).toBe( 'error' );
		expect( statusTone( 'danger' ) ).toBe( 'error' );
		expect( statusTone( 'caution' ) ).toBe( 'caution' );
		expect( statusTone( 'needs-update' ) ).toBe( 'neutral' );
		expect( statusTone( undefined ) ).toBe( 'neutral' );

		render( <StatusBadge tone="ok">Reporting</StatusBadge> );

		expect( screen.getByText( 'Reporting' ) ).toHaveClass( 'is-success' );
	} );

	it( 'renders a muted dash, not an empty pill, when there is no status', () => {
		const { container } = render( <StatusBadge tone="success" /> );

		expect( container.textContent ).toBe( '—' );
		expect( container.firstChild ).toHaveClass(
			'lp-admin__status-badge-empty'
		);
	} );

	it( 'marks quiet, large and in-progress badges', () => {
		render(
			<>
				<StatusBadge quiet>Muted</StatusBadge>
				<StatusBadge size="lg" tone="caution">
					C
				</StatusBadge>
				<StatusBadge isGoing tone="info">
					Running
				</StatusBadge>
			</>
		);

		expect( screen.getByText( 'Muted' ) ).toHaveClass( 'is-quiet' );
		expect( screen.getByText( 'C' ) ).toHaveClass( 'is-large' );
		expect( screen.getByText( 'Running' ) ).toHaveClass( 'is-going' );
	} );

	it( 'is not focusable without a description', () => {
		render( <StatusBadge tone="success">Passed</StatusBadge> );

		expect(
			screen.getByText( 'Passed' ).closest( '[tabindex]' )
		).toBeNull();
	} );

	it( 'puts its description in the accessible name and in a tooltip on focus', async () => {
		render(
			<StatusBadge
				tone="caution"
				description="One baseline item is missing."
			>
				C
			</StatusBadge>
		);

		const trigger = screen
			.getByText( 'C' )
			.closest( '.lp-admin__status-badge-trigger' );

		expect( trigger ).toHaveAttribute( 'tabindex', '0' );
		expect( trigger ).toHaveTextContent(
			'C: One baseline item is missing.'
		);

		await userEvent.tab();

		expect( trigger ).toHaveFocus();

		const portal = await screen.findByText(
			( content, element ) =>
				!! element?.closest( '[data-base-ui-portal]' ) &&
				element.children.length === 0 &&
				'One baseline item is missing.' === content
		);

		expect( portal ).toBeInTheDocument();
	} );
} );

describe( 'StatusBadges', () => {
	it( 'groups badges under a name when given one', () => {
		render(
			<StatusBadges label="Site status">
				<StatusBadge tone="success">Reporting</StatusBadge>
				<StatusBadge tone="caution">2 updates</StatusBadge>
			</StatusBadges>
		);

		expect(
			screen.getByRole( 'group', { name: 'Site status' } )
		).toBeInTheDocument();
	} );
} );
