import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import {toWidget, toWidgetEditable} from '@ckeditor/ckeditor5-widget/src/utils';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';

import InsertRowGridCommand from "./row-grid-command";
import InsertColumnCommand from "./commands/insertcolumncommand";
import RemoveColumnCommand from "./removecolumncommand";
import ColumnSizeCommand from "./commands/columnsizecommand";
import '../theme/row-grid.css';
import removeIcon from '../theme/icons/exposure_plus_1-24px.svg';

const ARROW_ICON_ELEMENT = new DOMParser().parseFromString( removeIcon, 'image/svg+xml' ).firstChild;


export default class RowGridEditing extends Plugin {
	static get requires() {
		return [ Widget ];
	}

	init() {
		// console.log( 'RowGridEditing#init() got called' );


		this._defineSchema();
		this._defineConverters();

		this.editor.commands.add( 'insertRowGrid', new InsertRowGridCommand( this.editor ) );
		this.editor.commands.add( 'insertColumnBefore', new InsertColumnCommand( this.editor, { order: 'left'} ) );
		this.editor.commands.add( 'insertColumnAfter', new InsertColumnCommand( this.editor, { order: 'right'} ) );
		this.editor.commands.add( 'removeColumn', new RemoveColumnCommand( this.editor ) );
		this.editor.commands.add( 'columnSize', new ColumnSizeCommand( this.editor ) );
		this.editor.commands.add( 'columnSizeCol', new ColumnSizeCommand( this.editor, { value: 'col', name: 'sizeXS' } ) );
		this.editor.commands.add( 'columnSizeCol2', new ColumnSizeCommand( this.editor, { value: 'col-2', name: 'sizeXS' } ) );
		this.editor.commands.add( 'columnSizeColSM', new ColumnSizeCommand( this.editor, { value: 'col-sm', name: 'sizeSM' } ) );

		this.editor.config.define( 'column', {
			sizes: {sizeXS: ['col', 'col-1', 'col-2'], sizeSM: ['col-sm', 'col-sm-2']},
			offsets: {offsetSM: [1, 2, 3], offsetXS: [12]},
		} );
	}

	_defineSchema() {
		const schema = this.editor.model.schema;

		schema.register( 'row', {
			// Behaves like a self-contained object (e.g. an image).
			isObject: true,
			// isLimit: true,

			// Allow in places where other blocks are allowed (e.g. directly in the root).
			allowWhere: '$block',

			// allowContentOf: '$block'

		} );

		schema.register( 'column', {
			// Cannot be split or left by the caret.
			isLimit: true,

			allowIn: 'row',

			// Allow content which is allowed in blocks (i.e. text with attributes).
			// allowContentOf: '$block'
			allowContentOf: '$root',

			allowAttributes: [ 'colType', 'colindex' , 'sizeXS' , 'sizeSM', 'orderXS' , 'orderSM', 'offsetXS' ]
		} );

		schema.addChildCheck( ( context, childDefinition ) => {
			if ( context.endsWith( 'column' ) && childDefinition.name === 'row' ) {
				return false;
			}
		} );

	}

