/**
 * WordPress dependencies
 */
import { SlotFillProvider } from '@wordpress/components';
import { useMemo } from '@wordpress/element';
import { ThemeProvider } from '@wordpress/theme';

/**
 * Internal dependencies
 */
import { AdminContext } from '../context';
import { brandStyle, defineBrand } from '../brand/define-brand';
import { colorVars } from '../brand/colors';
import { linchpinLinks } from '../brand/links';

/**
 * The root of a Linchpin admin screen.
 *
 * Three jobs, all of which every plugin was doing for itself:
 *
 * 1. Seed the design system from the plugin's own brand rather than the
 *    WordPress admin colour scheme. The top bar is a fixed brand gradient, so
 *    following the user's profile colour would put a stranger's accent
 *    directly beneath it. `isRoot` hoists the resolved tokens to the document
 *    so snackbars and popovers portalled out of this tree read the same
 *    values — which also means exactly one frame may exist per document.
 * 2. Publish identity, brand and links on context, so the rest of the chrome
 *    stops taking the same props at every level, and set both the agency
 *    palette (`--lp-color-*`) and the plugin's brand (`--lp-brand-*`) as
 *    custom properties, so nothing below has to carry a hex value.
 * 3. Undo wp-admin's `#wpcontent` padding, so the brand bar runs edge to edge,
 *    then restore the gutter inside the shell. Pass the bar as `topBar` rather
 *    than as a child: it is the one element that must sit outside the gutter,
 *    and having the frame place it is what keeps that trick in one file
 *    instead of in every plugin's stylesheet.
 *
 * @param {Object}  props                Props.
 * @param {Object}  props.plugin         Identity: `{ name, slug, version, logo }`.
 * @param {Object}  [props.brand]        A brand from `defineBrand()`.
 * @param {Object}  [props.links]        Links from `linchpinLinks()`. Derived from the slug when omitted.
 * @param {Element} [props.topBar]       Usually a `<LinchpinAdminTopBar />`. Rendered edge to edge.
 * @param {string}  [props.cornerRadius] Design system corner radius. Defaults to `subtle`.
 * @param {boolean} [props.isRoot]       Hoist resolved tokens to the document. Defaults to `true`.
 * @param {string}  [props.className]    Extra class names.
 * @param {Element} props.children       The screen.
 * @return {Element} The frame.
 */
export default function LinchpinAdminFrame( {
	plugin,
	brand,
	links,
	topBar,
	cornerRadius = 'subtle',
	isRoot = true,
	className,
	children,
} ) {
	if ( ! plugin?.slug ) {
		throw new Error(
			'LinchpinAdminFrame: plugin.slug is required — it identifies the screen and seeds every UTM link.'
		);
	}

	const resolved = useMemo( () => {
		const nextBrand = brand ?? defineBrand();

		return {
			plugin,
			brand: nextBrand,
			links: links ?? linchpinLinks( { plugin: plugin.slug } ),
			style: { ...colorVars(), ...brandStyle( nextBrand ) },
		};
	}, [ plugin, brand, links ] );

	const classes = [ 'lp-admin', className ].filter( Boolean ).join( ' ' );

	return (
		<ThemeProvider
			isRoot={ isRoot }
			color={ { primary: resolved.brand.primary } }
			cornerRadius={ cornerRadius }
		>
			<SlotFillProvider>
				<AdminContext.Provider value={ resolved }>
					<div className={ classes } style={ resolved.style }>
						{ topBar }
						<div className="lp-admin__shell">{ children }</div>
					</div>
				</AdminContext.Provider>
			</SlotFillProvider>
		</ThemeProvider>
	);
}
