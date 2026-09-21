/**
 * Internal dependencies
 */
import { LinchpinLogo } from '@linchpinagency/ui';

/**
 * The Linchpin logo, generated from the brand file by
 * `scripts/import-logo.mjs`. Two variants — the full lockup and the brandmark
 * — in the four styles the brand defines.
 *
 * Colour is not a prop you can pass a value to, and there is no custom
 * property for painting over it. Pick the tone that suits the surface: the
 * two-colour pair on anything that can carry the ring, and the single-colour
 * pair where it cannot.
 */
export default {
	title: 'Brand/Logo',
	component: LinchpinLogo,
	parameters: { layout: 'centered' },
};

/**
 * @param {Object} props           Props.
 * @param {string} props.tone      The tone to show.
 * @param {string} [props.surface] Background to show it against.
 * @return {Element} Both variants in one tone.
 */
function Pair( { tone, surface = 'transparent' } ) {
	return (
		<div
			style={ {
				display: 'flex',
				alignItems: 'center',
				gap: '32px',
				padding: '24px',
				background: surface,
			} }
		>
			<div style={ { height: '40px' } }>
				<LinchpinLogo variant="full" tone={ tone } title="Linchpin" />
			</div>
			<div style={ { height: '56px' } }>
				<LinchpinLogo variant="mark" tone={ tone } title="Linchpin" />
			</div>
		</div>
	);
}

export const Primary = {
	name: 'Primary — black ink, Linchpin blue ring',
	render: () => <Pair tone="primary" />,
};

export const OnDark = {
	name: 'On dark — white ink, Linchpin blue ring',
	render: () => <Pair tone="on-dark" surface="#031E1E" />,
};

export const White = {
	name: 'Full white — for a surface that cannot carry the ring',
	render: () => <Pair tone="white" surface="#031E1E" />,
};

export const Black = {
	name: 'Full black — for a surface that cannot carry the ring',
	render: () => <Pair tone="black" />,
};
