/**
 * The plugin's version.
 *
 * Two tones, because it appears in two places: `on-brand` is the pill in the
 * top bar, which sits on the brand gradient; `neutral` is the badge in the
 * page header, which sits on the admin background and takes design-system
 * tokens like everything else there.
 *
 * @param {Object} props             Props.
 * @param {string} props.version     Version, with or without a leading `v`.
 * @param {string} [props.tone]      `on-brand` (default) or `neutral`.
 * @param {string} [props.className] Extra class names.
 * @return {Element|null} The badge, or nothing when there is no version.
 */
export default function VersionBadge( {
	version,
	tone = 'on-brand',
	className,
} ) {
	if ( ! version ) {
		return null;
	}

	const label = String( version ).startsWith( 'v' )
		? String( version )
		: `v${ version }`;

	return (
		<span
			className={ [ 'lp-admin__version', `is-${ tone }`, className ]
				.filter( Boolean )
				.join( ' ' ) }
		>
			{ label }
		</span>
	);
}
