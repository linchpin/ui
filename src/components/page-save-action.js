/**
 * WordPress dependencies
 */
import { useDispatch } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';
import { Button } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import { PageHeaderActions } from './page-header';

/**
 * Ask before leaving a page with changes that have not been saved.
 *
 * Covers reloads, closing the tab and links that leave the page, the cases a
 * browser can intercept. It does not cover switching section tabs in place;
 * a screen that keeps unsaved values across its tabs needs no warning there,
 * and one that discards them should keep its form above the tabs.
 *
 * @param {boolean} isDirty Whether there are unsaved changes.
 */
export function useUnsavedChangesWarning( isDirty ) {
	useEffect( () => {
		if ( ! isDirty ) {
			return undefined;
		}

		const warn = ( event ) => {
			event.preventDefault();
			// Older browsers show the prompt only when this is set.
			event.returnValue = '';
		};

		window.addEventListener( 'beforeunload', warn );

		return () => window.removeEventListener( 'beforeunload', warn );
	}, [ isDirty ] );
}

/**
 * The one Save a settings screen has, in its page header.
 *
 * Every section of a settings screen is part of the same settings, so one
 * Save is what happens underneath anyway; a button per section, each with its
 * own label and in its own place, only makes the person hunt for the one that
 * covers what they changed. This puts Save where the screen's other actions
 * are, disabled until something changes, and reports what happened as a
 * snackbar.
 *
 * It holds no form state of its own, so it sits on whatever holds it: pass
 * `isDirty` and an `onSave` that returns a promise, and rejects when the save
 * fails. With `saveEntityRecord`, that means `throwOnError: true`; without it
 * a failed save resolves, and reads here as a success.
 *
 * @param {Object}      props                Props.
 * @param {boolean}     props.isDirty        Whether there are changes to save.
 * @param {Function}    props.onSave         Saves; returns a promise that rejects on failure.
 * @param {boolean}     [props.isSaving]     Busy state, when the form tracks it itself.
 * @param {string}      [props.label]        Defaults to "Save".
 * @param {string|null} [props.savedMessage] Snackbar on success. `null` for none.
 * @param {string}      [props.errorMessage] Snackbar on failure when the error has no message of its own.
 * @param {boolean}     [props.warnOnLeave]  Ask before leaving with unsaved changes. Defaults to true.
 * @return {Element} The action, in the page header.
 */
export default function PageSaveAction( {
	isDirty,
	onSave,
	isSaving: isSavingProp,
	label = __( 'Save' ),
	savedMessage = __( 'Settings saved.' ),
	errorMessage = __( 'The settings could not be saved.' ),
	warnOnLeave = true,
} ) {
	const [ isSaving, setIsSaving ] = useState( false );
	const { createSuccessNotice, createErrorNotice } =
		useDispatch( noticesStore );

	useUnsavedChangesWarning( warnOnLeave && isDirty );

	const isBusy = isSavingProp ?? isSaving;

	const save = async () => {
		if ( isBusy || ! isDirty ) {
			return;
		}

		setIsSaving( true );

		try {
			await onSave();

			if ( savedMessage ) {
				createSuccessNotice( savedMessage, { type: 'snackbar' } );
			}
		} catch ( error ) {
			createErrorNotice( error?.message || errorMessage, {
				type: 'snackbar',
			} );
		} finally {
			setIsSaving( false );
		}
	};

	return (
		<PageHeaderActions>
			<Button
				variant="solid"
				onClick={ save }
				disabled={ ! isDirty || isBusy }
				loading={ isBusy }
			>
				{ label }
			</Button>
		</PageHeaderActions>
	);
}
