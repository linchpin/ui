/**
 * Content that runs edge to edge across the page body.
 *
 * `LinchpinAdminPage` pads its body to the page gutter, which is right for
 * sections and notices and wrong for a table: a data view inside that padding
 * starts its own 24px in again, so its search box and first column sit well
 * to the right of the page title above them. Wrap the data view in this and it
 * spans the body instead, with its toolbar, cells and footer padded to the
 * same gutter as the title, so the screen has one left edge.
 *
 * The rest of the screen stays padded: put notices, empty states and sections
 * beside it as usual.
 *
 * @param {Object}  props             Props.
 * @param {Element} props.children    Usually a `DataViews`.
 * @param {string}  [props.className] Extra class names.
 * @return {Element} The full-bleed region.
 */
export default function PageFullBleed( { children, className } ) {
	return (
		<div
			className={ [ 'lp-admin__full-bleed', className ]
				.filter( Boolean )
				.join( ' ' ) }
		>
			{ children }
		</div>
	);
}
