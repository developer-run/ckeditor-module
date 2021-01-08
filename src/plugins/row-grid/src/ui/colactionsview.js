import View from "@ckeditor/ckeditor5-ui/src/view";
import FocusTracker from "@ckeditor/ckeditor5-utils/src/focustracker";
import KeystrokeHandler from "@ckeditor/ckeditor5-utils/src/keystrokehandler";

import cancelIcon from '@ckeditor/ckeditor5-core/theme/icons/cancel.svg';
import pencilIcon from '@ckeditor/ckeditor5-core/theme/icons/pencil.svg';
import tableColumnIcon from '@ckeditor/ckeditor5-table/theme/icons/table-column.svg';

import ButtonView from "@ckeditor/ckeditor5-ui/src/button/buttonview";
import ViewCollection from "@ckeditor/ckeditor5-ui/src/viewcollection";
import FocusCycler from "@ckeditor/ckeditor5-ui/src/focuscycler";
import {addToolbarToDropdown, createDropdown} from "@ckeditor/ckeditor5-ui/src/dropdown/utils";
import Collection from "@ckeditor/ckeditor5-utils/src/collection";
import Model from "@ckeditor/ckeditor5-ui/src/model";
import ToolbarSeparatorView from "@ckeditor/ckeditor5-ui/src/toolbar/toolbarseparatorview";

export default class ColActionsView extends View {

	constructor(editor, colCommand, protocol) {
		super(editor);

		this.editor = editor;
		const locale = editor.locale;
		const t = locale.t;

		const columnSizes = editor.config.get( 'column.sizes' );
		const columnOrders = editor.config.get( 'column.orders' );
		const columnOffsets = editor.config.get( 'column.offsets' );

		console.log(columnSizes);


		/**
		 * Tracks information about DOM focus in the form.
		 *
		 * @readonly
		 * @member {module:utils/focustracker~FocusTracker}
		 */
		this.focusTracker = new FocusTracker();

		/**
		 * An instance of the {@link module:utils/keystrokehandler~KeystrokeHandler}.
		 *
		 * @readonly
		 * @member {module:utils/keystrokehandler~KeystrokeHandler}
		 */
		this.keystrokes = new KeystrokeHandler();


		/**
		 * The Cancel button view.
		 *
		 * @member {module:ui/button/buttonview~ButtonView}
		 */
		// this.cancelButtonView = this._createButton( t( 'Cancel' ), cancelIcon, 'ck-button-cancel', 'cancel' );
		this.cancelButtonView = this._createButton( t( 'Cancel' ), cancelIcon, 'cancel' );


		/**
		 * The Insert column button view.
		 *
		 * @member {module:ui/button/buttonview~ButtonView}
		 */
		this.insertBeforeButtonView = this._createButton( t( 'Insert Left' ), pencilIcon, 'insertBefore' );

		/**
		 * The Insert column button view.
		 *
		 * @member {module:ui/button/buttonview~ButtonView}
		 */
		this.insertAfterButtonView = this._createButton( t( 'Insert' ), pencilIcon, 'insertAfter' );



		this.insertColumnDropdownView = this._createMenu( t( 'Column' ), locale );

		// console.log(columnSizes);

		let _columnSizes = [];
		for ( var size of Object.keys(columnSizes) ) {
			console.debug(size);
			console.debug(columnSizes[size]);
			// insertImage( writer, model, { src } );
		}


		this.insertColumnSizesDropdownView = this._createMenu( t( 'Column' ), locale );





		/**
		 * A collection of views that can be focused in the view.
		 *
		 * @readonly
		 * @protected
		 * @member {module:ui/viewcollection~ViewCollection}
		 */
		this._focusables = new ViewCollection();


		/**
		 * Helps cycling over {@link #_focusables} in the view.
		 *
		 * @readonly
		 * @protected
		 * @member {module:ui/focuscycler~FocusCycler}
		 */
		this._focusCycler = new FocusCycler( {
			focusables: this._focusables,
			focusTracker: this.focusTracker,
			keystrokeHandler: this.keystrokes,
			actions: {
				// Navigate fields backwards using the Shift + Tab keystroke.
				focusPrevious: 'shift + tab',

				// Navigate fields forwards using the Tab key.
				focusNext: 'tab'
			}
		} );

		this.setTemplate( {
			tag: 'div',

			attributes: {
				class: [
					'ck',
					'ck-link-actions'
				],

				// https://github.com/ckeditor/ckeditor5-link/issues/90
				tabindex: '-1'
			},

			children: [
				// this.previewButtonView,
				this.cancelButtonView,
				this.insertBeforeButtonView,
				this.insertAfterButtonView,
				this.insertColumnDropdownView,
				this.insertColumnSizesDropdownView,
				// this.unlinkButtonView
			]
		} );

	}


