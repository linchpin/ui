/**
 * WordPress dependencies
 */
import { SnackbarList } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';

/**
 * Snackbar notices from the core notices store.
 *
 * A screen dispatches `core/notices` as it would anywhere else in wp-admin;
 * this renders them in the right place with the right class.
 *
 * @param {Object} props             Props.
 * @param {string} [props.className] Extra class names.
 * @return {Element} The notices.
 */
export default function LinchpinNotices( { className } ) {
	const notices = useSelect(
		( select ) =>
			select( noticesStore )
				.getNotices()
				.filter( ( notice ) => notice.type === 'snackbar' ),
		[]
	);
	const { removeNotice } = useDispatch( noticesStore );

	return (
		<SnackbarList
			className={ [ 'lp-admin__notices', className ]
				.filter( Boolean )
				.join( ' ' ) }
			notices={ notices }
			onRemove={ removeNotice }
		/>
	);
}
