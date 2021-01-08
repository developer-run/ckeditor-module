import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import { toWidget, toWidgetEditable } from '@ckeditor/ckeditor5-widget/src/utils';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';

import InsertTranslateBoxCommand from './translate-box-command';
import '../theme/translatebox.css';

export default class TranslateBoxEditing extends Plugin {
	static get requires() {
		return [ Widget ];
	}

	init() {
		// console.log( 'TranslateBoxEditing#init() got called' );

		this._defineSchema();
		this._defineConverters();

		this.editor.commands.add( 'insertTranslateBox', new InsertTranslateBoxCommand( this.editor ) );
	}

	_defineSchema() {
		const schema = this.editor.model.schema;

		schema.register( 'translateBox', {
			// Behaves like a self-contained object (e.g. an image).
			isObject: true,
			// isLimit: true,

			// Allow in places where other blocks are allowed (e.g. directly in the root).
			allowWhere: '$block',

			// allowContentOf: '$block'

		} );

		schema.register( 'translateBoxTitle', {
			// Cannot be split or left by the caret.
			isLimit: true,

			allowIn: 'translateBox',

			// Allow content which is allowed in blocks (i.e. text with attributes).
			allowContentOf: '$block'
		} );

		schema.register( 'translateBoxDescription', {
			// Cannot be split or left by the caret.
			isLimit: true,

			allowIn: 'translateBox',

			// Allow content which is allowed in the root (e.g. paragraphs).
			allowContentOf: '$root'
		} );

		schema.addChildCheck( ( context, childDefinition ) => {
			if ( context.endsWith( 'translateBoxDescription' ) && childDefinition.name === 'translateBox' ) {
				return false;
			}
		} );

	}

	_defineConverters() {
		const conversion = this.editor.conversion;

		// conversion.elementToElement( {
		// 	model: 'translateBox',
		// 	view: {
		// 		name: 'div',
		// 		classes: 'translate-box'
		// 	}
		// } );
		//
		// conversion.elementToElement( {
		// 	model: 'translateBoxTitle',
		// 	view: {
		// 		name: 'div',
		// 		classes: 'translate-box-title'
		// 	}
		// } );
		//
		// conversion.elementToElement( {
		// 	model: 'translateBoxDescription',
		// 	view: {
		// 		name: 'div',
		// 		classes: 'translate-box-description'
		// 	}
		// } );

		// <simpleBox> converters
		conversion.for( 'upcast' ).elementToElement( {
			model: 'translateBox',
			view: {
				name: 'section',
				classes: 'translate-box'
			}
		} );
		conversion.for( 'dataDowncast' ).elementToElement( {
			model: 'translateBox',
			view: {
				name: 'section',
				classes: 'translate-box'
			}
		} );
		conversion.for( 'editingDowncast' ).elementToElement( {
			model: 'translateBox',
			view: ( modelElement, viewWriter ) => {
				const section = viewWriter.createContainerElement( 'section', { class: 'translate-box' } );

				return toWidget( section, viewWriter, { label: 'translate box widget' } );
			}
		} );

		// <simpleBoxTitle> converters
		conversion.for( 'upcast' ).elementToElement( {
			model: 'translateBoxTitle',
			view: {
				name: 'h1',
				classes: 'translate-box-title'
			}
		} );
		conversion.for( 'dataDowncast' ).elementToElement( {
			model: 'translateBoxTitle',
			view: {
				name: 'h1',
				classes: 'translate-box-title'
			}
		} );
		conversion.for( 'editingDowncast' ).elementToElement( {
			model: 'translateBoxTitle',
			view: ( modelElement, viewWriter ) => {
				// Note: You use a more specialized createEditableElement() method here.
				const h1 = viewWriter.createEditableElement( 'h1', { class: 'translate-box-title' } );

				return toWidgetEditable( h1, viewWriter );
			}
		} );

		// <simpleBoxDescription> converters
		conversion.for( 'upcast' ).elementToElement( {
			model: 'translateBoxDescription',
			view: {
				name: 'div',
				classes: 'translate-box-description'
			}
		} );
		conversion.for( 'dataDowncast' ).elementToElement( {
			model: 'translateBoxDescription',
			view: {
				name: 'div',
				classes: 'translate-box-description'
			}
		} );
		conversion.for( 'editingDowncast' ).elementToElement( {
			model: 'translateBoxDescription',
			view: ( modelElement, viewWriter ) => {
				// Note: You use a more specialized createEditableElement() method here.
				const div = viewWriter.createEditableElement( 'div', { class: 'translate-box-description' } );

				return toWidgetEditable( div, viewWriter );
			}
		} );
	}
}