	/**
	 * @inheritDoc
	 */
	render() {
		super.render();

		const childViews = [
			this.cancelButtonView,
			this.insertBeforeButtonView,
			this.insertAfterButtonView,
		];

		// childViews.forEach( v => {
		// 	// Register the view as focusable.
		// 	this._focusables.add( v );
		//
		// 	// Register the view in the focus tracker.
		// 	this.focusTracker.add( v.element );
		// } );

		// Start listening for the keystrokes coming from #element.
		this.keystrokes.listenTo( this.element );
	}

	/**
	 * Focuses the fist {@link #_focusables} in the actions.
	 */
	focus() {
		this._focusCycler.focusFirst();
	}


	/**
	 * Creates a button view.
	 *
	 * @private
	 * @param {String} label The button label.
	 * @param {String} icon The button icon.
	 * @param {String} [eventName] An event name that the `ButtonView#execute` event will be delegated to.
	 * @returns {module:ui/button/buttonview~ButtonView} The button view instance.
	 */
	_createButton( label, icon, eventName ) {
		const button = new ButtonView( this.locale );

		button.set( {
			label,
			icon,
			tooltip: true
		} );

		button.delegate( 'execute' ).to( this, eventName );

		return button;
	}


	/**
	 * Creates a dropdown view from a set of options.
	 *
	 * @private
	 * @param {String} label The dropdown button label.
	 * @param {String} icon An icon for the dropdown button.
	 * @param {Array.<module:ui/dropdown/utils~ListDropdownItemDefinition>} options The list of options for the dropdown.
	 * @returns {module:ui/dropdown/dropdownview~DropdownView}
	 */
	_createDropdown( label, icon, options) {
		const editor = this.editor;
		const dropdownView = createDropdown( this.locale );
		const commands = this._fillDropdownWithListOptions( dropdownView, options );

		// Decorate dropdown's button.
		dropdownView.buttonView.set( {
			label,
			icon,
			tooltip: true
		} );

		// Make dropdown button disabled when all options are disabled.
		dropdownView.bind( 'isEnabled' ).toMany( commands, 'isEnabled', ( ...areEnabled ) => {
			return areEnabled.some( isEnabled => isEnabled );
		} );

		this.listenTo( dropdownView, 'execute', evt => {
			editor.execute( evt.source.commandName, evt.source.commandParams );
			// editor.execute( evt.source.commandName );
			editor.editing.view.focus();
		} );

		return dropdownView;
	}


	/**
	 * Injects a {@link module:ui/list/listview~ListView} into the passed dropdown with buttons
	 * which execute editor commands as configured in passed options.
	 *
	 * @private
	 * @param {module:ui/dropdown/dropdownview~DropdownView} dropdownView
	 * @param {Array.<module:ui/dropdown/utils~ListDropdownItemDefinition>} options The list of options for the dropdown.
	 * @returns {Array.<module:core/command~Command>} Commands the list options are interacting with.
	 */
	_fillDropdownWithListOptions( dropdownView, options ) {
		const editor = this.editor;
		const commands = [];
		const itemDefinitions = new Collection();
		const buttons = [];

		for ( const option of options ) {
			addListOption( option, editor, commands, itemDefinitions );
		}

		var inc = 0;
		for ( const _button of itemDefinitions ) {
			if (_button.type === 'button') {
				const _btn = new ButtonView(this.locale);
				_btn.label = "Poe";
				_btn.icon = cancelIcon;
				_btn.tooltip = true;
				_btn.withText = true;

				buttons.push(_btn);

				buttons.push( new ToolbarSeparatorView() );
				inc++;

				if (inc >5) {
					// buttons.push(new ToolbarLineBreakView() )
				}

			}

		}

		// console.info(itemDefinitions);
		// console.info(buttons);
		console.info(options);



		addToolbarToDropdown( dropdownView, buttons );
		// addToolbarToDropdown( dropdownView, buttons );

		// addListToDropdown( dropdownView, itemDefinitions, editor.ui.componentFactory );

		const toolbarView = dropdownView.toolbarView;

		// toolbarView.set( 'maxWidth', '250px' );

		return commands;
	}



