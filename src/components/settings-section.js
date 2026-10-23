/**
 * WordPress dependencies
 */
import { Card, Stack, Text } from '@wordpress/ui';

/**
 * One section of a settings screen: a heading, a sentence saying what the
 * section is for, and its controls.
 *
 * Flat by default. A settings screen sits on a page panel that is already a
 * surface, so a section is set apart by space and a rule rather than by a box
 * of its own; drawing every section as a card puts a card inside the page's
 * panel and indents every control twice. `surface="card"` is for the rare
 * section that sits among other things and has to read as one object.
 *
 * The heading is a real heading, an `h2` by default, which is right under
 * `LinchpinAdminPage`'s `h1`. A section given no title renders no header, and
 * one given no children renders no body, so a screen that hides a section's
 * controls is left with a heading rather than an empty padded box.
 *
 * Controls are stacked with the design system's large gap, so a field's help
 * text never touches the next field's label. Put fields straight in; don't
 * give them margins of their own.
 *
 * @param {Object}  props                Props.
 * @param {Element} [props.title]        The heading.
 * @param {Element} [props.description]  One sentence on what the section is for.
 * @param {number}  [props.headingLevel] Heading rank, 2 by default.
 * @param {Element} [props.actions]      Controls beside the heading, right-aligned.
 * @param {string}  [props.surface]      `none` (default) or `card`.
 * @param {Element} [props.children]     The controls.
 * @param {string}  [props.className]    Extra class names.
 * @return {Element} The section.
 */
export default function SettingsSection( {
	title,
	description,
	headingLevel = 2,
	actions,
	surface = 'none',
	children,
	className,
} ) {
	const Heading = `h${ headingLevel }`;
	const hasHeader = Boolean( title || description || actions );
	const hasBody = Boolean( children );
	const isCard = 'card' === surface;

	const classes = [
		'lp-admin__section',
		isCard ? 'is-card' : 'is-flat',
		className,
	]
		.filter( Boolean )
		.join( ' ' );

	const header = hasHeader && (
		<div className="lp-admin__section-header">
			<div className="lp-admin__section-heading">
				{ title && (
					<Text
						variant="heading-md"
						render={ <Heading /> }
						className="lp-admin__section-title"
					>
						{ title }
					</Text>
				) }
				{ description && (
					<Text
						variant="body-md"
						render={ <p /> }
						className="lp-admin__section-description"
					>
						{ description }
					</Text>
				) }
			</div>
			{ actions && (
				<div className="lp-admin__section-actions">{ actions }</div>
			) }
		</div>
	);

	const body = hasBody && (
		<Stack direction="column" gap="lg" className="lp-admin__section-body">
			{ children }
		</Stack>
	);

	if ( isCard ) {
		return (
			<Card.Root className={ classes }>
				{ header && <Card.Header>{ header }</Card.Header> }
				{ body && <Card.Content>{ body }</Card.Content> }
			</Card.Root>
		);
	}

	return (
		<div className={ classes }>
			{ header }
			{ body }
		</div>
	);
}
