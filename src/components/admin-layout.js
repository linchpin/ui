/**
 * The body of an admin screen.
 *
 * Up to three columns: the section menu on the left, the work in the middle,
 * the help column on the right. Most screens use one or two of them — a small
 * plugin has no menu, a dense screen has no room for a help column — and each
 * one that is absent is simply not rendered rather than left as an empty
 * track.
 *
 * Which of the two navigation levels a screen uses is a separate decision:
 * `nav` here is the top level (Mantle's Dashboard / Security / Tools), and
 * `<LinchpinAdminPage navigation>` is the tab strip for a screen's own
 * subsections. A screen may have both, which is what Mantle's Security screen
 * does with its Admin and Frontend tabs.
 *
 * @param {Object}  props             Props.
 * @param {Element} [props.nav]       The section menu, usually a `<LinchpinAdminNav />`.
 * @param {Element} [props.sidebar]   The aside. Omit for a screen with no help column.
 * @param {string}  [props.label]     Accessible name for the aside.
 * @param {Element} props.children    The main column.
 * @param {string}  [props.className] Extra class names.
 * @return {Element} The layout.
 */
export default function LinchpinAdminLayout( {
	nav,
	sidebar,
	label,
	children,
	className,
} ) {
	const classes = [
		'lp-admin__body',
		nav ? 'has-nav' : null,
		sidebar ? 'has-sidebar' : null,
		! nav && ! sidebar ? 'is-full-width' : null,
		className,
	]
		.filter( Boolean )
		.join( ' ' );

	return (
		<div className={ classes }>
			{ nav }
			<main className="lp-admin__main">{ children }</main>
			{ sidebar && (
				<aside className="lp-admin__aside" aria-label={ label }>
					{ sidebar }
				</aside>
			) }
		</div>
	);
}
