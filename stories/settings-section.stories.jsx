/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import { Button, RadioGroupControl, SwitchControl } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import {
	LinchpinAdminFrame,
	LinchpinAdminPage,
	LinchpinNotices,
	PageSaveAction,
	SettingsSection,
} from '@linchpinagency/ui';

const PLUGIN = { name: 'Mantle', slug: 'mantle', version: '4.0.0' };

const PLACEMENTS = [
	{
		value: 'adminbar',
		label: 'Admin bar button',
		description: 'A button in the toolbar at the top of every screen.',
	},
	{
		value: 'floating',
		label: 'Corner button',
		description: 'A round button in the bottom corner.',
	},
	{
		value: 'askbar',
		label: 'Ask bar',
		description: 'A question bar along the foot of every admin screen.',
	},
];

const SAVED = { chat: false, placement: 'adminbar' };

/**
 * A settings screen on the page contract: sections straight on the page,
 * set apart by space and a rule, with the one Save in the header.
 */
export default {
	title: 'Chrome/Settings section',
	decorators: [
		( Story ) => (
			<div className="sb-wpcontent">
				<LinchpinAdminFrame plugin={ PLUGIN }>
					<div className="lp-admin__main">
						<Story />
					</div>
					<LinchpinNotices />
				</LinchpinAdminFrame>
			</div>
		),
	],
};

/**
 * Mantle's Communication screen.
 *
 * @return {Element} The screen.
 */
function Communication() {
	const [ saved, setSaved ] = useState( SAVED );
	const [ values, setValues ] = useState( SAVED );
	const set = ( key ) => ( value ) =>
		setValues( ( current ) => ( { ...current, [ key ]: value } ) );

	return (
		<LinchpinAdminPage
			title="Communication"
			badges={ null }
			subTitle="How this site's team reaches Linchpin without leaving WordPress."
			showSidebarToggle={ false }
		>
			<PageSaveAction
				isDirty={
					values.chat !== saved.chat ||
					values.placement !== saved.placement
				}
				onSave={ () =>
					new Promise( ( resolve ) =>
						setTimeout( () => {
							setSaved( values );
							resolve();
						}, 600 )
					)
				}
			/>

			<SettingsSection
				title="Team chat"
				description="Chat with the Linchpin team in Slack from the admin."
			>
				<SwitchControl
					label="Enable team chat"
					description={
						values.chat
							? 'On. Administrators see the team chat in the chat window.'
							: 'Off. Nobody on this site sees the team chat.'
					}
					checked={ values.chat }
					onCheckedChange={ set( 'chat' ) }
				/>
			</SettingsSection>

			<SettingsSection
				title="Chat window"
				description="Where people open the assistant and the team chat. Each person can change this on their profile."
			>
				<RadioGroupControl
					label="Open the chat from"
					items={ PLACEMENTS }
					value={ values.placement }
					onValueChange={ set( 'placement' ) }
				/>
			</SettingsSection>

			<SettingsSection
				title="Slack channel"
				description="The channel this site's conversations go to."
				actions={ <Button variant="outline">Change channel</Button> }
			/>
		</LinchpinAdminPage>
	);
}

export const SettingsScreen = {
	name: 'A settings screen',
	render: () => <Communication />,
};
