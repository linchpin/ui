/**
 * WordPress dependencies
 */
import { Icon, Text } from '@wordpress/ui';

/**
 * What something does, as a list: each line an icon, a name and a sentence.
 *
 * Plain on purpose. No card around it and no tile around each line, so it
 * sits on a page or inside a card without putting a surface inside a surface
 * -- the bordered tile grid a welcome screen reaches for is exactly that.
 * `columns` lays the lines out in a grid that fills the width it is given.
 *
 * `<FeatureListCard>` is the short, single-column explainer for a sidebar;
 * this is the same idea for the page.
 *
 * @param {Object}  props                Props.
 * @param {Array}   props.items          `[ { key, icon, title, text } ]`. `icon` from `@wordpress/icons` or an element; `title` is optional.
 * @param {boolean} [props.columns]      Lay the lines out in columns. Defaults to one column.
 * @param {number}  [props.headingLevel] Heading level of each title. Defaults to 3.
 * @param {string}  [props.className]    Extra class names.
 * @return {Element} The list.
 */
export default function FeatureList( {
	items = [],
	columns = false,
	headingLevel = 3,
	className,
} ) {
	const Heading = `h${ headingLevel }`;

	return (
		<ul
			className={ [
				'lp-admin__feature-list',
				columns && 'is-columns',
				className,
			]
				.filter( Boolean )
				.join( ' ' ) }
		>
			{ items.map( ( item, index ) => (
				<li key={ item.key ?? index } className="lp-admin__feature">
					{ item.icon && (
						<span
							className="lp-admin__feature-icon"
							aria-hidden="true"
						>
							<Icon icon={ item.icon } size={ 20 } />
						</span>
					) }
					<span className="lp-admin__feature-body">
						{ item.title && (
							<Text
								variant="body-md"
								render={ <Heading /> }
								className="lp-admin__feature-title"
							>
								{ item.title }
							</Text>
						) }
						{ item.text && (
							<Text
								variant="body-sm"
								className="lp-admin__feature-text"
							>
								{ item.text }
							</Text>
						) }
					</span>
				</li>
			) ) }
		</ul>
	);
}
