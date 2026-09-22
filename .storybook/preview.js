/**
 * WordPress dependencies
 */
import '@wordpress/components/build-style/style.css';
import '@wordpress/theme/design-tokens.css';

/**
 * Internal dependencies
 */
import '../src/chrome.scss';
import './wp-admin.css';

/** @type {import('@storybook/react-vite').Preview} */
const preview = {
	parameters: {
		layout: 'fullscreen',
		controls: { expanded: true },
	},
};

export default preview;
