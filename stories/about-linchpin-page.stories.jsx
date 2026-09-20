/**
 * Internal dependencies
 */
import {
	AboutLinchpinPage,
	defineBrand,
	LinchpinAdminFrame,
	LinchpinAdminMasthead,
	LinchpinAdminTopBar,
} from '@linchpinagency/ui';

const BRAND = defineBrand( { primary: '#318873', deep: '#082318', deepEnd: '#164a3b' } );

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
 * @param {Object} props      Props.
 * @param {Object} props.plugin Identity.
 * @return {Element} The page in a frame.
 */
function Page( { plugin } ) {
	return (
		<LinchpinAdminFrame
			plugin={ plugin }
			brand={ BRAND }
			topBar={ <LinchpinAdminTopBar /> }
		>
			<LinchpinAdminMasthead title="About" />
			<AboutLinchpinPage />
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
		<Page plugin={ { name: 'Mantle', slug: 'mantle', version: '2.22.1' } } />
	),
};
