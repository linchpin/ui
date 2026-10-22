/**
 * WordPress dependencies
 */
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { close } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import LinchpinLogo from './linchpin-logo';

const TONES = [ 'info', 'success', 'warning', 'error' ];

/**
 * A notice: the plugin's mark, what it has to say, and what to do about it.
 *
 * One shape for every message a Linchpin plugin raises, in its own screens
 * and in wp-admin's notice area alike. The mark sits on a brand tile on the
 * left; the content sits beside it; the actions get a column of their own on
 * the right, dropping beneath the content when the notice is too narrow for
 * one.
 *
 * Every part of the content is optional. `eyebrow` names who is speaking,
 * `title` states the point, `status` is a chip saying how much it matters, and
 * the children are the detail. Give only what the notice needs: a title that
 * already says "Linchpin can handle these updates" has no use for a
 * "Linchpin" eyebrow above it.
 *
 * The same markup can be rendered from PHP for `admin_notices` — see
 * `notice.scss` for the contract — so a plugin's notices look the same on
 * screens its bundle never loads on.
 *
 * Nothing is announced. A notice present when a screen renders is read with
 * the screen; one that appears later because of something the user did should
 * be a snackbar from `core/notices`, which `<LinchpinNotices>` renders.
 *
 * @param {Object}         props                Props.
 * @param {Element|false}  [props.icon]         Mark on the tile. Defaults to the Linchpin mark; `false` for no tile.
 * @param {Element|string} [props.eyebrow]      Who is speaking, above the title.
 * @param {Element|string} [props.title]        The point of the notice.
 * @param {number}         [props.headingLevel] Render the title as `h1`–`h6` rather than a paragraph.
 * @param {Element|string} [props.status]       Chip beside the title, e.g. "Needs an answer".
 * @param {string}         [props.tone]         `info` (default), `success`, `warning` or `error`.
 * @param {string}         [props.surface]      `plain` (default), or `tinted` to take the tone's background.
 * @param {string}         [props.variant]      `card` (default), or `banner` for a full-bleed strip.
 * @param {Element}        [props.actions]      Buttons, in the right-hand column.
 * @param {Function}       [props.onDismiss]    Shows a dismiss button that calls this.
 * @param {string}         [props.dismissLabel] Accessible name of the dismiss button.
 * @param {Element}        [props.children]     The detail.
 * @param {string}         [props.className]    Extra class names.
 * @return {Element} The notice.
 */
export default function LinchpinNotice( {
	icon,
	eyebrow,
	title,
	headingLevel,
	status,
	tone = 'info',
	surface = 'plain',
	variant = 'card',
	actions,
	onDismiss,
	dismissLabel,
	children,
	className,
	...props
} ) {
	const resolvedTone = TONES.includes( tone ) ? tone : 'info';
	const mark =
		icon === undefined ? <LinchpinLogo variant="mark" tone="mono" /> : icon;
	const Title =
		headingLevel >= 1 && headingLevel <= 6 ? `h${ headingLevel }` : 'p';

	return (
		<div
			className={ [
				'lp-notice',
				'banner' === variant ? 'is-banner' : 'is-card',
				`is-tone-${ resolvedTone }`,
				'tinted' === surface && 'is-tinted',
				onDismiss && 'has-dismiss',
				className,
			]
				.filter( Boolean )
				.join( ' ' ) }
			{ ...props }
		>
			<div className="lp-notice__inner">
				{ mark && (
					<span className="lp-notice__icon" aria-hidden="true">
						{ mark }
					</span>
				) }
				<div className="lp-notice__content">
					{ eyebrow && (
						<p className="lp-notice__eyebrow">{ eyebrow }</p>
					) }
					{ ( title || status ) && (
						<div className="lp-notice__heading">
							{ title && (
								<Title className="lp-notice__title">
									{ title }
								</Title>
							) }
							{ status && (
								<span className="lp-notice__status">
									{ status }
								</span>
							) }
						</div>
					) }
					{ children && (
						<div className="lp-notice__body">{ children }</div>
					) }
				</div>
				{ actions && (
					<div className="lp-notice__actions">{ actions }</div>
				) }
			</div>
			{ onDismiss && (
				<Button
					className="lp-notice__dismiss"
					icon={ close }
					label={ dismissLabel ?? __( 'Dismiss this notice' ) }
					size="small"
					onClick={ onDismiss }
				/>
			) }
		</div>
	);
}
