import Command from '@ckeditor/ckeditor5-core/src/command';

export default class ControlCommand extends Command {
	execute( { value } ) {
		const editor = this.editor;

		editor.model.change( writer => {
			// Create a <placeholder> elment with the "name" attribute...
			const control = writer.createElement( 'control', { name: value } );

			// ... and insert it into the document.
			editor.model.insertContent( control );

			// Put the selection on the inserted element.
			writer.setSelection( control, 'on' );
		} );
	}

	refresh() {
		const model = this.editor.model;
		const selection = model.document.selection;

		const isAllowed = model.schema.checkChild( selection.focus.parent, 'control' );

		this.isEnabled = isAllowed;
	}
}
