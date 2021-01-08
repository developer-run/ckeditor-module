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
 *		editor.execute( 'classColumn' );
 *
 * @extends module:core/command~Command
 */
export default class ColumnSizeCommand extends Command {
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
		// this.size = options.size || 'col';
		this.value = options.value;
		this.name = options.name;

		// console.log(options);
	}

	/**
	 * @inheritDoc
	 */
	refresh() {
		const selection = this.editor.model.document.selection;
		const columnElement = this.editor.model.document.selection.getSelectedElement();

		// console.debug(columnElement);

		const rowParent = findAncestor( 'row', selection.getFirstPosition() );
		this.isEnabled = !!rowParent;

		this.isEnabled = true;
	}

	/**
	 * Executes the command.
	 *
	 *		// Sets the width to 50%:
	 *		editor.execute( 'imageResize', { width: '50%' } );
	 *
	 *		// Removes the width attribute:
	 *		editor.execute( 'imageResize', { width: null } );
	 *
	 * @param {Object} options
	 * @param {String|null} options.size The new width of the column.
	 * @fires execute
	 */
	execute(options) {
		// console.info(options);
		// console.info(options.size);
		// console.info(this.size);


		const value = (options && options.value) ? options.value : this.value;
		const name = (options && options.name) ? options.name : this.name;


		console.info(name);
		console.info(value);


		// return;


		const model = this.editor.model;
		const selection = this.editor.model.document.selection;
		const columnElement = selection.getSelectedElement();

		const columnParent = findAncestor( 'column', selection.getFirstPosition() );

		model.change( writer => {
			writer.setAttribute( name, value, columnParent );
		} );
	}


}
