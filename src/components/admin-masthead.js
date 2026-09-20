/**
 * Internal dependencies
 */
import { useAdminContext } from '../context';

/**
 * The page header: what this screen is, what it is for, and the places an
 * administrator most often wants to go next.
 *
 * Actions are children rather than props, so a screen composes whatever
 * buttons it needs instead of the component guessing at a vocabulary of
 * primary and secondary URLs.
 *
 * @param {Object}  props               Props.
 * @param {string}  [props.title]       Defaults to the frame's `plugin.name`.
 * @param {string}  [props.description] A sentence on what the screen does.
 * @param {Element} [props.children]    Actions.
 * @param {string}  [props.className]   Extra class names.
 * @return {Element} The masthead.
 */
export default function LinchpinAdminMasthead( {
	title,
	description,
	children,
	className,
} ) {
	const { plugin } = useAdminContext();

	return (
		<header
			className={ [ 'lp-admin__masthead', className ]
				.filter( Boolean )
				.join( ' ' ) }
		>
			<div className="lp-admin__masthead-copy">
				<h1 className="lp-admin__title">{ title ?? plugin?.name }</h1>
				{ description && (
					<p className="lp-admin__tagline">{ description }</p>
				) }
			</div>
			{ children && (
				<div className="lp-admin__masthead-actions">{ children }</div>
			) }
		</header>
	);
}
