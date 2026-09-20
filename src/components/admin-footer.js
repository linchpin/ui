/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useAdminContext } from '../context';

/**
 * The row of links under the screen.
 *
 * @param {Object} props             Props.
 * @param {Array}  [props.links]     `[ { href, label } ]`. Defaults to the standard four.
 * @param {string} [props.className] Extra class names.
 * @return {Element} The footer.
 */
export default function LinchpinAdminFooter( { links, className } ) {
	const { plugin, links: context } = useAdminContext();

	const items = links ?? [
		{
			href: context?.github,
			label: plugin?.version
				? `${ plugin?.name } ${ plugin.version }`
				: plugin?.name,
		},
		{ href: context?.linchpin, label: __( 'Linchpin' ) },
		{ href: context?.support, label: __( 'Support' ) },
		{ href: context?.issues, label: __( 'Report an issue' ) },
	];

	return (
		<footer
			className={ [ 'lp-admin__footer', className ]
				.filter( Boolean )
				.join( ' ' ) }
		>
			{ items
				.filter( ( item ) => item.href && item.label )
				.map( ( item ) => (
					<a
						key={ item.href }
						href={ item.href }
						target="_blank"
						rel="noreferrer"
					>
						{ item.label }
					</a>
				) ) }
		</footer>
	);
}