	_defineConverters() {
		const conversion = this.editor.conversion;

		// conversion.elementToElement( {
		// 	model: 'row',
		// 	view: {
		// 		name: 'div',
		// 		classes: 'row'
		// 	}
		// } );
		//
		// conversion.elementToElement( {
		// 	model: 'col',
		// 	view: {
		// 		name: 'div',
		// 		classes: 'col'
		// 	}
		// } );


		// <row> converters
		conversion.for( 'upcast' ).elementToElement( {
			model: 'row',
			view: {
				name: 'div',
				classes: 'row'
			}
		} );
		conversion.for( 'dataDowncast' ).elementToElement( {
			model: 'row',
			view: {
				name: 'div',
				classes: 'row'
			}
		} );
		conversion.for( 'editingDowncast' ).elementToElement( {
			model: 'row',
			view: ( modelElement, viewWriter ) => {
				const section = viewWriter.createContainerElement( 'div', { class: 'row' } );

				return toWidget( section, viewWriter, { label: 'row widget' } );
			}
		} );


		// conversion.for( 'upcast' ).attributeToAttribute( {
			// model: 'colType',
			// view: 'column',

			// view: modelAttributeValue => ( {
			// 	key: 'class',
			// 	value: 'styled-' + modelAttributeValue
			// } )

		// } );




// 		conversion.for( 'upcast' ).attributeToAttribute( {
// 			model: {
// 				name: 'colType',
// 				key: 'source'
// 			},
//
// 			view: ( modelItem, viewWriter ) => {
// //				const widgetElement = createControlView( modelItem, viewWriter );
//
//
//
//
// 				// Enable widget handling on a placeholder element inside the editing view.
// //				return toWidget( widgetElement, viewWriter );
// 			}
//
// 			// model: 'colType',
// //			view: 'column',
// 			// view: modelAttributeValue => ( {
// 			// 	key: 'class',
// 			// 	value: 'styled-' + modelAttributeValue
// 			// } )
//
// 		} );


		function moje(viewColumn, modelWriter) {

			console.log("AAA", viewColumn.getClassNames());
			console.log("AAA", viewColumn);



			function isInArray(value, array) {
				for ( const className of array ) {
					if ( !otherElement._classes.has( className ) ) {
						return false;
					}
				}

			}
		}


		// <col> converters
		conversion.for( 'upcast' ).elementToElement( {
			// model: 'column',

			// model: ( viewImage, modelWriter ) => modelWriter.createElement( 'col', { colindex: viewImage.getAttribute( 'class' ).match(/(col|-[1-9]|[1][0-2])/), } ),
			model: ( viewImage, modelWriter ) => modelWriter.createElement( 'column', {
				sizeXS: viewImage.hasClass( 'col' ),
				sizeSM: viewImage.hasClass( 'col-sm'),
				sizeMD: viewImage.hasClass( 'col-md' ),
			} ),
			// model: ( viewImage, modelWriter ) => modelWriter.createElement( 'col', { colindex: viewImage.getClassNames(), } ),
			// model: ( viewColumn, modelWriter ) => moje(viewColumn),
			view: {
				name: 'div',
				attributes: {
					"colindex": true,
				},
				classes: /^(col|col-([1-9]|[1][0-2]))$/
			},
			// model: ( viewElement, modelWriter ) => {
			//
			// 	// Extract the "name" from "{name}".
			// 	// const name = viewElement.getChild( 0 ).data.slice( 1, -1 );
			// 	const name = viewElement.getChild( 0 );
			//
			// 	console.log(name);
			//
			// 	// return modelWriter.createElement( 'col', { name } );
			// 	return modelWriter.createElement( 'col' );
			// }
		} )
			// .attributeToAttribute( {
			// 	view: {
			// 		name: 'div',
			// 		key: 'colindex'
			// 	},
			// 	// model: 'colindex'
			// 	model: ( viewImage, modelWriter ) => moje(viewImage)
			//
			// })

		;

		conversion.for( 'downcast' )
			.attributeToAttribute( {
				view: {
					name: 'div', // ignored
					key: 'class'
				},
				model: 'sizeXS'
			})
			.attributeToAttribute( {
				view: {
					name: 'div', // ignored
					key: 'class'
				},
				model: 'sizeSM'
			})
			.attributeToAttribute( {
				view: {
					name: 'div', // ignored
					key: 'class'
				},
				model: 'sizeMD'
			})
			.attributeToAttribute( {
				view: {
					name: 'div', // ignored
					key: 'class'
				},
				model: 'sizeLG'
			})
			.attributeToAttribute( {
				view: {
					name: 'div', // ignored
					key: 'class'
				},
				model: 'sizeXL'
			})
			.add( dispatcher => {

			dispatcher.on( 'insert:column', ( evt, data, conversionApi ) => {
				const viewWriter = conversionApi.writer;

				viewWriter.addClass( 'my-heading', conversionApi.mapper.toViewElement( data.item ) );
			}, { priority: 'low' } );

		});








		conversion.for( 'dataDowncast' ).elementToElement( {
			model: 'column',
			view: {
				name: 'div',
				// classes: 'col'
			}
		} );
		conversion.for( 'editingDowncast' ).elementToElement( {
			model: 'column',
			view: ( modelElement, viewWriter ) => {
				// Note: You use a more specialized createEditableElement() method here.
				// const section = viewWriter.createContainerElement( 'div', { style: 'position: absolute;' } );
				const section = viewWriter.createContainerElement( 'div', { class: 'col' } );

				var name = "test";

				// const button = viewWriter.createContainerElement( 'div', { class: 'ck ck-widget__type-around__button' } );
				const button = viewWriter.createContainerElement( 'div', { class: 'ck ck-widget__type-column__button' } );
				// const removeIconEl = viewWriter.createAttributeElement( 'img', { src: removeIcon } );
				const removeIconEl = viewWriter.createAttributeElement( 'img', { src: '../src/plugins/row-grid/theme/icons/exposure_plus_1-24px.svg' } );

				// console.log(button);
				// wrapperDomElement.ownerDocument.importNode( RETURN_ARROW_ICON_ELEMENT, true )

				// viewWriter.insert( viewWriter.createPositionAt( button, 0 ), ARROW_ICON_ELEMENT );
				viewWriter.insert( viewWriter.createPositionAt( button, 0 ), removeIconEl );

				// button.bind( 'isEnabled' ).to( command );
				//
				//
				// const buttonTemplate = new Template( {
				// 	tag: 'div',
				// 	attributes: {
				// 		class: [
				// 			'ck',
				// 			'ck-widget__type-remove__button',
				// 		],
				// 		title: "my title"
				// 	},
				// 	children: [
				// 		"můj obsah"
				// 	]
				// } );



				var col = viewWriter.createEditableElement( 'div', { class: 'col editace' } );
				viewWriter.setCustomProperty( 'column', true, col );

				const p = viewWriter.createContainerElement( 'p' );

				// viewWriter.insert( viewWriter.createPositionAt( col, 0 ), button ); // custom button

				// viewWriter.insert( viewWriter.createPositionAt( col, 0 ), buttonTemplate);


				col = toWidgetEditable( col, viewWriter );

				return col;

				// Insert the placeholder name (as a text).
				const innerText = viewWriter.createText( '{' + name + '}' );
				viewWriter.insert( viewWriter.createPositionAt( button, 0 ), innerText );

				// viewWriter.insert( viewWriter.createPositionAt( col, 0 ), section );
				viewWriter.insert( viewWriter.createPositionAt( section, 0 ), col );
				viewWriter.insert( viewWriter.createPositionAt( col, 0 ), p );
				// viewWriter.insert( viewWriter.createPositionAt( section, 1 ), button );

				// return toWidgetEditable( col, viewWriter );



				// return toWidgetEditable( section, viewWriter );
				return section;
			}
		} )
		// .attributeToAttribute( {
		// 	view: {
		// 		name: 'section', // ignored
		// 		key: 'class'
		// 	},
		// 	model: 'sizeXS'
		// })
		// .attributeToAttribute( {
		// 	view: {
		// 		name: 'div', // ignored
		// 		key: 'class'
		// 	},
		// 	model: 'sizeSM'
		// })
		// .attributeToAttribute( {
		// 	view: {
		// 		name: 'div', // ignored
		// 		key: 'class'
		// 	},
		// 	model: 'sizeMD'
		// })



	}
}
