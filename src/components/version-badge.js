/**
 * The plugin's version, as a pill.
 *
 * @param {Object} props             Props.
 * @param {string} props.version     Version, with or without a leading `v`.
 * @param {string} [props.className] Extra class names.
 * @return {Element|null} The badge, or nothing when there is no version.
 */
export default function VersionBadge( { version, className } ) {
	if ( ! version ) {
		return null;
	}

	const label = String( version ).startsWith( 'v' )
		? String( version )
		: `v${ version }`;

	return (
		<span
			className={ [ 'lp-admin__version', className ]
				.filter( Boolean )
				.join( ' ' ) }
		>
			{ label }
		</span>
	);
}
