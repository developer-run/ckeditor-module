import Command from '@ckeditor/ckeditor5-core/src/command';

export default class InsertTranslateBoxCommand extends Command {
	execute() {
		this.editor.model.change( writer => {
			// Insert <translateBox>*</translateBox> at the current selection position
			// in a way that will result in creating a valid model structure.
			this.editor.model.insertContent( createTranslateBox( writer ) );
		} );
	}

	refresh() {
		const model = this.editor.model;
		const selection = model.document.selection;
		const allowedIn = model.schema.findAllowedParent( selection.getFirstPosition(), 'translateBox' );

		this.isEnabled = allowedIn !== null;
	}
}

function createTranslateBox( writer ) {
	const simpleBox = writer.createElement( 'translateBox' );
	const simpleBoxTitle = writer.createElement( 'translateBoxTitle' );
	const simpleBoxDescription = writer.createElement( 'translateBoxDescription' );

	writer.append( simpleBoxTitle, simpleBox );
	writer.append( simpleBoxDescription, simpleBox );

	// There must be at least one paragraph for the description to be editable.
	// See https://github.com/ckeditor/ckeditor5/issues/1464.
	writer.appendElement( 'paragraph', simpleBoxDescription );

	return simpleBox;
}
