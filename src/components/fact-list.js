/**
 * Read-only facts about one thing, as label and value pairs.
 *
 * A status screen, a record's overview, the line under a record's title —
 * each is a short list of things that are true, some of which are fine and
 * some of which want attention. psst drew its health screen as a `<dl>` of
 * rows marked ok or warn; the governance plugin drew a site's profile as a
 * grid of the same pairs with none of the marking; neither could reuse the
 * other's. This is that list, once.
 *
 * Two layouts, because the same facts appear in two places:
 *
 * - **`rows`** — one fact per line, label beside value. A record's overview,
 *   a health check.
 * - **`inline`** — the facts in a single wrapping line, each label above its
 *   value. The strip under a record's title: client, environment, last report.
 *
 * A fact's `tone` is how it reads, not how it looks: `ok` puts a quiet mark
 * before the value, `warning` and `error` colour it, `info` and none leave it
 * plain. A fact with no value is left out, rather than drawn as an empty row
 * a reader has to work out the meaning of.
 *
 * @param {Object} props             Props.
 * @param {Array}  props.items       `[ { id, label, value, tone, help } ]`. `value` and `help` may be nodes; `help` is a line under the value.
 * @param {string} [props.layout]    `rows` (default) or `inline`.
 * @param {string} [props.className] Extra class names.
 * @return {Element|null} The list, or nothing when no fact has a value.
 */
export default function FactList( { items = [], layout = 'rows', className } ) {
	const shown = items.filter(
		( item ) =>
			item &&
			item.value !== undefined &&
			item.value !== null &&
			item.value !== false &&
			item.value !== ''
	);

	if ( ! shown.length ) {
		return null;
	}

	return (
		<dl
			className={ [ 'lp-admin__facts', `is-${ layout }`, className ]
				.filter( Boolean )
				.join( ' ' ) }
		>
			{ shown.map( ( item ) => (
				<div
					key={ item.id ?? item.label }
					className={ [
						'lp-admin__fact',
						item.tone ? `is-${ item.tone }` : '',
					]
						.filter( Boolean )
						.join( ' ' ) }
				>
					<dt className="lp-admin__fact-label">{ item.label }</dt>
					<dd className="lp-admin__fact-value">
						{ item.value }
						{ item.help && (
							<span className="lp-admin__fact-help">
								{ item.help }
							</span>
						) }
					</dd>
				</div>
			) ) }
		</dl>
	);
}
