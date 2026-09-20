/**
 * WordPress dependencies
 */
import { Card, CardBody, Icon } from '@wordpress/components';

/**
 * An explainer card: a short list of what this thing does, each line with an
 * icon. Psst's "How a secret travels" is the shape.
 *
 * @param {Object} props             Props.
 * @param {string} props.title       Card heading.
 * @param {Array}  props.items       `[ { icon, text } ]`, icons from `@wordpress/icons`.
 * @param {string} [props.className] Extra class names.
 * @return {Element} The card.
 */
export default function FeatureListCard( { title, items = [], className } ) {
	return (
		<Card
			className={ [ 'lp-admin__aside-card', className ]
				.filter( Boolean )
				.join( ' ' ) }
			size="small"
		>
			<CardBody>
				{ title && (
					<h2 className="lp-admin__aside-title">{ title }</h2>
				) }
				<ul className="lp-admin__aside-list">
					{ items.map( ( item, index ) => (
						<li key={ item.key ?? index }>
							{ item.icon && (
								<span
									className="lp-admin__aside-icon"
									aria-hidden="true"
								>
									<Icon icon={ item.icon } size={ 20 } />
								</span>
							) }
							<span>{ item.text }</span>
						</li>
					) ) }
				</ul>
			</CardBody>
		</Card>
	);
}
