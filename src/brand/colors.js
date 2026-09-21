/**
 * Linchpin's own colours, and the custom properties that carry them.
 *
 * These are the agency's brand — distinct from a *plugin's* brand, which is
 * whatever `defineBrand()` is given. A plugin that names nothing inherits
 * these, and the Linchpin logo always uses them.
 *
 * Nothing in the library may hardcode a colour: a component reaches for one of
 * these custom properties, a `--wpds-*` design token, or a `--lp-brand-*`
 * property the frame set from the plugin's brand.
 */

/**
 * The palette, as hex. One definition, referenced everywhere.
 */
export const LINCHPIN_COLORS = Object.freeze( {
	/**
	 * Linchpin blue — the primary brand colour, and the mark's own.
	 *
	 * It reads as a cyan, and was briefly carried in this file under that
	 * name beside an invented navy. There is one blue, and this is it.
	 */
	blue: '#3FC1D0',
	/** Linchpin black, for ink on a light surface. */
	black: '#031E1E',
	/** Foreground on a brand-coloured surface, such as the top bar. */
	onBrand: '#FFFFFF',
	/** Platform status, used only by the opt-in status dot. */
	statusUp: '#4ADE80',
	statusDown: '#F87171',
} );

/**
 * The palette as `--lp-color-*` custom properties.
 *
 * `<LinchpinAdminFrame>` sets these alongside the plugin's own `--lp-brand-*`
 * properties, so a screen can reference the agency palette in its own CSS
 * rather than copying a hex out of this file. They are published for
 * reference, not as a recolouring hook: the frame writes them inline on its
 * own element, which is where the agency's colours are decided. A plugin that
 * wants a colour of its own names one in `defineBrand()`.
 *
 * @return {Object} CSS custom properties keyed by name.
 */
export function colorVars() {
	return {
		'--lp-color-blue': LINCHPIN_COLORS.blue,
		'--lp-color-black': LINCHPIN_COLORS.black,
		'--lp-color-on-brand': LINCHPIN_COLORS.onBrand,
		'--lp-color-status-up': LINCHPIN_COLORS.statusUp,
		'--lp-color-status-down': LINCHPIN_COLORS.statusDown,
	};
}

const PROPERTIES = {
	blue: '--lp-color-blue',
	black: '--lp-color-black',
	onBrand: '--lp-color-on-brand',
	statusUp: '--lp-color-status-up',
	statusDown: '--lp-color-status-down',
};

/**
 * A `var()` reference with the palette value as its fallback.
 *
 * Components paint with these rather than with hex, so the palette has one
 * definition and a component rendered outside a frame still has something to
 * paint with.
 *
 * @param {string} name A key of `LINCHPIN_COLORS`.
 * @return {string} A CSS `var()` expression.
 */
export function colorVar( name ) {
	const property = PROPERTIES[ name ];

	if ( ! property ) {
		throw new Error( `colorVar: unknown colour "${ name }".` );
	}

	return `var( ${ property }, ${ LINCHPIN_COLORS[ name ] } )`;
}
