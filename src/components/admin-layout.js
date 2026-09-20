/**
 * The body of an admin screen: the work on the left, the help column on the
 * right, one column once there is no room for two.
 *
 * @param {Object}  props             Props.
 * @param {Element} [props.sidebar]   The aside. Omit it for a full-width screen.
 * @param {string}  [props.label]     Accessible name for the aside.
 * @param {Element} props.children    The main column.
 * @param {string}  [props.className] Extra class names.
 * @return {Element} The layout.
 */
export default function LinchpinAdminLayout( {
	sidebar,
	label,
	children,
	className,
} ) {
	const classes = [
		'lp-admin__body',
		sidebar ? 'has-sidebar' : 'is-full-width',
		className,
	]
		.filter( Boolean )
		.join( ' ' );

	return (
		<div className={ classes }>
			<main className="lp-admin__main">{ children }</main>
			{ sidebar && (
				<aside className="lp-admin__aside" aria-label={ label }>
					{ sidebar }
				</aside>
			) }
		</div>
	);
}