	/**
	 * Creates a menu view from a set of options.
	 *
	 * @param {String} label
	 * @param {module:utils/locale~Locale} locale
	 * @returns {module:ui/dropdown/dropdownview~DropdownView}
	 * @private
	 */
	_createMenu( label, locale ) {
		const t = locale.t;

		const options = [
			{
				type: 'switchbutton',
				model: {
					commandName: 'setTableColumnHeader',
					label: t( 'Header column' ),
					bindIsOn: true
				}
			},
			{ type: 'separator' },
			{
				type: 'button',
				model: {
					commandName: 'insertColumnBefore',
					label: t( 'Insert column left' )
				}
			},
			{
				type: 'button',
				model: {
					commandName: 'insertColumnAfter',
					label: t( 'Insert column right' )
				}
			},
			{
				type: 'button',
				model: {
					commandName: 'removeColumn',
					label: t( 'Delete column' )
				}
			},
			{
				type: 'button',
				model: {
					commandName: 'selectTableColumn',
					label: t( 'Select column' )
				}
			},

			{ type: 'separator' },

			{
				type: 'button',
				model: {
					commandName: 'columnSizeCol',
					label: t( 'Select column col' )
				}
			},
			{
				type: 'button',
				model: {
					commandName: 'columnSize',
					commandParams: { name: 'sizeXS', value: 'col-1' },
					label: t( 'Select column xs-1' )
				}
			},
			{
				type: 'button',
				model: {
					commandName: 'columnSize',
					commandParams: { name: 'sizeXS', value: 'col-2' },
					label: t( 'Select column xs-2' )
				}
			},
			{
				type: 'button',
				model: {
					commandName: 'columnSize',
					commandParams: { name: 'sizeXS', value: 'col-3' },
					label: t( 'Select column xs-3' )
				}
			},
			{
				type: 'button',
				model: {
					commandName: 'columnSize',
					commandParams: { name: 'sizeXS', value: 'col-4' },
					label: t( 'Select column xs-4' )
				}
			},
			{
				type: 'button',
				model: {
					commandName: 'columnSize',
					commandParams: { name: 'sizeXS', value: 'col-5' },
					label: t( 'Select column xs-5' )
				}
			},
			{
				type: 'button',
				model: {
					commandName: 'columnSize',
					commandParams: { name: 'sizeXS', value: 'col-6' },
					label: t( 'Select column xs-6' )
				}
			},
			{
				type: 'button',
				model: {
					commandName: 'columnSize',
					commandParams: { name: 'sizeXS', value: 'col-7' },
					label: t( 'Select column xs-7' )
				}
			},
			{
				type: 'button',
				model: {
					commandName: 'columnSize',
					commandParams: { name: 'sizeXS', value: 'col-8' },
					label: t( 'Select column xs-8' )
				}
			},
			{
				type: 'button',
				model: {
					commandName: 'columnSize',
					commandParams: { name: 'sizeXS', value: 'col-9' },
					label: t( 'Select column xs-9' )
				}
			},
			{
				type: 'button',
				model: {
					commandName: 'columnSize',
					commandParams: { name: 'sizeXS', value: 'col-10' },
					label: t( 'Select column xs-10' )
				}
			},
			{
				type: 'button',
				model: {
					commandName: 'columnSize',
					commandParams: { name: 'sizeXS', value: 'col-11' },
					label: t( 'Select column xs-11' )
				}
			},
			{
				type: 'button',
				model: {
					commandName: 'columnSize',
					commandParams: { name: 'sizeXS', value: 'col-12' },
					label: t( 'Select column xs-12' )
				}
			},
			{
				type: 'button',
				model: {
					commandName: 'columnSize',
					commandParams: { name: 'sizeXS', value: null },
					label: t( 'Remove column XS' )
				}
			},
			{
				type: 'button',
				model: {
					commandName: 'columnSizeColSM',
					label: t( 'Select column col-sm' )
				}
			},
		];

		return this._createDropdown( label, tableColumnIcon, options );
	}

}

// Adds an option to a list view.
//
// @param {module:table/tableui~DropdownOption} option A configuration option.
// @param {module:core/editor/editor~Editor} editor
// @param {Array.<module:core/command~Command>} commands The list of commands to update.
// @param {Iterable.<module:ui/dropdown/utils~ListDropdownItemDefinition>} itemDefinitions
// A collection of dropdown items to update with the given option.
function addListOption( option, editor, commands, itemDefinitions ) {
	const model = option.model = new Model( option.model );
	const { commandName, bindIsOn } = option.model;

	if ( option.type === 'button' || option.type === 'switchbutton' ) {
		const command = editor.commands.get( commandName );

		commands.push( command );

		model.set( { commandName } );

		model.bind( 'isEnabled' ).to( command );

		if ( bindIsOn ) {
			model.bind( 'isOn' ).to( command, 'value' );
		}
	}

	model.set( {
		withText: true
	} );

	itemDefinitions.add( option );
}
