/**
 * A plugin's brand, in one place.
 *
 * Every colour a Linchpin admin screen paints comes from one of two places: a
 * `--wpds-*` design token, or one of the `--lp-brand-*` custom properties this
 * module produces. No component carries a hex value of its own, so changing a
 * plugin's palette is a change to its `defineBrand()` call and nothing else.
 */

/**
 * Internal dependencies
 */
import { LINCHPIN_COLORS } from './colors';

/**
 * The fallback palette: Linchpin's own, for a plugin that has no artwork yet.
 * Linchpin blue seeds the design system; the mark keeps its cyan accent.
 */
const DEFAULTS = Object.freeze( {
	primary: LINCHPIN_COLORS.blue,
	deep: LINCHPIN_COLORS.black,
	accent: LINCHPIN_COLORS.cyan,
} );

/**
 * Describe a plugin's brand.
 *
 * `primary` seeds the design system: the `ThemeProvider` in
 * `<LinchpinAdminFrame>` derives every interactive colour ramp from it, which
 * is why a plugin only has to name one colour to look like itself.
 *
 * `deep` is the left stop of the top bar's gradient, and `deepEnd` the right
 * one. A brand that gives only `deep` gets a flat bar rather than a gradient
 * invented on its behalf.
 *
 * Any other key becomes a custom property too, so a plugin may carry its own
 * vocabulary — `mint`, `violet` — and reach for it in its own stylesheet.
 *
 * @param {Object} input           The brand.
 * @param {string} [input.primary] Seed colour for the design system.
 * @param {string} [input.deep]    Top bar gradient start.
 * @param {string} [input.deepEnd] Top bar gradient end. Defaults to `deep`.
 * @param {string} [input.accent]  Accent, for the Linchpin mark.
 * @return {Object} A frozen brand object.
 */
export function defineBrand( input = {} ) {
	const brand = { ...DEFAULTS, ...input };

	for ( const [ key, value ] of Object.entries( brand ) ) {
		if ( typeof value !== 'string' || value.trim() === '' ) {
			throw new Error(
				`defineBrand: "${ key }" must be a non-empty string, received ${ typeof value }.`
			);
		}
	}

	if ( ! brand.deepEnd ) {
		brand.deepEnd = brand.deep;
	}

	return Object.freeze( brand );
}

/**
 * The brand as `--lp-brand-*` custom properties, ready for a `style` prop.
 *
 * Keys are kebab-cased, so `deepEnd` reaches the stylesheet as
 * `--lp-brand-deep-end`.
 *
 * @param {Object} brand A brand from `defineBrand()`.
 * @return {Object} CSS custom properties keyed by name.
 */
export function brandStyle( brand = {} ) {
	return Object.fromEntries(
		Object.entries( brand ).map( ( [ name, value ] ) => [
			`--lp-brand-${ kebabCase( name ) }`,
			value,
		] )
	);
}

/**
 * @param {string} value A camelCase key.
 * @return {string} Its kebab-case form.
 */
function kebabCase( value ) {
	return value.replace( /([a-z0-9])([A-Z])/g, '$1-$2' ).toLowerCase();
}
