/**
 * WordPress dependencies
 */
import { Page } from '@wordpress/admin-ui';

/**
 * Internal dependencies
 */
import VersionBadge from './version-badge';
import { useAdminContext } from '../context';
import { useAdminLocation } from './admin-router';
import {
	PageHeaderContext,
	SectionLink,
	usePageHeaderState,
} from './page-header';
import { sectionNavigation } from '../utils/navigation';

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
 * It also lets the screen inside reach the header. `<PageHeaderActions>`,
 * `<PageHeaderBadges>` and `<PageHeaderSubTitle>`, rendered anywhere in the
 * body, land in the header, and `usePageSections()` puts the screen's sections
 * there as tabs. Whatever the page is given directly comes first.
 *
 * It also flips one of core's defaults. `Page` ships `hasPadding={ false }`
 * while padding its own header, so a screen that accepts the default gets an
 * indented title above a body flush against the panel edge, and a tab strip
 * with the first card jammed under it. Padding the body is what the header
 * already assumes, so that is the default here; a screen that renders its own
 * full-bleed surface — a table, a data view — passes `false`. The stylesheet
 * brings core's 24px inline padding on both back to `--lp-admin-gutter`, so
 * the screen has one inset rather than the chrome's and core's together.
 *
 * @param {Object}  props                Props.
 * @param {string}  [props.title]        Defaults to the frame's `plugin.name`. Pass `null` for none — a screen whose breadcrumbs carry the heading.
 * @param {string}  [props.subTitle]     A sentence on what the screen does. A `<PageHeaderSubTitle>` in the body replaces it.
 * @param {Element} [props.breadcrumbs]  Usually core's `<Breadcrumbs />`.
 * @param {Element} [props.badges]       Defaults to the plugin's version badge. Pass `null` for none. `<PageHeaderBadges>` follow it.
 * @param {Element} [props.visual]       A mark shown before the title. Decorative — `Page` hides it from assistive technology.
 * @param {Element} [props.actions]      Buttons, right-aligned in the header. `<PageHeaderActions>` follow them.
 * @param {Object}  [props.navigation]   Section navigation: `{ items, currentHref, ariaLabel }`. See `sectionNavigation()`. Wins over sections a screen registers.
 * @param {number}  [props.headingLevel] Heading level for the title. Defaults to `Page`'s own.
 * @param {boolean} [props.hasPadding]   Let `Page` pad the body. On, unlike core's default — see below.
 * @param {Object}  [props.components]   Component overrides. `link` defaults to one that routes section tabs in place.
 * @param {string}  [props.className]    Extra class names.
 * @param {Element} props.children       The body.
 * @return {Element} The page.
 */
export default function LinchpinAdminPage( {
	title,
	badges,
	subTitle,
	actions,
	navigation,
	components,
	className,
	hasPadding = true,
	children,
	...props
} ) {
	const { plugin } = useAdminContext();
	const location = useAdminLocation();
	const header = usePageHeaderState();

	// `undefined` means "you decide"; `null` means "none". Same contract as
	// `badges`, so a screen suppresses either one the same way.
	const resolvedTitle = title === undefined ? plugin?.name : title;

	const givenBadges =
		badges === undefined ? (
			<VersionBadge version={ plugin?.version } tone="neutral" />
		) : (
			badges
		);

	const sections = header.sections;
	const resolvedNavigation =
		navigation ??
		( sections
			? sectionNavigation( {
					sections: sections.items,
					current: sections.current,
					queryArg: sections.queryArg,
					ariaLabel: sections.ariaLabel,
					location,
				} )
			: undefined );

	return (
		<PageHeaderContext.Provider value={ header.value }>
			<Page
				className={ [ 'lp-admin__page', className ]
					.filter( Boolean )
					.join( ' ' ) }
				title={ resolvedTitle }
				badges={ withFill( givenBadges, header.targets.badges ) }
				subTitle={ header.targets.subTitle ?? subTitle }
				actions={ withFill( actions, header.targets.actions ) }
				navigation={ resolvedNavigation }
				components={ { link: SectionLink, ...components } }
				hasPadding={ hasPadding }
				{ ...props }
			>
				{ children }
			</Page>
		</PageHeaderContext.Provider>
	);
}

/**
 * What the page was given for a header area, followed by the screen's fills.
 *
 * @param {Element|null} given  The prop.
 * @param {Element|null} target The fill target, when a screen fills the area.
 * @return {Element|null} The area's content, or nothing when both are empty.
 */
function withFill( given, target ) {
	if ( ! target ) {
		return given;
	}

	return given ? (
		<>
			{ given }
			{ target }
		</>
	) : (
		target
	);
}
