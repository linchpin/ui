/**
 * Section navigation for a settings screen, in the shape core's `Page` wants.
 *
 * `Page`'s navigation is a list of links, not tab state — which is the right
 * model for wp-admin, because a section should be linkable, bookmarkable and
 * survive a save. Every plugin that rolled its own tabs then wrote the same
 * twenty lines to read the section out of the query string and put it back.
 * This builds the links instead.
 */

/**
 * Build a `navigation` config from a screen's sections.
 *
 * Each section becomes a link to the current page with one query argument
 * changed, so the rest of the URL — `page`, a post ID, a filter — survives.
 *
 * @param {Object}   options             Options.
 * @param {Array}    options.sections    `[ { name, label } ]` in display order.
 * @param {string}   [options.queryArg]  Query argument to vary. Defaults to `tab`.
 * @param {string}   [options.current]   Force the current section. Defaults to the URL's, then the first section.
 * @param {string}   [options.ariaLabel] Label for the navigation landmark.
 * @param {Location} [options.location]  Injectable for tests. Defaults to `window.location`.
 * @return {Object} `{ items, currentHref, ariaLabel }` for `<LinchpinAdminPage navigation>`.
 */
export function sectionNavigation( {
	sections = [],
	queryArg = 'tab',
	current,
	ariaLabel,
	location = typeof window === 'undefined' ? undefined : window.location,
} = {} ) {
	const pathname = location?.pathname ?? '';
	const search = location?.search ?? '';

	const href = ( name ) => {
		const params = new URLSearchParams( search );
		params.set( queryArg, name );

		return `${ pathname }?${ params.toString() }`;
	};

	const requested = new URLSearchParams( search ).get( queryArg );
	const known = sections.some( ( section ) => section.name === requested );
	const active = current ?? ( known ? requested : sections[ 0 ]?.name );

	return {
		items: sections.map( ( section ) => ( {
			label: section.label,
			href: href( section.name ),
		} ) ),
		...( active ? { currentHref: href( active ) } : {} ),
		...( ariaLabel ? { ariaLabel } : {} ),
	};
}

/**
 * Which section the URL asks for, when it asks for one that exists.
 *
 * The companion to `sectionNavigation()`: that builds the links, this tells a
 * screen which one to render.
 *
 * @param {Object}   options            Options.
 * @param {Array}    options.sections   `[ { name, label } ]`.
 * @param {string}   [options.queryArg] Query argument to read. Defaults to `tab`.
 * @param {Location} [options.location] Injectable for tests.
 * @return {string|undefined} The section name, or the first section's.
 */
export function currentSection( {
	sections = [],
	queryArg = 'tab',
	location = typeof window === 'undefined' ? undefined : window.location,
} = {} ) {
	const requested = new URLSearchParams( location?.search ?? '' ).get(
		queryArg
	);

	return sections.some( ( section ) => section.name === requested )
		? requested
		: sections[ 0 ]?.name;
}
