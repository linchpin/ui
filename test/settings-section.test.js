/**
 * External dependencies
 */
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/**
 * WordPress dependencies
 */
import { dispatch, select } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { store as noticesStore } from '@wordpress/notices';

/**
 * Internal dependencies
 */
import {
	LinchpinAdminPage,
	PageSaveAction,
	SettingsCard,
	SettingsSection,
} from '../src';

/**
 * @return {Array<string>} The snackbar messages raised so far.
 */
const snackbars = () =>
	select( noticesStore )
		.getNotices()
		.filter( ( notice ) => notice.type === 'snackbar' )
		.map( ( notice ) => notice.content );

/**
 * @param {Element} element The button.
 * @return {boolean} Whether it is disabled, as @wordpress/ui reports it.
 */
const isDisabled = ( element ) =>
	element.getAttribute( 'aria-disabled' ) === 'true' || element.disabled;

describe( 'SettingsSection', () => {
	it( 'is flat by default, with a real heading and its controls stacked', () => {
		const { container } = render(
			<SettingsSection
				title="Team chat"
				description="Chat with the Linchpin team from the admin."
			>
				<label htmlFor="chat">Enable team chat</label>
				<input id="chat" type="checkbox" />
			</SettingsSection>
		);

		const section = container.querySelector( '.lp-admin__section' );

		expect( section ).toHaveClass( 'is-flat' );
		expect(
			screen.getByRole( 'heading', { level: 2, name: 'Team chat' } )
		).toBeInTheDocument();
		expect(
			screen.getByText( 'Chat with the Linchpin team from the admin.' )
		).toBeInTheDocument();
		expect(
			section.querySelector( '.lp-admin__section-body' )
		).toContainElement( screen.getByLabelText( 'Enable team chat' ) );
	} );

	it( 'takes a heading level for a group inside a section', () => {
		render( <SettingsSection title="Slack channel" headingLevel={ 3 } /> );

		expect(
			screen.getByRole( 'heading', { level: 3, name: 'Slack channel' } )
		).toBeInTheDocument();
	} );

	it( 'draws a card only when asked to', () => {
		const { container } = render(
			<SettingsSection title="Danger" surface="card">
				body
			</SettingsSection>
		);

		expect( container.querySelector( '.lp-admin__section' ) ).toHaveClass(
			'is-card'
		);
	} );

	it( 'renders actions beside the heading', () => {
		render(
			<SettingsSection
				title="Slack channel"
				actions={ <button>Change channel</button> }
			/>
		);

		expect(
			screen
				.getByRole( 'button', { name: 'Change channel' } )
				.closest( '.lp-admin__section-actions' )
		).not.toBeNull();
	} );

	it( 'keeps SettingsCard working, as a card section', () => {
		const { container } = render(
			<SettingsCard title="Expiration">body</SettingsCard>
		);

		expect( container.querySelector( '.lp-admin__section' ) ).toHaveClass(
			'is-card',
			'lp-admin__settings-card'
		);
		expect(
			screen.getByRole( 'heading', { level: 2, name: 'Expiration' } )
		).toBeInTheDocument();
	} );
} );

describe( 'PageSaveAction', () => {
	beforeEach( () => {
		select( noticesStore )
			.getNotices()
			.forEach( ( notice ) =>
				dispatch( noticesStore ).removeNotice( notice.id )
			);
	} );

	/**
	 * A screen with one field and the header Save.
	 *
	 * @param {Object}   props        Props.
	 * @param {Function} props.onSave Saves.
	 * @return {Element} The screen.
	 */
	function Screen( { onSave } ) {
		const [ saved, setSaved ] = useState( 'Pinbot' );
		const [ value, setValue ] = useState( 'Pinbot' );

		return (
			<LinchpinAdminPage
				title="AI Assistant"
				badges={ null }
				showSidebarToggle={ false }
			>
				<PageSaveAction
					isDirty={ value !== saved }
					onSave={ async () => {
						await onSave( value );
						setSaved( value );
					} }
				/>
				<label htmlFor="name">Name</label>
				<input
					id="name"
					value={ value }
					onChange={ ( event ) => setValue( event.target.value ) }
				/>
			</LinchpinAdminPage>
		);
	}

	it( 'is disabled until something changes', async () => {
		render( <Screen onSave={ jest.fn() } /> );

		const save = screen.getByRole( 'button', { name: 'Save' } );

		expect( isDisabled( save ) ).toBe( true );

		await userEvent.type( screen.getByLabelText( 'Name' ), 's' );

		expect( isDisabled( save ) ).toBe( false );
	} );

	it( 'saves, says so, and is disabled again', async () => {
		const onSave = jest.fn().mockResolvedValue();
		render( <Screen onSave={ onSave } /> );

		await userEvent.type( screen.getByLabelText( 'Name' ), 's' );
		await userEvent.click( screen.getByRole( 'button', { name: 'Save' } ) );

		await waitFor( () =>
			expect( snackbars() ).toContain( 'Settings saved.' )
		);
		expect( onSave ).toHaveBeenCalledWith( 'Pinbots' );
		expect(
			isDisabled( screen.getByRole( 'button', { name: 'Save' } ) )
		).toBe( true );
	} );

	it( 'reports a failed save and keeps the changes', async () => {
		const onSave = jest
			.fn()
			.mockRejectedValue( new Error( 'The site could not be reached.' ) );
		render( <Screen onSave={ onSave } /> );

		await userEvent.type( screen.getByLabelText( 'Name' ), 's' );
		await userEvent.click( screen.getByRole( 'button', { name: 'Save' } ) );

		await waitFor( () =>
			expect( snackbars() ).toContain( 'The site could not be reached.' )
		);
		expect(
			isDisabled( screen.getByRole( 'button', { name: 'Save' } ) )
		).toBe( false );
	} );

	it( 'asks before leaving with unsaved changes, and only then', async () => {
		render( <Screen onSave={ jest.fn() } /> );

		const leave = () => {
			const event = new Event( 'beforeunload', { cancelable: true } );

			act( () => {
				window.dispatchEvent( event );
			} );

			return event.defaultPrevented;
		};

		expect( leave() ).toBe( false );

		await userEvent.type( screen.getByLabelText( 'Name' ), 's' );

		expect( leave() ).toBe( true );
	} );
} );
