/**
 * External dependencies
 */
import { fireEvent, render, screen } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { LinchpinNotice } from '../src';

describe( 'LinchpinNotice', () => {
	it( 'renders only the parts it is given', () => {
		const { container } = render(
			<LinchpinNotice title="Linchpin can handle these updates for you">
				Each update is tested before it is applied.
			</LinchpinNotice>
		);

		expect(
			screen.getByText( 'Linchpin can handle these updates for you' )
		).toHaveClass( 'lp-notice__title' );
		expect(
			screen.getByText( 'Each update is tested before it is applied.' )
		).toHaveClass( 'lp-notice__body' );

		// No eyebrow, chip, actions or dismiss button unless asked for.
		expect(
			container.querySelector( '.lp-notice__eyebrow' )
		).not.toBeInTheDocument();
		expect(
			container.querySelector( '.lp-notice__status' )
		).not.toBeInTheDocument();
		expect(
			container.querySelector( '.lp-notice__actions' )
		).not.toBeInTheDocument();
		expect( screen.queryByRole( 'button' ) ).not.toBeInTheDocument();
	} );

	it( 'puts the eyebrow above the title and the chip beside it', () => {
		const { container } = render(
			<LinchpinNotice
				eyebrow="Mantle"
				title="Mantle is treating this install as a copy"
				status="Needs an answer"
			/>
		);

		const content = container.querySelector( '.lp-notice__content' );

		expect( content.firstChild ).toHaveTextContent( 'Mantle' );
		expect( content.firstChild ).toHaveClass( 'lp-notice__eyebrow' );
		expect(
			container.querySelector( '.lp-notice__heading' )
		).toHaveTextContent(
			'Mantle is treating this install as a copyNeeds an answer'
		);
	} );

	it( 'keeps a chip with no title', () => {
		const { container } = render(
			<LinchpinNotice tone="warning" status="Needs attention">
				The MCP Adapter plugin is not active.
			</LinchpinNotice>
		);

		expect(
			container.querySelector( '.lp-notice__heading' )
		).toHaveTextContent( 'Needs attention' );
		expect(
			container.querySelector( '.lp-notice__title' )
		).not.toBeInTheDocument();
	} );

	it( 'gives the actions a column of their own beside the content', () => {
		const { container } = render(
			<LinchpinNotice
				title="Linchpin can handle these updates for you"
				actions={ <button type="button">Ask Linchpin</button> }
			/>
		);

		const inner = container.querySelector( '.lp-notice__inner' );

		expect(
			[ ...inner.children ].map( ( node ) => node.className )
		).toEqual( [
			'lp-notice__icon',
			'lp-notice__content',
			'lp-notice__actions',
		] );
		expect(
			screen.getByRole( 'button', { name: 'Ask Linchpin' } )
		).toBeInTheDocument();
	} );

	it( 'shows the Linchpin mark by default, a given mark, or no tile', () => {
		const { container, rerender } = render(
			<LinchpinNotice title="Default" />
		);

		expect(
			container.querySelector( '.lp-notice__icon .lp-logo.is-mark' )
		).toBeInTheDocument();
		expect( container.querySelector( '.lp-notice__icon' ) ).toHaveAttribute(
			'aria-hidden',
			'true'
		);

		rerender(
			<LinchpinNotice title="Own mark" icon={ <img src="" alt="" /> } />
		);
		expect(
			container.querySelector( '.lp-notice__icon img' )
		).toBeInTheDocument();

		rerender( <LinchpinNotice title="No tile" icon={ false } /> );
		expect(
			container.querySelector( '.lp-notice__icon' )
		).not.toBeInTheDocument();
	} );

	it( 'renders a heading only when asked for a level', () => {
		const { rerender } = render( <LinchpinNotice title="A paragraph" /> );

		expect( screen.queryByRole( 'heading' ) ).not.toBeInTheDocument();

		rerender( <LinchpinNotice title="A heading" headingLevel={ 2 } /> );
		expect(
			screen.getByRole( 'heading', { level: 2, name: 'A heading' } )
		).toBeInTheDocument();
	} );

	it( 'states tone, surface and shape as classes', () => {
		const { container, rerender } = render(
			<LinchpinNotice title="Plain" />
		);

		expect( container.firstChild ).toHaveClass(
			'lp-notice',
			'is-card',
			'is-tone-info'
		);
		expect( container.firstChild ).not.toHaveClass( 'is-tinted' );

		rerender(
			<LinchpinNotice
				title="Not connected"
				tone="warning"
				surface="tinted"
				variant="banner"
			/>
		);
		expect( container.firstChild ).toHaveClass(
			'is-banner',
			'is-tone-warning',
			'is-tinted'
		);

		rerender( <LinchpinNotice title="Unknown" tone="loud" /> );
		expect( container.firstChild ).toHaveClass( 'is-tone-info' );
	} );

	it( 'dismisses through its own button, which reserves its corner', () => {
		const onDismiss = jest.fn();
		const { container } = render(
			<LinchpinNotice title="Dismissible" onDismiss={ onDismiss } />
		);

		expect( container.firstChild ).toHaveClass( 'has-dismiss' );

		fireEvent.click(
			screen.getByRole( 'button', { name: 'Dismiss this notice' } )
		);

		expect( onDismiss ).toHaveBeenCalledTimes( 1 );
	} );
} );
