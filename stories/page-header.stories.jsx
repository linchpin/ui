/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import { Button } from '@wordpress/components';

/**
 * Internal dependencies
 */
import {
	LinchpinAdminFrame,
	LinchpinAdminPage,
	PageHeaderActions,
	PageHeaderBadges,
	PageHeaderSubTitle,
	usePageSections,
} from '@linchpinagency/ui';

const PLUGIN = { name: 'Mantle', slug: 'mantle', version: '4.0.0' };

// A plugin passes `Badge` from `@wordpress/ui`; the library does not depend on it.
const PILL = {
	background: 'var(--wpds-color-background-surface-neutral-weak, #f0f0f0)',
	borderRadius: '999px',
	fontSize: '11px',
	fontWeight: 500,
	padding: '2px 8px',
};

const SECTIONS = [
	{ name: 'inventory', label: 'Admin inventory' },
	{ name: 'ignored', label: 'Ignored sources' },
];

/**
 * A screen reaching its page header from inside its own body: the verbs,
 * the status and the sections all live with the screen's state, and all of
 * them render in the header.
 */
export default {
	title: 'Chrome/Page header',
	decorators: [
		( Story ) => (
			<div className="sb-wpcontent">
				<LinchpinAdminFrame plugin={ PLUGIN }>
					<div className="lp-admin__main">
						<Story />
					</div>
				</LinchpinAdminFrame>
			</div>
		),
	],
};

/**
 * Declutter's screen: start and stop recording from the header, with the
 * state as a badge and the sections as tabs that switch in place.
 *
 * @return {Element} The screen.
 */
function Declutter() {
	const [ section, setSection ] = useState( 'inventory' );
	const [ recording, setRecording ] = useState( false );

	usePageSections( {
		sections: SECTIONS,
		current: section,
		onSelect: setSection,
	} );

	return (
		<>
			<PageHeaderBadges>
				<span style={ PILL }>
					{ recording ? 'Recording until 3:45 PM' : 'Not recording' }
				</span>
			</PageHeaderBadges>

			<PageHeaderActions>
				<Button
					variant="secondary"
					onClick={ () => setRecording( ! recording ) }
				>
					{ recording ? 'Stop recording' : 'Start recording' }
				</Button>
			</PageHeaderActions>

			{ recording && (
				<PageHeaderSubTitle>
					Recording. Browse the admin screens you want catalogued,
					then come back.
				</PageHeaderSubTitle>
			) }

			<p>
				{ 'inventory' === section
					? 'The admin inventory table goes here.'
					: 'The ignored sources table goes here.' }
			</p>
		</>
	);
}

export const ScreenOwnsItsHeader = {
	name: 'A screen filling its header',
	render: () => (
		<LinchpinAdminPage
			title="Declutter"
			badges={ null }
			subTitle="Everything plugins, themes and WordPress added to this site's admin."
			showSidebarToggle={ false }
		>
			<Declutter />
		</LinchpinAdminPage>
	),
};
