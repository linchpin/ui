/**
 * WordPress dependencies
 */
import { Card, CardBody, CardHeader } from '@wordpress/components';

/**
 * A section of a settings screen: a heading, a sentence saying what the
 * section is for, and the controls.
 *
 * The most-repeated shape on a settings screen, and one every plugin was
 * still building by hand out of a Card, a CardHeader holding an h2 and a p,
 * and a CardBody. It is a composition, not a new primitive: core's `Card`
 * draws it, and what this adds is the heading arrangement, an `actions` slot
 * and the spacing between controls in the body.
 *
 * `headingLevel` defaults to 2, which is right under `<LinchpinAdminPage>`'s
 * h1; a card nested under an h2 passes 3. A card given no children renders no
 * body, the way one given no title renders no header — a screen that hides a
 * section's controls is left with a heading, not an empty padded box.
 *
 * @param {Object}  props                Props.
 * @param {Element} [props.title]        The heading, as text or a node. Omit for a card with no header.
 * @param {string}  [props.description]  One sentence on what the section is for.
 * @param {number}  [props.headingLevel] Heading rank, 2 by default.
 * @param {Element} [props.actions]      Controls in the header, right-aligned.
 * @param {string}  [props.size]         Core `Card` size. Defaults to `Card`'s own.
 * @param {Element} [props.children]     The controls. Omit for a card with no body.
 * @param {string}  [props.className]    Extra class names.
 * @return {Element} The card.
 */
export default function SettingsCard( {
	title,
	description,
	headingLevel = 2,
	actions,
	size,
	children,
	className,
} ) {
	const Heading = `h${ headingLevel }`;
	const hasHeader = Boolean( title || description || actions );
	const hasBody = Boolean( children );

	return (
		<Card
			className={ [ 'lp-admin__settings-card', className ]
				.filter( Boolean )
				.join( ' ' ) }
			{ ...( size ? { size } : {} ) }
		>
			{ hasHeader && (
				<CardHeader>
					<div className="lp-admin__settings-card-heading">
						{ title && (
							<Heading className="lp-admin__settings-card-title">
								{ title }
							</Heading>
						) }
						{ description && (
							<p className="lp-admin__settings-card-description">
								{ description }
							</p>
						) }
					</div>
					{ actions && (
						<div className="lp-admin__settings-card-actions">
							{ actions }
						</div>
					) }
				</CardHeader>
			) }
			{ hasBody && <CardBody>{ children }</CardBody> }
		</Card>
	);
}
