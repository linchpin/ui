/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import LinchpinLogo from './linchpin-logo';
import VersionBadge from './version-badge';
import usePlatformStatus from '../hooks/use-platform-status';
import { useAdminContext } from '../context';

/**
 * The brand bar above the page: the product on the left, Linchpin and the
 * version on the right.
 *
 * The plugin's logo is the normal case, not the exception — every one of our
 * plugins has a mark, and the bar is where it goes. Pass it as a node, or as
 * a URL for a file the plugin ships; the plugin's name is the fallback for a
 * plugin that genuinely has no artwork yet, not the default.
 *
 * The gradient comes from `--lp-brand-deep` and `--lp-brand-deep-end`, so a
 * plugin recolours it through `defineBrand()` rather than a stylesheet
 * override. The Linchpin mark paints in `currentColor` against it.
 *
 * @param {Object}         props             Props.
 * @param {Element|string} [props.logo]      The plugin's mark, or a URL to it. Defaults to the frame's `plugin.logo`.
 * @param {string}         [props.logoAlt]   Alternative text when `logo` is a URL. Defaults to the plugin name.
 * @param {string}         [props.version]   Defaults to the frame's `plugin.version`.
 * @param {boolean}        [props.status]    Show the platform status dot. Off by default.
 * @param {Element}        [props.children]  Extra content, before the Linchpin mark.
 * @param {string}         [props.className] Extra class names.
 * @return {Element} The top bar.
 */
export default function LinchpinAdminTopBar( {
	logo,
	logoAlt,
	version,
	status = false,
	children,
	className,
} ) {
	const { plugin, links } = useAdminContext();
	const { status: platformStatus, label } = usePlatformStatus( status );

	const resolvedLogo = logo ?? plugin?.logo;
	const resolvedVersion = version ?? plugin?.version;

	return (
		<div
			className={ [ 'lp-admin__topbar', className ]
				.filter( Boolean )
				.join( ' ' ) }
		>
			<div className="lp-admin__topbar-brand">
				{ renderLogo( resolvedLogo, logoAlt ?? plugin?.name ) ?? (
					<span className="lp-admin__topbar-name">
						{ plugin?.name }
					</span>
				) }
			</div>
			<div className="lp-admin__topbar-meta">
				{ children }
				{ status && (
					<span
						className={ `lp-admin__status is-${ platformStatus }` }
						title={ label }
					>
						<span
							className="lp-admin__status-dot"
							aria-hidden="true"
						/>
						<span className="screen-reader-text">{ label }</span>
					</span>
				) }
				<VersionBadge version={ resolvedVersion } />
				<a
					className="lp-admin__topbar-linchpin"
					href={ links?.linchpin }
					target="_blank"
					rel="noreferrer"
					aria-label={ __( 'Linchpin (opens in a new tab)' ) }
				>
					<LinchpinLogo tone="mono" />
				</a>
			</div>
		</div>
	);
}

/**
 * A logo passed as a node, or as a URL the plugin ships.
 *
 * @param {Element|string} logo The logo.
 * @param {string}         alt  Alternative text for the URL form.
 * @return {Element|null} The logo, or nothing.
 */
function renderLogo( logo, alt ) {
	if ( ! logo ) {
		return null;
	}

	if ( typeof logo === 'string' ) {
		return (
			<img className="lp-admin__topbar-logo" src={ logo } alt={ alt } />
		);
	}

	return logo;
}
