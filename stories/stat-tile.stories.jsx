/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { LinchpinAdminFrame, StatTile, StatTiles } from '@linchpinagency/ui';

const PLUGIN = { name: 'Governance', slug: 'linchpin-governing' };

/**
 * The row of counts above a list. Each tile is a filter, a link or a fact,
 * and the number's colour is its reading, not decoration.
 */
export default {
	title: 'Chrome/Stat tile',
	decorators: [
		( Story ) => (
			<div className="sb-wpcontent">
				<LinchpinAdminFrame plugin={ PLUGIN }>
					<div
						className="lp-admin__main"
						style={ { padding: '24px' } }
					>
						<Story />
					</div>
				</LinchpinAdminFrame>
			</div>
		),
	],
};

/**
 * @return {Element} Filter tiles over a list, one of them on.
 */
function Filters() {
	const [ filter, setFilter ] = useState( 'needs_update' );
	const toggle = ( name ) => () =>
		setFilter( ( current ) => ( current === name ? null : name ) );

	return (
		<StatTiles label="Site summary">
			<StatTile
				value={ 73 }
				label="Total sites"
				detail="20 clients · 11 not counted"
				onClick={ () => setFilter( null ) }
				isPressed={ filter === null }
			/>
			<StatTile
				value={ 39 }
				label="Needs updates"
				detail="151 pending updates"
				tone="warning"
				onClick={ toggle( 'needs_update' ) }
				isPressed={ filter === 'needs_update' }
			/>
			<StatTile
				value={ 3 }
				label="Security issues"
				detail="Sites on affected versions"
				tone="error"
				onClick={ toggle( 'security' ) }
				isPressed={ filter === 'security' }
			/>
			<StatTile
				value={ 23 }
				label="Command-capable"
				onClick={ toggle( 'command_capable' ) }
				isPressed={ filter === 'command_capable' }
			/>
		</StatTiles>
	);
}

export const AsFilters = {
	name: 'As filters',
	render: () => <Filters />,
};

export const AsLinks = {
	name: 'As links',
	render: () => (
		<StatTiles label="Fleet">
			<StatTile
				value={ 31 }
				label="Not reporting"
				detail="Showing last known inventory"
				tone="error"
				href="?page=sites&filter=not_reporting"
			/>
			<StatTile
				value={ 130 }
				label="Plugin updates"
				href="?page=packages&filter=needs_update"
			/>
			<StatTile
				value={ 0 }
				label="Commands in flight"
				detail="24 failed"
			/>
		</StatTiles>
	),
};

export const WithBreakdown = {
	name: 'With a breakdown',
	render: () => (
		<StatTiles label="Updates">
			<StatTile
				value={ 39 }
				label="Sites needing updates"
				detail="7 local not counted"
				tone="warning"
				href="?page=sites&filter=needs_update"
				footer={
					<>
						<a href="?page=sites&filter=needs_update,production">
							34 Production
						</a>
						<a href="?page=sites&filter=needs_update,staging">
							3 Staging
						</a>
					</>
				}
			/>
			<StatTile value={ 9 } label="Insecure WordPress" tone="error" />
		</StatTiles>
	),
};

export const Loading = {
	render: () => (
		<StatTiles label="Site summary">
			<StatTile value={ 73 } label="Total sites" isLoading />
			<StatTile value={ 39 } label="Needs updates" isLoading />
			<StatTile value={ 3 } label="Security issues" isLoading />
		</StatTiles>
	),
};
