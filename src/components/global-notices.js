/**
 * WordPress dependencies
 */
import { Children, useCallback, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import LinchpinNotice from './notice';

/**
 * Read the ids dismissed in this session.
 *
 * @param {string} storageKey Where they are kept.
 * @return {Object<string, boolean>} Dismissed ids.
 */
function readDismissed( storageKey ) {
	try {
		return JSON.parse( window.sessionStorage.getItem( storageKey ) ) || {};
	} catch {
		// Private windows and blocked site data both throw. A banner that
		// cannot be remembered as dismissed is a far smaller problem than an
		// admin screen that fails to render.
		return {};
	}
}

/**
 * Which notices have been dismissed in this browser session.
 *
 * `sessionStorage`, deliberately: a global notice reports an unresolved
 * problem with the install, so "dismissed" means "I have read it, let me
 * work" rather than "never tell me again". It comes back on the next visit,
 * the way WordPress's own dismissible admin notices do.
 *
 * @param {string} [storageKey] Where to remember dismissals. Without one they last until the page reloads.
 * @return {{isDismissed: Function, dismiss: Function}} The check and the dismisser.
 */
export function useSessionDismissals( storageKey ) {
	const [ dismissed, setDismissed ] = useState( () =>
		storageKey ? readDismissed( storageKey ) : {}
	);

	const dismiss = useCallback(
		( id ) =>
			setDismissed( ( current ) => {
				const next = { ...current, [ id ]: true };

				if ( storageKey ) {
					try {
						window.sessionStorage.setItem(
							storageKey,
							JSON.stringify( next )
						);
					} catch {
						// Remembered for this render tree only; see readDismissed().
					}
				}

				return next;
			} ),
		[ storageKey ]
	);

	const isDismissed = useCallback(
		( id ) => Boolean( dismissed[ id ] ),
		[ dismissed ]
	);

	return { isDismissed, dismiss };
}

/**
 * The strip of install-wide banners under a plugin's top bar.
 *
 * A fact about the whole install (the site is disconnected, the licence has
 * lapsed) is stated once, here, in front of every screen, rather than by each
 * screen that happens to depend on it. Each one is a `LinchpinNotice` banner:
 * the mark on the left, the actions in the right-hand column beside the
 * dismiss button.
 *
 * Renders nothing at all when there is nothing to say, so the top bar meets
 * the screen below it exactly as it would without the strip.
 *
 * @param {Object}  props              Props.
 * @param {Array}   [props.notices]    `[ { id, title, message, tone, actions, icon, dismissible, dismissLabel } ]`. `tone` defaults to `warning`, `dismissible` to true.
 * @param {string}  [props.storageKey] `sessionStorage` key for dismissals, e.g. `mantle-dismissed-global-notices`.
 * @param {Element} [props.children]   More banners, e.g. a plugin's slot fills, after its own.
 * @param {string}  [props.className]  Extra class names.
 * @return {Element|null} The strip, or nothing.
 */
export default function LinchpinGlobalNotices( {
	notices = [],
	storageKey,
	children,
	className,
} ) {
	const { isDismissed, dismiss } = useSessionDismissals( storageKey );

	const shown = notices.filter(
		( notice ) => notice && ! isDismissed( notice.id )
	);
	const extra = Children.toArray( children );

	if ( ! shown.length && ! extra.length ) {
		return null;
	}

	return (
		<div
			className={ [ 'lp-admin__global-notices', className ]
				.filter( Boolean )
				.join( ' ' ) }
		>
			{ shown.map(
				( {
					id,
					title,
					message,
					tone = 'warning',
					actions,
					icon,
					dismissible = true,
					dismissLabel,
				} ) => (
					<LinchpinNotice
						key={ id }
						variant="banner"
						surface="tinted"
						tone={ tone }
						icon={ icon }
						title={ title }
						actions={ actions }
						onDismiss={
							dismissible ? () => dismiss( id ) : undefined
						}
						dismissLabel={ dismissLabel }
					>
						{ message }
					</LinchpinNotice>
				)
			) }
			{ extra }
		</div>
	);
}
