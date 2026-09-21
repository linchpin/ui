/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * A breadcrumb trail, as plain links.
 *
 * This is the one place the library reimplements something core already has,
 * and the reason is that core's version cannot run here. `Breadcrumbs` from
 * `@wordpress/admin-ui` renders every item through `@wordpress/route`, which
 * is TanStack Router — so each link calls `useRouter()`, gets `null` without a
 * `RouterProvider` above it, and the screen dies on
 * `Cannot read properties of null (reading 'stores')`. Core's component also
 * throws if any item but the last omits `to`, so there is no prop-shaped way
 * out of it.
 *
 * A wp-admin settings screen served from `admin.php?page=…` has no client
 * router, and asking every plugin to mount one so that a header can draw two
 * words and a slash is the wrong trade. These are ordinary links to ordinary
 * URLs, which is what wp-admin navigation is.
 *
 * The shape matches core's: everything before the last item is a link, and the
 * last is the current page. Pass it to `<LinchpinAdminPage breadcrumbs>`. A
 * screen that genuinely runs a router can pass core's component there instead
 * — the prop takes any node.
 *
 * `headingLevel` decides whether the trail carries the page heading. Core's
 * `Page` renders breadcrumbs beside the title rather than above it, so a
 * screen that shows both ends up saying the plugin's name twice; the usual
 * answer is `<LinchpinAdminPage title={ null }>` with `headingLevel={ 1 }`
 * here, which keeps the document's one `h1` where the reader's eye already
 * is. Leave it unset when the page has a title of its own.
 *
 * @param {Object}    props                 Props.
 * @param {Array}     props.items           `[ { label, href } ]`. The last item is the current page and needs no `href`.
 * @param {number}    [props.headingLevel]  Render the current item as this heading level. Off by default.
 * @param {Component} [props.linkComponent] Rendered in place of `<a>`, e.g. a router link.
 * @param {string}    [props.ariaLabel]     Names the landmark.
 * @param {string}    [props.className]     Extra class names.
 * @return {Element|null} The trail, or nothing when there is nothing to show.
 */
export default function LinchpinBreadcrumbs( {
	items = [],
	headingLevel,
	linkComponent: Link = 'a',
	ariaLabel,
	className,
} ) {
	if ( ! items.length ) {
		return null;
	}

	const last = items.length - 1;
	const Current = headingLevel ? `h${ headingLevel }` : 'span';

	return (
		<nav
			className={ [ 'lp-admin__breadcrumbs', className ]
				.filter( Boolean )
				.join( ' ' ) }
			aria-label={ ariaLabel ?? __( 'Breadcrumbs' ) }
		>
			<ol>
				{ items.map( ( item, index ) => (
					<li key={ item.href ?? item.label }>
						{ index === last || ! item.href ? (
							<Current
								className="lp-admin__breadcrumbs-current"
								aria-current={
									index === last ? 'page' : undefined
								}
							>
								{ item.label }
							</Current>
						) : (
							<Link href={ item.href }>{ item.label }</Link>
						) }
						{ index < last && (
							<span
								className="lp-admin__breadcrumbs-separator"
								aria-hidden="true"
							>
								/
							</span>
						) }
					</li>
				) ) }
			</ol>
		</nav>
	);
}
