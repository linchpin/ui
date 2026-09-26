/**
 * WordPress dependencies
 */
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const STATUS_ENDPOINT = 'https://status.linchpin.com/api/data';
const REFRESH_MS = 60000;

/**
 * Poll the Linchpin platform status page.
 *
 * Opt-in, because most plugins have no business making a cross-origin request
 * from wp-admin on every page load. Mantle does it because it is the plugin an
 * administrator opens when something looks wrong; a settings screen for a
 * single feature does not need to.
 *
 * A failed request reports `unknown` rather than `down` — we cannot tell a
 * platform outage from a blocked request, an offline laptop or a firewall, and
 * claiming an outage on that evidence would be worse than saying nothing.
 *
 * @param {boolean} enabled Whether to poll at all.
 * @return {{status: string, label: string}} Status and its accessible label.
 */
export default function usePlatformStatus( enabled = false ) {
	const [ status, setStatus ] = useState( enabled ? 'loading' : 'unknown' );

	useEffect( () => {
		if ( ! enabled ) {
			return undefined;
		}

		let cancelled = false;
		const controller = new AbortController();

		const read = async () => {
			try {
				const response = await fetch( STATUS_ENDPOINT, {
					signal: controller.signal,
					mode: 'cors',
				} );

				if ( ! response.ok ) {
					throw new Error( String( response.status ) );
				}

				const data = await response.json();

				if ( ! cancelled ) {
					setStatus( platformStatusFrom( data ) );
				}
			} catch ( error ) {
				if ( ! cancelled && error.name !== 'AbortError' ) {
					setStatus( 'unknown' );
				}
			}
		};

		read();
		const timer = setInterval( read, REFRESH_MS );

		return () => {
			cancelled = true;
			controller.abort();
			clearInterval( timer );
		};
	}, [ enabled ] );

	return { status, label: statusLabel( status ) };
}

/**
 * @param {string} status One of `up`, `down`, `loading`, `unknown`.
 * @return {string} An accessible label.
 */
/**
 * Read the status page's summary into one of `up`, `down` or `unknown`.
 *
 * The endpoint reports counts of monitors, `{ up, down, monitors, … }`, not a
 * status string. Any monitor down is `down`; a summary without a numeric
 * `down` is `unknown`, for the same reason a failed request is.
 *
 * @param {Object} data Parsed response from the status endpoint.
 * @return {string} `up`, `down` or `unknown`.
 */
export function platformStatusFrom( data ) {
	const down = data?.down;

	if ( typeof down !== 'number' || ! Number.isFinite( down ) ) {
		return 'unknown';
	}

	return down === 0 ? 'up' : 'down';
}

export function statusLabel( status ) {
	if ( status === 'up' ) {
		return __( 'All systems operational' );
	}

	if ( status === 'down' ) {
		return __( 'System issues reported' );
	}

	if ( status === 'loading' ) {
		return __( 'Checking system status' );
	}

	return __( 'System status unavailable' );
}
