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
	/** White, for ink on a dark one. See `onBrandFor()`. */
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

/**
 * The readable foreground for a brand-coloured surface.
 *
 * White is only the right ink on a *dark* bar. Linchpin blue reads as a
 * bright cyan, and white on it measures 2.15:1 — not text by any standard —
 * so a library that always painted the bar white would ship its own default
 * brand failing contrast. Rather than leave every plugin to discover that,
 * the brand measures its bar and picks between the palette's two
 * foregrounds; a plugin that disagrees names `onBrand` itself.
 *
 * Both gradient stops are measured, because the bar carries the plugin's
 * mark at one end and Linchpin's at the other, and the winner is whichever
 * foreground reads better against the worse of them. Anything this cannot
 * parse — a colour given as `rgb()`, a keyword, a custom property — leaves
 * white, which is what the bar had before and what a dark bar wants.
 *
 * @param {...string} surfaces Hex colours the foreground has to sit on.
 * @return {string} `onBrand` or `black`, from the palette.
 */
export function onBrandFor( ...surfaces ) {
	const measurable = surfaces
		.map( ( surface ) => luminance( surface ) )
		.filter( ( value ) => value !== null );

	if ( ! measurable.length ) {
		return LINCHPIN_COLORS.onBrand;
	}

	const worst = ( foreground ) =>
		Math.min(
			...measurable.map( ( surface ) =>
				contrast( luminance( foreground ), surface )
			)
		);

	return worst( LINCHPIN_COLORS.black ) > worst( LINCHPIN_COLORS.onBrand )
		? LINCHPIN_COLORS.black
		: LINCHPIN_COLORS.onBrand;
}

/**
 * WCAG 2's contrast ratio, from two relative luminances.
 *
 * @param {number} a One luminance.
 * @param {number} b The other.
 * @return {number} The ratio, between 1 and 21.
 */
function contrast( a, b ) {
	return ( Math.max( a, b ) + 0.05 ) / ( Math.min( a, b ) + 0.05 );
}

/**
 * WCAG 2's relative luminance.
 *
 * @param {string} color A hex colour, `#rgb` or `#rrggbb`.
 * @return {number|null} Its luminance, or `null` if that is not a hex colour.
 */
function luminance( color ) {
	const channels = parseHex( color );

	if ( ! channels ) {
		return null;
	}

	const [ r, g, b ] = channels.map( ( value ) => {
		const channel = value / 255;

		return channel <= 0.04045
			? channel / 12.92
			: ( ( channel + 0.055 ) / 1.055 ) ** 2.4;
	} );

	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * @param {string} color A hex colour, `#rgb` or `#rrggbb`.
 * @return {Array|null} Its channels as 0–255, or `null`.
 */
function parseHex( color ) {
	const match = /^#([\da-f]{3}|[\da-f]{6})$/i.exec( String( color ).trim() );

	if ( ! match ) {
		return null;
	}

	const hex =
		match[ 1 ].length === 3
			? match[ 1 ].replace( /./g, ( channel ) => channel + channel )
			: match[ 1 ];

	return [ 0, 2, 4 ].map( ( at ) => parseInt( hex.slice( at, at + 2 ), 16 ) );
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
