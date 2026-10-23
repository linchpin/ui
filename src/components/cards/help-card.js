/**
 * WordPress dependencies
 */
import { ButtonLink, Card, Icon, Link } from '@wordpress/ui';
import { lifesaver } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useAdminContext } from '../../context';

/**
 * Where to get help.
 *
 * Unlike the About card, this one takes props: support routing genuinely
 * differs per plugin. Psst points at GitHub issues, mantle opens the client
 * chat, a client-specific plugin may point at their own service desk. The
 * defaults cover the common case — email us, open an issue — and a plugin
 * replaces them by passing children.
 *
 * @param {Object}  props               Props.
 * @param {string}  [props.title]       Card heading.
 * @param {string}  [props.description] What to say above the buttons.
 * @param {Element} [props.children]    Replace the default actions entirely.
 * @param {string}  [props.className]   Extra class names.
 * @return {Element} The card.
 */
export default function HelpCard( {
	title,
	description,
	children,
	className,
} ) {
	const { links } = useAdminContext();

	return (
		<Card.Root
			className={ [ 'lp-admin__aside-card', className ]
				.filter( Boolean )
				.join( ' ' ) }
		>
			<Card.Content>
				<h2 className="lp-admin__aside-title">
					<Icon icon={ lifesaver } size={ 20 } />
					{ title ?? __( 'Need a hand?' ) }
				</h2>
				<p>
					{ description ??
						__(
							'Questions, ideas or a bug report? The Linchpin team reads every message.'
						) }
				</p>
				<div className="lp-admin__aside-actions">
					{ children ?? (
						<>
							<ButtonLink
								variant="outline"
								href={ links?.support }
							>
								{ links?.supportEmail }
							</ButtonLink>
							<Link href={ links?.issues } openInNewTab>
								{ __( 'Open an issue on GitHub' ) }
							</Link>
						</>
					) }
				</div>
			</Card.Content>
		</Card.Root>
	);
}
