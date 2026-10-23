/**
 * WordPress dependencies
 */
import { Card, Link } from '@wordpress/ui';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import LinchpinLogo from '../linchpin-logo';
import { aboutBlurb } from '../../copy';
import { useAdminContext } from '../../context';

/**
 * Who makes this.
 *
 * The short form of `<AboutLinchpinPage>`, and like that page it owns its
 * copy: there is no prop for the blurb. The plugin's name is interpolated
 * from the frame, and that is the only part that varies.
 *
 * @param {Object} props             Props.
 * @param {string} [props.className] Extra class names.
 * @return {Element} The card.
 */
export default function AboutLinchpinCard( { className } ) {
	const { plugin, links } = useAdminContext();

	return (
		<Card.Root
			className={ [ 'lp-admin__aside-card', className ]
				.filter( Boolean )
				.join( ' ' ) }
		>
			<Card.Content>
				<a
					className="lp-admin__aside-logo"
					href={ links?.linchpin }
					target="_blank"
					rel="noreferrer"
					aria-label={ __( 'Linchpin (opens in a new tab)' ) }
				>
					<LinchpinLogo tone="primary" />
				</a>
				<p>{ aboutBlurb( plugin?.name ) }</p>
				<Link href={ links?.linchpin } openInNewTab>
					{ __( 'Work with Linchpin' ) }
				</Link>
			</Card.Content>
		</Card.Root>
	);
}
