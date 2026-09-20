/**
 * WordPress dependencies
 */
import { TabPanel } from '@wordpress/components';

/**
 * Tabs that survive a reload.
 *
 * Every plugin that has tabs also wrote the same twenty lines to read the tab
 * out of the query string on mount and put it back on select, because a
 * settings screen that forgets which tab you were on when you hit save is
 * infuriating. That behaviour belongs here, not in each plugin.
 *
 * @param {Object}   props                  Props.
 * @param {Array}    props.tabs             `[ { name, title, className? } ]`, as `TabPanel` takes them.
 * @param {Function} props.children         Render function, called with the active tab.
 * @param {boolean}  [props.remember]       Keep the active tab in the URL. On by default.
 * @param {string}   [props.queryArg]       Query argument to use. Defaults to `tab`.
 * @param {string}   [props.initialTabName] Force the initial tab, ignoring the URL.
 * @param {Function} [props.onSelect]       Called with the tab name after ours.
 * @param {string}   [props.className]      Extra class names.
 * @return {Element} The tabs.
 */
export default function LinchpinAdminTabs( {
	tabs,
	children,
	remember = true,
	queryArg = 'tab',
	initialTabName,
	onSelect,
	className,
} ) {
	const initial =
		initialTabName ??
		( remember ? tabFromUrl( tabs, queryArg ) : undefined );

	const handleSelect = ( tabName ) => {
		if ( remember ) {
			rememberTab( tabName, queryArg );
		}

		onSelect?.( tabName );
	};

	return (
		<TabPanel
			className={ [ 'lp-admin__tabs', className ]
				.filter( Boolean )
				.join( ' ' ) }
			activeClass="is-active"
			tabs={ tabs }
			onSelect={ handleSelect }
			{ ...( initial ? { initialTabName: initial } : {} ) }
		>
			{ children }
		</TabPanel>
	);
}

/**
 * Which tab the URL asks for, when it asks for one we have.
 *
 * @param {Array}  tabs     The tabs.
 * @param {string} queryArg Query argument.
 * @return {string|undefined} A tab name, or nothing.
 */
export function tabFromUrl( tabs, queryArg = 'tab' ) {
	if ( typeof window === 'undefined' ) {
		return undefined;
	}

	const requested = new URLSearchParams( window.location.search ).get(
		queryArg
	);

	return tabs?.some( ( tab ) => tab.name === requested )
		? requested
		: undefined;
}

/**
 * Put the active tab in the URL without adding a history entry — the back
 * button should leave the screen, not walk back through the tabs.
 *
 * @param {string} tabName  The tab.
 * @param {string} queryArg Query argument.
 */
export function rememberTab( tabName, queryArg = 'tab' ) {
	if ( typeof window === 'undefined' ) {
		return;
	}

	const params = new URLSearchParams( window.location.search );
	params.set( queryArg, tabName );
	window.history.replaceState(
		null,
		'',
		`${ window.location.pathname }?${ params.toString() }`
	);
}
