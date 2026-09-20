/**
 * Linchpin's own colours, and the custom properties that carry them.
 *
 * These are the agency's brand — distinct from a *plugin's* brand, which is
 * whatever `defineBrand()` is given. A plugin that names nothing inherits
 * these, and the Linchpin logo always uses them.
 *
 * Values come from the linchpin.com palette (`themes/linchpin/theme.json`).
 * Nothing in the library may hardcode a colour: a component reaches for one of
 * these custom properties, a `--wpds-*` design token, or a `--lp-brand-*`
 * property the frame set from the plugin's brand.
 */

/**
 * The palette, as hex. One definition, referenced everywhere.
 */
export const LINCHPIN_COLORS = Object.freeze( {
	/** Linchpin blue. The default ink for the logo and the default brand seed. */
	blue: '#1B4475',
	/** The mark's accent. `primary` in the linchpin.com palette. */
	cyan: '#3fc1d0',
	/** Linchpin black, for ink on a light surface. */
	black: '#031e1e',
	/** Foreground on a brand-coloured surface, such as the top bar. */
	onBrand: '#ffffff',
	/** Platform status, used only by the opt-in status dot. */
	statusUp: '#4ade80',
	statusDown: '#f87171',
} );

/** @deprecated Use `LINCHPIN_COLORS.cyan`, or the `--lp-color-cyan` property. */
export const LINCHPIN_ACCENT = LINCHPIN_COLORS.cyan;

/**
 * The palette as `--lp-color-*` custom properties.
 *
 * `<LinchpinAdminFrame>` sets these alongside the plugin's own `--lp-brand-*`
 * properties, so a screen can reference the agency palette in its own CSS and
 * a host can override one of them in a single place.
 *
 * @return {Object} CSS custom properties keyed by name.
 */
export function colorVars() {
	return {
		'--lp-color-blue': LINCHPIN_COLORS.blue,
		'--lp-color-cyan': LINCHPIN_COLORS.cyan,
		'--lp-color-black': LINCHPIN_COLORS.black,
		'--lp-color-on-brand': LINCHPIN_COLORS.onBrand,
		'--lp-color-status-up': LINCHPIN_COLORS.statusUp,
		'--lp-color-status-down': LINCHPIN_COLORS.statusDown,
	};
}

/**
 * A `var()` reference with the palette value as its fallback.
 *
 * Components paint with these rather than with hex, so a host that sets
 * `--lp-color-blue` higher up recolours them, and a component rendered outside
 * a frame still has something to paint with.
 *
 * @param {string} name A key of `LINCHPIN_COLORS`.
 * @return {string} A CSS `var()` expression.
 */
export function colorVar( name ) {
	const property = {
		blue: '--lp-color-blue',
		cyan: '--lp-color-cyan',
		black: '--lp-color-black',
		onBrand: '--lp-color-on-brand',
		statusUp: '--lp-color-status-up',
		statusDown: '--lp-color-status-down',
	}[ name ];

	if ( ! property ) {
		throw new Error( `colorVar: unknown colour "${ name }".` );
	}

	return `var( ${ property }, ${ LINCHPIN_COLORS[ name ] } )`;
}
