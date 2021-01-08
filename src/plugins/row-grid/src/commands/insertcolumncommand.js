/**
 * @module row/commands/insertcolumncommand
 */

import Command from '@ckeditor/ckeditor5-core/src/command';
import {findAncestor} from "../utils";

/**
 * The insert column command.
 *
 * The command is registered by {@link module:table/tableediting~TableEditing} as the `'insertTableColumnLeft'` and
 * `'insertTableColumnRight'` editor commands.
 *
 * To insert a column to the left of the selected cell, execute the following command:
 *
 *		editor.execute( 'insertTableColumnLeft' );
 *
 * To insert a column to the right of the selected cell, execute the following command:
 *
 *		editor.execute( 'insertTableColumnRight' );
 *
 * @extends module:core/command~Command
 */
export default class InsertColumnCommand extends Command {
	/**
	 * Creates a new `InsertColumnCommand` instance.
	 *
	 * @param {module:core/editor/editor~Editor} editor An editor on which this command will be used.
	 * @param {Object} options
	 * @param {String} [options.order="right"] The order of insertion relative to the column in which the caret is located.
	 * Possible values: `"left"` and `"right"`.
	 */
	constructor( editor, options = {} ) {
		super( editor );

		/**
		 * The order of insertion relative to the column in which the caret is located.
		 *
		 * @readonly
		 * @member {String} module:table/commands/insertcolumncommand~InsertColumnCommand#order
		 */
		this.order = options.order || 'right';
	}

	/**
	 * @inheritDoc
	 */
	refresh() {
		const selection = this.editor.model.document.selection;

		const rowParent = findAncestor( 'row', selection.getFirstPosition() );

		this.isEnabled = !!rowParent;
	}

	/**
	 * Executes the command.
	 *
	 * Depending on the command's {@link #order} value, it inserts a column to the `'left'` or `'right'` of the column
	 * in which the selection is set.
	 *
	 * @fires execute
	 */
	execute() {
		const editor = this.editor;
		const selection = editor.model.document.selection;
		// const tableUtils = editor.plugins.get( 'TableUtils' );
		const insertBefore = this.order === 'left';

		console.info(this.order);


		// const affectedTableCells = getSelectionAffectedTableCells( selection );
		// const columnIndexes = getColumnIndexes( affectedTableCells );

		// const column = insertBefore ? columnIndexes.first : columnIndexes.last;
		// const table = findAncestor( 'table', affectedTableCells[ 0 ] );

		// tableUtils.insertColumns( table, { columns: 1, at: insertBefore ? column : column + 1 } );

		// const col1 = writer.createElement( 'col' );


		this.editor.model.change( writer => {
			// Insert <translateBox>*</translateBox> at the current selection position
			// in a way that will result in creating a valid model structure.

			const row = findAncestor('row', selection.getFirstPosition());
			const selectionCol = findAncestor('column', selection.getFirstPosition());
			if (row && selectionCol) {

				const position = insertBefore
					? writer.createPositionBefore(selectionCol)
					: writer.createPositionAfter(selectionCol);

				const col = writer.createElement( 'column' );
				writer.appendElement( 'paragraph', col );
				writer.insert( col, position );

				const selectionNewCol = writer.createPositionAt(selectionCol, 'before');

				writer.setSelectionFocus(selectionNewCol);

				// this.editor.model.insertContent( createRowCol( writer, ancestor ) );
			}

		} );

	}


}

function createRowCol( writer, row ) {
	const col = writer.createElement( 'column' );

	writer.append( col, row );
	writer.appendElement( 'paragraph', col );

	return row;
}
