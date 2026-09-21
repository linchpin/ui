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
import { LINCHPIN_COLORS, onBrandFor } from './colors';

/**
 * The fallback palette: Linchpin's own, for a plugin that has no artwork yet.
 *
 * Both agency colours, each doing the job it is for. Linchpin blue is the bar
 * — it is the colour people recognise us by, and a banner is where a brand
 * colour belongs. Linchpin black seeds the design system, so the buttons, the
 * selected row and the links beneath the bar are ink rather than a second
 * helping of the same cyan competing with it.
 */
const DEFAULTS = Object.freeze( {
	primary: LINCHPIN_COLORS.black,
	deep: LINCHPIN_COLORS.blue,
	accent: LINCHPIN_COLORS.blue,

	/*
	 * White, named rather than measured.
	 *
	 * White on Linchpin blue is 2.15:1, which no contrast checker will pass,
	 * and the agency has looked at it and kept it: the bar carries the two
	 * marks and a version badge, all of them heavy enough to hold the colour,
	 * and the white lockup is how Linchpin signs its work. That is a decision
	 * about our own brand, which is why it is written here as one instead of
	 * quietly overriding what `onBrandFor()` would say.
	 */
	onBrand: LINCHPIN_COLORS.onBrand,
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
 * `onBrand` is the ink on that bar. A plugin that colours the bar and says
 * nothing about the ink has it measured — see `onBrandFor()` — because white
 * on a pale bar is not text, and that is a papercut no plugin should have to
 * find for itself. Naming it is how a brand overrules the measurement, as
 * Linchpin's own does above; it is not how a third colour gets in, because
 * white and Linchpin black are the two the palette has.
 *
 * Any other key becomes a custom property too, so a plugin may carry its own
 * vocabulary — `mint`, `violet` — and reach for it in its own stylesheet.
 *
 * @param {Object} input           The brand.
 * @param {string} [input.primary] Seed colour for the design system.
 * @param {string} [input.deep]    Top bar gradient start.
 * @param {string} [input.deepEnd] Top bar gradient end. Defaults to `deep`.
 * @param {string} [input.onBrand] Ink on the top bar. Measured from `deep` when a brand colours the bar without naming one.
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

	// A brand that coloured the bar and left the ink to us gets it measured.
	// The agency default names its own, above, and is left alone.
	if ( ( input.deep || input.deepEnd ) && ! input.onBrand ) {
		brand.onBrand = onBrandFor( brand.deep, brand.deepEnd );
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
