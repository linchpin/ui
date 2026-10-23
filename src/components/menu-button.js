/**
 * WordPress dependencies
 */
import { useId } from '@wordpress/element';
import { chevronDown } from '@wordpress/icons';
import { Button, Menu } from '@wordpress/ui';

/**
 * A button that opens a menu of ways to do one thing.
 *
 * For a single decision with a few answers: record for 15 minutes, an hour or
 * until stopped; clear all caches or just one. Drawn as a row of sibling
 * buttons, those read as separate actions and push everything else in the
 * header around; as one button they read as the one choice they are.
 *
 * `description` is what the person needs to know to choose, such as what the
 * action costs. It sits at the top of the menu, where the choice is made,
 * and the menu is described by it, so a screen reader hears it on opening.
 *
 * @param {Object}   props               Props.
 * @param {Element}  props.label         The button's text, e.g. "Start recording".
 * @param {Array}    props.options       `[ { value, label, description, disabled } ]`, or `{ type: 'separator' }` between groups.
 * @param {Function} props.onSelect      Called with the chosen option's `value`.
 * @param {Element}  [props.description] What to know before choosing, at the top of the menu.
 * @param {string}   [props.variant]     `@wordpress/ui` Button variant. Defaults to `outline`.
 * @param {string}   [props.tone]        Button tone, `brand` (default) or `neutral`.
 * @param {string}   [props.size]        Button size.
 * @param {boolean}  [props.disabled]    Disable the button.
 * @param {string}   [props.className]   Extra class names on the button.
 * @return {Element} The button and its menu.
 */
export default function MenuButton( {
	label,
	options = [],
	onSelect,
	description,
	variant = 'outline',
	tone,
	size,
	disabled,
	className,
} ) {
	const descriptionId = useId();

	return (
		<Menu.Root>
			<Menu.Trigger
				disabled={ disabled }
				render={
					<Button
						variant={ variant }
						tone={ tone }
						size={ size }
						className={ [ 'lp-admin__menu-button', className ]
							.filter( Boolean )
							.join( ' ' ) }
					/>
				}
			>
				{ label }
				<Button.Icon icon={ chevronDown } />
			</Menu.Trigger>
			<Menu.Popup
				className="lp-admin__menu-button-popup"
				aria-describedby={ description ? descriptionId : undefined }
			>
				{ description && (
					<p
						id={ descriptionId }
						className="lp-admin__menu-button-description"
					>
						{ description }
					</p>
				) }
				{ options.map( ( option, index ) =>
					'separator' === option.type ? (
						<Menu.Separator key={ `separator-${ index }` } />
					) : (
						<Menu.Item
							key={ option.value }
							disabled={ option.disabled }
							onClick={ () => onSelect?.( option.value ) }
						>
							<Menu.ItemLabel>{ option.label }</Menu.ItemLabel>
							{ option.description && (
								<Menu.ItemDescription>
									{ option.description }
								</Menu.ItemDescription>
							) }
						</Menu.Item>
					)
				) }
			</Menu.Popup>
		</Menu.Root>
	);
}
