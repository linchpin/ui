/**
 * WordPress dependencies
 */
import { Button } from '@wordpress/components';

/**
 * Internal dependencies
 */
import {
	defineBrand,
	LinchpinAdminFrame,
	LinchpinAdminTopBar,
	LinchpinNotice,
} from '@linchpinagency/ui';

const PLUGIN = { name: 'Mantle', slug: 'mantle', version: '3.3.0' };

const MANTLE_BRAND = defineBrand( {
	primary: '#c900ae',
	deep: '#c900ae',
	deepEnd: '#7d58c6',
} );

/**
 * Mantle's mark, white, as a plugin passes its own to `icon`.
 *
 * @return {Element} The mark.
 */
const MantleMark = () => (
	<svg viewBox="0 0 298.94 331.59" xmlns="http://www.w3.org/2000/svg">
		<g fill="#fff">
			<polygon
				opacity="0.7"
				points="149.48 208.42 0.03 171.06 0.03 223.72 149.48 261.08 298.94 223.72 298.94 171.06 149.48 208.42"
			/>
			<polygon points="149.48 137.77 0.03 100.41 0.03 153.07 149.48 190.43 298.94 153.07 298.94 100.41 149.48 137.77" />
			<polygon
				opacity="0.4"
				points="149.48 278.93 0.03 241.56 0.03 294.22 149.48 331.59 298.94 294.22 298.94 241.56 149.48 278.93"
			/>
			<polygon points="219.31 16.49 217.6 18.11 221.98 22.89 210.27 33.94 217.55 33.94 202.98 48.51 213.58 48.51 178.48 84.93 198.35 79.63 132.79 134.6 112.26 158.44 160.6 177.64 298.89 100.38 219.31 16.49" />
			<polygon
				opacity="0.6"
				points="90.3 1.66 94.05 5.08 89.48 11.58 95.49 12.49 93.89 18.86 98.7 17.04 85.47 35.25 99.5 50.28 138.36 62.11 112.72 92.62 108.9 117.73 99.85 125.67 0 100.43 90.3 1.66"
			/>
		</g>
	</svg>
);

/**
 * One shape for every message a Linchpin plugin raises.
 *
 * The plugin's mark on a brand tile, the content beside it, and the actions
 * in a column of their own on the right. Every part of the content is
 * optional — eyebrow, title, status chip, body — so a notice says what it has
 * to and no more. Tone is a chip, and on a tinted surface the background.
 *
 * The stories render inside a frame so the tile takes the brand. Outside one,
 * as a PHP `admin_notices` notice, the same markup takes Linchpin's palette
 * unless the plugin sets `--lp-brand-*` on it.
 */
export default {
	title: 'Chrome/Notice',
	component: LinchpinNotice,
	parameters: { layout: 'padded' },
	decorators: [
		( Story, { parameters } ) => (
			<div className="sb-wpcontent">
				<LinchpinAdminFrame
					plugin={ PLUGIN }
					brand={ parameters.brand }
				>
					<div
						style={ {
							maxWidth: '1100px',
							padding: '24px 20px 24px 0',
							display: 'grid',
							gap: '16px',
						} }
					>
						<Story />
					</div>
				</LinchpinAdminFrame>
			</div>
		),
	],
};

/**
 * A title and the detail, the call to action in its own column. The title
 * already names Linchpin, so there is no eyebrow saying it again.
 */
export const WithAction = {
	render: () => (
		<LinchpinNotice
			title="Linchpin can handle these updates for you"
			actions={
				<Button variant="primary" __next40pxDefaultSize>
					Ask Linchpin to handle it
				</Button>
			}
			onDismiss={ () => {} }
		>
			If this site is covered by an active support package with Linchpin,
			we keep your plugins up to date for you — each update is tested
			before it is applied. If you would rather not update it yourself, we
			are happy to handle it.
		</LinchpinNotice>
	),
};

/**
 * The strip under a plugin's top bar: full bleed, tinted by its tone.
 */
export const TintedBanner = {
	decorators: [
		( Story ) => (
			<div className="sb-wpcontent">
				<LinchpinAdminFrame
					plugin={ PLUGIN }
					brand={ MANTLE_BRAND }
					topBar={ <LinchpinAdminTopBar /> }
				>
					<Story />
				</LinchpinAdminFrame>
			</div>
		),
	],
	render: () => (
		<LinchpinNotice
			variant="banner"
			surface="tinted"
			tone="warning"
			icon={ <MantleMark /> }
			title="Mantle is not connected to the API"
			actions={
				<Button variant="primary" __next40pxDefaultSize>
					Reconnect this site
				</Button>
			}
			onDismiss={ () => {} }
		>
			Monitoring, client information, plugin reporting and licensing rely
			on the Linchpin API, and are switched off until this site
			reconnects.
		</LinchpinNotice>
	),
};

/**
 * A question with a few answers. The answers are the actions, stacked in the
 * right-hand column; the situation reads down the left.
 */
export const Question = {
	parameters: { brand: MANTLE_BRAND },
	render: () => (
		<LinchpinNotice
			icon={ <MantleMark /> }
			tone="warning"
			title="Mantle is treating this install as a copy"
			status="Needs an answer"
			actions={
				<>
					<Button variant="primary" __next40pxDefaultSize>
						This is the live site
					</Button>
					<Button variant="secondary" __next40pxDefaultSize>
						This is a clone — register it
					</Button>
					<Button variant="tertiary" __next40pxDefaultSize>
						This is a clone — leave it
					</Button>
				</>
			}
		>
			<p>
				<code>127.0.0.1</code> is recorded as a copy of{ ' ' }
				<code>alias.example.com</code>. Its settings are kept, and it
				will not change anything the original owns.
			</p>
			<p>
				While that is set, Linchpin SSO is off here and nothing is
				reported to Linchpin. Which is true?
			</p>
		</LinchpinNotice>
	),
};

/**
 * One line, with a chip and no title: the sentence says everything.
 */
export const OneLine = {
	render: () => (
		<>
			<LinchpinNotice tone="warning" status="Needs attention">
				The MCP server is switched on, but it needs the MCP Adapter
				plugin, version 0.7.0 or newer, and that plugin is not active.
			</LinchpinNotice>
			<LinchpinNotice tone="error" status="Action needed">
				External requests are blocked, so this plugin cannot receive
				updates. Add api.linchpin.com to WP_ACCESSIBLE_HOSTS.
			</LinchpinNotice>
			<LinchpinNotice tone="success" onDismiss={ () => {} }>
				Saved. This site is down as the live one.
			</LinchpinNotice>
		</>
	),
};

/**
 * An eyebrow is for when the title does not already say who is speaking.
 */
export const WithEyebrow = {
	render: () => (
		<LinchpinNotice
			eyebrow="Linchpin"
			title="3 plugins on this site are provided through your partnership"
			surface="tinted"
			actions={
				<Button variant="secondary" __next40pxDefaultSize>
					Browse plugins from Linchpin
				</Button>
			}
			onDismiss={ () => {} }
		>
			They are tagged with the Linchpin badge in the list below.
		</LinchpinNotice>
	),
};
