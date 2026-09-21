/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { colorVar } from '../brand/colors';
import { LOCKUP, MARK } from './logo-artwork';

const VARIANTS = { full: LOCKUP, mark: MARK };

/*
 * The brand file's four styles, plus one of ours.
 *
 * Every style shares one set of geometry and differs only in how the two
 * groups are filled — which is why the artwork is stored once. `primary` and
 * `on-dark` keep the ring in Linchpin blue; `white` and `black` are the
 * single-colour treatments for a surface that cannot carry it.
 *
 * `mono` is not in the brand file. It paints in `currentColor`, which is what
 * the top bar needs: the logo then takes the colour of the bar it sits on,
 * whatever a plugin has coloured that, instead of guessing between white and
 * black on its behalf.
 */
const TONES = {
	primary: { ink: colorVar( 'black' ), accent: colorVar( 'blue' ) },
	'on-dark': { ink: colorVar( 'onBrand' ), accent: colorVar( 'blue' ) },
	white: { ink: colorVar( 'onBrand' ), accent: colorVar( 'onBrand' ) },
	black: { ink: colorVar( 'black' ), accent: colorVar( 'black' ) },
	mono: { ink: 'currentColor', accent: 'currentColor' },
};

/**
 * The Linchpin logo.
 *
 * Two variants, matching the brand: `full` is the lockup — wordmark plus mark
 * — and `mark` is the brandmark alone, for somewhere too tight for the
 * lockup.
 *
 * Colour never comes from a hex here, and it never comes from the host
 * either. Each tone resolves to the agency palette's own custom properties,
 * and there is deliberately no `--lp-logo-ink` / `--lp-logo-accent` pair to
 * paint over them with. The logo identifies Linchpin; a site that recolours
 * it is misattributing our work, and an escape hatch we ship is one we have
 * endorsed. A screen that needs the mark in a single colour asks for the
 * `white` or `black` tone, which the brand actually defines.
 *
 * The artwork is generated from the brand file by `scripts/import-logo.mjs`.
 * When the brand changes, re-export and re-run it rather than editing paths.
 *
 * @param {Object}  props              Props.
 * @param {string}  [props.variant]    `full` (default) or `mark`.
 * @param {string}  [props.tone]       `primary` (default), `on-dark`, `white`, `black` or `mono`.
 * @param {string}  [props.className]  Extra class names.
 * @param {string}  [props.title]      Accessible name. Omit for a decorative mark.
 * @param {boolean} [props.decorative] Hide from assistive technology. Defaults to true when there is no title.
 * @return {Element} The logo.
 */
export default function LinchpinLogo( {
	variant = 'full',
	tone = 'primary',
	className,
	title,
	decorative,
	...props
} ) {
	const artwork = VARIANTS[ variant ] ?? VARIANTS.full;
	const colors = TONES[ tone ] ?? TONES.primary;
	const isDecorative = decorative ?? ! title;

	const { ink, accent } = colors;

	return (
		<svg
			className={ [ 'lp-logo', `is-${ variant }`, className ]
				.filter( Boolean )
				.join( ' ' ) }
			viewBox={ artwork.viewBox }
			xmlns="http://www.w3.org/2000/svg"
			role={ isDecorative ? undefined : 'img' }
			aria-hidden={ isDecorative ? 'true' : undefined }
			aria-label={ isDecorative ? undefined : title || __( 'Linchpin' ) }
			focusable="false"
			{ ...props }
		>
			{ artwork.ink.map( ( d ) => (
				<path key={ d.slice( 0, 16 ) } d={ d } fill={ ink } />
			) ) }
			{ artwork.accent.map( ( d ) => (
				<path key={ d.slice( 0, 16 ) } d={ d } fill={ accent } />
			) ) }
		</svg>
	);
}
