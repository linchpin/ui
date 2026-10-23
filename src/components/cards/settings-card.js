/**
 * Internal dependencies
 */
import SettingsSection from '../settings-section';

/**
 * A settings section drawn as a card.
 *
 * Kept so screens written against it go on working, and now an alias of
 * `<SettingsSection surface="card">`, which draws it with `@wordpress/ui`'s
 * `Card` so it matches the cards around it. New screens should use
 * `SettingsSection`, which is flat by default: a section on a page panel that
 * is already a surface does not need a box of its own.
 *
 * @deprecated Use `SettingsSection`, flat, or with `surface="card"`.
 *
 * @param {Object}  props                Props, as `SettingsSection` takes them.
 * @param {Element} [props.title]        The heading.
 * @param {string}  [props.description]  One sentence on what the section is for.
 * @param {number}  [props.headingLevel] Heading rank, 2 by default.
 * @param {Element} [props.actions]      Controls in the header, right-aligned.
 * @param {Element} [props.children]     The controls.
 * @param {string}  [props.className]    Extra class names.
 * @return {Element} The card.
 */
export default function SettingsCard( {
	title,
	description,
	headingLevel,
	actions,
	children,
	className,
} ) {
	return (
		<SettingsSection
			surface="card"
			title={ title }
			description={ description }
			headingLevel={ headingLevel }
			actions={ actions }
			className={ [ 'lp-admin__settings-card', className ]
				.filter( Boolean )
				.join( ' ' ) }
		>
			{ children }
		</SettingsSection>
	);
}
