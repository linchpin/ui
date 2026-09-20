/**
 * Internal dependencies
 */
import { LinchpinLogo } from '@linchpinagency/ui';

/**
 * The Linchpin logo, in the two forms the brand uses: the full lockup, and
 * the mark on its own. Colour comes from custom properties — `--lp-logo-ink`
 * and `--lp-logo-accent`, defaulting to Linchpin blue and the brand cyan — so
 * a host recolours the logo without touching the component.
 */
export default {
	title: 'Brand/Logo',
	component: LinchpinLogo,
	parameters: { layout: 'centered' },
};

export const FullLockup = {
	name: 'Full lockup',
	render: () => (
		<div style={ { height: '48px' } }>
			<LinchpinLogo variant="full" title="Linchpin" />
		</div>
	),
};

export const Mark = {
	render: () => (
		<div style={ { height: '64px' } }>
			<LinchpinLogo variant="mark" title="Linchpin" />
		</div>
	),
};

export const Mono = {
	name: 'Mono, on a brand surface',
	render: () => (
		<div
			style={ {
				background: '#082318',
				color: '#fff',
				padding: '24px',
				height: '32px',
			} }
		>
			<LinchpinLogo tone="mono" title="Linchpin" />
		</div>
	),
};

export const Recoloured = {
	name: 'Recoloured by a host',
	render: () => (
		<div
			style={ {
				height: '48px',
				'--lp-logo-ink': '#6d3efb',
				'--lp-logo-accent': '#ffd60a',
			} }
		>
			<LinchpinLogo title="Linchpin" />
		</div>
	),
};
