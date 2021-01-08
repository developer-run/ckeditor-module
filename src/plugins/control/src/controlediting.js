import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import { toWidget, viewToModelPositionOutsideModelElement } from '@ckeditor/ckeditor5-widget/src/utils';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';

import ControlCommand from './controlcommand';
import '../theme/control.css';

export default class ControlEditing extends Plugin {
	static get requires() {
		return [ Widget ];
	}

	init() {

		/* Definování schématu: S <placeholder>prvkem by se mělo zacházet $texttak, že musí být definováno pomocí isInline: true */
		this._defineSchema(); //

		// Definování převodníků: Struktura HTML (datový výstup) převaděče bude <span>s placeholdertřídou.
		// Text uvnitř <span>bude jméno vlastníka.
		this._defineConverters();

		this.editor.commands.add( 'control', new ControlCommand( this.editor ) );

		this.editor.editing.mapper.on(
			'viewToModelPosition',
			viewToModelPositionOutsideModelElement( this.editor.model, viewElement => viewElement.hasClass( 'ck-control' ) )
		);

		this.editor.config.define( 'controlConfig', {
			types: [ 'date', 'first name', 'surname' ]
		} );
	}

	_defineSchema() {
		const schema = this.editor.model.schema;

		schema.register( 'control', {
			// Allow wherever text is allowed:
			allowWhere: '$text',

			// The placeholder will act as an inline node:
			isInline: true,

			// The inline widget is self-contained so it cannot be split by the caret and can be selected:
			isObject: true,

			// The placeholder can have many types, like date, name, surname, etc:
			allowAttributes: [ 'name' ]
		} );
	}

	_defineConverters() {
		const conversion = this.editor.conversion;

		conversion.for( 'upcast' ).elementToElement( {
			view: {
				name: 'span',
				classes: [ 'ck-control' ]
			},
			model: ( viewElement, modelWriter ) => {

				// Extract the "name" from "{name}".
				const name = viewElement.getChild( 0 ).data.slice( 1, -1 );

				return modelWriter.createElement( 'control', { name } );
			}
		} );

		conversion.for( 'editingDowncast' ).elementToElement( {
			model: 'control',
			view: ( modelItem, viewWriter ) => {
				const widgetElement = createControlView( modelItem, viewWriter );

				// Enable widget handling on a placeholder element inside the editing view.
				return toWidget( widgetElement, viewWriter );
			}
		} );

		conversion.for( 'dataDowncast' ).elementToElement( {
			model: 'control',
			view: createControlDataView
		} );

		// Helper method for both downcast converters.
		function createControlView( modelItem, viewWriter ) {
			const name = modelItem.getAttribute( 'name' );

			const controlView = viewWriter.createContainerElement( 'span', {
				class: 'ck-control'
			} );

			// Insert the placeholder name (as a text).
			const innerText = viewWriter.createText( '{' + name + '}' );
			viewWriter.insert( viewWriter.createPositionAt( controlView, 0 ), innerText );

			return controlView;
		}

		function createControlDataView( modelItem, viewWriter ) {
			const name = modelItem.getAttribute( 'name' );

			// const controlView = viewWriter.createContainerElement( 'span', {
			// 	class: 'ck-control',
			// 	"data-insert": 'ahoj'
			// } );

			// Insert the placeholder name (as a text).
			const innerText = viewWriter.createText( '{' + name + '}' );
			// viewWriter.insert( viewWriter.createPositionAt( controlView, 0 ), innerText );

			return innerText;
			// return controlView;
		}
	}
}
