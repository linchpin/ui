/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import { Button } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import {
	LinchpinAdminFrame,
	LinchpinAdminPage,
	MenuButton,
	PageHeaderActions,
	PageHeaderBadges,
} from '@linchpinagency/ui';

const PLUGIN = { name: 'Mantle', slug: 'mantle', version: '4.0.0' };

const DURATIONS = [
	{ value: 15, label: 'For 15 minutes' },
	{ value: 60, label: 'For 1 hour' },
	{ value: 240, label: 'For 4 hours' },
	{ type: 'separator' },
	{ value: 0, label: 'Until I stop it' },
];

// A plugin passes `Badge` from `@wordpress/ui` here.
const PILL = {
	background: 'var(--wpds-color-background-surface-neutral-weak, #f0f0f0)',
	borderRadius: '999px',
	fontSize: '11px',
	fontWeight: 500,
	padding: '2px 8px',
};

/**
 * One decision with a few answers, as one button. The explanation the choice
 * needs sits at the top of the menu, where the choice is made.
 */
export default {
	title: 'Chrome/Menu button',
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
 * Declutter's recording control: pick a duration from the header; while
 * recording, the same place offers Stop.
 *
 * @return {Element} The screen.
 */
function Recorder() {
	const [ until, setUntil ] = useState( null );

	const start = ( minutes ) =>
		setUntil(
			minutes
				? new Date( Date.now() + minutes * 60000 ).toLocaleTimeString(
						[],
						{ hour: 'numeric', minute: '2-digit' }
					)
				: 'you stop it'
		);

	return (
		<>
			<PageHeaderBadges>
				<span style={ PILL }>
					{ until ? `Recording until ${ until }` : 'Not recording' }
				</span>
			</PageHeaderBadges>
			<PageHeaderActions>
				{ until ? (
					<Button
						variant="outline"
						onClick={ () => setUntil( null ) }
					>
						Stop recording
					</Button>
				) : (
					<MenuButton
						label="Start recording"
						description="Recording watches every admin page load, which costs a little each time. Run it long enough to visit the screens you want catalogued."
						options={ DURATIONS }
						onSelect={ start }
					/>
				) }
			</PageHeaderActions>
			<p>The admin inventory table goes here.</p>
		</>
	);
}

export const InPageHeader = {
	name: 'In a page header',
	render: () => (
		<LinchpinAdminPage
			title="Declutter"
			badges={ null }
			showSidebarToggle={ false }
		>
			<Recorder />
		</LinchpinAdminPage>
	),
};
