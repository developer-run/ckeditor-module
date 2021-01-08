import Command from '@ckeditor/ckeditor5-core/src/command';

export default class InsertRowGridCommand extends Command {
	execute() {
		this.editor.model.change( writer => {
			// Insert <translateBox>*</translateBox> at the current selection position
			// in a way that will result in creating a valid model structure.
			this.editor.model.insertContent( createRowGrid( writer ) );
		} );
	}

	refresh() {
		const model = this.editor.model;
		const selection = model.document.selection;
		const allowedIn = model.schema.findAllowedParent( selection.getFirstPosition(), 'row' );

		this.isEnabled = allowedIn !== null;
	}
}

function createRowGrid( writer ) {
	const row = writer.createElement( 'row' );
	const col1 = writer.createElement( 'column' );
	const col2 = writer.createElement( 'column' );
	const col3 = writer.createElement( 'column' );

	writer.append( col1, row );
	writer.append( col2, row );
	// writer.append( col3, row );

	// There must be at least one paragraph for the description to be editable.
	// See https://github.com/ckeditor/ckeditor5/issues/1464.
	writer.appendElement( 'paragraph', col1 );
	writer.appendElement( 'paragraph', col2 );

	return row;
}
