/**
 * Internal dependencies
 */
import { LinchpinLogo } from '@linchpinagency/ui';

/**
 * The Linchpin logo, generated from the brand file by
 * `scripts/import-logo.mjs`. Two variants — the full lockup and the brandmark
 * — and the brand's four tones plus a `mono` one for surfaces whose colour
 * the logo should simply inherit.
 *
 * Every tone resolves to `--lp-color-*`; `--lp-logo-ink` and
 * `--lp-logo-accent` override either half.
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
	render: () => <Pair tone="white" surface="#031E1E" />,
};

export const Black = {
	render: () => <Pair tone="black" />,
};

export const Mono = {
	name: 'Mono — inherits the surrounding colour',
	render: () => (
		<div style={ { color: '#6d3efb' } }>
			<Pair tone="mono" />
		</div>
	),
};

export const Recoloured = {
	name: 'Recoloured by a host',
	render: () => (
		<div
			style={ {
				'--lp-logo-ink': '#6d3efb',
				'--lp-logo-accent': '#ffd60a',
			} }
		>
			<Pair tone="primary" />
		</div>
	),
};
