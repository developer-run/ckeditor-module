import Command from '@ckeditor/ckeditor5-core/src/command';
import first from "@ckeditor/ckeditor5-utils/src/first";
import {findAncestor, isColElement} from "./utils";

export default class RemoveColumnCommand extends Command {

	execute(  ) { // { value }
		const editor = this.editor;

		editor.model.change( writer => {
			const selection = editor.model.document.selection;

			const ancestor = findAncestor('column', selection.getFirstPosition());
			if (ancestor) {
				writer.remove( ancestor );
			}

		} );

	}

	refresh() {
		var isAllowed = false;
		const model = this.editor.model;
		const selection = model.document.selection;

		/*
		const selectedCol = first( selection.getSelectedBlocks() );

		if (selectedCol) {
			if (selectedCol.parent.name === "col") {

			}

			isAllowed = selectedCol.parent.name === "col";

			// this.isEnabled = isAllowed;
			// return;
		}
		*/

		// console.log( model.schema.checkAttributeInSelection( selection, 'col' ) );

		const selectionRow = findAncestor('row', selection.getFirstPosition());

		// console.log(selectionRow);

/*
		if (selectionRow) {
			console.log(selectionRow.childCount);
			const row = selectionRow.getChild( 0 );

			console.log(row);

			// console.log(selectionRow.findAncestor("col"));


		}
*/

		// const ancestor = findAncestor('col', selection.getFirstPosition());
		// if (ancestor) {
		// 	isAllowed = true;
		// }


/*
		if ( selectedImage && selectedImage.name === 'image' ) {
			this.isEnabled = model.schema.checkAttribute( selectedImage, 'linkHref' );
		} else {
			this.isEnabled = model.schema.checkAttributeInSelection( doc.selection, 'linkHref' );
		}

*/


		// console.log("selection ", selection);
		// console.log("selectionCol ", selectedCol);
		// console.log("selection Focus parent ", selection.focus.parent);


		// const isAllowed = model.schema.checkChild( selection.focus.parent, 'col' );
		// const isAllowed = model.schema.checkElement( selection.focus.parent, 'col' );


		// isAllowed = false;

		this.isEnabled = selectionRow
			? selectionRow.childCount > 1
			: false;

		console.log("isAllowed ", this.isEnabled);

	}
}
