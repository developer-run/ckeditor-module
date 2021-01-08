import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ContextualBalloon from "@ckeditor/ckeditor5-ui/src/panel/balloon/contextualballoon";
import ClickObserver from "@ckeditor/ckeditor5-engine/src/view/observer/clickobserver";
import ButtonView from "@ckeditor/ckeditor5-ui/src/button/buttonview";
import linkIcon from "../../../../packages/ckeditor5-link/theme/icons/link.svg";
import ColActionsView from "./ui/colactionsview";
import clickOutsideHandler from "@ckeditor/ckeditor5-ui/src/bindings/clickoutsidehandler";
import {isColElement} from "./utils";
import tableColumnIcon from "../../../../packages/ckeditor5-table/theme/icons/table-column.svg";

const linkKeystroke = 'Ctrl+D';


export default class ColUI extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ContextualBalloon];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'ColUI';
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;

		const columnSizes = editor.config.get( 'column.sizes' );
		const columnOrders = editor.config.get( 'column.orders' );
		const columnOffsets = editor.config.get( 'column.offsets' );


		// console.log('sizes', columnSizes);
		// console.log('offsets', columnOffsets);

		editor.editing.view.addObserver( ClickObserver );


		/**
		 * The actions view displayed inside of the balloon.
		 *
		 * @member {module:link/ui/linkactionsview~LinkActionsView}
		 */
		this.actionsView = this._createActionsView();


		/**
		 * The contextual balloon plugin instance.
		 *
		 * @private
		 * @member {module:ui/panel/balloon/contextualballoon~ContextualBalloon}
		 */
		this._balloon = editor.plugins.get( ContextualBalloon );

		// Create toolbar buttons.
		// this._createToolbar();


		// this._balloon.showStack( 'main' );



		// Attach lifecycle actions to the the balloon.
		this._enableUserBalloonInteractions();

		// console.log("jsme tu ", this._balloon );

	}


	/**
	 * Creates a toolbar Link button. Clicking this button will show
	 * a {@link #_balloon} attached to the selection.
	 *
	 * @private
	 */
	_createToolbar() {
		const editor = this.editor;
		const linkCommand = editor.commands.get( 'removeColumn' );
		const t = editor.t;

		// Handle the `Ctrl+K` keystroke and show the panel.
		editor.keystrokes.set( linkKeystroke, ( keyEvtData, cancel ) => {
			// Prevent focusing the search bar in FF, Chrome and Edge. See https://github.com/ckeditor/ckeditor5/issues/4811.
			cancel();

			this._showUI( true );
		} );



		// editor.ui.componentFactory.add( 'removeColumn', locale => {
		// 	const button = new ButtonView( locale );
		//
		// 	button.isEnabled = true;
		// 	button.label = t( 'Remove' );
		// 	button.icon = linkIcon;
		// 	button.keystroke = linkKeystroke;
		// 	button.tooltip = true;
		// 	button.isToggleable = true;
		//
		// 	// Bind button to the command.
		// 	button.bind( 'isEnabled' ).to( linkCommand, 'isEnabled' );
		// 	button.bind( 'isOn' ).to( linkCommand, 'value', value => !!value );
		//
		// 	// Show the panel on button click.
		// 	// this.listenTo( button, 'execute', () => this._showUI( true ) );
		// 	// this.listenTo( button, 'execute', () => this._hideUI() );
		// 	this.listenTo( button, 'execute', () => console.log("Messaga") );
		//
		// 	return button;
		// } );
	}


	_createActionsView() {
		const editor = this.editor;
		const actionsView = new ColActionsView( editor );
		const linkCommand = editor.commands.get( 'removeColumn' );
		// const unlinkCommand = editor.commands.get( 'unlink' );

		console.log(linkCommand);

		// this.listenTo( actionsView.cancelButtonView, 'execute', () => linkCommand);
		this.listenTo( actionsView.cancelButtonView, 'execute', () => editor.execute( 'removeColumn' ));
		this.listenTo( actionsView.insertBeforeButtonView, 'execute', () => editor.execute( 'insertColumnBefore' ));
		this.listenTo( actionsView.insertAfterButtonView, 'execute', () => editor.execute( 'insertColumnAfter' ));
		// this.listenTo( actionsView.cancelButtonView, 'execute', () => console.log("řádek 121"));

		// this.listenTo( actionsView.cancelButtonView, 'execute', () => {
		// 	this._hideUI();
		// });

		// actionsView.cancelButtonView.listenTo()


		// actionsView.bind( 'href' ).to( linkCommand, 'value' );
		// actionsView.editButtonView.bind( 'isEnabled' ).to( linkCommand );
		// actionsView.unlinkButtonView.bind( 'isEnabled' ).to( unlinkCommand );
		//
		// // Execute unlink command after clicking on the "Edit" button.
		// this.listenTo( actionsView, 'edit', () => {
		// 	this._addFormView();
		// } );
		//
		// // Execute unlink command after clicking on the "Unlink" button.
		// this.listenTo( actionsView, 'unlink', () => {
		// 	editor.execute( 'unlink' );
		// 	this._hideUI();
		// } );
		//
		// Close the panel on esc key press when the **actions have focus**.
		actionsView.keystrokes.set( 'Esc', ( data, cancel ) => {
			this._hideUI();
			cancel();
		} );

		// // Open the form view on Ctrl+K when the **actions have focus**..
		// actionsView.keystrokes.set( linkKeystroke, ( data, cancel ) => {
		// 	this._addFormView();
		// 	cancel();
		// } );

		return actionsView;
	}




	/**
	 * Attaches actions that control whether the balloon panel containing the
	 * {@link #formView} is visible or not.
	 *
	 * @private
	 */
	_enableUserBalloonInteractions() {
		const viewDocument = this.editor.editing.view.document;

		// Handle click on view document and show panel when selection is placed inside the link element.
		// Keep panel open until selection will be inside the same link element.
		this.listenTo( viewDocument, 'click', () => {
			const parentCol = this._getSelectedColElement();

			if ( parentCol ) {
				// Then show panel but keep focus inside editor editable.
				this._showUI();
			}
		} );


		// Focus the form if the balloon is visible and the Tab key has been pressed.
		this.editor.keystrokes.set( 'Tab', ( data, cancel ) => {
			if ( this._areActionsVisible && !this.actionsView.focusTracker.isFocused ) {
				this.actionsView.focus();
				cancel();
			}
		}, {
			// Use the high priority because the link UI navigation is more important
			// than other feature's actions, e.g. list indentation.
			// https://github.com/ckeditor/ckeditor5-link/issues/146
			priority: 'high'
		} );


		// Close the panel on the Esc key press when the editable has focus and the balloon is visible.
		this.editor.keystrokes.set( 'Esc', ( data, cancel ) => {
			if ( this._isUIVisible ) {
				this._hideUI();
				cancel();
			}
		} );


		// Close on click outside of balloon panel element.
		clickOutsideHandler( {
			emitter: this.actionsView,
			activator: () => this._isUIInPanel,
			contextElements: [ this._balloon.view.element ],
			callback: () => this._hideUI()
		} );
	}


	/**
	 * Adds the {@link #actionsView} to the {@link #_balloon}.
	 *
	 * @protected
	 */
	_addActionsView() {
		if ( this._areActionsInPanel ) {
			return;
		}

		this._balloon.add( {
			view: this.actionsView,
			position: this._getBalloonPositionData()
		} );
	}




	/**
	 * Shows the correct UI type. It is either {@link #formView} or {@link #actionsView}.
	 *
	 * @param {Boolean} forceVisible
	 * @private
	 */
	_showUI( forceVisible = false ) {
		// When there's no link under the selection, go straight to the editing UI.
		if ( !this._getSelectedColElement() ) {
			this._addActionsView();

			// Be sure panel with link is visible.
			if ( forceVisible ) {
				this._balloon.showStack( 'main' );
			}

			// this._addFormView();
		}
		// If there's a link under the selection...
		else {
			// Go to the editing UI if actions are already visible.
			if ( !this._areActionsVisible ) {
				this._addActionsView();
			}

			// Be sure panel with link is visible.
			if ( forceVisible ) {
				this._balloon.showStack( 'main' );
			}
		}

		// Begin responding to ui#update once the UI is added.
		this._startUpdatingUI();
	}

	/**
	 * Removes the {@link #formView} from the {@link #_balloon}.
	 *
	 * See {@link #_addFormView}, {@link #_addActionsView}.
	 *
	 * @protected
	 */
	_hideUI() {
		if ( !this._isUIInPanel ) {
			return;
		}

		const editor = this.editor;

		this.stopListening( editor.ui, 'update' );
		this.stopListening( this._balloon, 'change:visibleView' );

		// Make sure the focus always gets back to the editable _before_ removing the focused form view.
		// Doing otherwise causes issues in some browsers. See https://github.com/ckeditor/ckeditor5-link/issues/193.
		editor.editing.view.focus();

		// Then remove the actions view because it's beneath the form.
		this._balloon.remove( this.actionsView );
	}


	/**
	 * Makes the UI react to the {@link module:core/editor/editorui~EditorUI#event:update} event to
	 * reposition itself when the editor UI should be refreshed.
	 *
	 * See: {@link #_hideUI} to learn when the UI stops reacting to the `update` event.
	 *
	 * @protected
	 */
	_startUpdatingUI() {
		const editor = this.editor;
		const viewDocument = editor.editing.view.document;

		let prevSelectedCol = this._getSelectedColElement();
		let prevSelectionParent = getSelectionParent();

		const update = () => {
			const selectedCol = this._getSelectedColElement();
			const selectionParent = getSelectionParent();

			// Hide the panel if:
			//
			// * the selection went out of the EXISTING link element. E.g. user moved the caret out
			//   of the link,
			// * the selection went to a different parent when creating a NEW link. E.g. someone
			//   else modified the document.
			// * the selection has expanded (e.g. displaying link actions then pressing SHIFT+Right arrow).
			//
			// Note: #_getSelectedLinkElement will return a link for a non-collapsed selection only
			// when fully selected.
			if ( ( prevSelectedCol && !selectedCol ) ||
				( !prevSelectedCol && selectionParent !== prevSelectionParent ) ) {
				this._hideUI();
			}
				// Update the position of the panel when:
				//  * link panel is in the visible stack
				//  * the selection remains in the original link element,
			//  * there was no link element in the first place, i.e. creating a new link
			else if ( this._isUIVisible ) {
				// If still in a link element, simply update the position of the balloon.
				// If there was no link (e.g. inserting one), the balloon must be moved
				// to the new position in the editing view (a new native DOM range).
				this._balloon.updatePosition( this._getBalloonPositionData() );
			}

			prevSelectedCol = selectedCol;
			prevSelectionParent = selectionParent;
		};

		function getSelectionParent() {
			return viewDocument.selection.focus.getAncestors()
				.reverse()
				.find( node => node.is( 'element' ) );
		}

		this.listenTo( editor.ui, 'update', update );
		this.listenTo( this._balloon, 'change:visibleView', update );
	}




	/**
	 * Returns the link {@link module:engine/view/attributeelement~AttributeElement} under
	 * the {@link module:engine/view/document~Document editing view's} selection or `null`
	 * if there is none.
	 *
	 * **Note**: For a non–collapsed selection, the link element is only returned when **fully**
	 * selected and the **only** element within the selection boundaries.
	 *
	 * @private
	 * @returns {module:engine/view/attributeelement~AttributeElement|null}
	 */
	_getSelectedColElement() {
		const view = this.editor.editing.view;
		const selection = view.document.selection;

		if ( selection.isCollapsed ) {
			return findColElementAncestor( selection.getFirstPosition() );

		} else {
			// The range for fully selected link is usually anchored in adjacent text nodes.
			// Trim it to get closer to the actual link element.
			const range = selection.getFirstRange().getTrimmed();
			const startLink = findColElementAncestor( range.start );
			const endLink = findColElementAncestor( range.end );

			if ( !startLink || startLink !== endLink ) {
				return null;
			}

			// Check if the link element is fully selected.
			if ( view.createRangeIn( startLink ).getTrimmed().isEqual( range ) ) {
				return startLink;
			} else {
				return null;
			}
		}
	}


	/**
	 * Returns positioning options for the {@link #_balloon}. They control the way the balloon is attached
	 * to the target element or selection.
	 *
	 * If the selection is collapsed and inside a link element, the panel will be attached to the
	 * entire link element. Otherwise, it will be attached to the selection.
	 *
	 * @private
	 * @returns {module:utils/dom/position~Options}
	 */
	_getBalloonPositionData() {
		const view = this.editor.editing.view;
		const viewDocument = view.document;
		const targetCol = this._getSelectedColElement();

		const target = targetCol ?
			// When selection is inside link element, then attach panel to this element.
			view.domConverter.mapViewToDom( targetCol ) :
			// Otherwise attach panel to the selection.
			view.domConverter.viewRangeToDom( viewDocument.selection.getFirstRange() );

		return { target };
	}





	/**
	 * Returns `true` when {@link #actionsView} is in the {@link #_balloon}.
	 *
	 * @readonly
	 * @protected
	 * @type {Boolean}
	 */
	get _areActionsInPanel() {
		return this._balloon.hasView( this.actionsView );
	}


	/**
	 * Returns `true` when {@link #actionsView} is in the {@link #_balloon} and it is
	 * currently visible.
	 *
	 * @readonly
	 * @protected
	 * @type {Boolean}
	 */
	get _areActionsVisible() {
		return this._balloon.visibleView === this.actionsView;
	}


	/**
	 * Returns `true` when {@link #actionsView} is in the {@link #_balloon} and it is
	 * currently visible.
	 *
	 * @readonly
	 * @protected
	 * @type {Boolean}
	 */
	get _isUIVisible() {
		return this._areActionsVisible;
	}


	/**
	 * Returns `true` when {@link #actionsView} or {@link #formView} is in the {@link #_balloon}.
	 *
	 * @readonly
	 * @protected
	 * @type {Boolean}
	 */
	get _isUIInPanel() {
		return this._areActionsInPanel;
	}


}

// Returns a link element if there's one among the ancestors of the provided `Position`.
//
// @private
// @param {module:engine/view/position~Position} View position to analyze.
// @returns {module:engine/view/attributeelement~AttributeElement|null} Link element at the position or null.
function findColElementAncestor( position ) {
	// console.warn("Nedoděláno");
	// console.info("Nedoděláno");
	// console.error("Nedoděláno pokus 5");


	return position.getAncestors().find( ancestor => isColElement( ancestor ) );
}
