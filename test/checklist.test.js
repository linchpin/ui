/**
 * External dependencies
 */
import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/**
 * Internal dependencies
 */
import {
	Checklist,
	CHECKLIST_STATUSES,
	checklistSummary,
	sortChecklistItems,
} from '../src';

const SETUP = [
	{
		id: 'patchstack',
		status: 'fail',
		group: 'baseline',
		label: 'Patchstack is active on production',
		detail: 'Patchstack is not installed.',
		action: {
			label: 'Install and activate Patchstack',
			href: 'https://app.patchstack.com/',
		},
	},
	{
		id: 'staging',
		status: 'pass',
		group: 'baseline',
		label: 'Production and staging are registered',
		detail: 'Staging is contoso-stg.example.',
	},
	{
		id: 'nightly',
		status: 'fail',
		tone: 'caution',
		group: 'recommended',
		label: 'The last nightly run passed',
		action: {
			label: 'Open the run',
			href: '/wp-admin/admin.php?page=sisyphus',
		},
	},
	{
		id: 'sisyphus',
		status: 'na',
		group: 'recommended',
		label: 'Nightly maintenance is on',
		detail: 'Not on Pressable.',
	},
];

describe( 'Checklist', () => {
	it( 'leads each row with its status, then the label, detail and action', () => {
		render( <Checklist items={ SETUP.slice( 0, 1 ) } /> );

		const row = screen.getByRole( 'listitem' );

		expect( within( row ).getByText( 'Fail' ) ).toHaveClass(
			'lp-admin__status-badge',
			'is-error'
		);
		expect(
			within( row ).getByText( 'Patchstack is active on production' )
		).toBeInTheDocument();
		expect(
			within( row ).getByText( 'Patchstack is not installed.' )
		).toBeInTheDocument();
	} );

	it( 'opens off-site actions in a new tab and keeps on-site ones on the screen', () => {
		render( <Checklist items={ SETUP } /> );

		const external = screen.getByRole( 'link', {
			name: /Install and activate Patchstack/,
		} );

		expect( external ).toHaveAttribute( 'target', '_blank' );
		expect( external ).toHaveAccessibleName(
			'Install and activate Patchstack (opens in a new tab)'
		);

		const internal = screen.getByRole( 'link', { name: 'Open the run' } );

		expect( internal ).not.toHaveAttribute( 'target' );
	} );

	it( 'lets an item override its tone and label', () => {
		render(
			<Checklist
				items={ [ { ...SETUP[ 2 ], statusLabel: 'Missing' } ] }
			/>
		);

		expect( screen.getByText( 'Missing' ) ).toHaveClass( 'is-caution' );
	} );

	it( 'groups items under headings, failures first when sorted', () => {
		render(
			<Checklist
				items={ SETUP }
				sortByStatus
				groups={ [
					{ id: 'baseline', title: 'Baseline' },
					{ id: 'recommended', title: 'Recommended' },
				] }
			/>
		);

		expect(
			screen.getByRole( 'heading', { level: 3, name: 'Baseline' } )
		).toBeInTheDocument();

		const baseline = screen.getByRole( 'list', { name: 'Baseline' } );
		const labels = within( baseline )
			.getAllByRole( 'listitem' )
			.map(
				( item ) =>
					item.querySelector( '.lp-admin__checklist-label' )
						.textContent
			);

		expect( labels ).toEqual( [
			'Patchstack is active on production',
			'Production and staging are registered',
		] );
	} );

	it( 'mutes a row that does not apply and leaves it out of the summary', () => {
		const { container } = render( <Checklist items={ SETUP } summary /> );

		expect(
			container.querySelector( '.lp-admin__checklist-item.is-quiet' )
		).toHaveTextContent( 'Nightly maintenance is on' );
		expect( screen.getByText( '1 of 3 done' ) ).toBeInTheDocument();
	} );

	it( 'numbers the steps not yet done in an ordered icon list, and marks the current one', () => {
		const statuses = {
			incomplete: { label: 'To do', tone: 'neutral' },
			in_progress: { label: 'In progress', tone: 'info' },
			complete: { label: 'Done', tone: 'success' },
		};

		const { container } = render(
			<Checklist
				ordered
				marker="icon"
				statuses={ statuses }
				items={ [
					{ id: 'auth', status: 'complete', label: 'Authentication' },
					{
						id: 'client',
						status: 'in_progress',
						label: 'Client info',
						current: true,
					},
					{ id: 'license', status: 'incomplete', label: 'License' },
				] }
			/>
		);

		expect( container.querySelector( 'ol' ) ).toBeInTheDocument();
		expect(
			screen.getByRole( 'img', { name: 'Done' } )
		).not.toHaveTextContent( '1' );
		expect(
			screen.getByRole( 'img', { name: 'To do' } )
		).toHaveTextContent( '3' );
		expect(
			screen.getByText( 'Client info' ).closest( 'li' )
		).toHaveAttribute( 'aria-current', 'step' );
	} );

	it( 'makes a step selectable and nests its sub-steps', async () => {
		const onSelect = vi.fn();

		render(
			<Checklist
				items={ [
					{
						id: 'auth',
						status: 'pass',
						label: 'Authentication',
						onSelect,
						items: [
							{ id: 'pin', status: 'pass', label: 'PIN' },
							{ id: 'token', status: 'pending', label: 'Token' },
						],
					},
				] }
			/>
		);

		await userEvent.click(
			screen.getByRole( 'button', { name: 'Authentication' } )
		);

		expect( onSelect ).toHaveBeenCalledWith(
			expect.objectContaining( { id: 'auth' } )
		);
		expect( screen.getByText( 'Token' ) ).toBeInTheDocument();
		expect( screen.getAllByRole( 'list' ) ).toHaveLength( 2 );
	} );

	it( 'renders a button for an onClick action and plain text for a label alone', async () => {
		const onClick = vi.fn();

		render(
			<Checklist
				items={ [
					{
						id: 'a',
						status: 'fail',
						label: 'Commands land',
						actions: [
							{ label: 'Retry', onClick },
							{ label: 'Ask an admin to check Access' },
						],
					},
				] }
			/>
		);

		await userEvent.click(
			screen.getByRole( 'button', { name: 'Retry' } )
		);

		expect( onClick ).toHaveBeenCalledTimes( 1 );
		expect(
			screen.getByText( 'Ask an admin to check Access' )
		).toHaveClass( 'lp-admin__checklist-action-text' );
	} );

	it( 'shows placeholders while loading and a message when empty', () => {
		const { container, rerender } = render(
			<Checklist isLoading placeholderCount={ 4 } />
		);

		expect(
			container.querySelectorAll(
				'.lp-admin__checklist-item.is-placeholder'
			)
		).toHaveLength( 4 );

		rerender( <Checklist items={ [] } emptyMessage="Nothing to check." /> );

		expect( screen.getByText( 'Nothing to check.' ) ).toBeInTheDocument();

		rerender( <Checklist items={ [] } /> );

		expect( container ).toBeEmptyDOMElement();
	} );
} );

describe( 'sortChecklistItems', () => {
	it( 'sorts by the status map order and keeps order within a status', () => {
		const sorted = sortChecklistItems(
			[
				{ id: 1, status: 'pass' },
				{ id: 2, status: 'na' },
				{ id: 3, status: 'fail' },
				{ id: 4, status: 'pass' },
				{ id: 5, status: 'mystery' },
				{ id: 6, status: 'fail' },
			],
			CHECKLIST_STATUSES
		);

		expect( sorted.map( ( item ) => item.id ) ).toEqual( [
			3, 6, 1, 4, 2, 5,
		] );
	} );
} );

describe( 'checklistSummary', () => {
	it( 'counts successes out of the items that apply', () => {
		expect(
			checklistSummary( [
				{ status: 'pass' },
				{ status: 'pass' },
				{ status: 'fail' },
				{ status: 'unknown' },
				{ status: 'na' },
			] )
		).toBe( '2 of 4 done' );
	} );
} );
