/**
 * WordPress dependencies
 */
import { Icon } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useAdminContext } from '../context';

/**
 * The vertical menu down the left of a screen with more than a few sections.
 *
 * Mantle's shape: a card of context at the top (who you are, which client),
 * the sections below it, and a slot at the bottom for a support card. A
 * plugin with three tabs does not need this — it passes `navigation` to
 * `<LinchpinAdminPage>` and gets a tab strip. A plugin with eight screens
 * does, and then the tab strip is still available *inside* a screen for its
 * subsections, which is exactly how Mantle's Security screen carries an
 * Admin/Frontend pair under a Security menu item.
 *
 * Three decisions carried over from Mantle, each of which was learned there:
 *
 * - **Links, not buttons.** These have real addresses, so they should be
 *   middle-clickable and copyable, and a Button is sized for an action, which
 *   made every row read heavier than the page it opens.
 * - **A bare `<a>`, not a design-system `Link`.** That component is built for
 *   inline text and draws its ring on `:focus` rather than `:focus-visible`,
 *   so clicking a row left the ring behind until you clicked something else.
 * - **`aria-current="page"` drives the active styling**, rather than a class
 *   that could drift out of step with what assistive technology is told.
 *
 * Every row may carry an icon, which is how Mantle's menu reads at a glance.
 * The plugin supplies the artwork — this is the agency's chrome, not an icon
 * set — and it arrives in whatever form the plugin has: an `@wordpress/icons`
 * export, a component of its own, or a dashicon name. Core's `<Icon>`
 * normalises the three and sizes the result, which a bare element does not do
 * for itself: an `@wordpress/icons` export is an `<svg viewBox>` with no
 * width, and a flex row gives that no space at all.
 *
 * The design system still has no vertical navigation component; when it grows
 * one, this is the file that changes.
 *
 * @param {Object}    props                 Props.
 * @param {Array}     props.items           `[ { name, label, href, icon, badge, disabled } ]`. `icon` is an `@wordpress/icons` export, a plugin's own component, or a dashicon name.
 * @param {string}    [props.current]       The active item's `name`. Falls back to matching `currentHref`.
 * @param {string}    [props.currentHref]   The active item's `href`.
 * @param {Function}  [props.onNavigate]    Called with `( name, event )` for in-app routing. Modifier-clicks are left to the browser.
 * @param {Component} [props.linkComponent] Rendered in place of `<a>`, e.g. a router link.
 * @param {Element}   [props.header]        Above the items — the client card in Mantle.
 * @param {Element}   [props.footer]        Below the items, pinned to the bottom.
 * @param {string}    [props.ariaLabel]     Names the landmark. Defaults to the plugin name.
 * @param {string}    [props.className]     Extra class names.
 * @return {Element} The menu.
 */
export default function LinchpinAdminNav( {
	items = [],
	current,
	currentHref,
	onNavigate,
	linkComponent: Link = 'a',
	header,
	footer,
	ariaLabel,
	className,
} ) {
	const { plugin } = useAdminContext();

	const isCurrent = ( item ) =>
		current !== undefined
			? item.name === current
			: item.href === currentHref;

	return (
		<nav
			className={ [ 'lp-admin__nav', className ]
				.filter( Boolean )
				.join( ' ' ) }
			aria-label={ ariaLabel ?? plugin?.name ?? __( 'Sections' ) }
		>
			{ header && <div className="lp-admin__nav-header">{ header }</div> }

			<ul className="lp-admin__nav-list">
				{ items.map( ( item ) => (
					<li key={ item.name ?? item.href }>
						<Link
							href={ item.href }
							className="lp-admin__nav-item"
							aria-current={
								isCurrent( item ) ? 'page' : undefined
							}
							aria-disabled={ item.disabled ? 'true' : undefined }
							onClick={ ( event ) =>
								handleClick( event, item, onNavigate )
							}
						>
							{ item.icon && (
								<span
									className="lp-admin__nav-icon"
									aria-hidden="true"
								>
									<Icon icon={ item.icon } size={ 24 } />
								</span>
							) }
							<span className="lp-admin__nav-label">
								{ item.label }
							</span>
							{ item.badge !== undefined && (
								<span className="lp-admin__nav-badge">
									{ item.badge }
								</span>
							) }
						</Link>
					</li>
				) ) }
			</ul>

			{ footer && <div className="lp-admin__nav-footer">{ footer }</div> }
		</nav>
	);
}

/**
 * Let the browser handle any click that means "open this somewhere else".
 *
 * A screen that routes in-app still has to leave ⌘-click, middle-click and
 * shift-click alone, or the address the row advertises becomes a lie.
 *
 * @param {Event}    event      The click.
 * @param {Object}   item       The item clicked.
 * @param {Function} onNavigate The screen's handler, if it has one.
 */
function handleClick( event, item, onNavigate ) {
	if ( item.disabled ) {
		event.preventDefault();
		return;
	}

	if ( ! onNavigate ) {
		return;
	}

	if (
		event.metaKey ||
		event.ctrlKey ||
		event.shiftKey ||
		event.altKey ||
		event.button === 1
	) {
		return;
	}

	event.preventDefault();
	onNavigate( item.name ?? item.href, event );
}
