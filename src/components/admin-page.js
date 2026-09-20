/**
 * WordPress dependencies
 */
import { Page } from '@wordpress/admin-ui';

/**
 * Internal dependencies
 */
import VersionBadge from './version-badge';
import { useAdminContext } from '../context';

/**
 * A Linchpin admin screen's page header and body.
 *
 * This is a wrapper around core's `Page` from `@wordpress/admin-ui`, not a
 * reimplementation of it. `Page` already owns the full header — title,
 * subtitle, breadcrumbs, badges, actions and section navigation — and it is
 * the shape WordPress is standardising on, so a plugin that uses it inherits
 * every future improvement to admin page structure for free. Writing our own
 * masthead and tab strip, as three of our plugins each did, means inheriting
 * none of it.
 *
 * What this adds is only the Linchpin part: the title defaults to the plugin's
 * name, and the version appears as a badge unless the screen says otherwise.
 *
 * @param {Object}  props                Props.
 * @param {string}  [props.title]        Defaults to the frame's `plugin.name`.
 * @param {string}  [props.subTitle]     A sentence on what the screen does.
 * @param {Element} [props.breadcrumbs]  Usually core's `<Breadcrumbs />`.
 * @param {Element} [props.badges]       Defaults to the plugin's version badge. Pass `null` for none.
 * @param {Element} [props.visual]       A mark shown before the title. Decorative — `Page` hides it from assistive technology.
 * @param {Element} [props.actions]      Buttons, right-aligned in the header.
 * @param {Object}  [props.navigation]   Section navigation: `{ items, currentHref, ariaLabel }`. See `sectionNavigation()`.
 * @param {number}  [props.headingLevel] Heading level for the title. Defaults to `Page`'s own.
 * @param {boolean} [props.hasPadding]   Let `Page` pad the body. Off, because the frame's shell already provides the gutter.
 * @param {Object}  [props.components]   Component overrides, e.g. a router `link`.
 * @param {string}  [props.className]    Extra class names.
 * @param {Element} props.children       The body.
 * @return {Element} The page.
 */
export default function LinchpinAdminPage( {
	title,
	badges,
	className,
	children,
	...props
} ) {
	const { plugin } = useAdminContext();

	const resolvedBadges =
		badges === undefined ? (
			<VersionBadge version={ plugin?.version } tone="neutral" />
		) : (
			badges
		);

	return (
		<Page
			className={ [ 'lp-admin__page', className ]
				.filter( Boolean )
				.join( ' ' ) }
			title={ title ?? plugin?.name }
			badges={ resolvedBadges }
			{ ...props }
		>
			{ children }
		</Page>
	);
}
