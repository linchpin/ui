/**
 * WordPress dependencies
 */
import { Button, Card, CardBody, Icon } from '@wordpress/components';
import { check } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import LinchpinLogo from './linchpin-logo';
import { aboutPageCopy } from '../copy';
import { useAdminContext } from '../context';

/**
 * The standard About Linchpin page.
 *
 * Every Linchpin plugin renders this same page. There is no prop for the copy
 * and no slot for replacing a paragraph — see `src/copy.js` for why. A plugin
 * mounts it behind a tab or a submenu and passes nothing.
 *
 * @param {Object} props             Props.
 * @param {string} [props.className] Extra class names.
 * @return {Element} The page.
 */
export default function AboutLinchpinPage( { className } ) {
	const { plugin, links } = useAdminContext();
	const copy = aboutPageCopy( plugin?.name );

	return (
		<div
			className={ [ 'lp-admin__about', className ]
				.filter( Boolean )
				.join( ' ' ) }
		>
			<Card size="large">
				<CardBody>
					<a
						className="lp-admin__about-logo"
						href={ links?.linchpin }
						target="_blank"
						rel="noreferrer"
					>
						<LinchpinLogo variant="primary" title={ copy.title } />
					</a>

					<p className="lp-admin__about-lead">{ copy.lead }</p>

					{ copy.paragraphs.map( ( paragraph ) => (
						<p key={ paragraph.slice( 0, 24 ) }>{ paragraph }</p>
					) ) }

					<ul className="lp-admin__about-list">
						{ copy.whatWeDo.map( ( item ) => (
							<li key={ item }>
								<span
									className="lp-admin__about-check"
									aria-hidden="true"
								>
									<Icon icon={ check } size={ 20 } />
								</span>
								<span>{ item }</span>
							</li>
						) ) }
					</ul>

					<div className="lp-admin__about-actions">
						<Button
							__next40pxDefaultSize
							variant="primary"
							href={ links?.linchpin }
							target="_blank"
							rel="noreferrer"
						>
							{ copy.cta }
						</Button>
						<Button
							__next40pxDefaultSize
							variant="secondary"
							href={ links?.support }
						>
							{ copy.contact }
						</Button>
					</div>
				</CardBody>
			</Card>
		</div>
	);
}
