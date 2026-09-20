/**
 * The agency copy, in exactly one place.
 *
 * `<AboutLinchpinPage>` and `<AboutLinchpinCard>` render this and nothing else
 * — there is no prop for replacing the wording. That is the point of the
 * component: the copy is marketing, it will be revised, and a revision should
 * reach every plugin through a version bump rather than through one pull
 * request per repository. The moment a plugin forks the wording, the page
 * stops being a standard and becomes a default.
 *
 * A plugin contributes its own name, which is interpolated, and nothing else.
 *
 * Strings use the default text domain deliberately. A shared package cannot
 * know the text domain of the plugin bundling it, and inventing one would ask
 * every consumer to register and ship translations for a domain they do not
 * own. See docs/ui/development/internationalization.md.
 */

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * The one-paragraph version, for the sidebar card.
 *
 * @param {string} name The plugin's display name.
 * @return {string} The blurb.
 */
export function aboutBlurb( name ) {
	return sprintf(
		/* translators: %s: plugin name. */
		__(
			'%s is designed, built and maintained by Linchpin, a digital agency that plans, builds and looks after WordPress platforms for organizations that need them to just work.'
		),
		name
	);
}

/**
 * The standard About Linchpin page.
 *
 * @param {string} name The plugin's display name.
 * @return {Object} Title, paragraphs, what-we-do list and calls to action.
 */
export function aboutPageCopy( name ) {
	return {
		title: __( 'About Linchpin' ),
		lead: aboutBlurb( name ),
		paragraphs: [
			__(
				'We have been building on WordPress since 2008, for universities, health and human services organizations, membership bodies and the companies that serve them. The work runs from a single campaign site to a multisite network with a decade of content behind it.'
			),
			__(
				'Plugins like this one come out of that client work. When something we build for one organization turns out to be useful to all of them, it becomes a product we maintain, document and support rather than a snippet buried in a theme.'
			),
		],
		whatWeDo: [
			__( 'Strategy, design and accessibility for WordPress platforms' ),
			__( 'Custom theme, block and plugin development' ),
			__( 'Migrations, performance work and ongoing maintenance' ),
			__( 'Support retainers with a named team, not a ticket queue' ),
		],
		cta: __( 'Work with Linchpin' ),
		contact: __( 'Talk to a human' ),
	};
}
