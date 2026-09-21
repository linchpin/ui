/**
 * Internal dependencies
 */
import {
	AboutLinchpinPage,
	defineBrand,
	LinchpinAdminFrame,
	LinchpinAdminPage,
	LinchpinAdminTopBar,
} from '@linchpinagency/ui';

/** Psst's own palette, for the story that shows the page inside a branded plugin. */
const PSST_BRAND = defineBrand( {
	primary: '#318873',
	deep: '#082318',
	deepEnd: '#164a3b',
} );

/**
 * The standard About page. Every plugin renders this same copy — only the
 * name in the first sentence changes, and it comes from the frame.
 */
export default {
	title: 'Chrome/About Linchpin page',
	parameters: { layout: 'fullscreen' },
	decorators: [
		( Story ) => (
			<div className="sb-wpcontent">
				<Story />
			</div>
		),
	],
};

/**
 * @param {Object} props         Props.
 * @param {Object} props.plugin  Identity.
 * @param {Object} [props.brand] The plugin's brand. Omit for Linchpin's own.
 * @return {Element} The page in a frame.
 */
function Page( { plugin, brand } ) {
	return (
		<LinchpinAdminFrame
			plugin={ plugin }
			brand={ brand }
			topBar={ <LinchpinAdminTopBar /> }
		>
			<LinchpinAdminPage title="About" badges={ null }>
				<AboutLinchpinPage />
			</LinchpinAdminPage>
		</LinchpinAdminFrame>
	);
}

export const Default = {
	render: () => (
		<Page plugin={ { name: 'Psst', slug: 'psst', version: '2.1.0' } } />
	),
};

export const InAnotherPlugin = {
	name: 'In another plugin',
	render: () => (
		<Page
			plugin={ { name: 'Mantle', slug: 'mantle', version: '2.22.1' } }
		/>
	),
};

/**
 * The same page, unchanged, inside a plugin that has named its own colours.
 * The copy and the layout are the library's; only the chrome around them
 * moves.
 */
export const Branded = {
	name: 'Branded by the plugin (Psst)',
	render: () => (
		<Page
			plugin={ { name: 'Psst', slug: 'psst', version: '2.1.0' } }
			brand={ PSST_BRAND }
		/>
	),
};
