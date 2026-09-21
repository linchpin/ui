/**
 * WordPress dependencies
 */
import { lock, link, trash } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import {
	AboutLinchpinCard,
	FeatureListCard,
	HelpCard,
	LinchpinAdminFrame,
} from '@linchpinagency/ui';

const PLUGIN = { name: 'Psst', slug: 'psst', version: '2.1.0' };

export default {
	title: 'Chrome/Sidebar cards',
	decorators: [
		( Story ) => (
			<div className="sb-wpcontent">
				<LinchpinAdminFrame plugin={ PLUGIN }>
					<div
						className="lp-admin__aside"
						style={ { maxWidth: '300px', paddingTop: '24px' } }
					>
						<Story />
					</div>
				</LinchpinAdminFrame>
			</div>
		),
	],
};

export const Help = {
	render: () => <HelpCard />,
};

export const FeatureList = {
	name: 'Feature list',
	render: () => (
		<FeatureListCard
			title="How a secret travels"
			items={ [
				{ icon: lock, text: 'Encrypted in the sender’s browser.' },
				{ icon: link, text: 'The key rides in the link’s #fragment.' },
				{ icon: trash, text: 'Revealed once, then destroyed.' },
			] }
		/>
	),
};

export const AboutLinchpin = {
	name: 'About Linchpin',
	render: () => <AboutLinchpinCard />,
};
