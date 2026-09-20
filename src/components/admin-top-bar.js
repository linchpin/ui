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
 * The arrangement is the one mantle, psst and linchpin-blocks each arrived at
 * separately. The gradient comes from `--lp-brand-deep` and
 * `--lp-brand-deep-end`, so a plugin recolours it through `defineBrand()`
 * rather than through a stylesheet override.
 *
 * @param {Object}  props             Props.
 * @param {Element} [props.logo]      The plugin's own mark. Falls back to its name as text.
 * @param {string}  [props.version]   Defaults to the frame's `plugin.version`.
 * @param {boolean} [props.status]    Show the platform status dot. Off by default.
 * @param {Element} [props.children]  Extra content, right-aligned before the Linchpin mark.
 * @param {string}  [props.className] Extra class names.
 * @return {Element} The top bar.
 */
export default function LinchpinAdminTopBar( {
	logo,
	version,
	status = false,
	children,
	className,
} ) {
	const { plugin, links } = useAdminContext();
	const { status: platformStatus, label } = usePlatformStatus( status );
	const resolvedVersion = version ?? plugin?.version;

	return (
		<div
			className={ [ 'lp-admin__topbar', className ]
				.filter( Boolean )
				.join( ' ' ) }
		>
			<div className="lp-admin__topbar-brand">
				{ logo ?? (
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
					<LinchpinLogo />
				</a>
			</div>
		</div>
	);
}
