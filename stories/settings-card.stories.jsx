/**
 * WordPress dependencies
 */
import {
	Button,
	CheckboxControl,
	SelectControl,
	TextControl,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import { LinchpinAdminFrame, SettingsCard } from '@linchpinagency/ui';

const PLUGIN = { name: 'Psst', slug: 'psst', version: '2.2.0' };

/**
 * The section every settings screen is made of. Stacked in the main column
 * they space themselves, which is the other half of what the component is
 * for.
 */
export default {
	title: 'Chrome/Settings card',
	decorators: [
		( Story ) => (
			<div className="sb-wpcontent">
				<LinchpinAdminFrame plugin={ PLUGIN }>
					<div
						className="lp-admin__main"
						style={ { padding: '24px', maxWidth: '760px' } }
					>
						<Story />
					</div>
				</LinchpinAdminFrame>
			</div>
		),
	],
};

export const Default = {
	render: () => (
		<SettingsCard
			title="Expiration"
			description="Which lifetimes a sender may choose, and which is pre-selected."
		>
			<CheckboxControl
				__nextHasNoMarginBottom
				label="1 Week"
				checked
				onChange={ () => {} }
			/>
			<SelectControl
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				label="Default expiration"
				value="10080"
				options={ [ { value: '10080', label: '1 Week' } ] }
				onChange={ () => {} }
			/>
		</SettingsCard>
	),
};

export const WithActions = {
	name: 'With actions in the header',
	render: () => (
		<SettingsCard
			title="Pages"
			description="Both pages were created on activation and can be changed here."
			actions={
				<Button __next40pxDefaultSize variant="secondary">
					Create a new page
				</Button>
			}
		>
			<TextControl
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				label="Create page"
				value="Share a Secret"
				onChange={ () => {} }
			/>
		</SettingsCard>
	),
};

export const NoHeader = {
	name: 'Without a header',
	render: () => (
		<SettingsCard>
			<p>
				A card with nothing to put in a header renders none, rather than
				an empty bar above the body.
			</p>
		</SettingsCard>
	),
};

/** Two stacked, to show the gap they get from the main column. */
export const Stacked = {
	render: () => (
		<>
			<SettingsCard title="Limits" description="Size and rate limits.">
				<TextControl
					__next40pxDefaultSize
					__nextHasNoMarginBottom
					label="Maximum secret size (bytes)"
					value="32768"
					onChange={ () => {} }
				/>
			</SettingsCard>
			<SettingsCard
				title="Turnstile"
				description="Optional Cloudflare challenge on the create form."
			>
				<TextControl
					__next40pxDefaultSize
					__nextHasNoMarginBottom
					label="Site key"
					value=""
					onChange={ () => {} }
				/>
			</SettingsCard>
		</>
	),
};
